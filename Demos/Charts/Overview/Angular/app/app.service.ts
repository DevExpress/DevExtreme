import { Injectable } from '@angular/core';

class Complaints {
  complaint: string;

  count: number;
}

export class ComplaintsWithPercent {
  complaint: string;

  count: number;

  cumulativePercent: number;
}

const complaintsData: Complaints[] = [
  { complaint: 'Cold pizza', count: 780 },
  { complaint: 'Not enough cheese', count: 120 },
  { complaint: 'Underbaked or Overbaked', count: 52 },
  { complaint: 'Delayed delivery', count: 1123 },
  { complaint: 'Damaged pizza', count: 321 },
  { complaint: 'Incorrect billing', count: 89 },
  { complaint: 'Wrong size delivered', count: 222 },
];

@Injectable()
export class Service {
  getComplaintsData(): ComplaintsWithPercent[] {
    const data = complaintsData.sort((a, b) => b.count - a.count);
    const totalCount = data.reduce((prevValue, item) => prevValue + item.count, 0);
    let cumulativeCount = 0;
    return data.map((item, index) => {
      cumulativeCount += item.count;
      return {
        complaint: item.complaint,
        count: item.count,
        cumulativePercent: Math.round(cumulativeCount * 100 / totalCount),
      };
    });
  }
}
