'use strict';
module.exports = ({ name, pathToComponentRegistrator, pathToWrapper, pathInRenovationFolder }) => {
    const wrappedComponentImport = pathToWrapper ?
        `import { WrappedWidget as Widget } from '${pathToWrapper}';` :
        `import Widget from '${pathInRenovationFolder}';`;
    return `${wrappedComponentImport}
import registerComponent from '${pathToComponentRegistrator}';
import { wrapRenovatedWidget } from '/testing/helpers/wrapRenovatedWidget.js';
const wrappedComponent = wrapRenovatedWidget(Widget);
registerComponent('dx${name}', wrappedComponent);
export default wrappedComponent;`;
};
