import { Injectable } from '@angular/core';

export class ExportData {
  country: string;

  year2007: number;

  year2008: number;
}

const exportData: ExportData[] = [{
  country: 'China',
  year2007: 0.18265,
  year2008: -0.16682,
}, {
  country: 'Germany',
  year2007: 0.10467,
  year2008: -0.20165,
}, {
  country: 'United States',
  year2007: 0.1232,
  year2008: -0.17994,
}, {
  country: 'Japan',
  year2007: 0.10868,
  year2008: -0.25622,
}, {
  country: 'France',
  year2007: 0.09526,
  year2008: -0.23631,
}, {
  country: 'Netherlands',
  year2007: 0.14402,
  year2008: -0.21923,
}];

@Injectable()
export class Service {
  getExportData(): ExportData[] {
    return exportData;
  }
}
