import { Injectable } from '@angular/core';

export class Employee {
    ID: number;
    FirstName: string;
    LastName: string;
    Prefix: string;
    Position: string;
    BirthDate: string;
    Address: string;
    StateID: number;
};

export class State {
    ID: number;
    Name: string;
}

let employees: Employee[] = [
    {
        "ID": 1,
        "FirstName": "John",
        "LastName": "Heart",
        "Prefix": "Mr.",
        "Position": "CEO",
        "BirthDate": "1964/03/16",
        "Address": "351 S Hill St.",
        "StateID": 5
    }, {
        "ID": 2,
        "FirstName": "Olivia",
        "LastName": "Peyton",
        "Prefix": "Mrs.",
        "Position": "Sales Assistant",
        "BirthDate": "1981/06/03",
        "Address": "807 W Paseo Del Mar",
        "StateID": 5
    }, {
        "ID": 3,
        "FirstName": "Robert",
        "LastName": "Reagan",
        "Prefix": "Mr.",
        "Position": "CMO",
        "BirthDate": "1974/09/07",
        "Address": "4 Westmoreland Pl.",
        "StateID": 4
    }, {
        "ID": 4,
        "FirstName": "Greta",
        "LastName": "Sims",
        "Prefix": "Ms.",
        "Position": "HR Manager",
        "BirthDate": "1977/11/22",
        "Address": "1700 S Grandview Dr.",
        "StateID": 11
    }, {
        "ID": 5,
        "FirstName": "Brett",
        "LastName": "Wade",
        "Prefix": "Mr.",
        "Position": "IT Manager",
        "BirthDate": "1968/12/01",
        "Address": "1120 Old Mill Rd.",
        "StateID": 13
    }, {
        "ID": 6,
        "FirstName": "Sandra",
        "LastName": "Johnson",
        "Prefix": "Mrs.",
        "Position": "Controller",
        "BirthDate": "1974/11/15",
        "Address": "4600 N Virginia Rd.",
        "StateID": 44
    }, {
        "ID": 7,
        "FirstName": "Kevin",
        "LastName": "Carter",
        "Prefix": "Mr.",
        "Position": "Shipping Manager",
        "BirthDate": "1978/01/09",
        "Address": "424 N Main St.",
        "StateID": 5
    }, {
        "ID": 8,
        "FirstName": "Cynthia",
        "LastName": "Stanwick",
        "Prefix": "Ms.",
        "Position": "HR Assistant",
        "BirthDate": "1985/06/05",
        "Address": "2211 Bonita Dr.",
        "StateID": 4
    }, {
        "ID": 9,
        "FirstName": "Kent",
        "LastName": "Samuelson",
        "Prefix": "Dr.",
        "Position": "Ombudsman",
        "BirthDate": "1972/09/11",
        "Address": "12100 Mora Dr",
        "StateID": 26
    }, {
        "ID": 10,
        "FirstName": "Taylor",
        "LastName": "Riley",
        "Prefix": "Mr.",
        "Position": "Network Admin",
        "BirthDate": "1982/08/14",
        "Address": "7776 Torreyson Dr",
        "StateID": 5
    }, {
        "ID": 11,
        "FirstName": "Sam",
        "LastName": "Hill",
        "Prefix": "Mr.",
        "Position": "Sales Assistant",
        "BirthDate": "1984/02/17",
        "Address": "645 Prospect Crescent",
        "StateID": 11
    }, {
        "ID": 12,
        "FirstName": "Kelly",
        "LastName": "Rodriguez",
        "Prefix": "Ms.",
        "Position": "Support Assistant",
        "BirthDate": "1988/05/11",
        "Address": "1601 W Mountain St.",
        "StateID": 5
    }, {
        "ID": 13,
        "FirstName": "Natalie",
        "LastName": "Maguirre",
        "Prefix": "Mrs.",
        "Position": "Trainer",
        "BirthDate": "1977/10/07",
        "Address": "6400 E Bixby Hill Rd",
        "StateID": 29
    }, {
        "ID": 14,
        "FirstName": "Walter",
        "LastName": "Hobbs",
        "Prefix": "Mr.",
        "Position": "Programmer",
        "BirthDate": "1984/12/24",
        "Address": "10385 Shadow Oak Dr",
        "StateID": 13
    }
];


