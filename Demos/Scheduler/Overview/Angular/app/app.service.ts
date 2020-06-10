import { Injectable } from '@angular/core';

export class Employee {
    text: string;
    id: number;
    color: string;
    avatar: string;
	age: number;
	discipline: string;
}

export class Data {
    text: string;
    employeeID: number;
    startDate: Date;
    endDate: Date;
}


let employees: Employee[] = [{
    text : "John Heart",
    id: 1,
    color: "#56ca85",
    avatar: "../../../../images/gym/coach-man.png",
    age: 27,
    discipline: "ABS, Fitball, StepFit"
}, {
    text : "Sandra Johnson",
    id: 2,
    color: "#ff9747",
    avatar: "../../../../images/gym/coach-woman.png",
    age: 25,
    discipline: "ABS, Fitball, StepFit"
}];

let data: Data[] = [{ 
        text: "Helen",
        employeeID: 2,
        startDate: new Date(2016, 7, 2, 9, 30),
        endDate: new Date(2016, 7, 2, 11, 30)
    }, {
        text: "Helen",
        employeeID: 2,
       startDate: new Date(2016, 7, 11, 9, 30),
        endDate: new Date(2016, 7, 12, 11, 30)
    }, {
        text: "Alex",
        employeeID: 1,
        startDate: new Date(2016, 7, 3, 9, 30),
        endDate: new Date(2016, 7, 3, 11, 30)
    }, {
        text: "Alex",
        employeeID: 1,
        startDate: new Date(2016, 7, 12, 12, 0),
        endDate: new Date(2016, 7, 12, 13, 0)
    }, {
        text: "Alex",
        employeeID: 2,
        startDate: new Date(2016, 7, 17, 9, 30),
        endDate: new Date(2016, 7, 17, 11, 30)
    }, {
        text: "Stan",
        employeeID: 1,
        startDate: new Date(2016, 7, 8, 9, 30),
        endDate: new Date(2016, 7, 8, 11, 30)
    }, {
        text: "Stan",
        employeeID: 1,
        startDate: new Date(2016, 7, 29, 9, 30),
        endDate: new Date(2016, 7, 29, 11, 30)
    }, {
        text: "Stan",
        employeeID: 1,
        startDate: new Date(2016, 7, 31, 9, 30),
        endDate: new Date(2016, 7, 31, 11, 30)
    },
     {
        text: "Rachel",
        employeeID: 2,
        startDate: new Date(2016, 7, 5, 9, 30),
        endDate: new Date(2016, 7, 5, 11, 30)
    }, {
        text: "Rachel",
        employeeID: 2,
        startDate: new Date(2016, 7, 8, 9, 30),
        endDate: new Date(2016, 7, 8, 11, 30)
    }, {
        text: "Rachel",
        employeeID: 1,
        startDate: new Date(2016, 7, 22, 9, 30),
        endDate: new Date(2016, 7, 22, 11, 30)
    }, {
        text: "Kelly",
        employeeID: 2,
        startDate: new Date(2016, 7, 16, 9, 30),
        endDate: new Date(2016, 7, 16, 11, 30)
    }, {
        text: "Kelly",
        employeeID: 2,
        startDate: new Date(2016, 7, 30, 9, 30),
        endDate: new Date(2016, 7, 30, 11, 30)
    }];
	
@Injectable()
export class Service {
	getEmployees() {
		return employees;
	}
    getData() {
        return data;
    }
}
