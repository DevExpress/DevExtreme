import { SchedulerTypes } from 'devextreme-react/scheduler';

export const appointments: SchedulerTypes.Appointment[] = [
   {
        text: 'New Brochures',
        startDate: new Date('2021-04-27T21:30:00.000Z'),
        endDate: new Date('2021-04-27T22:45:00.000Z'),
    }, {
        text: 'Install New Database',
        startDate: new Date('2021-04-28T16:45:00.000Z'),
        endDate: new Date('2021-04-28T18:15:00.000Z'),
    }, {
        text: 'Approve New Online Marketing Strategy',
        startDate: new Date('2021-04-28T19:00:00.000Z'),
        endDate: new Date('2021-04-28T21:00:00.000Z'),
    }, {
        text: 'Upgrade Personal Computers',
        startDate: new Date('2021-04-28T22:15:00.000Z'),
        endDate: new Date('2021-04-28T23:30:00.000Z'),
    }, {
        text: 'Customer Workshop',
        startDate: new Date('2021-04-29T18:00:00.000Z'),
        endDate: new Date('2021-04-29T19:00:00.000Z'),
        allDay: true,
    }, {
        text: 'Prepare 2021 Marketing Plan',
        startDate: new Date('2021-04-29T18:00:00.000Z'),
        endDate: new Date('2021-04-29T20:30:00.000Z'),
    }, {
        text: 'Brochure Design Review',
        startDate: new Date('2021-04-29T21:00:00.000Z'),
        endDate: new Date('2021-04-29T22:30:00.000Z'),
    }, {
        text: 'Create Icons for Website',
        startDate: new Date('2021-04-30T17:00:00.000Z'),
        endDate: new Date('2021-04-30T18:30:00.000Z'),
    }, {
        text: 'Upgrade Server Hardware',
        startDate: new Date('2021-04-30T21:30:00.000Z'),
        endDate: new Date('2021-04-30T23:00:00.000Z'),
    }, {
        text: 'Submit New Website Design',
        startDate: new Date('2021-04-30T23:30:00.000Z'),
        endDate: new Date('2021-05-01T01:00:00.000Z'),
    }, {
        text: 'Launch New Website',
        startDate: new Date('2021-04-30T19:20:00.000Z'),
        endDate: new Date('2021-04-30T21:00:00.000Z'),
    },
];

export const customers = [{
    ID: 1,
    CompanyName: 'Super Mart of the West',
    Address: '702 SW 8th Street',
    City: 'Bentonville',
    State: 'Arkansas',
    Zipcode: 72716,
    Phone: '(800) 555-2797',
    Fax: '(800) 555-2171',
}, {
    ID: 2,
    CompanyName: 'Electronics Depot',
    Address: '2455 Paces Ferry Road NW',
    City: 'Atlanta',
    State: 'Georgia',
    Zipcode: 30339,
    Phone: '(800) 595-3232',
    Fax: '(800) 595-3231',
}, {
    ID: 3,
    CompanyName: 'K&S Music',
    Address: '1000 Nicllet Mall',
    City: 'Minneapolis',
    State: 'Minnesota',
    Zipcode: 55403,
    Phone: '(612) 304-6073',
    Fax: '(612) 304-6074',
}, {
    ID: 4,
    CompanyName: "Tom's Club",
    Address: '999 Lake Drive',
    City: 'Issaquah',
    State: 'Washington',
    Zipcode: 98027,
    Phone: '(800) 955-2292',
    Fax: '(800) 955-2293',
}, {
    ID: 5,
    CompanyName: 'E-Mart',
    Address: '3333 Beverly Rd',
    City: 'Hoffman Estates',
    State: 'Illinois',
    Zipcode: 60179,
    Phone: '(847) 286-2500',
    Fax: '(847) 286-2501',
}, {
    ID: 6,
    CompanyName: 'Walters',
    Address: '200 Wilmot Rd',
    City: 'Deerfield',
    State: 'Illinois',
    Zipcode: 60015,
    Phone: '(847) 940-2500',
    Fax: '(847) 940-2501',
}, {
    ID: 7,
    CompanyName: 'StereoShack',
    Address: '400 Commerce S',
    City: 'Fort Worth',
    State: 'Texas',
    Zipcode: 76102,
    Phone: '(817) 820-0741',
    Fax: '(817) 820-0742',
}, {
    ID: 8,
    CompanyName: 'Circuit Town',
    Address: '2200 Kensington Court',
    City: 'Oak Brook',
    State: 'Illinois',
    Zipcode: 60523,
    Phone: '(800) 955-2929',
    Fax: '(800) 955-9392',
}];


export const populationByRegions = [{
    region: 'Asia',
    val: 4119626293,
}, {
    region: 'Africa',
    val: 1012956064,
}, {
    region: 'Northern America',
    val: 344124520,
}, {
    region: 'Latin America and the Caribbean',
    val: 590946440,
}, {
    region: 'Europe',
    val: 727082222,
}, {
    region: 'Oceania',
    val: 35104756,
}];
