// TODO: replace with jest in resource_loader.test.ts
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
