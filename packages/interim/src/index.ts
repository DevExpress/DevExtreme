import registerComponent from './core/component_registrator';
import { compileGetter } from './core/utils/data';
import type { ItemLike } from './ui/collection/ui.collection_widget.base';
import ValidationEngine from './ui/validation_engine';
import DefaultAdapter from './ui/validation/default_adapter';

export type { ValidationRule, ValidationRuleType, CompareRule, CustomRule, EmailRule, NumericRule, PatternRule, RangeRule, RequiredRule, StringLengthRule } from './ui/validation_rules';
export type { ValidationResult } from './ui/validator';
export { registerComponent, ItemLike, compileGetter, ValidationEngine, DefaultAdapter as EditorValidationAdapter };
export { getWindow } from './core/utils/window';

import KeyboardProcessor from './events/core/keyboard_processor';

// eslint-disable-next-line import/named
import JQuery, { dxElementWrapper } from './core/renderer';
import { DxElement } from "./core/element";
import { FunctionTemplate } from './core/templates/function_template';

import injector from './core/utils/dependency_injector';

import domAdapter from './core/dom_adapter';
import DOMComponent from './core/dom_component';
import { extend } from './core/utils/extend';
import {cleanDataRecursive} from './core/element_data';
import { getPublicElement } from './core/element';
import type { UserDefinedElement } from './core/element';
import {
  isDefined, isRenderer, isString,
} from './core/utils/type';
import { noop } from './core/utils/common'
export type { dxElementWrapper, DxElement };
export {
  KeyboardProcessor, FunctionTemplate,
  JQuery, domAdapter, DOMComponent, extend,
  getPublicElement, UserDefinedElement, noop,
  isDefined, isRenderer, isString,
  injector, cleanDataRecursive
};

