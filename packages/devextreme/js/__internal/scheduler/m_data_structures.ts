/* eslint-disable @typescript-eslint/no-extraneous-class */
export class AppointmentTooltipInfo {
  constructor(
    public appointment: any,
    public targetedAppointment: any = undefined,
    public color: any[] = [],
    public settings: any[] = [],
  ) { // TODO
  }
}
