import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { getResourceManager } from './instanceFactory';
import { APPOINTMENT_SETTINGS_KEY } from './constants';

export const utils = {
    dataAccessors: {
        getAppointmentSettings: element => {
            return $(element).data(APPOINTMENT_SETTINGS_KEY);
        },

        getAppointmentInfo: element => {
            const settings = utils.dataAccessors.getAppointmentSettings(element);
            return settings?.info;
        },

        combine: (key, dataAccessors) => { // TODO get rid of it and rework resourceManager
            const result = extend(true, {}, dataAccessors);
            const resourceManager = getResourceManager(key);

            if(dataAccessors && resourceManager) {
                each(resourceManager._dataAccessors, (type, accessor) => {
                    result[type].resources = accessor;
                });
            }

            return result;
        }
    }
};
