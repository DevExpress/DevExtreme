import { Injectable } from '@angular/core';

export interface CitiesPopulation {
    name: string;
    items: any[];
}

let citiesPopulations: CitiesPopulation[] = [{
    name: "Africa",
    items: [{
        name: "Nigeria",
        items: [{
            name: "Lagos",
            value: 21324000
        }, {
            name: "Kano",
            value:  3626068
        }, {
            name: "Ibadan",
            value:  3200000
        }, {
            name: "Abuja",
            value:  3000000
        }, {
            name: "Kaduna",
            value:  1652844
        }, {
            name: "Port Harcourt",
            value:  1320214
        }, {
            name: "Aba",
            value:  1300000
        }, {
            name: "Ogbomosho",
            value:  1200000
        }, {
            name: "Maiduguri",
            value:  1197497
        }]
    }, {
        name: "Egypt",
        items: [{
            name: "Cairo",
            value: 9278441
        }, {
            name: "Alexandria",
            value: 4546231 
        }, {
            name: "Giza",
            value: 4239988
        }, {
            name: "Shubra El-Kheima",
            value:  3072951
        }, {
            name: "Port Said",
            value:  1607353
        }, {
            name: "Suez",
            value:  1347352
        }]
    }, {
        name: "Congo",
        items: [{
            name: "Kinshasa",
            value: 9735000
        }, {
            name: "Lubumbashi",
            value:  1786397
        }, {
            name: "Mbuji-Mayi",
            value:  1680991
        }, {
            name: "Kananga",
            value:  1061181
        }, {
            name: "Bukavu",
            value:  1012053
        }, {
            name: "Kisangani",
            value:  935977
        }]
    }, {
        name: "Morocco",
        items: [{
            name: "Casablanca",
            value: 3359818
        }, {
            name: "Fès",
            value:  1112072
        }, {
            name: "Tangier",
            value:  947952
        }, {
            name: "Marrakech",
            value:  928850
        }, {
            name: "Salé",
            value:  920403
        }]
    }]
}, {
    name: "Asia",
    items: [{
        name: "China",
        items: [{
            name: "Shanghai",
            value: 24256800
        }, {
            name: "Beijing",
            value: 21516000
        }, {
            name: "Chongqing",
            value: 18384100
        }, {
            name: "Chengdu",
            value: 17677122
        }, {
            name: "Tianjin",
            value: 15200000
        }, {
            name: "Guangzhou",
            value: 13080500
        }, {
            name: "Shenzhen",
            value: 10630000
        }]
    }, {
        name: "Pakistan",
        items: [{
            name: "Karachi",
            value: 23500000
        }, {
            name: "Faisalabad",
            value: 6418745
        }, {
            name: "Lahore",
            value: 6318745
        }, {
            name: "Rawalpindi",
            value: 3363911
        }, {
            name: "Hyderabad",
            value:  3429471
        }, {
            name: "Multan",
            value: 2050000
        }]
    }, {
        name: "India",
        items: [{
            name: "Delhi",
            value: 16787941
        }, {
            name: "Mumbai",
            value: 12478447
        }, {
            name: "Bengaluru",
            value: 8425970
        }, {
            name: "Hyderabad",
            value: 7749334
        }, {
            name: "Chennai",
            value: 7088000
        }, {
            name: "Ahmedabad",
            value: 5577940
        }]
    }, {
        name: "Japan",
        items: [{
            name: "Tokyo",
            value: 9262046
        }, {
            name: "Yokohama",
            value: 3697894
        }, {
            name: "Osaka",
            value: 2668586
        }, {
            name: "Nagoya",
            value: 2283289
        }, {
            name: "Sapporo",
            value: 1918096
        }]
    }]
}, {
    name: "Europe",
    items: [{
        name: "Turkey",
        items: [{
            name: "Istanbul",
            value: 14160467
        }, {
            name: "Ankara",
            value: 4470800
        }, {
            name: "İzmir",
            value: 3276815
        }, {
            name: "Bursa",
            value: 1957247
        }, {
            name: "Adana",
            value: 1717473
        }]
    }, {
        name: "Russia",
        items: [{
            name: "Moscow",
            value: 12197596
        }, {
            name: "Saint Petersburg",
            value: 5191690
        }, {
            name: "Novosibirsk",
            value: 1473754
        }, {
            name: "Yekaterinburg",
            value: 1428042
        }]
    }, {
        name: "United Kingdom",
        items: [{
            name: "London",
            value: 8538689
        }, {
            name: "Birmingham",
            value: 1101360
        }, {
            name: "Glasgow",
            value: 599650
        }, {
            name: "Liverpool",
            value: 473073
        }]
    }, {
        name: "Germany",
        items: [{
            name: "Berlin",
            value: 3517424
        }, {
            name: "Hamburg",
            value: 1686100
        }, {
            name: "Munich",
            value: 1185400
        }, {
            name: "Cologne",
            value: 1046680
        }, {
            name: "Frankfurt",
            value: 717624
        }]
    }, {
        name: "France",
        items: [{
            name: "Paris",
            value: 2240621
        }, {
            name: "Marseille",
            value: 852516
        }, {
            name: "Lyon",
            value: 500715
        }, {
            name: "Toulouse",
            value: 461190
        }]
    }]
}, {
    name: "North America",
    items: [{
        name: "Mexico",
        items: [{
            name: "Mexico City",
            value: 8874724
        }, {
            name: "Ecatepec de Morelos",
            value: 1742023
        }, {
            name: "Puebla",
            value:  1508707
        }, {
            name: "Guadalajara",
            value:  1506359
        }, {
            name: "Juárez",
            value:  1409987
        }, {
            name: "Tijuana",
            value:  1399282
        }, {
            name: "León",
            value:  1281434
        }]
    }, {
        name: "United States",
        items: [{
            name: "New York City",
            value: 8550405
        }, {
            name: "Los Angeles",
            value: 3884307
        }, {
            name: "Chicago",
            value: 2722389
        }, {
            name: "Houston",
            value: 2296224
        }, {
            name: "Philadelphia",
            value: 1567442
        }, {
            name: "Phoenix",
            value: 1563025
        }, {
            name: "San Antonio",
            value: 1469845
        }, {
            name: "San Diego",
            value: 1394928
        }]
    }, {
        name: "Canada",
        items: [{
            name: "Toronto",
            value: 2808503
        }, {
            name: "Montreal",
            value: 1731245
        }, {
            name: "Calgary",
            value: 1096833
        }, {
            name: "Ottawa",
            value: 956710
        }, {
            name: "Edmonton",
            value: 895000
        }, {
            name: "Mississauga",
            value: 713443
        }]
    }, {
        name: "Cuba",
        items: [{
            name: "Havana",
            value: 2135498
        }, {
            name: "Santiago de Cuba",
            value: 425851
        }, {
            name: "Camagüey",
            value: 305845
        }]
    }]
}, {
    name: "South America",
    items: [{
        name: "Brazil",
        items: [{
            name: "São Paulo",
            value: 11895893
        }, {
            name: "Rio de Janeiro",
            value: 6429923
        }, {
            name: "Salvador",
            value:  2902927
        }, {
            name: "Brasília",
            value:  2914830
        }, {
            name: "Fortaleza",
            value:  2591188
        }, {
            name: "Belo Horizonte",
            value:  2513451
        }, {
            name: "Manaus",
            value:  2094391
        }]
    }, {
        name: "Peru",
        items: [{
            name: "Lima",
            value: 8693387
        }, {
            name: "Callao",
            value: 1010315
        }, {
            name: "Arequipa",
            value: 869351
        }, {
            name: "Trujillo",
            value: 788236
        }, {
            name: "Chiclayo",
            value: 600440
        }]
    }, {
        name: "Colombia",
        items: [{
            name: "Bogotá",
            value: 7776845
        }, {
            name: "Medellín",
            value: 2441123
        }, {
            name: "Cali",
            value: 2400653
        }, {
            name: "Barranquilla",
            value: 1214253
        }, {
            name: "Cartagena",
            value: 959594
        }]
    }, {
        name: "Chile",
        items: [{
            name: "Santiago",
            value: 5507282
        }, {
            name: "Puente Alto",
            value: 610118
        }, {
            name: "Maipú",
            value: 468390
        }]
    }, {
        name: "Venezuela",
        items: [{
            name: "Caracas",
            value: 3289886
        }, {
            name: "Maracaibo",
            value: 1653211
        }, {
            name: "Barquisimeto",
            value: 1116182
        }, {
            name: "Valencia",
            value: 901900
        }, {
            name: "Ciudad Guayana",
            value: 877547
        }]
    }]
}];;

@Injectable()
export class Service {
    getCitiesPopulations() {
        return citiesPopulations;
    }
}
