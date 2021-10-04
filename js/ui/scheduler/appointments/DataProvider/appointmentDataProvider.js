import { AppointmentDataSource } from './appointmentDataSource';
import { AppointmentFilterBaseStrategy, AppointmentFilterVirtualStrategy } from './appointmentFilter';
import { ExpressionUtils } from '../../expressionUtils';
import { createAppointmentAdapter } from '../../appointmentAdapter';
import { getAppointmentTakesSeveralDays } from './utils';

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
            getLoadedResources: this.options.getLoadedResources,
            getSupportAllDayRow: this.options.getSupportAllDayRow,
            getViewType: this.options.getViewType,
            getViewDirection: this.options.getViewDirection,
            getDateRange: this.options.getDateRange,
            getGroupCount: this.options.getGroupCount,
            getViewDataProvider: this.options.getViewDataProvider
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

    filterLoadedAppointments(filterOption, timeZoneCalculator) {
        return this.getFilterStrategy().filterLoadedAppointments(filterOption, timeZoneCalculator);
    }

    // From subscribe
    replaceWrongEndDate(rawAppointment, startDate, endDate) {
        const adapter = createAppointmentAdapter(rawAppointment, this.dataAccessors, this.timeZoneCalculator);
        this.getFilterStrategy().replaceWrongEndDate(adapter, startDate, endDate);
    }

    calculateAppointmentEndDate(isAllDay, startDate) {
        return this.getFilterStrategy().calculateAppointmentEndDate(isAllDay, startDate);
    }

    appointmentTakesSeveralDays(rawAppointment) {
        const adapter = createAppointmentAdapter(rawAppointment, this.dataAccessors, this.timeZoneCalculator);
        return getAppointmentTakesSeveralDays(adapter);
    }

    sortAppointmentsByStartDate(appointments) {
        appointments.sort((a, b) => {
            const firstDate = new Date(ExpressionUtils.getField(this.dataAccessors, 'startDate', a.settings || a));
            const secondDate = new Date(ExpressionUtils.getField(this.dataAccessors, 'startDate', b.settings || b));

            return Math.sign(firstDate.getTime() - secondDate.getTime());
        });
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
