import GoogleStaticProvider from '__internal/ui/map/m_provider.google_static';
import fx from 'common/core/animation/fx';
import { each } from 'core/utils/iterator';
import 'bundles/modules/parts/widgets-web';

const { module: testModule, test } = QUnit;

testModule('Init and dispose', {
    before: function() {
        this.element = document.createElement('div');
        document.getElementById('qunit-fixture').appendChild(this.element);
    },
    after: function() {
        const { parentNode } = this.element;
        if(parentNode) {
            parentNode.removeChild(this.element);
        }
    }
}, function() {
    fx.off = true;
    GoogleStaticProvider.remapConstant('/mapURL?');

    const getOptions = function(componentName, assert, done) {
        const options = {
            onInitialized: () => {
                assert.ok(true, `${componentName} initialized`);
            },
            onDisposing: () => {
                assert.ok(true, `${componentName} disposed`);
                done();
            }
        };

        switch(componentName) {
            case 'dxValidator':
                options.adapter = {};
                break;
            case 'dxMap':
                options.provider = 'googleStatic';
                break;
        }

        return options;
    };

    each(DevExpress.ui, function(componentName, componentConstructor) {
        if(componentName.indexOf('dx') !== 0) {
            return;
        }

        test(componentName, function(assert) {
            assert.expect(2);
            const done = assert.async();
            const instance = new componentConstructor(this.element, getOptions(componentName, assert, done));
            instance.dispose();
        });
    });
});
