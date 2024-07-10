import $ from 'jquery';
import { getPublicElement, setPublicElementWrapper } from 'core/element';

QUnit.module('Public element', () => {
    QUnit.test('Should unwrap element using current strategy', function(assert) {
        const unwrappedElement = {};
        const wrappedElement = $(unwrappedElement);
        const expectedPublicElement = QUnit.urlParams['nojquery'] ? unwrappedElement : wrappedElement;
        assert.strictEqual(getPublicElement(wrappedElement), expectedPublicElement);
    });

    QUnit.test('Should use new strategy to unwrap public element', function(assert) {
        const expectedPublicElement = { };
        const mockElement = { unwrappedElement: expectedPublicElement };
        setPublicElementWrapper((element) => element.unwrappedElement);
        assert.strictEqual(getPublicElement(mockElement), expectedPublicElement);
    });
});
