import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    DataExpressionMixinOptions,
} from './editor/ui.data_expression';

import {
    Properties as PopupProperties,
} from './popup';

/** @public */
export type ChangeEvent = NativeEventInfo<dxDropDownBox, Event>;

/** @public */
export type ClosedEvent = EventInfo<dxDropDownBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxDropDownBox, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxDropDownBox, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxDropDownBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxDropDownBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxDropDownBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDropDownBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxDropDownBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/** @public */
export type OpenedEvent = EventInfo<dxDropDownBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDropDownBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxDropDownBox, ClipboardEvent>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/** @public */
export type ContentTemplateData = {
    component: dxDropDownBox;
    readonly value?: any;
};

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
    /**
     * @docid
     * @default false
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default 'content'
     * @type_function_param1 templateData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    contentTemplate?: template | ((templateData: ContentTemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * @docid
     * @public
     */
    displayValueFormatter?: ((value: string | Array<any>) => string);
    /**
     * @docid
     * @default null
     * @type_function_param1 value:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    fieldTemplate?: template | ((value: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    items?: Array<any>;
    /**
     * @docid
     * @default true
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @default "change"
     * @public
     */
    valueChangeEvent?: string;

    /**
     * @docid
     * @type dxPopupOptions
     */
    dropDownOptions?: PopupProperties;
}
/**
 * @docid
 * @isEditor
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDropDownBox extends dxDropDownEditor<dxDropDownBoxOptions> {
    getDataSource(): DataSource;
}

/** @public */
export type Properties = dxDropDownBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxDropDownBoxOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onContentReady'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

type Events = {
/**
 * @skip
 * @docid dxDropDownBoxOptions.onChange
 * @type_function_param1 e:{ui/drop_down_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onClosed
 * @type_function_param1 e:{ui/drop_down_box:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onCopy
 * @type_function_param1 e:{ui/drop_down_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onCut
 * @type_function_param1 e:{ui/drop_down_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onDisposing
 * @type_function_param1 e:{ui/drop_down_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/drop_down_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/drop_down_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/drop_down_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onInitialized
 * @type_function_param1 e:{ui/drop_down_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onInput
 * @type_function_param1 e:{ui/drop_down_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/drop_down_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/drop_down_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onOpened
 * @type_function_param1 e:{ui/drop_down_box:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/drop_down_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onPaste
 * @type_function_param1 e:{ui/drop_down_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @skip
 * @docid dxDropDownBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/drop_down_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
