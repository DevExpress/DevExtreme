import { Injectable } from '@angular/core';


export class Product {
    ID: number;
    Name: string;
    Price: number;
    Current_Inventory: number;
    Backorder: number;
    Manufacturing: number;
    Category: string;
    ImageSrc: string;
}

let filter: Array<any> = [
        ["Category", "anyof", ["Automation", "Monitors"]],
        "or",
        [
            ["Category", "=", "Televisions"],
            "and",
            ["Price", "between", [2000, 4000]]
        ]
    ],
    categories: string[] = [
        "Video Players",
        "Televisions",
        "Monitors",
        "Projectors",
        "Automation"
    ],
    fields: Array<any> = [{
            dataField: "Name"
        }, {
            dataField: "Price",
            dataType: "number",
            format: "currency"
        }, {
            dataField: "Current_Inventory",
            dataType: "number",
            caption: "Inventory"
        }, {
            dataField: "Category",
            filterOperations: ["=", "anyof"],
            lookup: {
                dataSource: categories
            }
        }
    ];

@Injectable()
export class Service {
    getFields(): Array<any> {
        return fields;
    }

    getCategories(): string[] {
        return categories;
    }

    getFilter(): Array<any> {
        return filter;
    }
}
