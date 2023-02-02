import { DEFAULT_DOM_OPTIONS, DOM_ATTRIBUTES, DOM_CSS_CLASSES } from './consts';
import { DomOptions, PropMappers, Props } from './types';
import { createMapper, mapAttributes, mapCss } from './utils';

export const PROP_MAPPERS: PropMappers = {
  accessKey: createMapper(
    DEFAULT_DOM_OPTIONS.accessKey,
    (
      props: Props,
      { shortcutKey }: DomOptions['accessKey'],
    ) => mapAttributes(props, !!shortcutKey, { [DOM_ATTRIBUTES.accessKey]: shortcutKey }),
  ),
  active: createMapper(
    DEFAULT_DOM_OPTIONS.active,
    (
      props: Props,
      { activeStateEnabled }: DomOptions['active'],
    ) => mapCss(props, activeStateEnabled, DOM_CSS_CLASSES.active),
  ),
  attributes: createMapper(
    DEFAULT_DOM_OPTIONS.attributes,
    (
      props: Props,
      { attributes }: DomOptions['attributes'],
    ) => mapAttributes(props, true, attributes),
  ),
  disabled: createMapper(
    DEFAULT_DOM_OPTIONS.disabled,
    (
      props: Props,
      { disabled }: DomOptions['disabled'],
    ) => mapAttributes(
      props,
      disabled,
      {
        [DOM_ATTRIBUTES.disabled]: ' ',
        [DOM_ATTRIBUTES.tabIndex]: undefined,
      },
    ),
  ),
  focus: createMapper(
    DEFAULT_DOM_OPTIONS.focus,
    (
      props: Props,
      { focusStateEnabled, tabIndex }: DomOptions['focus'],
    ) => {
      const result = mapCss(props, focusStateEnabled, DOM_CSS_CLASSES.focus);
      return mapAttributes(
        result,
        true,
        {
          [DOM_ATTRIBUTES.tabIndex]: props.attributes[DOM_ATTRIBUTES.disabled]
            ? undefined
            : tabIndex,
        },
      );
    },
  ),
  hint: createMapper(
    DEFAULT_DOM_OPTIONS.hint,
    (
      props: Props,
      { hint }: DomOptions['hint'],
    ) => mapAttributes(props, !!hint, {
      [DOM_ATTRIBUTES.title]: hint!,
    }),
  ),
  hover: createMapper(
    DEFAULT_DOM_OPTIONS.hover,
    (
      props: Props,
      { hoverStateEnabled }: DomOptions['hover'],
    ) => mapCss(props, hoverStateEnabled, DOM_CSS_CLASSES.hover),
  ),
};
