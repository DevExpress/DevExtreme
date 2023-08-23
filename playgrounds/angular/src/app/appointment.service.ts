import { Injectable } from '@angular/core';

export class Appointment {
    Text: string;
    OwnerId: number[];
    StartDate: Date;
    EndDate: Date;
}

let Appointments: Appointment[] = [
    {
        Text: 'Website Re-Design Plan',
        OwnerId: [4],
        StartDate: new Date(2015, 4, 25, 9, 30),
        EndDate: new Date(2015, 4, 25, 11, 30)
    }, {
        Text: 'Book Flights to San Fran for Sales Trip',
        OwnerId: [2],
        StartDate: new Date(2015, 4, 25, 12, 0),
        EndDate: new Date(2015, 4, 25, 13, 0)
    }, {
        Text: 'Install New Router in Dev Room',
        OwnerId: [1],
        StartDate: new Date(2015, 4, 25, 14, 30),
        EndDate: new Date(2015, 4, 25, 15, 30)
    }, {
        Text: 'Approve Personal Computer Upgrade Plan',
        OwnerId: [3],
        StartDate: new Date(2015, 4, 26, 10, 0),
        EndDate: new Date(2015, 4, 26, 11, 0)
    }, {
        Text: 'Final Budget Review',
        OwnerId: [1],
        StartDate: new Date(2015, 4, 26, 12, 0),
        EndDate: new Date(2015, 4, 26, 13, 35)
    }, {
        Text: 'New Brochures',
        OwnerId: [4],
        StartDate: new Date(2015, 4, 26, 14, 30),
        EndDate: new Date(2015, 4, 26, 15, 45)
    }, {
        Text: 'Install New Database',
        OwnerId: [2],
        StartDate: new Date(2015, 4, 27, 9, 45),
        EndDate: new Date(2015, 4, 27, 11, 15)
    }, {
        Text: 'Approve New Online Marketing Strategy',
        OwnerId: [3, 4],
        StartDate: new Date(2015, 4, 27, 12, 0),
        EndDate: new Date(2015, 4, 27, 14, 0)
    }, {
        Text: 'Upgrade Personal Computers',
        OwnerId: [2],
        StartDate: new Date(2015, 4, 27, 15, 15),
        EndDate: new Date(2015, 4, 27, 16, 30)
    }, {
        Text: 'Prepare 2015 Marketing Plan',
        OwnerId: [1, 3],
        StartDate: new Date(2015, 4, 28, 11, 0),
        EndDate: new Date(2015, 4, 28, 13, 30)
    }, {
        Text: 'Brochure Design Review',
        OwnerId: [4],
        StartDate: new Date(2015, 4, 28, 14, 0),
        EndDate: new Date(2015, 4, 28, 15, 30)
    }, {
        Text: 'Create Icons for Website',
        OwnerId: [3],
        StartDate: new Date(2015, 4, 29, 10, 0),
        EndDate: new Date(2015, 4, 29, 11, 30)
    }, {
        Text: 'Upgrade Server Hardware',
        OwnerId: [4],
        StartDate: new Date(2015, 4, 29, 14, 30),
        EndDate: new Date(2015, 4, 29, 16, 0)
    }, {
        Text: 'Submit New Website Design',
        OwnerId: [1],
        StartDate: new Date(2015, 4, 29, 16, 30),
        EndDate: new Date(2015, 4, 29, 18, 0)
    }, {
        Text: 'Launch New Website',
        OwnerId: [2],
        StartDate: new Date(2015, 4, 29, 12, 20),
        EndDate: new Date(2015, 4, 29, 14, 0)
    }
];

@Injectable()
export class AppointmentService {
  getAppointments() {
    return Appointments;
  }
}
