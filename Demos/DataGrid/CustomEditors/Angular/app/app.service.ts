import { Injectable } from '@angular/core';

export class Status {
    id: number;
    name: string;
}

let statuses: Status[] = [{
    "id": 1, "name": "Not Started"
  }, {
    "id": 2, "name": "In Progress"
  }, {
    "id": 3, "name": "Deferred"
  }, {
    "id": 4, "name": "Need Assistance"
  }, {
    "id": 5, "name": "Completed"
  }
];

@Injectable()
export class Service {
    getStatuses() {
        return statuses;
    }
}