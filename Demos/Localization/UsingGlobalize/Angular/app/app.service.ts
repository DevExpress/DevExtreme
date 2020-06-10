import { Injectable } from '@angular/core';

export class Locale {
    Name: string;
    Value: string;
}

let locales: Locale[] = [{
    "Name": "English",
    "Value": "en"
}, {
    "Name": "Deutsch",
    "Value": "de"
}, {
    "Name": "Русский",
    "Value": "ru"
}];

export class Payment {
    PaymentId: number;
    ContactName: string;
    CompanyName: string;
    Amount: number;
    PaymentDate: string;
}

let payments: Payment[] = [{
    "PaymentId": 1,
    "ContactName": "Nancy Davolio",
    "CompanyName": "Premier Buy",
    "Amount": 1740,
    "PaymentDate": "2013/01/06"
},
{
    "PaymentId": 2,
    "ContactName": "Andrew Fuller",
    "CompanyName": "ElectrixMax",
    "Amount": 850,
    "PaymentDate": "2013/01/13"
},
{
    "PaymentId": 3,
    "ContactName": "Janet Leverling",
    "CompanyName": "Video Emporium",
    "Amount": 2235,
    "PaymentDate": "2013/01/07"
},
{
    "PaymentId": 4,
    "ContactName": "Margaret Peacock",
    "CompanyName": "Screen Shop",
    "Amount": 1965,
    "PaymentDate": "2013/01/03"
},
{
    "PaymentId": 5,
    "ContactName": "Steven Buchanan",
    "CompanyName": "Braeburn",
    "Amount": 880,
    "PaymentDate": "2013/01/10"
},
{
    "PaymentId": 6,
    "ContactName": "Michael Suyama",
    "CompanyName": "PriceCo",
    "Amount": 5260,
    "PaymentDate": "2013/01/17"
},
{
    "PaymentId": 7,
    "ContactName": "Robert King",
    "CompanyName": "Ultimate Gadget",
    "Amount": 2790,
    "PaymentDate": "2013/01/21"
},
{
    "PaymentId": 8,
    "ContactName": "Laura Callahan",
    "CompanyName": "EZ Stop",
    "Amount": 3140,
    "PaymentDate": "2013/01/01"
},
{
    "PaymentId": 9,
    "ContactName": "Anne Dodsworth",
    "CompanyName": "Clicker",
    "Amount": 6175,
    "PaymentDate": "2013/01/24"
},
{
    "PaymentId": 10,
    "ContactName": "Clark Morgan",
    "CompanyName": "Store of America",
    "Amount": 4575,
    "PaymentDate": "2013/01/11"
}];

export class PaymentView {
    Number: string;
    Contact: string;
    Company: string;
    Amount: string;
    PaymentDate: string;
}

export class Dictionary {
    [key: string]: PaymentView;
}

let dictionary: Dictionary = {
    "en": {
        "Number": "Number",
        "Contact": "Contact",
        "Company": "Company",
        "Amount": "Amount",
        "PaymentDate": "Payment Date"
    },
    "de": {
        "Number": "Nummer",
        "Contact": "Ansprechpartner",
        "Company": "Firma",
        "Amount": "Betrag",
        "PaymentDate": "Zahlungsdatum"
    },
    "ru": {
        "Number": "Номер",
        "Contact": "Имя",
        "Company": "Организация",
        "Amount": "Сумма",
        "PaymentDate": "Дата оплаты"
    }
};

@Injectable()
export class Service {
    getPayments() {
        return payments;
    }
    getLocales() {
        return locales;
    }
    getDictionary() {
        return dictionary;
    }
}
