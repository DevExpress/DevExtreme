import { Injectable } from '@angular/core';

@Injectable()
export class Service {
  getData(rowCount: number, columnCount: number) {
    const items: Record<string, string>[] = [];
    for (let i = 0; i < rowCount; i += 1) {
      const item: Record<string, string> = {};
      for (let j = 0; j < columnCount; j += 1) {
        item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
      }
      items.push(item);
    }
    return items;
  }
}
