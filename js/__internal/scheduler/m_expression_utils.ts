import { isDefined } from '../../core/utils/type';

export const ExpressionUtils = {
    getField: (dataAccessors, field, obj) => {
        if(!isDefined(dataAccessors.getter[field])) {
            return;
        }

        return dataAccessors.getter[field](obj);
    },
    setField: (dataAccessors, field, obj, value) => {
        if(!isDefined(dataAccessors.setter[field])) {
            return;
        }

        dataAccessors.setter[field](obj, value);

        return obj;
    }
};
