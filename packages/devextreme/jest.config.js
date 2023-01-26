// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path = require('path');
const resolve = require('resolve');

const full = { functions: 100, statements: 100, lines: 100, branches: 100 };
const nearlyFull = { functions: 96, statements: 98, lines: 98, branches: 92 };

module.exports = {
    'globals': {
        'ts-jest': {
            tsConfig: './jest.tsconfig.json',
            diagnostics: false, // set to true to enable type checking
            isolatedModules: true, // performance optimization https://kulshekhar.github.io/ts-jest/user/config/isolatedModules
        }
    },
    collectCoverageFrom: [
        './js/renovation/(ui|utils|viz|common)/**/*.ts?(x)',
        './js/renovation/component_wrapper/common/component.ts',
        './js/renovation/component_wrapper/common/template_wrapper.ts',
        '!**/*.j.tsx',
        '!**/__tests__/**/*',
    ],
    coveragePathIgnorePatterns: [
        './js/renovation/ui/common/event_callback.ts', // NOTE: this is temporary file for Vue2
        './js/renovation/ui/scheduler/header/props.ts',
        './js/renovation/ui/scheduler/view_model/to_test/', // TODO: this is temporary
        './js/renovation/ui/scheduler/appointment_edit_form/layout.tsx', // NOTE: covering with TestCafe
        './js/renovation/ui/scheduler/workspaces/utils.ts',
        './js/renovation/utils/get_computed_style.ts',
        './js/renovation/utils/dom.ts',
        './js/renovation/utils/render_template.ts', // TODO: this is temporary file
        './js/renovation/viz/common/renderers/utils.ts',
        './js/renovation/viz/common/tooltip_utils.ts',
        './js/renovation/viz/common/utils.ts',
        './js/renovation/viz/sparklines/utils.ts',
    ],
    coverageDirectory: './js/renovation/code_coverage',
    coverageThreshold: {
        './js/renovation/ui/**/*.ts?(x)': full,
        './js/renovation/viz/**/*.ts?(x)': full,
        './js/renovation/utils/**/*.ts?(x)': full,
        './js/renovation/common/**/*.ts?(x)': full,
        './js/renovation/component_wrapper/common/template_wrapper.ts': full,
        './js/renovation/component_wrapper/common/component.ts': nearlyFull,
    },
    roots: ['<rootDir>/js/renovation'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    preset: 'ts-jest',
    setupFiles: [
        path.join(path.resolve('.'), './js/renovation/test_utils/setup_enzyme.ts'),
    ],
    testMatch: [
        '<rootDir>/js/renovation/**/__tests__/**/*.test.[jt]s?(x)'
    ],
    transform: {
        'test_components.+\\.tsx$': path.resolve('./js/renovation/test_utils/transformers/declaration.js'),
        '\\.(js|jsx|ts)$': resolve.sync('ts-jest'),
        '\\.(tsx)$': path.resolve('./js/renovation/test_utils/transformers/tsx.js')
    }
};
