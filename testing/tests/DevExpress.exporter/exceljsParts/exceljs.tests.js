const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
};

const { test } = QUnit;

QUnit.module("API", moduleConfig, () => {

    test("Testing test", (assert) => {
        assert.ok(false, "Test fail");
    });

});
