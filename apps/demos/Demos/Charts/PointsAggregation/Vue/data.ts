import { type DxChartTypes } from 'devextreme-vue/chart';
import { type TimeInterval } from 'devextreme-vue/common/charts';

export const aggregationIntervals:{displayName: string, interval: TimeInterval | Record<string, any>}[] = [
  { displayName: 'One week', interval: 'week' },
  { displayName: 'Two weeks', interval: { weeks: 2 } },
  { displayName: 'Month', interval: 'month' },
];

export const aggregationFunctions: {
  displayName: string,
  func: DxChartTypes.ChartSeriesAggregationMethod,
}[] = [
  { displayName: 'Average', func: 'avg' },
  { displayName: 'Minimum', func: 'min' },
  { displayName: 'Maximum', func: 'max' },
];

export const weatherData = [{
  date: '2025-01-01',
  temp: 9.5,
  precipitation: 0.1,
},
{
  date: '2025-01-02',
  temp: 8,
  precipitation: 0.4,
},
{
  date: '2025-01-03',
  temp: 7.5,
  precipitation: 0.2,
},
{
  date: '2025-01-04',
  temp: 8.5,
  precipitation: 0.1,
},
{
  date: '2025-01-05',
  temp: 10,
  precipitation: 0.3,
},
{
  date: '2025-01-06',
  temp: 3,
  precipitation: 0,
},
{
  date: '2025-01-07',
  temp: 5,
  precipitation: 0.3,
},
{
  date: '2025-01-08',
  temp: 9.5,
  precipitation: 0,
},
{
  date: '2025-01-09',
  temp: 11,
  precipitation: 0.5,
},
{
  date: '2025-01-10',
  temp: 8,
  precipitation: 0,
},
{
  date: '2025-01-11',
  temp: 11.5,
  precipitation: 0.3,
},
{
  date: '2025-01-12',
  temp: 9.5,
  precipitation: 2.1,
},
{
  date: '2025-01-13',
  temp: 11.5,
  precipitation: 3.5,
},
{
  date: '2025-01-14',
  temp: 11,
  precipitation: 0.1,
},
{
  date: '2025-01-15',
  temp: 10.5,
  precipitation: 0,
},
{
  date: '2025-01-16',
  temp: 6.5,
  precipitation: 0,
},
{
  date: '2025-01-17',
  temp: 7.5,
  precipitation: 0,
},
{
  date: '2025-01-18',
  temp: 8,
  precipitation: 0.1,
},
{
  date: '2025-01-19',
  temp: 8.5,
  precipitation: 1.3,
},
{
  date: '2025-01-20',
  temp: 5.5,
  precipitation: 5.3,
},
{
  date: '2025-01-21',
  temp: 9,
  precipitation: 0.1,
},
{
  date: '2025-01-22',
  temp: 6,
  precipitation: 16.6,
},
{
  date: '2025-01-23',
  temp: 8.5,
  precipitation: 5.5,
},
{
  date: '2025-01-24',
  temp: 6.5,
  precipitation: 1.3,
},
{
  date: '2025-01-25',
  temp: 4.5,
  precipitation: 0,
},
{
  date: '2025-01-26',
  temp: 5.5,
  precipitation: 0,
},
{
  date: '2025-01-27',
  temp: 3,
  precipitation: 0,
},
{
  date: '2025-01-28',
  temp: 6.5,
  precipitation: 0,
},
{
  date: '2025-01-29',
  temp: 8,
  precipitation: 0,
},
{
  date: '2025-01-30',
  temp: 10.5,
  precipitation: 0,
},
{
  date: '2025-01-31',
  temp: 13,
  precipitation: 0,
},
{
  date: '2025-02-01',
  temp: 10.5,
  precipitation: 0,
},
{
  date: '2025-02-02',
  temp: 12,
  precipitation: 0,
},
{
  date: '2025-02-03',
  temp: 13,
  precipitation: 0.2,
},
{
  date: '2025-02-04',
  temp: 10,
  precipitation: 0,
},
{
  date: '2025-02-05',
  temp: 11.5,
  precipitation: 0,
},
{
  date: '2025-02-06',
  temp: 11.5,
  precipitation: 0.1,
},
{
  date: '2025-02-07',
  temp: 12.5,
  precipitation: 0.5,
},
{
  date: '2025-02-08',
  temp: 13,
  precipitation: 0,
},
{
  date: '2025-02-09',
  temp: 15.5,
  precipitation: 0,
},
{
  date: '2025-02-10',
  temp: 16.5,
  precipitation: 0.1,
},
{
  date: '2025-02-11',
  temp: 14.5,
  precipitation: 0.8,
},
{
  date: '2025-02-12',
  temp: 13.5,
  precipitation: 0.1,
},
{
  date: '2025-02-13',
  temp: 13.5,
  precipitation: 0,
},
{
  date: '2025-02-14',
  temp: 12,
  precipitation: 0,
},
{
  date: '2025-02-15',
  temp: 13.5,
  precipitation: 0,
},
{
  date: '2025-02-16',
  temp: 14.5,
  precipitation: 0,
},
{
  date: '2025-02-17',
  temp: 12.5,
  precipitation: 4.5,
},
{
  date: '2025-02-18',
  temp: 10,
  precipitation: 14.4,
},
{
  date: '2025-02-19',
  temp: 13.5,
  precipitation: 0.5,
},
{
  date: '2025-02-20',
  temp: 14,
  precipitation: 0.6,
},
{
  date: '2025-02-21',
  temp: 15,
  precipitation: 0,
},
{
  date: '2025-02-22',
  temp: 11,
  precipitation: 0,
},
{
  date: '2025-02-23',
  temp: 7.5,
  precipitation: 0,
},
{
  date: '2025-02-24',
  temp: 6,
  precipitation: 0,
},
{
  date: '2025-02-25',
  temp: 7,
  precipitation: 0,
},
{
  date: '2025-02-26',
  temp: 8,
  precipitation: 0,
},
{
  date: '2025-02-27',
  temp: 8.5,
  precipitation: 0.1,
},
{
  date: '2025-02-28',
  temp: 10,
  precipitation: 0,
},
{
  date: '2025-03-01',
  temp: 9,
  precipitation: 0,
},
{
  date: '2025-03-02',
  temp: 11,
  precipitation: 0,
},
{
  date: '2025-03-03',
  temp: 15,
  precipitation: 0,
},
{
  date: '2025-03-04',
  temp: 14.5,
  precipitation: 0,
},
{
  date: '2025-03-05',
  temp: 12.5,
  precipitation: 0,
},
{
  date: '2025-03-06',
  temp: 7.5,
  precipitation: 0,
},
{
  date: '2025-03-07',
  temp: 11,
  precipitation: 0,
},
{
  date: '2025-03-08',
  temp: 16,
  precipitation: 0,
},
{
  date: '2025-03-09',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-03-10',
  temp: 20,
  precipitation: 0,
},
{
  date: '2025-03-11',
  temp: 20.5,
  precipitation: 0,
},
{
  date: '2025-03-12',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-03-13',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-03-14',
  temp: 23.5,
  precipitation: 0,
},
{
  date: '2025-03-15',
  temp: 23,
  precipitation: 0,
},
{
  date: '2025-03-16',
  temp: 23,
  precipitation: 0,
},
{
  date: '2025-03-17',
  temp: 22.5,
  precipitation: 0,
},
{
  date: '2025-03-18',
  temp: 23.5,
  precipitation: 0,
},
{
  date: '2025-03-19',
  temp: 24,
  precipitation: 0,
},
{
  date: '2025-03-20',
  temp: 23.5,
  precipitation: 0,
},
{
  date: '2025-03-21',
  temp: 22,
  precipitation: 0,
},
{
  date: '2025-03-22',
  temp: 18.5,
  precipitation: 4,
},
{
  date: '2025-03-23',
  temp: 15,
  precipitation: 2.4,
},
{
  date: '2025-03-24',
  temp: 20.5,
  precipitation: 0,
},
{
  date: '2025-03-25',
  temp: 19,
  precipitation: 0,
},
{
  date: '2025-03-26',
  temp: 18.5,
  precipitation: 0,
},
{
  date: '2025-03-27',
  temp: 18,
  precipitation: 0,
},
{
  date: '2025-03-28',
  temp: 17,
  precipitation: 0,
},
{
  date: '2025-03-29',
  temp: 21,
  precipitation: 0,
},
{
  date: '2025-03-30',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-03-31',
  temp: 16.5,
  precipitation: 0.2,
},
{
  date: '2025-04-01',
  temp: 19,
  precipitation: 0,
},
{
  date: '2025-04-02',
  temp: 20,
  precipitation: 0,
},
{
  date: '2025-04-03',
  temp: 18,
  precipitation: 0,
},
{
  date: '2025-04-04',
  temp: 16.5,
  precipitation: 0,
},
{
  date: '2025-04-05',
  temp: 17,
  precipitation: 0,
},
{
  date: '2025-04-06',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-04-07',
  temp: 22,
  precipitation: 0,
},
{
  date: '2025-04-08',
  temp: 19,
  precipitation: 0.2,
},
{
  date: '2025-04-09',
  temp: 14.5,
  precipitation: 0,
},
{
  date: '2025-04-10',
  temp: 17,
  precipitation: 0,
},
{
  date: '2025-04-11',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-04-12',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-04-13',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-04-14',
  temp: 19,
  precipitation: 0,
},
{
  date: '2025-04-15',
  temp: 21,
  precipitation: 0,
},
{
  date: '2025-04-16',
  temp: 22.5,
  precipitation: 0,
},
{
  date: '2025-04-17',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-04-18',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-04-19',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-04-20',
  temp: 22,
  precipitation: 0,
},
{
  date: '2025-04-21',
  temp: 20,
  precipitation: 0,
},
{
  date: '2025-04-22',
  temp: 23,
  precipitation: 0,
},
{
  date: '2025-04-23',
  temp: 26,
  precipitation: 0,
},
{
  date: '2025-04-24',
  temp: 25,
  precipitation: 0,
},
{
  date: '2025-04-25',
  temp: 22,
  precipitation: 0,
},
{
  date: '2025-04-26',
  temp: 23.5,
  precipitation: 0,
},
{
  date: '2025-04-27',
  temp: 23,
  precipitation: 0,
},
{
  date: '2025-04-28',
  temp: 19,
  precipitation: 0,
},
{
  date: '2025-04-29',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-04-30',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-05-01',
  temp: 26,
  precipitation: 0,
},
{
  date: '2025-05-02',
  temp: 26,
  precipitation: 0,
},
{
  date: '2025-05-03',
  temp: 25.5,
  precipitation: 0,
},
{
  date: '2025-05-04',
  temp: 28,
  precipitation: 0,
},
{
  date: '2025-05-05',
  temp: 28.5,
  precipitation: 0,
},
{
  date: '2025-05-06',
  temp: 27,
  precipitation: 0.4,
},
{
  date: '2025-05-07',
  temp: 17,
  precipitation: 0.1,
},
{
  date: '2025-05-08',
  temp: 17,
  precipitation: 0,
},
{
  date: '2025-05-09',
  temp: 20,
  precipitation: 1.7,
},
{
  date: '2025-05-10',
  temp: 19.5,
  precipitation: 0.3,
},
{
  date: '2025-05-11',
  temp: 23,
  precipitation: 0,
},
{
  date: '2025-05-12',
  temp: 26,
  precipitation: 0,
},
{
  date: '2025-05-13',
  temp: 22.5,
  precipitation: 0,
},
{
  date: '2025-05-14',
  temp: 23,
  precipitation: 0,
},
{
  date: '2025-05-15',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-05-16',
  temp: 20,
  precipitation: 0,
},
{
  date: '2025-05-17',
  temp: 18.5,
  precipitation: 0,
},
{
  date: '2025-05-18',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-05-19',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-05-20',
  temp: 24,
  precipitation: 0,
},
{
  date: '2025-05-21',
  temp: 27.5,
  precipitation: 0,
},
{
  date: '2025-05-22',
  temp: 29,
  precipitation: 0,
},
{
  date: '2025-05-23',
  temp: 30.5,
  precipitation: 0,
},
{
  date: '2025-05-24',
  temp: 31,
  precipitation: 0,
},
{
  date: '2025-05-25',
  temp: 29.5,
  precipitation: 0,
},
{
  date: '2025-05-26',
  temp: 27,
  precipitation: 0,
},
{
  date: '2025-05-27',
  temp: 26,
  precipitation: 0,
},
{
  date: '2025-05-28',
  temp: 29,
  precipitation: 0,
},
{
  date: '2025-05-29',
  temp: 30.5,
  precipitation: 0,
},
{
  date: '2025-05-30',
  temp: 31.5,
  precipitation: 0,
},
{
  date: '2025-05-31',
  temp: 29.5,
  precipitation: 0,
},
{
  date: '2025-06-01',
  temp: 28,
  precipitation: 0,
},
{
  date: '2025-06-02',
  temp: 30,
  precipitation: 0,
},
{
  date: '2025-06-03',
  temp: 32.5,
  precipitation: 0,
},
{
  date: '2025-06-04',
  temp: 32,
  precipitation: 0,
},
{
  date: '2025-06-05',
  temp: 31.5,
  precipitation: 0,
},
{
  date: '2025-06-06',
  temp: 33,
  precipitation: 0,
},
{
  date: '2025-06-07',
  temp: 32.5,
  precipitation: 0,
},
{
  date: '2025-06-08',
  temp: 31.5,
  precipitation: 0,
},
{
  date: '2025-06-09',
  temp: 31.5,
  precipitation: 0,
},
{
  date: '2025-06-10',
  temp: 29,
  precipitation: 0,
},
{
  date: '2025-06-11',
  temp: 26,
  precipitation: 0,
},
{
  date: '2025-06-12',
  temp: 21,
  precipitation: 0,
},
{
  date: '2025-06-13',
  temp: 25,
  precipitation: 0,
},
{
  date: '2025-06-14',
  temp: 30.5,
  precipitation: 0,
},
{
  date: '2025-06-15',
  temp: 32,
  precipitation: 0,
},
{
  date: '2025-06-16',
  temp: 34.5,
  precipitation: 0,
},
{
  date: '2025-06-17',
  temp: 36,
  precipitation: 0,
},
{
  date: '2025-06-18',
  temp: 36,
  precipitation: 0,
},
{
  date: '2025-06-19',
  temp: 37.5,
  precipitation: 0,
},
{
  date: '2025-06-20',
  temp: 39,
  precipitation: 0,
},
{
  date: '2025-06-21',
  temp: 38,
  precipitation: 0,
},
{
  date: '2025-06-22',
  temp: 37.5,
  precipitation: 0,
},
{
  date: '2025-06-23',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-06-24',
  temp: 37.5,
  precipitation: 0,
},
{
  date: '2025-06-25',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-06-26',
  temp: 36.5,
  precipitation: 0,
},
{
  date: '2025-06-27',
  temp: 34,
  precipitation: 0,
},
{
  date: '2025-06-28',
  temp: 34,
  precipitation: 0,
},
{
  date: '2025-06-29',
  temp: 37.5,
  precipitation: 0,
},
{
  date: '2025-06-30',
  temp: 35,
  precipitation: 0,
},
{
  date: '2025-07-01',
  temp: 37.5,
  precipitation: 0,
},
{
  date: '2025-07-02',
  temp: 35.5,
  precipitation: 0,
},
{
  date: '2025-07-03',
  temp: 36.5,
  precipitation: 0,
},
{
  date: '2025-07-04',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-07-05',
  temp: 39,
  precipitation: 0,
},
{
  date: '2025-07-06',
  temp: 39.5,
  precipitation: 0,
},
{
  date: '2025-07-07',
  temp: 40,
  precipitation: 0,
},
{
  date: '2025-07-08',
  temp: 39,
  precipitation: 0,
},
{
  date: '2025-07-09',
  temp: 36.5,
  precipitation: 0,
},
{
  date: '2025-07-10',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-07-11',
  temp: 36.5,
  precipitation: 0.1,
},
{
  date: '2025-07-12',
  temp: 36.5,
  precipitation: 0,
},
{
  date: '2025-07-13',
  temp: 38,
  precipitation: 0,
},
{
  date: '2025-07-14',
  temp: 39.5,
  precipitation: 0,
},
{
  date: '2025-07-15',
  temp: 40,
  precipitation: 0,
},
{
  date: '2025-07-16',
  temp: 38.5,
  precipitation: 0,
},
{
  date: '2025-07-17',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-07-18',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-07-19',
  temp: 34,
  precipitation: 0.4,
},
{
  date: '2025-07-20',
  temp: 34.5,
  precipitation: 0,
},
{
  date: '2025-07-21',
  temp: 36.5,
  precipitation: 0,
},
{
  date: '2025-07-22',
  temp: 36.5,
  precipitation: 0,
},
{
  date: '2025-07-23',
  temp: 38,
  precipitation: 0,
},
{
  date: '2025-07-24',
  temp: 34,
  precipitation: 0.1,
},
{
  date: '2025-07-25',
  temp: 34,
  precipitation: 0,
},
{
  date: '2025-07-26',
  temp: 33.5,
  precipitation: 0.2,
},
{
  date: '2025-07-27',
  temp: 36,
  precipitation: 0,
},
{
  date: '2025-07-28',
  temp: 38,
  precipitation: 0,
},
{
  date: '2025-07-29',
  temp: 36.5,
  precipitation: 0,
},
{
  date: '2025-07-30',
  temp: 37.5,
  precipitation: 0.1,
},
{
  date: '2025-07-31',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-08-01',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-08-02',
  temp: 35.5,
  precipitation: 0.1,
},
{
  date: '2025-08-03',
  temp: 33.5,
  precipitation: 0.9,
},
{
  date: '2025-08-04',
  temp: 32,
  precipitation: 0.1,
},
{
  date: '2025-08-05',
  temp: 33.5,
  precipitation: 0.1,
},
{
  date: '2025-08-06',
  temp: 34,
  precipitation: 0,
},
{
  date: '2025-08-07',
  temp: 33.5,
  precipitation: 0,
},
{
  date: '2025-08-08',
  temp: 35.5,
  precipitation: 0,
},
{
  date: '2025-08-09',
  temp: 36,
  precipitation: 0,
},
{
  date: '2025-08-10',
  temp: 35.5,
  precipitation: 0,
},
{
  date: '2025-08-11',
  temp: 35,
  precipitation: 0,
},
{
  date: '2025-08-12',
  temp: 35.5,
  precipitation: 0.1,
},
{
  date: '2025-08-13',
  temp: 34,
  precipitation: 0,
},
{
  date: '2025-08-14',
  temp: 32.5,
  precipitation: 0,
},
{
  date: '2025-08-15',
  temp: 30,
  precipitation: 0,
},
{
  date: '2025-08-16',
  temp: 31,
  precipitation: 0,
},
{
  date: '2025-08-17',
  temp: 33.5,
  precipitation: 0,
},
{
  date: '2025-08-18',
  temp: 34.5,
  precipitation: 0,
},
{
  date: '2025-08-19',
  temp: 34,
  precipitation: 0,
},
{
  date: '2025-08-20',
  temp: 33,
  precipitation: 0,
},
{
  date: '2025-08-21',
  temp: 32,
  precipitation: 0,
},
{
  date: '2025-08-22',
  temp: 32.5,
  precipitation: 0,
},
{
  date: '2025-08-23',
  temp: 33,
  precipitation: 0,
},
{
  date: '2025-08-24',
  temp: 33,
  precipitation: 0,
},
{
  date: '2025-08-25',
  temp: 33.5,
  precipitation: 0,
},
{
  date: '2025-08-26',
  temp: 36,
  precipitation: 0,
},
{
  date: '2025-08-27',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-08-28',
  temp: 37,
  precipitation: 0,
},
{
  date: '2025-08-29',
  temp: 36.5,
  precipitation: 0,
},
{
  date: '2025-08-30',
  temp: 36,
  precipitation: 0.3,
},
{
  date: '2025-08-31',
  temp: 33.5,
  precipitation: 0.3,
},
{
  date: '2025-09-01',
  temp: 33.5,
  precipitation: 0,
},
{
  date: '2025-09-02',
  temp: 34.5,
  precipitation: 0,
},
{
  date: '2025-09-03',
  temp: 34,
  precipitation: 0.1,
},
{
  date: '2025-09-04',
  temp: 29.5,
  precipitation: 0,
},
{
  date: '2025-09-05',
  temp: 33,
  precipitation: 0,
},
{
  date: '2025-09-06',
  temp: 32,
  precipitation: 0,
},
{
  date: '2025-09-07',
  temp: 32,
  precipitation: 0,
},
{
  date: '2025-09-08',
  temp: 28,
  precipitation: 1.7,
},
{
  date: '2025-09-09',
  temp: 23,
  precipitation: 7.6,
},
{
  date: '2025-09-10',
  temp: 29,
  precipitation: 0,
},
{
  date: '2025-09-11',
  temp: 32,
  precipitation: 0,
},
{
  date: '2025-09-12',
  temp: 31,
  precipitation: 0,
},
{
  date: '2025-09-13',
  temp: 30.5,
  precipitation: 0,
},
{
  date: '2025-09-14',
  temp: 26,
  precipitation: 0,
},
{
  date: '2025-09-15',
  temp: 23.5,
  precipitation: 0,
},
{
  date: '2025-09-16',
  temp: 24.5,
  precipitation: 0,
},
{
  date: '2025-09-17',
  temp: 25,
  precipitation: 0,
},
{
  date: '2025-09-18',
  temp: 26.5,
  precipitation: 0,
},
{
  date: '2025-09-19',
  temp: 24.5,
  precipitation: 0,
},
{
  date: '2025-09-20',
  temp: 24.5,
  precipitation: 0,
},
{
  date: '2025-09-21',
  temp: 20,
  precipitation: 0,
},
{
  date: '2025-09-22',
  temp: 17,
  precipitation: 0,
},
{
  date: '2025-09-23',
  temp: 15.5,
  precipitation: 0,
},
{
  date: '2025-09-24',
  temp: 17.5,
  precipitation: 0,
},
{
  date: '2025-09-25',
  temp: 18,
  precipitation: 0,
},
{
  date: '2025-09-26',
  temp: 18.5,
  precipitation: 0,
},
{
  date: '2025-09-27',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-09-28',
  temp: 22,
  precipitation: 0,
},
{
  date: '2025-09-29',
  temp: 24,
  precipitation: 0,
},
{
  date: '2025-09-30',
  temp: 25,
  precipitation: 0,
},
{
  date: '2025-10-01',
  temp: 23,
  precipitation: 0,
},
{
  date: '2025-10-02',
  temp: 18,
  precipitation: 0,
},
{
  date: '2025-10-03',
  temp: 18.5,
  precipitation: 0,
},
{
  date: '2025-10-04',
  temp: 18.5,
  precipitation: 0,
},
{
  date: '2025-10-05',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-10-06',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-10-07',
  temp: 23,
  precipitation: 0,
},
{
  date: '2025-10-08',
  temp: 24,
  precipitation: 0,
},
{
  date: '2025-10-09',
  temp: 14.5,
  precipitation: 0,
},
{
  date: '2025-10-10',
  temp: 18,
  precipitation: 0,
},
{
  date: '2025-10-11',
  temp: 20,
  precipitation: 0,
},
{
  date: '2025-10-12',
  temp: 20,
  precipitation: 0,
},
{
  date: '2025-10-13',
  temp: 21,
  precipitation: 0,
},
{
  date: '2025-10-14',
  temp: 17,
  precipitation: 0,
},
{
  date: '2025-10-15',
  temp: 18,
  precipitation: 0,
},
{
  date: '2025-10-16',
  temp: 20.5,
  precipitation: 0,
},
{
  date: '2025-10-17',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-10-18',
  temp: 21.5,
  precipitation: 0,
},
{
  date: '2025-10-19',
  temp: 22.5,
  precipitation: 0,
},
{
  date: '2025-10-20',
  temp: 18,
  precipitation: 0,
},
{
  date: '2025-10-21',
  temp: 15,
  precipitation: 0,
},
{
  date: '2025-10-22',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-10-23',
  temp: 22,
  precipitation: 0,
},
{
  date: '2025-10-24',
  temp: 20.5,
  precipitation: 0,
},
{
  date: '2025-10-25',
  temp: 21,
  precipitation: 0,
},
{
  date: '2025-10-26',
  temp: 22,
  precipitation: 0,
},
{
  date: '2025-10-27',
  temp: 20,
  precipitation: 0,
},
{
  date: '2025-10-28',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-10-29',
  temp: 21,
  precipitation: 0,
},
{
  date: '2025-10-30',
  temp: 19.5,
  precipitation: 0,
},
{
  date: '2025-10-31',
  temp: 17.5,
  precipitation: 0,
},
{
  date: '2025-11-01',
  temp: 18,
  precipitation: 0,
},
{
  date: '2025-11-02',
  temp: 15,
  precipitation: 0,
},
{
  date: '2025-11-03',
  temp: 14.5,
  precipitation: 0,
},
{
  date: '2025-11-04',
  temp: 16.5,
  precipitation: 0,
},
{
  date: '2025-11-05',
  temp: 12.5,
  precipitation: 0,
},
{
  date: '2025-11-06',
  temp: 12,
  precipitation: 0,
},
{
  date: '2025-11-07',
  temp: 14,
  precipitation: 0,
},
{
  date: '2025-11-08',
  temp: 14.5,
  precipitation: 0,
},
{
  date: '2025-11-09',
  temp: 16.5,
  precipitation: 0,
},
{
  date: '2025-11-10',
  temp: 16,
  precipitation: 0,
},
{
  date: '2025-11-11',
  temp: 14.5,
  precipitation: 0,
},
{
  date: '2025-11-12',
  temp: 14.5,
  precipitation: 0,
},
{
  date: '2025-11-13',
  temp: 16.5,
  precipitation: 0,
},
{
  date: '2025-11-14',
  temp: 14.5,
  precipitation: 0,
},
{
  date: '2025-11-15',
  temp: 16.5,
  precipitation: 0,
},
{
  date: '2025-11-16',
  temp: 15,
  precipitation: 0,
},
{
  date: '2025-11-17',
  temp: 17,
  precipitation: 0,
},
{
  date: '2025-11-18',
  temp: 8.5,
  precipitation: 0,
},
{
  date: '2025-11-19',
  temp: 11,
  precipitation: 0,
},
{
  date: '2025-11-20',
  temp: 12,
  precipitation: 0,
},
{
  date: '2025-11-21',
  temp: 15.5,
  precipitation: 0,
},
{
  date: '2025-11-22',
  temp: 18.5,
  precipitation: 0,
},
{
  date: '2025-11-23',
  temp: 18.5,
  precipitation: 0,
},
{
  date: '2025-11-24',
  temp: 18,
  precipitation: 0,
},
{
  date: '2025-11-25',
  temp: 18.5,
  precipitation: 0,
},
{
  date: '2025-11-26',
  temp: 17.5,
  precipitation: 0,
},
{
  date: '2025-11-27',
  temp: 13,
  precipitation: 0,
},
{
  date: '2025-11-28',
  temp: 10,
  precipitation: 0,
},
{
  date: '2025-11-29',
  temp: 12.5,
  precipitation: 0,
},
{
  date: '2025-11-30',
  temp: 11.5,
  precipitation: 0,
},
{
  date: '2025-12-01',
  temp: 14,
  precipitation: 0,
},
{
  date: '2025-12-02',
  temp: 13.5,
  precipitation: 0,
},
{
  date: '2025-12-03',
  temp: 13.5,
  precipitation: 0,
},
{
  date: '2025-12-04',
  temp: 4.5,
  precipitation: 0,
},
{
  date: '2025-12-05',
  temp: 5,
  precipitation: 0,
},
{
  date: '2025-12-06',
  temp: 7,
  precipitation: 0,
},
{
  date: '2025-12-07',
  temp: 6.5,
  precipitation: 0,
},
{
  date: '2025-12-08',
  temp: 10,
  precipitation: 0,
},
{
  date: '2025-12-09',
  temp: 10,
  precipitation: 0,
},
{
  date: '2025-12-10',
  temp: 10,
  precipitation: 0,
},
{
  date: '2025-12-11',
  temp: 10.5,
  precipitation: 0,
},
{
  date: '2025-12-12',
  temp: 12,
  precipitation: 0,
},
{
  date: '2025-12-13',
  temp: 12.5,
  precipitation: 0,
},
{
  date: '2025-12-14',
  temp: 9,
  precipitation: 0,
},
{
  date: '2025-12-15',
  temp: 10,
  precipitation: 0,
},
{
  date: '2025-12-16',
  temp: 8,
  precipitation: 0,
},
{
  date: '2025-12-17',
  temp: 6,
  precipitation: 0,
},
{
  date: '2025-12-18',
  temp: 7.5,
  precipitation: 0,
},
{
  date: '2025-12-19',
  temp: 9.5,
  precipitation: 0,
},
{
  date: '2025-12-20',
  temp: 8.5,
  precipitation: 0,
},
{
  date: '2025-12-21',
  temp: 3,
  precipitation: 0,
},
{
  date: '2025-12-22',
  temp: 4,
  precipitation: 0,
},
{
  date: '2025-12-23',
  temp: 6,
  precipitation: 0,
},
{
  date: '2025-12-24',
  temp: 8,
  precipitation: 0,
},
{
  date: '2025-12-25',
  temp: 10,
  precipitation: 0,
},
{
  date: '2025-12-26',
  temp: 11,
  precipitation: 0,
},
{
  date: '2025-12-27',
  temp: 12,
  precipitation: 0,
},
{
  date: '2025-12-28',
  temp: 12,
  precipitation: 0,
},
{
  date: '2025-12-29',
  temp: 13.5,
  precipitation: 0,
},
{
  date: '2025-12-30',
  temp: 12,
  precipitation: 0,
},
{
  date: '2025-12-31',
  temp: 11,
  precipitation: 0,
}];
