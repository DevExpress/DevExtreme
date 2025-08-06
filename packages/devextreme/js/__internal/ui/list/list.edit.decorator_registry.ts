import type List from '@ts/ui/list/list.edit';
import type EditDecorator from '@ts/ui/list/list.edit.decorator';

export type DecoratorClass = new (list: List) => EditDecorator;

export interface DecoratorRegistry {
  [option: string]: {
    [type: string]: DecoratorClass;
  };
}

export const registry: DecoratorRegistry = {};

export function register(
  option: string,
  type: string,
  decoratorClass: DecoratorClass,
): void {
  if (!registry[option]) {
    registry[option] = {};
  }
  registry[option][type] = decoratorClass;
}
