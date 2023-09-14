import { Selector } from 'testcafe';

const CLASS = {
  dialog: 'dx-dialog.dx-popup',
  dialogButton: 'dx-dialog-button',
};

export default class AppointmentDialog {
  element: Selector;

  series: Selector;

  appointment: Selector;

  constructor() {
    this.element = Selector(`.${CLASS.dialog}`);
    this.series = this.element.find(`.${CLASS.dialogButton}`).nth(0);
    this.appointment = this.element.find(`.${CLASS.dialogButton}`).nth(1);
  }
}
