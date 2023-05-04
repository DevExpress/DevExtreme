import Editor, {
    EditorOptions,
} from './editor/editor';

/** @namespace DevExpress.ui */
export interface dxRecurrenceEditorOptions extends EditorOptions<dxRecurrenceEditor> {
    /**
     * @docid
     * @default null
     * @fires dxRecurrenceEditorOptions.onValueChanged
     * @public
     */
    value?: string;
}
/**
 * @docid
 * @isEditor
 * @inherits Editor
 * @namespace DevExpress.ui
 * @public
 */
export default class dxRecurrenceEditor extends Editor<dxRecurrenceEditorOptions> { }

export type Properties = dxRecurrenceEditorOptions;

/** @deprecated use Properties instead */
export type Options = dxRecurrenceEditorOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type Events = CheckedEvents<FilterOutHidden<Properties>, Required<{
/**
 * @skip
 * @docid dxRecurrenceEditorOptions.onContentReady
 * @type_function_param1 e:{ui/recurrence_editor:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxRecurrenceEditorOptions.onDisposing
 * @type_function_param1 e:{ui/recurrence_editor:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxRecurrenceEditorOptions.onInitialized
 * @type_function_param1 e:{ui/recurrence_editor:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxRecurrenceEditorOptions.onOptionChanged
 * @type_function_param1 e:{ui/recurrence_editor:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxRecurrenceEditorOptions.onValueChanged
 * @type_function_param1 e:{ui/recurrence_editor:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
}>>;
