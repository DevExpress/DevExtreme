import { Injectable } from '@angular/core';

export class Employee {
    FirstName: string;
    LastName: string;    
    Address: string;
    City: string;
    Phones: string[];
}

let employee : Employee = {
    FirstName: "John",
    LastName: "Heart",
    Address: "351 S Hill St., Los Angeles, CA",
    City: 'Atlanta',
    Phones: ["8005552797", "8005953232"]
};

@Injectable()
export class Service {
    getEmployee() : Employee {
        return employee;
    }
}
