import VerticalRenderingStrategy from './strategy_vertical';

class WeekAppointmentRenderingStrategy extends VerticalRenderingStrategy {
    isApplyCompactAppointmentOffset() {
        if(this.isAdaptive && this._getMaxAppointmentCountPerCellByType() === 0) {
            return false;
        }

        return this.supportCompactDropDownAppointments();
    }
}

export default WeekAppointmentRenderingStrategy;
