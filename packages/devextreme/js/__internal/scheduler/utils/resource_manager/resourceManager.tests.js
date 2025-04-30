import $ from 'jquery';
import {
    getWrappedDataSource,
    createResourcesTree,
    createResourceEditorModel,
    getPaintedResources,
    filterResources,
    getOrLoadResourceItem,
    getResourceColor,
    getResourceTreeLeaves,
    groupAppointmentsByResourcesCore,
    getResourcesDataByGroups,
    reduceResourcesTree,
    setResourceToAppointment,
    createExpressions,
    getDataAccessors,
    loadResources
} from '__internal/scheduler/resources/m_utils';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';

const testData = {
    rooms: [{
        text: 'Room1',
        id: 1,
        color: '#cb6bb2'
    }, {
        text: 'Room2',
        id: 2,
        color: '#56ca85'
    }],
    owners: [{
        text: 'Jack',
        uid: 1,
        color: '#606060'
    }, {
        text: 'Mike',
        uid: 2,
        color: '#ff0000'
    }]
};
const resourceData = [
    {
        field: 'roomId',
        label: 'Room',
        allowMultiple: false,
        dataSource: testData.rooms
    },
    {
        fieldExpr: 'ownerId',
        label: 'Owner',
        allowMultiple: true,
        displayExpr: 'color',
        valueExpr: 'uid',
        dataSource: testData.owners
    }
];

const promiseData = {
    resources: $.Deferred(),
    load: function() {
        promiseData.resources.resolve(testData.rooms);
    }
};

const resourceDataWithDataSource = [
    {
        field: 'roomId',
        label: 'Room',
        allowMultiple: false,
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    return promiseData.resources.promise();
                }
            })
        })
    }
];

QUnit.module('getWrappedDataSource', () => {
    QUnit.test('JSON declaration should be wrapped to DataSource object', function(assert) {
        const filterValue = ['id', '=', 'emp1'];
        const dataSource = getWrappedDataSource({
            filter: filterValue,
            store: new CustomStore({
                load: () => {}
            })
        });

        assert.ok(dataSource instanceof DataSource, 'getWrappedDataSource should return DataSource object if JSON is passed');
        assert.deepEqual(dataSource.filter(), filterValue, 'Filter should be passed to the created dataSource');
    });

    QUnit.test('Array data should be wrapped to DataSource object', function(assert) {
        const dataSource = getWrappedDataSource([
            { id: 0 },
            { id: 1 }
        ]);

        assert.ok(dataSource instanceof DataSource, 'getWrappedDataSource should return DataSource object if array passed');
        assert.equal(dataSource.filter(), undefined, 'Filter shouldn\'t exist in DataSource');
    });

    QUnit.test('DataSource object shouldn\'t wrapped', function(assert) {
        const originalDataSource = new DataSource({
            store: new CustomStore({
                load: () => {}
            })
        });

        const dataSource = getWrappedDataSource(originalDataSource);

        assert.equal(dataSource, originalDataSource, 'result of getWrappedDataSource should be equal originalDataSource');
        assert.equal(dataSource.filter(), undefined, 'Filter shouldn\'t exist in DataSource');
    });
});

QUnit.test('Resources dataSource should not be wrapped if it\'s instance of the DataSource', function(assert) {
    const done = assert.async();

    const dataSource = new DataSource({
        store: testData.rooms
    });

    const resources = [{
        field: 'roomId',
        label: 'Room',
        allowMultiple: false,
        dataSource: dataSource
    }];

    getOrLoadResourceItem(resources, new Map(), 'roomId', 1).done(function() {
        assert.equal(dataSource.items().length, testData.rooms.length, 'DS items are OK');
        done();
    });
});

QUnit.test('Get editors for resources', function(assert) {
    const editors = createResourceEditorModel(resourceData, []);

    assert.equal(editors[0].dataField, 'roomId');
    assert.equal(editors[0].editorType, 'dxSelectBox');
    assert.equal(editors[0].label.text, 'Room');
    assert.equal(editors[0].editorOptions.displayExpr, 'text');
    assert.equal(editors[0].editorOptions.valueExpr, 'id');

    editors[0].editorOptions.dataSource.load();
    assert.deepEqual(editors[0].editorOptions.dataSource.items(), resourceData[0].dataSource);

    //
    assert.equal(editors[1].dataField, 'ownerId');
    assert.equal(editors[1].editorType, 'dxTagBox');
    assert.equal(editors[1].label.text, 'Owner');
    assert.equal(editors[1].editorOptions.displayExpr, 'color');
    assert.equal(editors[1].editorOptions.valueExpr, 'uid');

    editors[1].editorOptions.dataSource.load();
    assert.deepEqual(editors[1].editorOptions.dataSource.items(), resourceData[1].dataSource);
});

