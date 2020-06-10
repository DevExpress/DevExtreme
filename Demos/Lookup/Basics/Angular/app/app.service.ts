import { Injectable } from '@angular/core';

export class Task {
    Id: number;
    Assigned: string;
    Subject: string;
}

let employeesList: string[] = [
    "John Heart", "Samantha Bright", "Arthur Miller", "Robert Reagan", "Greta Sims", "Brett Wade", 
    "Sandra Johnson", "Ed Holmes", "Barb Banks", "Kevin Carter", "Cindy Stanwick", "Sammy Hill", "Davey Jones", "Victor Norris", 
    "Mary Stern", "Robin Cosworth", "Kelly Rodriguez", "James Anderson", "Antony Remmen", "Olivia Peyton", "Taylor Riley", 
    "Amelia Harper", "Wally Hobbs", "Brad Jameson", "Karen Goodson", "Marcus Orbison", "Sandy Bright", "Morgan Kennedy", 
    "Violet Bailey", "Ken Samuelson", "Nat Maguiree", "Bart Arnaz", "Leah Simpson", "Arnie Schwartz", "Billy Zimmer", "Samantha Piper", 
    "Maggie Boxter", "Terry Bradley", "Gabe Jones", "Lucy Ball", "Jim Packard", "Hannah Brookly", "Harv Mudd", "Clark Morgan", 
    "Todd Hoffman", "Jackie Garmin", "Lincoln Bartlett", "Brad Farkus", "Jenny Hobbs", "Dallas Lou", "Stu Pizaro"
];

let tasks: Task[] = [{
        Id: 1,
        Assigned: "Mr. John Heart",
        Subject: "Choose between PPO and HMO Health Plan"
    }, {
        Id: 2,
        Assigned: "Mr. John Heart",
        Subject: "Google AdWords Strategy"
    }, {
        Id: 3,
        Assigned: "Mr. John Heart",
        Subject: "New Brochures"
    }, {
        Id: 4,
        Assigned: "Mr. John Heart",
        Subject: "Update NDA Agreement"
    }, {
        Id: 5,
        Assigned: "Mr. John Heart",
        Subject: "Review Product Recall Report by Engineering Team"
    }, {
        Id: 6,
        Assigned: "Mrs. Olivia Peyton",
        Subject: "Update Personnel Files"
    }, {
        Id: 7,
        Assigned: "Mrs. Olivia Peyton",
        Subject: "Review Health Insurance Options Under the Affordable Care Act"
    }, {
        Id: 8,
        Assigned: "Mrs. Olivia Peyton",
        Subject: "Non-Compete Agreements"
    }, {
        Id: 9,
        Assigned: "Mrs. Olivia Peyton",
        Subject: "Give Final Approval for Refunds"
    }, {
        Id: 10,
        Assigned: "Mr. Robert Reagan",
        Subject: "Deliver R&D Plans for 2013"
    }, {
        Id: 11,
        Assigned: "Mr. Robert Reagan",
        Subject: "Decide on Mobile Devices to Use in the Field"
    }, {
        Id: 12,
        Assigned: "Mr. Robert Reagan",
        Subject: "Try New Touch-Enabled WinForms Apps"
    }, {
        Id: 13,
        Assigned: "Mr. Robert Reagan",
        Subject: "Approval on Converting to New HDMI Specification"
    }, {
        Id: 14,
        Assigned: "Ms. Greta Sims",
        Subject: "Approve Hiring of John Jeffers"
    }, {
        Id: 15,
        Assigned: "Ms. Greta Sims",
        Subject: "Update Employee Files with New NDA"
    }, {
        Id: 16,
        Assigned: "Ms. Greta Sims",
        Subject: "Provide New Health Insurance Docs"
    }];

@Injectable()
export class Service {
    getEmployees(): string[] {
        return employeesList;
    }
    getTasks(): Task[] {
        return tasks;
    }
}
