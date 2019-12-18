class ModulesHandler {
    constructor(widgetsList) {
        this.SPECIAL_COMMENT = 'tb_widgets_list';
        this.FILE_FOR_PARSING = 'theme.less';

        this.widgets = (widgetsList || []).map(w => w.toLowerCase());

        this.bundledWidgets = [];
        this.unusedWidgets = [];
    }

    getWidgetFromImport(importString) {
        const lastSlashIndex = importString.lastIndexOf('/');
        const fileName = importString.substr(lastSlashIndex + 1);
        const dotIndex = fileName.indexOf('.');
        return fileName.substr(0, dotIndex);
    }

    availableWidgets(less) {
        const widgets = [];
        const widgetsListIndex = less.indexOf(this.SPECIAL_COMMENT);

        if(widgetsListIndex >= 0) {
            less
                .substr(widgetsListIndex + this.SPECIAL_COMMENT.length)
                .split('\n')
                .filter(item => !!item)
                .forEach((importString) => {
                    widgets.push({
                        name: this.getWidgetFromImport(importString).toLowerCase(),
                        import: importString
                    });
                });
        }

        return widgets;
    }

    lessPlugin() {
        const getFileNameFromContext = (context) => {
            const fullPath = context && context.fileInfo && context.fileInfo.filename;

            if(typeof fullPath !== 'string') {
                return null;
            }

            let fileNameIndex = fullPath.lastIndexOf('/');
            if(fileNameIndex < 0) {
                fileNameIndex = fullPath.lastIndexOf('\\');
            }

            return fullPath.substr(fileNameIndex + 1);
        };

        const removeUnnecessaryWidgets = (less) => {
            const availableWidgets = this.availableWidgets(less);

            if(this.widgets.length > 0) {
                availableWidgets.forEach(widget => {
                    if(this.widgets.indexOf(widget.name) < 0) {
                        less = less.replace(widget.import, '');
                    } else {
                        this.bundledWidgets.push(widget.name);
                    }
                });

                this.unusedWidgets = this.widgets.filter(w => this.bundledWidgets.indexOf(w) < 0);
            } else {
                this.bundledWidgets = availableWidgets.map(w => w.name);
            }

            return less;
        };

        return {
            install: (_, pluginManager) => {
                pluginManager.addPreProcessor({
                    process: (less, context) => {
                        const fileName = getFileNameFromContext(context);

                        if(fileName === this.FILE_FOR_PARSING) {
                            less = removeUnnecessaryWidgets(less);
                        }

                        return less;
                    }
                });
            }
        };
    }

}

module.exports = ModulesHandler;
