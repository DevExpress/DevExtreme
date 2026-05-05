define(function(require, exports, module) {
    function callable() { return proxy; }
    // eslint-disable-next-line no-var
    var proxy = new Proxy(callable, { get: function() { return proxy; } });
    exports.z = proxy;
    Object.defineProperty(exports, '__esModule', { value: true });
});
