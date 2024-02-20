import { Injectable } from '@angular/core';

export class Country {
  id: number;

  nameAr: string;

  nameEn: string;
}

const europeanUnion: Country[] = [{
  id: 1,
  nameAr: 'النمسا',
  nameEn: 'Austria',
}, {
  id: 2,
  nameAr: 'بلجيكا',
  nameEn: 'Belgium',
}, {
  id: 3,
  nameAr: 'بلغاريا',
  nameEn: 'Bulgaria',
}, {
  id: 4,
  nameAr: 'كرواتيا',
  nameEn: 'Croatia',
}, {
  id: 5,
  nameAr: 'قبرص',
  nameEn: 'Cyprus',
}, {
  id: 6,
  nameAr: 'الجمهورية التشيكية',
  nameEn: 'Czech Republic',
}, {
  id: 7,
  nameAr: 'الدنمارك',
  nameEn: 'Denmark',
}, {
  id: 8,
  nameAr: 'استونيا',
  nameEn: 'Estonia',
}, {
  id: 9,
  nameAr: 'فنلندا',
  nameEn: 'Finland',
}, {
  id: 10,
  nameAr: 'فرنسا',
  nameEn: 'France',
}, {
  id: 11,
  nameAr: 'ألمانيا',
  nameEn: 'Germany',
}, {
  id: 12,
  nameAr: 'يونان',
  nameEn: 'Greece',
}, {
  id: 13,
  nameAr: 'هنغاريا',
  nameEn: 'Hungary',
}, {
  id: 14,
  nameAr: 'أيرلندا',
  nameEn: 'Ireland',
}, {
  id: 15,
  nameAr: 'إيطاليا',
  nameEn: 'Italy',
}, {
  id: 16,
  nameAr: 'لاتفيا',
  nameEn: 'Latvia',
}, {
  id: 17,
  nameAr: 'ليتوانيا',
  nameEn: 'Lithuania',
}, {
  id: 18,
  nameAr: 'لوكسمبورغ',
  nameEn: 'Luxembourg',
}, {
  id: 19,
  nameAr: 'مالطا',
  nameEn: 'Malta',
}, {
  id: 20,
  nameAr: 'هولندا',
  nameEn: 'Netherlands',
}, {
  id: 21,
  nameAr: 'بولندا',
  nameEn: 'Poland',
}, {
  id: 22,
  nameAr: 'البرتغال',
  nameEn: 'Portugal',
}, {
  id: 23,
  nameAr: 'رومانيا',
  nameEn: 'Romania',
}, {
  id: 24,
  nameAr: 'سلوفاكيا',
  nameEn: 'Slovakia',
}, {
  id: 25,
  nameAr: 'سلوفينيا',
  nameEn: 'Slovenia',
}, {
  id: 26,
  nameAr: 'إسبانيا',
  nameEn: 'Spain',
}, {
  id: 27,
  nameAr: 'السويد',
  nameEn: 'Sweden',
}, {
  id: 28,
  nameAr: 'المملكة المتحدة',
  nameEn: 'United Kingdom',
},
];

@Injectable()
export class Service {
  getCountries(): Country[] {
    return europeanUnion;
  }
}
