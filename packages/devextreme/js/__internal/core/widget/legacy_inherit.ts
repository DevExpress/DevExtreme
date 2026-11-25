import { isFunction } from '@js/core/utils/type';

interface LegacyInstance {
  callBase?: unknown;
}

type LegacyMember = (this: LegacyInstance, ...args: unknown[]) => unknown;

const wrapOverridden = (
  basePrototype: Record<string, unknown>,
  name: string,
  member: LegacyMember,
): LegacyMember => function (this: LegacyInstance, ...args: unknown[]): unknown {
  const prevCallBase = this.callBase;

  this.callBase = basePrototype[name];

  try {
    return member.apply(this, args);
  } finally {
    this.callBase = prevCallBase;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const inheritClass = <TClass extends new (...args: any[]) => object>(
  baseClass: TClass,
  members?: Record<string, unknown>,
): TClass => {
  const basePrototype = baseClass.prototype as Record<string, unknown>;

  class Inheritor extends baseClass {}

  const prototype = Inheritor.prototype as Record<string, unknown>;

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const name in members) {
    const member = members[name];

    prototype[name] = isFunction(prototype[name]) && isFunction(member)
      ? wrapOverridden(basePrototype, name, member as LegacyMember)
      : member;
  }

  return Inheritor;
};