QUnit.test('Resource editor should always have label', function(assert) {
    const resources = [{
        field: 'roomId',
        allowMultiple: false,
        dataSource: testData.rooms
    }];

    const editors = createResourceEditorModel(resources, []);
    assert.equal(editors[0].label.text, 'roomId');
});

QUnit.test('Get resource by field name and value', function(assert) {
    const done = assert.async();

    getOrLoadResourceItem(resourceData, new Map(), 'roomId', 2).done(function(data) {
        assert.deepEqual(data, resourceData[0].dataSource[1], 'Resource was found');
        done();
    });
});

QUnit.test('getDataAccessors should return dataAccessors ', function(assert) {
    const resources = [{
        field: 'outer.roomId',
        label: 'Room',
        allowMultiple: false,
        dataSource: [
            {
                text: 'Room1',
                id: 1,
                color: '#cb6bb2'
            }
        ]
    }];

    const item = { text: 'Item 1', startDate: new Date(), outer: { roomId: 2, ownerId: [1, 2] } };

    const dataFields = createExpressions(resources);
    const resourceGetter = getDataAccessors(dataFields, 'outer.roomId', 'getter');
    const resourceSetter = getDataAccessors(dataFields, 'outer.roomId', 'setter');

    assert.equal(resourceGetter(item), 2, 'getter is ok');
    resourceSetter(item, 1);
    assert.equal(resourceGetter(item), 1, 'setter & getter is ok');
});

QUnit.test('getDataAccessors should return dataAccessors (use fieldExpr)', function(assert) {
    const resources = [{
        fieldExpr: 'outer.roomId',
        label: 'Room',
        allowMultiple: false,
        dataSource: [
            {
                text: 'Room1',
                id: 1,
                color: '#cb6bb2'
            }
        ]
    }];

    const dataFields = createExpressions(resources);

    const item = { text: 'Item 1', startDate: new Date(), outer: { roomId: 2, ownerId: [1, 2] } };
    const resourceGetter = getDataAccessors(dataFields, 'outer.roomId', 'getter');
    const resourceSetter = getDataAccessors(dataFields, 'outer.roomId', 'setter');

    assert.equal(resourceGetter(item), 2, 'getter is ok');
    resourceSetter(item, 1);
    assert.equal(resourceGetter(item), 1, 'setter & getter is ok');
});

QUnit.test('getResourceTreeLeaves should work correctly when resource.field is expr', function(assert) {
    const done = assert.async();

    const resources = [{
        fieldExpr: 'outer.roomId',
        label: 'Room',
        allowMultiple: false,
        dataSource: [
            { id: 1 },
            { id: 2 }
        ]
    }, {
        field: 'ownerId',
        allowMultiple: true,
        dataSource: [
            { id: 1 },
            { id: 2 }
        ]
    }];

    const appointment = {
        text: 'Item 1',
        startDate: new Date(),
        outer: { roomId: 2 },
        ownerId: [1, 2]
    };

    loadResources(['outer.roomId', 'ownerId'], resources, new Map()).done($.proxy(function(groups) {
        const tree = createResourcesTree(groups);

        const result = getResourceTreeLeaves(
            (field, action) => getDataAccessors(createExpressions(resources), field, action),
            tree,
            appointment
        );

        assert.deepEqual(result, [2, 3], 'Leaves are OK');

        done();
    }, this));
});

QUnit.test('Set resources to item', function(assert) {
    const item = { text: 'Item 1', startDate: new Date() };

    setResourceToAppointment(resourceData, createExpressions(resourceData), item, { roomId: 1 });
    setResourceToAppointment(resourceData, createExpressions(resourceData), item, { ownerId: 1 });

    assert.strictEqual(item.roomId, 1, 'Single resource has scalar value');
    assert.deepEqual(item.ownerId, [1], 'Multiple resource has array value');
});

