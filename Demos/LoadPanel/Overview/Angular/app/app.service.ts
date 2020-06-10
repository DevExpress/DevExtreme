import { Injectable } from '@angular/core';

export class Employee {
    Full_Name: string;
    Title: string;
    Birth_Date: string;
    Prefix: string;
    Address: string;
    City: string;
    Zipcode: number;
    Email: string;
    Skype: string;
    Home_Phone: string;
    Mobile_Phone: string;
}

let employee: Employee = {
    Full_Name: "John Heart",
    Title: "CEO",
    Birth_Date: "03/16/1964",
    Prefix: "Mr.",
    Address: "351 S Hill St.",
    City: "Los Angeles",
    Zipcode: 90013,
    Email: "jheart@dx-email.com",
    Skype: "jheart_DX_skype",
    Home_Phone: "(213) 555-9208",
    Mobile_Phone: "(213) 555-9392" 
};


@Injectable()
export class Service {
    getEmployee() : Employee {
        return employee;
    }
}
