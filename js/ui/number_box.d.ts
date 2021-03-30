import {
    TElement
} from '../core/element';

import dxTextEditor, {
    dxTextEditorButton,
    dxTextEditorOptions,
    ComponentChangeEvent,
    ComponentCopyEvent,
    ComponentCutEvent,
    ComponentEnterKeyEvent,
    ComponentFocusInEvent,
    ComponentFocusOutEvent,
    ComponentInputEvent,
    ComponentKeyDownEvent,
    ComponentKeyPressEvent,
    ComponentKeyUpEvent,
    ComponentPasteEvent,
} from './text_box/ui.text_editor.base';

import {
    ComponentValueChangedEvent
} from './editor/editor';

import {
    ComponentContentReadyEvent,
    format
} from './widget/ui.widget';

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxNumberBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxNumberBox>;
/**
 * @public
 */
export type ChangeEvent = ComponentChangeEvent<dxNumberBox>;
/**
 * @public
 */
export type CopyEvent = ComponentCopyEvent<dxNumberBox>;
/**
 * @public
 */
export type CutEvent = ComponentCutEvent<dxNumberBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentEnterKeyEvent<dxNumberBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentFocusInEvent<dxNumberBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentFocusOutEvent<dxNumberBox>;
/**
 * @public
 */
export type InputEvent = ComponentInputEvent<dxNumberBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentKeyDownEvent<dxNumberBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentKeyPressEvent<dxNumberBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentKeyUpEvent<dxNumberBox>;
/**
 * @public
 */
export type PasteEvent = ComponentPasteEvent<dxNumberBox>;

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
