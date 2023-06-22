import { registerPattern, registerGradient } from 'common/charts';
import graphicObjects from '__internal/common/m_charts';
import utils from 'viz/core/utils';


QUnit.module('Graphic objects', {
    beforeEach: function() {
        this.getNextDefsStub = sinon.stub(utils, 'getNextDefsSvgId');
        this.getNextDefsStub.onCall(0).returns('DevExpressId_1');
        this.getNextDefsStub.onCall(1).returns('DevExpressId_2');
    },
    afterEach: function() {
        this.getNextDefsStub.restore();
    }
});

QUnit.test('should register pattern', function(assert) {
    const id_1 = registerPattern({ key: 'test_key_1' });
    const id_2 = registerPattern({ key: 'test_key_2' });

    assert.equal(this.getNextDefsStub.callCount, 2);
    assert.equal(id_1, 'DevExpressId_1');
    assert.equal(id_2, 'DevExpressId_2');
    assert.deepEqual(graphicObjects.getGraphicObjects(), {
        'DevExpressId_1': { key: 'test_key_1', type: 'pattern' },
        'DevExpressId_2': { key: 'test_key_2', type: 'pattern' }
    });
});

QUnit.test('should register gradient', function(assert) {
    const id_1 = registerGradient('gradient_type', { key: 'test_key_1' });
    const id_2 = registerGradient('gradient_type', { key: 'test_key_2' });

    assert.equal(this.getNextDefsStub.callCount, 2);
    assert.equal(id_1, 'DevExpressId_1');
    assert.equal(id_2, 'DevExpressId_2');
    assert.deepEqual(graphicObjects.getGraphicObjects(), {
        'DevExpressId_1': { key: 'test_key_1', type: 'gradient_type' },
        'DevExpressId_2': { key: 'test_key_2', type: 'gradient_type' }
    });
});
