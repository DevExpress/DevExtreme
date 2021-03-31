import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentNativeEvent
} from '../events';

import dxTextEditor, {
    dxTextEditorButton,
    dxTextEditorOptions
} from './text_box/ui.text_editor.base';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    format
} from './widget/ui.widget';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxNumberBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentNativeEvent<dxNumberBox> & ValueChangedInfo;
/**
 * @public
 */
export type ChangeEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type CopyEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type CutEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type InputEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentNativeEvent<dxNumberBox>;
/**
 * @public
 */
export type PasteEvent = ComponentNativeEvent<dxNumberBox>;

export interface dxNumberBoxOptions extends dxTextEditorOptions<dxNumberBox> {
    /**
     * @docid
     * @type Array<Enums.NumberBoxButtonName,dxTextEditorButton>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttons?: Array<'clear' | 'spins' | dxTextEditorButton>;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    format?: format;
    /**
     * @docid
     * @default "Value must be a number"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    invalidValueMessage?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: number;
    /**
     * @docid
     * @type Enums.NumberBoxMode
     * @default "text"
     * @default 'number' [for](mobile_devices)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mode?: 'number' | 'text' | 'tel';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showSpinButtons?: boolean;
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    step?: number;
    /**
     * @docid
     * @default true
     * @default false [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useLargeSpinButtons?: boolean;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: number;
}
/**
 * @docid
 * @isEditor
 * @inherits dxTextEditor
 * @module ui/number_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxNumberBox extends dxTextEditor {
    constructor(element: TElement, options?: dxNumberBoxOptions)
}

export type Options = dxNumberBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxNumberBoxOptions;
