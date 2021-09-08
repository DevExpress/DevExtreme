// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path = require('path');
const resolve = require('resolve');

module.exports = {
    'globals': {
        'ts-jest': {
            tsConfig: './jest.tsconfig.json',
            diagnostics: false, // set to true to enable type checking
            isolatedModules: true, // performance optimization https://kulshekhar.github.io/ts-jest/user/config/isolatedModules
        }
    },
    collectCoverageFrom: [
        './js/renovation/**/*.ts?(x)',
        '!**/*.j.tsx',
        '!**/test_utils/**/*',
        '!**/component_wrapper/**/*',
        '!**/__tests__/**/*',
    ],
    coveragePathIgnorePatterns: [
        './js/renovation/ui/grids/data_grid/datagrid_component.ts',
        './js/renovation/ui/scheduler/workspaces/utils.ts',
        './js/renovation/ui/scroll_view/utils/get_element_offset.ts',
        './js/renovation/ui/scroll_view/utils/get_element_style.ts',
        './js/renovation/ui/scroll_view/utils/get_translate_values.ts',
        './js/renovation/utils/get_computed_style.ts',
        './js/renovation/utils/noop.ts',
        './js/renovation/utils/render_template.ts',
        './js/renovation/viz/common/tooltip_utils.ts',
        './js/renovation/viz/common/utils.ts',
        './js/renovation/viz/common/renderers/utils.ts',
        './js/renovation/viz/sparklines/utils.ts',
    ],
    coverageDirectory: './js/renovation/code_coverage',
    coverageThreshold: {
        './js/renovation/**/*.tsx': {
            functions: 100, // Should set code coverage to 100%
            statements: 100, // (after start testing declarations)
            lines: 100,
            branches: 100
        }
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
