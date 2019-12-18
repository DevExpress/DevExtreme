var Callbacks = require('../../core/utils/callbacks'),
    ngModule = require('./module');

ngModule.service('dxDigestCallbacks', ['$rootScope', function($rootScope) {
    var begin = Callbacks(),
        prioritizedEnd = Callbacks(),
        end = Callbacks();

    var digestPhase = false;

    $rootScope.$watch(function() {
        if(digestPhase) {
            return;
        }

        digestPhase = true;
        begin.fire();

        $rootScope.$$postDigest(function() {
            digestPhase = false;
            prioritizedEnd.fire();
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
            remove: begin.remove.bind(begin)
        },
        end: {
            add: end.add.bind(end),
            addPrioritized: prioritizedEnd.add.bind(prioritizedEnd),
            remove: end.remove.bind(end)
        }
    };
}]);
