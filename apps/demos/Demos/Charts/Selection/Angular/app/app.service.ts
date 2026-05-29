import { Injectable } from '@angular/core';

export class ExportData {
  country: string;

  year2019: number;

  year2020: number;
}

const exportData: ExportData[] = [{
  country: 'United Kingdom',
  year2019: 0.142,
  year2020: -0.153,
}, {
  country: 'Germany',
  year2019: 0.109,
  year2020: -0.120,
}, {
  country: 'United States',
  year2019: 0.097,
  year2020: -0.134,
}, {
  country: 'Japan',
  year2019: 0.106,
  year2020: -0.111,
}, {
  country: 'France',
  year2019: 0.113,
  year2020: -0.162,
}, {
  country: 'Netherlands',
  year2019: 0.128,
  year2020: -0.147,
}];

@Injectable()
export class Service {
  getExportData(): ExportData[] {
    return exportData;
  }
}
