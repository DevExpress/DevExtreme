const path = require('path');

const STATE_MANAGER_FOLDER_PATH = path.join('__internal', 'core', 'state_manager');
const STATE_MANAGER_INDEX_MODULE_PATH = path.join(STATE_MANAGER_FOLDER_PATH, 'index.js');
const STATE_MANAGER_PROD_FOLDER_PATH = path.join(STATE_MANAGER_FOLDER_PATH, 'prod');

module.exports = {
    STATE_MANAGER_FOLDER_PATH,
    STATE_MANAGER_INDEX_MODULE_PATH,
    STATE_MANAGER_PROD_FOLDER_PATH
};
