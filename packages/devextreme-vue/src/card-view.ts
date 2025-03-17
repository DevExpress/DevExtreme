import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import CardView, { Properties } from "devextreme/ui/card_view";
import  DataSource from "devextreme/data/data_source";
import  DOMComponent from "devextreme/core/dom_component";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 EventInfo,
} from "devextreme/common/core/events";
import {
 DataErrorOccurredInfo,
 Pager,
 PagerPageSize,
} from "devextreme/common/grids";
import {
 Component,
} from "devextreme/core/component";
import {
 PagerBase,
} from "devextreme/ui/pagination";
import {
 Paging,
 RemoteOperations,
 PredefinedToolbarItem,
 ToolbarItem,
} from "devextreme/ui/card_view";
import {
 LocateInMenuMode,
 ShowTextMode,
} from "devextreme/ui/toolbar";
import {
 ToolbarItemLocation,
 ToolbarItemComponent,
 Mode,
 DisplayMode,
} from "devextreme/common";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "keyExpr" |
  "onContentReady" |
  "onDataErrorOccurred" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "pager" |
  "paging" |
  "remoteOperations" |
  "rtlEnabled" |
  "tabIndex" |
  "toolbar" |
  "visible" |
  "width"
>;

interface DxCardView extends AccessibleOptions {
  readonly instance?: CardView;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | Store | string | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    keyExpr: [Array, String] as PropType<Array<string> | string>,
    onContentReady: Function as PropType<((e: EventInfo<any>) => void)>,
    onDataErrorOccurred: Function as PropType<((args: DataErrorOccurredInfo | EventInfo<any> | { component: any, element: any, error: any, model: any }) => void)>,
    onDisposing: Function as PropType<((e: EventInfo<any>) => void)>,
    onInitialized: Function as PropType<((e: { component: Component<any>, element: any }) => void)>,
    onOptionChanged: Function as PropType<((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)>,
    pager: Object as PropType<Pager | Record<string, any> | PagerBase>,
    paging: Object as PropType<Paging>,
    remoteOperations: [Boolean, Object, String] as PropType<boolean | RemoteOperations | "auto">,
    rtlEnabled: Boolean,
    tabIndex: Number,
    toolbar: Object as PropType<Record<string, any>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:keyExpr": null,
    "update:onContentReady": null,
    "update:onDataErrorOccurred": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:pager": null,
    "update:paging": null,
    "update:remoteOperations": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:toolbar": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): CardView {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CardView;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      pager: { isCollectionItem: false, optionName: "pager" },
      paging: { isCollectionItem: false, optionName: "paging" },
      remoteOperations: { isCollectionItem: false, optionName: "remoteOperations" },
      toolbar: { isCollectionItem: false, optionName: "toolbar" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxCardView = defineComponent(componentConfig);


const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:html": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    html: String,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<PredefinedToolbarItem | string>,
    options: {},
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

const DxPagerConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowedPageSizes": null,
    "update:displayMode": null,
    "update:infoText": null,
    "update:label": null,
    "update:showInfo": null,
    "update:showNavigationButtons": null,
    "update:showPageSizeSelector": null,
    "update:visible": null,
  },
  props: {
    allowedPageSizes: [Array, String] as PropType<(Array<number | PagerPageSize>) | Mode>,
    displayMode: String as PropType<DisplayMode>,
    infoText: String,
    label: String,
    showInfo: Boolean,
    showNavigationButtons: Boolean,
    showPageSizeSelector: Boolean,
    visible: [Boolean, String] as PropType<boolean | Mode>
  }
};

prepareConfigurationComponentConfig(DxPagerConfig);

const DxPager = defineComponent(DxPagerConfig);

(DxPager as any).$_optionName = "pager";

const DxPagingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:pageIndex": null,
    "update:pageSize": null,
  },
  props: {
    enabled: Boolean,
    pageIndex: Number,
    pageSize: Number
  }
};

prepareConfigurationComponentConfig(DxPagingConfig);

const DxPaging = defineComponent(DxPagingConfig);

(DxPaging as any).$_optionName = "paging";

const DxRemoteOperationsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:filtering": null,
    "update:paging": null,
    "update:sorting": null,
    "update:summary": null,
  },
  props: {
    filtering: Boolean,
    paging: Boolean,
    sorting: Boolean,
    summary: Boolean
  }
};

prepareConfigurationComponentConfig(DxRemoteOperationsConfig);

const DxRemoteOperations = defineComponent(DxRemoteOperationsConfig);

(DxRemoteOperations as any).$_optionName = "remoteOperations";

const DxToolbarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:items": null,
  },
  props: {
    items: Array as PropType<Array<PredefinedToolbarItem | ToolbarItem>>
  }
};

prepareConfigurationComponentConfig(DxToolbarConfig);

const DxToolbar = defineComponent(DxToolbarConfig);

(DxToolbar as any).$_optionName = "toolbar";
(DxToolbar as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" }
};

export default DxCardView;
export {
  DxCardView,
  DxItem,
  DxPager,
  DxPaging,
  DxRemoteOperations,
  DxToolbar
};
import type * as DxCardViewTypes from "devextreme/ui/card_view_types";
export { DxCardViewTypes };
