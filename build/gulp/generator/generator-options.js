'use strict';

const BASE_GENERATOR_OPTIONS = {
    defaultOptionsModule: 'js/core/options/utils',
};

const BASE_GENERATOR_OPTIONS_WITH_JQUERY = {
    ...BASE_GENERATOR_OPTIONS,
    jqueryComponentRegistratorModule: 'js/core/component_registrator',
    jqueryBaseComponentModule: 'js/renovation/preact_wrapper/component',
    modulesPath: 'devextreme-generator/modules/inferno'
};

module.exports = {
    BASE_GENERATOR_OPTIONS,
    BASE_GENERATOR_OPTIONS_WITH_JQUERY
};
