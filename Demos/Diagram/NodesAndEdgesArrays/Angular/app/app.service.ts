import { Injectable } from '@angular/core';

export class OrgItem {
    ID: string;
    Text: string;
    Type: string;
}

export class OrgLink {
    ID: string;
    From: string;
    To: string;
}

let orgItems: OrgItem[] = [
    {
        "ID": "106",
        "Text": "Development",
        "Type": "ellipse"
    },
    {
        "ID": "107",
        "Text": "WinForms\nTeam",
        "Type": "ellipse"
    },
    {
        "ID": "108",
        "Text": "WPF\nTeam",
        "Type": "ellipse"
    },
    {
        "ID": "109",
        "Text": "Javascript\nTeam",
        "Type": "ellipse"
    },
    {
        "ID": "110",
        "Text": "ASP.NET\nTeam",
        "Type": "ellipse"
    },
    {
        "ID": "112",
        "Text": "Ana\nTrujillo",
        "Type": "rectangle"
    },
    {
        "ID": "113",
        "Text": "Antonio\nMoreno",
        "Type": "rectangle"
    },
    {
        "ID": "115",
        "Text": "Christina\nBerglund",
        "Type": "rectangle"
    },
    {
        "ID": "116",
        "Text": "Hanna\nMoos",
        "Type": "rectangle"
    },
    {
        "ID": "117",
        "Text": "Frederique\nCiteaux",
        "Type": "rectangle"
    },
    {
        "ID": "119",
        "Text": "Laurence\nLebihan",
        "Type": "rectangle"
    },
    {
        "ID": "120",
        "Text": "Elizabeth\nLincoln",
        "Type": "rectangle"
    },
    {
        "ID": "122",
        "Text": "Patricio\nSimpson",
        "Type": "rectangle"
    },
    {
        "ID": "123",
        "Text": "Francisco\nChang",
        "Type": "rectangle"
    }
];

var orgLinks: OrgLink[] = [
    {
        "ID": "124",
        "From": "106",
        "To": "108",
    },
    {
        "ID": "125",
        "From": "106",
        "To": "109",
    },
    {
        "ID": "126",
        "From": "106",
        "To": "107",
    },
    {
        "ID": "127",
        "From": "106",
        "To": "110",
    },
    {
        "ID": "129",
        "From": "110",
        "To": "112",
    },
    {
        "ID": "130",
        "From": "110",
        "To": "113",
    },
    {
        "ID": "132",
        "From": "107",
        "To": "115",
    },
    {
        "ID": "133",
        "From": "107",
        "To": "116",
    },
    {
        "ID": "134",
        "From": "107",
        "To": "117",
    },
    {
        "ID": "136",
        "From": "108",
        "To": "119",
    },
    {
        "ID": "137",
        "From": "108",
        "To": "120",
    },
    {
        "ID": "139",
        "From": "109",
        "To": "122",
    },
    {
        "ID": "140",
        "From": "109",
        "To": "123",
    }
];

@Injectable()
export class Service {
    getOrgItems() {
        return orgItems;
    }
    getOrgLinks() {
        return orgLinks;
    }
}