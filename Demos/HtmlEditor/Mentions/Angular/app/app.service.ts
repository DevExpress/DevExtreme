import { Injectable } from '@angular/core';

export class Employee {
    text: string;
    team: string;
    icon: string;
}

let employees: Employee[] = [{
    text: "John Heart",
    team: "Engineering",
    icon: "../../../../images/mentions/John-Heart.png"
}, {
    text: "Kevin Carter",
    team: "Engineering",
    icon: "../../../../images/mentions/Kevin-Carter.png"
}, {
    text: "Olivia Peyton",
    team: "Management",
    icon: "../../../../images/mentions/Olivia-Peyton.png"
}, {
    text: "Robert Reagan",
    team: "Management",
    icon: "../../../../images/mentions/Robert-Reagan.png"
}, {
    text: "Cynthia Stanwick",
    team: "Engineering",
    icon: "../../../../images/mentions/Cynthia-Stanwick.png"
}, {
    text: "Brett Wade ",
    team: "Analysis",
    icon: "../../../../images/mentions/Brett-Wade.png"
}, {
    text: "Greta Sims",
    team: "QA",
    icon: "../../../../images/mentions/Greta-Sims.png"
}
];


@Injectable()
export class Service {
    getEmployees() : Employee[] {
        return employees;
    }
}
