import { Injectable } from '@angular/core';

export class ExportData {
    country: string;
    year2007: number;
    year2008: number;
}

let exportData: ExportData[] = [{
    country: "China",
    year2007: 0.1732,
    year2008: -0.1588
}, {
    country: "Germany",
    year2007: 0.0964,
    year2008: -0.2231
}, {
    country: "United States",
    year2007: 0.1187,
    year2008: -0.1878
}, {
    country: "Japan",
    year2007: 0.1081,
    year2008: -0.2614
}, {
    country: "France",
    year2007: 0.1014,
    year2008: -0.2222
}, {
    country: "Netherlands",
    year2007: 0.1355,
    year2008: -0.2015
}];

@Injectable()
export class Service {
    getExportData(): ExportData[] {
        return exportData;
    }
}
