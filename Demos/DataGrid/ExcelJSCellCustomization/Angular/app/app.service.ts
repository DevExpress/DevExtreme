import { Injectable } from '@angular/core';

export class Company {
  ID: number;
  Name: string;
  Address: string;
  City: string;
  State: string;
  Zipcode: number;
  Phone: string;
  Fax: string;
  Website: string;
}

const companies: Company[] = [{
  "ID": 1,
  "Name": "Super Mart of the West",
  "Address": "702 SW 8th Street",
  "City": "Bentonville",
  "State": "Arkansas",
  "Zipcode": 72716,
  "Phone": "8005552797",
  "Fax": "(800) 555-2171",
  "Website": "http://nowebsitesupermart.com"
}, {
  "ID": 2,
  "Name": "Electronics Depot",
  "Address": "2455 Paces Ferry Road NW",
  "City": "Atlanta",
  "State": "Georgia",
  "Zipcode": 30339,
  "Phone": "8005953232",
  "Fax": "(800) 595-3231",
  "Website": "http://nowebsitedepot.com"
}, {
  "ID": 3,
  "Name": "K&S Music",
  "Address": "1000 Nicllet Mall",
  "City": "Minneapolis",
  "State": "Minnesota",
  "Zipcode": 55403,
  "Phone": "6123046073",
  "Fax": "(612) 304-6074",
  "Website": "http://nowebsitemusic.com"
}, {
  "ID": 4,
  "Name": "Tom's Club",
  "Address": "999 Lake Drive",
  "City": "Issaquah",
  "State": "Washington",
  "Zipcode": 98027,
  "Phone": "8009552292",
  "Fax": "(800) 955-2293",
  "Website": "http://nowebsitetomsclub.com"
}, {
  "ID": 5,
  "Name": "E-Mart",
  "Address": "3333 Beverly Rd",
  "City": "Hoffman Estates",
  "State": "Illinois",
  "Zipcode": 60179,
  "Phone": "8472862500",
  "Fax": "(847) 286-2501",
  "Website": "http://nowebsiteemart.com"
}, {
  "ID": 6,
  "Name": "Walters",
  "Address": "200 Wilmot Rd",
  "City": "Deerfield",
  "State": "Illinois",
  "Zipcode": 60015,
  "Phone": "8479402500",
  "Fax": "(847) 940-2501",
  "Website": "http://nowebsitewalters.com"
}, {
  "ID": 7,
  "Name": "StereoShack",
  "Address": "400 Commerce S",
  "City": "Fort Worth",
  "State": "Texas",
  "Zipcode": 76102,
  "Phone": "8178200741",
  "Fax": "(817) 820-0742",
  "Website": "http://nowebsiteshack.com"
}, {
  "ID": 8,
  "Name": "Circuit Town",
  "Address": "2200 Kensington Court",
  "City": "Oak Brook",
  "State": "Illinois",
  "Zipcode": 60523,
  "Phone": "8009552929",
  "Fax": "(800) 955-9392",
  "Website": "http://nowebsitecircuittown.com"
}, {
  "ID": 9,
  "Name": "Premier Buy",
  "Address": "7601 Penn Avenue South",
  "City": "Richfield",
  "State": "Minnesota",
  "Zipcode": 55423,
  "Phone": "6122911000",
  "Fax": "(612) 291-2001",
  "Website": "http://nowebsitepremierbuy.com"
}, {
  "ID": 10,
  "Name": "ElectrixMax",
  "Address": "263 Shuman Blvd",
  "City": "Naperville",
  "State": "Illinois",
  "Zipcode": 60563,
  "Phone": "6304387800",
  "Fax": "(630) 438-7801",
  "Website": "http://nowebsiteelectrixmax.com"
}, {
  "ID": 11,
  "Name": "Video Emporium",
  "Address": "1201 Elm Street",
  "City": "Dallas",
  "State": "Texas",
  "Zipcode": 75270,
  "Phone": "2148543000",
  "Fax": "(214) 854-3001",
  "Website": "http://nowebsitevideoemporium.com"
}, {
  "ID": 12,
  "Name": "Screen Shop",
  "Address": "1000 Lowes Blvd",
  "City": "Mooresville",
  "State": "North Carolina",
  "Zipcode": 28117,
  "Phone": "8004456937",
  "Fax": "(800) 445-6938",
  "Website": "http://nowebsitescreenshop.com"
}];

@Injectable()
export class Service {
  getCompanies() {
    return companies;
  }
}
