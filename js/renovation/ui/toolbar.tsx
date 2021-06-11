import {
  Component, ComponentBindings, JSXComponent,
} from '@devextreme-generator/declarations';
/* eslint-disable import/named */
import LegacyToolbar from '../../ui/toolbar';

import { DomComponentWrapper } from './common/dom_component_wrapper';
import { BaseWidgetProps } from './common/base_props';

export const viewFunction = ({
  props,
  restAttributes,
}: Toolbar): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyToolbar}
    componentProps={props}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class ToolbarProps extends BaseWidgetProps {

  /*
  TODO: old API

    dataSource
    disabled
    elementAttr
    height
    hint
    hoverStateEnabled
    itemComponent
    itemHoldTimeout
    itemRender
    items[]
    itemTemplate
    menuItemComponent
    menuItemRender
    menuItemTemplate
    noDataText
    onContentReady
    onDisposing
    onInitialized
    onItemClick
    onItemContextMenu
    onItemHold
    onItemRendered
    onOptionChanged
    renderAs
    rtlEnabled
    visible
    width

    Methods:

    beginUpdate()
    defaultOptions(rule)
    dispose()
    element()
    endUpdate()
    getDataSource()
    getInstance(element)
    instance()
    off(eventName)
    off(eventName, eventHandler)
    on(eventName, eventHandler)
    on(events)
    option()
    option(optionName)
    option(optionName, optionValue)
    option(options)
    repaint()
    resetOption(optionName)

    Events:
    contentReady
    disposing
    initialized
    itemClick
    itemContextMenu
    itemHold
    itemRendered
    optionChanged
  */
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Toolbar extends JSXComponent<ToolbarProps>() {}
