import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
    resourceId?: number;
}

export class Resource {
    id: number;
    text: string;
    color: string;
}

const dataSet: Appointment[] = [{
    text: "Website Re-Design Plan",
    startDate: new Date(2021, 8, 6, 9, 30),
    endDate: new Date(2021, 8, 6, 11, 30)
}, {
    text: "Book Flights to San Fran for Sales Trip",
    startDate: new Date(2021, 8, 6, 12, 0),
    endDate: new Date(2021, 8, 6, 13, 0),
    allDay: true
}, {
    text: "Install New Router in Dev Room",
    startDate: new Date(2021, 8, 6, 14, 30),
    endDate: new Date(2021, 8, 6, 15, 30)
}, {
    text: "Approve Personal Computer Upgrade Plan",
    startDate: new Date(2021, 8, 7, 10, 0),
    endDate: new Date(2021, 8, 7, 11, 0)
}, {
    text: "Final Budget Review",
    startDate: new Date(2021, 8, 7, 12, 0),
    endDate: new Date(2021, 8, 7, 13, 35)
}, {
    text: "New Brochures",
    startDate: new Date(2021, 8, 7, 14, 30),
    endDate: new Date(2021, 8, 7, 15, 45)
}, {
    text: "Install New Database",
    startDate: new Date(2021, 8, 8, 9, 45),
    endDate: new Date(2021, 8, 8, 11, 15)
}, {
    text: "Approve New Online Marketing Strategy",
    startDate: new Date(2021, 8, 8, 12, 0),
    endDate: new Date(2021, 8, 8, 14, 0)
}, {
    text: "Upgrade Personal Computers",
    startDate: new Date(2021, 8, 8, 15, 15),
    endDate: new Date(2021, 8, 8, 16, 30)
}, {
    text: "Customer Workshop",
    startDate: new Date(2021, 8, 9, 11, 0),
    endDate: new Date(2021, 8, 9, 12, 0),
    allDay: true
}, {
    text: "Prepare 2015 Marketing Plan",
    startDate: new Date(2021, 8, 9, 11, 0),
    endDate: new Date(2021, 8, 9, 13, 30)
}, {
    text: "Brochure Design Review",
    startDate: new Date(2021, 8, 9, 14, 0),
    endDate: new Date(2021, 8, 9, 15, 30)
}, {
    text: "Create Icons for Website",
    startDate: new Date(2021, 8, 10, 10, 0),
    endDate: new Date(2021, 8, 10, 11, 30)
}, {
    text: "Upgrade Server Hardware",
    startDate: new Date(2021, 8, 10, 14, 30),
    endDate: new Date(2021, 8, 10, 16, 0)
}, {
    text: "Submit New Website Design",
    startDate: new Date(2021, 8, 10, 16, 30),
    endDate: new Date(2021, 8, 10, 18, 0)
}, {
    text: "Launch New Website",
    startDate: new Date(2021, 8, 10, 12, 20),
    endDate: new Date(2021, 8, 10, 14, 0)
}
];

const colors = [
    'rgba(88, 116, 255, 0.8)',
    'rgba(234, 128, 252, 0.8)',
    'rgba(198, 86, 144, 0.85)',
    'rgba(254, 194, 0, 0.7)'
];

@Injectable()
export class Service {
    get resourcesAmount() { return 100; }

    generateResources(): Resource[] {
        const resources = [];

        for(let i = 0; i < this.resourcesAmount; ++i) {
            const color = colors[i % colors.length];

            resources.push({
                id: i,
                text: `Resource ${i}`,
                color: color
            });
        }

        return resources;
    };

    generateAppointments(): Appointment[] {
        const data = [];

        for(let resourceId = 0; resourceId < this.resourcesAmount; ++resourceId) {
            dataSet.forEach(item => {
                data.push({
                    text: item.text,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    resourceId
                });
            });
        }

        return data;
    }
}
