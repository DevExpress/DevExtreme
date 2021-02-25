import $ from '../../core/renderer';
import { APPOINTMENT_SETTINGS_KEY } from './constants';

const utils = {
    dataAccessors: {
        getAppointmentSettings: element => {
            return $(element).data(APPOINTMENT_SETTINGS_KEY);
        },
        getAppointmentInfo: element => {
            const settings = utils.dataAccessors.getAppointmentSettings(element);
            return settings?.info;
        }
    }
};

export default utils;
