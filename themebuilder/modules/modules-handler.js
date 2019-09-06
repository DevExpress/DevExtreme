class ModulesHandler {
    constructor(widgetsList) {
        this.SPECIAL_COMMENT = "tb_widgets_list";
        this.FILE_FOR_PARSING = "theme.less";

        this.widgets = widgetsList || [];
        this.widgets = this.widgets.map(w => w.toLowerCase());
    }

    getWidgetFromImport(importString) {
        const lastSlashIndex = importString.lastIndexOf("/");
        const fileName = importString.substr(lastSlashIndex + 1);
        const dotIndex = fileName.indexOf(".");
        return fileName.substr(0, dotIndex);
    }

    availableWidgets(less) {
        const widgets = [];
        const widgetsListIndex = less.indexOf(this.SPECIAL_COMMENT);

        if(widgetsListIndex < 0) {
            return widgets;
        }

        less
            .substr(widgetsListIndex + this.SPECIAL_COMMENT.length)
            .split("\n")
            .filter(item => !!item)
            .forEach((importString) => {
                const lastSlashIndex = importString.lastIndexOf("/");
                const fileName = importString.substr(lastSlashIndex + 1);
                const dotIndex = fileName.indexOf(".");
                widgets.push({
                    name: fileName.substr(0, dotIndex).toLowerCase(),
                    import: importString
                });
            });

        return widgets;
    }

    lessPlugin() {
        const getFileNameFromContext = (context) => {
            const fullPath = context && context.fileInfo && context.fileInfo.filename;

            if(typeof fullPath !== "string") {
                return null;
            }

            let fileNameIndex = fullPath.lastIndexOf('/');
            if(fileNameIndex < 0) {
                fileNameIndex = fullPath.lastIndexOf('\\');
            }

            return fullPath.substr(fileNameIndex + 1);
        };

        const removeUnnecessaryWidgets = (less) => {
            this.availableWidgets(less).forEach(widget => {
                if(this.widgets.indexOf(widget.name) < 0) {
                    less = less.replace(widget.import, "");
                }
            });

            return less;
        };

        return {
            install: (_, pluginManager) => {
                pluginManager.addPreProcessor({
                    process: (less, context) => {
                        const fileName = getFileNameFromContext(context);

                        if(this.widgets.length > 0 && fileName === this.FILE_FOR_PARSING) {
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