QUnit.test('Get resources value by fields', function(assert) {
    const done = assert.async();

    loadResources(['ownerId'], resourceData, new Map()).done(function(groups) {
        assert.deepEqual(groups, [
            {
                name: 'ownerId',
                items: [
                    {
                        id: 1,
                        text: '#606060',
                        color: '#606060'
                    },
                    {
                        id: 2,
                        text: '#ff0000',
                        color: '#ff0000'
                    }],
                data: [
                    {
                        uid: 1,
                        text: 'Jack',
                        color: '#606060'
                    },
                    {
                        uid: 2,
                        text: 'Mike',
                        color: '#ff0000'
                    }]
            }
        ], 'Groups are OK');
        done();
    });
});


QUnit.test('Get resources value by fields with long resource dataSource', function(assert) {
    const done = assert.async();

    setTimeout(function() {
        promiseData.load();
    });

    loadResources(['roomId'], resourceDataWithDataSource, new Map()).done(function(groups) {
        assert.deepEqual(groups, [
            {
                items: [
                    {
                        id: 1,
                        text: 'Room1',
                        color: '#cb6bb2'
                    },
                    {
                        id: 2,
                        text: 'Room2',
                        color: '#56ca85'
                    }
                ],
                name: 'roomId',
                data: [
                    {
                        id: 1,
                        text: 'Room1',
                        color: '#cb6bb2'
                    },
                    {
                        id: 2,
                        text: 'Room2',
                        color: '#56ca85'
                    }
                ]
            }
        ], 'Groups are OK');
        done();
    });
});

QUnit.test('Get resources data with long resource dataSource', function(assert) {
    const done = assert.async();

    setTimeout(function() {
        promiseData.load();
    });

    getOrLoadResourceItem(resourceDataWithDataSource, new Map(), 'roomId', 2).done(function(data) {
        assert.deepEqual(data, {
            id: 2,
            text: 'Room2',
            color: '#56ca85'
        }, 'Groups are OK');
        done();
    });
});

QUnit.test('Get color for resource', function(assert) {
    const done = assert.async();

    getResourceColor(resourceData, new Map(), 'ownerId', 2).done(function(color) {
        assert.equal(color, testData.owners[1].color, 'Color is OK');
        done();
    });

});

QUnit.test('Get color for resource with colorExpr', function(assert) {
    const roomData = [{
        field: 'roomId',
        label: 'Room',
        allowMultiple: false,
        colorExpr: 'color1',
        dataSource: [{
            text: 'Room1',
            id: 1,
            color1: '#cb6bb2'
        }]
    }];
    const done = assert.async();

    getResourceColor(roomData, new Map(), 'roomId', 1).done(function(color) {
        assert.equal(color, roomData[0].dataSource[0].color1, 'Color is OK');
        done();
    });
});

QUnit.test('Get color for resource with valueExpr', function(assert) {
    const roomData =
        {
            field: 'roomId',
            label: 'Room',
            allowMultiple: false,
            valueExpr: 'Id',
            dataSource: [{
                text: 'Room1',
                Id: 1,
                color: '#cb6bb2'
            }]
        };

    const done = assert.async();

    const resourceLoaderMap = new Map();

    loadResources(['roomId'], [roomData], resourceLoaderMap).done($.proxy(function(groups) {
        getResourceColor([roomData], resourceLoaderMap, 'roomId', 1).done(function(color) {
            assert.equal(color, roomData.dataSource[0].color, 'Color is OK');
            done();
        });
    }, this));
});

QUnit.test('Color for undefined resource should be undefined', function(assert) {
    const done = assert.async();

    getResourceColor(resourceData, new Map(), 'ownerId', 777).done(function(color) {
        assert.strictEqual(color, undefined, 'Color for undefined resource is undefined');
        done();
    });
});

QUnit.test('Filter resources by fields', function(assert) {
    const resources = filterResources(resourceData, ['ownerId', 'groupId']);

    assert.deepEqual(resources, [resourceData[1]], 'Resources were found');
});

QUnit.test('Get resource for painting', function(assert) {
    const resources = [
        { field: 'roomId' },
        { field: 'ownerId' }
    ];

    assert.equal(getPaintedResources(resources).field, 'ownerId', 'Resource is right');
    assert.equal(getPaintedResources(resources, []).field, 'ownerId', 'Resource is right');
});

