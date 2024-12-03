import { Injectable } from '@angular/core';

export class Data {
  type: string;

  value: number;
}

const data: Data[] = [{
  type: 'Stripes',
  value: 1,
}, {
  type: 'Grid',
  value: 1,
}, {
  type: 'Linear Gradient',
  value: 1,
}, {
  type: 'Radial Gradient',
  value: 1,
}, {
  type: 'Image',
  value: 1,
}];

@Injectable()
export class Service {
  getData(): Data[] {
    return data;
  }
}
