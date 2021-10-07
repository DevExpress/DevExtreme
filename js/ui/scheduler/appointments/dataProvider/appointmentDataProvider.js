import { AppointmentDataSource } from './appointmentDataSource';
import { AppointmentFilterBaseStrategy, AppointmentFilterVirtualStrategy } from './appointmentFilter';
import { createAppointmentAdapter } from '../../appointmentAdapter';

const FilterStrategies = {
    virtual: 'virtual',
    standard: 'standard'
};

export class AppointmentDataProvider {
    constructor(options) {
        this.options = options;
        this.dataSource = this.options.dataSource;
        this.dataAccessors = this.options.dataAccessors;
        this.timeZoneCalculator = this.options.timeZoneCalculator;

        this.appointmentDataSource = new AppointmentDataSource(this.dataSource);

        this.initFilterStrategy();
    }

    get filterMaker() { return this.getFilterStrategy().filterMaker; }
    get keyName() { return this.appointmentDataSource.keyName; }
    get filterStrategyName() {
        return this.options.getIsVirtualScrolling()
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
            resources: this.options.resources,
            dataSource: this.dataSource,
            dataAccessors: this.dataAccessors,
            startDayHour: this.options.startDayHour,
            endDayHour: this.options.endDayHour,
            appointmentDuration: this.options.appointmentDuration,
            showAllDayPanel: this.options.showAllDayPanel,
            timeZoneCalculator: this.options.timeZoneCalculator,
            //
            loadedResources: this.options.getLoadedResources,
            supportAllDayRow: this.options.getSupportAllDayRow,
            viewType: this.options.getViewType,
            viewDirection: this.options.getViewDirection,
            dateRange: this.options.getDateRange,
            groupCount: this.options.getGroupCount,
            viewDataProvider: this.options.getViewDataProvider
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

    updateDataAccessors(dataAccessors) {
        this.dataAccessors = dataAccessors;
        this.initFilterStrategy();
    }

    // Filter mapping
    filter() {
        return this.getFilterStrategy().filter();
    }

    filterByDate(min, max, remoteFiltering, dateSerializationFormat) {
        this.getFilterStrategy().filterByDate(min, max, remoteFiltering, dateSerializationFormat);
    }


    hasAllDayAppointments(rawAppointments) {
        const adapters = rawAppointments.map((item) => createAppointmentAdapter(item, this.dataAccessors, this.timeZoneCalculator));
        return this.getFilterStrategy().hasAllDayAppointments(adapters);
    }

    filterLoadedAppointments(filterOption, preparedItems) {
        return this.getFilterStrategy().filterLoadedAppointments(filterOption, preparedItems);
    }

    calculateAppointmentEndDate(isAllDay, startDate) {
        return this.getFilterStrategy().calculateAppointmentEndDate(isAllDay, startDate);
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
