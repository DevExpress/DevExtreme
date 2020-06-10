import { Injectable } from '@angular/core';

@Injectable()
export class Service {
    getData (rowCount, columnCount) {
        var items = [];    
        for (let i = 0; i < rowCount; i++) {
            let item = {};
            for (let j = 0; j < columnCount; j++) {
                item["field" + (j + 1)] = (i + 1) + "-" + (j + 1);
            }
            items.push(item);
        }
        return items;
    }
}
