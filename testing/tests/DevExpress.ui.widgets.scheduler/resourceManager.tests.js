import $ from 'jquery';
import { ResourceManager } from 'ui/scheduler/resources/resourceManager';
import { getWrappedDataSource } from 'ui/scheduler/resources/utils';
import { DataSource } from 'data/data_source/data_source';
import CustomStore from 'data/custom_store';

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

QUnit.module('Resource Manager', {
    beforeEach: function() {
        this.createInstance = function(resources) {
            this.instance = new ResourceManager(resources);
        };
    }
});

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

QUnit.test('Init', function(assert) {
    this.createInstance();
    assert.ok(this.instance instanceof ResourceManager, 'Resource Manager is initialized');
});

QUnit.test('Resources should be initialized on ctor', function(assert) {
    this.createInstance(resourceData);
    assert.deepEqual(this.instance.getResources(), resourceData, 'Resources are correct');
});

QUnit.test('Resources dataSource should not be wrapped if it\'s instance of the DataSource', function(assert) {
    const done = assert.async();

    const dataSource = new DataSource({
        store: testData.rooms
    });

    this.createInstance([{
        field: 'roomId',
        label: 'Room',
        allowMultiple: false,
        dataSource: dataSource
    }]);

    this.instance.getResourceDataByValue('roomId', 1).done(function() {
        assert.equal(dataSource.items().length, testData.rooms.length, 'DS items are OK');
        done();
    });
});

QUnit.test('Set/Get resources', function(assert) {
    this.createInstance();
    this.instance.setResources(resourceData);
    assert.deepEqual(this.instance.getResources(), resourceData, 'Resources are correct');
});

QUnit.test('Get editors for resources', function(assert) {
    this.createInstance(resourceData);
    const editors = this.instance.getEditors();

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
    this.createInstance([{
        field: 'roomId',
        allowMultiple: false,
        dataSource: testData.rooms
    }]);

    assert.equal(this.instance.getEditors()[0].label.text, 'roomId');
});

QUnit.test('Get resource by field name and value', function(assert) {
    this.createInstance(resourceData);
    const done = assert.async();

    this.instance.getResourceDataByValue('roomId', 2).done(function(data) {
        assert.deepEqual(data, resourceData[0].dataSource[1], 'Resource was found');
        done();
    });
});

QUnit.test('Get resources from item data', function(assert) {
    this.createInstance(resourceData);
    const item = { text: 'Item 1', startDate: new Date(), roomId: 2, ownerId: [1, 2] };
    const resources = this.instance.getResourcesFromItem(item);

    assert.deepEqual(resources, { roomId: [2], ownerId: [1, 2] }, 'Resources were found');
});

QUnit.test('Get resources from item data with combined resource field', function(assert) {
    this.createInstance([{
        field: 'outer.roomId',
        allowMultiple: false,
        dataSource: [
            {
                text: 'Room1',
                id: 1,
                color: '#cb6bb2'
            }
        ]
    },
    {
        fieldExpr: 'ownerId',
        allowMultiple: true,
        dataSource: [
            { id: 1 }, { id: 2 }
        ]
    }]);

    const item = { text: 'Item 1', startDate: new Date(), outer: { roomId: 2 }, ownerId: [1, 2] };
    const resources = this.instance.getResourcesFromItem(item, true);

    assert.deepEqual(resources, {
        outer: { roomId: 2 },
        ownerId: [1, 2]
    }, 'Resources were found');
});

QUnit.test('resourcesManager.getDataAccessors should return dataAccessors ', function(assert) {
    this.createInstance([{
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
    }]);

    const item = { text: 'Item 1', startDate: new Date(), outer: { roomId: 2, ownerId: [1, 2] } };
    const resourceGetter = this.instance.getDataAccessors('outer.roomId', 'getter');
    const resourceSetter = this.instance.getDataAccessors('outer.roomId', 'setter');

    assert.equal(resourceGetter(item), 2, 'getter is ok');
    resourceSetter(item, 1);
    assert.equal(resourceGetter(item), 1, 'setter & getter is ok');
});

QUnit.test('resourcesManager.getDataAccessors should return dataAccessors (use fieldExpr)', function(assert) {
    this.createInstance([{
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
    }]);

    const item = { text: 'Item 1', startDate: new Date(), outer: { roomId: 2, ownerId: [1, 2] } };
    const resourceGetter = this.instance.getDataAccessors('outer.roomId', 'getter');
    const resourceSetter = this.instance.getDataAccessors('outer.roomId', 'setter');

    assert.equal(resourceGetter(item), 2, 'getter is ok');
    resourceSetter(item, 1);
    assert.equal(resourceGetter(item), 1, 'setter & getter is ok');
});

