import { Injectable } from '@angular/core';

export class Employee {
    LastName: string;
    FirstName: string;
    BirthYear: number;
    City: string;
    Title: string;
}

let employees: Employee[] = [
        { LastName: "Davolio", FirstName: "Nancy", BirthYear: 1948, City: "Seattle", Title: "Sales Representative" },
        { LastName: "Fuller", FirstName: "Andrew", BirthYear: 1952, City: "Tacoma", Title: "Vice President, Sales" },
        { LastName: "Leverling", FirstName: "Janet", BirthYear: 1963, City: "Kirkland", Title: "Sales Representative" },
        { LastName: "Peacock", FirstName: "Margaret", BirthYear: 1937, City: "Redmond", Title: "Sales Representative" },
        { LastName: "Buchanan", FirstName: "Steven", BirthYear: 1955, City: "London", Title: "Sales Manager" },
        { LastName: "Suyama", FirstName: "Michael", BirthYear: 1963, City: "London", Title: "Sales Representative" },
        { LastName: "King", FirstName: "Robert", BirthYear: 1960, City: "London", Title: "Sales Representative" },
        { LastName: "Callahan", FirstName: "Laura", BirthYear: 1958, City: "Seattle", Title: "Inside Sales Coordinator" },
        { LastName: "Dodsworth", FirstName: "Anne", BirthYear: 1966, City: "London", Title: "Sales Representative" }
];

@Injectable()
export class Service {
    getEmployees(): Employee[] {
        return employees;
    }
}