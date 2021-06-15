import { AppointmentDataSource } from './appointmentDataSource';
import { AppointmentFilterBaseStrategy, AppointmentFilterVirtualStrategy } from './appointmentFilter';
import { getResourceManager } from '../../resources/resourceManager';
import { extend } from '../../../../core/utils/extend';
import { each } from '../../../../core/utils/iterator';

const FilterStrategies = {
    virtual: 'virtual',
    standard: 'standard'
};

export class AppointmentDataProvider {
    constructor(options) {
        this.options = options;
        this.key = this.options.key;
        this.scheduler = this.options.scheduler;
        this.dataSource = this.options.dataSource;
        this.dataAccessors = this.combineDataAccessors(this.options.appointmentDataAccessors);
        this.filteredItems = [];

        this.appointmentDataSource = new AppointmentDataSource(this.dataSource);

        this.initFilterStrategy();
    }

    get filterMaker() { return this.getFilterStrategy().filterMaker; }
    get keyName() { return this.appointmentDataSource.keyName; }
    get filterStrategyName() {
        return this.scheduler.isVirtualScrolling()
            ? FilterStrategies.virtual
            : FilterStrategies.standard;
    }

    getFilterStrategy() {
        if(!this.filterStrategy || this.filterStrategy.strategyName !== this.filterStrategyName) {
            this.initFilterStrategy();
        }

        return this.filterStrategy;
    }

    initFilterStrategy() {
        const filterOptions = {
            scheduler: this.scheduler,
            dataSource: this.dataSource,
            dataAccessors: this.dataAccessors,
            startDayHour: this.options.startDayHour,
            endDayHour: this.options.endDayHour,
            appointmentDuration: this.options.endDayHour,
        };

        this.filterStrategy = this.filterStrategyName === FilterStrategies.virtual
            ? new AppointmentFilterVirtualStrategy(filterOptions)
            : new AppointmentFilterBaseStrategy(filterOptions);
    }

    setDataSource(dataSource) {
        this.dataSource = dataSource;
        this.initFilterStrategy();
        this.appointmentDataSource.setDataSource(this.dataSource);
    }

    updateDataAccessors(appointmentDataAccessors) {
        this.dataAccessors = this.combineDataAccessors(appointmentDataAccessors);
        this.initFilterStrategy();
    }

    combineDataAccessors(appointmentDataAccessors) { // TODO move to utils or get rid of it
        const result = extend(true, {}, appointmentDataAccessors);
        const resourceManager = getResourceManager(this.key);

        if(appointmentDataAccessors && resourceManager) {
            each(resourceManager._dataAccessors, (type, accessor) => {
                result[type].resources = accessor;
            });
        }

        return result;
    }

    // Filter mapping
    filter() {
        this.filteredItems = this.getFilterStrategy().filter();
    }

    filterByDate(min, max, remoteFiltering, dateSerializationFormat) {
        this.getFilterStrategy().filterByDate(min, max, remoteFiltering, dateSerializationFormat);
    }

    appointmentTakesAllDay(appointment, startDayHour, endDayHour) {
        return this.getFilterStrategy().appointmentTakesAllDay(appointment, startDayHour, endDayHour);
    }

    hasAllDayAppointments(appointments) {
        return this.getFilterStrategy().hasAllDayAppointments(appointments);
    }

    filterLoadedAppointments(filterOption, timeZoneCalculator) {
        return this.getFilterStrategy().filterLoadedAppointments(filterOption, timeZoneCalculator);
    }

    // From subscribe
    replaceWrongEndDate(appointment, startDate, endDate) {
        this.getFilterStrategy().replaceWrongEndDate(appointment, startDate, endDate);
    }

    calculateAppointmentEndDate(isAllDay, startDate) {
        return this.getFilterStrategy().calculateAppointmentEndDate(isAllDay, startDate);
    }

    appointmentTakesSeveralDays(appointment) {
        return this.getFilterStrategy().appointmentTakesSeveralDays(appointment);
    }

    // Appointment data source mappings
    cleanState() { this.appointmentDataSource.cleanState(); }
    getUpdatedAppointment() { return this.appointmentDataSource._updatedAppointment; }
    getUpdatedAppointmentKeys() { return this.appointmentDataSource._updatedAppointmentKeys; }

    add(rawAppointment) {
        return this.appointmentDataSource.add(rawAppointment);
    }

    update(target, rawAppointment) {
        return this.appointmentDataSource.update(target, rawAppointment);
    }

    remove(rawAppointment) {
        return this.appointmentDataSource.remove(rawAppointment);
    }
}

const appointmentDataProviders = { };

export const createAppointmentDataProvider = (key, options) => {
    const validKey = key || 0;
    appointmentDataProviders[validKey] = new AppointmentDataProvider({
        key,
        ...options
    });
};

export const getAppointmentDataProvider = (key = 0) => appointmentDataProviders[key];
export const removeAppointmentDataProvider = (key) => appointmentDataProviders[key] = null;
