'use strict';
module.exports = ({ name, pathToWrapper, pathInRenovationFolder }) => {
    const wrappedComponentImport = pathToWrapper ?
        `import { WrappedWidget as Widget } from '${pathToWrapper}';` :
        `import Widget from '${pathInRenovationFolder}';`;
    return `${wrappedComponentImport}
import registerComponent from '../core/component_registrator';
import { wrapRenovatedWidget } from '../../../testing/helpers/wrapRenovatedWidget.js';
const wrappedComponent = wrapRenovatedWidget(Widget);
registerComponent('dx${name}', wrappedComponent);
export default wrappedComponent;`;
};