QUnit.test('Get resource for painting by group', function(assert) {
    const resources = [
        { field: 'ownerId' },
        { field: 'roomId' },
        { field: 'managerId' }
    ];

    assert.equal(getPaintedResources(resources, ['ownerId', 'roomId']).field, 'roomId', 'Resource is right');
});

QUnit.test('Get resource for painting by the \'useColorAsDefault\' field', function(assert) {
    const resources = [
        { field: 'ownerId' },
        { field: 'roomId' },
        { field: 'managerId', useColorAsDefault: true },
        { field: 'groupId', useColorAsDefault: true }
    ];

    assert.equal(getPaintedResources(resources).field, 'managerId', 'Resource is right');
    assert.equal(getPaintedResources(resources, ['ownerId', 'roomId']).field, 'managerId', 'Resource is right');
});

QUnit.test('Get appointments by certain resources', function(assert) {
    const resources = [
        { field: 'ownerId' },
        { field: 'roomId' }
    ];

    const appointments = [
        { startDate: new Date(2016, 1, 2), endDate: new Date(2016, 1, 2, 1), ownerId: 1, roomId: 1 },
        { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 1), ownerId: 2, roomId: 1 },
        { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 1), ownerId: 1, roomId: 1 },
        { startDate: new Date(2016, 1, 3, 2), endDate: new Date(2016, 1, 3, 3), ownerId: 1, roomId: 2 },
        { startDate: new Date(2016, 1, 5), endDate: new Date(2016, 1, 5, 1), ownerId: [1, 2], roomId: 1 },
        { startDate: new Date(2016, 1, 4), endDate: new Date(2016, 1, 4, 1), ownerId: 2, roomId: 1 },
        { startDate: new Date(2016, 1, 4), endDate: new Date(2016, 1, 4, 1), ownerId: [1, 2], roomId: [1, 2] }
    ];

    const config = {
        resources,
        dataAccessors: createExpressions(resources)
    };

    const result = groupAppointmentsByResourcesCore(config, appointments, [
        {
            name: 'ownerId',
            items: [{ id: 1 }, { id: 2 }]
        }, {
            name: 'roomId',
            items: [{ id: 1 }, { id: 2 }]
        }]);

    assert.deepEqual(result,
        {
            '0': [
                appointments[0],
                appointments[2],
                appointments[4],
                appointments[6]
            ],
            '1': [
                appointments[3],
                appointments[6]
            ],
            '2': [
                appointments[1],
                appointments[4],
                appointments[5],
                appointments[6]
            ],
            '3': [
                appointments[6]
            ]
        }, 'Data is correct');
});

QUnit.test('Reduce resource tree depend on existing appointments', function(assert) {
    const done = assert.async();

    const resources = [{
        fieldExpr: 'o',
        allowMultiple: false,
        dataSource: [
            { id: 1, text: 'o1' },
            { id: 2, text: 'o2' }
        ]
    }, {
        fieldExpr: 'r',
        allowMultiple: true,
        dataSource: [
            { id: 1, text: 'r1' },
            { id: 2, text: 'r2' },
            { id: 3, text: 'r3' }
        ]
    }, {
        fieldExpr: 'a',
        allowMultiple: false,
        dataSource: [
            { id: 1, text: 'a1' },
            { id: 2, text: 'a2' }
        ]
    }];

    const appointments = [{
        o: 1,
        r: [1, 2],
        a: 1
    }, {
        o: 1,
        r: [3],
        a: 1
    }];

    loadResources(['o', 'r', 'a'], resources, new Map()).done($.proxy(function(groups) {
        const tree = createResourcesTree(groups);
        const reducedTree = reduceResourcesTree(
            (field, action) => getDataAccessors(createExpressions(resources), field, action),
            tree,
            appointments
        );

        assert.equal(reducedTree.length, 1, 'reducedTree has 1 item');
        assert.equal(reducedTree[0].name, 'o', 'reducedTree has correct name');
        assert.equal(reducedTree[0].value, 1, 'reducedTree has correct value');
        assert.equal(reducedTree[0].title, 'o1', 'reducedTree has correct title');
        assert.deepEqual(reducedTree[0].data, {
            id: 1,
            text: 'o1'
        }, 'reducedTree has correct data object');

        assert.deepEqual(reducedTree[0].children, [
            {
                name: 'r',
                value: 1,
                title: 'r1',
                children: [
                    {
                        name: 'a',
                        value: 1,
                        title: 'a1',
                        children: [],
                        data: {
                            id: 1,
                            text: 'a1'
                        }
                    },
                ],
                data: {
                    id: 1,
                    text: 'r1'
                }
            },
            {
                name: 'r',
                value: 2,
                title: 'r2',
                children: [
                    {
                        name: 'a',
                        title: 'a1',
                        value: 1,
                        children: [],
                        data: {
                            id: 1,
                            text: 'a1'
                        }
                    }
                ],
                data: {
                    id: 2,
                    text: 'r2'
                }
            },
            {
                name: 'r',
                value: 3,
                title: 'r3',
                children: [
                    {
                        name: 'a',
                        title: 'a1',
                        value: 1,
                        children: [],
                        data: {
                            id: 1,
                            text: 'a1'
                        }
                    }
                ],
                data: {
                    id: 3,
                    text: 'r3'
                }
            },
        ], 'reducedTree has correct children array');

        done();
    }, this));

});

