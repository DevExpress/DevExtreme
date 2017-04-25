declare module DevExpress.framework {
    /** @docid_ignore dxCommandContainer */
    /** @docid_ignore dxCommandContaineroptions_id */
    /** @docid_ignore dxcontent */
    /** @docid_ignore dxcontentoptions_targetPlaceholder */
    /** @docid_ignore dxcontentplaceholderoptions_contentCssPosition */
    /** @docid_ignore dxcontentplaceholderoptions_name */
    /** @docid_ignore dxcontentplaceholderoptions_transition */
    /** @docid_ignore dxcontentplaceholderoptions_animation */
    /** @docid_ignore dxcontentplaceholder */
    /** @docid_ignore dxtransitionoptions_name */
    /** @docid_ignore dxtransitionoptions_type */
    /** @docid_ignore dxtransitionoptions_animation */
    /** @docid_ignore dxtransition */
    /** @docid_ignore dxlayoutoptions_name */
    /** @docid_ignore dxlayout */
    /** @docid_ignore dxviewoptions_disableCache */
    /** @docid_ignore dxviewoptions_modal */
    /** @docid_ignore dxviewoptions_name */
    /** @docid_ignore dxviewoptions_orientation */
    /** @docid_ignore dxviewoptions_pane */
    /** @docid_ignore dxviewoptions_title */
    /** @docid_ignore dxview */
    /** @docid_ignore dxviewPlaceholderoptions_viewName */
    /** @docid_ignore dxviewPlaceholder */

    /** @docid ViewCache */
    export class ViewCache {

        /** @docid ViewCacheevents_viewRemoved */
        viewRemoved: JQueryCallback;

        /** @docid ViewCachemethods_clear */
        clear(): void;

        /** @docid ViewCachemethods_getView */
        getView(key: string): Object;

        /** @docid ViewCachemethods_hasView */
        hasView(key: string): boolean;

        /** @docid ViewCachemethods_removeView */
        removeView(key: string): Object;

        /** @docid ViewCachemethods_setView */
        setView(key: string, viewInfo: Object): void;
    }

    export interface dxCommandOptions extends DOMComponentOptions {
        /** @docid dxCommandOptions_onExecute */
        onExecute?: any;

        /** @docid dxCommandOptions_disabled */
        disabled?: boolean;

        /** @docid dxCommandOptions_renderStage */
        renderStage?: string;

        /** @docid dxCommandOptions_icon */
        icon?: string;

        /** @docid dxCommandOptions_iconSrc */
        iconSrc?: string;

        /** @docid dxCommandOptions_id */
        id?: string;

        /** @docid dxCommandOptions_title */
        title?: string;

        /** @docid dxCommandOptions_type */
        type?: string;

        /** @docid dxCommandOptions_visible */
        visible?: boolean;
    }

    /** @docid dxcommand */
    export class dxCommand extends DOMComponent {
        constructor(element: JQuery, options: dxCommandOptions);
        constructor(options: dxCommandOptions);

        /** @docid dxcommandmethods_execute */
        execute(): void;
    }

    /** @docid Router */
    export class Router {
        /** @docid RouterMethods_register */
        register(pattern: string, defaults?: Object, constraints?: Object): void;

        /** @docid RouterMethods_parse */
        parse(uri: string): Object;

        /** @docid RouterMethods_format */
        format(obj: Object): string;
    }

    export interface StateManagerOptions {
        /** @docid StateManageroptions_storage */
        storage?: Object;
    }

    /** @docid StateManager */
    export class StateManager {
        constructor(options?: StateManagerOptions);
        /** @docid StateManagerMethods_addStateSource */
        addStateSource(stateSource: Object): void;

        /** @docid StateManagerMethods_removeStateSource */
        removeStateSource(stateSource: Object): void;

        /** @docid StateManagerMethods_saveState */
        saveState(): void;

        /** @docid StateManagerMethods_restoreState */
        restoreState(): void;

        /** @docid StateManagerMethods_clearState */
        clearState(): void;

    }

    export module html {

        export var layoutSets: Array<string>;
        export var animationSets: { [animationSetName: string]: AnimationSet };

        export interface AnimationSet {
            [animationName: string]: any
        }

        export interface HtmlApplicationOptions {
            /** @docid HtmlApplicationoptions_commandMapping */
            commandMapping?: Object;

            /** @docid HtmlApplicationoptions_disableViewCache */
            disableViewCache?: boolean;

            /** @docid HtmlApplicationoptions_layoutSet */
            layoutSet?: any;

            /** @docid HtmlApplicationoptions_animationSet */
            animationSet?: AnimationSet;

            /** @docid HtmlApplicationoptions_mode */
            mode?: string;

            /** @docid HtmlApplicationoptions_namespace */
            namespace?: Object;

            /** @docid HtmlApplicationoptions_navigateToRootViewMode */
            navigateToRootViewMode?: string;

            /** @docid HtmlApplicationoptions_navigation */
            navigation?: Array<any>;

            /** @docid HtmlApplicationOptions_stateManager */
            stateManager?: StateManager;

            /** @docid HtmlApplicationOptions_stateStorage */
            stateStorage?: Object;

            /** @docid HtmlApplicationoptions_useViewTitleAsBackText */
            useViewTitleAsBackText?: boolean;

            /** @docid HtmlApplicationoptions_viewCache */
            viewCache?: Object;

            /** @docid HtmlApplicationoptions_viewCacheSize */
            viewCacheSize?: number;

            /** @docid HtmlApplicationoptions_templatesVersion */
            templatesVersion?: string;

            /** @docid HtmlApplicationoptions_viewPort */
            viewPort?: JQuery;

            /** @docid HtmlApplicationOptions_router */
            router?: Router;
        }

        /** @docid HtmlApplication */
        export class HtmlApplication implements EventsMixin<HtmlApplication> {

            constructor(options: HtmlApplicationOptions);

            afterViewSetup: JQueryCallback;
            beforeViewSetup: JQueryCallback;
            initialized: JQueryCallback;
            navigating: JQueryCallback;
            navigatingBack: JQueryCallback;
            resolveLayoutController: JQueryCallback;
            resolveViewCacheKey: JQueryCallback;
            viewDisposed: JQueryCallback;
            viewDisposing: JQueryCallback;
            viewHidden: JQueryCallback;
            viewRendered: JQueryCallback;
            viewShowing: JQueryCallback;
            viewShown: JQueryCallback;

            /** @docid HtmlApplicationfields_viewCache */
            viewCache: ViewCache;

            /** @docid HtmlApplicationfields_navigation */
            navigation: Array<any>;

            /** @docid HtmlApplicationFields_stateManager */
            stateManager: StateManager;

            /** @docid HtmlApplicationFields_router */
            router: Router;

            /** @docid HtmlApplicationmethods_back */
            back(): void;

            /** @docid HtmlApplicationmethods_canBack */
            canBack(): boolean;

            /** @docid HtmlApplicationmethods_clearState */
            clearState(): void;

            /** @docid HtmlApplicationmethods_createNavigation */
            createNavigation(navigationConfig: Array<any>): void;

            /** @docid HtmlApplicationmethods_getViewTemplate */
            getViewTemplate(viewName: string): JQuery;

            /** @docid HtmlApplicationmethods_getViewTemplateInfo */
            getViewTemplateInfo(viewName: string): Object;

            /** @docid HtmlApplicationmethods_loadTemplates */
            loadTemplates(source: any): JQueryPromise<any>;

            /** @docid HtmlApplicationmethods_navigate */
            navigate(uri?: any, options?: Object): void;

            /** @docid HtmlApplicationmethods_renderNavigation */
            renderNavigation(): void;

            /** @docid HtmlApplicationmethods_restoreState */
            restoreState(): void;

            /** @docid HtmlApplicationmethods_saveState */
            saveState(): void;

            /** @docid HtmlApplicationmethods_templateContext */
            templateContext(): Object;

            on(eventName: "initialized", eventHandler: () => void): HtmlApplication;
            on(eventName: "afterViewSetup", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            on(eventName: "beforeViewSetup", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            on(eventName: "navigating", eventHandler: (e: {
                currentUri: string;
                uri: string;
                cancel: boolean;
                options: {
                    root: boolean;
                    target: string;
                    direction: string;
                    rootInDetailPane: boolean;
                    modal: boolean;
                };
            }) => void): HtmlApplication;
            on(eventName: "navigatingBack", eventHandler: (e: {
                cancel: boolean;
                isHardwareButton: boolean;
            }) => void): HtmlApplication;
            on(eventName: "resolveLayoutController", eventHandler: (e: {
                viewInfo: Object;
                layoutController: Object;
                availableLayoutControllers: Array<Object>;
            }) => void): HtmlApplication;
            on(eventName: "resolveViewCacheKey", eventHandler: (e: {
                key: string;
                navigationItem: Object;
                routeData: Object;
            }) => void): HtmlApplication;
            on(eventName: "viewDisposed", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            on(eventName: "viewDisposing", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            on(eventName: "viewHidden", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            on(eventName: "viewRendered", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            on(eventName: "viewShowing", eventHandler: (e: {
                viewInfo: Object;
                direction: string;
            }) => void): HtmlApplication;
            on(eventName: "viewShown", eventHandler: (e: {
                viewInfo: Object;
                direction: string;
            }) => void): HtmlApplication;
            on(eventName: string, eventHandler: Function): HtmlApplication;

            on(events: { [eventName: string]: Function; }): HtmlApplication;

            off(eventName: "initialized"): HtmlApplication;
            off(eventName: "afterViewSetup"): HtmlApplication;
            off(eventName: "beforeViewSetup"): HtmlApplication;
            off(eventName: "navigating"): HtmlApplication;
            off(eventName: "navigatingBack"): HtmlApplication;
            off(eventName: "resolveLayoutController"): HtmlApplication;
            off(eventName: "resolveViewCacheKey"): HtmlApplication;
            off(eventName: "viewDisposed"): HtmlApplication;
            off(eventName: "viewDisposing"): HtmlApplication;
            off(eventName: "viewHidden"): HtmlApplication;
            off(eventName: "viewRendered"): HtmlApplication;
            off(eventName: "viewShowing"): HtmlApplication;
            off(eventName: "viewShown"): HtmlApplication;
            off(eventName: string): HtmlApplication;

            off(eventName: "initialized", eventHandler: () => void): HtmlApplication;
            off(eventName: "afterViewSetup", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            off(eventName: "beforeViewSetup", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            off(eventName: "navigating", eventHandler: (e: {
                currentUri: string;
                uri: string;
                cancel: boolean;
                options: {
                    root: boolean;
                    target: string;
                    direction: string;
                    rootInDetailPane: boolean;
                    modal: boolean;
                };
            }) => void): HtmlApplication;
            off(eventName: "navigatingBack", eventHandler: (e: {
                cancel: boolean;
                isHardwareButton: boolean;
            }) => void): HtmlApplication;
            off(eventName: "resolveLayoutController", eventHandler: (e: {
                viewInfo: Object;
                layoutController: Object;
                availableLayoutControllers: Array<Object>;
            }) => void): HtmlApplication;
            off(eventName: "resolveViewCacheKey", eventHandler: (e: {
                key: string;
                navigationItem: Object;
                routeData: Object;
            }) => void): HtmlApplication;
            off(eventName: "viewDisposed", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            off(eventName: "viewDisposing", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            off(eventName: "viewHidden", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            off(eventName: "viewRendered", eventHandler: (e: {
                viewInfo: Object;
            }) => void): HtmlApplication;
            off(eventName: "viewShowing", eventHandler: (e: {
                viewInfo: Object;
                direction: string;
            }) => void): HtmlApplication;
            off(eventName: "viewShown", eventHandler: (e: {
                viewInfo: Object;
                direction: string;
            }) => void): HtmlApplication;
            off(eventName: string, eventHandler: Function): HtmlApplication;
        }
    }
}
