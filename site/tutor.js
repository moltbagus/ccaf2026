/* CCAF interactive tutor — stepper engine + inline SVG diagram library.
   Static, offline, no external requests, no credentials of any kind. */
(function () {
  'use strict';

  /* ---------- small helpers ---------- */
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };
  // escape, then turn `code` into code spans
  var fmt = function (s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ---------- SVG primitives (coordinate space 760 wide) ---------- */
  var F = 'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif';
  var MONO = 'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';

  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.anchor || 'start') +
      '" font-size="' + (o.size || 13) + '" fill="' + (o.fill || 'var(--fg)') +
      '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') +
      (o.mono ? ' style="' + MONO + '"' : ' style="' + F + '"') + '>' + esc(s) + '</text>';
  }
  function box(x, y, w, h, lines, o) {
    o = o || {};
    var stroke = o.stroke || 'var(--line)';
    var fill = o.fill || 'var(--bg)';
    var g = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx || 9) +
      '" fill="' + fill + '" stroke="' + stroke + '"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + '/>';
    var arr = Array.isArray(lines) ? lines : [lines];
    var lh = o.lh || 16;
    var startY = y + h / 2 - ((arr.length - 1) * lh) / 2 + 4.5;
    for (var i = 0; i < arr.length; i++) {
      g += txt(x + w / 2, startY + i * lh, arr[i], {
        anchor: 'middle', size: o.size || 12.5, weight: (o.weight && i === 0) ? 600 : null,
        fill: o.tcolor || 'var(--fg)', mono: o.mono
      });
    }
    return g;
  }
  function dia(cx, cy, w, h, lines, o) {
    o = o || {};
    var p = [[cx, cy - h / 2], [cx + w / 2, cy], [cx, cy + h / 2], [cx - w / 2, cy]]
      .map(function (q) { return q[0] + ',' + q[1]; }).join(' ');
    var g = '<polygon points="' + p + '" fill="' + (o.fill || 'var(--card)') + '" stroke="' +
      (o.stroke || 'var(--acc)') + '"/>';
    var arr = Array.isArray(lines) ? lines : [lines];
    var startY = cy - ((arr.length - 1) * 15) / 2 + 4.5;
    for (var i = 0; i < arr.length; i++) {
      g += txt(cx, startY + i * 15, arr[i], { anchor: 'middle', size: 12, weight: 600 });
    }
    return g;
  }
  // straight or elbow arrow
  function arw(x1, y1, x2, y2, o) {
    o = o || {};
    var d, id = 'ah' + Math.random().toString(36).slice(2, 8);
    if (o.elbow === 'h') { // horizontal, then vertical
      var mx = o.mx != null ? o.mx : (x1 + x2) / 2;
      d = 'M' + x1 + ' ' + y1 + ' H' + mx + ' V' + y2 + ' H' + x2;
    } else if (o.elbow === 'v') {
      var my = o.my != null ? o.my : (y1 + y2) / 2;
      d = 'M' + x1 + ' ' + y1 + ' V' + my + ' H' + x2 + ' V' + y2;
    } else if (o.curve) {
      d = 'M' + x1 + ' ' + y1 + ' C' + (x1 + o.curve) + ' ' + y1 + ' ' + (x2 - o.curve) + ' ' + y2 + ' ' + x2 + ' ' + y2;
    } else {
      d = 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2;
    }
    var col = o.stroke || 'var(--mut)';
    var s = '<defs><marker id="' + id + '" markerWidth="9" markerHeight="9" refX="7.5" refY="3.2" orient="auto">' +
      '<path d="M0 0 L8 3.2 L0 6.4 z" fill="' + col + '"/></marker></defs>' +
      '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (o.w || 1.5) + '"' +
      (o.dash ? ' stroke-dasharray="5 4"' : '') + ' marker-end="url(#' + id + ')"/>';
    if (o.label) {
      var lx = o.lx != null ? o.lx : (x1 + x2) / 2;
      var ly = o.ly != null ? o.ly : (y1 + y2) / 2 - 5;
      s += '<rect x="' + (lx - o.label.length * 3.2 - 4) + '" y="' + (ly - 12) + '" width="' +
        (o.label.length * 6.4 + 8) + '" height="16" rx="4" fill="var(--bg)" opacity=".92"/>' +
        txt(lx, ly, o.label, { anchor: 'middle', size: 11, fill: 'var(--acc)', weight: 600 });
    }
    return s;
  }
  function svg(h, inner, cap) {
    return '<svg viewBox="0 0 760 ' + h + '" role="img" aria-label="' + esc(cap || 'diagram') + '">' + inner + '</svg>';
  }

  /* ---------- diagram library ---------- */
  var D = {};

  D['agentic-loop'] = function () {
    var s = '';
    s += box(40, 26, 300, 52, ['Send request + tool definitions'], { weight: 1 });
    s += box(40, 120, 300, 52, ['Model responds with stop_reason'], { weight: 1 });
    s += arw(190, 78, 190, 118);
    s += dia(190, 246, 300, 96, ['stop_reason?']);
    s += arw(190, 172, 190, 198);
    s += txt(196, 190, 'inspect the field, not the prose', { size: 11.5, fill: 'var(--mut)' });
    s += box(430, 218, 290, 56, ['Execute tools, append tool_result'], { weight: 1 });
    s += arw(340, 246, 428, 246, { label: 'tool_use', lx: 385, ly: 238 });
    s += box(430, 118, 290, 56, ['Return the final answer'], { weight: 1 });
    s += arw(340, 232, 400, 225, { elbow: 'h', mx: 372, dash: 1, ly: 300 });
    s += arw(575, 218, 575, 176, { label: 'end_turn', lx: 575, ly: 199 });
    // loop back edge
    s += '<path d="M430 246 H376 V146 H344" fill="none" stroke="var(--acc)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#lb)"/>';
    s += '<defs><marker id="lb" markerWidth="9" markerHeight="9" refX="7.5" refY="3.2" orient="auto"><path d="M0 0 L8 3.2 L0 6.4 z" fill="var(--acc)"/></marker></defs>';
    s += txt(392, 210, 'loop back', { size: 11, fill: 'var(--acc)', weight: 600 });
    s += txt(20, 316, 'An iteration cap is a safety net, never the stopping mechanism.', { size: 12, fill: 'var(--mut)' });
    return svg(330, s, 'Agentic loop driven by stop_reason');
  };

  D['hook-gate'] = function () {
    var s = '';
    s += box(30, 130, 150, 56, ['Model', 'requests a tool call'], { weight: 1 });
    s += arw(180, 158, 236, 158);
    s += box(240, 118, 190, 80, ['PreToolUse hook', 'programmatic gate'], { weight: 1, stroke: 'var(--acc)' });
    s += arw(430, 158, 486, 158, { label: 'allowed', lx: 458, ly: 150 });
    s += box(490, 130, 150, 56, ['Tool executes'], { weight: 1 });
    s += arw(640, 158, 700, 158);
    s += box(560, 30, 180, 52, ['PostToolUse', 'normalize output'], { weight: 1, stroke: 'var(--acc)' });
    s += arw(565, 56, 565, 128, { elbow: 'v', my: 90, dash: 1 });
    s += arw(335, 198, 335, 252);
    s += box(215, 254, 240, 56, ['Blocked: corrective message', 'returned to the model'], { weight: 1, stroke: 'var(--bad)', tcolor: 'var(--bad)' });
    s += arw(240, 158, 210, 282, { elbow: 'h', mx: 222 });
    s += txt(437, 274, 'denied path', { size: 11, fill: 'var(--bad)', weight: 600 });
    s += txt(30, 318, 'Prompt wording is probabilistic. A hook cannot be argued with.', { size: 12, fill: 'var(--mut)' });
    return svg(330, s, 'Programmatic prerequisite gate around a tool call');
  };

  D['hub-spoke'] = function () {
    var s = '';
    s += box(305, 128, 150, 62, ['Coordinator', 'hub'], { weight: 1, stroke: 'var(--acc)' });
    var agents = [
      [40, 30, 'Research agent', 'web + docs'],
      [560, 30, 'Document analyst', 'file contents'],
      [560, 232, 'Synthesis agent', 'verify_fact only'],
      [40, 232, 'Report generator', 'assembles output']
    ];
    for (var i = 0; i < agents.length; i++) {
      var a = agents[i];
      s += box(a[0], a[1], 160, 58, [a[2], a[3]], { weight: 1 });
      var cx = a[0] + 80, cy = a[1] + 29;
      s += arw(380, 159, cx, cy, { elbow: 'v', my: cy < 159 ? 100 : 218, dash: 1 });
      s += arw(cx + 34, cy, 380, 159, { elbow: 'v', my: cy < 159 ? 118 : 200 });
    }
    s += txt(380, 300, 'Subagents return to the coordinator — they never message each other.', { anchor: 'middle', size: 12, fill: 'var(--mut)' });
    s += txt(380, 318, 'Results plus structured errors, so partial failure stays visible.', { anchor: 'middle', size: 12, fill: 'var(--mut)' });
    return svg(330, s, 'Hub and spoke coordinator with isolated subagents');
  };

  D['context-window'] = function () {
    var s = '';
    s += '<rect x="40" y="24" width="380" height="272" rx="11" fill="var(--bg)" stroke="var(--line)"/>';
    var bands = [
      [38, 34, 'Case facts block', 'exact amounts, IDs, dates — verbatim', 'var(--acc)'],
      [96, 62, 'Active thread', 'full history, nothing dropped', 'var(--fg)'],
      [172, 62, 'Resolved threads', 'summarized, not deleted', 'var(--mut)'],
      [248, 38, 'Tool results', 'trimmed to relevant fields', 'var(--mut)']
    ];
    for (var i = 0; i < bands.length; i++) {
      var b = bands[i];
      s += '<rect x="52" y="' + b[0] + '" width="356" height="' + b[1] + '" rx="7" fill="var(--card)" stroke="' + b[3] + '"' + (i === 3 ? ' stroke-dasharray="5 4"' : '') + '/>';
      s += txt(64, b[0] + 20, b[2], { size: 13, weight: 600 });
      s += txt(64, b[0] + 37, b[3], { size: 11.5, fill: 'var(--mut)' });
    }
    s += txt(230, 314, 'context window', { anchor: 'middle', size: 12, fill: 'var(--mut)' });
    s += '<rect x="470" y="24" width="250" height="272" rx="11" fill="var(--card)" stroke="var(--line)"/>';
    s += txt(595, 50, 'attention curve', { anchor: 'middle', size: 12, fill: 'var(--mut)' });
    s += '<path d="M500 90 C540 110 650 110 690 90" fill="none" stroke="var(--acc)" stroke-width="2"/>';
    for (var k = 0; k < 3; k++) {
      s += '<rect x="' + (500 + k * 65) + '" y="150" width="60" height="' + (90 - k * 26) + '" rx="5" fill="var(--acc)" opacity="' + (0.85 - k * 0.3) + '"/>';
    }
    s += txt(530, 160, 'strong', { size: 11, fill: 'var(--fg)' });
    s += txt(640, 160, 'weak', { size: 11, fill: 'var(--mut)' });
    s += txt(595, 268, 'lost in the middle:', { anchor: 'middle', size: 12, weight: 600 });
    s += txt(595, 286, 'material buried mid-context', { anchor: 'middle', size: 11.5, fill: 'var(--mut)' });
    return svg(330, s, 'Context window layers and the lost in the middle effect');
  };

  D['escalation-tree'] = function () {
    var s = '';
    s += txt(30, 30, 'check in order — first match wins', { size: 12, fill: 'var(--mut)', weight: 600 });
    var rows = [
      ['Policy is silent on this case', 'Escalate with a structured handoff brief'],
      ['Customer explicitly asked for a human', 'Escalate now — do not talk them out of it'],
      ['Identity matched two or more records', 'Ask one disambiguating question, never guess'],
      ['A fix is already in hand', 'Offer to resolve, or hand off on request'],
      ['Nothing above matched', 'Resolve it — sentiment alone is not a trigger']
    ];
    for (var i = 0; i < rows.length; i++) {
      var y = 50 + i * 52;
      s += box(30, y, 300, 42, [rows[i][0]], { weight: 1, rx: 8 });
      s += arw(330, y + 21, 392, y + 21, { label: i === 4 ? 'else' : 'yes', lx: 361, ly: y + 14 });
      var last = i === 4;
      s += box(396, y, 334, 42, [rows[i][1]], {
        weight: 1, rx: 8, stroke: last ? 'var(--ok)' : 'var(--acc)',
        fill: last ? 'var(--okbg)' : 'var(--card)'
      });
    }
    s += txt(30, 322, 'Never escalate on sentiment. Never pick an account on a confidence score.', { size: 12, fill: 'var(--mut)' });
    return svg(334, s, 'Escalation decision tree');
  };

  D['batch-timeline'] = function () {
    var s = '';
    s += '<line x1="60" y1="150" x2="720" y2="150" stroke="var(--line)" stroke-width="2"/>';
    for (var h = 0; h <= 30; h += 4) {
      var x = 60 + (h / 30) * 660;
      s += '<line x1="' + x + '" y1="140" x2="' + x + '" y2="160" stroke="var(--mut)"/>';
      s += txt(x, 178, h + 'h', { anchor: 'middle', size: 11, fill: 'var(--mut)' });
    }
    s += '<rect x="' + (60 + (4 / 30) * 660) + '" y="96" width="' + ((24 / 30) * 660) + '" height="26" rx="6" fill="var(--card)" stroke="var(--acc)"/>';
    s += txt(60 + ((4 + 12) / 30) * 660, 114, 'batch processing window — up to 24h', { anchor: 'middle', size: 12, fill: 'var(--acc)', weight: 600 });
    s += '<line x1="720" y1="60" x2="720" y2="200" stroke="var(--bad)" stroke-width="2" stroke-dasharray="6 4"/>';
    s += txt(714, 52, '30h SLA', { anchor: 'end', size: 12, fill: 'var(--bad)', weight: 600 });
    s += arw(60, 132, 720, 132, { dash: 1, stroke: 'var(--ok)' });
    s += txt(390, 68, 'worst case: submit now, wait up to 4h, process up to 24h = 28h', { anchor: 'middle', size: 12, fill: 'var(--ok)', weight: 600 });
    s += txt(30, 220, 'Submit every 4h. Batch is for overnight or weekly work —', { size: 12.5, fill: 'var(--fg)' });
    s += txt(30, 238, 'anything blocking a merge goes to the synchronous API.', { size: 12.5, fill: 'var(--mut)' });
    s += txt(30, 264, 'No latency SLA. Results arrive out of order — match them by custom_id.', { size: 12, fill: 'var(--mut)' });
    return svg(280, s, 'Batch API processing window against a 30 hour SLA');
  };

  D['schema-contract'] = function () {
    var s = '';
    s += box(30, 128, 160, 58, ['tool_use call', 'from the model'], { weight: 1 });
    s += arw(190, 157, 246, 157);
    s += box(250, 118, 180, 78, ['input_schema', 'strict: true'], { weight: 1, stroke: 'var(--acc)' });
    s += arw(430, 157, 486, 157);
    s += dia(556, 157, 130, 88, ['valid', 'shape?']);
    s += arw(621, 137, 690, 110, { elbow: 'v', my: 118 });
    s += box(600, 44, 140, 52, ['Your semantic', 'validation'], { weight: 1 });
    s += arw(621, 177, 690, 210, { elbow: 'v', my: 198 });
    s += box(576, 212, 164, 56, ['Retry with validation', 'errors in context'], { weight: 1, stroke: 'var(--warn)', tcolor: 'var(--warn)' });
    s += arw(576, 240, 340, 240, { elbow: 'h', mx: 460, dash: 1, stroke: 'var(--warn)' });
    s += arw(340, 240, 340, 198, { stroke: 'var(--warn)' });
    s += txt(30, 292, 'strict covers syntax only. It cannot tell you a value is wrong —', { size: 12.5 });
    s += txt(30, 310, 'that is what the validation-retry loop is for.', { size: 12.5, fill: 'var(--mut)' });
    return svg(320, s, 'Structured output contract from tool_use through validation retry');
  };

  D['claude-md-hierarchy'] = function () {
    var s = '';
    var rows = [
      [40, 'Enterprise managed', 'admin-pushed, highest priority', 'var(--mut)'],
      [96, 'User — ~/.claude/CLAUDE.md', 'personal, not shared with the team', 'var(--mut)'],
      [152, 'Project — .claude/CLAUDE.md', 'committed to version control', 'var(--acc)'],
      [208, 'Directory — <subdir>/CLAUDE.md', 'loads on demand for that subtree', 'var(--fg)']
    ];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      s += box(40, r[0], 330, 48, [r[1]], { weight: 1, stroke: r[3], tcolor: r[3] });
      s += txt(56, r[0] + 34, r[2], { size: 11.5, fill: 'var(--mut)' });
    }
    s += arw(205, 88, 205, 94, { w: 1 });
    s += arw(205, 144, 205, 150, { w: 1 });
    s += arw(205, 200, 205, 206, { w: 1 });
    s += txt(30, 288, 'team standards belong in the project file — a personal file never reaches teammates', { size: 12, fill: 'var(--mut)' });
    s += box(410, 40, 320, 96, ['.claude/rules/*.md', 'path-scoped conventions via paths: globs', 'load only when relevant files are touched'], { weight: 1, stroke: 'var(--acc)' });
    s += box(410, 152, 320, 96, ['@import', 'split a monolithic CLAUDE.md', 'keeps every request from carrying 800 lines'], { weight: 1 });
    s += txt(430, 268, '/memory shows which files actually loaded', { size: 12, fill: 'var(--acc)', weight: 600 });
    s += txt(430, 288, 'use it to diagnose inconsistent behaviour', { size: 11.5, fill: 'var(--mut)' });
    return svg(304, s, 'CLAUDE.md hierarchy and modular composition');
  };

  D['wrapper-alias'] = function () {
    var s = '';
    s += box(30, 40, 220, 52, ['Original function name'], { weight: 1, stroke: 'var(--mut)', tcolor: 'var(--mut)' });
    s += arw(250, 66, 316, 66);
    s += box(320, 34, 200, 64, ['Wrapper module', 'exports an alias'], { weight: 1, stroke: 'var(--acc)' });
    s += arw(520, 66, 586, 66);
    s += box(590, 40, 150, 52, ['Callers import', 'the alias'], { weight: 1 });
    s += txt(30, 124, 'grep the original name only', { size: 12.5, weight: 600, fill: 'var(--bad)' });
    s += txt(30, 142, 'no hits — but the callers are right there', { size: 11.5, fill: 'var(--mut)' });
    var steps = [
      'Read the wrapper modules in the call path',
      'List every export and alias they expose',
      'Grep each alias to find the real callers'
    ];
    for (var i = 0; i < steps.length; i++) {
      var y = 172 + i * 44;
      s += '<circle cx="46" cy="' + (y + 14) + '" r="13" fill="var(--card)" stroke="var(--acc)"/>';
      s += txt(46, y + 19, String(i + 1), { anchor: 'middle', size: 13, weight: 700, fill: 'var(--acc)' });
      s += txt(72, y + 19, steps[i], { size: 13.5 });
    }
    return svg(300, s, 'Tracing callers through wrapper module aliases');
  };

  D['error-propagation'] = function () {
    var s = '';
    s += box(30, 120, 170, 62, ['Subagent hits', 'a failure'], { weight: 1 });
    s += arw(200, 151, 256, 151);
    s += box(260, 96, 230, 110, ['Structured error', 'isError · errorCategory', 'isRetryable · context', '+ partial results'], { weight: 1, stroke: 'var(--acc)', size: 12 });
    s += arw(490, 151, 546, 151);
    s += box(550, 106, 190, 90, ['Coordinator', 'retry · recover', '· escalate'], { weight: 1, stroke: 'var(--acc)' });
    s += txt(30, 218, 'A valid empty result is not a failure — never retry it, never escalate it.', { size: 12.5, fill: 'var(--ok)' });
    s += txt(30, 238, 'An access failure is different from no matches. Say which one happened.', { size: 12.5, fill: 'var(--mut)' });
    s += txt(30, 264, 'Silent suppression leaves the coordinator blind to partial failure;', { size: 12.5, fill: 'var(--mut)' });
    s += txt(30, 282, 'killing the whole run on one failure throws away the work that succeeded.', { size: 12.5, fill: 'var(--mut)' });
    return svg(300, s, 'Structured error propagation from subagent to coordinator');
  };

  /* ---------- engine ---------- */
  var page = document.getElementById('tutor');
  if (!page) return;
  var domainId = page.getAttribute('data-lesson');   // e.g. "d1"
  var storeKey = 'ccaf.lesson.v1.' + domainId;

  var S = { i: 0, answers: {}, right: 0, wrong: 0, traps: {}, done: false };
  try {
    var saved = JSON.parse(localStorage.getItem(storeKey) || 'null');
    if (saved && typeof saved.i === 'number') S = Object.assign(S, saved);
  } catch (e) { /* fresh start */ }

  var save = function () { try { localStorage.setItem(storeKey, JSON.stringify(S)); } catch (e) {} };

  fetch('/legons/' + domainId + '.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (L) { start(L); })
    .catch(function (e) {
      page.innerHTML = '<div class="err"><b>Could not load the lesson.</b><br>/legons/' + esc(domainId) +
        '.json — ' + esc(e.message) + '<br><br>Run <code>node /home/colb/build_ccaf_site.mjs</code> to refresh the site.</div>';
    });

  function start(L) {
    var steps = L.steps || [];
    document.getElementById('dtitle').textContent = L.title || domainId;
    document.getElementById('dweight').textContent = L.weight ? L.weight + ' of the exam' : '';
    document.getElementById('dgoal').textContent = L.goal || '';

    function render() {
      if (S.done || S.i >= steps.length) return finish(L, steps);
      var st = steps[S.i];
      var gate = st.kind === 'check' || st.kind === 'drill';
      var answered = S.answers[S.i] != null;

      page.innerHTML = '';
      var wrap = el('div', 'step');

      var badges = el('div', 'badges');
      badges.appendChild(el('span', 'badge task', 'Task ' + esc(st.task || '')));
      badges.appendChild(el('span', 'badge', esc(st.kind || 'teach')));
      if (gate) badges.appendChild(el('span', 'badge gate', 'answer to continue'));
      wrap.appendChild(badges);

      wrap.appendChild(el('h2', 'title', fmt(st.title)));
      if (st.inshort) {
        wrap.appendChild(el('div', 'blk inshort', '<b>In short</b><div>' + fmt(st.inshort) + '</div>'));
      }
      if (st.lead) wrap.appendChild(el('p', 'lead', fmt(st.lead)));

      if (st.points && st.points.length) {
        var ul = el('ul', 'points');
        st.points.forEach(function (p) { ul.appendChild(el('li', null, fmt(p))); });
        wrap.appendChild(ul);
      }
      if (st.code) wrap.appendChild(el('pre', null, '<code>' + esc(st.code) + '</code>'));

      if (st.diagram && D[st.diagram]) {
        var fig = el('figure', 'dia');
        fig.appendChild(el('div', 'diatitle', 'Diagram'));
        fig.innerHTML += D[st.diagram]();
        if (st.caption) fig.appendChild(el('figcaption', null, fmt(st.caption)));
        wrap.appendChild(fig);
      }

      if (st.why) wrap.appendChild(el('div', 'blk why', '<b>Why it works this way</b><div>' + fmt(st.why) + '</div>'));
      if (st.contrast) wrap.appendChild(el('div', 'blk contrast', '<b>The tempting alternative</b><div>' + fmt(st.contrast) + '</div>'));
      if (st.exam) wrap.appendChild(el('div', 'blk exam', '<b>What the exam tests</b><div>' + fmt(st.exam) + '</div>'));

      if (gate && st.ask) {
        var q = el('div', 'q');
        q.appendChild(el('p', 'qq', fmt(st.ask.q)));
        q.appendChild(el('div', 'prompt', 'Which approach is most effective?'));
        var ol = el('ul', 'opts');
        var letters = ['A', 'B', 'C', 'D'];
        st.ask.options.forEach(function (opt, idx) {
          var li = el('li');
          var b = el('button');
          b.type = 'button';
          b.innerHTML = '<span class="ltr">' + letters[idx] + '</span><span>' + fmt(opt) + '</span>';
          b.addEventListener('click', function () { pick(st, idx, buttons); });
          li.appendChild(b);
          ol.appendChild(li);
        });
        var buttons = ol.querySelectorAll('button');
        q.appendChild(ol);
        wrap.appendChild(q);

        if (answered) {
          lock(st, S.answers[S.i], buttons);
          q.appendChild(verdict(st, S.answers[S.i]));
        }
      }

      if (st.takeaway) {
        wrap.appendChild(el('div', 'takeaway', '<b>Remember</b>' + fmt(st.takeaway)));
      }
      page.appendChild(wrap);

      document.getElementById('pos').textContent = 'Step ' + (S.i + 1) + ' of ' + steps.length;
      document.getElementById('tcount').textContent = S.right + ' right · ' + S.wrong + ' wrong';
      document.getElementById('fill').style.width = ((S.i + (answered ? 1 : 0)) / steps.length * 100) + '%';
      var prev = document.getElementById('prev'), next = document.getElementById('next');
      prev.disabled = S.i === 0;
      next.disabled = gate && !answered;
      next.textContent = (S.i === steps.length - 1) ? 'Finish' : 'Next';
      next.className = (gate && !answered) ? '' : 'primary';
    }

    function pick(st, idx, buttons) {
      if (S.answers[S.i] != null) return;
      S.answers[S.i] = idx;
      var correct = idx === st.ask.answer;
      if (correct) S.right++; else {
        S.wrong++;
        var t = st.ask.trap || 'unknown';
        S.traps[t] = (S.traps[t] || 0) + 1;
      }
      save();
      lock(st, idx, buttons);
      var q = buttons[0].closest('.q');
      q.appendChild(verdict(st, idx));
      var next = document.getElementById('next');
      next.disabled = false;
      next.className = 'primary';
      document.getElementById('tcount').textContent = S.right + ' right · ' + S.wrong + ' wrong';
      document.getElementById('fill').style.width =
        ((S.i + 1) / steps.length * 100) + '%';
    }

    function lock(st, idx, buttons) {
      buttons.forEach(function (b, k) {
        b.disabled = true;
        if (k === st.ask.answer) b.classList.add(k === idx ? 'pick-right' : 'pick-miss');
        else if (k === idx) b.classList.add('pick-wrong');
      });
    }

    function verdict(st, idx) {
      var ok = idx === st.ask.answer;
      var letters = ['A', 'B', 'C', 'D'];
      var v = el('div', 'verdict ' + (ok ? 'right' : 'wrong'));
      v.appendChild(el('b', null, ok
        ? 'Correct — ' + letters[idx]
        : 'Not quite. The answer is ' + letters[st.ask.answer] + '.'));
      v.appendChild(el('div', null, fmt(st.ask.why)));
      if (st.ask.trap) v.appendChild(el('span', 'trap', 'trap type: ' + esc(st.ask.trap)));
      return v;
    }

    function finish(L, steps) {
      S.done = true; save();
      var gates = steps.filter(function (s) { return s.ask; }).length;
      var pct = (S.right + S.wrong) ? Math.round(S.right / (S.right + S.wrong) * 100) : 0;
      var traps = Object.keys(S.traps).sort(function (a, b) { return S.traps[b] - S.traps[a]; });
      var h = '<div class="done"><div class="big">' + pct + '%</div>' +
        '<div class="recap"><div class="score">' + S.right + ' / ' + (S.right + S.wrong) + '</div>' +
        '<div class="sub">interactive questions answered correctly in ' + esc(L.title) + '</div>';
      if (gates) {
        h += '<div class="sub" style="margin-top:8px">' + gates + ' gates in this lesson</div>';
      }
      if (traps.length) {
        h += '<div style="margin-top:14px;text-align:left"><b style="font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut)">Traps you fell for</b>';
        traps.forEach(function (t) { h += '<div class="traprow">' + esc(t) + '<span class="m">×' + S.traps[t] + '</span></div>'; });
        h += '</div>';
      } else if (S.right + S.wrong) {
        h += '<div class="sub" style="margin-top:10px;color:var(--ok)">No traps triggered. Clean run.</div>';
      }
      h += '</div><div style="margin-top:22px">' +
        '<a class="linkbtn" href="bank-' + esc(domainId) + '.html">Drill the 20-question bank</a> ' +
        '<a class="linkbtn" href="' + esc(domainId) + '.html">Read the master note</a> ' +
        '<a class="linkbtn" href="index.html">Back to the syllabus</a></div>' +
        '<div style="margin-top:18px"><button id="again" class="linkbtn" style="cursor:pointer">Restart this lesson</button></div></div>';
      page.innerHTML = h;
      document.getElementById('pos').textContent = 'Complete';
      document.getElementById('fill').style.width = '100%';
      document.getElementById('next').disabled = true;
      document.getElementById('next').textContent = 'Done';
      document.getElementById('again').addEventListener('click', function () {
        S = { i: 0, answers: {}, right: 0, wrong: 0, traps: {}, done: false };
        save(); render();
      });
    }

    document.getElementById('next').addEventListener('click', function () {
      if (S.i < steps.length) { S.i++; save(); render(); }
    });
    document.getElementById('prev').addEventListener('click', function () {
      if (S.i > 0) { S.i--; save(); render(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      var st = steps[S.i];
      if (!st) return;
      if (/^[1-4]$/.test(e.key) && st.ask && S.answers[S.i] == null) {
        var bs = page.querySelectorAll('.opts button');
        if (bs[+e.key - 1]) bs[+e.key - 1].click();
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        var n = document.getElementById('next');
        if (n && !n.disabled) n.click();
      } else if (e.key === 'ArrowLeft') {
        var p = document.getElementById('prev');
        if (p && !p.disabled) p.click();
      }
    });
    render();
  }
})();