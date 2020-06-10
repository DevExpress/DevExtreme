import { Injectable } from '@angular/core';

export class Employee {
    ID: number;
    FirstName: string;
    LastName: string;
    CompanyName: string;
    Position: string;
    OfficeNo: string;
    BirthDate: Date;
    HireDate: Date;
    Address: string;
    City: string;
    State: string;
    Zipcode: string;
    Phone: string;
    Email: string;
    Skype: string;
}

let employee: Employee = {
    ID: 1,
    FirstName: "John",
    LastName: "Heart",
    CompanyName: "Super Mart of the West",
    Position: "CEO",
    OfficeNo: "901",
    BirthDate: new Date(1964, 2, 16),
    HireDate: new Date(1995, 0, 15),
    Address: "351 S Hill St.",
    City: "Los Angeles",
    State: "CA",
    Zipcode: "90013",
    Phone: "+1(213) 555-9392",
    Email: "jheart@dx-email.com",
    Skype: "jheart_DX_skype"
};


@Injectable()
export class Service {
    getEmployee() : Employee {
        return employee;
    }
}
