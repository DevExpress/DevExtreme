import { Injectable } from '@angular/core';

export class FileItem {
    name: string;
    isDirectory: boolean;
    category?: string;
    size?: number;
    items?: FileItem[];
}

let fileItems: FileItem[] = [{
  'name': 'Documents',
  'isDirectory': true,
  'category': 'Work',
  'items': [{
    'name': 'Projects',
    'isDirectory': true,
    'category': 'Work',
    'items': [{
      'name': 'About.rtf',
      'isDirectory': false,
      'size': 1024
    }, {
      'name': 'Passwords.rtf',
      'isDirectory': false,
      'category': 'Important',
      'size': 2048
    }]
  }, {
    'name': 'About.xml',
    'isDirectory': false,
    'size': 1024
  }, {
    'name': 'Managers.rtf',
    'isDirectory': false,
    'size': 2048
  }, {
    'name': 'ToDo.txt',
    'isDirectory': false,
    'size': 3072
  }],
}, {
  'name': 'Images',
  'isDirectory': true,
  'category': 'Home',
  'items': [{
    'name': 'logo.png',
    'isDirectory': false,
    'size': 20480
  }, {
    'name': 'banner.gif',
    'isDirectory': false,
    'size': 10240
  }]
}, {
  'name': 'System',
  'isDirectory': true,
  'category': 'Important',
  'items': [{
    'name': 'Employees.txt',
    'isDirectory': false,
    'category': 'Important',
    'size': 3072
  }, {
    'name': 'PasswordList.txt',
    'isDirectory': false,
    'category': 'Important',
    'size': 5120
  }]
}, {
  'name': 'Description.rtf',
  'isDirectory': false,
  'size': 1024
}, {
  'name': 'Description.txt',
  'isDirectory': false,
  'size': 2048
}];


@Injectable()
export class Service {
    getFileItems(): FileItem[] {
        return fileItems;
    }
}