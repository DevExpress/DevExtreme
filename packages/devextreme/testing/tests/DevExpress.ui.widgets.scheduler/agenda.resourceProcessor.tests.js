import { AgendaResourceProcessor } from '__internal/scheduler/resources/m_agenda_resource_processor';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';

const {
    module,
    test
} = QUnit;

const rooms = [{
    text: 'Room 1',
    id: 1,
    color: '#00af2c'
}, {
    text: 'Room 2',
    id: 2,
    color: '#56ca85'
}, {
    text: 'Room 3',
    id: 3,
    color: '#8ecd3c'
}];

const roomResource = {
    fieldExpr: 'roomId',
    dataSource: rooms,
    label: 'Room'
};

const owners = [{
    text: 'Samantha Bright',
    id: 1,
    color: '#727bd2'
}, {
    text: 'John Heart',
    id: 2,
    color: '#32c9ed'
}, {
    text: 'Todd Hoffman',
    id: 3,
    color: '#2a7ee4'
}, {
    text: 'Sandra Johnson',
    id: 4,
    color: '#7b49d3'
}];

const ownerResource = {
    fieldExpr: 'ownerId',
    allowMultiple: true,
    dataSource: owners,
    label: 'Owner'
};

const appointment = {
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 6, 6),
    endDate: new Date(2021, 6, 7)
};

module('AgendaResourceProcessor', () => {
    module('Array', () => {
        test('Empty resources and don\'t set resources in appointment', function(assert) {
            const processor = new AgendaResourceProcessor();
            processor.initializeState([]);

            processor.createListAsync({ ...appointment })
                .done(list => assert.deepEqual(list, []));

            assert.expect(1);
        });

        test('Two resources and don\'t set resources in appointment', function(assert) {
            const processor = new AgendaResourceProcessor();
            processor.initializeState([roomResource, ownerResource]);

            processor.createListAsync({ ...appointment })
                .done(result => assert.deepEqual(result, []));

            assert.expect(1);
        });

        test('Appointment\'s resource value as number', function(assert) {
            const processor = new AgendaResourceProcessor();
            processor.initializeState([roomResource]);

            processor.createListAsync({
                ...appointment,
                roomId: 1,
            }).done(result => {
                assert.deepEqual(result, [{
                    label: 'Room',
                    values: ['Room 1']
                }]);
            });

            assert.expect(1);
        });

        test('Appointment\'s resource value as array', function(assert) {
            const processor = new AgendaResourceProcessor();
            processor.initializeState([roomResource]);

            processor.createListAsync({
                ...appointment,
                roomId: [1, 2],
            }).done(result => {
                assert.deepEqual(result, [{
                    label: 'Room',
                    values: ['Room 1', 'Room 2']
                }]);
            });

            assert.expect(1);
        });

        test('Appointment\'s resource value as number and array', function(assert) {
            const processor = new AgendaResourceProcessor();
            processor.initializeState([roomResource, ownerResource]);

            processor.createListAsync({
                ...appointment,
                roomId: [1, 2],
                ownerId: 2,
            }).done(result => {
                assert.deepEqual(result, [{
                    label: 'Room',
                    values: ['Room 1', 'Room 2']
                }, {
                    label: 'Owner',
                    values: ['John Heart']
                }]);
            });

            assert.expect(1);
        });

        test('State should be work as right', function(assert) {
            const processor = new AgendaResourceProcessor();
            processor.initializeState([roomResource]);

            processor.createListAsync({
                ...appointment,
                roomId: [1, 2],
            }).done(result => {
                assert.deepEqual(result, [{
                    label: 'Room',
                    values: ['Room 1', 'Room 2']
                }]);
            });

            assert.deepEqual(processor.appointmentPromiseQueue, [], 'promise queue should be clear after called all promises');

            assert.ok(processor.resourceMap.has('roomId'), 'resource map should be stored after called all promises');

            const resourceValues = processor.resourceMap.get('roomId');

            assert.equal(resourceValues.label, 'Room');
            resourceValues.map.forEach((value, key) => {
                assert.equal(value, `Room ${key}`, `resource text should be equal to 'Room ${key}'`);
            });

            processor.initializeState([]);
            processor.createListAsync({
                ...appointment,
                roomId: [1, 2],
            }).done();

            assert.deepEqual(processor.appointmentPromiseQueue, [], 'promise queue should be clear after second called all promises');
            assert.equal(processor.resourceMap.size, 0, 'resource map should be reset after second called all promises');

            assert.expect(9);
        });

        test('Field expressions', function(assert) {
            const processor = new AgendaResourceProcessor();
            processor.initializeState([{
                fieldExpr: 'OwnerId',
                valueExpr: 'Id',
                displayExpr: 'Text',
                label: 'Owner',
                dataSource: [{
                    Text: 'Samantha Bright',
                    Id: 1
                }, {
                    Text: 'John Heart',
                    Id: 2
                }, {
                    Text: 'Todd Hoffman',
                    Id: 3
                }, {
                    Text: 'Sandra Johnson',
                    Id: 4
                }]
            }]);

            processor.createListAsync({ ...appointment, OwnerId: [1, 3] })
                .done(list => assert.deepEqual(list, [{
                    label: 'Owner',
                    values: ['Samantha Bright', 'Todd Hoffman']
                }]));
        });
    });

    module('DataSource', () => {
        test('Load event of DataSource should be called once', function(assert) {
            let loadCount = 0;

            const processor = new AgendaResourceProcessor();
            processor.initializeState([
                {
                    fieldExpr: 'roomId',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: () => {
                                loadCount++;
                                return rooms;
                            }
                        })
                    }),
                    label: 'Room'
                }
            ]);

            processor.createListAsync({
                ...appointment,
                roomId: 1,
            }).done();

            processor.createListAsync({
                ...appointment,
                roomId: 2,
            }).done();

            processor.createListAsync({
                ...appointment,
                roomId: 2,
            }).done();

            processor.createListAsync({
                ...appointment,
                roomId: 3,
            }).done();

            assert.equal(loadCount, 1);

            assert.expect(1);
        });

        test('Resources as CustomStore', function(assert) {
            const processor = new AgendaResourceProcessor();
            processor.initializeState([
                {
                    fieldExpr: 'roomId',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: () => rooms
                        })
                    }),
                    label: 'Room'
                }
            ]);

            processor.createListAsync({
                ...appointment,
                roomId: 1,
            }).done(list => {
                assert.deepEqual(list, [{
                    label: 'Room',
                    values: ['Room 1']
                }]);
            });

            processor.createListAsync({
                ...appointment,
                roomId: 2,
            }).done(list => {
                assert.deepEqual(list, [{
                    label: 'Room',
                    values: ['Room 2']
                }]);
            });

            processor.createListAsync({
                ...appointment,
                roomId: 3,
            }).done(list => {
                assert.deepEqual(list, [{
                    label: 'Room',
                    values: ['Room 3']
                }]);
            });

            assert.expect(3);
        });
    });
});
