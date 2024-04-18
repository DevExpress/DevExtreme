(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.ng = global.ng || {}, global.ng.common = {}), global.ng.core));
})(this, (function (exports, i0) { 'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }

  var i0__namespace = /*#__PURE__*/_interopNamespaceDefault(i0);

  /**
   * @license Angular v17.3.0
   * (c) 2010-2022 Google LLC. https://angular.io/
   * License: MIT
   */


  let _DOM = null;
  function getDOM() {
      return _DOM;
  }
  function setRootDomAdapter(adapter) {
      _DOM ??= adapter;
  }
  /* tslint:disable:requireParameterType */
  /**
   * Provides DOM operations in an environment-agnostic way.
   *
   * @security Tread carefully! Interacting with the DOM directly is dangerous and
   * can introduce XSS risks.
   */
  class DomAdapter {
  }

  /**
   * This class wraps the platform Navigation API which allows server-specific and test
   * implementations.
   */
  class PlatformNavigation {
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PlatformNavigation, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PlatformNavigation, providedIn: 'platform', useFactory: () => window.navigation }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PlatformNavigation, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'platform', useFactory: () => window.navigation }]
          }] });

  /**
   * A DI Token representing the main rendering context.
   * In a browser and SSR this is the DOM Document.
   * When using SSR, that document is created by [Domino](https://github.com/angular/domino).
   *
   * @publicApi
   */
  const DOCUMENT = new i0.InjectionToken(ngDevMode ? 'DocumentToken' : '');

  /**
   * This class should not be used directly by an application developer. Instead, use
   * {@link Location}.
   *
   * `PlatformLocation` encapsulates all calls to DOM APIs, which allows the Router to be
   * platform-agnostic.
   * This means that we can have different implementation of `PlatformLocation` for the different
   * platforms that Angular supports. For example, `@angular/platform-browser` provides an
   * implementation specific to the browser environment, while `@angular/platform-server` provides
   * one suitable for use with server-side rendering.
   *
   * The `PlatformLocation` class is used directly by all implementations of {@link LocationStrategy}
   * when they need to interact with the DOM APIs like pushState, popState, etc.
   *
   * {@link LocationStrategy} in turn is used by the {@link Location} service which is used directly
   * by the {@link Router} in order to navigate between routes. Since all interactions between {@link
   * Router} /
   * {@link Location} / {@link LocationStrategy} and DOM APIs flow through the `PlatformLocation`
   * class, they are all platform-agnostic.
   *
   * @publicApi
   */
  class PlatformLocation {
      historyGo(relativePosition) {
          throw new Error(ngDevMode ? 'Not implemented' : '');
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PlatformLocation, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PlatformLocation, providedIn: 'platform', useFactory: () => i0.inject(BrowserPlatformLocation) }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PlatformLocation, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'platform', useFactory: () => i0.inject(BrowserPlatformLocation) }]
          }] });
  /**
   * @description
   * Indicates when a location is initialized.
   *
   * @publicApi
   */
  const LOCATION_INITIALIZED = new i0.InjectionToken(ngDevMode ? 'Location Initialized' : '');
  /**
   * `PlatformLocation` encapsulates all of the direct calls to platform APIs.
   * This class should not be used directly by an application developer. Instead, use
   * {@link Location}.
   *
   * @publicApi
   */
  class BrowserPlatformLocation extends PlatformLocation {
      constructor() {
          super();
          this._doc = i0.inject(DOCUMENT);
          this._location = window.location;
          this._history = window.history;
      }
      getBaseHrefFromDOM() {
          return getDOM().getBaseHref(this._doc);
      }
      onPopState(fn) {
          const window = getDOM().getGlobalEventTarget(this._doc, 'window');
          window.addEventListener('popstate', fn, false);
          return () => window.removeEventListener('popstate', fn);
      }
      onHashChange(fn) {
          const window = getDOM().getGlobalEventTarget(this._doc, 'window');
          window.addEventListener('hashchange', fn, false);
          return () => window.removeEventListener('hashchange', fn);
      }
      get href() {
          return this._location.href;
      }
      get protocol() {
          return this._location.protocol;
      }
      get hostname() {
          return this._location.hostname;
      }
      get port() {
          return this._location.port;
      }
      get pathname() {
          return this._location.pathname;
      }
      get search() {
          return this._location.search;
      }
      get hash() {
          return this._location.hash;
      }
      set pathname(newPath) {
          this._location.pathname = newPath;
      }
      pushState(state, title, url) {
          this._history.pushState(state, title, url);
      }
      replaceState(state, title, url) {
          this._history.replaceState(state, title, url);
      }
      forward() {
          this._history.forward();
      }
      back() {
          this._history.back();
      }
      historyGo(relativePosition = 0) {
          this._history.go(relativePosition);
      }
      getState() {
          return this._history.state;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: BrowserPlatformLocation, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: BrowserPlatformLocation, providedIn: 'platform', useFactory: () => new BrowserPlatformLocation() }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: BrowserPlatformLocation, decorators: [{
              type: i0.Injectable,
              args: [{
                      providedIn: 'platform',
                      useFactory: () => new BrowserPlatformLocation(),
                  }]
          }], ctorParameters: () => [] });

  /**
   * Joins two parts of a URL with a slash if needed.
   *
   * @param start  URL string
   * @param end    URL string
   *
   *
   * @returns The joined URL string.
   */
  function joinWithSlash(start, end) {
      if (start.length == 0) {
          return end;
      }
      if (end.length == 0) {
          return start;
      }
      let slashes = 0;
      if (start.endsWith('/')) {
          slashes++;
      }
      if (end.startsWith('/')) {
          slashes++;
      }
      if (slashes == 2) {
          return start + end.substring(1);
      }
      if (slashes == 1) {
          return start + end;
      }
      return start + '/' + end;
  }
  /**
   * Removes a trailing slash from a URL string if needed.
   * Looks for the first occurrence of either `#`, `?`, or the end of the
   * line as `/` characters and removes the trailing slash if one exists.
   *
   * @param url URL string.
   *
   * @returns The URL string, modified if needed.
   */
  function stripTrailingSlash(url) {
      const match = url.match(/#|\?|$/);
      const pathEndIdx = (match && match.index) || url.length;
      const droppedSlashIdx = pathEndIdx - (url[pathEndIdx - 1] === '/' ? 1 : 0);
      return url.slice(0, droppedSlashIdx) + url.slice(pathEndIdx);
  }
  /**
   * Normalizes URL parameters by prepending with `?` if needed.
   *
   * @param  params String of URL parameters.
   *
   * @returns The normalized URL parameters string.
   */
  function normalizeQueryParams(params) {
      return params && params[0] !== '?' ? '?' + params : params;
  }

  /**
   * Enables the `Location` service to read route state from the browser's URL.
   * Angular provides two strategies:
   * `HashLocationStrategy` and `PathLocationStrategy`.
   *
   * Applications should use the `Router` or `Location` services to
   * interact with application route state.
   *
   * For instance, `HashLocationStrategy` produces URLs like
   * <code class="no-auto-link">http://example.com#/foo</code>,
   * and `PathLocationStrategy` produces
   * <code class="no-auto-link">http://example.com/foo</code> as an equivalent URL.
   *
   * See these two classes for more.
   *
   * @publicApi
   */
  class LocationStrategy {
      historyGo(relativePosition) {
          throw new Error(ngDevMode ? 'Not implemented' : '');
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: LocationStrategy, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: LocationStrategy, providedIn: 'root', useFactory: () => i0.inject(PathLocationStrategy) }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: LocationStrategy, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'root', useFactory: () => i0.inject(PathLocationStrategy) }]
          }] });
  /**
   * A predefined [DI token](guide/glossary#di-token) for the base href
   * to be used with the `PathLocationStrategy`.
   * The base href is the URL prefix that should be preserved when generating
   * and recognizing URLs.
   *
   * @usageNotes
   *
   * The following example shows how to use this token to configure the root app injector
   * with a base href value, so that the DI framework can supply the dependency anywhere in the app.
   *
   * ```typescript
   * import {NgModule} from '@angular/core';
   * import {APP_BASE_HREF} from '@angular/common';
   *
   * @NgModule({
   *   providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}]
   * })
   * class AppModule {}
   * ```
   *
   * @publicApi
   */
  const APP_BASE_HREF = new i0.InjectionToken(ngDevMode ? 'appBaseHref' : '');
  /**
   * @description
   * A {@link LocationStrategy} used to configure the {@link Location} service to
   * represent its state in the
   * [path](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax) of the
   * browser's URL.
   *
   * If you're using `PathLocationStrategy`, you may provide a {@link APP_BASE_HREF}
   * or add a `<base href>` element to the document to override the default.
   *
   * For instance, if you provide an `APP_BASE_HREF` of `'/my/app/'` and call
   * `location.go('/foo')`, the browser's URL will become
   * `example.com/my/app/foo`. To ensure all relative URIs resolve correctly,
   * the `<base href>` and/or `APP_BASE_HREF` should end with a `/`.
   *
   * Similarly, if you add `<base href='/my/app/'/>` to the document and call
   * `location.go('/foo')`, the browser's URL will become
   * `example.com/my/app/foo`.
   *
   * Note that when using `PathLocationStrategy`, neither the query nor
   * the fragment in the `<base href>` will be preserved, as outlined
   * by the [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2).
   *
   * @usageNotes
   *
   * ### Example
   *
   * {@example common/location/ts/path_location_component.ts region='LocationComponent'}
   *
   * @publicApi
   */
  class PathLocationStrategy extends LocationStrategy {
      constructor(_platformLocation, href) {
          super();
          this._platformLocation = _platformLocation;
          this._removeListenerFns = [];
          this._baseHref =
              href ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  i0.inject(DOCUMENT).location?.origin ??
                  '';
      }
      /** @nodoc */
      ngOnDestroy() {
          while (this._removeListenerFns.length) {
              this._removeListenerFns.pop()();
          }
      }
      onPopState(fn) {
          this._removeListenerFns.push(this._platformLocation.onPopState(fn), this._platformLocation.onHashChange(fn));
      }
      getBaseHref() {
          return this._baseHref;
      }
      prepareExternalUrl(internal) {
          return joinWithSlash(this._baseHref, internal);
      }
      path(includeHash = false) {
          const pathname = this._platformLocation.pathname + normalizeQueryParams(this._platformLocation.search);
          const hash = this._platformLocation.hash;
          return hash && includeHash ? `${pathname}${hash}` : pathname;
      }
      pushState(state, title, url, queryParams) {
          const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
          this._platformLocation.pushState(state, title, externalUrl);
      }
      replaceState(state, title, url, queryParams) {
          const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
          this._platformLocation.replaceState(state, title, externalUrl);
      }
      forward() {
          this._platformLocation.forward();
      }
      back() {
          this._platformLocation.back();
      }
      getState() {
          return this._platformLocation.getState();
      }
      historyGo(relativePosition = 0) {
          this._platformLocation.historyGo?.(relativePosition);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PathLocationStrategy, deps: [{ token: PlatformLocation }, { token: APP_BASE_HREF, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PathLocationStrategy, providedIn: 'root' }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PathLocationStrategy, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'root' }]
          }], ctorParameters: () => [{ type: PlatformLocation }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [APP_BASE_HREF]
                  }] }] });

  /**
   * @description
   * A {@link LocationStrategy} used to configure the {@link Location} service to
   * represent its state in the
   * [hash fragment](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax)
   * of the browser's URL.
   *
   * For instance, if you call `location.go('/foo')`, the browser's URL will become
   * `example.com#/foo`.
   *
   * @usageNotes
   *
   * ### Example
   *
   * {@example common/location/ts/hash_location_component.ts region='LocationComponent'}
   *
   * @publicApi
   */
  class HashLocationStrategy extends LocationStrategy {
      constructor(_platformLocation, _baseHref) {
          super();
          this._platformLocation = _platformLocation;
          this._baseHref = '';
          this._removeListenerFns = [];
          if (_baseHref != null) {
              this._baseHref = _baseHref;
          }
      }
      /** @nodoc */
      ngOnDestroy() {
          while (this._removeListenerFns.length) {
              this._removeListenerFns.pop()();
          }
      }
      onPopState(fn) {
          this._removeListenerFns.push(this._platformLocation.onPopState(fn), this._platformLocation.onHashChange(fn));
      }
      getBaseHref() {
          return this._baseHref;
      }
      path(includeHash = false) {
          // the hash value is always prefixed with a `#`
          // and if it is empty then it will stay empty
          const path = this._platformLocation.hash ?? '#';
          return path.length > 0 ? path.substring(1) : path;
      }
      prepareExternalUrl(internal) {
          const url = joinWithSlash(this._baseHref, internal);
          return url.length > 0 ? '#' + url : url;
      }
      pushState(state, title, path, queryParams) {
          let url = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
          if (url.length == 0) {
              url = this._platformLocation.pathname;
          }
          this._platformLocation.pushState(state, title, url);
      }
      replaceState(state, title, path, queryParams) {
          let url = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
          if (url.length == 0) {
              url = this._platformLocation.pathname;
          }
          this._platformLocation.replaceState(state, title, url);
      }
      forward() {
          this._platformLocation.forward();
      }
      back() {
          this._platformLocation.back();
      }
      getState() {
          return this._platformLocation.getState();
      }
      historyGo(relativePosition = 0) {
          this._platformLocation.historyGo?.(relativePosition);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: HashLocationStrategy, deps: [{ token: PlatformLocation }, { token: APP_BASE_HREF, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: HashLocationStrategy }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: HashLocationStrategy, decorators: [{
              type: i0.Injectable
          }], ctorParameters: () => [{ type: PlatformLocation }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [APP_BASE_HREF]
                  }] }] });

  /**
   * @description
   *
   * A service that applications can use to interact with a browser's URL.
   *
   * Depending on the `LocationStrategy` used, `Location` persists
   * to the URL's path or the URL's hash segment.
   *
   * @usageNotes
   *
   * It's better to use the `Router.navigate()` service to trigger route changes. Use
   * `Location` only if you need to interact with or create normalized URLs outside of
   * routing.
   *
   * `Location` is responsible for normalizing the URL against the application's base href.
   * A normalized URL is absolute from the URL host, includes the application's base href, and has no
   * trailing slash:
   * - `/my/app/user/123` is normalized
   * - `my/app/user/123` **is not** normalized
   * - `/my/app/user/123/` **is not** normalized
   *
   * ### Example
   *
   * <code-example path='common/location/ts/path_location_component.ts'
   * region='LocationComponent'></code-example>
   *
   * @publicApi
   */
  class Location {
      constructor(locationStrategy) {
          /** @internal */
          this._subject = new i0.EventEmitter();
          /** @internal */
          this._urlChangeListeners = [];
          /** @internal */
          this._urlChangeSubscription = null;
          this._locationStrategy = locationStrategy;
          const baseHref = this._locationStrategy.getBaseHref();
          // Note: This class's interaction with base HREF does not fully follow the rules
          // outlined in the spec https://www.freesoft.org/CIE/RFC/1808/18.htm.
          // Instead of trying to fix individual bugs with more and more code, we should
          // investigate using the URL constructor and providing the base as a second
          // argument.
          // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL#parameters
          this._basePath = _stripOrigin(stripTrailingSlash(_stripIndexHtml(baseHref)));
          this._locationStrategy.onPopState((ev) => {
              this._subject.emit({
                  'url': this.path(true),
                  'pop': true,
                  'state': ev.state,
                  'type': ev.type,
              });
          });
      }
      /** @nodoc */
      ngOnDestroy() {
          this._urlChangeSubscription?.unsubscribe();
          this._urlChangeListeners = [];
      }
      /**
       * Normalizes the URL path for this location.
       *
       * @param includeHash True to include an anchor fragment in the path.
       *
       * @returns The normalized URL path.
       */
      // TODO: vsavkin. Remove the boolean flag and always include hash once the deprecated router is
      // removed.
      path(includeHash = false) {
          return this.normalize(this._locationStrategy.path(includeHash));
      }
      /**
       * Reports the current state of the location history.
       * @returns The current value of the `history.state` object.
       */
      getState() {
          return this._locationStrategy.getState();
      }
      /**
       * Normalizes the given path and compares to the current normalized path.
       *
       * @param path The given URL path.
       * @param query Query parameters.
       *
       * @returns True if the given URL path is equal to the current normalized path, false
       * otherwise.
       */
      isCurrentPathEqualTo(path, query = '') {
          return this.path() == this.normalize(path + normalizeQueryParams(query));
      }
      /**
       * Normalizes a URL path by stripping any trailing slashes.
       *
       * @param url String representing a URL.
       *
       * @returns The normalized URL string.
       */
      normalize(url) {
          return Location.stripTrailingSlash(_stripBasePath(this._basePath, _stripIndexHtml(url)));
      }
      /**
       * Normalizes an external URL path.
       * If the given URL doesn't begin with a leading slash (`'/'`), adds one
       * before normalizing. Adds a hash if `HashLocationStrategy` is
       * in use, or the `APP_BASE_HREF` if the `PathLocationStrategy` is in use.
       *
       * @param url String representing a URL.
       *
       * @returns  A normalized platform-specific URL.
       */
      prepareExternalUrl(url) {
          if (url && url[0] !== '/') {
              url = '/' + url;
          }
          return this._locationStrategy.prepareExternalUrl(url);
      }
      // TODO: rename this method to pushState
      /**
       * Changes the browser's URL to a normalized version of a given URL, and pushes a
       * new item onto the platform's history.
       *
       * @param path  URL path to normalize.
       * @param query Query parameters.
       * @param state Location history state.
       *
       */
      go(path, query = '', state = null) {
          this._locationStrategy.pushState(state, '', path, query);
          this._notifyUrlChangeListeners(this.prepareExternalUrl(path + normalizeQueryParams(query)), state);
      }
      /**
       * Changes the browser's URL to a normalized version of the given URL, and replaces
       * the top item on the platform's history stack.
       *
       * @param path  URL path to normalize.
       * @param query Query parameters.
       * @param state Location history state.
       */
      replaceState(path, query = '', state = null) {
          this._locationStrategy.replaceState(state, '', path, query);
          this._notifyUrlChangeListeners(this.prepareExternalUrl(path + normalizeQueryParams(query)), state);
      }
      /**
       * Navigates forward in the platform's history.
       */
      forward() {
          this._locationStrategy.forward();
      }
      /**
       * Navigates back in the platform's history.
       */
      back() {
          this._locationStrategy.back();
      }
      /**
       * Navigate to a specific page from session history, identified by its relative position to the
       * current page.
       *
       * @param relativePosition  Position of the target page in the history relative to the current
       *     page.
       * A negative value moves backwards, a positive value moves forwards, e.g. `location.historyGo(2)`
       * moves forward two pages and `location.historyGo(-2)` moves back two pages. When we try to go
       * beyond what's stored in the history session, we stay in the current page. Same behaviour occurs
       * when `relativePosition` equals 0.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/History_API#Moving_to_a_specific_point_in_history
       */
      historyGo(relativePosition = 0) {
          this._locationStrategy.historyGo?.(relativePosition);
      }
      /**
       * Registers a URL change listener. Use to catch updates performed by the Angular
       * framework that are not detectible through "popstate" or "hashchange" events.
       *
       * @param fn The change handler function, which take a URL and a location history state.
       * @returns A function that, when executed, unregisters a URL change listener.
       */
      onUrlChange(fn) {
          this._urlChangeListeners.push(fn);
          this._urlChangeSubscription ??= this.subscribe((v) => {
              this._notifyUrlChangeListeners(v.url, v.state);
          });
          return () => {
              const fnIndex = this._urlChangeListeners.indexOf(fn);
              this._urlChangeListeners.splice(fnIndex, 1);
              if (this._urlChangeListeners.length === 0) {
                  this._urlChangeSubscription?.unsubscribe();
                  this._urlChangeSubscription = null;
              }
          };
      }
      /** @internal */
      _notifyUrlChangeListeners(url = '', state) {
          this._urlChangeListeners.forEach((fn) => fn(url, state));
      }
      /**
       * Subscribes to the platform's `popState` events.
       *
       * Note: `Location.go()` does not trigger the `popState` event in the browser. Use
       * `Location.onUrlChange()` to subscribe to URL changes instead.
       *
       * @param value Event that is triggered when the state history changes.
       * @param exception The exception to throw.
       *
       * @see [onpopstate](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)
       *
       * @returns Subscribed events.
       */
      subscribe(onNext, onThrow, onReturn) {
          return this._subject.subscribe({ next: onNext, error: onThrow, complete: onReturn });
      }
      /**
       * Normalizes URL parameters by prepending with `?` if needed.
       *
       * @param  params String of URL parameters.
       *
       * @returns The normalized URL parameters string.
       */
      static { this.normalizeQueryParams = normalizeQueryParams; }
      /**
       * Joins two parts of a URL with a slash if needed.
       *
       * @param start  URL string
       * @param end    URL string
       *
       *
       * @returns The joined URL string.
       */
      static { this.joinWithSlash = joinWithSlash; }
      /**
       * Removes a trailing slash from a URL string if needed.
       * Looks for the first occurrence of either `#`, `?`, or the end of the
       * line as `/` characters and removes the trailing slash if one exists.
       *
       * @param url URL string.
       *
       * @returns The URL string, modified if needed.
       */
      static { this.stripTrailingSlash = stripTrailingSlash; }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: Location, deps: [{ token: LocationStrategy }], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: Location, providedIn: 'root', useFactory: createLocation }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: Location, decorators: [{
              type: i0.Injectable,
              args: [{
                      providedIn: 'root',
                      // See #23917
                      useFactory: createLocation,
                  }]
          }], ctorParameters: () => [{ type: LocationStrategy }] });
  function createLocation() {
      return new Location(i0.ɵɵinject(LocationStrategy));
  }
  function _stripBasePath(basePath, url) {
      if (!basePath || !url.startsWith(basePath)) {
          return url;
      }
      const strippedUrl = url.substring(basePath.length);
      if (strippedUrl === '' || ['/', ';', '?', '#'].includes(strippedUrl[0])) {
          return strippedUrl;
      }
      return url;
  }
  function _stripIndexHtml(url) {
      return url.replace(/\/index.html$/, '');
  }
  function _stripOrigin(baseHref) {
      // DO NOT REFACTOR! Previously, this check looked like this:
      // `/^(https?:)?\/\//.test(baseHref)`, but that resulted in
      // syntactically incorrect code after Closure Compiler minification.
      // This was likely caused by a bug in Closure Compiler, but
      // for now, the check is rewritten to use `new RegExp` instead.
      const isAbsoluteUrl = new RegExp('^(https?:)?//').test(baseHref);
      if (isAbsoluteUrl) {
          const [, pathname] = baseHref.split(/\/\/[^\/]+/);
          return pathname;
      }
      return baseHref;
  }

  /** @internal */
  const CURRENCIES_EN = { "ADP": [undefined, undefined, 0], "AFN": [undefined, "؋", 0], "ALL": [undefined, undefined, 0], "AMD": [undefined, "֏", 2], "AOA": [undefined, "Kz"], "ARS": [undefined, "$"], "AUD": ["A$", "$"], "AZN": [undefined, "₼"], "BAM": [undefined, "KM"], "BBD": [undefined, "$"], "BDT": [undefined, "৳"], "BHD": [undefined, undefined, 3], "BIF": [undefined, undefined, 0], "BMD": [undefined, "$"], "BND": [undefined, "$"], "BOB": [undefined, "Bs"], "BRL": ["R$"], "BSD": [undefined, "$"], "BWP": [undefined, "P"], "BYN": [undefined, undefined, 2], "BYR": [undefined, undefined, 0], "BZD": [undefined, "$"], "CAD": ["CA$", "$", 2], "CHF": [undefined, undefined, 2], "CLF": [undefined, undefined, 4], "CLP": [undefined, "$", 0], "CNY": ["CN¥", "¥"], "COP": [undefined, "$", 2], "CRC": [undefined, "₡", 2], "CUC": [undefined, "$"], "CUP": [undefined, "$"], "CZK": [undefined, "Kč", 2], "DJF": [undefined, undefined, 0], "DKK": [undefined, "kr", 2], "DOP": [undefined, "$"], "EGP": [undefined, "E£"], "ESP": [undefined, "₧", 0], "EUR": ["€"], "FJD": [undefined, "$"], "FKP": [undefined, "£"], "GBP": ["£"], "GEL": [undefined, "₾"], "GHS": [undefined, "GH₵"], "GIP": [undefined, "£"], "GNF": [undefined, "FG", 0], "GTQ": [undefined, "Q"], "GYD": [undefined, "$", 2], "HKD": ["HK$", "$"], "HNL": [undefined, "L"], "HRK": [undefined, "kn"], "HUF": [undefined, "Ft", 2], "IDR": [undefined, "Rp", 2], "ILS": ["₪"], "INR": ["₹"], "IQD": [undefined, undefined, 0], "IRR": [undefined, undefined, 0], "ISK": [undefined, "kr", 0], "ITL": [undefined, undefined, 0], "JMD": [undefined, "$"], "JOD": [undefined, undefined, 3], "JPY": ["¥", undefined, 0], "KHR": [undefined, "៛"], "KMF": [undefined, "CF", 0], "KPW": [undefined, "₩", 0], "KRW": ["₩", undefined, 0], "KWD": [undefined, undefined, 3], "KYD": [undefined, "$"], "KZT": [undefined, "₸"], "LAK": [undefined, "₭", 0], "LBP": [undefined, "L£", 0], "LKR": [undefined, "Rs"], "LRD": [undefined, "$"], "LTL": [undefined, "Lt"], "LUF": [undefined, undefined, 0], "LVL": [undefined, "Ls"], "LYD": [undefined, undefined, 3], "MGA": [undefined, "Ar", 0], "MGF": [undefined, undefined, 0], "MMK": [undefined, "K", 0], "MNT": [undefined, "₮", 2], "MRO": [undefined, undefined, 0], "MUR": [undefined, "Rs", 2], "MXN": ["MX$", "$"], "MYR": [undefined, "RM"], "NAD": [undefined, "$"], "NGN": [undefined, "₦"], "NIO": [undefined, "C$"], "NOK": [undefined, "kr", 2], "NPR": [undefined, "Rs"], "NZD": ["NZ$", "$"], "OMR": [undefined, undefined, 3], "PHP": ["₱"], "PKR": [undefined, "Rs", 2], "PLN": [undefined, "zł"], "PYG": [undefined, "₲", 0], "RON": [undefined, "lei"], "RSD": [undefined, undefined, 0], "RUB": [undefined, "₽"], "RWF": [undefined, "RF", 0], "SBD": [undefined, "$"], "SEK": [undefined, "kr", 2], "SGD": [undefined, "$"], "SHP": [undefined, "£"], "SLE": [undefined, undefined, 2], "SLL": [undefined, undefined, 0], "SOS": [undefined, undefined, 0], "SRD": [undefined, "$"], "SSP": [undefined, "£"], "STD": [undefined, undefined, 0], "STN": [undefined, "Db"], "SYP": [undefined, "£", 0], "THB": [undefined, "฿"], "TMM": [undefined, undefined, 0], "TND": [undefined, undefined, 3], "TOP": [undefined, "T$"], "TRL": [undefined, undefined, 0], "TRY": [undefined, "₺"], "TTD": [undefined, "$"], "TWD": ["NT$", "$", 2], "TZS": [undefined, undefined, 2], "UAH": [undefined, "₴"], "UGX": [undefined, undefined, 0], "USD": ["$"], "UYI": [undefined, undefined, 0], "UYU": [undefined, "$"], "UYW": [undefined, undefined, 4], "UZS": [undefined, undefined, 2], "VEF": [undefined, "Bs", 2], "VND": ["₫", undefined, 0], "VUV": [undefined, undefined, 0], "XAF": ["FCFA", undefined, 0], "XCD": ["EC$", "$"], "XOF": ["F CFA", undefined, 0], "XPF": ["CFPF", undefined, 0], "XXX": ["¤"], "YER": [undefined, undefined, 0], "ZAR": [undefined, "R"], "ZMK": [undefined, undefined, 0], "ZMW": [undefined, "ZK"], "ZWD": [undefined, undefined, 0] };

  /**
   * Format styles that can be used to represent numbers.
   * @see {@link getLocaleNumberFormat}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  exports.NumberFormatStyle = void 0;
  (function (NumberFormatStyle) {
      NumberFormatStyle[NumberFormatStyle["Decimal"] = 0] = "Decimal";
      NumberFormatStyle[NumberFormatStyle["Percent"] = 1] = "Percent";
      NumberFormatStyle[NumberFormatStyle["Currency"] = 2] = "Currency";
      NumberFormatStyle[NumberFormatStyle["Scientific"] = 3] = "Scientific";
  })(exports.NumberFormatStyle || (exports.NumberFormatStyle = {}));
  /**
   * Plurality cases used for translating plurals to different languages.
   *
   * @see {@link NgPlural}
   * @see {@link NgPluralCase}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  exports.Plural = void 0;
  (function (Plural) {
      Plural[Plural["Zero"] = 0] = "Zero";
      Plural[Plural["One"] = 1] = "One";
      Plural[Plural["Two"] = 2] = "Two";
      Plural[Plural["Few"] = 3] = "Few";
      Plural[Plural["Many"] = 4] = "Many";
      Plural[Plural["Other"] = 5] = "Other";
  })(exports.Plural || (exports.Plural = {}));
  /**
   * Context-dependant translation forms for strings.
   * Typically the standalone version is for the nominative form of the word,
   * and the format version is used for the genitive case.
   * @see [CLDR website](http://cldr.unicode.org/translation/date-time-1/date-time#TOC-Standalone-vs.-Format-Styles)
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  exports.FormStyle = void 0;
  (function (FormStyle) {
      FormStyle[FormStyle["Format"] = 0] = "Format";
      FormStyle[FormStyle["Standalone"] = 1] = "Standalone";
  })(exports.FormStyle || (exports.FormStyle = {}));
  /**
   * String widths available for translations.
   * The specific character widths are locale-specific.
   * Examples are given for the word "Sunday" in English.
   *
   * @publicApi
   */
  exports.TranslationWidth = void 0;
  (function (TranslationWidth) {
      /** 1 character for `en-US`. For example: 'S' */
      TranslationWidth[TranslationWidth["Narrow"] = 0] = "Narrow";
      /** 3 characters for `en-US`. For example: 'Sun' */
      TranslationWidth[TranslationWidth["Abbreviated"] = 1] = "Abbreviated";
      /** Full length for `en-US`. For example: "Sunday" */
      TranslationWidth[TranslationWidth["Wide"] = 2] = "Wide";
      /** 2 characters for `en-US`, For example: "Su" */
      TranslationWidth[TranslationWidth["Short"] = 3] = "Short";
  })(exports.TranslationWidth || (exports.TranslationWidth = {}));
  /**
   * String widths available for date-time formats.
   * The specific character widths are locale-specific.
   * Examples are given for `en-US`.
   *
   * @see {@link getLocaleDateFormat}
   * @see {@link getLocaleTimeFormat}
   * @see {@link getLocaleDateTimeFormat}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   * @publicApi
   */
  exports.FormatWidth = void 0;
  (function (FormatWidth) {
      /**
       * For `en-US`, 'M/d/yy, h:mm a'`
       * (Example: `6/15/15, 9:03 AM`)
       */
      FormatWidth[FormatWidth["Short"] = 0] = "Short";
      /**
       * For `en-US`, `'MMM d, y, h:mm:ss a'`
       * (Example: `Jun 15, 2015, 9:03:01 AM`)
       */
      FormatWidth[FormatWidth["Medium"] = 1] = "Medium";
      /**
       * For `en-US`, `'MMMM d, y, h:mm:ss a z'`
       * (Example: `June 15, 2015 at 9:03:01 AM GMT+1`)
       */
      FormatWidth[FormatWidth["Long"] = 2] = "Long";
      /**
       * For `en-US`, `'EEEE, MMMM d, y, h:mm:ss a zzzz'`
       * (Example: `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00`)
       */
      FormatWidth[FormatWidth["Full"] = 3] = "Full";
  })(exports.FormatWidth || (exports.FormatWidth = {}));
  // This needs to be an object literal, rather than an enum, because TypeScript 5.4+
  // doesn't allow numeric keys and we have `Infinity` and `NaN`.
  /**
   * Symbols that can be used to replace placeholders in number patterns.
   * Examples are based on `en-US` values.
   *
   * @see {@link getLocaleNumberSymbol}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   * @object-literal-as-enum
   */
  const NumberSymbol = {
      /**
       * Decimal separator.
       * For `en-US`, the dot character.
       * Example: 2,345`.`67
       */
      Decimal: 0,
      /**
       * Grouping separator, typically for thousands.
       * For `en-US`, the comma character.
       * Example: 2`,`345.67
       */
      Group: 1,
      /**
       * List-item separator.
       * Example: "one, two, and three"
       */
      List: 2,
      /**
       * Sign for percentage (out of 100).
       * Example: 23.4%
       */
      PercentSign: 3,
      /**
       * Sign for positive numbers.
       * Example: +23
       */
      PlusSign: 4,
      /**
       * Sign for negative numbers.
       * Example: -23
       */
      MinusSign: 5,
      /**
       * Computer notation for exponential value (n times a power of 10).
       * Example: 1.2E3
       */
      Exponential: 6,
      /**
       * Human-readable format of exponential.
       * Example: 1.2x103
       */
      SuperscriptingExponent: 7,
      /**
       * Sign for permille (out of 1000).
       * Example: 23.4‰
       */
      PerMille: 8,
      /**
       * Infinity, can be used with plus and minus.
       * Example: ∞, +∞, -∞
       */
      Infinity: 9,
      /**
       * Not a number.
       * Example: NaN
       */
      NaN: 10,
      /**
       * Symbol used between time units.
       * Example: 10:52
       */
      TimeSeparator: 11,
      /**
       * Decimal separator for currency values (fallback to `Decimal`).
       * Example: $2,345.67
       */
      CurrencyDecimal: 12,
      /**
       * Group separator for currency values (fallback to `Group`).
       * Example: $2,345.67
       */
      CurrencyGroup: 13,
  };
  /**
   * The value for each day of the week, based on the `en-US` locale
   *
   * @publicApi
   */
  exports.WeekDay = void 0;
  (function (WeekDay) {
      WeekDay[WeekDay["Sunday"] = 0] = "Sunday";
      WeekDay[WeekDay["Monday"] = 1] = "Monday";
      WeekDay[WeekDay["Tuesday"] = 2] = "Tuesday";
      WeekDay[WeekDay["Wednesday"] = 3] = "Wednesday";
      WeekDay[WeekDay["Thursday"] = 4] = "Thursday";
      WeekDay[WeekDay["Friday"] = 5] = "Friday";
      WeekDay[WeekDay["Saturday"] = 6] = "Saturday";
  })(exports.WeekDay || (exports.WeekDay = {}));
  /**
   * Retrieves the locale ID from the currently loaded locale.
   * The loaded locale could be, for example, a global one rather than a regional one.
   * @param locale A locale code, such as `fr-FR`.
   * @returns The locale code. For example, `fr`.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleId(locale) {
      return i0.ɵfindLocaleData(locale)[i0.ɵLocaleDataIndex.LocaleId];
  }
  /**
   * Retrieves day period strings for the given locale.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param formStyle The required grammatical form.
   * @param width The required character width.
   * @returns An array of localized period strings. For example, `[AM, PM]` for `en-US`.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleDayPeriods(locale, formStyle, width) {
      const data = i0.ɵfindLocaleData(locale);
      const amPmData = [
          data[i0.ɵLocaleDataIndex.DayPeriodsFormat],
          data[i0.ɵLocaleDataIndex.DayPeriodsStandalone],
      ];
      const amPm = getLastDefinedValue(amPmData, formStyle);
      return getLastDefinedValue(amPm, width);
  }
  /**
   * Retrieves days of the week for the given locale, using the Gregorian calendar.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param formStyle The required grammatical form.
   * @param width The required character width.
   * @returns An array of localized name strings.
   * For example,`[Sunday, Monday, ... Saturday]` for `en-US`.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleDayNames(locale, formStyle, width) {
      const data = i0.ɵfindLocaleData(locale);
      const daysData = [
          data[i0.ɵLocaleDataIndex.DaysFormat],
          data[i0.ɵLocaleDataIndex.DaysStandalone],
      ];
      const days = getLastDefinedValue(daysData, formStyle);
      return getLastDefinedValue(days, width);
  }
  /**
   * Retrieves months of the year for the given locale, using the Gregorian calendar.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param formStyle The required grammatical form.
   * @param width The required character width.
   * @returns An array of localized name strings.
   * For example,  `[January, February, ...]` for `en-US`.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleMonthNames(locale, formStyle, width) {
      const data = i0.ɵfindLocaleData(locale);
      const monthsData = [
          data[i0.ɵLocaleDataIndex.MonthsFormat],
          data[i0.ɵLocaleDataIndex.MonthsStandalone],
      ];
      const months = getLastDefinedValue(monthsData, formStyle);
      return getLastDefinedValue(months, width);
  }
  /**
   * Retrieves Gregorian-calendar eras for the given locale.
   * @param locale A locale code for the locale format rules to use.
   * @param width The required character width.

   * @returns An array of localized era strings.
   * For example, `[AD, BC]` for `en-US`.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleEraNames(locale, width) {
      const data = i0.ɵfindLocaleData(locale);
      const erasData = data[i0.ɵLocaleDataIndex.Eras];
      return getLastDefinedValue(erasData, width);
  }
  /**
   * Retrieves the first day of the week for the given locale.
   *
   * @param locale A locale code for the locale format rules to use.
   * @returns A day index number, using the 0-based week-day index for `en-US`
   * (Sunday = 0, Monday = 1, ...).
   * For example, for `fr-FR`, returns 1 to indicate that the first day is Monday.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleFirstDayOfWeek(locale) {
      const data = i0.ɵfindLocaleData(locale);
      return data[i0.ɵLocaleDataIndex.FirstDayOfWeek];
  }
  /**
   * Range of week days that are considered the week-end for the given locale.
   *
   * @param locale A locale code for the locale format rules to use.
   * @returns The range of day values, `[startDay, endDay]`.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleWeekEndRange(locale) {
      const data = i0.ɵfindLocaleData(locale);
      return data[i0.ɵLocaleDataIndex.WeekendRange];
  }
  /**
   * Retrieves a localized date-value formatting string.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param width The format type.
   * @returns The localized formatting string.
   * @see {@link FormatWidth}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleDateFormat(locale, width) {
      const data = i0.ɵfindLocaleData(locale);
      return getLastDefinedValue(data[i0.ɵLocaleDataIndex.DateFormat], width);
  }
  /**
   * Retrieves a localized time-value formatting string.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param width The format type.
   * @returns The localized formatting string.
   * @see {@link FormatWidth}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)

   * @publicApi
   */
  function getLocaleTimeFormat(locale, width) {
      const data = i0.ɵfindLocaleData(locale);
      return getLastDefinedValue(data[i0.ɵLocaleDataIndex.TimeFormat], width);
  }
  /**
   * Retrieves a localized date-time formatting string.
   *
   * @param locale A locale code for the locale format rules to use.
   * @param width The format type.
   * @returns The localized formatting string.
   * @see {@link FormatWidth}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleDateTimeFormat(locale, width) {
      const data = i0.ɵfindLocaleData(locale);
      const dateTimeFormatData = data[i0.ɵLocaleDataIndex.DateTimeFormat];
      return getLastDefinedValue(dateTimeFormatData, width);
  }
  /**
   * Retrieves a localized number symbol that can be used to replace placeholders in number formats.
   * @param locale The locale code.
   * @param symbol The symbol to localize. Must be one of `NumberSymbol`.
   * @returns The character for the localized symbol.
   * @see {@link NumberSymbol}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleNumberSymbol(locale, symbol) {
      const data = i0.ɵfindLocaleData(locale);
      const res = data[i0.ɵLocaleDataIndex.NumberSymbols][symbol];
      if (typeof res === 'undefined') {
          if (symbol === NumberSymbol.CurrencyDecimal) {
              return data[i0.ɵLocaleDataIndex.NumberSymbols][NumberSymbol.Decimal];
          }
          else if (symbol === NumberSymbol.CurrencyGroup) {
              return data[i0.ɵLocaleDataIndex.NumberSymbols][NumberSymbol.Group];
          }
      }
      return res;
  }
  /**
   * Retrieves a number format for a given locale.
   *
   * Numbers are formatted using patterns, like `#,###.00`. For example, the pattern `#,###.00`
   * when used to format the number 12345.678 could result in "12'345,678". That would happen if the
   * grouping separator for your language is an apostrophe, and the decimal separator is a comma.
   *
   * <b>Important:</b> The characters `.` `,` `0` `#` (and others below) are special placeholders
   * that stand for the decimal separator, and so on, and are NOT real characters.
   * You must NOT "translate" the placeholders. For example, don't change `.` to `,` even though in
   * your language the decimal point is written with a comma. The symbols should be replaced by the
   * local equivalents, using the appropriate `NumberSymbol` for your language.
   *
   * Here are the special characters used in number patterns:
   *
   * | Symbol | Meaning |
   * |--------|---------|
   * | . | Replaced automatically by the character used for the decimal point. |
   * | , | Replaced by the "grouping" (thousands) separator. |
   * | 0 | Replaced by a digit (or zero if there aren't enough digits). |
   * | # | Replaced by a digit (or nothing if there aren't enough). |
   * | ¤ | Replaced by a currency symbol, such as $ or USD. |
   * | % | Marks a percent format. The % symbol may change position, but must be retained. |
   * | E | Marks a scientific format. The E symbol may change position, but must be retained. |
   * | ' | Special characters used as literal characters are quoted with ASCII single quotes. |
   *
   * @param locale A locale code for the locale format rules to use.
   * @param type The type of numeric value to be formatted (such as `Decimal` or `Currency`.)
   * @returns The localized format string.
   * @see {@link NumberFormatStyle}
   * @see [CLDR website](http://cldr.unicode.org/translation/number-patterns)
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleNumberFormat(locale, type) {
      const data = i0.ɵfindLocaleData(locale);
      return data[i0.ɵLocaleDataIndex.NumberFormats][type];
  }
  /**
   * Retrieves the symbol used to represent the currency for the main country
   * corresponding to a given locale. For example, '$' for `en-US`.
   *
   * @param locale A locale code for the locale format rules to use.
   * @returns The localized symbol character,
   * or `null` if the main country cannot be determined.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleCurrencySymbol(locale) {
      const data = i0.ɵfindLocaleData(locale);
      return data[i0.ɵLocaleDataIndex.CurrencySymbol] || null;
  }
  /**
   * Retrieves the name of the currency for the main country corresponding
   * to a given locale. For example, 'US Dollar' for `en-US`.
   * @param locale A locale code for the locale format rules to use.
   * @returns The currency name,
   * or `null` if the main country cannot be determined.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleCurrencyName(locale) {
      const data = i0.ɵfindLocaleData(locale);
      return data[i0.ɵLocaleDataIndex.CurrencyName] || null;
  }
  /**
   * Retrieves the default currency code for the given locale.
   *
   * The default is defined as the first currency which is still in use.
   *
   * @param locale The code of the locale whose currency code we want.
   * @returns The code of the default currency for the given locale.
   *
   * @publicApi
   */
  function getLocaleCurrencyCode(locale) {
      return i0.ɵgetLocaleCurrencyCode(locale);
  }
  /**
   * Retrieves the currency values for a given locale.
   * @param locale A locale code for the locale format rules to use.
   * @returns The currency values.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   */
  function getLocaleCurrencies(locale) {
      const data = i0.ɵfindLocaleData(locale);
      return data[i0.ɵLocaleDataIndex.Currencies];
  }
  /**
   * @alias core/ɵgetLocalePluralCase
   * @publicApi
   */
  const getLocalePluralCase = i0.ɵgetLocalePluralCase;
  function checkFullData(data) {
      if (!data[i0.ɵLocaleDataIndex.ExtraData]) {
          throw new Error(`Missing extra locale data for the locale "${data[i0.ɵLocaleDataIndex.LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`);
      }
  }
  /**
   * Retrieves locale-specific rules used to determine which day period to use
   * when more than one period is defined for a locale.
   *
   * There is a rule for each defined day period. The
   * first rule is applied to the first day period and so on.
   * Fall back to AM/PM when no rules are available.
   *
   * A rule can specify a period as time range, or as a single time value.
   *
   * This functionality is only available when you have loaded the full locale data.
   * See the ["I18n guide"](guide/i18n-common-format-data-locale).
   *
   * @param locale A locale code for the locale format rules to use.
   * @returns The rules for the locale, a single time value or array of *from-time, to-time*,
   * or null if no periods are available.
   *
   * @see {@link getLocaleExtraDayPeriods}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleExtraDayPeriodRules(locale) {
      const data = i0.ɵfindLocaleData(locale);
      checkFullData(data);
      const rules = data[i0.ɵLocaleDataIndex.ExtraData][2 /* ɵExtraLocaleDataIndex.ExtraDayPeriodsRules */] || [];
      return rules.map((rule) => {
          if (typeof rule === 'string') {
              return extractTime(rule);
          }
          return [extractTime(rule[0]), extractTime(rule[1])];
      });
  }
  /**
   * Retrieves locale-specific day periods, which indicate roughly how a day is broken up
   * in different languages.
   * For example, for `en-US`, periods are morning, noon, afternoon, evening, and midnight.
   *
   * This functionality is only available when you have loaded the full locale data.
   * See the ["I18n guide"](guide/i18n-common-format-data-locale).
   *
   * @param locale A locale code for the locale format rules to use.
   * @param formStyle The required grammatical form.
   * @param width The required character width.
   * @returns The translated day-period strings.
   * @see {@link getLocaleExtraDayPeriodRules}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLocaleExtraDayPeriods(locale, formStyle, width) {
      const data = i0.ɵfindLocaleData(locale);
      checkFullData(data);
      const dayPeriodsData = [
          data[i0.ɵLocaleDataIndex.ExtraData][0 /* ɵExtraLocaleDataIndex.ExtraDayPeriodFormats */],
          data[i0.ɵLocaleDataIndex.ExtraData][1 /* ɵExtraLocaleDataIndex.ExtraDayPeriodStandalone */],
      ];
      const dayPeriods = getLastDefinedValue(dayPeriodsData, formStyle) || [];
      return getLastDefinedValue(dayPeriods, width) || [];
  }
  /**
   * Retrieves the writing direction of a specified locale
   * @param locale A locale code for the locale format rules to use.
   * @publicApi
   * @returns 'rtl' or 'ltr'
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   */
  function getLocaleDirection(locale) {
      const data = i0.ɵfindLocaleData(locale);
      return data[i0.ɵLocaleDataIndex.Directionality];
  }
  /**
   * Retrieves the first value that is defined in an array, going backwards from an index position.
   *
   * To avoid repeating the same data (as when the "format" and "standalone" forms are the same)
   * add the first value to the locale data arrays, and add other values only if they are different.
   *
   * @param data The data array to retrieve from.
   * @param index A 0-based index into the array to start from.
   * @returns The value immediately before the given index position.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getLastDefinedValue(data, index) {
      for (let i = index; i > -1; i--) {
          if (typeof data[i] !== 'undefined') {
              return data[i];
          }
      }
      throw new Error('Locale data API: locale data undefined');
  }
  /**
   * Extracts the hours and minutes from a string like "15:45"
   */
  function extractTime(time) {
      const [h, m] = time.split(':');
      return { hours: +h, minutes: +m };
  }
  /**
   * Retrieves the currency symbol for a given currency code.
   *
   * For example, for the default `en-US` locale, the code `USD` can
   * be represented by the narrow symbol `$` or the wide symbol `US$`.
   *
   * @param code The currency code.
   * @param format The format, `wide` or `narrow`.
   * @param locale A locale code for the locale format rules to use.
   *
   * @returns The symbol, or the currency code if no symbol is available.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getCurrencySymbol(code, format, locale = 'en') {
      const currency = getLocaleCurrencies(locale)[code] || CURRENCIES_EN[code] || [];
      const symbolNarrow = currency[1 /* ɵCurrencyIndex.SymbolNarrow */];
      if (format === 'narrow' && typeof symbolNarrow === 'string') {
          return symbolNarrow;
      }
      return currency[0 /* ɵCurrencyIndex.Symbol */] || code;
  }
  // Most currencies have cents, that's why the default is 2
  const DEFAULT_NB_OF_CURRENCY_DIGITS = 2;
  /**
   * Reports the number of decimal digits for a given currency.
   * The value depends upon the presence of cents in that particular currency.
   *
   * @param code The currency code.
   * @returns The number of decimal digits, typically 0 or 2.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function getNumberOfCurrencyDigits(code) {
      let digits;
      const currency = CURRENCIES_EN[code];
      if (currency) {
          digits = currency[2 /* ɵCurrencyIndex.NbOfDigits */];
      }
      return typeof digits === 'number' ? digits : DEFAULT_NB_OF_CURRENCY_DIGITS;
  }

  const ISO8601_DATE_REGEX = /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
  //    1        2       3         4          5          6          7          8  9     10      11
  const NAMED_FORMATS = {};
  const DATE_FORMATS_SPLIT = /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
  var ZoneWidth;
  (function (ZoneWidth) {
      ZoneWidth[ZoneWidth["Short"] = 0] = "Short";
      ZoneWidth[ZoneWidth["ShortGMT"] = 1] = "ShortGMT";
      ZoneWidth[ZoneWidth["Long"] = 2] = "Long";
      ZoneWidth[ZoneWidth["Extended"] = 3] = "Extended";
  })(ZoneWidth || (ZoneWidth = {}));
  var DateType;
  (function (DateType) {
      DateType[DateType["FullYear"] = 0] = "FullYear";
      DateType[DateType["Month"] = 1] = "Month";
      DateType[DateType["Date"] = 2] = "Date";
      DateType[DateType["Hours"] = 3] = "Hours";
      DateType[DateType["Minutes"] = 4] = "Minutes";
      DateType[DateType["Seconds"] = 5] = "Seconds";
      DateType[DateType["FractionalSeconds"] = 6] = "FractionalSeconds";
      DateType[DateType["Day"] = 7] = "Day";
  })(DateType || (DateType = {}));
  var TranslationType;
  (function (TranslationType) {
      TranslationType[TranslationType["DayPeriods"] = 0] = "DayPeriods";
      TranslationType[TranslationType["Days"] = 1] = "Days";
      TranslationType[TranslationType["Months"] = 2] = "Months";
      TranslationType[TranslationType["Eras"] = 3] = "Eras";
  })(TranslationType || (TranslationType = {}));
  /**
   * @ngModule CommonModule
   * @description
   *
   * Formats a date according to locale rules.
   *
   * @param value The date to format, as a Date, or a number (milliseconds since UTC epoch)
   * or an [ISO date-time string](https://www.w3.org/TR/NOTE-datetime).
   * @param format The date-time components to include. See `DatePipe` for details.
   * @param locale A locale code for the locale format rules to use.
   * @param timezone The time zone. A time zone offset from GMT (such as `'+0430'`),
   * or a standard UTC/GMT or continental US time zone abbreviation.
   * If not specified, uses host system settings.
   *
   * @returns The formatted date string.
   *
   * @see {@link DatePipe}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function formatDate(value, format, locale, timezone) {
      let date = toDate(value);
      const namedFormat = getNamedFormat(locale, format);
      format = namedFormat || format;
      let parts = [];
      let match;
      while (format) {
          match = DATE_FORMATS_SPLIT.exec(format);
          if (match) {
              parts = parts.concat(match.slice(1));
              const part = parts.pop();
              if (!part) {
                  break;
              }
              format = part;
          }
          else {
              parts.push(format);
              break;
          }
      }
      let dateTimezoneOffset = date.getTimezoneOffset();
      if (timezone) {
          dateTimezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
          date = convertTimezoneToLocal(date, timezone, true);
      }
      let text = '';
      parts.forEach((value) => {
          const dateFormatter = getDateFormatter(value);
          text += dateFormatter
              ? dateFormatter(date, locale, dateTimezoneOffset)
              : value === "''"
                  ? "'"
                  : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
      });
      return text;
  }
  /**
   * Create a new Date object with the given date value, and the time set to midnight.
   *
   * We cannot use `new Date(year, month, date)` because it maps years between 0 and 99 to 1900-1999.
   * See: https://github.com/angular/angular/issues/40377
   *
   * Note that this function returns a Date object whose time is midnight in the current locale's
   * timezone. In the future we might want to change this to be midnight in UTC, but this would be a
   * considerable breaking change.
   */
  function createDate(year, month, date) {
      // The `newDate` is set to midnight (UTC) on January 1st 1970.
      // - In PST this will be December 31st 1969 at 4pm.
      // - In GMT this will be January 1st 1970 at 1am.
      // Note that they even have different years, dates and months!
      const newDate = new Date(0);
      // `setFullYear()` allows years like 0001 to be set correctly. This function does not
      // change the internal time of the date.
      // Consider calling `setFullYear(2019, 8, 20)` (September 20, 2019).
      // - In PST this will now be September 20, 2019 at 4pm
      // - In GMT this will now be September 20, 2019 at 1am
      newDate.setFullYear(year, month, date);
      // We want the final date to be at local midnight, so we reset the time.
      // - In PST this will now be September 20, 2019 at 12am
      // - In GMT this will now be September 20, 2019 at 12am
      newDate.setHours(0, 0, 0);
      return newDate;
  }
  function getNamedFormat(locale, format) {
      const localeId = getLocaleId(locale);
      NAMED_FORMATS[localeId] ??= {};
      if (NAMED_FORMATS[localeId][format]) {
          return NAMED_FORMATS[localeId][format];
      }
      let formatValue = '';
      switch (format) {
          case 'shortDate':
              formatValue = getLocaleDateFormat(locale, exports.FormatWidth.Short);
              break;
          case 'mediumDate':
              formatValue = getLocaleDateFormat(locale, exports.FormatWidth.Medium);
              break;
          case 'longDate':
              formatValue = getLocaleDateFormat(locale, exports.FormatWidth.Long);
              break;
          case 'fullDate':
              formatValue = getLocaleDateFormat(locale, exports.FormatWidth.Full);
              break;
          case 'shortTime':
              formatValue = getLocaleTimeFormat(locale, exports.FormatWidth.Short);
              break;
          case 'mediumTime':
              formatValue = getLocaleTimeFormat(locale, exports.FormatWidth.Medium);
              break;
          case 'longTime':
              formatValue = getLocaleTimeFormat(locale, exports.FormatWidth.Long);
              break;
          case 'fullTime':
              formatValue = getLocaleTimeFormat(locale, exports.FormatWidth.Full);
              break;
          case 'short':
              const shortTime = getNamedFormat(locale, 'shortTime');
              const shortDate = getNamedFormat(locale, 'shortDate');
              formatValue = formatDateTime(getLocaleDateTimeFormat(locale, exports.FormatWidth.Short), [
                  shortTime,
                  shortDate,
              ]);
              break;
          case 'medium':
              const mediumTime = getNamedFormat(locale, 'mediumTime');
              const mediumDate = getNamedFormat(locale, 'mediumDate');
              formatValue = formatDateTime(getLocaleDateTimeFormat(locale, exports.FormatWidth.Medium), [
                  mediumTime,
                  mediumDate,
              ]);
              break;
          case 'long':
              const longTime = getNamedFormat(locale, 'longTime');
              const longDate = getNamedFormat(locale, 'longDate');
              formatValue = formatDateTime(getLocaleDateTimeFormat(locale, exports.FormatWidth.Long), [
                  longTime,
                  longDate,
              ]);
              break;
          case 'full':
              const fullTime = getNamedFormat(locale, 'fullTime');
              const fullDate = getNamedFormat(locale, 'fullDate');
              formatValue = formatDateTime(getLocaleDateTimeFormat(locale, exports.FormatWidth.Full), [
                  fullTime,
                  fullDate,
              ]);
              break;
      }
      if (formatValue) {
          NAMED_FORMATS[localeId][format] = formatValue;
      }
      return formatValue;
  }
  function formatDateTime(str, opt_values) {
      if (opt_values) {
          str = str.replace(/\{([^}]+)}/g, function (match, key) {
              return opt_values != null && key in opt_values ? opt_values[key] : match;
          });
      }
      return str;
  }
  function padNumber(num, digits, minusSign = '-', trim, negWrap) {
      let neg = '';
      if (num < 0 || (negWrap && num <= 0)) {
          if (negWrap) {
              num = -num + 1;
          }
          else {
              num = -num;
              neg = minusSign;
          }
      }
      let strNum = String(num);
      while (strNum.length < digits) {
          strNum = '0' + strNum;
      }
      if (trim) {
          strNum = strNum.slice(strNum.length - digits);
      }
      return neg + strNum;
  }
  function formatFractionalSeconds(milliseconds, digits) {
      const strMs = padNumber(milliseconds, 3);
      return strMs.substring(0, digits);
  }
  /**
   * Returns a date formatter that transforms a date into its locale digit representation
   */
  function dateGetter(name, size, offset = 0, trim = false, negWrap = false) {
      return function (date, locale) {
          let part = getDatePart(name, date);
          if (offset > 0 || part > -offset) {
              part += offset;
          }
          if (name === DateType.Hours) {
              if (part === 0 && offset === -12) {
                  part = 12;
              }
          }
          else if (name === DateType.FractionalSeconds) {
              return formatFractionalSeconds(part, size);
          }
          const localeMinus = getLocaleNumberSymbol(locale, NumberSymbol.MinusSign);
          return padNumber(part, size, localeMinus, trim, negWrap);
      };
  }
  function getDatePart(part, date) {
      switch (part) {
          case DateType.FullYear:
              return date.getFullYear();
          case DateType.Month:
              return date.getMonth();
          case DateType.Date:
              return date.getDate();
          case DateType.Hours:
              return date.getHours();
          case DateType.Minutes:
              return date.getMinutes();
          case DateType.Seconds:
              return date.getSeconds();
          case DateType.FractionalSeconds:
              return date.getMilliseconds();
          case DateType.Day:
              return date.getDay();
          default:
              throw new Error(`Unknown DateType value "${part}".`);
      }
  }
  /**
   * Returns a date formatter that transforms a date into its locale string representation
   */
  function dateStrGetter(name, width, form = exports.FormStyle.Format, extended = false) {
      return function (date, locale) {
          return getDateTranslation(date, locale, name, width, form, extended);
      };
  }
  /**
   * Returns the locale translation of a date for a given form, type and width
   */
  function getDateTranslation(date, locale, name, width, form, extended) {
      switch (name) {
          case TranslationType.Months:
              return getLocaleMonthNames(locale, form, width)[date.getMonth()];
          case TranslationType.Days:
              return getLocaleDayNames(locale, form, width)[date.getDay()];
          case TranslationType.DayPeriods:
              const currentHours = date.getHours();
              const currentMinutes = date.getMinutes();
              if (extended) {
                  const rules = getLocaleExtraDayPeriodRules(locale);
                  const dayPeriods = getLocaleExtraDayPeriods(locale, form, width);
                  const index = rules.findIndex((rule) => {
                      if (Array.isArray(rule)) {
                          // morning, afternoon, evening, night
                          const [from, to] = rule;
                          const afterFrom = currentHours >= from.hours && currentMinutes >= from.minutes;
                          const beforeTo = currentHours < to.hours || (currentHours === to.hours && currentMinutes < to.minutes);
                          // We must account for normal rules that span a period during the day (e.g. 6am-9am)
                          // where `from` is less (earlier) than `to`. But also rules that span midnight (e.g.
                          // 10pm - 5am) where `from` is greater (later!) than `to`.
                          //
                          // In the first case the current time must be BOTH after `from` AND before `to`
                          // (e.g. 8am is after 6am AND before 10am).
                          //
                          // In the second case the current time must be EITHER after `from` OR before `to`
                          // (e.g. 4am is before 5am but not after 10pm; and 11pm is not before 5am but it is
                          // after 10pm).
                          if (from.hours < to.hours) {
                              if (afterFrom && beforeTo) {
                                  return true;
                              }
                          }
                          else if (afterFrom || beforeTo) {
                              return true;
                          }
                      }
                      else {
                          // noon or midnight
                          if (rule.hours === currentHours && rule.minutes === currentMinutes) {
                              return true;
                          }
                      }
                      return false;
                  });
                  if (index !== -1) {
                      return dayPeriods[index];
                  }
              }
              // if no rules for the day periods, we use am/pm by default
              return getLocaleDayPeriods(locale, form, width)[currentHours < 12 ? 0 : 1];
          case TranslationType.Eras:
              return getLocaleEraNames(locale, width)[date.getFullYear() <= 0 ? 0 : 1];
          default:
              // This default case is not needed by TypeScript compiler, as the switch is exhaustive.
              // However Closure Compiler does not understand that and reports an error in typed mode.
              // The `throw new Error` below works around the problem, and the unexpected: never variable
              // makes sure tsc still checks this code is unreachable.
              const unexpected = name;
              throw new Error(`unexpected translation type ${unexpected}`);
      }
  }
  /**
   * Returns a date formatter that transforms a date and an offset into a timezone with ISO8601 or
   * GMT format depending on the width (eg: short = +0430, short:GMT = GMT+4, long = GMT+04:30,
   * extended = +04:30)
   */
  function timeZoneGetter(width) {
      return function (date, locale, offset) {
          const zone = -1 * offset;
          const minusSign = getLocaleNumberSymbol(locale, NumberSymbol.MinusSign);
          const hours = zone > 0 ? Math.floor(zone / 60) : Math.ceil(zone / 60);
          switch (width) {
              case ZoneWidth.Short:
                  return ((zone >= 0 ? '+' : '') +
                      padNumber(hours, 2, minusSign) +
                      padNumber(Math.abs(zone % 60), 2, minusSign));
              case ZoneWidth.ShortGMT:
                  return 'GMT' + (zone >= 0 ? '+' : '') + padNumber(hours, 1, minusSign);
              case ZoneWidth.Long:
                  return ('GMT' +
                      (zone >= 0 ? '+' : '') +
                      padNumber(hours, 2, minusSign) +
                      ':' +
                      padNumber(Math.abs(zone % 60), 2, minusSign));
              case ZoneWidth.Extended:
                  if (offset === 0) {
                      return 'Z';
                  }
                  else {
                      return ((zone >= 0 ? '+' : '') +
                          padNumber(hours, 2, minusSign) +
                          ':' +
                          padNumber(Math.abs(zone % 60), 2, minusSign));
                  }
              default:
                  throw new Error(`Unknown zone width "${width}"`);
          }
      };
  }
  const JANUARY = 0;
  const THURSDAY = 4;
  function getFirstThursdayOfYear(year) {
      const firstDayOfYear = createDate(year, JANUARY, 1).getDay();
      return createDate(year, 0, 1 + (firstDayOfYear <= THURSDAY ? THURSDAY : THURSDAY + 7) - firstDayOfYear);
  }
  /**
   *  ISO Week starts on day 1 (Monday) and ends with day 0 (Sunday)
   */
  function getThursdayThisIsoWeek(datetime) {
      // getDay returns 0-6 range with sunday as 0.
      const currentDay = datetime.getDay();
      // On a Sunday, read the previous Thursday since ISO weeks start on Monday.
      const deltaToThursday = currentDay === 0 ? -3 : THURSDAY - currentDay;
      return createDate(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + deltaToThursday);
  }
  function weekGetter(size, monthBased = false) {
      return function (date, locale) {
          let result;
          if (monthBased) {
              const nbDaysBefore1stDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
              const today = date.getDate();
              result = 1 + Math.floor((today + nbDaysBefore1stDayOfMonth) / 7);
          }
          else {
              const thisThurs = getThursdayThisIsoWeek(date);
              // Some days of a year are part of next year according to ISO 8601.
              // Compute the firstThurs from the year of this week's Thursday
              const firstThurs = getFirstThursdayOfYear(thisThurs.getFullYear());
              const diff = thisThurs.getTime() - firstThurs.getTime();
              result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week
          }
          return padNumber(result, size, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
      };
  }
  /**
   * Returns a date formatter that provides the week-numbering year for the input date.
   */
  function weekNumberingYearGetter(size, trim = false) {
      return function (date, locale) {
          const thisThurs = getThursdayThisIsoWeek(date);
          const weekNumberingYear = thisThurs.getFullYear();
          return padNumber(weekNumberingYear, size, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign), trim);
      };
  }
  const DATE_FORMATS = {};
  // Based on CLDR formats:
  // See complete list: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
  // See also explanations: http://cldr.unicode.org/translation/date-time
  // TODO(ocombe): support all missing cldr formats: U, Q, D, F, e, j, J, C, A, v, V, X, x
  function getDateFormatter(format) {
      if (DATE_FORMATS[format]) {
          return DATE_FORMATS[format];
      }
      let formatter;
      switch (format) {
          // Era name (AD/BC)
          case 'G':
          case 'GG':
          case 'GGG':
              formatter = dateStrGetter(TranslationType.Eras, exports.TranslationWidth.Abbreviated);
              break;
          case 'GGGG':
              formatter = dateStrGetter(TranslationType.Eras, exports.TranslationWidth.Wide);
              break;
          case 'GGGGG':
              formatter = dateStrGetter(TranslationType.Eras, exports.TranslationWidth.Narrow);
              break;
          // 1 digit representation of the year, e.g. (AD 1 => 1, AD 199 => 199)
          case 'y':
              formatter = dateGetter(DateType.FullYear, 1, 0, false, true);
              break;
          // 2 digit representation of the year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
          case 'yy':
              formatter = dateGetter(DateType.FullYear, 2, 0, true, true);
              break;
          // 3 digit representation of the year, padded (000-999). (e.g. AD 2001 => 01, AD 2010 => 10)
          case 'yyy':
              formatter = dateGetter(DateType.FullYear, 3, 0, false, true);
              break;
          // 4 digit representation of the year (e.g. AD 1 => 0001, AD 2010 => 2010)
          case 'yyyy':
              formatter = dateGetter(DateType.FullYear, 4, 0, false, true);
              break;
          // 1 digit representation of the week-numbering year, e.g. (AD 1 => 1, AD 199 => 199)
          case 'Y':
              formatter = weekNumberingYearGetter(1);
              break;
          // 2 digit representation of the week-numbering year, padded (00-99). (e.g. AD 2001 => 01, AD
          // 2010 => 10)
          case 'YY':
              formatter = weekNumberingYearGetter(2, true);
              break;
          // 3 digit representation of the week-numbering year, padded (000-999). (e.g. AD 1 => 001, AD
          // 2010 => 2010)
          case 'YYY':
              formatter = weekNumberingYearGetter(3);
              break;
          // 4 digit representation of the week-numbering year (e.g. AD 1 => 0001, AD 2010 => 2010)
          case 'YYYY':
              formatter = weekNumberingYearGetter(4);
              break;
          // Month of the year (1-12), numeric
          case 'M':
          case 'L':
              formatter = dateGetter(DateType.Month, 1, 1);
              break;
          case 'MM':
          case 'LL':
              formatter = dateGetter(DateType.Month, 2, 1);
              break;
          // Month of the year (January, ...), string, format
          case 'MMM':
              formatter = dateStrGetter(TranslationType.Months, exports.TranslationWidth.Abbreviated);
              break;
          case 'MMMM':
              formatter = dateStrGetter(TranslationType.Months, exports.TranslationWidth.Wide);
              break;
          case 'MMMMM':
              formatter = dateStrGetter(TranslationType.Months, exports.TranslationWidth.Narrow);
              break;
          // Month of the year (January, ...), string, standalone
          case 'LLL':
              formatter = dateStrGetter(TranslationType.Months, exports.TranslationWidth.Abbreviated, exports.FormStyle.Standalone);
              break;
          case 'LLLL':
              formatter = dateStrGetter(TranslationType.Months, exports.TranslationWidth.Wide, exports.FormStyle.Standalone);
              break;
          case 'LLLLL':
              formatter = dateStrGetter(TranslationType.Months, exports.TranslationWidth.Narrow, exports.FormStyle.Standalone);
              break;
          // Week of the year (1, ... 52)
          case 'w':
              formatter = weekGetter(1);
              break;
          case 'ww':
              formatter = weekGetter(2);
              break;
          // Week of the month (1, ...)
          case 'W':
              formatter = weekGetter(1, true);
              break;
          // Day of the month (1-31)
          case 'd':
              formatter = dateGetter(DateType.Date, 1);
              break;
          case 'dd':
              formatter = dateGetter(DateType.Date, 2);
              break;
          // Day of the Week StandAlone (1, 1, Mon, Monday, M, Mo)
          case 'c':
          case 'cc':
              formatter = dateGetter(DateType.Day, 1);
              break;
          case 'ccc':
              formatter = dateStrGetter(TranslationType.Days, exports.TranslationWidth.Abbreviated, exports.FormStyle.Standalone);
              break;
          case 'cccc':
              formatter = dateStrGetter(TranslationType.Days, exports.TranslationWidth.Wide, exports.FormStyle.Standalone);
              break;
          case 'ccccc':
              formatter = dateStrGetter(TranslationType.Days, exports.TranslationWidth.Narrow, exports.FormStyle.Standalone);
              break;
          case 'cccccc':
              formatter = dateStrGetter(TranslationType.Days, exports.TranslationWidth.Short, exports.FormStyle.Standalone);
              break;
          // Day of the Week
          case 'E':
          case 'EE':
          case 'EEE':
              formatter = dateStrGetter(TranslationType.Days, exports.TranslationWidth.Abbreviated);
              break;
          case 'EEEE':
              formatter = dateStrGetter(TranslationType.Days, exports.TranslationWidth.Wide);
              break;
          case 'EEEEE':
              formatter = dateStrGetter(TranslationType.Days, exports.TranslationWidth.Narrow);
              break;
          case 'EEEEEE':
              formatter = dateStrGetter(TranslationType.Days, exports.TranslationWidth.Short);
              break;
          // Generic period of the day (am-pm)
          case 'a':
          case 'aa':
          case 'aaa':
              formatter = dateStrGetter(TranslationType.DayPeriods, exports.TranslationWidth.Abbreviated);
              break;
          case 'aaaa':
              formatter = dateStrGetter(TranslationType.DayPeriods, exports.TranslationWidth.Wide);
              break;
          case 'aaaaa':
              formatter = dateStrGetter(TranslationType.DayPeriods, exports.TranslationWidth.Narrow);
              break;
          // Extended period of the day (midnight, at night, ...), standalone
          case 'b':
          case 'bb':
          case 'bbb':
              formatter = dateStrGetter(TranslationType.DayPeriods, exports.TranslationWidth.Abbreviated, exports.FormStyle.Standalone, true);
              break;
          case 'bbbb':
              formatter = dateStrGetter(TranslationType.DayPeriods, exports.TranslationWidth.Wide, exports.FormStyle.Standalone, true);
              break;
          case 'bbbbb':
              formatter = dateStrGetter(TranslationType.DayPeriods, exports.TranslationWidth.Narrow, exports.FormStyle.Standalone, true);
              break;
          // Extended period of the day (midnight, night, ...), standalone
          case 'B':
          case 'BB':
          case 'BBB':
              formatter = dateStrGetter(TranslationType.DayPeriods, exports.TranslationWidth.Abbreviated, exports.FormStyle.Format, true);
              break;
          case 'BBBB':
              formatter = dateStrGetter(TranslationType.DayPeriods, exports.TranslationWidth.Wide, exports.FormStyle.Format, true);
              break;
          case 'BBBBB':
              formatter = dateStrGetter(TranslationType.DayPeriods, exports.TranslationWidth.Narrow, exports.FormStyle.Format, true);
              break;
          // Hour in AM/PM, (1-12)
          case 'h':
              formatter = dateGetter(DateType.Hours, 1, -12);
              break;
          case 'hh':
              formatter = dateGetter(DateType.Hours, 2, -12);
              break;
          // Hour of the day (0-23)
          case 'H':
              formatter = dateGetter(DateType.Hours, 1);
              break;
          // Hour in day, padded (00-23)
          case 'HH':
              formatter = dateGetter(DateType.Hours, 2);
              break;
          // Minute of the hour (0-59)
          case 'm':
              formatter = dateGetter(DateType.Minutes, 1);
              break;
          case 'mm':
              formatter = dateGetter(DateType.Minutes, 2);
              break;
          // Second of the minute (0-59)
          case 's':
              formatter = dateGetter(DateType.Seconds, 1);
              break;
          case 'ss':
              formatter = dateGetter(DateType.Seconds, 2);
              break;
          // Fractional second
          case 'S':
              formatter = dateGetter(DateType.FractionalSeconds, 1);
              break;
          case 'SS':
              formatter = dateGetter(DateType.FractionalSeconds, 2);
              break;
          case 'SSS':
              formatter = dateGetter(DateType.FractionalSeconds, 3);
              break;
          // Timezone ISO8601 short format (-0430)
          case 'Z':
          case 'ZZ':
          case 'ZZZ':
              formatter = timeZoneGetter(ZoneWidth.Short);
              break;
          // Timezone ISO8601 extended format (-04:30)
          case 'ZZZZZ':
              formatter = timeZoneGetter(ZoneWidth.Extended);
              break;
          // Timezone GMT short format (GMT+4)
          case 'O':
          case 'OO':
          case 'OOO':
          // Should be location, but fallback to format O instead because we don't have the data yet
          case 'z':
          case 'zz':
          case 'zzz':
              formatter = timeZoneGetter(ZoneWidth.ShortGMT);
              break;
          // Timezone GMT long format (GMT+0430)
          case 'OOOO':
          case 'ZZZZ':
          // Should be location, but fallback to format O instead because we don't have the data yet
          case 'zzzz':
              formatter = timeZoneGetter(ZoneWidth.Long);
              break;
          default:
              return null;
      }
      DATE_FORMATS[format] = formatter;
      return formatter;
  }
  function timezoneToOffset(timezone, fallback) {
      // Support: IE 11 only, Edge 13-15+
      // IE/Edge do not "understand" colon (`:`) in timezone
      timezone = timezone.replace(/:/g, '');
      const requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
      return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
  }
  function addDateMinutes(date, minutes) {
      date = new Date(date.getTime());
      date.setMinutes(date.getMinutes() + minutes);
      return date;
  }
  function convertTimezoneToLocal(date, timezone, reverse) {
      const reverseValue = reverse ? -1 : 1;
      const dateTimezoneOffset = date.getTimezoneOffset();
      const timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
      return addDateMinutes(date, reverseValue * (timezoneOffset - dateTimezoneOffset));
  }
  /**
   * Converts a value to date.
   *
   * Supported input formats:
   * - `Date`
   * - number: timestamp
   * - string: numeric (e.g. "1234"), ISO and date strings in a format supported by
   *   [Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
   *   Note: ISO strings without time return a date without timeoffset.
   *
   * Throws if unable to convert to a date.
   */
  function toDate(value) {
      if (isDate(value)) {
          return value;
      }
      if (typeof value === 'number' && !isNaN(value)) {
          return new Date(value);
      }
      if (typeof value === 'string') {
          value = value.trim();
          if (/^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(value)) {
              /* For ISO Strings without time the day, month and year must be extracted from the ISO String
              before Date creation to avoid time offset and errors in the new Date.
              If we only replace '-' with ',' in the ISO String ("2015,01,01"), and try to create a new
              date, some browsers (e.g. IE 9) will throw an invalid Date error.
              If we leave the '-' ("2015-01-01") and try to create a new Date("2015-01-01") the timeoffset
              is applied.
              Note: ISO months are 0 for January, 1 for February, ... */
              const [y, m = 1, d = 1] = value.split('-').map((val) => +val);
              return createDate(y, m - 1, d);
          }
          const parsedNb = parseFloat(value);
          // any string that only contains numbers, like "1234" but not like "1234hello"
          if (!isNaN(value - parsedNb)) {
              return new Date(parsedNb);
          }
          let match;
          if ((match = value.match(ISO8601_DATE_REGEX))) {
              return isoStringToDate(match);
          }
      }
      const date = new Date(value);
      if (!isDate(date)) {
          throw new Error(`Unable to convert "${value}" into a date`);
      }
      return date;
  }
  /**
   * Converts a date in ISO8601 to a Date.
   * Used instead of `Date.parse` because of browser discrepancies.
   */
  function isoStringToDate(match) {
      const date = new Date(0);
      let tzHour = 0;
      let tzMin = 0;
      // match[8] means that the string contains "Z" (UTC) or a timezone like "+01:00" or "+0100"
      const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
      const timeSetter = match[8] ? date.setUTCHours : date.setHours;
      // if there is a timezone defined like "+01:00" or "+0100"
      if (match[9]) {
          tzHour = Number(match[9] + match[10]);
          tzMin = Number(match[9] + match[11]);
      }
      dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
      const h = Number(match[4] || 0) - tzHour;
      const m = Number(match[5] || 0) - tzMin;
      const s = Number(match[6] || 0);
      // The ECMAScript specification (https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.11)
      // defines that `DateTime` milliseconds should always be rounded down, so that `999.9ms`
      // becomes `999ms`.
      const ms = Math.floor(parseFloat('0.' + (match[7] || 0)) * 1000);
      timeSetter.call(date, h, m, s, ms);
      return date;
  }
  function isDate(value) {
      return value instanceof Date && !isNaN(value.valueOf());
  }

  const NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
  const MAX_DIGITS = 22;
  const DECIMAL_SEP = '.';
  const ZERO_CHAR = '0';
  const PATTERN_SEP = ';';
  const GROUP_SEP = ',';
  const DIGIT_CHAR = '#';
  const CURRENCY_CHAR = '¤';
  const PERCENT_CHAR = '%';
  /**
   * Transforms a number to a locale string based on a style and a format.
   */
  function formatNumberToLocaleString(value, pattern, locale, groupSymbol, decimalSymbol, digitsInfo, isPercent = false) {
      let formattedText = '';
      let isZero = false;
      if (!isFinite(value)) {
          formattedText = getLocaleNumberSymbol(locale, NumberSymbol.Infinity);
      }
      else {
          let parsedNumber = parseNumber(value);
          if (isPercent) {
              parsedNumber = toPercent(parsedNumber);
          }
          let minInt = pattern.minInt;
          let minFraction = pattern.minFrac;
          let maxFraction = pattern.maxFrac;
          if (digitsInfo) {
              const parts = digitsInfo.match(NUMBER_FORMAT_REGEXP);
              if (parts === null) {
                  throw new Error(`${digitsInfo} is not a valid digit info`);
              }
              const minIntPart = parts[1];
              const minFractionPart = parts[3];
              const maxFractionPart = parts[5];
              if (minIntPart != null) {
                  minInt = parseIntAutoRadix(minIntPart);
              }
              if (minFractionPart != null) {
                  minFraction = parseIntAutoRadix(minFractionPart);
              }
              if (maxFractionPart != null) {
                  maxFraction = parseIntAutoRadix(maxFractionPart);
              }
              else if (minFractionPart != null && minFraction > maxFraction) {
                  maxFraction = minFraction;
              }
          }
          roundNumber(parsedNumber, minFraction, maxFraction);
          let digits = parsedNumber.digits;
          let integerLen = parsedNumber.integerLen;
          const exponent = parsedNumber.exponent;
          let decimals = [];
          isZero = digits.every((d) => !d);
          // pad zeros for small numbers
          for (; integerLen < minInt; integerLen++) {
              digits.unshift(0);
          }
          // pad zeros for small numbers
          for (; integerLen < 0; integerLen++) {
              digits.unshift(0);
          }
          // extract decimals digits
          if (integerLen > 0) {
              decimals = digits.splice(integerLen, digits.length);
          }
          else {
              decimals = digits;
              digits = [0];
          }
          // format the integer digits with grouping separators
          const groups = [];
          if (digits.length >= pattern.lgSize) {
              groups.unshift(digits.splice(-pattern.lgSize, digits.length).join(''));
          }
          while (digits.length > pattern.gSize) {
              groups.unshift(digits.splice(-pattern.gSize, digits.length).join(''));
          }
          if (digits.length) {
              groups.unshift(digits.join(''));
          }
          formattedText = groups.join(getLocaleNumberSymbol(locale, groupSymbol));
          // append the decimal digits
          if (decimals.length) {
              formattedText += getLocaleNumberSymbol(locale, decimalSymbol) + decimals.join('');
          }
          if (exponent) {
              formattedText += getLocaleNumberSymbol(locale, NumberSymbol.Exponential) + '+' + exponent;
          }
      }
      if (value < 0 && !isZero) {
          formattedText = pattern.negPre + formattedText + pattern.negSuf;
      }
      else {
          formattedText = pattern.posPre + formattedText + pattern.posSuf;
      }
      return formattedText;
  }
  /**
   * @ngModule CommonModule
   * @description
   *
   * Formats a number as currency using locale rules.
   *
   * @param value The number to format.
   * @param locale A locale code for the locale format rules to use.
   * @param currency A string containing the currency symbol or its name,
   * such as "$" or "Canadian Dollar". Used in output string, but does not affect the operation
   * of the function.
   * @param currencyCode The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)
   * currency code, such as `USD` for the US dollar and `EUR` for the euro.
   * Used to determine the number of digits in the decimal part.
   * @param digitsInfo Decimal representation options, specified by a string in the following format:
   * `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`. See `DecimalPipe` for more details.
   *
   * @returns The formatted currency value.
   *
   * @see {@link formatNumber}
   * @see {@link DecimalPipe}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function formatCurrency(value, locale, currency, currencyCode, digitsInfo) {
      const format = getLocaleNumberFormat(locale, exports.NumberFormatStyle.Currency);
      const pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
      pattern.minFrac = getNumberOfCurrencyDigits(currencyCode);
      pattern.maxFrac = pattern.minFrac;
      const res = formatNumberToLocaleString(value, pattern, locale, NumberSymbol.CurrencyGroup, NumberSymbol.CurrencyDecimal, digitsInfo);
      return (res
          .replace(CURRENCY_CHAR, currency)
          // if we have 2 time the currency character, the second one is ignored
          .replace(CURRENCY_CHAR, '')
          // If there is a spacing between currency character and the value and
          // the currency character is suppressed by passing an empty string, the
          // spacing character would remain as part of the string. Then we
          // should remove it.
          .trim());
  }
  /**
   * @ngModule CommonModule
   * @description
   *
   * Formats a number as a percentage according to locale rules.
   *
   * @param value The number to format.
   * @param locale A locale code for the locale format rules to use.
   * @param digitsInfo Decimal representation options, specified by a string in the following format:
   * `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`. See `DecimalPipe` for more details.
   *
   * @returns The formatted percentage value.
   *
   * @see {@link formatNumber}
   * @see {@link DecimalPipe}
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   * @publicApi
   *
   */
  function formatPercent(value, locale, digitsInfo) {
      const format = getLocaleNumberFormat(locale, exports.NumberFormatStyle.Percent);
      const pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
      const res = formatNumberToLocaleString(value, pattern, locale, NumberSymbol.Group, NumberSymbol.Decimal, digitsInfo, true);
      return res.replace(new RegExp(PERCENT_CHAR, 'g'), getLocaleNumberSymbol(locale, NumberSymbol.PercentSign));
  }
  /**
   * @ngModule CommonModule
   * @description
   *
   * Formats a number as text, with group sizing, separator, and other
   * parameters based on the locale.
   *
   * @param value The number to format.
   * @param locale A locale code for the locale format rules to use.
   * @param digitsInfo Decimal representation options, specified by a string in the following format:
   * `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`. See `DecimalPipe` for more details.
   *
   * @returns The formatted text string.
   * @see [Internationalization (i18n) Guide](/guide/i18n-overview)
   *
   * @publicApi
   */
  function formatNumber(value, locale, digitsInfo) {
      const format = getLocaleNumberFormat(locale, exports.NumberFormatStyle.Decimal);
      const pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
      return formatNumberToLocaleString(value, pattern, locale, NumberSymbol.Group, NumberSymbol.Decimal, digitsInfo);
  }
  function parseNumberFormat(format, minusSign = '-') {
      const p = {
          minInt: 1,
          minFrac: 0,
          maxFrac: 0,
          posPre: '',
          posSuf: '',
          negPre: '',
          negSuf: '',
          gSize: 0,
          lgSize: 0,
      };
      const patternParts = format.split(PATTERN_SEP);
      const positive = patternParts[0];
      const negative = patternParts[1];
      const positiveParts = positive.indexOf(DECIMAL_SEP) !== -1
          ? positive.split(DECIMAL_SEP)
          : [
              positive.substring(0, positive.lastIndexOf(ZERO_CHAR) + 1),
              positive.substring(positive.lastIndexOf(ZERO_CHAR) + 1),
          ], integer = positiveParts[0], fraction = positiveParts[1] || '';
      p.posPre = integer.substring(0, integer.indexOf(DIGIT_CHAR));
      for (let i = 0; i < fraction.length; i++) {
          const ch = fraction.charAt(i);
          if (ch === ZERO_CHAR) {
              p.minFrac = p.maxFrac = i + 1;
          }
          else if (ch === DIGIT_CHAR) {
              p.maxFrac = i + 1;
          }
          else {
              p.posSuf += ch;
          }
      }
      const groups = integer.split(GROUP_SEP);
      p.gSize = groups[1] ? groups[1].length : 0;
      p.lgSize = groups[2] || groups[1] ? (groups[2] || groups[1]).length : 0;
      if (negative) {
          const trunkLen = positive.length - p.posPre.length - p.posSuf.length, pos = negative.indexOf(DIGIT_CHAR);
          p.negPre = negative.substring(0, pos).replace(/'/g, '');
          p.negSuf = negative.slice(pos + trunkLen).replace(/'/g, '');
      }
      else {
          p.negPre = minusSign + p.posPre;
          p.negSuf = p.posSuf;
      }
      return p;
  }
  // Transforms a parsed number into a percentage by multiplying it by 100
  function toPercent(parsedNumber) {
      // if the number is 0, don't do anything
      if (parsedNumber.digits[0] === 0) {
          return parsedNumber;
      }
      // Getting the current number of decimals
      const fractionLen = parsedNumber.digits.length - parsedNumber.integerLen;
      if (parsedNumber.exponent) {
          parsedNumber.exponent += 2;
      }
      else {
          if (fractionLen === 0) {
              parsedNumber.digits.push(0, 0);
          }
          else if (fractionLen === 1) {
              parsedNumber.digits.push(0);
          }
          parsedNumber.integerLen += 2;
      }
      return parsedNumber;
  }
  /**
   * Parses a number.
   * Significant bits of this parse algorithm came from https://github.com/MikeMcl/big.js/
   */
  function parseNumber(num) {
      let numStr = Math.abs(num) + '';
      let exponent = 0, digits, integerLen;
      let i, j, zeros;
      // Decimal point?
      if ((integerLen = numStr.indexOf(DECIMAL_SEP)) > -1) {
          numStr = numStr.replace(DECIMAL_SEP, '');
      }
      // Exponential form?
      if ((i = numStr.search(/e/i)) > 0) {
          // Work out the exponent.
          if (integerLen < 0)
              integerLen = i;
          integerLen += +numStr.slice(i + 1);
          numStr = numStr.substring(0, i);
      }
      else if (integerLen < 0) {
          // There was no decimal point or exponent so it is an integer.
          integerLen = numStr.length;
      }
      // Count the number of leading zeros.
      for (i = 0; numStr.charAt(i) === ZERO_CHAR; i++) {
          /* empty */
      }
      if (i === (zeros = numStr.length)) {
          // The digits are all zero.
          digits = [0];
          integerLen = 1;
      }
      else {
          // Count the number of trailing zeros
          zeros--;
          while (numStr.charAt(zeros) === ZERO_CHAR)
              zeros--;
          // Trailing zeros are insignificant so ignore them
          integerLen -= i;
          digits = [];
          // Convert string to array of digits without leading/trailing zeros.
          for (j = 0; i <= zeros; i++, j++) {
              digits[j] = Number(numStr.charAt(i));
          }
      }
      // If the number overflows the maximum allowed digits then use an exponent.
      if (integerLen > MAX_DIGITS) {
          digits = digits.splice(0, MAX_DIGITS - 1);
          exponent = integerLen - 1;
          integerLen = 1;
      }
      return { digits, exponent, integerLen };
  }
  /**
   * Round the parsed number to the specified number of decimal places
   * This function changes the parsedNumber in-place
   */
  function roundNumber(parsedNumber, minFrac, maxFrac) {
      if (minFrac > maxFrac) {
          throw new Error(`The minimum number of digits after fraction (${minFrac}) is higher than the maximum (${maxFrac}).`);
      }
      let digits = parsedNumber.digits;
      let fractionLen = digits.length - parsedNumber.integerLen;
      const fractionSize = Math.min(Math.max(minFrac, fractionLen), maxFrac);
      // The index of the digit to where rounding is to occur
      let roundAt = fractionSize + parsedNumber.integerLen;
      let digit = digits[roundAt];
      if (roundAt > 0) {
          // Drop fractional digits beyond `roundAt`
          digits.splice(Math.max(parsedNumber.integerLen, roundAt));
          // Set non-fractional digits beyond `roundAt` to 0
          for (let j = roundAt; j < digits.length; j++) {
              digits[j] = 0;
          }
      }
      else {
          // We rounded to zero so reset the parsedNumber
          fractionLen = Math.max(0, fractionLen);
          parsedNumber.integerLen = 1;
          digits.length = Math.max(1, (roundAt = fractionSize + 1));
          digits[0] = 0;
          for (let i = 1; i < roundAt; i++)
              digits[i] = 0;
      }
      if (digit >= 5) {
          if (roundAt - 1 < 0) {
              for (let k = 0; k > roundAt; k--) {
                  digits.unshift(0);
                  parsedNumber.integerLen++;
              }
              digits.unshift(1);
              parsedNumber.integerLen++;
          }
          else {
              digits[roundAt - 1]++;
          }
      }
      // Pad out with zeros to get the required fraction length
      for (; fractionLen < Math.max(0, fractionSize); fractionLen++)
          digits.push(0);
      let dropTrailingZeros = fractionSize !== 0;
      // Minimal length = nb of decimals required + current nb of integers
      // Any number besides that is optional and can be removed if it's a trailing 0
      const minLen = minFrac + parsedNumber.integerLen;
      // Do any carrying, e.g. a digit was rounded up to 10
      const carry = digits.reduceRight(function (carry, d, i, digits) {
          d = d + carry;
          digits[i] = d < 10 ? d : d - 10; // d % 10
          if (dropTrailingZeros) {
              // Do not keep meaningless fractional trailing zeros (e.g. 15.52000 --> 15.52)
              if (digits[i] === 0 && i >= minLen) {
                  digits.pop();
              }
              else {
                  dropTrailingZeros = false;
              }
          }
          return d >= 10 ? 1 : 0; // Math.floor(d / 10);
      }, 0);
      if (carry) {
          digits.unshift(carry);
          parsedNumber.integerLen++;
      }
  }
  function parseIntAutoRadix(text) {
      const result = parseInt(text);
      if (isNaN(result)) {
          throw new Error('Invalid integer literal when parsing ' + text);
      }
      return result;
  }

  /**
   * @publicApi
   */
  class NgLocalization {
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgLocalization, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgLocalization, providedIn: 'root', useFactory: (locale) => new NgLocaleLocalization(locale), deps: [{ token: i0.LOCALE_ID }] }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgLocalization, decorators: [{
              type: i0.Injectable,
              args: [{
                      providedIn: 'root',
                      useFactory: (locale) => new NgLocaleLocalization(locale),
                      deps: [i0.LOCALE_ID],
                  }]
          }] });
  /**
   * Returns the plural category for a given value.
   * - "=value" when the case exists,
   * - the plural category otherwise
   */
  function getPluralCategory(value, cases, ngLocalization, locale) {
      let key = `=${value}`;
      if (cases.indexOf(key) > -1) {
          return key;
      }
      key = ngLocalization.getPluralCategory(value, locale);
      if (cases.indexOf(key) > -1) {
          return key;
      }
      if (cases.indexOf('other') > -1) {
          return 'other';
      }
      throw new Error(`No plural message found for value "${value}"`);
  }
  /**
   * Returns the plural case based on the locale
   *
   * @publicApi
   */
  class NgLocaleLocalization extends NgLocalization {
      constructor(locale) {
          super();
          this.locale = locale;
      }
      getPluralCategory(value, locale) {
          const plural = getLocalePluralCase(locale || this.locale)(value);
          switch (plural) {
              case exports.Plural.Zero:
                  return 'zero';
              case exports.Plural.One:
                  return 'one';
              case exports.Plural.Two:
                  return 'two';
              case exports.Plural.Few:
                  return 'few';
              case exports.Plural.Many:
                  return 'many';
              default:
                  return 'other';
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgLocaleLocalization, deps: [{ token: i0.LOCALE_ID }], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgLocaleLocalization }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgLocaleLocalization, decorators: [{
              type: i0.Injectable
          }], ctorParameters: () => [{ type: undefined, decorators: [{
                      type: i0.Inject,
                      args: [i0.LOCALE_ID]
                  }] }] });

  /**
   * Register global data to be used internally by Angular. See the
   * ["I18n guide"](guide/i18n-common-format-data-locale) to know how to import additional locale
   * data.
   *
   * The signature registerLocaleData(data: any, extraData?: any) is deprecated since v5.1
   *
   * @publicApi
   */
  function registerLocaleData(data, localeId, extraData) {
      return i0.ɵregisterLocaleData(data, localeId, extraData);
  }

  function parseCookieValue(cookieStr, name) {
      name = encodeURIComponent(name);
      for (const cookie of cookieStr.split(';')) {
          const eqIndex = cookie.indexOf('=');
          const [cookieName, cookieValue] = eqIndex == -1 ? [cookie, ''] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)];
          if (cookieName.trim() === name) {
              return decodeURIComponent(cookieValue);
          }
      }
      return null;
  }

  const WS_REGEXP = /\s+/;
  const EMPTY_ARRAY = [];
  /**
   * @ngModule CommonModule
   *
   * @usageNotes
   * ```
   *     <some-element [ngClass]="'first second'">...</some-element>
   *
   *     <some-element [ngClass]="['first', 'second']">...</some-element>
   *
   *     <some-element [ngClass]="{'first': true, 'second': true, 'third': false}">...</some-element>
   *
   *     <some-element [ngClass]="stringExp|arrayExp|objExp">...</some-element>
   *
   *     <some-element [ngClass]="{'class1 class2 class3' : true}">...</some-element>
   * ```
   *
   * @description
   *
   * Adds and removes CSS classes on an HTML element.
   *
   * The CSS classes are updated as follows, depending on the type of the expression evaluation:
   * - `string` - the CSS classes listed in the string (space delimited) are added,
   * - `Array` - the CSS classes declared as Array elements are added,
   * - `Object` - keys are CSS classes that get added when the expression given in the value
   *              evaluates to a truthy value, otherwise they are removed.
   *
   * @publicApi
   */
  class NgClass {
      constructor(_ngEl, _renderer) {
          this._ngEl = _ngEl;
          this._renderer = _renderer;
          this.initialClasses = EMPTY_ARRAY;
          this.stateMap = new Map();
      }
      set klass(value) {
          this.initialClasses = value != null ? value.trim().split(WS_REGEXP) : EMPTY_ARRAY;
      }
      set ngClass(value) {
          this.rawClass = typeof value === 'string' ? value.trim().split(WS_REGEXP) : value;
      }
      /*
      The NgClass directive uses the custom change detection algorithm for its inputs. The custom
      algorithm is necessary since inputs are represented as complex object or arrays that need to be
      deeply-compared.
    
      This algorithm is perf-sensitive since NgClass is used very frequently and its poor performance
      might negatively impact runtime performance of the entire change detection cycle. The design of
      this algorithm is making sure that:
      - there is no unnecessary DOM manipulation (CSS classes are added / removed from the DOM only when
      needed), even if references to bound objects change;
      - there is no memory allocation if nothing changes (even relatively modest memory allocation
      during the change detection cycle can result in GC pauses for some of the CD cycles).
    
      The algorithm works by iterating over the set of bound classes, staring with [class] binding and
      then going over [ngClass] binding. For each CSS class name:
      - check if it was seen before (this information is tracked in the state map) and if its value
      changed;
      - mark it as "touched" - names that are not marked are not present in the latest set of binding
      and we can remove such class name from the internal data structures;
    
      After iteration over all the CSS class names we've got data structure with all the information
      necessary to synchronize changes to the DOM - it is enough to iterate over the state map, flush
      changes to the DOM and reset internal data structures so those are ready for the next change
      detection cycle.
       */
      ngDoCheck() {
          // classes from the [class] binding
          for (const klass of this.initialClasses) {
              this._updateState(klass, true);
          }
          // classes from the [ngClass] binding
          const rawClass = this.rawClass;
          if (Array.isArray(rawClass) || rawClass instanceof Set) {
              for (const klass of rawClass) {
                  this._updateState(klass, true);
              }
          }
          else if (rawClass != null) {
              for (const klass of Object.keys(rawClass)) {
                  this._updateState(klass, Boolean(rawClass[klass]));
              }
          }
          this._applyStateDiff();
      }
      _updateState(klass, nextEnabled) {
          const state = this.stateMap.get(klass);
          if (state !== undefined) {
              if (state.enabled !== nextEnabled) {
                  state.changed = true;
                  state.enabled = nextEnabled;
              }
              state.touched = true;
          }
          else {
              this.stateMap.set(klass, { enabled: nextEnabled, changed: true, touched: true });
          }
      }
      _applyStateDiff() {
          for (const stateEntry of this.stateMap) {
              const klass = stateEntry[0];
              const state = stateEntry[1];
              if (state.changed) {
                  this._toggleClass(klass, state.enabled);
                  state.changed = false;
              }
              else if (!state.touched) {
                  // A class that was previously active got removed from the new collection of classes -
                  // remove from the DOM as well.
                  if (state.enabled) {
                      this._toggleClass(klass, false);
                  }
                  this.stateMap.delete(klass);
              }
              state.touched = false;
          }
      }
      _toggleClass(klass, enabled) {
          if (ngDevMode) {
              if (typeof klass !== 'string') {
                  throw new Error(`NgClass can only toggle CSS classes expressed as strings, got ${i0.ɵstringify(klass)}`);
              }
          }
          klass = klass.trim();
          if (klass.length > 0) {
              klass.split(WS_REGEXP).forEach((klass) => {
                  if (enabled) {
                      this._renderer.addClass(this._ngEl.nativeElement, klass);
                  }
                  else {
                      this._renderer.removeClass(this._ngEl.nativeElement, klass);
                  }
              });
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgClass, deps: [{ token: i0__namespace.ElementRef }, { token: i0__namespace.Renderer2 }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgClass, isStandalone: true, selector: "[ngClass]", inputs: { klass: ["class", "klass"], ngClass: "ngClass" }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgClass, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngClass]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.ElementRef }, { type: i0__namespace.Renderer2 }], propDecorators: { klass: [{
                  type: i0.Input,
                  args: ['class']
              }], ngClass: [{
                  type: i0.Input,
                  args: ['ngClass']
              }] } });

  /**
   * Instantiates a {@link Component} type and inserts its Host View into the current View.
   * `NgComponentOutlet` provides a declarative approach for dynamic component creation.
   *
   * `NgComponentOutlet` requires a component type, if a falsy value is set the view will clear and
   * any existing component will be destroyed.
   *
   * @usageNotes
   *
   * ### Fine tune control
   *
   * You can control the component creation process by using the following optional attributes:
   *
   * * `ngComponentOutletInputs`: Optional component inputs object, which will be bind to the
   * component.
   *
   * * `ngComponentOutletInjector`: Optional custom {@link Injector} that will be used as parent for
   * the Component. Defaults to the injector of the current view container.
   *
   * * `ngComponentOutletContent`: Optional list of projectable nodes to insert into the content
   * section of the component, if it exists.
   *
   * * `ngComponentOutletNgModule`: Optional NgModule class reference to allow loading another
   * module dynamically, then loading a component from that module.
   *
   * * `ngComponentOutletNgModuleFactory`: Deprecated config option that allows providing optional
   * NgModule factory to allow loading another module dynamically, then loading a component from that
   * module. Use `ngComponentOutletNgModule` instead.
   *
   * ### Syntax
   *
   * Simple
   * ```
   * <ng-container *ngComponentOutlet="componentTypeExpression"></ng-container>
   * ```
   *
   * With inputs
   * ```
   * <ng-container *ngComponentOutlet="componentTypeExpression;
   *                                   inputs: inputsExpression;">
   * </ng-container>
   * ```
   *
   * Customized injector/content
   * ```
   * <ng-container *ngComponentOutlet="componentTypeExpression;
   *                                   injector: injectorExpression;
   *                                   content: contentNodesExpression;">
   * </ng-container>
   * ```
   *
   * Customized NgModule reference
   * ```
   * <ng-container *ngComponentOutlet="componentTypeExpression;
   *                                   ngModule: ngModuleClass;">
   * </ng-container>
   * ```
   *
   * ### A simple example
   *
   * {@example common/ngComponentOutlet/ts/module.ts region='SimpleExample'}
   *
   * A more complete example with additional options:
   *
   * {@example common/ngComponentOutlet/ts/module.ts region='CompleteExample'}
   *
   * @publicApi
   * @ngModule CommonModule
   */
  class NgComponentOutlet {
      constructor(_viewContainerRef) {
          this._viewContainerRef = _viewContainerRef;
          this.ngComponentOutlet = null;
          /**
           * A helper data structure that allows us to track inputs that were part of the
           * ngComponentOutletInputs expression. Tracking inputs is necessary for proper removal of ones
           * that are no longer referenced.
           */
          this._inputsUsed = new Map();
      }
      _needToReCreateNgModuleInstance(changes) {
          // Note: square brackets property accessor is safe for Closure compiler optimizations (the
          // `changes` argument of the `ngOnChanges` lifecycle hook retains the names of the fields that
          // were changed).
          return (changes['ngComponentOutletNgModule'] !== undefined ||
              changes['ngComponentOutletNgModuleFactory'] !== undefined);
      }
      _needToReCreateComponentInstance(changes) {
          // Note: square brackets property accessor is safe for Closure compiler optimizations (the
          // `changes` argument of the `ngOnChanges` lifecycle hook retains the names of the fields that
          // were changed).
          return (changes['ngComponentOutlet'] !== undefined ||
              changes['ngComponentOutletContent'] !== undefined ||
              changes['ngComponentOutletInjector'] !== undefined ||
              this._needToReCreateNgModuleInstance(changes));
      }
      /** @nodoc */
      ngOnChanges(changes) {
          if (this._needToReCreateComponentInstance(changes)) {
              this._viewContainerRef.clear();
              this._inputsUsed.clear();
              this._componentRef = undefined;
              if (this.ngComponentOutlet) {
                  const injector = this.ngComponentOutletInjector || this._viewContainerRef.parentInjector;
                  if (this._needToReCreateNgModuleInstance(changes)) {
                      this._moduleRef?.destroy();
                      if (this.ngComponentOutletNgModule) {
                          this._moduleRef = i0.createNgModule(this.ngComponentOutletNgModule, getParentInjector(injector));
                      }
                      else if (this.ngComponentOutletNgModuleFactory) {
                          this._moduleRef = this.ngComponentOutletNgModuleFactory.create(getParentInjector(injector));
                      }
                      else {
                          this._moduleRef = undefined;
                      }
                  }
                  this._componentRef = this._viewContainerRef.createComponent(this.ngComponentOutlet, {
                      injector,
                      ngModuleRef: this._moduleRef,
                      projectableNodes: this.ngComponentOutletContent,
                  });
              }
          }
      }
      /** @nodoc */
      ngDoCheck() {
          if (this._componentRef) {
              if (this.ngComponentOutletInputs) {
                  for (const inputName of Object.keys(this.ngComponentOutletInputs)) {
                      this._inputsUsed.set(inputName, true);
                  }
              }
              this._applyInputStateDiff(this._componentRef);
          }
      }
      /** @nodoc */
      ngOnDestroy() {
          this._moduleRef?.destroy();
      }
      _applyInputStateDiff(componentRef) {
          for (const [inputName, touched] of this._inputsUsed) {
              if (!touched) {
                  // The input that was previously active no longer exists and needs to be set to undefined.
                  componentRef.setInput(inputName, undefined);
                  this._inputsUsed.delete(inputName);
              }
              else {
                  // Since touched is true, it can be asserted that the inputs object is not empty.
                  componentRef.setInput(inputName, this.ngComponentOutletInputs[inputName]);
                  this._inputsUsed.set(inputName, false);
              }
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgComponentOutlet, deps: [{ token: i0__namespace.ViewContainerRef }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgComponentOutlet, isStandalone: true, selector: "[ngComponentOutlet]", inputs: { ngComponentOutlet: "ngComponentOutlet", ngComponentOutletInputs: "ngComponentOutletInputs", ngComponentOutletInjector: "ngComponentOutletInjector", ngComponentOutletContent: "ngComponentOutletContent", ngComponentOutletNgModule: "ngComponentOutletNgModule", ngComponentOutletNgModuleFactory: "ngComponentOutletNgModuleFactory" }, usesOnChanges: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgComponentOutlet, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngComponentOutlet]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.ViewContainerRef }], propDecorators: { ngComponentOutlet: [{
                  type: i0.Input
              }], ngComponentOutletInputs: [{
                  type: i0.Input
              }], ngComponentOutletInjector: [{
                  type: i0.Input
              }], ngComponentOutletContent: [{
                  type: i0.Input
              }], ngComponentOutletNgModule: [{
                  type: i0.Input
              }], ngComponentOutletNgModuleFactory: [{
                  type: i0.Input
              }] } });
  // Helper function that returns an Injector instance of a parent NgModule.
  function getParentInjector(injector) {
      const parentNgModule = injector.get(i0.NgModuleRef);
      return parentNgModule.injector;
  }

  /**
   * @publicApi
   */
  class NgForOfContext {
      constructor($implicit, ngForOf, index, count) {
          this.$implicit = $implicit;
          this.ngForOf = ngForOf;
          this.index = index;
          this.count = count;
      }
      get first() {
          return this.index === 0;
      }
      get last() {
          return this.index === this.count - 1;
      }
      get even() {
          return this.index % 2 === 0;
      }
      get odd() {
          return !this.even;
      }
  }
  /**
   * A [structural directive](guide/structural-directives) that renders
   * a template for each item in a collection.
   * The directive is placed on an element, which becomes the parent
   * of the cloned templates.
   *
   * The `ngForOf` directive is generally used in the
   * [shorthand form](guide/structural-directives#asterisk) `*ngFor`.
   * In this form, the template to be rendered for each iteration is the content
   * of an anchor element containing the directive.
   *
   * The following example shows the shorthand syntax with some options,
   * contained in an `<li>` element.
   *
   * ```
   * <li *ngFor="let item of items; index as i; trackBy: trackByFn">...</li>
   * ```
   *
   * The shorthand form expands into a long form that uses the `ngForOf` selector
   * on an `<ng-template>` element.
   * The content of the `<ng-template>` element is the `<li>` element that held the
   * short-form directive.
   *
   * Here is the expanded version of the short-form example.
   *
   * ```
   * <ng-template ngFor let-item [ngForOf]="items" let-i="index" [ngForTrackBy]="trackByFn">
   *   <li>...</li>
   * </ng-template>
   * ```
   *
   * Angular automatically expands the shorthand syntax as it compiles the template.
   * The context for each embedded view is logically merged to the current component
   * context according to its lexical position.
   *
   * When using the shorthand syntax, Angular allows only [one structural directive
   * on an element](guide/structural-directives#one-per-element).
   * If you want to iterate conditionally, for example,
   * put the `*ngIf` on a container element that wraps the `*ngFor` element.
   * For further discussion, see
   * [Structural Directives](guide/structural-directives#one-per-element).
   *
   * @usageNotes
   *
   * ### Local variables
   *
   * `NgForOf` provides exported values that can be aliased to local variables.
   * For example:
   *
   *  ```
   * <li *ngFor="let user of users; index as i; first as isFirst">
   *    {{i}}/{{users.length}}. {{user}} <span *ngIf="isFirst">default</span>
   * </li>
   * ```
   *
   * The following exported values can be aliased to local variables:
   *
   * - `$implicit: T`: The value of the individual items in the iterable (`ngForOf`).
   * - `ngForOf: NgIterable<T>`: The value of the iterable expression. Useful when the expression is
   * more complex then a property access, for example when using the async pipe (`userStreams |
   * async`).
   * - `index: number`: The index of the current item in the iterable.
   * - `count: number`: The length of the iterable.
   * - `first: boolean`: True when the item is the first item in the iterable.
   * - `last: boolean`: True when the item is the last item in the iterable.
   * - `even: boolean`: True when the item has an even index in the iterable.
   * - `odd: boolean`: True when the item has an odd index in the iterable.
   *
   * ### Change propagation
   *
   * When the contents of the iterator changes, `NgForOf` makes the corresponding changes to the DOM:
   *
   * * When an item is added, a new instance of the template is added to the DOM.
   * * When an item is removed, its template instance is removed from the DOM.
   * * When items are reordered, their respective templates are reordered in the DOM.
   *
   * Angular uses object identity to track insertions and deletions within the iterator and reproduce
   * those changes in the DOM. This has important implications for animations and any stateful
   * controls that are present, such as `<input>` elements that accept user input. Inserted rows can
   * be animated in, deleted rows can be animated out, and unchanged rows retain any unsaved state
   * such as user input.
   * For more on animations, see [Transitions and Triggers](guide/transition-and-triggers).
   *
   * The identities of elements in the iterator can change while the data does not.
   * This can happen, for example, if the iterator is produced from an RPC to the server, and that
   * RPC is re-run. Even if the data hasn't changed, the second response produces objects with
   * different identities, and Angular must tear down the entire DOM and rebuild it (as if all old
   * elements were deleted and all new elements inserted).
   *
   * To avoid this expensive operation, you can customize the default tracking algorithm.
   * by supplying the `trackBy` option to `NgForOf`.
   * `trackBy` takes a function that has two arguments: `index` and `item`.
   * If `trackBy` is given, Angular tracks changes by the return value of the function.
   *
   * @see [Structural Directives](guide/structural-directives)
   * @ngModule CommonModule
   * @publicApi
   */
  class NgForOf {
      /**
       * The value of the iterable expression, which can be used as a
       * [template input variable](guide/structural-directives#shorthand).
       */
      set ngForOf(ngForOf) {
          this._ngForOf = ngForOf;
          this._ngForOfDirty = true;
      }
      /**
       * Specifies a custom `TrackByFunction` to compute the identity of items in an iterable.
       *
       * If a custom `TrackByFunction` is not provided, `NgForOf` will use the item's [object
       * identity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
       * as the key.
       *
       * `NgForOf` uses the computed key to associate items in an iterable with DOM elements
       * it produces for these items.
       *
       * A custom `TrackByFunction` is useful to provide good user experience in cases when items in an
       * iterable rendered using `NgForOf` have a natural identifier (for example, custom ID or a
       * primary key), and this iterable could be updated with new object instances that still
       * represent the same underlying entity (for example, when data is re-fetched from the server,
       * and the iterable is recreated and re-rendered, but most of the data is still the same).
       *
       * @see {@link TrackByFunction}
       */
      set ngForTrackBy(fn) {
          if ((typeof ngDevMode === 'undefined' || ngDevMode) && fn != null && typeof fn !== 'function') {
              console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
                  `See https://angular.io/api/common/NgForOf#change-propagation for more information.`);
          }
          this._trackByFn = fn;
      }
      get ngForTrackBy() {
          return this._trackByFn;
      }
      constructor(_viewContainer, _template, _differs) {
          this._viewContainer = _viewContainer;
          this._template = _template;
          this._differs = _differs;
          this._ngForOf = null;
          this._ngForOfDirty = true;
          this._differ = null;
      }
      /**
       * A reference to the template that is stamped out for each item in the iterable.
       * @see [template reference variable](guide/template-reference-variables)
       */
      set ngForTemplate(value) {
          // TODO(TS2.1): make TemplateRef<Partial<NgForRowOf<T>>> once we move to TS v2.1
          // The current type is too restrictive; a template that just uses index, for example,
          // should be acceptable.
          if (value) {
              this._template = value;
          }
      }
      /**
       * Applies the changes when needed.
       * @nodoc
       */
      ngDoCheck() {
          if (this._ngForOfDirty) {
              this._ngForOfDirty = false;
              // React on ngForOf changes only once all inputs have been initialized
              const value = this._ngForOf;
              if (!this._differ && value) {
                  if (typeof ngDevMode === 'undefined' || ngDevMode) {
                      try {
                          // CAUTION: this logic is duplicated for production mode below, as the try-catch
                          // is only present in development builds.
                          this._differ = this._differs.find(value).create(this.ngForTrackBy);
                      }
                      catch {
                          let errorMessage = `Cannot find a differ supporting object '${value}' of type '` +
                              `${getTypeName(value)}'. NgFor only supports binding to Iterables, such as Arrays.`;
                          if (typeof value === 'object') {
                              errorMessage += ' Did you mean to use the keyvalue pipe?';
                          }
                          throw new i0.ɵRuntimeError(-2200 /* RuntimeErrorCode.NG_FOR_MISSING_DIFFER */, errorMessage);
                      }
                  }
                  else {
                      // CAUTION: this logic is duplicated for development mode above, as the try-catch
                      // is only present in development builds.
                      this._differ = this._differs.find(value).create(this.ngForTrackBy);
                  }
              }
          }
          if (this._differ) {
              const changes = this._differ.diff(this._ngForOf);
              if (changes)
                  this._applyChanges(changes);
          }
      }
      _applyChanges(changes) {
          const viewContainer = this._viewContainer;
          changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
              if (item.previousIndex == null) {
                  // NgForOf is never "null" or "undefined" here because the differ detected
                  // that a new item needs to be inserted from the iterable. This implies that
                  // there is an iterable value for "_ngForOf".
                  viewContainer.createEmbeddedView(this._template, new NgForOfContext(item.item, this._ngForOf, -1, -1), currentIndex === null ? undefined : currentIndex);
              }
              else if (currentIndex == null) {
                  viewContainer.remove(adjustedPreviousIndex === null ? undefined : adjustedPreviousIndex);
              }
              else if (adjustedPreviousIndex !== null) {
                  const view = viewContainer.get(adjustedPreviousIndex);
                  viewContainer.move(view, currentIndex);
                  applyViewChange(view, item);
              }
          });
          for (let i = 0, ilen = viewContainer.length; i < ilen; i++) {
              const viewRef = viewContainer.get(i);
              const context = viewRef.context;
              context.index = i;
              context.count = ilen;
              context.ngForOf = this._ngForOf;
          }
          changes.forEachIdentityChange((record) => {
              const viewRef = viewContainer.get(record.currentIndex);
              applyViewChange(viewRef, record);
          });
      }
      /**
       * Asserts the correct type of the context for the template that `NgForOf` will render.
       *
       * The presence of this method is a signal to the Ivy template type-check compiler that the
       * `NgForOf` structural directive renders its template with a specific context type.
       */
      static ngTemplateContextGuard(dir, ctx) {
          return true;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgForOf, deps: [{ token: i0__namespace.ViewContainerRef }, { token: i0__namespace.TemplateRef }, { token: i0__namespace.IterableDiffers }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgForOf, isStandalone: true, selector: "[ngFor][ngForOf]", inputs: { ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate" }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgForOf, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngFor][ngForOf]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.ViewContainerRef }, { type: i0__namespace.TemplateRef }, { type: i0__namespace.IterableDiffers }], propDecorators: { ngForOf: [{
                  type: i0.Input
              }], ngForTrackBy: [{
                  type: i0.Input
              }], ngForTemplate: [{
                  type: i0.Input
              }] } });
  function applyViewChange(view, record) {
      view.context.$implicit = record.item;
  }
  function getTypeName(type) {
      return type['name'] || typeof type;
  }

  /**
   * A structural directive that conditionally includes a template based on the value of
   * an expression coerced to Boolean.
   * When the expression evaluates to true, Angular renders the template
   * provided in a `then` clause, and when  false or null,
   * Angular renders the template provided in an optional `else` clause. The default
   * template for the `else` clause is blank.
   *
   * A [shorthand form](guide/structural-directives#asterisk) of the directive,
   * `*ngIf="condition"`, is generally used, provided
   * as an attribute of the anchor element for the inserted template.
   * Angular expands this into a more explicit version, in which the anchor element
   * is contained in an `<ng-template>` element.
   *
   * Simple form with shorthand syntax:
   *
   * ```
   * <div *ngIf="condition">Content to render when condition is true.</div>
   * ```
   *
   * Simple form with expanded syntax:
   *
   * ```
   * <ng-template [ngIf]="condition"><div>Content to render when condition is
   * true.</div></ng-template>
   * ```
   *
   * Form with an "else" block:
   *
   * ```
   * <div *ngIf="condition; else elseBlock">Content to render when condition is true.</div>
   * <ng-template #elseBlock>Content to render when condition is false.</ng-template>
   * ```
   *
   * Shorthand form with "then" and "else" blocks:
   *
   * ```
   * <div *ngIf="condition; then thenBlock else elseBlock"></div>
   * <ng-template #thenBlock>Content to render when condition is true.</ng-template>
   * <ng-template #elseBlock>Content to render when condition is false.</ng-template>
   * ```
   *
   * Form with storing the value locally:
   *
   * ```
   * <div *ngIf="condition as value; else elseBlock">{{value}}</div>
   * <ng-template #elseBlock>Content to render when value is null.</ng-template>
   * ```
   *
   * @usageNotes
   *
   * The `*ngIf` directive is most commonly used to conditionally show an inline template,
   * as seen in the following  example.
   * The default `else` template is blank.
   *
   * {@example common/ngIf/ts/module.ts region='NgIfSimple'}
   *
   * ### Showing an alternative template using `else`
   *
   * To display a template when `expression` evaluates to false, use an `else` template
   * binding as shown in the following example.
   * The `else` binding points to an `<ng-template>`  element labeled `#elseBlock`.
   * The template can be defined anywhere in the component view, but is typically placed right after
   * `ngIf` for readability.
   *
   * {@example common/ngIf/ts/module.ts region='NgIfElse'}
   *
   * ### Using an external `then` template
   *
   * In the previous example, the then-clause template is specified inline, as the content of the
   * tag that contains the `ngIf` directive. You can also specify a template that is defined
   * externally, by referencing a labeled `<ng-template>` element. When you do this, you can
   * change which template to use at runtime, as shown in the following example.
   *
   * {@example common/ngIf/ts/module.ts region='NgIfThenElse'}
   *
   * ### Storing a conditional result in a variable
   *
   * You might want to show a set of properties from the same object. If you are waiting
   * for asynchronous data, the object can be undefined.
   * In this case, you can use `ngIf` and store the result of the condition in a local
   * variable as shown in the following example.
   *
   * {@example common/ngIf/ts/module.ts region='NgIfAs'}
   *
   * This code uses only one `AsyncPipe`, so only one subscription is created.
   * The conditional statement stores the result of `userStream|async` in the local variable `user`.
   * You can then bind the local `user` repeatedly.
   *
   * The conditional displays the data only if `userStream` returns a value,
   * so you don't need to use the
   * safe-navigation-operator (`?.`)
   * to guard against null values when accessing properties.
   * You can display an alternative template while waiting for the data.
   *
   * ### Shorthand syntax
   *
   * The shorthand syntax `*ngIf` expands into two separate template specifications
   * for the "then" and "else" clauses. For example, consider the following shorthand statement,
   * that is meant to show a loading page while waiting for data to be loaded.
   *
   * ```
   * <div class="hero-list" *ngIf="heroes else loading">
   *  ...
   * </div>
   *
   * <ng-template #loading>
   *  <div>Loading...</div>
   * </ng-template>
   * ```
   *
   * You can see that the "else" clause references the `<ng-template>`
   * with the `#loading` label, and the template for the "then" clause
   * is provided as the content of the anchor element.
   *
   * However, when Angular expands the shorthand syntax, it creates
   * another `<ng-template>` tag, with `ngIf` and `ngIfElse` directives.
   * The anchor element containing the template for the "then" clause becomes
   * the content of this unlabeled `<ng-template>` tag.
   *
   * ```
   * <ng-template [ngIf]="heroes" [ngIfElse]="loading">
   *  <div class="hero-list">
   *   ...
   *  </div>
   * </ng-template>
   *
   * <ng-template #loading>
   *  <div>Loading...</div>
   * </ng-template>
   * ```
   *
   * The presence of the implicit template object has implications for the nesting of
   * structural directives. For more on this subject, see
   * [Structural Directives](guide/structural-directives#one-per-element).
   *
   * @ngModule CommonModule
   * @publicApi
   */
  class NgIf {
      constructor(_viewContainer, templateRef) {
          this._viewContainer = _viewContainer;
          this._context = new NgIfContext();
          this._thenTemplateRef = null;
          this._elseTemplateRef = null;
          this._thenViewRef = null;
          this._elseViewRef = null;
          this._thenTemplateRef = templateRef;
      }
      /**
       * The Boolean expression to evaluate as the condition for showing a template.
       */
      set ngIf(condition) {
          this._context.$implicit = this._context.ngIf = condition;
          this._updateView();
      }
      /**
       * A template to show if the condition expression evaluates to true.
       */
      set ngIfThen(templateRef) {
          assertTemplate('ngIfThen', templateRef);
          this._thenTemplateRef = templateRef;
          this._thenViewRef = null; // clear previous view if any.
          this._updateView();
      }
      /**
       * A template to show if the condition expression evaluates to false.
       */
      set ngIfElse(templateRef) {
          assertTemplate('ngIfElse', templateRef);
          this._elseTemplateRef = templateRef;
          this._elseViewRef = null; // clear previous view if any.
          this._updateView();
      }
      _updateView() {
          if (this._context.$implicit) {
              if (!this._thenViewRef) {
                  this._viewContainer.clear();
                  this._elseViewRef = null;
                  if (this._thenTemplateRef) {
                      this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
                  }
              }
          }
          else {
              if (!this._elseViewRef) {
                  this._viewContainer.clear();
                  this._thenViewRef = null;
                  if (this._elseTemplateRef) {
                      this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
                  }
              }
          }
      }
      /**
       * Asserts the correct type of the context for the template that `NgIf` will render.
       *
       * The presence of this method is a signal to the Ivy template type-check compiler that the
       * `NgIf` structural directive renders its template with a specific context type.
       */
      static ngTemplateContextGuard(dir, ctx) {
          return true;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgIf, deps: [{ token: i0__namespace.ViewContainerRef }, { token: i0__namespace.TemplateRef }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgIf, isStandalone: true, selector: "[ngIf]", inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgIf, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngIf]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.ViewContainerRef }, { type: i0__namespace.TemplateRef }], propDecorators: { ngIf: [{
                  type: i0.Input
              }], ngIfThen: [{
                  type: i0.Input
              }], ngIfElse: [{
                  type: i0.Input
              }] } });
  /**
   * @publicApi
   */
  class NgIfContext {
      constructor() {
          this.$implicit = null;
          this.ngIf = null;
      }
  }
  function assertTemplate(property, templateRef) {
      const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
      if (!isTemplateRefOrNull) {
          throw new Error(`${property} must be a TemplateRef, but received '${i0.ɵstringify(templateRef)}'.`);
      }
  }

  class SwitchView {
      constructor(_viewContainerRef, _templateRef) {
          this._viewContainerRef = _viewContainerRef;
          this._templateRef = _templateRef;
          this._created = false;
      }
      create() {
          this._created = true;
          this._viewContainerRef.createEmbeddedView(this._templateRef);
      }
      destroy() {
          this._created = false;
          this._viewContainerRef.clear();
      }
      enforceState(created) {
          if (created && !this._created) {
              this.create();
          }
          else if (!created && this._created) {
              this.destroy();
          }
      }
  }
  /**
   * @ngModule CommonModule
   *
   * @description
   * The `[ngSwitch]` directive on a container specifies an expression to match against.
   * The expressions to match are provided by `ngSwitchCase` directives on views within the container.
   * - Every view that matches is rendered.
   * - If there are no matches, a view with the `ngSwitchDefault` directive is rendered.
   * - Elements within the `[NgSwitch]` statement but outside of any `NgSwitchCase`
   * or `ngSwitchDefault` directive are preserved at the location.
   *
   * @usageNotes
   * Define a container element for the directive, and specify the switch expression
   * to match against as an attribute:
   *
   * ```
   * <container-element [ngSwitch]="switch_expression">
   * ```
   *
   * Within the container, `*ngSwitchCase` statements specify the match expressions
   * as attributes. Include `*ngSwitchDefault` as the final case.
   *
   * ```
   * <container-element [ngSwitch]="switch_expression">
   *    <some-element *ngSwitchCase="match_expression_1">...</some-element>
   * ...
   *    <some-element *ngSwitchDefault>...</some-element>
   * </container-element>
   * ```
   *
   * ### Usage Examples
   *
   * The following example shows how to use more than one case to display the same view:
   *
   * ```
   * <container-element [ngSwitch]="switch_expression">
   *   <!-- the same view can be shown in more than one case -->
   *   <some-element *ngSwitchCase="match_expression_1">...</some-element>
   *   <some-element *ngSwitchCase="match_expression_2">...</some-element>
   *   <some-other-element *ngSwitchCase="match_expression_3">...</some-other-element>
   *   <!--default case when there are no matches -->
   *   <some-element *ngSwitchDefault>...</some-element>
   * </container-element>
   * ```
   *
   * The following example shows how cases can be nested:
   * ```
   * <container-element [ngSwitch]="switch_expression">
   *       <some-element *ngSwitchCase="match_expression_1">...</some-element>
   *       <some-element *ngSwitchCase="match_expression_2">...</some-element>
   *       <some-other-element *ngSwitchCase="match_expression_3">...</some-other-element>
   *       <ng-container *ngSwitchCase="match_expression_3">
   *         <!-- use a ng-container to group multiple root nodes -->
   *         <inner-element></inner-element>
   *         <inner-other-element></inner-other-element>
   *       </ng-container>
   *       <some-element *ngSwitchDefault>...</some-element>
   *     </container-element>
   * ```
   *
   * @publicApi
   * @see {@link NgSwitchCase}
   * @see {@link NgSwitchDefault}
   * @see [Structural Directives](guide/structural-directives)
   *
   */
  class NgSwitch {
      constructor() {
          this._defaultViews = [];
          this._defaultUsed = false;
          this._caseCount = 0;
          this._lastCaseCheckIndex = 0;
          this._lastCasesMatched = false;
      }
      set ngSwitch(newValue) {
          this._ngSwitch = newValue;
          if (this._caseCount === 0) {
              this._updateDefaultCases(true);
          }
      }
      /** @internal */
      _addCase() {
          return this._caseCount++;
      }
      /** @internal */
      _addDefault(view) {
          this._defaultViews.push(view);
      }
      /** @internal */
      _matchCase(value) {
          const matched = value === this._ngSwitch
              ;
          if ((typeof ngDevMode === 'undefined' || ngDevMode) && matched !== (value == this._ngSwitch)) {
              console.warn(i0.ɵformatRuntimeError(2001 /* RuntimeErrorCode.EQUALITY_NG_SWITCH_DIFFERENCE */, 'As of Angular v17 the NgSwitch directive uses strict equality comparison === instead of == to match different cases. ' +
                  `Previously the case value "${stringifyValue(value)}" matched switch expression value "${stringifyValue(this._ngSwitch)}", but this is no longer the case with the stricter equality check. ` +
                  'Your comparison results return different results using === vs. == and you should adjust your ngSwitch expression and / or values to conform with the strict equality requirements.'));
          }
          this._lastCasesMatched ||= matched;
          this._lastCaseCheckIndex++;
          if (this._lastCaseCheckIndex === this._caseCount) {
              this._updateDefaultCases(!this._lastCasesMatched);
              this._lastCaseCheckIndex = 0;
              this._lastCasesMatched = false;
          }
          return matched;
      }
      _updateDefaultCases(useDefault) {
          if (this._defaultViews.length > 0 && useDefault !== this._defaultUsed) {
              this._defaultUsed = useDefault;
              for (const defaultView of this._defaultViews) {
                  defaultView.enforceState(useDefault);
              }
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgSwitch, deps: [], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgSwitch, isStandalone: true, selector: "[ngSwitch]", inputs: { ngSwitch: "ngSwitch" }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgSwitch, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngSwitch]',
                      standalone: true,
                  }]
          }], propDecorators: { ngSwitch: [{
                  type: i0.Input
              }] } });
  /**
   * @ngModule CommonModule
   *
   * @description
   * Provides a switch case expression to match against an enclosing `ngSwitch` expression.
   * When the expressions match, the given `NgSwitchCase` template is rendered.
   * If multiple match expressions match the switch expression value, all of them are displayed.
   *
   * @usageNotes
   *
   * Within a switch container, `*ngSwitchCase` statements specify the match expressions
   * as attributes. Include `*ngSwitchDefault` as the final case.
   *
   * ```
   * <container-element [ngSwitch]="switch_expression">
   *   <some-element *ngSwitchCase="match_expression_1">...</some-element>
   *   ...
   *   <some-element *ngSwitchDefault>...</some-element>
   * </container-element>
   * ```
   *
   * Each switch-case statement contains an in-line HTML template or template reference
   * that defines the subtree to be selected if the value of the match expression
   * matches the value of the switch expression.
   *
   * As of Angular v17 the NgSwitch directive uses strict equality comparison (`===`) instead of
   * loose equality (`==`) to match different cases.
   *
   * @publicApi
   * @see {@link NgSwitch}
   * @see {@link NgSwitchDefault}
   *
   */
  class NgSwitchCase {
      constructor(viewContainer, templateRef, ngSwitch) {
          this.ngSwitch = ngSwitch;
          if ((typeof ngDevMode === 'undefined' || ngDevMode) && !ngSwitch) {
              throwNgSwitchProviderNotFoundError('ngSwitchCase', 'NgSwitchCase');
          }
          ngSwitch._addCase();
          this._view = new SwitchView(viewContainer, templateRef);
      }
      /**
       * Performs case matching. For internal use only.
       * @nodoc
       */
      ngDoCheck() {
          this._view.enforceState(this.ngSwitch._matchCase(this.ngSwitchCase));
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgSwitchCase, deps: [{ token: i0__namespace.ViewContainerRef }, { token: i0__namespace.TemplateRef }, { token: NgSwitch, host: true, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgSwitchCase, isStandalone: true, selector: "[ngSwitchCase]", inputs: { ngSwitchCase: "ngSwitchCase" }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgSwitchCase, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngSwitchCase]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.ViewContainerRef }, { type: i0__namespace.TemplateRef }, { type: NgSwitch, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Host
                  }] }], propDecorators: { ngSwitchCase: [{
                  type: i0.Input
              }] } });
  /**
   * @ngModule CommonModule
   *
   * @description
   *
   * Creates a view that is rendered when no `NgSwitchCase` expressions
   * match the `NgSwitch` expression.
   * This statement should be the final case in an `NgSwitch`.
   *
   * @publicApi
   * @see {@link NgSwitch}
   * @see {@link NgSwitchCase}
   *
   */
  class NgSwitchDefault {
      constructor(viewContainer, templateRef, ngSwitch) {
          if ((typeof ngDevMode === 'undefined' || ngDevMode) && !ngSwitch) {
              throwNgSwitchProviderNotFoundError('ngSwitchDefault', 'NgSwitchDefault');
          }
          ngSwitch._addDefault(new SwitchView(viewContainer, templateRef));
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgSwitchDefault, deps: [{ token: i0__namespace.ViewContainerRef }, { token: i0__namespace.TemplateRef }, { token: NgSwitch, host: true, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgSwitchDefault, isStandalone: true, selector: "[ngSwitchDefault]", ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgSwitchDefault, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngSwitchDefault]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.ViewContainerRef }, { type: i0__namespace.TemplateRef }, { type: NgSwitch, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Host
                  }] }] });
  function throwNgSwitchProviderNotFoundError(attrName, directiveName) {
      throw new i0.ɵRuntimeError(2000 /* RuntimeErrorCode.PARENT_NG_SWITCH_NOT_FOUND */, `An element with the "${attrName}" attribute ` +
          `(matching the "${directiveName}" directive) must be located inside an element with the "ngSwitch" attribute ` +
          `(matching "NgSwitch" directive)`);
  }
  function stringifyValue(value) {
      return typeof value === 'string' ? `'${value}'` : String(value);
  }

  /**
   * @ngModule CommonModule
   *
   * @usageNotes
   * ```
   * <some-element [ngPlural]="value">
   *   <ng-template ngPluralCase="=0">there is nothing</ng-template>
   *   <ng-template ngPluralCase="=1">there is one</ng-template>
   *   <ng-template ngPluralCase="few">there are a few</ng-template>
   * </some-element>
   * ```
   *
   * @description
   *
   * Adds / removes DOM sub-trees based on a numeric value. Tailored for pluralization.
   *
   * Displays DOM sub-trees that match the switch expression value, or failing that, DOM sub-trees
   * that match the switch expression's pluralization category.
   *
   * To use this directive you must provide a container element that sets the `[ngPlural]` attribute
   * to a switch expression. Inner elements with a `[ngPluralCase]` will display based on their
   * expression:
   * - if `[ngPluralCase]` is set to a value starting with `=`, it will only display if the value
   *   matches the switch expression exactly,
   * - otherwise, the view will be treated as a "category match", and will only display if exact
   *   value matches aren't found and the value maps to its category for the defined locale.
   *
   * See http://cldr.unicode.org/index/cldr-spec/plural-rules
   *
   * @publicApi
   */
  class NgPlural {
      constructor(_localization) {
          this._localization = _localization;
          this._caseViews = {};
      }
      set ngPlural(value) {
          this._updateView(value);
      }
      addCase(value, switchView) {
          this._caseViews[value] = switchView;
      }
      _updateView(switchValue) {
          this._clearViews();
          const cases = Object.keys(this._caseViews);
          const key = getPluralCategory(switchValue, cases, this._localization);
          this._activateView(this._caseViews[key]);
      }
      _clearViews() {
          if (this._activeView)
              this._activeView.destroy();
      }
      _activateView(view) {
          if (view) {
              this._activeView = view;
              this._activeView.create();
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgPlural, deps: [{ token: NgLocalization }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgPlural, isStandalone: true, selector: "[ngPlural]", inputs: { ngPlural: "ngPlural" }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgPlural, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngPlural]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: NgLocalization }], propDecorators: { ngPlural: [{
                  type: i0.Input
              }] } });
  /**
   * @ngModule CommonModule
   *
   * @description
   *
   * Creates a view that will be added/removed from the parent {@link NgPlural} when the
   * given expression matches the plural expression according to CLDR rules.
   *
   * @usageNotes
   * ```
   * <some-element [ngPlural]="value">
   *   <ng-template ngPluralCase="=0">...</ng-template>
   *   <ng-template ngPluralCase="other">...</ng-template>
   * </some-element>
   *```
   *
   * See {@link NgPlural} for more details and example.
   *
   * @publicApi
   */
  class NgPluralCase {
      constructor(value, template, viewContainer, ngPlural) {
          this.value = value;
          const isANumber = !isNaN(Number(value));
          ngPlural.addCase(isANumber ? `=${value}` : value, new SwitchView(viewContainer, template));
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgPluralCase, deps: [{ token: 'ngPluralCase', attribute: true }, { token: i0__namespace.TemplateRef }, { token: i0__namespace.ViewContainerRef }, { token: NgPlural, host: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgPluralCase, isStandalone: true, selector: "[ngPluralCase]", ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgPluralCase, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngPluralCase]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: undefined, decorators: [{
                      type: i0.Attribute,
                      args: ['ngPluralCase']
                  }] }, { type: i0__namespace.TemplateRef }, { type: i0__namespace.ViewContainerRef }, { type: NgPlural, decorators: [{
                      type: i0.Host
                  }] }] });

  /**
   * @ngModule CommonModule
   *
   * @usageNotes
   *
   * Set the font of the containing element to the result of an expression.
   *
   * ```
   * <some-element [ngStyle]="{'font-style': styleExp}">...</some-element>
   * ```
   *
   * Set the width of the containing element to a pixel value returned by an expression.
   *
   * ```
   * <some-element [ngStyle]="{'max-width.px': widthExp}">...</some-element>
   * ```
   *
   * Set a collection of style values using an expression that returns key-value pairs.
   *
   * ```
   * <some-element [ngStyle]="objExp">...</some-element>
   * ```
   *
   * @description
   *
   * An attribute directive that updates styles for the containing HTML element.
   * Sets one or more style properties, specified as colon-separated key-value pairs.
   * The key is a style name, with an optional `.<unit>` suffix
   * (such as 'top.px', 'font-style.em').
   * The value is an expression to be evaluated.
   * The resulting non-null value, expressed in the given unit,
   * is assigned to the given style property.
   * If the result of evaluation is null, the corresponding style is removed.
   *
   * @publicApi
   */
  class NgStyle {
      constructor(_ngEl, _differs, _renderer) {
          this._ngEl = _ngEl;
          this._differs = _differs;
          this._renderer = _renderer;
          this._ngStyle = null;
          this._differ = null;
      }
      set ngStyle(values) {
          this._ngStyle = values;
          if (!this._differ && values) {
              this._differ = this._differs.find(values).create();
          }
      }
      ngDoCheck() {
          if (this._differ) {
              const changes = this._differ.diff(this._ngStyle);
              if (changes) {
                  this._applyChanges(changes);
              }
          }
      }
      _setStyle(nameAndUnit, value) {
          const [name, unit] = nameAndUnit.split('.');
          const flags = name.indexOf('-') === -1 ? undefined : i0.RendererStyleFlags2.DashCase;
          if (value != null) {
              this._renderer.setStyle(this._ngEl.nativeElement, name, unit ? `${value}${unit}` : value, flags);
          }
          else {
              this._renderer.removeStyle(this._ngEl.nativeElement, name, flags);
          }
      }
      _applyChanges(changes) {
          changes.forEachRemovedItem((record) => this._setStyle(record.key, null));
          changes.forEachAddedItem((record) => this._setStyle(record.key, record.currentValue));
          changes.forEachChangedItem((record) => this._setStyle(record.key, record.currentValue));
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgStyle, deps: [{ token: i0__namespace.ElementRef }, { token: i0__namespace.KeyValueDiffers }, { token: i0__namespace.Renderer2 }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgStyle, isStandalone: true, selector: "[ngStyle]", inputs: { ngStyle: "ngStyle" }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgStyle, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngStyle]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.ElementRef }, { type: i0__namespace.KeyValueDiffers }, { type: i0__namespace.Renderer2 }], propDecorators: { ngStyle: [{
                  type: i0.Input,
                  args: ['ngStyle']
              }] } });

  /**
   * @ngModule CommonModule
   *
   * @description
   *
   * Inserts an embedded view from a prepared `TemplateRef`.
   *
   * You can attach a context object to the `EmbeddedViewRef` by setting `[ngTemplateOutletContext]`.
   * `[ngTemplateOutletContext]` should be an object, the object's keys will be available for binding
   * by the local template `let` declarations.
   *
   * @usageNotes
   * ```
   * <ng-container *ngTemplateOutlet="templateRefExp; context: contextExp"></ng-container>
   * ```
   *
   * Using the key `$implicit` in the context object will set its value as default.
   *
   * ### Example
   *
   * {@example common/ngTemplateOutlet/ts/module.ts region='NgTemplateOutlet'}
   *
   * @publicApi
   */
  class NgTemplateOutlet {
      constructor(_viewContainerRef) {
          this._viewContainerRef = _viewContainerRef;
          this._viewRef = null;
          /**
           * A context object to attach to the {@link EmbeddedViewRef}. This should be an
           * object, the object's keys will be available for binding by the local template `let`
           * declarations.
           * Using the key `$implicit` in the context object will set its value as default.
           */
          this.ngTemplateOutletContext = null;
          /**
           * A string defining the template reference and optionally the context object for the template.
           */
          this.ngTemplateOutlet = null;
          /** Injector to be used within the embedded view. */
          this.ngTemplateOutletInjector = null;
      }
      ngOnChanges(changes) {
          if (this._shouldRecreateView(changes)) {
              const viewContainerRef = this._viewContainerRef;
              if (this._viewRef) {
                  viewContainerRef.remove(viewContainerRef.indexOf(this._viewRef));
              }
              // If there is no outlet, clear the destroyed view ref.
              if (!this.ngTemplateOutlet) {
                  this._viewRef = null;
                  return;
              }
              // Create a context forward `Proxy` that will always bind to the user-specified context,
              // without having to destroy and re-create views whenever the context changes.
              const viewContext = this._createContextForwardProxy();
              this._viewRef = viewContainerRef.createEmbeddedView(this.ngTemplateOutlet, viewContext, {
                  injector: this.ngTemplateOutletInjector ?? undefined,
              });
          }
      }
      /**
       * We need to re-create existing embedded view if either is true:
       * - the outlet changed.
       * - the injector changed.
       */
      _shouldRecreateView(changes) {
          return !!changes['ngTemplateOutlet'] || !!changes['ngTemplateOutletInjector'];
      }
      /**
       * For a given outlet instance, we create a proxy object that delegates
       * to the user-specified context. This allows changing, or swapping out
       * the context object completely without having to destroy/re-create the view.
       */
      _createContextForwardProxy() {
          return new Proxy({}, {
              set: (_target, prop, newValue) => {
                  if (!this.ngTemplateOutletContext) {
                      return false;
                  }
                  return Reflect.set(this.ngTemplateOutletContext, prop, newValue);
              },
              get: (_target, prop, receiver) => {
                  if (!this.ngTemplateOutletContext) {
                      return undefined;
                  }
                  return Reflect.get(this.ngTemplateOutletContext, prop, receiver);
              },
          });
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgTemplateOutlet, deps: [{ token: i0__namespace.ViewContainerRef }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgTemplateOutlet, isStandalone: true, selector: "[ngTemplateOutlet]", inputs: { ngTemplateOutletContext: "ngTemplateOutletContext", ngTemplateOutlet: "ngTemplateOutlet", ngTemplateOutletInjector: "ngTemplateOutletInjector" }, usesOnChanges: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgTemplateOutlet, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngTemplateOutlet]',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.ViewContainerRef }], propDecorators: { ngTemplateOutletContext: [{
                  type: i0.Input
              }], ngTemplateOutlet: [{
                  type: i0.Input
              }], ngTemplateOutletInjector: [{
                  type: i0.Input
              }] } });

  /**
   * A collection of Angular directives that are likely to be used in each and every Angular
   * application.
   */
  const COMMON_DIRECTIVES = [
      NgClass,
      NgComponentOutlet,
      NgForOf,
      NgIf,
      NgTemplateOutlet,
      NgStyle,
      NgSwitch,
      NgSwitchCase,
      NgSwitchDefault,
      NgPlural,
      NgPluralCase,
  ];

  function invalidPipeArgumentError(type, value) {
      return new i0.ɵRuntimeError(2100 /* RuntimeErrorCode.INVALID_PIPE_ARGUMENT */, ngDevMode && `InvalidPipeArgument: '${value}' for pipe '${i0.ɵstringify(type)}'`);
  }

  class SubscribableStrategy {
      createSubscription(async, updateLatestValue) {
          // Subscription can be side-effectful, and we don't want any signal reads which happen in the
          // side effect of the subscription to be tracked by a component's template when that
          // subscription is triggered via the async pipe. So we wrap the subscription in `untracked` to
          // decouple from the current reactive context.
          //
          // `untracked` also prevents signal _writes_ which happen in the subscription side effect from
          // being treated as signal writes during the template evaluation (which throws errors).
          return i0.untracked(() => async.subscribe({
              next: updateLatestValue,
              error: (e) => {
                  throw e;
              },
          }));
      }
      dispose(subscription) {
          // See the comment in `createSubscription` above on the use of `untracked`.
          i0.untracked(() => subscription.unsubscribe());
      }
  }
  class PromiseStrategy {
      createSubscription(async, updateLatestValue) {
          return async.then(updateLatestValue, (e) => {
              throw e;
          });
      }
      dispose(subscription) { }
  }
  const _promiseStrategy = new PromiseStrategy();
  const _subscribableStrategy = new SubscribableStrategy();
  /**
   * @ngModule CommonModule
   * @description
   *
   * Unwraps a value from an asynchronous primitive.
   *
   * The `async` pipe subscribes to an `Observable` or `Promise` and returns the latest value it has
   * emitted. When a new value is emitted, the `async` pipe marks the component to be checked for
   * changes. When the component gets destroyed, the `async` pipe unsubscribes automatically to avoid
   * potential memory leaks. When the reference of the expression changes, the `async` pipe
   * automatically unsubscribes from the old `Observable` or `Promise` and subscribes to the new one.
   *
   * @usageNotes
   *
   * ### Examples
   *
   * This example binds a `Promise` to the view. Clicking the `Resolve` button resolves the
   * promise.
   *
   * {@example common/pipes/ts/async_pipe.ts region='AsyncPipePromise'}
   *
   * It's also possible to use `async` with Observables. The example below binds the `time` Observable
   * to the view. The Observable continuously updates the view with the current time.
   *
   * {@example common/pipes/ts/async_pipe.ts region='AsyncPipeObservable'}
   *
   * @publicApi
   */
  class AsyncPipe {
      constructor(ref) {
          this._latestValue = null;
          this.markForCheckOnValueUpdate = true;
          this._subscription = null;
          this._obj = null;
          this._strategy = null;
          // Assign `ref` into `this._ref` manually instead of declaring `_ref` in the constructor
          // parameter list, as the type of `this._ref` includes `null` unlike the type of `ref`.
          this._ref = ref;
      }
      ngOnDestroy() {
          if (this._subscription) {
              this._dispose();
          }
          // Clear the `ChangeDetectorRef` and its association with the view data, to mitigate
          // potential memory leaks in Observables that could otherwise cause the view data to
          // be retained.
          // https://github.com/angular/angular/issues/17624
          this._ref = null;
      }
      transform(obj) {
          if (!this._obj) {
              if (obj) {
                  try {
                      // Only call `markForCheck` if the value is updated asynchronously.
                      // Synchronous updates _during_ subscription should not wastefully mark for check -
                      // this value is already going to be returned from the transform function.
                      this.markForCheckOnValueUpdate = false;
                      this._subscribe(obj);
                  }
                  finally {
                      this.markForCheckOnValueUpdate = true;
                  }
              }
              return this._latestValue;
          }
          if (obj !== this._obj) {
              this._dispose();
              return this.transform(obj);
          }
          return this._latestValue;
      }
      _subscribe(obj) {
          this._obj = obj;
          this._strategy = this._selectStrategy(obj);
          this._subscription = this._strategy.createSubscription(obj, (value) => this._updateLatestValue(obj, value));
      }
      _selectStrategy(obj) {
          if (i0.ɵisPromise(obj)) {
              return _promiseStrategy;
          }
          if (i0.ɵisSubscribable(obj)) {
              return _subscribableStrategy;
          }
          throw invalidPipeArgumentError(AsyncPipe, obj);
      }
      _dispose() {
          // Note: `dispose` is only called if a subscription has been initialized before, indicating
          // that `this._strategy` is also available.
          this._strategy.dispose(this._subscription);
          this._latestValue = null;
          this._subscription = null;
          this._obj = null;
      }
      _updateLatestValue(async, value) {
          if (async === this._obj) {
              this._latestValue = value;
              if (this.markForCheckOnValueUpdate) {
                  this._ref?.markForCheck();
              }
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: AsyncPipe, deps: [{ token: i0__namespace.ChangeDetectorRef }], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: AsyncPipe, isStandalone: true, name: "async", pure: false }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: AsyncPipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'async',
                      pure: false,
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.ChangeDetectorRef }] });

  /**
   * Transforms text to all lower case.
   *
   * @see {@link UpperCasePipe}
   * @see {@link TitleCasePipe}
   * @usageNotes
   *
   * The following example defines a view that allows the user to enter
   * text, and then uses the pipe to convert the input text to all lower case.
   *
   * <code-example path="common/pipes/ts/lowerupper_pipe.ts" region='LowerUpperPipe'></code-example>
   *
   * @ngModule CommonModule
   * @publicApi
   */
  class LowerCasePipe {
      transform(value) {
          if (value == null)
              return null;
          if (typeof value !== 'string') {
              throw invalidPipeArgumentError(LowerCasePipe, value);
          }
          return value.toLowerCase();
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: LowerCasePipe, deps: [], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: LowerCasePipe, isStandalone: true, name: "lowercase" }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: LowerCasePipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'lowercase',
                      standalone: true,
                  }]
          }] });
  //
  // Regex below matches any Unicode word and number compatible with ES5. In ES2018 the same result
  // can be achieved by using /[0-9\p{L}]\S*/gu and also known as Unicode Property Escapes
  // (https://2ality.com/2017/07/regexp-unicode-property-escapes.html). Since there is no
  // transpilation of this functionality down to ES5 without external tool, the only solution is
  // to use already transpiled form. Example can be found here -
  // https://mothereff.in/regexpu#input=var+regex+%3D+%2F%5B0-9%5Cp%7BL%7D%5D%5CS*%2Fgu%3B%0A%0A&unicodePropertyEscape=1
  //
  const unicodeWordMatch = /(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])\S*/g;
  /**
   * Transforms text to title case.
   * Capitalizes the first letter of each word and transforms the
   * rest of the word to lower case.
   * Words are delimited by any whitespace character, such as a space, tab, or line-feed character.
   *
   * @see {@link LowerCasePipe}
   * @see {@link UpperCasePipe}
   *
   * @usageNotes
   * The following example shows the result of transforming various strings into title case.
   *
   * <code-example path="common/pipes/ts/titlecase_pipe.ts" region='TitleCasePipe'></code-example>
   *
   * @ngModule CommonModule
   * @publicApi
   */
  class TitleCasePipe {
      transform(value) {
          if (value == null)
              return null;
          if (typeof value !== 'string') {
              throw invalidPipeArgumentError(TitleCasePipe, value);
          }
          return value.replace(unicodeWordMatch, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: TitleCasePipe, deps: [], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: TitleCasePipe, isStandalone: true, name: "titlecase" }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: TitleCasePipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'titlecase',
                      standalone: true,
                  }]
          }] });
  /**
   * Transforms text to all upper case.
   * @see {@link LowerCasePipe}
   * @see {@link TitleCasePipe}
   *
   * @ngModule CommonModule
   * @publicApi
   */
  class UpperCasePipe {
      transform(value) {
          if (value == null)
              return null;
          if (typeof value !== 'string') {
              throw invalidPipeArgumentError(UpperCasePipe, value);
          }
          return value.toUpperCase();
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: UpperCasePipe, deps: [], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: UpperCasePipe, isStandalone: true, name: "uppercase" }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: UpperCasePipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'uppercase',
                      standalone: true,
                  }]
          }] });

  /**
   * The default date format of Angular date pipe, which corresponds to the following format:
   * `'MMM d,y'` (e.g. `Jun 15, 2015`)
   */
  const DEFAULT_DATE_FORMAT = 'mediumDate';

  /**
   * Optionally-provided default timezone to use for all instances of `DatePipe` (such as `'+0430'`).
   * If the value isn't provided, the `DatePipe` will use the end-user's local system timezone.
   *
   * @deprecated use DATE_PIPE_DEFAULT_OPTIONS token to configure DatePipe
   */
  const DATE_PIPE_DEFAULT_TIMEZONE = new i0.InjectionToken(ngDevMode ? 'DATE_PIPE_DEFAULT_TIMEZONE' : '');
  /**
   * DI token that allows to provide default configuration for the `DatePipe` instances in an
   * application. The value is an object which can include the following fields:
   * - `dateFormat`: configures the default date format. If not provided, the `DatePipe`
   * will use the 'mediumDate' as a value.
   * - `timezone`: configures the default timezone. If not provided, the `DatePipe` will
   * use the end-user's local system timezone.
   *
   * @see {@link DatePipeConfig}
   *
   * @usageNotes
   *
   * Various date pipe default values can be overwritten by providing this token with
   * the value that has this interface.
   *
   * For example:
   *
   * Override the default date format by providing a value using the token:
   * ```typescript
   * providers: [
   *   {provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: {dateFormat: 'shortDate'}}
   * ]
   * ```
   *
   * Override the default timezone by providing a value using the token:
   * ```typescript
   * providers: [
   *   {provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: {timezone: '-1200'}}
   * ]
   * ```
   */
  const DATE_PIPE_DEFAULT_OPTIONS = new i0.InjectionToken(ngDevMode ? 'DATE_PIPE_DEFAULT_OPTIONS' : '');
  // clang-format off
  /**
   * @ngModule CommonModule
   * @description
   *
   * Formats a date value according to locale rules.
   *
   * `DatePipe` is executed only when it detects a pure change to the input value.
   * A pure change is either a change to a primitive input value
   * (such as `String`, `Number`, `Boolean`, or `Symbol`),
   * or a changed object reference (such as `Date`, `Array`, `Function`, or `Object`).
   *
   * Note that mutating a `Date` object does not cause the pipe to be rendered again.
   * To ensure that the pipe is executed, you must create a new `Date` object.
   *
   * Only the `en-US` locale data comes with Angular. To localize dates
   * in another language, you must import the corresponding locale data.
   * See the [I18n guide](guide/i18n-common-format-data-locale) for more information.
   *
   * The time zone of the formatted value can be specified either by passing it in as the second
   * parameter of the pipe, or by setting the default through the `DATE_PIPE_DEFAULT_OPTIONS`
   * injection token. The value that is passed in as the second parameter takes precedence over
   * the one defined using the injection token.
   *
   * @see {@link formatDate}
   *
   *
   * @usageNotes
   *
   * The result of this pipe is not reevaluated when the input is mutated. To avoid the need to
   * reformat the date on every change-detection cycle, treat the date as an immutable object
   * and change the reference when the pipe needs to run again.
   *
   * ### Pre-defined format options
   *
   * | Option        | Equivalent to                       | Examples (given in `en-US` locale)              |
   * |---------------|-------------------------------------|-------------------------------------------------|
   * | `'short'`     | `'M/d/yy, h:mm a'`                  | `6/15/15, 9:03 AM`                              |
   * | `'medium'`    | `'MMM d, y, h:mm:ss a'`             | `Jun 15, 2015, 9:03:01 AM`                      |
   * | `'long'`      | `'MMMM d, y, h:mm:ss a z'`          | `June 15, 2015 at 9:03:01 AM GMT+1`             |
   * | `'full'`      | `'EEEE, MMMM d, y, h:mm:ss a zzzz'` | `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00` |
   * | `'shortDate'` | `'M/d/yy'`                          | `6/15/15`                                       |
   * | `'mediumDate'`| `'MMM d, y'`                        | `Jun 15, 2015`                                  |
   * | `'longDate'`  | `'MMMM d, y'`                       | `June 15, 2015`                                 |
   * | `'fullDate'`  | `'EEEE, MMMM d, y'`                 | `Monday, June 15, 2015`                         |
   * | `'shortTime'` | `'h:mm a'`                          | `9:03 AM`                                       |
   * | `'mediumTime'`| `'h:mm:ss a'`                       | `9:03:01 AM`                                    |
   * | `'longTime'`  | `'h:mm:ss a z'`                     | `9:03:01 AM GMT+1`                              |
   * | `'fullTime'`  | `'h:mm:ss a zzzz'`                  | `9:03:01 AM GMT+01:00`                          |
   *
   * ### Custom format options
   *
   * You can construct a format string using symbols to specify the components
   * of a date-time value, as described in the following table.
   * Format details depend on the locale.
   * Fields marked with (*) are only available in the extra data set for the given locale.
   *
   *  | Field type              | Format      | Description                                                   | Example Value                                              |
   *  |-------------------------|-------------|---------------------------------------------------------------|------------------------------------------------------------|
   *  | Era                     | G, GG & GGG | Abbreviated                                                   | AD                                                         |
   *  |                         | GGGG        | Wide                                                          | Anno Domini                                                |
   *  |                         | GGGGG       | Narrow                                                        | A                                                          |
   *  | Year                    | y           | Numeric: minimum digits                                       | 2, 20, 201, 2017, 20173                                    |
   *  |                         | yy          | Numeric: 2 digits + zero padded                               | 02, 20, 01, 17, 73                                         |
   *  |                         | yyy         | Numeric: 3 digits + zero padded                               | 002, 020, 201, 2017, 20173                                 |
   *  |                         | yyyy        | Numeric: 4 digits or more + zero padded                       | 0002, 0020, 0201, 2017, 20173                              |
   *  | ISO Week-numbering year | Y           | Numeric: minimum digits                                       | 2, 20, 201, 2017, 20173                                    |
   *  |                         | YY          | Numeric: 2 digits + zero padded                               | 02, 20, 01, 17, 73                                         |
   *  |                         | YYY         | Numeric: 3 digits + zero padded                               | 002, 020, 201, 2017, 20173                                 |
   *  |                         | YYYY        | Numeric: 4 digits or more + zero padded                       | 0002, 0020, 0201, 2017, 20173                              |
   *  | Month                   | M           | Numeric: 1 digit                                              | 9, 12                                                      |
   *  |                         | MM          | Numeric: 2 digits + zero padded                               | 09, 12                                                     |
   *  |                         | MMM         | Abbreviated                                                   | Sep                                                        |
   *  |                         | MMMM        | Wide                                                          | September                                                  |
   *  |                         | MMMMM       | Narrow                                                        | S                                                          |
   *  | Month standalone        | L           | Numeric: 1 digit                                              | 9, 12                                                      |
   *  |                         | LL          | Numeric: 2 digits + zero padded                               | 09, 12                                                     |
   *  |                         | LLL         | Abbreviated                                                   | Sep                                                        |
   *  |                         | LLLL        | Wide                                                          | September                                                  |
   *  |                         | LLLLL       | Narrow                                                        | S                                                          |
   *  | ISO Week of year        | w           | Numeric: minimum digits                                       | 1... 53                                                    |
   *  |                         | ww          | Numeric: 2 digits + zero padded                               | 01... 53                                                   |
   *  | Week of month           | W           | Numeric: 1 digit                                              | 1... 5                                                     |
   *  | Day of month            | d           | Numeric: minimum digits                                       | 1                                                          |
   *  |                         | dd          | Numeric: 2 digits + zero padded                               | 01                                                         |
   *  | Week day                | E, EE & EEE | Abbreviated                                                   | Tue                                                        |
   *  |                         | EEEE        | Wide                                                          | Tuesday                                                    |
   *  |                         | EEEEE       | Narrow                                                        | T                                                          |
   *  |                         | EEEEEE      | Short                                                         | Tu                                                         |
   *  | Week day standalone     | c, cc       | Numeric: 1 digit                                              | 2                                                          |
   *  |                         | ccc         | Abbreviated                                                   | Tue                                                        |
   *  |                         | cccc        | Wide                                                          | Tuesday                                                    |
   *  |                         | ccccc       | Narrow                                                        | T                                                          |
   *  |                         | cccccc      | Short                                                         | Tu                                                         |
   *  | Period                  | a, aa & aaa | Abbreviated                                                   | am/pm or AM/PM                                             |
   *  |                         | aaaa        | Wide (fallback to `a` when missing)                           | ante meridiem/post meridiem                                |
   *  |                         | aaaaa       | Narrow                                                        | a/p                                                        |
   *  | Period*                 | B, BB & BBB | Abbreviated                                                   | mid.                                                       |
   *  |                         | BBBB        | Wide                                                          | am, pm, midnight, noon, morning, afternoon, evening, night |
   *  |                         | BBBBB       | Narrow                                                        | md                                                         |
   *  | Period standalone*      | b, bb & bbb | Abbreviated                                                   | mid.                                                       |
   *  |                         | bbbb        | Wide                                                          | am, pm, midnight, noon, morning, afternoon, evening, night |
   *  |                         | bbbbb       | Narrow                                                        | md                                                         |
   *  | Hour 1-12               | h           | Numeric: minimum digits                                       | 1, 12                                                      |
   *  |                         | hh          | Numeric: 2 digits + zero padded                               | 01, 12                                                     |
   *  | Hour 0-23               | H           | Numeric: minimum digits                                       | 0, 23                                                      |
   *  |                         | HH          | Numeric: 2 digits + zero padded                               | 00, 23                                                     |
   *  | Minute                  | m           | Numeric: minimum digits                                       | 8, 59                                                      |
   *  |                         | mm          | Numeric: 2 digits + zero padded                               | 08, 59                                                     |
   *  | Second                  | s           | Numeric: minimum digits                                       | 0... 59                                                    |
   *  |                         | ss          | Numeric: 2 digits + zero padded                               | 00... 59                                                   |
   *  | Fractional seconds      | S           | Numeric: 1 digit                                              | 0... 9                                                     |
   *  |                         | SS          | Numeric: 2 digits + zero padded                               | 00... 99                                                   |
   *  |                         | SSS         | Numeric: 3 digits + zero padded (= milliseconds)              | 000... 999                                                 |
   *  | Zone                    | z, zz & zzz | Short specific non location format (fallback to O)            | GMT-8                                                      |
   *  |                         | zzzz        | Long specific non location format (fallback to OOOO)          | GMT-08:00                                                  |
   *  |                         | Z, ZZ & ZZZ | ISO8601 basic format                                          | -0800                                                      |
   *  |                         | ZZZZ        | Long localized GMT format                                     | GMT-8:00                                                   |
   *  |                         | ZZZZZ       | ISO8601 extended format + Z indicator for offset 0 (= XXXXX)  | -08:00                                                     |
   *  |                         | O, OO & OOO | Short localized GMT format                                    | GMT-8                                                      |
   *  |                         | OOOO        | Long localized GMT format                                     | GMT-08:00                                                  |
   *
   *
   * ### Format examples
   *
   * These examples transform a date into various formats,
   * assuming that `dateObj` is a JavaScript `Date` object for
   * year: 2015, month: 6, day: 15, hour: 21, minute: 43, second: 11,
   * given in the local time for the `en-US` locale.
   *
   * ```
   * {{ dateObj | date }}               // output is 'Jun 15, 2015'
   * {{ dateObj | date:'medium' }}      // output is 'Jun 15, 2015, 9:43:11 PM'
   * {{ dateObj | date:'shortTime' }}   // output is '9:43 PM'
   * {{ dateObj | date:'mm:ss' }}       // output is '43:11'
   * {{ dateObj | date:"MMM dd, yyyy 'at' hh:mm a" }}  // output is 'Jun 15, 2015 at 09:43 PM'
   * ```
   *
   * ### Usage example
   *
   * The following component uses a date pipe to display the current date in different formats.
   *
   * ```
   * @Component({
   *  selector: 'date-pipe',
   *  template: `<div>
   *    <p>Today is {{today | date}}</p>
   *    <p>Or if you prefer, {{today | date:'fullDate'}}</p>
   *    <p>The time is {{today | date:'h:mm a z'}}</p>
   *  </div>`
   * })
   * // Get the current date and time as a date-time value.
   * export class DatePipeComponent {
   *   today: number = Date.now();
   * }
   * ```
   *
   * @publicApi
   */
  // clang-format on
  class DatePipe {
      constructor(locale, defaultTimezone, defaultOptions) {
          this.locale = locale;
          this.defaultTimezone = defaultTimezone;
          this.defaultOptions = defaultOptions;
      }
      transform(value, format, timezone, locale) {
          if (value == null || value === '' || value !== value)
              return null;
          try {
              const _format = format ?? this.defaultOptions?.dateFormat ?? DEFAULT_DATE_FORMAT;
              const _timezone = timezone ?? this.defaultOptions?.timezone ?? this.defaultTimezone ?? undefined;
              return formatDate(value, _format, locale || this.locale, _timezone);
          }
          catch (error) {
              throw invalidPipeArgumentError(DatePipe, error.message);
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: DatePipe, deps: [{ token: i0.LOCALE_ID }, { token: DATE_PIPE_DEFAULT_TIMEZONE, optional: true }, { token: DATE_PIPE_DEFAULT_OPTIONS, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: DatePipe, isStandalone: true, name: "date" }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: DatePipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'date',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: undefined, decorators: [{
                      type: i0.Inject,
                      args: [i0.LOCALE_ID]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Inject,
                      args: [DATE_PIPE_DEFAULT_TIMEZONE]
                  }, {
                      type: i0.Optional
                  }] }, { type: undefined, decorators: [{
                      type: i0.Inject,
                      args: [DATE_PIPE_DEFAULT_OPTIONS]
                  }, {
                      type: i0.Optional
                  }] }] });

  const _INTERPOLATION_REGEXP = /#/g;
  /**
   * @ngModule CommonModule
   * @description
   *
   * Maps a value to a string that pluralizes the value according to locale rules.
   *
   * @usageNotes
   *
   * ### Example
   *
   * {@example common/pipes/ts/i18n_pipe.ts region='I18nPluralPipeComponent'}
   *
   * @publicApi
   */
  class I18nPluralPipe {
      constructor(_localization) {
          this._localization = _localization;
      }
      /**
       * @param value the number to be formatted
       * @param pluralMap an object that mimics the ICU format, see
       * https://unicode-org.github.io/icu/userguide/format_parse/messages/.
       * @param locale a `string` defining the locale to use (uses the current {@link LOCALE_ID} by
       * default).
       */
      transform(value, pluralMap, locale) {
          if (value == null)
              return '';
          if (typeof pluralMap !== 'object' || pluralMap === null) {
              throw invalidPipeArgumentError(I18nPluralPipe, pluralMap);
          }
          const key = getPluralCategory(value, Object.keys(pluralMap), this._localization, locale);
          return pluralMap[key].replace(_INTERPOLATION_REGEXP, value.toString());
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: I18nPluralPipe, deps: [{ token: NgLocalization }], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: I18nPluralPipe, isStandalone: true, name: "i18nPlural" }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: I18nPluralPipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'i18nPlural',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: NgLocalization }] });

  /**
   * @ngModule CommonModule
   * @description
   *
   * Generic selector that displays the string that matches the current value.
   *
   * If none of the keys of the `mapping` match the `value`, then the content
   * of the `other` key is returned when present, otherwise an empty string is returned.
   *
   * @usageNotes
   *
   * ### Example
   *
   * {@example common/pipes/ts/i18n_pipe.ts region='I18nSelectPipeComponent'}
   *
   * @publicApi
   */
  class I18nSelectPipe {
      /**
       * @param value a string to be internationalized.
       * @param mapping an object that indicates the text that should be displayed
       * for different values of the provided `value`.
       */
      transform(value, mapping) {
          if (value == null)
              return '';
          if (typeof mapping !== 'object' || typeof value !== 'string') {
              throw invalidPipeArgumentError(I18nSelectPipe, mapping);
          }
          if (mapping.hasOwnProperty(value)) {
              return mapping[value];
          }
          if (mapping.hasOwnProperty('other')) {
              return mapping['other'];
          }
          return '';
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: I18nSelectPipe, deps: [], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: I18nSelectPipe, isStandalone: true, name: "i18nSelect" }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: I18nSelectPipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'i18nSelect',
                      standalone: true,
                  }]
          }] });

  /**
   * @ngModule CommonModule
   * @description
   *
   * Converts a value into its JSON-format representation.  Useful for debugging.
   *
   * @usageNotes
   *
   * The following component uses a JSON pipe to convert an object
   * to JSON format, and displays the string in both formats for comparison.
   *
   * {@example common/pipes/ts/json_pipe.ts region='JsonPipe'}
   *
   * @publicApi
   */
  class JsonPipe {
      /**
       * @param value A value of any type to convert into a JSON-format string.
       */
      transform(value) {
          return JSON.stringify(value, null, 2);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: JsonPipe, deps: [], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: JsonPipe, isStandalone: true, name: "json", pure: false }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: JsonPipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'json',
                      pure: false,
                      standalone: true,
                  }]
          }] });

  function makeKeyValuePair(key, value) {
      return { key: key, value: value };
  }
  /**
   * @ngModule CommonModule
   * @description
   *
   * Transforms Object or Map into an array of key value pairs.
   *
   * The output array will be ordered by keys.
   * By default the comparator will be by Unicode point value.
   * You can optionally pass a compareFn if your keys are complex types.
   *
   * @usageNotes
   * ### Examples
   *
   * This examples show how an Object or a Map can be iterated by ngFor with the use of this
   * keyvalue pipe.
   *
   * {@example common/pipes/ts/keyvalue_pipe.ts region='KeyValuePipe'}
   *
   * @publicApi
   */
  class KeyValuePipe {
      constructor(differs) {
          this.differs = differs;
          this.keyValues = [];
          this.compareFn = defaultComparator;
      }
      transform(input, compareFn = defaultComparator) {
          if (!input || (!(input instanceof Map) && typeof input !== 'object')) {
              return null;
          }
          // make a differ for whatever type we've been passed in
          this.differ ??= this.differs.find(input).create();
          const differChanges = this.differ.diff(input);
          const compareFnChanged = compareFn !== this.compareFn;
          if (differChanges) {
              this.keyValues = [];
              differChanges.forEachItem((r) => {
                  this.keyValues.push(makeKeyValuePair(r.key, r.currentValue));
              });
          }
          if (differChanges || compareFnChanged) {
              this.keyValues.sort(compareFn);
              this.compareFn = compareFn;
          }
          return this.keyValues;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: KeyValuePipe, deps: [{ token: i0__namespace.KeyValueDiffers }], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: KeyValuePipe, isStandalone: true, name: "keyvalue", pure: false }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: KeyValuePipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'keyvalue',
                      pure: false,
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.KeyValueDiffers }] });
  function defaultComparator(keyValueA, keyValueB) {
      const a = keyValueA.key;
      const b = keyValueB.key;
      // if same exit with 0;
      if (a === b)
          return 0;
      // make sure that undefined are at the end of the sort.
      if (a === undefined)
          return 1;
      if (b === undefined)
          return -1;
      // make sure that nulls are at the end of the sort.
      if (a === null)
          return 1;
      if (b === null)
          return -1;
      if (typeof a == 'string' && typeof b == 'string') {
          return a < b ? -1 : 1;
      }
      if (typeof a == 'number' && typeof b == 'number') {
          return a - b;
      }
      if (typeof a == 'boolean' && typeof b == 'boolean') {
          return a < b ? -1 : 1;
      }
      // `a` and `b` are of different types. Compare their string values.
      const aString = String(a);
      const bString = String(b);
      return aString == bString ? 0 : aString < bString ? -1 : 1;
  }

  /**
   * @ngModule CommonModule
   * @description
   *
   * Formats a value according to digit options and locale rules.
   * Locale determines group sizing and separator,
   * decimal point character, and other locale-specific configurations.
   *
   * @see {@link formatNumber}
   *
   * @usageNotes
   *
   * ### digitsInfo
   *
   * The value's decimal representation is specified by the `digitsInfo`
   * parameter, written in the following format:<br>
   *
   * ```
   * {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}
   * ```
   *
   *  - `minIntegerDigits`:
   * The minimum number of integer digits before the decimal point.
   * Default is 1.
   *
   * - `minFractionDigits`:
   * The minimum number of digits after the decimal point.
   * Default is 0.
   *
   *  - `maxFractionDigits`:
   * The maximum number of digits after the decimal point.
   * Default is 3.
   *
   * If the formatted value is truncated it will be rounded using the "to-nearest" method:
   *
   * ```
   * {{3.6 | number: '1.0-0'}}
   * <!--will output '4'-->
   *
   * {{-3.6 | number:'1.0-0'}}
   * <!--will output '-4'-->
   * ```
   *
   * ### locale
   *
   * `locale` will format a value according to locale rules.
   * Locale determines group sizing and separator,
   * decimal point character, and other locale-specific configurations.
   *
   * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
   *
   * See [Setting your app locale](guide/i18n-common-locale-id).
   *
   * ### Example
   *
   * The following code shows how the pipe transforms values
   * according to various format specifications,
   * where the caller's default locale is `en-US`.
   *
   * <code-example path="common/pipes/ts/number_pipe.ts" region='NumberPipe'></code-example>
   *
   * @publicApi
   */
  class DecimalPipe {
      constructor(_locale) {
          this._locale = _locale;
      }
      /**
       * @param value The value to be formatted.
       * @param digitsInfo Sets digit and decimal representation.
       * [See more](#digitsinfo).
       * @param locale Specifies what locale format rules to use.
       * [See more](#locale).
       */
      transform(value, digitsInfo, locale) {
          if (!isValue(value))
              return null;
          locale ||= this._locale;
          try {
              const num = strToNumber(value);
              return formatNumber(num, locale, digitsInfo);
          }
          catch (error) {
              throw invalidPipeArgumentError(DecimalPipe, error.message);
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: DecimalPipe, deps: [{ token: i0.LOCALE_ID }], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: DecimalPipe, isStandalone: true, name: "number" }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: DecimalPipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'number',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: undefined, decorators: [{
                      type: i0.Inject,
                      args: [i0.LOCALE_ID]
                  }] }] });
  /**
   * @ngModule CommonModule
   * @description
   *
   * Transforms a number to a percentage
   * string, formatted according to locale rules that determine group sizing and
   * separator, decimal-point character, and other locale-specific
   * configurations.
   *
   * @see {@link formatPercent}
   *
   * @usageNotes
   * The following code shows how the pipe transforms numbers
   * into text strings, according to various format specifications,
   * where the caller's default locale is `en-US`.
   *
   * <code-example path="common/pipes/ts/percent_pipe.ts" region='PercentPipe'></code-example>
   *
   * @publicApi
   */
  class PercentPipe {
      constructor(_locale) {
          this._locale = _locale;
      }
      /**
       *
       * @param value The number to be formatted as a percentage.
       * @param digitsInfo Decimal representation options, specified by a string
       * in the following format:<br>
       * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
       *   - `minIntegerDigits`: The minimum number of integer digits before the decimal point.
       * Default is `1`.
       *   - `minFractionDigits`: The minimum number of digits after the decimal point.
       * Default is `0`.
       *   - `maxFractionDigits`: The maximum number of digits after the decimal point.
       * Default is `0`.
       * @param locale A locale code for the locale format rules to use.
       * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
       * See [Setting your app locale](guide/i18n-common-locale-id).
       */
      transform(value, digitsInfo, locale) {
          if (!isValue(value))
              return null;
          locale ||= this._locale;
          try {
              const num = strToNumber(value);
              return formatPercent(num, locale, digitsInfo);
          }
          catch (error) {
              throw invalidPipeArgumentError(PercentPipe, error.message);
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PercentPipe, deps: [{ token: i0.LOCALE_ID }], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: PercentPipe, isStandalone: true, name: "percent" }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PercentPipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'percent',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: undefined, decorators: [{
                      type: i0.Inject,
                      args: [i0.LOCALE_ID]
                  }] }] });
  /**
   * @ngModule CommonModule
   * @description
   *
   * Transforms a number to a currency string, formatted according to locale rules
   * that determine group sizing and separator, decimal-point character,
   * and other locale-specific configurations.
   *
   *
   * @see {@link getCurrencySymbol}
   * @see {@link formatCurrency}
   *
   * @usageNotes
   * The following code shows how the pipe transforms numbers
   * into text strings, according to various format specifications,
   * where the caller's default locale is `en-US`.
   *
   * <code-example path="common/pipes/ts/currency_pipe.ts" region='CurrencyPipe'></code-example>
   *
   * @publicApi
   */
  class CurrencyPipe {
      constructor(_locale, _defaultCurrencyCode = 'USD') {
          this._locale = _locale;
          this._defaultCurrencyCode = _defaultCurrencyCode;
      }
      /**
       *
       * @param value The number to be formatted as currency.
       * @param currencyCode The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code,
       * such as `USD` for the US dollar and `EUR` for the euro. The default currency code can be
       * configured using the `DEFAULT_CURRENCY_CODE` injection token.
       * @param display The format for the currency indicator. One of the following:
       *   - `code`: Show the code (such as `USD`).
       *   - `symbol`(default): Show the symbol (such as `$`).
       *   - `symbol-narrow`: Use the narrow symbol for locales that have two symbols for their
       * currency.
       * For example, the Canadian dollar CAD has the symbol `CA$` and the symbol-narrow `$`. If the
       * locale has no narrow symbol, uses the standard symbol for the locale.
       *   - String: Use the given string value instead of a code or a symbol.
       * For example, an empty string will suppress the currency & symbol.
       *   - Boolean (marked deprecated in v5): `true` for symbol and false for `code`.
       *
       * @param digitsInfo Decimal representation options, specified by a string
       * in the following format:<br>
       * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
       *   - `minIntegerDigits`: The minimum number of integer digits before the decimal point.
       * Default is `1`.
       *   - `minFractionDigits`: The minimum number of digits after the decimal point.
       * Default is `2`.
       *   - `maxFractionDigits`: The maximum number of digits after the decimal point.
       * Default is `2`.
       * If not provided, the number will be formatted with the proper amount of digits,
       * depending on what the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) specifies.
       * For example, the Canadian dollar has 2 digits, whereas the Chilean peso has none.
       * @param locale A locale code for the locale format rules to use.
       * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
       * See [Setting your app locale](guide/i18n-common-locale-id).
       */
      transform(value, currencyCode = this._defaultCurrencyCode, display = 'symbol', digitsInfo, locale) {
          if (!isValue(value))
              return null;
          locale ||= this._locale;
          if (typeof display === 'boolean') {
              if ((typeof ngDevMode === 'undefined' || ngDevMode) && console && console.warn) {
                  console.warn(`Warning: the currency pipe has been changed in Angular v5. The symbolDisplay option (third parameter) is now a string instead of a boolean. The accepted values are "code", "symbol" or "symbol-narrow".`);
              }
              display = display ? 'symbol' : 'code';
          }
          let currency = currencyCode || this._defaultCurrencyCode;
          if (display !== 'code') {
              if (display === 'symbol' || display === 'symbol-narrow') {
                  currency = getCurrencySymbol(currency, display === 'symbol' ? 'wide' : 'narrow', locale);
              }
              else {
                  currency = display;
              }
          }
          try {
              const num = strToNumber(value);
              return formatCurrency(num, locale, currency, currencyCode, digitsInfo);
          }
          catch (error) {
              throw invalidPipeArgumentError(CurrencyPipe, error.message);
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: CurrencyPipe, deps: [{ token: i0.LOCALE_ID }, { token: i0.DEFAULT_CURRENCY_CODE }], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: CurrencyPipe, isStandalone: true, name: "currency" }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: CurrencyPipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'currency',
                      standalone: true,
                  }]
          }], ctorParameters: () => [{ type: undefined, decorators: [{
                      type: i0.Inject,
                      args: [i0.LOCALE_ID]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Inject,
                      args: [i0.DEFAULT_CURRENCY_CODE]
                  }] }] });
  function isValue(value) {
      return !(value == null || value === '' || value !== value);
  }
  /**
   * Transforms a string into a number (if needed).
   */
  function strToNumber(value) {
      // Convert strings to numbers
      if (typeof value === 'string' && !isNaN(Number(value) - parseFloat(value))) {
          return Number(value);
      }
      if (typeof value !== 'number') {
          throw new Error(`${value} is not a number`);
      }
      return value;
  }

  /**
   * @ngModule CommonModule
   * @description
   *
   * Creates a new `Array` or `String` containing a subset (slice) of the elements.
   *
   * @usageNotes
   *
   * All behavior is based on the expected behavior of the JavaScript API `Array.prototype.slice()`
   * and `String.prototype.slice()`.
   *
   * When operating on an `Array`, the returned `Array` is always a copy even when all
   * the elements are being returned.
   *
   * When operating on a blank value, the pipe returns the blank value.
   *
   * ### List Example
   *
   * This `ngFor` example:
   *
   * {@example common/pipes/ts/slice_pipe.ts region='SlicePipe_list'}
   *
   * produces the following:
   *
   * ```html
   * <li>b</li>
   * <li>c</li>
   * ```
   *
   * ### String Examples
   *
   * {@example common/pipes/ts/slice_pipe.ts region='SlicePipe_string'}
   *
   * @publicApi
   */
  class SlicePipe {
      transform(value, start, end) {
          if (value == null)
              return null;
          if (!this.supports(value)) {
              throw invalidPipeArgumentError(SlicePipe, value);
          }
          return value.slice(start, end);
      }
      supports(obj) {
          return typeof obj === 'string' || Array.isArray(obj);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: SlicePipe, deps: [], target: i0__namespace.ɵɵFactoryTarget.Pipe }); }
      static { this.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: SlicePipe, isStandalone: true, name: "slice", pure: false }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: SlicePipe, decorators: [{
              type: i0.Pipe,
              args: [{
                      name: 'slice',
                      pure: false,
                      standalone: true,
                  }]
          }] });

  /**
   * @module
   * @description
   * This module provides a set of common Pipes.
   */
  /**
   * A collection of Angular pipes that are likely to be used in each and every application.
   */
  const COMMON_PIPES = [
      AsyncPipe,
      UpperCasePipe,
      LowerCasePipe,
      JsonPipe,
      SlicePipe,
      DecimalPipe,
      PercentPipe,
      TitleCasePipe,
      CurrencyPipe,
      DatePipe,
      I18nPluralPipe,
      I18nSelectPipe,
      KeyValuePipe,
  ];

  // Note: This does not contain the location providers,
  // as they need some platform specific implementations to work.
  /**
   * Exports all the basic Angular directives and pipes,
   * such as `NgIf`, `NgForOf`, `DecimalPipe`, and so on.
   * Re-exported by `BrowserModule`, which is included automatically in the root
   * `AppModule` when you create a new app with the CLI `new` command.
   *
   * @publicApi
   */
  class CommonModule {
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: CommonModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule }); }
      static { this.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: CommonModule, imports: [NgClass, NgComponentOutlet, NgForOf, NgIf, NgTemplateOutlet, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault, NgPlural, NgPluralCase, AsyncPipe, UpperCasePipe, LowerCasePipe, JsonPipe, SlicePipe, DecimalPipe, PercentPipe, TitleCasePipe, CurrencyPipe, DatePipe, I18nPluralPipe, I18nSelectPipe, KeyValuePipe], exports: [NgClass, NgComponentOutlet, NgForOf, NgIf, NgTemplateOutlet, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault, NgPlural, NgPluralCase, AsyncPipe, UpperCasePipe, LowerCasePipe, JsonPipe, SlicePipe, DecimalPipe, PercentPipe, TitleCasePipe, CurrencyPipe, DatePipe, I18nPluralPipe, I18nSelectPipe, KeyValuePipe] }); }
      static { this.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: CommonModule }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: CommonModule, decorators: [{
              type: i0.NgModule,
              args: [{
                      imports: [COMMON_DIRECTIVES, COMMON_PIPES],
                      exports: [COMMON_DIRECTIVES, COMMON_PIPES],
                  }]
          }] });

  const PLATFORM_BROWSER_ID = 'browser';
  const PLATFORM_SERVER_ID = 'server';
  const PLATFORM_WORKER_APP_ID = 'browserWorkerApp';
  const PLATFORM_WORKER_UI_ID = 'browserWorkerUi';
  /**
   * Returns whether a platform id represents a browser platform.
   * @publicApi
   */
  function isPlatformBrowser(platformId) {
      return platformId === PLATFORM_BROWSER_ID;
  }
  /**
   * Returns whether a platform id represents a server platform.
   * @publicApi
   */
  function isPlatformServer(platformId) {
      return platformId === PLATFORM_SERVER_ID;
  }
  /**
   * Returns whether a platform id represents a web worker app platform.
   * @publicApi
   * @deprecated This function serves no purpose since the removal of the Webworker platform. It will
   *     always return `false`.
   */
  function isPlatformWorkerApp(platformId) {
      return platformId === PLATFORM_WORKER_APP_ID;
  }
  /**
   * Returns whether a platform id represents a web worker UI platform.
   * @publicApi
   * @deprecated This function serves no purpose since the removal of the Webworker platform. It will
   *     always return `false`.
   */
  function isPlatformWorkerUi(platformId) {
      return platformId === PLATFORM_WORKER_UI_ID;
  }

  /**
   * @module
   * @description
   * Entry point for all public APIs of the common package.
   */
  /**
   * @publicApi
   */
  const VERSION = new i0.Version('17.3.0');

  /**
   * Defines a scroll position manager. Implemented by `BrowserViewportScroller`.
   *
   * @publicApi
   */
  class ViewportScroller {
      // De-sugared tree-shakable injection
      // See #23917
      /** @nocollapse */
      static { this.ɵprov = i0.ɵɵdefineInjectable({
          token: ViewportScroller,
          providedIn: 'root',
          factory: () => isPlatformBrowser(i0.inject(i0.PLATFORM_ID))
              ? new BrowserViewportScroller(i0.inject(DOCUMENT), window)
              : new NullViewportScroller(),
      }); }
  }
  /**
   * Manages the scroll position for a browser window.
   */
  class BrowserViewportScroller {
      constructor(document, window) {
          this.document = document;
          this.window = window;
          this.offset = () => [0, 0];
      }
      /**
       * Configures the top offset used when scrolling to an anchor.
       * @param offset A position in screen coordinates (a tuple with x and y values)
       * or a function that returns the top offset position.
       *
       */
      setOffset(offset) {
          if (Array.isArray(offset)) {
              this.offset = () => offset;
          }
          else {
              this.offset = offset;
          }
      }
      /**
       * Retrieves the current scroll position.
       * @returns The position in screen coordinates.
       */
      getScrollPosition() {
          return [this.window.scrollX, this.window.scrollY];
      }
      /**
       * Sets the scroll position.
       * @param position The new position in screen coordinates.
       */
      scrollToPosition(position) {
          this.window.scrollTo(position[0], position[1]);
      }
      /**
       * Scrolls to an element and attempts to focus the element.
       *
       * Note that the function name here is misleading in that the target string may be an ID for a
       * non-anchor element.
       *
       * @param target The ID of an element or name of the anchor.
       *
       * @see https://html.spec.whatwg.org/#the-indicated-part-of-the-document
       * @see https://html.spec.whatwg.org/#scroll-to-fragid
       */
      scrollToAnchor(target) {
          const elSelected = findAnchorFromDocument(this.document, target);
          if (elSelected) {
              this.scrollToElement(elSelected);
              // After scrolling to the element, the spec dictates that we follow the focus steps for the
              // target. Rather than following the robust steps, simply attempt focus.
              //
              // @see https://html.spec.whatwg.org/#get-the-focusable-area
              // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus
              // @see https://html.spec.whatwg.org/#focusable-area
              elSelected.focus();
          }
      }
      /**
       * Disables automatic scroll restoration provided by the browser.
       */
      setHistoryScrollRestoration(scrollRestoration) {
          this.window.history.scrollRestoration = scrollRestoration;
      }
      /**
       * Scrolls to an element using the native offset and the specified offset set on this scroller.
       *
       * The offset can be used when we know that there is a floating header and scrolling naively to an
       * element (ex: `scrollIntoView`) leaves the element hidden behind the floating header.
       */
      scrollToElement(el) {
          const rect = el.getBoundingClientRect();
          const left = rect.left + this.window.pageXOffset;
          const top = rect.top + this.window.pageYOffset;
          const offset = this.offset();
          this.window.scrollTo(left - offset[0], top - offset[1]);
      }
  }
  function findAnchorFromDocument(document, target) {
      const documentResult = document.getElementById(target) || document.getElementsByName(target)[0];
      if (documentResult) {
          return documentResult;
      }
      // `getElementById` and `getElementsByName` won't pierce through the shadow DOM so we
      // have to traverse the DOM manually and do the lookup through the shadow roots.
      if (typeof document.createTreeWalker === 'function' &&
          document.body &&
          typeof document.body.attachShadow === 'function') {
          const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
          let currentNode = treeWalker.currentNode;
          while (currentNode) {
              const shadowRoot = currentNode.shadowRoot;
              if (shadowRoot) {
                  // Note that `ShadowRoot` doesn't support `getElementsByName`
                  // so we have to fall back to `querySelector`.
                  const result = shadowRoot.getElementById(target) || shadowRoot.querySelector(`[name="${target}"]`);
                  if (result) {
                      return result;
                  }
              }
              currentNode = treeWalker.nextNode();
          }
      }
      return null;
  }
  /**
   * Provides an empty implementation of the viewport scroller.
   */
  class NullViewportScroller {
      /**
       * Empty implementation
       */
      setOffset(offset) { }
      /**
       * Empty implementation
       */
      getScrollPosition() {
          return [0, 0];
      }
      /**
       * Empty implementation
       */
      scrollToPosition(position) { }
      /**
       * Empty implementation
       */
      scrollToAnchor(anchor) { }
      /**
       * Empty implementation
       */
      setHistoryScrollRestoration(scrollRestoration) { }
  }

  /**
   * A wrapper around the `XMLHttpRequest` constructor.
   *
   * @publicApi
   */
  class XhrFactory {
  }

  // Converts a string that represents a URL into a URL class instance.
  function getUrl(src, win) {
      // Don't use a base URL is the URL is absolute.
      return isAbsoluteUrl(src) ? new URL(src) : new URL(src, win.location.href);
  }
  // Checks whether a URL is absolute (i.e. starts with `http://` or `https://`).
  function isAbsoluteUrl(src) {
      return /^https?:\/\//.test(src);
  }
  // Given a URL, extract the hostname part.
  // If a URL is a relative one - the URL is returned as is.
  function extractHostname(url) {
      return isAbsoluteUrl(url) ? new URL(url).hostname : url;
  }
  function isValidPath(path) {
      const isString = typeof path === 'string';
      if (!isString || path.trim() === '') {
          return false;
      }
      // Calling new URL() will throw if the path string is malformed
      try {
          const url = new URL(path);
          return true;
      }
      catch {
          return false;
      }
  }
  function normalizePath(path) {
      return path.endsWith('/') ? path.slice(0, -1) : path;
  }
  function normalizeSrc(src) {
      return src.startsWith('/') ? src.slice(1) : src;
  }

  /**
   * Noop image loader that does no transformation to the original src and just returns it as is.
   * This loader is used as a default one if more specific logic is not provided in an app config.
   *
   * @see {@link ImageLoader}
   * @see {@link NgOptimizedImage}
   */
  const noopImageLoader = (config) => config.src;
  /**
   * Injection token that configures the image loader function.
   *
   * @see {@link ImageLoader}
   * @see {@link NgOptimizedImage}
   * @publicApi
   */
  const IMAGE_LOADER = new i0.InjectionToken(ngDevMode ? 'ImageLoader' : '', {
      providedIn: 'root',
      factory: () => noopImageLoader,
  });
  /**
   * Internal helper function that makes it easier to introduce custom image loaders for the
   * `NgOptimizedImage` directive. It is enough to specify a URL builder function to obtain full DI
   * configuration for a given loader: a DI token corresponding to the actual loader function, plus DI
   * tokens managing preconnect check functionality.
   * @param buildUrlFn a function returning a full URL based on loader's configuration
   * @param exampleUrls example of full URLs for a given loader (used in error messages)
   * @returns a set of DI providers corresponding to the configured image loader
   */
  function createImageLoader(buildUrlFn, exampleUrls) {
      return function provideImageLoader(path) {
          if (!isValidPath(path)) {
              throwInvalidPathError(path, exampleUrls || []);
          }
          // The trailing / is stripped (if provided) to make URL construction (concatenation) easier in
          // the individual loader functions.
          path = normalizePath(path);
          const loaderFn = (config) => {
              if (isAbsoluteUrl(config.src)) {
                  // Image loader functions expect an image file name (e.g. `my-image.png`)
                  // or a relative path + a file name (e.g. `/a/b/c/my-image.png`) as an input,
                  // so the final absolute URL can be constructed.
                  // When an absolute URL is provided instead - the loader can not
                  // build a final URL, thus the error is thrown to indicate that.
                  throwUnexpectedAbsoluteUrlError(path, config.src);
              }
              return buildUrlFn(path, { ...config, src: normalizeSrc(config.src) });
          };
          const providers = [{ provide: IMAGE_LOADER, useValue: loaderFn }];
          return providers;
      };
  }
  function throwInvalidPathError(path, exampleUrls) {
      throw new i0.ɵRuntimeError(2959 /* RuntimeErrorCode.INVALID_LOADER_ARGUMENTS */, ngDevMode &&
          `Image loader has detected an invalid path (\`${path}\`). ` +
              `To fix this, supply a path using one of the following formats: ${exampleUrls.join(' or ')}`);
  }
  function throwUnexpectedAbsoluteUrlError(path, url) {
      throw new i0.ɵRuntimeError(2959 /* RuntimeErrorCode.INVALID_LOADER_ARGUMENTS */, ngDevMode &&
          `Image loader has detected a \`<img>\` tag with an invalid \`ngSrc\` attribute: ${url}. ` +
              `This image loader expects \`ngSrc\` to be a relative URL - ` +
              `however the provided value is an absolute URL. ` +
              `To fix this, provide \`ngSrc\` as a path relative to the base URL ` +
              `configured for this loader (\`${path}\`).`);
  }

  /**
   * Function that generates an ImageLoader for [Cloudflare Image
   * Resizing](https://developers.cloudflare.com/images/image-resizing/) and turns it into an Angular
   * provider. Note: Cloudflare has multiple image products - this provider is specifically for
   * Cloudflare Image Resizing; it will not work with Cloudflare Images or Cloudflare Polish.
   *
   * @param path Your domain name, e.g. https://mysite.com
   * @returns Provider that provides an ImageLoader function
   *
   * @publicApi
   */
  const provideCloudflareLoader = createImageLoader(createCloudflareUrl, ngDevMode ? ['https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>'] : undefined);
  function createCloudflareUrl(path, config) {
      let params = `format=auto`;
      if (config.width) {
          params += `,width=${config.width}`;
      }
      // Cloudflare image URLs format:
      // https://developers.cloudflare.com/images/image-resizing/url-format/
      return `${path}/cdn-cgi/image/${params}/${config.src}`;
  }

  /**
   * Name and URL tester for Cloudinary.
   */
  const cloudinaryLoaderInfo = {
      name: 'Cloudinary',
      testUrl: isCloudinaryUrl,
  };
  const CLOUDINARY_LOADER_REGEX = /https?\:\/\/[^\/]+\.cloudinary\.com\/.+/;
  /**
   * Tests whether a URL is from Cloudinary CDN.
   */
  function isCloudinaryUrl(url) {
      return CLOUDINARY_LOADER_REGEX.test(url);
  }
  /**
   * Function that generates an ImageLoader for Cloudinary and turns it into an Angular provider.
   *
   * @param path Base URL of your Cloudinary images
   * This URL should match one of the following formats:
   * https://res.cloudinary.com/mysite
   * https://mysite.cloudinary.com
   * https://subdomain.mysite.com
   * @returns Set of providers to configure the Cloudinary loader.
   *
   * @publicApi
   */
  const provideCloudinaryLoader = createImageLoader(createCloudinaryUrl, ngDevMode
      ? [
          'https://res.cloudinary.com/mysite',
          'https://mysite.cloudinary.com',
          'https://subdomain.mysite.com',
      ]
      : undefined);
  function createCloudinaryUrl(path, config) {
      // Cloudinary image URLformat:
      // https://cloudinary.com/documentation/image_transformations#transformation_url_structure
      // Example of a Cloudinary image URL:
      // https://res.cloudinary.com/mysite/image/upload/c_scale,f_auto,q_auto,w_600/marketing/tile-topics-m.png
      let params = `f_auto,q_auto`; // sets image format and quality to "auto"
      if (config.width) {
          params += `,w_${config.width}`;
      }
      return `${path}/image/upload/${params}/${config.src}`;
  }

  /**
   * Name and URL tester for ImageKit.
   */
  const imageKitLoaderInfo = {
      name: 'ImageKit',
      testUrl: isImageKitUrl,
  };
  const IMAGE_KIT_LOADER_REGEX = /https?\:\/\/[^\/]+\.imagekit\.io\/.+/;
  /**
   * Tests whether a URL is from ImageKit CDN.
   */
  function isImageKitUrl(url) {
      return IMAGE_KIT_LOADER_REGEX.test(url);
  }
  /**
   * Function that generates an ImageLoader for ImageKit and turns it into an Angular provider.
   *
   * @param path Base URL of your ImageKit images
   * This URL should match one of the following formats:
   * https://ik.imagekit.io/myaccount
   * https://subdomain.mysite.com
   * @returns Set of providers to configure the ImageKit loader.
   *
   * @publicApi
   */
  const provideImageKitLoader = createImageLoader(createImagekitUrl, ngDevMode ? ['https://ik.imagekit.io/mysite', 'https://subdomain.mysite.com'] : undefined);
  function createImagekitUrl(path, config) {
      // Example of an ImageKit image URL:
      // https://ik.imagekit.io/demo/tr:w-300,h-300/medium_cafe_B1iTdD0C.jpg
      const { src, width } = config;
      let urlSegments;
      if (width) {
          const params = `tr:w-${width}`;
          urlSegments = [path, params, src];
      }
      else {
          urlSegments = [path, src];
      }
      return urlSegments.join('/');
  }

  /**
   * Name and URL tester for Imgix.
   */
  const imgixLoaderInfo = {
      name: 'Imgix',
      testUrl: isImgixUrl,
  };
  const IMGIX_LOADER_REGEX = /https?\:\/\/[^\/]+\.imgix\.net\/.+/;
  /**
   * Tests whether a URL is from Imgix CDN.
   */
  function isImgixUrl(url) {
      return IMGIX_LOADER_REGEX.test(url);
  }
  /**
   * Function that generates an ImageLoader for Imgix and turns it into an Angular provider.
   *
   * @param path path to the desired Imgix origin,
   * e.g. https://somepath.imgix.net or https://images.mysite.com
   * @returns Set of providers to configure the Imgix loader.
   *
   * @publicApi
   */
  const provideImgixLoader = createImageLoader(createImgixUrl, ngDevMode ? ['https://somepath.imgix.net/'] : undefined);
  function createImgixUrl(path, config) {
      const url = new URL(`${path}/${config.src}`);
      // This setting ensures the smallest allowable format is set.
      url.searchParams.set('auto', 'format');
      if (config.width) {
          url.searchParams.set('w', config.width.toString());
      }
      return url.href;
  }

  /**
   * Name and URL tester for Netlify.
   */
  const netlifyLoaderInfo = {
      name: 'Netlify',
      testUrl: isNetlifyUrl,
  };
  const NETLIFY_LOADER_REGEX = /https?\:\/\/[^\/]+\.netlify\.app\/.+/;
  /**
   * Tests whether a URL is from a Netlify site. This won't catch sites with a custom domain,
   * but it's a good start for sites in development. This is only used to warn users who haven't
   * configured an image loader.
   */
  function isNetlifyUrl(url) {
      return NETLIFY_LOADER_REGEX.test(url);
  }
  /**
   * Function that generates an ImageLoader for Netlify and turns it into an Angular provider.
   *
   * @param path optional URL of the desired Netlify site. Defaults to the current site.
   * @returns Set of providers to configure the Netlify loader.
   *
   * @publicApi
   */
  function provideNetlifyLoader(path) {
      if (path && !isValidPath(path)) {
          throw new i0.ɵRuntimeError(2959 /* RuntimeErrorCode.INVALID_LOADER_ARGUMENTS */, ngDevMode &&
              `Image loader has detected an invalid path (\`${path}\`). ` +
                  `To fix this, supply either the full URL to the Netlify site, or leave it empty to use the current site.`);
      }
      if (path) {
          const url = new URL(path);
          path = url.origin;
      }
      const loaderFn = (config) => {
          return createNetlifyUrl(config, path);
      };
      const providers = [{ provide: IMAGE_LOADER, useValue: loaderFn }];
      return providers;
  }
  const validParams = new Map([
      ['height', 'h'],
      ['fit', 'fit'],
      ['quality', 'q'],
      ['q', 'q'],
      ['position', 'position'],
  ]);
  function createNetlifyUrl(config, path) {
      // Note: `path` can be undefined, in which case we use a fake one to construct a `URL` instance.
      const url = new URL(path ?? 'https://a/');
      url.pathname = '/.netlify/images';
      if (!isAbsoluteUrl(config.src) && !config.src.startsWith('/')) {
          config.src = '/' + config.src;
      }
      url.searchParams.set('url', config.src);
      if (config.width) {
          url.searchParams.set('w', config.width.toString());
      }
      for (const [param, value] of Object.entries(config.loaderParams ?? {})) {
          if (validParams.has(param)) {
              url.searchParams.set(validParams.get(param), value.toString());
          }
          else {
              if (ngDevMode) {
                  console.warn(i0.ɵformatRuntimeError(2959 /* RuntimeErrorCode.INVALID_LOADER_ARGUMENTS */, `The Netlify image loader has detected an \`<img>\` tag with the unsupported attribute "\`${param}\`".`));
              }
          }
      }
      // The "a" hostname is used for relative URLs, so we can remove it from the final URL.
      return url.hostname === 'a' ? url.href.replace(url.origin, '') : url.href;
  }

  // Assembles directive details string, useful for error messages.
  function imgDirectiveDetails(ngSrc, includeNgSrc = true) {
      const ngSrcInfo = includeNgSrc
          ? `(activated on an <img> element with the \`ngSrc="${ngSrc}"\`) `
          : '';
      return `The NgOptimizedImage directive ${ngSrcInfo}has detected that`;
  }

  /**
   * Asserts that the application is in development mode. Throws an error if the application is in
   * production mode. This assert can be used to make sure that there is no dev-mode code invoked in
   * the prod mode accidentally.
   */
  function assertDevMode(checkName) {
      if (!ngDevMode) {
          throw new i0.ɵRuntimeError(2958 /* RuntimeErrorCode.UNEXPECTED_DEV_MODE_CHECK_IN_PROD_MODE */, `Unexpected invocation of the ${checkName} in the prod mode. ` +
              `Please make sure that the prod mode is enabled for production builds.`);
      }
  }

  /**
   * Observer that detects whether an image with `NgOptimizedImage`
   * is treated as a Largest Contentful Paint (LCP) element. If so,
   * asserts that the image has the `priority` attribute.
   *
   * Note: this is a dev-mode only class and it does not appear in prod bundles,
   * thus there is no `ngDevMode` use in the code.
   *
   * Based on https://web.dev/lcp/#measure-lcp-in-javascript.
   */
  class LCPImageObserver {
      constructor() {
          // Map of full image URLs -> original `ngSrc` values.
          this.images = new Map();
          this.window = null;
          this.observer = null;
          assertDevMode('LCP checker');
          const win = i0.inject(DOCUMENT).defaultView;
          if (typeof win !== 'undefined' && typeof PerformanceObserver !== 'undefined') {
              this.window = win;
              this.observer = this.initPerformanceObserver();
          }
      }
      /**
       * Inits PerformanceObserver and subscribes to LCP events.
       * Based on https://web.dev/lcp/#measure-lcp-in-javascript
       */
      initPerformanceObserver() {
          const observer = new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries();
              if (entries.length === 0)
                  return;
              // We use the latest entry produced by the `PerformanceObserver` as the best
              // signal on which element is actually an LCP one. As an example, the first image to load on
              // a page, by virtue of being the only thing on the page so far, is often a LCP candidate
              // and gets reported by PerformanceObserver, but isn't necessarily the LCP element.
              const lcpElement = entries[entries.length - 1];
              // Cast to `any` due to missing `element` on the `LargestContentfulPaint` type of entry.
              // See https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint
              const imgSrc = lcpElement.element?.src ?? '';
              // Exclude `data:` and `blob:` URLs, since they are not supported by the directive.
              if (imgSrc.startsWith('data:') || imgSrc.startsWith('blob:'))
                  return;
              const img = this.images.get(imgSrc);
              if (!img)
                  return;
              if (!img.priority && !img.alreadyWarnedPriority) {
                  img.alreadyWarnedPriority = true;
                  logMissingPriorityError(imgSrc);
              }
              if (img.modified && !img.alreadyWarnedModified) {
                  img.alreadyWarnedModified = true;
                  logModifiedWarning(imgSrc);
              }
          });
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
          return observer;
      }
      registerImage(rewrittenSrc, originalNgSrc, isPriority) {
          if (!this.observer)
              return;
          const newObservedImageState = {
              priority: isPriority,
              modified: false,
              alreadyWarnedModified: false,
              alreadyWarnedPriority: false,
          };
          this.images.set(getUrl(rewrittenSrc, this.window).href, newObservedImageState);
      }
      unregisterImage(rewrittenSrc) {
          if (!this.observer)
              return;
          this.images.delete(getUrl(rewrittenSrc, this.window).href);
      }
      updateImage(originalSrc, newSrc) {
          const originalUrl = getUrl(originalSrc, this.window).href;
          const img = this.images.get(originalUrl);
          if (img) {
              img.modified = true;
              this.images.set(getUrl(newSrc, this.window).href, img);
              this.images.delete(originalUrl);
          }
      }
      ngOnDestroy() {
          if (!this.observer)
              return;
          this.observer.disconnect();
          this.images.clear();
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: LCPImageObserver, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: LCPImageObserver, providedIn: 'root' }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: LCPImageObserver, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'root' }]
          }], ctorParameters: () => [] });
  function logMissingPriorityError(ngSrc) {
      const directiveDetails = imgDirectiveDetails(ngSrc);
      console.error(i0.ɵformatRuntimeError(2955 /* RuntimeErrorCode.LCP_IMG_MISSING_PRIORITY */, `${directiveDetails} this image is the Largest Contentful Paint (LCP) ` +
          `element but was not marked "priority". This image should be marked ` +
          `"priority" in order to prioritize its loading. ` +
          `To fix this, add the "priority" attribute.`));
  }
  function logModifiedWarning(ngSrc) {
      const directiveDetails = imgDirectiveDetails(ngSrc);
      console.warn(i0.ɵformatRuntimeError(2964 /* RuntimeErrorCode.LCP_IMG_NGSRC_MODIFIED */, `${directiveDetails} this image is the Largest Contentful Paint (LCP) ` +
          `element and has had its "ngSrc" attribute modified. This can cause ` +
          `slower loading performance. It is recommended not to modify the "ngSrc" ` +
          `property on any image which could be the LCP element.`));
  }

  // Set of origins that are always excluded from the preconnect checks.
  const INTERNAL_PRECONNECT_CHECK_BLOCKLIST = new Set(['localhost', '127.0.0.1', '0.0.0.0']);
  /**
   * Injection token to configure which origins should be excluded
   * from the preconnect checks. It can either be a single string or an array of strings
   * to represent a group of origins, for example:
   *
   * ```typescript
   *  {provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
   * ```
   *
   * or:
   *
   * ```typescript
   *  {provide: PRECONNECT_CHECK_BLOCKLIST,
   *   useValue: ['https://your-domain-1.com', 'https://your-domain-2.com']}
   * ```
   *
   * @publicApi
   */
  const PRECONNECT_CHECK_BLOCKLIST = new i0.InjectionToken(ngDevMode ? 'PRECONNECT_CHECK_BLOCKLIST' : '');
  /**
   * Contains the logic to detect whether an image, marked with the "priority" attribute
   * has a corresponding `<link rel="preconnect">` tag in the `document.head`.
   *
   * Note: this is a dev-mode only class, which should not appear in prod bundles,
   * thus there is no `ngDevMode` use in the code.
   */
  class PreconnectLinkChecker {
      constructor() {
          this.document = i0.inject(DOCUMENT);
          /**
           * Set of <link rel="preconnect"> tags found on this page.
           * The `null` value indicates that there was no DOM query operation performed.
           */
          this.preconnectLinks = null;
          /*
           * Keep track of all already seen origin URLs to avoid repeating the same check.
           */
          this.alreadySeen = new Set();
          this.window = null;
          this.blocklist = new Set(INTERNAL_PRECONNECT_CHECK_BLOCKLIST);
          assertDevMode('preconnect link checker');
          const win = this.document.defaultView;
          if (typeof win !== 'undefined') {
              this.window = win;
          }
          const blocklist = i0.inject(PRECONNECT_CHECK_BLOCKLIST, { optional: true });
          if (blocklist) {
              this.populateBlocklist(blocklist);
          }
      }
      populateBlocklist(origins) {
          if (Array.isArray(origins)) {
              deepForEach(origins, (origin) => {
                  this.blocklist.add(extractHostname(origin));
              });
          }
          else {
              this.blocklist.add(extractHostname(origins));
          }
      }
      /**
       * Checks that a preconnect resource hint exists in the head for the
       * given src.
       *
       * @param rewrittenSrc src formatted with loader
       * @param originalNgSrc ngSrc value
       */
      assertPreconnect(rewrittenSrc, originalNgSrc) {
          if (!this.window)
              return;
          const imgUrl = getUrl(rewrittenSrc, this.window);
          if (this.blocklist.has(imgUrl.hostname) || this.alreadySeen.has(imgUrl.origin))
              return;
          // Register this origin as seen, so we don't check it again later.
          this.alreadySeen.add(imgUrl.origin);
          // Note: we query for preconnect links only *once* and cache the results
          // for the entire lifespan of an application, since it's unlikely that the
          // list would change frequently. This allows to make sure there are no
          // performance implications of making extra DOM lookups for each image.
          this.preconnectLinks ??= this.queryPreconnectLinks();
          if (!this.preconnectLinks.has(imgUrl.origin)) {
              console.warn(i0.ɵformatRuntimeError(2956 /* RuntimeErrorCode.PRIORITY_IMG_MISSING_PRECONNECT_TAG */, `${imgDirectiveDetails(originalNgSrc)} there is no preconnect tag present for this ` +
                  `image. Preconnecting to the origin(s) that serve priority images ensures that these ` +
                  `images are delivered as soon as possible. To fix this, please add the following ` +
                  `element into the <head> of the document:\n` +
                  `  <link rel="preconnect" href="${imgUrl.origin}">`));
          }
      }
      queryPreconnectLinks() {
          const preconnectUrls = new Set();
          const selector = 'link[rel=preconnect]';
          const links = Array.from(this.document.querySelectorAll(selector));
          for (let link of links) {
              const url = getUrl(link.href, this.window);
              preconnectUrls.add(url.origin);
          }
          return preconnectUrls;
      }
      ngOnDestroy() {
          this.preconnectLinks?.clear();
          this.alreadySeen.clear();
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PreconnectLinkChecker, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PreconnectLinkChecker, providedIn: 'root' }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PreconnectLinkChecker, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'root' }]
          }], ctorParameters: () => [] });
  /**
   * Invokes a callback for each element in the array. Also invokes a callback
   * recursively for each nested array.
   */
  function deepForEach(input, fn) {
      for (let value of input) {
          Array.isArray(value) ? deepForEach(value, fn) : fn(value);
      }
  }

  /**
   * In SSR scenarios, a preload `<link>` element is generated for priority images.
   * Having a large number of preload tags may negatively affect the performance,
   * so we warn developers (by throwing an error) if the number of preloaded images
   * is above a certain threshold. This const specifies this threshold.
   */
  const DEFAULT_PRELOADED_IMAGES_LIMIT = 5;
  /**
   * Helps to keep track of priority images that already have a corresponding
   * preload tag (to avoid generating multiple preload tags with the same URL).
   *
   * This Set tracks the original src passed into the `ngSrc` input not the src after it has been
   * run through the specified `IMAGE_LOADER`.
   */
  const PRELOADED_IMAGES = new i0.InjectionToken('NG_OPTIMIZED_PRELOADED_IMAGES', {
      providedIn: 'root',
      factory: () => new Set(),
  });

  /**
   * @description Contains the logic needed to track and add preload link tags to the `<head>` tag. It
   * will also track what images have already had preload link tags added so as to not duplicate link
   * tags.
   *
   * In dev mode this service will validate that the number of preloaded images does not exceed the
   * configured default preloaded images limit: {@link DEFAULT_PRELOADED_IMAGES_LIMIT}.
   */
  class PreloadLinkCreator {
      constructor() {
          this.preloadedImages = i0.inject(PRELOADED_IMAGES);
          this.document = i0.inject(DOCUMENT);
      }
      /**
       * @description Add a preload `<link>` to the `<head>` of the `index.html` that is served from the
       * server while using Angular Universal and SSR to kick off image loads for high priority images.
       *
       * The `sizes` (passed in from the user) and `srcset` (parsed and formatted from `ngSrcset`)
       * properties used to set the corresponding attributes, `imagesizes` and `imagesrcset`
       * respectively, on the preload `<link>` tag so that the correctly sized image is preloaded from
       * the CDN.
       *
       * {@link https://web.dev/preload-responsive-images/#imagesrcset-and-imagesizes}
       *
       * @param renderer The `Renderer2` passed in from the directive
       * @param src The original src of the image that is set on the `ngSrc` input.
       * @param srcset The parsed and formatted srcset created from the `ngSrcset` input
       * @param sizes The value of the `sizes` attribute passed in to the `<img>` tag
       */
      createPreloadLinkTag(renderer, src, srcset, sizes) {
          if (ngDevMode) {
              if (this.preloadedImages.size >= DEFAULT_PRELOADED_IMAGES_LIMIT) {
                  throw new i0.ɵRuntimeError(2961 /* RuntimeErrorCode.TOO_MANY_PRELOADED_IMAGES */, ngDevMode &&
                      `The \`NgOptimizedImage\` directive has detected that more than ` +
                          `${DEFAULT_PRELOADED_IMAGES_LIMIT} images were marked as priority. ` +
                          `This might negatively affect an overall performance of the page. ` +
                          `To fix this, remove the "priority" attribute from images with less priority.`);
              }
          }
          if (this.preloadedImages.has(src)) {
              return;
          }
          this.preloadedImages.add(src);
          const preload = renderer.createElement('link');
          renderer.setAttribute(preload, 'as', 'image');
          renderer.setAttribute(preload, 'href', src);
          renderer.setAttribute(preload, 'rel', 'preload');
          renderer.setAttribute(preload, 'fetchpriority', 'high');
          if (sizes) {
              renderer.setAttribute(preload, 'imageSizes', sizes);
          }
          if (srcset) {
              renderer.setAttribute(preload, 'imageSrcset', srcset);
          }
          renderer.appendChild(this.document.head, preload);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PreloadLinkCreator, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PreloadLinkCreator, providedIn: 'root' }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PreloadLinkCreator, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'root' }]
          }] });

  /**
   * When a Base64-encoded image is passed as an input to the `NgOptimizedImage` directive,
   * an error is thrown. The image content (as a string) might be very long, thus making
   * it hard to read an error message if the entire string is included. This const defines
   * the number of characters that should be included into the error message. The rest
   * of the content is truncated.
   */
  const BASE64_IMG_MAX_LENGTH_IN_ERROR = 50;
  /**
   * RegExpr to determine whether a src in a srcset is using width descriptors.
   * Should match something like: "100w, 200w".
   */
  const VALID_WIDTH_DESCRIPTOR_SRCSET = /^((\s*\d+w\s*(,|$)){1,})$/;
  /**
   * RegExpr to determine whether a src in a srcset is using density descriptors.
   * Should match something like: "1x, 2x, 50x". Also supports decimals like "1.5x, 1.50x".
   */
  const VALID_DENSITY_DESCRIPTOR_SRCSET = /^((\s*\d+(\.\d+)?x\s*(,|$)){1,})$/;
  /**
   * Srcset values with a density descriptor higher than this value will actively
   * throw an error. Such densities are not permitted as they cause image sizes
   * to be unreasonably large and slow down LCP.
   */
  const ABSOLUTE_SRCSET_DENSITY_CAP = 3;
  /**
   * Used only in error message text to communicate best practices, as we will
   * only throw based on the slightly more conservative ABSOLUTE_SRCSET_DENSITY_CAP.
   */
  const RECOMMENDED_SRCSET_DENSITY_CAP = 2;
  /**
   * Used in generating automatic density-based srcsets
   */
  const DENSITY_SRCSET_MULTIPLIERS = [1, 2];
  /**
   * Used to determine which breakpoints to use on full-width images
   */
  const VIEWPORT_BREAKPOINT_CUTOFF = 640;
  /**
   * Used to determine whether two aspect ratios are similar in value.
   */
  const ASPECT_RATIO_TOLERANCE = 0.1;
  /**
   * Used to determine whether the image has been requested at an overly
   * large size compared to the actual rendered image size (after taking
   * into account a typical device pixel ratio). In pixels.
   */
  const OVERSIZED_IMAGE_TOLERANCE = 1000;
  /**
   * Used to limit automatic srcset generation of very large sources for
   * fixed-size images. In pixels.
   */
  const FIXED_SRCSET_WIDTH_LIMIT = 1920;
  const FIXED_SRCSET_HEIGHT_LIMIT = 1080;
  /**
   * Default blur radius of the CSS filter used on placeholder images, in pixels
   */
  const PLACEHOLDER_BLUR_AMOUNT = 15;
  /**
   * Used to warn or error when the user provides an overly large dataURL for the placeholder
   * attribute.
   * Character count of Base64 images is 1 character per byte, and base64 encoding is approximately
   * 33% larger than base images, so 4000 characters is around 3KB on disk and 10000 characters is
   * around 7.7KB. Experimentally, 4000 characters is about 20x20px in PNG or medium-quality JPEG
   * format, and 10,000 is around 50x50px, but there's quite a bit of variation depending on how the
   * image is saved.
   */
  const DATA_URL_WARN_LIMIT = 4000;
  const DATA_URL_ERROR_LIMIT = 10000;
  /** Info about built-in loaders we can test for. */
  const BUILT_IN_LOADERS = [
      imgixLoaderInfo,
      imageKitLoaderInfo,
      cloudinaryLoaderInfo,
      netlifyLoaderInfo,
  ];
  /**
   * Directive that improves image loading performance by enforcing best practices.
   *
   * `NgOptimizedImage` ensures that the loading of the Largest Contentful Paint (LCP) image is
   * prioritized by:
   * - Automatically setting the `fetchpriority` attribute on the `<img>` tag
   * - Lazy loading non-priority images by default
   * - Automatically generating a preconnect link tag in the document head
   *
   * In addition, the directive:
   * - Generates appropriate asset URLs if a corresponding `ImageLoader` function is provided
   * - Automatically generates a srcset
   * - Requires that `width` and `height` are set
   * - Warns if `width` or `height` have been set incorrectly
   * - Warns if the image will be visually distorted when rendered
   *
   * @usageNotes
   * The `NgOptimizedImage` directive is marked as [standalone](guide/standalone-components) and can
   * be imported directly.
   *
   * Follow the steps below to enable and use the directive:
   * 1. Import it into the necessary NgModule or a standalone Component.
   * 2. Optionally provide an `ImageLoader` if you use an image hosting service.
   * 3. Update the necessary `<img>` tags in templates and replace `src` attributes with `ngSrc`.
   * Using a `ngSrc` allows the directive to control when the `src` gets set, which triggers an image
   * download.
   *
   * Step 1: import the `NgOptimizedImage` directive.
   *
   * ```typescript
   * import { NgOptimizedImage } from '@angular/common';
   *
   * // Include it into the necessary NgModule
   * @NgModule({
   *   imports: [NgOptimizedImage],
   * })
   * class AppModule {}
   *
   * // ... or a standalone Component
   * @Component({
   *   standalone: true
   *   imports: [NgOptimizedImage],
   * })
   * class MyStandaloneComponent {}
   * ```
   *
   * Step 2: configure a loader.
   *
   * To use the **default loader**: no additional code changes are necessary. The URL returned by the
   * generic loader will always match the value of "src". In other words, this loader applies no
   * transformations to the resource URL and the value of the `ngSrc` attribute will be used as is.
   *
   * To use an existing loader for a **third-party image service**: add the provider factory for your
   * chosen service to the `providers` array. In the example below, the Imgix loader is used:
   *
   * ```typescript
   * import {provideImgixLoader} from '@angular/common';
   *
   * // Call the function and add the result to the `providers` array:
   * providers: [
   *   provideImgixLoader("https://my.base.url/"),
   * ],
   * ```
   *
   * The `NgOptimizedImage` directive provides the following functions:
   * - `provideCloudflareLoader`
   * - `provideCloudinaryLoader`
   * - `provideImageKitLoader`
   * - `provideImgixLoader`
   *
   * If you use a different image provider, you can create a custom loader function as described
   * below.
   *
   * To use a **custom loader**: provide your loader function as a value for the `IMAGE_LOADER` DI
   * token.
   *
   * ```typescript
   * import {IMAGE_LOADER, ImageLoaderConfig} from '@angular/common';
   *
   * // Configure the loader using the `IMAGE_LOADER` token.
   * providers: [
   *   {
   *      provide: IMAGE_LOADER,
   *      useValue: (config: ImageLoaderConfig) => {
   *        return `https://example.com/${config.src}-${config.width}.jpg}`;
   *      }
   *   },
   * ],
   * ```
   *
   * Step 3: update `<img>` tags in templates to use `ngSrc` instead of `src`.
   *
   * ```
   * <img ngSrc="logo.png" width="200" height="100">
   * ```
   *
   * @publicApi
   */
  class NgOptimizedImage {
      constructor() {
          this.imageLoader = i0.inject(IMAGE_LOADER);
          this.config = processConfig(i0.inject(i0.ɵIMAGE_CONFIG));
          this.renderer = i0.inject(i0.Renderer2);
          this.imgElement = i0.inject(i0.ElementRef).nativeElement;
          this.injector = i0.inject(i0.Injector);
          this.isServer = isPlatformServer(i0.inject(i0.PLATFORM_ID));
          this.preloadLinkCreator = i0.inject(PreloadLinkCreator);
          // a LCP image observer - should be injected only in the dev mode
          this.lcpObserver = ngDevMode ? this.injector.get(LCPImageObserver) : null;
          /**
           * Calculate the rewritten `src` once and store it.
           * This is needed to avoid repetitive calculations and make sure the directive cleanup in the
           * `ngOnDestroy` does not rely on the `IMAGE_LOADER` logic (which in turn can rely on some other
           * instance that might be already destroyed).
           */
          this._renderedSrc = null;
          /**
           * Indicates whether this image should have a high priority.
           */
          this.priority = false;
          /**
           * Disables automatic srcset generation for this image.
           */
          this.disableOptimizedSrcset = false;
          /**
           * Sets the image to "fill mode", which eliminates the height/width requirement and adds
           * styles such that the image fills its containing element.
           */
          this.fill = false;
      }
      /** @nodoc */
      ngOnInit() {
          i0.ɵperformanceMarkFeature('NgOptimizedImage');
          if (ngDevMode) {
              const ngZone = this.injector.get(i0.NgZone);
              assertNonEmptyInput(this, 'ngSrc', this.ngSrc);
              assertValidNgSrcset(this, this.ngSrcset);
              assertNoConflictingSrc(this);
              if (this.ngSrcset) {
                  assertNoConflictingSrcset(this);
              }
              assertNotBase64Image(this);
              assertNotBlobUrl(this);
              if (this.fill) {
                  assertEmptyWidthAndHeight(this);
                  // This leaves the Angular zone to avoid triggering unnecessary change detection cycles when
                  // `load` tasks are invoked on images.
                  ngZone.runOutsideAngular(() => assertNonZeroRenderedHeight(this, this.imgElement, this.renderer));
              }
              else {
                  assertNonEmptyWidthAndHeight(this);
                  if (this.height !== undefined) {
                      assertGreaterThanZero(this, this.height, 'height');
                  }
                  if (this.width !== undefined) {
                      assertGreaterThanZero(this, this.width, 'width');
                  }
                  // Only check for distorted images when not in fill mode, where
                  // images may be intentionally stretched, cropped or letterboxed.
                  ngZone.runOutsideAngular(() => assertNoImageDistortion(this, this.imgElement, this.renderer));
              }
              assertValidLoadingInput(this);
              if (!this.ngSrcset) {
                  assertNoComplexSizes(this);
              }
              assertValidPlaceholder(this, this.imageLoader);
              assertNotMissingBuiltInLoader(this.ngSrc, this.imageLoader);
              assertNoNgSrcsetWithoutLoader(this, this.imageLoader);
              assertNoLoaderParamsWithoutLoader(this, this.imageLoader);
              if (this.lcpObserver !== null) {
                  const ngZone = this.injector.get(i0.NgZone);
                  ngZone.runOutsideAngular(() => {
                      this.lcpObserver.registerImage(this.getRewrittenSrc(), this.ngSrc, this.priority);
                  });
              }
              if (this.priority) {
                  const checker = this.injector.get(PreconnectLinkChecker);
                  checker.assertPreconnect(this.getRewrittenSrc(), this.ngSrc);
              }
          }
          if (this.placeholder) {
              this.removePlaceholderOnLoad(this.imgElement);
          }
          this.setHostAttributes();
      }
      setHostAttributes() {
          // Must set width/height explicitly in case they are bound (in which case they will
          // only be reflected and not found by the browser)
          if (this.fill) {
              this.sizes ||= '100vw';
          }
          else {
              this.setHostAttribute('width', this.width.toString());
              this.setHostAttribute('height', this.height.toString());
          }
          this.setHostAttribute('loading', this.getLoadingBehavior());
          this.setHostAttribute('fetchpriority', this.getFetchPriority());
          // The `data-ng-img` attribute flags an image as using the directive, to allow
          // for analysis of the directive's performance.
          this.setHostAttribute('ng-img', 'true');
          // The `src` and `srcset` attributes should be set last since other attributes
          // could affect the image's loading behavior.
          const rewrittenSrcset = this.updateSrcAndSrcset();
          if (this.sizes) {
              this.setHostAttribute('sizes', this.sizes);
          }
          if (this.isServer && this.priority) {
              this.preloadLinkCreator.createPreloadLinkTag(this.renderer, this.getRewrittenSrc(), rewrittenSrcset, this.sizes);
          }
      }
      /** @nodoc */
      ngOnChanges(changes) {
          if (ngDevMode) {
              assertNoPostInitInputChange(this, changes, [
                  'ngSrcset',
                  'width',
                  'height',
                  'priority',
                  'fill',
                  'loading',
                  'sizes',
                  'loaderParams',
                  'disableOptimizedSrcset',
              ]);
          }
          if (changes['ngSrc'] && !changes['ngSrc'].isFirstChange()) {
              const oldSrc = this._renderedSrc;
              this.updateSrcAndSrcset(true);
              const newSrc = this._renderedSrc;
              if (this.lcpObserver !== null && oldSrc && newSrc && oldSrc !== newSrc) {
                  const ngZone = this.injector.get(i0.NgZone);
                  ngZone.runOutsideAngular(() => {
                      this.lcpObserver?.updateImage(oldSrc, newSrc);
                  });
              }
          }
      }
      callImageLoader(configWithoutCustomParams) {
          let augmentedConfig = configWithoutCustomParams;
          if (this.loaderParams) {
              augmentedConfig.loaderParams = this.loaderParams;
          }
          return this.imageLoader(augmentedConfig);
      }
      getLoadingBehavior() {
          if (!this.priority && this.loading !== undefined) {
              return this.loading;
          }
          return this.priority ? 'eager' : 'lazy';
      }
      getFetchPriority() {
          return this.priority ? 'high' : 'auto';
      }
      getRewrittenSrc() {
          // ImageLoaderConfig supports setting a width property. However, we're not setting width here
          // because if the developer uses rendered width instead of intrinsic width in the HTML width
          // attribute, the image requested may be too small for 2x+ screens.
          if (!this._renderedSrc) {
              const imgConfig = { src: this.ngSrc };
              // Cache calculated image src to reuse it later in the code.
              this._renderedSrc = this.callImageLoader(imgConfig);
          }
          return this._renderedSrc;
      }
      getRewrittenSrcset() {
          const widthSrcSet = VALID_WIDTH_DESCRIPTOR_SRCSET.test(this.ngSrcset);
          const finalSrcs = this.ngSrcset
              .split(',')
              .filter((src) => src !== '')
              .map((srcStr) => {
              srcStr = srcStr.trim();
              const width = widthSrcSet ? parseFloat(srcStr) : parseFloat(srcStr) * this.width;
              return `${this.callImageLoader({ src: this.ngSrc, width })} ${srcStr}`;
          });
          return finalSrcs.join(', ');
      }
      getAutomaticSrcset() {
          if (this.sizes) {
              return this.getResponsiveSrcset();
          }
          else {
              return this.getFixedSrcset();
          }
      }
      getResponsiveSrcset() {
          const { breakpoints } = this.config;
          let filteredBreakpoints = breakpoints;
          if (this.sizes?.trim() === '100vw') {
              // Since this is a full-screen-width image, our srcset only needs to include
              // breakpoints with full viewport widths.
              filteredBreakpoints = breakpoints.filter((bp) => bp >= VIEWPORT_BREAKPOINT_CUTOFF);
          }
          const finalSrcs = filteredBreakpoints.map((bp) => `${this.callImageLoader({ src: this.ngSrc, width: bp })} ${bp}w`);
          return finalSrcs.join(', ');
      }
      updateSrcAndSrcset(forceSrcRecalc = false) {
          if (forceSrcRecalc) {
              // Reset cached value, so that the followup `getRewrittenSrc()` call
              // will recalculate it and update the cache.
              this._renderedSrc = null;
          }
          const rewrittenSrc = this.getRewrittenSrc();
          this.setHostAttribute('src', rewrittenSrc);
          let rewrittenSrcset = undefined;
          if (this.ngSrcset) {
              rewrittenSrcset = this.getRewrittenSrcset();
          }
          else if (this.shouldGenerateAutomaticSrcset()) {
              rewrittenSrcset = this.getAutomaticSrcset();
          }
          if (rewrittenSrcset) {
              this.setHostAttribute('srcset', rewrittenSrcset);
          }
          return rewrittenSrcset;
      }
      getFixedSrcset() {
          const finalSrcs = DENSITY_SRCSET_MULTIPLIERS.map((multiplier) => `${this.callImageLoader({
            src: this.ngSrc,
            width: this.width * multiplier,
        })} ${multiplier}x`);
          return finalSrcs.join(', ');
      }
      shouldGenerateAutomaticSrcset() {
          let oversizedImage = false;
          if (!this.sizes) {
              oversizedImage =
                  this.width > FIXED_SRCSET_WIDTH_LIMIT || this.height > FIXED_SRCSET_HEIGHT_LIMIT;
          }
          return (!this.disableOptimizedSrcset &&
              !this.srcset &&
              this.imageLoader !== noopImageLoader &&
              !oversizedImage);
      }
      /**
       * Returns an image url formatted for use with the CSS background-image property. Expects one of:
       * * A base64 encoded image, which is wrapped and passed through.
       * * A boolean. If true, calls the image loader to generate a small placeholder url.
       */
      generatePlaceholder(placeholderInput) {
          const { placeholderResolution } = this.config;
          if (placeholderInput === true) {
              return `url(${this.callImageLoader({
                src: this.ngSrc,
                width: placeholderResolution,
                isPlaceholder: true,
            })})`;
          }
          else if (typeof placeholderInput === 'string' && placeholderInput.startsWith('data:')) {
              return `url(${placeholderInput})`;
          }
          return null;
      }
      /**
       * Determines if blur should be applied, based on an optional boolean
       * property `blur` within the optional configuration object `placeholderConfig`.
       */
      shouldBlurPlaceholder(placeholderConfig) {
          if (!placeholderConfig || !placeholderConfig.hasOwnProperty('blur')) {
              return true;
          }
          return Boolean(placeholderConfig.blur);
      }
      removePlaceholderOnLoad(img) {
          const callback = () => {
              const changeDetectorRef = this.injector.get(i0.ChangeDetectorRef);
              removeLoadListenerFn();
              removeErrorListenerFn();
              this.placeholder = false;
              changeDetectorRef.markForCheck();
          };
          const removeLoadListenerFn = this.renderer.listen(img, 'load', callback);
          const removeErrorListenerFn = this.renderer.listen(img, 'error', callback);
      }
      /** @nodoc */
      ngOnDestroy() {
          if (ngDevMode) {
              if (!this.priority && this._renderedSrc !== null && this.lcpObserver !== null) {
                  this.lcpObserver.unregisterImage(this._renderedSrc);
              }
          }
      }
      setHostAttribute(name, value) {
          this.renderer.setAttribute(this.imgElement, name, value);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgOptimizedImage, deps: [], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.3.0", type: NgOptimizedImage, isStandalone: true, selector: "img[ngSrc]", inputs: { ngSrc: ["ngSrc", "ngSrc", unwrapSafeUrl], ngSrcset: "ngSrcset", sizes: "sizes", width: ["width", "width", i0.numberAttribute], height: ["height", "height", i0.numberAttribute], loading: "loading", priority: ["priority", "priority", i0.booleanAttribute], loaderParams: "loaderParams", disableOptimizedSrcset: ["disableOptimizedSrcset", "disableOptimizedSrcset", i0.booleanAttribute], fill: ["fill", "fill", i0.booleanAttribute], placeholder: ["placeholder", "placeholder", booleanOrDataUrlAttribute], placeholderConfig: "placeholderConfig", src: "src", srcset: "srcset" }, host: { properties: { "style.position": "fill ? \"absolute\" : null", "style.width": "fill ? \"100%\" : null", "style.height": "fill ? \"100%\" : null", "style.inset": "fill ? \"0\" : null", "style.background-size": "placeholder ? \"cover\" : null", "style.background-position": "placeholder ? \"50% 50%\" : null", "style.background-repeat": "placeholder ? \"no-repeat\" : null", "style.background-image": "placeholder ? generatePlaceholder(placeholder) : null", "style.filter": "placeholder && shouldBlurPlaceholder(placeholderConfig) ? \"blur(15px)\" : null" } }, usesOnChanges: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgOptimizedImage, decorators: [{
              type: i0.Directive,
              args: [{
                      standalone: true,
                      selector: 'img[ngSrc]',
                      host: {
                          '[style.position]': 'fill ? "absolute" : null',
                          '[style.width]': 'fill ? "100%" : null',
                          '[style.height]': 'fill ? "100%" : null',
                          '[style.inset]': 'fill ? "0" : null',
                          '[style.background-size]': 'placeholder ? "cover" : null',
                          '[style.background-position]': 'placeholder ? "50% 50%" : null',
                          '[style.background-repeat]': 'placeholder ? "no-repeat" : null',
                          '[style.background-image]': 'placeholder ? generatePlaceholder(placeholder) : null',
                          '[style.filter]': `placeholder && shouldBlurPlaceholder(placeholderConfig) ? "blur(${PLACEHOLDER_BLUR_AMOUNT}px)" : null`,
                      },
                  }]
          }], propDecorators: { ngSrc: [{
                  type: i0.Input,
                  args: [{ required: true, transform: unwrapSafeUrl }]
              }], ngSrcset: [{
                  type: i0.Input
              }], sizes: [{
                  type: i0.Input
              }], width: [{
                  type: i0.Input,
                  args: [{ transform: i0.numberAttribute }]
              }], height: [{
                  type: i0.Input,
                  args: [{ transform: i0.numberAttribute }]
              }], loading: [{
                  type: i0.Input
              }], priority: [{
                  type: i0.Input,
                  args: [{ transform: i0.booleanAttribute }]
              }], loaderParams: [{
                  type: i0.Input
              }], disableOptimizedSrcset: [{
                  type: i0.Input,
                  args: [{ transform: i0.booleanAttribute }]
              }], fill: [{
                  type: i0.Input,
                  args: [{ transform: i0.booleanAttribute }]
              }], placeholder: [{
                  type: i0.Input,
                  args: [{ transform: booleanOrDataUrlAttribute }]
              }], placeholderConfig: [{
                  type: i0.Input
              }], src: [{
                  type: i0.Input
              }], srcset: [{
                  type: i0.Input
              }] } });
  /***** Helpers *****/
  /**
   * Sorts provided config breakpoints and uses defaults.
   */
  function processConfig(config) {
      let sortedBreakpoints = {};
      if (config.breakpoints) {
          sortedBreakpoints.breakpoints = config.breakpoints.sort((a, b) => a - b);
      }
      return Object.assign({}, i0.ɵIMAGE_CONFIG_DEFAULTS, config, sortedBreakpoints);
  }
  /***** Assert functions *****/
  /**
   * Verifies that there is no `src` set on a host element.
   */
  function assertNoConflictingSrc(dir) {
      if (dir.src) {
          throw new i0.ɵRuntimeError(2950 /* RuntimeErrorCode.UNEXPECTED_SRC_ATTR */, `${imgDirectiveDetails(dir.ngSrc)} both \`src\` and \`ngSrc\` have been set. ` +
              `Supplying both of these attributes breaks lazy loading. ` +
              `The NgOptimizedImage directive sets \`src\` itself based on the value of \`ngSrc\`. ` +
              `To fix this, please remove the \`src\` attribute.`);
      }
  }
  /**
   * Verifies that there is no `srcset` set on a host element.
   */
  function assertNoConflictingSrcset(dir) {
      if (dir.srcset) {
          throw new i0.ɵRuntimeError(2951 /* RuntimeErrorCode.UNEXPECTED_SRCSET_ATTR */, `${imgDirectiveDetails(dir.ngSrc)} both \`srcset\` and \`ngSrcset\` have been set. ` +
              `Supplying both of these attributes breaks lazy loading. ` +
              `The NgOptimizedImage directive sets \`srcset\` itself based on the value of ` +
              `\`ngSrcset\`. To fix this, please remove the \`srcset\` attribute.`);
      }
  }
  /**
   * Verifies that the `ngSrc` is not a Base64-encoded image.
   */
  function assertNotBase64Image(dir) {
      let ngSrc = dir.ngSrc.trim();
      if (ngSrc.startsWith('data:')) {
          if (ngSrc.length > BASE64_IMG_MAX_LENGTH_IN_ERROR) {
              ngSrc = ngSrc.substring(0, BASE64_IMG_MAX_LENGTH_IN_ERROR) + '...';
          }
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc, false)} \`ngSrc\` is a Base64-encoded string ` +
              `(${ngSrc}). NgOptimizedImage does not support Base64-encoded strings. ` +
              `To fix this, disable the NgOptimizedImage directive for this element ` +
              `by removing \`ngSrc\` and using a standard \`src\` attribute instead.`);
      }
  }
  /**
   * Verifies that the 'sizes' only includes responsive values.
   */
  function assertNoComplexSizes(dir) {
      let sizes = dir.sizes;
      if (sizes?.match(/((\)|,)\s|^)\d+px/)) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc, false)} \`sizes\` was set to a string including ` +
              `pixel values. For automatic \`srcset\` generation, \`sizes\` must only include responsive ` +
              `values, such as \`sizes="50vw"\` or \`sizes="(min-width: 768px) 50vw, 100vw"\`. ` +
              `To fix this, modify the \`sizes\` attribute, or provide your own \`ngSrcset\` value directly.`);
      }
  }
  function assertValidPlaceholder(dir, imageLoader) {
      assertNoPlaceholderConfigWithoutPlaceholder(dir);
      assertNoRelativePlaceholderWithoutLoader(dir, imageLoader);
      assertNoOversizedDataUrl(dir);
  }
  /**
   * Verifies that placeholderConfig isn't being used without placeholder
   */
  function assertNoPlaceholderConfigWithoutPlaceholder(dir) {
      if (dir.placeholderConfig && !dir.placeholder) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc, false)} \`placeholderConfig\` options were provided for an ` +
              `image that does not use the \`placeholder\` attribute, and will have no effect.`);
      }
  }
  /**
   * Warns if a relative URL placeholder is specified, but no loader is present to provide the small
   * image.
   */
  function assertNoRelativePlaceholderWithoutLoader(dir, imageLoader) {
      if (dir.placeholder === true && imageLoader === noopImageLoader) {
          throw new i0.ɵRuntimeError(2963 /* RuntimeErrorCode.MISSING_NECESSARY_LOADER */, `${imgDirectiveDetails(dir.ngSrc)} the \`placeholder\` attribute is set to true but ` +
              `no image loader is configured (i.e. the default one is being used), ` +
              `which would result in the same image being used for the primary image and its placeholder. ` +
              `To fix this, provide a loader or remove the \`placeholder\` attribute from the image.`);
      }
  }
  /**
   * Warns or throws an error if an oversized dataURL placeholder is provided.
   */
  function assertNoOversizedDataUrl(dir) {
      if (dir.placeholder &&
          typeof dir.placeholder === 'string' &&
          dir.placeholder.startsWith('data:')) {
          if (dir.placeholder.length > DATA_URL_ERROR_LIMIT) {
              throw new i0.ɵRuntimeError(2965 /* RuntimeErrorCode.OVERSIZED_PLACEHOLDER */, `${imgDirectiveDetails(dir.ngSrc)} the \`placeholder\` attribute is set to a data URL which is longer ` +
                  `than ${DATA_URL_ERROR_LIMIT} characters. This is strongly discouraged, as large inline placeholders ` +
                  `directly increase the bundle size of Angular and hurt page load performance. To fix this, generate ` +
                  `a smaller data URL placeholder.`);
          }
          if (dir.placeholder.length > DATA_URL_WARN_LIMIT) {
              console.warn(i0.ɵformatRuntimeError(2965 /* RuntimeErrorCode.OVERSIZED_PLACEHOLDER */, `${imgDirectiveDetails(dir.ngSrc)} the \`placeholder\` attribute is set to a data URL which is longer ` +
                  `than ${DATA_URL_WARN_LIMIT} characters. This is discouraged, as large inline placeholders ` +
                  `directly increase the bundle size of Angular and hurt page load performance. For better loading performance, ` +
                  `generate a smaller data URL placeholder.`));
          }
      }
  }
  /**
   * Verifies that the `ngSrc` is not a Blob URL.
   */
  function assertNotBlobUrl(dir) {
      const ngSrc = dir.ngSrc.trim();
      if (ngSrc.startsWith('blob:')) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} \`ngSrc\` was set to a blob URL (${ngSrc}). ` +
              `Blob URLs are not supported by the NgOptimizedImage directive. ` +
              `To fix this, disable the NgOptimizedImage directive for this element ` +
              `by removing \`ngSrc\` and using a regular \`src\` attribute instead.`);
      }
  }
  /**
   * Verifies that the input is set to a non-empty string.
   */
  function assertNonEmptyInput(dir, name, value) {
      const isString = typeof value === 'string';
      const isEmptyString = isString && value.trim() === '';
      if (!isString || isEmptyString) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} \`${name}\` has an invalid value ` +
              `(\`${value}\`). To fix this, change the value to a non-empty string.`);
      }
  }
  /**
   * Verifies that the `ngSrcset` is in a valid format, e.g. "100w, 200w" or "1x, 2x".
   */
  function assertValidNgSrcset(dir, value) {
      if (value == null)
          return;
      assertNonEmptyInput(dir, 'ngSrcset', value);
      const stringVal = value;
      const isValidWidthDescriptor = VALID_WIDTH_DESCRIPTOR_SRCSET.test(stringVal);
      const isValidDensityDescriptor = VALID_DENSITY_DESCRIPTOR_SRCSET.test(stringVal);
      if (isValidDensityDescriptor) {
          assertUnderDensityCap(dir, stringVal);
      }
      const isValidSrcset = isValidWidthDescriptor || isValidDensityDescriptor;
      if (!isValidSrcset) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} \`ngSrcset\` has an invalid value (\`${value}\`). ` +
              `To fix this, supply \`ngSrcset\` using a comma-separated list of one or more width ` +
              `descriptors (e.g. "100w, 200w") or density descriptors (e.g. "1x, 2x").`);
      }
  }
  function assertUnderDensityCap(dir, value) {
      const underDensityCap = value
          .split(',')
          .every((num) => num === '' || parseFloat(num) <= ABSOLUTE_SRCSET_DENSITY_CAP);
      if (!underDensityCap) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} the \`ngSrcset\` contains an unsupported image density:` +
              `\`${value}\`. NgOptimizedImage generally recommends a max image density of ` +
              `${RECOMMENDED_SRCSET_DENSITY_CAP}x but supports image densities up to ` +
              `${ABSOLUTE_SRCSET_DENSITY_CAP}x. The human eye cannot distinguish between image densities ` +
              `greater than ${RECOMMENDED_SRCSET_DENSITY_CAP}x - which makes them unnecessary for ` +
              `most use cases. Images that will be pinch-zoomed are typically the primary use case for ` +
              `${ABSOLUTE_SRCSET_DENSITY_CAP}x images. Please remove the high density descriptor and try again.`);
      }
  }
  /**
   * Creates a `RuntimeError` instance to represent a situation when an input is set after
   * the directive has initialized.
   */
  function postInitInputChangeError(dir, inputName) {
      let reason;
      if (inputName === 'width' || inputName === 'height') {
          reason =
              `Changing \`${inputName}\` may result in different attribute value ` +
                  `applied to the underlying image element and cause layout shifts on a page.`;
      }
      else {
          reason =
              `Changing the \`${inputName}\` would have no effect on the underlying ` +
                  `image element, because the resource loading has already occurred.`;
      }
      return new i0.ɵRuntimeError(2953 /* RuntimeErrorCode.UNEXPECTED_INPUT_CHANGE */, `${imgDirectiveDetails(dir.ngSrc)} \`${inputName}\` was updated after initialization. ` +
          `The NgOptimizedImage directive will not react to this input change. ${reason} ` +
          `To fix this, either switch \`${inputName}\` to a static value ` +
          `or wrap the image element in an *ngIf that is gated on the necessary value.`);
  }
  /**
   * Verify that none of the listed inputs has changed.
   */
  function assertNoPostInitInputChange(dir, changes, inputs) {
      inputs.forEach((input) => {
          const isUpdated = changes.hasOwnProperty(input);
          if (isUpdated && !changes[input].isFirstChange()) {
              if (input === 'ngSrc') {
                  // When the `ngSrc` input changes, we detect that only in the
                  // `ngOnChanges` hook, thus the `ngSrc` is already set. We use
                  // `ngSrc` in the error message, so we use a previous value, but
                  // not the updated one in it.
                  dir = { ngSrc: changes[input].previousValue };
              }
              throw postInitInputChangeError(dir, input);
          }
      });
  }
  /**
   * Verifies that a specified input is a number greater than 0.
   */
  function assertGreaterThanZero(dir, inputValue, inputName) {
      const validNumber = typeof inputValue === 'number' && inputValue > 0;
      const validString = typeof inputValue === 'string' && /^\d+$/.test(inputValue.trim()) && parseInt(inputValue) > 0;
      if (!validNumber && !validString) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} \`${inputName}\` has an invalid value. ` +
              `To fix this, provide \`${inputName}\` as a number greater than 0.`);
      }
  }
  /**
   * Verifies that the rendered image is not visually distorted. Effectively this is checking:
   * - Whether the "width" and "height" attributes reflect the actual dimensions of the image.
   * - Whether image styling is "correct" (see below for a longer explanation).
   */
  function assertNoImageDistortion(dir, img, renderer) {
      const removeLoadListenerFn = renderer.listen(img, 'load', () => {
          removeLoadListenerFn();
          removeErrorListenerFn();
          const computedStyle = window.getComputedStyle(img);
          let renderedWidth = parseFloat(computedStyle.getPropertyValue('width'));
          let renderedHeight = parseFloat(computedStyle.getPropertyValue('height'));
          const boxSizing = computedStyle.getPropertyValue('box-sizing');
          if (boxSizing === 'border-box') {
              const paddingTop = computedStyle.getPropertyValue('padding-top');
              const paddingRight = computedStyle.getPropertyValue('padding-right');
              const paddingBottom = computedStyle.getPropertyValue('padding-bottom');
              const paddingLeft = computedStyle.getPropertyValue('padding-left');
              renderedWidth -= parseFloat(paddingRight) + parseFloat(paddingLeft);
              renderedHeight -= parseFloat(paddingTop) + parseFloat(paddingBottom);
          }
          const renderedAspectRatio = renderedWidth / renderedHeight;
          const nonZeroRenderedDimensions = renderedWidth !== 0 && renderedHeight !== 0;
          const intrinsicWidth = img.naturalWidth;
          const intrinsicHeight = img.naturalHeight;
          const intrinsicAspectRatio = intrinsicWidth / intrinsicHeight;
          const suppliedWidth = dir.width;
          const suppliedHeight = dir.height;
          const suppliedAspectRatio = suppliedWidth / suppliedHeight;
          // Tolerance is used to account for the impact of subpixel rendering.
          // Due to subpixel rendering, the rendered, intrinsic, and supplied
          // aspect ratios of a correctly configured image may not exactly match.
          // For example, a `width=4030 height=3020` image might have a rendered
          // size of "1062w, 796.48h". (An aspect ratio of 1.334... vs. 1.333...)
          const inaccurateDimensions = Math.abs(suppliedAspectRatio - intrinsicAspectRatio) > ASPECT_RATIO_TOLERANCE;
          const stylingDistortion = nonZeroRenderedDimensions &&
              Math.abs(intrinsicAspectRatio - renderedAspectRatio) > ASPECT_RATIO_TOLERANCE;
          if (inaccurateDimensions) {
              console.warn(i0.ɵformatRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} the aspect ratio of the image does not match ` +
                  `the aspect ratio indicated by the width and height attributes. ` +
                  `\nIntrinsic image size: ${intrinsicWidth}w x ${intrinsicHeight}h ` +
                  `(aspect-ratio: ${round(intrinsicAspectRatio)}). \nSupplied width and height attributes: ` +
                  `${suppliedWidth}w x ${suppliedHeight}h (aspect-ratio: ${round(suppliedAspectRatio)}). ` +
                  `\nTo fix this, update the width and height attributes.`));
          }
          else if (stylingDistortion) {
              console.warn(i0.ɵformatRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} the aspect ratio of the rendered image ` +
                  `does not match the image's intrinsic aspect ratio. ` +
                  `\nIntrinsic image size: ${intrinsicWidth}w x ${intrinsicHeight}h ` +
                  `(aspect-ratio: ${round(intrinsicAspectRatio)}). \nRendered image size: ` +
                  `${renderedWidth}w x ${renderedHeight}h (aspect-ratio: ` +
                  `${round(renderedAspectRatio)}). \nThis issue can occur if "width" and "height" ` +
                  `attributes are added to an image without updating the corresponding ` +
                  `image styling. To fix this, adjust image styling. In most cases, ` +
                  `adding "height: auto" or "width: auto" to the image styling will fix ` +
                  `this issue.`));
          }
          else if (!dir.ngSrcset && nonZeroRenderedDimensions) {
              // If `ngSrcset` hasn't been set, sanity check the intrinsic size.
              const recommendedWidth = RECOMMENDED_SRCSET_DENSITY_CAP * renderedWidth;
              const recommendedHeight = RECOMMENDED_SRCSET_DENSITY_CAP * renderedHeight;
              const oversizedWidth = intrinsicWidth - recommendedWidth >= OVERSIZED_IMAGE_TOLERANCE;
              const oversizedHeight = intrinsicHeight - recommendedHeight >= OVERSIZED_IMAGE_TOLERANCE;
              if (oversizedWidth || oversizedHeight) {
                  console.warn(i0.ɵformatRuntimeError(2960 /* RuntimeErrorCode.OVERSIZED_IMAGE */, `${imgDirectiveDetails(dir.ngSrc)} the intrinsic image is significantly ` +
                      `larger than necessary. ` +
                      `\nRendered image size: ${renderedWidth}w x ${renderedHeight}h. ` +
                      `\nIntrinsic image size: ${intrinsicWidth}w x ${intrinsicHeight}h. ` +
                      `\nRecommended intrinsic image size: ${recommendedWidth}w x ${recommendedHeight}h. ` +
                      `\nNote: Recommended intrinsic image size is calculated assuming a maximum DPR of ` +
                      `${RECOMMENDED_SRCSET_DENSITY_CAP}. To improve loading time, resize the image ` +
                      `or consider using the "ngSrcset" and "sizes" attributes.`));
              }
          }
      });
      // We only listen to the `error` event to remove the `load` event listener because it will not be
      // fired if the image fails to load. This is done to prevent memory leaks in development mode
      // because image elements aren't garbage-collected properly. It happens because zone.js stores the
      // event listener directly on the element and closures capture `dir`.
      const removeErrorListenerFn = renderer.listen(img, 'error', () => {
          removeLoadListenerFn();
          removeErrorListenerFn();
      });
  }
  /**
   * Verifies that a specified input is set.
   */
  function assertNonEmptyWidthAndHeight(dir) {
      let missingAttributes = [];
      if (dir.width === undefined)
          missingAttributes.push('width');
      if (dir.height === undefined)
          missingAttributes.push('height');
      if (missingAttributes.length > 0) {
          throw new i0.ɵRuntimeError(2954 /* RuntimeErrorCode.REQUIRED_INPUT_MISSING */, `${imgDirectiveDetails(dir.ngSrc)} these required attributes ` +
              `are missing: ${missingAttributes.map((attr) => `"${attr}"`).join(', ')}. ` +
              `Including "width" and "height" attributes will prevent image-related layout shifts. ` +
              `To fix this, include "width" and "height" attributes on the image tag or turn on ` +
              `"fill" mode with the \`fill\` attribute.`);
      }
  }
  /**
   * Verifies that width and height are not set. Used in fill mode, where those attributes don't make
   * sense.
   */
  function assertEmptyWidthAndHeight(dir) {
      if (dir.width || dir.height) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} the attributes \`height\` and/or \`width\` are present ` +
              `along with the \`fill\` attribute. Because \`fill\` mode causes an image to fill its containing ` +
              `element, the size attributes have no effect and should be removed.`);
      }
  }
  /**
   * Verifies that the rendered image has a nonzero height. If the image is in fill mode, provides
   * guidance that this can be caused by the containing element's CSS position property.
   */
  function assertNonZeroRenderedHeight(dir, img, renderer) {
      const removeLoadListenerFn = renderer.listen(img, 'load', () => {
          removeLoadListenerFn();
          removeErrorListenerFn();
          const renderedHeight = img.clientHeight;
          if (dir.fill && renderedHeight === 0) {
              console.warn(i0.ɵformatRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} the height of the fill-mode image is zero. ` +
                  `This is likely because the containing element does not have the CSS 'position' ` +
                  `property set to one of the following: "relative", "fixed", or "absolute". ` +
                  `To fix this problem, make sure the container element has the CSS 'position' ` +
                  `property defined and the height of the element is not zero.`));
          }
      });
      // See comments in the `assertNoImageDistortion`.
      const removeErrorListenerFn = renderer.listen(img, 'error', () => {
          removeLoadListenerFn();
          removeErrorListenerFn();
      });
  }
  /**
   * Verifies that the `loading` attribute is set to a valid input &
   * is not used on priority images.
   */
  function assertValidLoadingInput(dir) {
      if (dir.loading && dir.priority) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} the \`loading\` attribute ` +
              `was used on an image that was marked "priority". ` +
              `Setting \`loading\` on priority images is not allowed ` +
              `because these images will always be eagerly loaded. ` +
              `To fix this, remove the “loading” attribute from the priority image.`);
      }
      const validInputs = ['auto', 'eager', 'lazy'];
      if (typeof dir.loading === 'string' && !validInputs.includes(dir.loading)) {
          throw new i0.ɵRuntimeError(2952 /* RuntimeErrorCode.INVALID_INPUT */, `${imgDirectiveDetails(dir.ngSrc)} the \`loading\` attribute ` +
              `has an invalid value (\`${dir.loading}\`). ` +
              `To fix this, provide a valid value ("lazy", "eager", or "auto").`);
      }
  }
  /**
   * Warns if NOT using a loader (falling back to the generic loader) and
   * the image appears to be hosted on one of the image CDNs for which
   * we do have a built-in image loader. Suggests switching to the
   * built-in loader.
   *
   * @param ngSrc Value of the ngSrc attribute
   * @param imageLoader ImageLoader provided
   */
  function assertNotMissingBuiltInLoader(ngSrc, imageLoader) {
      if (imageLoader === noopImageLoader) {
          let builtInLoaderName = '';
          for (const loader of BUILT_IN_LOADERS) {
              if (loader.testUrl(ngSrc)) {
                  builtInLoaderName = loader.name;
                  break;
              }
          }
          if (builtInLoaderName) {
              console.warn(i0.ɵformatRuntimeError(2962 /* RuntimeErrorCode.MISSING_BUILTIN_LOADER */, `NgOptimizedImage: It looks like your images may be hosted on the ` +
                  `${builtInLoaderName} CDN, but your app is not using Angular's ` +
                  `built-in loader for that CDN. We recommend switching to use ` +
                  `the built-in by calling \`provide${builtInLoaderName}Loader()\` ` +
                  `in your \`providers\` and passing it your instance's base URL. ` +
                  `If you don't want to use the built-in loader, define a custom ` +
                  `loader function using IMAGE_LOADER to silence this warning.`));
          }
      }
  }
  /**
   * Warns if ngSrcset is present and no loader is configured (i.e. the default one is being used).
   */
  function assertNoNgSrcsetWithoutLoader(dir, imageLoader) {
      if (dir.ngSrcset && imageLoader === noopImageLoader) {
          console.warn(i0.ɵformatRuntimeError(2963 /* RuntimeErrorCode.MISSING_NECESSARY_LOADER */, `${imgDirectiveDetails(dir.ngSrc)} the \`ngSrcset\` attribute is present but ` +
              `no image loader is configured (i.e. the default one is being used), ` +
              `which would result in the same image being used for all configured sizes. ` +
              `To fix this, provide a loader or remove the \`ngSrcset\` attribute from the image.`));
      }
  }
  /**
   * Warns if loaderParams is present and no loader is configured (i.e. the default one is being
   * used).
   */
  function assertNoLoaderParamsWithoutLoader(dir, imageLoader) {
      if (dir.loaderParams && imageLoader === noopImageLoader) {
          console.warn(i0.ɵformatRuntimeError(2963 /* RuntimeErrorCode.MISSING_NECESSARY_LOADER */, `${imgDirectiveDetails(dir.ngSrc)} the \`loaderParams\` attribute is present but ` +
              `no image loader is configured (i.e. the default one is being used), ` +
              `which means that the loaderParams data will not be consumed and will not affect the URL. ` +
              `To fix this, provide a custom loader or remove the \`loaderParams\` attribute from the image.`));
      }
  }
  function round(input) {
      return Number.isInteger(input) ? input : input.toFixed(2);
  }
  // Transform function to handle SafeValue input for ngSrc. This doesn't do any sanitization,
  // as that is not needed for img.src and img.srcset. This transform is purely for compatibility.
  function unwrapSafeUrl(value) {
      if (typeof value === 'string') {
          return value;
      }
      return i0.ɵunwrapSafeValue(value);
  }
  // Transform function to handle inputs which may be booleans, strings, or string representations
  // of boolean values. Used for the placeholder attribute.
  function booleanOrDataUrlAttribute(value) {
      if (typeof value === 'string' && value.startsWith(`data:`)) {
          return value;
      }
      return i0.booleanAttribute(value);
  }

  Object.defineProperty(exports, "IMAGE_CONFIG", {
    enumerable: true,
    get: function () { return i0.ɵIMAGE_CONFIG; }
  });
  exports.APP_BASE_HREF = APP_BASE_HREF;
  exports.AsyncPipe = AsyncPipe;
  exports.BrowserPlatformLocation = BrowserPlatformLocation;
  exports.CommonModule = CommonModule;
  exports.CurrencyPipe = CurrencyPipe;
  exports.DATE_PIPE_DEFAULT_OPTIONS = DATE_PIPE_DEFAULT_OPTIONS;
  exports.DATE_PIPE_DEFAULT_TIMEZONE = DATE_PIPE_DEFAULT_TIMEZONE;
  exports.DOCUMENT = DOCUMENT;
  exports.DatePipe = DatePipe;
  exports.DecimalPipe = DecimalPipe;
  exports.HashLocationStrategy = HashLocationStrategy;
  exports.I18nPluralPipe = I18nPluralPipe;
  exports.I18nSelectPipe = I18nSelectPipe;
  exports.IMAGE_LOADER = IMAGE_LOADER;
  exports.JsonPipe = JsonPipe;
  exports.KeyValuePipe = KeyValuePipe;
  exports.LOCATION_INITIALIZED = LOCATION_INITIALIZED;
  exports.Location = Location;
  exports.LocationStrategy = LocationStrategy;
  exports.LowerCasePipe = LowerCasePipe;
  exports.NgClass = NgClass;
  exports.NgComponentOutlet = NgComponentOutlet;
  exports.NgFor = NgForOf;
  exports.NgForOf = NgForOf;
  exports.NgForOfContext = NgForOfContext;
  exports.NgIf = NgIf;
  exports.NgIfContext = NgIfContext;
  exports.NgLocaleLocalization = NgLocaleLocalization;
  exports.NgLocalization = NgLocalization;
  exports.NgOptimizedImage = NgOptimizedImage;
  exports.NgPlural = NgPlural;
  exports.NgPluralCase = NgPluralCase;
  exports.NgStyle = NgStyle;
  exports.NgSwitch = NgSwitch;
  exports.NgSwitchCase = NgSwitchCase;
  exports.NgSwitchDefault = NgSwitchDefault;
  exports.NgTemplateOutlet = NgTemplateOutlet;
  exports.NumberSymbol = NumberSymbol;
  exports.PRECONNECT_CHECK_BLOCKLIST = PRECONNECT_CHECK_BLOCKLIST;
  exports.PathLocationStrategy = PathLocationStrategy;
  exports.PercentPipe = PercentPipe;
  exports.PlatformLocation = PlatformLocation;
  exports.SlicePipe = SlicePipe;
  exports.TitleCasePipe = TitleCasePipe;
  exports.UpperCasePipe = UpperCasePipe;
  exports.VERSION = VERSION;
  exports.ViewportScroller = ViewportScroller;
  exports.XhrFactory = XhrFactory;
  exports.formatCurrency = formatCurrency;
  exports.formatDate = formatDate;
  exports.formatNumber = formatNumber;
  exports.formatPercent = formatPercent;
  exports.getCurrencySymbol = getCurrencySymbol;
  exports.getLocaleCurrencyCode = getLocaleCurrencyCode;
  exports.getLocaleCurrencyName = getLocaleCurrencyName;
  exports.getLocaleCurrencySymbol = getLocaleCurrencySymbol;
  exports.getLocaleDateFormat = getLocaleDateFormat;
  exports.getLocaleDateTimeFormat = getLocaleDateTimeFormat;
  exports.getLocaleDayNames = getLocaleDayNames;
  exports.getLocaleDayPeriods = getLocaleDayPeriods;
  exports.getLocaleDirection = getLocaleDirection;
  exports.getLocaleEraNames = getLocaleEraNames;
  exports.getLocaleExtraDayPeriodRules = getLocaleExtraDayPeriodRules;
  exports.getLocaleExtraDayPeriods = getLocaleExtraDayPeriods;
  exports.getLocaleFirstDayOfWeek = getLocaleFirstDayOfWeek;
  exports.getLocaleId = getLocaleId;
  exports.getLocaleMonthNames = getLocaleMonthNames;
  exports.getLocaleNumberFormat = getLocaleNumberFormat;
  exports.getLocaleNumberSymbol = getLocaleNumberSymbol;
  exports.getLocalePluralCase = getLocalePluralCase;
  exports.getLocaleTimeFormat = getLocaleTimeFormat;
  exports.getLocaleWeekEndRange = getLocaleWeekEndRange;
  exports.getNumberOfCurrencyDigits = getNumberOfCurrencyDigits;
  exports.isPlatformBrowser = isPlatformBrowser;
  exports.isPlatformServer = isPlatformServer;
  exports.isPlatformWorkerApp = isPlatformWorkerApp;
  exports.isPlatformWorkerUi = isPlatformWorkerUi;
  exports.provideCloudflareLoader = provideCloudflareLoader;
  exports.provideCloudinaryLoader = provideCloudinaryLoader;
  exports.provideImageKitLoader = provideImageKitLoader;
  exports.provideImgixLoader = provideImgixLoader;
  exports.provideNetlifyLoader = provideNetlifyLoader;
  exports.registerLocaleData = registerLocaleData;
  exports.ɵDomAdapter = DomAdapter;
  exports.ɵNullViewportScroller = NullViewportScroller;
  exports.ɵPLATFORM_BROWSER_ID = PLATFORM_BROWSER_ID;
  exports.ɵPLATFORM_SERVER_ID = PLATFORM_SERVER_ID;
  exports.ɵPLATFORM_WORKER_APP_ID = PLATFORM_WORKER_APP_ID;
  exports.ɵPLATFORM_WORKER_UI_ID = PLATFORM_WORKER_UI_ID;
  exports.ɵPlatformNavigation = PlatformNavigation;
  exports.ɵgetDOM = getDOM;
  exports.ɵnormalizeQueryParams = normalizeQueryParams;
  exports.ɵparseCookieValue = parseCookieValue;
  exports.ɵsetRootDomAdapter = setRootDomAdapter;

}));
