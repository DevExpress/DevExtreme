"use client"
import dxValidationGroup, {
    Properties
} from "devextreme/ui/validation_group";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

import type { DisposingEvent, InitializedEvent } from "devextreme/ui/validation_group";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IValidationGroupOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type IValidationGroupOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IValidationGroupOptionsNarrowedEvents> & IHtmlOptions>

class ValidationGroup extends BaseComponent<React.PropsWithChildren<IValidationGroupOptions>> {

  public get instance(): dxValidationGroup {
    return this._instance;
  }

  protected _WidgetClass = dxValidationGroup;

  protected independentEvents = ["onDisposing","onInitialized"];
}
(ValidationGroup as any).propTypes = {
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};
export default ValidationGroup;
export {
  ValidationGroup,
  IValidationGroupOptions
};
import type * as ValidationGroupTypes from 'devextreme/ui/validation_group_types';
export { ValidationGroupTypes };

