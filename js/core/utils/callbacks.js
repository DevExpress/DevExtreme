"use strict";

var isFunction = require("../../core/utils/type").isFunction,
    inArray = require("./array").inArray;

var Callbacks = function(options) {
    options = options || {};

    var list = [],
        queue = [],
        firing,
        firingIndexes = [];

    var fireCore = function(context, args) {
        var step = firingIndexes.length;

        for(firingIndexes[step] = 0; firingIndexes[step] < list.length; firingIndexes[step]++) {
            var result = list[firingIndexes[step]].apply(context, args);

            if(result === false && options.stopOnFalse) {
                break;
            }
        }

        firingIndexes.unshift(step);
    };

    var that = {
        add: function(fn) {
            if(isFunction(fn) && (!options.unique || !that.has(fn))) {
                list.push(fn);
            }
            return this;
        },

        remove: function(fn) {
            var index = inArray(fn, list);

            if(index > -1) {
                list.splice(index, 1);

                if(firing && firingIndexes.length) {
                    for(var step = 0; step < firingIndexes.length; step++) {
                        if(index <= firingIndexes[step]) {
                            firingIndexes[step]--;
                        }
                    }
                }
            }

            return this;
        },

        has: function(fn) {
            return fn ? inArray(fn, list) > -1 : !!list.length;
        },

        empty: function() {
            list = [];
            return this;
        },

        fireWith: function(context, args) {
            args = args || [];
            args = args.slice ? args.slice() : args;

            if(options.syncStrategy) {
                firing = true;
                fireCore(context, args);
            } else {
                queue.push([context, args]);
                if(firing) {
                    return;
                }

                firing = true;

                while(queue.length) {
                    var memory = queue.shift();

                    fireCore(memory[0], memory[1]);
                }
            }
            firing = false;

            return this;
        },

        fire: function() {
            that.fireWith(this, arguments);
            return this;
        },
    };

    return that;
};

module.exports = Callbacks;
