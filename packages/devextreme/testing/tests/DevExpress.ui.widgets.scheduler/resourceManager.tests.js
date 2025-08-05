import { ResourceManager } from '__internal/scheduler/utils/resource_manager/resource_manager';

QUnit.module('ResourceManager', () => {
    QUnit.test('Resource data should be loaded correctly is data source is string', async function(assert) {
        const xhr = sinon.useFakeXMLHttpRequest();
        let request;

        xhr.onCreate = function(x) {
            request = x;
        };

        const resources = [{
            field: 'ownerId',
            dataSource: 'api/appointments'
        }];
        const manager = new ResourceManager(resources);

        const promise = manager.loadGroupResources(['ownerId']);
        request.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify([{ id: 1 }]));
        await promise;

        assert.deepEqual(manager.resources[0].items, [{
            id: 1,
            color: undefined,
            text: undefined,
        }], 'Resource data is right');

        xhr.restore();
    });
});
