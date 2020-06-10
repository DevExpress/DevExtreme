import { Injectable } from '@angular/core';

export class Task {
    subject: string;
    priority: string
}

let tasks: Task[] = [{
    subject: "Choose between PPO and HMO Health Plan",
    priority: "High"
}, {
    subject: "Non-Compete Agreements",
    priority: "Low"
}, {
    subject: "Comment on Revenue Projections",
    priority: "Normal"
}, {
    subject: "Sign Updated NDA",
    priority: "Urgent"
}, {
    subject: "Submit Questions Regarding New NDA",
    priority: "High"
}, {
    subject: "Rollout of New Website and Marketing Brochures",
    priority: "High"
}];

@Injectable()
export class Service {
    getTasks(): Task[] {
        return tasks;
    }
}