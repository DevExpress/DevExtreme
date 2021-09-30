import { isDefined } from '../../core/utils/type';
import { getAppointmentDataProvider } from './instanceFactory';

export const ExpressionUtils = {
    getField: (key, field, obj) => {
        const dataAccessors = getAppointmentDataProvider(key).getDataAccessors();

        if(!isDefined(dataAccessors.getter[field])) {
            return;
        }

        return dataAccessors.getter[field](obj);
    },
    setField: (key, field, obj, value) => {
        const { dataAccessors } = getAppointmentDataProvider(key);

        if(!isDefined(dataAccessors.setter[field])) {
            return;
        }

        dataAccessors.setter[field](obj, value);

        return obj;
    }
};
