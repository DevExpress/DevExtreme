import { isDefined } from '../../core/utils/type';
import { getAppointmentDataProvider, getModel } from './instanceFactory';

export const ExpressionUtils = {
    getField: (key, field, obj) => {
        const { dataAccessors } = getAppointmentDataProvider(key);

        if(isDefined(dataAccessors.getter[field])) {
            return dataAccessors.getter[field](obj);
        }
    },
    setField: (key, field, obj, value) => {
        const { dataAccessors } = getAppointmentDataProvider(key);
        const model = getModel(key);

        if(!isDefined(dataAccessors.setter[field])) {
            return;
        }

        const fieldExpression = model[`${field}Expr`];
        const splitExprStr = fieldExpression.split('.');
        const rootField = splitExprStr[0];

        if(obj[rootField] === undefined && splitExprStr.length > 1) {
            const emptyChain = (function(arr) {
                const result = {};
                let tmp = result;
                const arrLength = arr.length - 1;

                for(let i = 1; i < arrLength; i++) {
                    tmp = tmp[arr[i]] = {};
                }

                return result;
            })(splitExprStr);

            obj[rootField] = emptyChain;
        }

        dataAccessors.setter[field](obj, value);

        return obj;
    }
};
