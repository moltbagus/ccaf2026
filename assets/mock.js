/* CCAF mock exam runner — timed, 60 questions, scored overall and per domain.
   Static and offline: no external requests, no credentials, nothing leaves the browser. */
(function () {
  'use strict';

  var esc = function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var fmt = function (s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>'); };
  var el = function (t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };

  var page = document.getElementById('mock');
  if (!page) return;
  var examId = page.getAttribute('data-exam');         // e.g. "1"
  var storeKey = 'ccaf.mock.v1.' + examId;

  var S = { started: 0, endsAt: 0, picks: {}, flags: {}, cur: 0, submitted: false, spent: 0, done: false };

  fetch('mocks/mock-' + examId + '.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (M) { boot(M); })
    .catch(function (e) {
      page.innerHTML = '<div class="err"><b>Could not load this exam.</b><br>mocks/mock-' + esc(examId) + '.json — ' + esc(e.message) +
        '<br><br>Run <code>node /home/colb/parse_mocks.mjs &amp;&amp; node /home/colb/build_ccaf_site.mjs</code></div>';
    });

  function boot(M) {
    var Q = M.questions || [];
    var timerId = null;
    document.getElementById('etitle').textContent = 'Mock Exam ' + M.exam;
    document.getElementById('esource').textContent = M.source || '';

    try {
      var saved = JSON.parse(localStorage.getItem(storeKey) || 'null');
      if (saved && saved.started) S = saved;
    } catch (e) {}
    var save = function () { try { localStorage.setItem(storeKey, JSON.stringify(S)); } catch (e) {} };

    function seal() { S.done = true; S.submitted = true; save(); }

    function startScreen() {
      var h = '<div class="start"><h2>Mock Exam ' + M.exam + '</h2>' +
        '<p>' + Q.length + ' questions, ' + M.minutes + ' minutes, scored overall and by domain. ' +
        'It mirrors the real sitting: no notes, no search, no assistant.</p><ul>' +
        '<li>The clock starts when you press begin and runs until you submit or it expires.</li>' +
        '<li>Questions marked <b>Select TWO</b> need both correct choices; a partial pick scores zero.</li>' +
        '<li>Answer everything — the real exam has no guessing penalty.</li>' +
        '<li>Your progress is saved in this browser, so a refresh does not lose it.</li></ul>' +
        '<button class="go" id="begin">Begin exam</button>' +
        (S.submitted ? ' <button class="go ghost" id="see">See last result</button>' : '') +
        '<div class="mt" style="margin-top:16px">' + esc(M.source || '') + '</div></div>';
      page.innerHTML = h;
      document.getElementById('begin').addEventListener('click', function () {
        S.started = 1; S.endsAt = Date.now() + M.minutes * 60000; S.picks = {}; S.flags = {};
        S.cur = 0; S.submitted = false; S.done = false; save(); render();
      });
      if (S.submitted) {
        document.getElementById('see').addEventListener('click', function () { S.submitted = false; finish(); });
      }
      setFooter(false);
    }

    function setFooter(on) {
      document.getElementById('prev').style.display = on ? '' : 'none';
      document.getElementById('next').style.display = on ? '' : 'none';
      document.getElementById('submit').style.display = on ? '' : 'none';
      document.getElementById('hint').style.display = on ? '' : 'none';
    }

    function remaining() { return Math.max(0, S.endsAt - Date.now()); }
    function clock(ms) {
      var t = Math.floor(ms / 1000), m = Math.floor(t / 60), s = t % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    }
    function tick() {
      var ms = remaining();
      var e = document.getElementById('timer');
      if (!e) return;
      e.textContent = clock(ms);
      e.className = 'timer' + (ms < 5 * 60000 ? ' low' : '');
      if (ms <= 0) { clearInterval(timerId); timerId = null; seal(); finish(); }
    }

    function answeredCount() { return Object.keys(S.picks).filter(function (k) { return S.picks[k] && S.picks[k].length; }).length; }

    function render() {
      if (!S.started) return startScreen();
      if (S.submitted) return finish();
      var q = Q[S.cur];
      var pick = S.picks[S.cur] || [];
      page.innerHTML = '';
      var box = el('div', 'q');
      var tags = el('div', 'tagrow');
      tags.appendChild(el('span', 'badge', 'Question ' + q.n + ' of ' + Q.length));
      tags.appendChild(el('span', 'badge dom', esc(q.domain === '?' ? 'cross-domain' : q.domain)));
      if (q.multi) tags.appendChild(el('span', 'badge multi', 'Select TWO'));
      if (q.scenario) tags.appendChild(el('span', 'badge', esc(q.scenario)));
      box.appendChild(tags);
      box.appendChild(el('p', 'stem', fmt(q.stem)));

      var ul = el('ul', 'opts');
      q.options.forEach(function (opt, i) {
        var li = el('li');
        var b = el('button');
        b.type = 'button';
        if (pick.indexOf(i) >= 0) b.classList.add('sel');
        b.innerHTML = '<span class="ltr">' + 'ABCD'[i] + '</span><span>' + fmt(opt) + '</span>';
        b.addEventListener('click', function () { choose(i); });
        li.appendChild(b); ul.appendChild(li);
      });
      box.appendChild(ul);

      var fl = el('div', 'flag');
      var fb = el('button', S.flags[S.cur] ? 'on' : '', S.flags[S.cur] ? 'Flagged for review' : 'Flag for review');
      fb.type = 'button';
      fb.addEventListener('click', function () { S.flags[S.cur] = !S.flags[S.cur]; save(); render(); });
      fl.appendChild(fb);
      fl.appendChild(el('span', 'note', pick.length ? 'Your pick: ' + pick.map(function (i) { return 'ABCD'[i]; }).join(', ') : 'Not answered yet'));
      box.appendChild(fl);
      page.appendChild(box);

      var g = el('div', 'grid');
      Q.forEach(function (_, i) {
        var b = el('button', '', String(i + 1));
        b.type = 'button';
        var p = S.picks[i];
        if (p && p.length) b.classList.add('done');
        if (S.flags[i]) b.classList.add('flagged');
        if (i === S.cur) b.classList.add('cur');
        b.addEventListener('click', function () { S.cur = i; save(); render(); });
        g.appendChild(b);
      });
      page.appendChild(g);

      document.getElementById('pos').textContent = 'Answered ' + answeredCount() + ' of ' + Q.length;
      document.getElementById('fill').style.width = (answeredCount() / Q.length * 100) + '%';
      document.getElementById('prev').disabled = S.cur === 0;
      document.getElementById('next').disabled = S.cur === Q.length - 1;
      document.getElementById('submit').textContent = answeredCount() === Q.length ? 'Submit exam' : 'Submit (' + answeredCount() + '/' + Q.length + ')';
      if (timerId == null) { timerId = setInterval(tick, 1000); tick(); }
    }

    function choose(i) {
      var q = Q[S.cur];
      if (q.multi) {
        var p = (S.picks[S.cur] || []).slice();
        var at = p.indexOf(i);
        if (at >= 0) p.splice(at, 1); else p.push(i);
        S.picks[S.cur] = p.sort();
      } else {
        S.picks[S.cur] = [i];
      }
      save(); render();
    }

    function score() {
      var byDomain = {}, rows = [], right = 0;
      Q.forEach(function (q, i) {
        var p = (S.picks[i] || []).slice().sort();
        var a = q.answer.slice().sort();
        var ok = p.length === a.length && p.every(function (v, k) { return v === a[k]; });
        var dom = q.domain && q.domain !== '?' ? q.domain : 'other';
        var d = byDomain[dom] || (byDomain[dom] = { n: 0, ok: 0 });
        d.n++; if (ok) { d.ok++; right++; }
        if (!ok) rows.push({ q: q, i: i, picked: p, dom: dom });
      });
      return { right: right, total: Q.length, byDomain: byDomain, rows: rows };
    }

    function finish() {
      var r = score();
      S.spent = S.spent || Math.min(M.minutes * 60000, Date.now() - (S.endsAt - M.minutes * 60000));
      var pct = Math.round(r.right / r.total * 100);
      var band = pct >= 83 ? 'Likely in good shape — do a final skim of the recall cards and book it.'
        : pct >= 67 ? 'Solid, but review your weakest domains before scheduling.'
        : 'Not ready yet — re-run the tutor lessons on the weak domains, then drill those banks.';
      var h = '<div class="res"><div class="hero"><div class="big">' + pct + '%</div>' +
        '<div class="sub">' + r.right + ' of ' + r.total + ' correct' +
        (S.spent ? ' · ' + clock(S.spent) + ' used' : '') + '</div></div>' +
        '<div class="verdict">' + band + '</div>';

      h += '<table><tr><th>Domain</th><th>Correct</th><th>Score</th></tr>';
      Object.keys(r.byDomain).sort().forEach(function (k) {
        var d = r.byDomain[k], p2 = Math.round(d.ok / d.n * 100);
        h += '<tr><td>' + esc(k === 'other' ? 'cross-domain / untagged' : k) + '</td><td class="n">' + d.ok + ' / ' + d.n +
          '</td><td class="n">' + p2 + '%</td></tr>';
      });
      h += '</table>';

      if (r.rows.length) {
        h += '<details class="review" open><summary>' + r.rows.length + ' question' + (r.rows.length === 1 ? '' : 's') + ' to review</summary>';
        r.rows.forEach(function (x) {
          h += '<div class="rq"><div class="h"><span class="badge">Q' + x.q.n + '</span>' +
            '<span class="badge dom">' + esc(x.dom) + '</span>' +
            (x.q.multi ? '<span class="badge multi">Select TWO</span>' : '') +
            '<span class="badge">' + (x.picked.length ? 'you picked ' + x.picked.map(function (i) { return 'ABCD'[i]; }).join(', ') : 'no answer') + '</span></div>' +
            '<p class="stem">' + fmt(x.q.stem) + '</p>';
          x.q.options.forEach(function (o, oi) {
            var cls = x.q.answer.indexOf(oi) >= 0 ? 'right' : (x.picked.indexOf(oi) >= 0 ? 'picked-wrong' : '');
            h += '<div class="opt ' + cls + '">' + 'ABCD'[oi] + ') ' + fmt(o) + '</div>';
          });
          if (x.q.why) h += '<div class="why"><b>Why</b>' + fmt(x.q.why) + '</div>';
          h += '</div>';
        });
        h += '</details>';
      } else {
        h += '<div class="verdict">Perfect run. Nothing to review.</div>';
      }
      h += '<div style="margin-top:20px"><button class="go ghost" id="again">Retake this exam</button> ' +
        '<a class="go ghost" href="mocks.html" style="text-decoration:none;display:inline-block">All exams</a> ' +
        '<a class="go ghost" href="progress.html" style="text-decoration:none;display:inline-block">Log it in the tracker</a></div></div>';
      page.innerHTML = h;
      document.getElementById('pos').textContent = 'Complete';
      document.getElementById('fill').style.width = '100%';
      setFooter(false);
      document.getElementById('again').addEventListener('click', function () {
        S = { started: 0, endsAt: 0, picks: {}, flags: {}, cur: 0, submitted: false, spent: 0, done: false };
        localStorage.removeItem(storeKey); startScreen();
      });
      try {
        localStorage.setItem('ccaf.mock.last', JSON.stringify({
          exam: M.exam, right: r.right, total: r.total, pct: pct,
          byDomain: r.byDomain, at: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }));
      } catch (e) {}
    }

    document.getElementById('prev').addEventListener('click', function () { if (S.cur > 0) { S.cur--; save(); render(); } });
    document.getElementById('next').addEventListener('click', function () { if (S.cur < Q.length - 1) { S.cur++; save(); render(); } });
    document.getElementById('submit').addEventListener('click', function () {
      var left = Q.length - answeredCount();
      if (left && !window.confirm(left + ' question(s) still unanswered. Submit anyway?')) return;
      if (timerId) { clearInterval(timerId); timerId = null; }
      S.spent = Math.min(M.minutes * 60000, Date.now() - (S.endsAt - M.minutes * 60000));
      seal(); finish();
    });
    document.addEventListener('keydown', function (e) {
      if (!S.started || S.submitted) return;
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      var q = Q[S.cur];
      if (/^[1-4]$/.test(e.key)) { if (q.options[+e.key - 1] != null) choose(+e.key - 1); }
      else if (e.key === 'ArrowRight') { if (S.cur < Q.length - 1) { S.cur++; save(); render(); } }
      else if (e.key === 'ArrowLeft') { if (S.cur > 0) { S.cur--; save(); render(); } }
    });

    if (S.started && !S.submitted && remaining() > 0) { render(); tick(); } else { startScreen(); }
  }
})();