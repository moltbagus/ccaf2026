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

  /* ===== DIAGRAM ENGINE (generated) ===== */
  /* 14 archetypes x 220 authored specs. Generated by wire_diagrams.py - edit that, not this. */
  /* ---------- generic diagram archetypes (data-driven) ----------
     14 archetypes, each driven by a spec object drawn from the step's own
     content. Wave 1 = visual grammar, wave 2 = the SPECS map below. */
  var TONE_F = { acc: 'var(--dia)', ok: 'var(--okbg)', bad: 'var(--badbg)', warn: 'var(--warnbg)' };
  var TONE_S = { acc: 'var(--acc)', ok: 'var(--ok)', bad: 'var(--bad)', warn: 'var(--warn)' };
  var TONE_T = { acc: 'var(--acc)', ok: 'var(--ok)', bad: 'var(--bad)', warn: 'var(--warn)' };
  var fillOf = function (t) { return TONE_F[t] || 'var(--card)'; };
  var strokeOf = function (t) { return TONE_S[t] || 'var(--line)'; };
  var textTone = function (t) { return TONE_T[t] || 'var(--fg)'; };

  // hard-wrap to a pixel width; assumes the 12.5px sans stack
  function wrapText(str, wpx, size) {
    var max = Math.max(8, Math.floor(wpx / ((size || 12.5) * 0.53)));
    var words = String(str == null ? '' : str).split(/\s+/);
    var lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var t = cur ? cur + ' ' + words[i] : words[i];
      if (t.length > max && cur) { lines.push(cur); cur = words[i]; } else { cur = t; }
    }
    if (cur) lines.push(cur);
    return lines;
  }
  function noteLines(note) {
    if (!note) return [];
    var arr = Array.isArray(note) ? note : [note], out = [];
    for (var i = 0; i < arr.length; i++) out = out.concat(wrapText(arr[i], 700, 12));
    return out;
  }
  // one rounded card, text wrapped; returns {h, s}
  function card(x, y, w, text, o) {
    o = o || {};
    var size = o.size || 12.5, padx = 12, pady = 10, lh = o.lh || 15;
    var lines = wrapText(text, w - padx * 2, size);
    if (o.extra) lines = lines.concat(o.extra);
    var h = lines.length * lh + pady * 2;
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="' +
      fillOf(o.tone) + '" stroke="' + strokeOf(o.tone) + '"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + '/>';
    for (var i = 0; i < lines.length; i++) {
      s += txt(x + padx, y + pady + lh * i + 11.5, lines[i], {
        size: size, weight: (o.weight && i === 0) ? 600 : null,
        fill: (o.extra && i >= lines.length - o.extra.length) ? 'var(--mut)' : textTone(o.tone)
      });
    }
    return { h: h, s: s };
  }
  // centred multi-line label inside a box of known height
  function centred(cx, y, h, lines, o) {
    o = o || {};
    var size = o.size || 12.5, lh = o.lh || 15, s = '';
    var top = y + (h - lines.length * lh) / 2 + 11;
    for (var i = 0; i < lines.length; i++) {
      s += txt(cx, top + i * lh, lines[i], { anchor: 'middle', size: size, weight: o.weight && i === 0 ? 600 : null, fill: o.fill || 'var(--fg)' });
    }
    return s;
  }

  var ARCH = {};

  // flow — left-to-right chain of 2-5 steps
  ARCH.flow = function (p) {
    var n = p.nodes.length, gap = 32, w = (700 - (n - 1) * gap) / n, y = 30, s = '', i, k;
    var tl = 1, sl = 0;
    for (i = 0; i < n; i++) {
      tl = Math.max(tl, wrapText(p.nodes[i].t, w - 24, 12.5).length);
      if (p.nodes[i].s) sl = Math.max(sl, wrapText(p.nodes[i].s, w - 24, 11.5).length);
    }
    var th = tl * 15 + 20, shl = sl ? sl * 14 + 20 : 0, bh = th + (shl ? shl + 6 : 0);
    for (i = 0; i < n; i++) {
      var nd = p.nodes[i], x = 30 + i * (w + gap);
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + bh + '" rx="9" fill="' +
        fillOf(nd.tone) + '" stroke="' + strokeOf(nd.tone) + '"/>';
      s += centred(x + w / 2, y, shl ? th : bh, wrapText(nd.t, w - 24, 12.5), { weight: 1, fill: textTone(nd.tone) });
      if (nd.s) s += centred(x + w / 2, y + th + 6, shl, wrapText(nd.s, w - 24, 11.5), { size: 11.5, lh: 14, fill: 'var(--mut)' });
      if (i < n - 1) s += arw(x + w, y + bh / 2, x + w + gap - 4, y + bh / 2);
    }
    return { h: y + bh, s: s };
  };

  // ladder — ordered condition → action rows, first match wins
  ARCH.ladder = function (p) {
    var s = '', y = p.head ? 44 : 24, i, lw = 316, rw = 330, rx = 400;
    if (p.head) s += txt(30, 20, p.head, { size: 12, weight: 600, fill: 'var(--mut)' });
    for (i = 0; i < p.rows.length; i++) {
      var r = p.rows[i];
      var cl = wrapText(r.cond, lw - 24, 12.5), al = wrapText(r.act, rw - 24, 12);
      var h = Math.max(cl.length * 15, al.length * 14) + 20;
      s += '<rect x="30" y="' + y + '" width="' + lw + '" height="' + h + '" rx="9" fill="var(--card)" stroke="var(--line)"/>';
      s += centred(30 + lw / 2, y, h, cl, { size: 12.5, weight: 1 });
      s += '<rect x="' + rx + '" y="' + y + '" width="' + rw + '" height="' + h + '" rx="9" fill="' +
        fillOf(r.tone) + '" stroke="' + strokeOf(r.tone) + '"/>';
      s += centred(rx + rw / 2, y, h, al, { size: 12, lh: 14, fill: textTone(r.tone) === 'var(--fg)' ? 'var(--fg)' : textTone(r.tone), weight: 1 });
      s += arw(30 + lw, y + h / 2, rx - 4, y + h / 2);
      y += h + 12;
    }
    return { h: y - 12, s: s };
  };

  // matrix2 — two-by-two quadrant grid
  ARCH.matrix2 = function (p) {
    var s = '', x0 = 88, y0 = 40, w = 306, h = 106, gx = 10, gy = 10;
    var q = [[p.nw, x0, y0], [p.ne, x0 + w + gx, y0], [p.sw, x0, y0 + h + gy], [p.se, x0 + w + gx, y0 + h + gy]];
    for (var i = 0; i < 4; i++) {
      var d = q[i][0], x = q[i][1], yy = q[i][2];
      s += '<rect x="' + x + '" y="' + yy + '" width="' + w + '" height="' + h + '" rx="9" fill="' +
        fillOf(d.tone) + '" stroke="' + strokeOf(d.tone) + '"/>';
      var t2 = wrapText(d.t, w - 24, 12.5);
      s += centred(x + w / 2, yy, h, t2, { weight: 1, fill: textTone(d.tone) });
      if (d.s) s += centred(x + w / 2, yy + t2.length * 15 + 2, h - t2.length * 15 - 2, wrapText(d.s, w - 24, 11.5), { size: 11.5, lh: 14, fill: 'var(--mut)' });
    }
    var yb = y0 + h * 2 + gy;
    s += txt(x0 + w + gx / 2, yb + 22, (p.xlab || '') + ' \u2192', { anchor: 'middle', size: 12, weight: 600, fill: 'var(--mut)' });
    s += '<text x="' + (x0 - 22) + '" y="' + (y0 + h + gy / 2) + '" transform="rotate(-90 ' + (x0 - 22) + ' ' + (y0 + h + gy / 2) +
      ')" text-anchor="middle" font-size="12" font-weight="600" fill="var(--mut)" style="' + F + '">' + esc(p.ylab || '') + ' \u2191</text>';
    return { h: yb + 34, s: s };
  };

  // table — header + rows, wrapped cells
  ARCH.table = function (p) {
    var cols = p.cols, cw = 700 / cols.length, s = '', y = 24, i, j;
    var hh = 0;
    for (i = 0; i < cols.length; i++) hh = Math.max(hh, wrapText(cols[i], cw - 20, 12).length);
    var ch = hh * 15 + 18;
    for (i = 0; i < cols.length; i++) {
      s += '<rect x="' + (30 + i * cw) + '" y="' + y + '" width="' + cw + '" height="' + ch + '" fill="var(--dia)" stroke="var(--line)"/>';
      s += centred(30 + i * cw + cw / 2, y, ch, wrapText(cols[i], cw - 20, 12), { size: 12, weight: 1 });
    }
    y += ch;
    for (j = 0; j < p.rows.length; j++) {
      var row = p.rows[j], rh = 0;
      for (i = 0; i < cols.length; i++) rh = Math.max(rh, wrapText(row[i] || '', cw - 20, 12).length);
      var rH = rh * 15 + 16;
      for (i = 0; i < cols.length; i++) {
        s += '<rect x="' + (30 + i * cw) + '" y="' + y + '" width="' + cw + '" height="' + rH + '" fill="var(--card)" stroke="var(--line)"/>';
        s += centred(30 + i * cw + cw / 2, y, rH, wrapText(row[i] || '', cw - 20, 12), { size: 12, weight: i === 0 ? 1 : null });
      }
      y += rH;
    }
    return { h: y, s: s };
  };

  // layers — stacked bands, top to bottom
  ARCH.layers = function (p) {
    var s = '', y = 26, i;
    for (i = 0; i < p.bands.length; i++) {
      var b = p.bands[i];
      var tl = wrapText(b.t, 660, 12.5), sl = b.s ? wrapText(b.s, 660, 11.5) : [];
      var h = 16 + tl.length * 15 + (sl.length ? 6 + sl.length * 14 : 0);
      s += '<rect x="30" y="' + y + '" width="700" height="' + h + '" rx="9" fill="' + fillOf(b.tone) +
        '" stroke="' + strokeOf(b.tone) + '"/>';
      for (var k = 0; k < tl.length; k++) s += txt(46, y + 18 + k * 15, tl[k], { size: 12.5, weight: 600, fill: textTone(b.tone) });
      for (var m = 0; m < sl.length; m++) s += txt(46, y + 18 + tl.length * 15 + 6 + m * 14, sl[m], { size: 11.5, fill: 'var(--mut)' });
      y += h + 10;
      if (i < p.bands.length - 1) s += arw(380, y - 10, 380, y - 1);
    }
    return { h: y - 10, s: s };
  };

  // tree — one root, up to five children
  ARCH.tree = function (p) {
    var s = '', i, y = 28;
    var rw = 300, rl = wrapText(p.root.t, rw - 24, 12.5), sl = p.root.s ? wrapText(p.root.s, rw - 24, 11.5) : [];
    var rh = rl.length * 15 + (sl.length ? sl.length * 14 + 6 : 0) + 20;
    s += '<rect x="230" y="' + y + '" width="' + rw + '" height="' + rh + '" rx="9" fill="' + fillOf(p.root.tone || 'acc') +
      '" stroke="' + strokeOf(p.root.tone || 'acc') + '"/>';
    s += centred(380, y, sl.length ? rh - (sl.length * 14 + 6) : rh, rl, { weight: 1, fill: textTone(p.root.tone || 'acc') });
    if (sl.length) s += centred(380, y + rl.length * 15, sl.length * 14 + 6, sl, { size: 11.5, lh: 14, fill: 'var(--mut)' });
    var n = p.kids.length, gap = 22, w = (700 - (n - 1) * gap) / n, y2 = y + rh + 62;
    var kl = 1;
    for (i = 0; i < n; i++) kl = Math.max(kl, wrapText(p.kids[i].t, w - 24, 12).length + (p.kids[i].s ? 1 : 0));
    var kh = kl * 15 + 20;
    for (i = 0; i < n; i++) {
      var x = 30 + i * (w + gap), kid = p.kids[i];
      s += arw(380, y + rh, x + w / 2, y2 - 2, { elbow: 'v', my: y + rh + 30, dash: 1 });
      s += '<rect x="' + x + '" y="' + y2 + '" width="' + w + '" height="' + kh + '" rx="9" fill="' + fillOf(kid.tone) + '" stroke="' + strokeOf(kid.tone) + '"/>';
      var kt = wrapText(kid.t, w - 24, 12);
      s += centred(x + w / 2, y2, kid.s ? kh * 0.55 : kh, kt, { size: 12, weight: 1, fill: textTone(kid.tone) });
      if (kid.s) s += centred(x + w / 2, y2 + kh * 0.5, kh * 0.5, wrapText(kid.s, w - 24, 11), { size: 11, lh: 13, fill: 'var(--mut)' });
    }
    return { h: y2 + kh, s: s };
  };

  // timeline — ordered markers on an axis
  ARCH.timeline = function (p) {
    var s = '', n = p.marks.length, i, y = 132;
    var step = 690 / (n - 1 || 1), xs = [];
    for (i = 0; i < n; i++) { xs.push(35 + i * step); }
    s += arw(30, y, 730, y, { w: 2, stroke: 'var(--acc)' });
    for (i = 0; i < n; i++) {
      var x = xs[i], m = p.marks[i];
      s += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="var(--bg)" stroke="var(--acc)" stroke-width="2"/>';
      var tl = wrapText(m.t, 150, 12), sl = m.s ? wrapText(m.s, 150, 11) : [];
      var up = i % 2 === 0;
      var baseY = up ? y - 22 - (sl.length * 13) : y + 30;
      var anchor = x < 90 ? 'start' : (x > 670 ? 'end' : 'middle');
      var ax = anchor === 'start' ? x - 20 : (anchor === 'end' ? x + 20 : x);
      for (var k = 0; k < tl.length; k++) s += txt(ax, baseY + k * 15, tl[k], { anchor: anchor, size: 12, weight: 600 });
      for (var m2 = 0; m2 < sl.length; m2++) s += txt(ax, baseY + tl.length * 15 + m2 * 13, sl[m2], { anchor: anchor, size: 11, fill: 'var(--mut)' });
      s += '<line x1="' + x + '" y1="' + (y - 6) + '" x2="' + x + '" y2="' + (y + 6) + '" stroke="var(--acc)" stroke-width="2"/>';
    }
    return { h: y + 104, s: s };
  };

  // fanout — one hub, N spokes ringing it
  ARCH.fanout = function (p) {
    var s = '', cx = 380, cy = 160, n = p.spokes.length, i;
    var rx = 250, ry = 116;
    var hw = 200, hh = wrapText(p.hub.t, hw - 24, 12.5).length * 15 + (p.hub.s ? 14 : 0) + 20;
    var pts = [];
    for (i = 0; i < n; i++) {
      var ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      pts.push([cx + rx * Math.cos(ang), cy + ry * Math.sin(ang)]);
    }
    for (i = 0; i < n; i++) {
      var w = 196, x = Math.min(724, Math.max(36, pts[i][0] - w / 2));
      var t2 = wrapText(p.spokes[i].t, w - 22, 12), s2 = p.spokes[i].s ? wrapText(p.spokes[i].s, w - 22, 11) : [];
      var h2 = t2.length * 15 + (s2.length ? s2.length * 13 + 4 : 0) + 18;
      var by = Math.min(288, Math.max(16, pts[i][1] - h2 / 2));
      s += '<rect x="' + x + '" y="' + by + '" width="' + w + '" height="' + h2 + '" rx="9" fill="' + fillOf(p.spokes[i].tone) +
        '" stroke="' + strokeOf(p.spokes[i].tone) + '"/>';
      s += centred(x + w / 2, by, s2.length ? h2 - (s2.length * 13 + 4) : h2, t2, { size: 12, weight: 1, fill: textTone(p.spokes[i].tone) });
      if (s2.length) s += centred(x + w / 2, by + t2.length * 15, s2.length * 13 + 4, s2, { size: 11, lh: 13, fill: 'var(--mut)' });
      var edgeX = pts[i][0] < cx ? x + w : x, edgeY = by + h2 / 2;
      if (Math.abs(pts[i][1] - cy) < 40) { edgeY = by + h2 / 2; }
      s += arw(cx + (pts[i][0] > cx ? 108 : -108), cy, pts[i][0] > cx ? x - 4 : x + w + 4, by + h2 / 2, { dash: 1, stroke: 'var(--acc)' });
    }
    s += '<rect x="' + (cx - hw / 2) + '" y="' + (cy - hh / 2) + '" width="' + hw + '" height="' + hh + '" rx="9" fill="var(--dia)" stroke="var(--acc)"/>';
    s += centred(cx, cy - hh / 2, hh, wrapText(p.hub.t, hw - 24, 12.5), { weight: 1, fill: 'var(--acc)' });
    return { h: 306, s: s };
  };

  // funnel — wide to narrow stages
  ARCH.funnel = function (p) {
    var s = '', n = p.stages.length, i, y = 26;
    for (i = 0; i < n; i++) {
      var w = 640 - i * (300 / Math.max(1, n - 1)), x = 380 - w / 2, st = p.stages[i];
      var lines = wrapText(st.t, w - 30, 12.5);
      if (st.s) lines = lines.concat(wrapText(st.s, w - 30, 11.5));
      var h = lines.length * 15 + 20;
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="' + fillOf(st.tone) + '" stroke="' + strokeOf(st.tone) + '"/>';
      s += centred(380, y, h, lines, { size: 12.5, weight: 1, fill: textTone(st.tone) });
      y += h;
      if (i < n - 1) { s += arw(380, y, 380, y + 12); y += 16; }
    }
    return { h: y, s: s };
  };

  // beforeafter — two panels with a transition arrow
  ARCH.beforeafter = function (p) {
    var s = '', y = 30, i;
    function panel(x, d, tone) {
      var out = '', w = 320, ly = y + 14;
      var tl = wrapText(d.t, w - 28, 12.5);
      var ul = [];
      for (i = 0; i < (d.bullets || []).length; i++) ul = ul.concat(wrapText('\u2022 ' + d.bullets[i], w - 34, 11.5));
      var bodyH = tl.length * 15 + (ul.length ? 8 + ul.length * 14 : 0);
      var h = bodyH + 28;
      out += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="' + fillOf(tone) + '" stroke="' + strokeOf(tone) + '"/>';
      for (var k = 0; k < tl.length; k++) out += txt(x + 14, y + 24 + k * 15, tl[k], { size: 12.5, weight: 600, fill: textTone(tone) });
      for (var m = 0; m < ul.length; m++) out += txt(x + 16, y + 24 + tl.length * 15 + 8 + m * 14, ul[m], { size: 11.5, fill: 'var(--mut)' });
      return { h: h, s: out };
    }
    var l = panel(30, p.left, p.leftTone || 'bad'), r = panel(410, p.right, p.rightTone || 'ok');
    s += l.s; s += r.s;
    var mid = Math.max(l.h, r.h);
    s += arw(354, y + mid / 2, 406, y + mid / 2, { w: 2, stroke: 'var(--acc)', label: p.mid || '', lx: 380, ly: y + mid / 2 - 10 });
    return { h: y + mid, s: s };
  };

  // checklist — do / do-not columns
  ARCH.checklist = function (p) {
    var s = '', y = 30, i, k;
    function col(x, head, items, tone, mark) {
      var out = '', w = 340, ly = [];
      for (i = 0; i < items.length; i++) ly = ly.concat(wrapText(mark + ' ' + items[i], w - 34, 11.5));
      var h = ly.length * 15 + 42;
      out += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="' + fillOf(tone) + '" stroke="' + strokeOf(tone) + '"/>';
      out += txt(x + 14, y + 22, head, { size: 12, weight: 600, fill: textTone(tone) });
      for (k = 0; k < ly.length; k++) out += txt(x + 16, y + 44 + k * 15, ly[k], { size: 11.5, fill: 'var(--fg)' });
      return { h: h, s: out };
    }
    var l = col(30, p.doHead || 'Do', p.do, 'ok', '\u2713'), r = col(390, p.dontHead || 'Do not', p.dont, 'bad', '\u2717');
    s += l.s + r.s;
    return { h: y + Math.max(l.h, r.h), s: s };
  };

  // gate — flow through a programmatic gate with two exits
  ARCH.gate = function (p) {
    var s = '', y = 40;
    var b = card(30, y + 20, 200, p.before.t, { weight: 1, tone: p.before.tone });
    if (p.before.s) { var b2 = card(30, y + 20 + b.h + 6, 200, p.before.s, { size: 11.5 }); }
    s += b.s; if (b2) s += b2.s;
    var preH = b.h + (b2 ? b2.h + 6 : 0);
    s += arw(230, y + 20 + preH / 2, 296, y + 20 + preH / 2);
    var gcy = y + 20 + preH / 2, gw = 190, gh = 110;
    s += dia(380, gcy, gw, gh, wrapText(p.gate.t, 130, 12));
    var passY = gcy - 84, failY = gcy + 34;
    s += arw(475, gcy, 520, gcy);
    s += '<path d="M380 ' + (gcy + gh / 2) + ' V' + (failY + 26) + ' H516" fill="none" stroke="var(--bad)" stroke-width="1.5" marker-end="url(#ahbad)"/>';
    s += '<defs><marker id="ahbad" markerWidth="9" markerHeight="9" refX="7.5" refY="3.2" orient="auto"><path d="M0 0 L8 3.2 L0 6.4 z" fill="var(--bad)"/></marker></defs>';
    var pc = card(524, passY - 26, 206, p.pass.t + (p.pass.s ? ' \u2014 ' + p.pass.s : ''), { weight: 1, tone: 'ok', size: 12 });
    var fc = card(524, failY, 206, p.fail.t + (p.fail.s ? ' \u2014 ' + p.fail.s : ''), { weight: 1, tone: 'bad', size: 12 });
    s += pc.s + fc.s;
    return { h: Math.max(20 + preH + 40, failY + fc.h + 10), s: s };
  };

  // budget — proportional segments of one bar
  ARCH.budget = function (p) {
    var s = '', x = 30, i, y = 30, barw = 700, barh = 46;
    var total = 0;
    for (i = 0; i < p.segs.length; i++) total += p.segs[i].pct;
    for (i = 0; i < p.segs.length; i++) {
      var w = barw * (p.segs[i].pct / (total || 100));
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + barh + '" fill="' + fillOf(p.segs[i].tone) + '" stroke="' + strokeOf(p.segs[i].tone) + '"/>';
      s += centred(x + w / 2, y, barh, [p.segs[i].pct + '%'], { size: 13, weight: 1 });
      var lbl = wrapText(p.segs[i].t, w - 12, 11.5);
      for (var k = 0; k < lbl.length; k++) s += txt(x + w / 2, y + barh + 18 + k * 14, lbl[k], { anchor: 'middle', size: 11.5, fill: 'var(--mut)' });
      x += w;
    }
    var maxl = 0;
    for (i = 0; i < p.segs.length; i++) maxl = Math.max(maxl, wrapText(p.segs[i].t, barw * (p.segs[i].pct / (total || 100)) - 12, 11.5).length);
    return { h: y + barh + 18 + maxl * 14, s: s };
  };

  // loop — a cycle, top to bottom, with the back edge drawn
  ARCH.loop = function (p) {
    var s = '', y = 30, i, n = p.nodes.length, cx = 300, w = 420;
    for (i = 0; i < n; i++) {
      var c = card(30 + (cx - w / 2) - 30, y, w, p.nodes[i].t, { weight: 1, tone: p.nodes[i].tone, size: 12.5 });
      if (p.nodes[i].s) {
        var c2 = card(30 + (cx - w / 2) - 30, y + c.h + 4, w, p.nodes[i].s, { size: 11.5 });
        s += c.s + c2.s;
        if (i < n - 1) s += arw(30 + (cx - w / 2) - 30 + w / 2, y + c.h + c2.h + 4, 30 + (cx - w / 2) - 30 + w / 2, y + c.h + c2.h + 4 + 14);
        y += c.h + c2.h + 4 + (i < n - 1 ? 14 : 0);
      } else {
        s += c.s;
        if (i < n - 1) s += arw(30 + (cx - w / 2) - 30 + w / 2, y + c.h, 30 + (cx - w / 2) - 30 + w / 2, y + c.h + 14);
        y += c.h + (i < n - 1 ? 14 : 0);
      }
    }
    var bx = 30 + (cx - w / 2) - 30 + w, top = 30 + 24;
    s += '<path d="M' + bx + ' ' + (y - 24) + ' H' + (bx + 62) + ' V' + top + ' H' + (bx + 4) + '" fill="none" stroke="var(--acc)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#ahloop)"/>';
    s += '<defs><marker id="ahloop" markerWidth="9" markerHeight="9" refX="7.5" refY="3.2" orient="auto"><path d="M0 0 L8 3.2 L0 6.4 z" fill="var(--acc)"/></marker></defs>';
    s += txt(bx + 68, (y - 24 + top) / 2, 'repeat', { size: 11, fill: 'var(--acc)', weight: 600 });
    return { h: y, s: s };
  };

  function drawSpec(p) {
    var fn = ARCH[p.t] || ARCH.flow;
    var r = fn(p);
    var nl = noteLines(p.note), h = r.h, i;
    for (i = 0; i < nl.length; i++) r.s += txt(30, r.h + 20 + i * 15, nl[i], { size: 12, fill: 'var(--mut)' });
    if (nl.length) h = r.h + 12 + nl.length * 15;
    return svg(h + 12, r.s, p.title || 'diagram');
  }

  /* SPECS: one entry per tutor step, keyed "<lesson>-<step>". */

  var SPECS = {
"d1-1": {
"cap": "Watch the third card: `stop_reason` is read there, and it is the only thing that decides whether a fourth call happens.",
"nodes": [
{
"s": "resend the full history — the API is stateless",
"t": "client.messages.create(...)"
},
{
"s": "not one string of text",
"t": "Response: content blocks + stop_reason"
},
{
"s": "stop_reason != \"tool_use\" → break",
"t": "Run each tool_use block"
},
{
"s": "one per tool_use_id, in a user turn",
"t": "Append tool_result, call again"
}
],
"note": "The loop has no built-in sense of completion: the model asks, your code decides.",
"t": "flow",
"title": "The agent cycle: request, content blocks, tool execution, result append"
},
"d1-10": {
"cap": "Both halves of the failure are present at once — relieving only one ceiling leaves the agent still broken.",
"note": "Splitting is not free: each subagent is another context to fill, another failure to handle, another result to reconcile.",
"segs": [
{
"pct": 50,
"t": "Context ceiling: window fills, early findings fall out",
"tone": "bad"
},
{
"pct": 50,
"t": "Specialization gap: one agent, every role, generic output",
"tone": "warn"
}
],
"t": "budget",
"title": "The two ceilings a single agent hits: context window and specialization"
},
"d1-11": {
"cap": "The left column asks the agent to recover or outlast lost context; only the right column keeps each context small.",
"left": {
"bullets": [
"raise the iteration cap — work longer in a broken context",
"raise the model tier — window pressure is unchanged",
"tell it to re-read earlier findings — they are gone"
],
"t": "Symptom patches"
},
"mid": "cause",
"note": "The signature is a context ceiling: work done early is repeated, then missed.",
"right": {
"bullets": [
"coordinator holds the topic plan centrally",
"scoped subagents keep each context small",
"structured findings return to the hub"
],
"t": "The fix that relieves the ceiling"
},
"t": "beforeafter",
"title": "Symptom patches versus the fix that relieves the context ceiling"
},
"d1-12": {
"cap": "Watch the absence of arrows between the spokes — subagents never talk to each other; every hop routes through the hub.",
"hub": {
"t": "Coordinator — the one control point"
},
"note": "A subagent handing results straight to another subagent removes the one place errors are handled uniformly.",
"spokes": [
{
"s": "scoped search, small context",
"t": "Discovery subagent"
},
{
"s": "one source at a time",
"t": "Reader subagent"
},
{
"s": "receives structured findings",
"t": "Synthesis subagent"
},
{
"s": "narrow verify tool only",
"t": "Verification subagent"
}
],
"t": "fanout",
"title": "Hub-and-spoke: one coordinator, isolated subagents, no peer-to-peer links"
},
"d1-13": {
"cap": "The subagent sees only these children — any fact the coordinator leaves out of the spawn is invisible to it.",
"kids": [
{
"s": "name it in the prompt",
"t": "Client segment"
},
{
"s": "the coordinator already found them",
"t": "Two named competitors"
},
{
"s": "or the analysis ignores it",
"t": "Pricing constraint"
}
],
"note": "Context does not inherit: missing detail is an injection failure at the coordinator, and the fix belongs there.",
"root": {
"s": "it inherits no conversation, no history, no other agent's memory",
"t": "The subagent's universe = its definition at spawn"
},
"t": "tree",
"title": "What a subagent can know: only what the spawn definition injects"
},
"d1-14": {
"bands": [
{
"s": "no Task, no spawn — delegation is physically impossible",
"t": "allowedTools on the coordinator: Task must be listed",
"tone": "warn"
},
{
"s": "write it like a function docstring; the coordinator picks by it",
"t": "description — the selection signal",
"tone": "acc"
},
{
"s": "it inherits no conversation; every fact must be written here",
"t": "prompt — the subagent's entire universe"
},
{
"s": "a fact-check agent gets a narrow verify tool, not web search",
"t": "tools — scoped per subagent"
},
{
"t": "model — optionally pinned per subagent"
}
],
"cap": "Read top down: without the first band nothing spawns, and the middle bands are the entire world the subagent will know.",
"note": [
"The description is the selection signal — the coordinator chooses subagents by it.",
"The prompt is the subagent's entire universe: it inherits no conversation."
],
"t": "layers",
"title": "The Task call: allowedTools first, then the definition object's parts"
},
"d1-15": {
"before": {
"s": "its prompt describes the delegation pattern in detail",
"t": "Coordinator answers every request itself"
},
"cap": "The only branch that reaches delegation is the pass exit — prompt wording, prompt length and iteration caps never cross this gate.",
"fail": {
"s": "no wording can add a missing tool",
"t": "Capability absent"
},
"gate": {
"t": "Is Task in allowedTools?"
},
"note": "Prompt wording, prompt length and iteration caps all tune instructions that were already sufficient — none adds a missing tool.",
"pass": {
"s": "the coordinator can emit a spawn call",
"t": "Delegation possible"
},
"t": "gate",
"title": "Why the orchestrator never delegates: the allowedTools gate"
},
"d1-16": {
"cap": "The left handoff is one line of prose; the right hands over claims with source ids, so every claim stays traceable.",
"left": {
"bullets": [
"one line: 'here are the findings, synthesise them'",
"the subagent knows nothing of those notes",
"it invents or generalises; sources already gone"
],
"t": "Prose handoff"
},
"mid": "swap",
"note": "The subagent inherits no history: every fact it needs must be written into the spawn. A claim that loses its source cannot be verified.",
"right": {
"bullets": [
"claims[] — id, text, source_id, confidence",
"sources{} keyed by source id — pass both",
"conflicts annotated unresolved, escalated to the hub"
],
"t": "Structured claims object"
},
"t": "beforeafter",
"title": "Prose handoff versus a structured claims-with-sources object"
},
"d1-17": {
"cap": "Only the structured-claims row keeps attribution: it carries source ids so the coordinator resolves conflicts.",
"cols": [
"Approach",
"What it recovers",
"Verdict"
],
"note": "Prose destroys provenance before synthesis; a conflict silently merged into one statement can never be un-merged.",
"rows": [
[
"Append source URLs to the summary",
"sources at paragraph level only",
"no — claims stay untraceable"
],
[
"Synthesis subagent re-runs every search",
"a fresh look, not the original sourcing",
"no — work repeated, provenance lost"
],
[
"Structured claims, each with source id + confidence",
"per-claim attribution, conflicts preserved",
"yes — coordinator resolves the conflict"
],
[
"Review subagent rewrites unsupported claims",
"cleans the report after the fact",
"no — the conflict is already merged in"
]
],
"t": "table",
"title": "Four provenance fixes ranked: which one actually keeps claims traceable"
},
"d1-18": {
"before": {
"s": "e.g. only refund under $500",
"t": "A rule that must hold every time"
},
"cap": "Route the rule through one question: if one failure is unacceptable, only the pass exit — a hook — gives a guarantee.",
"fail": {
"s": "raises the odds, never a guarantee",
"t": "Leave it a prompt"
},
"gate": {
"t": "Is a single failure a loss, breach or violation?"
},
"note": "Stronger wording and few-shot examples raise the odds; they do not give the guarantee a high-stakes rule needs.",
"pass": {
"s": "the model gets no vote",
"t": "Enforce in code — a hook"
},
"t": "gate",
"title": "The guarantee gate: prompts persuade, hooks enforce"
},
"d1-19": {
"cap": "The only deterministic fix is the bottom row's gate: a flag set by the tool, read before process_refund may run.",
"head": "the verified flag is what makes 'verify first' unbreakable",
"note": "A stronger prompt and more few-shot examples both stay probabilistic — the gate is the only branch the model cannot skip.",
"rows": [
{
"act": "PostToolUse sets session.customer_verified = true",
"cond": "get_customer succeeds and finds the customer"
},
{
"act": "allow the call — the prerequisite is satisfied",
"cond": "process_refund called while the flag is true",
"tone": "ok"
},
{
"act": "PreToolUse blocks it — no refund, escalate to a human",
"cond": "process_refund called while the flag is false",
"tone": "bad"
}
],
"t": "ladder",
"title": "Prerequisite gate: how a verified flag makes process_refund unrunnable early"
},
"d1-20": {
"cap": "Two seams on one pass: PreToolUse gates the call before it runs, PostToolUse normalises the result before the model reads it.",
"nodes": [
{
"s": "the loop asks for the next call",
"t": "Model requests a tool"
},
{
"s": "gate a prerequisite, enforce a policy, block the call",
"t": "PreToolUse — the seam going in",
"tone": "warn"
},
{
"s": "raw database rows, raw side effects",
"t": "The tool executes"
},
{
"s": "normalise codes, redact, set the verified flag",
"t": "PostToolUse — the seam coming out",
"tone": "acc"
},
{
"s": "the model reasons over normalised data",
"t": "Clean result returns to the model"
}
],
"note": "A hook must pass through untouched any tool it does not match — early-return the raw result unchanged.",
"t": "flow",
"title": "One tool call, two interception seams: PreToolUse in, PostToolUse out"
},
"d1-21": {
"cap": "This is a normalisation problem at the tool boundary: only the right panel cleans the result before the model reasons over it.",
"left": {
"bullets": [
"numeric status 3 / 5 / 8, an epoch timestamp",
"the model misreads status, calls delivered 'pending'",
"the misreading happens before any reporting step"
],
"t": "lookup_order returns raw rows"
},
"mid": "hook",
"note": "Gating lookup_order changes nothing — the tool is not the problem, its output format is.",
"right": {
"bullets": [
"3/5/8 → readable labels; epoch → a date",
"the hook transforms the raw result at the seam",
"the model reasons over clean, consistent data"
],
"t": "PostToolUse maps before the model reads"
},
"t": "beforeafter",
"title": "Raw database rows versus a PostToolUse hook that normalises them first"
},
"d1-22": {
"cap": "Read top to bottom: the first matching row is the rule — chain a known path, adapt when the cause is unknown.",
"head": "the first matching row decides the pattern — never chain an open-ended task",
"note": "Chaining lives inside subagents too: a coordinator that always spawns verify then process is itself a chained workflow.",
"rows": [
{
"act": "Prompt chaining — a fixed, reproducible sequence",
"cond": "Every request follows the same known flow",
"tone": "ok"
},
{
"act": "Chain it and enforce the order in code",
"cond": "A compliance path must be identical every time",
"tone": "acc"
},
{
"act": "Dynamic decomposition — each finding picks the next step",
"cond": "The cause is unknown until you investigate",
"tone": "warn"
}
],
"t": "ladder",
"title": "Match the shape of the work: chain known steps, adapt unknown ones"
},
"d1-23": {
"cap": "Same task, same tools: the left runs a blind fixed sequence, the right lets each finding choose the next step.",
"left": {
"bullets": [
"read logs → query DB → check config → report",
"the steps may not fit; the real cause is missed",
"budget spent on layers the evidence never pointed to"
],
"t": "Fixed checklist on an unknown cause"
},
"mid": "swap",
"note": "Running every diagnostic in parallel, or asking for the root cause in one pass, both skip the evidence.",
"right": {
"bullets": [
"start from the last 24 hours of error logs",
"each finding decides the next investigation step",
"the path is discovered, not pre-committed"
],
"t": "Dynamic decomposition"
},
"t": "beforeafter",
"title": "A fixed checklist versus dynamic decomposition on an unknown cause"
},
"d1-24": {
"cap": "Validity, not sunk cost, picks the branch: resume while context holds, fork to explore, go fresh when it is stale.",
"kids": [
{
"s": "--resume <name>; always state what changed",
"t": "Resume",
"tone": "ok"
},
{
"s": "new id, original untouched — parallel exploration",
"t": "Fork"
},
{
"s": "stale results → summary framed as a hypothesis",
"t": "Start fresh",
"tone": "warn"
}
],
"note": "A fork inherits the same baseline, so it does not fix stale tool results — never resume over a heavily changed codebase.",
"root": {
"s": "the validity of the prior context decides",
"t": "Reusing an expensive session"
},
"t": "tree",
"title": "Three ways to reuse a session: resume, fork, or start fresh"
},
"d1-25": {
"before": {
"s": "most of the service rewritten since",
"t": "Analysis from 8 months ago"
},
"cap": "Eight months and a rewrite fail the validity test: the pass exit starts fresh and re-frames old findings as hypotheses.",
"fail": {
"s": "the agent cannot notice the rewrite for you",
"t": "Resume the session"
},
"gate": {
"t": "Are the prior tool results still valid?"
},
"note": "Forking does not help here — both branches inherit the same stale baseline.",
"pass": {
"s": "validate old findings against the current code",
"t": "Start fresh — hypothesis-framed summary"
},
"t": "gate",
"title": "Stale results gate: start fresh with a hypothesis, do not resume"
},
"d1-26": {
"cap": "Follow the narrowing: only the bottom band touches the root cause — the other three options leave the completion logic untouched.",
"note": "B) a longer system prompt is probabilistic, C) lower max_tokens truncates answers, D) auto-retry papers over the logic.",
"stages": [
{
"s": "the loop ends as soon as any text block appears",
"t": "Symptom: empty or half-written answers"
},
{
"s": "the model emits text alongside tool_use",
"t": "Cause: text-block presence used as the completion signal"
},
{
"s": "prompt clauses, lower max_tokens and auto-retry only hide it",
"t": "Fix: branch the loop on stop_reason",
"tone": "ok"
}
],
"t": "funnel",
"title": "Narrowing a premature-termination bug: symptom, cause, single fix"
},
"d1-27": {
"before": {
"s": "one production symptom",
"t": "Four candidate loop changes"
},
"cap": "Send every option through this gate: pass if it branches on stop_reason, fail if it trusts a proxy for the field.",
"fail": {
"s": "prose, a counter, or block shape",
"t": "Reject it"
},
"gate": {
"t": "Does it make the loop more dependent on stop_reason?"
},
"note": "The sound loop: continue while tool_use, stop on end_turn, handle max_tokens and refusal, cap as a backstop.",
"pass": {
"s": "branches on stop_reason",
"t": "Ship it"
},
"t": "gate",
"title": "The one-question gate that decides every Domain 1 loop answer"
},
"d1-3": {
"cap": "Two rows carry the exam; the middle three are what keeps production running when a response stops for any other reason.",
"head": "read the field, take the matching action — end_turn is the only finish",
"note": "end_turn is the only finish signal; everything else is a specific recovery path.",
"rows": [
{
"act": "execute the requested tools, append one user turn of tool_result blocks, call again",
"cond": "stop_reason == \"tool_use\""
},
{
"act": "server sampling cap: append the assistant turn unchanged, resend the same tools",
"cond": "stop_reason == \"pause_turn\""
},
{
"act": "truncated output: if the last block is tool_use, retry with a higher max_tokens",
"cond": "stop_reason == \"max_tokens\""
},
{
"act": "do not loop — surface the refusal, rephrase, or escalate",
"cond": "stop_reason == \"refusal\"",
"tone": "bad"
},
{
"act": "the model is finished: return the final text blocks to the caller",
"cond": "stop_reason == \"end_turn\"",
"tone": "ok"
}
],
"t": "ladder",
"title": "Every stop_reason value and the loop action it demands"
},
"d1-4": {
"cap": "Top-right adapts to novel input; bottom-left is a workflow — and a compliance path is pushed back into code by enforcement.",
"ne": {
"s": "Claude reads the context and picks the next tool",
"t": "Agentic loop",
"tone": "ok"
},
"note": "Hard-coded sequences are workflows, not agents.",
"nw": {
"s": "rigid on inputs you never mapped",
"t": "Pre-configured decision tree",
"tone": "bad"
},
"se": {
"s": "financial, security or regulatory rules enforce in code",
"t": "Compliance-critical path",
"tone": "warn"
},
"sw": {
"s": "fine when the path is known",
"t": "Workflow: read_file → search → write_file"
},
"t": "matrix2",
"title": "Who picks the next tool, plotted against how known the path is",
"xlab": "who decides the next tool: code → model",
"ylab": "task path: known → open-ended"
},
"d1-5": {
"bands": [
{
"s": "messages.append({\"role\": \"assistant\", \"content\": resp.content})",
"t": "Append the assistant turn verbatim (tool_use kept)",
"tone": "acc"
},
{
"s": "{\"type\": \"tool_result\", \"tool_use_id\": b.id, ...}",
"t": "Append one user turn of tool_result blocks"
},
{
"s": "trailing text teaches Claude to expect user text after every call",
"t": "No text after the tool_result blocks"
},
{
"s": "stateless API — it remembers nothing between requests",
"t": "Resend the whole list on the next call"
}
],
"cap": "Watch the two appends: assistant verbatim, then a pure tool_result user turn. Miss either one and the next request is invalid.",
"note": [
"Trailing text after a tool_result makes Claude expect user text after every tool call, so it answers with an empty end_turn.",
"Send a tool_result without the matching assistant tool_use turn and the messages array is invalid — the API errors."
],
"t": "layers",
"title": "The messages array between iterations: append twice, then resend it all"
},
"d1-6": {
"cap": "The left check fails both ways — too early when the model narrates, never when its wording changes.",
"left": {
"bullets": [
"fires early when the model narrates reasoning",
"runs forever when the wording drifts",
"misses the tool_use block in the same turn"
],
"t": "if \"done\" in assistant_text"
},
"mid": "swap",
"note": "The exam phrases this as partial answers or an infinite loop; the fix is always: branch on stop_reason.",
"right": {
"bullets": [
"the API states intent in a structured field",
"a turn that wants a tool returns tool_use",
"phrasing and model versions cannot drift it"
],
"t": "if resp.stop_reason == \"end_turn\""
},
"t": "beforeafter",
"title": "Anti-pattern 1: matching prose for completion versus branching on stop_reason"
},
"d1-7": {
"cap": "Look at where the stop happens: at the cap, not at end_turn — and the task that needed one more turn is truncated.",
"marks": [
{
"s": "end_turn arrives; the loop should return the answer",
"t": "iter 2 — the work finished",
"tone": "ok"
},
{
"s": "cuts off a task that needed a 6th turn",
"t": "iter 5 — MAX_ITER = 5 fires",
"tone": "bad"
},
{
"s": "the counter decided completion, not stop_reason",
"t": "iter 6 — work still pending"
},
{
"s": "alert when the guard trips; never a silent return",
"t": "iter 50 — generous backstop",
"tone": "warn"
}
],
"note": "Caps guard; they do not decide. The cap is blind to whether the model is actually finished.",
"t": "timeline",
"title": "Where the loop really stops: at end_turn, or at the MAX_ITER cap"
},
"d1-8": {
"cap": "One response can carry narration and a tool_use block together — the shape check returns the narration and never runs the tool.",
"do": [
"if resp.stop_reason == \"tool_use\": run tools, loop again",
"extract the final answer only on stop_reason == \"end_turn\"",
"treat a text block as narration of intent"
],
"doHead": "Branch on the field",
"dont": [
"if response.content[0].type == \"text\": return the text",
"assume text present means the agent is finished",
"ignore the tool_use block riding with that text"
],
"dontHead": "Do not decide on block shape",
"note": "`response.content[0].type == \"text\"` is the check at the heart of premature loop termination.",
"t": "checklist",
"title": "Anti-pattern 3: do branch on stop_reason, do not check for a text block"
},
"d1-9": {
"cap": "Only the bottom row is the model's own statement of intent — the three rows above it are guesses your loop cannot verify.",
"cols": [
"Wrong signal",
"What it trusts",
"Verdict"
],
"note": "Every anti-pattern routes the decision through a proxy; only the last row states intent.",
"rows": [
[
"Natural-language parsing",
"the model's wording",
"wrong — fires early on narration"
],
[
"Iteration cap as primary logic",
"a counter",
"wrong — blind to completion"
],
[
"response.content[0].type == \"text\"",
"block shape",
"wrong — text rides with tool_use"
],
[
"stop_reason",
"the model's stated intent",
"the only authoritative signal"
]
],
"t": "table",
"title": "Three proxies for completion set against the one authoritative field"
},
"d2-1": {
"cap": "Both names promise to analyze; the model routes on that promise, so remove the overlap.",
"left": {
"bullets": [
"analyze_content - web-search agent",
"analyze_document - document agent",
"45% route to the wrong agent"
],
"t": "Both claim the same verb"
},
"mid": "fix",
"note": "Fix order: descriptions, few-shot, merge tools, then a routing classifier, which is wrong.",
"right": {
"bullets": [
"rename to extract_web_results",
"description: info from web search and URLs",
"widen the gap against the document tool"
],
"t": "Split the names and the verbs",
"tone": "ok"
},
"t": "beforeafter",
"title": "Overlapping tool descriptions cause the 45% misroute"
},
"d2-10": {
"cap": "Each category answers what happened, whether retrying helps, and what was attempted.",
"cols": [
"errorCategory",
"Examples",
"Retry?"
],
"note": "A write that times out after submission is an uncertain outcome, not a retry.",
"rows": [
[
"transient",
"timeout, 503, rate limit",
"yes: retry with the same input"
],
[
"validation",
"bad format, missing field, malformed ID",
"only after the agent fixes the input"
],
[
"business",
"policy limit, account locked, not eligible",
"never: carries a customer-facing message"
],
[
"permission",
"401, 403, missing scope",
"never: the agent escalates"
]
],
"t": "table",
"title": "Four errorCategory values and the next move each one licenses"
},
"d2-12": {
"cap": "An error the model never sees flagged becomes a success value it builds on; isError plus metadata makes it recoverable.",
"hub": {
"t": "A failure not flagged isError: true"
},
"note": "The LLM has no try/catch: if a failure is not flagged, it reads the error text as an ordinary success value.",
"spokes": [
{
"s": "the agent reports a garbage result as truth",
"t": "Silent hallucinated success"
},
{
"s": "the tool fails loudly enough to kill the run",
"t": "Hard pipeline break"
},
{
"s": "what failed and whether retrying helps",
"t": "errorCategory + isRetryable",
"tone": "acc"
},
{
"s": "e.g. 2000 ms before the next attempt",
"t": "retryAfter",
"tone": "acc"
},
{
"s": "fallback tools the coordinator can reroute to",
"t": "alternatives",
"tone": "acc"
}
],
"t": "fanout",
"title": "What an unflagged tool failure produces and the metadata that fixes it"
},
"d2-13": {
"cap": "A generic failure string is a dead end; only structured metadata lets the coordinator choose retry, reroute or escalate.",
"head": "the recovery decision needs what failed and whether retrying helps",
"note": "A generic operation-failed string is a dead end: the coordinator cannot tell retry from escalate from reroute.",
"rows": [
{
"act": "attach errorCategory, isRetryable, description, retryAfter, alternatives",
"cond": "Error arrives as isError: true with only 'operation failed'",
"tone": "ok"
},
{
"act": "duplicates side effects; cannot repair a non-retryable fault",
"cond": "Retry the tool a fixed number of times",
"tone": "warn"
},
{
"act": "not a contract the model can reason on",
"cond": "Return the raw exception text",
"tone": "bad"
},
{
"act": "hides the gap the coordinator has to annotate",
"cond": "Log it and continue with partial results"
}
],
"t": "ladder",
"title": "Ranked moves when a failure carries only 'operation failed'"
},
"d2-14": {
"cap": "Cap each agent at four or five role-relevant tools; the count itself is the failure.",
"hub": {
"t": "One agent, 18 tools, wrong selection"
},
"note": "tool_choice 'any' forces a tool call, never a specific tool.",
"spokes": [
{
"s": "4-5 role-relevant tools, no document analysis",
"t": "Search agent"
},
{
"s": "4-5 role-relevant tools, no web search",
"t": "Synthesis agent"
},
{
"s": "4-5 role-relevant tools",
"t": "Document agent"
},
{
"s": "constrained tool for a cross-role need",
"t": "verify_fact(claim, max_sources=3)",
"tone": "acc"
}
],
"t": "fanout",
"title": "Eighteen tools redistributed across specialised subagents"
},
"d2-15": {
"cap": "Only one approach changes the number of tools the model has to choose between.",
"cols": [
"Approach",
"What actually changes",
"Verdict"
],
"note": "Eighteen well-described tools are still eighteen tools.",
"rows": [
[
"Expand all 18 descriptions",
"the count is unchanged: still 18",
"no: better text is not fewer tools"
],
[
"tool_choice 'any'",
"forces a call, not the right one",
"no"
],
[
"Few-shot examples for 18 tools",
"token cost on every request",
"no"
],
[
"Distribute across subagents",
"4-5 role-relevant tools per agent",
"yes: selection is architecture"
]
],
"t": "table",
"title": "Comparing fixes for an agent loaded with eighteen tools"
},
"d2-16": {
"cap": "Prompts only make a call probable; tool_choice and a constrained interface make it structural.",
"ne": {
"s": "structural guarantee, then switch to auto",
"t": "tool_choice: named tool",
"tone": "acc"
},
"note": [
"Constrained replacements: fetch_url(url) becomes load_document(document_url).",
"run_sql(query) becomes query_orders(filters)."
],
"nw": {
"s": "still only probable: 15% of turns skip it",
"t": "Prompt names the tool"
},
"se": {
"s": "forces some tool call, not the right one",
"t": "tool_choice: 'any'",
"tone": "warn"
},
"sw": {
"s": "the same mechanism that already failed",
"t": "Prompt: always call extract_intent"
},
"t": "matrix2",
"title": "Probabilistic prompt control against programmatic tool_choice control",
"xlab": "prompt text -> programmatic control",
"ylab": "generic capability -> constrained capability"
},
"d2-17": {
"before": {
"t": "Extraction must run before routing"
},
"cap": "The gate is the tool_choice field: it makes the skipped first call structurally impossible.",
"fail": {
"s": "probabilistic: 15% of turns skip extraction",
"t": "Prompt-only mandate"
},
"gate": {
"t": "tool_choice: named tool"
},
"note": "tool_choice 'any' still lets the model pick a different tool.",
"pass": {
"s": "then the flow switches to 'auto'",
"t": "extract_intent runs first"
},
"t": "gate",
"title": "Forcing the first call: named tool_choice versus a prompt mandate"
},
"d2-18": {
"bands": [
{
"s": "role, goal, explicit tool-use sequence",
"t": "System prompt"
},
{
"s": "every tool loads on every request; there is no lazy loading",
"t": "All tool descriptions",
"tone": "bad"
},
{
"s": "context pollution rises with the tool count",
"t": "Conversation and tool results"
},
{
"s": "coordinator: get_customer + escalate; order agent: lookup_order + process_refund",
"t": "Scoped subsets by role",
"tone": "ok"
}
],
"cap": "There is no lazy loading: every tool description is loaded on every request, so the count is the cost.",
"note": "Twenty tools do not beat five: cap each role at four or five, then force the must-have call with tool_choice.",
"t": "layers",
"title": "Fifty tools all sit in context on every request"
},
"d2-19": {
"before": {
"s": "a plain text answer breaks the next step",
"t": "A pipeline stage must always emit a tool call"
},
"cap": "Set tool_choice to any to make a tool call structural; auto leaves the model free to answer in prose.",
"fail": {
"s": "then the next step breaks",
"t": "auto can still return prose"
},
"gate": {
"t": "tool_choice setting"
},
"note": [
"A named tool forces the wrong specific tool when the case varies.",
"Post-hoc validation pays for a second pass after the turn is wasted."
],
"pass": {
"s": "you do not care which of the five runs",
"t": "any forces one tool call"
},
"t": "gate",
"title": "Guaranteeing a tool call: tool_choice 'any' against 'auto'"
},
"d2-2": {
"cap": "Read top to bottom: the fix that touches the text beats the fix that adds a component.",
"head": "cheapest layer that reaches the root cause first",
"note": "Expanding only one of the two descriptions leaves the other claiming the same verb.",
"rows": [
{
"act": "rewrite both descriptions to remove the overlap",
"cond": "Both descriptions claim to analyze content",
"tone": "ok"
},
{
"act": "add few-shot routing examples to the coordinator prompt",
"cond": "Overlap removed but misroutes persist",
"tone": "warn"
},
{
"act": "merge them into a single tool",
"cond": "Two tools still do one job"
},
{
"act": "wrong: it masks the ambiguity, never resolves it",
"cond": "Reach for a pre-routing classifier",
"tone": "bad"
}
],
"t": "ladder",
"title": "Ranked fixes for a misrouting caused by description overlap"
},
"d2-20": {
"cap": "Project scope for the team, user scope for the individual, ${VAR} for every secret.",
"kids": [
{
"s": "team-shared and version-controlled at the repo root",
"t": "project .mcp.json"
},
{
"s": "personal and experimental servers",
"t": "user ~/.claude.json"
},
{
"s": "wins a name collision: whole entry, no field merge",
"t": "local scope"
},
{
"s": "shared file, personal secret, never the value",
"t": "${GITHUB_TOKEN} expansion",
"tone": "acc"
}
],
"note": "On a name collision the precedence is local, then project, then user.",
"root": {
"s": "where the entry lives is the decision",
"t": "MCP scope decides who shares the server"
},
"t": "tree",
"title": "MCP scope, precedence and secret expansion for a team server"
},
"d2-21": {
"cap": "One shared source of truth for the config, one personal secret for each developer.",
"do": [
"project .mcp.json, version-controlled",
"${GITHUB_TOKEN} expansion for auth",
"document the required variable in the README"
],
"doHead": "Six developers, one shared config",
"dont": [
"commit the token value",
"user scope for all six developers",
"a bespoke proxy wrapper around the GitHub API",
"a committed placeholder token to override locally"
],
"dontHead": "These break sharing or leak the token",
"note": "The wrapper is unnecessary engineering: built-in expansion already exists.",
"t": "checklist",
"title": "Do and don't for a team GitHub MCP server with per-dev tokens"
},
"d2-22": {
"cap": "Read the catalogue once instead of probing the server a dozen times before real work.",
"cols": [
"Primitive",
"Controlled by",
"Role"
],
"note": [
"When an MCP tool loses to a built-in, strengthen its description, do not delete the built-in.",
"readOnlyHint is an untrusted hint, never a security boundary."
],
"rows": [
[
"resources",
"the application",
"catalogues: schemas, issue summaries, listings"
],
[
"tools",
"the model",
"the actions the agent can take"
],
[
"prompts",
"the user",
"user-driven workflows"
]
],
"t": "table",
"title": "MCP primitives: resources catalogue, tools act, prompts are user-driven"
},
"d2-24": {
"cap": "stdio for local subprocesses, http or sse for remote servers; the transport is set by location, not capability.",
"cols": [
"Where the server lives",
"Transport (type)",
"Config fields"
],
"note": "A url with no type is skipped with a warning; a local and a remote server can expose the same tools.",
"rows": [
[
"Local machine",
"stdio",
"command + args, spoken over stdin/stdout"
],
[
"Remote",
"http (streamable-http)",
"url + headers for auth"
],
[
"Legacy remote",
"sse",
"url + headers"
]
],
"t": "table",
"title": "Transport follows where the server lives, not what it does"
},
"d2-25": {
"cap": "The missing type is the whole failure; declare the transport and the entry loads instead of being skipped.",
"do": [
"add type: http to the entry",
"declare the transport explicitly",
"match the transport to where the server lives"
],
"doHead": "Make the entry load",
"dont": [
"move the entry to user scope",
"convert it to a stdio command + args",
"raise the server timeout"
],
"dontHead": "These do not fix a missing type",
"note": "A bare url is skipped, not guessed: the client already rejected the entry before any connection.",
"t": "checklist",
"title": "Fixing a remote MCP entry that has a url but no type"
},
"d2-26": {
"cap": "Find your seed first; the other tool is the filter that follows.",
"kids": [
{
"s": "matching lines: callers of legacyAuth, imports",
"t": "Grep: contents"
},
{
"s": "file paths by name pattern, e.g. **/*.test.ts",
"t": "Glob: paths"
},
{
"s": "Grep the caller, then Glob to narrow paths around it",
"t": "Content-seeded"
},
{
"s": "Glob the file set first, then Grep the contents",
"t": "Path-seeded"
}
],
"note": "Which files exist is a path question, so Glob. Grepping import React is the wrong direction.",
"root": {
"s": "whichever you already have decides the order",
"t": "Grep or Glob? Ask what the seed is"
},
"t": "tree",
"title": "Grep searches contents, Glob matches paths, and the seed picks the order"
},
"d2-27": {
"cap": "The failure is structural, so widen the anchor before you change tools.",
"head": "Edit fails with multiple matches: climb in this order",
"note": "Build understanding incrementally: Grep entry points, Read those, Grep the identifiers.",
"rows": [
{
"act": "widen old_string with context until the match is unique",
"cond": "The target snippet appears in six places",
"tone": "ok"
},
{
"act": "Read the whole file and Write the corrected version",
"cond": "No unique anchor exists anywhere"
},
{
"act": "that is the one case for replace_all: true",
"cond": "Every occurrence really should change"
},
{
"act": "wrong category: destructive and loses content",
"cond": "Reached for sed -i or a delete-and-rewrite",
"tone": "bad"
}
],
"t": "ladder",
"title": "The fixed ladder for resolving Edit's non-unique match"
},
"d2-28": {
"cap": "replace_all rewrites five sites that should not change; widen the anchor instead.",
"left": {
"bullets": [
"sed -i over the file",
"replace_all: true rewrites all six",
"delete the file and Write it again"
],
"t": "Reach for a bigger hammer"
},
"mid": "first move",
"note": "A non-unique match is an anchor problem, not a tool problem.",
"right": {
"bullets": [
"expand old_string with surrounding context",
"no unique anchor? Read the file, then Write",
"replace_all only if all six should change"
],
"t": "Widen the anchor",
"tone": "ok"
},
"t": "beforeafter",
"title": "Wrong fixes and the right first move for a non-unique Edit match"
},
"d2-3": {
"cap": "Everything the model needs to choose this tool over its neighbour belongs in these fields.",
"do": [
"state purpose, input format, output format",
"name the boundary against similar tools",
"put closed sets in the schema as enum values",
"list the edge cases the tool handles"
],
"doHead": "Write it as selection criteria",
"dont": [
"a description containing 'or' or 'depending on'",
"a format hint buried in a parameter name",
"one tool covering two action types"
],
"dontHead": "These mean split the tool",
"note": "archive_project: 'Archive one project. Call search_projects first for a project_id.'",
"t": "checklist",
"title": "Do and don't when writing a tool description as a contract"
},
"d2-30": {
"cap": "Grep for contents, Glob for paths, Read to load, Write to create, Edit to fix, Bash for commands.",
"hub": {
"t": "Six built-ins, one lane each"
},
"note": "Running grep through Bash is a common misconception; the dedicated Grep tool exists for a reason.",
"spokes": [
{
"s": "opens files and returns matching lines",
"t": "Grep"
},
{
"s": "matches paths and names, never opens a file",
"t": "Glob"
},
{
"s": "loads a whole file, expensive at scale",
"t": "Read"
},
{
"s": "creates or overwrites a whole file",
"t": "Write"
},
{
"s": "patches a unique anchor",
"t": "Edit"
},
{
"s": "escape hatch: tests, packages, CLIs, git",
"t": "Bash"
}
],
"t": "fanout",
"title": "Six built-in tools and the one lane each one owns"
},
"d2-31": {
"cap": "When a surgical edit is impractical, Read the file, apply changes in memory and Write the whole thing back.",
"left": {
"bullets": [
"a dozen non-unique anchors in a 600-line module",
"replace_all rewrites sites that should not change",
"sed through Bash is the wrong category"
],
"t": "Reach for a surgical Edit"
},
"mid": "use Write",
"note": "Write creates and replaces; Edit is for a targeted change with a unique anchor.",
"right": {
"bullets": [
"Read the module, apply the changes in memory",
"Write the full updated file back",
"Write the new endpoint file normally"
],
"t": "Write the whole file",
"tone": "ok"
},
"t": "beforeafter",
"title": "When extensive changes beat a surgical Edit"
},
"d2-32": {
"cap": "Read left to right: each stage decides one thing the next stage cannot repair.",
"nodes": [
{
"s": "name and description are the signal",
"t": "Description routes the call"
},
{
"s": "input_schema, enums, required fields",
"t": "Schema constrains arguments"
},
{
"s": "isError, errorCategory, isRetryable",
"t": "Error contract decides recovery"
},
{
"s": "project .mcp.json vs user ~/.claude.json",
"t": "Scope decides who can call"
},
{
"s": "MCP tool vs a capable built-in",
"t": "Built-in choice decides cost"
}
],
"note": "Every stem asks which layer fixes this, and whether it is the cheapest one that reaches it.",
"t": "flow",
"title": "The Domain 2 spine: description to schema to error contract to scope to cost"
},
"d2-4": {
"cap": "A description saying 'or' or 'depending on' cannot be disambiguated at runtime.",
"left": {
"bullets": [
"manage_refund with a mode enum",
"refunds, partial refunds, credits, exchanges",
"the agent sends the wrong parameter set"
],
"t": "One tool, four behaviours"
},
"mid": "split",
"note": "Rename and mode enum are the same non-fix: both leave the contract over-broad.",
"right": {
"bullets": [
"issue_full_refund / issue_partial_refund",
"issue_store_credit / process_exchange",
"each with its own required fields"
],
"t": "Four typed contracts",
"tone": "ok"
},
"t": "beforeafter",
"title": "One over-broad refund tool versus four purpose-specific tools"
},
"d2-6": {
"cap": "Generic role framing primes one tool category; align the prompt's role, goal and sequence with the descriptions.",
"left": {
"bullets": [
"system prompt reads 'you are a customer support assistant'",
"primes some tool categories over others",
"get_customer fires when process_refund is needed"
],
"t": "Generic role framing"
},
"mid": "align",
"note": "Misrouting that survives clean descriptions is a prompt-bias problem; a policy block is a pre-tool hook.",
"right": {
"bullets": [
"state the role and the goal",
"get_customer, then lookup_order, then process_refund",
"escalate to a human only as a last resort"
],
"t": "Role, goal, explicit sequence",
"tone": "ok"
},
"t": "beforeafter",
"title": "The system prompt as a routing signal that biases tool selection"
},
"d2-7": {
"cap": "Only rewriting the system prompt removes the bias that the generic role line injects into selection.",
"cols": [
"Approach",
"What it actually changes",
"Verdict"
],
"note": "The descriptions are already distinct; the generic role line is what keeps pulling the call the wrong way.",
"rows": [
[
"Pre-routing classifier",
"adds a component that masks the ambiguity",
"no"
],
[
"Rewrite the system prompt",
"aligns role, goal and sequence with the descriptions",
"yes: removes the bias at its source"
],
[
"Few-shot examples for every tool",
"token cost on every call, symptom only",
"no"
],
[
"Bigger retry budget",
"cannot repair a prompt that biases selection",
"no"
]
],
"t": "table",
"title": "Ranking fixes when clean descriptions still misroute"
},
"d2-8": {
"cap": "Same shape, two realities: only isError and errorCategory tell the agent which one it got.",
"cols": [
"Result from get_customer",
"isError and errorCategory",
"What the agent should do"
],
"note": "A valid empty result is information; an access failure masquerading as one is the trap.",
"rows": [
[
"No customer matches the search",
"false, empty array",
"report that nothing was found"
],
[
"Customer database unreachable",
"true, errorCategory transient, isRetryable true",
"retry the same query"
],
[
"Backend down, empty array returned",
"false",
"turns 'I could not search' into 'nothing exists'"
]
],
"t": "table",
"title": "Empty array versus access failure in the get_customer contract"
},
"d2-9": {
"cap": "The contract, not the agent's prose, has to say which empty result it just returned.",
"do": [
"isError false + empty array when no customer matches",
"isError true + errorCategory transient when the DB is down",
"isRetryable true so the agent may retry the same query"
],
"doHead": "Split the two outcomes",
"dont": [
"isError true on every empty array",
"raise the retry count and timeout instead",
"ask the user to confirm an ID that does not exist"
],
"dontHead": "These mislabel a success or a failure",
"note": "Always-escalate turns a valid no-match into a false alarm.",
"t": "checklist",
"title": "Do and don't for separating no-match from access failure"
},
"d3-1": {
"cap": "Both panels hold the same rule; only the right one sits in the repository, which is why git never delivered it.",
"left": {
"bullets": [
"Three developers follow it",
"The new developer sees nothing"
],
"t": "Rule kept in ~/.claude/CLAUDE.md"
},
"mid": "move it",
"note": "A home-directory file never reaches a teammate.",
"right": {
"bullets": [
"Travels with the repo on every clone",
"All four developers receive it"
],
"t": "Rule moved to .claude/CLAUDE.md, committed"
},
"t": "beforeafter",
"title": "Where the team rule lives decides who receives it"
},
"d3-10": {
"cap": "Read down the columns: the skill carries templates, references and a tool scope the single command file cannot.",
"cols": [
"Question",
"Command",
"Skill"
],
"note": "A fifty-step checklist in CLAUDE.md pollutes every session; as a skill it loads only when needed.",
"rows": [
[
"What it is",
"A single markdown file, one static prompt",
"A directory: SKILL.md plus templates/ and reference.md"
],
[
"What it carries",
"The same text every time you type its name",
"A multi-step procedure with its own context and tool scope"
],
[
"When it runs",
"Only when a human types /name",
"On demand, and Claude can fire it when the description matches"
],
[
"Reach for it when",
"The work is a reusable static prompt",
"The work is multi-step, tool-scoped and folder-backed"
]
],
"t": "table",
"title": "A command is a file, a skill is a folder with its own tools"
},
"d3-11": {
"cap": "The right panel fixes both jobs once: a bounded skill for /release-notes and the checklist moved out of CLAUDE.md.",
"left": {
"bullets": [
"No allowed-tools, so least privilege is lost",
"A 40-step checklist loads in every session"
],
"t": "Both as commands; checklist stays in CLAUDE.md"
},
"mid": "rebuild",
"note": "Commands cannot carry supporting files or a tool scope, so the procedure cannot live there.",
"right": {
"bullets": [
"allowed-tools limited to the read and write tools it needs",
"The checklist stops loading into every session"
],
"t": "Skill in .claude/skills/ plus checklist moved to a skill"
},
"t": "beforeafter",
"title": "Treating a procedure as a command against making it a skill"
},
"d3-12": {
"cap": "Follow the globs: the rule fires only when Claude is about to work on a matching file, wherever that file lives.",
"kids": [
{
"s": "every current and future migrations directory",
"t": "**/migrations/**/*"
},
{
"s": "tests that sit beside their source",
"t": "**/*.test.ts"
},
{
"s": "handlers, scoped by path",
"t": "src/api/**/*.ts"
}
],
"note": "Without a paths: key the file loads at session start and every session pays for it.",
"root": {
"s": "frontmatter declares paths: globs",
"t": ".claude/rules/migrations.md"
},
"t": "tree",
"title": "One glob-keyed rule file covers every matching path"
},
"d3-13": {
"cap": "Scan the right column: every alternative either loads where it is irrelevant or waits for someone to remember it.",
"cols": [
"Alternative",
"Why it fails"
],
"note": "Path pattern means a rule. Task trigger means a skill.",
"rows": [
[
"Root CLAUDE.md",
"Always loaded — burns context during debugging and review"
],
[
"A CLAUDE.md per directory",
"Copies drift; cannot reach tests outside that directory"
],
[
"A slash command everyone runs first",
"Turns an ambient standard into an opt-in step"
],
[
"A skill per code type",
"Opt-in again — nothing applies as code is generated"
]
],
"t": "table",
"title": "Four alternative homes for one convention, and why each fails"
},
"d3-14": {
"cap": "Watch it narrow: only the bottom stage reaches identical conventions wherever the test files happen to live.",
"note": "Globs follow the pattern. Directory files only follow the directory.",
"stages": [
{
"s": "tests sit beside their source, in any directory",
"t": "A convention that must follow the file"
},
{
"s": "inference is non-deterministic; skills are opt-in",
"t": "Not headings, not a skill, not a per-directory file"
},
{
"s": "applies by path, and new directories are covered",
"t": ".claude/rules/ file with paths: globs",
"tone": "ok"
}
],
"t": "funnel",
"title": "Narrowing the candidate mechanisms to a glob-keyed rule file"
},
"d3-15": {
"cap": "Compare the middle column: only ** reaches a pattern wherever the files live, at any depth, including future directories.",
"cols": [
"Glob",
"Matches",
"Example"
],
"note": "A single * in the middle looks like it covers the tree but stops one level down.",
"rows": [
[
"*",
"One directory level only",
"src/api/*.ts — no subfolders"
],
[
"**",
"Any number of directories, any depth",
"**/*.test.ts — every test file anywhere"
],
[
"**/migrations/**/*",
"A migrations directory at any depth, every file beneath",
"covers directories that do not exist yet"
],
[
"*/migrations/*",
"Looks broad but anchors to one level",
"misses services/billing/db/migrations/"
]
],
"t": "table",
"title": "One star is one level, two stars is any depth"
},
"d3-16": {
"cap": "Watch it narrow to the bottom stage: only **/migrations/**/* matches a migrations directory at any depth, present and future.",
"note": "The narrow glob matches everything today, which is why it passes review and then fails.",
"stages": [
{
"t": "One rule must cover every migration file, wherever it lives"
},
{
"s": "anchored to today's path",
"t": "Not db/migrations/*"
},
{
"s": "reaches one level, misses two levels down",
"t": "Not */migrations/*"
},
{
"s": "any depth, present and future",
"t": "**/migrations/**/*",
"tone": "ok"
}
],
"t": "funnel",
"title": "Narrowing four glob candidates to the one that follows the files"
},
"d3-17": {
"cap": "The dividing line runs across the top: decisions still to be made put you in plan mode whatever the size of the change.",
"ne": {
"s": "migration touching 45 files, a different API at each call site",
"t": "Plan mode",
"tone": "acc"
},
"note": "The hybrid is valid: plan to investigate, get approval, then execute file by file.",
"nw": {
"s": "an architectural choice inside a single file",
"t": "Plan mode",
"tone": "acc"
},
"se": {
"s": "a stated mechanical edit",
"t": "Direct execution"
},
"sw": {
"s": "add the null check; the stack trace names the fix",
"t": "Direct execution",
"tone": "ok"
},
"t": "matrix2",
"title": "Plan mode or direct execution: scope against decisions remaining",
"xlab": "scope: one file → 45 or more files",
"ylab": "decisions remaining: a known edit → several valid approaches"
},
"d3-18": {
"cap": "Plan mode is one row in this table, not a separate feature — the exam tests the flag as much as the behaviour.",
"cols": [
"Surface",
"What it does"
],
"note": "In CI, plan mode is the safe posture: explore and report with no edit capability.",
"rows": [
[
"--permission-mode <mode>",
"Selects the posture for the session"
],
[
"Shift+Tab",
"Cycles through the modes"
],
[
"plan",
"Read-only explore with Glob, Grep and Read, then implement"
],
[
"acceptEdits / dontAsk / bypassPermissions",
"Other postures in the same list"
],
[
".claude/agents/",
"Custom subagents that context: fork and --agent run"
]
],
"t": "table",
"title": "The permission-mode surface underneath plan mode"
},
"d3-19": {
"cap": "Three integration approaches with different consequences and a task statement that names none: that is the plan-mode trigger.",
"left": {
"bullets": [
"Decides the trade-off before anyone reviews it",
"Matches the pattern, not the requirement"
],
"t": "Start direct execution with incoming webhooks"
},
"mid": "undecided",
"note": "Scaffolding a class before the method is chosen builds structure that gets thrown away.",
"right": {
"bullets": [
"Explore webhooks, bot tokens, a Slack App",
"Present a recommendation first"
],
"t": "Start plan mode before implementing"
},
"t": "beforeafter",
"title": "Choosing the Slack method blind against planning it first"
},
"d3-2": {
"cap": "Read the first column for the prefix and the last for reach: only the checked-in project files ever leave your machine.",
"cols": [
"Path",
"Scope",
"Reaches teammates"
],
"note": "Same filename, opposite reach.",
"rows": [
[
"~/.claude/CLAUDE.md",
"Personal",
"No — never carried by git"
],
[
"./CLAUDE.md",
"Project, committed",
"Yes — the file teammates receive"
],
[
"./.claude/CLAUDE.md",
"Project, same file",
"Yes — committed too"
],
[
"./CLAUDE.local.md",
"Personal, this one repo",
"No — gitignored"
],
[
"<subdir>/CLAUDE.md",
"On demand, downward only",
"Only if committed"
]
],
"t": "table",
"title": "Path prefix decides scope and reach for every CLAUDE.md file"
},
"d3-21": {
"cap": "Any one spoke is enough: repetition is not the test, whether decisions remain is.",
"hub": {
"s": "any one signal triggers plan mode",
"t": "Decisions remain? Then plan"
},
"note": "A plan is the bridge to execution, not a rival of it.",
"spokes": [
{
"t": "Touches more than one file non-trivially"
},
{
"t": "Multiple valid approaches — a human must choose"
},
{
"t": "Expensive to reverse: broken imports, failing tests"
},
{
"t": "Alters the architectural shape of the system"
},
{
"t": "Greenfield build — blueprint before any code"
}
],
"t": "fanout",
"title": "Four signals that force a plan, plus a from-scratch build"
},
"d3-22": {
"before": {
"t": "200-file monolith; queries of different shapes"
},
"cap": "The word repetitive is the bait: four plan signals are present, so the exit is plan mode, not direct execution.",
"fail": {
"t": "Direct execution because the edit is repetitive"
},
"gate": {
"t": "Do decisions remain?"
},
"note": "Repetitive edits are not known work. Decisions remaining means plan.",
"pass": {
"t": "Plan mode: map files, design a phased strategy, then execute"
},
"t": "gate",
"title": "Repetitive edits do not make the work known"
},
"d3-23": {
"cap": "Rewriting prose produces different misinterpretations rather than fewer; only the right panel changes the kind of input.",
"left": {
"bullets": [
"Each attempt fails in a new way",
"More adjectives, another reminder, higher temperature"
],
"t": "Reworded the instruction a third time"
},
"mid": "switch",
"note": "Test-first wins when requirements are settled but the implementation is wrong.",
"right": {
"bullets": [
"Two or three concrete input → output pairs",
"Write the test, share the failing assertions"
],
"t": "Change the modality instead"
},
"t": "beforeafter",
"title": "A third rewrite of the same prose against a change of modality"
},
"d3-24": {
"cap": "Follow the cycle: each pass turns an unknown requirement into a known one, which is why a prose spec written first fails.",
"nodes": [
{
"s": "before anything is implemented",
"t": "Claude asks clarifying questions first"
},
{
"s": "a regulated export, the first one they have built",
"t": "The team answers what it knows"
},
{
"t": "Gaps the team did not know it had surface",
"tone": "acc"
},
{
"s": "the specification no longer encodes blind spots",
"t": "Implement against known requirements"
}
],
"note": "Unknown requirements means interview. Known requirements means examples or a failing test.",
"t": "loop",
"title": "The interview cycle that converts unknown requirements into known ones"
},
"d3-25": {
"cap": "Read it left to right: the word interacting puts both defects in a single message and the typos in their own turns.",
"marks": [
{
"s": "expiry check and the 401 status",
"t": "Two middleware defects, one message",
"tone": "acc"
},
{
"s": "fixing one changes the branch the other handles",
"t": "Decided together"
},
{
"s": "independent, so each change stays reviewable",
"t": "Doc typos, one per turn"
}
],
"note": "One message containing all five mixes coupled and independent work together.",
"t": "timeline",
"title": "Sequencing coupled fixes together and independent fixes one by one"
},
"d3-26": {
"cap": "Only the top-right corner enforces anything; banning a mechanism in a rule file leaves the standard itself unstated.",
"ne": {
"s": "the action simply cannot happen",
"t": "hooks / permissions.deny",
"tone": "acc"
},
"note": "Memory advises, configuration enforces.",
"nw": {
"s": "reads like a guarantee; it is only advice",
"t": "Rules file with a MUST",
"tone": "bad"
},
"se": {
"s": "asks nicely; nothing is prevented",
"t": "A description-level warning",
"tone": "bad"
},
"sw": {
"s": "context, with no compliance guarantee",
"t": ".claude/CLAUDE.md and .claude/rules/"
},
"t": "matrix2",
"title": "Context or gate, by what it can actually guarantee",
"xlab": "mechanism: loads as context → gates the action",
"ylab": "guarantee: depends on compliance → guaranteed"
},
"d3-27": {
"cap": "The left column ends the run by itself; the right column either waits longer or reaches for undocumented surface.",
"do": [
"-p / --print: process, print to stdout, exit",
"--max-turns 20 to bound the loop",
"--max-budget-usd 2 to bound the spend",
"--permission-prompts none, --no-session-persistence"
],
"doHead": "Set on the CI invocation",
"dont": [
"Raise the job timeout — nothing will arrive",
"Redirect stdin from /dev/null",
"Set CLAUDE_HEADLESS=true",
"Look for a --batch flag"
],
"dontHead": "Symptom fixes and flags that do not exist",
"note": "A job that hangs after the banner is missing -p. Not a timeout, not /dev/null.",
"t": "checklist",
"title": "Headless CI guardrails: real flags, real fixes, invented surface"
},
"d3-28": {
"cap": "Both panels want the same shape of finding; only the right one makes that shape a condition of the output.",
"left": {
"bullets": [
"Guidance — the structure is not guaranteed",
"Findings arrive as paragraphs someone pastes"
],
"t": "A CLAUDE.md section describing the format"
},
"mid": "enforce",
"note": "A regex over narrative breaks the moment the phrasing shifts.",
"right": {
"bullets": [
"Every finding carries path, line, severity, fix",
"stream-json when records must arrive live"
],
"t": "--output-format json with --json-schema"
},
"t": "beforeafter",
"title": "Describing the review format against enforcing it"
},
"d3-29": {
"before": {
"s": "the job waits after the banner",
"t": "claude \"Analyze this pull request for security issues\""
},
"cap": "Trace the two exits: only the -p branch ends in an exit, and every other option changes the quality of the waiting.",
"fail": {
"s": "a longer timeout waits just as long",
"t": "Waits for interactive input forever"
},
"gate": {
"t": "-p / --print"
},
"note": "/dev/null is not headless mode, and CLAUDE_HEADLESS does not exist.",
"pass": {
"s": "no human is ever needed",
"t": "Prints the analysis and exits"
},
"t": "gate",
"title": "The hanging CI job has one exit, and it is -p"
},
"d3-30": {
"cap": "Follow the handoff left to right: the reviewer never sees the reasoning that produced the code.",
"nodes": [
{
"s": "the reasoning trace stays in that session",
"t": "Claude generates the change"
},
{
"s": "without the generator's reasoning",
"t": "A second instance reviews the files",
"tone": "acc"
},
{
"s": "report only new or unaddressed issues",
"t": "Pass prior findings in"
},
{
"s": "no duplicate comment on every push",
"t": "Findings posted on the PR"
}
],
"note": "Test standards and fixtures come from .claude/CLAUDE.md.",
"t": "flow",
"title": "Independent review: a fresh instance, prior findings, full files"
},
"d3-31": {
"before": {
"t": "The generator concluded its own approach was correct"
},
"cap": "The gate is a different perspective, not more effort: re-checking in the same session passes through the same reasoning.",
"fail": {
"s": "keeps the bias that produced the code",
"t": "Self-review inside the same session"
},
"gate": {
"t": "Review by a new instance"
},
"note": "A second human reviewer leaves the model's blind spot intact.",
"pass": {
"s": "a performance break, a silent behaviour change",
"t": "Non-obvious defects caught before merge"
},
"t": "gate",
"title": "Independence is the gate that catches what self-review cannot"
},
"d3-33": {
"cap": "Follow it left to right: schema'd findings are the input the downstream job reads to block on critical without a human.",
"nodes": [
{
"t": "CLAUDE.md seeds standards into every fresh session"
},
{
"t": "Load prior findings so nothing is re-reported"
},
{
"s": "no human is present",
"t": "Fresh session runs with -p"
},
{
"t": "--output-format json --json-schema fixes the shape"
},
{
"s": "exit non-zero blocks the merge",
"t": "Downstream job reads severity",
"tone": "ok"
}
],
"note": "Each step runs in a fresh session, seeded with prior findings, so nothing is re-reviewed.",
"t": "flow",
"title": "The pipeline that reads severity and blocks the merge"
},
"d3-34": {
"before": {
"t": "The review returns paragraphs of prose"
},
"cap": "Ask what the later job can actually read: only the schema'd branch gives it a severity field to act on.",
"fail": {
"t": "Scan the prose for the word 'critical' — breaks when phrasing shifts"
},
"gate": {
"t": "Can the next job read it?"
},
"note": "Prose is for humans. A gate needs a shape the next job can parse.",
"pass": {
"t": "json + --json-schema: parse severity, exit non-zero on critical"
},
"t": "gate",
"title": "A machine gate needs schema'd output, not better paragraphs"
},
"d3-35": {
"cap": "Three questions in order — who receives it, ambient or invoked, enforce or advise — settle most Domain 3 stems.",
"nodes": [
{
"s": "personal ~/.claude/ never reaches a teammate",
"t": "Who receives it?",
"tone": "acc"
},
{
"s": "CLAUDE.md for always; a skill for when someone asks",
"t": "Ambient or invoked?"
},
{
"s": "hooks and permissions deny; memory only advises",
"t": "Enforce or advise?"
}
],
"note": "A hanging job needs -p; inline comments need --output-format json; never self-review.",
"t": "flow",
"title": "The three reflexes that answer most of Domain 3"
},
"d3-4": {
"cap": "Match cause before choosing a fix: a clone that is already current rules out anything stored in the repository.",
"head": "check in order — first match wins",
"note": "Deleting a section, repeating prompts and clearing a cache all assume the wrong cause.",
"rows": [
{
"act": "the rule is not in the repo at all",
"cond": "All four clones are up to date",
"tone": "acc"
},
{
"act": "it lives in ~/.claude/CLAUDE.md, which git never carries",
"cond": "Exactly one developer misses it",
"tone": "bad"
},
{
"act": "commit it to .claude/CLAUDE.md",
"cond": "The whole team must receive it",
"tone": "ok"
}
],
"t": "ladder",
"title": "Symptom to cause when one developer sees no team guidance"
},
"d3-5": {
"bands": [
{
"s": "admin-controlled; cannot be excluded — no team may opt out",
"t": "Managed policy (enterprise)",
"tone": "acc"
},
{
"s": "team-owned and shared, so any team can change it in the next commit",
"t": "Project .claude/CLAUDE.md"
},
{
"s": "all of one person's projects; reaches no teammate",
"t": "User ~/.claude/CLAUDE.md"
},
{
"s": "one person, one repo, gitignored; never carries an org mandate",
"t": "CLAUDE.local.md"
}
],
"cap": "Trace it downward: only the top band is admin-controlled and cannot be waived; each lower band is owned by fewer people.",
"note": "Project file for the team. Managed policy for anything nobody may opt out of.",
"t": "layers",
"title": "The memory layers from org-wide mandate down to one person"
},
"d3-6": {
"before": {
"t": "Org mandates the security scan; teams must not weaken it"
},
"cap": "One phrase decides it: teams must not be able to remove the requirement, so the shared project file is the wrong exit.",
"fail": {
"t": "Project .claude/CLAUDE.md — shared, but the team can delete it"
},
"gate": {
"t": "Who may opt out?"
},
"note": "'Shared' is not 'mandatory' — the project file can be deleted in a commit.",
"pass": {
"t": "Managed policy file — admin-controlled, cannot be excluded"
},
"t": "gate",
"title": "Org-wide and non-excludable points to the managed policy layer"
},
"d3-7": {
"cap": "The left column loads itself and the right column waits to be invoked; only the top row is what the team receives.",
"ne": {
"s": "team /deploy — runs only when invoked",
"t": ".claude/commands/deploy.md"
},
"note": "Must happen every time is CLAUDE.md. Invoked when needed is a skill.",
"nw": {
"s": "team standard, loaded in every session",
"t": ".claude/CLAUDE.md",
"tone": "acc"
},
"se": {
"s": "your own /deploy, invoked when wanted",
"t": "~/.claude/skills/deploy/SKILL.md"
},
"sw": {
"s": "your standards, invisible to teammates",
"t": "~/.claude/CLAUDE.md"
},
"t": "matrix2",
"title": "Ambient or invoked, project-owned or personal",
"xlab": "when it loads: every session → on invocation",
"ylab": "who owns it: personal → project"
},
"d3-8": {
"cap": "Noisy means context: fork, unsafe means allowed-tools, missing input means argument-hint — and a warning is none of the three.",
"head": "read the symptom, then the declaration",
"note": "Editing the team skill changes everyone; a personal copy changes only you.",
"rows": [
{
"act": "context: fork — run in an isolated subagent",
"cond": "Verbose output floods the main conversation",
"tone": "acc"
},
{
"act": "restrict allowed-tools to what the skill needs",
"cond": "The skill must not modify anything"
},
{
"act": "argument-hint prompts for the required parameter",
"cond": "Invoked with no argument, produces junk"
},
{
"act": "a new name under ~/.claude/skills/",
"cond": "You want a personal variant of a team skill"
},
{
"act": "a description is advice, not a restriction",
"cond": "The option offers a warning instead",
"tone": "bad"
}
],
"t": "ladder",
"title": "Each skill symptom maps to one frontmatter declaration"
},
"d3-9": {
"cap": "Three symptoms, three declarations: the left column restricts what can happen, the right column only asks nicely.",
"do": [
"argument-hint so the migration name is required",
"context: fork to keep prior conversation out",
"allowed-tools limited to the file writes it needs"
],
"doHead": "Declare it",
"dont": [
"A description warning about destructive operations",
"Prose validation inside SKILL.md",
"Split into /migration-create and /migration-apply"
],
"dontHead": "Advice, not enforcement",
"note": "Splitting the skill leaves the missing-argument and context-leak problems unsolved.",
"t": "checklist",
"title": "Declarations that fix the /migration skill, and warnings that do not"
},
"d4-1": {
"cap": "Left is an adjective; right is a boundary. Only the right one tells the bot what qualifies.",
"left": {
"bullets": [
"flags TODO markers",
"flags simple descriptions",
"misses stale behaviour comments"
],
"t": "\"comments are accurate and up to date\""
},
"mid": "define",
"note": "Neither the model, the temperature nor the context window is the defect.",
"right": {
"bullets": [
"incomplete comments: skip",
"contradictions: flag"
],
"t": "Flag when claimed behaviour contradicts the code",
"tone": "ok"
},
"t": "beforeafter",
"title": "Adjectival criterion versus categorical boundary in the review prompt"
},
"d4-10": {
"cap": "Read top to bottom: the first row is the fix; the rest are options the stem has already ruled out.",
"head": "the stem already said 400 lines of prose has not converged",
"note": "The reasoning across the ambiguous boundary is the decision rule; the label alone is pattern matching.",
"rows": [
{
"act": "Add 2-4 examples showing the reasoning across each boundary",
"cond": "The model finds the bug but labels it inconsistently",
"tone": "ok"
},
{
"act": "Rejected - prose failed; temperature is not judgement",
"cond": "The stem offers more prose definitions or a lower temperature",
"tone": "bad"
},
{
"act": "Rejected - bloats context, triggers pattern matching",
"cond": "The stem offers six to eight examples for coverage",
"tone": "bad"
}
],
"t": "ladder",
"title": "Choosing the fix for inconsistent severity labels: first match decides"
},
"d4-11": {
"cap": "Everything under this root is a failure mode the schema cannot see; only the left child is fixed.",
"kids": [
{
"s": "malformed JSON, missing braces, trailing commas",
"t": "Syntax errors gone",
"tone": "ok"
},
{
"s": "totals that do not reconcile",
"t": "Arithmetic errors survive"
},
{
"s": "a value in the wrong property",
"t": "Field placement survives",
"tone": "bad"
}
],
"note": "Most distractors are wrong-layer answers: the prompt doing the schema's job, or the schema doing validation code's job.",
"root": {
"s": "the guarantee ends at syntax",
"t": "tool_use + JSON schema",
"tone": "acc"
},
"t": "tree",
"title": "What tool_use with a JSON schema eliminates and what survives it"
},
"d4-13": {
"cap": "Left manufactures the value; right lets the model say null. Wording cannot override structural pressure.",
"left": {
"bullets": [
"30% of invoices carry no PO number",
"the schema guarantees a value anyway",
"the model returns a plausible PO number"
],
"t": "required: true with strict: true"
},
"mid": "fix",
"note": "Strict mode still requires additionalProperties: false and every property listed in required.",
"right": {
"bullets": [
"null when the source does not state it",
"absence becomes a correct extraction"
],
"t": "type: [\"string\", \"null\"]",
"tone": "ok"
},
"t": "beforeafter",
"title": "Required versus nullable for a field the source documents often omit"
},
"d4-14": {
"before": {
"s": "30% of the corpus",
"t": "Invoice with no PO number"
},
"cap": "Take the right exit: the nullable field tells the truth instead of filling the gap.",
"fail": {
"s": "reconciliation fails downstream",
"t": "Required invents a value"
},
"gate": {
"t": "Is the field nullable?"
},
"note": "A second verification call adds cost and can rationalise the original answer.",
"pass": {
"s": "absence signalled honestly",
"t": "Nullable returns null"
},
"t": "gate",
"title": "Gate: required field on a document whose source has no value"
},
"d4-15": {
"cap": "Read down the middle column: only 'any' guarantees a call while still letting the model choose the schema.",
"cols": [
"tool_choice",
"What it forces",
"Use when"
],
"note": "A named tool routes heterogeneous documents through one schema that fits none of them.",
"rows": [
[
"auto",
"Model may answer in text instead",
"Structured output is optional"
],
[
"any",
"A tool call is guaranteed; the model picks",
"Heterogeneous document types"
],
[
"{type: tool, name: extract_invoice}",
"This exact tool must be called",
"A mandated first step"
],
[
"none",
"No tool may be called",
"Tools must be forbidden"
]
],
"t": "table",
"title": "tool_choice settings and when each one is the right requirement"
},
"d4-16": {
"cap": "The document is untyped at the door and typed by the time validation runs.",
"nodes": [
{
"s": "no reliable classifier exists",
"t": "Invoice, receipt, PO or contract"
},
{
"s": "a tool call is guaranteed",
"t": "tool_choice: \"any\"",
"tone": "acc"
},
{
"s": "extract_invoice, extract_receipt, ...",
"t": "Model picks the fitting tool"
},
{
"s": "against the schema of the tool it chose",
"t": "Validate tool_use.input",
"tone": "ok"
}
],
"note": "auto still allows an escape into prose; a generic analyze_document tool reintroduces the loose shape.",
"t": "flow",
"title": "Why tool_choice: any handles documents with no reliable classifier"
},
"d4-17": {
"cap": "The right column is the strict-mode surface that accepts the key and ignores the constraint.",
"do": [
"Add \"unclear\" so an ambiguous case has an honest bucket",
"Add \"other\" plus a paired category_detail field",
"Keep ranges, lengths and patterns in validation code"
],
"doHead": "Do",
"dont": [
"Rely on minimum/maximum or pattern in a strict schema",
"Use oneOf or if/then/else",
"Rely on assistant prefill"
],
"dontHead": "Do not",
"note": "Supported in strict mode: type, properties, required, enum, const, items, anyOf, $ref, additionalProperties: false.",
"t": "checklist",
"title": "Strict mode: what to do in the schema and what to validate in code"
},
"d4-18": {
"cap": "The hub does nothing; its job is to make the API enforce the schema before you parse anything.",
"hub": {
"s": "exists only so the API enforces input_schema",
"t": "Fake tool: no business logic"
},
"note": "Structural failure means schema or tool use; semantic failure means validation code.",
"spokes": [
{
"s": "the exact payload shape the coordinator needs",
"t": "input_schema",
"tone": "acc"
},
{
"s": "already-validated tool input, no text parsing",
"t": "Read content[0].input",
"tone": "ok"
},
{
"s": "markdown wrapping breaks the parser",
"t": "Free-form 'give me JSON'"
},
{
"s": "cause schema drift under loose prompting",
"t": "Complex documents"
},
{
"s": "guarantees structure, never truth",
"t": "Schema validity is syntax",
"tone": "bad"
}
],
"t": "fanout",
"title": "The fake no-op tool: a typed contract the API enforces for you"
},
"d4-19": {
"before": {
"s": "the pipeline never fails schema validation",
"t": "100% schema-valid, amount read from the wrong row"
},
"cap": "The pipeline passes every schema check, so the defect cannot be structural - take the semantic exit.",
"fail": {
"s": "changes structure, not interpretation",
"t": "Tighter schema or a retry loop"
},
"gate": {
"t": "Structural or semantic defect?"
},
"note": "A schema-valid but wrong value is semantic; range and cross-field constraints are not enforced in strict mode.",
"pass": {
"s": "business-rule and cross-field checks",
"t": "Semantic validation"
},
"t": "gate",
"title": "Gate: a schema-valid extraction with a wrong value is a semantic defect"
},
"d4-2": {
"cap": "Read left to right: a finding only exists because one of these three lists claims it.",
"kids": [
{
"s": "claimed behaviour contradicts the code",
"t": "Flag"
},
{
"s": "severity anchored in a real code example",
"t": "Report",
"tone": "acc"
},
{
"s": "merely incomplete, could be more detailed",
"t": "Skip",
"tone": "warn"
}
],
"note": "Noisy category? Disable it, improve its criteria, then re-enable — do not tighten it in place.",
"root": {
"s": "what to flag, what to report, what to skip",
"t": "Every judgement needs three lists"
},
"t": "tree",
"title": "Prompt criteria split into what to flag, what to report and what to skip"
},
"d4-20": {
"cap": "The two segments need opposite treatments, so retrying all 900 as one population makes 700 fabrications.",
"note": "700 are absence (retry cannot recover it); 200 are output errors (retry with feedback fixes them).",
"segs": [
{
"pct": 78,
"t": "700 source gaps — no governing_law stated",
"tone": "warn"
},
{
"pct": 22,
"t": "200 format errors — date rejected",
"tone": "acc"
}
],
"t": "budget",
"title": "The 900 rejected contracts split into source gaps and format errors"
},
"d4-21": {
"cap": "Row three is the trap: a single fix for both populations either fabricates or discards the fixable 200.",
"cols": [
"Failure population",
"Cause",
"Correct response"
],
"note": "Null because the source is silent is a correct extraction.",
"rows": [
[
"700 contracts",
"The contract never states a governing law",
"Accept null — retries cannot recover absence"
],
[
"200 contracts",
"termination_notice_days is a date format the schema rejects",
"Retry with the document, the failed extraction and the exact error"
],
[
"A stem that retries all 900",
"One prompt for two different populations",
"Retry-with-feedback on the 200, null on the 700"
]
],
"t": "table",
"title": "The 900 rejected contracts: cause, count and correct response"
},
"d4-22": {
"cap": "The cycle only works on output errors. Absence, or a document never provided, never comes back fixed.",
"nodes": [
{
"t": "Validation error: format mismatch, misplaced value"
},
{
"t": "Resend the document, the failed extraction and the exact error",
"tone": "acc"
},
{
"t": "Re-validate against the schema",
"tone": "ok"
},
{
"t": "Recurring defect? structural fix, not another retry",
"tone": "warn"
}
],
"note": "temperature: 0 removes variability; it does not converge the format.",
"t": "loop",
"title": "Retry with feedback: the three things you resend, and when to stop"
},
"d4-23": {
"cap": "Without detected_pattern you know 35% of findings are dismissed but not which constructs to suppress.",
"hub": {
"t": "One finding payload"
},
"note": "Extract both totals so the mismatch surfaces for validation instead of being silently resolved.",
"spokes": [
{
"s": "dismissals aggregate by construct",
"t": "detected_pattern"
},
{
"s": "which rule fired",
"t": "rule_id or evidence",
"tone": "acc"
},
{
"s": "totals_match surfaces the gap",
"t": "stated_total + calculated_total"
},
{
"s": "plus review_reasons per field",
"t": "confidence, requires_review",
"tone": "ok"
}
],
"t": "fanout",
"title": "Fields a review bot needs to become measurable and routable"
},
"d4-24": {
"cap": "Follow the cycle to the bottom: it corrects formats and stops where the source holds no data.",
"nodes": [
{
"t": "Validation gate fails on a date in the wrong format"
},
{
"s": "name the field and the expected format",
"t": "Append the exact error in an assistant turn",
"tone": "acc"
},
{
"t": "Resend the document, the failed extraction, the error"
},
{
"s": "nullable field instead; threshold means hand off",
"t": "Re-validate; absent data is not a retry problem",
"tone": "warn"
}
],
"note": "A generic 'validation failed' reproduces the identical failure. A recurring defect means a structural fix.",
"t": "loop",
"title": "Retry-loop mechanics: append the error, resend three things, know the limit"
},
"d4-25": {
"cap": "Left forces a value that does not exist; right lets the model report absence honestly.",
"left": {
"bullets": [
"raise the retry limit",
"name the missing field in the feedback",
"the model invents a value",
"a default passes validation but is wrong"
],
"t": "Every retry fails on an absent tax ID"
},
"mid": "nullable",
"note": "Absence is a schema problem; no number of retries recovers information the source never contained.",
"right": {
"bullets": [
"type: [\"string\", \"null\"]",
"return null when the source does not state it",
"absence reported honestly, not forced"
],
"t": "Nullable field; null is a valid extraction",
"tone": "ok"
},
"t": "beforeafter",
"title": "Absent tax ID: retrying harder versus a nullable field that admits absence"
},
"d4-26": {
"cap": "Read the middle column: a workload only tolerates the batch window when nothing is waiting on it.",
"cols": [
"Workload",
"What it waits on",
"Where it runs"
],
"note": "Design for the 24-hour worst case, not the typical case; there is no latency SLA.",
"rows": [
[
"Pre-merge check",
"Developers blocked until it completes",
"Synchronous — a gate is waiting"
],
[
"Technical-debt report",
"Nobody, reviewed the next morning",
"Batch — 50% cheaper, 24h is free"
],
[
"Weekly audit, nightly tests",
"A deadline a day away",
"Batch — high volume, independent"
],
[
"Manager's 50% proposal",
"Both workflows at once",
"Mixed strategy, never all-or-nothing"
]
],
"t": "table",
"title": "Which workflow fits the Message Batches API: 50% cheaper, up to 24 hours"
},
"d4-28": {
"cap": "The first two rows never move to batch, whatever the saving; the third one always does.",
"head": "check the workload first — the first match decides",
"note": "A synchronous fallback still enters the batch queue first — the blocking job waits anyway.",
"rows": [
{
"act": "Synchronous — the 24h window is unacceptable",
"cond": "A developer or a gate is waiting on the result",
"tone": "bad"
},
{
"act": "Synchronous — batch cannot run it at all",
"cond": "A multi-turn tool loop inside one request",
"tone": "bad"
},
{
"act": "Batch — non-blocking, independent, deadline-flexible",
"cond": "Overnight report, nightly test, weekly audit",
"tone": "ok"
}
],
"t": "ladder",
"title": "Sort the workload before sorting the cost: blocking versus deadline-flexible"
},
"d4-3": {
"cap": "Read the middle column: the 52% and 48% rows destroy trust in the 8% row, so those categories come off.",
"cols": [
"Finding category",
"False positives",
"What to do"
],
"note": "A confidence score on every finding leaves the noise on screen while accuracy improves slowly.",
"rows": [
[
"Security and correctness",
"8%",
"Keep enabled — this is why anyone reads the report"
],
[
"Performance",
"18%",
"Keep enabled, watch the rate"
],
[
"Style and naming",
"52%",
"Disable, rewrite the criteria, re-enable"
],
[
"Documentation",
"48%",
"Disable, rewrite the criteria, re-enable"
]
],
"t": "table",
"title": "False-positive rate and the right action per finding category"
},
"d4-30": {
"cap": "The right column all assume position; only the custom_id survives results arriving in any order.",
"do": [
"Attach a unique, meaningful custom_id to every request",
"Trace each result back by its custom_id",
"Resubmit only the failures identified by custom_id"
],
"doHead": "Do",
"dont": [
"Match results by their index or submission order",
"Use throwaway UUIDs you cannot trace to a PR",
"Rely on batch creation order to tell workloads apart"
],
"dontHead": "Do not",
"note": "A custom_id is an address: it survives a partial re-run and a lost mapping. Batch is single-turn.",
"t": "checklist",
"title": "custom_id as an address: unique and meaningful, never a random UUID"
},
"d4-31": {
"before": {
"s": "arrive hours later in arbitrary order",
"t": "500 review + 500 test-generation results"
},
"cap": "The stem is about correlation, not cost - take the exit that echoes an identifier back.",
"fail": {
"s": "order is not preserved; text is fragile",
"t": "Match by index, batch order or parsed text"
},
"gate": {
"t": "Can a result be traced to its request?"
},
"note": "Results arrive in any order, so index matching and batch-creation order both fail.",
"pass": {
"s": "the ID echoed on each result",
"t": "Join on custom_id"
},
"t": "gate",
"title": "Gate: matching 500 results to 500 requests is a custom_id problem"
},
"d4-32": {
"cap": "Look at what crosses the arrow: the artifact and the criteria, never the reasoning that produced them.",
"left": {
"bullets": [
"keeps the reasoning that produced the output",
"biased toward its prior conclusions",
"self-critique is the rationalisation loop"
],
"t": "Same session self-review"
},
"mid": "restart",
"note": "Non-obvious regressions were only caught when another team member read the PR.",
"right": {
"bullets": [
"no generation history",
"more likely to question the decisions"
],
"t": "Fresh instance: artifact and criteria only",
"tone": "ok"
},
"t": "beforeafter",
"title": "Reviewing inside the generating session versus an independent instance"
},
"d4-33": {
"cap": "Every item on the right keeps one perspective in place and changes something else.",
"do": [
"Run a second independent instance",
"Give the reviewer the artifact and the criteria only",
"Keep the generator's reasoning out of the review"
],
"doHead": "Do",
"dont": [
"Extend thinking on the same chain of reasoning",
"Ask the model to critique its own suggestions",
"Add more context to the same perspective"
],
"dontHead": "Do not",
"note": "Same reasoning context means the same bias, however deep the deliberation.",
"t": "checklist",
"title": "Catching self-approved mistakes: independent review versus more deliberation"
},
"d4-35": {
"cap": "Note what is missing: overall accuracy is not the filter, and neither is a bare 0.9 score.",
"note": [
"Calibrate thresholds on a labelled validation set before raising automation.",
"Measure by segment: document type, field, source quality, confidence band.",
"Filtering low-confidence findings hides them; routing them calibrates the system."
],
"stages": [
{
"t": "Every extracted field"
},
{
"t": "Low calibrated confidence, contradictory sources, failed semantic validation",
"tone": "warn"
},
{
"t": "Human review queue",
"tone": "acc"
}
],
"t": "funnel",
"title": "Routing extracted fields to human review on calibrated confidence"
},
"d4-36": {
"cap": "Follow the chain: the wrong options all describe a fix that belongs one layer to the left or right.",
"nodes": [
{
"s": "vague findings, invented values, rejected batches",
"t": "A failure shows up"
},
{
"s": "prompt, schema, validation or source",
"t": "Name the layer that failed",
"tone": "acc"
},
{
"s": "criteria, nullable field, retry, batch split",
"t": "Fix it at that layer"
},
{
"s": "that is what every distractor does",
"t": "Never move the fix one layer away",
"tone": "bad"
}
],
"note": "Categorical criteria beat adjectives; tool_use kills syntax only; the generator cannot review itself.",
"t": "flow",
"title": "Domain 4 in one breath: name the layer, then name the fix"
},
"d4-4": {
"cap": "Left describes the reviewer harder; right defines what qualifies. Same reviewer, one prompt change.",
"left": {
"bullets": [
"47 findings per PR",
"naming opinions, unenforced style",
"sub-5ms micro-optimisations",
"a 1000-line prompt still guesses the boundary"
],
"t": "Be thorough and conservative"
},
"mid": "define",
"note": "Adding words creates more surface area for ambiguity, not less. Code anchors beat a prose rubric.",
"right": {
"bullets": [
"3 findings, all real: SQL injection, race condition",
"critical = SQL injection, XSS, CSRF",
"skip = style, snake_case, sub-5ms tweaks"
],
"t": "Explicit flag, severity and skip lists",
"tone": "ok"
},
"t": "beforeafter",
"title": "The instruction ceiling: more adjectives versus explicit categorical lists"
},
"d4-5": {
"before": {
"s": "vague instructions produce unpredictable output",
"t": "~50 findings per PR; developers dismiss them all"
},
"cap": "Take the right exit: explicit criteria are the documented first step, not another adjective.",
"fail": {
"s": "uncalibrated, drifts across runs",
"t": "A confidence adjective or an 80% score"
},
"gate": {
"t": "Boundary or threshold?"
},
"note": "Few-shot examples refine the criteria afterwards; they are not the first step.",
"pass": {
"s": "flag X, severity anchors, skip Z",
"t": "Explicit categorical criteria"
},
"t": "gate",
"title": "Gate: boundary-setting criteria versus threshold-fiddling on the first step"
},
"d4-6": {
"bands": [
{
"s": "a case the instructions handle inconsistently",
"t": "Input: the ambiguous scenario"
},
{
"s": "the exact format the pipeline downstream needs",
"t": "Output: the required shape"
},
{
"s": "this is the part that generalises",
"t": "Reasoning: why this output beats the plausible alternatives",
"tone": "acc"
}
],
"cap": "Use 2-4 of these, not 1 and not 10. The bottom band is what carries the pattern to novel cases.",
"note": "Instructions grow linearly; edge cases grow combinatorially.",
"t": "layers",
"title": "Anatomy of one few-shot example: input, output, and the reasoning why"
},
"d4-7": {
"cap": "Look at the left column: the fix is a demonstration, not a more precise description.",
"do": [
"Add 3-4 few-shot examples",
"Show identified issue, location, concrete fix",
"Write the fix as someone would apply it"
],
"doHead": "Do — demonstrate the shape",
"dont": [
"Refine the instructions further",
"Expand the context window for fixes",
"Split into a two-pass fix generator"
],
"dontHead": "Do not",
"note": "The stem already showed that more instructions do not converge the output.",
"t": "checklist",
"title": "Non-actionable feedback: demonstrate the shape, not a harder description"
},
"d4-8": {
"cap": "Cover the shapes you really receive: each spoke teaches what a valid extraction looks like.",
"hub": {
"s": "one set, not ten of one shape",
"t": "2-4 examples, varied structures"
},
"note": "Without varied structures the model invents data to fit the schema.",
"spokes": [
{
"s": "author-date inside prose",
"t": "Inline citations"
},
{
"s": "reference list at the end",
"t": "Bibliographies"
},
{
"s": "facts buried in paragraphs",
"t": "Narrative prose"
},
{
"s": "values in columns",
"t": "Tables"
},
{
"s": "\"about 5k\", \"Q3\"",
"t": "Informal units",
"tone": "acc"
}
],
"t": "fanout",
"title": "A few-shot example set spanning the document structures actually received"
},
"d4-9": {
"cap": "Row two is the anatomy: the output is specific, the reasoning is what carries the pattern.",
"cols": [
"Example carries",
"What the model learns",
"On novel inputs"
],
"note": "The answer is specific; the reasoning behind it is what generalises. Two to four examples is the sweet spot.",
"rows": [
[
"Input and output label",
"Pattern matching the answer",
"Restricted to the cases shown"
],
[
"Input, reasoning, output",
"A decision rule to apply",
"Generalises to new inputs"
],
[
"Six to eight examples",
"Context bloat",
"Pushed back into pattern matching"
]
],
"t": "table",
"title": "Anatomy of a few-shot example: output tells what, reasoning tells how"
},
"d5-1": {
"cap": "Follow the 15% as it turns into 'promotional pricing was discussed': the loss happens at the summary, not at the reply.",
"marks": [
{
"s": "stated in the support thread",
"t": "Customer: '15% discount'"
},
{
"s": "'promotional pricing was discussed'",
"t": "Turn 20 — summarizer runs"
},
{
"s": "confident apology, wrong value",
"t": "Turn 34 — agent answers 8%"
}
],
"note": "Raising the threshold from 70% to 85% only moves the loss to the next trigger.",
"t": "timeline",
"title": "Loss of the 15% discount across summarization turns"
},
"d5-10": {
"bands": [
{
"s": "customer_id · issue_summary · order_id · root_cause",
"t": "escalate_to_human payload",
"tone": "acc"
},
{
"s": "actions_taken · recommended_action · escalation_reason",
"t": "The rest of what the human reads"
},
{
"s": "the transcript — 'please advise' sends them back to the start",
"t": "What the human never sees",
"tone": "bad"
}
],
"cap": "The handoff must stand alone: there is no transcript underneath it for the human to fall back on.",
"t": "layers",
"title": "What the human receives at escalation versus what they never see"
},
"d5-11": {
"cap": "Every field is one the coordinator can act on — alternatives and coverage impact are exactly what 'search failed' threw away.",
"cols": [
"Field",
"In this run"
],
"rows": [
[
"failure_type",
"transient — Connection timeout, not a bad query"
],
[
"attempted_query",
"patent db: solid-state battery 2024"
],
[
"partial_results",
"15 papers from the academic databases"
],
[
"alternative_approaches",
"narrower query · fallback source · retry_after"
],
[
"coverage_impact",
"1 of 3 source categories"
],
[
"is_retryable / retry_after_ms",
"true / 2000"
]
],
"t": "table",
"title": "The structured error a research subagent sends up"
},
"d5-13": {
"cap": "Same subagent, same channel: one outcome is an access failure to retry, the other is a successful query that found nothing.",
"head": "decide per outcome, not per run",
"rows": [
{
"act": "Access failure — retry, honour retry_after_ms",
"cond": "Connection timeout from the patent db",
"tone": "warn"
},
{
"act": "Valid empty result — report it as the finding",
"cond": "'0 results' from industry reports"
},
{
"act": "Success — use the results, do not re-run",
"cond": "15 relevant papers from academic databases"
},
{
"act": "Never — it hides which part is retryable",
"cond": "Collapse the three into '67% coverage'",
"tone": "bad"
}
],
"t": "ladder",
"title": "Timeout versus '0 results': opposite decisions from one channel"
},
"d5-14": {
"cap": "Two of these look like virtues — graceful continuation and decisive abort — and both leave the coordinator unable to recover.",
"cols": [
"Wrong pattern",
"Why recoverability dies"
],
"rows": [
[
"Return empty results with a success status",
"Silent suppression — the coordinator has no recovery path"
],
[
"Abort the whole workflow on one timeout",
"Discards the partial results the other subagents produced"
],
[
"Catch the exception and log it for later review",
"The running model receives no signal at all"
],
[
"Retry indefinitely until it succeeds",
"Spends budget on permanent failures"
],
[
"Retry inside the subagent, return a generic status",
"The retry was right; the generic status is the defect"
]
],
"t": "table",
"title": "Five failure-handling patterns that destroy recoverability"
},
"d5-15": {
"cap": "None of the right-hand moves touches the cause: high-signal early findings drowning in high-volume later exploration.",
"do": [
"Externalize the early high-signal findings",
"Read 30-minute drift as attention dilution, not capacity"
],
"doHead": "Treat the cause",
"dont": [
"Switch to a larger model or a bigger context window",
"Restart the exploration with a fresh context",
"Raise the temperature so answers stay specific"
],
"dontHead": "The capacity reflexes",
"t": "checklist",
"title": "Attention dilution: externalize the findings, not a bigger window"
},
"d5-16": {
"cap": "The scratchpad survives compaction and crashes — readable exactly when the agent starts describing 'typical patterns'.",
"left": {
"bullets": [
"larger model, bigger context window",
"restart with a fresh context",
"raise temperature for specificity"
],
"t": "Treat it as a capacity problem"
},
"mid": "fix",
"right": {
"bullets": [
"scratchpad: file:line, entry points, known issues",
"consult it when answers start going generic"
],
"t": "Externalize the findings",
"tone": "ok"
},
"t": "beforeafter",
"title": "Thirty-minute drift: capacity reflexes versus a scratchpad"
},
"d5-17": {
"cap": "Phase 1 discovery is the flood: it runs in a subagent, and only its distilled result re-enters the conversation.",
"marks": [
{
"s": "the discovery flood stays out",
"t": "Phase 1 — Explore subagent"
},
{
"s": "before phase 2 subagents spawn",
"t": "Phase summary injected"
},
{
"s": "in the main conversation",
"t": "Phase 2 — design"
},
{
"s": "agent-state/manifest.json on resume",
"t": "Checkpoint"
}
],
"note": "Use /compact proactively — compaction after pollution is lossy.",
"t": "timeline",
"title": "Isolate, summarize, checkpoint across a three-phase refactor"
},
"d5-18": {
"bands": [
{
"s": "the headline the team wants to ship on",
"t": "97% overall accuracy",
"tone": "warn"
},
{
"s": "handwritten notes sit at 45%, not 97%",
"t": "By document type",
"tone": "bad"
},
{
"s": "a single field can sit at 42%",
"t": "By field segment"
}
],
"cap": "The validation set is mostly clean printed invoices; the strata that carry the business value barely appear in it.",
"t": "layers",
"title": "Drilling from the 97% aggregate down to document type and field"
},
"d5-19": {
"before": {
"t": "97% overall on the validation set"
},
"cap": "Same pipeline, same 97%: the gate asks what the headline hides before human review is switched off.",
"fail": {
"s": "no stratum check behind it",
"t": "Automate on the headline",
"tone": "bad"
},
"gate": {
"t": "Break accuracy down by type and field"
},
"pass": {
"s": "document type and field",
"t": "Automate with per-stratum evidence"
},
"t": "gate",
"title": "The 97% headline through the per-stratum gate"
},
"d5-20": {
"cap": "Novel error patterns arrive high-confidence by definition, so only an audit that samples the confident band ever finds them.",
"nodes": [
{
"t": "A new document template goes live"
},
{
"t": "Extractions come back 0.9 — high confidence"
},
{
"t": "Nothing routes to human review"
},
{
"t": "Stratified audit re-samples the high-confidence band",
"tone": "acc"
}
],
"note": "Emit per-field confidence, calibrated on labeled data.",
"t": "loop",
"title": "The audit loop that catches drift the confidence threshold cannot"
},
"d5-21": {
"cap": "Every finding travels with its claim, source URL and date — flattening them into prose is where attribution dies.",
"nodes": [
{
"s": "claim + source_url + excerpt, in the payload",
"t": "Subagent states the finding"
},
{
"s": "publication_date, source_type, certainty label",
"t": "Mapping stays structured"
},
{
"s": "never flattened into narrative prose",
"t": "Downstream merges mappings",
"tone": "ok"
}
],
"note": "A bibliography at the end separates sources from claims — the link is lost on merge.",
"t": "flow",
"title": "How a claim carries its source through every downstream agent"
},
"d5-23": {
"cap": "The subagent finishes its own work and hands the hub a decision only the hub can make, with both numbers still on the table.",
"left": {
"bullets": [
"credibility heuristic picks 40%, plus a footnote",
"both numbers included but unmarked",
"stop and escalate before continuing"
],
"t": "Tidy the disagreement away"
},
"mid": "annotate",
"right": {
"bullets": [
"40% government report, 12% industry analysis",
"source attribution on each value",
"coordinator reconciles before synthesis"
],
"t": "Preserve both, annotate the conflict",
"tone": "ok"
},
"t": "beforeafter",
"title": "40% against 12%: tidying the conflict versus preserving it"
},
"d5-24": {
"cap": "Two exits, one outcome: whether the window deletes the turn or a summary rewrites it, only the case-facts block keeps the spine.",
"cols": [
"How the fact leaves the window",
"What survives the trip"
],
"note": "Progressive summarization that drops numbers is a reliability failure mode, not an efficiency issue.",
"rows": [
[
"Sliding window deletes the turn outright",
"Nothing — a deleted turn cannot be recovered"
],
[
"Progressive summarization rewrites it lossily",
"A distorted amount, not a preserved one"
],
[
"Lazy summary keeps none of the spine",
"'customer reported delivery and product issues' — no ID, order or amount"
],
[
"Case-facts block, outside both",
"customer_id, order_id, refund_amount, order_date, policy_window_days"
]
],
"t": "table",
"title": "Deletion, summarization, or the case-facts block: what survives"
},
"d5-25": {
"bands": [
{
"s": "highest attention: customer_id, order_id, refund_amount",
"t": "Zone 1 — case-facts block at the top",
"tone": "acc"
},
{
"s": "the low-attention valley: lean, immediate decision only",
"t": "Zone 2 — trimmed tool results in the middle",
"tone": "warn"
},
{
"s": "the critical recap plus the live customer question",
"t": "Zone 3 — recap, policy line, final question at the end",
"tone": "ok"
}
],
"cap": "The facts sit in the prompt either way — this layout decides whether the refund amount lands where attention actually falls.",
"note": "Trim raw tool outputs to the fields the decision needs before they are appended.",
"t": "layers",
"title": "Three-zone prompt layout: case facts, trimmed tool results, live question"
},
"d5-26": {
"cap": "Three triggers on top, three diligence-shaped non-triggers below: escalation is never a fallback for a hard problem.",
"head": "three triggers escalate — everything else is diligence in costume",
"rows": [
{
"act": "Escalate now — no 'let me try first', no confirming question",
"cond": "Customer explicitly asks for a person"
},
{
"act": "Escalate — a human decides",
"cond": "Case needs a policy exception the agent lacks authority for"
},
{
"act": "Escalate — retries done, no progress",
"cond": "Stuck after exhausting reasonable retries"
},
{
"act": "Not a trigger — resolve if the policy covers it",
"cond": "Negative sentiment alone",
"tone": "bad"
},
{
"act": "Not a trigger — complexity is not a trigger",
"cond": "Task complexity alone",
"tone": "bad"
},
{
"act": "Never — uncalibrated, can say 95% and still be wrong",
"cond": "Model self-reported confidence score",
"tone": "bad"
}
],
"t": "ladder",
"title": "Escalation: three real triggers versus three diligence-shaped non-triggers"
},
"d5-27": {
"before": {
"t": "Sarah: 'I just want to speak to an actual person'"
},
"cap": "Frustration is loud but it is not the trigger — the explicit request is, and it fires before any resolution attempt.",
"fail": {
"s": "each overrides her explicit ask",
"t": "Resolve-first, ask why, or self-service",
"tone": "bad"
},
"gate": {
"t": "Explicit human request — trigger #1"
},
"pass": {
"s": "no further resolution attempt",
"t": "Escalate now with a structured handoff"
},
"t": "gate",
"title": "Sarah's explicit human request through the escalation gate"
},
"d5-28": {
"cap": "Silent suppression hides the failure and self-termination discards the work — termination is the coordinator's call.",
"do": [
"Subagent propagates the failure upward, never aborts",
"Tool signals isError / errorCategory to its subagent",
"Subagent does local recovery: 1-2 retries with backoff",
"Unresolved failure reaches the coordinator, structured"
],
"doHead": "Only the coordinator may terminate",
"dont": [
"Returns status ok with empty results (silent suppression)",
"Subagent aborts the whole pipeline on its own failure",
"Generic status replaces category, retryable, partials"
],
"dontHead": "The two anti-patterns",
"t": "checklist",
"title": "Only the coordinator terminates: subagents propagate, never abort"
},
"d5-29": {
"cap": "A generic status paralyses the coordinator; the structured payload is what lets it retry, accept or re-route.",
"left": {
"bullets": [
"coordinator cannot tell transient from permanent",
"no partial results, no fallback source named",
"retry the whole query set, report 'incomplete'"
],
"t": "Generic 'search unavailable' status"
},
"mid": "fix",
"right": {
"bullets": [
"error category · is retryable",
"attempted query · partial results",
"alternatives the coordinator can act on"
],
"t": "Structured error context",
"tone": "ok"
},
"t": "beforeafter",
"title": "Generic 'search unavailable' versus a structured error context"
},
"d5-3": {
"cap": "The do column makes preservation deterministic; every don't item still depends on the model choosing to keep the number that pass.",
"do": [
"Hold amounts, dates and order IDs in a case-facts block",
"Inject that block verbatim on every prompt"
],
"doHead": "Deterministic preservation",
"dont": [
"Raise the summarization threshold from 70% to 85%",
"Rewrite the summarization prompt to keep every number",
"Retrieve full history only when the agent notices"
],
"dontHead": "Still best-effort",
"t": "checklist",
"title": "Case-facts block versus the three tempting summary fixes"
},
"d5-30": {
"cap": "Claude Code will not create the scratchpad on its own — instruct it where it loads every time, since /compact cannot run headless.",
"cols": [
"Mechanism",
"What it is",
"Where it must be instructed"
],
"rows": [
[
"Scratchpad",
"findings + files read; re-read when the window fills",
"session prompt, CLAUDE.md or the subagent loop"
],
[
"Manifest (manifest.json)",
"the checkpoint, written before each major step",
"a predictable path inside .claude"
],
[
"/compact",
"compaction near ~90% of the window",
"interactive only — cannot run in CI/CD"
]
],
"t": "table",
"title": "Scratchpad, manifest and /compact: what must be instructed, and where"
},
"d5-31": {
"cap": "No operator and no typed commands: only CLAUDE.md reaches a headless run, so the scratchpad and manifest must live there.",
"left": {
"bullets": [
"/compact cannot be invoked in a CI/CD pipeline",
"restart from scratch hits the same wall",
"a bigger window does nothing for a crash"
],
"t": "Rely on the session to remember"
},
"mid": "fix",
"right": {
"bullets": [
"scratchpad keeps findings across compaction",
"manifest.json checkpoint at a predictable path",
"a restart resumes from the last checkpoint"
],
"t": "CLAUDE.md: scratchpad + manifest",
"tone": "ok"
},
"t": "beforeafter",
"title": "Headless CI/CD refactor: relying on /compact versus CLAUDE.md + manifest"
},
"d5-32": {
"cap": "Follow the average down: the failures cluster in the low-volume, high-stakes stratum that the aggregate never surfaces.",
"stages": [
{
"s": "printed PDFs | scans | handwritten | legal contracts",
"t": "Categorise documents into strata"
},
{
"s": "even the 5% bucket gets its own sample",
"t": "Sample a representative batch per stratum"
},
{
"s": "97% overall can hide 60% on handwritten receipts",
"t": "Measure accuracy per category, not the average"
},
{
"s": "act immediately on the stratum where failures cluster",
"t": "Route the failing category to human review",
"tone": "ok"
}
],
"t": "funnel",
"title": "Stratified sampling: from the overall average to the failing category"
},
"d5-33": {
"before": {
"t": "96% overall · document-level confidence >80%"
},
"cap": "The document score hides a field that fails in one stratum — errors in one category are systematic, so the average masks them.",
"fail": {
"s": "a confident document hides a failing field",
"t": "Trust the document-level score",
"tone": "bad"
},
"gate": {
"t": "Are legal contracts measured as their own stratum?"
},
"pass": {
"s": "legal contracts get their own accuracy number",
"t": "Stratified sampling per category",
"tone": "ok"
},
"t": "gate",
"title": "Legal contracts through the per-stratum measurement gate"
},
"d5-34": {
"cap": "Wrong answers here are diligence in costume — a threshold, a classifier, a bigger window — so name the failing layer first.",
"kids": [
{
"s": "case-facts block, outside the summary",
"t": "5.1 history"
},
{
"s": "explicit request, policy gap, no progress",
"t": "5.2 boundary"
},
{
"s": "failure type + partials + alternatives",
"t": "5.3 reporting"
},
{
"s": "scratchpad, manifest checkpoint, /compact",
"t": "5.4 memory"
},
{
"s": "per-stratum accuracy, claim + source",
"t": "5.5-5.6 verification"
}
],
"root": {
"s": "ask before choosing a fix",
"t": "Which layer is the failure actually at?"
},
"t": "tree",
"title": "One diagnostic question covering every layer in domain 5"
},
"d5-4": {
"cap": "The middle 50K is not missing for lack of space — it is where attention is thinnest. Move the key findings to the front.",
"note": "The API is stateless: send the complete messages array on every request.",
"segs": [
{
"pct": 20,
"t": "First 15K — cited",
"tone": "ok"
},
{
"pct": 67,
"t": "Middle 50K — skipped",
"tone": "bad"
},
{
"pct": 13,
"t": "Last 10K — cited",
"tone": "ok"
}
],
"t": "budget",
"title": "Attention across a 75K-token aggregate: first 15K, middle 50K, last 10K"
},
"d5-5": {
"cap": "Both panels hold the same 75K; only the right one moves the answering passage out of the low-attention middle.",
"left": {
"bullets": [
"detail the synthesis agent needs is discarded",
"the middle 50K stays unattended"
],
"t": "Compress to fit under 20K"
},
"mid": "reorder",
"right": {
"bullets": [
"detail sits behind explicit headers",
"placement fixed, nothing shrunk"
],
"t": "Key findings first + section headers",
"tone": "ok"
},
"t": "beforeafter",
"title": "Compressing the aggregate versus reordering it"
},
"d5-6": {
"cap": "Scan the right column: the first three are triggers, and the last two are the empathy-shaped distractors.",
"cols": [
"Signal",
"Escalate?"
],
"rows": [
[
"Explicit human request",
"Yes — escalate now, no investigation first"
],
[
"Policy gap or exception the agent cannot decide",
"Yes — the agent never invents policy"
],
[
"No meaningful progress after real attempts",
"Yes"
],
[
"Hard refund rule above a threshold",
"Not in prose — enforce in code or a hook"
],
[
"Self-rated confidence below a threshold",
"No"
],
[
"Negative sentiment, conversation length",
"No — sentiment is not a trigger"
]
],
"t": "table",
"title": "Escalation triggers versus non-triggers"
},
"d5-8": {
"cap": "The left column teaches the boundary the agent is missing; the right column routes on mood or a number nobody calibrated.",
"do": [
"Add explicit escalation criteria to the system prompt",
"Show few-shot examples: escalate versus resolve autonomously"
],
"doHead": "Fix the boundary in the prompt",
"dont": [
"Self-rate confidence 1-10 and route below a threshold",
"Train a routing classifier on historical tickets",
"Escalate automatically past a negative-sentiment threshold"
],
"dontHead": "Route on inferred signals",
"t": "checklist",
"title": "Unclear escalation boundary: explicit criteria versus inferred signals"
},
"d5-9": {
"cap": "Only the customer holds the fact that disambiguates them — everything else on the branch is a guess with better manners.",
"kids": [
{
"s": "one extra turn, decisive",
"t": "Ask for email, phone or order number",
"tone": "ok"
},
{
"s": "wrong account 15% of the time",
"t": "Pick the customer with the most recent order",
"tone": "bad"
},
{
"s": "guessing survives inside the confident band",
"t": "Act above 85% confidence",
"tone": "bad"
},
{
"s": "the algorithm makes the same wrong pick",
"t": "Rank one most-likely match inside the tool"
}
],
"root": {
"s": "a name search matches more than one account",
"t": "get_customer returns 7 John Smiths"
},
"t": "tree",
"title": "Four ways to resolve an ambiguous customer match"
},
"o1-1": {
"cap": "Watch the spokes: each missing input is a hole the model fills with its average.",
"hub": {
"t": "A prompt is a work order, not a wish"
},
"note": "Every element you omit is replaced with a generic average of the training data.",
"spokes": [
{
"s": "who Claude is playing",
"t": "Role"
},
{
"s": "the CTOs she is trying to reach",
"t": "Audience"
},
{
"s": "the product briefing never pasted in",
"t": "Source material",
"tone": "bad"
},
{
"s": "three bullets, under 60 words each",
"t": "Format and length"
},
{
"s": "what to include, what to avoid",
"t": "Constraints"
}
],
"t": "fanout",
"title": "Five inputs an effective prompt names"
},
"o1-10": {
"cap": "The final marker is the one every distractor skips - your own eyes on the numbers.",
"marks": [
{
"s": "\"find insights\" is not a spec",
"t": "Upload the regional sales spreadsheet"
},
{
"s": "and which questions it can answer",
"t": "Pass one: what does the data contain?"
},
{
"s": "structure first, then drill in",
"t": "Run the analyses that matter"
},
{
"s": "quality control you cannot delegate",
"t": "Check key figures against the source"
}
],
"note": "\"Interesting insights\" is the lazy-analysis tell in exam stems.",
"t": "timeline",
"title": "Ground the analysis, then verify with your own eyes"
},
"o1-11": {
"bands": [
{
"s": "role, audience, source, format, constraints - your missing input",
"t": "Spec it",
"tone": "acc"
},
{
"s": "extract, outline, draft, consistency pass - verify cheap steps first",
"t": "Split it"
},
{
"s": "iterate with specifics in the same chat; self-scores change nothing",
"t": "Check it"
},
{
"s": "examples, real documents, Project knowledge - evidence, not adjectives",
"t": "Feed it"
},
{
"s": "data for analysis, sources for research, samples for drafting",
"t": "Match it"
}
],
"cap": "Five bands, one habit: the spec, the structure, and verification stay in your hands.",
"note": "Any option that has Claude evaluate its own output is a flagged distractor.",
"t": "layers",
"title": "Domain 1 in one page"
},
"o1-2": {
"cap": "Left column: every shortcut changes effort or confidence, never the prompt's inputs.",
"left": {
"bullets": [
"One line, no briefing attached",
"150 words of interchangeable cheerleading",
"Wrong tone for the CTOs she's reaching"
],
"t": "\"Write a LinkedIn post about our new product\""
},
"mid": "spec it",
"right": {
"bullets": [
"Paste the briefing and last quarter's numbers",
"One past output that landed well",
"Three bullets, no exclamation points"
],
"t": "Spec it: role, audience, source, format"
},
"t": "beforeafter",
"title": "A wish vs a work order"
},
"o1-3": {
"cap": "Each arrow is a checkpoint: catch an invented fact before it rides into the prose.",
"nodes": [
{
"s": "review the cheap step first",
"t": "Extract the source facts",
"tone": "acc"
},
{
"s": "before any prose is written",
"t": "Agree the outline"
},
{
"s": "each step feeds the next",
"t": "Draft one section at a time"
},
{
"s": "catches drift and invention",
"t": "Final consistency pass"
}
],
"note": "One mega-prompt forces the model to invent structure, content, and quality bar at once.",
"t": "flow",
"title": "Big asks break into a checked chain"
},
"o1-4": {
"cap": "Read the right column: three of the four fixes leave the structure untouched.",
"cols": [
"Proposed fix",
"What it actually changes"
],
"note": "\"Comprehensive and accurate\" is a wish, not a workflow.",
"rows": [
[
"Sequence it: extract and organize the policies, review, approve an outline, then draft",
"The structure of the work - the root fix"
],
[
"Re-ask with \"comprehensive, accurate, based only on the documents\"",
"Emphasis - adjectives where structure is missing"
],
[
"Have Claude evaluate its own draft and improve it",
"Nothing - models tend to approve their own work"
],
[
"Start a new chat and re-ask the original request",
"Another roll of the same overloaded dice"
]
],
"t": "table",
"title": "Four proposed fixes for the generic curriculum"
},
"o1-5": {
"cap": "Left: each line says what to change and for whom. Right: nothing new to act on.",
"do": [
"Cut this to one page",
"Open with the delay and its cost",
"Drop the methodology paragraph",
"Write like you're briefing a busy CFO"
],
"doHead": "A corrective follow-up names",
"dont": [
"\"Make it better\"",
"\"More professional\"",
"\"Rate this draft out of ten\"",
"Restart in a new chat"
],
"dontHead": "Verdicts give nothing new",
"note": "Drafts converge in two or three rounds - then you make the final edits.",
"t": "checklist",
"title": "Iterate with specifics, not verdicts"
},
"o1-6": {
"before": {
"s": "right content, wrong voice for a casual brand",
"t": "Draft reads stiff and corporate"
},
"cap": "The gate asks for evidence: self-review and rerolls both land on the fail exit.",
"fail": {
"s": "the model guesses at \"casual and direct\" again",
"t": "Self-score, or regenerate from the original prompt"
},
"gate": {
"t": "Does the follow-up bring new evidence?"
},
"note": "Whenever an option says \"have Claude evaluate its own output\", flag it.",
"pass": {
"s": "same conversation keeps the content you like",
"t": "Paste two past announcements, rewrite in that style"
},
"t": "gate",
"title": "Which follow-up fixes the voice?"
},
"o1-7": {
"cap": "The third branch is the trap: fluent, confident, and in the wrong house style.",
"kids": [
{
"s": "the prompt plus pasted material",
"t": "The conversation",
"tone": "ok"
},
{
"s": "instructions, style guide, past deliverables",
"t": "The Project",
"tone": "ok"
},
{
"s": "your firm's voice, clients, last quarter's numbers",
"t": "Invisible to Claude",
"tone": "bad"
}
],
"note": "Examples beat adjectives - two or three real samples carry the style.",
"root": {
"s": "everything else is the generic average",
"t": "What Claude can actually see"
},
"t": "tree",
"title": "If it's not in the conversation or the Project, it isn't known"
},
"o1-8": {
"cap": "The samples exist, so any option that ignores them is already eliminated.",
"left": {
"bullets": [
"\"Confident, visionary, executive tone\"",
"Sentence length, vocabulary, rhythm",
"Or imitate well-known CEOs"
],
"t": "Describe the tone instead"
},
"mid": "show it",
"right": {
"bullets": [
"Plus a note on the recurring structure",
"This week's update from the same bullet facts",
"Reusable every week, no re-describing"
],
"t": "Three real CEO emails in a Project"
},
"t": "beforeafter",
"title": "Make this week's update sound like the CEO"
},
"o1-9": {
"cap": "Each row buys a different play; one template for everything fails a different way.",
"head": "read the task type first - first match wins",
"note": "Distractors apply another task's play - brainstorming freedom to an analysis job.",
"rows": [
{
"act": "hand over the data, structure the findings first, verify key figures yourself",
"cond": "Analysis - a pricing spreadsheet to interpret"
},
{
"act": "use research mode, ask for sources, spot-check the citations",
"cond": "Research - anything time-sensitive"
},
{
"act": "define audience, purpose and format, supply voice examples",
"cond": "Drafting - a proposal or an announcement"
},
{
"act": "ask for twenty, including the odd ones you'd reject, then critique",
"cond": "Brainstorming - campaign names"
},
{
"act": "the fast model is enough; deep analysis wants the capable one",
"cond": "Routine extraction or a simple draft",
"tone": "acc"
}
],
"t": "ladder",
"title": "Match the play to the task"
},
"o2-1": {
"cap": "Left is the shortcut that trusts polish; right is the fact-checker's read.",
"left": {
"bullets": [
"Fluent, well-structured prose feels like truth",
"Specific dates and clean comparisons pass unread",
"A confident draft ships because it sounds informed"
],
"t": "Read for polish"
},
"mid": "the shortcut",
"note": "A hallucination is made of the same fluent prose as a true statement.",
"right": {
"bullets": [
"Is what is here true? Trace each concrete claim",
"Is what is missing important? Accuracy is not completeness",
"Scale the check to the stakes"
],
"t": "Read like a fact-checker"
},
"t": "beforeafter",
"title": "Fluency is a property of the model, not a signal of truth"
},
"o2-10": {
"cap": "Watch the chain: an explicit brief, then a comparison against the source.",
"marks": [
{
"s": "dense, thorough, precise",
"t": "Verified vendor analysis"
},
{
"s": "non-technical, ten minutes, renew or switch",
"t": "Brief the board"
},
{
"s": "three cost figures and the risk finding",
"t": "Rewrite, numbers kept exact"
},
{
"s": "nothing simplified into a new claim",
"t": "Compare against original"
},
{
"s": "renew or switch",
"t": "Board decides"
}
],
"t": "timeline",
"title": "Brief the audience, then verify substance survived"
},
"o2-11": {
"cap": "Read the downstream use on the left and pick the container it implies.",
"cols": [
"Where the output lives next",
"The container"
],
"note": "When in doubt, ask where this output lives next week and pick that format.",
"rows": [
[
"Consumed now, then discarded",
"Inline chat"
],
[
"Reused, edited, or presented",
"Artifact — doc, deck, dashboard"
],
[
"Sorted, filtered, calculated, handed off",
"Structured data — table, CSV"
],
[
"A 40-row comparison in the scroll",
"Wrong container — unreadable"
]
],
"t": "table",
"title": "Format follows the destination, not the length"
},
"o2-12": {
"bands": [
{
"s": "the more specific the detail, the more it needs a source",
"t": "Fluency is not accuracy",
"tone": "acc"
},
{
"s": "trace claims, cross-check consistency, interrogate generalizations",
"t": "Three audit passes"
},
{
"s": "Claude checking Claude is not verification",
"t": "Verify against the owner of the fact"
},
{
"s": "consequential claim, qualified reviewer",
"t": "Human sign-off where consequences live"
},
{
"s": "brief the audience, then pick the container",
"t": "Adapt and match the format"
}
],
"cap": "Read top to bottom: the habits that scale with the stakes.",
"note": "Every wrong answer on this domain skips diligence while looking busy: send as-is, self-check, disclaimer, blind rewrite.",
"t": "layers",
"title": "Domain 2 in one page — one chain of diligence"
},
"o2-2": {
"before": {
"s": "Ships to the client tomorrow",
"t": "Draft cites '14% in 2023, according to XYZ Research'"
},
"cap": "Follow the draft through the verification gate — only one exit ships.",
"fail": {
"s": "Never keep a number that failed the check",
"t": "Cut it or hedge honestly"
},
"gate": {
"t": "Verify against XYZ Research's actual report"
},
"note": "Asking Claude how confident it is is not a gate — a hallucination is asserted as fluently as a fact.",
"pass": {
"s": "Number and attribution both check out",
"t": "Source says it — ship"
},
"t": "gate",
"title": "A named attribution is exactly what models fabricate"
},
"o2-3": {
"cap": "Each branch is a failure class with its own tell and its own repair.",
"kids": [
{
"s": "trace every concrete claim to a source",
"t": "Hallucination"
},
{
"s": "summary says 412 respondents, chart says 380",
"t": "Inconsistency"
},
{
"s": "would the described group recognize themselves?",
"t": "Bias"
}
],
"note": "Ask Claude to list every factual claim, or to argue the opposing case — then verify the flagged items yourself.",
"root": {
"s": "run explicit passes, not a vibes read",
"t": "Structural audit pass",
"tone": "acc"
},
"t": "tree",
"title": "Three passes, three failure classes"
},
"o2-4": {
"cap": "Left fixes the content; right are the paper tigers that leave it standing.",
"do": [
"Rebase the profile on what the survey actually shows",
"Add a counter-framing pass: argue the opposite",
"Cut generalizations the data cannot support"
],
"doHead": "Do",
"dont": [
"Ship it because it 'came from your data'",
"Ask Claude to self-audit the bias it produced",
"Add an AI-generated disclaimer and keep it"
],
"dontHead": "Don't",
"t": "checklist",
"title": "A stereotype with a disclaimer is still a stereotype"
},
"o2-5": {
"cap": "For each claim, look at who actually owns the truth of it.",
"cols": [
"The claim",
"The source that owns the truth of it"
],
"note": "A marketing adjective can pass unverified; a subsection citation cannot.",
"rows": [
[
"Legal or regulatory requirement",
"The regulation itself"
],
[
"A statistic attributed to a firm",
"That firm's actual published report"
],
[
"A vendor's prices",
"The vendor's own pricing page"
],
[
"A revenue figure",
"Your finance system, not a second Claude pass"
]
],
"t": "table",
"title": "A second Claude pass is not a source"
},
"o2-6": {
"cap": "A citation tells you where to look; diligence means visiting it.",
"nodes": [
{
"s": "every claim carries a link",
"t": "Report arrives with citations"
},
{
"s": "read the linked primary source",
"t": "Spot-check decision-driving claims"
},
{
"s": "a citation is where to look, not proof",
"t": "Confirm sources are current and credible"
},
{
"s": "once the map matches the territory",
"t": "Present to leadership"
}
],
"t": "flow",
"title": "Citations are the map, not the territory"
},
"o2-7": {
"before": {
"s": "clear, well-organized, reads authoritative",
"t": "Draft: internal FAQ on parental-leave entitlements"
},
"cap": "Same draft, two exits — the gate is whether people rely on it.",
"fail": {
"s": "subject-matter expert or accountable owner",
"t": "Qualified human signs off"
},
"gate": {
"t": "Is the output consequential?"
},
"note": "A layperson approving technical claims is review theater.",
"pass": {
"s": "low-stakes, you will riff on it",
"t": "Spot-check and ship"
},
"t": "gate",
"title": "Consequential claim, qualified human sign-off"
},
"o2-8": {
"cap": "First match wins: consequential content goes to the expert, not a disclaimer.",
"head": "route the draft — first match wins",
"rows": [
{
"act": "Route to the qualified human owner for sign-off",
"cond": "Benefits, legal, or decision-affecting content",
"tone": "ok"
},
{
"act": "Familiarity is not accuracy — still route to HR",
"cond": "Reads flawless but the topic is standard HR",
"tone": "warn"
},
{
"act": "Skim and move on",
"cond": "Internal brainstorm no one relies on"
}
],
"t": "ladder",
"title": "The reviewer must be qualified, before publication"
},
"o2-9": {
"cap": "Left rewrites blind; right briefs the reader, decision, and numbers that must survive.",
"left": {
"bullets": [
"No brief — the draft only gets vaguer",
"A caveat is silently dropped",
"A hedge sharpens into a promise"
],
"t": "Blind 'make it shorter and friendlier'"
},
"mid": "brief, then check",
"right": {
"bullets": [
"Who reads it, what decision, how long",
"What must survive verbatim: the numbers",
"Compare rewrite to original — substance intact"
],
"t": "Adapt with an explicit audience brief"
},
"t": "beforeafter",
"title": "Polish is not adaptation"
},
"o3-1": {
"cap": "Four branches, four jobs: recurring context, sourced breadth and revisable drafts each have a home.",
"kids": [
{
"s": "one conversation, one task - nothing carried over",
"t": "Chat",
"tone": "acc"
},
{
"s": "pins instructions and knowledge so each chat starts loaded",
"t": "Project"
},
{
"s": "searches broadly, returns cited findings - slower, more usage",
"t": "Research mode"
},
{
"s": "editable output layer, revised version by version",
"t": "Artifact"
}
],
"note": "Run all three of the consultant's behaviors through chat and each one fails differently.",
"root": {
"s": "each surface exists because a pattern of work outgrew chat",
"t": "Which surface fits the job?"
},
"t": "tree",
"title": "Four surfaces, four jobs"
},
"o3-2": {
"cap": "Left column makes the context persist; right column pays for the exam's wasteful reflex.",
"do": [
"Create a Project for the client",
"Upload guidelines and past notes as project knowledge",
"Develop the drafts as artifacts inside that Project",
"Reuse the same Project every morning"
],
"doHead": "Removes the recurring work",
"dont": [
"Keep using new chats and enable research mode daily",
"Re-paste the guidelines into a fresh chat each morning",
"Switch to the most capable model so it retains them",
"Email the guidelines as a manual extra step"
],
"dontHead": "Re-pays it every morning",
"note": "A more capable model does not carry memory across separate chats.",
"t": "checklist",
"title": "Which surface fixes the repeated-pasting workflow?"
},
"o3-3": {
"cap": "Read the middle column: each tier answers a different demand, and only one of them is 'most'.",
"cols": [
"Tier",
"What it's for",
"What it costs"
],
"note": "The tiers are a dial, not a ranking - Opus by reflex burns budget and latency.",
"rows": [
[
"Haiku",
"High-volume, straightforward work: short replies, classification, routine summaries",
"Cheapest and fastest"
],
[
"Sonnet",
"Everyday business work: drafting, analysis, multi-step tasks",
"Balanced quality and speed"
],
[
"Opus",
"Complex reasoning, nuanced judgment, high-stakes deliverables",
"Highest cost and latency"
]
],
"t": "table",
"title": "Three tiers: speed, balance, depth"
},
"o3-4": {
"cap": "Haiku owns the high-volume, shallow corner; only the deep, low-volume corner earns Opus.",
"ne": {
"s": "the top model on every draft - doubles cost for no gain",
"t": "Opus by reflex",
"tone": "bad"
},
"note": "Draft cheap then polish with the top model doubles cost and latency for no gain.",
"nw": {
"s": "bulk short customer replies - speed and cost win",
"t": "Haiku",
"tone": "ok"
},
"se": {
"s": "complex or sensitive cases that actually need depth",
"t": "Opus",
"tone": "ok"
},
"sw": {
"s": "everyday mixed work - the balanced default",
"t": "Sonnet",
"tone": "acc"
},
"t": "matrix2",
"title": "Volume against depth: which tier fits?",
"xlab": "depth of reasoning the task demands",
"ylab": "volume and cost pressure"
},
"o3-5": {
"cap": "Each row protects a different corner; the last row spends capability nobody asked for.",
"head": "which corner can the task afford to lose?",
"note": "Stems hand you the constraint - 'hundreds of items', 'by end of day', 'board-facing'.",
"rows": [
{
"act": "fast tier - depth multiplies across hundreds of items",
"cond": "High volume plus a tight turnaround",
"tone": "ok"
},
{
"act": "capable tier - one weak deliverable costs more than the usage",
"cond": "High stakes plus a hard audience",
"tone": "acc"
},
{
"act": "balanced tier as the default, escalating only what proves it needs more",
"cond": "Everyday mixed work"
},
{
"act": "top-model reflex with a justification attached",
"cond": "'The client might see it' as a blanket rule",
"tone": "bad"
}
],
"t": "ladder",
"title": "Name the binding constraint, then pick the tier"
},
"o3-6": {
"cap": "Same deadline, opposite constraints - one queue, two different tiers.",
"left": {
"bullets": [
"High volume, low per-item risk",
"Fast, low-cost tier",
"Protects speed and cost"
],
"t": "Forty internal emails into a 9 a.m. digest"
},
"leftTone": "acc",
"mid": "match tier per task",
"note": "Match tiers per task, not per person or per day.",
"right": {
"bullets": [
"High stakes, hard audience",
"Most capable tier",
"Spends depth where it counts"
],
"t": "Client narrative anchoring a seven-figure renewal"
},
"rightTone": "ok",
"t": "beforeafter",
"title": "Two tasks, one deadline, opposite tiers"
},
"o3-7": {
"cap": "The loop closes because more context never fixes a full context - only a memory move does.",
"nodes": [
{
"s": "research, drafts and side questions accumulate",
"t": "A clean thread starts"
},
{
"s": "early instructions get crowded out",
"t": "The thread fills up"
},
{
"s": "forgotten constraints, revived discarded ideas",
"t": "Symptoms appear",
"tone": "warn"
},
{
"s": "restart to discard, summarize to compress, persist to keep",
"t": "Pick the memory move",
"tone": "acc"
}
],
"note": "Upgrading the model does not restore instructions crowded out of a full context.",
"t": "loop",
"title": "Context fills, quality degrades, memory moves fix it"
},
"o3-8": {
"before": {
"s": "it revives ideas the team already discarded",
"t": "Week-long thread contradicts early instructions"
},
"cap": "Only one exit preserves the agreed constraints - the others spend capability or discard the work.",
"fail": {
"s": "depth cannot restore context; re-pasting adds load; a bare restart drops the decisions",
"t": "Upgrade the model, re-paste, or bare restart"
},
"gate": {
"t": "Must the work continue under the agreed constraints?"
},
"note": "A degraded long conversation is a memory problem, not a model problem.",
"pass": {
"s": "compresses decisions and constraints into usable context",
"t": "Summarize, then continue in a fresh chat"
},
"t": "gate",
"title": "A degraded thread: which move fits?"
},
"o3-9": {
"bands": [
{
"s": "chat one-off, Projects recurring, research sourced, artifacts",
"t": "Surface: where the work lives",
"tone": "acc"
},
{
"s": "Haiku volume, Sonnet balance, Opus depth - never Opus by reflex",
"t": "Tier: what it costs"
},
{
"s": "name the binding corner - cost, speed, or quality - and protect it",
"t": "Constraint: which tier"
},
{
"s": "restart to discard, summarize to compress, persist to keep",
"t": "Memory move: which symptom"
}
],
"cap": "Four questions in order - surface, tier, constraint, memory move - answer every Domain 3 stem.",
"note": "'Best' on this exam means best-fitting, not most powerful.",
"t": "layers",
"title": "Domain 3 in one page"
},
"o4-1": {
"cap": "Follow the split: Claude structures the messy input, Priya owns which requirements are real.",
"nodes": [
{
"s": "unstructured human material",
"t": "Raw input: complaint email, intake form, notes"
},
{
"s": "stated needs, unstated assumptions, constraints, open questions",
"t": "Claude extracts four lists",
"tone": "acc"
},
{
"s": "which needs are real requirements vs one franchisee's workaround",
"t": "Process owner Priya confirms"
},
{
"s": "requirement decisions stay human",
"t": "Human decides priorities and trade-offs",
"tone": "warn"
}
],
"note": "Priority calls and cross-department trade-offs never leave the owner.",
"t": "flow",
"title": "Requirements analysis: Claude drafts the structure, Priya decides"
},
"o4-10": {
"cap": "The effective answer sits top-right: concrete value and honest limitation, both specific.",
"ne": {
"s": "hours to minutes with human review; hallucination named",
"t": "Calibrated answer",
"tone": "ok"
},
"nw": {
"s": "'just an experimental chatbot' hides real time savings",
"t": "Undersell",
"tone": "warn"
},
"se": {
"s": "'full automation, guaranteed accuracy'",
"t": "Oversell",
"tone": "bad"
},
"sw": {
"s": "declines to characterize; asks for a governance review",
"t": "Vague or deferred",
"tone": "warn"
},
"t": "matrix2",
"title": "Stakeholder check: calibrated specifics beat the oversell and the undersell",
"xlab": "specific value stated",
"ylab": "specific limitation stated"
},
"o4-11": {
"bands": [
{
"s": "Claude extracts needs and assumptions; owner validates and decides",
"t": "Requirements",
"tone": "acc"
},
{
"s": "Claude synthesizes sources and drafts options; humans verify and judge",
"t": "Research and planning"
},
{
"s": "Claude critiques candidates and drafts variations; team decides",
"t": "Solution design"
},
{
"s": "sort every step into delegate / assist / keep-human by risk",
"t": "Workflow integration"
},
{
"s": "one specific sentence of value, one of limitation",
"t": "Stakeholder communication"
}
],
"cap": "Five tasks, one chain: where Claude sits, and did the judgment stay human and the story stay honest.",
"t": "layers",
"title": "Domain 4 recap: five tasks, one chain from requirements to honest communication"
},
"o4-2": {
"cap": "The correct option extracts and organizes; the owner confirms which requirements are real.",
"do": [
"Separate needs, assumptions, constraints and questions",
"Review lists with the owner to confirm real requirements",
"Keep the requirements decision with the process owner"
],
"doHead": "Effective approach",
"dont": [
"Ask Claude to redesign the process straight from one email",
"Forward the email to the owner with no analysis",
"Let Claude sign off on final requirements"
],
"dontHead": "Distractors",
"t": "checklist",
"title": "Requirements check: draft the structure, the owner confirms the content"
},
"o4-3": {
"cap": "The prep runs left to right: synthesize, draft options, verify claims, then add judgment.",
"marks": [
{
"s": "process notes, post-mortems, wiki pages into a working picture",
"t": "Summarize what you have"
},
{
"s": "three sequencing approaches with pros, cons, assumptions",
"t": "Ask for options, not one answer",
"tone": "acc"
},
{
"s": "timelines, figures, client claims need verification",
"t": "Treat stated facts as draft claims",
"tone": "warn"
},
{
"s": "which risks Tomas cares about, which estimate is realistic",
"t": "Add human judgment",
"tone": "ok"
}
],
"t": "timeline",
"title": "Planning prep: Claude compresses research and drafting, humans judge"
},
"o4-4": {
"cap": "Only one row keeps Claude on the draft and humans on verification and judgment.",
"cols": [
"Approach",
"What it costs you"
],
"rows": [
[
"Forward Claude's plan as final",
"skips verification and stakeholder judgment"
],
[
"Write the plan entirely by hand",
"rejects the leverage Claude offers"
],
[
"Draft options, verify, add judgment",
"the effective division of labor"
],
[
"Rotating committee",
"adds coordination cost, no new research"
]
],
"t": "table",
"title": "Planning check: draft plus verified judgment beats all-or-nothing"
},
"o4-5": {
"cap": "Iteration is a loop, not one-shot generation: each pass narrows the gap to the requirements.",
"nodes": [
{
"s": "three designs on the whiteboard",
"t": "Give Claude the agreed requirements and candidates"
},
{
"s": "where it breaks, what it assumes, who it shortchanges",
"t": "Critique each design against the requirements",
"tone": "acc"
},
{
"s": "a lighter-weight version, a version that splits the step",
"t": "Generate variations you would not have drafted"
},
{
"s": "design authority stays with Marco and the client",
"t": "Revise with human judgment, then repeat",
"tone": "ok"
}
],
"t": "loop",
"title": "Design loop: draft, critique, vary, revise - the team keeps design authority"
},
"o4-6": {
"cap": "Claude critiques and drafts variations; the team and client keep design authority.",
"left": {
"bullets": [
"Ask Claude to pick the best of the three designs",
"Generate a brand-new design from scratch",
"Keep Claude out until after client approval"
],
"t": "Wrong ways"
},
"leftTone": "bad",
"mid": "support",
"right": {
"bullets": [
"Critique each candidate against agreed requirements",
"Draft variations for the team to review",
"Team selects the design with the client"
],
"t": "Effective way"
},
"rightTone": "ok",
"t": "beforeafter",
"title": "Design check: critique and variations in, selection stays with the team"
},
"o4-7": {
"cap": "Sort by step risk: draft work to Claude, judgment stays human, the middle decides with prep.",
"hub": {
"t": "Six-step hiring workflow"
},
"spokes": [
{
"s": "resume-screening notes, candidate summaries, interview questions",
"t": "Delegate to Claude",
"tone": "acc"
},
{
"s": "the interview, the hiring decision, anything with legal weight",
"t": "Keep human",
"tone": "bad"
},
{
"s": "recruiter reads screening notes, makes the shortlist call",
"t": "Claude-assisted human",
"tone": "warn"
}
],
"t": "fanout",
"title": "Three buckets: delegate the drafting, keep the judgment, assist the middle"
},
"o4-8": {
"cap": "Distractors delegate everything, block everything, or add a blanket approval layer - the answer sorts per step.",
"head": "sort each step by risk - never delegate the whole workflow",
"rows": [
{
"act": "Delegate to Claude",
"cond": "Pattern-based drafting: screen notes, summaries",
"tone": "acc"
},
{
"act": "Keep human",
"cond": "Judgment or relationship step: the interview, the decision",
"tone": "bad"
},
{
"act": "Claude-assisted: recruiter makes the shortlist call",
"cond": "Human decides with Claude's prep in front of them",
"tone": "warn"
}
],
"t": "ladder",
"title": "Workflow check: sort each step by risk, not the workflow as a whole"
},
"o4-9": {
"before": {
"s": "Ms. Okafor, operations VP",
"t": "Stakeholder asks: what do I get, and where will it fail?"
},
"cap": "Both exits are dishonest: overselling breaks trust, underselling blocks the pilot.",
"fail": {
"s": "the promise/reality gap destroys trust at the first failed output",
"t": "Oversell or undersell"
},
"gate": {
"t": "Calibrated: specific value + specific limitation"
},
"pass": {
"s": "three hours to twenty minutes, review every output",
"t": "Trust holds; the adoption decision is sound"
},
"t": "gate",
"title": "Stakeholder gate: name concrete value and concrete limitation"
},
"o5-1": {
"cap": "Configure the Project once and every chat inside it starts already carrying the instructions and knowledge.",
"kids": [
{
"s": "standing rules: role, audience, tone, format",
"t": "Custom instructions"
},
{
"s": "guidelines, policies, past examples to consult",
"t": "Knowledge files"
},
{
"s": "inherits both, with no daily paste",
"t": "Every conversation inside",
"tone": "ok"
}
],
"note": "A bad setup degrades every future conversation the same way.",
"root": {
"s": "persistent workspace — configure once",
"t": "claude.ai Project",
"tone": "acc"
},
"t": "tree",
"title": "Project bundles instructions and knowledge; every chat inherits them"
},
"o5-2": {
"cap": "Every alternative still depends on someone remembering — only the Project makes the context structural.",
"head": "Where should the re-supplied context live?",
"note": "The fix lives in the Project, not in a better daily ritual.",
"rows": [
{
"act": "Put it in the Project as instructions + knowledge",
"cond": "Same context needed in every new chat",
"tone": "ok"
},
{
"act": "Still fails the day she skips the paste",
"cond": "Save the guidelines as a desktop text file",
"tone": "bad"
},
{
"act": "Manages the symptom, removes nothing",
"cond": "Add a calendar reminder to check each chat",
"tone": "bad"
},
{
"act": "Chats don't carry reliable memory across conversations",
"cond": "Ask Claude to remember earlier chats",
"tone": "bad"
}
],
"t": "ladder",
"title": "The daily paste is a configuration problem, not a discipline problem"
},
"o5-3": {
"cap": "Pick the source type by change rate: upload what is stable, connect what changes.",
"cols": [
"Knowledge source",
"How it behaves",
"Choose it when"
],
"note": "The deciding fact is whether the underlying document changes.",
"rows": [
[
"Uploaded file",
"static copy, frozen at upload time",
"material is stable and finished"
],
[
"Connector — Drive, Gmail",
"references the source at its current version",
"the document changes on a schedule"
],
[
"Old copy left in place",
"competes with the new version",
"remove it, don't just add"
]
],
"t": "table",
"title": "Uploads are snapshots; connectors stay live"
},
"o5-4": {
"cap": "Connect the living document and delete the stale upload — correcting every quote is the tax you avoid.",
"left": {
"bullets": [
"frozen on upload day",
"Finance revises prices monthly in Drive",
"quotes last month's numbers",
"weekly re-upload fails the week it's skipped"
],
"t": "Uploaded pricing snapshot"
},
"leftTone": "bad",
"mid": "connect once",
"note": "Hedging instructions teach vagueness; the connector makes currency structural.",
"right": {
"bullets": [
"reads the sheet at its source",
"always the current version",
"remove the stale upload so copies don't compete"
],
"t": "Google Drive connector"
},
"rightTone": "ok",
"t": "beforeafter",
"title": "A changing source needs a connector, not a monthly re-upload"
},
"o5-5": {
"cap": "An instruction earns its place only if it names the audience, format, source, or a hard rule.",
"do": [
"Name the audience: non-technical steering committee",
"Specify the five-section memo structure",
"Require plain language, no hype",
"Name the authoritative knowledge file"
],
"doHead": "Enforceable instruction",
"dont": [
"'write professionally and be helpful'",
"'you are a world-class consultant'",
"'always produce flawless, excellent work'",
"any rule that fits any Project at any company"
],
"dontHead": "Wish, not an instruction",
"note": "Custom instructions apply to every conversation, so each line must be a rule you want enforced.",
"t": "checklist",
"title": "Specific beats aspirational: say what to do, for whom, in what format"
},
"o5-6": {
"before": {
"s": "sounds warm, enforces nothing",
"t": "'write professionally and be helpful'",
"tone": "bad"
},
"cap": "If a rule cannot be enforced every session, it belongs rewritten — not repeated in chat.",
"fail": {
"s": "no decision information — re-explained weekly",
"t": "Aspirational praise"
},
"gate": {
"t": "Enforceable every session?"
},
"note": "Length is not specificity; concrete requirements are.",
"pass": {
"s": "audience, memo structure, plain language, source",
"t": "Concrete instruction"
},
"t": "gate",
"title": "Rewrite the instructions so the memo format is enforced, not re-explained"
},
"o5-7": {
"cap": "Trace the drift: the configuration was correct on its setup date, and nobody announced the day it stopped being correct.",
"marks": [
{
"s": "returns policy uploaded: 30 days, restocking fee",
"t": "January"
},
{
"s": "company changes policy: 60 days, fee dropped",
"t": "July"
},
{
"s": "Project keeps applying the January truth",
"t": "No one updates"
},
{
"s": "confidently quotes 30 days + fee",
"t": "Every conversation"
}
],
"note": "Staleness is silent — outputs still look polished and confident.",
"t": "timeline",
"title": "A correct configuration rots: right in January, silently wrong by July"
},
"o5-8": {
"cap": "The loop keeps producing wrong drafts because the fix is applied to outputs, not to the configuration.",
"nodes": [
{
"s": "January policy file still in the Project",
"t": "Wrong return window appears in a draft",
"tone": "bad"
},
{
"s": "each reply, for two weeks",
"t": "Associate fixes the window by hand",
"tone": "warn"
},
{
"s": "the source of truth is untouched",
"t": "Stale January file stays in place",
"tone": "bad"
}
],
"note": "Update the Project once: replace the policy file and review the instructions.",
"t": "loop",
"title": "The manual band-aid loop: patching outputs never fixes the stale source"
},
"o5-9": {
"cap": "The four tasks chain together: configure once, choose sources by change rate, write enforceable rules, maintain as reality moves.",
"hub": {
"s": "the exam's chain: laziness vs leverage",
"t": "Domain 5: configure & maintain"
},
"note": "Every exam stem in this domain is laziness versus leverage.",
"spokes": [
{
"s": "instructions + knowledge apply to every chat",
"t": "Projects"
},
{
"s": "upload stable, connect what changes",
"t": "Source type"
},
{
"s": "audience, format, authoritative source",
"t": "Specific instructions"
},
{
"s": "fix the source, not the symptom",
"t": "Maintain over time"
}
],
"t": "fanout",
"title": "Domain 5 in one page: the four tasks are links in one chain"
},
"o6-1": {
"cap": "Watch the right panel: the work still happens, but a named person reviews and signs it.",
"left": {
"bullets": [
"Claude can technically do it, so let it decide",
"Unreviewed model text becomes the decision",
"No named person owns the outcome"
],
"t": "Capability is not authorization"
},
"mid": "review",
"right": {
"bullets": [
"Summaries, drafts, structure, brainstorming",
"A qualified reviewer adjusts the output",
"A named person is accountable for it"
],
"t": "Claude drafts, the human owns and signs"
},
"t": "beforeafter",
"title": "Claude drafts, humans decide — accountability decides appropriateness"
},
"o6-10": {
"cap": "Follow the cycle: the same model that made the skew cannot sign off that it's fixed.",
"nodes": [
{
"t": "Claude generates outreach personas"
},
{
"t": "Team notices skew toward one demographic"
},
{
"s": "correct or regenerate the personas",
"t": "Human bias review with diverse input"
},
{
"t": "Document AI use, then launch",
"tone": "acc"
}
],
"t": "loop",
"title": "The model that produced the bias cannot certify it is gone"
},
"o6-11": {
"cap": "Four questions, then the safeguard — every Domain 6 stem runs this loop.",
"marks": [
{
"s": "a named human, not the model",
"t": "Who owns the outcome?"
},
{
"s": "public, internal, or regulated",
"t": "What data class is this?"
},
{
"s": "approved tools and terms rule",
"t": "What do policy and contracts say?"
},
{
"s": "bias, disclosure, downstream effects",
"t": "Who could be harmed?"
},
{
"s": "review, redact, policy, disclose",
"t": "Add the safeguard, then proceed",
"tone": "acc"
}
],
"t": "timeline",
"title": "Domain 6 in one page: ask four questions, then add the safeguard"
},
"o6-2": {
"before": {
"t": "Claude ranks 3 vendors on a $2M contract"
},
"cap": "The pass exit keeps the human as owner; the fail exit posts a machine ranking with no one accountable.",
"fail": {
"s": "machine output decides",
"t": "Unreviewed ranking posted"
},
"gate": {
"t": "Procurement lead reviews, adjusts, signs"
},
"pass": {
"s": "human owns the call",
"t": "Signed recommendation posted"
},
"t": "gate",
"title": "The $2M vendor call: a review gate keeps a human as decision-owner"
},
"o6-3": {
"cap": "The first two rows are the no-go zone; the third row is the safeguard that enables the work.",
"head": "check in order — first match wins",
"rows": [
{
"act": "No-go zone — add human expert review or stop",
"cond": "Unreviewed output decides a person's job, money, or rights?",
"tone": "bad"
},
{
"act": "No-go zone — never deliver it as advice",
"cond": "AI text presented as professional advice you can't give?",
"tone": "bad"
},
{
"act": "Add the safeguard, then proceed",
"cond": "Safeguard (review, redaction, disclosure) can enable it?",
"tone": "ok"
},
{
"act": "Distractor — salvage the work with a safeguard",
"cond": "'Cancel the task entirely' as the only option?",
"tone": "warn"
}
],
"t": "ladder",
"title": "The no-go zone: unreviewed output deciding something about a person"
},
"o6-4": {
"cap": "Scan the middle column — the only violation is the row with no human in the loop.",
"cols": [
"Proposal",
"Human in the loop?",
"Verdict"
],
"rows": [
[
"Claude drafts interview questions; HR screens and rewrites them",
"Yes — HR before interviewers",
"Appropriate"
],
[
"Claude drafts a performance-improvement plan; the manager edits and signs",
"Yes — a named manager owns it",
"Appropriate"
],
[
"Claude scores layoff risk from review files; ranked list to HR, no review",
"No — no one checks the scores",
"Inappropriate"
],
[
"Claude summarizes newly published public regulations for the team",
"Not needed — public, no personal data",
"Appropriate"
]
],
"t": "table",
"title": "Four proposals, one violation — find where no person stands between"
},
"o6-5": {
"bands": [
{
"s": "Free to use — no safeguard needed",
"t": "Public information",
"tone": "ok"
},
{
"s": "Follow organizational policy before it goes to Claude",
"t": "Internal business data"
},
{
"s": "Names, account numbers, health details, government IDs",
"t": "Regulated personal data",
"tone": "bad"
}
],
"cap": "The higher the band, the stronger the safeguard required before the data reaches Claude.",
"note": [
"Redact or anonymize regulated identifiers first — Customer A/B/C, random IDs, role labels.",
"The trend analysis survives anonymization; the compliance exposure does not."
],
"t": "layers",
"title": "Classify data before you paste — sensitivity decides the safeguard"
},
"o6-6": {
"before": {
"t": "Exit transcripts with names and medical leave"
},
"cap": "Both bad exits skip the redaction the policy actually requires.",
"fail": {
"s": "a prompt is not a policy control",
"t": "Upload as-is, or a 'don't retain' instruction"
},
"gate": {
"t": "Policy: no regulated data to unapproved systems"
},
"pass": {
"s": "then summarize — themes intact",
"t": "Replace names with role and department labels"
},
"t": "gate",
"title": "Exit transcripts: redact the identifiers, then summarize the themes"
},
"o6-7": {
"cap": "Convenience is not an authority — each branch names where the real answer lives.",
"kids": [
{
"s": "DPA, retention settings, audit trail",
"t": "Approved enterprise workspace"
},
{
"s": "Can be stricter than internal policy",
"t": "Client and vendor contracts"
},
{
"s": "Escalate when policy is silent",
"t": "Governance, legal, or your manager"
},
{
"s": "The classic violation — never a shortcut",
"t": "Shadow AI: bypassing a control",
"tone": "bad"
}
],
"root": {
"s": "policy, contract, or governance — not convenience",
"t": "Where is the authority for this decision?"
},
"t": "tree",
"title": "Policy is the floor — find the authority instead of improvising one"
},
"o6-8": {
"cap": "The deadline is the setup; every right-hand action keeps client data in approved controls.",
"do": [
"Request expedited access through the approved process",
"Tell the client the timeline slipped if it can't be shortened",
"Keep client documents inside the approved platform"
],
"doHead": "Keep the work in approved controls",
"dont": [
"Use a teammate's personal account and delete the history",
"Instruct Claude to treat everything as strictly confidential",
"Proceed tonight and disclose it to your manager tomorrow"
],
"dontHead": "Route client data around them",
"t": "checklist",
"title": "Deadline tonight: never route client data around approved controls"
},
"o6-9": {
"cap": "Four duties ring the hub — disclosure, bias, verification, accountability.",
"hub": {
"t": "Ethical use of Claude"
},
"spokes": [
{
"s": "where customers or regulators see it",
"t": "Disclose AI's role",
"tone": "acc"
},
{
"s": "before they shape decisions about people",
"t": "Check outputs for bias"
},
{
"s": "fluent text is not verified text",
"t": "Verify the claims"
},
{
"s": "for the outcome and its effects",
"t": "Keep a human answerable"
}
],
"t": "fanout",
"title": "Ethical use: disclose, de-bias, verify, stay accountable"
},
"o7-1": {
"cap": "Read top to bottom: each symptom points at one cause, and only the right-hand action is aimed at it.",
"head": "Ask first: what changed since the last good output?",
"note": "A remedy chosen before diagnosis - rewrite from scratch, switch models, escalate - treats a symptom.",
"rows": [
{
"act": "Compare the failing run with the last good output",
"cond": "Output used to be sharp; now it is generic",
"tone": "warn"
},
{
"act": "Point the prompt at the new layout",
"cond": "The source report was reorganized",
"tone": "ok"
},
{
"act": "That job is squeezed - give it its own step",
"cond": "One section is consistently the weakest",
"tone": "ok"
},
{
"act": "Restore the context that was removed",
"cond": "A required detail has vanished",
"tone": "ok"
},
{
"act": "Now suspect the instruction: vague or overloaded",
"cond": "Nothing about source or prompt changed"
}
],
"t": "ladder",
"title": "Diagnose first: name the cause, then aim the fix"
},
"o7-2": {
"cap": "Only the highlighted branch names a cause; the other three are remedies that leave the failure in place.",
"kids": [
{
"s": "report reorganized last week - the real cause",
"t": "What changed in the source?",
"tone": "ok"
},
{
"s": "a remedy, not a cause - discards working instructions",
"t": "Rewrite the prompt from scratch",
"tone": "bad"
},
{
"s": "spends cost on a cause the model did not create",
"t": "Switch to a more capable model tier",
"tone": "bad"
},
{
"s": "pays for the same failure every week",
"t": "Send every output to a human reviewer",
"tone": "bad"
}
],
"note": "The one branch that asks what changed is the one that fixes it.",
"root": {
"s": "weekly report summary, sharp for months",
"t": "Output went generic - but the prompt text never changed",
"tone": "acc"
},
"t": "tree",
"title": "One symptom, four branches - only one names the cause"
},
"o7-3": {
"cap": "Follow the funnel: five jobs inside one response narrow into the same weak middle every time.",
"note": "The fix is structural: split into steps, each with its own instruction and its own review.",
"stages": [
{
"s": "five distinct jobs share a single response",
"t": "One prompt: research, outline, draft, format, verify"
},
{
"s": "early requirements get attention, later ones get squeezed",
"t": "Attention is split five ways"
},
{
"s": "the failure clusters in one place - a structural signal",
"t": "Weak middle sections, every run",
"tone": "bad"
}
],
"t": "funnel",
"title": "One prompt carrying five jobs collapses at the middle"
},
"o7-4": {
"cap": "Every distractor on the left leaves the five jobs competing; only the right panel removes the overload.",
"left": {
"bullets": [
"Add stronger wording: be thorough, high quality",
"Switch to the most capable model tier",
"Run it twice and merge the best sections"
],
"t": "Keep five jobs in one response"
},
"mid": "fix",
"right": {
"bullets": [
"Research, outline, draft, format, verify",
"Each step gets its own instruction",
"Review each step before the next"
],
"t": "Split the work into reviewed steps"
},
"t": "beforeafter",
"title": "Louder single prompt vs decomposed steps"
},
"o7-5": {
"cap": "The left column changes what generates every future draft; the right column only touches today's output.",
"do": [
"Update the saved prompt and project instructions",
"Fix wrong audience, format, or depth at the source",
"Re-run the same task and confirm the feedback is addressed"
],
"doHead": "Make it persist",
"dont": [
"Hand-edit this week's draft and move on",
"Ask each person to rewrite their own portion",
"Switch model tiers for a problem the prompt caused"
],
"dontHead": "Leaves the cause in place",
"t": "checklist",
"title": "A fix that isn't saved isn't a fix"
},
"o7-6": {
"cap": "Follow the cycle: fixing the output returns you to the same complaint, so only the prompt can break it.",
"nodes": [
{
"s": "the saved prompt never names the audience",
"t": "Weekly drafts read like engineering docs"
},
{
"s": "one deliverable, fixed by hand",
"t": "Associate hand-simplifies this week's draft",
"tone": "bad"
},
{
"s": "the cause was never touched",
"t": "Next week's batch runs the same saved prompt"
},
{
"s": "the loop repeats until the prompt itself changes",
"t": "The identical complaint comes back",
"tone": "warn"
}
],
"note": "Editing the deliverable never exits the loop; editing the prompt does.",
"t": "loop",
"title": "Hand-patch today's draft, face the same complaint next week"
},
"o7-7": {
"cap": "Only the two ok cells match treatment to task; the mismatches either waste cost or starve the work.",
"ne": {
"s": "the deep model and format fit the job",
"t": "Complex analysis earns the full treatment",
"tone": "ok"
},
"note": "Optimization is matching, not maximizing - and the knowledge source must stay current.",
"nw": {
"s": "wasted cost, half the sections unread",
"t": "Quick check through the deep-dive flow",
"tone": "bad"
},
"se": {
"s": "under-serves the genuinely complex work",
"t": "Everything flattened to quick-and-shallow",
"tone": "bad"
},
"sw": {
"s": "fast model, one-paragraph answer",
"t": "Quick check gets a short prompt",
"tone": "ok"
},
"t": "matrix2",
"title": "Match the treatment to the task",
"xlab": "task: quick question -> complex analysis",
"ylab": "treatment: light -> heavy"
},
"o7-8": {
"before": {
"t": "Customer asks for current pricing"
},
"cap": "The gate asks whether the fact is in the source at all - no prompt wording can supply a missing fact.",
"fail": {
"s": "review or a bigger model still reads stale data",
"t": "Year-old pricing doc"
},
"gate": {
"t": "Where does the answer come from?"
},
"pass": {
"s": "every future answer draws on current data",
"t": "Current pricing doc"
},
"t": "gate",
"title": "Check the knowledge source before the prompt"
},
"o7-9": {
"cap": "Read down the middle column: every Domain 7 stem asks which root cause this symptom points to.",
"cols": [
"Symptom",
"Root cause",
"The fix that lasts"
],
"note": "The exam credits the answer that names the cause and removes it permanently.",
"rows": [
[
"Output went generic, prompt unchanged",
"The source was reorganized",
"Point the prompt at the new layout"
],
[
"Uneven output from one long prompt",
"Several jobs share one response",
"Decompose into reviewed steps"
],
[
"The same complaint every batch",
"The fix lived in one deliverable only",
"Update the saved prompt and instructions"
],
[
"Answers quote last year's prices",
"A stale knowledge source",
"Replace the source with the current one"
],
[
"Slow, costly reports, sections unread",
"Treatment mismatched to the task",
"Match the model and format to the job"
]
],
"t": "table",
"title": "Domain 7 in one page: symptom, root cause, lasting fix"
}
};
  (function () {
    var register = function (key) {
      D[key] = function () { return drawSpec(SPECS[key]); };
    };
    for (var key in SPECS) {
      if (Object.prototype.hasOwnProperty.call(SPECS, key)) register(key);
    }
  })();
  /* ===== END DIAGRAM ENGINE ===== */

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

  fetch('lessons/' + domainId + '.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (L) { start(L); })
    .catch(function (e) {
      page.innerHTML = '<div class="err"><b>Could not load the lesson.</b><br>lessons/' + esc(domainId) +
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