let states: State[] = [
    {
        "ID": 1,
        "Name": "Alabama"
    }, {
        "ID": 2,
        "Name": "Alaska"
    }, {
        "ID": 3,
        "Name": "Arizona"
    }, {
        "ID": 4,
        "Name": "Arkansas"
    }, {
        "ID": 5,
        "Name": "California"
    }, {
        "ID": 6,
        "Name": "Colorado"
    }, {
        "ID": 7,
        "Name": "Connecticut"
    }, {
        "ID": 8,
        "Name": "Delaware"
    }, {
        "ID": 9,
        "Name": "District of Columbia"
    }, {
        "ID": 10,
        "Name": "Florida"
    }, {
        "ID": 11,
        "Name": "Georgia"
    }, {
        "ID": 12,
        "Name": "Hawaii"
    }, {
        "ID": 13,
        "Name": "Idaho"
    }, {
        "ID": 14,
        "Name": "Illinois"
    }, {
        "ID": 15,
        "Name": "Indiana"
    }, {
        "ID": 16,
        "Name": "Iowa"
    }, {
        "ID": 17,
        "Name": "Kansas"
    }, {
        "ID": 18,
        "Name": "Kentucky"
    }, {
        "ID": 19,
        "Name": "Louisiana"
    }, {
        "ID": 20,
        "Name": "Maine"
    }, {
        "ID": 21,
        "Name": "Maryland"
    }, {
        "ID": 22,
        "Name": "Massachusetts"
    }, {
        "ID": 23,
        "Name": "Michigan"
    }, {
        "ID": 24,
        "Name": "Minnesota"
    }, {
        "ID": 25,
        "Name": "Mississippi"
    }, {
        "ID": 26,
        "Name": "Missouri"
    }, {
        "ID": 27,
        "Name": "Montana"
    }, {
        "ID": 28,
        "Name": "Nebraska"
    }, {
        "ID": 29,
        "Name": "Nevada"
    }, {
        "ID": 30,
        "Name": "New Hampshire"
    }, {
        "ID": 31,
        "Name": "New Jersey"
    }, {
        "ID": 32,
        "Name": "New Mexico"
    }, {
        "ID": 33,
        "Name": "New York"
    }, {
        "ID": 34,
        "Name": "North Carolina"
    }, {
        "ID": 35,
        "Name": "Ohio"
    }, {
        "ID": 36,
        "Name": "Oklahoma"
    }, {
        "ID": 37,
        "Name": "Oregon"
    }, {
        "ID": 38,
        "Name": "Pennsylvania"
    }, {
        "ID": 39,
        "Name": "Rhode Island"
    }, {
        "ID": 40,
        "Name": "South Carolina"
    }, {
        "ID": 41,
        "Name": "South Dakota"
    }, {
        "ID": 42,
        "Name": "Tennessee"
    }, {
        "ID": 43,
        "Name": "Texas"
    }, {
        "ID": 44,
        "Name": "Utah"
    }, {
        "ID": 45,
        "Name": "Vermont"
    }, {
        "ID": 46,
        "Name": "Virginia"
    }, {
        "ID": 47,
        "Name": "Washington"
    }, {
        "ID": 48,
        "Name": "West Virginia"
    }, {
        "ID": 49,
        "Name": "Wisconsin"
    }, {
        "ID": 50,
        "Name": "Wyoming"
    }, {
        "ID": 51,
        "Name": "North Dakota"
}];

@Injectable()
export class Service {
    getEmployees() {
        return employees;
    }

    getStates() {
        return states;
    }
}
