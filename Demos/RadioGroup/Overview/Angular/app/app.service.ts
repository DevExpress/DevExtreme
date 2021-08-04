import { Injectable } from '@angular/core';

export class Task {
    subject: string;
    priority: number;
}

export class PriorityEntity {
    id: number;
    text: string;
}

const priorityEntities: PriorityEntity[] = [
    { id: 0, text: "Low" },
    { id: 1, text: "Normal" },
    { id: 2, text: "Urgent" },
    { id: 3, text: "High" },
];

let tasks: Task[] = [{
    subject: "Choose between PPO and HMO Health Plan",
    priority: 3
}, {
    subject: "Non-Compete Agreements",
    priority: 0
}, {
    subject: "Comment on Revenue Projections",
    priority: 1
}, {
    subject: "Sign Updated NDA",
    priority: 2
}, {
    subject: "Submit Questions Regarding New NDA",
    priority: 3
}, {
    subject: "Rollout of New Website and Marketing Brochures",
    priority: 3
}];

@Injectable()
export class Service {
    getTasks(): Task[] {
        return tasks;
    }
    getPriorityEntities(): PriorityEntity[] {
        return priorityEntities;
    }
}