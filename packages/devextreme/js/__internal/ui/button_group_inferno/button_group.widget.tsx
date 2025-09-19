// eslint-disable-next-line max-classes-per-file
/* eslint-disable spellcheck/spell-checker */
import { Component } from '@js/core/component';
import type { Item, SelectionChangedEvent } from '@js/ui/button_group';
import type dxButtonGroup from '@js/ui/button_group';
import { DIContext } from '@ts/core/di/index';
import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed } from '@ts/core/state_manager/index';
import type { ButtonGroupProps } from '@ts/ui/button_group_inferno/button_group.component';
import { ButtonGroupComponent } from '@ts/ui/button_group_inferno/button_group.component';
import * as FunctionalityControllerModule from '@ts/ui/button_group_inferno/functionality/index';
import { InfernoWidget } from '@ts/ui/button_group_inferno/inferno_widget';
import type { ComponentType } from 'inferno';

import type { BaseButtonCollection } from './base_button_collection';
import { defaultOptions as buttonGroupDefaultOptions } from './controllers/options';
import { OptionsController } from './controllers/options_controller';

export class ButtonGroupBase extends InfernoWidget<ButtonGroupProps> {
  private diContext!: DIContext;

  protected options!: OptionsController;

  public _getDefaultOptions(): ButtonGroupProps {
    return {
      ...super._getDefaultOptions(),
      ...buttonGroupDefaultOptions,
    };
  }

  protected getComponent(): ComponentType<ButtonGroupProps> {
    return ButtonGroupComponent;
  }

  protected getProps(): ReadonlySignal<ButtonGroupProps> {
    return computed((): ButtonGroupProps => ({
      width: this.options.oneWay('width').value,
      items: this.options.oneWay('items').value,
      selectionMode: this.options.oneWay('selectionMode').value,
      keyExpr: this.options.oneWay('keyExpr').value,
      buttonTemplate: this.options.oneWay('buttonTemplate').value,
      selectedItems: this.options.oneWay('selectedItems').value || [],
      selectedItemKeys: this.options.oneWay('selectedItemKeys').value || [],
      focusStateEnabled: this.options.oneWay('focusStateEnabled').value,
      hoverStateEnabled: this.options.oneWay('hoverStateEnabled').value,
      activeStateEnabled: this.options.oneWay('activeStateEnabled').value,
      stylingMode: this.options.oneWay('stylingMode').value,
      accessKey: this.options.oneWay('accessKey').value,
      tabIndex: this.options.oneWay('tabIndex').value,
      elementRef: { current: this.$element().get(0) as HTMLDivElement },
      onItemClick: this.options.action('onItemClick').value,
      onButtonCollectionMounted: (component): void => {
        this._syncSelectionOptions(component);
      },
      onSelectionChanged: (e: SelectionChangedEvent): void => {
        this._syncSelectionOptions(e.component);
        this._fireSelectionChangeEvent(e.addedItems, e.removedItems);
      },
    }));
  }

  public _init(): void {
    super._init();
    
    this.functionalityController = new FunctionalityControllerModule.Controller(this);

    this.diContext = new DIContext();
    this.diContext.registerInstance(Component, this);
    // @ts-expect-error
    this.diContext.register(OptionsController);

    this.options = this.diContext.get(OptionsController);
  }

  _syncSelectionOptions(component: BaseButtonCollection | dxButtonGroup): void {
    const { selectedItems, selectedItemKeys } = component.option();

    this._setOptionWithoutOptionChange('selectedItems', selectedItems);
    this._setOptionWithoutOptionChange('selectedItemKeys', selectedItemKeys);
  }

  private _fireSelectionChangeEvent(addedItems: Item[], removedItems: Item[]): void {
    this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    })({ addedItems, removedItems });
  }
}

export class ButtonGroup extends FunctionalityControllerModule.PublicMethods(
  ButtonGroupBase,
) {}
