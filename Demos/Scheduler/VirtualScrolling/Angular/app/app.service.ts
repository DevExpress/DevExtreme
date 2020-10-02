import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
}

export class Resource {
    id: number;
    text: string;
    color: string;
}


@Injectable()
export class Service {
    private colors: string[];
    private texts: string[];

    constructor() {
        this.colors = [
            'rgba(63, 81, 181, 0.7)',
            'rgba(234, 128, 252, 0.7)',
            'rgba(223, 82, 134, 0.7)',
            'rgba(254, 194, 0, 0.7)'
        ];
        this.texts = [
            "Website Re-Design Plan",
            "Book Flights to San Fran for Sales Trip",
            "Install New Router in Dev Room",
            "Approve Personal Computer Upgrade Plan",
            "Final Budget Review",
            "New Brochures",
            "Install New Database",
            "Approve New Online Marketing Strategy",
            "Upgrade Personal Computers",
            "Customer Workshop",
            "Prepare 2015 Marketing Plan",
            "Brochure Design Review",
            "Create Icons for Website",
            "Upgrade Server Hardware",
            "Submit New Website Design",
            "Launch New Website",
          ];
    }

    get resourcesAmount() { return 100; }

    generateResources(): Resource[] {
        const resources = [];

        for(var i = 0; i < this.resourcesAmount; ++i) {
            const color = this.colors[i % this.colors.length];

            resources.push({
                id: i,
                text: `Resource ${i}`,
                color: color
            });
        }

        return resources;
    };

    generateAppointments(): Appointment[] {
        const startDay = 6;
        const endDay = 14;
        const startDayHour = 9;
        const endDayHour = 18;

        const appointments = [];

        for(let resourceId = 0; resourceId < this.resourcesAmount; ++resourceId) {
            for(let dayIndex = startDay; dayIndex <= endDay; ++dayIndex) {
                for(let count = 0; count < 10; ++count) {
                    const hour = this.getRandomInt(startDayHour, endDayHour);
                    const minutes = this.getRandomInt(15, 44);
                    const minutesBeforeHour = 60 - minutes;
                    const minMinutes = Math.min(minutes, minutesBeforeHour);
                    const maxMinutes = Math.max(minutes, minutesBeforeHour);
                    const appointmentTime = this.getRandomInt(minMinutes, maxMinutes) * 60 * 1000;
                    const startDate = new Date(2021, 8, dayIndex, hour, minutes);
                    const endDate = new Date(startDate.getTime() + appointmentTime);

                    const item = {
                        text: this.texts[this.getRandomInt(0, this.texts.length)],
                        resourceId: resourceId,
                        startDate: startDate,
                        endDate: endDate,
                    };
                    appointments.push(item);
                }
            }
        }

        return appointments;
    }

    private getRandomInt(min, max): number {
        return Math.floor(min + Math.random() * (max + 1 - min));
    };
}
