import { Injectable } from '@angular/core';

export class Appointment {
  text: string;

  startDate: Date;

  endDate: Date;

  allDay?: boolean;
}

const appointments: Appointment[] = [{
  text: 'Book Flights to San Fran for Sales Trip',
  startDate: new Date('2021-03-28T17:00:00.000Z'),
  endDate: new Date('2021-03-28T18:00:00.000Z'),
  allDay: true,
}, {
  text: 'Customer Workshop',
  startDate: new Date('2021-03-29T17:30:00.000Z'),
  endDate: new Date('2021-04-03T19:00:00.000Z'),
}];

@Injectable()
export class Service {
  getAppointments(): Appointment[] {
    return appointments;
  }
}
