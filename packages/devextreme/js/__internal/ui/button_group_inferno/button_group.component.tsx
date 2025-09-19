import $ from '@js/core/renderer';
import type { ItemClickEvent, Properties, SelectionChangedEvent } from '@js/ui/button_group';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import type { RefObject } from 'inferno';
import { createRef } from 'inferno';

import type { ItemRenderedEvent } from '../button_group';
import type { BaseButtonCollection } from './base_button_collection';
import {
  ButtonCollectionComponent,
  type ButtonCollectionProps,
} from './button_collection.component';

const DEFAULT_STYLING_MODE = 'contained';
const BUTTONGROUP_CLASS = 'dx-buttongroup';
const BUTTONGROUP_MODE_CLASSES = {
  contained: 'dx-buttongroup-mode-contained',
  outlined: 'dx-buttongroup-mode-outlined',
  text: 'dx-buttongroup-mode-text',
};
const BUTTONGROUP_ITEM_HAS_WIDTH_CLASS = 'dx-buttongroup-item-has-width';
const DEFAULT_NO_DATA_TEXT = '';

export interface ButtonGroupProps extends Properties {
  elementRef?: RefObject<HTMLDivElement>;
  onButtonCollectionMounted?: (component: BaseButtonCollection) => void;
}

export class ButtonGroupComponent extends BaseInfernoComponent<ButtonGroupProps> {
  private readonly containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

  private readonly handleItemRendered = (e: ItemRenderedEvent): void => {
    const { width } = this.props;
    if (width !== undefined) {
      $(e.itemElement).addClass(BUTTONGROUP_ITEM_HAS_WIDTH_CLASS);
    }
  };

  private readonly handleSelectionChanged = (e: SelectionChangedEvent): void => {
    const { onSelectionChanged } = this.props;
    onSelectionChanged?.(e);
  };

  private readonly handleItemClick = (e: ItemClickEvent): void => {
    const { onItemClick } = this.props;
    onItemClick?.(e);
  };

  componentDidMount(): void {
    this.applyStylingModeClasses();
  }

  componentDidUpdate(prevProps: ButtonGroupProps): void {
    if (prevProps.stylingMode !== this.props.stylingMode) {
      this.applyStylingModeClasses();
    }
  }

  private applyStylingModeClasses(): void {
    const { stylingMode = DEFAULT_STYLING_MODE, elementRef } = this.props;
    const element = elementRef?.current;

    if (element) {
      Object.values(BUTTONGROUP_MODE_CLASSES).forEach((className) => {
        element.classList.remove(className);
      });

      element.classList.add(BUTTONGROUP_MODE_CLASSES[stylingMode]);

      if (!element.classList.contains(BUTTONGROUP_CLASS)) {
        element.classList.add(BUTTONGROUP_CLASS);
      }
    }
  }

  render(): JSX.Element {
    const {
      stylingMode,
      items,
      selectionMode,
      keyExpr,
      buttonTemplate,
      selectedItems,
      selectedItemKeys,
      focusStateEnabled,
      hoverStateEnabled,
      activeStateEnabled,
      accessKey,
      tabIndex,
      width,
      elementRef,
      onButtonCollectionMounted,
    } = this.props;

    if (elementRef?.current) {
      elementRef.current.setAttribute('role', 'group');
    }

    this.applyStylingModeClasses();

    const collectionOptions: ButtonCollectionProps = {
      selectionMode,
      width,
      items,
      keyExpr,
      buttonTemplate,
      selectedItemKeys,
      focusStateEnabled,
      hoverStateEnabled,
      activeStateEnabled,
      stylingMode,
      accessKey,
      tabIndex,
      noDataText: DEFAULT_NO_DATA_TEXT,
      selectionRequired: false,
      onItemRendered: this.handleItemRendered,
      onSelectionChanged: this.handleSelectionChanged,
      onItemClick: this.handleItemClick,
      onComponentMounted: onButtonCollectionMounted,
    };

    if (selectedItems && selectedItems.length > 0) {
      collectionOptions.selectedItems = selectedItems;
    }

    return (
      <ButtonCollectionComponent {...collectionOptions} />
    );
  }
}
