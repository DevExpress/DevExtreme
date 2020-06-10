var continents = [{
    id: "1",
    text: "Africa",
    expanded: true,
    items: [{
            id: "1_1",
            text: "Egypt",
            fullName: "Arab Republic of Egypt",
            description: "Egypt is a transcontinental country spanning the northeast corner of Africa and southwest corner of Asia by a land bridge the Sinai Peninsula forms.",
            area: "1,010,407.87",
            population: "94,798,827",
            gdp: "1,173",
            selected: true,
            flag: "../../../../images/flags/Egypt.png",
            cities: [{
                id: "1_1_1",
                text: "Cairo",
                population: "9,500,000",
                area: "528",
                density: "19,376",
                description: "The city's metropolitan area is the largest in the Middle East and the Arab world, and the 15th-largest in the world, is associated with ancient Egypt.",
                capital: true,
                flag: "../../../../images/flags/Cairo.png"
            }, {
                id: "1_1_2",
                text: "Alexandria",
                population: "4,984,387",
                area: "2,679",
                density: "1,900",
                description: "Alexandria is the second largest city and a major economic center in Egypt, extending about 32 km (20 mi) along the coast of the Mediterranean Sea in the north central part of the country.",
                flag: "../../../../images/flags/Alexandria.png"
            }, {
                id: "1_1_3",
                text: "Giza",
                population: "3,628,062",
                area: "1,579.75",
                density: "2,300",
                description: "Giza is the third-largest city in Egypt. It is located on the west bank of the Nile, 5 km (3 mi) southwest of central Cairo.",
                flag: "../../../../images/flags/Giza.png"
            }]
        },
        {
            id: "1_2",
            text: "South Africa",
            fullName: "Republic of South Africa", 
            description: "South Africa is the southernmost country in Africa. It is bounded on the south by 2,798 kilometres (1,739 mi) of coastline of Southern Africa stretching along the South Atlantic and Indian Oceans.",
            area: "1,221,037",
            population: "54,956,900",
            gdp: "742.461",
            flag: "../../../../images/flags/SouthAfrica.png",
            cities: [{
                id: "1_2_2",
                text: "Pretoria",
                population: "741,651",
                area: "687.54",
                density: "1,100",
                description: "Pretoria is a city in the northern part of Gauteng, South Africa. Being one of the country's three capital cities, it serves as the seat of the executive branch of government.",
                capital: true,
                flag: "../../../../images/flags/Pretoria.png"
            }, {
                id: "1_2_1",
                text: "Johannesburg",
                population: "957,441",
                area: "334.81",
                density: "2,900",
                description: "Johannesburg is the largest city in South Africa and is one of the 50 largest urban areas in the world.",
                flag: "../../../../images/flags/Johannesburg.png"
            }, {
                id: "1_2_3",
                text: "Durban",
                population: "595,061",
                area: "225.91",
                density: "2,600",
                description: "Durban is the largest city in the South African province of KwaZulu-Natal. It is Located on the Indian Ocean coast of the African continent.",
                flag: "../../../../images/flags/Durban.png"
            }]
        }
    ]
}, {
    id: "2",
    text: "Asia",
    items: [{
        id: "2_1",
        text: "Japan",
        fullName: "Japan", 
        description: "Japan is a sovereign island nation in East Asia. Located in the Pacific Ocean, it lies off the eastern coast of the Asian mainland and stretches from the Sea of Okhotsk in the north to the East China Sea and China in the southwest.",
        area: "377,972",
        population: "126,672,000",
        gdp: "5,420",
        flag: "../../../../images/flags/Japan.png",
        cities: [{
            id: "2_1_1",
            text: "Tokyo",
            population: "13,617,445",
            area: "2,187.66",
            density: "6,224.66",
            description: "The Greater Tokyo Area is the most populous metropolitan area in the world. The city is located in the Kantō region on the southeastern side of the main island Honshu and includes the Izu Islands and Ogasawara Islands.",
            capital: true,
            flag: "../../../../images/flags/Tokyo.png"
        }, {
            id: "2_1_2",
            text: "Yokohama",
            population: "3,732,616",
            area: "437.38",
            density: "8,534.03",
            description: "Yokohama is the second largest city in Japan by population, after Tokyo, and the most populous municipality of Japan. It lies on Tokyo Bay, south of Tokyo, in the Kantō region of the main island of Honshu.",
            flag: "../../../../images/flags/Yokohama.png"
        }, {
            id: "2_1_3",
            text: "Osaka",
            population: "2,668,586",
            area: "223",
            density: "12,030",
            description: "Osaka is a designated city in the Kansai region of Japan. It is the largest component of the Keihanshin Metropolitan Area, the second largest metropolitan area in Japan. The city is situated at the mouth of the Yodo River on Osaka Bay, Honshu island",
            flag: "../../../../images/flags/Osaka.png"
        }, {
            id: "2_1_4",
            text: "Nagoya",
            population: "2,283,289",
            area: "326.43",
            density: "6,969.86",
            description: "Nagoya is the largest city in the Chūbu region of Japan. It is Japan's third-largest incorporated city and the fourth most populous urban area.",
            flag: "../../../../images/flags/Nagoya.png"
        }]
    }, {
        id: "2_2",
        text: "Malaysia",
        fullName: "Malaysia", 
        description: "Malaysia is a federal constitutional monarchy located in Southeast Asia.",
        area: "330,803",
        population: "31,708,000",
        gdp: "913.593",
        flag: "../../../../images/flags/Malaysia.png",
        cities: [{
            id: "2_2_1",
            text: "Kuala Lumpur",
            population: "1,768,000",
            area: "243",
            density: "6,891",
            description: "Kuala Lumpur, officially the Federal Territory of Kuala Lumpur, or commonly KL, is the largest city of Malaysia. It is located in Klang Valley.",
            capital: true,
            flag: "../../../../images/flags/KualaLumpur.png"
        }, {
            id: "2_2_2",
            text: "George Town",
            population: "708,127",
            area: "305.77",
            density: "2,372",
            description: "George Town, the capital city of the Malaysian state of Penang, is located at the northeastern tip of Penang Island.",
            flag: "../../../../images/flags/GeorgeTown.png"
        }, {
            id: "2_2_3",
            text: "Ipoh",
            population: "657,892",
            area: "643",
            density: "1,023",
            description: "Ipoh is the capital of the Malaysian state of Perak. It stands on the banks of the Kinta River.",
            flag: "../../../../images/flags/Ipoh.png"
        }]
    }]
}, {
    id: "3",
    text: "Australia",
    items: [{
        id: "3_1",
        text: "Australia",
        fullName: "Commonwealth of Australia", 
        description: "It is a sovereign country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the largest country in Oceania and the world's sixth-largest country by total area.",
        area: "7,692,024",
        population: "24,696,700",
        gdp: "1,189",
        flag: "../../../../images/flags/Australia.png",
        cities: [{
            id: "3_1_1",
            text: "Canberra",
            population: "403,468",
            area: "814.2",
            density: "428.6",
            description: "The city is located at the northern end of the Australian Capital Territory (ACT), 280 km (170 mi) south-west of Sydney, and 660 km (410 mi) north-east of Melbourne.",
            capital: true,
            flag: "../../../../images/flags/Canberra.png"
        }, {
            id: "3_1_2",
            text: "Sydney",
            population: "5,029,768",
            area: "12,367.7",
            density: "400",
            description: "Sydney is the state capital of New South Wales and the most populous city in Australia and Oceania. It is located on Australia's east coast.",
            flag: "../../../../images/flags/Sydney.jpg"
        }, {
            id: "3_1_3",
            text: "Melbourne",
            population: "4,725,316",
            area: "2,664",
            density: "453",
            description: "Melbourne is the capital and most populous city of the Australian state of Victoria, and the second-most populous city in Australia and Oceania. The city is located in the south-eastern part of mainland Australia.",
            flag: "../../../../images/flags/Melbourne.PNG"
        }]
    }]
}, {
    id: "4",
    text: "Europe",
    items: [{
        id: "4_1",
        text: "Germany",
        fullName: "Federal Republic of Germany", 
        description: "The country is a federal parliamentary republic in central-western Europe. Germany is the most populous member state of the European Union.",
        area: "357,168",
        population: "82,175,700",
        gdp: "4,150",
        flag: "../../../../images/flags/Germany.png",
        cities: [{
            id: "4_1_1",
            text: "Berlin",
            capital: true,
            population: "3,670,622",
            area: "891.7",
            density: "4,100",
            description: "Berlin is the capital and the largest city of Germany as well as one of its 16 constituent states.",
            flag: "../../../../images/flags/Berlin.png"
        }, {
            id: "4_1_2",
            text: "Hamburg",
            population: "1,787,408",
            area: "755",
            density: "2,400",
            description: "Hamburg, officially the Free and Hanseatic City of Hamburg, is the second largest city and a state of Germany.",
            flag: "../../../../images/flags/Hamburg.png"
        }, {
            id: "4_1_3",
            text: "Munich",
            population: "1,450,381",
            area: "310.43",
            density: "4,700",
            description: "Munich is the capital and the most populated city in the German state of Bavaria, on the banks of River Isar north of the Bavarian Alps.",
            flag: "../../../../images/flags/Munich.png"
        }]
    }, {
        id: "4_2",
        text: "Russia",
        fullName: "Russian Federation", 
        description: "Russia is a country in Eurasia. It is the largest country in the world by surface area, covering more than one-eighth of the Earth's inhabited land area.",
        area: "17,075,200",
        population: "144,463,451",
        gdp: "4,000",
        flag: "../../../../images/flags/Russia.png",
        cities: [{
            id: "4_2_1",
            text: "Moscow",
            capital: true,
            population: "12,228,685",
            area: "2,511",
            density: "4,833.36",
            description: "Moscow is the capital and most populous city of Russia. It is located in the western part of Russia on the banks of the Moskva River.",
            flag: "../../../../images/flags/Moscow.png"
        }, {
            id: "4_2_2",
            text: "Saint Petersburg",
            population: "5,323,300",
            area: "1,439",
            density: "3,764.49",
            description: "Saint Petersburg is Russia's second-largest city after Moscow. An important Russian port on the Baltic Sea, it is politically administered as a federal subject (a federal city).",
            flag: "../../../../images/flags/SaintPetersburg.png"
        }, {
            id: "4_2_3",
            text: "Novosibirsk",
            population: "1,473,754",
            area: "502.7",
            density: "2,932",
            description: "Novosibirsk is the most populous city in Asian Russia. The city is located in the southwestern part of Siberia on the banks of the Ob River adjacent to the Ob River Valley.",
            flag: "../../../../images/flags/Novosibirsk.png"
        }]
    }, {
        id: "4_3",
        text: "United Kingdom",
        fullName: "United Kingdom of Great Britain and Northern Ireland", 
        description: "United Kingdom is a sovereign country in western Europe. Lying off the north-western coast of the European mainland, the United Kingdom includes the island of Great Britain, the north-eastern part of the island of Ireland and many smaller islands.",
        area: "242,495",
        population: "65,648,000",
        gdp: "2,790",
        flag: "../../../../images/flags/UnitedKingdom.png",
        cities: [{
            id: "4_3_1",
            text: "London",
            capital: true,
            population: "8,787,892",
            area: "1,572",
            density: "5,590",
            description: "London is the capital and most populous city of England and the United Kingdom. It stands on the River Thames in the south-east of the Great Britain island.",
            flag: "../../../../images/flags/London.png"
        }, {
            id: "4_3_2",
            text: "Birmingham",
            population: "1,124,600",
            area: "267.8",
            density: "4,199",
            description: "Birmingham is a city and metropolitan borough in the West Midlands, England. The city stands on the small River Rea.",
            flag: "../../../../images/flags/Birmingham.png"
        }]
    }]
}, {
    id: "5",
    text: "North America",
    items: [{
        id: "5_2",
        text: "Mexico",
        fullName: "United Mexican States", 
        description: "Mexico is a federal republic in the southern portion of North America.",
        area: "1,972,550",
        population: "119,530,753",
        gdp: "2,406",
        flag: "../../../../images/flags/Mexico.png",
        cities: [{
            id: "5_2_1",
            text: "Mexico City",
            population: "8,918,653",
            area: "1,485",
            density: "6,000",
            description: "Mexico City is the most populous city of Mexico. It is located in the Valley of Mexico, a large valley in the high plateaus at the center of Mexico.",
            capital: true,
            flag: "../../../../images/flags/MexicoCity.png"
        }, {
            id: "5_2_2",
            text: "Puebla",
            population: "2,499,519",
            area: "534.32",
            density: "4,678",
            description: "Puebla, formally Heroica Puebla de Zaragoza and also known as Puebla de los Angeles, is located in the Valley of Puebla, a large valley surrounded by the mountains and volcanoes of the Trans-Mexican volcanic belt on four sides.",
            flag: "../../../../images/flags/Puebla.png"
        }, {
            id: "5_2_3",
            text: "Guadalajara",
            population: "1,495,189",
            area: "151",
            density: "10,361",
            description: "Guadalajara is the capital and largest city of the Mexican state of Jalisco. The city is in the central region of Jalisco in the Western-Pacific area of Mexico.",
            flag: "../../../../images/flags/Guadalajara.png"
        }]
    }, {
        id: "5_1",
        text: "United States",
        fullName: "United States of America", 
        description: "The country is a federal republic mainly located in the central part of the North American continent. The state of Alaska is in the northwest corner of North America and the state of Hawaii is an archipelago in the mid-Pacific Ocean.",
        area: "9,833,520",
        population: "325,365,189",
        gdp: "18,558",
        flag: "../../../../images/flags/UnitedStates.png",
        cities: [{
            id: "5_1_1",
            text: "Washington",
            capital: true,
            population: "681,170",
            area: "177",
            density: "4,308",
            description: "Washington, D.C., is located in the mid-Atlantic region of the U.S. East Coast and partially bordered by the Potomac River.",
            flag: "../../../../images/flags/Washington.png"
        }, {
            id: "5_1_2",
            text: "New York City",
            population: "8,175,133",
            area: "34,306",
            density: "10,890",
            description: "The City of New York is the most populous city in the United States. Located at the southern tip of the state of New York, the city is the center of the New York metropolitan area, one of the most populous urban agglomerations in the world.",
            flag: "../../../../images/flags/NewYork.png"
        }, {
            id: "5_1_3",
            text: "Los Angeles",
            population: "3,792,621",
            area: "1,302.15",
            density: "8,483.02",
            description: "Los Angeles, officially the City of Los Angeles, is located on the on the West Coast of the United States. It is the second most populous city in the United States and the most populous city in the state of California.",
            flag: "../../../../images/flags/LosAngeles.png"
        }, {
            id: "5_1_4",
            text: "Chicago",
            population: "2,695,598",
            area: "606.42",
            density: "11,898.29",
            description: "Chicago, officially the City of Chicago, is the third-most populous city in the United States. It is located in northern Illinois at the south-western tip of Lake Michigan.",
            flag: "../../../../images/flags/Chicago.png"
        }]
    }]
}, {
    id: "6",
    text: "South America",
    items: [{
        id: "6_1",
        text: "Brazil",
        fullName: "Federative Republic of Brazil", 
        description: "Brasília is the federal capital of Brazil and seat of the Federal District government. It occupies a large area along the eastern coast of South America and includes much of the continent's interior.",
        area: "8,515,767",
        population: "208,064,000",
        gdp: "3,217",
        flag: "../../../../images/flags/Brazil.png",
        cities: [{
            id: "6_1_1",
            text: "Brasilia",
            capital: true,
            population: "2,977,216",
            area: "5,801,937",
            density: "513,14",
            description: "Brasília is the federal capital of Brazil and seat of the Federal District government. The city is located atop the Brazilian highlands in the country's center-western region.",
            flag: "../../../../images/flags/Brasilia.png"
        }, {
            id: "6_1_2",
            text: "Sao Paulo",
            population: "12,038,175",
            area: "1,521.11",
            density: "7,913.29",
            description: "Sao Paulo is a municipality in the southeast region of Brazil. The city is the capital of the surrounding San Paulo state.",
            flag: "../../../../images/flags/SaoPaulo.png"
        }, {
            id: "6_1_3",
            text: "Rio de Janeiro",
            population: "6,453,682",
            area: "1,221",
            density: "2,705.1",
            description: "Rio de Janeiro is the second-most populous municipality in Brazil and the capital of the Rio de Janeiro state, Brazil's third-most populous state.",
            flag: "../../../../images/flags/RioDeJaneiro.png"
        }]
    }, {
        id: "6_2",
        text: "Colombia",
        fullName: "Republic of Colombia", 
        description: "Colombia is a sovereign state mainly located in the northwest of South America, with territories in Central America.",
        area: "1,141,748",
        population: "49,364,592",
        gdp: "720.151",
        flag: "../../../../images/flags/Colombia.png",
        cities: [{
            id: "6_2_1",
            text: "Bogota",
            capital: true,
            population: "8,080,734",
            area: "1,587",
            density: "6,060",
            description: "Bogotá is the capital and largest city of Colombia administered as the Capital District, although often thought of as part of Cundinamarca. The city is located in the southeastern part of the Bogotá savanna.",
            flag: "../../../../images/flags/Bogota.png"
        }, {
            id: "6_2_2",
            text: "Medellin",
            population: "2,441,123",
            area: "380.64",
            density: "6,413",
            description: "Medellín is the second-largest city in Colombia and the capital of the Antioquia department. It is located in the Aburrá Valley, a central region of the Andes Mountains in South America.",
            flag: "../../../../images/flags/Medellin.png"
        }, {
            id: "6_2_3",
            text: "Cali",
            population: "2,400,653",
            area: "619",
            density: "3,900",
            description: "Santiago de Cali, usually known by its short name Cali, is the capital of the Valle del Cauca department, and the most populous city in southwest Colombia.",
            flag: "../../../../images/flags/Cali.png"
        }]
    }]
}];