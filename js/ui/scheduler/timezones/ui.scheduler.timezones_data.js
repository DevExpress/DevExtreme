var displayNames = [
    '(UTC) Monrovia, Reykjavik',
    '(UTC+03:00) Nairobi',
    '(UTC+02:00) Harare, Pretoria',
    '(UTC+01:00) West Central Africa',
    '(UTC+02:00) Athens, Bucharest',
    '(UTC+03:00) Kuwait, Riyadh',
    '(UTC+07:00) Bangkok, Hanoi, Jakarta',
    '(UTC+04:00) Abu Dhabi, Muscat',
    '(UTC+12:00) Auckland, Wellington',
    '(UTC-03:00) City of Buenos Aires',
    '(UTC-05:00) Bogota, Lima, Quito, Rio Branco',
    '(UTC-08:00) Pacific Time (US & Canada)',
    '(UTC-05:00) Indiana (East)',
    '(UTC-06:00) Central Time (US & Canada)',
    '(UTC-05:00) Eastern Time (US & Canada)',
    '(UTC-07:00) Mountain Time (US & Canada)',
    '(UTC-04:00) Georgetown, La Paz, Manaus, San Juan',
    '(UTC+05:00) Ashgabat, Tashkent',
    '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
    '(UTC+06:00) Dhaka', '(UTC+06:00) Astana',
    '(UTC+05:45) Kathmandu',
    '(UTC+02:00) Jerusalem',
    '(UTC+08:00) Kuala Lumpur, Singapore',
    '(UTC+08:00) Ulaanbaatar',
    '(UTC) Dublin, Edinburgh, Lisbon, London',
    '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
    '(UTC+10:00) Canberra, Melbourne, Sydney',
    '(UTC+09:30) Darwin', '(UTC+10:00) Brisbane',
    '(UTC+09:30) Adelaide', '(UTC+10:00) Hobart',
    '(UTC+08:00) Perth',
    '(UTC-02:00) Coordinated Universal Time-02',
    '(UTC-03:00) Brasilia', '(UTC-04:00) Atlantic Time (Canada)',
    '(UTC-06:00) Saskatchewan', '(UTC-03:30) Newfoundland',
    '(UTC-03:00) Santiago', '(UTC+02:00) Cairo', 'UTC', '(UTC+03:30) Tehran',
    '(UTC+09:00) Osaka, Sapporo, Tokyo',
    '(UTC+12:00) Coordinated Universal Time+12',
    '(UTC+02:00) Tripoli', '(UTC-07:00) Chihuahua, La Paz, Mazatlan',
    '(UTC-06:00) Guadalajara, Mexico City, Monterrey',
    '(UTC+11:00) Solomon Is., New Caledonia',
    '(UTC-11:00) Coordinated Universal Time-11',
    '(UTC+10:00) Guam, Port Moresby',
    '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
    '(UTC+08:00) Taipei', '(UTC+09:00) Seoul',
    '(UTC+02:00) Istanbul',
    '(UTC-09:00) Alaska',
    '(UTC-07:00) Arizona',
    '(UTC-10:00) Hawaii',
    '(UTC+03:00) Moscow, St. Petersburg, Volgograd',
    '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
    '(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
    '(UTC) Casablanca',
    '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris',
    '(UTC+01:00) Windhoek',
    '(UTC-03:00) Cayenne, Fortaleza',
    '(UTC-04:00) Asuncion',
    '(UTC-03:00) Salvador',
    '(UTC-06:00) Central America',
    '(UTC-04:00) Cuiaba',
    '(UTC-04:30) Caracas',
    '(UTC-03:00) Greenland',
    '(UTC-03:00) Montevideo',
    '(UTC-08:00) Baja California',
    '(UTC-01:00) Azores',
    '(UTC+02:00) Amman',
    '(UTC+10:00) Magadan',
    '(UTC+03:00) Baghdad',
    '(UTC+04:00) Baku',
    '(UTC+02:00) Beirut',
    '(UTC+09:00) Yakutsk',
    '(UTC+05:30) Sri Jayawardenepura',
    '(UTC+02:00) Damascus',
    '(UTC+08:00) Irkutsk',
    '(UTC+04:30) Kabul',
    '(UTC+05:00) Islamabad, Karachi',
    '(UTC+07:00) Krasnoyarsk',
    '(UTC+06:00) Novosibirsk',
    '(UTC+06:30) Yangon (Rangoon)',
    '(UTC+10:00) Vladivostok',
    '(UTC+04:00) Tbilisi',
    '(UTC+05:00) Ekaterinburg',
    '(UTC+04:00) Yerevan',
    '(UTC-01:00) Cabo Verde Is.',
    '(UTC-12:00) International Date Line West',
    '(UTC+13:00) Nuku\'alofa',
    '(UTC+14:00) Kiritimati Island',
    '(UTC+02:00) Kaliningrad',
    '(UTC+04:00) Port Louis',
    '(UTC+13:00) Samoa',
    '(UTC+12:00) Fiji',
    '(UTC+8:45) Eucla',
    '(UTC+10:30) Lord Howe Island'
];
var timezones = [{
    'id': 'Africa/Bamako',
    'title': 'Bamako',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Africa/Banjul',
    'title': 'Banjul',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Africa/Conakry',
    'title': 'Conakry',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Africa/Dakar',
    'title': 'Dakar',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Africa/Freetown',
    'title': 'Freetown',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Africa/Lome',
    'title': 'Lome',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Africa/Nouakchott',
    'title': 'Nouakchott',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Africa/Ouagadougou',
    'title': 'Ouagadougou',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Africa/Sao_Tome',
    'title': 'Sao Tome',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Atlantic/St_Helena',
    'title': 'St Helena',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'Africa/Addis_Ababa',
    'title': 'Addis Ababa',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Africa/Asmara',
    'title': 'Asmara',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Africa/Dar_es_Salaam',
    'title': 'Dar es Salaam',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Africa/Djibouti',
    'title': 'Djibouti',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Africa/Kampala',
    'title': 'Kampala',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Africa/Mogadishu',
    'title': 'Mogadishu',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Indian/Antananarivo',
    'title': 'Antananarivo',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Indian/Comoro',
    'title': 'Comoro',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Indian/Mayotte',
    'title': 'Mayotte',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Africa/Blantyre',
    'title': 'Blantyre',
    'winIndex': 2,
    'link': 196
}, {
    'id': 'Africa/Bujumbura',
    'title': 'Bujumbura',
    'winIndex': 2,
    'link': 196
}, {
    'id': 'Africa/Gaborone',
    'title': 'Gaborone',
    'winIndex': 2,
    'link': 196
}, {
    'id': 'Africa/Harare',
    'title': 'Harare',
    'winIndex': 2,
    'link': 196
}, {
    'id': 'Africa/Kigali',
    'title': 'Kigali',
    'winIndex': 2,
    'link': 196
}, {
    'id': 'Africa/Lubumbashi',
    'title': 'Lubumbashi',
    'winIndex': 2,
    'link': 196
}, {
    'id': 'Africa/Lusaka',
    'title': 'Lusaka',
    'winIndex': 2,
    'link': 196
}, {
    'id': 'Africa/Bangui',
    'title': 'Bangui',
    'winIndex': 3,
    'link': 195
}, {
    'id': 'Africa/Brazzaville',
    'title': 'Brazzaville',
    'winIndex': 3,
    'link': 195
}, {
    'id': 'Africa/Douala',
    'title': 'Douala',
    'winIndex': 3,
    'link': 195
}, {
    'id': 'Africa/Kinshasa',
    'title': 'Kinshasa',
    'winIndex': 3,
    'link': 195
}, {
    'id': 'Africa/Libreville',
    'title': 'Libreville',
    'winIndex': 3,
    'link': 195
}, {
    'id': 'Africa/Luanda',
    'title': 'Luanda',
    'winIndex': 3,
    'link': 195
}, {
    'id': 'Africa/Malabo',
    'title': 'Malabo',
    'winIndex': 3,
    'link': 195
}, {
    'id': 'Africa/Niamey',
    'title': 'Niamey',
    'winIndex': 3,
    'link': 195
}, {
    'id': 'Africa/Porto-Novo',
    'title': 'Porto-Novo',
    'winIndex': 3,
    'link': 195
}, {
    'id': 'Africa/Maseru',
    'title': 'Maseru',
    'winIndex': 2,
    'link': 193
}, {
    'id': 'Africa/Mbabane',
    'title': 'Mbabane',
    'winIndex': 2,
    'link': 193
}, {
    'id': 'Africa/Juba',
    'title': 'Juba',
    'winIndex': 1,
    'link': 194
}, {
    'id': 'Europe/Nicosia',
    'title': 'Nicosia',
    'winIndex': 4,
    'link': 381
}, {
    'id': 'Asia/Bahrain',
    'title': 'Bahrain',
    'winIndex': 5,
    'link': 388
}, {
    'id': 'Asia/Aden',
    'title': 'Aden',
    'winIndex': 5,
    'link': 391
}, {
    'id': 'Asia/Kuwait',
    'title': 'Kuwait',
    'winIndex': 5,
    'link': 391
}, {
    'id': 'Asia/Phnom_Penh',
    'title': 'Phnom Penh',
    'winIndex': 6,
    'link': 349
}, {
    'id': 'Asia/Vientiane',
    'title': 'Vientiane',
    'winIndex': 6,
    'link': 349
}, {
    'id': 'Asia/Muscat',
    'title': 'Muscat',
    'winIndex': 7,
    'link': 359
}, {
    'id': 'Antarctica/McMurdo',
    'title': 'McMurdo',
    'winIndex': 8,
    'link': 511
}, {
    'id': 'Africa/Asmera',
    'title': 'Asmera',
    'winIndex': 1,
    'link': 198
}, {
    'id': 'Africa/Timbuktu',
    'title': 'Timbuktu',
    'winIndex': 0,
    'link': 185
}, {
    'id': 'America/Buenos_Aires',
    'title': 'Buenos Aires',
    'winIndex': 9,
    'link': 206
}, {
    'id': 'America/Catamarca',
    'title': 'Catamarca',
    'winIndex': 9,
    'link': 207
}, {
    'id': 'America/Coral_Harbour',
    'title': 'Coral Harbour',
    'winIndex': 10,
    'link': 219
}, {
    'id': 'America/Cordoba',
    'title': 'Cordoba',
    'winIndex': 9,
    'link': 208
}, {
    'id': 'America/Ensenada',
    'title': 'Ensenada',
    'winIndex': 11,
    'link': 325
}, {
    'id': 'America/Indianapolis',
    'title': 'Indianapolis',
    'winIndex': 12
}, {
    'id': 'America/Jujuy',
    'title': 'Jujuy',
    'winIndex': 9,
    'link': 209
}, {
    'id': 'America/Knox_IN',
    'title': 'Knox IN',
    'winIndex': 13,
    'link': 261
}, {
    'id': 'America/Louisville',
    'title': 'Louisville',
    'winIndex': 14,
    'link': 272
}, {
    'id': 'America/Mendoza',
    'title': 'Mendoza',
    'winIndex': 9,
    'link': 211
}, {
    'id': 'America/Porto_Acre',
    'title': 'Porto Acre',
    'winIndex': 10,
    'link': 312
}, {
    'id': 'America/Shiprock',
    'title': 'Shiprock',
    'winIndex': 15,
    'link': 244
}, {
    'id': 'America/Virgin',
    'title': 'Virgin',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'Antarctica/South_Pole',
    'title': 'South Pole',
    'winIndex': 8,
    'link': 511
}, {
    'id': 'Asia/Ashkhabad',
    'title': 'Ashkhabad',
    'winIndex': 17,
    'link': 346
}, {
    'id': 'Asia/Calcutta',
    'title': 'Calcutta',
    'winIndex': 18,
    'link': 373
}, {
    'id': 'Asia/Chongqing',
    'title': 'Chongqing',
    'winIndex': 19,
    'link': 395
}, {
    'id': 'Asia/Chungking',
    'title': 'Chungking',
    'winIndex': 19,
    'link': 395
}, {
    'id': 'Asia/Dacca',
    'title': 'Dacca',
    'winIndex': 20,
    'link': 357
}, {
    'id': 'Asia/Harbin',
    'title': 'Harbin',
    'winIndex': 19,
    'link': 395
}, {
    'id': 'Asia/Kashgar',
    'title': 'Kashgar',
    'winIndex': 21,
    'link': 405
}, {
    'id': 'Asia/Katmandu',
    'title': 'Katmandu',
    'winIndex': 22,
    'link': 371
}, {
    'id': 'Asia/Macao',
    'title': 'Macao',
    'winIndex': 19,
    'link': 377
}, {
    'id': 'Asia/Saigon',
    'title': 'Saigon',
    'winIndex': 6,
    'link': 361
}, {
    'id': 'Asia/Tel_Aviv',
    'title': 'Tel Aviv',
    'winIndex': 23,
    'link': 367
}, {
    'id': 'Asia/Thimbu',
    'title': 'Thimbu',
    'winIndex': 20,
    'link': 402
}, {
    'id': 'Asia/Ujung_Pandang',
    'title': 'Ujung Pandang',
    'winIndex': 24,
    'link': 379
}, {
    'id': 'Asia/Ulan_Bator',
    'title': 'Ulan Bator',
    'winIndex': 25,
    'link': 404
}, {
    'id': 'Atlantic/Faeroe',
    'title': 'Faeroe',
    'winIndex': 26,
    'link': 415
}, {
    'id': 'Atlantic/Jan_Mayen',
    'title': 'Jan Mayen',
    'winIndex': 27,
    'link': 483
}, {
    'id': 'Australia/ACT',
    'title': 'ACT',
    'winIndex': 28,
    'link': 429
}, {
    'id': 'Australia/Canberra',
    'title': 'Canberra',
    'winIndex': 28,
    'link': 429
}, {
    'id': 'Australia/NSW',
    'title': 'NSW',
    'winIndex': 28,
    'link': 429
}, {
    'id': 'Australia/North',
    'title': 'North',
    'winIndex': 29,
    'link': 424
}, {
    'id': 'Australia/Queensland',
    'title': 'Queensland',
    'winIndex': 30,
    'link': 421
}, {
    'id': 'Australia/South',
    'title': 'South',
    'winIndex': 31,
    'link': 420
}, {
    'id': 'Australia/Tasmania',
    'title': 'Tasmania',
    'winIndex': 32,
    'link': 425
}, {
    'id': 'Australia/Victoria',
    'title': 'Victoria',
    'winIndex': 28,
    'link': 427
}, {
    'id': 'Australia/West',
    'title': 'West',
    'winIndex': 33,
    'link': 428
}, {
    'id': 'Australia/Yancowinna',
    'title': 'Yancowinna',
    'winIndex': 31,
    'link': 422
}, {
    'id': 'Brazil/Acre',
    'title': 'Acre',
    'winIndex': 10,
    'link': 312
}, {
    'id': 'Brazil/DeNoronha',
    'title': 'DeNoronha',
    'winIndex': 34,
    'link': 294
}, {
    'id': 'Brazil/East',
    'title': 'East',
    'winIndex': 35,
    'link': 317
}, {
    'id': 'Brazil/West',
    'title': 'West',
    'winIndex': 16,
    'link': 279
}, {
    'id': 'Canada/Atlantic',
    'title': 'Atlantic',
    'winIndex': 36,
    'link': 257
}, {
    'id': 'Canada/Central',
    'title': 'Central',
    'winIndex': 13,
    'link': 329
}, {
    'id': 'Canada/East-Saskatchewan',
    'title': 'East-Saskatchewan',
    'winIndex': 37,
    'link': 310
}, {
    'id': 'Canada/Eastern',
    'title': 'Eastern',
    'winIndex': 14,
    'link': 326
}, {
    'id': 'Canada/Mountain',
    'title': 'Mountain',
    'winIndex': 15,
    'link': 246
}, {
    'id': 'Canada/Newfoundland',
    'title': 'Newfoundland',
    'winIndex': 38,
    'link': 320
}, {
    'id': 'Canada/Pacific',
    'title': 'Pacific',
    'winIndex': 11,
    'link': 327
}, {
    'id': 'Canada/Saskatchewan',
    'title': 'Saskatchewan',
    'winIndex': 37,
    'link': 310
}, {
    'id': 'Canada/Yukon',
    'title': 'Yukon',
    'winIndex': 11,
    'link': 328
}, {
    'id': 'Chile/Continental',
    'title': 'Continental',
    'winIndex': 39,
    'link': 315
}, {
    'id': 'Cuba',
    'title': 'Cuba',
    'winIndex': 14,
    'link': 258
}, {
    'id': 'Egypt',
    'title': 'Egypt',
    'winIndex': 40,
    'link': 189
}, {
    'id': 'Eire',
    'title': 'Eire',
    'winIndex': 26,
    'link': 469
}, {
    'id': 'Europe/Belfast',
    'title': 'Belfast',
    'winIndex': 26,
    'link': 476
}, {
    'id': 'Europe/Tiraspol',
    'title': 'Tiraspol',
    'winIndex': 4,
    'link': 467
}, {
    'id': 'GB',
    'title': 'GB',
    'winIndex': 26,
    'link': 476
}, {
    'id': 'GB-Eire',
    'title': 'GB-Eire',
    'winIndex': 26,
    'link': 476
}, {
    'id': 'GMT+0',
    'title': 'GMT+0',
    'winIndex': 41,
    'link': 150
}, {
    'id': 'GMT-0',
    'title': 'GMT-0',
    'winIndex': 41,
    'link': 150
}, {
    'id': 'GMT0',
    'title': 'GMT0',
    'winIndex': 41,
    'link': 150
}, {
    'id': 'Greenwich',
    'title': 'Greenwich',
    'winIndex': 41,
    'link': 150
}, {
    'id': 'Hongkong',
    'title': 'Hongkong',
    'winIndex': 19,
    'link': 362
}, {
    'id': 'Iceland',
    'title': 'Iceland',
    'winIndex': 0,
    'link': 417
}, {
    'id': 'Iran',
    'title': 'Iran',
    'winIndex': 42,
    'link': 401
}, {
    'id': 'Israel',
    'title': 'Israel',
    'winIndex': 23,
    'link': 367
}, {
    'id': 'Jamaica',
    'title': 'Jamaica',
    'winIndex': 10,
    'link': 270
}, {
    'id': 'Japan',
    'title': 'Japan',
    'winIndex': 43,
    'link': 403
}, {
    'id': 'Kwajalein',
    'title': 'Kwajalein',
    'winIndex': 44,
    'link': 524
}, {
    'id': 'Libya',
    'title': 'Libya',
    'winIndex': 45,
    'link': 200
}, {
    'id': 'Mexico/BajaNorte',
    'title': 'BajaNorte',
    'winIndex': 11,
    'link': 325
}, {
    'id': 'Mexico/BajaSur',
    'title': 'BajaSur',
    'winIndex': 46,
    'link': 282
}, {
    'id': 'Mexico/General',
    'title': 'General',
    'winIndex': 47,
    'link': 285
}, {
    'id': 'NZ',
    'title': 'NZ',
    'winIndex': 8,
    'link': 511
}, {
    'id': 'Navajo',
    'title': 'Navajo',
    'winIndex': 15,
    'link': 244
}, {
    'id': 'PRC',
    'title': 'PRC',
    'winIndex': 19,
    'link': 395
}, {
    'id': 'Pacific/Ponape',
    'title': 'Ponape',
    'winIndex': 48,
    'link': 532
}, {
    'id': 'Pacific/Samoa',
    'title': 'Samoa',
    'winIndex': 49,
    'link': 530
}, {
    'id': 'Pacific/Truk',
    'title': 'Truk',
    'winIndex': 50,
    'link': 512
}, {
    'id': 'Poland',
    'title': 'Poland',
    'winIndex': 51,
    'link': 498
}, {
    'id': 'Portugal',
    'title': 'Portugal',
    'winIndex': 26,
    'link': 475
}, {
    'id': 'ROC',
    'title': 'ROC',
    'winIndex': 52,
    'link': 398
}, {
    'id': 'ROK',
    'title': 'ROK',
    'winIndex': 53,
    'link': 394
}, {
    'id': 'Singapore',
    'title': 'Singapore',
    'winIndex': 24,
    'link': 396
}, {
    'id': 'Turkey',
    'title': 'Turkey',
    'winIndex': 54,
    'link': 472
}, {
    'id': 'US/Alaska',
    'title': 'Alaska',
    'winIndex': 55,
    'link': 203
}, {
    'id': 'US/Arizona',
    'title': 'Arizona',
    'winIndex': 56,
    'link': 302
}, {
    'id': 'US/Central',
    'title': 'Central',
    'winIndex': 13,
    'link': 235
}, {
    'id': 'US/Eastern',
    'title': 'Eastern',
    'winIndex': 14,
    'link': 291
}, {
    'id': 'US/Hawaii',
    'title': 'Hawaii',
    'winIndex': 57,
    'link': 521
}, {
    'id': 'US/Indiana-Starke',
    'title': 'Indiana-Starke',
    'winIndex': 13,
    'link': 261
}, {
    'id': 'US/Michigan',
    'title': 'Michigan',
    'winIndex': 14,
    'link': 245
}, {
    'id': 'US/Mountain',
    'title': 'Mountain',
    'winIndex': 15,
    'link': 244
}, {
    'id': 'US/Pacific',
    'title': 'Pacific',
    'winIndex': 11,
    'link': 276
}, {
    'id': 'US/Samoa',
    'title': 'Samoa',
    'winIndex': 49,
    'link': 530
}, {
    'id': 'W-SU',
    'title': 'W-SU',
    'winIndex': 58,
    'link': 482
}, {
    'id': 'GMT',
    'title': 'GMT',
    'winIndex': 41,
    'link': 150
}, {
    'id': 'Etc/Greenwich',
    'title': 'Greenwich',
    'winIndex': 41,
    'link': 150
}, {
    'id': 'Etc/GMT-0',
    'title': 'GMT-0',
    'winIndex': 41,
    'link': 150
}, {
    'id': 'Etc/GMT+0',
    'title': 'GMT+0',
    'winIndex': 41,
    'offsets': [0],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT0',
    'title': 'GMT0',
    'winIndex': 41,
    'link': 150
}, {
    'id': 'Europe/Jersey',
    'title': 'Jersey',
    'winIndex': 26,
    'link': 476
}, {
    'id': 'Europe/Guernsey',
    'title': 'Guernsey',
    'winIndex': 26,
    'link': 476
}, {
    'id': 'Europe/Isle_of_Man',
    'title': 'Isle of Man',
    'winIndex': 26,
    'link': 476
}, {
    'id': 'Europe/Mariehamn',
    'title': 'Mariehamn',
    'winIndex': 59,
    'link': 471
}, {
    'id': 'Europe/Busingen',
    'title': 'Busingen',
    'winIndex': 27,
    'link': 500
}, {
    'id': 'Europe/Vatican',
    'title': 'Vatican',
    'winIndex': 27,
    'link': 487
}, {
    'id': 'Europe/San_Marino',
    'title': 'San Marino',
    'winIndex': 27,
    'link': 487
}, {
    'id': 'Europe/Vaduz',
    'title': 'Vaduz',
    'winIndex': 27,
    'link': 500
}, {
    'id': 'Arctic/Longyearbyen',
    'title': 'Longyearbyen',
    'winIndex': 27,
    'link': 483
}, {
    'id': 'Europe/Ljubljana',
    'title': 'Ljubljana',
    'winIndex': 60,
    'link': 462
}, {
    'id': 'Europe/Podgorica',
    'title': 'Podgorica',
    'winIndex': 60,
    'link': 462
}, {
    'id': 'Europe/Sarajevo',
    'title': 'Sarajevo',
    'winIndex': 60,
    'link': 462
}, {
    'id': 'Europe/Skopje',
    'title': 'Skopje',
    'winIndex': 60,
    'link': 462
}, {
    'id': 'Europe/Zagreb',
    'title': 'Zagreb',
    'winIndex': 60,
    'link': 462
}, {
    'id': 'Europe/Bratislava',
    'title': 'Bratislava',
    'winIndex': 60,
    'link': 485
}, {
    'id': 'Asia/Istanbul',
    'title': 'Istanbul',
    'winIndex': 54,
    'link': 472
}, {
    'id': 'Pacific/Johnston',
    'title': 'Johnston',
    'winIndex': 57,
    'link': 521
}, {
    'id': 'US/Pacific-New',
    'title': 'Pacific-New',
    'winIndex': 11,
    'link': 276
}, {
    'id': 'America/Aruba',
    'title': 'Aruba',
    'winIndex': 16,
    'link': 240
}, {
    'id': 'America/Lower_Princes',
    'title': 'Lower Princes',
    'winIndex': 16,
    'link': 240
}, {
    'id': 'America/Kralendijk',
    'title': 'Kralendijk',
    'winIndex': 16,
    'link': 240
}, {
    'id': 'America/Anguilla',
    'title': 'Anguilla',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/Dominica',
    'title': 'Dominica',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/Grenada',
    'title': 'Grenada',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/Guadeloupe',
    'title': 'Guadeloupe',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/Marigot',
    'title': 'Marigot',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/Montserrat',
    'title': 'Montserrat',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/St_Barthelemy',
    'title': 'St Barthelemy',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/St_Kitts',
    'title': 'St Kitts',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/St_Lucia',
    'title': 'St Lucia',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/St_Thomas',
    'title': 'St Thomas',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/St_Vincent',
    'title': 'St Vincent',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/Tortola',
    'title': 'Tortola',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'Africa/Abidjan',
    'title': 'Abidjan',
    'winIndex': 0,
    'offsets': [-0.2688888888888889, 0],
    'offsetIndices': '01',
    'untils': '-u9rgl4|Infinity'
}, {
    'id': 'Africa/Accra',
    'title': 'Accra',
    'winIndex': 0,
    'offsets': [-0.014444444444444446, 0, 0.3333333333333333],
    'offsetIndices': '012121212121212121212121212121212121212121212121',
    'untils': '-r507yk|1e3pak|681qo|cjvlc|681qo|cjvlc|681qo|cjvlc|681qo|clq9c|681qo|cjvlc|681qo|cjvlc|681qo|cjvlc|681qo|clq9c|681qo|cjvlc|681qo|cjvlc|681qo|cjvlc|681qo|clq9c|681qo|cjvlc|681qo|cjvlc|681qo|cjvlc|681qo|clq9c|681qo|cjvlc|681qo|cjvlc|681qo|cjvlc|681qo|clq9c|681qo|cjvlc|681qo|cjvlc|681qo|Infinity'
}, {
    'id': 'Africa/Algiers',
    'title': 'Algiers',
    'winIndex': 3,
    'offsets': [0.15583333333333332, 0, 1, 2],
    'offsetIndices': '0121212121212121232321212122321212',
    'untils': '-uozn3l|2qx1nl|5luo0|8y800|a4tc0|7vc00|auqo0|7idc0|b7pc0|6sg00|cyo00|7ayo0|53c00|9idxc0|3i040|51mw0|253uk0|9o2k0|92040|8l3s0|jutc0|4uy840|3rdzw0|46xc00|7x6o0|2xco40|8n180|7x9g0|9d440|kiqg0|9d440|9q2s0|9cyk0|Infinity'
}, {
    'id': 'Africa/Bissau',
    'title': 'Bissau',
    'winIndex': 0,
    'offsets': [-1.038888888888889, -1, 0],
    'offsetIndices': '012',
    'untils': '-u9reg4|wvoyk4|Infinity'
}, {
    'id': 'Africa/Cairo',
    'title': 'Cairo',
    'winIndex': 40,
    'offsets': [2, 3],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-fdls80|40d80|a31g0|7x3w0|a4w40|aqyk0|80ys0|b07w0|7tk40|b07w0|8jhg0|a8fw0|60go40|7el80|awo40|7v980|awqw0|7tk40|b07w0|7tk40|ayd80|7tk40|ayd80|7tk40|ayd80|7tk40|b07w0|7tk40|ayd80|7tk40|ayd80|7ves0|awik0|7ves0|ayd80|7ves0|awik0|7ves0|awik0|7ves0|awik0|7ves0|ayd80|7ves0|awik0|7ves0|awik0|7ves0|awik0|7ves0|ayd80|7ves0|awik0|7ves0|awik0|7ves0|awik0|7ves0|ayd80|7ves0|awik0|7ves0|f9x80|3i040|eluk0|462s0|ayd80|7ves0|awik0|7ves0|awik0|7ves0|awik0|7ves0|ayd80|7ves0|b5rw0|7m5g0|awik0|7ves0|awik0|7ves0|ayd80|7ves0|awik0|7ves0|awik0|7ves0|aqvs0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7k580|b5xg0|6u7w0|bvus0|6h980|c8tg0|64ak0|cyqs0|5anw0|1jms0|12t80|1w22s0|25p80|1sw40|2vmk0|Infinity'
}, {
    'id': 'Africa/Casablanca',
    'title': 'Casablanca',
    'winIndex': 61,
    'offsets': [-0.5055555555555555, 0, 1],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-tblt9g|di7nxg|3huk0|51k40|2znuk0|2dp9g0|776k0|8nt2s0|657w0|3ifxg0|3jp80|va040|4qak0|e1ms0|7pp80|cnms0|3afw0|2xi840|xqqk0|bp56s0|4qak0|e1ms0|45x80|d2g40|51ek0|c8tg0|64ak0|e1sc0|47uo0|1leo0|23xc0|asw00|3lmo0|1qyo0|40g00|7x6o0|4mo00|1stc0|4deo0|7x6o0|3ylc0|1stc0|51hc0|7x6o0|3lmo0|1stc0|5reo0|7k800|2vpc0|25s00|64dc0|7k800|2iqo0|1stc0|6uao0|7x6o0|1stc0|1stc0|779c0|7x6o0|12w00|1stc0|7x6o0|7x6o0|pxc0|1stc0|8n400|9q000|902o0|902o0|9q000|8n400|a2yo0|8a5c0|afxc0|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|afxc0|8a5c0|9q000|Infinity'
}, {
    'id': 'Africa/Ceuta',
    'title': 'Ceuta',
    'winIndex': 62,
    'offsets': [0, 1, 2],
    'offsetIndices': '010101010101010101010121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-qyiys0|7x3w0|2vt440|8so00|st1c0|8n400|9q000|902o0|a2yo0|902o0|k69g40|657w0|3ifxg0|3jp80|va040|4qak0|e1ms0|7pp80|cnms0|3afw0|2xi840|129us0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Africa/El_Aaiun',
    'title': 'El Aaiun',
    'winIndex': 61,
    'offsets': [-0.88, -1, 0, 1],
    'offsetIndices': '01232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-isdxk0|m2g0c0|vek0|4qak0|e1ms0|7pp80|cnms0|3afw0|fke5g0|4qak0|e1ms0|45x80|d2g40|51ek0|c8tg0|64ak0|e1sc0|47uo0|1leo0|23xc0|asw00|3lmo0|1qyo0|40g00|7x6o0|4mo00|1stc0|4deo0|7x6o0|3ylc0|1stc0|51hc0|7x6o0|3lmo0|1stc0|5reo0|7k800|2vpc0|25s00|64dc0|7k800|2iqo0|1stc0|6uao0|7x6o0|1stc0|1stc0|779c0|7x6o0|12w00|1stc0|7x6o0|7x6o0|pxc0|1stc0|8n400|9q000|902o0|902o0|9q000|8n400|a2yo0|8a5c0|afxc0|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|afxc0|8a5c0|9q000|Infinity'
}, {
    'id': 'Africa/Johannesburg',
    'title': 'Johannesburg',
    'winIndex': 2,
    'offsets': [1.5, 2, 3],
    'offsetIndices': '012121',
    'untils': '-yvtdi0|kn7o60|9cyk0|9d440|9cyk0|Infinity'
}, {
    'id': 'Africa/Khartoum',
    'title': 'Khartoum',
    'winIndex': 1,
    'offsets': [2.1688888888888886, 2, 3],
    'offsetIndices': '01212121212121212121212121212121212',
    'untils': '-kcrsow|kixv4w|8l6k0|a4w40|8n180|a6qs0|8n180|a31g0|8ovw0|a16s0|8qqk0|9zc40|8sl80|9xhg0|8wak0|9ts40|8y580|a4w40|8n180|a31g0|8ovw0|a16s0|8sl80|9xhg0|8ufw0|9vms0|8wak0|9ts40|8y580|a4w40|8ovw0|a16s0|8qqk0|7frw40|Infinity'
}, {
    'id': 'Africa/Lagos',
    'title': 'Lagos',
    'winIndex': 3,
    'offsets': [0.22666666666666666, 1],
    'offsetIndices': '01',
    'untils': '-q9qbao|Infinity'
}, {
    'id': 'Africa/Maputo',
    'title': 'Maputo',
    'winIndex': 2,
    'offsets': [2.1722222222222225, 2],
    'offsetIndices': '01',
    'untils': '-yvtfd8|Infinity'
}, {
    'id': 'Africa/Monrovia',
    'title': 'Monrovia',
    'winIndex': 0,
    'offsets': [-0.7188888888888889, -0.7416666666666667, 0],
    'offsetIndices': '012',
    'untils': '-qj6zc4|rqyyqa|Infinity'
}, {
    'id': 'Africa/Nairobi',
    'title': 'Nairobi',
    'winIndex': 1,
    'offsets': [2.454444444444445, 3, 2.5, 2.75],
    'offsetIndices': '01231',
    'untils': '-lnsetg|s8mhg|57v020|afrrb0|Infinity'
}, {
    'id': 'Africa/Ndjamena',
    'title': 'Ndjamena',
    'winIndex': 3,
    'offsets': [1.0033333333333334, 1, 2],
    'offsetIndices': '0121',
    'untils': '-u9rk4c|zdk5cc|7iak0|Infinity'
}, {
    'id': 'Africa/Tripoli',
    'title': 'Tripoli',
    'winIndex': 45,
    'offsets': [0.8788888888888889, 1, 2],
    'offsetIndices': '012121212121212121212121212122122',
    'untils': '-q3gfrw|gl6ajw|422c0|xado0|4bbo0|wrpg0|4s580|1kdpg0|c05bw0|4mqs0|9et80|9d440|9et80|9eys0|9et80|9mdg0|95jw0|9io40|9cyk0|99es0|9et80|9eys0|9et80|9d440|9et80|b2840|3cf3w0|9kis0|9et80|7vqyw0|75eo0|asw00|Infinity'
}, {
    'id': 'Africa/Tunis',
    'title': 'Tunis',
    'winIndex': 3,
    'offsets': [0.15583333333333332, 1, 2],
    'offsetIndices': '0121212121212121212121212121212121',
    'untils': '-uozn3l|enxevl|b5uo0|53c00|u8w00|7x9g0|c8w80|7k800|z3w0|ew40|8bx80|9d440|9nx00|925o0|8l100|gi3440|7k800|b9k00|7vc00|51mw00|5ytc0|9d1c0|9d1c0|b9k00|7thc0|7m0tc0|7tk40|93us0|b5uo0|7k800|b5uo0|7x6o0|asw00|Infinity'
}, {
    'id': 'Africa/Windhoek',
    'title': 'Windhoek',
    'winIndex': 63,
    'offsets': [1.5, 2, 3, 1],
    'offsetIndices': '012113131313131313131313131313131313131313131313131313131313131313131313131313131313131313131',
    'untils': '-yvtdi0|kn7o60|9cyk0|oj2nw0|23tmo0|7xf00|ast80|7x9g0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7x9g0|ast80|7x9g0|Infinity'
}, {
    'id': 'America/Anchorage',
    'title': 'Anchorage',
    'winIndex': 55,
    'offsets': [-10, -9, -8],
    'offsetIndices': '011001010101010101010101010101010111212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-ek1qo0|1tyx80|2e400|b7yik0|12y080|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|1l940|7rs80|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Antigua',
    'title': 'Antigua',
    'winIndex': 16,
    'link': 303
}, {
    'id': 'America/Araguaina',
    'title': 'Araguaina',
    'winIndex': 64,
    'offsets': [-3.2133333333333334, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121',
    'untils': '-t85j2o|99k8mo|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|cyqs0|5ed80|dbpg0|64ak0|2yl440|64ak0|c8tg0|6u7w0|bxpg0|7iak0|biw40|6u7w0|biw40|7k580|biw40|6u7w0|c8tg0|6h980|dbpg0|5ed80|51udg0|64ak0|Infinity'
}, {
    'id': 'America/Argentina/Buenos_Aires',
    'title': 'Buenos Aires',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121212323232323232223232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bvus0|6u7w0|bvus0|6u7w0|bvus0|776k0|3fidg0|7thc0|430lc0|3yik0|b5xg0|7k580|Infinity'
}, {
    'id': 'America/Argentina/Catamarca',
    'title': 'Catamarca',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121212323232313232221232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bvus0|6u7w0|bvxk0|6u540|bvus0|776k0|3fidg0|7thc0|27s800|z9g0|1u93w0|3yik0|Infinity'
}, {
    'id': 'America/Argentina/Cordoba',
    'title': 'Cordoba',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121212323232313232223232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bvus0|6u7w0|bvxk0|6u540|bvus0|776k0|3fidg0|7thc0|430lc0|3yik0|b5xg0|7k580|Infinity'
}, {
    'id': 'America/Argentina/Jujuy',
    'title': 'Jujuy',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '01212121212121212121212121212121212121212123232312132322232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|c8w80|776k0|ag040|7k2g0|bvus0|776k0|3fidg0|7thc0|430lc0|3yik0|Infinity'
}, {
    'id': 'America/Argentina/La_Rioja',
    'title': 'La Rioja',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '01212121212121212121212121212121212121212123232323123232221232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bvus0|6qik0|3g880|8jbw0|6u7w0|bvus0|776k0|3fidg0|7thc0|27s800|z9g0|1u93w0|3yik0|Infinity'
}, {
    'id': 'America/Argentina/Mendoza',
    'title': 'Mendoza',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121212323231212132221232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bktk0|71mk0|bqas0|73h80|bvus0|773s0|3fidg0|7thc0|27bk00|6hes0|1p7mk0|3yik0|Infinity'
}, {
    'id': 'America/Argentina/Rio_Gallegos',
    'title': 'Rio Gallegos',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121212323232323232221232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bvus0|6u7w0|bvus0|6u7w0|bvus0|776k0|3fidg0|7thc0|27s800|z9g0|1u93w0|3yik0|Infinity'
}, {
    'id': 'America/Argentina/Salta',
    'title': 'Salta',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '01212121212121212121212121212121212121212123232323132322232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bvus0|6u7w0|bvxk0|6u540|bvus0|776k0|3fidg0|7thc0|430lc0|3yik0|Infinity'
}, {
    'id': 'America/Argentina/San_Juan',
    'title': 'San Juan',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '01212121212121212121212121212121212121212123232323123232221232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bvus0|6qik0|3g880|8jbw0|6u7w0|bvus0|776k0|3fidg0|7thc0|27qdc0|2txg0|1sgak0|3yik0|Infinity'
}, {
    'id': 'America/Argentina/San_Luis',
    'title': 'San Luis',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '01212121212121212121212121212121212121212123232312122212321212',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|7pp80|b2aw0|71mk0|4qg40|4conw0|7thc0|27qdc0|2txg0|1sgak0|14nw0|2gys0|b5xg0|7k580|b5xg0|Infinity'
}, {
    'id': 'America/Argentina/Tucuman',
    'title': 'Tucuman',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '012121212121212121212121212121212121212121232323231323222123232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bvus0|6u7w0|bvxk0|6u540|bvus0|776k0|3fidg0|7thc0|27s800|mas0|1um2k0|3yik0|b5xg0|7k580|Infinity'
}, {
    'id': 'America/Argentina/Ushuaia',
    'title': 'Ushuaia',
    'winIndex': 9,
    'offsets': [-4.28, -4, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121212323232323232221232',
    'untils': '-px7ys0|5iv8k0|67zw0|a4w40|73h80|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|cls40|66580|cls40|66580|cls40|66580|cls40|67zw0|6a040|hy7w0|6a040|xovw0|3uys0|18nbw0|b0dg0|8ve2k0|3uys0|3yik0|bqas0|71mk0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|7m2qs0|4tzw0|biw40|776k0|bvus0|6u7w0|bvus0|6u7w0|bvus0|776k0|3fidg0|7thc0|27oio0|12ys0|1u93w0|3yik0|Infinity'
}, {
    'id': 'America/Asuncion',
    'title': 'Asuncion',
    'winIndex': 65,
    'offsets': [-3.844444444444444, -4, -3],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212',
    'untils': '-jy93zk|ldwofk|s4vw0|s6w40|7tek0|b0dg0|7rjw0|b0dg0|7rjw0|b0dg0|9cyk0|9eys0|9et80|9eys0|9cyk0|9eys0|9cyk0|9eys0|9cyk0|9eys0|9et80|9eys0|9cyk0|9eys0|9cyk0|9eys0|9cyk0|9eys0|9et80|9eys0|9cyk0|ahus0|8a2k0|9eys0|9cyk0|9o840|7k580|b7s40|93p80|9gtg0|7nuk0|b42s0|7lzw0|b5xg0|7tek0|b9ms0|776k0|biw40|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|9cyk0|7kas0|b5rw0|7x9g0|ast80|a31g0|7k580|b5xg0|7k580|b5xg0|7k580|biw40|776k0|biw40|776k0|biw40|8zzw0|905g0|9px80|905g0|9px80|9d440|8n180|a31g0|8n180|a31g0|8n180|a31g0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|a31g0|8n180|a31g0|8n180|a31g0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|a31g0|8n180|a31g0|8n180|a31g0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|a31g0|8n180|a31g0|8n180|a31g0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|a31g0|8n180|a31g0|8n180|a31g0|Infinity'
}, {
    'id': 'America/Atikokan',
    'title': 'Atikokan',
    'winIndex': 10,
    'offsets': [-6, -5],
    'offsetIndices': '0101111',
    'untils': '-qzov40|a2vw0|bfxjw0|pmdk0|1tz8c0|2dsw0|Infinity'
}, {
    'id': 'America/Bahia',
    'title': 'Bahia',
    'winIndex': 66,
    'offsets': [-2.5677777777777777, -3, -2],
    'offsetIndices': '01212121212121212121212121212121212121212121212121212121212121',
    'untils': '-t85kv8|99kaf8|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|cyqs0|5ed80|dbpg0|64ak0|cyqs0|64ak0|cls40|5rbw0|dbpg0|51ek0|dbpg0|6h980|c8tg0|6h980|c8tg0|64ak0|c8tg0|6u7w0|bxpg0|7iak0|biw40|6u7w0|biw40|7k580|biw40|6u7w0|c8tg0|6h980|dbpg0|5ed80|4irc40|6u7w0|Infinity'
}, {
    'id': 'America/Bahia_Banderas',
    'title': 'Bahia Banderas',
    'winIndex': 47,
    'offsets': [-7.016666666666667, -7, -6, -8, -5],
    'offsetIndices': '0121212131212121212121212121212121212142424242424242424242424242424242424242424242424242424242',
    'untils': '-p1u4k0|2u7jw0|1sgdc0|8n400|7thc0|9eys0|591h80|3ie2s0|axvpg0|dpgw40|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|9q2s0|7k580|9q2s0|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|asqg0|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|Infinity'
}, {
    'id': 'America/Barbados',
    'title': 'Barbados',
    'winIndex': 16,
    'offsets': [-3.974722222222222, -4, -3],
    'offsetIndices': '00121212121',
    'untils': '-o0aiaj|46b400|npv1mj|5rbw0|a31g0|8n180|a31g0|8n180|ag040|84ik0|Infinity'
}, {
    'id': 'America/Belem',
    'title': 'Belem',
    'winIndex': 64,
    'offsets': [-3.232222222222222, -3, -2],
    'offsetIndices': '012121212121212121212121212121',
    'untils': '-t85j0s|99k8ks|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|Infinity'
}, {
    'id': 'America/Belize',
    'title': 'Belize',
    'winIndex': 67,
    'offsets': [-5.88, -6, -5.5, -5],
    'offsetIndices': '01212121212121212121212121212121212121212121212121213131',
    'untils': '-u52ic0|3edkc0|6ham0|c8s20|6u9a0|bvte0|6u9a0|bvte0|6u9a0|c8s20|6ham0|c8s20|6ham0|c8s20|6u9a0|bvte0|6u9a0|bvte0|6u9a0|bvte0|6u9a0|c8s20|6ham0|c8s20|6ham0|c8s20|6u9a0|bvte0|6u9a0|bvte0|6u9a0|c8s20|6ham0|c8s20|6ham0|c8s20|6ham0|c8s20|6u9a0|bvte0|6u9a0|bvte0|6u9a0|c8s20|6ham0|c8s20|6ham0|c8s20|6u9a0|bvte0|6u9a0|g2t2q0|3e580|4mcys0|2vmk0|Infinity'
}, {
    'id': 'America/Blanc-Sablon',
    'title': 'Blanc-Sablon',
    'winIndex': 16,
    'offsets': [-4, -3],
    'offsetIndices': '010110',
    'untils': '-qzp0o0|a2vw0|c5jxg0|1tzdw0|2dnc0|Infinity'
}, {
    'id': 'America/Boa_Vista',
    'title': 'Boa Vista',
    'winIndex': 16,
    'offsets': [-4.044444444444444, -4, -3],
    'offsetIndices': '0121212121212121212121212121212121',
    'untils': '-t85grk|99k93k|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|62xk40|7k580|biw40|cvw0|Infinity'
}, {
    'id': 'America/Bogota',
    'title': 'Bogota',
    'winIndex': 10,
    'offsets': [-4.937777777777778, -5, -4],
    'offsetIndices': '0121',
    'untils': '-srdoy8|14f1hi8|ha580|Infinity'
}, {
    'id': 'America/Boise',
    'title': 'Boise',
    'winIndex': 15,
    'offsets': [-8, -7, -6],
    'offsetIndices': '0101012212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0emw0|ast80|7x9g0|ast80|1um840|9s7jw0|1tz5k0|2dvo0|b9gdg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|51k40|doik0|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Cambridge_Bay',
    'title': 'Cambridge Bay',
    'winIndex': 15,
    'offsets': [0, -7, -6, -5],
    'offsetIndices': '0122131212121212121212121212121212121212121212233221212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-q3gdc0|bjeec0|1tz5k0|2dvo0|a7n3w0|9q000|7k85k0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x6o0|ast80|ct40|7kj40|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Campo_Grande',
    'title': 'Campo Grande',
    'winIndex': 68,
    'offsets': [-3.641111111111111, -4, -3],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212',
    'untils': '-t85hvw|99ka7w|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|cyqs0|5ed80|dbpg0|64ak0|cyqs0|64ak0|cls40|5rbw0|dbpg0|51ek0|dbpg0|6h980|c8tg0|6h980|c8tg0|64ak0|c8tg0|6u7w0|bxpg0|7iak0|biw40|6u7w0|biw40|7k580|biw40|6u7w0|c8tg0|6h980|dbpg0|5ed80|cls40|64ak0|dfes0|5nmk0|c8tg0|6h980|dbpg0|5rbw0|bvus0|6h980|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6u7w0|c8tg0|64ak0|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6h980|c8tg0|6h980|cls40|64ak0|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6u7w0|bvus0|6h980|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6h980|c8tg0|6h980|cls40|64ak0|cls40|64ak0|cls40|64ak0|cls40|6h980|c8tg0|6u7w0|bvus0|6h980|cls40|64ak0|cls40|6h980|c8tg0|Infinity'
}, {
    'id': 'America/Cancun',
    'title': 'Cancun',
    'winIndex': 47,
    'offsets': [-5.7844444444444445, -6, -5, -4],
    'offsetIndices': '0123232321212121212121212121212121212121212',
    'untils': '-p1u7c0|vauo00|7ggw40|afuk0|8a840|afuk0|8a840|64ak0|4bms0|8a840|ast80|7x9g0|ast80|9q2s0|7k580|9q2s0|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|51k40|Infinity'
}, {
    'id': 'America/Caracas',
    'title': 'Caracas',
    'winIndex': 69,
    'offsets': [-4.461111111111111, -4.5, -4],
    'offsetIndices': '01212',
    'untils': '-u7lcxw|rlo83w|meoxm0|4dps00|Infinity'
}, {
    'id': 'America/Cayenne',
    'title': 'Cayenne',
    'winIndex': 64,
    'offsets': [-3.488888888888889, -4, -3],
    'offsetIndices': '012',
    'untils': '-uj7yb4|tcw6r4|Infinity'
}, {
    'id': 'America/Cayman',
    'title': 'Cayman',
    'winIndex': 10,
    'link': 299
}, {
    'id': 'America/Chicago',
    'title': 'Chicago',
    'winIndex': 13,
    'offsets': [-6, -5],
    'offsetIndices': '01010101010101010101010101010101010101010101010101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bvus0|776k0|7kas0|b5rw0|9d440|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|7x9g0|dbjw0|8a840|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|6w840|1tz8c0|2dsw0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Chihuahua',
    'title': 'Chihuahua',
    'winIndex': 46,
    'offsets': [-7.072222222222222, -7, -6, -5],
    'offsetIndices': '0121212323221212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-p1u4k0|2u7jw0|1sgdc0|8n400|7thc0|9eys0|xes2s0|afuk0|8a840|afuk0|8aaw0|afuk0|8a840|ast80|7x9g0|ast80|9q2s0|7k580|9q2s0|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|Infinity'
}, {
    'id': 'America/Costa_Rica',
    'title': 'Costa Rica',
    'winIndex': 67,
    'offsets': [-5.60361111111111, -6, -5],
    'offsetIndices': '0121212121',
    'untils': '-pjw8fn|ubtl3n|51ek0|doo40|51ek0|5jso40|8drw0|acas0|2xh80|Infinity'
}, {
    'id': 'America/Creston',
    'title': 'Creston',
    'winIndex': 56,
    'offsets': [-7, -8],
    'offsetIndices': '010',
    'untils': '-rshz80|vbus0|Infinity'
}, {
    'id': 'America/Cuiaba',
    'title': 'Cuiaba',
    'winIndex': 68,
    'offsets': [-3.738888888888889, -4, -3],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212',
    'untils': '-t85hm4|99k9y4|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|cyqs0|5ed80|dbpg0|64ak0|cyqs0|64ak0|cls40|5rbw0|dbpg0|51ek0|dbpg0|6h980|c8tg0|6h980|c8tg0|64ak0|c8tg0|6u7w0|bxpg0|7iak0|biw40|6u7w0|biw40|7k580|biw40|6u7w0|c8tg0|6h980|dbpg0|5ed80|w5hg0|5nmk0|c8tg0|6h980|dbpg0|5rbw0|bvus0|6h980|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6u7w0|c8tg0|64ak0|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6h980|c8tg0|6h980|cls40|64ak0|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6u7w0|bvus0|6h980|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6h980|c8tg0|6h980|cls40|64ak0|cls40|64ak0|cls40|64ak0|cls40|6h980|c8tg0|6u7w0|bvus0|6h980|cls40|64ak0|cls40|6h980|c8tg0|Infinity'
}, {
    'id': 'America/Curacao',
    'title': 'Curacao',
    'winIndex': 16,
    'offsets': [-4.59638888888889, -4.5, -4],
    'offsetIndices': '012',
    'untils': '-u7lckd|rlo7qd|Infinity'
}, {
    'id': 'America/Danmarkshavn',
    'title': 'Danmarkshavn',
    'winIndex': 41,
    'offsets': [-1.2444444444444445, -3, -2, 0],
    'offsetIndices': '01212121212121212121212121212121213',
    'untils': '-rvusjk|x8nx3k|8zrk0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|53hk0|Infinity'
}, {
    'id': 'America/Dawson',
    'title': 'Dawson',
    'winIndex': 11,
    'offsets': [-9, -8, -7],
    'offsetIndices': '0101011020121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-qzoms0|a2vw0|asys0|882c0|bmiwc0|1tz000|2e180|a7n3w0|9q000|465k00|3e2is0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Dawson_Creek',
    'title': 'Dawson Creek',
    'winIndex': 56,
    'offsets': [-8, -7],
    'offsetIndices': '0101101010101010101010101010101010101010101010101010101011',
    'untils': '-qzopk0|a2vw0|c5jxg0|1tz2s0|2dyg0|tj1g0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|69uk0|Infinity'
}, {
    'id': 'America/Denver',
    'title': 'Denver',
    'winIndex': 15,
    'offsets': [-7, -6],
    'offsetIndices': '01010101011010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0epo0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|2vmk0|ataw40|1tz5k0|2dvo0|a7n9g0|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Detroit',
    'title': 'Detroit',
    'winIndex': 14,
    'offsets': [-5.536388888888889, -6, -5, -4],
    'offsetIndices': '01233232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-xx8dyd|5eraud|dyeyk0|1tzb40|2dq40|1c9440|7x3w0|9rlhg0|71mk0|2vcg40|9cyk0|3lpg0|f4d80|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Edmonton',
    'title': 'Edmonton',
    'winIndex': 15,
    'offsets': [-7.564444444444445, -7, -6],
    'offsetIndices': '01212121212121221212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-x1yazk|629ink|a2vw0|8n6s0|29ek0|h6lg0|9px80|905g0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|9l0g40|1tz5k0|2dvo0|tj1g0|7x3w0|a80840|9cyk0|s36s0|9cyk0|1b6840|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Eirunepe',
    'title': 'Eirunepe',
    'winIndex': 10,
    'offsets': [-4.657777777777778, -5, -4],
    'offsetIndices': '0121212121212121212121212121212121',
    'untils': '-t85f28|99ka68|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|2yy2s0|6h980|7hg2s0|2t2t80|Infinity'
}, {
    'id': 'America/El_Salvador',
    'title': 'El Salvador',
    'winIndex': 67,
    'offsets': [-5.946666666666667, -6, -5],
    'offsetIndices': '012121',
    'untils': '-pkm4tc|ymao5c|7k580|b5xg0|7k580|Infinity'
}, {
    'id': 'America/Fortaleza',
    'title': 'Fortaleza',
    'winIndex': 64,
    'offsets': [-2.566666666666667, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121',
    'untils': '-t85kvc|99kafc|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|cyqs0|5ed80|dbpg0|64ak0|514g40|7k580|biw40|puk0|id6s0|6h980|Infinity'
}, {
    'id': 'America/Glace_Bay',
    'title': 'Glace Bay',
    'winIndex': 36,
    'offsets': [-3.996666666666667, -4, -3],
    'offsetIndices': '012122121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-z94kwc|89fk8c|a2vw0|c5jxg0|1tzdw0|2dnc0|3y8g40|7x3w0|9pa5g0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Godthab',
    'title': 'Godthab',
    'winIndex': 70,
    'offsets': [-3.448888888888889, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-rvumf4|x8nqz4|8zrk0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'America/Goose_Bay',
    'title': 'Goose Bay',
    'winIndex': 36,
    'offsets': [-3.5144444444444445, -2.5144444444444445, -3.5, -2.5, -4, -3, -2],
    'offsetIndices': '010232323232323233232323232323232323232323232323232323232324545454545454545454545454545454545454545454546454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454',
    'untils': '-qzp20k|a2vw0|8kjbw0|kzjyk|7k580|b5xg0|7k580|b5xg0|7k580|biw40|776k0|biw40|7k580|b5xg0|7k580|b5xg0|1pb260|2dly0|biw40|7k580|b5xg0|7k580|b5xg0|7k580|b5xg0|7k580|biw40|7k580|ag040|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|6y2s0|22420|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a2lo|afuk0|8a840|asqg0|7xc80|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8tec|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Grand_Turk',
    'title': 'Grand Turk',
    'winIndex': 16,
    'offsets': [-5.119722222222222, -5, -4],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212122',
    'untils': '-u85og1|z3brw1|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Guatemala',
    'title': 'Guatemala',
    'winIndex': 67,
    'offsets': [-6.0344444444444445, -6, -5],
    'offsetIndices': '0121212121',
    'untils': '-qqqskk|ss0akk|4ofw0|4tidg0|6djw0|3wwas0|8n180|7n5ms0|7x3w0|Infinity'
}, {
    'id': 'America/Guayaquil',
    'title': 'Guayaquil',
    'winIndex': 10,
    'offsets': [-5.233333333333333, -5],
    'offsetIndices': '01',
    'untils': '-kcr84o|Infinity'
}, {
    'id': 'America/Guyana',
    'title': 'Guyana',
    'winIndex': 16,
    'offsets': [-3.8777777777777778, -3.75, -3, -4],
    'offsetIndices': '01123',
    'untils': '-smcak8|qqnjn8|4sh9c0|81rf90|Infinity'
}, {
    'id': 'America/Halifax',
    'title': 'Halifax',
    'winIndex': 36,
    'offsets': [-4.24, -4, -3],
    'offsetIndices': '0121212121212121212121212121212121212121212121212122121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-z94k80|777go0|9et80|st9o0|a2vw0|ssyk0|5rbw0|cv1g0|69uk0|c6ys0|6kyk0|ci2s0|67zw0|ci2s0|6w2k0|bu040|7lzw0|bu040|66580|bu040|7lzw0|bu040|64ak0|cls40|5v180|cv1g0|6j3w0|c6ys0|79180|b42s0|7lzw0|b42s0|7yyk0|bu040|64ak0|dbpg0|66580|cls40|5ed80|bu040|7lzw0|b42s0|7lzw0|cjxg0|66580|bh1g0|7lzw0|b42s0|7lzw0|6uj00|1tzdw0|2dnc0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|tw040|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|tw040|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|1cm2s0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Havana',
    'title': 'Havana',
    'winIndex': 14,
    'offsets': [-5.493333333333334, -5, -4],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-n7762o|1icfyo|69uk0|62s040|4ofw0|e1ms0|51ek0|e1ms0|4ofw0|1fhs40|4ofw0|e1ms0|4ofw0|9s9k40|67zw0|cedg0|6h980|9o840|7yyk0|b5xg0|7k580|bvus0|9cyk0|9d440|9cyk0|9d440|9px80|9d440|8a2k0|ag040|8bx80|ae5g0|8drw0|acas0|9cyk0|9d440|9px80|905g0|9px80|9q2s0|7x3w0|8a840|ast80|7x9g0|ast80|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|8a2k0|ag040|8a2k0|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|905g0|a2vw0|905g0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9d1c0|9d1c0|9q000|8n400|asw00|7x6o0|b5uo0|7x6o0|asw00|7x6o0|asw00|8a5c0|afxc0|8a5c0|afxc0|7x6o0|1cm000|6uao0|bvs00|779c0|bitc0|6uao0|bvs00|779c0|bvs00|779c0|c8qo0|779c0|b5uo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|Infinity'
}, {
    'id': 'America/Hermosillo',
    'title': 'Hermosillo',
    'winIndex': 56,
    'offsets': [-7.397777777777778, -7, -6, -8],
    'offsetIndices': '0121212131212121',
    'untils': '-p1u4k0|2u7jw0|1sgdc0|8n400|7thc0|9eys0|591h80|3ie2s0|axvpg0|dpgw40|afuk0|8a840|afuk0|8a840|afuk0|Infinity'
}, {
    'id': 'America/Indiana/Indianapolis',
    'title': 'Indianapolis',
    'winIndex': 12
}, {
    'id': 'America/Indiana/Knox',
    'title': 'Knox',
    'winIndex': 13,
    'offsets': [-6, -5],
    'offsetIndices': '0101011010101010101010101010101010101010101010101010101010101010101010101010101010101010111010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|tj1g0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|9px80|9d440|9cyk0|9d440|7x3w0|asys0|7x3w0|asys0|9cyk0|9d440|9px80|9d440|9cyk0|9d440|s3180|1twas0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|7j5400|asw00|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Indiana/Marengo',
    'title': 'Marengo',
    'winIndex': 12,
    'offsets': [-6, -5, -4],
    'offsetIndices': '0101011010101010101010101212121212111212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|2wsas0|7x3w0|1c9440|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|465h80|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4g00|64dc0|clmk0|fvt9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Indiana/Petersburg',
    'title': 'Petersburg',
    'winIndex': 14,
    'offsets': [-6, -5, -4],
    'offsetIndices': '01010110101010101010101010101010101010101010101010111011212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|501ek0|7kas0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|sfzw0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|eu02o0|asw00|6udg0|c8nw0|6hc00|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Indiana/Tell_City',
    'title': 'Tell City',
    'winIndex': 13,
    'offsets': [-6, -5, -4],
    'offsetIndices': '01010110101010101010101010101010121211010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|asys0|7x3w0|3fidg0|7x3w0|asys0|7x3w0|b5rw0|7kas0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|9px80|9d440|7k580|b5xg0|9cyk0|9d440|9cyk0|9d440|2lz980|9cyk0|9d440|9cyk0|ihslg0|asw00|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Indiana/Vevay',
    'title': 'Vevay',
    'winIndex': 12,
    'offsets': [-6, -5, -4],
    'offsetIndices': '010101101212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|4gyis0|7txx80|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|hfzhg0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Indiana/Vincennes',
    'title': 'Vincennes',
    'winIndex': 14,
    'offsets': [-6, -5, -4],
    'offsetIndices': '01010110101010101010101010101010121211011212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|asys0|7x3w0|3fidg0|7x3w0|asys0|7x3w0|b5rw0|7kas0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|9px80|9d440|7k580|b5xg0|9cyk0|9d440|9cyk0|9d440|2lz980|9cyk0|9d440|9cyk0|ihslg0|asw00|6udg0|c8nw0|6hc00|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Indiana/Winamac',
    'title': 'Winamac',
    'winIndex': 14,
    'offsets': [-6, -5, -4],
    'offsetIndices': '01010110101010101010101010101010101010121211021212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|9px80|9d440|9cyk0|9d440|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|465h80|9cyk0|9d440|9cyk0|ihslg0|asw00|6udg0|c8l40|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Inuvik',
    'title': 'Inuvik',
    'winIndex': 15,
    'offsets': [0, -8, -6, -7],
    'offsetIndices': '0121323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323',
    'untils': '-8ve5c0|6fce80|9q000|71i2w0|ipzw0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Iqaluit',
    'title': 'Iqaluit',
    'winIndex': 14,
    'offsets': [0, -4, -5, -3, -6],
    'offsetIndices': '01123212121212121212121212121212121212121212142212121212121212121212121212121212121212121212121212121212121212121212121212',
    'untils': '-eb6ao0|1l3h80|2dq40|a7n3w0|9q000|7k85k0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7xc80|ast80|7x6o0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Jamaica',
    'title': 'Jamaica',
    'winIndex': 10,
    'offsets': [-5.119722222222222, -5, -4],
    'offsetIndices': '0121212121212121212121',
    'untils': '-u85og1|wbl181|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|Infinity'
}, {
    'id': 'America/Juneau',
    'title': 'Juneau',
    'winIndex': 55,
    'offsets': [-8, -7, -9],
    'offsetIndices': '01101010101010101010101010001010122020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202',
    'untils': '-ek1w80|1tz2s0|2dyg0|cawis0|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9d1c0|9d1c0|9cyk0|9d440|9px80|905g0|9px80|1leo0|7rs80|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Kentucky/Louisville',
    'title': 'Louisville',
    'winIndex': 14,
    'offsets': [-6, -5, -4],
    'offsetIndices': '0101010101101010101010101010101010101121212121212111212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0esg0|ast80|7x9g0|ast80|sg5g0|6bp80|a98o40|7x3w0|6w840|1tz8c0|2dsw0|4s580|7tk40|gxc40|1s3bw0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|4bh80|3j3xc0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4g00|64dc0|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Kentucky/Monticello',
    'title': 'Monticello',
    'winIndex': 14,
    'offsets': [-6, -5, -4],
    'offsetIndices': '0101011010101010101010101010101010101010101010101010101010101010101010101121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|bs6g40|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x6o0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/La_Paz',
    'title': 'La Paz',
    'winIndex': 16,
    'offsets': [-4.543333333333334, -3.5433333333333334, -4],
    'offsetIndices': '012',
    'untils': '-jxzspo|84ik0|Infinity'
}, {
    'id': 'America/Lima',
    'title': 'Lima',
    'winIndex': 10,
    'offsets': [-5.1433333333333335, -5, -4],
    'offsetIndices': '0121212121212121',
    'untils': '-w25lpo|fcxjlo|4ml80|93us0|9cyk0|9d440|9cyk0|nw16s0|4ml80|e5c40|4ml80|1fr1g0|4ml80|1yiys0|4ml80|Infinity'
}, {
    'id': 'America/Los_Angeles',
    'title': 'Los Angeles',
    'winIndex': 11,
    'offsets': [-8, -7],
    'offsetIndices': '010101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0emw0|ast80|7x9g0|ast80|bmtus0|1tz2s0|2dyg0|1a3c40|f2ik0|owdg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Maceio',
    'title': 'Maceio',
    'winIndex': 64,
    'offsets': [-2.381111111111111, -3, -2],
    'offsetIndices': '012121212121212121212121212121212121212121',
    'untils': '-t85ldw|99kaxw|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|cyqs0|5ed80|dbpg0|64ak0|2yl440|64ak0|1wf1g0|7k580|biw40|puk0|id6s0|6h980|Infinity'
}, {
    'id': 'America/Managua',
    'title': 'Managua',
    'winIndex': 67,
    'offsets': [-5.753333333333333, -6, -5],
    'offsetIndices': '0121212121212121',
    'untils': '-ijh6oo|ka1i0o|xqqk0|24p6s0|53980|dmtg0|53980|60itw0|dq240|53es0|235h80|4beis0|8zzw0|at4c0|7x140|Infinity'
}, {
    'id': 'America/Manaus',
    'title': 'Manaus',
    'winIndex': 16,
    'offsets': [-4.001111111111111, -4, -3],
    'offsetIndices': '01212121212121212121212121212121',
    'untils': '-t85gvw|99k97w|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|2yy2s0|6h980|Infinity'
}, {
    'id': 'America/Martinique',
    'title': 'Martinique',
    'winIndex': 16,
    'offsets': [-4.072222222222222, -4, -3],
    'offsetIndices': '0121',
    'untils': '-umcvcs|zz5x4s|8zzw0|Infinity'
}, {
    'id': 'America/Matamoros',
    'title': 'Matamoros',
    'winIndex': 13,
    'offsets': [-6.666666666666667, -6, -5],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-p1u7c0|ykt480|ast80|3vppg0|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|9q2s0|7k580|9q2s0|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|77c40|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Mazatlan',
    'title': 'Mazatlan',
    'winIndex': 46,
    'offsets': [-7.094444444444445, -7, -6, -8],
    'offsetIndices': '0121212131212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-p1u4k0|2u7jw0|1sgdc0|8n400|7thc0|9eys0|591h80|3ie2s0|axvpg0|dpgw40|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|9q2s0|7k580|9q2s0|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|Infinity'
}, {
    'id': 'America/Menominee',
    'title': 'Menominee',
    'winIndex': 13,
    'offsets': [-6, -5],
    'offsetIndices': '01010110101011010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|asys0|7x3w0|a7n9g0|9px80|1at9g0|2396k0|9d1c0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Merida',
    'title': 'Merida',
    'winIndex': 47,
    'offsets': [-5.974444444444444, -6, -5],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-p1u7c0|vauo00|hoyk0|6ys0c0|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|9q2s0|7k580|9q2s0|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|Infinity'
}, {
    'id': 'America/Mexico_City',
    'title': 'Mexico City',
    'winIndex': 47,
    'offsets': [-6.61, -7, -6, -5],
    'offsetIndices': '012121232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-p1u4k0|2u7jw0|1sgdc0|8n400|7thc0|9eys0|3knek0|776k0|rf440|5t6k0|1evk40|71mk0|30p1g0|8n180|nufxo0|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|9q2s0|7k580|9q2s0|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|Infinity'
}, {
    'id': 'America/Moncton',
    'title': 'Moncton',
    'winIndex': 36,
    'offsets': [-5, -4, -3],
    'offsetIndices': '012121212121212121212122121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-z94i40|89fhg0|a2vw0|7mqqo0|4ofw0|e1ms0|4ofw0|e1ms0|4ofw0|e1ms0|4ofw0|e1ms0|4ofw0|e1ms0|4ofw0|dmtg0|64ak0|cao40|6fek0|bkqs0|7iak0|6y5k0|1tzdw0|2dnc0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|s36s0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a2lo|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6uiyc|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Monterrey',
    'title': 'Monterrey',
    'winIndex': 47,
    'offsets': [-6.687777777777778, -6, -5],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-p1u7c0|ykt480|ast80|3vppg0|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|9q2s0|7k580|9q2s0|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|Infinity'
}, {
    'id': 'America/Montevideo',
    'title': 'Montevideo',
    'winIndex': 71,
    'offsets': [-3.7455555555555553, -3.5, -3, -2, -2.5],
    'offsetIndices': '012121212121212121212121213232323232324242423243232323232323232323232323232323232323232',
    'untils': '-px809g|1s8xzg|9czy0|9exe0|9czy0|9exe0|9czy0|3ydyq0|7x5a0|asxe0|7x5a0|asxe0|7x5a0|b5w20|7k6m0|b5w20|7k6m0|b5w20|7k6m0|b5w20|7x5a0|asxe0|7x5a0|6do20|7vam0|humq0|4mju0|8g9s40|8zzw0|38qs0|2inw0|2nf9g0|8zzw0|9q2s0|aunw0|7ves0|awik0|ar440|9pym0|91yq0|9pym0|91yq0|9pym0|q6mq0|5t6k0|tfc40|erfy0|xdta0|m2is0|62fw0|s6w40|ayd80|3z5s40|4ofw0|dzs40|4ofw0|bvus0|6h980|bvus0|6u7w0|c8tg0|6h980|bvus0|6u7w0|614qs0|9q2s0|a31g0|7x3w0|ag040|8a2k0|asys0|7x3w0|asys0|7x3w0|asys0|8a2k0|ag040|8a2k0|ag040|8a2k0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|Infinity'
}, {
    'id': 'America/Montreal',
    'title': 'Montreal',
    'winIndex': 14,
    'link': 326
}, {
    'id': 'America/Nassau',
    'title': 'Nassau',
    'winIndex': 14,
    'offsets': [-5.158333333333333, -5, -4],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-u6m4c6|r7u7s6|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/New_York',
    'title': 'New York',
    'winIndex': 14,
    'offsets': [-5, -4],
    'offsetIndices': '01010101010101010101010101010101010101010101010101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0ev80|ast80|7x9g0|ast80|7x9g0|b5rw0|905g0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|6w840|1tzb40|2dq40|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Nipigon',
    'title': 'Nipigon',
    'winIndex': 14,
    'offsets': [-5, -4],
    'offsetIndices': '010111010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-qzoxw0|a2vw0|bfxjw0|pmdk0|1tzb40|2dq40|ewvus0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Nome',
    'title': 'Nome',
    'winIndex': 55,
    'offsets': [-11, -10, -9, -8],
    'offsetIndices': '011001010101010101010101010101010122323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-ek1nw0|1tyug0|2e6s0|b7yik0|12y080|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|1l6c0|7rs80|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Noronha',
    'title': 'Noronha',
    'winIndex': 34,
    'offsets': [-2.161111111111111, -2, -1],
    'offsetIndices': '0121212121212121212121212121212121212121',
    'untils': '-t85lzw|99k8rw|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|cyqs0|5ed80|dbpg0|64ak0|514g40|7k580|biw40|cvw0|iq5g0|6h980|Infinity'
}, {
    'id': 'America/North_Dakota/Beulah',
    'title': 'Beulah',
    'winIndex': 13,
    'offsets': [-7, -6, -5],
    'offsetIndices': '010101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011212121212121212121212121212121212121212121212121212121',
    'untils': '-r0epo0|ast80|7x9g0|ast80|bmtus0|1tz5k0|2dvo0|b9gdg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hc00|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/North_Dakota/Center',
    'title': 'Center',
    'winIndex': 13,
    'offsets': [-7, -6, -5],
    'offsetIndices': '010101101010101010101010101010101010101010101010101010101011212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0epo0|ast80|7x9g0|ast80|bmtus0|1tz5k0|2dvo0|b9gdg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a5c0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/North_Dakota/New_Salem',
    'title': 'New Salem',
    'winIndex': 13,
    'offsets': [-7, -6, -5],
    'offsetIndices': '010101101010101010101010101010101010101010101010101010101010101010101010101010101121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r0epo0|ast80|7x9g0|ast80|bmtus0|1tz5k0|2dvo0|b9gdg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a5c0|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Ojinaga',
    'title': 'Ojinaga',
    'winIndex': 15,
    'offsets': [-6.961111111111111, -7, -6, -5],
    'offsetIndices': '0121212323221212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-p1u4k0|2u7jw0|1sgdc0|8n400|7thc0|9eys0|xes2s0|afuk0|8a840|afuk0|8aaw0|afuk0|8a840|ast80|7x9g0|ast80|9q2s0|7k580|9q2s0|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|77c40|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Panama',
    'title': 'Panama',
    'winIndex': 10,
    'offsets': [-5.326666666666667, -5],
    'offsetIndices': '01',
    'untils': '-w757vc|Infinity'
}, {
    'id': 'America/Pangnirtung',
    'title': 'Pangnirtung',
    'winIndex': 14,
    'offsets': [0, -4, -3, -2, -5, -6],
    'offsetIndices': '012213121212121212121212121212121212114141414154414141414141414141414141414141414141414141414141414141414141414141414141414',
    'untils': '-pkmlc0|b0ke00|1tzdw0|2dnc0|a7n3w0|9q000|7k85k0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|asw00|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7xc80|ast80|7x6o0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Paramaribo',
    'title': 'Paramaribo',
    'winIndex': 64,
    'offsets': [-3.6777777777777776, -3.6811111111111114, -3.6766666666666667, -3.5, -3],
    'offsetIndices': '012334',
    'untils': '-usj4g8|cixc0c|5lydbk|fq7bic|4mkao0|Infinity'
}, {
    'id': 'America/Phoenix',
    'title': 'Phoenix',
    'winIndex': 56,
    'offsets': [-7, -6],
    'offsetIndices': '01010101010',
    'untils': '-r0epo0|ast80|7x9g0|ast80|bmtus0|zjedo|4olg0|9et80|bs6lmc|9cyk0|Infinity'
}, {
    'id': 'America/Port_of_Spain',
    'title': 'Port of Spain',
    'winIndex': 16,
    'offsets': [-4.101111111111111, -4],
    'offsetIndices': '01',
    'untils': '-u6m79w|Infinity'
}, {
    'id': 'America/Port-au-Prince',
    'title': 'Port-au-Prince',
    'winIndex': 14,
    'offsets': [-4.816666666666666, -5, -4],
    'offsetIndices': '01212121212121212121212121212121212121212121',
    'untils': '-rmk9ac|ylcf6c|8zzw0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8aaw0|asw00|7x6o0|asw00|7x6o0|asw00|8a5c0|afxc0|8a5c0|afxc0|8a5c0|asw00|7x6o0|asw00|7x6o0|asw00|8a5c0|afxc0|8a5c0|afxc0|3vpjw0|ast80|7x9g0|ast80|2stv00|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Porto_Velho',
    'title': 'Porto Velho',
    'winIndex': 16,
    'offsets': [-4.26, -4, -3],
    'offsetIndices': '012121212121212121212121212121',
    'untils': '-t85g60|99k8i0|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|Infinity'
}, {
    'id': 'America/Puerto_Rico',
    'title': 'Puerto Rico',
    'winIndex': 16,
    'offsets': [-4, -3],
    'offsetIndices': '0110',
    'untils': '-efsnk0|1ppu40|2dnc0|Infinity'
}, {
    'id': 'America/Rainy_River',
    'title': 'Rainy River',
    'winIndex': 13,
    'offsets': [-6, -5],
    'offsetIndices': '010111010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-qzov40|a2vw0|bfxjw0|pmdk0|1tz8c0|2dsw0|ewvus0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Rankin_Inlet',
    'title': 'Rankin Inlet',
    'winIndex': 13,
    'offsets': [0, -6, -4, -5],
    'offsetIndices': '012131313131313131313131313131313131313131313331313131313131313131313131313131313131313131313131313131313131313131313131',
    'untils': '-6s8lc0|4c6oo0|9q000|7k85k0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Recife',
    'title': 'Recife',
    'winIndex': 64,
    'offsets': [-2.3266666666666667, -3, -2],
    'offsetIndices': '0121212121212121212121212121212121212121',
    'untils': '-t85ljc|99kb3c|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|cyqs0|5ed80|dbpg0|64ak0|514g40|7k580|biw40|cvw0|iq5g0|6h980|Infinity'
}, {
    'id': 'America/Regina',
    'title': 'Regina',
    'winIndex': 37,
    'offsets': [-6.9766666666666675, -7, -6],
    'offsetIndices': '012121212121212121212121221212121212121212121212121212',
    'untils': '-xkq9yc|6l1hmc|a2vw0|60enw0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|1b6840|9cyk0|9d440|8zzw0|9q2s0|9cyk0|9q2s0|9cyk0|9d440|9cyk0|66gc0|1tz5k0|2dvo0|a31g0|9cyk0|a31g0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|tj1g0|9cyk0|9d440|Infinity'
}, {
    'id': 'America/Resolute',
    'title': 'Resolute',
    'winIndex': 13,
    'offsets': [0, -6, -4, -5],
    'offsetIndices': '012131313131313131313131313131313131313131313331313131313331313131313131313131313131313131313131313131313131313131313131',
    'untils': '-bnp9c0|97nco0|9q000|7k85k0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Rio_Branco',
    'title': 'Rio Branco',
    'winIndex': 10,
    'offsets': [-4.52, -5, -4],
    'offsetIndices': '01212121212121212121212121212121',
    'untils': '-t85fg0|99kak0|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|amves0|2t2t80|Infinity'
}, {
    'id': 'America/Santa_Isabel',
    'title': 'Santa Isabel',
    'winIndex': 72,
    'link': 325
}, {
    'id': 'America/Santarem',
    'title': 'Santarem',
    'winIndex': 64,
    'offsets': [-3.646666666666667, -4, -3],
    'offsetIndices': '0121212121212121212121212121212',
    'untils': '-t85hvc|99ka7c|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5mf440|49mk0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|amves0|Infinity'
}, {
    'id': 'America/Santiago',
    'title': 'Santiago',
    'winIndex': 39,
    'offsets': [-4.712777777777777, -5, -4, -3],
    'offsetIndices': '010202121212121212321232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323',
    'untils': '-vauawq|3dlssq|157b7a|f4e0q|49hzba|aye0q|7ves0|awik0|7ves0|awik0|7ves0|awik0|7ves0|ayd80|7ves0|534ik0|351g0|229zw0|2gt80|awo40|2mg00|b73400|7k580|c8tg0|6h980|a31g0|7x3w0|asys0|7x3w0|b5xg0|7k580|ag040|8a2k0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7k580|b5xg0|9cyk0|9d440|7x3w0|asys0|7x3w0|b5xg0|7k580|9q2s0|8zzw0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|8n180|a31g0|7x3w0|a31g0|9px80|9q2s0|7x3w0|b5xg0|7k580|b5xg0|7k580|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|8n180|a31g0|7x3w0|asys0|8zzw0|9q2s0|ast80|5eis0|cyl80|6hes0|c8nw0|6udg0|bvp80|6udg0|vonw0|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|51k40|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|51k40|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|51k40|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|Infinity'
}, {
    'id': 'America/Santo_Domingo',
    'title': 'Santo Domingo',
    'winIndex': 16,
    'offsets': [-4.666666666666667, -5, -4, -4.5],
    'offsetIndices': '01213131313131212',
    'untils': '-j6hz1c|hiw29c|67zw0|1dy840|62ha0|cnle0|4h2m0|elyq0|47ta0|ei9e0|4bim0|eek20|4dda0|ecpe0|dkmtg0|1stc0|Infinity'
}, {
    'id': 'America/Sao_Paulo',
    'title': 'Sao Paulo',
    'winIndex': 35,
    'offsets': [-3.1077777777777778, -3, -2],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212',
    'untils': '-t85jd8|99k8x8|9a9c0|9io40|99980|8p65g0|6zuo0|bs2o0|67zw0|cjxg0|69uk0|cjxg0|4ml80|5k02s0|6onw0|haas0|316k0|cls40|4ml80|cls40|66580|cls40|67zw0|981s40|6u7w0|biw40|5rbw0|d0lg0|5ed80|cyqs0|5ed80|dbpg0|64ak0|cyqs0|64ak0|cls40|5rbw0|dbpg0|51ek0|dbpg0|6h980|c8tg0|6h980|c8tg0|64ak0|c8tg0|6u7w0|bxpg0|7iak0|biw40|6u7w0|biw40|7k580|biw40|6u7w0|c8tg0|6h980|dbpg0|5ed80|cls40|64ak0|dfes0|5nmk0|c8tg0|6h980|dbpg0|5rbw0|bvus0|6h980|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6u7w0|c8tg0|64ak0|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6h980|c8tg0|6h980|cls40|64ak0|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6u7w0|bvus0|6h980|cls40|64ak0|cls40|6h980|c8tg0|6h980|c8tg0|6h980|c8tg0|6h980|cls40|64ak0|cls40|64ak0|cls40|64ak0|cls40|6h980|c8tg0|6u7w0|bvus0|6h980|cls40|64ak0|cls40|6h980|c8tg0|Infinity'
}, {
    'id': 'America/Scoresbysund',
    'title': 'Scoresbysund',
    'winIndex': 73,
    'offsets': [-1.4644444444444444, -2, -1, 0],
    'offsetIndices': '0121323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-rvurxk|x8ntpk|902o0|9cvs0|9cyk0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'America/Sitka',
    'title': 'Sitka',
    'winIndex': 55,
    'offsets': [-8, -7, -9],
    'offsetIndices': '01101010101010101010101010101010122020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202',
    'untils': '-ek1w80|1tz2s0|2dyg0|cawis0|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|1leo0|7rs80|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/St_Johns',
    'title': 'St Johns',
    'winIndex': 38,
    'offsets': [-3.5144444444444445, -2.5144444444444445, -3.5, -2.5, -1.5],
    'offsetIndices': '01010101010101010101010101010101010102323232323232323323232323232323232323232323232323232323232323232323232323232323232323232323232323232324232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-ris3ck|8bx80|ar440|a2vw0|9tjs0|53980|dkys0|9cyk0|9d440|9cyk0|9q2s0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|9q2s0|9cyk0|9d440|9cyk0|9q2s0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|9q2s0|9cyk0|9q2s0|8zzw0|9q2s0|8zzw0|7tmw0|1wfuk|8zzw0|a3480|7k580|b5xg0|7k580|b5xg0|7k580|biw40|776k0|biw40|7k580|b5xg0|7k580|b5xg0|1pb260|2dly0|biw40|7k580|b5xg0|7k580|b5xg0|7k580|b5xg0|7k580|biw40|7k580|ag040|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a2lo|afuk0|8a840|asqg0|7xc80|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8tec|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Swift_Current',
    'title': 'Swift Current',
    'winIndex': 37,
    'offsets': [-7.188888888888888, -7, -6],
    'offsetIndices': '012122121212121212121212',
    'untils': '-xkq9d4|6l1h14|a2vw0|c5jxg0|1tz5k0|2dvo0|asys0|8n180|a31g0|7x3w0|asys0|7x3w0|asys0|7x3w0|3yles0|9cyk0|s36s0|9cyk0|9d440|7x3w0|b5xg0|7k580|5j4lg0|Infinity'
}, {
    'id': 'America/Tegucigalpa',
    'title': 'Tegucigalpa',
    'winIndex': 67,
    'offsets': [-5.814444444444445, -6, -5],
    'offsetIndices': '01212121',
    'untils': '-pfzh6k|yho0ik|7k580|b5xg0|7k580|96x1g0|4qak0|Infinity'
}, {
    'id': 'America/Thule',
    'title': 'Thule',
    'winIndex': 36,
    'offsets': [-4.585555555555556, -4, -3],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-rvuj9g|12yzilg|9cyk0|9d440|9cyk0|9q2s0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Thunder_Bay',
    'title': 'Thunder Bay',
    'winIndex': 14,
    'offsets': [-6, -5, -4],
    'offsetIndices': '0122121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-vbavc0|gr8qs0|1tzb40|2dq40|ctmlg0|9cyk0|9d440|9px80|9d440|9cyk0|s36s0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Tijuana',
    'title': 'Tijuana',
    'winIndex': 11,
    'offsets': [-7.801111111111111, -7, -8],
    'offsetIndices': '012121211212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212',
    'untils': '-p1u1s0|11jrw0|1sns00|1sgdc0|71s40|9cyk0|5iidg0|1q6700|4lfk0|190g40|eluk0|2r4r00|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|84qys0|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|77c40|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Toronto',
    'title': 'Toronto',
    'winIndex': 14,
    'offsets': [-5, -4],
    'offsetIndices': '01010101010101010101010101010101010101010101011101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-qzoxw0|a2vw0|7yx60|aqzy0|9q8c0|7jzo0|bw0c0|6bp80|cedg0|6h980|c8tg0|6h980|bvus0|776k0|biw40|776k0|biw40|776k0|biw40|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|xjeo0|1tzb40|2dq40|asys0|7x3w0|ast80|7x3w0|asys0|7x3w0|asys0|b5rw0|7xf00|ast80|7x9g0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Vancouver',
    'title': 'Vancouver',
    'winIndex': 11,
    'offsets': [-8, -7],
    'offsetIndices': '0101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-qzopk0|a2vw0|c5jxg0|1tz2s0|2dyg0|asys0|8n180|a31g0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Whitehorse',
    'title': 'Whitehorse',
    'winIndex': 11,
    'offsets': [-9, -8, -7],
    'offsetIndices': '0101011020121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-qzoms0|a2vw0|asys0|882c0|bmiwc0|1tz000|2e180|a7n3w0|9q000|tiyo0|6qp440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Winnipeg',
    'title': 'Winnipeg',
    'winIndex': 13,
    'offsets': [-6, -5],
    'offsetIndices': '010101011010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-s0s7c0|7k580|tj700|a2vw0|9ok840|6u7w0|2a5hg0|1tz8c0|2dsw0|biw40|7x3w0|a31g0|7x3w0|asys0|7x3w0|asys0|7x3w0|b7s40|7tek0|autg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|9cyk0|9d440|7x3w0|1cm2s0|7k580|1cm2s0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|902o0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|902o0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|8a5c0|afxc0|8a5c0|asw00|7x6o0|asw00|7x6o0|asw00|8a5c0|afxc0|8a5c0|afxc0|8a5c0|asw00|7x6o0|asw00|7x6o0|asw00|8a5c0|afxc0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|asw00|7x6o0|asw00|7x6o0|asw00|8a5c0|afxc0|8a5c0|afxc0|8a5c0|asw00|7x6o0|asw00|7x6o0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Yakutat',
    'title': 'Yakutat',
    'winIndex': 55,
    'offsets': [-9, -8],
    'offsetIndices': '01101010101010101010101010101010100101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-ek1tg0|1tz000|2e180|cawis0|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|1lbw0|7rs80|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'America/Yellowknife',
    'title': 'Yellowknife',
    'winIndex': 15,
    'offsets': [0, -7, -6, -5],
    'offsetIndices': '012213121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-i9m2o0|3pk3o0|1tz5k0|2dvo0|a7n3w0|9q000|7k85k0|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'Antarctica/Casey',
    'title': 'Casey',
    'winIndex': 33,
    'offsets': [0, 8, 11],
    'offsetIndices': '012121',
    'untils': '-irxc0|lag4o0|73bo0|uz1o0|60l80|Infinity'
}, {
    'id': 'Antarctica/Davis',
    'title': 'Davis',
    'winIndex': 6,
    'offsets': [0, 7, 5],
    'offsetIndices': '01012121',
    'untils': '-6rmdc0|42jdw0|27wgs0|l8uss0|7eqs0|unmk0|60qs0|Infinity'
}, {
    'id': 'Antarctica/DumontDUrville',
    'title': 'DumontDUrville',
    'winIndex': 50,
    'offsets': [0, 10],
    'offsetIndices': '0101',
    'untils': '-c05eo0|2mks80|2i72g0|Infinity'
}, {
    'id': 'Antarctica/Macquarie',
    'title': 'Macquarie',
    'winIndex': 48,
    'offsets': [10, 11, 0],
    'offsetIndices': '0102010101010101010101010101010101010101010101010101010101010101010101010101010101010101011',
    'untils': '-rsj4w0|8zzw0|11wqk0|f4kh40|a6p8g0|9d1c0|asw00|6uao0|bvs00|6uao0|bvs00|779c0|bvs00|64dc0|clpc0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|7x6o0|b5uo0|7k800|b5uo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|bvs00|7k800|bitc0|7k800|bitc0|779c0|bitc0|779c0|bitc0|7x6o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|7x6o0|asw00|a2yo0|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9d1c0|902o0|a2yo0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|Infinity'
}, {
    'id': 'Antarctica/Mawson',
    'title': 'Mawson',
    'winIndex': 17,
    'offsets': [0, 6, 5],
    'offsetIndices': '012',
    'untils': '-8aelc0|t22y80|Infinity'
}, {
    'id': 'Antarctica/Palmer',
    'title': 'Palmer',
    'winIndex': 39,
    'offsets': [0, -3, -4, -2],
    'offsetIndices': '0121212121213121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-2lxhc0|31ho0|bqas0|71mk0|bqas0|8ovw0|9d440|9px80|9d440|9cyk0|9d440|28t6k0|51ek0|46b6s0|8c2s0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|7k580|b5xg0|9cyk0|9d440|7x3w0|asys0|7x3w0|b5xg0|7k580|9q2s0|8zzw0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|8n180|a31g0|7x3w0|a31g0|9px80|9q2s0|7x3w0|b5xg0|7k580|b5xg0|7k580|b5xg0|7k580|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7k580|b5xg0|8n180|a31g0|7x3w0|asys0|8zzw0|9q2s0|ast80|5eis0|cyl80|6hes0|c8nw0|6udg0|bvp80|6udg0|vonw0|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|51k40|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|51k40|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|51k40|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|e1h80|4olg0|Infinity'
}, {
    'id': 'Antarctica/Rothera',
    'title': 'Rothera',
    'winIndex': 64,
    'offsets': [0, -3],
    'offsetIndices': '01',
    'untils': '3lxs00|Infinity'
}, {
    'id': 'Antarctica/Syowa',
    'title': 'Syowa',
    'winIndex': 1,
    'offsets': [0, 3],
    'offsetIndices': '01',
    'untils': '-6qsqo0|Infinity'
}, {
    'id': 'Antarctica/Vostok',
    'title': 'Vostok',
    'winIndex': 21,
    'offsets': [0, 6],
    'offsetIndices': '01',
    'untils': '-6aaao0|Infinity'
}, {
    'id': 'Asia/Almaty',
    'title': 'Almaty',
    'winIndex': 21,
    'offsets': [5.13, 5, 6, 7],
    'offsetIndices': '012323232323232323232321232323232323232323232323232',
    'untils': '-nu1a90|37a0d0|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|iq5g0|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|Infinity'
}, {
    'id': 'Asia/Amman',
    'title': 'Amman',
    'winIndex': 74,
    'offsets': [2.395555555555555, 2, 3],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-kcrtbk|m566fk|60l80|awo40|7v980|awo40|7v980|ayis0|9gnw0|9b9g0|7v980|autg0|7v980|3e6840|9et80|9io40|9cyk0|9d440|9cyk0|9d440|9px80|ayis0|7rjw0|ag040|8a2k0|9zc40|8drw0|a31g0|8zzw0|9d440|9cyk0|9d440|8n180|ag040|8a5c0|afxc0|8n400|a2yo0|8n400|a2yo0|8n400|epmo0|4deo0|9o5c0|9ew00|9b6o0|9ew00|9d1c0|9d1c0|9d1c0|asw00|7x6o0|afxc0|8n400|9d1c0|9d1c0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|wel80|51k40|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|Infinity'
}, {
    'id': 'Asia/Anadyr',
    'title': 'Anadyr',
    'winIndex': 75,
    'offsets': [11.83222222222222, 12, 13, 14, 11],
    'offsetIndices': '01232212121212121212121141212121212121212121212121212121212121141',
    'untils': '-nu1sv8|379zj8|qi27w0|9et80|9d440|9ew00|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5xg0|7k800|Infinity'
}, {
    'id': 'Asia/Aqtau',
    'title': 'Aqtau',
    'winIndex': 17,
    'offsets': [3.351111111111111, 4, 5, 6],
    'offsetIndices': '012323232323232323232123232312121212121212121212',
    'untils': '-nu15b4|379y74|qrh3w0|iruk0|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|iq5g0|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|Infinity'
}, {
    'id': 'Asia/Aqtobe',
    'title': 'Aqtobe',
    'winIndex': 17,
    'offsets': [3.811111111111111, 4, 5, 6],
    'offsetIndices': '0123232323232323232321232323232323232323232323232',
    'untils': '-nu16l4|379zh4|qi27w0|s6qk0|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|iq5g0|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|Infinity'
}, {
    'id': 'Asia/Ashgabat',
    'title': 'Ashgabat',
    'winIndex': 17,
    'offsets': [3.8922222222222222, 4, 5, 6],
    'offsetIndices': '012323232323232323232322112',
    'untils': '-nu16t8|379zp8|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|1fp40|4bpk0|Infinity'
}, {
    'id': 'Asia/Baghdad',
    'title': 'Baghdad',
    'winIndex': 76,
    'offsets': [2.96, 3, 4],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121',
    'untils': '-r50g80|xkn3w0|7v980|9b9g0|9gnw0|9eys0|9et80|9d440|9b9g0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9f1k0|9ew00|9ew00|9ew00|9d1c0|9ew00|9d1c0|9ew00|9d1c0|9ew00|9ew00|9ew00|9d1c0|9ew00|9d1c0|9ew00|9d1c0|9ew00|9ew00|9ew00|9d1c0|9ew00|9d1c0|9ew00|9d1c0|9ew00|9ew00|9ew00|9d1c0|9ew00|9d1c0|9ew00|9d1c0|9ew00|Infinity'
}, {
    'id': 'Asia/Baku',
    'title': 'Baku',
    'winIndex': 77,
    'offsets': [3.3233333333333333, 3, 4, 5],
    'offsetIndices': '01232323232323232323232221223232323232323232323232323232323232323232',
    'untils': '-nu158c|h4tkwc|ckinw0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|7tbs0|1jsc0|9d1c0|9cq80|1twoo0|asw00|7x3w0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Asia/Bangkok',
    'title': 'Bangkok',
    'winIndex': 6,
    'offsets': [6.7011111111111115, 7],
    'offsetIndices': '01',
    'untils': '-pysda4|Infinity'
}, {
    'id': 'Asia/Beirut',
    'title': 'Beirut',
    'winIndex': 78,
    'offsets': [2, 3],
    'offsetIndices': '010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-pyzew0|aunw0|88dg0|9et80|8yas0|a2vw0|a31g0|7k580|hjqo40|7v980|awo40|7v980|awo40|7v980|ayis0|7v980|awo40|7v980|5lhs40|56yk0|awo40|7v980|awo40|7v980|awo40|7v980|ayis0|7v980|awo40|7v980|autg0|7v980|2wxus0|8n180|a4w40|8n180|a4w40|8n180|a4w40|8n180|bs5g0|71mk0|alk40|86d80|a4w40|8n180|a4w40|8n180|a6qs0|80t80|905g0|9cyk0|9d440|9cyk0|9d440|9cyk0|9q2s0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|Infinity'
}, {
    'id': 'Asia/Bishkek',
    'title': 'Bishkek',
    'winIndex': 21,
    'offsets': [4.973333333333333, 5, 6, 7],
    'offsetIndices': '01232323232323232323232212121212121212121212121212122',
    'untils': '-nu19tc|379zxc|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|7vc00|bkl80|8n180|a31g0|8n180|a31g0|8n180|a31g0|8n180|a31g0|8zzw0|9db20|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|73aa0|Infinity'
}, {
    'id': 'Asia/Brunei',
    'title': 'Brunei',
    'winIndex': 24,
    'offsets': [7.661111111111111, 7.5, 8],
    'offsetIndices': '012',
    'untils': '-mvofy4|3khxs4|Infinity'
}, {
    'id': 'Asia/Chita',
    'title': 'Chita',
    'winIndex': 79,
    'offsets': [7.564444444444445, 8, 9, 10],
    'offsetIndices': '0123232323232323232323221232323232323232323232323232323232323232312',
    'untils': '-q4cfog|5hkxgg|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|qnew0|Infinity'
}, {
    'id': 'Asia/Choibalsan',
    'title': 'Choibalsan',
    'winIndex': 25,
    'offsets': [7.633333333333334, 7, 8, 10, 9],
    'offsetIndices': '0123434343434343434343434343434343434343434343424242424242424242424242424242424242424242424242',
    'untils': '-xmct7c|11sndrc|2qk2k0|9eqg0|9eys0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9q2s0|9cyk0|9d440|9cyk0|9d440|9cyk0|1ckdo0|7x3w0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|s6qk0|3nc0c0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|Infinity'
}, {
    'id': 'Asia/Colombo',
    'title': 'Colombo',
    'winIndex': 80,
    'offsets': [5.325555555555556, 5.5, 6, 6.5],
    'offsetIndices': '01231321',
    'untils': '-xehask|isle6k|cajy0|1mp2u0|qetjw0|7x5a0|4xvqq0|Infinity'
}, {
    'id': 'Asia/Damascus',
    'title': 'Damascus',
    'winIndex': 81,
    'offsets': [2.42, 2, 3],
    'offsetIndices': '01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-q3gk20|5k6q0|8n180|a31g0|8n180|a31g0|8n180|a31g0|8zzw0|k4hk40|7yyk0|awo40|7tek0|b0dg0|7v980|awo40|7tek0|alk40|887w0|awo40|7v980|ayis0|7v980|awo40|7v980|awo40|7v980|awo40|7v980|ayis0|7v980|awo40|7v980|awo40|7v980|awo40|7v980|ayis0|7v980|awo40|6bp80|cg840|6bp80|2eh1g0|8zzw0|9ts40|8zzw0|pvk40|c33w0|7cw40|cjrw0|6zxg0|btuk0|7rpg0|9gnw0|9d440|9cyk0|9et80|9et80|9rxg0|91uk0|92040|9et80|9o840|9et80|9d440|9et80|9eys0|9et80|9b9g0|9gnw0|99es0|9iik0|9d440|9et80|9eys0|9et80|9d440|9et80|9d440|9et80|9d440|9et80|9eys0|9et80|9d440|9et80|9d440|8y580|9q2s0|b5rw0|7x9g0|aunw0|7ig40|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|Infinity'
}, {
    'id': 'Asia/Dhaka',
    'title': 'Dhaka',
    'winIndex': 20,
    'offsets': [5.888888888888888, 6.5, 5.5, 6, 7],
    'offsetIndices': '01213343',
    'untils': '-eqtpow|bmgyw|5lxg0|4qknw0|a63o20|jyevw0|a1400|Infinity'
}, {
    'id': 'Asia/Dili',
    'title': 'Dili',
    'winIndex': 43,
    'offsets': [8.372222222222222, 8, 9],
    'offsetIndices': '012212',
    'untils': '-u9s4l8|fqcu98|1vc2o0|fz3pc0|cpz440|Infinity'
}, {
    'id': 'Asia/Dubai',
    'title': 'Dubai',
    'winIndex': 7,
    'offsets': [3.6866666666666665, 4],
    'offsetIndices': '01',
    'untils': '-q3gnko|Infinity'
}, {
    'id': 'Asia/Dushanbe',
    'title': 'Dushanbe',
    'winIndex': 17,
    'offsets': [4.586666666666667, 5, 6, 7],
    'offsetIndices': '0123232323232323232323221',
    'untils': '-nu18qo|379yuo|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|8c2s0|Infinity'
}, {
    'id': 'Asia/Ho_Chi_Minh',
    'title': 'Ho Chi Minh',
    'winIndex': 6,
    'offsets': [7.111111111111112, 7.108333333333333, 7, 8, 9],
    'offsetIndices': '0123423232',
    'untils': '-x56934|2isioa|gj25iu|15ct80|8so00|tmtk0|4azjw0|2cmao0|8285c0|Infinity'
}, {
    'id': 'Asia/Hong_Kong',
    'title': 'Hong Kong',
    'winIndex': 19,
    'offsets': [7.611666666666666, 8, 9],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-y0i2h6|j09kn6|9cyk0|4f2e0|1xyfw0|b6760|bkl80|6udg0|df980|6dpg0|9cyk0|7x9g0|ast80|7x9g0|ast80|7x9g0|ast80|8a840|adzw0|8c2s0|ast80|77c40|biqk0|77c40|bvp80|6udg0|bvp80|77c40|biqk0|77c40|biqk0|77c40|biqk0|77c40|bvp80|6udg0|bvp80|6udg0|bvp80|77c40|biqk0|77c40|biqk0|8n6s0|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|3lpg0|f4d80|9d440|9cyk0|9d440|9cyk0|1c9440|8a2k0|Infinity'
}, {
    'id': 'Asia/Hovd',
    'title': 'Hovd',
    'winIndex': 6,
    'offsets': [6.11, 6, 7, 8],
    'offsetIndices': '012323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-xmcoz0|11sncb0|2qk2k0|9et80|9eys0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9q2s0|9cyk0|9d440|9cyk0|9d440|9cyk0|1ckdo0|7x3w0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|4fio40|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|Infinity'
}, {
    'id': 'Asia/Irkutsk',
    'title': 'Irkutsk',
    'winIndex': 82,
    'offsets': [6.951388888888888, 7, 8, 9],
    'offsetIndices': '012323232323232323232322123232323232323232323232323232323232323232',
    'untils': '-q28gn5|5fh175|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Asia/Jakarta',
    'title': 'Jakarta',
    'winIndex': 6,
    'offsets': [7.12, 7.333333333333333, 7.5, 9, 8, 7],
    'offsetIndices': '01232425',
    'untils': '-o0bdpc|4lzxc0|4wdzjc|1tu960|1cx860|11jta0|74uc20|Infinity'
}, {
    'id': 'Asia/Jayapura',
    'title': 'Jayapura',
    'winIndex': 43,
    'offsets': [9.379999999999999, 9, 9.5],
    'offsetIndices': '0121',
    'untils': '-jebm20|66bqe0|a37vy0|Infinity'
}, {
    'id': 'Asia/Jerusalem',
    'title': 'Jerusalem',
    'winIndex': 23,
    'offsets': [2.344444444444444, 2, 3, 4],
    'offsetIndices': '01212121212132121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-r50eig|bp54yg|19f3w0|7rv00|b02c0|7tk40|b07w0|8jhg0|a8lg0|8jhg0|a8ac0|t9s40|56vs0|35700|9b3w0|9gtg0|8jbw0|7tmw0|a6ig0|biyw0|8a5c0|9d1c0|902o0|7x6o0|e1eg0|4ofw0|dzxo0|4q500|doo40|64iw0|auqo0|7i500|8rfms0|51ek0|9q2s0|6u7w0|50rhg0|7x3w0|cls40|5rbw0|bbhg0|7rjw0|asys0|7k580|c8tg0|6h980|ag040|7x3w0|asys0|8a2k0|asys0|8a2k0|ap9g0|80t80|ap9g0|7nuk0|b2840|80t80|9zc40|9iik0|9kis0|93p80|9mdg0|8qqk0|apf00|7x3w0|biw40|8zx40|9io40|8n180|9kis0|9vh80|8ulg0|9px80|9mdg0|8n180|9tuw0|9tmk0|8wg40|9gnw0|99es0|8qqk0|9zc40|9tmk0|8wg40|9gnw0|99es0|8qqk0|acas0|9gnw0|99es0|93p80|9mdg0|awik0|7tk40|awik0|7tk40|awik0|7tk40|b9h80|7glg0|b9h80|7glg0|b9h80|7tk40|awik0|7tk40|awik0|7tk40|b9h80|7glg0|b9h80|7glg0|b9h80|7tk40|awik0|7tk40|awik0|7tk40|awik0|7tk40|b9h80|7glg0|b9h80|7glg0|b9h80|7tk40|awik0|7tk40|awik0|7tk40|b9h80|7glg0|b9h80|7glg0|b9h80|7glg0|b9h80|7tk40|awik0|7tk40|awik0|Infinity'
}, {
    'id': 'Asia/Kabul',
    'title': 'Kabul',
    'winIndex': 83,
    'offsets': [4, 4.5],
    'offsetIndices': '01',
    'untils': '-d1pkg0|Infinity'
}, {
    'id': 'Asia/Kamchatka',
    'title': 'Kamchatka',
    'winIndex': 75,
    'offsets': [10.576666666666666, 11, 12, 13],
    'offsetIndices': '01232323232323232323232212323232323232323232323232323232323232212',
    'untils': '-olrupo|3z045o|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5xg0|7k800|Infinity'
}, {
    'id': 'Asia/Karachi',
    'title': 'Karachi',
    'winIndex': 84,
    'offsets': [4.47, 5.5, 6.5, 5, 6],
    'offsetIndices': '012133434343',
    'untils': '-wvpb30|im3zt0|1mn180|33xpg0|a63o20|g72qo0|9cyk0|2y85g0|7v980|8hms0|aaak0|Infinity'
}, {
    'id': 'Asia/Kathmandu',
    'title': 'Kathmandu',
    'winIndex': 22,
    'offsets': [5.687777777777778, 5.5, 5.75],
    'offsetIndices': '012',
    'untils': '-q3gt4s|yg2lus|Infinity'
}, {
    'id': 'Asia/Khandyga',
    'title': 'Khandyga',
    'winIndex': 79,
    'offsets': [9.036944444444446, 8, 9, 10, 11],
    'offsetIndices': '01232323232323232323232212323232323232323232323232343434343434343432',
    'untils': '-q4cjrp|5hl1jp|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|3fx40|4h6s0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|8ql00|1mlho0|Infinity'
}, {
    'id': 'Asia/Kolkata',
    'title': 'Kolkata',
    'winIndex': 18,
    'offsets': [5.888888888888888, 6.5, 5.5],
    'offsetIndices': '01212',
    'untils': '-eqtpow|bmgyw|5lxg0|1mn180|Infinity'
}, {
    'id': 'Asia/Krasnoyarsk',
    'title': 'Krasnoyarsk',
    'winIndex': 85,
    'offsets': [6.190555555555556, 6, 7, 8],
    'offsetIndices': '012323232323232323232322123232323232323232323232323232323232323232',
    'untils': '-q37l72|5gg8j2|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Asia/Kuala_Lumpur',
    'title': 'Kuala Lumpur',
    'winIndex': 24,
    'offsets': [6.923611111111112, 7, 7.333333333333333, 7.5, 9, 8],
    'offsetIndices': '01223435',
    'untils': '-xphpwd|eeb94d|1kbr2o|2yhc00|8n3jc|1v2p60|iy3o60|Infinity'
}, {
    'id': 'Asia/Kuching',
    'title': 'Kuching',
    'winIndex': 24,
    'offsets': [7.355555555555555, 7.5, 8, 8.333333333333334, 9],
    'offsetIndices': '01232323232323232422',
    'untils': '-mvof3k|3khwxk|1epvy0|4ohqo|e5a9c|4ohqo|e3flc|4ohqo|e3flc|4ohqo|e3flc|4ohqo|e5a9c|4ohqo|e3flc|4ohqo|3ajlc|1v2qk0|iy3ms0|Infinity'
}, {
    'id': 'Asia/Macau',
    'title': 'Macau',
    'winIndex': 19,
    'offsets': [7.572222222222222, 8, 9],
    'offsetIndices': '0121212121212121212121212121212121212121211',
    'untils': '-u9s2d8|pon9v8|bvp80|6udg0|bvp80|6u3q0|bvyy0|77c40|biqk0|772e0|biqk0|8ngi0|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9cue0|9cyk0|9d440|9px80|9d440|9d8a0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9cue0|9cyk0|9d440|9px80|9d440|9cyk0|a04w40|Infinity'
}, {
    'id': 'Asia/Magadan',
    'title': 'Magadan',
    'winIndex': 75,
    'offsets': [10.053333333333335, 10, 11, 12],
    'offsetIndices': '0123232323232323232323221232323232323232323232323232323232323232312',
    'untils': '-nu1nxc|37a05c|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|s39k0|Infinity'
}, {
    'id': 'Asia/Makassar',
    'title': 'Makassar',
    'winIndex': 24,
    'offsets': [7.96, 8, 9],
    'offsetIndices': '00121',
    'untils': '-q3gzg0|6p5hc0|4u87w0|1w02k0|Infinity'
}, {
    'id': 'Asia/Manila',
    'title': 'Manila',
    'winIndex': 24,
    'offsets': [8, 9],
    'offsetIndices': '010101010',
    'untils': '-hb5y80|4qak0|2qidg0|1b2d80|4xf440|442k0|cdqdg0|9et80|Infinity'
}, {
    'id': 'Asia/Nicosia',
    'title': 'Nicosia',
    'winIndex': 4,
    'offsets': [2.2244444444444444, 2, 3],
    'offsetIndices': '01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-p4bq6g|rvhxyg|9cyk0|b42s0|7nuk0|8yas0|8zzw0|9q2s0|9et80|9b9g0|9cyk0|9q2s0|8zzw0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9q2s0|9cyk0|9d440|9cyk0|9d440|at4c0|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Asia/Novokuznetsk',
    'title': 'Novokuznetsk',
    'winIndex': 86,
    'offsets': [5.8133333333333335, 6, 7, 8],
    'offsetIndices': '012323232323232323232322123232323232323232323232323232323232322122',
    'untils': '-nu36tc|37bu5c|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5xg0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Asia/Novosibirsk',
    'title': 'Novosibirsk',
    'winIndex': 86,
    'offsets': [5.527777777777778, 6, 7, 8],
    'offsetIndices': '0123232323232323232323221232321212121212121212121212121212121212121',
    'untils': '-q4do0s|5hmbcs|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|2vh00|6hn40|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Asia/Omsk',
    'title': 'Omsk',
    'winIndex': 86,
    'offsets': [4.891666666666667, 5, 6, 7],
    'offsetIndices': '012323232323232323232322123232323232323232323232323232323232323232',
    'untils': '-q5xmx6|5j6d16|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Asia/Oral',
    'title': 'Oral',
    'winIndex': 17,
    'offsets': [3.4233333333333333, 4, 5, 6],
    'offsetIndices': '01232323232323232121212121212121212121212121212',
    'untils': '-nu15ic|379yec|qi27w0|s6qk0|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|iq5g0|9d1c0|9q000|9d1c0|9d1c0|5reo0|cyo00|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|Infinity'
}, {
    'id': 'Asia/Pontianak',
    'title': 'Pontianak',
    'winIndex': 6,
    'offsets': [7.288888888888889, 7.5, 9, 8, 7],
    'offsetIndices': '001213134',
    'untils': '-w6piww|cse2o0|4tnu2w|1wkei0|1cx860|11jta0|74uc20|cixam0|Infinity'
}, {
    'id': 'Asia/Pyongyang',
    'title': 'Pyongyang',
    'winIndex': 53,
    'offsets': [8.383333333333333, 8.5, 9],
    'offsetIndices': '012221',
    'untils': '-w895yc|1yh10c|dfsmm0|44cqo0|10ipmo0|Infinity'
}, {
    'id': 'Asia/Qatar',
    'title': 'Qatar',
    'winIndex': 5,
    'offsets': [3.4355555555555553, 4, 3],
    'offsetIndices': '012',
    'untils': '-q3gmvk|rctnrk|Infinity'
}, {
    'id': 'Asia/Qyzylorda',
    'title': 'Qyzylorda',
    'winIndex': 21,
    'offsets': [4.364444444444445, 4, 5, 6],
    'offsetIndices': '0123232323232323232323232323232323232323232323',
    'untils': '-nu184g|37a10g|qi27w0|s6qk0|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|ohhc0|cyo00|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|Infinity'
}, {
    'id': 'Asia/Rangoon',
    'title': 'Rangoon',
    'winIndex': 87,
    'offsets': [6.411111111111111, 6.5, 9],
    'offsetIndices': '0121',
    'untils': '-q3gv54|bnjp34|1kh520|Infinity'
}, {
    'id': 'Asia/Riyadh',
    'title': 'Riyadh',
    'winIndex': 5,
    'offsets': [3.1144444444444446, 3],
    'offsetIndices': '01',
    'untils': '-bwgbbg|Infinity'
}, {
    'id': 'Asia/Sakhalin',
    'title': 'Sakhalin',
    'winIndex': 88,
    'offsets': [9.513333333333332, 9, 11, 12, 10],
    'offsetIndices': '01123232323232323232323224232323232322424242424242424242424242424242',
    'untils': '-xl87rc|gr8pfc|44elc0|ikvh40|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asys0|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|qnc40|Infinity'
}, {
    'id': 'Asia/Samarkand',
    'title': 'Samarkand',
    'winIndex': 17,
    'offsets': [4.464722222222222, 4, 5, 6],
    'offsetIndices': '01233323232323232323232332',
    'untils': '-nu18eh|37a1ah|qi27w0|9et80|9d1c0|9ew00|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|7wyc0|1g300|Infinity'
}, {
    'id': 'Asia/Seoul',
    'title': 'Seoul',
    'winIndex': 53,
    'offsets': [8.464444444444444, 8.5, 9, 9.5, 10],
    'offsetIndices': '01222131313131313124242',
    'untils': '-w8966g|1yh18g|dfsmm0|454io0|4gadc0|l3aq0|6j3w0|d2g40|6u7w0|b5xg0|776k0|biw40|776k0|biw40|776k0|biw40|776k0|grs40|dfqxi0|7x6o0|asw00|7x6o0|Infinity'
}, {
    'id': 'Asia/Shanghai',
    'title': 'Shanghai',
    'winIndex': 19,
    'offsets': [8, 9],
    'offsetIndices': '01010101010101010',
    'untils': '-ffs0w0|66580|8jhg0|a8fw0|n9rc40|6u7w0|asys0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|asys0|7x3w0|asys0|7x3w0|Infinity'
}, {
    'id': 'Asia/Singapore',
    'title': 'Singapore',
    'winIndex': 24,
    'offsets': [6.923611111111112, 7, 7.333333333333333, 7.5, 9, 8],
    'offsetIndices': '012234335',
    'untils': '-xphpwd|eeb94d|1kbr2o|2yhc00|8n3jc|1v2p60|ae0xi0|8k2qo0|Infinity'
}, {
    'id': 'Asia/Srednekolymsk',
    'title': 'Srednekolymsk',
    'winIndex': 75,
    'offsets': [10.247777777777777, 10, 11, 12],
    'offsetIndices': '012323232323232323232322123232323232323232323232323232323232323232',
    'untils': '-nu1ogs|37a0os|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Asia/Taipei',
    'title': 'Taipei',
    'winIndex': 52,
    'offsets': [8, 9],
    'offsetIndices': '01010101010101010101010101010101010101010',
    'untils': '-gtzfk0|45slc0|c51c0|75bw0|a31g0|aaak0|9d440|7v980|awo40|7v980|awo40|7v980|awo40|7v980|7tk40|clmk0|7rpg0|b07w0|7rpg0|b07w0|7rpg0|9et80|9eys0|9et80|9d440|9et80|9d440|9et80|9d440|9et80|cjxg0|69uk0|ci2s0|69uk0|6its40|9et80|9d440|9et80|1yf9g0|4qak0|Infinity'
}, {
    'id': 'Asia/Tashkent',
    'title': 'Tashkent',
    'winIndex': 17,
    'offsets': [4.619722222222222, 5, 6, 7],
    'offsetIndices': '01232323232323232323232221',
    'untils': '-nu18tz|379yxz|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|7x140|1g300|Infinity'
}, {
    'id': 'Asia/Tbilisi',
    'title': 'Tbilisi',
    'winIndex': 89,
    'offsets': [2.986388888888889, 3, 4, 5],
    'offsetIndices': '0123232323232323232323222121212232323232323232323212',
    'untils': '-nu14an|h4tjyn|ckinw0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|gig0|8wlo0|9cvs0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d1c0|9cyk0|9q2s0|tivw0|7x9g0|ast80|7x9g0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7x9g0|ast80|7x9g0|ast80|7x9g0|4ofw0|6hn40|7k800|Infinity'
}, {
    'id': 'Asia/Tehran',
    'title': 'Tehran',
    'winIndex': 42,
    'offsets': [3.428888888888889, 3.5, 4, 5, 4.5],
    'offsetIndices': '00123214141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141',
    'untils': '-s6m6uw|fnolc0|gm3h4w|777y0|b07w0|3pes0|42c20|9cyk0|9gtg0|9kd80|5ja5g0|7avw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9d440|9gnw0|1av440|9gnw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9d440|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|9b9g0|9gnw0|Infinity'
}, {
    'id': 'Asia/Thimphu',
    'title': 'Thimphu',
    'winIndex': 20,
    'offsets': [5.9766666666666675, 5.5, 6],
    'offsetIndices': '012',
    'untils': '-bojclo|kxymno|Infinity'
}, {
    'id': 'Asia/Tokyo',
    'title': 'Tokyo',
    'winIndex': 43,
    'offsets': [9, 10],
    'offsetIndices': '0010101010',
    'untils': '-gtzic0|5ivew0|6sd80|ahus0|887w0|cao40|6fek0|cao40|6fek0|Infinity'
}, {
    'id': 'Asia/Ulaanbaatar',
    'title': 'Ulaanbaatar',
    'winIndex': 25,
    'offsets': [7.125555555555556, 7, 8, 9],
    'offsetIndices': '012323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-xmcrsk|11sncck|2qk2k0|9et80|9eys0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9q2s0|9cyk0|9d440|9cyk0|9d440|9cyk0|1ckdo0|7x3w0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|4fio40|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9pro0|9d9o0|9ct00|9d9o0|9ct00|9d9o0|9ct00|Infinity'
}, {
    'id': 'Asia/Urumqi',
    'title': 'Urumqi',
    'winIndex': 21,
    'offsets': [5.838888888888889, 6],
    'offsetIndices': '01',
    'untils': '-lx5pjw|Infinity'
}, {
    'id': 'Asia/Ust-Nera',
    'title': 'Ust-Nera',
    'winIndex': 88,
    'offsets': [9.548333333333334, 8, 9, 12, 11, 10],
    'offsetIndices': '0123434343434343434343445434343434343434343434343434343434343434345',
    'untils': '-q4cl6u|5hl2yu|qi27w0|9eno0|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|8ql00|1mlho0|Infinity'
}, {
    'id': 'Asia/Vladivostok',
    'title': 'Vladivostok',
    'winIndex': 88,
    'offsets': [8.791944444444445, 9, 10, 11],
    'offsetIndices': '012323232323232323232322123232323232323232323232323232323232323232',
    'untils': '-oligf7|3yqvf7|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Asia/Yakutsk',
    'title': 'Yakutsk',
    'winIndex': 79,
    'offsets': [8.649444444444445, 8, 9, 10],
    'offsetIndices': '012323232323232323232322123232323232323232323232323232323232323232',
    'untils': '-q4cioy|5hl0gy|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Asia/Yekaterinburg',
    'title': 'Yekaterinburg',
    'winIndex': 90,
    'offsets': [4.0425, 3.751388888888889, 4, 5, 6],
    'offsetIndices': '0123434343434343434343433234343434343434343434343434343434343434343',
    'untils': '-rx5hw9|1kybx4|5pfyv5|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Asia/Yerevan',
    'title': 'Yerevan',
    'winIndex': 91,
    'offsets': [2.966666666666667, 3, 4, 5],
    'offsetIndices': '0123232323232323232323222121212122323232323232323232323232323232',
    'untils': '-nu148o|h4tjwo|ckinw0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|91rs0|bcc0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|sfzw0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|Infinity'
}, {
    'id': 'Atlantic/Azores',
    'title': 'Azores',
    'winIndex': 73,
    'offsets': [-1.9088888888888889, -2, -1, 0],
    'offsetIndices': '01212121212121212121212121212121212121212121232123212321232121212121212121212121212121212121212121232323232323232323232323232323233323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-u9rc14|2bug54|6zxg0|66580|bq800|73k00|bodc0|71pc0|bq800|73k00|bq800|71pc0|bq800|1b2g00|9b6o0|saio0|8n400|9q000|902o0|a2yo0|902o0|a2yo0|8n400|st1c0|8n400|9d1c0|9d1c0|sg2o0|9d1c0|902o0|9q000|a2yo0|8n400|9d1c0|9d1c0|902o0|9q000|a2yo0|b5uo0|51hc0|bitc0|9d1c0|9ew00|88ao0|25p80|5reo0|3lpg0|779c0|1sqk0|6uao0|38qs0|6uao0|25p80|6hc00|38qs0|6uao0|25p80|6hc00|38qs0|8a5c0|9d1c0|9d9o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|s3400|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|5qbjo0|9d1c0|9q000|9d1c0|9d1c0|9d440|9cyk0|9d440|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9cyk0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9cyk0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Atlantic/Bermuda',
    'title': 'Bermuda',
    'winIndex': 36,
    'offsets': [-4.321666666666667, -4, -3],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-kvj2fu|n4pr3u|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'Atlantic/Canary',
    'title': 'Canary',
    'winIndex': 26,
    'offsets': [-1.0266666666666666, -1, 0, 1],
    'offsetIndices': '01232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-oytbtc|ctvupc|hhq7s0|905g0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Atlantic/Cape_Verde',
    'title': 'Cape Verde',
    'winIndex': 92,
    'offsets': [-1.5677777777777777, -2, -1],
    'offsetIndices': '01212',
    'untils': '-wvoub8|im43v8|1mn180|fpqwc0|Infinity'
}, {
    'id': 'Atlantic/Faroe',
    'title': 'Faroe',
    'winIndex': 26,
    'offsets': [-0.45111111111111113, 0, 1],
    'offsetIndices': '01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-wcehew|127keuw|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Atlantic/Madeira',
    'title': 'Madeira',
    'winIndex': 26,
    'offsets': [-1.1266666666666665, -1, 0, 1],
    'offsetIndices': '01212121212121212121212121212121212121212121232123212321232121212121212121212121212121212121212121232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-u9re7c|2bufjc|6zxg0|66580|bq800|73k00|bodc0|71pc0|bq800|73k00|bq800|71pc0|bq800|1b2g00|9b6o0|saio0|8n400|9q000|902o0|a2yo0|902o0|a2yo0|8n400|st1c0|8n400|9d1c0|9d1c0|sg2o0|9d1c0|902o0|9q000|a2yo0|8n400|9d1c0|9d1c0|902o0|9q000|a2yo0|b5uo0|51hc0|bitc0|9d1c0|9ew00|88ao0|25p80|5reo0|3lpg0|779c0|1sqk0|6uao0|38qs0|6uao0|25p80|6hc00|38qs0|6uao0|25p80|6hc00|38qs0|8a5c0|9d1c0|9d9o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|s3400|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|5qbjo0|9d1c0|9q000|9d1c0|9d1c0|9d440|9cyk0|9d440|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9cyk0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Atlantic/Reykjavik',
    'title': 'Reykjavik',
    'winIndex': 0,
    'offsets': [-1.4666666666666666, -1, 0],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121212121212121212',
    'untils': '-wcwx9c|4rpd9c|ci2s0|69uk0|du840|4xp80|du840|p7bw0|4w040|9bdzw0|9d6w0|64g40|cyl80|64dc0|clpc0|6hc00|bvs00|6uao0|bvs00|6uao0|bvs00|6uao0|c8qo0|6hc00|c8qo0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|asw00|7x6o0|afxc0|8a5c0|asw00|8a5c0|afxc0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|asw00|8a5c0|afxc0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|asw00|8a5c0|afxc0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|asw00|8a5c0|Infinity'
}, {
    'id': 'Atlantic/South_Georgia',
    'title': 'South Georgia',
    'winIndex': 34,
    'offsets': [-2],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Atlantic/Stanley',
    'title': 'Stanley',
    'winIndex': 64,
    'offsets': [-3.856666666666667, -4, -3, -2],
    'offsetIndices': '0121212121212123232212121212121212121212121212121212121212121212121212',
    'untils': '-u63pac|dbvxqc|8zzw0|9q2s0|8zzw0|a31g0|8zzw0|9q2s0|8zzw0|9q2s0|8zzw0|9q2s0|4xp80|l1pus0|7k580|b5rw0|77c40|biqk0|77c40|b5uo0|7kas0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7kas0|biqk0|77c40|biqk0|7kas0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7kas0|biqk0|7kas0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7kas0|b5rw0|7kas0|b5xg0|77c40|bvp80|6udg0|bvp80|77c40|biqk0|77c40|biqk0|77c40|biqk0|77c40|biqk0|77c40|bvp80|77c40|biqk0|77c40|biqk0|77c40|Infinity'
}, {
    'id': 'Australia/Adelaide',
    'title': 'Adelaide',
    'winIndex': 31,
    'offsets': [9.5, 10.5],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101',
    'untils': '-rnsvoc|49s2c|cxfms0|4h180|9d440|9cyk0|9q2s0|8zzw0|eeiqs0|64dc0|clpc0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|779c0|b5uo0|7k800|bitc0|7k800|bitc0|779c0|bitc0|779c0|bitc0|6hc00|c8qo0|7k800|b5uo0|6uao0|c8qo0|779c0|bitc0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7k800|b5uo0|8a5c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|Infinity'
}, {
    'id': 'Australia/Brisbane',
    'title': 'Brisbane',
    'winIndex': 30,
    'offsets': [10, 11],
    'offsetIndices': '01010101010101010',
    'untils': '-rnsx2c|49s2c|cxfms0|4h180|9d440|9cyk0|9q2s0|8zzw0|eeiqs0|64dc0|97zuo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|Infinity'
}, {
    'id': 'Australia/Broken_Hill',
    'title': 'Broken Hill',
    'winIndex': 31,
    'offsets': [9.5, 10.5],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101',
    'untils': '-rnsvoc|49s2c|cxfms0|4h180|9d440|9cyk0|9q2s0|8zzw0|eeiqs0|64dc0|clpc0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|8a5c0|asw00|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|779c0|b5uo0|7k800|bitc0|7k800|bitc0|779c0|bitc0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7k800|b5uo0|8a5c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|Infinity'
}, {
    'id': 'Australia/Currie',
    'title': 'Currie',
    'winIndex': 32,
    'offsets': [10, 11],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101',
    'untils': '-rsj4w0|8zzw0|cxfms0|4h180|9d440|9cyk0|9q2s0|8zzw0|eeiqs0|64dc0|clpc0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|7x6o0|b5uo0|7k800|b5uo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|bvs00|7k800|bitc0|7k800|bitc0|779c0|bitc0|779c0|bitc0|7x6o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|7x6o0|asw00|a2yo0|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9d1c0|902o0|a2yo0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|Infinity'
}, {
    'id': 'Australia/Darwin',
    'title': 'Darwin',
    'winIndex': 29,
    'offsets': [9.5, 10.5],
    'offsetIndices': '010101010',
    'untils': '-rnsvoc|49s2c|cxfms0|4h180|9d440|9cyk0|9q2s0|8zzw0|Infinity'
}, {
    'id': 'Australia/Hobart',
    'title': 'Hobart',
    'winIndex': 32,
    'offsets': [10, 11],
    'offsetIndices': '010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101',
    'untils': '-rsj4w0|8zzw0|cxfms0|4h180|9d440|9cyk0|9q2s0|8zzw0|c9tms0|9d1c0|asw00|6uao0|bvs00|6uao0|bvs00|779c0|bvs00|64dc0|clpc0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|7x6o0|b5uo0|7k800|b5uo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|bvs00|7k800|bitc0|7k800|bitc0|779c0|bitc0|779c0|bitc0|7x6o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|7x6o0|asw00|a2yo0|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9d1c0|902o0|a2yo0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|Infinity'
}, {
    'id': 'Australia/Lindeman',
    'title': 'Lindeman',
    'winIndex': 30,
    'offsets': [10, 11],
    'offsetIndices': '010101010101010101010',
    'untils': '-rnsx2c|49s2c|cxfms0|4h180|9d440|9cyk0|9q2s0|8zzw0|eeiqs0|64dc0|97zuo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|Infinity'
}, {
    'id': 'Australia/Melbourne',
    'title': 'Melbourne',
    'winIndex': 28,
    'offsets': [10, 11],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101',
    'untils': '-rnsx2c|49s2c|cxfms0|4h180|9d440|9cyk0|9q2s0|8zzw0|eeiqs0|64dc0|clpc0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|779c0|b5uo0|7k800|b5uo0|7x6o0|bitc0|779c0|bitc0|779c0|bitc0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|7x6o0|asw00|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7k800|b5uo0|8a5c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|Infinity'
}, {
    'id': 'Australia/Perth',
    'title': 'Perth',
    'winIndex': 33,
    'offsets': [8, 9],
    'offsetIndices': '0101010101010101010',
    'untils': '-rnsric|49s2c|cxfms0|4h180|9d440|9cyk0|ghf1g0|6hc00|4ir9c0|6hc00|40r400|5eg00|7p9hc0|5reo0|b5uo0|7x6o0|asw00|7x6o0|Infinity'
}, {
    'id': 'Australia/Sydney',
    'title': 'Sydney',
    'winIndex': 28,
    'offsets': [10, 11],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101',
    'untils': '-rnsx2c|49s2c|cxfms0|4h180|9d440|9cyk0|9q2s0|8zzw0|eeiqs0|64dc0|clpc0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|8a5c0|asw00|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|779c0|b5uo0|7k800|bitc0|7k800|bitc0|779c0|bitc0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|7x6o0|asw00|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7k800|b5uo0|8a5c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|Infinity'
}, {
    'id': 'CST6CDT',
    'title': 'CST6CDT',
    'winIndex': 13,
    'offsets': [-6, -5],
    'offsetIndices': '010101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0esg0|ast80|7x9g0|ast80|bmtus0|1tz8c0|2dsw0|b9gdg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'EST5EDT',
    'title': 'EST5EDT',
    'winIndex': 14,
    'offsets': [-5, -4],
    'offsetIndices': '010101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0ev80|ast80|7x9g0|ast80|bmtus0|1tzb40|2dq40|b9gdg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'Etc/GMT',
    'title': 'GMT',
    'winIndex': 41,
    'link': 150
}, {
    'id': 'Etc/GMT+1',
    'title': 'GMT+1',
    'winIndex': 92,
    'offsets': [-1],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT+10',
    'title': 'GMT+10',
    'winIndex': 57,
    'offsets': [-10],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT+11',
    'title': 'GMT+11',
    'winIndex': 49,
    'offsets': [-11],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT+12',
    'title': 'GMT+12',
    'winIndex': 93,
    'offsets': [-12],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT+2',
    'title': 'GMT+2',
    'winIndex': 34,
    'offsets': [-2],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT+3',
    'title': 'GMT+3',
    'winIndex': 64,
    'offsets': [-3],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT+4',
    'title': 'GMT+4',
    'winIndex': 16,
    'offsets': [-4],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT+5',
    'title': 'GMT+5',
    'winIndex': 10,
    'offsets': [-5],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT+6',
    'title': 'GMT+6',
    'winIndex': 67,
    'offsets': [-6],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT+7',
    'title': 'GMT+7',
    'winIndex': 56,
    'offsets': [-7],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-1',
    'title': 'GMT-1',
    'winIndex': 3,
    'offsets': [1],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-10',
    'title': 'GMT-10',
    'winIndex': 50,
    'offsets': [10],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-11',
    'title': 'GMT-11',
    'winIndex': 48,
    'offsets': [11],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-12',
    'title': 'GMT-12',
    'winIndex': 44,
    'offsets': [12],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-13',
    'title': 'GMT-13',
    'winIndex': 94,
    'offsets': [13],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-14',
    'title': 'GMT-14',
    'winIndex': 95,
    'offsets': [14],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-2',
    'title': 'GMT-2',
    'winIndex': 2,
    'offsets': [2],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-3',
    'title': 'GMT-3',
    'winIndex': 1,
    'offsets': [3],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-4',
    'title': 'GMT-4',
    'winIndex': 7,
    'offsets': [4],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-5',
    'title': 'GMT-5',
    'winIndex': 17,
    'offsets': [5],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-6',
    'title': 'GMT-6',
    'winIndex': 21,
    'offsets': [6],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-7',
    'title': 'GMT-7',
    'winIndex': 6,
    'offsets': [7],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-8',
    'title': 'GMT-8',
    'winIndex': 24,
    'offsets': [8],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/GMT-9',
    'title': 'GMT-9',
    'winIndex': 43,
    'offsets': [9],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/UCT',
    'title': 'UCT',
    'winIndex': 41,
    'offsets': [0],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Etc/UTC',
    'title': 'UTC',
    'winIndex': 41,
    'offsets': [0],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Europe/Amsterdam',
    'title': 'Amsterdam',
    'winIndex': 27,
    'offsets': [0.3255555555555556, 1.3255555555555556, 1.3333333333333333, 0.3333333333333333, 2, 1],
    'offsetIndices': '010101010101010101010101010101010101010101012323234545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545',
    'untils': '-s0dvkk|7v980|a51o0|7x6o0|a2yo0|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9b6o0|a2yo0|c51c0|6l1c0|902o0|9q000|ci000|682o0|bgyo0|79400|bitc0|779c0|bmio0|7gio0|bbeo0|7eo00|bd9c0|7ctc0|bf400|7ayo0|bvs00|6uao0|bko00|7idc0|b9k00|7gio0|bbeo0|7eo00|bf400|7ayo0|btxc0|21uc0|4uaz8|bitc0|779c0|bko00|7idc0|bd3s0|1aarpc|7k800|9q000|9d1c0|9d1c0|9d1c0|8l9c0|ggp1c0|902o0|9q000|9d1c0|9d1c0|9d1c0|9q000|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Andorra',
    'title': 'Andorra',
    'winIndex': 27,
    'offsets': [0, 1, 2],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-c4xmo0|k3ctg0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Athens',
    'title': 'Athens',
    'winIndex': 4,
    'offsets': [1.581111111111111, 2, 3, 1],
    'offsetIndices': '012121313121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-rvv0cg|8bjasg|2vmk0|4hiw40|16ik0|scog0|7lx40|9o2k0|9eys0|4atzw0|6djw0|bplus0|bq800|71uw0|9d1c0|902o0|91xc0|9o5c0|905g0|9qgo0|9akg0|9iik0|99980|9dcg0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Belgrade',
    'title': 'Belgrade',
    'winIndex': 60,
    'offsets': [1, 2],
    'offsetIndices': '01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-ezayw0|swz00|7k800|9q000|9d1c0|9d1c0|b7pc0|6qlc0|jl1hc0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Berlin',
    'title': 'Berlin',
    'winIndex': 27,
    'offsets': [1, 2, 3],
    'offsetIndices': '01010101010101210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-s0e080|7ves0|a4yw0|7x6o0|asw00|7x6o0|b8qdc0|1cm000|7k800|9q000|9d1c0|9d1c0|9d1c0|2o7w0|6bs00|2txg0|7k800|91xc0|9b9g0|1sqk0|2inw0|51k40|a2yo0|8n400|9q000|902o0|fx91c0|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Brussels',
    'title': 'Brussels',
    'winIndex': 62,
    'offsets': [0, 1, 2],
    'offsetIndices': '0121212101010101010101010101010101010101010101010101212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-ss5uo0|rrx80|7vc00|a4yw0|7x6o0|asw00|7x6o0|2wh40|5omo0|b5uo0|6uao0|cyo00|7ayo0|bko00|7rmo0|a2yo0|a2yo0|8n400|902o0|9q000|9d1c0|9d1c0|a2yo0|8n400|9q000|902o0|a2yo0|90b00|a2yo0|8n400|9q000|902o0|a2yo0|8n400|9d1c0|9d1c0|902o0|a2yo0|9d1c0|9d1c0|902o0|9q000|a2yo0|8n400|9d1c0|9d1c0|902o0|9q000|a2yo0|b5uo0|51hc0|4deo0|1a36k0|7k800|9q000|9d1c0|8l9c0|a4tc0|8l9c0|clpc0|79400|fwu800|902o0|9q000|9d1c0|9d1c0|9d1c0|9q000|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Bucharest',
    'title': 'Bucharest',
    'winIndex': 4,
    'offsets': [1.74, 2, 3],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-k29zi0|fj8m0|6w5c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|kp0dc0|6h980|9q000|905g0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9cvs0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9cyk0|9d440|9cyk0|9q2s0|ast80|7xhs0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Budapest',
    'title': 'Budapest',
    'winIndex': 60,
    'offsets': [1, 2],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-s0e080|7ves0|a4yw0|7x6o0|a31g0|8n180|autg0|bgvw0|b5jeg0|th9k0|7k800|9q000|9d1c0|9d1c0|awd00|9ew00|7q0c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9q000|902o0|a4tc0|9q000|1va2g0|6u7w0|bxpg0|6u7w0|cjxg0|64ak0|cluw0|64g40|br3ek0|905g0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Chisinau',
    'title': 'Chisinau',
    'winIndex': 4,
    'offsets': [1.9166666666666667, 1.74, 2, 3, 1, 4],
    'offsetIndices': '012323232323232323232424235353535353535353535323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-r2p1bo|70f1to|fj8m0|6w5c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|geqo0|ha580|oc8g0|7k800|9q000|9d1c0|7cl00|j3pbw0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|25p80|7kdk0|9d1c0|9d1c0|9cvs0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9q2s0|ast80|7xf00|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Copenhagen',
    'title': 'Copenhagen',
    'winIndex': 62,
    'offsets': [1, 2],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-rzo2w0|75bw0|cbs2w0|1aco80|7k800|9q000|9d1c0|9d1c0|9d1c0|6y000|dbmo0|6bs00|clpc0|51hc0|e1k00|4oio0|giutc0|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Dublin',
    'title': 'Dublin',
    'winIndex': 26,
    'offsets': [-0.42250000000000004, 0.5775, 0, 1],
    'offsetIndices': '01232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-rzcmlr|6uao0|9pytr|8c000|9o5c0|9ruo0|9b6o0|9ew00|9b6o0|auqo0|88ao0|9ew00|8y800|a2yo0|a2yo0|7k800|asw00|8a5c0|asw00|8n400|a2yo0|8n400|9q000|902o0|afxc0|8n400|a2yo0|8n400|9q000|902o0|a2yo0|8n400|a2yo0|8n400|9q000|9d1c0|a2yo0|8n400|9q000|902o0|a2yo0|8n400|a2yo0|8n400|9q000|902o0|a2yo0|b5uo0|51hc0|3g8580|8a840|bvp80|8n6s0|a2yo0|7x6o0|asw00|8n400|9q000|902o0|9q000|9d1c0|9q000|902o0|8n400|9q000|902o0|a2yo0|8n400|afxc0|8n400|9q000|902o0|a2yo0|8n400|a2yo0|8n400|9q000|902o0|902o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|bitc0|5reo0|1xhuo0|779c0|bitc0|779c0|bitc0|779c0|bitc0|779c0|bitc0|7k800|b5uo0|7k800|b5uo0|7k800|bitc0|779c0|bitc0|779c0|bitc0|7x3w0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|8a5c0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Gibraltar',
    'title': 'Gibraltar',
    'winIndex': 27,
    'offsets': [0, 1, 2],
    'offsetIndices': '010101010101010101010101010101010101010101010101012121212121010121010101010101010101012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-rzcns0|6uao0|9q000|8c000|9o5c0|9ruo0|9b6o0|9ew00|9b6o0|auqo0|88ao0|9ew00|8y800|a2yo0|a2yo0|7k800|asw00|8a5c0|asw00|8n400|a2yo0|8n400|9q000|902o0|afxc0|8n400|a2yo0|8n400|9q000|902o0|a2yo0|8n400|a2yo0|8n400|9q000|9d1c0|a2yo0|8n400|9q000|902o0|a2yo0|8n400|a2yo0|8n400|9q000|902o0|a2yo0|b5uo0|51hc0|mbmk0|51hc0|c8qo0|6hc00|c8qo0|6uao0|bvs00|8n400|a4tc0|5clc0|4bms0|9q000|902o0|8a5c0|1frw0|64dc0|4bms0|6uao0|bvs00|7x6o0|asw00|8n400|9q000|902o0|9q000|9d1c0|9q000|902o0|8n400|9q000|902o0|a2yo0|8n400|afxc0|8n400|9q000|d0tp80|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Helsinki',
    'title': 'Helsinki',
    'winIndex': 59,
    'offsets': [1.6636111111111112, 2, 3],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-peghyd|ax3tqd|9gqo0|k31s80|9d1c0|9d1c0|9d1c0|9d440|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Istanbul',
    'title': 'Istanbul',
    'winIndex': 54,
    'offsets': [1.948888888888889, 2, 3, 4],
    'offsetIndices': '012121212121212121212121212121212121212121212121212121232323232322121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-ux9xew|2wvx6w|7v980|1tjc40|aunw0|88dg0|9et80|8yas0|a2vw0|tzpg0|79180|awo40|7v980|7p25g0|4zjw0|2xms0|f4d80|9vms0|b07w0|19f9g0|9px80|c5440|69uk0|acas0|8n180|a31g0|8n180|9q2s0|8zzw0|a8lg0|8ufw0|a31g0|8ovw0|5mbes0|4dbw0|u3es0|75bw0|2wxus0|7x3w0|asys0|7x3w0|b5xg0|7x3w0|c8w80|7x9g0|7k800|b6080|7jww0|ast80|b9ms0|7tek0|7x9g0|a2vw0|8n6s0|a2vw0|iruk0|8yj40|9rjk0|8lkg0|a4i80|8lkg0|a4i80|f2o40|38l80|t4840|8a5c0|9f4c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9cyk0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7kdk0|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7m2o0|b4000|7k800|b5uo0|7x6o0|asw00|7z1c0|ar1c0|7x6o0|bitc0|779c0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Kaliningrad',
    'title': 'Kaliningrad',
    'winIndex': 96,
    'offsets': [1, 2, 3, 4],
    'offsetIndices': '0101010101010121232323232323232322121212121212121212121212121212121212121212121',
    'untils': '-s0e080|7ves0|a4yw0|7x6o0|asw00|7x6o0|b8qdc0|1cm000|7k800|9q000|9d1c0|9d1c0|4od40|62fw0|9kd80|351g0|ie8nw0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Europe/Kiev',
    'title': 'Kiev',
    'winIndex': 59,
    'offsets': [2.0344444444444445, 2, 3, 1, 4],
    'offsetIndices': '0121313242424242424242424242121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-nu11ng|37a03g|5vd6k0|kzv40|7k800|9q000|1oyg0|jipzs0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|51ek0|neqw0|9cvs0|9cyk0|9d440|9cyk0|9d440|9cyk0|9dcg0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Lisbon',
    'title': 'Lisbon',
    'winIndex': 26,
    'offsets': [-0.6125, 0, 1, 2],
    'offsetIndices': '012121212121212121212121212121212121212121212321232123212321212121212121212121212121212121212121212121212121212121212121212121212122323232212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-u9rfmr|2bue6r|6zxg0|66580|bq800|73k00|bodc0|71pc0|bq800|73k00|bq800|71pc0|bq800|1b2g00|9b6o0|saio0|8n400|9q000|902o0|a2yo0|902o0|a2yo0|8n400|st1c0|8n400|9d1c0|9d1c0|sg2o0|9d1c0|902o0|9q000|a2yo0|8n400|9d1c0|9d1c0|902o0|9q000|a2yo0|b5uo0|51hc0|bitc0|9d1c0|9ew00|88ao0|25p80|5reo0|3lpg0|779c0|1sqk0|6uao0|38qs0|6uao0|25p80|6hc00|38qs0|6uao0|25p80|6hc00|38qs0|8a5c0|9d1c0|9d9o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|s3400|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|5gyl40|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d440|9cyk0|9d440|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9cyk0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/London',
    'title': 'London',
    'winIndex': 26,
    'offsets': [0, 1, 2],
    'offsetIndices': '0101010101010101010101010101010101010101010101010121212121210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-rzcns0|6uao0|9q000|8c000|9o5c0|9ruo0|9b6o0|9ew00|9b6o0|auqo0|88ao0|9ew00|8y800|a2yo0|a2yo0|7k800|asw00|8a5c0|asw00|8n400|a2yo0|8n400|9q000|902o0|afxc0|8n400|a2yo0|8n400|9q000|902o0|a2yo0|8n400|a2yo0|8n400|9q000|9d1c0|a2yo0|8n400|9q000|902o0|a2yo0|8n400|a2yo0|8n400|9q000|902o0|a2yo0|b5uo0|51hc0|mbmk0|51hc0|c8qo0|6hc00|c8qo0|6uao0|bvs00|8n400|a4tc0|5clc0|4bms0|9q000|902o0|8a5c0|1frw0|64dc0|4bms0|6uao0|bvs00|7x6o0|asw00|8n400|9q000|902o0|9q000|9d1c0|9q000|902o0|8n400|9q000|902o0|a2yo0|8n400|afxc0|8n400|9q000|902o0|a2yo0|8n400|a2yo0|8n400|9q000|902o0|902o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|bitc0|5reo0|1xhuo0|779c0|bitc0|779c0|bitc0|779c0|bitc0|779c0|bitc0|7k800|b5uo0|7k800|b5uo0|7k800|bitc0|779c0|bitc0|779c0|bitc0|7x3w0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|8a5c0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Luxembourg',
    'title': 'Luxembourg',
    'winIndex': 27,
    'offsets': [0.41000000000000003, 1, 2, 0],
    'offsetIndices': '0121212131313131313131313131313131313131313131313131212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-y89550|68l290|75hg0|ast80|796s0|at1k0|7x6o0|3lh40|4zmo0|b6300|6u2c0|cytk0|7at40|bktk0|7rh40|a31g0|a2vw0|8n9k0|8zx40|9q2s0|9et80|9b9g0|a2vw0|8n6s0|9px80|905g0|a2vw0|905g0|a2vw0|8ncc0|9q000|902o0|a2yo0|8n400|9d1c0|9d1c0|902o0|a2yo0|9d1c0|9d1c0|902o0|9q000|a2yo0|8n400|9d1c0|9d1c0|902o0|9q000|a2yo0|b5uo0|51hc0|42ao0|1aeak0|7k800|9q000|9d1c0|8n400|a2yo0|8l9c0|clpc0|79400|fwu800|902o0|9q000|9d1c0|9d1c0|9d1c0|9q000|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Madrid',
    'title': 'Madrid',
    'winIndex': 62,
    'offsets': [0, 1, 2],
    'offsetIndices': '01010101010101010101010121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-rhcqs0|7x6o0|9tpc0|8y800|9b6o0|9gqo0|2d2yo0|8so00|st1c0|8n400|9q000|902o0|a2yo0|902o0|a2yo0|8n400|3zb9c0|6uao0|8so00|9xeo0|a2yo0|902o0|8a5c0|13yt80|69xc0|bq800|8oyo0|a1400|95mo0|9kg00|8n6s0|a2vw0|8oyo0|1ck5c0|7tk40|ct07w0|905g0|a2vw0|8n6s0|8zzw0|9d440|9px80|905g0|9rrw0|9b9g0|9d6w0|9d1c0|9q000|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Malta',
    'title': 'Malta',
    'winIndex': 27,
    'offsets': [1, 2],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-ryotg0|66800|9d1c0|9d1c0|8a5c0|asw00|7k800|b5uo0|8n400|9d1c0|aau000|18r9k0|7k800|9q000|9d1c0|9d1c0|9d1c0|8j940|9f1k0|afxc0|89zs0|afxc0|7kdk0|b5uo0|979rs0|6h980|cls40|64ak0|cls40|64ak0|cyqs0|64ak0|cls40|64ak0|c8tg0|6hc00|clpc0|6h980|9b9g0|9d1c0|ahs00|7m2o0|b45k0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|asys0|7x3w0|a4w40|8y580|9q2s0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Minsk',
    'title': 'Minsk',
    'winIndex': 96,
    'offsets': [1.8333333333333333, 2, 3, 1, 4],
    'offsetIndices': '012131312424242424242424242212121212121212121212121212121212121212122',
    'untils': '-nu113c|379zjc|5r1mk0|pbf40|7k800|9q000|9d1c0|4oac0|j6dmk0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|sg2o0|9d440|9cvs0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbx40|Infinity'
}, {
    'id': 'Europe/Monaco',
    'title': 'Monaco',
    'winIndex': 27,
    'offsets': [0.15583333333333332, 0, 1, 2],
    'offsetIndices': '01212121212121212121212121212121212121212121212121232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-uozn3l|2qx1nl|5luo0|8y800|a4tc0|7vc00|auqo0|7idc0|b7pc0|6sg00|cyo00|7ayo0|bko00|7rmo0|a2yo0|bvs00|6uao0|902o0|9q000|9d1c0|9d1c0|a2yo0|8n400|9q000|902o0|a2yo0|902o0|a2yo0|8n400|9q000|902o0|a2yo0|8n400|9d1c0|9d1c0|902o0|a2yo0|9d1c0|9d1c0|902o0|9q000|a2yo0|8n400|9d1c0|9d1c0|902o0|9q000|a2yo0|b5uo0|51po0|mdbo0|7x3w0|7x9g0|c8w80|7k800|9q000|9d1c0|9nzs0|922w0|8l9c0|fxlx80|9cyk0|9q5k0|902o0|9q000|9d1c0|9d1c0|9d1c0|9q000|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Moscow',
    'title': 'Moscow',
    'winIndex': 58,
    'offsets': [2.504722222222222, 2.5219444444444443, 3.5219444444444443, 4.521944444444444, 4, 3, 5, 2],
    'offsetIndices': '012132345464575454545454545454545455754545454545454545454545454545454545454545',
    'untils': '-rx5dmh|ipzua|97hc0|7yyk0|5i840|d9p80|1jpk0|2d2k7|s8o00|1qvw0|8fpc0|1jms0|is040|412as0|qi27w0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|5reo0|3ljw0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Europe/Oslo',
    'title': 'Oslo',
    'winIndex': 27,
    'offsets': [1, 2],
    'offsetIndices': '010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-rzayo0|6qfs0|cgcqo0|15tsc0|7k800|9q000|9d1c0|9d1c0|9d1c0|9d1c0|70q5c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|b5uo0|7k800|7law00|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Paris',
    'title': 'Paris',
    'winIndex': 62,
    'offsets': [0.15583333333333332, 0, 1, 2],
    'offsetIndices': '0121212121212121212121212121212121212121212121212123232332323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-uozn1x|2qx1lx|5luo0|8y800|a4tc0|7vc00|auqo0|7idc0|b7pc0|6sg00|cyo00|7ayo0|bko00|7rmo0|a2yo0|bvs00|6uao0|902o0|9q000|9d1c0|9d1c0|a2yo0|8n400|9q000|902o0|a2yo0|902o0|a2yo0|8n400|9q000|902o0|a2yo0|8n400|9d1c0|9d1c0|902o0|a2yo0|9d1c0|9d1c0|902o0|9q000|a2yo0|8n400|9d1c0|9d1c0|902o0|9q000|a2yo0|b5uo0|51po0|5p8w0|18rcc0|7k800|9q000|9d1c0|7efo0|29k40|922w0|8l9c0|fxlx80|9cyk0|9q5k0|902o0|9q000|9d1c0|9d1c0|9d1c0|9q000|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Prague',
    'title': 'Prague',
    'winIndex': 60,
    'offsets': [1, 2],
    'offsetIndices': '010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-s0e080|7ves0|a4yw0|7x6o0|asw00|7x6o0|b8qdc0|1cm000|7k800|9q000|9d1c0|8l9c0|afxc0|bitc0|8oyo0|7vc00|a2yo0|8n400|a2yo0|8n400|9o5c0|91xc0|fe6000|9d1c0|9q000|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Riga',
    'title': 'Riga',
    'winIndex': 59,
    'offsets': [1.6094444444444445, 2.6094444444444442, 2, 3, 1, 4],
    'offsetIndices': '010102324242435353535353535353323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-qznlky|7x6o0|a4tc0|2mg00|3myns0|7fhlky|gz180|p5v40|7k800|9q000|9d1c0|9d1c0|k7s0|j14ns0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d440|asw00|7x6o0|asw00|7x6o0|b5uo0|qaao0|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Rome',
    'title': 'Rome',
    'winIndex': 27,
    'offsets': [1, 2],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-ryotg0|66800|9d1c0|9d1c0|8a5c0|asw00|7k800|b5uo0|8n400|9d1c0|aau000|18r9k0|7k800|9q000|9d1c0|8l3s0|a4yw0|8j940|9f1k0|afxc0|89zs0|afxc0|7kdk0|b5uo0|979rs0|6h980|cls40|64ak0|cls40|64ak0|cyqs0|64ak0|cls40|64ak0|c8tg0|6hc00|clpc0|6h980|cls40|64ak0|c8tg0|6h980|cls40|64dc0|clpc0|64dc0|c8qo0|6hc00|clpc0|6hc00|c8qo0|6hc00|9q5k0|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Samara',
    'title': 'Samara',
    'winIndex': 58,
    'offsets': [3.338888888888889, 3, 4, 5],
    'offsetIndices': '012232323232323232322121112323232323232323232323232323232323232212',
    'untils': '-qcx7pw|5q63dw|2egvw0|o3lc00|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9d1c0|9q000|9d1c0|9d440|12w00|89zs0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5xg0|7k800|Infinity'
}, {
    'id': 'Europe/Simferopol',
    'title': 'Simferopol',
    'winIndex': 58,
    'offsets': [2.2666666666666666, 2, 3, 1, 4],
    'offsetIndices': '012131312424242424242424242121212424242212121212121212121212121212121212142',
    'untils': '-nu12ao|37a0qo|5xiyk0|iu340|7k800|9q000|9d1c0|iac0|jajmk0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|eeio0|wrjw0|9cyk0|9d440|9cyk0|9d440|1sqk0|7k580|9d440|9cyk0|9q2s0|at4c0|7x9g0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x3w0|asqg0|Infinity'
}, {
    'id': 'Europe/Sofia',
    'title': 'Sofia',
    'winIndex': 59,
    'offsets': [2, 1, 3],
    'offsetIndices': '01010102020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020',
    'untils': '-e6dzw0|7k800|9q000|9d1c0|9d1c0|9d440|hqq240|9eys0|9o2k0|92040|9o2k0|90880|9pug0|90b00|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9cvs0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9q2s0|ast80|7xhs0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Stockholm',
    'title': 'Stockholm',
    'winIndex': 27,
    'offsets': [1, 2],
    'offsetIndices': '01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-rzo2w0|75hg0|x5bew0|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Tallinn',
    'title': 'Tallinn',
    'winIndex': 59,
    'offsets': [1.65, 1, 2, 3, 4],
    'offsetIndices': '012102321212343434343434343433232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232',
    'untils': '-r3exx0|3re10|7x6o0|et6g0|ygov0|a1zgd0|ktx80|l94g0|7k800|9q000|9d1c0|8uac0|j27mk0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asys0|7x6o0|b5uo0|19dc00|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Tirane',
    'title': 'Tirane',
    'winIndex': 60,
    'offsets': [1.3222222222222222, 1, 2],
    'offsetIndices': '01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-t85vo8|dt2gw8|18pew0|7k800|m800|g7ot40|7rjw0|autg0|7x3w0|ayis0|7x3w0|b5xg0|7k580|b42s0|7lzw0|b42s0|7lzw0|b42s0|7x3w0|ahus0|7x3w0|b5xg0|7x3w0|a4w40|8jbw0|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Uzhgorod',
    'title': 'Uzhgorod',
    'winIndex': 59,
    'offsets': [1, 2, 3, 4],
    'offsetIndices': '010101023232323232323232320121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-fizzw0|1cm000|7k800|9q000|9d1c0|al900|cnms0|int140|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|eeio0|e1sc0|iprk0|9cyk0|9d440|9cyk0|9d440|9cyk0|9dcg0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Vienna',
    'title': 'Vienna',
    'winIndex': 27,
    'offsets': [1, 2],
    'offsetIndices': '0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-s0e080|7ves0|a4yw0|7x6o0|asw00|7x6o0|t6000|8a5c0|a7a800|1cm000|7k800|9q000|9d1c0|9d1c0|9d1c0|iio0|ivmo0|902o0|9d1c0|9d1c0|a2yo0|8n400|gfyyg0|8zzw0|9d9o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Vilnius',
    'title': 'Vilnius',
    'winIndex': 59,
    'offsets': [1.4, 1.5933333333333333, 1, 2, 3, 4],
    'offsetIndices': '012324323234545454545454545443434343434343434332334343434343434343434343434343434343434343434343434343434343434343434343',
    'untils': '-rns980|1g224o|e75nc|4kqk0|acbs40|gpp40|pits0|7k800|9q000|9d1c0|65zo0|j4vx80|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x9g0|asw00|7x6o0|b5uo0|1s3eo0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Volgograd',
    'title': 'Volgograd',
    'winIndex': 58,
    'offsets': [2.961111111111111, 3, 4, 5],
    'offsetIndices': '011223232323232323221212122121212121212121212121212121212121212121',
    'untils': '-q3cw84|2qrjw4|2pu800|gdt980|a48yo0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9d1c0|9d1c0|9d1c0|9q000|9d1c0|ipzw0|9d440|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|1vbzw0|Infinity'
}, {
    'id': 'Europe/Warsaw',
    'title': 'Warsaw',
    'winIndex': 51,
    'offsets': [1.4, 1, 2, 3],
    'offsetIndices': '012121223212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-se9yk0|dvyc0|7ves0|a4yw0|7x6o0|asw00|7x6o0|aunw0|7x6o0|1evbs0|9fcwc0|18cao0|7k800|9q000|9d1c0|9gnw0|an980|9kd80|8fs40|922w0|ar1c0|7x6o0|a2yo0|8n400|9q000|902o0|4013w0|64dc0|9d1c0|9d1c0|clpc0|6hc00|9d1c0|9d1c0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|clpc0|64dc0|6j4tc0|902o0|9q000|9d1c0|9d1c0|9d1c0|9q000|902o0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d440|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Zaporozhye',
    'title': 'Zaporozhye',
    'winIndex': 59,
    'offsets': [2.3333333333333335, 2, 3, 1, 4],
    'offsetIndices': '01213132424242424242424242422121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-nu12hc|37a0xc|5u1180|mc0g0|7k800|9q000|12qg0|jjc7s0|9et80|9d440|9et80|9d440|9et80|9eys0|9d6w0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9cvs0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9dcg0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Europe/Zurich',
    'title': 'Zurich',
    'winIndex': 27,
    'offsets': [1, 2],
    'offsetIndices': '01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-eyh6o0|7x6o0|asw00|7x6o0|k2zus0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9d1c0|9q000|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|7x6o0|b5uo0|7k800|b5uo0|7k800|b5uo0|7k800|b5uo0|7x6o0|asw00|7x6o0|asw00|Infinity'
}, {
    'id': 'Indian/Chagos',
    'title': 'Chagos',
    'winIndex': 21,
    'offsets': [4.827777777777778, 5, 6],
    'offsetIndices': '012',
    'untils': '-wvpc2s|1ag64us|Infinity'
}, {
    'id': 'Indian/Christmas',
    'title': 'Christmas',
    'winIndex': 6,
    'offsets': [7],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Indian/Cocos',
    'title': 'Cocos',
    'winIndex': 87,
    'offsets': [6.5],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Indian/Kerguelen',
    'title': 'Kerguelen',
    'winIndex': 17,
    'offsets': [0, 5],
    'offsetIndices': '01',
    'untils': '-afrs00|Infinity'
}, {
    'id': 'Indian/Mahe',
    'title': 'Mahe',
    'winIndex': 97,
    'offsets': [3.6966666666666668, 4],
    'offsetIndices': '01',
    'untils': '-x6pjlo|Infinity'
}, {
    'id': 'Indian/Maldives',
    'title': 'Maldives',
    'winIndex': 17,
    'offsets': [4.9, 5],
    'offsetIndices': '01',
    'untils': '-57x6y0|Infinity'
}, {
    'id': 'Indian/Mauritius',
    'title': 'Mauritius',
    'winIndex': 97,
    'offsets': [3.8333333333333335, 4, 5],
    'offsetIndices': '012121',
    'untils': '-wvp9bc|13jnu7c|8bx80|dd0wc0|7x3w0|Infinity'
}, {
    'id': 'Indian/Reunion',
    'title': 'Reunion',
    'winIndex': 97,
    'offsets': [3.697777777777778, 4],
    'offsetIndices': '01',
    'untils': '-uks29s|Infinity'
}, {
    'id': 'MST7MDT',
    'title': 'MST7MDT',
    'winIndex': 15,
    'offsets': [-7, -6],
    'offsetIndices': '010101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0epo0|ast80|7x9g0|ast80|bmtus0|1tz5k0|2dvo0|b9gdg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'Pacific/Apia',
    'title': 'Apia',
    'winIndex': 98,
    'offsets': [-11.448888888888888, -11.5, -11, -10, 14, 13],
    'offsetIndices': '01232345454545454545454545454545454545454545454545454545454',
    'untils': '-usiiv4|kcrmt4|vp3la0|9odo0|902o0|4zbk0|4qog0|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|a2yo0|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|Infinity'
}, {
    'id': 'Pacific/Auckland',
    'title': 'Auckland',
    'winIndex': 8,
    'offsets': [11.5, 12.5, 12, 13],
    'offsetIndices': '01020202020202020202020202023232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323',
    'untils': '-m01p20|64ak0|biw40|7x5a0|asxe0|7x5a0|asxe0|7x5a0|asxe0|8a3y0|afyq0|8a3y0|afyq0|afvy0|7x820|asum0|7x820|asum0|7x820|asum0|7x820|asum0|7x820|b5ta0|7k9e0|b5ta0|7x820|hsl2m0|5reo0|clpc0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6hc00|c8qo0|6uao0|c8qo0|6hc00|b5uo0|8a5c0|afxc0|8a5c0|afxc0|8a5c0|afxc0|8n400|a2yo0|8n400|a2yo0|8n400|a2yo0|8n400|afxc0|8a5c0|afxc0|8a5c0|afxc0|8n400|a2yo0|8n400|a2yo0|8n400|afxc0|8a5c0|afxc0|8a5c0|afxc0|8n400|a2yo0|8n400|a2yo0|8n400|a2yo0|8n400|a2yo0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|a2yo0|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|902o0|9q000|9d1c0|9q000|902o0|9q000|902o0|Infinity'
}, {
    'id': 'Pacific/Chuuk',
    'title': 'Chuuk',
    'winIndex': 50,
    'offsets': [10],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Pacific/Efate',
    'title': 'Efate',
    'winIndex': 48,
    'offsets': [11.22111111111111, 11, 12],
    'offsetIndices': '0121212121212121212121',
    'untils': '-u964i4|11f4ba4|9cyk0|awo40|7tek0|9q2s0|8zzw0|9q2s0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9q2s0|64ak0|e1ms0|4ofw0|Infinity'
}, {
    'id': 'Pacific/Enderbury',
    'title': 'Enderbury',
    'winIndex': 94,
    'offsets': [-12, -11, 13],
    'offsetIndices': '012',
    'untils': '535io0|7ykl80|Infinity'
}, {
    'id': 'Pacific/Fakaofo',
    'title': 'Fakaofo',
    'winIndex': 94,
    'offsets': [-11, 13],
    'offsetIndices': '01',
    'untils': 'lx0jw0|Infinity'
}, {
    'id': 'Pacific/Fiji',
    'title': 'Fiji',
    'winIndex': 99,
    'offsets': [11.928888888888888, 12, 13],
    'offsetIndices': '0121212121212121212121212121212121212121212121212121212121212121',
    'untils': '-sa2x4w|17bs00w|64dc0|cyo00|5reo0|53a5c0|64dc0|asw00|6uao0|bvs00|4oio0|e1k00|4oio0|eeio0|4bh80|erk40|3ylc0|erhc0|3ylc0|f4g00|3lmo0|f4g00|3ylc0|erhc0|3ylc0|erhc0|3ylc0|erhc0|3ylc0|f4g00|3lmo0|f4g00|3lmo0|f4g00|3ylc0|erhc0|3ylc0|erhc0|3ylc0|erhc0|3ylc0|f4g00|3lmo0|f4g00|3ylc0|erhc0|3ylc0|erhc0|3ylc0|erhc0|3ylc0|f4g00|3lmo0|f4g00|3lmo0|f4g00|3ylc0|erhc0|3ylc0|erhc0|3ylc0|erhc0|3ylc0|Infinity'
}, {
    'id': 'Pacific/Funafuti',
    'title': 'Funafuti',
    'winIndex': 44,
    'offsets': [12],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Pacific/Galapagos',
    'title': 'Galapagos',
    'winIndex': 67,
    'offsets': [-5.973333333333333, -5, -6],
    'offsetIndices': '012',
    'untils': '-kcr62o|spdryo|Infinity'
}, {
    'id': 'Pacific/Guadalcanal',
    'title': 'Guadalcanal',
    'winIndex': 48,
    'offsets': [10.663333333333332, 11],
    'offsetIndices': '01',
    'untils': '-tvowac|Infinity'
}, {
    'id': 'Pacific/Guam',
    'title': 'Guam',
    'winIndex': 50,
    'offsets': [10],
    'offsetIndices': '00',
    'untils': 'g5z2w0|Infinity'
}, {
    'id': 'Pacific/Honolulu',
    'title': 'Honolulu',
    'winIndex': 57,
    'offsets': [-10.5, -9.5, -10],
    'offsetIndices': '010102',
    'untils': '-j50la0|13l00|4jvb00|1wd180|votg0|Infinity'
}, {
    'id': 'Pacific/Kiritimati',
    'title': 'Kiritimati',
    'winIndex': 95,
    'offsets': [-10.666666666666666, -10, 14],
    'offsetIndices': '012',
    'untils': '535eyo|7ykm5c|Infinity'
}, {
    'id': 'Pacific/Kosrae',
    'title': 'Kosrae',
    'winIndex': 48,
    'offsets': [11, 12],
    'offsetIndices': '010',
    'untils': '-4r7w0|f9l3w0|Infinity'
}, {
    'id': 'Pacific/Kwajalein',
    'title': 'Kwajalein',
    'winIndex': 44,
    'offsets': [11, -12, 12],
    'offsetIndices': '012',
    'untils': '-4r7w0|cgtbw0|Infinity'
}, {
    'id': 'Pacific/Majuro',
    'title': 'Majuro',
    'winIndex': 44,
    'offsets': [11, 12],
    'offsetIndices': '01',
    'untils': '-4r7w0|Infinity'
}, {
    'id': 'Pacific/Midway',
    'title': 'Midway',
    'winIndex': 49,
    'link': 530
}, {
    'id': 'Pacific/Nauru',
    'title': 'Nauru',
    'winIndex': 44,
    'offsets': [11.127777777777776, 11.5, 9, 12],
    'offsetIndices': '01213',
    'untils': '-pjxiws|b1kxms|19h8a0|i43qe0|Infinity'
}, {
    'id': 'Pacific/Niue',
    'title': 'Niue',
    'winIndex': 49,
    'offsets': [-11.333333333333334, -11.5, -11],
    'offsetIndices': '012',
    'untils': '-9wyz6o|ehcj4o|Infinity'
}, {
    'id': 'Pacific/Noumea',
    'title': 'Noumea',
    'winIndex': 48,
    'offsets': [11.096666666666666, 11, 12],
    'offsetIndices': '01212121',
    'untils': '-u9645o|ye0ixo|4dbw0|ecqs0|4f6k0|99p700|4oio0|Infinity'
}, {
    'id': 'Pacific/Pago_Pago',
    'title': 'Pago Pago',
    'winIndex': 49,
    'offsets': [-11.379999999999999, -11],
    'offsetIndices': '0111',
    'untils': '-usij20|tcsey0|8p4800|Infinity'
}, {
    'id': 'Pacific/Palau',
    'title': 'Palau',
    'winIndex': 43,
    'offsets': [9],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Pacific/Pohnpei',
    'title': 'Pohnpei',
    'winIndex': 48,
    'offsets': [11],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Pacific/Port_Moresby',
    'title': 'Port Moresby',
    'winIndex': 50,
    'offsets': [10],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Pacific/Rarotonga',
    'title': 'Rarotonga',
    'winIndex': 57,
    'offsets': [-10.5, -9.5, -10],
    'offsetIndices': '012121212121212121212121212',
    'untils': '4mj960|5rbw0|c8s20|6ham0|c8s20|6ham0|c8s20|6u9a0|c8s20|6ham0|c8s20|6ham0|c8s20|6ham0|c8s20|6ham0|c8s20|6ham0|c8s20|6u9a0|c8s20|6ham0|c8s20|6ham0|c8s20|6ham0|Infinity'
}, {
    'id': 'Pacific/Saipan',
    'title': 'Saipan',
    'winIndex': 50,
    'link': 520
}, {
    'id': 'Pacific/Tahiti',
    'title': 'Tahiti',
    'winIndex': 57,
    'offsets': [-9.97111111111111, -10],
    'offsetIndices': '01',
    'untils': '-tvnayw|Infinity'
}, {
    'id': 'Pacific/Tarawa',
    'title': 'Tarawa',
    'winIndex': 44,
    'offsets': [12],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Pacific/Tongatapu',
    'title': 'Tongatapu',
    'winIndex': 94,
    'offsets': [12.333333333333334, 13, 14],
    'offsetIndices': '01212121',
    'untils': '-f4vrlc|uo2edc|8fpc0|bvs00|4bh80|eelg0|4bh80|Infinity'
}, {
    'id': 'Pacific/Wake',
    'title': 'Wake',
    'winIndex': 44,
    'offsets': [12],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'Pacific/Wallis',
    'title': 'Wallis',
    'winIndex': 44,
    'offsets': [12],
    'offsetIndices': '0',
    'untils': 'Infinity'
}, {
    'id': 'PST8PDT',
    'title': 'PST8PDT',
    'winIndex': 11,
    'offsets': [-8, -7],
    'offsetIndices': '010101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010',
    'untils': '-r0emw0|ast80|7x9g0|ast80|bmtus0|1tz2s0|2dyg0|b9gdg0|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|9d440|9cyk0|9d440|9cyk0|3lpg0|f4d80|64g40|clmk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|9d440|9px80|905g0|9px80|9d440|9cyk0|9d440|9cyk0|9d440|9cyk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|8a840|afuk0|8a840|afuk0|8a840|ast80|7x9g0|ast80|7x9g0|ast80|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6udg0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|6hes0|c8nw0|Infinity'
}, {
    'id': 'Australia/Eucla',
    'title': 'Eucla',
    'winIndex': 100,
    'offsets': [8.591111111111112, 8.75, 9.75],
    'offsetIndices': '01212121212121212121',
    'untils': '-12nxx74|b053ls|49s2c|cxfms0|4h180|9d440|9cyk0|ghf1g0|6hc00|4ir9c0|6hc00|40r400|5eg00|7p9hc0|5reo0|b5uo0|7x6o0|asw00|7x6o0|Infinity'
}, {
    'id': 'Australia/Lord_Howe',
    'title': 'Eucla',
    'winIndex': 101,
    'offsets': [10.605555555555556, 10, 10.5, 11.5, 11],
    'offsetIndices': '01232323232424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424',
    'untils': '-133j6sk|18x8f0k|c8uu0|6u7w0|c8tg0|6h980|c8tg0|6h980|c8tg0|6h980|c8tg0|777y0|b5w20|7k6m0|biuq0|7k6m0|biuq0|777y0|biuq0|6ham0|c8s20|6ham0|c8s20|6ham0|c8s20|6u9a0|c8s20|6ham0|c8s20|6ham0|c8s20|7x5a0|asxe0|7x5a0|asxe0|7x5a0|asxe0|7x5a0|b5w20|7k6m0|7x820|asum0|b5w20|7x5a0|asxe0|7x5a0|asxe0|7x5a0|b5w20|7k6m0|b5w20|7x5a0|asxe0|7k6m0|b5w20|8a3y0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9q1e0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9q1e0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9pym0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9q1e0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9d2q0|9czy0|9q1e0|9czy0|9d2q0|9czy0|9d2q0|Infinity'
}];

module.exports = {
    displayNames: displayNames,
    timezones: timezones
};
