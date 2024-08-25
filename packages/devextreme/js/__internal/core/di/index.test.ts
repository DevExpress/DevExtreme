/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { DIContext } from './index';

describe('basic', () => {
  describe('register', () => {
    class MyClass {
      static dependencies = [] as const;

      getNumber(): number {
        return 1;
      }
    }

    const ctx = new DIContext();
    ctx.register(MyClass);

    it('should return registered class', () => {
      expect(ctx.get(MyClass)).toBeInstanceOf(MyClass);
      expect(ctx.get(MyClass).getNumber()).toBe(1);
    });

    it('should return same instance each time', () => {
      expect(ctx.get(MyClass)).toBe(ctx.get(MyClass));
    });
  });

  describe('registerInstance', () => {
    class MyClass {
      static dependencies = [] as const;

      getNumber(): number {
        return 1;
      }
    }

    const ctx = new DIContext();
    const instance = new MyClass();
    ctx.registerInstance(MyClass, instance);

    it('should work', () => {
      expect(ctx.get(MyClass)).toBe(instance);
    });
  });

  describe('non registered items', () => {
    const ctx = new DIContext();
    class MyClass {
      static dependencies = [] as const;

      getNumber(): number {
        return 1;
      }
    }
    it('should throw', () => {
      expect(() => ctx.get(MyClass)).toThrow();
    });
    it('should not throw if tryGet', () => {
      expect(ctx.tryGet(MyClass)).toBe(undefined);
    });
  });
});

describe('dependencies', () => {
  class MyUtilityClass {
    static dependencies = [] as const;

    getNumber(): number {
      return 2;
    }
  }

  class MyClass {
    static dependencies = [MyUtilityClass] as const;

    constructor(private readonly utility: MyUtilityClass) {}

    getSuperNumber(): number {
      return this.utility.getNumber() * 2;
    }
  }

  const ctx = new DIContext();
  ctx.register(MyUtilityClass);
  ctx.register(MyClass);

  it('should return registered class', () => {
    expect(ctx.get(MyClass)).toBeInstanceOf(MyClass);
    expect(ctx.get(MyUtilityClass)).toBeInstanceOf(MyUtilityClass);
  });

  it('dependecies should work', () => {
    expect(ctx.get(MyClass).getSuperNumber()).toBe(4);
  });
});

describe('mocks', () => {
  class MyClass {
    static dependencies = [] as const;

    getNumber(): number {
      return 1;
    }
  }

  class MyClassMock implements MyClass {
    static dependencies = [] as const;

    getNumber(): number {
      return 2;
    }
  }

  const ctx = new DIContext();
  ctx.register(MyClass, MyClassMock);

  it('should return mock class when they are registered', () => {
    expect(ctx.get(MyClass)).toBeInstanceOf(MyClassMock);
    expect(ctx.get(MyClass).getNumber()).toBe(2);
  });
});

it('should work regardless of registration order', () => {
  class MyClass {
    static dependencies = [] as const;

    getNumber(): number {
      return 1;
    }
  }

  class MyDependentClass {
    static dependencies = [MyClass] as const;

    constructor(private readonly myClass: MyClass) {}

    getSuperNumber(): number {
      return this.myClass.getNumber() * 2;
    }
  }

  const ctx = new DIContext();
  ctx.register(MyDependentClass);
  ctx.register(MyClass);
  expect(ctx.get(MyDependentClass).getSuperNumber()).toBe(2);
});

describe('dependency cycle', () => {
  class MyClass1 {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    static dependencies = [MyClass2] as const;

    constructor(private readonly myClass2: MyClass2) {}
  }
  class MyClass2 {
    static dependencies = [MyClass1] as const;

    constructor(private readonly myClass1: MyClass1) {}
  }

  const ctx = new DIContext();
  ctx.register(MyClass1);
  ctx.register(MyClass2);

  it('should throw', () => {
    expect(() => ctx.get(MyClass1)).toThrow();
    expect(() => ctx.get(MyClass2)).toThrow();
  });
});
