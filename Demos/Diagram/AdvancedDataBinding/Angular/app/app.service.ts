import { Injectable } from '@angular/core';

export class OrgItem {
    ID: string;
    Name: string;
    Type?: string;
    Level?: string;
}

export class OrgLink {
    ID: string;
    From: string;
    To: string;
}

let orgItems: OrgItem[] = [
    {
        "ID": "106",
        "Name": "Development",
        "Type": "group"
    },
    {
        "ID": "107",
        "Name": "WinForms\nTeam",
        "Type": "group"
    },
    {
        "ID": "108",
        "Name": "WPF\nTeam",
        "Type": "group"
    },
    {
        "ID": "109",
        "Name": "Javascript\nTeam",
        "Type": "group"
    },
    {
        "ID": "110",
        "Name": "ASP.NET\nTeam",
        "Type": "group"
    },
    {
        "ID": "112",
        "Name": "Ana\nTrujillo",
        "Level": "senior"
    },
    {
        "ID": "113",
        "Name": "Antonio\nMoreno"
    },
    {
        "ID": "115",
        "Name": "Christina\nBerglund"
    },
    {
        "ID": "116",
        "Name": "Hanna\nMoos"
    },
    {
        "ID": "119",
        "Name": "Laurence\nLebihan"
    },
    {
        "ID": "120",
        "Name": "Elizabeth\nLincoln",
        "Level": "senior"
    },
    {
        "ID": "122",
        "Name": "Patricio\nSimpson",
        "Level": "senior"
    },
    {
        "ID": "123",
        "Name": "Francisco\nChang"
    }
];

let orgLinks: OrgLink[] = [
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