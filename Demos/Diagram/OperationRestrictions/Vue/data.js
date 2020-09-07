var orgItems = [
	{  
		"id":"106",
		"name":"Development",
		"type":"root"
	},
	{  
		"id":"107",
		"name":"WinForms Team",
		"type": "team",
		"parentId": "106"
	},
	{  
		"id":"109",
		"name":"Javascript Team",
        "type": "team",
		"parentId": "106"
	},
	{  
		"id":"110",
		"name":"ASP.NET Team",
        "type": "team",
		"parentId": "106"
	},
	{  
		"id":"112",
        "name": "Ana Trujillo",
		"parentId": "107"
	},
	{  
		"id":"113",
		"name":"Antonio Moreno",
		"parentId": "107"
	},
	{  
		"id":"115",
		"name":"Christina Berglund",
		"parentId": "109"
	},
	{  
		"id":"116",
		"name":"Hanna Moos",
		"parentId": "109"
	},
	{  
		"id":"119",
		"name":"Laurence Lebihan",
		"parentId": "110"
	},
	{  
		"id":"122",
        "name": "Patricio Simpson",
		"parentId": "110"
	},
	{  
		"id":"123",
		"name":"Francisco Chang",
		"parentId": "110"
	}
];

export default {
  getOrgItems() {
    return orgItems;
  }
};
