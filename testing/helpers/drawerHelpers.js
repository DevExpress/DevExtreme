import { extend } from 'core/utils/extend';
import { isDefined } from 'core/utils/type';
import dxDrawer from 'ui/drawer';

const { assert } = QUnit;

const drawerElementId = 'drawer1';
const DRAWER_SHADER_CLASS = 'dx-drawer-shader';

class DrawerTester {
    constructor(targetOptions) {
        this.templateSize = targetOptions.templateSize;

        if(!isDefined(targetOptions.template)) {
            targetOptions.template = this.getTemplate(this.templateSize);
        }
        this.targetOptions = targetOptions;
    }

    initializeDrawer(config) {
        this.drawer = this.getDrawerInstance(this.getFullDrawerOptions(config, this.targetOptions));
        this.revealMode = this.drawer.option('revealMode');
    }
    drawerElement() { return document.getElementById(drawerElementId); }
    drawerRect() { return this.drawerElement().getBoundingClientRect(); }
    templateElement() { return this.drawerElement().querySelector('#template'); }
    viewElement() { return this.drawerElement().querySelector('#view'); }
    shaderElement() { return this.drawerElement().querySelector(`.${DRAWER_SHADER_CLASS}`); }

    getFullDrawerOptions(config, targetOptions) {
        const defaultOptions = {
            revealMode: config.revealMode,
            openedStateMode: config.openedStateMode,
            position: config.position,
            rtlEnabled: false,
            shading: config.shading,
            animationEnabled: false
        };
        return extend(defaultOptions, targetOptions);
    }

    getDrawerInstance(options) {
        return new dxDrawer(this.drawerElement(), options);
    }

    checkBoundingClientRect(element, expectedRect, elementName) {
        assert.ok(!!element, elementName + ' is defined');
        if(element) {
            const rect = element.getBoundingClientRect();
            for(const memberName in expectedRect) {
                assert.strictEqual(rect[memberName], expectedRect[memberName], elementName + '.' + memberName);
            }
        }
    }

    checkMargin(element, top, right, bottom, left, message) {
        assert.strictEqual(window.getComputedStyle(element).marginLeft, left + 'px', 'marginLeft, ' + message);
        assert.strictEqual(window.getComputedStyle(element).marginTop, top + 'px', 'marginTop, ' + message);
        assert.strictEqual(window.getComputedStyle(element).marginRight, right + 'px', 'marginRight, ' + message);
        assert.strictEqual(window.getComputedStyle(element).marginBottom, bottom + 'px', 'marginBottom, ' + message);
    }

    checkShader() {
        const { visibility } = window.getComputedStyle(this.shaderElement());

        if(this.drawer.option('opened') && this.drawer.option('shading')) {
            assert.strictEqual(visibility, 'visible', 'shader is visible');
            assert.strictEqual(this.shaderElement().classList.contains('dx-state-invisible'), false, 'shader has not .dx-invisible-class');
            assert.strictEqual(window.getComputedStyle(this.shaderElement()).zIndex, '1501', 'shader should be shown above view');
            assert.strictEqual(window.getComputedStyle(this.templateElement().parentElement).zIndex, this.drawer.option('openedStateMode') === 'push' ? 'auto' : '1502', 'template should be shown under view');

            ['top', 'left', 'width', 'height'].forEach(key => {
                assert.strictEqual(this.viewElement().getBoundingClientRect()[key], this.shaderElement().getBoundingClientRect()[key], `view[${key}] === shader[${key}]`);
            });
        } else {
            assert.strictEqual(visibility, 'hidden', 'shader is hidden');
            assert.strictEqual(this.shaderElement().classList.contains('dx-state-invisible'), true, 'shader has .dx-invisible-class');
        }
    }

    checkAsserts({ visible, opened }) {
        const { openedStateMode } = this.drawer.option();

        this.checkBoundingClientRect(this.drawerElement(), { width: 200, height: 100 }, 'drawerElement');
        assert.strictEqual(this.drawer.option('visible'), visible, 'option(visible)');
        assert.strictEqual(this.drawer.option('opened'), opened, 'option(opened)');
        assert.strictEqual(window.getComputedStyle(this.drawerElement()).display, 'block', 'drawerElement.display');

        if(openedStateMode === 'overlap') {
            this.checkOverlap();
        } else if(openedStateMode === 'push') {
            this.checkPush();
        } else if(openedStateMode === 'shrink') {
            this.checkShrink();
        } else {
            assert.notOk('configuration is not tested');
        }

        this.checkShader();
    }

    checkOpened() {
        this.checkAsserts({ visible: true, opened: true });
    }

    checkHidden() {
        this.checkAsserts({ visible: true, opened: false });
    }
}

class LeftDrawerTester extends DrawerTester {
    constructor(targetOptions) {
        targetOptions.templateSize = 150;

        super(targetOptions);
    }

