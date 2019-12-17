const assert = require('chai').assert;
const ModulesHandler = require('../modules/modules-handler');


describe('Modules handler - unit tests', () => {
    it('Modules handler - getWidgetFromImport', () => {
        const modulesHandler = new ModulesHandler();
        assert.equal(modulesHandler.getWidgetFromImport('@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";'), 'box');
        assert.equal(modulesHandler.getWidgetFromImport('@import (once) "../widgets/@{base-theme}/box.@{base-theme}.less";'), 'box');
        assert.equal(modulesHandler.getWidgetFromImport('@import (once) "./widgets/generic/box.generic.less";'), 'box');
        assert.equal(modulesHandler.getWidgetFromImport('@import (once) "./widgets/common/box.less";'), 'box');
    });

    it('Modules handler - availableWidgets - read widgets list correctly, widgets in lowercase', () => {
        const modulesHandler = new ModulesHandler();
        const themesFileContent = `
some imports

// tb_widgets_list
@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/responsiveBox.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/button.@{base-theme}.less";
`;
        const widgetsList = modulesHandler.availableWidgets(themesFileContent);
        assert.deepEqual(widgetsList, [
            {
                name: 'box',
                import: '@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";'
            }, {
                name: 'responsivebox',
                import: '@import (once) "./widgets/@{base-theme}/responsiveBox.@{base-theme}.less";'
            }, {
                name: 'button',
                import: '@import (once) "./widgets/@{base-theme}/button.@{base-theme}.less";'
            }
        ]);
    });

    it('Modules handler  - availableWidgets - return empty list if special comment is not found', () => {
        const modulesHandler = new ModulesHandler();
        const themesFileContent = `
some imports

// no special comment
@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/responsiveBox.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/button.@{base-theme}.less";
`;
        const widgetsList = modulesHandler.availableWidgets(themesFileContent);
        assert.deepEqual(widgetsList, []);
    });

    it('Modules handler - lessPlugin - return correct less plugin', () => {
        const modulesHandler = new ModulesHandler();

        const lessPlugin = modulesHandler.lessPlugin();

        assert.isFunction(lessPlugin.install);

        lessPlugin.install(null, {
            addPreProcessor: (pluginObj) => {
                assert.isFunction(pluginObj.process);
            }
        });
    });

    it('Modules handler - lessPlugin - preprocessor ignore all except theme.less', () => {
        const modulesHandler = new ModulesHandler();
        const lessPlugin = modulesHandler.lessPlugin();
        let process;

        lessPlugin.install(null, {
            addPreProcessor: (pluginObj) => {
                process = pluginObj.process;
            }
        });

        assert.equal(process('less'), 'less');
        assert.equal(process('less', { }), 'less');
        assert.equal(process('less', { fileInfo: { } }), 'less');
        assert.equal(process('less', { fileInfo: { filename: 'some.less' } }), 'less');
        assert.equal(process('less', { fileInfo: { filename: '/linux/path/some.less' } }), 'less');
        assert.equal(process('less', { fileInfo: { filename: 'C:\\windows\\path\\some.less' } }), 'less');
    });

    it('Modules handler - lessPlugin - preprocessor parse theme.less', () => {
        const modulesHandler = new ModulesHandler(['box', 'button']);
        const lessPlugin = modulesHandler.lessPlugin();
        const themesFileContent = `
some imports

// tb_widgets_list
@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/responsiveBox.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/button.@{base-theme}.less";
`;

        const expectedThemesFileContent = `
some imports

// tb_widgets_list
@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";

@import (once) "./widgets/@{base-theme}/button.@{base-theme}.less";
`;
        let process;

        lessPlugin.install(null, {
            addPreProcessor: (pluginObj) => {
                process = pluginObj.process;
            }
        });

        assert.equal(process(themesFileContent, { fileInfo: { filename: '/linux/path/theme.less' } }), expectedThemesFileContent);
        assert.deepEqual(modulesHandler.bundledWidgets, [ 'box', 'button' ]);
    });

    it('Modules handler - lessPlugin - do not remove any widget if widgets array is empty or undefined', () => {
        [undefined, []].forEach(widgets => {
            const modulesHandler = new ModulesHandler(widgets);
            const lessPlugin = modulesHandler.lessPlugin();
            const themesFileContent = `
some imports

// tb_widgets_list
@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/responsiveBox.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/button.@{base-theme}.less";
`;

            let process;

            lessPlugin.install(null, {
                addPreProcessor: (pluginObj) => {
                    process = pluginObj.process;
                }
            });

            assert.equal(process(themesFileContent, { fileInfo: { filename: '/linux/path/theme.less' } }), themesFileContent);
            assert.deepEqual(modulesHandler.bundledWidgets, [ 'box', 'responsivebox', 'button' ]);
        });
    });

    it('Modules handler - lessPlugin - widgets list is case insensitive and order has no matter', () => {
        [
            ['box', 'responsiveBox', 'button'],
            ['box', 'button', 'responsiveBox'],
            ['box', 'button', 'responsivebox'],
            ['Box', 'Button', 'ResponsiveBox'],
        ].forEach(widgets => {
            const modulesHandler = new ModulesHandler(widgets);
            const lessPlugin = modulesHandler.lessPlugin();
            const themesFileContent = `
some imports

// tb_widgets_list
@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/responsiveBox.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/button.@{base-theme}.less";
`;

            let process;

            lessPlugin.install(null, {
                addPreProcessor: (pluginObj) => {
                    process = pluginObj.process;
                }
            });

            assert.equal(process(themesFileContent, { fileInfo: { filename: '/linux/path/theme.less' } }), themesFileContent);
            assert.deepEqual(modulesHandler.bundledWidgets, [ 'box', 'responsivebox', 'button' ]);
        });
    });

    it('Modules handler - lessPlugin - not valid widgets are ignored', () => {
        const modulesHandler = new ModulesHandler(['box', 'button', 'superwidget']);
        const lessPlugin = modulesHandler.lessPlugin();
        const themesFileContent = `
some imports

// tb_widgets_list
@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/responsiveBox.@{base-theme}.less";
@import (once) "./widgets/@{base-theme}/button.@{base-theme}.less";
`;

        const expectedThemesFileContent = `
some imports

// tb_widgets_list
@import (once) "./widgets/@{base-theme}/box.@{base-theme}.less";

@import (once) "./widgets/@{base-theme}/button.@{base-theme}.less";
`;
        let process;

        lessPlugin.install(null, {
            addPreProcessor: (pluginObj) => {
                process = pluginObj.process;
            }
        });

        assert.equal(process(themesFileContent, { fileInfo: { filename: '/linux/path/theme.less' } }), expectedThemesFileContent);
        assert.deepEqual(modulesHandler.bundledWidgets, [ 'box', 'button' ]);
        assert.deepEqual(modulesHandler.unusedWidgets, [ 'superwidget' ]);
    });
});
