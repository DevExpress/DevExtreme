import { getPublicElement, setPublicElementWrapper } from 'core/element';

QUnit.module('Public element', () => {
    QUnit.test('Should unwrap element to clear node vy default', function(assert) {
        const expectedPublicElement = {};
        const mockElement = { get: (i) => i === 0 && expectedPublicElement };
        assert.strictEqual(getPublicElement(mockElement), expectedPublicElement);
    });

    QUnit.test('Should use new strategy to unwrap public element', function(assert) {
        const expectedPublicElement = {};
        const mockElement = expectedPublicElement;
        setPublicElementWrapper((element) => element);
        assert.strictEqual(getPublicElement(mockElement), expectedPublicElement);
    });
});
