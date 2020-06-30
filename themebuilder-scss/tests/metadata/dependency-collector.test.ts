import dependencyTree, { DependencyObj, Options } from 'dependency-tree';
import fs from 'fs';
import DependencyCollector from '../../src/metadata/dependency-collector';

const simpleJsDependencies: DependencyObj = {
  'dx.all.js': {
    'toolbar.js': {
      'menu.js': {
        'button.js': {
          'icon.js': {},
        },
        'utils.js': {
          'fx.js': {},
        },
      },
    },
    'menu.js': {
      'button.js': {
        'icon.js': {},
      },
      'utils.js': {
        'fx.js': {},
      },
    },
    'utils.js': {
      'fx.js': {},
    },
  },
};

const readEmptyFile = jest.fn().mockImplementation((): string => '');

jest.mock('dependency-tree', () => ({
  __esModule: true,
  default: jest.fn((config: Options): DependencyObj => {
    if (config.filename === '../js/bundles/dx.all.js'
    && config.directory === '../js/'
    && config.filter('node_modules') === false) {
      return simpleJsDependencies;
    }
    return null;
  }),
}));

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockImplementation((path: string): string => {
    let content = '';
    switch (path) {
      case 'toolbar.js':
        content = '// STYLE toolbar';
        break;
      case 'menu.js':
        content = '// STYLE menu';
        break;
      case 'icon.js':
        content = '// STYLE icon';
        break;
      case '../scss/widgets/generic/_index.scss':
      case '../scss/widgets/material/_index.scss':
        content = '// public widgets\n@use "./toolbar";@use "./menu";';
        break;
      default:
        content = '';
    }
    return content;
  }),
  existsSync: (): boolean => true,
}));


describe('DependencyCollector', () => {
  beforeEach(() => {
    (fs.readFileSync as jest.Mock).mockClear();
  });

  test('fillFullDependencyTree', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.fillFullDependencyTree();

    expect(dependencyCollector.fullDependencyTree).toEqual(simpleJsDependencies);
    expect(dependencyTree).toBeCalledTimes(1);

    (dependencyTree as unknown as jest.Mock).mockClear();
  });

  test('fillStylesDependencyTree - no styles ref in file content', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.readFile = readEmptyFile;
    dependencyCollector.fullDependencyTree = simpleJsDependencies;
    dependencyCollector.fillStylesDependencyTree();

    expect(dependencyCollector.stylesDependencyTree).toEqual({});
  });

  test('fillStylesDependencyTree - simple dependency tree', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.fullDependencyTree = simpleJsDependencies;
    dependencyCollector.fillStylesDependencyTree();

    expect(dependencyCollector.stylesDependencyTree).toEqual({
      toolbar: {
        menu: {
          icon: {},
        },
      },
      menu: {
        icon: {},
      },
    });
  });

  test('getFlatDependencyArray', () => {
    expect(DependencyCollector.getFlatDependencyArray({})).toEqual([]);

    expect(DependencyCollector.getFlatDependencyArray({
      menu: {
        icon: {},
      },
    })).toEqual(['menu', 'icon']);

    expect(DependencyCollector.getFlatDependencyArray({
      menu: {
        button: {
          icon: {},
        },
      },
      context: {
        group: {},
        toolbar: {
          bar: {
            tab: {},
          },
        },
      },
    })).toEqual([
      'menu',
      'button',
      'icon',
      'context',
      'group',
      'toolbar',
      'bar',
      'tab',
    ]);

    expect(DependencyCollector.getFlatDependencyArray({
      menu: {
        button: {
          icon: {},
        },
      },
      context: {
        group: {
          icon: {},
          button: {},
        },
        toolbar: {
          icon: {},
          bar: {
            tab: {
              icon: {},
            },
          },
        },
      },
    })).toEqual([
      'menu',
      'button',
      'icon',
      'context',
      'group',
      'toolbar',
      'bar',
      'tab',
    ]);
  });

  test('flatStylesDependencyTree', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.fullDependencyTree = simpleJsDependencies;
    dependencyCollector.fillStylesDependencyTree();
    dependencyCollector.fillFlatStylesDependencyTree();

    expect(dependencyCollector.flatStylesDependencyTree).toEqual({
      toolbar: ['menu', 'icon'],
      menu: ['icon'],
    });
  });

  test('collect - right result and cache worked', () => {
    const dependencyCollector = new DependencyCollector();
    dependencyCollector.collect();

    expect(fs.readFileSync).toBeCalledTimes(9);
    expect(dependencyCollector.flatStylesDependencyTree).toEqual({
      toolbar: ['menu', 'icon'],
      menu: ['icon'],
    });
  });
});

describe('validation', () => {
  const dependencyCollector = new DependencyCollector();

  dependencyCollector.flatStylesDependencyTree = {
    button: [],
    toolbar: [],
  };

  test('validate - all widgets present in index file', () => {
    dependencyCollector.readFile = (): string => `
    // public widgets
    @use "./button";
    @use "./toolbar";
    `;

    expect(() => dependencyCollector.validate()).not.toThrow();
  });

  test('validate - index file has more widgets than in dependencies', () => {
    dependencyCollector.readFile = (): string => `
    // public widgets
    @use "./button";
    @use "./toolbar";
    @use "./dataGrid";
    `;

    expect(() => dependencyCollector.validate()).toThrow('Some public widgets (generic) has no // STYLE comment in source code or private widget has one');
  });

  test('validate - index file has less widgets than in dependencies', () => {
    dependencyCollector.readFile = (): string => `
    // public widgets
    @use "./button";
    `;

    expect(() => dependencyCollector.validate()).toThrow('Some public widgets (generic) has no // STYLE comment in source code or private widget has one');
  });
});
