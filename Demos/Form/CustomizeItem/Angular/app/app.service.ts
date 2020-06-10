import { Injectable } from '@angular/core';

export class Employee {
    ID: number;
    FirstName: string;
    LastName: string;
    Position: string;
    BirthDate: string;
    HireDate: string;
    Notes: string;
    Address: string;
    Phone: string;
    Email: string;
}

let employee : Employee = {
    ID: 1,
    FirstName: "John",
    LastName: "Heart",
    Position: "CEO",
    BirthDate: "1964/03/16",
    HireDate: "1995/01/15",
    Notes: "John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.",
    Address: "351 S Hill St., Los Angeles, CA",
    Phone: "360-684-1334",
    Email: "jheart@dx-email.com"
};

let positions : string[] = [
    "HR Manager",
    "IT Manager",
    "CEO",
    "Controller",
    "Sales Manager",
    "Support Manager",
    "Shipping Manager"
];



@Injectable()
export class Service {
    getEmployee() : Employee {
        return employee;
    }

    getPositions() : string[] {
        return positions
    }
}