QUnit.test('resourcesManager.getResourceTreeLeaves should work correctly when resource.field is expr', function(assert) {
    const done = assert.async();

    this.createInstance([{
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
    }]);


    const resourcesFromItem = this.instance.getResourcesFromItem({
        text: 'Item 1',
        startDate: new Date(),
        outer: { roomId: 2 },
        ownerId: [1, 2]
    });

    this.instance.loadResources(['outer.roomId', 'ownerId']).done($.proxy(function(groups) {
        const tree = this.instance.createResourcesTree(groups);
        const result = this.instance.getResourceTreeLeaves(tree, resourcesFromItem);

        assert.deepEqual(result, [2, 3], 'Leaves are OK');

        done();
    }, this));
});

QUnit.test('Set resources to item', function(assert) {
    this.createInstance(resourceData);
    const item = { text: 'Item 1', startDate: new Date() };

    this.instance.setResourcesToItem(item, { roomId: 1 });
    this.instance.setResourcesToItem(item, { ownerId: 1 });

    assert.strictEqual(item.roomId, 1, 'Single resource has scalar value');
    assert.deepEqual(item.ownerId, [1], 'Multiple resource has array value');
});

QUnit.test('Get resources from item that has no resources', function(assert) {
    this.createInstance(resourceData);
    const item = { text: 'Item 1', startDate: new Date() };
    const resources = this.instance.getResourcesFromItem(item);

    assert.strictEqual(resources, null, 'Resources were not found');
});

QUnit.test('Get resources from item without wrapping result array', function(assert) {
    this.createInstance(resourceData);
    const item = { text: 'Item 1', startDate: new Date(), roomId: 1 };
    const resources = this.instance.getResourcesFromItem(item, true);

    assert.deepEqual(resources, { roomId: 1 }, 'Resources were not found');
});

