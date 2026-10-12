import { registerPattern, registerGradient } from 'common/charts';
import graphicObjects from '__internal/common/charts';

function clearGraphicObjects() {
    const objects = graphicObjects.getGraphicObjects();
    Object.keys(objects).forEach((key) => {
        delete objects[key];
    });
}

QUnit.module('Graphic objects', {
    beforeEach: function() {
        clearGraphicObjects();
    },
    afterEach: function() {
        clearGraphicObjects();
    }
});

QUnit.test('should register pattern', function(assert) {
    const id_1 = registerPattern({ key: 'test_key_1' });
    const id_2 = registerPattern({ key: 'test_key_2' });

    assert.ok(/^DevExpress_\d+$/.test(id_1), 'id has expected format');
    assert.notEqual(id_1, id_2, 'ids are unique');
    assert.deepEqual(graphicObjects.getGraphicObjects(), {
        [id_1]: { key: 'test_key_1', type: 'pattern' },
        [id_2]: { key: 'test_key_2', type: 'pattern' }
    });
});

QUnit.test('should register gradient', function(assert) {
    const id_1 = registerGradient('gradient_type', { key: 'test_key_1' });
    const id_2 = registerGradient('gradient_type', { key: 'test_key_2' });

    assert.ok(/^DevExpress_\d+$/.test(id_1), 'id has expected format');
    assert.notEqual(id_1, id_2, 'ids are unique');
    assert.deepEqual(graphicObjects.getGraphicObjects(), {
        [id_1]: { key: 'test_key_1', type: 'gradient_type' },
        [id_2]: { key: 'test_key_2', type: 'gradient_type' }
    });
});