QUnit.test('Resource data should be loaded correctly is data source is config object', function(assert) {
    const resources = [
        {
            field: 'ownerId', dataSource: {
                store: [{
                    id: 1
                }]
            }
        }
    ];

    const done = assert.async();

    getOrLoadResourceItem(resources, new Map(), 'ownerId', 1).done(function(result) {
        assert.deepEqual(result, {
            id: 1
        }, 'Resource data is right');

        done();
    });
});

QUnit.test('Resource data should be loaded correctly is data source is string', function(assert) {

    const json = { id: 1 };
    const xhr = sinon.useFakeXMLHttpRequest();
    const requests = [];

    xhr.onCreate = function(x) {
        requests.push(x);
    };

    const resources = [{
        field: 'ownerId', dataSource: 'api/appointments'
    }];

    const done = assert.async();

    getOrLoadResourceItem(resources, new Map(), 'ownerId', 1).done(function(result) {
        assert.deepEqual(result, {
            id: 1
        }, 'Resource data is right');

        xhr.restore();
        done();
    });

    requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(json));

});

QUnit.test('Load should be called once for several resources', function(assert) {
    let count = 0;
    const deferred = $.Deferred();

    const resources = [{
        fieldExpr: 'ownerId',
        allowMultiple: true,
        dataSource: new DataSource(new CustomStore({
            load: function() {
                count++;
                return deferred.promise();
            }
        }))
    }];

    const loaderMap = new Map();

    getOrLoadResourceItem(resources, loaderMap, 'ownerId', 1).done(function(res) {
        assert.deepEqual(res, { text: 'o1', id: 1 }, 'Resource data is right');
    });
    getOrLoadResourceItem(resources, loaderMap, 'ownerId', 2);
    getOrLoadResourceItem(resources, loaderMap, 'ownerId', 1);

    deferred.resolve([{ text: 'o1', id: 1 }, { text: 'o2', id: 2 }]);

    assert.equal(count, 1, 'Resources are loaded only once');
});

QUnit.test('getResourcesData should be correct after reloading resources', function(assert) {
    const roomData =
        {
            field: 'roomId',
            label: 'Room',
            allowMultiple: false,
            valueExpr: 'Id',
            dataSource: [{
                text: 'Room1',
                Id: 1,
                color: '#cb6bb2'
            }]
        };

    const done = assert.async();

    loadResources(['roomId'], [roomData], new Map()).done($.proxy(function(loadedResources) {
        assert.equal(loadedResources.length, 1, 'getResourcesData works correctly');

        loadResources([], [roomData]).done($.proxy(function(loadedResources) {
            assert.deepEqual(loadedResources, [], 'getResourcesData works correctly');
            done();
        }, this));
    }, this));
});

