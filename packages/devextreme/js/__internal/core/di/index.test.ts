/* eslint-disable max-classes-per-file */
import { describe, expect, it } from '@jest/globals';

import { DIContext } from './index';

describe('basic', () => {
  describe('register', () => {
    class MyClass {
      static dependencies = [] as const;

      getNumber(): number {
        return 1;
      }
    }

    it('should return registered class', () => {
      const ctx = new DIContext();
      ctx.register(MyClass);

      expect(ctx.get(MyClass)).toBeInstanceOf(MyClass);
      expect(ctx.get(MyClass).getNumber()).toBe(1);
    });

    it('should return registered class with tryGet', () => {
      const ctx = new DIContext();
      ctx.register(MyClass);

      expect(ctx.tryGet(MyClass)).toBeInstanceOf(MyClass);
      expect(ctx.tryGet(MyClass)?.getNumber()).toBe(1);
    });

    it('should return same instance each time', () => {
      const ctx = new DIContext();
      ctx.register(MyClass);

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
      expect(ctx.tryGet(MyClass)).toBe(null);
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

describe('decorators', () => {
  class MyClass {
    static dependencies = [] as const;

    value = 1;

    tag = '';
  }

  class AnotherClass {
    static dependencies = [] as const;

    counter = 0;
  }

  it('should apply global decorators to created instances', () => {
    const ctx = new DIContext();
    ctx.register(MyClass);

    ctx.decorator((instance) => {
      if (instance instanceof MyClass) {
        instance.value = 2;
      }
      return instance;
    });

    expect(ctx.get(MyClass).value).toBe(2);
  });

  it('should apply global decorators to registered instances', () => {
    const ctx = new DIContext();
    const instance = new MyClass();

    ctx.decorator((obj) => {
      if (obj instanceof MyClass) {
        obj.value = 3;
      }
      return obj;
    });

    ctx.registerInstance(MyClass, instance);

    expect(ctx.get(MyClass).value).toBe(3);
    expect(instance.value).toBe(3);
  });

  it('should apply multiple global decorators in the correct order', () => {
    const ctx = new DIContext();
    ctx.register(MyClass);

    ctx.decorator((instance) => {
      if (instance instanceof MyClass) {
        instance.value += 1;
        instance.tag += 'A';
      }
      return instance;
    });

    ctx.decorator((instance) => {
      if (instance instanceof MyClass) {
        instance.value += 2;
        instance.tag += 'B';
      }
      return instance;
    });

    const result = ctx.get(MyClass);
    expect(result.value).toBe(4);
    expect(result.tag).toBe('AB');
  });

  it('should apply global decorators to instances created from fabrics', () => {
    const ctx = new DIContext();

    class BaseClass {
      static dependencies = [] as const;

      value = 1;
    }

    class ExtendedClass extends BaseClass {
      static dependencies = [] as const;

      extraValue = 10;
    }

    ctx.register(BaseClass, ExtendedClass);

    ctx.decorator((instance) => {
      if (instance instanceof ExtendedClass) {
        instance.extraValue = 20;
      }
      return instance;
    });

    const result = ctx.get(BaseClass);

    expect(result).toBeInstanceOf(ExtendedClass);
    expect((result as ExtendedClass).extraValue).toBe(20);
  });

  it('should automatically apply global decorators to all existing instances', () => {
    const ctx = new DIContext();
    ctx.register(MyClass);
    ctx.register(AnotherClass);

    const myClassInstance = ctx.get(MyClass);
    const anotherClassInstance = ctx.get(AnotherClass);

    ctx.decorator((obj) => {
      if (obj instanceof MyClass) {
        obj.value = 42;
        obj.tag = 'decorated';
      } else if (obj instanceof AnotherClass) {
        obj.counter = 42;
      }
      return obj;
    });

    expect(myClassInstance.value).toBe(42);
    expect(myClassInstance.tag).toBe('decorated');
    expect(anotherClassInstance.counter).toBe(42);

    expect(ctx.get(MyClass).value).toBe(42);
    expect(ctx.get(MyClass).tag).toBe('decorated');
    expect(ctx.get(AnotherClass).counter).toBe(42);
  });
});
