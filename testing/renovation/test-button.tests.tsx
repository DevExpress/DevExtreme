import Button, { viewModelFunction, viewFunction } from '../../js/ui/test-button';

// import * as React from 'react';
import { shallow } from 'enzyme';

describe('Button', () => {
    it('should render text', () => {
        const model = new Button();
        model.text = 'My button';

        const tree = shallow(viewFunction(viewModelFunction(model)));

        expect(tree.find('.dx-button-text').text()).toBe('My button');
    });

    it('should have dx-widget class', () => {
        const model = new Button();

        const tree = shallow(viewFunction(viewModelFunction(model)));

        expect(tree.is('.dx-widget')).toBeTruthy();
    });

    it('should be of success type', () => {
        const model = new Button();
        model.type = 'success';

        const tree = shallow(viewFunction(viewModelFunction(model)));

        expect(tree.is('.dx-button.dx-button-success')).toBeTruthy();
    });

    it('should change hover state on pointerover/pointerout', () => {
        const model = new Button();
        model.type = 'success';

        let tree = shallow(viewFunction(viewModelFunction(model)));
        expect(tree.is('.dx-button.dx-state-hover')).toBeFalsy();

        model.onPointerOver();
        tree = shallow(viewFunction(viewModelFunction(model)));
        expect(tree.is('.dx-button.dx-state-hover')).toBeTruthy();

        model.onPointerOut();
        tree = shallow(viewFunction(viewModelFunction(model)));
        expect(tree.is('.dx-button.dx-state-hover')).toBeFalsy();
    });
});