[
    {
        name: 'Rooms single',
        loadingGroups: ['roomId'],
        groups: [{ roomId: 0 }],
        expected: [{
            data: [{ Id: 0, color: '#cb6bb2', text: 'Room1' }],
            items: [{ color: '#cb6bb2', id: 0, text: 'Room1' }],
            name: 'roomId'
        }]
    },
    {
        name: 'Rooms multiple',
        loadingGroups: ['roomId'],
        groups: [{ roomId: 0 }, { roomId: 2 }],
        expected: [
            {
                data: [
                    { Id: 0, color: '#cb6bb2', text: 'Room1' },
                    { Id: 2, color: '#cb6bb3', text: 'Room2' }
                ],
                items: [
                    { id: 0, color: '#cb6bb2', text: 'Room1' },
                    { id: 2, color: '#cb6bb3', text: 'Room2' }
                ],
                name: 'roomId'
            }
        ]
    },
    {
        name: 'Phones single',
        loadingGroups: ['phoneId'],
        groups: [{ phoneId: 0 }],
        expected: [{
            data: [{ Id: 0, text: 'Phone1', color: '#cd6bb2' }],
            items: [{ id: 0, text: 'Phone1', color: '#cd6bb2' }],
            name: 'phoneId'
        }]
    },
    {
        name: 'Phones multiple',
        loadingGroups: ['phoneId'],
        groups: [{ phoneId: 0 }, { phoneId: 3 }],
        expected: [{
            data: [
                { Id: 0, text: 'Phone1', color: '#cd6bb2' },
                { Id: 3, text: 'Phone3', color: '#cd6bb4' }
            ],
            items: [
                { id: 0, text: 'Phone1', color: '#cd6bb2' },
                { id: 3, text: 'Phone3', color: '#cd6bb4' }
            ],
            name: 'phoneId'
        }]
    },
    {
        name: 'Rooms, Phones multiple',
        loadingGroups: ['roomId', 'phoneId'],
        groups: [
            { roomId: 2 }, { roomId: 3 },
            { phoneId: 0 }, { phoneId: 3 }
        ],
        expected: [
            {
                data: [
                    { Id: 2, color: '#cb6bb3', text: 'Room2' },
                    { Id: 3, color: '#cb6bb4', text: 'Room3' }
                ],
                items: [
                    { id: 2, color: '#cb6bb3', text: 'Room2' },
                    { id: 3, color: '#cb6bb4', text: 'Room3' }
                ],
                name: 'roomId'
            }, {
                data: [
                    { Id: 0, text: 'Phone1', color: '#cd6bb2' },
                    { Id: 3, text: 'Phone3', color: '#cd6bb4' }
                ],
                items: [
                    { id: 0, color: '#cd6bb2', text: 'Phone1' },
                    { id: 3, color: '#cd6bb4', text: 'Phone3' }
                ],
                name: 'phoneId'
            }
        ]
    }
].forEach(({ name, groups, loadingGroups, expected }) => {
    QUnit.test(`getResourcesDataByGroups if resources: '${name}'`, function(assert) {
        const roomData = [
            {
                field: 'roomId',
                label: 'Rooms',
                allowMultiple: true,
                valueExpr: 'Id',
                dataSource: [
                    { Id: 0, text: 'Room1', color: '#cb6bb2' },
                    { Id: 2, text: 'Room2', color: '#cb6bb3' },
                    { Id: 3, text: 'Room3', color: '#cb6bb4' }
                ]
            },
            {
                field: 'phoneId',
                label: 'Phones',
                allowMultiple: true,
                valueExpr: 'Id',
                dataSource: [
                    { Id: 0, text: 'Phone1', color: '#cd6bb2' },
                    { Id: 2, text: 'Phone2', color: '#cd6bb3' },
                    { Id: 3, text: 'Phone3', color: '#cd6bb4' }
                ]
            }
        ];

        const done = assert.async();

        loadResources(loadingGroups, roomData, new Map()).done($.proxy(loadedResources => {
            const resourcesDataByGroups = getResourcesDataByGroups(loadedResources, roomData, groups);

            assert.deepEqual(resourcesDataByGroups, expected, 'getResourcesDataByGroups works correctly');

            done();

        }, this));
    });

    QUnit.test('getResourcesDataByGroups if empty groups', function(assert) {
        const done = assert.async();

        loadResources([], [], new Map()).done($.proxy(loadedResources => {
            const resourcesDataByGroups = getResourcesDataByGroups(loadedResources, []);

            assert.deepEqual(resourcesDataByGroups, [], 'getResourcesDataByGroups works correctly');

            done();
        }, this));
    });
});

QUnit.test('resources should be validated (transformed into an empty array) after loading', function(assert) {
    const done = assert.async();

    const resources = [{
        field: 'ownerId',
        dataSource: []
    }];

    loadResources(['ownerId'], resources, new Map()).done((resources) => {
        assert.deepEqual(resources, [], 'Correct resources');

        done();
    });
});
