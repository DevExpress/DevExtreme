import { Injectable } from '@angular/core';

export class FileSystemItem {
    id: string;
    name: string;
    isDirectory: boolean;
    items?: FileSystemItem[];
    expanded?: boolean;
}
const itemsDriveD: FileSystemItem[] = [];
const itemsDriveC: FileSystemItem[] = [{
    id: '1',
    name: "Documents",
    isDirectory: true,
    expanded: true,
    items: [ {
        id: '2',
        name: "Projects",
        isDirectory: true,
        expanded: true,
        items: [ {
                id: '3',
                name: "About.rtf",
                isDirectory: false
            }, {
                id: '4',
                name: "Passwords.rtf",
                isDirectory: false
            }
        ]
    }, {
        id: '5',
        name: "About.xml",
        isDirectory: false
    }, {
        id: '6',
        name: "Managers.rtf",
        isDirectory: false
    }, {
        id: '7',
        name: "ToDo.txt",
        isDirectory: false
    }],
}, {
    id: '8',
    name: "Images",
    isDirectory: true,
    expanded: true,    
    items: [ {
        id: '9',
        name: "logo.png",
        isDirectory: false
    }, {
        id: '10',
        name: "banner.gif",
        isDirectory: false
    }]
}, {
    id: '11',
    name: "System",
    isDirectory: true,
    expanded: true,    
    items: [ {
            id: '12',
            name: "Employees.txt",
            isDirectory: false
        }, {
            id: '13',
            name: "PasswordList.txt",
            isDirectory: false
        }
    ]
}, {
    id: '14',
    name: "Description.rtf",
    isDirectory: false
}, {
    id: '15',
    name: "Description.txt",
    isDirectory: false
}
];

@Injectable()
export class Service {
    getItemsDriveC(): FileSystemItem[] {
        return itemsDriveC;
    }

    getItemsDriveD(): FileSystemItem[] {
        return itemsDriveD;
    }
}
