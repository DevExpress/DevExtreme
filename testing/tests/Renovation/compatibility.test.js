import { act } from 'preact/test-utils';
import $ from 'core/renderer';

import 'bundles/modules/parts/widgets-renovation';

import widgetsMeta from './widgets.json!';

/**
 * List of registered jQuery widgets which were created only to be used from old DevExtreme code
 */
const PRIVATE_JQUERY_WIDGETS = ['TooltipItemLayout'];

const widgetsInBundle = [];
for(const name in DevExpress.renovation) {
    if(name.indexOf('dxr') === 0) {
        widgetsInBundle.push(name);
    }
}

const widgets = widgetsMeta
    .filter((meta) => {
        return PRIVATE_JQUERY_WIDGETS.indexOf(meta.name) === -1
            && widgetsInBundle.indexOf(meta.widgetName) !== -1;
    });

QUnit.module('Check components registration', () => {
    widgetsMeta.forEach((meta) => {
        QUnit.test(`${meta.widgetName} is in bundle`, function(assert) {
            const message = 'You should add your widget to the bundle.'
            + 'See "bundles/modules/parts/widgets-renovation"';

            assert.notStrictEqual(widgetsInBundle.indexOf(meta.widgetName), -1, message);
        });
    });
});

QUnit.module('Mandatory component setup', {
    beforeEach() {
        $('#qunit-fixture').html(`
        <div id="components">
            <div id="component"></div>
        </div>
        `);
    },
    createWidget(widgetName, options = {}) {
        act(() => $('#component')[widgetName](options));
    }
}, () => {
    widgets.forEach((meta) => {
        QUnit.test(`${meta.widgetName} - check css class names`, function(assert) {
            this.createWidget(meta.widgetName);

            let message = 'You should always set `dx-widget` class to the root of your component';
            assert.equal($('#component').get(0), $('.dx-widget').get(0), message);

            message = 'Use `dx-` followed by lowercase Component name as css class name';
            assert.equal($('#component').get(0), $(`.dx-${meta.name.toLowerCase()}`).get(0), message);
        });
    });

    widgets.forEach((meta) => {
        QUnit.test(`${meta.widgetName} - pass restAttributes to component's root`, function(assert) {
            const message = 'You should pass restAttributes to the component\'s root\n'
            + '<root {...viewModel.restAttributes} />';

            this.createWidget(meta.widgetName, {
                'data-custom-option': 'custom-value',
            });

            assert.equal($('#component').attr('data-custom-option'), 'custom-value', message);
        });
    });

    widgets.forEach((meta) => {
        QUnit.test(`${meta.widgetName} - merge own classes with className from restAttributes`, function(assert) {
            const message = 'You should merge your cssClass with className from restAttributes\n'
            + '<root className={viewModel.className} />\n'
            + 'get className() { return \`${this.restAttributes.className} dx-my-component\` }'; // eslint-disable-line

            $('#component').addClass('custom-class');
            this.createWidget(meta.widgetName);

            assert.equal($('#component').get(0), $(`.custom-class.dx-${meta.name.toLowerCase()}`).get(0), message);
        });
    });

    widgets.forEach((meta) => {
        QUnit.test(`${meta.widgetName} - pass style to component's root`, function(assert) {
            const message = 'If you do not specify style in your component just spread restAttributes\n'
            + '<root {...viewModel.restAttributes} />\n\n'
            + 'If you specify some styles then merge it with restAttributes.style object\n'
            + '<root style={viewModel.styles} />\n'
            + 'get styles() { return { ...this.restAttributes.style, display: "inline" }; }';

            $('#component').css({
                width: '100px', height: '50px', margin: '11px',
            });

            this.createWidget(meta.widgetName);

            assert.equal($('#component').css('width'), '100px', message);
            assert.equal($('#component').css('height'), '50px', message);
            assert.equal($('#component').css('margin'), '11px', message);
        });
    });

    widgets
        .filter((m) => m.props.allProps.indexOf('width') !== -1 && m.props.allProps.indexOf('width') !== -1)
        .forEach((meta) => {
            QUnit.test(`${meta.widgetName} - width/height options take priority over container size`, function(assert) {
                const message = 'If your component has width/height props, they should overwrite width/height properties in restAttributes.style\n'
                + '<root style={viewModel.styles} />\n'
                + 'get styles() {\n'
                + '  return {\n'
                + '    ...this.restAttributes.style,\n'
                + '    width: this.props.width,\n'
                + '    height: this.props.height,\n'
                + '  };\n'
                + '}';

                $('#component').css({
                    width: '100px', height: '50px',
                });

                this.createWidget(meta.widgetName, {
                    width: '110px',
                    height: '55px',
                });

                assert.equal($('#component').css('width'), '110px', message);
                assert.equal($('#component').css('height'), '55px', message);
            });
        });

    widgets
        .filter((m) => m.props.template.length)
        .forEach((meta) => {
            QUnit.test(`${meta.widgetName} - pass right props to template`, function(assert) {
                const message = 'For templates that jQuery users set.\n'
                + 'You should pass only `data` and `index` (if applicable) props\n'
                + 'when rendering template.\n'
                + '<div>\n'
                + '  {viewModel.props.template &&\n'
                + '    <viewModel.props.template\n'
                + '      data={viewModel.templateData}\n'
                + '      index={1}\n'
                + '    />}\n'
                + '  {!viewModel.props.template && \'default content\'}\n'
                + '</div>\n\n'
                + 'If for some reason you don\'t have data (if it is based on other props) - exclude your component from the test below\n'
                + 'and add correspondig tests in your component\'s test suite.';
                assert.expect(meta.props.template.length * 3);

                const options = meta.props.template.reduce((r, template) => ({
                    ...r,
                    [template]: sinon.spy()
                }), {});

                this.createWidget(meta.widgetName, options);

                meta.props.template.forEach((template) => {
                    const [data, index, element = index] = options[template].getCall(0).args;

                    assert.equal($('#component').get(0).contains(element), true, message);
                    assert.equal(element === index || (typeof index === 'number'), true, message);
                    assert.equal(typeof data === 'object', true, message);
                });
            });
        });
});