    getTemplate() {
        return `<div id="template" style="width: ${this.templateSize}px; height: 100%; background-color: green">template</div>`;
    }

    checkOpened() {
        this.checkPush = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 150, height: 100 }, 'template');
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left + 150, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };
        this.checkShrink = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 150, height: 100 }, 'template');
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left + 150, top: this.drawerRect().top, width: 50, height: 100 }, 'view');
            this.checkMargin(this.templateElement().parentElement, 0, 0, 0, 0, 'template should be visible by position');
        };
        this.checkOverlap = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 150, height: 100 }, 'template');
            this.checkBoundingClientRect(this.templateElement().parentElement, { left: this.drawerRect().left, top: this.drawerRect().top, width: 150, height: 100 }, 'template.parentElement size should not cut template'); // or screenshot?
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };

        super.checkOpened();
    }

    checkHidden() {
        this.checkPush = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 150, height: 100 }, 'template');
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');

            assert.ok(
                window.getComputedStyle(this.templateElement().parentElement).position === 'absolute' &&
                window.getComputedStyle(this.viewElement().parentElement).transform.indexOf('matrix') >= 0,
                'template element should be hidden, view element should be visible'); // or screenshot?
        };
        this.checkShrink = () => {
            if(this.revealMode === 'expand') {
                this.checkBoundingClientRect(this.templateElement().parentElement, { width: 0 }, 'template.parentElement'); // or screenshot?
            } else {
                this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left - 150, top: this.drawerRect().top, width: 150, height: 100 }, 'template');
                this.checkMargin(this.templateElement().parentElement, 0, 0, 0, -150, 'template should not be visible by position'); // or screenshot?
                assert.strictEqual(window.getComputedStyle(this.templateElement().parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow'); // or screenshot?
            }
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };
        this.checkOverlap = () => {
            if(this.revealMode === 'expand') {
                if(this.templateElement() === null) {
                    assert.strictEqual(this.templateElement(), null); // Scenarios (overlap, left, expand): opened: false, visible: false -> visible: true
                } else {
                    this.checkBoundingClientRect(this.templateElement().parentElement, { width: 0 }, 'template.parentElement'); // Scenarios (overlap, left, expand): opened: false
                }
            } else {
                if(this.templateElement()) {
                    this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left - 150, top: this.drawerRect().top, width: 150, height: 100 }, 'template');
                    assert.strictEqual(window.getComputedStyle(this.drawerElement().firstElementChild).overflowX, 'hidden', 'template is shown out of bounds and not visible because of overflowX is hidden'); // or screenshot?
                } else {
                    assert.notOk(this.templateElement(), 'template should not be visible because it was not created');
                }
            }
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };

        super.checkHidden();
    }
}

class RightDrawerTester extends DrawerTester {
    constructor(targetOptions) {
        targetOptions.templateSize = 150;

        super(targetOptions);
    }

    getTemplate() {
        return `<div id="template" style="width: ${this.templateSize}px; height: 100%; background-color: green">template</div>`;
    }

    checkOpened() {
        this.checkPush = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left + 50, top: this.drawerRect().top, width: this.templateSize, height: 100 }, 'template');
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left - this.templateSize, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };
        this.checkShrink = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left + 50, top: this.drawerRect().top, width: this.templateSize, height: 100 }, 'template');
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 50, height: 100 }, 'view');
            this.checkMargin(this.templateElement().parentElement, 0, 0, 0, 0, 'template should be visible by position');
        };
        this.checkOverlap = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left + 50, top: this.drawerRect().top, width: this.templateSize, height: 100 }, 'template');
            this.checkBoundingClientRect(this.templateElement().parentElement, { left: this.drawerRect().left + 50, top: this.drawerRect().top, width: this.templateSize, height: 100 }, 'template.parentElement size should not cut template'); // or screenshot?
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };

        super.checkOpened();
    }

    checkHidden() {
        this.checkPush = () => {
            if(this.revealMode === 'expand') {
                assert.ok( // Scenarios (push, right, expand): opened: false
                    window.getComputedStyle(this.templateElement().parentElement).position === 'absolute' &&
                    window.getComputedStyle(this.viewElement().parentElement).transform.indexOf('matrix') >= 0,
                    'template element should be hidden, view element should be visible'); // or screenshot?
            } else {
                this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left + 50, top: this.drawerRect().top, width: this.templateSize, height: 100 }, 'template');

                assert.ok(
                    window.getComputedStyle(this.templateElement().parentElement).position === 'absolute' &&
                    window.getComputedStyle(this.viewElement().parentElement).transform.indexOf('matrix') >= 0,
                    'template element should be hidden, view element should be visible'); // or screenshot?
            }
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };
        this.checkShrink = () => {
            if(this.revealMode === 'expand') {
                this.checkBoundingClientRect(this.templateElement().parentElement, { width: 0 }, 'template.parentElement'); // or screenshot?
            } else {
                this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left + 200, top: this.drawerRect().top, width: this.templateSize, height: 100 }, 'template');
                this.checkMargin(this.templateElement().parentElement, 0, -this.templateSize, 0, 0, 'template should not be visible by position'); // or screenshot?
                assert.strictEqual(window.getComputedStyle(this.templateElement().parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow'); // or screenshot?
            }
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };
        this.checkOverlap = () => {
            if(this.revealMode === 'expand') {
                if(this.templateElement() === null) {
                    assert.ok(true); // Scenarios (overlap, right, expand): opened: false, visible: false -> visible: true
                } else {
                    this.checkBoundingClientRect(this.templateElement().parentElement, { width: 0 }, 'template.parentElement'); // Scenarios (overlap, left, expand): opened: false
                }
            } else {
                if(this.templateElement()) {
                    this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left + 200, top: this.drawerRect().top, width: this.templateSize, height: 100 }, 'template');
                    assert.strictEqual(window.getComputedStyle(this.drawerElement().firstElementChild).overflowX, 'hidden', 'template is shown out of bounds and not visible because of overflowX is hidden'); // or screenshot?
                } else {
                    assert.notOk(this.templateElement(), 'template should not be visible because it was not created');
                }
            }
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };

        super.checkHidden();
    }
}

