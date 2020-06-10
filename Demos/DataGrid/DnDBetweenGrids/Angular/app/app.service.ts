import { Injectable } from '@angular/core';

export class Priority {
    id: number;
    text: string;
}

let priorities: Priority[] = [{
    id: 1, text: "Low"
}, {
    id: 2, text: "Normal"
}, {
    id: 3, text: "High"
}, {
    id: 4, text: "Urgent"
}];

@Injectable()
export class Service {
    getPriorities() {
        return priorities;
    }
}
