var errors = require('../errors');

var Locker = function() {
    var info = {};

    var currentCount = function(lockName) {
        return info[lockName] || 0;
    };

    return {
        obtain: function(lockName) {
            info[lockName] = currentCount(lockName) + 1;
        },

        release: function(lockName) {
            var count = currentCount(lockName);

            if(count < 1) {
                throw errors.Error('E0014');
            }

            if(count === 1) {
                delete info[lockName];
            } else {
                info[lockName] = count - 1;
            }
        },

        locked: function(lockName) {
            return currentCount(lockName) > 0;
        }
    };
};

module.exports = Locker;
