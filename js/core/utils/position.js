const config = require('../config');

const getDefaultAlignment = function(isRtlEnabled) {
    const rtlEnabled = isRtlEnabled || config().rtlEnabled;

    return rtlEnabled ? 'right' : 'left';
};

exports.getDefaultAlignment = getDefaultAlignment;
