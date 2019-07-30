
export const primaryDataSource = [
    {
        Id: 1,
        text: 'Primary #1',
        startDate: new Date(2018, 3, 20, 9, 0),
        endDate: new Date(2018, 3, 20, 9, 30),
        resourceId: 'Primary'
    },
    {
        Id: 2,
        text: 'Primary #2',
        startDate: new Date(2018, 3, 20, 9, 0),
        endDate: new Date(2018, 3, 20, 10, 0),
        resourceId: 'Primary'
    },
    {
        Id: 3,
        text: 'Primary #3',
        startDate: new Date(2018, 3, 20, 9, 0),
        endDate: new Date(2018, 3, 20, 10, 30),
        resourceId: 'Primary'
    },
    {
        Id: 5,
        text: 'Primary #5',
        startDate: new Date(2018, 3, 20, 9, 0),
        endDate: new Date(2018, 3, 20, 11, 30),
        resourceId: 'Primary'
    }
]

export const secondaryDataSource = [
    {
        Id: 1,
        text: 'Secondary #1',
        startDate: new Date(2018, 3, 20, 13, 0),
        endDate: new Date(2018, 3, 20, 13, 30),
        resourceId: 'Secondary'
    },
    {
        Id: 2,
        text: 'Secondary #2',
        startDate: new Date(2018, 3, 20, 13, 0),
        endDate: new Date(2018, 3, 20, 14, 0),
        resourceId: 'Secondary'
    },
    {
        Id: 3,
        text: 'Secondary #3',
        startDate: new Date(2018, 3, 20, 13, 0),
        endDate: new Date(2018, 3, 20, 14, 30),
        resourceId: 'Secondary'
    },
    {
        Id: 5,
        text: 'Secondary #5',
        startDate: new Date(2018, 3, 20, 13, 0),
        endDate: new Date(2018, 3, 20, 15, 30),
        resourceId: 'Secondary'
    }
]

export const dataSource = primaryDataSource.concat(secondaryDataSource);