QUnit.test('Get resources value by fields', function(assert) {
    this.createInstance(resourceData);
    const done = assert.async();

    this.instance.loadResources(['ownerId']).done(function(groups) {
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
    this.createInstance(resourceDataWithDataSource);
    const done = assert.async();

    setTimeout(function() {
        promiseData.load();
    });

    this.instance.loadResources(['roomId']).done(function(groups) {
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
    this.createInstance(resourceDataWithDataSource);
    const done = assert.async();

    setTimeout(function() {
        promiseData.load();
    });

    this.instance.getResourceDataByValue('roomId', 2).done(function(data) {
        assert.deepEqual(data, {
            id: 2,
            text: 'Room2',
            color: '#56ca85'
        }, 'Groups are OK');
        done();
    });
});

QUnit.test('Get color for resource', function(assert) {
    this.createInstance(resourceData);
    const done = assert.async();

    this.instance.getResourceColor('ownerId', 2).done(function(color) {
        assert.equal(color, testData.owners[1].color, 'Color is OK');
        done();
    });

});

QUnit.test('Get color for resource with colorExpr', function(assert) {
    const roomData =
        {
            field: 'roomId',
            label: 'Room',
            allowMultiple: false,
            colorExpr: 'color1',
            dataSource: [{
                text: 'Room1',
                id: 1,
                color1: '#cb6bb2'
            }]
        };
    this.createInstance([roomData]);
    const done = assert.async();

    this.instance.getResourceColor('roomId', 1).done(function(color) {
        assert.equal(color, roomData.dataSource[0].color1, 'Color is OK');
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
    this.createInstance([roomData]);
    const done = assert.async();

    this.instance.loadResources(['roomId']).done($.proxy(function(groups) {
        this.instance.getResourceColor('roomId', 1).done(function(color) {
            assert.equal(color, roomData.dataSource[0].color, 'Color is OK');
            done();
        });
    }, this));
});

QUnit.test('Color for undefined resource should be undefined', function(assert) {
    this.createInstance(resourceData);
    const done = assert.async();

    this.instance.getResourceColor('ownerId', 777).done(function(color) {
        assert.strictEqual(color, undefined, 'Color for undefined resource is undefined');
        done();
    });
});

QUnit.test('Get resources by fields', function(assert) {
    this.createInstance(resourceData);
    const resources = this.instance.getResourcesByFields(['ownerId', 'groupId']);

    assert.deepEqual(resources, [resourceData[1]], 'Resources were found');
});

QUnit.test('Get resource for painting', function(assert) {
    this.createInstance([
        { field: 'roomId' },
        { field: 'ownerId' }
    ]);

    assert.equal(this.instance.getResourceForPainting().field, 'ownerId', 'Resource is right');
    assert.equal(this.instance.getResourceForPainting([]).field, 'ownerId', 'Resource is right');
});

QUnit.test('Get resource for painting by group', function(assert) {
    this.createInstance([
        { field: 'ownerId' },
        { field: 'roomId' },
        { field: 'managerId' }
    ]);

    assert.equal(this.instance.getResourceForPainting(['ownerId', 'roomId']).field, 'roomId', 'Resource is right');
});

QUnit.test('Get resource for painting by the \'useColorAsDefault\' field', function(assert) {
    this.createInstance([
        { field: 'ownerId' },
        { field: 'roomId' },
        { field: 'managerId', useColorAsDefault: true },
        { field: 'groupId', useColorAsDefault: true }
    ]);

    assert.equal(this.instance.getResourceForPainting().field, 'managerId', 'Resource is right');
    assert.equal(this.instance.getResourceForPainting(['ownerId', 'roomId']).field, 'managerId', 'Resource is right');
});

QUnit.test('Get appointments by certain resources', function(assert) {
    this.createInstance([
        { field: 'ownerId' },
        { field: 'roomId' }
    ]);

    const appointments = [
        { startDate: new Date(2016, 1, 2), endDate: new Date(2016, 1, 2, 1), ownerId: 1, roomId: 1 },
        { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 1), ownerId: 2, roomId: 1 },
        { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 1), ownerId: 1, roomId: 1 },
        { startDate: new Date(2016, 1, 3, 2), endDate: new Date(2016, 1, 3, 3), ownerId: 1, roomId: 2 },
        { startDate: new Date(2016, 1, 5), endDate: new Date(2016, 1, 5, 1), ownerId: [1, 2], roomId: 1 },
        { startDate: new Date(2016, 1, 4), endDate: new Date(2016, 1, 4, 1), ownerId: 2, roomId: 1 },
        { startDate: new Date(2016, 1, 4), endDate: new Date(2016, 1, 4, 1), ownerId: [1, 2], roomId: [1, 2] }
    ];

    const result = this.instance.groupAppointmentsByResourcesCore(appointments, [
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

    this.createInstance([{
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
    }]);

    const appointments = [{
        o: 1,
        r: [1, 2],
        a: 1
    }, {
        o: 1,
        r: [3],
        a: 1
    }];

    this.instance.loadResources(['o', 'r', 'a']).done($.proxy(function(groups) {
        const tree = this.instance.createResourcesTree(groups);
        const reducedTree = this.instance.reduceResourcesTree(tree, appointments);

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
    this.createInstance([
        {
            field: 'ownerId', dataSource: {
                store: [{
                    id: 1
                }]
            }
        }
    ]);

    const done = assert.async();

    this.instance.getResourceDataByValue('ownerId', 1).done(function(result) {
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

    this.createInstance([
        {
            field: 'ownerId', dataSource: 'api/appointments'
        }
    ]);

    const done = assert.async();

    this.instance.getResourceDataByValue('ownerId', 1).done(function(result) {
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

    this.createInstance([{
        fieldExpr: 'ownerId',
        allowMultiple: true,
        dataSource: new DataSource(new CustomStore({
            load: function() {
                count++;
                return deferred.promise();
            }
        }))
    }]
    );

    this.instance.getResourceDataByValue('ownerId', 1).done(function(res) {
        assert.deepEqual(res, { text: 'o1', id: 1 }, 'Resource data is right');
    });
    this.instance.getResourceDataByValue('ownerId', 2);
    this.instance.getResourceDataByValue('ownerId', 1);

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
    this.createInstance([roomData]);
    const done = assert.async();

    this.instance.loadResources(['roomId']).done($.proxy(function(groups) {
        assert.deepEqual(this.instance.getResourcesData(), groups, 'getResourcesData works correctly');

        this.instance.loadResources([]).done($.proxy(function(groups) {
            assert.deepEqual(this.instance.getResourcesData(), [], 'getResourcesData works correctly');
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

        this.createInstance(roomData);

        const done = assert.async();

        this.instance.loadResources(loadingGroups).done($.proxy(() => {

            const resourcesDataByGroups = this.instance.getResourcesDataByGroups(groups);

            assert.deepEqual(
                resourcesDataByGroups,
                expected,
                'getResourcesDataByGroups works correctly'
            );

            done();

        }, this));
    });

    QUnit.test('getResourcesDataByGroups if empty groups', function(assert) {
        this.createInstance([]);

        const done = assert.async();

        this.instance.loadResources([]).done($.proxy(() => {
            const resourcesDataByGroups = this.instance.getResourcesDataByGroups();

            assert.deepEqual(resourcesDataByGroups, [], 'getResourcesDataByGroups works correctly');

            done();
        }, this));
    });
});

QUnit.test('resources should be validated (transformed into an empty array) after loading', function(assert) {
    const done = assert.async();

    this.createInstance([{
        field: 'ownerId',
        dataSource: []
    }]);

    this.instance.loadResources(['ownerId']).done((resources) => {
        assert.deepEqual(resources, [], 'Correct resources');

        done();
    });
});
