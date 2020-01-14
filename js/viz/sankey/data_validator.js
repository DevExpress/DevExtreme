const graphModule = require('./graph');

const validator = {
    validate: function(data, incidentOccurred) {
        let result = null;
        if(this._hasCycle(data)) {
            result = 'E2006';
            incidentOccurred('E2006');
        }
        return result;
    },
    _hasCycle: function(data) {
        return graphModule.struct.hasCycle(data);
    }
};

module.exports = validator;