class TopDrawerTester extends DrawerTester {
    constructor(targetOptions) {
        targetOptions.templateSize = 75;

        super(targetOptions);
    }

    getTemplate() {
        return `<div id="template" style="width: 100%; height: ${this.templateSize}px; background-color: green">template</div>`;
    }

    checkOpened() {
        this.checkPush = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 150, height: 100 }, 'template');
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left + 150, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };
        this.checkShrink = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 75 }, 'template');
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top + 75, width: 200, height: 25 }, 'view');
            this.checkMargin(this.templateElement().parentElement, 0, 0, 0, 0, 'template should be visible by position'); // or screenshot?
        };
        this.checkOverlap = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 75 }, 'template');
            this.checkBoundingClientRect(this.templateElement().parentElement, { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 75 }, 'template.parentElement size should not cut template'); // or screenshot?
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };

        super.checkOpened();
    }

    checkHidden() {
        this.checkPush = () => {
            this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 150, height: 100 }, 'template');
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');

            assert.ok(
                window.getComputedStyle(this.templateElement().parentElement).position === 'absolute' &&
                window.getComputedStyle(this.viewElement().parentElement).transform.indexOf('matrix') >= 0,
                'template element should be hidden, view element should be visible'); // or screenshot?
        };
        this.checkShrink = () => {
            if(this.revealMode === 'expand') {
                this.checkBoundingClientRect(this.templateElement().parentElement, { height: 0 }, 'template.parentElement'); // or screenshot?
            } else {
                this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top - 75, width: 200, height: 75 }, 'template');

                this.checkMargin(this.templateElement().parentElement, -75, 0, 0, 0, 'template should not be visible by position'); // or screenshot?
                assert.strictEqual(window.getComputedStyle(this.templateElement().parentElement).overflow, 'hidden', 'template should not be visible by parent.overflow'); // or screenshot?
            }
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };
        this.checkOverlap = () => {
            if(this.revealMode === 'expand') {
                if(this.templateElement() === null) {
                    assert.ok(true); // Scenarios (overlap, top, expand): opened: false, visible: false -> visible: true
                } else {
                    this.checkBoundingClientRect(this.templateElement().parentElement, { height: 0 }, 'template.parentElement'); // Scenarios (overlap, top, expand): opened: false
                }
            } else {
                if(this.templateElement()) {
                    this.checkBoundingClientRect(this.templateElement(), { left: this.drawerRect().left, top: this.drawerRect().top - 75, width: 200, height: 75 }, 'template'); // or screenshot?
                    assert.strictEqual(window.getComputedStyle(this.drawerElement().firstElementChild).overflowY, 'hidden', 'template is shown out of bounds and not visible because of overflowY is hidden'); // or screenshot?
                } else {
                    assert.notOk(this.templateElement(), 'template should not be visible because it was not created');
                }
            }
            this.checkBoundingClientRect(this.viewElement(), { left: this.drawerRect().left, top: this.drawerRect().top, width: 200, height: 100 }, 'view');
        };

        super.checkHidden();
    }
}

export const drawerTesters = {
    markup: `<div id="${drawerElementId}" style="background-color: blue; width: 200px; height: 100px">
        <div id="view" style="width: 100%; height: 100%; background-color: yellow">view</div>
    </div>`,
    left: LeftDrawerTester,
    top: TopDrawerTester,
    right: RightDrawerTester
};
