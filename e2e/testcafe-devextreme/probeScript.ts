/* eslint-disable @stylistic/max-len */
export const PROBE_SCRIPT = `
(function () {
  try {
    var w = window;
    if (w.__probe) { return; }
    var seq = 0;
    var ids = new WeakMap();
    var idOf = function (n) { if (!n || n.nodeType !== 1) { return '-'; } if (!ids.has(n)) { ids.set(n, 'n' + (++seq)); } return ids.get(n); };
    var desc = function (el) {
      if (!el) { return 'null'; }
      if (el === document) { return 'document'; }
      if (el.nodeType !== 1) { return el.nodeName; }
      var cls = typeof el.className === 'string' ? el.className.split(' ').filter(function (c) { return c.indexOf('dx-') === 0 && c.indexOf('dx-state') !== 0 && c !== 'dx-widget'; }).slice(0, 3).join('.') : '';
      var text = (el.textContent || '').trim().slice(0, 10);
      return idOf(el) + ':' + (cls || el.tagName) + (text ? '"' + text + '"' : '') + (el.isConnected ? '' : '(detached)');
    };
    var chain = function (el) { var r = []; var p = el; while (p && p !== document) { r.push(idOf(p)); p = p.parentNode; } return r.join('>'); };
    var t0 = performance.now();
    var now = function () { return Math.round(performance.now() - t0); };
    var events = [];
    var muts = [];
    var perf = [];
    var tracking = false;
    var mdChain = null;
    var mdTarget = null;
    var push = function (arr, item, max) { arr.push(item); if (arr.length > max) { arr.shift(); } };
    w.__probe = { events: events, muts: muts, perf: perf, tooltipCalls: 0, created: 0, pageLoaded: Date.now(), now: now };
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'focusin', 'focusout', 'contextmenu'].forEach(function (type) {
      document.addEventListener(type, function (e) {
        var at = typeof e.clientX === 'number' ? document.elementFromPoint(e.clientX, e.clientY) : null;
        var rec = { t: now(), type: type, x: e.clientX, y: e.clientY, target: desc(e.target), at: desc(at), scrollY: window.scrollY };
        if (type === 'pointerdown') { tracking = true; mdTarget = e.target; mdChain = chain(e.target); rec.chain = mdChain; }
        if (type === 'mouseup' || type === 'click') { rec.mdConnected = mdTarget ? mdTarget.isConnected : null; rec.chainEqual = mdTarget ? chain(mdTarget) === mdChain : null; rec.sameAsMd = e.target === mdTarget; }
        push(events, rec, 60);
      }, true);
    });
    ['pointermove', 'mousemove'].forEach(function (type) {
      document.addEventListener(type, function (e) { if (!tracking) { return; } push(events, { t: now(), type: type, x: e.clientX, y: e.clientY, target: desc(e.target) }, 60); }, true);
    });
    document.addEventListener('scroll', function (e) {
      var el = e.target === document ? document.documentElement : e.target;
      push(events, { t: now(), type: 'scroll', target: desc(el), top: el.scrollTop, scrollY: window.scrollY }, 60);
    }, true);
    window.addEventListener('resize', function () { push(events, { t: now(), type: 'resize', inner: window.innerWidth + 'x' + window.innerHeight }, 60); });
    document.addEventListener('visibilitychange', function () { push(events, { t: now(), type: 'visibility', state: document.visibilityState }, 60); });
    if (document.fonts && document.fonts.addEventListener) {
      document.fonts.addEventListener('loadingdone', function () { push(events, { t: now(), type: 'fonts-loadingdone', n: document.fonts.size }, 60); });
      document.fonts.addEventListener('loading', function () { push(events, { t: now(), type: 'fonts-loading' }, 60); });
    }
    var observe = function (type, cb) {
      try { var o = new PerformanceObserver(function (list) { list.getEntries().forEach(cb); }); o.observe({ type: type, buffered: true }); } catch (e) { push(perf, { type: 'po-error', what: type, err: String(e) }, 60); }
    };
    observe('longtask', function (en) { push(perf, { t: Math.round(en.startTime - t0), type: 'longtask', dur: Math.round(en.duration) }, 80); });
    observe('layout-shift', function (en) { push(perf, { t: Math.round(en.startTime - t0), type: 'layout-shift', value: Math.round(en.value * 10000) / 10000 }, 80); });
    observe('resource', function (en) { if (/woff|ttf|otf|font/i.test(en.name)) { push(perf, { t: Math.round(en.responseEnd - t0), type: 'font-resource', name: en.name.slice(-45), dur: Math.round(en.duration) }, 80); } });
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        if (r.type !== 'childList') { return; }
        var isCreate = Array.prototype.some.call(r.addedNodes, function (n) { return n.nodeType === 1 && n.classList && n.classList.contains('dx-scheduler-work-space'); });
        if (isCreate) { events.length = 0; muts.length = 0; perf.length = 0; tracking = false; t0 = performance.now(); w.__probe.created += 1; w.__probe.tooltipCalls = 0; }
        push(muts, { t: now(), target: desc(r.target), added: Array.prototype.map.call(r.addedNodes, desc).slice(0, 3), removed: Array.prototype.map.call(r.removedNodes, desc).slice(0, 3), n: r.addedNodes.length + '/' + r.removedNodes.length }, 80);
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
    var patch = setInterval(function () {
      var S = w.DevExpress && w.DevExpress.ui && w.DevExpress.ui.dxScheduler;
      if (!S) { return; }
      clearInterval(patch);
      var orig = S.prototype.showAppointmentTooltipCore;
      S.prototype.showAppointmentTooltipCore = function () {
        w.__probe.tooltipCalls += 1;
        push(events, { t: now(), type: 'showAppointmentTooltipCore', target: desc(arguments[0] && arguments[0].get ? arguments[0].get(0) : arguments[0]) }, 60);
        return orig.apply(this, arguments);
      };
    }, 5);
  } catch (e) {
    window.__probeError = String(e);
  }
}());
`;
