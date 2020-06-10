import { Injectable } from '@angular/core';

export class Tab {
    id: number;
    text: string;
    icon: string;
    content: string;
}

export class Longtab {
    text: string;
}

let tabs: Tab[] = [
    {     
        id: 0,
        text: "user", 
        icon: "user", 
        content: "User tab content" 
    },
    { 
        id: 1,
        text: "comment", 
        icon: "comment", 
        content: "Comment tab content" 
    },
    { 
        id: 2,
        text: "find", 
        icon: "find", 
        content: "Find tab content" 
    }
];

let longtabs: Longtab[] = [
    { text: "user" },
    { text: "analytics" },
    { text: "customers" },
    { text: "search" },
    { text: "favorites" },
    { text: "additional" },
    { text: "clients" },
    { text: "orders" },
    { text: "shipment" }
];

@Injectable()
export class Service {
    getTabs(): Tab[] {
        return tabs;
    }
    getLongtabs(): Longtab[] {
        return longtabs;
    }
}
