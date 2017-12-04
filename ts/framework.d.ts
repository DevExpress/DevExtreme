declare module DevExpress.framework {
    
    /** An object that stores information about views displayed in the application. */
    export class ViewCache {

        viewRemoved: JQueryCallback;

        /** Removes all the viewInfo objects from the cache. */
        clear(): void;

        /** Obtains a viewInfo object from the cache by the specified key. */
        getView(key: string): Object;

        /** Checks whether or not a viewInfo object is contained in the view cache under the specified key. */
        hasView(key: string): boolean;

        /** Removes a viewInfo object from the cache by the specified key. */
        removeView(key: string): Object;

        /** Adds the specified viewInfo object to the cache under the specified key. */
        setView(key: string, viewInfo: Object): void;
    }

    export interface dxCommandOptions extends DOMComponentOptions {
        /** Specifies an action performed when the execute() method of the command is called. */
        onExecute?: any;

        /** Indicates whether or not the widget that displays this command is disabled. */
        disabled?: boolean;

        /** Specifies whether the current command is rendered when a view is being rendered or after a view is shown. */
        renderStage?: string;

        /** Specifies the name of the icon shown inside the widget associated with this command. */
        icon?: string;

        iconSrc?: string;

        /** The identifier of the command. */
        id?: string;

        /** Specifies the title of the widget associated with this command. */
        title?: string;

        /** Specifies the type of the button, if the command is rendered as a Button widget. */
        type?: string;

        /** A Boolean value specifying whether or not the widget associated with this command is visible. */
        visible?: boolean;
    }

    /** A markup component used to define markup options for a command. */
    export class dxCommand extends DOMComponent {
        constructor(element: JQuery, options: dxCommandOptions);
        constructor(options: dxCommandOptions);

        /** Executes the action associated with this command. */
        execute(): void;
    }

    /** An object responsible for routing. */
    export class Router {
        /** Adds a routing rule to the list of registered rules. */
        register(pattern: string, defaults?: Object, constraints?: Object): void;

        /** Decodes the specified URI to an object using the registered routing rules. */
        parse(uri: string): Object;

        /** Formats an object to a URI. */
        format(obj: Object): string;
    }

    export interface StateManagerOptions {
        /** A storage to which the state manager saves the application state. */
        storage?: Object;
    }

    /** An object that stores the current application state. */
    export class StateManager {
        constructor(options?: StateManagerOptions);
        /** Adds an object that implements an interface of a state source to the state manager's collection of state sources. */
        addStateSource(stateSource: Object): void;

        /** Removes a specified state source from the state manager's collection of state sources. */
        removeStateSource(stateSource: Object): void;

        /** Saves the current application state. */
        saveState(): void;

        /** Restores the application state that has been saved by the saveState() method to the state storage. */
        restoreState(): void;

        /** Removes the application state that has been saved by the saveState() method to the state storage. */
        clearState(): void;

    }

    export module html {

        export var layoutSets: Array<string>;
        export var animationSets: { [animationSetName: string]: AnimationSet };

        export interface AnimationSet {
            [animationName: string]: any
        }

        export interface HtmlApplicationOptions {
            /** Specifies where the commands that are defined in the application's views must be displayed. */
            commandMapping?: Object;

            /** Specifies whether or not view caching is disabled. */
            disableViewCache?: boolean;

            /** An array of layout controllers that should be used to show application views in the current navigation context. */
            layoutSet?: any;

            /** Specifies the animation presets that are used to animate different UI elements in the current application. */
            animationSet?: AnimationSet;

            /** Specifies whether the current application must behave as a mobile or web application. */
            mode?: string;

            /** Specifies the object that represents a root namespace of the application. */
            namespace?: Object;

            /** Specifies application behavior when the user navigates to a root view. */
            navigateToRootViewMode?: string;

            /** An array of dxCommand configuration objects used to define commands available from the application's global navigation. */
            navigation?: Array<any>;

            /** A state manager to be used in the application. */
            stateManager?: StateManager;

            /** Specifies the storage to be used by the application's state manager to store the application state. */
            stateStorage?: Object;

            /** Indicates whether on not to use the title of the previously displayed view as text on the Back button. */
            useViewTitleAsBackText?: boolean;

            /** A custom view cache to be used in the application. */
            viewCache?: Object;

            /** Specifies a limit for the views that can be cached. */
            viewCacheSize?: number;

            /** Specifies the current version of application templates. */
            templatesVersion?: string;

            /** Specifies options for the viewport meta tag of a mobile browser. */
            viewPort?: JQuery;

            /** A custom router to be used in the application. */
            router?: Router;
        }

        /** An object that manages views and controls the application life cycle. */
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

            /** Provides access to the ViewCache object. */
            viewCache: ViewCache;

            /** An array of dxCommand components that are created based on the application's navigation option value. */
            navigation: Array<any>;

            /** Provides access to the StateManager object. */
            stateManager: StateManager;

            /** Provides access to the Router object. */
            router: Router;

            /** Navigates to the URI preceding the current one in the navigation history. */
            back(): void;

            /** Returns a Boolean value indicating whether or not backwards navigation is currently possible. */
            canBack(): boolean;

            /** Calls the clearState() method of the application's StateManager object. */
            clearState(): void;

            /** Creates global navigation commands. */
            createNavigation(navigationConfig: Array<any>): void;

            /** Returns an HTML template of the specified view. */
            getViewTemplate(viewName: string): JQuery;

            /** Returns a configuration object used to create a dxView component for a specified view. */
            getViewTemplateInfo(viewName: string): Object;

            /** Adds a specified HTML template to a collection of view or layout templates. */
            loadTemplates(source: any): JQueryPromise<any>;

            /** Navigates to the specified URI. */
            navigate(uri?: any, options?: Object): void;

            /** Renders navigation commands to the navigation command containers that are located in the layouts used in the application. */
            renderNavigation(): void;

            /** Calls the restoreState() method of the application's StateManager object. */
            restoreState(): void;

            /** Calls the saveState method of the application's StateManager object. */
            saveState(): void;

            /** Provides access to the object that defines the current context to be considered when choosing an appropriate template for a view. */
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
