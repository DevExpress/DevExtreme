import Store from "data/abstract_store";

QUnit.module("Abstract Store", function() {
    class MyStore { }
    QUnit.test("registerClass", function(assert) {
        Store.registerClass(MyStore, "my-store");
        const
            customStore = Store.create("my-store");
        assert.ok(customStore instanceof MyStore);
    });
});
