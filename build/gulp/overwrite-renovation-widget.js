'use strict';

module.exports = ({ pathInRenovationFolder }) =>
    `import Widget from "../renovation/${pathInRenovationFolder}";
export default Widget;`;
