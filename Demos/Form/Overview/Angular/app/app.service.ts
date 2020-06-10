import { Injectable } from '@angular/core';

export class Company {
    ID: number;
    Name: string;
    Address: string;
    City: string;
    State: string;
    ZipCode: number;
    Phone: string;
    Fax: string;
    Website: string;
}

let companies: Company[] = [{
    ID: 1,
    Name: "Super Mart of the West",
    Address: "702 SW 8th Street",
    City: "Bentonville",
    State: "Arkansas",
    ZipCode: 72716,
    Phone: "(800) 555-2797",
    Fax: "(800) 555-2171",
    Website: "http://www.nowebsitesupermart.com"
}, {
    ID: 2,
    Name: "Electronics Depot",
    Address: "2455 Paces Ferry Road NW",
    City: "Atlanta",
    State: "Georgia",
    ZipCode: 30339,
    Phone: "(800) 595-3232",
    Fax: "(800) 595-3231",
    Website: "http://www.nowebsitedepot.com"
}, {
    ID: 3,
    Name: "K&S Music",
    Address: "1000 Nicllet Mall",
    City: "Minneapolis",
    State: "Minnesota",
    ZipCode: 55403,
    Phone: "(612) 304-6073",
    Fax: "(612) 304-6074",
    Website: "http://www.nowebsitemusic.com"
}, {
    ID: 4,
    Name: "Tom's Club",
    Address: "999 Lake Drive",
    City: "Issaquah",
    State: "Washington",
    ZipCode: 98027,
    Phone: "(800) 955-2292",
    Fax: "(800) 955-2293",
    Website: "http://www.nowebsitetomsclub.com"
}];


@Injectable()
export class Service {
    getCompanies() : Company[] {
        return companies;
    }
}
