import dateUtils from '../../../core/utils/date';

const toMs = dateUtils.dateToMilliseconds;
const HOUR_MS = toMs('hour');

export default class AppointmentFilter {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    get filterStrategy() {
        return this.scheduler.isVirtualScrolling()
            ? new AppointmentFilterVirtualStrategy(this.scheduler)
            : new AppointmentFilterBaseStrategy(this.scheduler);
    }

    filter() {
        return this.filterStrategy.filter();
    }

    hasAllDayAppointments(appointments) {
        return this.filterStrategy.hasAllDayAppointments(appointments);
    }
}

class AppointmentFilterBaseStrategy {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    get workspace() { return this.scheduler.getWorkSpace(); }
    get viewDataProvider() { return this.workspace.viewDataProvider; }
    get resourcesManager() { return this.scheduler._resourcesManager; }
    get appointmentModel() { return this.scheduler.getAppointmentModel(); }
    get timeZoneCalculator() { return this.scheduler.timeZoneCalculator; }

    get viewStartDayHour() { return this.scheduler._getCurrentViewOption('startDayHour'); }
    get viewEndDayHour() { return this.scheduler._getCurrentViewOption('endDayHour'); }
    get firstDayOfWeek() { return this.scheduler.getFirstDayOfWeek(); }

    get recurrenceExceptionGenerator() { return this.scheduler._getRecurrenceException.bind(this.scheduler); }

    filter() {
        const dateRange = this.workspace.getDateRange();
        const resources = this.resourcesManager.getResourcesData();

        let allDay;

        if(!this.scheduler.option('showAllDayPanel') && this.workspace.supportAllDayRow()) {
            allDay = false;
        }

        return this.appointmentModel.filterLoadedAppointments({
            startDayHour: this.viewStartDayHour,
            endDayHour: this.viewEndDayHour,
            viewStartDayHour: this.viewStartDayHour,
            viewEndDayHour: this.viewEndDayHour,
            min: dateRange[0],
            max: dateRange[1],
            resources: resources,
            allDay: allDay,
            firstDayOfWeek: this.firstDayOfWeek,
            recurrenceException: this.recurrenceExceptionGenerator,
        }, this.timeZoneCalculator);
    }

    hasAllDayAppointments(appointments) {
        return this.appointmentModel.hasAllDayAppointments(
            appointments,
            this.viewStartDayHour,
            this.viewEndDayHour
        );
    }
}

class AppointmentFilterVirtualStrategy extends AppointmentFilterBaseStrategy {
    constructor(scheduler) {
        super(scheduler);
    }

    filter() {
        const isCalculateStartAndEndDayHour = this.workspace.isDateAndTimeView;
        const checkIntersectViewport = this.workspace.isDateAndTimeView && this.workspace.viewDirection === 'horizontal';

        const isAllDayWorkspace = !this.workspace.supportAllDayRow();
        const showAllDayAppointments = this.scheduler.option('showAllDayPanel') || isAllDayWorkspace;

        const endViewDate = this.workspace.getEndViewDateByEndDayHour();
        const filterOptions = [];

        const groupsInfo = this.viewDataProvider.getCompletedGroupsInfo();
        groupsInfo.forEach((item) => {
            const groupIndex = item.groupIndex;
            const groupStartDate = item.startDate;

            const groupEndDate = new Date(Math.min(item.endDate, endViewDate));
            const startDayHour = isCalculateStartAndEndDayHour
                ? groupStartDate.getHours()
                : this.viewStartDayHour;
            const endDayHour = isCalculateStartAndEndDayHour
                ? (startDayHour + groupStartDate.getMinutes() / 60 + (groupEndDate - groupStartDate) / HOUR_MS)
                : this.viewEndDayHour;

            const resources = this._getPrerenderFilterResources(groupIndex);

            const allDayPanel = this.viewDataProvider.getAllDayPanel(groupIndex);
            // TODO split by workspace strategies
            const supportAllDayAppointment = isAllDayWorkspace || (!!showAllDayAppointments && allDayPanel?.length > 0);

            filterOptions.push({
                isVirtualScrolling: true,
                startDayHour,
                endDayHour,
                viewStartDayHour: this.viewStartDayHour,
                viewEndDayHour: this.viewEndDayHour,
                min: groupStartDate,
                max: groupEndDate,
                allDay: supportAllDayAppointment,
                resources,
                firstDayOfWeek: this.firstDayOfWeek,
                recurrenceException: this.recurrenceExceptionGenerator,
                checkIntersectViewport
            });
        });

        return this.appointmentModel.filterLoadedVirtualAppointments(
            filterOptions,
            this.timeZoneCalculator,
            this.workspace._getGroupCount()
        );
    }

    hasAllDayAppointments() {
        return this.appointmentModel.filterAllDayAppointments({
            viewStartDayHour: this.viewStartDayHour,
            viewEndDayHour: this.viewEndDayHour,
        }).length > 0;
    }

    _getPrerenderFilterResources(groupIndex) {
        const cellGroup = this.viewDataProvider.getCellsGroup(groupIndex);

        return this.resourcesManager.getResourcesDataByGroups([cellGroup]);
    }
}
