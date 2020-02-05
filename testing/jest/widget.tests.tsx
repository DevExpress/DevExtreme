import Widget from '../../js/renovation/widget.p.js';
import { h } from 'preact';
import { clear as clearEventHandlers, emit, fakeClickEvent, EVENT } from './utils/events-mock';
import { shallow, mount } from 'enzyme';

describe('Widget', () => {
    const render = (props = {}) => shallow(<Widget {...props} />);
    const mountRender = (props = {}) => mount(<Widget {...props} />);

    beforeEach(clearEventHandlers);

    describe('Props', () => {
        describe('accessKey', () => {
            it('should render "accesskey" attribute', () => {
                const widget = render({ accessKey: 'y', focusStateEnabled: true });

                expect(widget.props().accessKey).toBe('y');
            });

            it('should not render if disabled', () => {
                const widget = render({ accessKey: 'y', focusStateEnabled: true, disabled: true });

                expect(widget.props().accessKey).toBe(void 0);
            });

            it('should not render if focusStateEnabled is false', () => {
                const widget = render({ accessKey: 'y', focusStateEnabled: false });

                expect(widget.props().accessKey).toBe(void 0);
            });

            it('should take a focus if the accessKey is pressed', () => {
                const widget = render({ accessKey: 'y', focusStateEnabled: true });

                emit(EVENT.dxClick, fakeClickEvent);
                expect(widget.hasClass('dx-state-focused')).toBe(true);
            });

            it('should not fire click event if the accessKey is pressed', () => {
                const e = { ...fakeClickEvent, stopImmediatePropagation: jest.fn() };

                render({ accessKey: 'y', focusStateEnabled: true });
                emit(EVENT.dxClick, e);
                expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(1);
            });
        });

        describe('rtlEnabled', () => {
            it('should not add rtl marker class by default', () => {
                const widget = render();

                expect(widget.hasClass('dx-rtl')).toBe(false);
            });

            it('should add rtl marker class if "rtlEnabled" is true', () => {
                const widget = render({ rtlEnabled: true });

                expect(widget.hasClass('dx-rtl')).toBe(true);
            });
        });

        describe('width/height', () => {
            it('should have the ability to be a function', () => {
                const widget = render({ width: () => 50, height: () => 'auto' });

                expect(widget.props().style).toEqual({ width: 50, height: 'auto' });
            });

            it('should process string values', () => {
                const widget = render({ width: '50px', height: () => '100%' });

                expect(widget.props().style).toEqual({ width: '50px', height: '100%' });
            });

            it('should process number values', () => {
                const widget = render({ width: 50, height: 70 });

                expect(widget.props().style).toEqual({ width: 50, height: 70 });
            });

            it('should ignore null/undefined values', () => {
                const widget = render({ width: null, height: void 0 });

                expect(widget.props().style).toEqual({});
            });
        });

        describe('disabled', () => {
            it('should add css marker class', () => {
                const widget = render({ disabled: true });

                expect(widget.hasClass('dx-state-disabled')).toBe(true);
            });

            it('should add aria attribute', () => {
                const widget = render({ disabled: true });

                expect(widget.prop('aria-disabled')).toBe('true');
            });
        });

        describe('visible', () => {
            it('should add css marker class', () => {
                const widget = render({ visible: false });

                expect(widget.hasClass('dx-state-invisible')).toBe(true);
            });

            it('should add aria attribute', () => {
                const widget = render({ visible: false });

                expect(widget.prop('aria-hidden')).toBe('true');
            });

            it('should add hidden attribute', () => {
                const widget = render({ visible: false });

                expect(widget.prop('hidden')).toBe(true);
            });
        });

        describe('tabIndex', () => {
            it('should add tabIndex attribute by default', () => {
                const widget = render({ focusStateEnabled: true });

                expect(widget.prop('tabIndex')).toBe(0);
            });

            it('should add custom tabIndex attribute', () => {
                const widget = render({ focusStateEnabled: true, tabIndex: 10 });

                expect(widget.prop('tabIndex')).toBe(10);
            });

            it('should not add tabIndex attribute if the "disabled" is true', () => {
                const widget = render({ focusStateEnabled: true, tabIndex: 10, disabled: true });

                expect(widget.prop('tabIndex')).toBe(false);
            });

            it('should not add tabIndex attribute if the "focusStateEnabled" is false', () => {
                const widget = render({ focusStateEnabled: false, tabIndex: 10 });

                expect(widget.prop('tabIndex')).toBe(false);
            });
        });

        describe('elementAttr', () => {
            it('should pass custom css class name via elementAttr', () => {
                const widget = render({ elementAttr: { class: 'custom-class' } });

                expect(widget.hasClass('custom-class')).toBe(true);
            });

            it('should pass custom attributes', () => {
                const widget = render({ elementAttr: { 'data-custom': 'custom-attribute-value' } });

                expect(widget.prop('data-custom')).toBe('custom-attribute-value');
            });

            it('should not provide `class` property', () => {
                const widget = render({ elementAttr: { class: 'custom-class' } });

                expect(widget.hasClass('custom-class')).toBe(true);
                expect(widget.hasClass('dx-widget')).toBe(true);
                expect(widget.prop('class')).toBe(void 0);
            });
        });

        describe('activeStateEnabled', () => {
            it('should be disabled by default', () => {
                const widget = render();

                expect(widget.instance().props.activeStateEnabled).toBe(false);
                expect(widget.hasClass('dx-state-active')).toBe(false);
            });
        });

        describe('hoverStateEnabled', () => {
            it('should be disabled by default', () => {
                const widget = render();

                expect(widget.instance().props.hoverStateEnabled).toBe(false);
                expect(widget.hasClass('dx-state-hover')).toBe(false);
            });
        });

        describe('focusStateEnabled', () => {
            it('should be disabled by default', () => {
                const widget = render();

                expect(widget.instance().props.focusStateEnabled).toBe(false);
                expect(widget.hasClass('dx-state-focus')).toBe(false);
            });
        });

        describe('hint', () => {
            it('should not add "title" attribute by default', () => {
                const widget = render();

                expect(widget.prop('title')).toBe(void 0);
            });

            it('should add "title" attribute with the hint value', () => {
                const widget = render({ hint: 'hint-text' });

                expect(widget.prop('title')).toBe('hint-text');
            });
        });
    });

    describe('aria', () => {
        it('should pass custom "aria" attributes', () => {
            const widget = render({ aria: {
                label: 'custom-aria-label',
                role: 'button',
                id: 'custom-id',
            } });

            expect(widget.props()).toMatchObject({
                'aria-label': 'custom-aria-label',
                role: 'button',
                id: 'custom-id',
            });
        });
    });

    describe('Children', () => {
        it('should render child component', () => {
            const widget = render({ children: <div className={'custom-content'} /> });
            const children = widget.children();

            expect(children).toHaveLength(1);
            expect(children.at(0).is('.custom-content')).toBe(true);
        });
    });

    describe('States', () => {
        describe('Active', () => {
            it('should change state by mouse events', () => {
                const widget = render({ activeStateEnabled: true });

                expect(widget.hasClass('dx-state-active')).toBe(false);

                emit(EVENT.active);
                expect(widget.hasClass('dx-state-active')).toBe(true);

                emit(EVENT.inactive);
                expect(widget.hasClass('dx-state-active')).toBe(false);
            });

            it('should not change state if disabled', () => {
                const widget = render({ activeStateEnabled: true, disabled: true });

                expect(widget.hasClass('dx-state-disabled')).toBe(true);
                expect(widget.hasClass('dx-state-active')).toBe(false);

                emit(EVENT.active);
                expect(widget.hasClass('dx-state-disabled')).toBe(true);
                expect(widget.hasClass('dx-state-active')).toBe(false);

                emit(EVENT.inactive);
                expect(widget.hasClass('dx-state-disabled')).toBe(true);
                expect(widget.hasClass('dx-state-active')).toBe(false);
            });
        });

        describe('Focus', () => {
            // it('should change state by mouse events', () => {
            //     const widget = render();

            //     expect(widget.hasClass('dx-state-focus')).toBe(false);

            //     emit(EVENT.focus);
            //     expect(widget.hasClass('dx-state-focus')).toBe(true);

            //     emit(EVENT.blur);
            //     expect(widget.hasClass('dx-state-focus')).toBe(false);
            // });

            // it('should not change state if disabled', () => {
            //     const widget = render({ disabled: true });

            //     expect(widget.hasClass('dx-state-disabled')).toBe(true);
            //     expect(widget.hasClass('dx-state-focus')).toBe(false);

            //     emit(EVENT.focus);
            //     expect(widget.hasClass('dx-state-disabled')).toBe(true);
            //     expect(widget.hasClass('dx-state-focus')).toBe(false);

            //     emit(EVENT.blur);
            //     expect(widget.hasClass('dx-state-disabled')).toBe(true);
            //     expect(widget.hasClass('dx-state-focus')).toBe(false);
            // });
        });

        describe('Hover', () => {
            it('should change state by mouse events', () => {
                const widget = render({ hoverStateEnabled: true });

                expect(widget.hasClass('dx-state-hover')).toBe(false);

                emit(EVENT.hoverStart);
                expect(widget.hasClass('dx-state-hover')).toBe(true);

                emit(EVENT.hoverEnd);
                expect(widget.hasClass('dx-state-hover')).toBe(false);
            });

            it('should not change state if disabled', () => {
                const widget = render({ hoverStateEnabled: true, disabled: true });

                expect(widget.hasClass('dx-state-disabled')).toBe(true);
                expect(widget.hasClass('dx-state-hover')).toBe(false);

                emit(EVENT.hoverStart);
                expect(widget.hasClass('dx-state-disabled')).toBe(true);
                expect(widget.hasClass('dx-state-hover')).toBe(false);

                emit(EVENT.hoverEnd);
                expect(widget.hasClass('dx-state-disabled')).toBe(true);
                expect(widget.hasClass('dx-state-hover')).toBe(false);
            });

            it('should clear hover state if active', () => {
                const widget = render({ hoverStateEnabled: true, activeStateEnabled: true });

                expect(widget.hasClass('dx-state-hover')).toBe(false);
                expect(widget.hasClass('dx-state-active')).toBe(false);

                emit(EVENT.hoverStart);
                expect(widget.hasClass('dx-state-hover')).toBe(true);
                expect(widget.hasClass('dx-state-active')).toBe(false);

                emit(EVENT.active);
                expect(widget.hasClass('dx-state-hover')).toBe(false);
                expect(widget.hasClass('dx-state-active')).toBe(true);

                emit(EVENT.inactive);
                expect(widget.hasClass('dx-state-hover')).toBe(true);
                expect(widget.hasClass('dx-state-active')).toBe(false);
            });
        });
    });

    describe.only('Events', () => {
        describe('visibilityChanged', () => {
            it('is called on dxhiding and dxshown events and special css class is attached', () => {
                let hidingFired = 0;
                let shownFired = 0;
                const _visibilityChanged = (visible) => {
                    if (visible) {
                        shownFired += 1;
                    } else {
                        hidingFired += 1;
                    }
                };

                const widget = mountRender({ _visibilityChanged });

                // expect(widget.hasClass('dx-visibility-change-handler')).toBe(true);

                emit(EVENT.hiding); // hide!
                // widget.setProps({ width: 0 });
                expect(hidingFired).toBe(1);
                expect(shownFired).toBe(0);
                // $element.trigger('dxhiding').hide();
                // assert.equal(hidingFired, 1, 'hiding was fired');
                // assert.equal(shownFired, 0, 'shown was not fired');

                emit(EVENT.shown); // show!
                expect(hidingFired).toBe(1);
                expect(shownFired).toBe(1);
                // $element.show().trigger('dxshown');
                // assert.equal(hidingFired, 1, 'hiding was fired only once');
                // assert.equal(shownFired, 1, 'shown was fired');
            });

            /**
             QUnit.test('_visibilityChanged is called on dxhiding and dxshown events and special css class is attached', function(assert) {
            let hidingFired = 0;
            let shownFired = 0;

            const TestComponent = this.TestComponent.inherit({
                NAME: 'TestComponent',

                _visibilityChanged(visible) {
                    if(visible) {
                        shownFired++;
                    } else {
                        hidingFired++;
                    }
                }
            });

            const $element = $('#component');
            new TestComponent($element);

            assert.ok($element.hasClass('dx-visibility-change-handler'), 'special css class attached');

            $element.trigger('dxhiding').hide();
            assert.equal(hidingFired, 1, 'hiding was fired');
            assert.equal(shownFired, 0, 'shown was not fired');

            $element.show().trigger('dxshown');
            assert.equal(hidingFired, 1, 'hiding was fired only once');
            assert.equal(shownFired, 1, 'shown was fired');
        });

        QUnit.test('visibility change subscriptions should not clash', function(assert) {
            let hidingFired = 0;
            let shownFired = 0;

            const visibilityChanged = visible => {
                visible ? shownFired++ : hidingFired++;
            };

            const TestComponent1 = this.TestComponent.inherit({
                NAME: 'TestComponent1',
                _visibilityChanged: visibilityChanged
            });

            const TestComponent2 = this.TestComponent.inherit({
                NAME: 'TestComponent2',
                _visibilityChanged: visibilityChanged
            });

            const $element = $('#component');
            new TestComponent1($element);
            new TestComponent2($element);

            $element.trigger('dxhiding').hide();
            $element.show().trigger('dxshown');

            assert.equal(hidingFired, 2, 'hidden fired for both components');
            assert.equal(shownFired, 2, 'shown fired for both components');
        });

        QUnit.test('visibility change handling works optimally (initially visible)', function(assert) {
            let hidingFired = 0;
            let shownFired = 0;

            const visibilityChanged = visible => {
                visible ? shownFired++ : hidingFired++;
            };

            const TestComponent = this.TestComponent.inherit({
                NAME: 'TestComponent1',
                _visibilityChanged: visibilityChanged
            });

            const $element = $('#component');
            new TestComponent($element);

            assert.equal(hidingFired, 0, 'hidden is not fired initially');
            assert.equal(shownFired, 0, 'shown is not fired initially');

            $element.show().trigger('dxshown');
            assert.equal(shownFired, 0, 'shown is not fired if element is visible');

            $element.trigger('dxhiding').hide();
            assert.equal(hidingFired, 1, 'hiding is fired for the first time');

            $element.trigger('dxhiding').hide();
            assert.equal(hidingFired, 1, 'hiding is not fired for the second time');
        });

        QUnit.test('visibility change handling works optimally (initially hidden)', function(assert) {
            let hidingFired = 0;
            let shownFired = 0;

            const visibilityChanged = visible => {
                visible ? shownFired++ : hidingFired++;
            };

            const TestComponent = this.TestComponent.inherit({
                NAME: 'TestComponent1',
                _visibilityChanged: visibilityChanged
            });

            const $element = $('#component').hide();
            new TestComponent($element);

            assert.equal(hidingFired, 0, 'hidden is not fired initially');
            assert.equal(shownFired, 0, 'shown is not fired initially');

            $element.trigger('dxhiding').hide();
            assert.equal(shownFired, 0, 'hiding is not fired if element is hidden');

            $element.show().trigger('dxshown');
            assert.equal(shownFired, 1, 'shown is fired for the first time');

            $element.show().trigger('dxshown');
            assert.equal(shownFired, 1, 'shown is not fired for the second time');
        });

        QUnit.test('visibility change handling works with hidden parent', function(assert) {
            let hidingFired = 0;
            let shownFired = 0;

            const visibilityChanged = visible => {
                visible ? shownFired++ : hidingFired++;
            };

            const TestComponent = this.TestComponent.inherit({
                NAME: 'TestComponent1',
                _visibilityChanged: visibilityChanged
            });

            const $parent = $('#component').hide();
            const $component = $('<div>').hide().appendTo($parent);

            new TestComponent($component);

            assert.equal(hidingFired, 0, 'hidden is not fired initially');
            assert.equal(shownFired, 0, 'shown is not fired initially');

            $component.show().triggerHandler('dxshown');
            assert.equal(shownFired, 0, 'shown is not fired since parent is hidden');

            $parent.show();
            $component.triggerHandler('dxshown');
            assert.equal(shownFired, 1, 'shown is fired since parent is shown');
        });
             */
        });
    });

    it('should have dx-widget class', () => {
        const tree = render();

        expect(tree.is('.dx-widget')).toBe(true);
    });
});
