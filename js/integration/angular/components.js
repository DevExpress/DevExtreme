"use strict";

var $ = require("jquery"),
    ngModule = require("./module");

ngModule.service("dxDigestCallbacks", ["$rootScope", function($rootScope) {
    var begin = $.Callbacks(),
        end = $.Callbacks();

    var digestPhase = false;

    $rootScope.$watch(function() {
        if(digestPhase) {
            return;
        }

        digestPhase = true;
        begin.fire();

        $rootScope.$$postDigest(function() {
            digestPhase = false;
            end.fire();
        });
    });

    return {
        begin: {
            add: function(callback) {
                if(digestPhase) {
                    callback();
                }
                begin.add(callback);
            },
            remove: begin.remove
        },
        end: end
    };
}]);
