import $ from '../../core/renderer';

const KEYS = {
    SETTINGS: 'dxAppointmentSettings'
};

const utils = {
    dataAccessors: {
        getAppointmentSettings: element => {
            return $(element).data(KEYS.SETTINGS);
        },
        getAppointmentInfo: element => {
            const settings = utils.dataAccessors.getAppointmentSettings(element);
            return settings?.info;
        }
    }
};

export default utils;
