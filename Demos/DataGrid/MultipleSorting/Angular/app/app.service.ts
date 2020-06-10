import { Injectable } from '@angular/core';

export class Employee {
    ID: number;
    FirstName: string;
    LastName: string;
    Phone: string;
    Prefix: string;
    Position: string;
    BirthDate: string;
    HireDate: string;
    Email: string;
    Address: string;
    City: string;
    State: string;
    StateID: number;
    HomePhone: string;
    Skype: string;
}

let employees: Employee[] = [{
    "ID" : 1,
    "FirstName" : "John",
    "LastName" : "Heart",
    "Phone" : "(213) 555-9392",
    "Prefix" : "Mr.",
    "Position" : "CEO",
    "BirthDate" : "1964-03-16",
    "HireDate" : "1995-01-15",
    "Email" : "jheart@dx-email.com",
    "Address" : "351 S Hill St.",
    "City" : "Los Angeles",
    "StateID" : 5,
    "State" : "California",
    "HomePhone" : "(213) 555-9208",
    "Skype" : "jheartDXskype"
}, {
    "ID" : 2,
    "FirstName" : "Olivia",
    "LastName" : "Peyton",
    "Phone" : "(310) 555-2728",
    "Prefix" : "Mrs.",
    "Position" : "Sales Assistant",
    "BirthDate" : "1981-06-03",
    "HireDate" : "2012-05-14",
    "Email" : "oliviap@dx-email.com",
    "Address" : "807 W Paseo Del Mar",
    "City" : "Los Angeles",
    "StateID" : 5,
    "State" : "California",
    "HomePhone" : "(310) 555-4547",
    "Skype" : "oliviapDXskype"
}, {
    "ID" : 3,
    "FirstName" : "Robert",
    "LastName" : "Reagan",
    "Phone" : "(818) 555-2387",
    "Prefix" : "Mr.",
    "Position" : "CMO",
    "BirthDate" : "1974-09-07",
    "HireDate" : "2002-11-08",
    "Email" : "robertr@dx-email.com",
    "Address" : "4 Westmoreland Pl.",
    "City" : "Bentonville",
    "StateID" : 4,
    "State" : "Arkansas",
    "HomePhone" : "(818) 555-2438",
    "Skype" : "robertrDXskype"
}, {
    "ID" : 4,
    "FirstName" : "Greta",
    "LastName" : "Sims",
    "Phone" : "(818) 555-6546",
    "Prefix" : "Ms.",
    "Position" : "HR Manager",
    "BirthDate" : "1977-11-22",
    "HireDate" : "1998-04-23",
    "Email" : "gretas@dx-email.com",
    "Address" : "1700 S Grandview Dr.",
    "City" : "Atlanta",
    "StateID" : 11,
    "State" : "Georgia",
    "HomePhone" : "(818) 555-0976",
    "Skype" : "gretasDXskype"
}, {
    "ID" : 5,
    "FirstName" : "Brett",
    "LastName" : "Wade",
    "Phone" : "(626) 555-0358",
    "Prefix" : "Mr.",
    "Position" : "IT Manager",
    "BirthDate" : "1968-12-01",
    "HireDate" : "2009-03-06",
    "Email" : "brettw@dx-email.com",
    "Address" : "1120 Old Mill Rd.",
    "City" : "Boise",
    "StateID" : 13,
    "State" : "Idaho",
    "HomePhone" : "(626) 555-5985",
    "Skype" : "brettwDXskype"
}, {
    "ID" : 6,
    "FirstName" : "Sandra",
    "LastName" : "Johnson",
    "Phone" : "(562) 555-2082",
    "Prefix" : "Mrs.",
    "Position" : "Controller",
    "BirthDate" : "1974-11-15",
    "HireDate" : "2005-05-11",
    "Email" : "sandraj@dx-email.com",
    "Address" : "4600 N Virginia Rd.",
    "City" : "Beaver",
    "StateID" : 44,
    "State" : "Utah",
    "HomePhone" : "(562) 555-8272",
    "Skype" : "sandrajDXskype"
}, {
    "ID" : 7,
    "FirstName" : "Kevin",
    "LastName" : "Carter",
    "Phone" : "(213) 555-2840",
    "Prefix" : "Mr.",
    "Position" : "Shipping Manager",
    "BirthDate" : "1978-01-09",
    "HireDate" : "2009-08-11",
    "Email" : "kevinc@dx-email.com",
    "Address" : "424 N Main St.",
    "City" : "San Diego",
    "StateID" : 5,
    "State" : "California",
    "HomePhone" : "(213) 555-8038",
    "Skype" : "kevincDXskype"
}, {
    "ID" : 8,
    "FirstName" : "Cynthia",
    "LastName" : "Stanwick",
    "Phone" : "(818) 555-6655",
    "Prefix" : "Ms.",
    "Position" : "HR Assistant",
    "BirthDate" : "1985-06-05",
    "HireDate" : "2008-03-24",
    "Email" : "cindys@dx-email.com",
    "Address" : "2211 Bonita Dr.",
    "City" : "Little Rock",
    "StateID" : 4,
    "State" : "Arkansas",
    "HomePhone" : "(818) 555-6808",
    "Skype" : "cindysDXskype"
}, {
    "ID" : 9,
    "FirstName" : "Kent",
    "LastName" : "Samuelson",
    "Phone" : "(562) 555-9282",
    "Prefix" : "Dr.",
    "Position" : "Ombudsman",
    "BirthDate" : "1972-09-11",
    "HireDate" : "2009-04-22",
    "Email" : "kents@dx-email.com",
    "Address" : "12100 Mora Dr",
    "City" : "St. Louis",
    "StateID" : 26,
    "State" : "Missouri",
    "HomePhone" : "(562) 555-1328",
    "Skype" : "kentsDXskype"
}, {
    "ID" : 10,
    "FirstName" : "Taylor",
    "LastName" : "Riley",
    "Phone" : "(310) 555-7276",
    "Prefix" : "Mr.",
    "Position" : "Network Admin",
    "BirthDate" : "1982-08-14",
    "HireDate" : "2012-04-14",
    "Email" : "taylorr@dx-email.com",
    "Address" : "7776 Torreyson Dr",
    "City" : "San Jose",
    "StateID" : 5,
    "State" : "California",
    "HomePhone" : "(310) 555-9712",
    "Skype" : "taylorrDXskype"
}];

@Injectable()
export class Service {
    getEmployees() : Employee[] {
        return employees;
    }
}
