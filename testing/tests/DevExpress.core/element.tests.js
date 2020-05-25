import { getPublicElement, setPublicElementWrapper } from 'core/element';

QUnit.module('Public element', () => {
    QUnit.test('Should unwrap element using current strategy', function(assert) {
        const unwrappedElement = {};
        const mockElement = { get: (i) => i === 0 && unwrappedElement };
        const expectedPublicElement = QUnit.urlParams['nojquery'] ? unwrappedElement : mockElement;
        assert.strictEqual(getPublicElement(mockElement), expectedPublicElement);
    });

    QUnit.test('Should use new strategy to unwrap public element', function(assert) {
        const expectedPublicElement = { };
        const mockElement = { unwrappedElement: expectedPublicElement };
        setPublicElementWrapper((element) => element.unwrappedElement);
        assert.strictEqual(getPublicElement(mockElement), expectedPublicElement);
    });
});
