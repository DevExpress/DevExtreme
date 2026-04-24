import { transformSync } from '@babel/core';

import {
  moveFieldInitializersToConstructor,
  removeUninitializedClassFields,
} from './vite-plugin-devextreme';

function transform(code: string, plugin: unknown): string {
  const result = transformSync(code, {
    babelrc: false,
    configFile: false,
    parserOpts: {
      plugins: ['classProperties'],
    },
    plugins: [
      plugin,
    ],
  });
  return result!.code!;
}

describe('moveFieldInitializersToConstructor', () => {
  test('inserts field initializer after super() in derived class', () => {
    const input = `
      class Derived extends Base {
        foo = 42;
        constructor() {
          super();
        }
      }
    `;
    const out = transform(input, moveFieldInitializersToConstructor);
    expect(out).toMatch(/super\(\);\s*this\.foo\s*=\s*42/);
    expect(out).not.toMatch(/this\.foo\s*=\s*42;\s*super\(\)/);
  });

  test('inserts field initializer after super() when pre-super statement exists', () => {
    const input = `
      class Derived extends Base {
        foo = 42;
        constructor() {
          const y = 1;
          super(y);
        }
      }
    `;
    const out = transform(input, moveFieldInitializersToConstructor);
    expect(out).toMatch(/super\(y\);\s*this\.foo\s*=\s*42/);
    expect(out).not.toMatch(/this\.foo\s*=\s*42;[\s\S]*super\(y\)/);
  });

  test('inserts after parameter-property assignments', () => {
    const input = `
      class A {
        foo = 42;
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
      }
    `;
    const out = transform(input, moveFieldInitializersToConstructor);
    expect(out).toMatch(/this\.y\s*=\s*y;\s*this\.foo\s*=\s*42/);
  });

  test('inserts at start when no super and no param props', () => {
    const input = `
      class A {
        foo = 42;
        constructor() {
          doSomething();
        }
      }
    `;
    const out = transform(input, moveFieldInitializersToConstructor);
    expect(out).toMatch(/constructor\(\)\s*\{\s*this\.foo\s*=\s*42;\s*doSomething\(\)/);
  });

  test('preserves field order', () => {
    const input = `
      class A extends Base {
        a = 1;
        b = 2;
        c = 3;
        constructor() {
          super();
        }
      }
    `;
    const out = transform(input, moveFieldInitializersToConstructor);
    expect(out).toMatch(/this\.a\s*=\s*1;\s*this\.b\s*=\s*2;\s*this\.c\s*=\s*3/);
  });

  test('does not move static fields', () => {
    const input = `
      class A {
        static shared = 1;
        foo = 42;
        constructor() {}
      }
    `;
    const out = transform(input, moveFieldInitializersToConstructor);
    expect(out).toMatch(/static\s+shared\s*=\s*1/);
    expect(out).toMatch(/this\.foo\s*=\s*42/);
  });

  test('does nothing when class has no constructor', () => {
    const input = `
      class A {
        foo = 42;
      }
    `;
    const out = transform(input, moveFieldInitializersToConstructor);
    expect(out).toMatch(/foo\s*=\s*42/);
    expect(out).not.toMatch(/constructor/);
  });

  test('does not touch this.x = x where x is not a constructor param', () => {
    const input = `
      class A {
        foo = 42;
        constructor() {
          const x = 1;
          this.x = x;
        }
      }
    `;
    const out = transform(input, moveFieldInitializersToConstructor);
    expect(out).toMatch(/constructor\(\)\s*\{\s*this\.foo\s*=\s*42;\s*const\s+x\s*=\s*1;\s*this\.x\s*=\s*x/);
  });
});

describe('removeUninitializedClassFields', () => {
  test('removes declared but uninitialized fields', () => {
    const input = `
      class A {
        foo;
        bar = 1;
      }
    `;
    const out = transform(input, removeUninitializedClassFields);
    expect(out).not.toMatch(/\bfoo\b/);
    expect(out).toMatch(/bar\s*=\s*1/);
  });

  test('keeps fields initialized with falsy values', () => {
    const input = `
      class A {
        a = 0;
        b = false;
        c = null;
        d = '';
      }
    `;
    const out = transform(input, removeUninitializedClassFields);
    expect(out).toMatch(/a\s*=\s*0/);
    expect(out).toMatch(/b\s*=\s*false/);
    expect(out).toMatch(/c\s*=\s*null/);
    expect(out).toMatch(/d\s*=\s*''/);
  });
});
