import { Injectable } from '@angular/core';

export class Task {
    id: number;
    parentId: number;
    title: string;
    start: Date;
    end: Date;
    progress: number;
}

const currentDate: Date = new Date(Date.now());
const month: number = currentDate.getMonth();
const year: number = currentDate.getFullYear();

let tasks: Task[] = [{
    'id': 1,
    'parentId': 0,
    'title': 'Johnson Residence Construction Project',
    'start': new Date(year, month - 1, 1),
    'end': new Date(year, month - 1, 1),
    'progress': 0
}, {
    'id': 2,
    'parentId': 1,
    'title': 'Planning and Pre-Construction Phase',
    'start': new Date(year, month - 1, 1),
    'end': new Date(year, month - 1, 1),
    'progress': 0
}, {
    'id': 3,
    'parentId': 2,
    'title': 'Architectural Design and Site Planning',
    'start': new Date(year, month - 1, 1),
    'end': new Date(year, month - 1, 15),
    'progress': 0
}, {
    'id': 4,
    'parentId': 2,
    'title': 'Engineering and Final Blueprint',
    'start': new Date(year, month - 1, 8),
    'end': new Date(year, month - 1, 15),
    'progress': 0
}, {
    'id': 5,
    'parentId': 2,
    'title': 'City Permits and Contracts',
    'start': new Date(year, month - 1, 15),
    'end': new Date(year, month - 1, 18),
    'progress': 0
}, {
    'id': 6,
    'parentId': 1,
    'title': 'Construction Phase',
    'start': new Date(year, month - 1, 18),
    'end': new Date(year, month - 1, 18),
    'progress': 0
}, {
    'id': 7,
    'parentId': 6,
    'title': 'Grading and Excavation',
    'start': new Date(year, month - 1, 18),
    'end': new Date(year, month - 1, 22),
    'progress': 0
}, {
    'id': 8,
    'parentId': 6,
    'title': 'Demolition and Removal',
    'start': new Date(year, month - 1, 19),
    'end': new Date(year, month - 1, 23),
    'progress': 0
}, {
    'id': 9,
    'parentId': 6,
    'title': 'Foundation and Concrete ',
    'start': new Date(year, month - 1, 22),
    'end': new Date(year, month - 1, 28),
    'progress': 0
}, {
    'id': 10,
    'parentId': 6,
    'title': 'Rough Framing and Carpentery',
    'start': new Date(year, month - 1, 25),
    'end': new Date(year, month, 5),
    'progress': 0
}, {
    'id': 11,
    'parentId': 6,
    'title': 'Inspection (Structure)',
    'start': new Date(year, month, 5),
    'end': new Date(year, month, 5),
    'progress': 0
}, {
    'id': 12,
    'parentId': 6,
    'title': 'Electrical Rough-in',
    'start': new Date(year, month, 6),
    'end': new Date(year, month, 19),
    'progress': 0
}, {
    'id': 13,
    'parentId': 6,
    'title': 'Plumbing Rough-in',
    'start': new Date(year, month, 19),
    'end': new Date(year, month, 19),
    'progress': 0
}, {
    'id': 14,
    'parentId': 6,
    'title': 'Heating and A/C',
    'start': new Date(year, month, 19),
    'end': new Date(year, month, 26),
    'progress': 0
}, {
    'id': 15,
    'parentId': 6,
    'title': 'Drywall',
    'start': new Date(year, month, 25),
    'end': new Date(year, month + 1, 10),
    'progress': 0
}, {
    'id': 16,
    'parentId': 6,
    'title': 'Painting (Exterior)',
    'start': new Date(year, month + 1, 7),
    'end': new Date(year, month + 1, 21),
    'progress': 0
}, {
    'id': 17,
    'parentId': 6,
    'title': 'Interior Carpentery (Interior)',
    'start': new Date(year, month + 1, 17),
    'end': new Date(year, month + 1, 28),
    'progress': 0
}, {
    'id': 18,
    'parentId': 6,
    'title': 'Flooring and Interior Paint',
    'start': new Date(year, month + 1, 26),
    'end': new Date(year, month + 2, 9),
    'progress': 0
}, {
    'id': 19,
    'parentId': 1,
    'title': 'Final Phase',
    'start': new Date(year, month + 2, 9),
    'end': new Date(year, month + 2, 9),
    'progress': 0
}, {
    'id': 20,
    'parentId': 19,
    'title': 'Review-Punch List',
    'start': new Date(year, month + 2, 9),
    'end': new Date(year, month + 2, 23),
    'progress': 0
}, {
    'id': 21,
    'parentId': 19,
    'title': 'Final Inspection',
    'start': new Date(year, month + 2, 24),
    'end': new Date(year, month + 2, 24),
    'progress': 0
}, {
    'id': 22,
    'parentId': 19,
    'title': 'Final Paperwork and Documents',
    'start': new Date(year, month + 2, 24),
    'end': new Date(year, month + 2, 28),
    'progress': 0
}];

@Injectable()
export class Service {
    getTasks(): Task[] {
        return tasks;
    }
}
