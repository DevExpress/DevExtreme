import {
    Injectable
} from '@angular/core';

export class ExportImportEntry {
    Country: string;
    Export: number;
    Import: number;
}

let exportImportData: ExportImportEntry[] = [{
    Country: "Brazil",
    Export: 243,
    Import: 233
}, {
    Country: "Russia",
    Export: 529,
    Import: 335
}, {
    Country: "India",
    Export: 293,
    Import: 489
}, {
    Country: "China",
    Export: 2049,
    Import: 1818
}, {
    Country: "Japan",
    Export: 799,
    Import: 886
}, {
    Country: "USA",
    Export: 1547,
    Import: 2335
}, {
    Country: "Canada",
    Export: 455,
    Import: 475
}, {
    Country: "France",
    Export: 569,
    Import: 674
}, {
    Country: "England",
    Export: 468,
    Import: 680
}, {
    Country: "Germany",
    Export: 1407,
    Import: 1167
}];

@Injectable()
export class Service {
    getExportImportData(): ExportImportEntry[] {
        return exportImportData;
    }
}