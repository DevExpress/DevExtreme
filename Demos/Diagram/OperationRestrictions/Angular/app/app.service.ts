import { Injectable } from '@angular/core';

export class OrgItem {
    ID: string;
    Name: string;
    Type?: string;
    ParentID?: string;
}

let orgItems: OrgItem[] = [
	{  
		"ID":"106",
		"Name":"Development",
		"Type":"root"
	},
	{  
		"ID":"107",
		"Name":"WinForms Team",
		"Type": "team",
		"ParentID": "106"
	},
	{  
		"ID":"109",
		"Name":"Javascript Team",
        "Type": "team",
		"ParentID": "106"
	},
	{  
		"ID":"110",
		"Name":"ASP.NET Team",
        "Type": "team",
		"ParentID": "106"
	},
	{  
		"ID":"112",
        "Name": "Ana Trujillo",
		"ParentID": "107"
	},
	{  
		"ID":"113",
		"Name":"Antonio Moreno",
		"ParentID": "107"
	},
	{  
		"ID":"115",
		"Name":"Christina Berglund",
		"ParentID": "109"
	},
	{  
		"ID":"116",
		"Name":"Hanna Moos",
		"ParentID": "109"
	},
	{  
		"ID":"119",
		"Name":"Laurence Lebihan",
		"ParentID": "110"
	},
	{  
		"ID":"122",
        "Name": "Patricio Simpson",
		"ParentID": "110"
	},
	{  
		"ID":"123",
		"Name":"Francisco Chang",
		"ParentID": "110"
	}
];

@Injectable()
export class Service {
    getOrgItems() {
        return orgItems;
    }
}