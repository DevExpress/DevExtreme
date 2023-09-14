import graphModule from './graph';

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

export default validator;
