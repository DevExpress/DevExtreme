/* eslint-disable spellcheck/spell-checker */

const animationModulesList = {
    requestAnimationFrame: require('animation/frame').requestAnimationFrame,
    cancelAnimationFrame: require('animation/frame').cancelAnimationFrame,
    fx: require('animation/fx'),
    animationPresets: require('animation/presets'),
    transitionExecutor: require('animation/transition_executor')
};

const coreModulesList = {
    config: require('core/config'),
    devices: require('core/devices'),
    grid: require('core/guid'),
    setTemplateEngine: require('core/set_template_engine')
};

const dataModulesList = {
    applyChanges: require('data/apply_changes'),
    arrayStore: require('data/array_store'),
    customStore: require('data/custom_store'),
    dataSource: require('data/data_source'),
    endPointSelector: require('data/endpoint_selector'),
    errorHandler: require('data/errors').errorHandler,
    localStore: require('data/local_store'),
    oDataContext: require('data/odata/context'),
    oDataStore: require('data/odata/store'),
    edmLiteral: require('data/odata/utils').EdmLiteral,
    keyConverters: require('data/odata/utils').keyConverters,
    query: require('data/query'),
    base64_encode: require('data/utils').base64_encode
};

const eventsModulesList = {
    off: require('events').off,
    on: require('events').on,
    one: require('events').one,
    trigger: require('events').trigger,
    click: require('events/click'),
    contextmenu: require('events/contextmenu'),
    dblclick: require('events/dblclick'),
    drag: require('events/drag'),
    hold: require('events/hold'),
    hover: require('events/hover'),
    pointer: require('events/pointer'),
    remove: require('events/remove'),
    swipe: require('events/swipe'),
    transform: require('events/transform')
};

const excelExporter = {
    exportDataGrid: require('excel_exporter').exportDataGrid,
    exportPivotGrid: require('excel_exporter').exportPivotGrid
};

const fileManagementModulesList = {
    custom_provider: require('file_management/custom_provider')
};

exports.animationModulesList = animationModulesList;
exports.coreModulesList = coreModulesList;
exports.dataModulesList = dataModulesList;
exports.eventsModulesList = eventsModulesList;
exports.excelExporter = excelExporter;
exports.fileManagementModulesList = fileManagementModulesList;
