import { Injectable } from '@angular/core';

export class OrgItem {
    ID: string;
    Text: string;
    Type: string;
    Picture: string;
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
        "Type": "ellipse",
        "Picture": ""
    },
    {
        "ID": "107",
        "Text": "WinForms\nTeam",
        "Type": "ellipse",
        "Picture": ""
    },
    {
        "ID": "108",
        "Text": "WPF\nTeam",
        "Type": "ellipse",
        "Picture": ""
    },
    {
        "ID": "109",
        "Text": "Javascript\nTeam",
        "Type": "ellipse",
        "Picture": ""
    },
    {
        "ID": "110",
        "Text": "ASP.NET\nTeam",
        "Type": "ellipse",
        "Picture": ""
    },
    {
        "ID": "112",
        "Text": "Ken Samuelson",
        "Type": "cardWithImageOnLeft",
        "Picture": "../../../../images/employees/32.png"
    },
    {
        "ID": "113",
        "Text": "Terry Bradley",
        "Type": "cardWithImageOnLeft",
        "Picture": "../../../../images/employees/33.png"
    },
    {
        "ID": "115",
        "Text": "Nat Maguiree",
        "Type": "cardWithImageOnLeft",
        "Picture": "../../../../images/employees/34.png"
    },
    {
        "ID": "116",
        "Text": "Gabe Jones",
        "Type": "cardWithImageOnLeft",
        "Picture": "../../../../images/employees/35.png"
    },
    {
        "ID": "117",
        "Text": "Lucy Ball",
        "Type": "cardWithImageOnLeft",
        "Picture": "../../../../images/employees/36.png"
    },
    {
        "ID": "119",
        "Text": "Bart Arnaz",
        "Type": "cardWithImageOnLeft",
        "Picture": "../../../../images/employees/37.png"
    },
    {
        "ID": "120",
        "Text": "Leah Simpson",
        "Type": "cardWithImageOnLeft",
        "Picture": "../../../../images/employees/38.png"
    },
    {
        "ID": "122",
        "Text": "Hannah Brookly",
        "Type": "cardWithImageOnLeft",
        "Picture": "../../../../images/employees/39.png"
    },
    {
        "ID": "123",
        "Text": "Arnie Schwartz",
        "Type": "cardWithImageOnLeft",
        "Picture": "../../../../images/employees/40.png"
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