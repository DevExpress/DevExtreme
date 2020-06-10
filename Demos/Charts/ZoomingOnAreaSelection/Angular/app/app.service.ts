import { Injectable } from '@angular/core';

export class BirthLife {
    year: number;
    country: string;
    birth_rate: number;
    life_exp: number;
}

let birthLife: BirthLife[] =  [
    {
        "year": 1970,
        "country": "Afghanistan",
        "birth_rate": 51.648,
        "life_exp": 36.678
    },
    {
        "year": 1970,
        "country": "Albania",
        "birth_rate": 31.821,
        "life_exp": 66.933
    },
    {
        "year": 1970,
        "country": "Algeria",
        "birth_rate": 47.021,
        "life_exp": 50.369
    },
    {
        "year": 1970,
        "country": "Angola",
        "birth_rate": 53.375,
        "life_exp": 37.047
    },
    {
        "year": 1970,
        "country": "Antigua and Barbuda",
        "birth_rate": 30.762,
        "life_exp": 65.897
    },
    {
        "year": 1970,
        "country": "Argentina",
        "birth_rate": 22.759,
        "life_exp": 66.449
    },
    {
        "year": 1970,
        "country": "Armenia",
        "birth_rate": 22.694,
        "life_exp": 70.143
    },
    {
        "year": 1970,
        "country": "Aruba",
        "birth_rate": 24.099,
        "life_exp": 69.14
    },
    {
        "year": 1970,
        "country": "Australia",
        "birth_rate": 20.6,
        "life_exp": 71.0185365853659
    },
    {
        "year": 1970,
        "country": "Austria",
        "birth_rate": 15,
        "life_exp": 69.9146341463415
    },
    {
        "year": 1970,
        "country": "Azerbaijan",
        "birth_rate": 32.003,
        "life_exp": 63.141
    },
    {
        "year": 1970,
        "country": "Bahamas, The",
        "birth_rate": 26.348,
        "life_exp": 65.943
    },
    {
        "year": 1970,
        "country": "Bahrain",
        "birth_rate": 38.264,
        "life_exp": 63.448
    },
    {
        "year": 1970,
        "country": "Bangladesh",
        "birth_rate": 47.832,
        "life_exp": 47.523
    },
    {
        "year": 1970,
        "country": "Barbados",
        "birth_rate": 21.746,
        "life_exp": 65.569
    },
    {
        "year": 1970,
        "country": "Belarus",
        "birth_rate": 15.961,
        "life_exp": 70.079243902439
    },
    {
        "year": 1970,
        "country": "Belgium",
        "birth_rate": 14.7,
        "life_exp": 70.9719512195122
    },
    {
        "year": 1970,
        "country": "Belize",
        "birth_rate": 41.927,
        "life_exp": 65.566
    },
    {
        "year": 1970,
        "country": "Benin",
        "birth_rate": 46.835,
        "life_exp": 42.152
    },
    {
        "year": 1970,
        "country": "Bermuda",
        "birth_rate": 20.3,
        "life_exp": 70.29
    },
    {
        "year": 1970,
        "country": "Bhutan",
        "birth_rate": 49.178,
        "life_exp": 39.635
    },
    {
        "year": 1970,
        "country": "Bolivia",
        "birth_rate": 42.261,
        "life_exp": 45.671
    },
    {
        "year": 1970,
        "country": "Bosnia and Herzegovina",
        "birth_rate": 23.626,
        "life_exp": 66.187
    },
    {
        "year": 1970,
        "country": "Botswana",
        "birth_rate": 45.998,
        "life_exp": 54.609
    },
    {
        "year": 1970,
        "country": "Brazil",
        "birth_rate": 35.31,
        "life_exp": 59.154
    },
    {
        "year": 1970,
        "country": "Brunei Darussalam",
        "birth_rate": 36.653,
        "life_exp": 66.928
    },
    {
        "year": 1970,
        "country": "Bulgaria",
        "birth_rate": 16.3,
        "life_exp": 71.2563414634146
    },
    {
        "year": 1970,
        "country": "Burkina Faso",
        "birth_rate": 47.464,
        "life_exp": 39.095
    },
    {
        "year": 1970,
        "country": "Burundi",
        "birth_rate": 47.263,
        "life_exp": 43.829
    },
    {
        "year": 1970,
        "country": "Cabo Verde",
        "birth_rate": 41.611,
        "life_exp": 53.669
    },
    {
        "year": 1970,
        "country": "Cambodia",
        "birth_rate": 43.026,
        "life_exp": 41.566
    },
    {
        "year": 1970,
        "country": "Cameroon",
        "birth_rate": 44.86,
        "life_exp": 46.104
    },
    {
        "year": 1970,
        "country": "Canada",
        "birth_rate": 17.4,
        "life_exp": 72.7004878048781
    },
    {
        "year": 1970,
        "country": "Central African Republic",
        "birth_rate": 43.131,
        "life_exp": 41.946
    },
    {
        "year": 1970,
        "country": "Chad",
        "birth_rate": 46.916,
        "life_exp": 41.332
    },
    {
        "year": 1970,
        "country": "Channel Islands",
        "birth_rate": 14.786,
        "life_exp": 71.823
    },
    {
        "year": 1970,
        "country": "Chile",
        "birth_rate": 29.774,
        "life_exp": 62.311
    },
    {
        "year": 1970,
        "country": "China",
        "birth_rate": 33.43,
        "life_exp": 59.085
    },
    {
        "year": 1970,
        "country": "Colombia",
        "birth_rate": 37.506,
        "life_exp": 60.91
    },
    {
        "year": 1970,
        "country": "Comoros",
        "birth_rate": 45.509,
        "life_exp": 45.642
    },
    {
        "year": 1970,
        "country": "Congo, Dem. Rep.",
        "birth_rate": 46.647,
        "life_exp": 43.915
    },
    {
        "year": 1970,
        "country": "Congo, Rep.",
        "birth_rate": 43.267,
        "life_exp": 53.38
    },
    {
        "year": 1970,
        "country": "Costa Rica",
        "birth_rate": 32.832,
        "life_exp": 66.439
    },
    {
        "year": 1970,
        "country": "Cote d'Ivoire",
        "birth_rate": 52.447,
        "life_exp": 43.695
    },
    {
        "year": 1970,
        "country": "Croatia",
        "birth_rate": 13.8,
        "life_exp": 68.2004878048781
    },
    {
        "year": 1970,
        "country": "Cuba",
        "birth_rate": 29.405,
        "life_exp": 69.812
    },
    {
        "year": 1970,
        "country": "Cyprus",
        "birth_rate": 19.107,
        "life_exp": 72.576
    },
    {
        "year": 1970,
        "country": "Czech Republic",
        "birth_rate": 15,
        "life_exp": 69.440243902439
    },
    {
        "year": 1970,
        "country": "Denmark",
        "birth_rate": 14.4,
        "life_exp": 73.3434146341463
    },
    {
        "year": 1970,
        "country": "Djibouti",
        "birth_rate": 45.106,
        "life_exp": 49.16
    },
    {
        "year": 1970,
        "country": "Dominican Republic",
        "birth_rate": 41.75,
        "life_exp": 58.468
    },
    {
        "year": 1970,
        "country": "Ecuador",
        "birth_rate": 41.044,
        "life_exp": 57.783
    },
    {
        "year": 1970,
        "country": "Egypt, Arab Rep.",
        "birth_rate": 41.939,
        "life_exp": 52.155
    },
    {
        "year": 1970,
        "country": "El Salvador",
        "birth_rate": 42.824,
        "life_exp": 54.987
    },
    {
        "year": 1970,
        "country": "Equatorial Guinea",
        "birth_rate": 42.132,
        "life_exp": 39.738
    },
    {
        "year": 1970,
        "country": "Eritrea",
        "birth_rate": 46.624,
        "life_exp": 43.157
    },
    {
        "year": 1970,
        "country": "Estonia",
        "birth_rate": 15.8,
        "life_exp": 69.9370975609756
    },
    {
        "year": 1970,
        "country": "Eswatini",
        "birth_rate": 49.298,
        "life_exp": 48.041
    },
    {
        "year": 1970,
        "country": "Ethiopia",
        "birth_rate": 48.076,
        "life_exp": 42.944
    },
    {
        "year": 1970,
        "country": "Fiji",
        "birth_rate": 33.899,
        "life_exp": 59.857
    },
    {
        "year": 1970,
        "country": "Finland",
        "birth_rate": 14,
        "life_exp": 70.179512195122
    },
    {
        "year": 1970,
        "country": "France",
        "birth_rate": 17,
        "life_exp": 71.6585365853659
    },
    {
        "year": 1970,
        "country": "French Polynesia",
        "birth_rate": 35.14,
        "life_exp": 60.184
    },
    {
        "year": 1970,
        "country": "Gabon",
        "birth_rate": 37.074,
        "life_exp": 46.698
    },
    {
        "year": 1970,
        "country": "Gambia, The",
        "birth_rate": 50.313,
        "life_exp": 37.824
    },
    {
        "year": 1970,
        "country": "Georgia",
        "birth_rate": 19.874,
        "life_exp": 67.452
    },
    {
        "year": 1970,
        "country": "Germany",
        "birth_rate": 13.4,
        "life_exp": 70.6397804878049
    },
    {
        "year": 1970,
        "country": "Ghana",
        "birth_rate": 46.702,
        "life_exp": 49.339
    },
    {
        "year": 1970,
        "country": "Greece",
        "birth_rate": 16.5,
        "life_exp": 70.9036341463415
    },
    {
        "year": 1970,
        "country": "Grenada",
        "birth_rate": 28.084,
        "life_exp": 63.843
    },
    {
        "year": 1970,
        "country": "Guam",
        "birth_rate": 31.779,
        "life_exp": 65.662
    },
    {
        "year": 1970,
        "country": "Guatemala",
        "birth_rate": 45.324,
        "life_exp": 52.501
    },
    {
        "year": 1970,
        "country": "Guinea",
        "birth_rate": 45.302,
        "life_exp": 36.656
    },
    {
        "year": 1970,
        "country": "Guinea-Bissau",
        "birth_rate": 42.734,
        "life_exp": 41.538
    },
    {
        "year": 1970,
        "country": "Guyana",
        "birth_rate": 36.051,
        "life_exp": 61.789
    },
    {
        "year": 1970,
        "country": "Haiti",
        "birth_rate": 39.104,
        "life_exp": 47.215
    },
    {
        "year": 1970,
        "country": "Honduras",
        "birth_rate": 47.73,
        "life_exp": 52.523
    },
    {
        "year": 1970,
        "country": "Hong Kong SAR, China",
        "birth_rate": 20,
        "life_exp": 71.386512195122
    },
    {
        "year": 1970,
        "country": "Hungary",
        "birth_rate": 14.7,
        "life_exp": 69.1646341463415
    },
    {
        "year": 1970,
        "country": "Iceland",
        "birth_rate": 19.7,
        "life_exp": 73.9339024390244
    },
    {
        "year": 1970,
        "country": "India",
        "birth_rate": 39.145,
        "life_exp": 47.721
    },
    {
        "year": 1970,
        "country": "Indonesia",
        "birth_rate": 39.969,
        "life_exp": 54.537
    },
    {
        "year": 1970,
        "country": "Iran, Islamic Rep.",
        "birth_rate": 42.099,
        "life_exp": 50.856
    },
    {
        "year": 1970,
        "country": "Iraq",
        "birth_rate": 45.644,
        "life_exp": 58.199
    },
    {
        "year": 1970,
        "country": "Ireland",
        "birth_rate": 21.8,
        "life_exp": 71.0314390243903
    },
    {
        "year": 1970,
        "country": "Israel",
        "birth_rate": 26.1,
        "life_exp": 71.2134146341463
    },
    {
        "year": 1970,
        "country": "Italy",
        "birth_rate": 16.7,
        "life_exp": 71.5587804878049
    },
    {
        "year": 1970,
        "country": "Jamaica",
        "birth_rate": 35.184,
        "life_exp": 68.324
    },
    {
        "year": 1970,
        "country": "Japan",
        "birth_rate": 18.7,
        "life_exp": 71.950243902439
    },
    {
        "year": 1970,
        "country": "Jordan",
        "birth_rate": 50.793,
        "life_exp": 60.171
    },
    {
        "year": 1970,
        "country": "Kazakhstan",
        "birth_rate": 25.607,
        "life_exp": 62.2764634146342
    },
    {
        "year": 1970,
        "country": "Kenya",
        "birth_rate": 50.735,
        "life_exp": 52.222
    },
    {
        "year": 1970,
        "country": "Kiribati",
        "birth_rate": 34.614,
        "life_exp": 54.384
    },
    {
        "year": 1970,
        "country": "Korea, Dem. People’s Rep.",
        "birth_rate": 36.881,
        "life_exp": 59.656
    },
    {
        "year": 1970,
        "country": "Korea, Rep.",
        "birth_rate": 31.2,
        "life_exp": 62.1634146341463
    },
    {
        "year": 1970,
        "country": "Kuwait",
        "birth_rate": 48.251,
        "life_exp": 66.027
    },
    {
        "year": 1970,
        "country": "Kyrgyz Republic",
        "birth_rate": 32.318,
        "life_exp": 60.2449024390244
    },
    {
        "year": 1970,
        "country": "Lao PDR",
        "birth_rate": 43.028,
        "life_exp": 46.273
    },
    {
        "year": 1970,
        "country": "Latvia",
        "birth_rate": 14.6,
        "life_exp": 69.8353658536586
    },
    {
        "year": 1970,
        "country": "Lebanon",
        "birth_rate": 32.323,
        "life_exp": 66.067
    },
    {
        "year": 1970,
        "country": "Lesotho",
        "birth_rate": 42.756,
        "life_exp": 49.037
    },
    {
        "year": 1970,
        "country": "Liberia",
        "birth_rate": 49.055,
        "life_exp": 39.254
    },
    {
        "year": 1970,
        "country": "Libya",
        "birth_rate": 50.993,
        "life_exp": 56.052
    },
    {
        "year": 1970,
        "country": "Lithuania",
        "birth_rate": 17.7,
        "life_exp": 70.8043902439024
    },
    {
        "year": 1970,
        "country": "Luxembourg",
        "birth_rate": 13,
        "life_exp": 69.9834634146341
    },
    {
        "year": 1970,
        "country": "Macao SAR, China",
        "birth_rate": 11.569,
        "life_exp": 69.36
    },
    {
        "year": 1970,
        "country": "Macedonia, FYR",
        "birth_rate": 25.219,
        "life_exp": 66.301
    },
    {
        "year": 1970,
        "country": "Madagascar",
        "birth_rate": 48.047,
        "life_exp": 44.771
    },
    {
        "year": 1970,
        "country": "Malawi",
        "birth_rate": 53.782,
        "life_exp": 40.558
    },
    {
        "year": 1970,
        "country": "Malaysia",
        "birth_rate": 33.85,
        "life_exp": 64.445
    },
    {
        "year": 1970,
        "country": "Maldives",
        "birth_rate": 50.32,
        "life_exp": 44.241
    },
    {
        "year": 1970,
        "country": "Mali",
        "birth_rate": 50.357,
        "life_exp": 32.388
    },
    {
        "year": 1970,
        "country": "Malta",
        "birth_rate": 17.6,
        "life_exp": 71.33
    },
    {
        "year": 1970,
        "country": "Mauritania",
        "birth_rate": 46.109,
        "life_exp": 49.13
    },
    {
        "year": 1970,
        "country": "Mauritius",
        "birth_rate": 27.5,
        "life_exp": 63.1180487804878
    },
    {
        "year": 1970,
        "country": "Mexico",
        "birth_rate": 44.075,
        "life_exp": 61.369
    },
    {
        "year": 1970,
        "country": "Micronesia, Fed. Sts.",
        "birth_rate": 41.016,
        "life_exp": 61.634
    },
    {
        "year": 1970,
        "country": "Moldova",
        "birth_rate": 19.619,
        "life_exp": 65.045
    },
    {
        "year": 1970,
        "country": "Mongolia",
        "birth_rate": 44.044,
        "life_exp": 55.364
    },
    {
        "year": 1970,
        "country": "Montenegro",
        "birth_rate": 21.52,
        "life_exp": 69.929
    },
    {
        "year": 1970,
        "country": "Morocco",
        "birth_rate": 42.81,
        "life_exp": 52.572
    },
    {
        "year": 1970,
        "country": "Mozambique",
        "birth_rate": 48.309,
        "life_exp": 39.271
    },
    {
        "year": 1970,
        "country": "Myanmar",
        "birth_rate": 39.499,
        "life_exp": 50.989
    },
    {
        "year": 1970,
        "country": "Namibia",
        "birth_rate": 43.372,
        "life_exp": 52.338
    },
    {
        "year": 1970,
        "country": "Nepal",
        "birth_rate": 42.795,
        "life_exp": 40.544
    },
    {
        "year": 1970,
        "country": "Netherlands",
        "birth_rate": 18.3,
        "life_exp": 73.5856097560976
    },
    {
        "year": 1970,
        "country": "New Caledonia",
        "birth_rate": 35,
        "life_exp": 63.0292682926829
    },
    {
        "year": 1970,
        "country": "New Zealand",
        "birth_rate": 22.1,
        "life_exp": 71.2731707317073
    },
    {
        "year": 1970,
        "country": "Nicaragua",
        "birth_rate": 46.094,
        "life_exp": 53.685
    },
    {
        "year": 1970,
        "country": "Niger",
        "birth_rate": 56.951,
        "life_exp": 35.884
    },
    {
        "year": 1970,
        "country": "Nigeria",
        "birth_rate": 46.324,
        "life_exp": 40.97
    },
    {
        "year": 1970,
        "country": "Norway",
        "birth_rate": 16.7,
        "life_exp": 74.0880487804878
    },
    {
        "year": 1970,
        "country": "Oman",
        "birth_rate": 48.094,
        "life_exp": 50.31
    },
    {
        "year": 1970,
        "country": "Pakistan",
        "birth_rate": 43.111,
        "life_exp": 52.837
    },
    {
        "year": 1970,
        "country": "Panama",
        "birth_rate": 37.596,
        "life_exp": 65.529
    },
    {
        "year": 1970,
        "country": "Papua New Guinea",
        "birth_rate": 41.205,
        "life_exp": 48.512
    },
    {
        "year": 1970,
        "country": "Paraguay",
        "birth_rate": 37.309,
        "life_exp": 65.486
    },
    {
        "year": 1970,
        "country": "Peru",
        "birth_rate": 42.335,
        "life_exp": 53.457
    },
    {
        "year": 1970,
        "country": "Philippines",
        "birth_rate": 39.198,
        "life_exp": 60.832
    },
    {
        "year": 1970,
        "country": "Poland",
        "birth_rate": 16.8,
        "life_exp": 69.8682926829268
    },
    {
        "year": 1970,
        "country": "Portugal",
        "birth_rate": 20.8,
        "life_exp": 67.0731707317073
    },
    {
        "year": 1970,
        "country": "Puerto Rico",
        "birth_rate": 24.8,
        "life_exp": 71.5355365853659
    },
    {
        "year": 1970,
        "country": "Qatar",
        "birth_rate": 36.154,
        "life_exp": 68.313
    },
    {
        "year": 1970,
        "country": "Romania",
        "birth_rate": 21.1,
        "life_exp": 68.0564146341464
    },
    {
        "year": 1970,
        "country": "Russian Federation",
        "birth_rate": 14.671,
        "life_exp": 68.1336585365854
    },
    {
        "year": 1970,
        "country": "Rwanda",
        "birth_rate": 49.911,
        "life_exp": 44.338
    },
    {
        "year": 1970,
        "country": "Samoa",
        "birth_rate": 41.229,
        "life_exp": 54.777
    },
    {
        "year": 1970,
        "country": "Sao Tome and Principe",
        "birth_rate": 41.043,
        "life_exp": 55.859
    },
    {
        "year": 1970,
        "country": "Saudi Arabia",
        "birth_rate": 46.773,
        "life_exp": 52.693
    },
    {
        "year": 1970,
        "country": "Senegal",
        "birth_rate": 50.082,
        "life_exp": 39.227
    },
    {
        "year": 1970,
        "country": "Sierra Leone",
        "birth_rate": 48.771,
        "life_exp": 34.601
    },
    {
        "year": 1970,
        "country": "Singapore",
        "birth_rate": 22.1,
        "life_exp": 68.2794146341463
    },
    {
        "year": 1970,
        "country": "Slovak Republic",
        "birth_rate": 17.8,
        "life_exp": 70.134243902439
    },
    {
        "year": 1970,
        "country": "Slovenia",
        "birth_rate": 15.9,
        "life_exp": 68.609756097561
    },
    {
        "year": 1970,
        "country": "Solomon Islands",
        "birth_rate": 45.384,
        "life_exp": 54.252
    },
    {
        "year": 1970,
        "country": "Somalia",
        "birth_rate": 46.606,
        "life_exp": 40.958
    },
    {
        "year": 1970,
        "country": "South Africa",
        "birth_rate": 37.785,
        "life_exp": 55.852
    },
    {
        "year": 1970,
        "country": "South Sudan",
        "birth_rate": 50.911,
        "life_exp": 35.807
    },
    {
        "year": 1970,
        "country": "Spain",
        "birth_rate": 19.5,
        "life_exp": 72.0273170731707
    },
    {
        "year": 1970,
        "country": "Sri Lanka",
        "birth_rate": 30.601,
        "life_exp": 64.097
    },
    {
        "year": 1970,
        "country": "St. Lucia",
        "birth_rate": 38.748,
        "life_exp": 63.017
    },
    {
        "year": 1970,
        "country": "St. Vincent and the Grenadines",
        "birth_rate": 40.396,
        "life_exp": 65.1
    },
    {
        "year": 1970,
        "country": "Sudan",
        "birth_rate": 47.184,
        "life_exp": 52.234
    },
    {
        "year": 1970,
        "country": "Suriname",
        "birth_rate": 36.931,
        "life_exp": 63.268
    },
    {
        "year": 1970,
        "country": "Sweden",
        "birth_rate": 13.7,
        "life_exp": 74.6492682926829
    },
    {
        "year": 1970,
        "country": "Switzerland",
        "birth_rate": 16.1,
        "life_exp": 73.020243902439
    },
    {
        "year": 1970,
        "country": "Syrian Arab Republic",
        "birth_rate": 46.147,
        "life_exp": 58.814
    },
    {
        "year": 1970,
        "country": "Tajikistan",
        "birth_rate": 42.362,
        "life_exp": 60.114
    },
    {
        "year": 1970,
        "country": "Tanzania",
        "birth_rate": 48.338,
        "life_exp": 46.718
    },
    {
        "year": 1970,
        "country": "Thailand",
        "birth_rate": 37.847,
        "life_exp": 59.387
    },
    {
        "year": 1970,
        "country": "Timor-Leste",
        "birth_rate": 42.847,
        "life_exp": 39.528
    },
    {
        "year": 1970,
        "country": "Togo",
        "birth_rate": 48.245,
        "life_exp": 46.568
    },
    {
        "year": 1970,
        "country": "Tonga",
        "birth_rate": 36.235,
        "life_exp": 64.876
    },
    {
        "year": 1970,
        "country": "Trinidad and Tobago",
        "birth_rate": 26.774,
        "life_exp": 65.081
    },
    {
        "year": 1970,
        "country": "Tunisia",
        "birth_rate": 41.224,
        "life_exp": 51.145
    },
    {
        "year": 1970,
        "country": "Turkey",
        "birth_rate": 39.992,
        "life_exp": 52.286
    },
    {
        "year": 1970,
        "country": "Turkmenistan",
        "birth_rate": 37.898,
        "life_exp": 58.472
    },
    {
        "year": 1970,
        "country": "Uganda",
        "birth_rate": 48.789,
        "life_exp": 48.827
    },
    {
        "year": 1970,
        "country": "Ukraine",
        "birth_rate": 15.141,
        "life_exp": 70.2352195121951
    },
    {
        "year": 1970,
        "country": "United Arab Emirates",
        "birth_rate": 37.156,
        "life_exp": 61.721
    },
    {
        "year": 1970,
        "country": "United Kingdom",
        "birth_rate": 16.2,
        "life_exp": 71.9731707317073
    },
    {
        "year": 1970,
        "country": "United States",
        "birth_rate": 18.4,
        "life_exp": 70.8073170731707
    },
    {
        "year": 1970,
        "country": "Uruguay",
        "birth_rate": 20.762,
        "life_exp": 68.617
    },
    {
        "year": 1970,
        "country": "Uzbekistan",
        "birth_rate": 37.06,
        "life_exp": 62.391
    },
    {
        "year": 1970,
        "country": "Vanuatu",
        "birth_rate": 42.035,
        "life_exp": 52.369
    },
    {
        "year": 1970,
        "country": "Venezuela, RB",
        "birth_rate": 37.394,
        "life_exp": 64.569
    },
    {
        "year": 1970,
        "country": "Vietnam",
        "birth_rate": 36.415,
        "life_exp": 59.571
    },
    {
        "year": 1970,
        "country": "Virgin Islands (U.S.)",
        "birth_rate": 31.2111111111111,
        "life_exp": 69.0511951219512
    },
    {
        "year": 1970,
        "country": "Yemen, Rep.",
        "birth_rate": 53.184,
        "life_exp": 41.161
    },
    {
        "year": 1970,
        "country": "Zambia",
        "birth_rate": 49.514,
        "life_exp": 49.039
    },
    {
        "year": 1970,
        "country": "Zimbabwe",
        "birth_rate": 47.447,
        "life_exp": 54.92
    },
    {
        "year": 2010,
        "country": "Afghanistan",
        "birth_rate": 39.232,
        "life_exp": 61.226
    },
    {
        "year": 2010,
        "country": "Albania",
        "birth_rate": 11.819,
        "life_exp": 76.652
    },
    {
        "year": 2010,
        "country": "Algeria",
        "birth_rate": 24.762,
        "life_exp": 74.676
    },
    {
        "year": 2010,
        "country": "Angola",
        "birth_rate": 45.314,
        "life_exp": 58.192
    },
    {
        "year": 2010,
        "country": "Antigua and Barbuda",
        "birth_rate": 17.308,
        "life_exp": 75.412
    },
    {
        "year": 2010,
        "country": "Argentina",
        "birth_rate": 18.154,
        "life_exp": 75.595
    },
    {
        "year": 2010,
        "country": "Armenia",
        "birth_rate": 15.065,
        "life_exp": 73.331
    },
    {
        "year": 2010,
        "country": "Aruba",
        "birth_rate": 11.26,
        "life_exp": 75.016
    },
    {
        "year": 2010,
        "country": "Australia",
        "birth_rate": 13.7,
        "life_exp": 81.6951219512195
    },
    {
        "year": 2010,
        "country": "Austria",
        "birth_rate": 9.4,
        "life_exp": 80.5804878048781
    },
    {
        "year": 2010,
        "country": "Azerbaijan",
        "birth_rate": 18.3,
        "life_exp": 70.987
    },
    {
        "year": 2010,
        "country": "Bahamas, The",
        "birth_rate": 15.323,
        "life_exp": 74.761
    },
    {
        "year": 2010,
        "country": "Bahrain",
        "birth_rate": 16.544,
        "life_exp": 76.056
    },
    {
        "year": 2010,
        "country": "Bangladesh",
        "birth_rate": 21.224,
        "life_exp": 70.198
    },
    {
        "year": 2010,
        "country": "Barbados",
        "birth_rate": 12.48,
        "life_exp": 74.973
    },
    {
        "year": 2010,
        "country": "Belarus",
        "birth_rate": 11.4,
        "life_exp": 70.4048780487805
    },
    {
        "year": 2010,
        "country": "Belgium",
        "birth_rate": 11.9,
        "life_exp": 80.1829268292683
    },
    {
        "year": 2010,
        "country": "Belize",
        "birth_rate": 23.66,
        "life_exp": 69.676
    },
    {
        "year": 2010,
        "country": "Benin",
        "birth_rate": 39.278,
        "life_exp": 59.319
    },
    {
        "year": 2010,
        "country": "Bermuda",
        "birth_rate": 11.8,
        "life_exp": 79.2885365853658
    },
    {
        "year": 2010,
        "country": "Bhutan",
        "birth_rate": 20.58,
        "life_exp": 67.79
    },
    {
        "year": 2010,
        "country": "Bolivia",
        "birth_rate": 25.502,
        "life_exp": 66.408
    },
    {
        "year": 2010,
        "country": "Bosnia and Herzegovina",
        "birth_rate": 9.19,
        "life_exp": 75.905
    },
    {
        "year": 2010,
        "country": "Botswana",
        "birth_rate": 25.286,
        "life_exp": 59.868
    },
    {
        "year": 2010,
        "country": "Brazil",
        "birth_rate": 15.492,
        "life_exp": 73.838
    },
    {
        "year": 2010,
        "country": "Brunei Darussalam",
        "birth_rate": 16.553,
        "life_exp": 76.719
    },
    {
        "year": 2010,
        "country": "Bulgaria",
        "birth_rate": 10.2,
        "life_exp": 73.5121951219512
    },
    {
        "year": 2010,
        "country": "Burkina Faso",
        "birth_rate": 42.314,
        "life_exp": 57.096
    },
    {
        "year": 2010,
        "country": "Burundi",
        "birth_rate": 43.736,
        "life_exp": 54.861
    },
    {
        "year": 2010,
        "country": "Cabo Verde",
        "birth_rate": 22.898,
        "life_exp": 71.941
    },
    {
        "year": 2010,
        "country": "Cambodia",
        "birth_rate": 25.503,
        "life_exp": 66.555
    },
    {
        "year": 2010,
        "country": "Cameroon",
        "birth_rate": 39.307,
        "life_exp": 55.424
    },
    {
        "year": 2010,
        "country": "Canada",
        "birth_rate": 11.1,
        "life_exp": 81.1975609756098
    },
    {
        "year": 2010,
        "country": "Cayman Islands",
        "birth_rate": 15,
        "life_exp": 82.190243902439
    },
    {
        "year": 2010,
        "country": "Central African Republic",
        "birth_rate": 37.981,
        "life_exp": 47.56
    },
    {
        "year": 2010,
        "country": "Chad",
        "birth_rate": 46.68,
        "life_exp": 50.233
    },
    {
        "year": 2010,
        "country": "Channel Islands",
        "birth_rate": 9.732,
        "life_exp": 80.145
    },
    {
        "year": 2010,
        "country": "Chile",
        "birth_rate": 14.466,
        "life_exp": 78.454
    },
    {
        "year": 2010,
        "country": "China",
        "birth_rate": 11.9,
        "life_exp": 75.236
    },
    {
        "year": 2010,
        "country": "Colombia",
        "birth_rate": 17.079,
        "life_exp": 73.325
    },
    {
        "year": 2010,
        "country": "Comoros",
        "birth_rate": 35.209,
        "life_exp": 61.862
    },
    {
        "year": 2010,
        "country": "Congo, Dem. Rep.",
        "birth_rate": 44.856,
        "life_exp": 56.907
    },
    {
        "year": 2010,
        "country": "Congo, Rep.",
        "birth_rate": 38.022,
        "life_exp": 60.473
    },
    {
        "year": 2010,
        "country": "Costa Rica",
        "birth_rate": 15.84,
        "life_exp": 78.756
    },
    {
        "year": 2010,
        "country": "Cote d'Ivoire",
        "birth_rate": 38.203,
        "life_exp": 50.423
    },
    {
        "year": 2010,
        "country": "Croatia",
        "birth_rate": 9.8,
        "life_exp": 76.4756097560976
    },
    {
        "year": 2010,
        "country": "Cuba",
        "birth_rate": 11.042,
        "life_exp": 78.959
    },
    {
        "year": 2010,
        "country": "Cyprus",
        "birth_rate": 11.515,
        "life_exp": 79.43
    },
    {
        "year": 2010,
        "country": "Czech Republic",
        "birth_rate": 11.2,
        "life_exp": 77.4243902439025
    },
    {
        "year": 2010,
        "country": "Denmark",
        "birth_rate": 11.4,
        "life_exp": 79.1
    },
    {
        "year": 2010,
        "country": "Djibouti",
        "birth_rate": 25.193,
        "life_exp": 60.383
    },
    {
        "year": 2010,
        "country": "Dominican Republic",
        "birth_rate": 22.205,
        "life_exp": 72.702
    },
    {
        "year": 2010,
        "country": "Ecuador",
        "birth_rate": 21.898,
        "life_exp": 75.046
    },
    {
        "year": 2010,
        "country": "Egypt, Arab Rep.",
        "birth_rate": 27.093,
        "life_exp": 70.357
    },
    {
        "year": 2010,
        "country": "El Salvador",
        "birth_rate": 19.62,
        "life_exp": 71.902
    },
    {
        "year": 2010,
        "country": "Equatorial Guinea",
        "birth_rate": 37.418,
        "life_exp": 55.908
    },
    {
        "year": 2010,
        "country": "Eritrea",
        "birth_rate": 35.889,
        "life_exp": 62.181
    },
    {
        "year": 2010,
        "country": "Estonia",
        "birth_rate": 11.9,
        "life_exp": 75.4292682926829
    },
    {
        "year": 2010,
        "country": "Eswatini",
        "birth_rate": 31.305,
        "life_exp": 51.598
    },
    {
        "year": 2010,
        "country": "Ethiopia",
        "birth_rate": 34.831,
        "life_exp": 61.625
    },
    {
        "year": 2010,
        "country": "Faroe Islands",
        "birth_rate": 13.2,
        "life_exp": 80.6365853658537
    },
    {
        "year": 2010,
        "country": "Fiji",
        "birth_rate": 21.574,
        "life_exp": 69.267
    },
    {
        "year": 2010,
        "country": "Finland",
        "birth_rate": 11.4,
        "life_exp": 79.8707317073171
    },
    {
        "year": 2010,
        "country": "France",
        "birth_rate": 12.9,
        "life_exp": 81.6634146341463
    },
    {
        "year": 2010,
        "country": "French Polynesia",
        "birth_rate": 16.653,
        "life_exp": 75.643
    },
    {
        "year": 2010,
        "country": "Gabon",
        "birth_rate": 31.859,
        "life_exp": 62.893
    },
    {
        "year": 2010,
        "country": "Gambia, The",
        "birth_rate": 42.116,
        "life_exp": 59.622
    },
    {
        "year": 2010,
        "country": "Georgia",
        "birth_rate": 14.231,
        "life_exp": 72.649
    },
    {
        "year": 2010,
        "country": "Germany",
        "birth_rate": 8.3,
        "life_exp": 79.9878048780488
    },
    {
        "year": 2010,
        "country": "Ghana",
        "birth_rate": 33.333,
        "life_exp": 60.924
    },
    {
        "year": 2010,
        "country": "Greece",
        "birth_rate": 10.3,
        "life_exp": 80.3878048780488
    },
    {
        "year": 2010,
        "country": "Greenland",
        "birth_rate": 15.3,
        "life_exp": 70.8570731707317
    },
    {
        "year": 2010,
        "country": "Grenada",
        "birth_rate": 19.447,
        "life_exp": 72.618
    },
    {
        "year": 2010,
        "country": "Guam",
        "birth_rate": 17.669,
        "life_exp": 78.134
    },
    {
        "year": 2010,
        "country": "Guatemala",
        "birth_rate": 27.688,
        "life_exp": 71.494
    },
    {
        "year": 2010,
        "country": "Guinea",
        "birth_rate": 38.588,
        "life_exp": 56.765
    },
    {
        "year": 2010,
        "country": "Guinea-Bissau",
        "birth_rate": 39.254,
        "life_exp": 55.05
    },
    {
        "year": 2010,
        "country": "Guyana",
        "birth_rate": 21.056,
        "life_exp": 66.022
    },
    {
        "year": 2010,
        "country": "Haiti",
        "birth_rate": 26.659,
        "life_exp": 61.296
    },
    {
        "year": 2010,
        "country": "Honduras",
        "birth_rate": 24.655,
        "life_exp": 72.446
    },
    {
        "year": 2010,
        "country": "Hong Kong SAR, China",
        "birth_rate": 12.6,
        "life_exp": 82.9780487804878
    },
    {
        "year": 2010,
        "country": "Hungary",
        "birth_rate": 9,
        "life_exp": 74.2073170731707
    },
    {
        "year": 2010,
        "country": "Iceland",
        "birth_rate": 15.4,
        "life_exp": 81.8975609756098
    },
    {
        "year": 2010,
        "country": "India",
        "birth_rate": 21.408,
        "life_exp": 66.625
    },
    {
        "year": 2010,
        "country": "Indonesia",
        "birth_rate": 20.862,
        "life_exp": 68.15
    },
    {
        "year": 2010,
        "country": "Iran, Islamic Rep.",
        "birth_rate": 18.347,
        "life_exp": 73.932
    },
    {
        "year": 2010,
        "country": "Iraq",
        "birth_rate": 34.891,
        "life_exp": 68.465
    },
    {
        "year": 2010,
        "country": "Ireland",
        "birth_rate": 16.5,
        "life_exp": 80.7439024390244
    },
    {
        "year": 2010,
        "country": "Israel",
        "birth_rate": 21.8,
        "life_exp": 81.6024390243903
    },
    {
        "year": 2010,
        "country": "Italy",
        "birth_rate": 9.5,
        "life_exp": 82.0365853658537
    },
    {
        "year": 2010,
        "country": "Jamaica",
        "birth_rate": 17.794,
        "life_exp": 74.883
    },
    {
        "year": 2010,
        "country": "Japan",
        "birth_rate": 8.5,
        "life_exp": 82.8426829268293
    },
    {
        "year": 2010,
        "country": "Jordan",
        "birth_rate": 28.975,
        "life_exp": 73.412
    },
    {
        "year": 2010,
        "country": "Kazakhstan",
        "birth_rate": 22.54,
        "life_exp": 68.2953658536585
    },
    {
        "year": 2010,
        "country": "Kenya",
        "birth_rate": 35.091,
        "life_exp": 62.936
    },
    {
        "year": 2010,
        "country": "Kiribati",
        "birth_rate": 29.463,
        "life_exp": 65.354
    },
    {
        "year": 2010,
        "country": "Korea, Dem. People’s Rep.",
        "birth_rate": 14.299,
        "life_exp": 69.572
    },
    {
        "year": 2010,
        "country": "Korea, Rep.",
        "birth_rate": 9.4,
        "life_exp": 80.1170731707317
    },
    {
        "year": 2010,
        "country": "Kosovo",
        "birth_rate": 18.5,
        "life_exp": 69.9
    },
    {
        "year": 2010,
        "country": "Kuwait",
        "birth_rate": 19.616,
        "life_exp": 73.979
    },
    {
        "year": 2010,
        "country": "Kyrgyz Republic",
        "birth_rate": 26.8,
        "life_exp": 69.3
    },
    {
        "year": 2010,
        "country": "Lao PDR",
        "birth_rate": 26.715,
        "life_exp": 64.357
    },
    {
        "year": 2010,
        "country": "Latvia",
        "birth_rate": 9.4,
        "life_exp": 73.4829268292683
    },
    {
        "year": 2010,
        "country": "Lebanon",
        "birth_rate": 13.535,
        "life_exp": 78.43
    },
    {
        "year": 2010,
        "country": "Lesotho",
        "birth_rate": 28.528,
        "life_exp": 50.826
    },
    {
        "year": 2010,
        "country": "Liberia",
        "birth_rate": 37.167,
        "life_exp": 59.631
    },
    {
        "year": 2010,
        "country": "Libya",
        "birth_rate": 21.434,
        "life_exp": 71.643
    },
    {
        "year": 2010,
        "country": "Liechtenstein",
        "birth_rate": 9.1,
        "life_exp": 81.8414634146342
    },
    {
        "year": 2010,
        "country": "Lithuania",
        "birth_rate": 9.9,
        "life_exp": 73.2682926829268
    },
    {
        "year": 2010,
        "country": "Luxembourg",
        "birth_rate": 11.6,
        "life_exp": 80.6317073170732
    },
    {
        "year": 2010,
        "country": "Macao SAR, China",
        "birth_rate": 9.858,
        "life_exp": 82.704
    },
    {
        "year": 2010,
        "country": "Macedonia, FYR",
        "birth_rate": 11.09,
        "life_exp": 74.632
    },
    {
        "year": 2010,
        "country": "Madagascar",
        "birth_rate": 35.204,
        "life_exp": 63.388
    },
    {
        "year": 2010,
        "country": "Malawi",
        "birth_rate": 40.321,
        "life_exp": 57.263
    },
    {
        "year": 2010,
        "country": "Malaysia",
        "birth_rate": 17.263,
        "life_exp": 74.21
    },
    {
        "year": 2010,
        "country": "Maldives",
        "birth_rate": 19.816,
        "life_exp": 76.112
    },
    {
        "year": 2010,
        "country": "Mali",
        "birth_rate": 46.359,
        "life_exp": 55.249
    },
    {
        "year": 2010,
        "country": "Malta",
        "birth_rate": 9.4,
        "life_exp": 81.3975609756098
    },
    {
        "year": 2010,
        "country": "Mauritania",
        "birth_rate": 36.191,
        "life_exp": 61.997
    },
    {
        "year": 2010,
        "country": "Mauritius",
        "birth_rate": 12,
        "life_exp": 72.9673170731707
    },
    {
        "year": 2010,
        "country": "Mexico",
        "birth_rate": 19.992,
        "life_exp": 76.096
    },
    {
        "year": 2010,
        "country": "Micronesia, Fed. Sts.",
        "birth_rate": 23.745,
        "life_exp": 68.582
    },
    {
        "year": 2010,
        "country": "Moldova",
        "birth_rate": 11.058,
        "life_exp": 69.616
    },
    {
        "year": 2010,
        "country": "Mongolia",
        "birth_rate": 24.609,
        "life_exp": 67.383
    },
    {
        "year": 2010,
        "country": "Montenegro",
        "birth_rate": 12.565,
        "life_exp": 75.28
    },
    {
        "year": 2010,
        "country": "Morocco",
        "birth_rate": 21.289,
        "life_exp": 73.999
    },
    {
        "year": 2010,
        "country": "Mozambique",
        "birth_rate": 41.491,
        "life_exp": 54.7
    },
    {
        "year": 2010,
        "country": "Myanmar",
        "birth_rate": 19.855,
        "life_exp": 65.178
    },
    {
        "year": 2010,
        "country": "Namibia",
        "birth_rate": 30.011,
        "life_exp": 58.189
    },
    {
        "year": 2010,
        "country": "Nepal",
        "birth_rate": 22.83,
        "life_exp": 67.914
    },
    {
        "year": 2010,
        "country": "Netherlands",
        "birth_rate": 11.1,
        "life_exp": 80.7024390243902
    },
    {
        "year": 2010,
        "country": "New Caledonia",
        "birth_rate": 16.7,
        "life_exp": 77.2591221344293
    },
    {
        "year": 2010,
        "country": "New Zealand",
        "birth_rate": 14.68,
        "life_exp": 80.7024390243902
    },
    {
        "year": 2010,
        "country": "Nicaragua",
        "birth_rate": 22.163,
        "life_exp": 73.699
    },
    {
        "year": 2010,
        "country": "Niger",
        "birth_rate": 50.034,
        "life_exp": 56.838
    },
    {
        "year": 2010,
        "country": "Nigeria",
        "birth_rate": 41.344,
        "life_exp": 50.847
    },
    {
        "year": 2010,
        "country": "Norway",
        "birth_rate": 12.6,
        "life_exp": 80.9975609756098
    },
    {
        "year": 2010,
        "country": "Oman",
        "birth_rate": 21.978,
        "life_exp": 75.694
    },
    {
        "year": 2010,
        "country": "Pakistan",
        "birth_rate": 30.175,
        "life_exp": 65.134
    },
    {
        "year": 2010,
        "country": "Panama",
        "birth_rate": 21.102,
        "life_exp": 76.828
    },
    {
        "year": 2010,
        "country": "Papua New Guinea",
        "birth_rate": 29.942,
        "life_exp": 64.634
    },
    {
        "year": 2010,
        "country": "Paraguay",
        "birth_rate": 22.422,
        "life_exp": 72.285
    },
    {
        "year": 2010,
        "country": "Peru",
        "birth_rate": 20.876,
        "life_exp": 73.681
    },
    {
        "year": 2010,
        "country": "Philippines",
        "birth_rate": 24.845,
        "life_exp": 68.32
    },
    {
        "year": 2010,
        "country": "Poland",
        "birth_rate": 10.9,
        "life_exp": 76.2463414634146
    },
    {
        "year": 2010,
        "country": "Portugal",
        "birth_rate": 9.6,
        "life_exp": 79.0268292682927
    },
    {
        "year": 2010,
        "country": "Puerto Rico",
        "birth_rate": 11.3,
        "life_exp": 78.4081707317073
    },
    {
        "year": 2010,
        "country": "Qatar",
        "birth_rate": 11.486,
        "life_exp": 77.301
    },
    {
        "year": 2010,
        "country": "Romania",
        "birth_rate": 10.5,
        "life_exp": 73.4585365853659
    },
    {
        "year": 2010,
        "country": "Russian Federation",
        "birth_rate": 12.5,
        "life_exp": 68.8412195121951
    },
    {
        "year": 2010,
        "country": "Rwanda",
        "birth_rate": 35.314,
        "life_exp": 63.14
    },
    {
        "year": 2010,
        "country": "Samoa",
        "birth_rate": 27.91,
        "life_exp": 73.122
    },
    {
        "year": 2010,
        "country": "Sao Tome and Principe",
        "birth_rate": 36.671,
        "life_exp": 65.875
    },
    {
        "year": 2010,
        "country": "Saudi Arabia",
        "birth_rate": 22.018,
        "life_exp": 73.574
    },
    {
        "year": 2010,
        "country": "Senegal",
        "birth_rate": 38.243,
        "life_exp": 64.177
    },
    {
        "year": 2010,
        "country": "Serbia",
        "birth_rate": 9.4,
        "life_exp": 74.3365853658537
    },
    {
        "year": 2010,
        "country": "Seychelles",
        "birth_rate": 16.8,
        "life_exp": 73.1975609756098
    },
    {
        "year": 2010,
        "country": "Sierra Leone",
        "birth_rate": 39.563,
        "life_exp": 48.224
    },
    {
        "year": 2010,
        "country": "Singapore",
        "birth_rate": 9.3,
        "life_exp": 81.5414634146342
    },
    {
        "year": 2010,
        "country": "Slovak Republic",
        "birth_rate": 11.2,
        "life_exp": 75.1121951219512
    },
    {
        "year": 2010,
        "country": "Slovenia",
        "birth_rate": 10.9,
        "life_exp": 79.4219512195122
    },
    {
        "year": 2010,
        "country": "Solomon Islands",
        "birth_rate": 32.47,
        "life_exp": 68.572
    },
    {
        "year": 2010,
        "country": "Somalia",
        "birth_rate": 45.277,
        "life_exp": 53.986
    },
    {
        "year": 2010,
        "country": "South Africa",
        "birth_rate": 22.51,
        "life_exp": 55.888
    },
    {
        "year": 2010,
        "country": "South Sudan",
        "birth_rate": 38.336,
        "life_exp": 53.655
    },
    {
        "year": 2010,
        "country": "Spain",
        "birth_rate": 10.4,
        "life_exp": 81.6268292682927
    },
    {
        "year": 2010,
        "country": "Sri Lanka",
        "birth_rate": 17.513,
        "life_exp": 74.352
    },
    {
        "year": 2010,
        "country": "St. Lucia",
        "birth_rate": 13.028,
        "life_exp": 74.465
    },
    {
        "year": 2010,
        "country": "St. Martin (French part)",
        "birth_rate": 16.8,
        "life_exp": 78.7219512195122
    },
    {
        "year": 2010,
        "country": "St. Vincent and the Grenadines",
        "birth_rate": 17.094,
        "life_exp": 72.327
    },
    {
        "year": 2010,
        "country": "Sudan",
        "birth_rate": 35.47,
        "life_exp": 62.62
    },
    {
        "year": 2010,
        "country": "Suriname",
        "birth_rate": 19.613,
        "life_exp": 70.335
    },
    {
        "year": 2010,
        "country": "Sweden",
        "birth_rate": 12.3,
        "life_exp": 81.4512195121951
    },
    {
        "year": 2010,
        "country": "Switzerland",
        "birth_rate": 10.3,
        "life_exp": 82.2463414634147
    },
    {
        "year": 2010,
        "country": "Syrian Arab Republic",
        "birth_rate": 25.963,
        "life_exp": 72.108
    },
    {
        "year": 2010,
        "country": "Tajikistan",
        "birth_rate": 30.079,
        "life_exp": 69.644
    },
    {
        "year": 2010,
        "country": "Tanzania",
        "birth_rate": 41.112,
        "life_exp": 60.893
    },
    {
        "year": 2010,
        "country": "Thailand",
        "birth_rate": 11.806,
        "life_exp": 73.923
    },
    {
        "year": 2010,
        "country": "Timor-Leste",
        "birth_rate": 38.202,
        "life_exp": 67.313
    },
    {
        "year": 2010,
        "country": "Togo",
        "birth_rate": 37.201,
        "life_exp": 57.465
    },
    {
        "year": 2010,
        "country": "Tonga",
        "birth_rate": 27.084,
        "life_exp": 72.173
    },
    {
        "year": 2010,
        "country": "Trinidad and Tobago",
        "birth_rate": 15.201,
        "life_exp": 69.756
    },
    {
        "year": 2010,
        "country": "Tunisia",
        "birth_rate": 18.243,
        "life_exp": 74.793
    },
    {
        "year": 2010,
        "country": "Turkey",
        "birth_rate": 17.956,
        "life_exp": 74.154
    },
    {
        "year": 2010,
        "country": "Turkmenistan",
        "birth_rate": 25.405,
        "life_exp": 66.657
    },
    {
        "year": 2010,
        "country": "Uganda",
        "birth_rate": 45.179,
        "life_exp": 57.153
    },
    {
        "year": 2010,
        "country": "Ukraine",
        "birth_rate": 10.8,
        "life_exp": 70.2653658536586
    },
    {
        "year": 2010,
        "country": "United Arab Emirates",
        "birth_rate": 11.656,
        "life_exp": 76.344
    },
    {
        "year": 2010,
        "country": "United Kingdom",
        "birth_rate": 12.9,
        "life_exp": 80.4024390243902
    },
    {
        "year": 2010,
        "country": "United States",
        "birth_rate": 13,
        "life_exp": 78.5414634146342
    },
    {
        "year": 2010,
        "country": "Uruguay",
        "birth_rate": 14.757,
        "life_exp": 76.588
    },
    {
        "year": 2010,
        "country": "Uzbekistan",
        "birth_rate": 22.7,
        "life_exp": 70.005
    },
    {
        "year": 2010,
        "country": "Vanuatu",
        "birth_rate": 27.486,
        "life_exp": 70.721
    },
    {
        "year": 2010,
        "country": "Venezuela, RB",
        "birth_rate": 20.783,
        "life_exp": 73.625
    },
    {
        "year": 2010,
        "country": "Vietnam",
        "birth_rate": 17.473,
        "life_exp": 75.117
    },
    {
        "year": 2010,
        "country": "Virgin Islands (U.S.)",
        "birth_rate": 14.8,
        "life_exp": 77.9658536585366
    },
    {
        "year": 2010,
        "country": "West Bank and Gaza",
        "birth_rate": 33.446,
        "life_exp": 72.444
    },
    {
        "year": 2010,
        "country": "Yemen, Rep.",
        "birth_rate": 34.548,
        "life_exp": 63.508
    },
    {
        "year": 2010,
        "country": "Zambia",
        "birth_rate": 40.361,
        "life_exp": 56.588
    },
    {
        "year": 2010,
        "country": "Zimbabwe",
        "birth_rate": 36.02,
        "life_exp": 52.975
    }
];

@Injectable()
export class Service {
    getData(): BirthLife[] {
        return birthLife;
    }
}