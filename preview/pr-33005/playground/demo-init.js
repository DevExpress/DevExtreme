import { u as utils, a as alert, c as confirm, b as custom, f as formatDate, d as formatMessage, e as formatNumber, l as loadMessages, g as locale, p as parseDate, h as parseNumber, B as BaseInfernoComponent, n as normalizeProps, i as createComponentVNode, k as infernoRenderer, m as hasWindow, o as createRef, r as renderer, q as createVNode, t as isPlainObject, v as extend, C as Component, w as getPathParts, x as normalizeToolbarItems, D as DEFAULT_TOOLBAR_ITEMS, y as getSortedToolbarItems, z as gridCoreUtils, A as filteringUtils, E as isDefined, F as errors, G as dateLocalization, H as isNumeric, I as isString, J as strictParseNumber, K as messageLocalization, L as type, M as captionize, N as compileGetter, O as isObject, P as isFunction, Q as getFormatOptions, R as normalizeDataSourceOptions, S as updateHeaderFilterItemSelectionState, T as Deferred, U as isUTCFormat, V as convertDataFromUTCToLocal, W as renderValueText, X as DataSource, Y as errors$1, Z as isCondition, $ as isGroup, a0 as getFilterExpression$1, a1 as equalByValue, a2 as applyBatch, a3 as CustomStore, a4 as ArrayStore, a5 as createPromise, a6 as Callbacks, a7 as keysEqual, a8 as Component$1, a9 as sortColumns, aa as defaultOptions$j, ab as combineClasses, ac as createContext, ad as Sortable$1, ae as render, af as createFragment, ag as createPortal, ah as PopupFull, ai as TreeViewSearch, aj as formatHelper, ak as getPublicElement, al as generateNewRowTempKey, am as applyChanges, an as Form$1, ao as isFluent, ap as current, aq as forEachFormItems, ar as removeFieldConditionsFromFilter, as as HeaderFilterView$1, at as FilterPanelView$1, au as FilterBuilderView, av as syncFilters, aw as getMatchedConditions, ax as Pagination, ay as MAX_PAGES_COUNT, az as Selection, aA as Toolbar$1, aB as on, aC as off, aD as isVisible$1, aE as isMaterialBased, aF as browser, aG as Widget, aH as rerender, aI as eventsEngine, aJ as createTextVNode, aK as isCommandKeyPressed, aL as Guid, aM as Toast$1, aN as Scrollable$1, aO as LoadPanel$2, aP as getWindow, aQ as resizeObserverSingleton, aR as ContextMenu$2, aS as filterHasField, aT as registerComponent, j as jQuery, aU as registerGradient, aV as registerPattern, aW as RemoteFileSystemProvider, aX as generateColors, aY as currentPalette, aZ as registerPalette, a_ as getPalette, a$ as Ajax, b0 as repaint, b1 as notify, b2 as query, b3 as setTemplateEngine, b4 as configMethod, _ as __vitePreload, s as setLicenseCheckSkipCondition } from './assets/preload-helper-gWX0XG96.js';

const getTimeZones = utils.getTimeZones;

/**
 * @name ui.dialog
 */

const dialog = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    alert,
    confirm,
    custom
}, Symbol.toStringTag, { value: 'Module' }));

const localization = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    formatDate,
    formatMessage,
    formatNumber,
    loadMessages,
    locale,
    parseDate,
    parseNumber
}, Symbol.toStringTag, { value: 'Module' }));

var i=Symbol.for("preact-signals");function t(){if(!(s>1)){var i,t=false;while(void 0!==h){var r=h;h=void 0;f++;while(void 0!==r){var o=r.o;r.o=void 0;r.f&=-3;if(!(8&r.f)&&c(r))try{r.c();}catch(r){if(!t){i=r;t=true;}}r=o;}}f=0;s--;if(t)throw i}else s--;}function r(i){if(s>0)return i();s++;try{return i()}finally{t();}}var o=void 0;var h=void 0,s=0,f=0,v=0;function e(i){if(void 0!==o){var t=i.n;if(void 0===t||t.t!==o){t={i:0,S:i,p:o.s,n:void 0,t:o,e:void 0,x:void 0,r:t};if(void 0!==o.s)o.s.n=t;o.s=t;i.n=t;if(32&o.f)i.S(t);return t}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=o.s;t.n=void 0;o.s.n=t;o.s=t;}return t}}}function u(i){this.v=i;this.i=0;this.n=void 0;this.t=void 0;}u.prototype.brand=i;u.prototype.h=function(){return  true};u.prototype.S=function(i){if(this.t!==i&&void 0===i.e){i.x=this.t;if(void 0!==this.t)this.t.e=i;this.t=i;}};u.prototype.U=function(i){if(void 0!==this.t){var t=i.e,r=i.x;if(void 0!==t){t.x=r;i.e=void 0;}if(void 0!==r){r.e=t;i.x=void 0;}if(i===this.t)this.t=r;}};u.prototype.subscribe=function(i){var t=this;return E(function(){var r=t.value,n=o;o=void 0;try{i(r);}finally{o=n;}})};u.prototype.valueOf=function(){return this.value};u.prototype.toString=function(){return this.value+""};u.prototype.toJSON=function(){return this.value};u.prototype.peek=function(){var i=o;o=void 0;try{return this.value}finally{o=i;}};Object.defineProperty(u.prototype,"value",{get:function(){var i=e(this);if(void 0!==i)i.i=this.i;return this.v},set:function(i){if(i!==this.v){if(f>100)throw new Error("Cycle detected");this.v=i;this.i++;v++;s++;try{for(var r=this.t;void 0!==r;r=r.x)r.t.N();}finally{t();}}}});function d(i){return new u(i)}function c(i){for(var t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return  true;return  false}function a(i){for(var t=i.s;void 0!==t;t=t.n){var r=t.S.n;if(void 0!==r)t.r=r;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break}}}function l(i){var t=i.s,r=void 0;while(void 0!==t){var o=t.p;if(-1===t.i){t.S.U(t);if(void 0!==o)o.n=t.n;if(void 0!==t.n)t.n.p=o;}else r=t;t.S.n=t.r;if(void 0!==t.r)t.r=void 0;t=o;}i.s=r;}function y(i){u.call(this,void 0);this.x=i;this.s=void 0;this.g=v-1;this.f=4;}(y.prototype=new u).h=function(){this.f&=-3;if(1&this.f)return  false;if(32==(36&this.f))return  true;this.f&=-5;if(this.g===v)return  true;this.g=v;this.f|=1;if(this.i>0&&!c(this)){this.f&=-2;return  true}var i=o;try{a(this);o=this;var t=this.x();if(16&this.f||this.v!==t||0===this.i){this.v=t;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}o=i;l(this);this.f&=-2;return  true};y.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(var t=this.s;void 0!==t;t=t.n)t.S.S(t);}u.prototype.S.call(this,i);};y.prototype.U=function(i){if(void 0!==this.t){u.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(var t=this.s;void 0!==t;t=t.n)t.S.U(t);}}};y.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var i=this.t;void 0!==i;i=i.x)i.t.N();}};Object.defineProperty(y.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var i=e(this);this.h();if(void 0!==i)i.i=this.i;if(16&this.f)throw this.v;return this.v}});function w(i){return new y(i)}function _(i){var r=i.u;i.u=void 0;if("function"==typeof r){s++;var n=o;o=void 0;try{r();}catch(t){i.f&=-2;i.f|=8;g(i);throw t}finally{o=n;t();}}}function g(i){for(var t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;_(i);}function p(i){if(o!==this)throw new Error("Out-of-order effect");l(this);o=i;this.f&=-2;if(8&this.f)g(this);t();}function b(i){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;}b.prototype.c=function(){var i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;var t=this.x();if("function"==typeof t)this.u=t;}finally{i();}};b.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1;this.f&=-9;_(this);a(this);s++;var i=o;o=this;return p.bind(this,i)};b.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.o=h;h=this;}};b.prototype.d=function(){this.f|=8;if(!(1&this.f))g(this);};function E(i){var t=new b(i);try{t.c();}catch(i){t.d();throw i}return t.d.bind(t)}

function signal$1(initialValue) {
  return d(initialValue);
}
function computed$1(fn) {
  return w(fn);
}
function effect$1(fn) {
  return E(fn);
}
function batch$1(fn) {
  r(fn);
}

function signal(initialValue) {
  const signalInstance = signal$1(initialValue);
  const trace = new Error().stack;
  if (trace) {
    Object.defineProperty(signalInstance, 'stack', {
      value: trace,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  return signalInstance;
}
function computed(fn) {
  const computedInstance = computed$1(fn);
  const trace = new Error().stack;
  if (trace) {
    Object.defineProperty(computedInstance, 'stack', {
      value: trace,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  return computedInstance;
}
function effect(fn) {
  return effect$1(fn);
}
function batch(fn) {
  batch$1(fn);
}

/* eslint-disable no-console */

const LOG_TYPE_TO_LEVEL = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
class Logger {
  constructor(options) {
    this.logLevel = options?.logLevel ?? 'info';
    this.prefix = options?.prefix ?? '';
  }
  setLevel(level) {
    this.logLevel = level;
  }
  setPrefix(prefix) {
    this.prefix = prefix;
  }
  debug(message, ...args) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage(message), ...args);
    }
  }
  info(message, ...args) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage(message), ...args);
    }
  }
  warn(message, ...args) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(message), ...args);
    }
  }
  error(message, ...args) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(message), ...args);
    }
  }
  formatMessage(message) {
    return this.prefix ? `${this.prefix} ${message}` : message;
  }
  shouldLog(level) {
    return LOG_TYPE_TO_LEVEL[level] >= LOG_TYPE_TO_LEVEL[this.logLevel];
  }
}

const setupStateManager = (options) => {
  const {
    diContext,
    logLevel = "warn"} = options;
  if (!diContext) {
    throw new Error("DI context is not provided");
  }
  new Logger({
    logLevel,
    prefix: "[StateManager]"
  });
  {
    return void 0;
  }
};

class View {
  firstRender = true;
  render(root) {
    this.root = root;
    const ViewComponent = this.component;
    const props = this.getProps();
    return effect(() => {
      this.props = props.value;
      const content = normalizeProps(createComponentVNode(2, ViewComponent, {
        ...props.value
      }));
      infernoRenderer.renderIntoContainer(content, root, !this.firstRender);
      this.firstRender = false;
    });
  }
  asInferno() {
    // eslint-disable-next-line no-return-assign
    return this.inferno ??= this._asInferno();
  }
  _asInferno() {
    const view = this;
    return class InfernoView extends BaseInfernoComponent {
      constructor() {
        super();
        const props = view.getProps();
        this.unsubscribe = effect(() => {
          view.props = props.value;
          this.state ??= {
            props: props.value
          };
          if (this.state.props !== props.value && hasWindow()) {
            this.setState({
              props: props.value
            });
          }
        });
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        const ViewComponent = view.component;
        return normalizeProps(createComponentVNode(2, ViewComponent, {
          ...this.state.props
        }));
      }
    };
  }
}

let MainView$1 = class MainView extends View {};

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
function TemplateWrapper(template) {
  return class Template extends BaseInfernoComponent {
    ref = createRef();
    renderTemplate() {
      renderer(this.ref.current).empty();
      template.render({
        container: renderer(this.ref.current),
        model: this.props
      });
    }
    render() {
      return createVNode(1, "div", null, null, 1, null, null, this.ref);
    }
    componentDidUpdate() {
      this.renderTemplate();
    }
    componentDidMount() {
      this.renderTemplate();
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const shallowCopyTree = tree => {
  if (isPlainObject(tree)) {
    return {
      ...tree
    };
  }
  if (Array.isArray(tree)) {
    return [...tree];
  }
  return tree;
};

// NOTE: Maybe we can use "structuredClone" build-in function here
// instead of this custom function
const deepCopyTreeNode = treeNode => {
  switch (true) {
    case isPlainObject(treeNode):
      return extend(true, {}, treeNode);
    case Array.isArray(treeNode):
      return extend(true, [], treeNode);
    default:
      return treeNode;
  }
};
const deepMergeTrees = (firstTree, secondTree) => {
  if (isPlainObject(secondTree) && isPlainObject(firstTree)) {
    return extend(true, {}, firstTree, secondTree);
  }
  if (secondTree !== undefined) {
    return deepCopyTreeNode(secondTree);
  }
  return deepCopyTreeNode(firstTree);
};
const getTreeNodeParentByPath = (tree, path) => {
  let currentNode = tree;
  for (let idx = 0; idx < path.length - 1; idx += 1) {
    const nextNodePath = path[idx];
    currentNode = currentNode[nextNodePath];
    if (currentNode === undefined) {
      return undefined;
    }
  }
  return currentNode;
};
const getTreeNodeByPath = (tree, path) => {
  const [lastNodePath] = path.slice(-1);
  const subtree = getTreeNodeParentByPath(tree, path);
  return subtree?.[lastNodePath];
};
const createOrShallowCopySubtreePath = (tree, path) => {
  const shallowCopiedTree = shallowCopyTree(tree);
  let currentNode = shallowCopiedTree;
  for (let idx = 0; idx < path.length; idx += 1) {
    const isLastPath = idx === path.length - 1;
    const nextNodePath = path[idx];
    if (currentNode[nextNodePath] === undefined) {
      currentNode[nextNodePath] = !isLastPath ? {} : undefined;
    } else {
      currentNode[nextNodePath] = shallowCopyTree(currentNode[nextNodePath]);
    }
    currentNode = currentNode[nextNodePath];
  }
  return shallowCopiedTree;
};
const mergeOptionTrees = (internalTree, publicTree, defaultTree, pathToMerge) => {
  const [lastNodePath] = pathToMerge.slice(-1);
  const result = createOrShallowCopySubtreePath(internalTree, pathToMerge);
  const targetNodeParent = getTreeNodeParentByPath(result, pathToMerge);
  const newNodeValue = getTreeNodeByPath(publicTree, pathToMerge);
  const defaultNodeValue = getTreeNodeByPath(defaultTree, pathToMerge);
  targetNodeParent[lastNodePath] = deepMergeTrees(defaultNodeValue, newNodeValue);
  return result;
};
const setTreeNodeByPath = (tree, node, path) => {
  const [lastNodePath] = path.slice(-1);
  const shallowCopiedTree = createOrShallowCopySubtreePath(tree, path);
  const subtree = getTreeNodeParentByPath(shallowCopiedTree, path);
  subtree[lastNodePath] = node;
  return shallowCopiedTree;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

function getOr(cache, key, orElse) {
  if (cache[key]) {
    return cache[key];
  }
  const value = orElse();
  cache[key] = value;
  return value;
}
class OptionsController {
  static dependencies = [Component];
  // @ts-expect-error Component type doesn't have fields from widget.ts

  constructor(component) {
    this.component = component;
    this.cache = {
      oneWay: {},
      oneWayWithChanges: {},
      twoWay: {},
      action: {},
      template: {}
    };
    this.isControlledMode = false;
    this.initialized = this.component.initialized;
    // @ts-expect-error
    this.defaults = component._getDefaultOptions?.() ?? {};
    this.internalOptions = signal({
      options: extend(true, {}, component.option()),
      changes: null
    });
    this.updateIsControlledMode();
    component.on('optionChanged', this.onOptionChangedHandler.bind(this));
  }
  updateIsControlledMode() {
    const isControlledMode = this.component.option('integrationOptions.isControlledMode');
    this.isControlledMode = isControlledMode ?? false;
  }
  onOptionChangedHandler(optionChanges) {
    const {
      fullName
    } = optionChanges;
    this.updateIsControlledMode();
    this.updateInternalOptionsState(fullName, optionChanges);
  }
  updateInternalOptionsState(optionFullName, changes = null) {
    const pathParts = getPathParts(optionFullName);
    this.internalOptions.value = {
      options: mergeOptionTrees(this.internalOptions.peek().options, this.component.option(), this.defaults, pathParts),
      changes
    };
  }
  oneWay(name) {
    return getOr(this.cache.oneWay, name, () => {
      const pathArray = getPathParts(name);
      return computed(() => getTreeNodeByPath(this.internalOptions.value.options, pathArray));
    });
  }
  oneWayWithChanges(name) {
    return getOr(this.cache.oneWayWithChanges, name, () => {
      const pathArray = getPathParts(name);
      return computed(() => {
        const {
          options,
          changes
        } = this.internalOptions.value;
        return {
          value: getTreeNodeByPath(options, pathArray),
          changes
        };
      });
    });
  }
  twoWay(name) {
    return getOr(this.cache.twoWay, name, () => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const obs = signal(this.component.option(name));
      effect(() => {
        obs.value = this.oneWay(name).value;
      });
      return {
        get value() {
          return obs.value;
        },
        set value(value) {
          const isInitialized = that.initialized.peek();
          const callbackName = `on${name}Change`;
          const callback = that.component.option(callbackName);
          const isControlled = that.isControlledMode && that.component.option(name) !== undefined;
          if (isControlled) {
            callback?.(value);
            return;
          }
          that.component.option(name, value);

          // 🚨🚨🚨 Hotfix for filterSync
          // Unit widget is initialized, the optionChange callback doesn't fire
          // So, in this case we sync our internal options state with option manager manually
          // TODO filterSync: refactor filter and get rid of set values to twoWay bindings
          //   before the widget/optionManager is initialized
          if (!isInitialized) {
            that.updateInternalOptionsState(name);
          }
          callback?.(value);
        },
        peek() {
          return obs.peek();
        },
        subscribe(...params) {
          // @ts-expect-error
          return obs.subscribe(...params);
        },
        toJSON(...params) {
          // @ts-expect-error
          return obs.toJSON(...params);
        },
        valueOf(...params) {
          // @ts-expect-error
          return obs.valueOf(...params);
        },
        brand: obs.brand
      };
    });
  }
  normalizeTemplate(template) {
    // @ts-expect-error
    return TemplateWrapper(this.component._getTemplate(template));
  }
  template(name) {
    return getOr(this.cache.template, name, () => {
      const templateOption = this.oneWay(name);
      return computed(
      // @ts-expect-error
      () => templateOption.value && this.normalizeTemplate(templateOption.value));
    });
  }
  action(name) {
    return getOr(this.cache.action, name, () => {
      const actionOption = this.oneWay(name);
      return computed(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        actionOption.value;
        // @ts-expect-error
        return this.component._createActionByOption(name);
      });
    });
  }
}

class GridCoreOptionsController extends OptionsController {}

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

class DIContext {
  instances = new Map();
  fabrics = new Map();
  aliases = new Map();
  antiRecursionSet = new Set();
  globalDecorators = [];
  register(id, fabric) {
    // eslint-disable-next-line no-param-reassign
    fabric ??= id;
    this.fabrics.set(id, fabric);
  }
  registerInstance(id, instance) {
    const decoratedInstance = this.applyGlobalDecorators(instance);
    this.instances.set(id, decoratedInstance);
  }
  get(id) {
    const instance = this.tryGet(id);
    if (instance) {
      return instance;
    }
    throw new Error(`DI item is not registered: ${id}`);
  }
  tryGet(id) {
    // eslint-disable-next-line no-param-reassign
    id = this.resolveAlias(id);
    if (this.instances.get(id)) {
      return this.instances.get(id);
    }
    const fabric = this.fabrics.get(id);
    if (fabric) {
      const instance = this.create(fabric);
      const decoratedInstance = this.applyGlobalDecorators(instance);
      this.instances.set(id, decoratedInstance);
      this.instances.set(fabric, decoratedInstance);
      return decoratedInstance;
    }
    return null;
  }
  registerDecorator(decoratorFn) {
    if (this.hasInitiatedInstances) {
      throw new Error('Cannot register decorator: decorators must be registered before any instances are created or retrieved from the DI container.');
    }
    this.globalDecorators.push(decoratorFn);
  }
  get hasInitiatedInstances() {
    return this.instances.size > 0;
  }
  applyGlobalDecorators(instance) {
    return this.globalDecorators.reduce((currentInstance, currentDecorator) => currentDecorator(currentInstance), instance);
  }
  create(fabric) {
    if (this.antiRecursionSet.has(fabric)) {
      throw new Error('dependency cycle in DI');
    }
    this.antiRecursionSet.add(fabric);
    const args = fabric.dependencies.map(dependency => this.get(dependency));
    this.antiRecursionSet.delete(fabric);

    // eslint-disable-next-line new-cap
    return new fabric(...args);
  }
  addAlias(aliasId, id) {
    this.aliases.set(aliasId, id);
  }
  resolveAlias(aliasId) {
    let result = aliasId;

    /*
      NOTE: cycle it here for case when some alias resolves to another alias.
      e.g. A -> B -> C
      We need to resolve until we get class without aliases
    */
    while (this.aliases.has(result)) {
      result = this.aliases.get(result);
    }
    return result;
  }
}

class ToolbarController {
  static dependencies = [GridCoreOptionsController];
  constructor(options) {
    this.options = options;
    this.itemSubscriptions = {};
    this.defaultItems = signal({});
    this.userItems = this.options.oneWay('toolbar.items');
    this.items = computed(() => normalizeToolbarItems(getSortedToolbarItems(this.defaultItems.value), this.userItems.value, DEFAULT_TOOLBAR_ITEMS));
  }
  addDefaultItem(item, needRender = signal(true)) {
    const {
      name
    } = item.peek();
    this.itemSubscriptions[name] = effect(() => {
      const newDefaultItems = {
        ...this.defaultItems.peek()
      };
      if (needRender.value) {
        newDefaultItems[name] = item.value;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete newDefaultItems[name];
      }
      this.defaultItems.value = newDefaultItems;
    });
  }
}

const mergeColumnHeaderFilterOptions = (column, rootOptions) => {
  const {
    texts,
    visible,
    ...restRootOptions
  } = rootOptions ?? {};
  return {
    ...column,
    allowHeaderFiltering: !!rootOptions?.visible && !!column?.allowFiltering && !!column?.allowHeaderFiltering,
    headerFilter: {
      ...restRootOptions,
      ...column?.headerFilter,
      search: {
        ...restRootOptions?.search,
        ...column?.headerFilter?.search
      }
    }
  };
};
const getColumnIdentifier = column => column.name ?? column.dataField;
const getColumnName = column => {
  const name = getColumnIdentifier(column);
  if (!isDefined(name)) {
    throw errors.Error('E1049', column.caption);
  }
  return name;
};
const getFilterOperator = (values, filterType) => {
  const isInclude = !filterType || filterType === 'include';
  const isValueArray = Array.isArray(values);
  switch (true) {
    case isValueArray && isInclude:
      return 'anyof';
    case isValueArray && !isInclude:
      return 'noneof';
    case !isValueArray && isInclude:
      return '=';
    case !isValueArray && !isInclude:
      return '<>';
    default:
      throw new Error('Invalid state');
  }
};
const isFilteringAllowed = column => column.allowFiltering || column.allowHeaderFiltering;
const isColumnFilterable = column => isFilteringAllowed(column);
const getFilterExpression = (filterValues, column) => {
  const columnName = getColumnName(column);
  const hasGroupInterval = !!column.headerFilter?.groupInterval;
  const needNormalizeFilterValues = filterValues?.length === 1 && !hasGroupInterval;
  const normalizedFilterValues = needNormalizeFilterValues ? filterValues[0] : filterValues;
  const filterOperator = getFilterOperator(normalizedFilterValues, column.filterType);
  return [columnName, filterOperator, normalizedFilterValues];
};

// NOTE: Logic from util function grid_core/filter/m_filter_sync "getConditionFromHeaderFilter"
const getHeaderFilterValuesType = column => {
  const {
    filterValues
  } = column;

  // NOTE: if empty or an empty array
  if (!filterValues?.length) {
    return 'empty';
  }
  const [firstFilterItem] = filterValues;
  const hasGroupInterval = !!filteringUtils.getGroupInterval(column);
  const hasCustomDataSource = !!column.headerFilter?.dataSource;
  const isSingleValue = filterValues.length === 1 && !Array.isArray(firstFilterItem)
  // NOTE: "canSyncHeaderFilterWithFilterRow" logic part
  && (!hasGroupInterval && !hasCustomDataSource || filterValues.length === 1 && firstFilterItem === null);
  return isSingleValue ? 'single-value' : 'values-or-condition';
};
const getHeaderFilterInfo = column => {
  if (!isFilteringAllowed(column)) {
    return null;
  }
  const columnId = getColumnIdentifier(column);
  const headerFilterValueType = getHeaderFilterValuesType(column);
  if (headerFilterValueType === 'empty') {
    return {
      type: 'empty',
      columnId,
      filterType: 'include',
      filterValues: [],
      composedFilterValues: []
    };
  }
  const {
    filterType,
    filterValues
  } = column;
  const normalizedFilterType = filterType ?? 'include';
  const normalizedFilterValues = Array.isArray(filterValues) ? filterValues : [filterValues];
  const filterValuesWithExpressions = normalizedFilterValues.filter(value => Array.isArray(value));
  const filterValuesWithoutExpressions = normalizedFilterValues.filter(value => !Array.isArray(value));
  const filterExpression = filterValuesWithoutExpressions.length ? [getFilterExpression(filterValuesWithoutExpressions, column)] : [];
  const composedFilterValues = gridCoreUtils.combineFilters([...filterExpression, ...filterValuesWithExpressions], 'or');
  return {
    type: headerFilterValueType,
    columnId,
    filterType: normalizedFilterType,
    filterValues,
    composedFilterValues
  };
};
const getHeaderFilterInfoArray = columns => columns.map(column => getHeaderFilterInfo(column)).filter(info => !!info);
const getComposedHeaderFilter = headerFilterInfoArray => headerFilterInfoArray
// NOTE: Exclude empty header filters from the composed header filter value
.filter(({
  type
}) => type !== 'empty').reduce((result, {
  composedFilterValues
}, idx, infoArray) => {
  result.push(composedFilterValues);
  if (idx < infoArray.length - 1) {
    result.push('and');
  }
  return result;
}, []);

const defaultSetFieldValue = function (newData, value) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const column = this;
  const {
    dataField
  } = column;
  if (!dataField) {
    return;
  }
  newData[dataField] = value;
};
class PendingPromises {
  promises = new Set();
  waitForAll() {
    return Promise.all([...this.promises]);
  }
  add(p) {
    this.promises.add(p);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    p.then(() => {
      this.promises.delete(p);
    });
    return p;
  }
}

const parseNumberValue = (text, format) => {
  switch (true) {
    case isString(text) && !!format:
      return strictParseNumber(text.trim(), format);
    case isDefined(text) && isNumeric(text):
      return Number(text);
    default:
      return undefined;
  }
};
const parseBooleanValue = (text, trueText, falseText) => {
  switch (true) {
    case text === trueText:
      return true;
    case text === falseText:
      return false;
    default:
      return undefined;
  }
};
const parseDateValue = (text, format) => {
  let parsedValue = null;
  if (format) {
    try {
      // @ts-expect-error
      parsedValue = dateLocalization.parse(text, format);
    } catch {
      parsedValue = null;
    }
  }
  if (!parsedValue) {
    parsedValue = new Date(text);
  }
  return isNaN(parsedValue.getTime()) ? text : parsedValue;
};
const parseValue = (column, text) => {
  switch (true) {
    case column.dataType === 'number':
      return parseNumberValue(text, column.format);
    case column.dataType === 'boolean':
      return parseBooleanValue(text, column.trueText, column.falseText);
    case gridCoreUtils.isDateType(column.dataType):
      return parseDateValue(text, column.format);
    default:
      return text;
  }
};

const defaultColumnProperties = {
  dataType: 'string',
  calculateFieldValue(data) {
    // @ts-expect-error
    const value = data[this.dataField];
    return parseValue(this, value) ?? value;
  },
  calculateDisplayValue(data) {
    return this.calculateFieldValue(data);
  },
  calculateFilterExpression: filteringUtils.defaultCalculateFilterExpression,
  defaultCalculateFilterExpression: filteringUtils.defaultCalculateFilterExpression,
  alignment: 'left',
  visible: true,
  allowReordering: true,
  allowHiding: true,
  trueText: undefined,
  falseText: undefined,
  showInColumnChooser: true,
  validationRules: [],
  allowEditing: true,
  editorOptions: {},
  formItem: {},
  setFieldValue: defaultSetFieldValue,
  defaultSetFieldValue
};
const defaultColumnPropertiesByDataType = {
  boolean: {
    customizeText({
      value
    }) {
      const trueText = this.trueText ?? messageLocalization.format('dxDataGrid-trueText');
      const falseText = this.falseText ?? messageLocalization.format('dxDataGrid-falseText');
      return value ? trueText : falseText;
    }
  },
  string: {},
  date: {
    format: 'shortDate'
  },
  datetime: {
    format: 'shortDateShortTime'
  },
  number: {},
  object: {}
};
const defaultOptions$i = {
  allowColumnReordering: false
};

function normalizeColumn(column, templateNormalizationFunc, columnFromDataOptions) {
  const dataType = column.dataType ?? columnFromDataOptions?.dataType ?? defaultColumnProperties.dataType;
  const columnDataTypeDefaultOptions = defaultColumnPropertiesByDataType[dataType];
  const columnFormat = column.format ?? columnDataTypeDefaultOptions?.format ?? columnFromDataOptions?.format;
  const caption = captionize(column.name);
  const colWithDefaults = {
    ...defaultColumnProperties,
    ...columnDataTypeDefaultOptions,
    caption,
    ...column
  };
  const normalizedColumn = {
    ...colWithDefaults,
    dataType,
    ...(!!columnFormat && {
      format: columnFormat
    }),
    calculateDisplayValue: isString(colWithDefaults.calculateDisplayValue) ? compileGetter(colWithDefaults.calculateDisplayValue) : colWithDefaults.calculateDisplayValue,
    headerItemTemplate: templateNormalizationFunc?.(colWithDefaults.headerItemTemplate),
    fieldTemplate: templateNormalizationFunc?.(colWithDefaults.fieldTemplate),
    fieldCaptionTemplate: templateNormalizationFunc?.(colWithDefaults.fieldCaptionTemplate),
    fieldValueTemplate: templateNormalizationFunc?.(colWithDefaults.fieldValueTemplate),
    // @ts-expect-error for compatibility
    calculateCellValue: colWithDefaults.calculateFieldValue,
    allowFiltering: colWithDefaults.allowFiltering ?? !!colWithDefaults.dataField,
    allowHeaderFiltering: colWithDefaults.allowHeaderFiltering ?? colWithDefaults.allowFiltering ?? !!colWithDefaults.dataField,
    allowSearch: colWithDefaults.allowSearch ?? colWithDefaults.allowFiltering ?? !!colWithDefaults.dataField,
    allowSorting: colWithDefaults.allowSorting ?? !!colWithDefaults.dataField
  };
  normalizedColumn.selector ??= data => normalizedColumn.calculateFieldValue(data);
  return normalizedColumn;
}
function getVisibleIndexes(indexes) {
  const newIndexes = [...indexes];
  let minNonExistingIndex = 0;
  indexes.forEach((visibleIndex, index) => {
    while (newIndexes.includes(minNonExistingIndex)) {
      minNonExistingIndex += 1;
    }
    newIndexes[index] = visibleIndex ?? minNonExistingIndex;
  });
  return newIndexes;
}
function normalizeVisibleIndexes(indexes, forceIndex) {
  const indexMap = indexes.map((visibleIndex, index) => [index, visibleIndex]);
  const sortedIndexMap = new Array(indexes.length);
  if (isDefined(forceIndex)) {
    sortedIndexMap[indexes[forceIndex]] = forceIndex;
  }
  let j = 0;
  indexMap.sort((a, b) => a[1] - b[1]).forEach(([index]) => {
    if (index === forceIndex) {
      return;
    }
    if (isDefined(sortedIndexMap[j])) {
      j += 1;
    }
    sortedIndexMap[j] = index;
    j += 1;
  });
  const returnIndexes = new Array(indexes.length);
  sortedIndexMap.forEach((index, visibleIndex) => {
    returnIndexes[index] = visibleIndex;
  });
  return returnIndexes;
}
function normalizeColumnsVisibleIndexes(columns, forceIndex) {
  const result = [...columns];
  const visibleIndexes = normalizeVisibleIndexes(columns.map(c => c.visibleIndex), forceIndex);
  visibleIndexes.forEach((visibleIndex, i) => {
    result[i].visibleIndex = visibleIndex;
  });
  return result;
}
function normalizeColumns(columns, templateNormalizationFunc, columnsFromData) {
  return columns.map(col => {
    const columnFromDataOptions = columnsFromData?.[col.name];
    return normalizeColumn(col, templateNormalizationFunc, columnFromDataOptions);
  });
}
function preNormalizeColumns(columns) {
  const normalizedColumns = columns?.map(column => {
    if (typeof column === 'string') {
      return {
        dataField: column
      };
    }
    return column;
  }).map((column, index) => ({
    ...column,
    name: column.name ?? column.dataField ?? `column-${index}`
  }));
  const visibleIndexes = getVisibleIndexes(normalizedColumns?.map(c => c.visibleIndex));
  normalizedColumns?.forEach((_, i) => {
    normalizedColumns[i].visibleIndex = visibleIndexes[i];
  });
  return normalizedColumns;
}
function getColumnIndexByName(columns, name) {
  return columns.findIndex(c => c.name === name);
}
function getColumnByIndexOrName(columns, columnNameOrIndex) {
  const column = columns.find((c, i) => {
    if (isString(columnNameOrIndex)) {
      return c.name === columnNameOrIndex;
    }
    return i === columnNameOrIndex;
  });
  return column;
}
const getValueDataType = value => {
  const dataType = type(value);
  const isUnknownDataType = dataType !== 'string' && dataType !== 'boolean' && dataType !== 'number' && dataType !== 'date' && dataType !== 'object';
  return isUnknownDataType ? undefined : dataType;
};
const getColumnFormat = column => {
  if (column.format) {
    return column.format;
  }
  if (column.dataType === 'date' || column.dataType === 'datetime') {
    return 'shortDate';
  }
  return undefined;
};
const getColumnOptionsFromDataItem = dataItem => {
  const dataFields = Object.keys(dataItem);
  return {
    dataFields,
    columns: Object.entries(dataItem).reduce((result, [key, value]) => {
      const dataType = getValueDataType(value);
      const format = getColumnFormat({
        dataType
      });
      result[key] = {
        dataType,
        format
      };
      return result;
    }, {})
  };
};
const columnOptionUpdate = (settings, columnIdx, updatePath, value) => {
  const newSettings = [...settings];
  const updatePathParts = getPathParts(updatePath);
  const columnTreeNode = getTreeNodeByPath(newSettings[columnIdx], updatePathParts);
  if (columnTreeNode === value) {
    return settings;
  }
  newSettings[columnIdx] = setTreeNodeByPath(settings[columnIdx], value, updatePathParts);
  return normalizeColumnsVisibleIndexes(newSettings, columnIdx);
};
function addDataFieldToComputedColumns(columns) {
  return columns.map(column => {
    if (column.dataField) {
      return column;
    }

    // NOTE: same logic in datagrid
    return {
      ...column,
      dataField: column.name
    };
  });
}

const isAllowedColumnValue = value => isObject(value) || typeof value === 'string';
const isCorrectColumnIdx = pathIdx => !isNaN(+pathIdx) && pathIdx !== null;
const getColumnIdxFromPath = path => +path[1];
const getColumnOptionPathStr = path => [...path].splice(2).join('.');

const ROOT_COLUMNS_OPTION_NAME = 'columns';
const extractColumnsOptionsChange = ({
  fullName,
  value
}) => {
  const updatePath = getPathParts(fullName);
  const [rootUpdatePath] = updatePath;
  switch (true) {
    case rootUpdatePath !== ROOT_COLUMNS_OPTION_NAME:
      return null;
    // NOTE: Whole columns array update case:
    // -> 'columns'
    case updatePath.length === 1 && Array.isArray(value):
      return {
        type: 'allColumns',
        value: value ?? null
      };
    // NOTE: Specific column update case:
    // -> 'columns[idx]'
    case updatePath.length === 2 && isAllowedColumnValue(value) && isCorrectColumnIdx(updatePath[1]):
      return {
        type: 'column',
        columnIdx: getColumnIdxFromPath(updatePath),
        value
      };
    // NOTE: Specific column property update case:
    // -> 'columns[idx].property'
    // -> 'columns[idx].nested.anotherNester.property'
    case updatePath.length > 2 && isCorrectColumnIdx(updatePath[1]):
      return {
        type: 'columnOption',
        columnIdx: getColumnIdxFromPath(updatePath),
        optionPath: getColumnOptionPathStr(updatePath),
        value
      };
    default:
      return null;
  }
};

const updateAllColumns = (settings, {
  value
}) => value ? preNormalizeColumns(value) : settings;
const updateColumn = (settings, {
  columnIdx,
  value
}) => {
  const newSettings = [...settings];
  newSettings[columnIdx] = value;
  return preNormalizeColumns(newSettings);
};
const updateColumnOption = (settings, {
  columnIdx,
  optionPath,
  value
}) => columnOptionUpdate(settings, columnIdx, optionPath, value);
const updateColumnSettings = (settings, optionsChange) => {
  if (!optionsChange) {
    return settings;
  }
  const columnsOptionsChange = extractColumnsOptionsChange(optionsChange);
  switch (columnsOptionsChange?.type) {
    case 'allColumns':
      return updateAllColumns(settings, columnsOptionsChange);
    case 'column':
      return updateColumn(settings, columnsOptionsChange);
    case 'columnOption':
      return updateColumnOption(settings, columnsOptionsChange);
    default:
      return settings;
  }
};

class ColumnsController {
  static dependencies = [GridCoreOptionsController];
  constructor(options) {
    this.options = options;
    this.columnsConfiguration = this.options.oneWayWithChanges('columns');
    this.headerFilterConfiguration = this.options.oneWay('headerFilter');
    this.columnsSettings = signal([]);
    this.columnsConfigurationFromData = signal(null);
    effect(() => {
      const settings = this.columnsSettings.peek() ?? [];
      const {
        value: columnsConfigurationFromOptions,
        changes
      } = this.columnsConfiguration.value;
      const newSettings = updateColumnSettings(settings, changes);
      if (newSettings.length !== 0) {
        this.columnsSettings.value = newSettings;
        return;
      }
      const columnsConfigurationFromData = this.columnsConfigurationFromData.value?.dataFields;
      const columnsConfiguration = columnsConfigurationFromOptions ?? columnsConfigurationFromData ?? [];
      this.columnsSettings.value = preNormalizeColumns(columnsConfiguration);
    });
    this.columns = computed(() => {
      const columnsSettings = this.columnsSettings.value;
      const headerFilterRootOptions = this.headerFilterConfiguration.value;
      const columnsFromDataOptions = this.columnsConfigurationFromData.value?.columns;
      return normalizeColumns(columnsSettings ?? [], template => template ? this.options.normalizeTemplate(template) : undefined, columnsFromDataOptions).map(column => mergeColumnHeaderFilterOptions(column, headerFilterRootOptions));
    });
    this.filterableColumns = computed(() => this.columns.value.filter(col => isColumnFilterable(col)));
    this.visibleColumns = computed(() => this.columns.value.filter(column => column.visible).sort((a, b) => a.visibleIndex - b.visibleIndex).map((column, index) => ({
      ...column,
      headerPanelIndex: index
    })));
    this.nonVisibleColumns = computed(() => this.columns.value.filter(column => !column.visible));
    this.allowColumnReordering = this.options.oneWay('allowColumnReordering');
  }
  addColumn(columnProps) {
    this.columnsSettings.value = preNormalizeColumns([...this.columnsSettings.peek(), columnProps]);
  }
  deleteColumn(column) {
    this.columnsSettings.value = this.columnsSettings.peek().filter(c => c.name !== column.name);
  }
  columnOption({
    name
  },
  // TODO: Fix type -> option may be path with dots in runtime
  //  E.g: 'columnOption('A', 'headerFilter.search.enabled', true)
  option, value) {
    const settings = this.columnsSettings.peek();
    const columnIdx = getColumnIndexByName(settings, name);
    this.columnsSettings.value = columnOptionUpdate(settings, columnIdx, option, value);
  }
  updateColumns(func) {
    let newColumnSettings = func(this.columnsSettings.peek());
    newColumnSettings = normalizeColumnsVisibleIndexes(newColumnSettings);
    this.columnsSettings.value = newColumnSettings;
  }
  setColumnOptionsFromDataItem(item) {
    if (this.columnsConfigurationFromData.value) {
      return;
    }
    this.columnsConfigurationFromData.value = getColumnOptionsFromDataItem(item);
  }
  resetColumnOptionsFromDataItem() {
    this.columnsConfigurationFromData.value = null;
  }
}

const getName = () => 'dxCardView';
const addWidgetPrefix = className => `dx-${getName().slice(2).toLowerCase()}${className ? `-${className}` : ''}`;

/* eslint-disable
  @typescript-eslint/explicit-module-boundary-types,
  @typescript-eslint/no-explicit-any
*/

const HIGHLIGHT_SPLIT_SEPARATOR = '<--|-->';
const FILTERING_TIMEOUT = 700;
const CLASS$6 = {
  searchPanel: 'search-panel'
};
const compareTextPart = (textPart, searchStr, caseSensitive) => caseSensitive ? textPart === searchStr : textPart.toLowerCase() === searchStr.toLowerCase();
const splitHighlightedText = (text, {
  enabled,
  searchStr,
  caseSensitive
}) => {
  if (!enabled || !searchStr) {
    return null;
  }

  // NOTE: backslash special characters for correct regexp matches
  const normalizedSearchStr = searchStr.replace(/\W|_/g, match => `\\${match}`);
  const regExp = new RegExp(normalizedSearchStr, `g${caseSensitive ? '' : 'i'}`);
  if (!text.match(regExp)?.length) {
    return null;
  }
  return text.replace(regExp, match => `${HIGHLIGHT_SPLIT_SEPARATOR}${match}${HIGHLIGHT_SPLIT_SEPARATOR}`).split(HIGHLIGHT_SPLIT_SEPARATOR).filter(textPart => !!textPart).map(textPart => ({
    type: compareTextPart(textPart, searchStr, caseSensitive) ? 'highlighted' : 'usual',
    text: textPart
  }));
};
const allowSearch = (column, searchVisibleColumnsOnly) => {
  const allowSearchByVisibility = !searchVisibleColumnsOnly || column.visible;
  const allowSearchByConfig = column.allowSearch;
  return allowSearchByVisibility && allowSearchByConfig;
};
const createFilterExpression = (column, filterValue, selectedFilterOperation, target) => {
  let result = column.calculateFilterExpression(filterValue, selectedFilterOperation, target);
  if (isFunction(result)) {
    result = [result, '=', true];
  }
  return result;
};
const calculateSearchFilter = (text, columns, searchVisibleColumnsOnly) => {
  const filters = [];
  if (!text) return null;
  for (const column of columns) {
    if (allowSearch(column, searchVisibleColumnsOnly)) {
      const filterValue = parseValue(column, text);
      if (filterValue !== undefined) {
        const expression = createFilterExpression(column, filterValue, undefined, 'search');
        filters.push(expression);
      }
    }
  }
  if (filters.length === 0) {
    return ['!'];
  }
  return gridCoreUtils.combineFilters(filters, 'or');
};

// eslint-disable-next-line @typescript-eslint/init-declarations
let timer;
const addSearchTextBox = (props, setTextBoxRef) => ({
  name: 'searchPanel',
  showText: 'inMenu',
  location: 'after',
  locateInMenu: 'auto',
  widget: 'dxTextBox',
  options: {
    onContentReady: ({
      component
    }) => {
      setTextBoxRef(component);
    },
    onInput: e => {
      clearTimeout(timer);
      const component = e.component;
      const newValue = component._input().val();
      timer = setTimeout(() => {
        props.onValueChanged?.(newValue);
      }, FILTERING_TIMEOUT);
    },
    value: props.value,
    placeholder: props.placeholder,
    width: props.width,
    inputAttr: {
      'aria-label': messageLocalization.format(`${getName()}-ariaSearchInGrid`)
    },
    elementAttr: {
      class: addWidgetPrefix(CLASS$6.searchPanel)
    },
    mode: 'search',
    onDisposing: () => {
      clearTimeout(timer);
    }
  }
});

class SearchController {
  static dependencies = [GridCoreOptionsController, ColumnsController];
  constructor(options, columnsController) {
    this.options = options;
    this.columnsController = columnsController;
    this.highlightTextOptions = computed(() => {
      const searchOptions = this.options.oneWay('searchPanel').value;
      return {
        enabled: searchOptions.highlightSearchText,
        caseSensitive: searchOptions.highlightCaseSensitive,
        searchStr: searchOptions.text
      };
    });
    this.searchTextOption = this.options.twoWay('searchPanel.text');
    this.searchPlaceholder = this.options.oneWay('searchPanel.placeholder');
    this.searchWidth = this.options.oneWay('searchPanel.width');
    this.searchVisibleColumnsOnly = this.options.oneWay('searchPanel.searchVisibleColumnsOnly');
    this.searchFilter = computed(() => {
      const searchText = this.searchTextOption.value;
      const columns = this.columnsController.columns.value;
      const searchVisibleColumnsOnly = this.searchVisibleColumnsOnly.value;
      return calculateSearchFilter(searchText, columns, searchVisibleColumnsOnly);
    });
    this.getHighlightedText = text => splitHighlightedText(text, this.highlightTextOptions.peek());
    this.updateSearchText = text => {
      this.searchTextOption.value = text;
    };
  }
}

class SearchUIController {
  static dependencies = [];
  callbacks = {};
  registerCallback(name, callback) {
    this.callbacks[name] = callback;
  }
  doUIAction(name) {
    this.callbacks[name]?.();
  }
}

class SearchView {
  static dependencies = [GridCoreOptionsController, ToolbarController, SearchUIController, SearchController];
  constructor(options, toolbarController, searchUIController, searchController) {
    this.options = options;
    this.toolbarController = toolbarController;
    this.searchUIController = searchUIController;
    this.searchController = searchController;
    this.searchTextBox = signal(null);
    const toolbarItem = addSearchTextBox({
      placeholder: this.getPlaceholder(),
      value: this.searchController.searchTextOption.value,
      width: this.searchController.searchWidth.value,
      onValueChanged: text => {
        this.searchController.updateSearchText(text);
      }
    }, component => {
      this.searchTextBox.value = component;
    });
    this.toolbarController.addDefaultItem(signal(toolbarItem), this.options.oneWay('searchPanel.visible'));
    effect(() => {
      this.searchTextBox.value?.option('value', this.searchController.searchTextOption.value);
      this.searchTextBox.value?.option('placeholder', this.getPlaceholder());
      this.searchTextBox.value?.option('width', this.searchController.searchWidth.value);
    });
    this.searchUIController.registerCallback('focusSearchTextBox', () => {
      this.searchTextBox.value?.focus();
    });
  }
  getPlaceholder() {
    return this.searchController.searchPlaceholder.value ?? messageLocalization.format('dxDataGrid-searchPanelPlaceholder');
  }
}

class ErrorController {
  _errors = signal([]);
  errors = this._errors;
  static dependencies = [];
  counter = 0;
  showError(error) {
    this._errors.value = [...this._errors.peek(), {
      text: error,
      id: this.counter
    }];
    this.counter += 1;
  }
  removeError(index) {
    const newErrors = this._errors.peek().slice();
    newErrors.splice(index, 1);
    this._errors.value = newErrors;
  }
}

class CompatibilityColumnsController {
  static dependencies = [ColumnsController];
  constructor(realColumnsController) {
    this.realColumnsController = realColumnsController;
  }
  getColumns() {
    return this.realColumnsController.columns.peek();
  }
  getFilteringColumns() {
    return addDataFieldToComputedColumns(this.realColumnsController.filterableColumns.peek());
  }
}

/* eslint-disable consistent-return */

function PublicMethods$9(GridCore) {
  return class GridCoreWithColumnsController extends GridCore {
    getVisibleColumns() {
      return this.columnsController.visibleColumns.peek();
    }
    addColumn(column) {
      this.columnsController.addColumn(column);
    }
    getVisibleColumnIndex(columnNameOrIndex) {
      const column = getColumnByIndexOrName(this.columnsController.columns.peek(), columnNameOrIndex);
      return this.columnsController.visibleColumns.peek().findIndex(c => c.name === column?.name);
    }
    deleteColumn(columnNameOrIndex) {
      const column = getColumnByIndexOrName(this.columnsController.columns.peek(), columnNameOrIndex);
      if (!column) {
        return;
      }
      this.columnsController.deleteColumn(column);
    }
    columnOption(columnNameOrIndex, option, value
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ) {
      const column = getColumnByIndexOrName(this.columnsController.columns.peek(), columnNameOrIndex);
      if (!column) {
        return;
      }
      if (arguments.length === 1) {
        return column;
      }
      if (arguments.length === 2) {
        if (isObject(option)) {
          Object.entries(option).forEach(([optionName, optionValue]) => {
            this.columnsController.columnOption(column, optionName, optionValue);
          });
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return column[option];
        }
      }
      if (arguments.length === 3) {
        this.columnsController.columnOption(column, option, value);
      }
    }
  };
}

class HeaderFilterController {
  static dependencies = [ColumnsController];
  constructor(columnsController) {
    this.columnsController = columnsController;
    this.headerFilterInfoArray = computed(() => getHeaderFilterInfoArray(this.columnsController.visibleColumns.value));
    this.composedHeaderFilter = computed(() => getComposedHeaderFilter(this.headerFilterInfoArray.value));
  }
  clearHeaderFilters() {
    this.columnsController.updateColumns(columns => columns.map(col => {
      delete col.filterValues;
      delete col.filterType;
      return col;
    }));
  }
}

// NOTE: This code moved from old grid_core/header_filter/m_header_filter
// with minimal possible modifications
/* eslint-disable
   @typescript-eslint/explicit-function-return-type,
   @typescript-eslint/no-unsafe-return,
   @typescript-eslint/naming-convention,
   no-plusplus,
   @typescript-eslint/init-declarations,
   no-param-reassign,
   prefer-destructuring,
   @typescript-eslint/explicit-module-boundary-types,
   @typescript-eslint/no-explicit-any,
*/
const getHeaderItemText = (displayValue, column, currentLevel,
// NOTE: Only text used from header filter options
headerFilterOptions) => {
  let text = gridCoreUtils.formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));
  if (!text) {
    text = headerFilterOptions?.texts?.emptyValue ?? messageLocalization.format('dxDataGrid-headerFilterEmptyValue');
  }
  return text;
};
const _updateSelectedState = (items, column) => {
  let i = items.length;
  const isExclude = column.filterType === 'exclude';
  while (i--) {
    const item = items[i];
    if ('items' in items[i]) {
      _updateSelectedState(items[i].items, column);
    }
    updateHeaderFilterItemSelectionState(item, gridCoreUtils.getIndexByKey(items[i].value, column.filterValues, null) > -1, isExclude);
  }
};
const _normalizeGroupItem = (item, currentLevel, options) => {
  let value;
  let displayValue;
  const {
    path
  } = options;
  const {
    valueSelector
  } = options;
  const {
    displaySelector
  } = options;
  const {
    column
  } = options;
  if (valueSelector && displaySelector) {
    value = valueSelector(item);
    displayValue = displaySelector(item);
  } else {
    value = item.key;
    displayValue = value;
  }
  if (!isObject(item)) {
    item = {};
  } else {
    item = extend({}, item);
  }
  path.push(value);
  if (path.length === 1) {
    // NOTE: Important! Deconstructing here causes a lot of failed usage scenarios.

    item.value = path[0];
  } else {
    item.value = path.join('/');
  }
  item.text = getHeaderItemText(displayValue, column, currentLevel, options.headerFilterOptions);
  return item;
};
const _processGroupItems = (groupItems, currentLevel, path, options) => {
  const {
    level
  } = options;
  path = path || [];
  currentLevel = currentLevel || 0;
  for (let i = 0; i < groupItems.length; i++) {
    groupItems[i] = _normalizeGroupItem(groupItems[i], currentLevel, {
      column: options.column,
      headerFilterOptions: options.headerFilterOptions,
      path
    });
    if ('items' in groupItems[i]) {
      if (currentLevel === level || !isDefined(groupItems[i].value)) {
        delete groupItems[i].items;
      } else {
        _processGroupItems(groupItems[i].items, currentLevel + 1, path, options);
      }
    }
    path.pop();
  }
};
const getDataSourceOptions = (storeLoadAdapter, popupOptions, headerFilterOptions, filter) => {
  const {
    column
  } = popupOptions;
  if (!storeLoadAdapter) {
    return undefined;
  }
  const {
    grouping: localGrouping
  } = storeLoadAdapter.getLocalLoadOperations();
  const remoteGrouping = !localGrouping;
  const group = gridCoreUtils.getHeaderFilterGroupParameters(column, remoteGrouping);
  const headerFilterDataSource = column.headerFilter?.dataSource;
  const options = {};
  if (isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
    // @ts-expect-error
    options.dataSource = normalizeDataSourceOptions(headerFilterDataSource);
  } else {
    const cutoffLevel = Array.isArray(group) ? group.length - 1 : 0;
    options.dataSource = {
      filter,
      group,
      useDefaultSearch: true,
      load: loadOptions => {
        // @ts-expect-error Deferred ctor.
        const d = new Deferred();
        // NOTE: this marked as deprecated in original code
        loadOptions.dataField = column.dataField || column.name;
        storeLoadAdapter.load(loadOptions).done(data => {
          const convertUTCDates = remoteGrouping && isUTCFormat(column.serializationFormat) && cutoffLevel > 3;
          if (convertUTCDates) {
            data = convertDataFromUTCToLocal(data, column);
          }
          _processGroupItems(data, null, null, {
            level: cutoffLevel,
            column,
            headerFilterOptions
          });
          d.resolve(data);
        }).fail(d.reject);
        return d;
      }
    };
  }
  if (isFunction(headerFilterDataSource)) {
    headerFilterDataSource.call(column, options);
  }
  const origPostProcess = options.dataSource.postProcess;
  options.dataSource.postProcess = data => {
    let items = data;
    items = origPostProcess?.call(undefined, items) || items;
    _updateSelectedState(items, {
      ...column,
      filterType: popupOptions.filterType,
      filterValues: popupOptions.filterValues
    });
    return items;
  };
  return options.dataSource;
};
const getHeaderFilterListType = column => {
  const groupInterval = filteringUtils.getGroupInterval(column);
  return groupInterval && groupInterval.length > 1 ? 'tree' : 'list';
};

// NOTE: This code moved from old grid_core/filter/m_filter_custom_operations
// with minimal possible modifications
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
function baseOperation(config) {
  const {
    getHeaderFilterController
  } = config;
  const calculateFilterExpression = function (filterValue, field, fields) {
    const result = [];
    const lastIndex = filterValue.length - 1;
    filterValue && filterValue.forEach((value, index) => {
      if (isCondition(value) || isGroup(value)) {
        const filterExpression = getFilterExpression$1(value, fields, [], 'headerFilter');
        result.push(filterExpression);
      } else {
        const filterExpression = getFilterExpression$1([field.dataField ?? field.name, '=', value], fields, [], 'headerFilter');
        result.push(filterExpression);
      }
      index !== lastIndex && result.push('or');
    });
    if (result.length === 1) {
      return result[0];
    }
    return result;
  };
  const getFullText = function (itemText, parentText) {
    return parentText ? `${parentText}/${itemText}` : itemText;
  };
  const getSelectedItemsTexts = function (items, parentText) {
    let result = [];
    items.forEach(item => {
      if (item.items) {
        const selectedItemsTexts = getSelectedItemsTexts(item.items, getFullText(item.text, parentText));
        result = result.concat(selectedItemsTexts);
      }
      item.selected && result.push(getFullText(item.text, parentText));
    });
    return result;
  };

  // Override in the private API WA [T1232532]
  const customizeText = function (fieldInfo, options) {
    options = options || {};
    const headerFilterController = getHeaderFilterController();
    const {
      value
    } = fieldInfo;
    let column = config.columnOption(fieldInfo.field.dataField);
    const headerFilter = column && column.headerFilter;
    // TODO: lookup is not supported in CardView yet
    const lookup = column && column.lookup;
    const values = options.values || [value];
    if (headerFilter && headerFilter.dataSource || lookup && lookup.dataSource) {
      // @ts-expect-error
      const result = new Deferred();
      // @ts-expect-error
      const itemsDeferred = options.items || new Deferred();
      if (!options.items) {
        column = extend({}, column, {
          filterType: 'include',
          filterValues: values
        });
        const dataSourceOptions = headerFilterController.getDataSource(column);
        dataSourceOptions.paginate = false;
        const dataSource = new DataSource(dataSourceOptions);
        const key = dataSource.store().key();
        if (key) {
          const {
            values
          } = options;
          if (values && values.length > 1) {
            const filter = values.reduce((result, value) => {
              if (result.length) {
                result.push('or');
              }
              result.push([key, '=', value]);
              return result;
            }, []);
            dataSource.filter(filter);
          } else {
            dataSource.filter([key, '=', fieldInfo.value]);
          }
        } else if (fieldInfo.field.calculateDisplayValue) {
          errors$1.log('W1017');
        }
        options.items = itemsDeferred;
        dataSource.load().done(itemsDeferred.resolve);
      }
      itemsDeferred.done(items => {
        const index = values.indexOf(fieldInfo.value);
        result.resolve(getSelectedItemsTexts(items, null)[index]);
      });
      return result;
    }
    const headerFilterOptions = config.getHeaderFilterOptions();
    const text = getHeaderItemText(value, column, 0, headerFilterOptions);
    return text;
  };
  return {
    dataTypes: ['string', 'date', 'datetime', 'number', 'boolean', 'object'],
    calculateFilterExpression,
    editorTemplate(conditionInfo, container) {
      const headerFilterController = getHeaderFilterController();
      const div = renderer('<div>').addClass('dx-filterbuilder-item-value-text').appendTo(container);
      const originalColumn = config.columnOption(conditionInfo.field.dataField);
      const column = extend(true, {}, originalColumn);
      renderValueText(div, conditionInfo.text && conditionInfo.text.split('|'));
      const setValue = function (value) {
        conditionInfo.setValue(value);
      };
      column.filterType = 'include';
      column.filterValues = conditionInfo.value ? conditionInfo.value.slice() : [];
      headerFilterController.showHeaderFilterMenuBase({
        columnElement: div,
        column,
        customApply(filterValues) {
          setValue(filterValues);
          headerFilterController.hideHeaderFilterMenu();
          conditionInfo.closeEditor();
        },
        onHidden() {
          conditionInfo.closeEditor();
        },
        isFilterBuilder: true
      });
      return container;
    },
    customizeText
  };
}
function anyOf(config) {
  return extend(baseOperation(config), {
    name: 'anyof',
    icon: 'selectall',
    caption: messageLocalization.format('dxFilterBuilder-filterOperationAnyOf')
  });
}
function noneOf(config) {
  const baseOp = baseOperation(config);
  return extend({}, baseOp, {
    calculateFilterExpression(filterValue, field, fields) {
      const baseFilter = baseOp.calculateFilterExpression(filterValue, field, fields);
      if (!baseFilter || baseFilter.length === 0) return null;
      return baseFilter[0] === '!' ? baseFilter : ['!', baseFilter];
    },
    name: 'noneof',
    icon: 'unselectall',
    caption: messageLocalization.format('dxFilterBuilder-filterOperationNoneOf')
  });
}

const defaultOptions$h = {
  searchPanel: {
    highlightCaseSensitive: false,
    highlightSearchText: true,
    placeholder: undefined,
    searchVisibleColumnsOnly: false,
    text: '',
    visible: false,
    width: 160
  }
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

function PublicMethods$8(GridCore) {
  return class GridCoreWithSearchController extends GridCore {
    searchByText(text) {
      this.searchController.updateSearchText(text);
    }
  };
}

const getAppliedFilterExpressions = (appliedFilters, columns, customOperations, filterSyncEnabled) => {
  const filters = [getFilterExpression$1(appliedFilters.filterPanel, addDataFieldToComputedColumns(columns), customOperations, 'filterBuilder'),
  // Note: Search filters do not contain filter expressions
  appliedFilters.search];
  if (!filterSyncEnabled) {
    filters.push(getFilterExpression$1(appliedFilters.headerFilter, addDataFieldToComputedColumns(columns), customOperations, 'headerFilter'));
  }
  return filters.filter(filter => filter);
};

/**
 * @param columnMap for internal usage inside util, omit this
 */
const normalizeFilterWithSelectors = (filter, columns, remoteFiltering, columnMap) => {
  if (!Array.isArray(filter)) return filter;
  if (!columnMap) {
    // eslint-disable-next-line no-param-reassign
    columnMap = new Map(columns.map(column => [column.dataField ?? column.name, column]));
  }
  const resultFilter = [...filter];
  if (isString(resultFilter[0]) && resultFilter[0] !== '!') {
    const column = columnMap.get(resultFilter[0]);
    if (column && !remoteFiltering) {
      resultFilter[0] = column.calculateFieldValue.bind(column);
    }
  }
  for (let i = 0; i < resultFilter.length; i += 1) {
    resultFilter[i] = normalizeFilterWithSelectors(resultFilter[i], columns, remoteFiltering, columnMap);
  }
  return resultFilter;
};

/* eslint-disable @typescript-eslint/no-unsafe-return */
class FilterController {
  static dependencies = [GridCoreOptionsController, ColumnsController, SearchController, HeaderFilterController];
  constructor(options, columnsController, searchController, headerFilterController) {
    this.options = options;
    this.columnsController = columnsController;
    this.searchController = searchController;
    this.headerFilterController = headerFilterController;
    this.filterBuilderCustomOperations = this.options.oneWay('filterBuilder.customOperations');
    this.filterPanelFilterEnabled = this.options.twoWay('filterPanel.filterEnabled');
    this.filterPanelVisible = this.options.oneWay('filterPanel.visible');
    this.filterValueOption = this.options.twoWay('filterValue');
    this.filterBuilderPopupOptions = this.options.oneWay('filterBuilderPopup');
    this.filterPanelOptions = this.options.twoWay('filterPanel');
    this.filterBuilderOptions = this.options.twoWay('filterBuilder');
    this.filterSyncEnabledOption = this.options.oneWay('_filterSyncEnabled');
    this.filterSyncEnabled = computed(() => this.filterSyncEnabledOption.value === 'auto' ? !!this.filterPanelVisible.value : !!this.filterSyncEnabledOption.value);
    this.filterPanelValue = computed(() => this.filterPanelFilterEnabled.value ? this.filterValueOption.value : null);
    this.filterSyncValue = computed(() => this.filterSyncEnabled.value ? this.filterPanelValue.value : null);
    this.appliedFilters = computed(() => ({
      filterPanel: this.filterPanelValue.value,
      headerFilter: this.headerFilterController.composedHeaderFilter.value,
      search: this.searchController.searchFilter.value
    }));
    this.customOperations = computed(() => {
      const config = {
        columnOption: columnName => {
          const columns = this.columnsController.columns.peek();
          return getColumnByIndexOrName(columns, columnName);
        },
        /*
          Note: Root headerFilter options are used because the legacy code handles retrieving
          options for specific columns on its own
        */
        getHeaderFilterOptions: () => this.options.oneWay('headerFilter').peek(),
        getHeaderFilterController: () => this.headerFilterCompatibilityController
      };
      const builtInCustomOperation = [anyOf(config), noneOf(config)];
      return builtInCustomOperation.concat(this.filterBuilderCustomOperations.value).filter(o => o);
    });
    this.displayFilter = computed(() => {
      const appliedFilterExpressions = getAppliedFilterExpressions(this.appliedFilters.value, this.columnsController.filterableColumns.value, this.customOperations.value, this.filterSyncEnabled.value);
      return gridCoreUtils.combineFilters(appliedFilterExpressions) ?? null;
    });
    this.headerFilterCompatibilityController = null;
  }
}

/* eslint-disable max-classes-per-file */
class LifeCycleEvent {
  callbacks = new Set();
  schedule(cb) {
    this.callbacks.add(cb);
  }
  trigger() {
    for (const cb of this.callbacks) {
      cb();
    }
    this.callbacks.clear();
  }
}

/**
 * Controller which can be used to manage lifecycle events, such as rendering, initializing etc.
 *
 * @remarks
 * Please DON'T USE this controller when you're able not to use it.
 * Its purpose is to schedule some imperative things
 * (creating effects, triggering public API callback etc).
 * 99% that you can omit using it, for example using state signal to provide updated value.
 */
class LifeCycleController {
  contentRendered = new LifeCycleEvent();
  static dependencies = [];
  provideContentReadyCallback(cb) {
    this.contentReadyCallback = cb;
  }
  fireContentReady() {
    this.contentReadyCallback?.();
  }
}

function getNextSortOrder(currentOrder, ctrlKey) {
  if (ctrlKey) {
    return undefined;
  }
  if (currentOrder === 'asc') {
    return 'desc';
  }
  return 'asc';
}
function sortOrderDelegate(a, b) {
  if (a.sortIndex !== undefined && b.sortIndex === undefined) {
    return -1;
  }
  if (b.sortIndex !== undefined && a.sortIndex === undefined) {
    return 1;
  }
  if (a.sortIndex !== undefined && b.sortIndex !== undefined) {
    return a.sortIndex - b.sortIndex;
  }
  if (a.sortIndex === undefined && b.sortIndex === undefined) {
    return a.visibleIndex - b.visibleIndex;
  }
  throw new Error('Invalid state');
}

class SortingController {
  static dependencies = [GridCoreOptionsController, ColumnsController];
  constructor(options, columnsController) {
    this.options = options;
    this.columnsController = columnsController;
    this.ascendingText = this.options.oneWay('sorting.ascendingText');
    this.clearText = this.options.oneWay('sorting.clearText');
    this.descendingText = this.options.oneWay('sorting.descendingText');
    this.mode = this.options.oneWay('sorting.mode');
    this._showSortIndexes = this.options.oneWay('sorting.showSortIndexes');
    this.sortedColumns = computed(() => this.columnsController.visibleColumns.value.filter(column => column.sortOrder));
    this.orderedSortedColumns = computed(() => {
      const columns = this.sortedColumns.value;
      const mode = this.mode.value;
      const result = columns.sort(sortOrderDelegate);
      if (mode !== 'multiple' && this.areColumnsInitialized) {
        return result;
      }
      if (!this.areColumnsInitialized) {
        this.areColumnsInitialized = true;
        result.forEach((col, idx) => {
          this.columnsController.columnOption(col, 'sortIndex', idx);
        });
      }
      return result;
    });
    this.showSortIndexes = computed(() => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _showSortIndexes = this._showSortIndexes.value;
      const sortedColumns = this.sortedColumns.value;
      if (!_showSortIndexes) {
        return _showSortIndexes;
      }
      return sortedColumns.length > 1;
    });
    this.sortParameters = computed(() => {
      const columns = this.orderedSortedColumns.value;
      const result = [];
      columns.forEach(c => {
        const sortItem = {
          selector: c.calculateSortValue ?? c.dataField ?? c.selector,
          desc: c.sortOrder === 'desc'
        };
        if (c.sortingMethod) {
          sortItem.compare = c.sortingMethod.bind(c);
        }
        result.push(sortItem);
      });
      return result;
    });
    this.areColumnsInitialized = false;
  } // TODO: Resolve the nested update issue

  // const updateOrderedSortedColumns = (
  //   orderedSortedColumns: Column[],
  //   mode: SingleMultipleOrNone,
  // ): void => {
  //   const needChanges = !this.areColumnsInitialized || mode === 'multiple';
  //   if (!needChanges) {
  //     return;
  //   }

  //   this.areColumnsInitialized = true;
  //   let counter = 0;
  //   orderedSortedColumns.forEach((c) => {
  //     this.columnsController.columnOption(c, 'sortIndex', counter);
  //     counter += 1;
  //     return c;
  //   });
  // };

  // effect(
  //   updateOrderedSortedColumns,
  //   [this.orderedSortedColumns, this.mode],
  // );
  clearSorting() {
    this.columnsController.updateColumns(columns => columns.map(c => {
      delete c.sortOrder;
      delete c.sortIndex;
      return c;
    }));
  }
  onSingleModeSortClick(column, e) {
    if (!column.allowSorting) {
      return;
    }
    const isCtrl = e.ctrlKey || e.metaKey;
    const isClearSorting = !!column.sortOrder && isCtrl;
    if (isClearSorting) {
      this.clearSorting();
      return;
    }
    const isClearSortingRequired = !column.sortOrder && !isCtrl || this.sortedColumns.peek().length > 1;
    const nextSortOrder = getNextSortOrder(column.sortOrder, isCtrl);
    this.onSingleModeSortCore(column, isClearSortingRequired, nextSortOrder);
  }
  onSingleModeSortCore(column, isClearSortingRequired, nextSortOrder) {
    batch(() => {
      if (isClearSortingRequired) {
        this.clearSorting();
      }
      this.columnsController.columnOption(column, 'sortOrder', nextSortOrder);
    });
  }
  onMultipleModeSortClick(column, e) {
    if (!column.allowSorting) {
      return;
    }
    const isCtrl = e.ctrlKey || e.metaKey;
    const hasNothingToChange = !column.sortOrder && isCtrl && !e.shiftKey;
    if (hasNothingToChange) {
      return;
    }
    const nextSortOrder = getNextSortOrder(column.sortOrder, isCtrl);
    const isClearSortingRequired = !isCtrl && !e.shiftKey;
    this.onMultipleModeSortCore(column, isClearSortingRequired, nextSortOrder);
  }
  onMultipleModeSortCore(column, isClearSortingRequired, nextSortOrder) {
    batch(() => {
      if (isClearSortingRequired) {
        this.clearSorting();
      }

      // TODO: Resolve the nested update issue
      // this.columnsController.columnOption(column, 'sortOrder', nextSortOrder);
      this.updateColumnSortOrder(column, nextSortOrder);
    });
  }
  updateColumnSortOrder(column, nextSortOrder) {
    const needChanges = this.mode.peek() === 'multiple';
    if (!needChanges) {
      return;
    }
    this.columnsController.updateColumns(columns => {
      const newColumns = [...columns];
      let needNormalizing = false;
      const orderedSortedColumns = this.orderedSortedColumns.peek();
      const orderedIndex = getColumnIndexByName(orderedSortedColumns, column.name);
      const commonIndex = getColumnIndexByName(newColumns, column.name);
      newColumns[commonIndex].sortOrder = nextSortOrder;
      if (!!nextSortOrder && orderedIndex === -1) {
        orderedSortedColumns.push(newColumns[commonIndex]);
        needNormalizing = true;
      }
      if (!nextSortOrder && orderedIndex > -1) {
        delete newColumns[commonIndex].sortOrder;
        delete newColumns[commonIndex].sortIndex;
        orderedSortedColumns.splice(orderedIndex, 1);
        needNormalizing = true;
      }
      if (needNormalizing) {
        let counter = 0;
        orderedSortedColumns.forEach(c => {
          const index = getColumnIndexByName(newColumns, c.name);
          if (newColumns[index].sortIndex !== counter) {
            newColumns[index] = {
              ...newColumns[index],
              sortIndex: counter
            };
          }
          counter += 1;
        });
      }
      return newColumns;
    });
  }
}

const defaultOptions$g = {
  sorting: {
    ascendingText: undefined,
    descendingText: undefined,
    clearText: undefined,
    mode: 'single',
    showSortIndexes: true
  }
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

function PublicMethods$7(GridCore) {
  return class GridCoreWithSortingController extends GridCore {
    clearSorting() {
      this.sortingController.clearSorting();
    }
  };
}

// @ts-expect-error bad deferred ctor type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createDeferred = () => new Deferred();
const deferredCache = actionFn => {
  let lastArgs = null;
  let cachedResult = null;
  return (...args) => {
    const hasPreviousCall = lastArgs !== null && cachedResult !== null;
    const isArgsSame = hasPreviousCall ? equalByValue(lastArgs, args) : false;
    if (hasPreviousCall && isArgsSame) {
      return createDeferred().resolve(cachedResult);
    }
    lastArgs = args;
    return actionFn(...args).then(result => {
      cachedResult = result;
      return result;
    });
  };
};

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeDataSource(dataSourceLike, keyExpr) {
  if (dataSourceLike instanceof DataSource) {
    return dataSourceLike;
  }
  if (Array.isArray(dataSourceLike)) {
    // eslint-disable-next-line no-param-reassign
    dataSourceLike = {
      store: {
        type: 'array',
        data: dataSourceLike,
        key: keyExpr
      }
    };
  }

  // TODO: research making second param not required
  return new DataSource(normalizeDataSourceOptions(dataSourceLike, undefined));
}
function isLocalStore(store) {
  return store instanceof ArrayStore;
}
function isCustomStore(store) {
  return store instanceof CustomStore;
}
function normalizeRemoteOptions(remoteOperations, localStore, customStore) {
  const allOperationsEnabled = {
    filtering: true,
    sorting: true,
    paging: true,
    grouping: true
  };
  const allOperationDisabled = {
    filtering: false,
    sorting: false,
    paging: false,
    grouping: false
  };
  switch (true) {
    case remoteOperations === 'auto':
      return localStore || customStore ? allOperationDisabled : allOperationsEnabled;
    case remoteOperations === false:
      return allOperationDisabled;
    case remoteOperations === true:
      return allOperationsEnabled;
    default:
      return remoteOperations;
  }
}
function normalizeLocalOptions(normalizedRemoteOperations) {
  return {
    filtering: !normalizedRemoteOperations.filtering,
    sorting: !normalizedRemoteOperations.sorting,
    paging: !normalizedRemoteOperations.paging,
    grouping: !normalizedRemoteOperations.grouping
  };
}
function getLocalLoadOptions(originOptions, localOperations) {
  const localLoadOptions = {
    langParams: originOptions.langParams
  };
  if (localOperations.sorting) {
    localLoadOptions.sort = originOptions.sort;
  }
  if (localOperations.filtering) {
    localLoadOptions.filter = originOptions.filter;
  }
  if (localOperations.paging) {
    localLoadOptions.skip = originOptions.skip;
    localLoadOptions.take = originOptions.take;
  }
  if (localOperations.summary) {
    localLoadOptions.summary = originOptions.summary;
  }
  if (localOperations.grouping) {
    localLoadOptions.group = originOptions.group;
  }
  return localLoadOptions;
}
function getStoreLoadOptions(originOptions, localOperations) {
  const storeLoadOptions = {
    ...originOptions
  };
  if (localOperations.sorting) {
    delete storeLoadOptions.sort;
  }
  if (localOperations.filtering) {
    delete storeLoadOptions.filter;
  }
  if (localOperations.paging) {
    delete storeLoadOptions.skip;
    delete storeLoadOptions.take;
  }
  if (localOperations.summary) {
    delete storeLoadOptions.summary;
  }
  if (localOperations.grouping) {
    delete storeLoadOptions.group;
  }
  return storeLoadOptions;
}
function updateItemsImmutable(data, changes, keyInfo) {
  // @ts-expect-error
  return applyBatch({
    keyInfo,
    data,
    changes,
    immutable: true
  });
}

class StoreLoadAdapter {
  constructor(dataSourceReactive, localLoadOptionsReactive, localStoreFabric) {
    this.dataSourceReactive = dataSourceReactive;
    this.localLoadOptionsReactive = localLoadOptionsReactive;
    this.localStoreFabric = localStoreFabric;
    this.loadFromStore = deferredCache(loadOptions => {
      const dataSource = this.dataSourceReactive.peek();
      // NOTE: In runtime we have deferred here (not promise)
      return dataSource.store().load(loadOptions);
    });
  }
  load(loadOptions = {}) {
    const result = Deferred();
    const {
      localOptions,
      remoteOptions
    } = this.getLoadOptions(loadOptions);
    this.loadFromStore(remoteOptions).done(loadedData => {
      const localStore = this.localStoreFabric(loadedData);
      localStore.load(localOptions).done(processedData => {
        result.resolve(processedData);
      })
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .fail(result.reject);
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .fail(result.reject);
    return result;
  }
  getLocalLoadOperations() {
    return this.localLoadOptionsReactive.peek();
  }
  getLoadOptions(loadOptions) {
    const localLoadOptions = this.localLoadOptionsReactive.peek();
    const localOptions = getLocalLoadOptions(loadOptions, localLoadOptions);
    const remoteOptions = getStoreLoadOptions(loadOptions, localLoadOptions);
    return {
      localOptions,
      remoteOptions
    };
  }
}

const FILTER_OBJ_COMPARE_DEPTH = 6;
class DataController {
  static dependencies = [ColumnsController, GridCoreOptionsController, SortingController, FilterController, ErrorController, LifeCycleController];
  constructor(columnsController, options, sortingController, filterController, errorController, lifecycle) {
    this.columnsController = columnsController;
    this.options = options;
    this.sortingController = sortingController;
    this.filterController = filterController;
    this.errorController = errorController;
    this.lifecycle = lifecycle;
    this.pendingLocalOperations = {};
    this.dataSourceConfiguration = this.options.oneWay('dataSource');
    this.keyExpr = this.options.oneWay('keyExpr');
    this.dataSource = computed(() => normalizeDataSource(this.dataSourceConfiguration.value, this.keyExpr.value));
    this.previousDisplayFilter = undefined;
    this.cacheEnabled = this.options.oneWay('cacheEnabled');
    this.pagingEnabled = this.options.twoWay('paging.enabled');
    this.pageIndex = this.options.twoWay('paging.pageIndex');
    this.pageSize = this.options.twoWay('paging.pageSize');
    this.remoteOperations = this.options.oneWay('remoteOperations');
    this.onDataErrorOccurred = this.options.action('onDataErrorOccurred');
    this._items = signal([]);
    this.items = this._items;
    this._totalCount = signal(0);
    this.totalCount = this._totalCount;
    this.isLoading = signal(false);
    this.pageCount = computed(() => Math.ceil(this.totalCount.value / this.pageSize.value));
    this.isLoaded = signal(false);
    this.isReloading = signal(false);
    this.normalizedRemoteOptions = computed(() => {
      const store = this.dataSource.value.store();
      return normalizeRemoteOptions(this.remoteOperations.value, isLocalStore(store), isCustomStore(store));
    });
    this.normalizedLocalOperations = computed(() => normalizeLocalOptions(this.normalizedRemoteOptions.value));
    this.normalizedDisplayFilter = computed(() => normalizeFilterWithSelectors(this.filterController.displayFilter.value, this.columnsController.columns.value, !!this.normalizedRemoteOptions.value.filtering));
    effect(() => {
      if (this.dataSource.value) {
        this.columnsController.resetColumnOptionsFromDataItem();
      }
    });
    effect(() => {
      const dataSource = this.dataSource.value;
      const changedCallback = e => {
        this.isLoaded.value = true;
        this.onChanged(dataSource, e);
      };
      const loadingChangedCallback = () => {
        this.isLoading.value = dataSource.isLoading();
        this.isReloading.value = true;
      };
      const loadErrorCallback = error => {
        const callback = this.onDataErrorOccurred.peek();
        callback({
          error
        });
        this.errorController.showError(error.message ?? error);
        changedCallback();
      };
      const customizeStoreLoadOptionsCallback = e => {
        e.storeLoadOptions.filter = this.combineFilterWithDisplayFilter(e.storeLoadOptions.filter);
        const localOperations = this.normalizedLocalOperations.peek();
        this.pendingLocalOperations[e.operationId] = getLocalLoadOptions(e.storeLoadOptions, localOperations);
        e.storeLoadOptions = getStoreLoadOptions(e.storeLoadOptions, localOperations);
      };
      const getLoadOptionsWithoutLocalPaging = loadOptions => {
        const {
          skip,
          take,
          ...rest
        } = loadOptions;
        return rest;
      };
      const dataLoadedCallback = e => {
        /*
          We use Deffered here because the code below is synchronous.
          customizeLoadResult callback does not support async code.
        */
        const {
          operationId
        } = e;
        const localLoadOptions = {
          ...this.pendingLocalOperations[operationId]
        };
        const {
          skip,
          take
        } = localLoadOptions;
        const hasLocalPaging = isDefined(skip) && isDefined(take);
        const localOptionsWithoutPaging = getLoadOptionsWithoutLocalPaging(localLoadOptions);
        new ArrayStore(e.data).load(localOptionsWithoutPaging).done(filteredData => {
          e.extra = isPlainObject(e.extra) ? e.extra : {};
          if (hasLocalPaging) {
            e.take = take;
            e.skip = skip;
            if (e.storeLoadOptions.requireTotalCount) {
              e.extra.totalCount = filteredData.length;
            }
            new ArrayStore(e.data).load(localLoadOptions).done(newData => {
              e.data = newData;
            });
          } else {
            e.data = filteredData;
          }
        }).fail(error => {
          // @ts-expect-error
          e.data = new Deferred().reject(error);
        });
        this.pendingLocalOperations[operationId] = undefined;
      };
      if (dataSource.isLoaded()) {
        changedCallback();
      }
      dataSource.on('changed', changedCallback);
      dataSource.on('loadingChanged', loadingChangedCallback);
      dataSource.on('loadError', loadErrorCallback);

      // @ts-expect-error
      dataSource.on('customizeStoreLoadOptions', customizeStoreLoadOptionsCallback);
      // @ts-expect-error
      dataSource.on('customizeLoadResult', dataLoadedCallback);
      return () => {
        dataSource.off('changed', changedCallback);
        dataSource.off('loadingChanged', loadingChangedCallback);
        dataSource.off('loadError', loadErrorCallback);

        // @ts-expect-error
        dataSource.off('customizeStoreLoadOptions', customizeStoreLoadOptionsCallback);
        // @ts-expect-error
        dataSource.off('customizeLoadResult', dataLoadedCallback);
      };
    });
    effect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.normalizedRemoteOptions.value;
      if (this.dataSource.peek().isLoaded()) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.dataSource.peek().load();
      }
    });
    effect(() => {
      const initialized = this.options.initialized.value;
      const dataSource = this.dataSource.value;
      const pageIndex = this.pageIndex.value;
      const pageSize = this.pageSize.value;
      const isLoaded = this.isLoaded.value;
      const displayFilter = this.filterController.displayFilter.value;
      const pagingEnabled = this.pagingEnabled.value;
      const sortParameters = this.sortingController.sortParameters.value;
      if (!initialized) {
        return;
      }
      let someParamChanged = false;
      if (dataSource.pageIndex() !== pageIndex) {
        dataSource.pageIndex(pageIndex);
        someParamChanged ||= true;
      }
      if (dataSource.pageSize() !== pageSize) {
        const newPageIndex = isLoaded ? Math.max(Math.min(this.pageCount.peek() - 1, pageIndex), 0) : pageIndex;
        dataSource.pageSize(pageSize);
        dataSource.pageIndex(newPageIndex);
        someParamChanged ||= true;
      }
      if (!dataSource.requireTotalCount()) {
        dataSource.requireTotalCount(true);
        someParamChanged ||= true;
      }
      const filterChanged = !equalByValue(this.previousDisplayFilter, displayFilter, {
        maxDepth: FILTER_OBJ_COMPARE_DEPTH,
        strict: true
      });
      if (filterChanged && isLoaded) {
        this.dataSource.peek().pageIndex(0);
        someParamChanged ||= true;
      }
      this.previousDisplayFilter = displayFilter;
      if (!equalByValue(dataSource.paginate(), pagingEnabled)) {
        dataSource.paginate(pagingEnabled);
        someParamChanged ||= true;
      }
      if (sortParameters && !equalByValue(dataSource.sort(), sortParameters)) {
        dataSource.sort(sortParameters);
        someParamChanged ||= true;
      }
      if (someParamChanged || !dataSource.isLoaded()) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dataSource.load();
      }
    });
  }
  getCombinedFilter() {
    return this.combineFilterWithDisplayFilter(this.dataSource.peek().filter());
  }
  combineFilterWithDisplayFilter(filter) {
    return gridCoreUtils.combineFilters([filter, this.normalizedDisplayFilter.peek()]);
  }
  normalizePageIndex(dataSource) {
    const pageIndex = dataSource.pageIndex();
    const totalCount = dataSource.totalCount();
    const pageSize = dataSource.pageSize();
    const pageCount = Math.ceil(totalCount / pageSize);
    if (totalCount > 0 && pageIndex >= pageCount) {
      dataSource.pageIndex(pageCount - 1);
      return 'require-reload';
    }
    return 'normalized';
  }
  onChanged(dataSource, e) {
    const normalizePageIndexResult = this.normalizePageIndex(dataSource);
    if (normalizePageIndexResult === 'require-reload') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      dataSource.load();
      return;
    }
    let items = dataSource.items();
    if (e?.changes) {
      items = this._items.peek();
      items = updateItemsImmutable(items, e.changes, dataSource.store());
    }
    const firstItem = items[0];
    this.columnsController.setColumnOptionsFromDataItem(firstItem ?? {});
    this._items.value = items;
    this.pageIndex.value = dataSource.pageIndex();
    this.pageSize.value = dataSource.pageSize();
    this._totalCount.value = dataSource.totalCount();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.resolve().then(() => {
      this.isReloading.value = false;
    });
    this.loadedPromise?.resolve();
    this.loadedPromise = undefined;
    this.lifecycle.contentRendered.schedule(() => {
      this.lifecycle.fireContentReady();
    });
  }
  getDataKey(data) {
    return this.dataSource.peek().store().keyOf(data);
  }
  waitLoaded() {
    if (!this.dataSource.peek().isLoading()) {
      return Promise.resolve();
    }
    if (!this.loadedPromise) {
      this.loadedPromise = createPromise();
    }
    return this.loadedPromise.promise;
  }
  getStoreLoadAdapter() {
    return new StoreLoadAdapter(this.dataSource, this.normalizedLocalOperations,
    // NOTE: Badly typed ArrayStore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    data => new ArrayStore(data));
  }
  async update(key, data) {
    await this.dataSource.peek().store().update(key, data);
  }
  async insert(data) {
    await this.dataSource.peek().store().insert(data);
  }
  async remove(key) {
    await this.dataSource.peek().store().remove(key);
  }
  async reload() {
    await this.dataSource.peek().load();
  }
  increasePageIndex() {
    const currentPageIdx = this.pageIndex.peek();
    const totalCount = this.totalCount.peek();
    const pageSize = this.pageSize.peek();
    const nextPageIdx = currentPageIdx + 1;
    const maxPageIdx = Math.ceil(totalCount / pageSize) - 1;
    if (nextPageIdx > maxPageIdx) {
      return;
    }
    this.pageIndex.value = nextPageIdx;
  }
  decreasePageIndex() {
    const currentPageIdx = this.pageIndex.peek();
    const nextPageIdx = currentPageIdx - 1;
    if (nextPageIdx < 0) {
      return;
    }
    this.pageIndex.value = nextPageIdx;
  }
}

class CompatibilityDataController {
  static dependencies = [DataController];
  constructor(realDataController) {
    this.realDataController = realDataController;
    this.dataSourceChanged = Callbacks();
    effect(() => {
      this.dataSourceChanged.fire(this.realDataController.dataSource.value);
    });
  }
  dataSource() {
    return this.realDataController.dataSource.peek();
  }
}

const defaultOptions$f = {
  paging: {
    enabled: true,
    pageSize: 6,
    pageIndex: 0
  },
  remoteOperations: 'auto',
  cacheEnabled: true
};

/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-invalid-void-type */

function PublicMethods$6(GridCore) {
  return class GridCoreWithDataController extends GridCore {
    getDataSource() {
      return this.dataController.dataSource.peek();
    }
    byKey(key) {
      const items = this.getDataSource().items();
      const store = this.getDataSource().store();
      const keyExpr = store.key();
      const foundItem = items.find(item => keysEqual(keyExpr, key, this.keyOf(item)));
      if (foundItem) {
        return Promise.resolve(foundItem);
      }
      return store.byKey(key);
    }
    getCombinedFilter() {
      return this.dataController.getCombinedFilter();
    }
    keyOf(obj) {
      return this.dataController.getDataKey(obj);
    }
    pageCount() {
      return this.dataController.pageCount.peek();
    }
    pageSize(value) {
      if (value === undefined) {
        return this.dataController.pageSize.peek();
      }
      this.dataController.pageSize.value = value;
    }
    pageIndex(newIndex) {
      if (newIndex === undefined) {
        return this.dataController.pageIndex.peek();
      }
      this.dataController.pageIndex.value = newIndex;
      return this.dataController.waitLoaded();
    }
    totalCount() {
      return this.dataController.totalCount.peek();
    }
  };
}

class AccessibilityController {
  static dependencies = [ColumnsController, DataController];
  constructor(columnsController, dataController) {
    this.columnsController = columnsController;
    this.dataController = dataController;
    this.firstRender = signal(true);
    this.description = computed(
    // @ts-expect-error ts-error
    () => messageLocalization.format('dxCardView-ariaCardView', this.dataController.totalCount.value, this.columnsController.visibleColumns.value.length));
    this.componentDescription = computed(() => this.description.value);
    this.componentStatus = computed(() => {
      if (this.firstRender.value) {
        return '';
      }
      return this.componentDescription.value;
    });
    let firstRender = true;
    effect(() => {
      // TODO: First Render refactor
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.componentDescription.value;
      if (!firstRender) {
        this.firstRender.value = false;
      }
      firstRender = false;
    });
  }
}

const CLASSES$c = {
  excludeFlexBox: 'dx-cardview-exclude-flexbox'
};

const CLASSES$b = {
  ...CLASSES$c,
  container: 'dx-gridbase-a11y-status-container'
};
class A11yStatusContainer extends Component$1 {
  render() {
    return createVNode(1, "div", `${CLASSES$b.container} ${CLASSES$b.excludeFlexBox}`, this.props.statusText ?? '', 0, {
      "role": 'status'
    });
  }
}

const CLASS$5 = {
  hidden: 'dx-hidden'
};
class ColumnChooserController {
  static dependencies = [ColumnsController, GridCoreOptionsController];
  constructor(columnsController, options) {
    this.columnsController = columnsController;
    this.options = options;
    this.draggingItem = signal(null);
    this.onColumnMove = column => {
      this.columnsController.columnOption(column, 'visible', false);
    };
    this.onDragStart = e => {
      this.draggingItem.value = e.itemData;
    };
    this.onDragEnd = () => {
      this.draggingItem.value = null;
    };
    this.isColumnDraggable = column => column.allowHiding;
    this.onPlaceholderPrepared = e => {
      const $placeholderElement = renderer(e.placeholderElement);
      $placeholderElement.addClass(CLASS$5.hidden);
    };
    this.chooserColumns = computed(() => {
      const sortOrder = this.options.oneWay('columnChooser.sortOrder').value;
      const mode = this.options.oneWay('columnChooser.mode').value;
      let chooserColumns = this.columnsController.columns.value;
      if (mode === 'dragAndDrop') {
        chooserColumns = chooserColumns.filter(column => !column.visible);
      }
      chooserColumns = chooserColumns.filter(column => column.showInColumnChooser);
      chooserColumns = sortColumns(chooserColumns, sortOrder);
      return chooserColumns;
    });
    this.items = computed(() => this.chooserColumns.value.map((column, index) => ({
      id: index,
      columnName: column.name,
      selected: column.visible,
      text: column.caption,
      disabled: !column.allowHiding,
      column
    })));
  }
  onSelectionChanged(e) {
    const nodes = e.component.getNodes();
    this.columnsController.updateColumns(columns => {
      for (const node of nodes) {
        const columnIndex = getColumnIndexByName(columns, node.itemData?.columnName);
        const canHide = columns[columnIndex].allowHiding ?? true;
        // in case when allowHiding=false and node.selected=false, we do not hide column
        const skip = !canHide && !node.selected;
        if (!skip) {
          columns[columnIndex] = {
            ...columns[columnIndex],
            visible: node.selected
          };
        }
      }
      return [...columns];
    });
  }
}

const defaultOptions$e = defaultOptions$j;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

function PublicMethods$5(GridCore) {
  return class GridCoreWithColumnChooser extends GridCore {
    showColumnChooser() {
      this.columnChooserView.show();
    }
    hideColumnChooser() {
      this.columnChooserView.hide();
    }
  };
}

function Icon(props) {
  const classes = combineClasses({
    'dx-icon': true,
    [`dx-icon-${props.name}`]: true,
    [String(props.className)]: !!props.className
  });
  return createVNode(1, "div", classes, null, 1, {
    "aria-label": props['aria-label'],
    "role": props['aria-label'] ? 'img' : undefined,
    "onClick": props.onClick
  });
}

const ConfigContext = createContext({
  rtlEnabled: undefined,
  disabled: undefined,
  templatesRenderAsynchronously: undefined
});

class InfernoWrapper extends Component$1 {
  ref = createRef();
  render() {
    if (this.props.elementRef) {
      this.ref = this.props.elementRef;
    }
    return createVNode(1, "div", null, null, 1, {
      "onKeyDown": this.props.onKeyDown
    }, null, this.ref);
  }
  getComponentOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...this.context[ConfigContext.id],
      ...this.props
    };
  }
  updateComponentRef() {
    if (this.props.componentRef) {
      // @ts-expect-error
      this.props.componentRef.current = this.component;
    }
  }
  updateComponentOptions(prevProps, props) {
    Object.keys(props).forEach(key => {
      if (props[key] !== prevProps[key]) {
        this.component?.option(key, props[key]);
      }
    });
  }
  createComponent(ref, props) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new (this.getComponentFabric())(ref.current, props);
  }
  componentDidMount() {
    this.component = this.createComponent(this.ref, this.getComponentOptions());
    this.updateComponentRef();
  }
  componentDidUpdate(prevProps) {
    this.updateComponentOptions(prevProps, this.getComponentOptions());
    this.updateComponentRef();
  }
  componentWillUnmount() {
    this.component?.dispose();
  }
}

class Sortable extends InfernoWrapper {
  render() {
    return createVNode(1, "div", this.props.className, this.props.children, 0, null, null, this.ref);
  }
  getComponentFabric() {
    return Sortable$1;
  }
}

const ALLOWED_DRAGGING_DISTANCE = 20;
const CLASS$4 = {
  widget: 'dx-widget',
  columnSortable: 'dx-cardview-column-sortable',
  dropzone: 'dx-cardview-dropzone',
  dropzoneVisible: 'dx-cardview-dropzone-visible'
};
class ColumnSortable extends Component$1 {
  onDragStart = e => {
    const column = this.props.getColumnByIndex(e.fromIndex);
    const isDraggable = this.props.isColumnDraggable?.(column) ?? true;
    if (!isDraggable) {
      e.cancel = true;
      return;
    }
    const {
      source
    } = this.props;
    e.itemData = {
      column,
      status: 'moving',
      source,
      destination: source
    };
    e.itemData = {
      ...e.itemData,
      ...this.getNeighborColumns(e)
    };
    this.props.onDragStart?.(e);
  };
  onDraggableElementShown = e => {
    // add dx-widget for correct font
    renderer(e.dragElement).addClass(CLASS$4.widget);
    renderer(e.dragElement).addClass(CLASS$4.columnSortable);
  };
  onDragMove = e => {
    // @ts-expect-error
    const destination = e.toComponent.option('_source');
    const {
      columnBefore,
      columnAfter
    } = this.getNeighborColumns(e);
    e.itemData.columnBefore = columnBefore;
    e.itemData.columnAfter = columnAfter;
    e.itemData.destination = destination;
    e.itemData.status = this.getDraggingStatus(e);
    this.renderDragTemplate(e.itemData);
  };
  onColumnMove = e => {
    if (e.itemData.status === 'forbid') {
      return;
    }
    this.props.onColumnMove?.(e.itemData.column, e.toIndex, e.itemData);
  };

  // TODO: move all none-native approaches to sortable wrapper
  renderDragTemplate = itemData => {
    if (!itemData || !this.dragItemContainer) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const DragTemplate = this.props.columnDragTemplate;
    render(createComponentVNode(2, DragTemplate, {
      "column": itemData.column,
      "status": itemData.status,
      "isDragging": true
    }), this.dragItemContainer);
  };
  render() {
    const {
      source,
      getColumnByIndex,
      allowDragging,
      onColumnMove,
      columnDragTemplate,
      dropFeedbackMode,
      ...restProps
    } = this.props;
    const needSortable = allowDragging ?? true;
    if (!needSortable) {
      return this.props.children;
    }
    const dragTemplate = columnDragTemplate ? (e, container) => {
      this.dragItemContainer = renderer(container).get(0);
      this.renderDragTemplate(e.itemData);
    } : undefined;
    const dropzoneClasses = combineClasses({
      [CLASS$4.dropzone]: true,
      [CLASS$4.dropzoneVisible]: !!this.props.showDropzone
    });
    return normalizeProps(createComponentVNode(2, Sortable, {
      "boundary": 'body',
      ...restProps,
      "dropFeedbackMode": dropFeedbackMode ?? 'indicate',
      "onDragStart": this.onDragStart,
      "group": 'dx-cardview-columns',
      "onAdd": this.onColumnMove,
      "onReorder": this.onColumnMove,
      "onDragMove": this.onDragMove,
      "dragTemplate": dragTemplate,
      "_source": source,
      "onPlaceholderPrepared": this.props.onPlaceholderPrepared,
      "onDraggableElementShown": this.onDraggableElementShown,
      children: [this.props.children, createVNode(1, "div", dropzoneClasses, [createComponentVNode(2, Icon, {
        "name": 'dropzone'
      }), createVNode(1, "span", null, messageLocalization.format('dxCardView-headerItemDropZoneText'), 0)], 4)]
    }));
  }
  getDraggingStatus(e) {
    const {
      column,
      source,
      destination,
      columnBefore,
      columnAfter
    } = e.itemData;
    const containerRect = renderer(e.element).get(0).getBoundingClientRect();
    // @ts-expect-error
    const mouseX = e.event.clientX;
    // @ts-expect-error
    const mouseY = e.event.clientY;
    const yDistance = Math.min(Math.abs(mouseY - containerRect.y), Math.abs(mouseY - (containerRect.y + containerRect.height)));
    const isMouseOnSourceContainer = mouseX >= containerRect.x && mouseX <= containerRect.x + containerRect.width && mouseY >= containerRect.y && mouseY <= containerRect.y + containerRect.height;
    if (source === 'column-chooser' && destination === 'header-panel-main') {
      return 'moving';
    }
    if (source === 'header-panel-main' && destination === 'column-chooser') {
      return column.allowHiding ? 'moving' : 'forbid';
    }
    if (source === 'header-panel-main' && destination === 'header-panel-main') {
      const isDragCloseEnough = yDistance <= ALLOWED_DRAGGING_DISTANCE;
      const canReorder = column.allowReordering;
      const canInsert = !!columnBefore?.allowReordering || !!columnAfter?.allowReordering;
      const isMoving = isDragCloseEnough && canInsert && canReorder;
      return isMoving ? 'moving' : 'forbid';
    }
    if (source === 'column-chooser' && destination === 'column-chooser') {
      const isMoving = isMouseOnSourceContainer;
      return isMoving ? 'moving' : 'forbid';
    }
    return 'forbid';
  }
  getNeighborColumns(e) {
    const {
      source,
      destination
    } = e.itemData;
    if (destination !== 'header-panel-main') {
      return {
        columnBefore: undefined,
        columnAfter: undefined
      };
    }
    const column = e.itemData.column;
    const toIndex = e.toIndex ?? column.headerPanelIndex;
    const {
      visibleColumns
    } = this.props;
    if (source === 'header-panel-main') {
      const isMovingLeft = toIndex < column.headerPanelIndex;
      return isMovingLeft ? {
        columnBefore: visibleColumns[toIndex - 1],
        columnAfter: visibleColumns[toIndex]
      } : {
        columnBefore: visibleColumns[toIndex],
        columnAfter: visibleColumns[toIndex + 1]
      };
    }
    if (source === 'column-chooser') {
      return {
        columnBefore: visibleColumns[toIndex - 1],
        columnAfter: visibleColumns[toIndex]
      };
    }
    return {
      columnBefore: undefined,
      columnAfter: undefined
    };
  }
}

const I18N_KEYS = {
  common: 'dxCardView-ariaHeaderItemLabel',
  headerFilter: 'dxCardView-ariaHeaderHasHeaderFilterLabel',
  sortingAsc: 'dxCardView-ariaHeaderItemSortingAscendingLabel',
  sortingDesc: 'dxCardView-ariaHeaderItemSortingDescendingLabel',
  sortIndex: 'dxCardView-ariaHeaderItemSortingIndexLabel'
};
const I18N_MESSAGE_SEPARATOR = ', ';

const getCommonA11yLabel = (columnName
// @ts-expect-error bad i18n types
) => messageLocalization.format(I18N_KEYS.common, columnName);
const getHeaderFilterA11yLabel = hasHeaderFilterValue => hasHeaderFilterValue ? messageLocalization.format(I18N_KEYS.headerFilter) : null;
const getSortingA11yLabel = sortOrder => {
  switch (sortOrder) {
    case 'asc':
      return messageLocalization.format(I18N_KEYS.sortingAsc);
    case 'desc':
      return messageLocalization.format(I18N_KEYS.sortingDesc);
    default:
      return null;
  }
};
const getSortIndexA11yLabel = (sortOrder, sortIndex) => sortOrder && isDefined(sortIndex)
// @ts-expect-error bad i18n types
? messageLocalization.format(I18N_KEYS.sortIndex, sortIndex + 1) : null;
const getHeaderItemA11yLabel = (columnName, {
  sortOrder,
  sortIndex,
  hasHeaderFilterValue
}) => [getCommonA11yLabel(columnName), getHeaderFilterA11yLabel(hasHeaderFilterValue), getSortingA11yLabel(sortOrder), getSortIndexA11yLabel(sortOrder, sortIndex)].filter(msg => !!msg).join(I18N_MESSAGE_SEPARATOR);

const CLASSES$a = {
  item: 'dx-cardview-header-item',
  sorting: {
    container: 'dx-cardview-header-item-sorting',
    order: 'dx-cardview-header-item-sorting-order'
  },
  headerFilter: {
    icon: 'dx-header-filter-icon',
    iconFilled: 'dx-header-filter-icon--selected'
  }
};
function SortIcon(props) {
  return createVNode(1, "div", CLASSES$a.sorting.container, [props.sortOrder === 'asc' && createComponentVNode(2, Icon, {
    "name": 'arrowsortup'
  }), props.sortOrder === 'desc' && createComponentVNode(2, Icon, {
    "name": 'arrowsortdown'
  }), props.showSortIndex && createVNode(1, "div", CLASSES$a.sorting.order, props.sortIndex, 0)], 0);
}
class Item extends Component$1 {
  render() {
    const {
      column
    } = this.props;
    const Template = column.headerItemTemplate ?? this.props.template;
    const cssClass = `${CLASSES$a.item} ${column.headerItemCssClass ?? ''} ${this.props.cssClass ?? ''}`;
    const headerFilterIconClass = [CLASSES$a.headerFilter.icon, this.props.hasFilters ? CLASSES$a.headerFilter.iconFilled : ''].join(' ');
    const icon = this.props.status && {
      forbid: createComponentVNode(2, Icon, {
        "name": 'cursorprohibition'
      }),
      moving: createComponentVNode(2, Icon, {
        "name": 'cursormove'
      }),
      none: undefined
    }[this.props.status];
    const showSortIcon = !this.props.isDragging && column.sortOrder !== undefined;
    const showHeaderFilterIcon = !this.props.isDragging && column?.allowHeaderFiltering;
    const ariaLabel = getHeaderItemA11yLabel(column.caption, {
      hasHeaderFilterValue: this.props.hasFilters,
      sortOrder: column.sortOrder,
      sortIndex: column.sortIndex
    });
    return createVNode(1, "div", cssClass, [icon, Template && createComponentVNode(2, Template, {
      "column": this.props.column
    }), !Template && this.props.column.caption, showSortIcon && createComponentVNode(2, SortIcon, {
      "sortIndex": this.props.column.sortIndex + 1,
      "sortOrder": this.props.column.sortOrder,
      "showSortIndex": this.props.showSortIndexes ?? false
    }), showHeaderFilterIcon && createComponentVNode(2, Icon, {
      "name": 'filter',
      "className": headerFilterIconClass,
      "onClick": this.onFilterClickHandler
    })], 0, {
      "tabindex": this.props.tabIndex,
      "role": this.props.isDragging ? undefined : 'menuitem',
      "aria-label": ariaLabel,
      "onClick": this.props.onSortClick,
      "onKeyDown": this.props.onKeyDown,
      "onContextMenu": this.onContextMenuHandler
    }, null, this.props.elementRef);
  }
  onFilterClickHandler = event => {
    event.stopPropagation();
    if (this.props.elementRef?.current) {
      this.props.onFilterClick?.(this.props.elementRef.current);
    }
  };
  onContextMenuHandler = event => {
    if (this.props.elementRef?.current) {
      this.props.onContextMenu?.(event, this.props.elementRef.current);
    }
  };
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/**
 * Wraps inferno's ref into jquery object
 *
 * @remarks
 * Be careful using this as wrapper does not cover all dxElementWrapper functionality.
 * Careful testing will be needed after using this utility.
 */
function wrapRef(ref) {
  return {
    // @ts-expect-error
    dxRenderer: true,
    get 0() {
      return ref.current;
    },
    get() {
      return ref.current;
    },
    length: 1
  };
}

class Popup extends InfernoWrapper {
  contentRef = {};
  render() {
    return createFragment([super.render(), this.contentRef.current && createPortal(this.props.children, this.contentRef.current)], 0);
  }
  transformRef(props) {
    // @ts-expect-error
    if (props?.position?.of?.current) {
      // eslint-disable-next-line no-param-reassign
      props = {
        ...props,
        position: {
          // @ts-expect-error
          ...props.position,
          // @ts-expect-error
          of: wrapRef(props.position.of)
        }
      };
    }
    return props;
  }
  createComponent(ref, props) {
    return super.createComponent(ref, this.transformRef(props));
  }
  updateComponentOptions(prevProps, props) {
    super.updateComponentOptions(prevProps, this.transformRef(props));
  }
  getComponentFabric() {
    return PopupFull;
  }
  componentDidMount() {
    super.componentDidMount();
    // @ts-expect-error
    this.contentRef.current = this.component.$content().get(0);
    this.setState({});
  }
}

class TreeView extends InfernoWrapper {
  getComponentFabric() {
    return TreeViewSearch;
  }
  updateComponentOptions(prevProps, props) {
    const itemsOnlySelectionChanged = this.isItemsOnlySelectionChanged(prevProps, props);
    const propsToUpdate = {
      ...props
    };
    if (itemsOnlySelectionChanged) {
      this.updateSelection(props.items ?? []);
      delete propsToUpdate.items;
    }
    const scrollTop = this.component?.getScrollable()?.scrollTop();
    super.updateComponentOptions(prevProps, propsToUpdate);
    this.component?.getScrollable()?.scrollTo({
      top: scrollTop
    });
  }
  isItemsOnlySelectionChanged(prevProps, props) {
    const oldItems = (prevProps.items ?? []).map(({
      selected,
      ...restProps
    }) => restProps);
    const newItems = (props.items ?? []).map(({
      selected,
      ...restProps
    }) => restProps);
    const onlySelectionChanged = equalByValue(oldItems, newItems);
    return onlySelectionChanged;
  }
  updateSelection(items) {
    const treeView = this.component;
    if (!treeView) {
      return;
    }
    const selectedKeys = treeView.getSelectedNodeKeys();
    treeView.beginUpdate();
    items.forEach((item, index) => {
      const isSelected = selectedKeys.includes(item.id);
      if (item.selected && !isSelected) {
        treeView.selectItem(index);
      }
      if (!item.selected && isSelected) {
        treeView.unselectItem(index);
      }
    });
    treeView.endUpdate();
  }
}

const CLASS$3 = {
  excludeFlexBox: CLASSES$c.excludeFlexBox,
  root: 'column-chooser',
  toolbarBtn: 'column-chooser-button',
  list: 'column-chooser-list',
  plain: 'column-chooser-plain',
  dragMode: 'column-chooser-mode-drag',
  selectMode: 'column-chooser-mode-select',
  treeviewItem: 'dx-treeview-item'};
class ColumnChooser extends Component$1 {
  render() {
    const {
      visible,
      popupConfig,
      popupRef,
      sortableConfig,
      title
    } = this.props;
    if (!visible) {
      return createFragment();
    }
    const treeView = this.getTreeView();
    const actualTitle = title || messageLocalization.format('dxDataGrid-columnChooserTitle');
    const toolbarItems = [{
      text: actualTitle,
      toolbar: 'top',
      location: 'before'
    }];
    return createVNode(1, "div", CLASS$3.excludeFlexBox, createComponentVNode(2, Popup, {
      "componentRef": popupRef,
      "visible": true,
      "shading": false,
      "dragEnabled": true,
      "resizeEnabled": true,
      "showCloseButton": true,
      "_loopFocus": true,
      "toolbarItems": toolbarItems,
      "wrapperAttr": {
        class: this.getPopupWrapperClass()
      },
      "width": popupConfig.width,
      "height": popupConfig.height,
      "container": popupConfig.container,
      "position": popupConfig.position,
      "onHidden": popupConfig.onHidden,
      "onShowing": this.onShowing,
      children: createComponentVNode(2, ColumnSortable, {
        "height": '100%',
        "source": 'column-chooser',
        "filter": `.${CLASS$3.treeviewItem}`,
        "getColumnByIndex": this.getColumnByIndex,
        "isColumnDraggable": sortableConfig.isColumnDraggable,
        "visibleColumns": this.props.visibleColumns,
        "allowDragging": !this.isSelectMode(),
        "columnDragTemplate": Item,
        "onColumnMove": this.props.onColumnMove,
        "onDragStart": sortableConfig.onDragStart,
        "onDragEnd": sortableConfig.onDragEnd,
        "onPlaceholderPrepared": sortableConfig.onPlaceholderPrepared,
        children: treeView
      })
    }), 2);
  }
  isSelectMode() {
    return this.props.mode === 'select';
  }

  // TODO: move it to the other place
  addWidgetPrefix(cssClass) {
    return `dx-cardview-${cssClass}`;
  }
  getPopupWrapperClass() {
    const modeSpecificClass = this.isSelectMode() ? CLASS$3.selectMode : CLASS$3.dragMode;
    return [this.addWidgetPrefix(CLASS$3.root), this.addWidgetPrefix(modeSpecificClass)].join(' ');
  }
  onShowing = e => {
    const popup = e.component;
    if (this.props.popupConfig.position === undefined) {
      popup.option('position', {
        my: 'right top',
        at: 'right bottom',
        // TODO: replace with content view element
        of: '.dx-cardview-column-chooser-button',
        collision: 'fit',
        offset: '-2 -2',
        boundaryOffset: '2 2'
      });
    }
    this.setPopupAttributes(popup);
  };
  setPopupAttributes(popup) {
    // @ts-expect-error
    popup.setAria({
      label: messageLocalization.format('dxDataGrid-columnChooserTitle')
    });

    // @ts-expect-error
    popup.$content().addClass(this.addWidgetPrefix(CLASS$3.list));

    // @ts-expect-error
    popup.$content().toggleClass(this.addWidgetPrefix(CLASS$3.plain), !this.props.isBandColumnsUsed);
  }
  getTreeView() {
    const {
      treeViewRef,
      treeViewConfig,
      treeViewSelectModeConfig,
      treeViewDragAndDropModeConfig
    } = this.props;
    return normalizeProps(createComponentVNode(2, TreeView, {
      "componentRef": treeViewRef,
      "dataStructure": 'plain',
      "activeStateEnabled": true,
      "focusStateEnabled": true,
      "hoverStateEnabled": true,
      "rootValue": null,
      "searchEditorOptions": treeViewConfig.searchEditorOptions,
      "searchEnabled": treeViewConfig.searchEnabled,
      "searchTimeout": treeViewConfig.searchTimeout,
      "noDataText": treeViewConfig.noDataText,
      "items": treeViewConfig.items,
      ...(this.isSelectMode() ? treeViewSelectModeConfig : treeViewDragAndDropModeConfig)
    }));
  }
  getColumnByIndex = index => {
    const treeView = this.props.treeViewRef.current;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const column = treeView.getNodes()[index].itemData.column;
    return column;
  };
}

class ColumnChooserView extends View {
  static dependencies = [ToolbarController, ColumnChooserController, ColumnsController, GridCoreOptionsController];
  constructor(toolbarController, columnChooserController, columnsController, options) {
    super();
    this.toolbarController = toolbarController;
    this.columnChooserController = columnChooserController;
    this.columnsController = columnsController;
    this.options = options;
    this.component = ColumnChooser;
    this.popupVisible = signal(false);
    this.popupRef = createRef();
    this.treeViewRef = createRef();
    this.toolbarButtonElement = undefined;
    this.selectModeConfig = computed(() => ({
      showCheckBoxesMode: this.options.oneWay('columnChooser.selection.allowSelectAll').value ? 'selectAll' : 'normal',
      selectByClick: this.options.oneWay('columnChooser.selection.selectByClick').value,
      onSelectionChanged: this.columnChooserController.onSelectionChanged.bind(this.columnChooserController)
    }));
    this.dragAndDropModeConfig = computed(() => ({
      noDataText: this.options.oneWay('columnChooser.emptyPanelText').value ?? messageLocalization.format('dxDataGrid-columnChooserEmptyText'),
      activeStateEnabled: false
    }));
    this.mode = this.options.oneWay('columnChooser.mode');
    this.dragModeOpened = computed(() => this.popupVisible.value && this.mode.value === 'dragAndDrop');
    this.toolbarController.addDefaultItem(signal({
      name: 'columnChooserButton',
      widget: 'dxButton',
      options: {
        icon: 'column-chooser',
        onContentReady: ({
          element
        }) => {
          this.toolbarButtonElement = element;
        },
        onClick: () => {
          this.popupVisible.value = true;
        },
        elementAttr: {
          'aria-haspopup': 'dialog',
          class: addWidgetPrefix(CLASS$3.toolbarBtn)
        }
      },
      showText: 'inMenu',
      location: 'after',
      locateInMenu: 'auto',
      visible: true
    }), this.options.oneWay('columnChooser.enabled'));
  }
  show() {
    this.popupVisible.value = true;
  }
  hide() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.popupRef.current?.hide();
  }
  getProps() {
    return computed(() => ({
      popupRef: this.popupRef,
      treeViewRef: this.treeViewRef,
      visible: this.popupVisible.value,
      mode: this.mode.value,
      title: this.options.oneWay('columnChooser.title').value,
      chooserColumns: this.columnChooserController.chooserColumns.value,
      visibleColumns: this.columnsController.visibleColumns.value,
      // TODO: band columns aren't yet implemented in cardview
      isBandColumnsUsed: false,
      onColumnMove: this.columnChooserController.onColumnMove,
      popupConfig: {
        width: this.options.oneWay('columnChooser.width').value,
        height: this.options.oneWay('columnChooser.height').value,
        container: this.options.oneWay('columnChooser.container').value,
        position: this.options.oneWay('columnChooser.position').value,
        onHidden: () => {
          this.popupVisible.value = false;
          this.toolbarButtonElement?.focus();
        }
      },
      treeViewConfig: {
        searchEditorOptions: this.options.oneWay('columnChooser.search.editorOptions').value,
        searchEnabled: this.options.oneWay('columnChooser.search.enabled').value,
        searchTimeout: this.options.oneWay('columnChooser.search.timeout').value,
        items: this.columnChooserController.items.value
      },
      treeViewSelectModeConfig: this.selectModeConfig.value,
      treeViewDragAndDropModeConfig: this.dragAndDropModeConfig.value,
      sortableConfig: {
        isColumnDraggable: this.columnChooserController.isColumnDraggable,
        onDragStart: this.columnChooserController.onDragStart,
        onDragEnd: this.columnChooserController.onDragEnd,
        onPlaceholderPrepared: this.columnChooserController.onPlaceholderPrepared
      }
    }));
  }
}

class ConfirmController {
  static dependencies = [];
  confirm(message, title, showTitle) {
    return confirm(message, title,
    // @ts-expect-error wrong typing
    showTitle);
  }
}

const throwError = (errorCode, message) => {
  throw errors$1.Error(errorCode, message);
};

class OptionsValidationController {
  static dependencies = [DataController];
  constructor(dataController) {
    this.dataController = dataController;
  }
  validateKeyExpr() {
    const keyExpr = this.dataController.dataSource.peek().key();
    if (!isDefined(keyExpr)) {
      throwError('E1042', 'CardView');
    }
  }
}

class ItemsController {
  static dependencies = [DataController, ColumnsController, SearchController];
  constructor(dataController, columnsController, searchController) {
    this.dataController = dataController;
    this.columnsController = columnsController;
    this.searchController = searchController;
    this.selectedCardKeys = signal([]);
    this.additionalItems = signal([]);
    this.items = computed(() => {
      // NOTE: We should trigger computed by search options change,
      // But all work with these options encapsulated in SearchHighlightTextProcessor
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.searchController.highlightTextOptions.value;
      return this.dataController.items.value.map((item, itemIndex) => this.createCardInfo(item, this.columnsController.visibleColumns.peek(), itemIndex, this.selectedCardKeys.value)).concat(this.additionalItems.value);
    });
  }
  setSelectionState(keys) {
    this.selectedCardKeys.value = keys;
  }
  findItemByKey(items, key) {
    return items.find(item => equalByValue(item.key, key)) ?? null;
  }
  createCardInfo(data, columns, itemIndex, selectedCardKeys, key, visible = true) {
    const itemKey = key ?? this.dataController.getDataKey(data);
    const fields = columns.map((column, index) => {
      const value = column.calculateFieldValue(data);
      const displayValue = column.calculateDisplayValue(data);
      const formattedText = formatHelper.format(displayValue, column.format);
      const text = column.customizeText ? column.customizeText({
        value: displayValue,
        valueText: formattedText
      }) : formattedText;
      const highlightedText = this.searchController.getHighlightedText(text);
      return {
        card: {},
        // sets later
        index,
        column,
        value,
        displayValue,
        text,
        highlightedText
      };
    });
    const card = {
      fields,
      columns,
      values: fields.map(f => f.value),
      key: itemKey,
      index: itemIndex,
      isSelected: !!selectedCardKeys?.includes(itemKey),
      data,
      visible
    };
    card.fields.forEach(f => {
      f.card = card;
    });
    return card;
  }

  // TODO: remove this method, it is duplicated
  getCardByKey(key) {
    const items = this.items.peek();
    return items.find(item => equalByValue(item.key, key));
  }
}

/* eslint-disable spellcheck/spell-checker */
class KeyboardNavigationController {
  static dependencies = [GridCoreOptionsController];
  constructor(options) {
    this.options = options;
    this.enabled = this.options.oneWay('keyboardNavigation.enabled');
  }
  setReturnFocusTo(element) {
    this.returnFocusTo = element;
  }
  setFirstCardElement(element) {
    this.firstCardElement = element;
  }
  returnFocus() {
    if (!this.returnFocusTo) {
      return;
    }
    if (this.returnFocusTo.isConnected) {
      this.returnFocusTo.focus();
    } else {
      this.firstCardElement?.focus();
    }
    this.returnFocusTo = undefined;
  }
  onKeyDown(event) {
    const action = this.options.action('onKeyDown').peek();
    action({
      handled: event.dxHandled ?? false,
      event,
      element: getPublicElement(renderer(event.target))
    });
  }
  onFocusedCardChanged(card, cardIdx, element) {
    const action = this.options.action('onFocusedCardChanged').peek();
    action({
      cardIndex: cardIdx,
      card,
      cardElement: getPublicElement(renderer(element))
    });
  }
}

function eventHandler(target, key, descriptor) {
  const originFn = descriptor.value;
  descriptor.value = function decoratedEventHandlerFn(event) {
    if (event.dxIgnore) {
      return;
    }
    originFn?.call(this, event);
  };
}

class NativeEventListener {
  unsubscribeArray = [];
  add(elementRef, eventName, eventHandler) {
    elementRef.current?.addEventListener(eventName, eventHandler);
    this.unsubscribeArray.push(() => {
      elementRef.current?.removeEventListener(eventName, eventHandler);
    });
    return this;
  }
  unsubscribe() {
    this.unsubscribeArray.forEach(fn => fn());
  }
}

const markIgnored = event => {
  event.dxIgnore = true;
};
const markHandled = event => {
  event.dxHandled = true;
};
const eventUtils = {
  markHandled,
  markIgnored
};

const notInert = ':not([inert]):not([inert] *)';
const notNegTabIndex = ':not([tabindex^="-"])';
const notDisabled = ':not(:disabled)';
const ALL_FOCUSABLE_ELEMENTS_SELECTOR = [`a[href]${notInert}${notNegTabIndex}`, `area[href]${notInert}${notNegTabIndex}`, `input:not([type="hidden"]):not([type="radio"])${notInert}${notNegTabIndex}${notDisabled}`, `input[type="radio"]${notInert}${notNegTabIndex}${notDisabled}`, `select${notInert}${notNegTabIndex}${notDisabled}`, `textarea${notInert}${notNegTabIndex}${notDisabled}`, `button${notInert}${notNegTabIndex}${notDisabled}`, `details${notInert} > summary:first-of-type${notNegTabIndex}`, `iframe${notInert}${notNegTabIndex}`, `audio[controls]${notInert}${notNegTabIndex}`, `video[controls]${notInert}${notNegTabIndex}`, `[contenteditable]${notInert}${notNegTabIndex}`, `[tabindex]${notInert}${notNegTabIndex}`].join(',');

var _class$1;
function _applyDecoratedDescriptor$3(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = true), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
// NOTE: Return same DOM structure to prevent unexpected markup behavior
const KbnFocusTrapDisabled = props => {
  const {
    elementRef,
    children,
    ...restProps
  } = props;
  return normalizeProps(createVNode(1, "div", null, createVNode(1, "div", null, [createVNode(1, "div", null, null, 1, {
    "data-dx-focus-decoy": false
  }), children, createVNode(1, "div", null, null, 1, {
    "data-dx-focus-decoy": false
  })], 0, {
    "data-dx-focus-trap-content": false
  }), 2, {
    ...restProps
  }, null, elementRef));
};
let KbnFocusTrapEnabled = (_class$1 = class KbnFocusTrapEnabled extends Component$1 {
  elementRef = createRef();
  firstFocusDecoyRef = createRef();
  lastFocusDecoyRef = createRef();
  eventListener = new NativeEventListener();
  componentDidMount() {
    this.eventListener.add(this.firstFocusDecoyRef, 'focusin', this.onFirstDecoyFocusIn.bind(this)).add(this.lastFocusDecoyRef, 'focusin', this.onLastDecoyFocusIn.bind(this));
  }
  componentWillUnmount() {
    this.eventListener.unsubscribe();
  }
  render() {
    const {
      elementRef,
      onKeyDown,
      children,
      ...restProps
    } = this.props;
    const ref = this.getActualRef();
    return normalizeProps(createVNode(1, "div", null, createVNode(1, "div", null, [createVNode(1, "div", null, null, 1, {
      "data-dx-focus-decoy": true,
      "tabindex": 0
    }, null, this.firstFocusDecoyRef), children, createVNode(1, "div", null, null, 1, {
      "data-dx-focus-decoy": true,
      "tabindex": 0
    }, null, this.lastFocusDecoyRef)], 0, {
      "data-dx-focus-trap-content": true,
      "onKeyDown": this.onContentKeyDown.bind(this)
    }), 2, {
      "onKeyDown": this.onKeyDown.bind(this),
      ...restProps
    }, null, ref));
  }

  // TODO: KeyboardEvent
  onKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.focusLastChild();
      eventUtils.markHandled(event);
    }
    this.props.onKeyDown?.(event);
  }

  // TODO: KeyboardEvent
  onContentKeyDown(event) {
    if (event.key === 'Escape') {
      this.getActualRef().current?.focus();
      eventUtils.markHandled(event);
    }
    eventUtils.markIgnored(event);
  }
  onFirstDecoyFocusIn() {
    this.focusLastChild();
  }
  onLastDecoyFocusIn() {
    const firstFocusableElement = this.getInnerFocusableElement('first');
    firstFocusableElement?.focus();
  }
  focusLastChild() {
    const lastFocusableElement = this.getInnerFocusableElement('last');
    lastFocusableElement?.focus();
  }
  getActualRef() {
    return this.props.elementRef ?? this.elementRef;
  }
  getInnerFocusableElement(type) {
    const elementRef = this.getActualRef();
    const focusableElements = elementRef.current?.querySelectorAll(ALL_FOCUSABLE_ELEMENTS_SELECTOR);
    const focusableElementsCount = focusableElements?.length ?? 0;

    // NOTE: We always have two focusable decoys
    if (!focusableElements || focusableElementsCount < 3) {
      return null;
    }
    return type === 'first' ? focusableElements[1] : focusableElements[focusableElementsCount - 2];
  }
}, _applyDecoratedDescriptor$3(_class$1.prototype, "onKeyDown", [eventHandler], Object.getOwnPropertyDescriptor(_class$1.prototype, "onKeyDown"), _class$1.prototype), _applyDecoratedDescriptor$3(_class$1.prototype, "onContentKeyDown", [eventHandler], Object.getOwnPropertyDescriptor(_class$1.prototype, "onContentKeyDown"), _class$1.prototype), _applyDecoratedDescriptor$3(_class$1.prototype, "onFirstDecoyFocusIn", [eventHandler], Object.getOwnPropertyDescriptor(_class$1.prototype, "onFirstDecoyFocusIn"), _class$1.prototype), _applyDecoratedDescriptor$3(_class$1.prototype, "onLastDecoyFocusIn", [eventHandler], Object.getOwnPropertyDescriptor(_class$1.prototype, "onLastDecoyFocusIn"), _class$1.prototype), _class$1);
const KbnFocusTrap = props => {
  const {
    enabled,
    ref,
    onKeyDown,
    ...restProps
  } = props;
  return enabled ? normalizeProps(createComponentVNode(2, KbnFocusTrapEnabled, {
    ...restProps,
    "onKeyDown": onKeyDown
  })) : normalizeProps(createComponentVNode(2, KbnFocusTrapDisabled, {
    ...restProps,
    "onKeyDown": onKeyDown
  }));
};

var _class;
function _applyDecoratedDescriptor$2(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = true), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
const KbnNavigationContainerDisabled = props => {
  const {
    elementRef,
    navigationStrategy,
    children,
    ...restProps
  } = props;
  return normalizeProps(createVNode(1, "div", null, [createVNode(1, "div", null, null, 1, {
    "data-dx-focus-decoy": false
  }), children, createVNode(1, "div", null, null, 1, {
    "data-dx-focus-decoy": false
  })], 0, {
    ...restProps,
    "data-dx-focus-container": false
  }, null, elementRef));
};
let KbnNavigationContainerEnabled = (_class = class KbnNavigationContainerEnabled extends Component$1 {
  elementRef = createRef();
  firstFocusDecoyRef = createRef();
  lastFocusDecoyRef = createRef();
  eventListener = new NativeEventListener();
  componentDidMount() {
    const elementRef = this.getActualRef();
    this.eventListener.add(elementRef, 'focusout', this.onFocusOut.bind(this)).add(this.firstFocusDecoyRef, 'focusin', this.onDecoyFocusIn.bind(this)).add(this.lastFocusDecoyRef, 'focusin', this.onDecoyFocusIn.bind(this));
  }
  componentDidUpdate() {
    this.props.navigationStrategy.normalizeActiveIdx();
  }
  componentWillUnmount() {
    this.eventListener.unsubscribe();
  }
  render() {
    const {
      navigationStrategy,
      elementRef,
      children,
      ...restProps
    } = this.props;
    const ref = this.getActualRef();
    navigationStrategy.clear();
    return normalizeProps(createVNode(1, "div", null, [createVNode(1, "div", null, null, 1, {
      "data-dx-focus-decoy": true,
      "tabindex": 0
    }, null, this.firstFocusDecoyRef), children, createVNode(1, "div", null, null, 1, {
      "data-dx-focus-decoy": true,
      "tabindex": 0
    }, null, this.lastFocusDecoyRef)], 0, {
      ...restProps,
      "onKeyDown": this.onKeyDown.bind(this),
      "data-dx-focus-container": true
    }, null, ref));
  }

  // TODO: KeyboardEvent
  onKeyDown(event) {
    const {
      navigationStrategy,
      onKeyDown
    } = this.props;
    const elementRef = this.getActualRef();
    if (event.key === 'Tab') {
      navigationStrategy.setActiveItem(0, false);
      elementRef.current?.setAttribute('inert', '');
      eventUtils.markHandled(event);
    }
    onKeyDown?.(event);
  }
  onFocusOut() {
    const elementRef = this.getActualRef();
    elementRef.current?.removeAttribute('inert');
  }
  onDecoyFocusIn() {
    const {
      navigationStrategy,
      onFocusMoved
    } = this.props;
    navigationStrategy.setActiveItem(0, true);
    const nextActiveItem = navigationStrategy.getActiveItem();
    if (nextActiveItem) {
      onFocusMoved?.(nextActiveItem.idx, nextActiveItem.element);
    }
  }
  getActualRef() {
    return this.props.elementRef ?? this.elementRef;
  }
}, _applyDecoratedDescriptor$2(_class.prototype, "onKeyDown", [eventHandler], Object.getOwnPropertyDescriptor(_class.prototype, "onKeyDown"), _class.prototype), _applyDecoratedDescriptor$2(_class.prototype, "onFocusOut", [eventHandler], Object.getOwnPropertyDescriptor(_class.prototype, "onFocusOut"), _class.prototype), _applyDecoratedDescriptor$2(_class.prototype, "onDecoyFocusIn", [eventHandler], Object.getOwnPropertyDescriptor(_class.prototype, "onDecoyFocusIn"), _class.prototype), _class);
const KbnNavigationContainer = props => {
  const {
    enabled,
    ref,
    ...restProps
  } = props;
  return enabled ? normalizeProps(createComponentVNode(2, KbnNavigationContainerEnabled, {
    ...restProps
  })) : normalizeProps(createComponentVNode(2, KbnNavigationContainerDisabled, {
    ...restProps
  }));
};

class NavigationStrategyBase {
  items = [];
  activeIdx = 0;
  setItem(idx, item) {
    this.items[idx] = item;
  }
  clear() {
    this.items = [];
  }
  normalizeActiveIdx() {
    if (!this.items[this.activeIdx]) {
      this.activeIdx = 0;
    }
  }
  focusActiveItem() {
    const activeItem = this.items[this.activeIdx];
    activeItem?.focus();
  }
  getActiveItem() {
    const activeItem = this.items[this.activeIdx];
    const element = activeItem?.getElement();
    if (!activeItem || !element) {
      return null;
    }
    return {
      idx: this.activeIdx,
      element
    };
  }
  setActiveItem(idx, focus) {
    if (!this.items[idx]) {
      return;
    }
    this.activeIdx = idx;
    if (focus) {
      this.focusActiveItem();
    }
  }
  getNewActiveItem(action) {
    const prevActiveItem = this.getActiveItem();
    const result = action();
    const nextActiveItem = this.getActiveItem();
    return !!nextActiveItem && prevActiveItem?.element !== nextActiveItem?.element ? [result, nextActiveItem] : [result, null];
  }
}

class NavigationStrategyHorizontalList extends NavigationStrategyBase {
  onKeyDown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        this.moveActiveElement(-1);
        return true;
      case 'ArrowRight':
        this.moveActiveElement(1);
        return true;
      default:
        return false;
    }
  }
  moveActiveElement(idxShift) {
    const currentIdx = this.activeIdx;
    if (currentIdx < 0) {
      this.focusActiveItem();
      return;
    }
    const nextIdx = currentIdx + idxShift;
    this.setActiveItem(nextIdx, true);
  }
}

class NavigationStrategyMatrix extends NavigationStrategyBase {
  constructor(columnsCount) {
    super();
    this.columnsCount = columnsCount;
  }
  updateColumnsCount(columnsCount) {
    this.columnsCount = columnsCount;
  }
  onKeyDown(event) {
    return this.activeIdx >= 0 ? this.handleMovement(event) : false;
  }
  handleMovement(event) {
    switch (true) {
      case event.key === 'ArrowUp':
        this.moveActiveElement(-1, 0);
        return true;
      case event.key === 'ArrowDown':
        this.moveActiveElement(1, 0);
        return true;
      case event.key === 'ArrowLeft':
        this.moveActiveElement(0, -1);
        return true;
      case event.key === 'ArrowRight':
        this.moveActiveElement(0, 1);
        return true;
      case event.ctrlKey && event.key === 'Home':
        this.moveToFirstInFirstRow();
        return true;
      case event.key === 'Home':
        this.moveToFirstInRow();
        return true;
      case event.ctrlKey && event.key === 'End':
        this.moveToLastInLastRow();
        return true;
      case event.key === 'End':
        this.moveToLastInRow();
        return true;
      default:
        return false;
    }
  }
  moveActiveElement(rowShift, columnShift) {
    const currentIdx = this.activeIdx;
    const {
      columnsCount,
      items: {
        length: itemsCount
      }
    } = this;
    const rowCount = Math.ceil(itemsCount / columnsCount);
    const currentColumnIdx = currentIdx % columnsCount;
    const currentRowIdx = Math.floor(currentIdx / columnsCount);
    const nextColumnIdx = currentColumnIdx + columnShift;
    const nextRowIdx = currentRowIdx + rowShift;
    const nextIdx = currentIdx + columnShift + columnsCount * rowShift;
    if (nextIdx >= itemsCount || nextColumnIdx < 0 || nextColumnIdx >= columnsCount || nextRowIdx < 0 || nextRowIdx >= rowCount) {
      this.focusActiveItem();
      return;
    }
    this.setActiveItem(nextIdx, true);
  }
  moveToFirstInRow() {
    const currentIdx = this.activeIdx;
    const {
      columnsCount
    } = this;
    const currentColumnIdx = currentIdx % columnsCount;
    if (currentColumnIdx === 0) {
      return;
    }
    this.moveActiveElement(0, -currentColumnIdx);
  }
  moveToLastInRow() {
    const currentIdx = this.activeIdx;
    const {
      columnsCount
    } = this;
    const currentColumnIdx = currentIdx % columnsCount;
    if (currentColumnIdx === columnsCount - 1) {
      return;
    }
    this.moveActiveElement(0, columnsCount - currentColumnIdx - 1);
  }
  moveToFirstInFirstRow() {
    this.setActiveItem(0, true);
  }
  moveToLastInLastRow() {
    const {
      items: {
        length: itemsCount
      }
    } = this;
    this.setActiveItem(itemsCount - 1, true);
  }
}

const defaultOptions$d = {
  keyboardNavigation: {
    enabled: true
  }
};

const KEY_NAMES_MAPPING = {
  ' ': 'Space'
};
const KEY_MODIFICATIONS = {
  shift: 'shift',
  alt: 'alt',
  ctrl: 'ctrl'
};
const SEPARATOR = '+';
const normalizeKeyName = keyName => KEY_NAMES_MAPPING[keyName] ?? keyName;
const getKeyWithModifications = event => {
  const normalizedKeyName = normalizeKeyName(event.key);
  switch (true) {
    case event.altKey:
      return `${normalizedKeyName}${SEPARATOR}${KEY_MODIFICATIONS.alt}`;
    case event.shiftKey:
      return `${normalizedKeyName}${SEPARATOR}${KEY_MODIFICATIONS.shift}`;
    case event.ctrlKey:
    case event.metaKey:
      return `${normalizedKeyName}${SEPARATOR}${KEY_MODIFICATIONS.ctrl}`;
    default:
      return normalizedKeyName;
  }
};

function _applyDecoratedDescriptor$1(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = true), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
const withKeyDownHandler = WrappedComponent => {
  var _class;
  let WithKeyDownHandler = (_class = class WithKeyDownHandler extends Component$1 {
    elementRef = createRef();
    render() {
      const {
        onKeyDown,
        keyDownConfig,
        children,
        ...restProps
      } = this.props;
      return normalizeProps(createComponentVNode(2, WrappedComponent, {
        ...restProps,
        "onKeyDown": this.onKeyDown.bind(this),
        children: children
      }));
    }

    // TODO: KeyboardEvent
    onKeyDown(event) {
      const {
        keyDownConfig,
        onKeyDown,
        caughtEventPreventDefault
      } = this.props;
      const ref = this.getActualRef();
      const fullKeyName = getKeyWithModifications(event);
      const handler = keyDownConfig?.[fullKeyName];
      if (handler) {
        handler(event, ref);
        eventUtils.markHandled(event);
      }
      if (handler && caughtEventPreventDefault) {
        event.preventDefault();
      }
      onKeyDown?.(event);
    }
    getActualRef() {
      return this.props.elementRef ?? this.elementRef;
    }
  }, _applyDecoratedDescriptor$1(_class.prototype, "onKeyDown", [eventHandler], Object.getOwnPropertyDescriptor(_class.prototype, "onKeyDown"), _class.prototype), _class);
  return WithKeyDownHandler;
};

function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = true), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
const withKbnNavigationItem = WrappedComponent => {
  var _class;
  let WithKbnNavigationItem = (_class = class WithKbnNavigationItem extends Component$1 {
    elementRef = createRef();
    eventListener = new NativeEventListener();
    navigationItem = {
      focus: () => {
        this.getActualRef().current?.focus();
      },
      getElement: () => this.getActualRef().current
    };
    componentDidMount() {
      const elementRef = this.getActualRef();
      const {
        navigationStrategy,
        navigationIdx
      } = this.props;
      navigationStrategy.setItem(navigationIdx, this.navigationItem);
      this.eventListener.add(elementRef, 'focusin', this.onFocusIn.bind(this));
    }
    componentDidUpdate() {
      this.props.navigationStrategy.setItem(this.props.navigationIdx, this.navigationItem);
    }
    componentWillUnmount() {
      this.eventListener.unsubscribe();
    }
    render() {
      const {
        elementRef,
        tabIndex,
        onKeyDown,
        children,
        ...restProps
      } = this.props;
      const ref = this.getActualRef();
      return normalizeProps(createComponentVNode(2, WrappedComponent, {
        "elementRef": ref,
        "tabIndex": 0,
        "onKeyDown": this.onKeyDown.bind(this),
        ...restProps,
        children: children
      }));
    }

    // TODO: KeyboardEvent
    onKeyDown(event) {
      const {
        navigationStrategy,
        onKeyDown,
        onFocusMoved
      } = this.props;
      const [eventHandled, newActiveItem] = navigationStrategy.getNewActiveItem(() => navigationStrategy.onKeyDown(event));
      if (eventHandled) {
        event.preventDefault();
        eventUtils.markHandled(event);
      }
      if (newActiveItem) {
        onFocusMoved?.(newActiveItem.idx, newActiveItem.element);
      }
      onKeyDown?.(event);
    }
    onFocusIn() {
      const {
        navigationStrategy,
        navigationIdx,
        onFocusMoved
      } = this.props;
      const [, newActiveItem] = navigationStrategy.getNewActiveItem(() => navigationStrategy.setActiveItem(navigationIdx, false));
      if (newActiveItem) {
        onFocusMoved?.(newActiveItem.idx, newActiveItem.element);
      }
    }
    getActualRef() {
      return this.props.elementRef ?? this.elementRef;
    }
  }, _applyDecoratedDescriptor(_class.prototype, "onKeyDown", [eventHandler], Object.getOwnPropertyDescriptor(_class.prototype, "onKeyDown"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onFocusIn", [eventHandler], Object.getOwnPropertyDescriptor(_class.prototype, "onFocusIn"), _class.prototype), _class);
  return WithKbnNavigationItem;
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
class EditingController {
  static dependencies = [GridCoreOptionsController, ItemsController, ColumnsController, DataController, KeyboardNavigationController, OptionsValidationController, ConfirmController];
  constructor(options, itemsController, columnController, dataController, kbn, optionsValidationController, confirmController) {
    this.options = options;
    this.itemsController = itemsController;
    this.columnController = columnController;
    this.dataController = dataController;
    this.kbn = kbn;
    this.optionsValidationController = optionsValidationController;
    this.confirmController = confirmController;
    this.changes = this.options.twoWay('editing.changes');
    this.editCardKey = this.options.twoWay('editing.editCardKey');
    this.allowDeleting = this.options.twoWay('editing.allowDeleting');
    this.allowUpdating = this.options.twoWay('editing.allowUpdating');
    this.allowAdding = this.options.twoWay('editing.allowAdding');
    this.needConfirmDelete = this.options.oneWay('editing.confirmDelete');
    this.texts = this.options.oneWay('editing.texts');
    this.onEditCanceling = this.options.action('onEditCanceling');
    this.onEditCanceled = this.options.action('onEditCanceled');
    this.onEditingStart = this.options.action('onEditingStart');
    this.onInitNewCard = this.options.action('onInitNewCard');
    this.onCardInserted = this.options.action('onCardInserted');
    this.onCardInserting = this.options.action('onCardInserting');
    this.onCardUpdated = this.options.action('onCardUpdated');
    this.onCardUpdating = this.options.action('onCardUpdating');
    this.onCardRemoved = this.options.action('onCardRemoved');
    this.onCardRemoving = this.options.action('onCardRemoving');
    this.onSaving = this.options.action('onSaving');
    this.onSaved = this.options.action('onSaved');
    this.editingCard = computed(() => {
      const editCardKey = this.editCardKey.value;
      const items = this.itemsController.items.value;
      const changes = this.changes.value;
      if (!isDefined(editCardKey)) {
        return null;
      }
      const oldItem = this.itemsController.findItemByKey(items, editCardKey);
      if (!oldItem) {
        return null;
      }
      const insertChange = changes.find(change => change.key === editCardKey && change.type === 'insert');
      const oldData = insertChange?.data ?? oldItem.data;
      const newData = insertChange ? {
        ...oldData,
        ...changes
      } : applyChanges([oldData], changes, {
        keyExpr: this.dataController.dataSource.peek().key(),
        immutable: true
      })[0];
      const newItem = this.itemsController.createCardInfo(newData, this.columnController.columns.peek(), oldItem.index, undefined, oldItem.key);
      return newItem;
    });
  }
  provideValidateMethod(validateMethod) {
    this.validateMethod = validateMethod;
  }
  editCard(key) {
    this.optionsValidationController.validateKeyExpr();
    const eventArgs = {
      cancel: false,
      key,
      data: this.itemsController.getCardByKey(key).data
    };
    this.onEditingStart.peek()(eventArgs);
    if (!eventArgs.cancel) {
      this.editCardKey.value = key;
    }
  }
  async validate() {
    return this.validateMethod?.() ?? true;
  }
  async addCard() {
    this.optionsValidationController.validateKeyExpr();
    const eventArgs = {
      promise: undefined,
      data: {}
    };
    this.onInitNewCard.peek()(eventArgs);
    await eventArgs.promise;
    const newItemKey = this.dataController.getDataKey(eventArgs.data) ?? generateNewRowTempKey();
    this.itemsController.additionalItems.value = [...this.itemsController.additionalItems.peek(), this.itemsController.createCardInfo(eventArgs.data, this.columnController.columns.peek(), -1, [], newItemKey, false)];
    this.changes.value = [...this.changes.peek(), {
      type: 'insert',
      key: newItemKey,
      data: eventArgs.data
    }];
    this.editCardKey.value = newItemKey;
  }
  async confirmDelete() {
    if (!this.needConfirmDelete.peek()) {
      return Promise.resolve(true);
    }
    const {
      confirmDeleteMessage,
      confirmDeleteTitle
    } = this.texts.peek();
    const showDialogTitle = isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
    const result = await this.confirmController.confirm(confirmDeleteMessage ?? messageLocalization.format('dxDataGrid-editingConfirmDeleteMessage'), confirmDeleteTitle ?? '', showDialogTitle);
    return result;
  }
  async deleteCard(key) {
    this.optionsValidationController.validateKeyExpr();
    const confirmStatus = await this.confirmDelete();
    if (!confirmStatus) {
      this.kbn.returnFocus();
      return;
    }

    // @ts-expect-error
    this.changes.value = [...this.changes.peek(), {
      type: 'remove',
      key
    }];
    await this.save();
    this.kbn.returnFocus();
  }
  clear() {
    this.changes.value = [];
    this.editCardKey.value = null;
    this.itemsController.additionalItems.value = [];
  }
  async flushChanges() {
    await this.processChanges(this.changes.peek());
    this.clear();
  }
  cancel() {
    const changes = this.changes.peek();
    const eventArgs = {
      changes,
      cancel: false
    };
    this.onEditCanceling.peek()(eventArgs);
    if (eventArgs.cancel) {
      return false;
    }
    this.clear();
    this.onEditCanceled.peek()({
      changes
    });
    return true;
  }
  async save() {
    const validationSuccessful = await this.validate();
    if (!validationSuccessful) {
      return;
    }
    const changes = this.changes.peek();
    const eventArgs = {
      promise: undefined,
      cancel: false,
      changes
    };
    this.onSaving.peek()(eventArgs);
    await eventArgs.promise;
    if (eventArgs.cancel) {
      return;
    }
    await this.flushChanges();
    this.onSaved.peek()({
      changes
    });
  }
  async processChanges(changes) {
    const promises = [];
    for (const change of changes) {
      // eslint-disable-next-line default-case
      switch (change.type) {
        case 'update':
          {
            const updatingArgs = {
              oldData: this.itemsController.getCardByKey(change.key).data,
              newData: change.data,
              cancel: false,
              key: change.key
            };
            this.onCardUpdating.peek()(updatingArgs);

            // eslint-disable-next-line no-await-in-loop
            if (await updatingArgs.cancel) {
              break;
            }
            promises.push(this.dataController.update(change.key, change.data));
            this.onCardUpdated.peek()({
              data: change.data,
              key: change.key
            });
            break;
          }
        case 'remove':
          {
            const {
              data
            } = this.itemsController.findItemByKey(this.itemsController.items.peek(), change.key);
            const removingArgs = {
              cancel: false,
              data,
              key: change.key
            };
            this.onCardRemoving.peek()(removingArgs);

            // eslint-disable-next-line no-await-in-loop
            if (await removingArgs.cancel) {
              break;
            }
            promises.push(this.dataController.remove(change.key));
            this.onCardRemoved.peek()({
              data,
              key: change.key
            });
            break;
          }
        case 'insert':
          {
            const insertingArgs = {
              cancel: false,
              data: change.data
            };
            this.onCardInserting.peek()(insertingArgs);

            // eslint-disable-next-line no-await-in-loop
            if (await insertingArgs.cancel) {
              break;
            }
            promises.push(this.dataController.insert(change.data));
            this.onCardInserted.peek()({
              data: change.data
            });
            break;
          }
      }
    }
    await Promise.all(promises);
    await this.dataController.reload();
  }
  addChange(key, newData) {
    const existingChange = this.changes.peek().find(change => change.key === key && ['insert', 'update'].includes(change.type));
    const newChange = existingChange ? {
      ...existingChange,
      data: {
        ...existingChange.data,
        ...newData
      }
    } : {
      key,
      type: 'update',
      data: newData
    };
    this.changes.value = [...this.changes.peek().filter(change => change !== existingChange), newChange];
  }
}

class Form extends InfernoWrapper {
  getComponentFabric() {
    return Form$1;
  }
}

function getSaveButtonConfig(props) {
  const config = {
    toolbar: 'bottom',
    location: 'after',
    widget: 'dxButton',
    options: {
      text: props.text,
      onClick: props.onSave
    }
  };
  if (isFluent(current())) {
    config.options.stylingMode = 'contained';
    config.options.type = 'default';
  }
  return config;
}
function getCancelButtonConfig(props) {
  const config = {
    toolbar: 'bottom',
    location: 'after',
    widget: 'dxButton',
    options: {
      text: props.text,
      onClick: props.onCancel
    }
  };
  if (isFluent(current())) {
    config.options.stylingMode = 'outlined';
  }
  return config;
}

class EditPopup extends Component$1 {
  render() {
    if (!this.props.visible) {
      // TODO: research whether it is good approach
      // @ts-expect-error
      this.props.formRef.current = null;
      return createFragment();
    }
    const toolbarItems = [getSaveButtonConfig({
      onSave: this.props.onSave,
      text: this.props.texts.saveCard
    }), getCancelButtonConfig({
      onCancel: this.props.onCancel,
      text: this.props.texts.cancel
    })];
    return createVNode(1, "div", CLASSES$c.excludeFlexBox, normalizeProps(createComponentVNode(2, Popup, {
      "visible": true,
      "toolbarItems": toolbarItems,
      "onHidden": this.props.onHide,
      "showTitle": false,
      ...this.props.popupProps,
      children: normalizeProps(createComponentVNode(2, Form, {
        "componentRef": this.props.formRef,
        "colCount": 2,
        "labelLocation": 'top',
        "customizeItem": this.props.customizeItem,
        "items": this.props.items,
        ...this.props.formProps
      }))
    })), 2);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

const EDITOR_TYPES_BY_DATA_TYPE = {
  string: 'dxTextBox',
  number: 'dxNumberBox',
  boolean: 'dxCheckBox',
  object: 'dxTextBox',
  date: 'dxDateBox',
  datetime: 'dxDateBox'
};
class EditPopupView extends View {
  static dependencies = [GridCoreOptionsController, ColumnsController, ItemsController, EditingController, ToolbarController, KeyboardNavigationController];
  constructor(options, columnsController, itemsController, editingController, toolbar, kbn) {
    super();
    this.options = options;
    this.columnsController = columnsController;
    this.itemsController = itemsController;
    this.editingController = editingController;
    this.toolbar = toolbar;
    this.kbn = kbn;
    this.promises = new PendingPromises();
    this.formRef = createRef();
    this.component = EditPopup;
    this.items = computed(() => {
      const userItems = this.options.oneWay('editing.form.items').value;
      if (userItems) {
        return userItems;
      }
      return this.columnsController.columns.value.map(column => ({
        column,
        name: column.name,
        dataField: column.dataField
      }));
    });
    this.customEditorItems = computed(() => {
      const items = this.items.value;
      const result = [];
      forEachFormItems(items, item => {
        const itemId = item?.name || item?.dataField;
        if (itemId && !!item.editorType) {
          result.push(itemId);
        }
      });
      return result;
    });
    this.visible = computed(() => !!this.editingController.editingCard.value);
    this.editingTexts = computed(() => {
      const texts = this.editingController.texts.value;
      return {
        confirmDeleteMessage: texts.confirmDeleteMessage ?? messageLocalization.format('dxDataGrid-editingConfirmDeleteMessage'),
        confirmDeleteTitle: texts.confirmDeleteTitle ?? '',
        deleteCard: texts.deleteCard ?? messageLocalization.format('dxDataGrid-editingDeleteRow'),
        editCard: texts.editCard ?? messageLocalization.format('dxDataGrid-editingEditRow'),
        saveCard: texts.saveCard ?? messageLocalization.format('dxDataGrid-editingSaveRowChanges'),
        addCard: texts.addCard ?? messageLocalization.format('dxDataGrid-editingAddRow'),
        cancel: texts.cancel ?? messageLocalization.format('dxDataGrid-editingCancelRowChanges')
      };
    });
    this.customizeItems = item => {
      const editingCard = this.editingController.editingCard.peek();
      const columns = this.columnsController.columns.peek();
      const customEditorItems = this.customEditorItems.peek();
      if (!editingCard) {
        return;
      }
      if (item.itemType !== 'simple') {
        return;
      }
      const simpleFormItem = item;
      const itemId = simpleFormItem.name ?? simpleFormItem.dataField;
      const column = simpleFormItem.column ?? columns.find(c => c.name === itemId) ?? columns.find(c => c.dataField === itemId);
      if (!column) {
        return;
      }
      simpleFormItem.column = column;
      if (itemId && !customEditorItems.includes(itemId)) {
        simpleFormItem.editorType = EDITOR_TYPES_BY_DATA_TYPE[column.dataType];
      }
      extend(simpleFormItem, column.formItem);
      simpleFormItem.dataField ??= column.dataField;
      simpleFormItem.validationRules ??= column.validationRules;
      simpleFormItem.label = {
        text: column.caption,
        ...column.formItem.label
      };
      const originalContentReady = simpleFormItem?.editorOptions?.onContentReady;
      simpleFormItem.editorOptions = {
        stylingMode: 'outlined',
        disabled: !column.allowEditing,
        ...column.editorOptions,
        ...column.formItem.editorOptions,
        ...simpleFormItem.editorOptions,
        onValueChanged: async ({
          value
        }) => {
          const newData = {};
          await this.promises.add(Promise.resolve(column.setFieldValue.bind(column)(newData, value, editingCard.data)));
          this.editingController.addChange(editingCard.key, newData);
        },
        value: editingCard?.fields.find(c => c.column.name === column.name)?.value ?? null,
        onContentReady: e => {
          // TODO: refactor
          setTimeout(() => {
            // @ts-expect-error
            renderer(e.element).data('dxValidator')?.option('dataGetter', () => ({
              data: this.editingController.editingCard.peek()?.data,
              column
            }));
          });
          originalContentReady?.(e);
        }
      };
      if (simpleFormItem.editorType === 'dxDateBox') {
        simpleFormItem.editorOptions.type = column.dataType;
      }
    };
    this.toolbar.addDefaultItem(signal({
      name: 'addCardButton',
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'add',
        onClick: () => this.editingController.addCard()
      }
    }), this.editingController.allowAdding);
    this.editingController.provideValidateMethod(async () => {
      const form = this.formRef.current;
      if (!form) {
        return true;
      }
      const preValidationResult = form.validate();
      const validationResult = await (preValidationResult.complete ?? preValidationResult);
      return !!validationResult.isValid;
    });
  }
  getProps() {
    return computed(() => ({
      visible: this.visible.value,
      formProps: this.options.oneWay('editing.form').value,
      popupProps: this.options.oneWay('editing.popup').value,
      formRef: this.formRef,
      onSave: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.editingController.save();
        this.kbn.returnFocus();
      },
      onCancel: () => {
        this.editingController.cancel();
        this.kbn.returnFocus();
      },
      onHide: () => {
        this.editingController.cancel();
        this.kbn.returnFocus();
      },
      items: this.items.value,
      customizeItem: this.customizeItems,
      texts: this.editingTexts.value
    }));
  }
}

/* eslint-disable spellcheck/spell-checker */

class HeaderFilterViewController {
  static dependencies = [GridCoreOptionsController, DataController, ColumnsController, FilterController];
  constructor(options, dataController, columnsController, filterController) {
    this.options = options;
    this.dataController = dataController;
    this.columnsController = columnsController;
    this.filterController = filterController;
    this.popupStateInternal = signal(null);
    this.popupState = this.popupStateInternal;
  }
  openPopup(element, column, onFilterCloseCallback, customApply, isFilterBuilder) {
    const rootDataSource = this.dataController.getStoreLoadAdapter();
    /*
      Note: Root headerFilter options are used because the legacy code handles retrieving
      options for specific columns on its own
    */
    const rootHeaderFilterOptions = this.options.oneWay('headerFilter').peek();
    const filterExpression = this.getFilterExpressionWithoutCurrentColumn(column);
    const type = getHeaderFilterListType(column);
    const {
      columnsController
    } = this;
    const applyFilter = (filterValues, filterType) => {
      if (customApply) {
        customApply(filterValues);
      } else {
        columnsController.updateColumns(columns => {
          const index = getColumnIndexByName(columns, column.name);
          const newColumns = [...columns];
          newColumns[index] = {
            ...newColumns[index],
            // NOTE: Copy array because of mutations in legacy code
            filterValues: Array.isArray(filterValues) ? [...filterValues] : filterValues,
            filterType
          };
          return newColumns;
        });
      }
      onFilterCloseCallback?.();
    };
    const popupOptions = {
      type,
      column: {
        ...column
      },
      isFilterBuilder,
      headerFilter: {
        ...column.headerFilter
      },
      filterType: column.filterType,
      // NOTE: Copy array because of mutations in legacy code
      filterValues: Array.isArray(column.filterValues) ? [...column.filterValues] : column.filterValues,
      apply() {
        applyFilter(this.filterValues, this.filterType);
      },
      hidePopupCallback: () => {
        this.popupStateInternal.value = null;
        onFilterCloseCallback?.();
      }
    };
    popupOptions.dataSource = getDataSourceOptions(rootDataSource, popupOptions,
    // NOTE: Only text used from root options
    {
      texts: rootHeaderFilterOptions.texts
    }, filterExpression);
    this.popupStateInternal.value = {
      element,
      options: popupOptions
    };
  }
  closePopup() {
    this.popupStateInternal.value = null;
  }
  removeColumnFromFilters(appliedFilters, excludedColumn) {
    const columnId = getColumnIdentifier(excludedColumn);
    const filterPanel = removeFieldConditionsFromFilter(appliedFilters.filterPanel, columnId);
    const headerFilter = removeFieldConditionsFromFilter(appliedFilters.headerFilter, columnId);
    return {
      filterPanel,
      headerFilter,
      // Note: Search filter should not be handled as in the DataGrid implementation
      search: appliedFilters.search
    };
  }
  combineFilterExpressions(filterExpressions) {
    if (!filterExpressions || filterExpressions.length === 0) {
      return undefined;
    }
    return gridCoreUtils.combineFilters(filterExpressions);
  }
  getFilterExpressionWithoutCurrentColumn(column) {
    const appliedFilters = this.filterController.appliedFilters.peek();
    const filtersWithoutCurrentColumn = this.removeColumnFromFilters(appliedFilters, column);
    const filterableColumns = this.columnsController.filterableColumns.peek();
    const customOperations = this.filterController.customOperations.peek();
    const filterSyncEnabled = this.filterController.filterSyncEnabled.peek();
    const appliedFilterExpresssionsArray = getAppliedFilterExpressions(filtersWithoutCurrentColumn, filterableColumns, customOperations, filterSyncEnabled);
    return this.combineFilterExpressions(appliedFilterExpresssionsArray);
  }
}

class CompatibilityHeaderFilterController {
  static dependencies = [FilterController, HeaderFilterViewController, DataController, GridCoreOptionsController];
  constructor(realFilterController, realHeaderFilterViewController, realDataController, options) {
    this.realFilterController = realFilterController;
    this.realHeaderFilterViewController = realHeaderFilterViewController;
    this.realDataController = realDataController;
    this.options = options;
    this.realFilterController.headerFilterCompatibilityController = this;
  }
  getCustomFilterOperations() {
    return this.realFilterController.customOperations.peek();
  }
  showHeaderFilterMenuBase(args) {
    this.realHeaderFilterViewController.openPopup(args.columnElement, args.column, args.onHidden, args.customApply, args.isFilterBuilder);
  }
  hideHeaderFilterMenu() {
    this.realHeaderFilterViewController.closePopup();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDataSource(column) {
    const adapter = this.realDataController.getStoreLoadAdapter();
    const popupOptions = {
      column: {
        ...column
      },
      filterType: column.filterType,
      filterValues: column.filterValues
    };
    /*
      Note: Root headerFilter options are used because the legacy code handles retrieving
      options for specific columns on its own
    */
    const rootHeaderFilterOptions = this.options.oneWay('headerFilter').peek();
    return getDataSourceOptions(adapter, popupOptions, rootHeaderFilterOptions, null);
  }
}

const defaultOptions$c = {
  headerFilter: {
    visible: false,
    width: 252,
    height: 325,
    allowSelectAll: true,
    search: {
      enabled: false,
      timeout: 500,
      mode: 'contains',
      editorOptions: {}
    },
    texts: {
      emptyValue: undefined,
      ok: undefined,
      cancel: undefined
    }
  }
};

class WidgetMock {
  constructor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  widget, data, columns, headerFilter, filterSync) {
    this.widget = widget;
    this.data = data;
    this.columns = columns;
    this.headerFilter = headerFilter;
    this.filterSync = filterSync;
    this.NAME = 'dxDataGrid';
    this._controllers = {
      data: this.data,
      columns: this.columns,
      headerFilter: this.headerFilter,
      filterSync: this.filterSync
    };
  }
  option(...args) {
    // @ts-expect-error
    return this.widget.option(...args);
  }
  columnOption(...args) {
    // @ts-expect-error
    return this.widget.columnOption(...args);
  }
  _createActionByOption(...args) {
    // @ts-expect-error
    return this.widget._createActionByOption(...args);
  }
  _createComponent(...args) {
    // @ts-expect-error
    return this.widget._createComponent(...args);
  }
}

class HeaderFilterPopupComponent extends Component$1 {
  containerRef = createRef();
  render() {
    return createVNode(1, "div", CLASSES$c.excludeFlexBox, null, 1, null, null, this.containerRef);
  }
  componentDidMount() {
    this.props.oldHeaderFilterPopup.render(renderer(this.containerRef.current ?? undefined));
  }
  componentDidUpdate() {
    this.props.oldHeaderFilterPopup.render(renderer(this.containerRef.current ?? undefined));
  }
  componentWillUnmount() {
    this.props.oldHeaderFilterPopup.dispose();
  }
}
class HeaderFilterPopupView extends View {
  static dependencies = [WidgetMock, HeaderFilterViewController];
  constructor(widget, headerFilterViewController) {
    super();
    this.widget = widget;
    this.headerFilterViewController = headerFilterViewController;
    this.component = HeaderFilterPopupComponent;
    this.oldHeaderFilterPopup = new HeaderFilterView$1(this.widget);
    this.oldHeaderFilterPopup.init();
    effect(() => {
      const popupState = this.headerFilterViewController.popupState.value;
      if (!popupState) {
        return;
      }
      this.oldHeaderFilterPopup.showHeaderFilterMenu(renderer(popupState.element), popupState.options);
    });
  }
  getProps() {
    return computed(() => ({
      oldHeaderFilterPopup: this.oldHeaderFilterPopup
    }));
  }
}

const defaultOptions$b = {
  filterBuilder: {
    groupOperationDescriptions: {
      and: undefined,
      or: undefined,
      notAnd: undefined,
      notOr: undefined
    },
    filterOperationDescriptions: {
      between: undefined,
      equal: undefined,
      notEqual: undefined,
      lessThan: undefined,
      lessThanOrEqual: undefined,
      greaterThan: undefined,
      greaterThanOrEqual: undefined,
      startsWith: undefined,
      contains: undefined,
      notContains: undefined,
      endsWith: undefined,
      isBlank: undefined,
      isNotBlank: undefined
    }
  },
  filterPanel: {
    visible: false,
    filterEnabled: true,
    texts: {
      createFilter: undefined,
      clearFilter: undefined,
      filterEnabledHint: undefined
    }
  },
  filterBuilderPopup: {}
};

class FilterPanelComponent extends Component$1 {
  filterPanelRef = createRef();
  filterBuilderRef = createRef();
  render() {
    return createFragment([createVNode(1, "div", null, null, 1, null, null, this.filterPanelRef), createVNode(1, "div", CLASSES$c.excludeFlexBox, null, 1, null, null, this.filterBuilderRef)], 4);
  }
  componentDidMount() {
    this.props.oldFilterPanelView.render(renderer(this.filterPanelRef.current));
    this.props.oldFilterBuilderView.render(renderer(this.filterBuilderRef.current));
  }
  componentDidUpdate() {
    this.props.oldFilterPanelView.render(renderer(this.filterPanelRef.current));
    this.props.oldFilterBuilderView.render(renderer(this.filterBuilderRef.current));
  }
}

class FilterPanelView extends View {
  static dependencies = [FilterController, WidgetMock];
  constructor(filterController, widget) {
    super();
    this.filterController = filterController;
    this.widget = widget;
    this.component = FilterPanelComponent;
    this.oldFilterPanelView = new FilterPanelView$1(this.widget);
    this.oldFilterBuilderView = new FilterBuilderView(this.widget);
    this.oldFilterPanelView.init();
    this.oldFilterBuilderView.init();
  }
  getProps() {
    return computed(() => ({
      oldFilterBuilderView: this.oldFilterBuilderView,
      oldFilterPanelView: this.oldFilterPanelView,
      filterValue: this.filterController.filterValueOption.value,
      filterPanel: this.filterController.filterPanelOptions.value,
      filterBuilder: this.filterController.filterBuilderOptions.value,
      filterBuilderPopup: this.filterController.filterBuilderPopupOptions.value
    }));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  optionChanged(args) {
    this.oldFilterBuilderView.optionChanged(args);
    this.oldFilterPanelView.optionChanged(args);
  }
  isCompatibilityMode() {
    return true;
  }
}

const defaultOptions$a = {
  filterValue: null
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

function PublicMethods$4(GridCore) {
  return class GridCoreWithFilterController extends GridCore {
    clearFilter() {
      this.filterSyncController.clearFilters();
    }
  };
}

// 🚨🚨🚨 Complex utils functions from grid_core used here for merging filters
// TODO filterSync: move these utils to the new grid_core
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFilterValues = filterConditions => {
  if (filterConditions.length !== 1) {
    return undefined;
  }
  const filterCondition = filterConditions[0];
  if (!filterCondition) {
    return undefined;
  }
  const value = filterCondition[2];
  const hasArrayValue = Array.isArray(value);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return hasArrayValue ? value : [value];
};
const getFilterType = filterConditions => {
  if (filterConditions.length !== 1) {
    return undefined;
  }
  const filterCondition = filterConditions[0];
  if (!filterCondition) {
    return undefined;
  }
  const selectedFilterOperation = filterCondition[1];
  switch (selectedFilterOperation) {
    case 'anyof':
    case '=':
      return 'include';
    case 'noneof':
    case '<>':
      return 'exclude';
    default:
      return undefined;
  }
};

// NOTE: Logic from util function grid_core/filter/m_filter_sync "getConditionFromHeaderFilter"
const getConditionFromHeaderFilter = ({
  type,
  columnId,
  filterType,
  filterValues
}) => {
  const [firstFilterItem] = filterValues;
  switch (true) {
    case type === 'single-value' && filterType === 'exclude':
      return [columnId, '<>', firstFilterItem];
    case type === 'single-value' && filterType === 'include':
      return [columnId, '=', firstFilterItem];
    case type === 'values-or-condition' && filterType === 'exclude':
      return [columnId, 'noneof', filterValues];
    case type === 'values-or-condition' && filterType === 'include':
      return [columnId, 'anyof', filterValues];
    case type === 'empty':
    default:
      return null;
  }
};

// 🚨🚨🚨 Complex utils functions from grid_core used here for merging filters
// TODO filterSync: move these utils to the new grid_core
const mergeFilterPanelWithHeaderFilterValues = (filterPanelValue, headerFilterInfoArray) => headerFilterInfoArray.reduce((result, info) => {
  const value = getConditionFromHeaderFilter(info);
  return value ? syncFilters(result, value) : removeFieldConditionsFromFilter(result, info.columnId);
}, filterPanelValue);

// import type { ReadonlySignal } from '@ts/core/state_manager/index';
// import { computed } from '@ts/core/state_manager/index';
const FILTER_DEEP_COMPARISON_OPTS = {
  maxDepth: 6,
  strict: true
};
class FilterSyncController {
  static dependencies = [ColumnsController, FilterController, HeaderFilterController, SearchController];
  // 🚨🚨🚨 This controller was hotfixed during severe issues in filterSync feature.
  // Change logic in ctor very carefully, the order of conditions is important.
  // Here we sync two states "filterValue" and "column[].filterValues"
  // TODO filterSync: refactor filters and get rid of this hotfix states sync logic
  constructor(columnsController, filterController, headerFilterController, searchController) {
    this.columnsController = columnsController;
    this.filterController = filterController;
    this.headerFilterController = headerFilterController;
    this.searchController = searchController;
    this.previousFilterPanelValue = null;
    this.previousFilterPanelEnabled = this.filterController.filterPanelFilterEnabled.peek();
    this.previousHeaderFilterInfoArray = [];
    // --- FilterPanel -> HeaderFilter ---
    effect(() => {
      const filterPanelValue = this.filterController.filterValueOption.value;
      const isFilterPanelEnabled = this.filterController.filterPanelFilterEnabled.value;
      if (equalByValue(this.previousFilterPanelValue, filterPanelValue, FILTER_DEEP_COMPARISON_OPTS) && this.previousFilterPanelEnabled === isFilterPanelEnabled) {
        return;
      }
      this.previousFilterPanelValue = filterPanelValue;
      this.previousFilterPanelEnabled = isFilterPanelEnabled;

      // NOTE: If filterSync is disabled -> do nothing
      const isSyncEnabled = this.filterController.filterSyncEnabled.peek();
      if (!isSyncEnabled) {
        return;
      }

      // NOTE: If FilterPanel value is empty or disabled -> clear HeaderFilter values
      if (!isFilterPanelEnabled || filterPanelValue === null) {
        this.headerFilterController.clearHeaderFilters();
        this.previousHeaderFilterInfoArray = this.headerFilterController.headerFilterInfoArray.peek();
        return;
      }

      // NOTE: If all conditions above passed sync FilterPanel -> HeaderFilter values
      this.handleFilterPanelSync(filterPanelValue);
      this.previousHeaderFilterInfoArray = this.headerFilterController.headerFilterInfoArray.peek();
    });

    // --- HeaderFilter -> FilterPanel ---
    effect(() => {
      const headerFilterInfoArray = this.headerFilterController.headerFilterInfoArray.value;
      if (equalByValue(this.previousHeaderFilterInfoArray, headerFilterInfoArray, FILTER_DEEP_COMPARISON_OPTS)) {
        return;
      }
      this.previousHeaderFilterInfoArray = headerFilterInfoArray;

      // NOTE: If filterSync is disabled -> do nothing
      const isSyncEnabled = this.filterController.filterSyncEnabled.peek();
      if (!isSyncEnabled) {
        return;
      }

      // NOTE: If merged from HeaderFilter values equals current FilterPanel values
      // do nothing
      const filterPanelValue = this.filterController.filterPanelValue.peek() ?? [];
      const newFilterPanelValue = mergeFilterPanelWithHeaderFilterValues(filterPanelValue, headerFilterInfoArray);
      if (equalByValue(filterPanelValue, newFilterPanelValue, FILTER_DEEP_COMPARISON_OPTS)) {
        return;
      }

      // NOTE: If all conditions above passed sync HeaderFilter -> FilterPanel values
      this.handleHeaderFilterSync(newFilterPanelValue);
      this.previousFilterPanelValue = newFilterPanelValue;
    });
  }
  clearFilters() {
    batch(() => {
      this.searchController.searchTextOption.value = '';
      this.filterController.filterValueOption.value = null;
      this.headerFilterController.clearHeaderFilters();
    });
  }
  handleFilterPanelSync(filterPanelValue) {
    const sourceColumns = this.columnsController.columns.peek();
    this.columnsController.updateColumns(columns => columns.map(column => {
      const sourceColumn = getColumnByIndexOrName(sourceColumns, column.name);
      if (!isColumnFilterable(sourceColumn)) {
        return column;
      }
      const columnId = getColumnIdentifier(column);
      const filterConditions = getMatchedConditions(filterPanelValue, columnId);
      const filterType = getFilterType(filterConditions);
      const filterValues = filterType ? getFilterValues(filterConditions) : undefined;
      return {
        ...column,
        filterType,
        filterValues
      };
    }));
  }
  handleHeaderFilterSync(newFilterPanelValue) {
    const normalizedValue = !newFilterPanelValue?.length ? null : newFilterPanelValue;

    // NOTE: If we update filters from HeaderFilter side
    // For better UX the filter panel will be enabled
    batch(() => {
      this.filterController.filterValueOption.value = normalizedValue;
      this.filterController.filterPanelFilterEnabled.value = true;
    });
  }
}

class CompatibilityFilterSyncController {
  static dependencies = [FilterController, FilterSyncController];
  constructor(realFilterController, realFilterSyncController) {
    this.realFilterController = realFilterController;
    this.realFilterSyncController = realFilterSyncController;
  }
  getCustomFilterOperations() {
    return this.realFilterController.customOperations.peek();
  }
}

const defaultOptions$9 = {
  _filterSyncEnabled: false
};

class Pager extends InfernoWrapper {
  getComponentFabric() {
    return Pagination;
  }
}

function PagerView$1(props) {
  return props.visible ? normalizeProps(createComponentVNode(2, Pager, {
    ...props
  })) : createFragment();
}

// TODO: Need to fix case with runtime changes the allowedPageSizes property to 'auto'
function calculatePageSizes(allowedPageSizes, pageSizesConfig, pageSize) {
  if (Array.isArray(pageSizesConfig)) {
    return pageSizesConfig;
  }
  if (Array.isArray(allowedPageSizes) && allowedPageSizes.includes(pageSize)) {
    return allowedPageSizes;
  }
  if (pageSizesConfig && pageSize > 1) {
    return [Math.floor(pageSize / 2), pageSize, pageSize * 2];
  }
  return [];
}
function isVisible(visibleConfig, pageCount) {
  if (visibleConfig === 'auto') {
    return pageCount > 1;
  }
  return visibleConfig;
}

class PagerView extends View {
  static dependencies = [DataController, GridCoreOptionsController];
  constructor(dataController, options) {
    super();
    this.dataController = dataController;
    this.options = options;
    this.component = PagerView$1;
    this.pageSizesConfig = this.options.oneWay('pager.allowedPageSizes');
    this.allowedPageSizes = signal(undefined);
    this.visibleConfig = this.options.oneWay('pager.visible');
    this.visible = computed(() => isVisible(this.visibleConfig.value, this.dataController.pageCount.value));
    effect(() => {
      this.allowedPageSizes.value = calculatePageSizes(this.allowedPageSizes.peek(), this.pageSizesConfig.value, this.dataController.pageSize.value);
    });
  }
  getProps() {
    return computed(() => ({
      itemCount: this.dataController.totalCount.value,
      allowedPageSizes: this.allowedPageSizes.value,
      visible: this.visible.value,
      pageIndex: this.dataController.pageIndex.value + 1,
      pageIndexChanged: value => {
        this.dataController.pageIndex.value = value - 1;
      },
      pageSize: this.dataController.pageSize.value,
      pageSizeChanged: value => {
        this.dataController.pageSize.value = value;
      },
      pageCount: this.dataController.pageCount.value,
      showPageSizeSelector: this.options.oneWay('pager.showPageSizeSelector').value,
      _skipValidation: true,
      tabIndex: 0,
      showInfo: this.options.oneWay('pager.showInfo').value,
      showNavigationButtons: this.options.oneWay('pager.showNavigationButtons').value,
      label: this.options.oneWay('pager.label').value,
      pagesNavigatorVisible: this.options.oneWay('pager.visible').value,
      displayMode: this.options.oneWay('pager.displayMode').value,
      maxPagesCount: MAX_PAGES_COUNT
    }));
  }
}

let SelectionMode = /*#__PURE__*/function (SelectionMode) {
  SelectionMode["Multiple"] = "multiple";
  SelectionMode["Single"] = "single";
  SelectionMode["None"] = "none";
  return SelectionMode;
}({});
let ShowCheckBoxesMode = /*#__PURE__*/function (ShowCheckBoxesMode) {
  ShowCheckBoxesMode["Always"] = "always";
  ShowCheckBoxesMode["OnClick"] = "onClick";
  ShowCheckBoxesMode["OnLongTap"] = "onLongTap";
  ShowCheckBoxesMode["None"] = "none";
  return ShowCheckBoxesMode;
}({});

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

class SelectionController {
  static dependencies = [GridCoreOptionsController, DataController, ItemsController, ToolbarController, OptionsValidationController];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  constructor(options, dataController, itemsController, toolbarController, optionsValidationController) {
    this.options = options;
    this.dataController = dataController;
    this.itemsController = itemsController;
    this.toolbarController = toolbarController;
    this.optionsValidationController = optionsValidationController;
    this.selectedCardKeys = this.options.twoWay('selectedCardKeys');
    this.normalizedSelectedCardKeys = computed(() => {
      const selectedCardKeys = this.selectedCardKeys.value;
      const isSelectionEnabled = this.selectionOption.value.mode !== SelectionMode.None;
      if (isSelectionEnabled && Array.isArray(selectedCardKeys) && selectedCardKeys.length) {
        this.optionsValidationController.validateKeyExpr();
      }
      return this.selectedCardKeys.value;
    });
    this.selectionOption = this.options.oneWay('selection');
    this._isCheckBoxesRendered = signal(false);
    this.onSelectionChanging = this.options.action('onSelectionChanging');
    this.onSelectionChanged = this.options.action('onSelectionChanged');
    this.isCheckBoxesRendered = computed(() => {
      const selectionMode = this.options.oneWay('selection.mode').value;
      const showCheckBoxesMode = this.options.oneWay('selection.showCheckBoxesMode').value;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _isCheckBoxesRendered = this._isCheckBoxesRendered.value;
      if (selectionMode === SelectionMode.Multiple) {
        switch (showCheckBoxesMode) {
          case ShowCheckBoxesMode.Always:
          case ShowCheckBoxesMode.OnClick:
            return true;
          case ShowCheckBoxesMode.OnLongTap:
            return _isCheckBoxesRendered;
          default:
            return false;
        }
      }
      return false;
    });
    this._isCheckBoxesVisible = signal(false);
    this.isCheckBoxesVisible = computed(() => {
      const {
        mode,
        showCheckBoxesMode
      } = this.selectionOption.value;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _isCheckBoxesVisible = this._isCheckBoxesVisible.value;
      if (mode === SelectionMode.Multiple) {
        return showCheckBoxesMode !== ShowCheckBoxesMode.OnClick || _isCheckBoxesVisible;
      }
      return false;
    });
    this.needToHiddenCheckBoxes = computed(() => {
      const {
        mode,
        showCheckBoxesMode
      } = this.selectionOption.value;
      const isCheckBoxesVisible = this.isCheckBoxesVisible.value;
      if (mode === SelectionMode.Multiple && showCheckBoxesMode === ShowCheckBoxesMode.OnClick) {
        return !isCheckBoxesVisible;
      }
      return false;
    });
    this.allowSelectOnClick = computed(() => {
      const {
        mode,
        showCheckBoxesMode
      } = this.selectionOption.value;
      return mode !== SelectionMode.Multiple || showCheckBoxesMode !== ShowCheckBoxesMode.Always;
    });
    this.needToAddSelectionButtons = computed(() => {
      const selectionMode = this.options.oneWay('selection.mode').value;
      const allowSelectAll = this.options.oneWay('selection.allowSelectAll').value;
      return selectionMode === SelectionMode.Multiple && allowSelectAll;
    });
    this.selectionHelper = computed(() => {
      const dataSource = this.dataController.dataSource.value;
      const selectionOption = this.selectionOption.value;
      if (selectionOption.mode === SelectionMode.None) {
        return undefined;
      }
      const selectionConfig = this.getSelectionConfig(dataSource, selectionOption);
      return new Selection(selectionConfig);
    });
    effect(() => {
      const selectedCardKeys = this.normalizedSelectedCardKeys.value;
      const selectionOption = this.selectionOption.value;
      if (selectionOption.mode !== SelectionMode.None) {
        this.itemsController.setSelectionState(selectedCardKeys);
        if (selectedCardKeys.length > 1) {
          this._isCheckBoxesVisible.value = true;
        } else if (selectedCardKeys.length === 0) {
          this._isCheckBoxesVisible.value = false;
        }
      }
    });
    effect(() => {
      /*
      TODO: subscription to selectionHelper to update keys if it is reinitialized.
      Need to get rid of `selectionHelper.peek()` inside of selectCards()
      and pass selectionHelper from here
      */
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.selectionHelper.value;
      const isLoaded = this.dataController.isLoaded.value;
      if (isLoaded) {
        const selectedCardKeys = this.selectedCardKeys.peek();
        this.selectCards(selectedCardKeys);
      }
    });
    effect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.dataController.items.value;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.dataController.isLoaded.value;
      this.updateSelectionToolbarButtons(this.normalizedSelectedCardKeys.value);
    });
  }
  getSelectionConfig(dataSource, selectionOption) {
    const selectedCardKeys = this.selectedCardKeys.peek();
    const {
      dataController
    } = this;
    return {
      selectedKeys: selectedCardKeys,
      mode: selectionOption.mode,
      maxFilterLengthInRequest: selectionOption.maxFilterLengthInRequest,
      ignoreDisabledItems: true,
      key() {
        return dataSource.key();
      },
      keyOf(item) {
        return dataSource.store().keyOf(item);
      },
      dataFields() {
        return dataSource.select();
      },
      load(options) {
        return dataSource.store().load(options);
      },
      plainItems() {
        return dataSource.items();
      },
      filter() {
        return dataController.getCombinedFilter();
      },
      totalCount: () => dataSource.totalCount(),
      onSelectionChanging: this.selectionChanging.bind(this),
      onSelectionChanged: this.selectionChanged.bind(this)
    };
  }
  getSelectionEventArgs(e) {
    return {
      currentSelectedCardKeys: [...e.addedItemKeys],
      currentDeselectedCardKeys: [...e.removedItemKeys],
      selectedCardKeys: [...e.selectedItemKeys],
      selectedCardsData: [...e.selectedItems],
      isSelectAll: false,
      isDeselectAll: false
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectionChanging(e) {
    if (e.addedItemKeys.length || e.removedItemKeys.length) {
      const onSelectionChanging = this.onSelectionChanging.peek();
      const eventArgs = {
        ...this.getSelectionEventArgs(e),
        cancel: false
      };

      // @ts-expect-error
      onSelectionChanging?.(eventArgs);
      e.cancel = eventArgs.cancel;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectionChanged(e) {
    if (e.addedItemKeys.length || e.removedItemKeys.length) {
      this.optionsValidationController.validateKeyExpr();
      const onSelectionChanged = this.onSelectionChanged.peek();
      const eventArgs = this.getSelectionEventArgs(e);
      this.selectedCardKeys.value = [...e.selectedItemKeys];

      // @ts-expect-error
      onSelectionChanged?.(eventArgs);
    }
  }
  isOnePageSelectAll() {
    const selectionOption = this.selectionOption.peek();
    return selectionOption?.selectAllMode === 'page';
  }
  isSelectAll() {
    const selectionHelper = this.selectionHelper.peek();
    return selectionHelper?.getSelectAllState(this.isOnePageSelectAll());
  }
  updateSelectionToolbarButtons(selectedCardKeys) {
    const isSelectAll = this.isSelectAll();
    const isOnePageSelectAll = this.isOnePageSelectAll();
    this.toolbarController.addDefaultItem(signal({
      name: 'selectAllButton',
      widget: 'dxButton',
      options: {
        icon: 'selectall',
        onClick: () => {
          this.selectAll();
        },
        disabled: !!isSelectAll,
        text: messageLocalization.format('dxCardView-selectAll')
      },
      location: 'before',
      locateInMenu: 'auto'
    }), this.needToAddSelectionButtons);
    this.toolbarController.addDefaultItem(signal({
      name: 'clearSelectionButton',
      widget: 'dxButton',
      options: {
        icon: 'close',
        onClick: () => {
          this.deselectAll();
        },
        disabled: isOnePageSelectAll ? isSelectAll === false : selectedCardKeys.length === 0,
        text: messageLocalization.format('dxCardView-clearSelection')
      },
      location: 'before',
      locateInMenu: 'auto'
    }), this.needToAddSelectionButtons);
  }
  getItemKeysByIndexes(indexes) {
    const items = this.itemsController.items.peek();
    return indexes.map(index => items[index]?.key).filter(key => key !== undefined);
  }
  changeCardSelection(cardIndex, options) {
    const selectionHelper = this.selectionHelper?.peek();
    const isCheckBoxesVisible = this.isCheckBoxesVisible.peek();
    const keys = options ?? {};
    if (isCheckBoxesVisible) {
      keys.control = isCheckBoxesVisible;
    }
    selectionHelper?.changeItemSelection(cardIndex, keys, false);
  }
  selectCards(keys, preserve = false) {
    const selectionHelper = this.selectionHelper?.peek();
    return selectionHelper?.selectedItemKeys(keys, preserve);
  }
  selectCardsByIndexes(indexes) {
    const keys = this.getItemKeysByIndexes(indexes);
    return this.selectCards(keys);
  }
  deselectCards(keys) {
    const selectionHelper = this.selectionHelper?.peek();
    return selectionHelper?.selectedItemKeys(keys, true, true);
  }
  deselectCardsByIndexes(indexes) {
    const keys = this.getItemKeysByIndexes(indexes);
    return this.deselectCards(keys);
  }
  isCardSelected(key) {
    const selectedCardKeys = this.normalizedSelectedCardKeys.peek();
    return selectedCardKeys.includes(key);
  }
  selectAll() {
    const {
      mode
    } = this.selectionOption.peek();
    if (mode !== SelectionMode.Multiple) {
      return undefined;
    }
    const selectionHelper = this.selectionHelper.peek();
    return selectionHelper?.selectAll(this.isOnePageSelectAll());
  }
  deselectAll() {
    const selectionHelper = this.selectionHelper.peek();
    return selectionHelper?.deselectAll(this.isOnePageSelectAll());
  }
  clearSelection() {
    const selectionHelper = this.selectionHelper.peek();
    return selectionHelper?.clearSelection();
  }
  getSelectedCardsData() {
    // @ts-expect-error undefined is not assignable to DataObject[]
    return this.selectionHelper?.peek()?.getSelectedItems();
  }
  getSelectedCardKeys() {
    return this.normalizedSelectedCardKeys.peek();
  }
  toggleSelectionCheckBoxes() {
    const isCheckBoxesRendered = this._isCheckBoxesRendered.peek();
    this._isCheckBoxesRendered.value = !isCheckBoxesRendered;
  }
  updateSelectionCheckBoxesVisible(value) {
    this._isCheckBoxesVisible.value = value;
  }
  processLongTap(card) {
    const {
      mode,
      showCheckBoxesMode
    } = this.selectionOption.peek();
    if (mode !== SelectionMode.None) {
      if (showCheckBoxesMode === ShowCheckBoxesMode.OnLongTap) {
        this.toggleSelectionCheckBoxes();
      } else {
        if (showCheckBoxesMode === ShowCheckBoxesMode.OnClick) {
          this._isCheckBoxesVisible.value = true;
        }
        if (showCheckBoxesMode !== ShowCheckBoxesMode.Always) {
          this.changeCardSelection(card.index, {
            control: true
          });
        }
      }
    }
  }
}

const defaultOptions$8 = {
  selectedCardKeys: [],
  selection: {
    mode: 'none',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
    selectAllMode: 'allPages'
  }
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

function PublicMethods$3(GridCore) {
  return class GridCoreWithSelectionController extends GridCore {
    isCardSelected(key) {
      return this.selectionController.isCardSelected(key);
    }
    getSelectedCardKeys() {
      return this.selectionController.getSelectedCardKeys();
    }
    getSelectedCardsData() {
      return this.selectionController.getSelectedCardsData();
    }
    selectCards(keys, preserve = false) {
      return this.selectionController.selectCards(keys, preserve);
    }
    deselectCards(keys) {
      return this.selectionController.deselectCards(keys);
    }
    selectCardsByIndexes(indexes) {
      return this.selectionController.selectCardsByIndexes(indexes);
    }
    deselectCardsByIndexes(indexes) {
      return this.selectionController.deselectCardsByIndexes(indexes);
    }
    selectAll() {
      return this.selectionController.selectAll();
    }
    deselectAll() {
      return this.selectionController.deselectAll();
    }
    clearSelection() {
      this.selectionController.clearSelection();
    }
  };
}

class BaseContextMenuController {
  contextMenuRef = createRef();
  onPositioning = e => {
    // @ts-expect-error
    e.position.of = this.lastEvent;
  };
  show(event, view, contextInfo, onMenuCloseCallback) {
    const contextMenu = this.contextMenuRef.current;
    const targetElement = event.target;
    if (event === this.lastEvent || !contextMenu || !targetElement) {
      return;
    }
    this.lastEvent = event;
    const items = this.getItems(view, targetElement, contextInfo);
    if (!items) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    contextMenu.option('items', items);
    contextMenu.option('onHiding', () => {
      onMenuCloseCallback?.();
    });
    contextMenu.show().catch(console.error);
  }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const excludedStateOptions = ['onInput', 'inputAttr', 'elementAttr'];
class Toolbar extends InfernoWrapper {
  getComponentFabric() {
    return Toolbar$1;
  }
  updateComponentOptions(prevProps, props) {
    if (Array.isArray(props.items) && Array.isArray(prevProps.items) && props.items.length === prevProps.items.length) {
      props.items?.forEach((item, index) => {
        if (props.items[index] !== prevProps.items[index]) {
          const prevItem = prevProps.items[index];
          Object.keys(item).forEach(key => {
            if (item[key] !== prevItem[key]) {
              if (key !== 'options') {
                this.component?.option(`items[${index}].${key}`, props.items[index][key]);
              } else {
                const prevOptions = prevItem[key];
                const currentOptions = item[key];
                Object.keys(currentOptions).forEach(option => {
                  const isOptionChanged = !prevOptions?.[option] || currentOptions?.[option] !== prevOptions[option];
                  const isExcludedOption = excludedStateOptions.includes(option);
                  if (isOptionChanged && !isExcludedOption) {
                    this.component?.option(`items[${index}].${key}.${option}`, props.items[index][key][option]);
                  }
                });
              }
            }
          });
        }
      });
      const {
        items,
        ...propsToUpdate
      } = props;
      super.updateComponentOptions(prevProps, propsToUpdate);
    } else {
      super.updateComponentOptions(prevProps, props);
    }
  }
}

const ToolbarComponent = withKeyDownHandler(Toolbar);
let ToolbarView$1 = class ToolbarView extends Component$1 {
  containerRef = createRef();
  componentDidMount() {
    on(this.containerRef.current, 'dxcontextmenu', this.onContextMenu);
  }
  componentWillUnmount() {
    off(this.containerRef.current, 'dxcontextmenu', this.onContextMenu);
  }
  render() {
    const {
      visible,
      items,
      disabled,
      multiline
    } = this.props;
    if (!visible) {
      return createFragment();
    }
    return createComponentVNode(2, ToolbarComponent, {
      "elementRef": this.containerRef,
      "visible": visible,
      "items": items,
      "disabled": disabled,
      "multiline": multiline,
      "keyDownConfig": {
        'F10+shift': event => {
          this.props.showContextMenu?.(event);
        }
      }
    });
  }
  onContextMenu = event => {
    this.props.showContextMenu?.(event);
  };
};

class ToolbarView extends View {
  static dependencies = [ToolbarController, BaseContextMenuController, GridCoreOptionsController];
  constructor(controller, contextMenuController, options) {
    super();
    this.controller = controller;
    this.contextMenuController = contextMenuController;
    this.options = options;
    this.component = ToolbarView$1;
    this.visibleConfig = this.options.oneWay('toolbar.visible');
    this.visible = computed(() => isVisible$1(this.visibleConfig.value, this.controller.items.value));
  }
  getProps() {
    return computed(() => ({
      visible: this.visible.value,
      items: this.controller.items.value,
      disabled: this.options.oneWay('toolbar.disabled').value,
      multiline: this.options.oneWay('toolbar.multiline').value,
      showContextMenu: this.showContextMenu.bind(this)
    }));
  }
  showContextMenu(event) {
    this.contextMenuController.show(event, 'toolbar');
  }
}

/* eslint-disable spellcheck/spell-checker */

function register$1(diContext) {
  diContext.register(DataController);
  diContext.register(CompatibilityDataController);
  diContext.register(ItemsController);
  diContext.register(ColumnsController);
  diContext.register(SelectionController);
  diContext.register(CompatibilityColumnsController);
  diContext.register(SortingController);
  diContext.register(ToolbarController);
  diContext.register(ToolbarView);
  diContext.register(PagerView);
  diContext.register(SearchController);
  diContext.register(SearchView);
  diContext.register(ColumnChooserController);
  diContext.register(ColumnChooserView);
  diContext.register(FilterController);
  diContext.register(FilterPanelView);
  diContext.register(HeaderFilterController);
  diContext.register(HeaderFilterPopupView);
  diContext.register(FilterSyncController);
  diContext.register(CompatibilityFilterSyncController);
  diContext.register(CompatibilityHeaderFilterController);
  diContext.register(ErrorController);
  diContext.register(EditingController);
  diContext.register(ConfirmController);
  diContext.register(EditPopupView);
  diContext.register(SearchUIController);
  diContext.register(SearchView);
  diContext.register(HeaderFilterViewController);
  diContext.register(KeyboardNavigationController);
  diContext.register(AccessibilityController);
  diContext.register(OptionsValidationController);
  diContext.register(LifeCycleController);
}

const defaultOptions$7 = {
  editing: {
    changes: [],
    allowAdding: false,
    allowDeleting: false,
    allowUpdating: false,
    confirmDelete: true,
    form: {},
    popup: {},
    texts: {
      confirmDeleteMessage: undefined,
      confirmDeleteTitle: '',
      deleteCard: undefined,
      editCard: undefined,
      saveCard: undefined,
      addCard: undefined,
      cancel: undefined
    }
  }
};

/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
function PublicMethods$2(GridCore) {
  return class GridCoreWithEditing extends GridCore {
    addCard() {
      const controller = this.diContext.get(EditingController);
      return controller.addCard();
    }
    cancelEditData() {
      const controller = this.diContext.get(EditingController);
      controller.clear();
    }
    deleteCard(cardIndex) {
      const controller = this.diContext.get(EditingController);
      const itemsController = this.diContext.get(ItemsController);
      const cardKey = itemsController.items.peek()[cardIndex]?.key;
      if (isDefined(cardKey)) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        controller.deleteCard(cardKey);
      }
    }
    editCard(cardIndex) {
      const controller = this.diContext.get(EditingController);
      const itemsController = this.diContext.get(ItemsController);
      const cardKey = itemsController.items.peek()[cardIndex]?.key;
      if (isDefined(cardKey)) {
        controller.editCard(cardKey);
      }
    }
    hasEditData() {
      const controller = this.diContext.get(EditingController);
      return controller.changes.peek().length > 0;
    }
    saveEditData() {
      const controller = this.diContext.get(EditingController);
      return controller.save();
    }
  };
}

const defaultOptions$6 = {
  errorRowEnabled: true,
  noDataText: undefined
};

/* eslint-disable
  @typescript-eslint/explicit-function-return-type,
  @typescript-eslint/explicit-module-boundary-types
*/
let ContentView$3 = class ContentView extends View {
  static dependencies = [DataController, GridCoreOptionsController, ErrorController, ColumnsController, SelectionController, ItemsController, EditingController, BaseContextMenuController, SearchUIController, KeyboardNavigationController, LifeCycleController];
  constructor(dataController, options, errorController, columnsController, selectionController, itemsController, editingController, contextMenuController, searchUIController, keyboardNavigationController, lifecycle) {
    super();
    this.dataController = dataController;
    this.options = options;
    this.errorController = errorController;
    this.columnsController = columnsController;
    this.selectionController = selectionController;
    this.itemsController = itemsController;
    this.editingController = editingController;
    this.contextMenuController = contextMenuController;
    this.searchUIController = searchUIController;
    this.keyboardNavigationController = keyboardNavigationController;
    this.lifecycle = lifecycle;
    this.isNoData = computed(() => {
      const {
        isLoading,
        items
      } = this.dataController;
      const isEmptyDataLoaded = !isLoading.value && items.value.length === 0;
      const isNoVisibleColumns = this.columnsController.visibleColumns.value.length === 0;
      return isEmptyDataLoaded || isNoVisibleColumns;
    });
    this.scrollableRef = createRef();
    this.loadingText = this.options.twoWay('loadPanel.message');
    this.viewportHeight = signal(0);
    this.scrollTop = signal(0);
    this.width = signal(0);
  }
  getBaseProps() {
    const loadPanelConfig = this.options.oneWay('loadPanel');
    const noDataTextConfig = this.options.oneWay('noDataText');
    const noDataTemplateConfig = this.options.template('noDataTemplate');
    const errorRowEnabledConfig = this.options.oneWay('errorRowEnabled');
    const scrollByContent = this.options.oneWay('scrolling.scrollByContent');
    const scrollByThumb = this.options.oneWay('scrolling.scrollByThumb');
    const showScrollbar = this.options.oneWay('scrolling.showScrollbar');
    const useNativeConfig = this.options.oneWay('scrolling.useNative');
    return {
      loadPanelProps: {
        ...loadPanelConfig.value,
        visible: this.dataController.isLoading.value
      },
      noDataTextProps: {
        text: noDataTextConfig.value ?? messageLocalization.format('dxDataGrid-noDataText'),
        template: noDataTemplateConfig.value,
        visible: this.isNoData.value
      },
      errorRowProps: {
        enabled: errorRowEnabledConfig.value,
        errors: this.errorController.errors.value
      },
      onWidthChange: width => {
        this.width.value = width;
      },
      onViewportHeightChange: height => {
        this.viewportHeight.value = height;
      },
      scrollableRef: this.scrollableRef,
      scrollableProps: {
        onScroll: this.onScroll.bind(this),
        direction: 'both',
        scrollTop: this.scrollTop.value,
        scrollByContent: scrollByContent.value,
        scrollByThumb: scrollByThumb.value,
        showScrollbar: showScrollbar.value,
        useNative: useNativeConfig.value === 'auto' ? undefined : useNativeConfig.value,
        // TODO (Scrollable:useKeyboard) -> remove this WA
        //  after ScrollView private option "useKeyboard" will be extended to useNative: true
        // NOTE: Scrollable container focusable by default
        // To prevent scroll container focus in native mode we set tabindex -1 to container
        // In simulated mode focusable behavior prevented by useKeyboard: false private option
        useKeyboard: false,
        // Bad scrollable types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onInitialized: ({
          component
        }) => {
          const useKeyboardDisabled = component.option('useKeyboard') === false;
          const useNativeEnabled = component.option('useNative') === true;
          if (useKeyboardDisabled && useNativeEnabled) {
            renderer(component.container()).attr('tabindex', -1);
          }
        },
        // Bad scrollable types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onOptionChanged: ({
          fullName,
          value,
          component
        }) => {
          const useKeyboardDisabled = component.option('useKeyboard') === false;
          if (useKeyboardDisabled && fullName === 'useNative' && value === true) {
            renderer(component.container()).attr('tabindex', -1);
          }
        }
      },
      showContextMenu: this.showContextMenu.bind(this),
      onRendered: () => {
        this.lifecycle.contentRendered.trigger();
      }
    };
  }
  showContextMenu(e) {
    this.contextMenuController.show(e, 'content');
  }
  onScroll(e) {
    this.scrollTop.value = e.scrollOffset.top;
  }
};

const defaultOptions$5 = {
  pager: {
    visible: 'auto',
    showPageSizeSelector: false,
    allowedPageSizes: 'auto',
    label: undefined
  }
};

const defaultOptions$4 = {
  toolbar: {
    multiline: false,
    disabled: false
  }
};

/**
 * @interface
 */

const defaultOptions$3 = {
  ...defaultOptions$f,
  ...defaultOptions$g,
  ...defaultOptions$i,
  ...defaultOptions$5,
  ...defaultOptions$b,
  ...defaultOptions$a,
  ...defaultOptions$c,
  ...defaultOptions$9,
  ...defaultOptions$6,
  ...defaultOptions$h,
  ...defaultOptions$e,
  ...defaultOptions$8,
  ...defaultOptions$4,
  ...defaultOptions$7,
  ...defaultOptions$d
};

// TODO: separate by modules
// TODO: add typing for defaultOptionRules
const defaultOptionsRules = [{
  device() {
    // @ts-expect-error
    return isMaterialBased();
  },
  options: {
    headerFilter: {
      height: 315
    },
    editing: {
      useIcons: true
    },
    selection: {
      showCheckBoxesMode: 'always'
    }
  }
}, {
  device() {
    return browser.webkit;
  },
  options: {
    loadingTimeout: 30,
    // T344031
    loadPanel: {
      animation: {
        show: {
          easing: 'cubic-bezier(1, 0, 1, 0)',
          duration: 500,
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        }
      }
    }
  }
}];

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
// eslint-disable-next-line max-classes-per-file
class GridCoreNewBase extends Widget {
  // TODO: rewrite to lifeCycleController

  _registerDIContext() {
    this.diContext = new DIContext();
    register$1(this.diContext);
  }
  _initWidgetMock() {
    this.diContext.registerInstance(WidgetMock, new WidgetMock(this, this.diContext.get(CompatibilityDataController), this.diContext.get(CompatibilityColumnsController), this.diContext.get(CompatibilityHeaderFilterController), this.diContext.get(CompatibilityFilterSyncController)));
  }
  _initDIContext() {
    this.dataController = this.diContext.get(DataController);
    this.columnsController = this.diContext.get(ColumnsController);
    this.sortingController = this.diContext.get(SortingController);
    this.selectionController = this.diContext.get(SelectionController);
    this.itemsController = this.diContext.get(ItemsController);
    this.toolbarController = this.diContext.get(ToolbarController);
    this.toolbarView = this.diContext.get(ToolbarView);
    this.editingController = this.diContext.get(EditingController);
    this.editPopupView = this.diContext.get(EditPopupView);
    this.pagerView = this.diContext.get(PagerView);
    this.searchController = this.diContext.get(SearchController);
    this.columnChooserController = this.diContext.get(ColumnChooserController);
    this.columnChooserView = this.diContext.get(ColumnChooserView);
    this.errorController = this.diContext.get(ErrorController);
    this.filterController = this.diContext.get(FilterController);
    this.headerFilterController = this.diContext.get(HeaderFilterController);
    this.filterPanelView = this.diContext.get(FilterPanelView);
    this.headerFilterViewController = this.diContext.get(HeaderFilterViewController);
    this.accessibilityController = this.diContext.get(AccessibilityController);
    this.filterSyncController = this.diContext.get(FilterSyncController);
    this.searchView = this.diContext.get(SearchView);
  }
  _initLifeCycleController() {
    this.lifeCycleController = this.diContext.get(LifeCycleController);
    this.lifeCycleController.provideContentReadyCallback(() => {
      // @ts-expect-error
      this._fireContentReadyAction();
    });
  }
  _init() {
    // @ts-expect-error
    super._init();
    this.initialized = signal(false);
    this._registerDIContext();
    this._initWidgetMock();
    this._initDIContext();
    this._initLifeCycleController();
  }
  _getDefaultOptions() {
    return {
      // @ts-expect-error
      ...super._getDefaultOptions(),
      ...extend(true, {}, defaultOptions$3)
    };
  }
  _defaultOptionsRules() {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._defaultOptionsRules().concat(defaultOptionsRules);
  }
  _initializeComponent() {
    // @ts-expect-error usage of base method not described in d.ts
    super._initializeComponent();
    this.initialized.value = true;
  }

  // NOTE: this disables calling of _fireContentReadyAction on initial render
  _renderContent() {
    // @ts-expect-error
    this._renderContentImpl();
  }
  _initMarkup() {
    // @ts-expect-error
    super._initMarkup();
    this.renderSubscription = this.diContext.get(MainView$1).render(this.$element().get(0));
    // NOTE: We flush all Inferno async render operations after initial render
    // Because after component creation markup should be ready
    rerender();
  }
  _optionChanged(args) {
    [this.filterPanelView].forEach(c => {
      if (c.isCompatibilityMode()) {
        c.optionChanged(args);
      }
    });
    if (!args.handled) {
      // @ts-expect-error
      super._optionChanged(args);
    }
  }
  _clean() {
    this.renderSubscription?.();
    infernoRenderer.renderIntoContainer(null, this.$element().get(0), true);
    // @ts-expect-error
    super._clean();
  }
}
class GridCoreNew extends PublicMethods$9(PublicMethods$6(PublicMethods$7(PublicMethods$4(PublicMethods$5(PublicMethods$3(PublicMethods$8(PublicMethods$2(GridCoreNewBase)))))))) {}

const defaultOptions$2 = {
  wordWrapEnabled: false,
  cardsPerRow: 3,
  cardMinWidth: 250,
  cardCover: {
    aspectRatio: '1 / 1'
  },
  fieldHintEnabled: false,
  ...defaultOptions$6
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

function PublicMethods$1(GridCore) {
  return class GridCoreWithContentView extends GridCore {
    getScrollable() {
      return this.diContext.get(ContentView$3).scrollableRef.current;
    }
    beginCustomLoading(text) {
      const contentView = this.diContext.get(ContentView$3);
      const dataController = this.diContext.get(DataController);
      if (text) {
        contentView.loadingText.value = text;
      }
      dataController.isLoading.value = true;
    }
    endCustomLoading() {
      const dataController = this.diContext.get(DataController);
      dataController.isLoading.value = false;
    }
  };
}

eventsEngine.triggerHandler;

const getCardRoleDescription = isEditable => isEditable ? messageLocalization.format('dxCardView-ariaEditableCard') : messageLocalization.format('dxCardView-ariaCard');

// @ts-expect-error ts-error
const getPositionDescription = position => position ? messageLocalization.format('dxCardView-ariaCardPosition', position.rowIndex + 1, position.columnIndex + 1) : '';
const getCardStateDescription = (position, isSelectable, isSelected) => {
  const parts = [getPositionDescription(position)];
  if (isSelectable) {
    parts.push(isSelected ? messageLocalization.format('dxCardView-ariaSelectedCardState') : messageLocalization.format('dxCardView-ariaNotSelectedCardState'));
  }
  return parts.join(', ');
};
const getCardDescriptiveLabel = (hasCover, coverId, contentId) => {
  const ids = [];
  if (hasCover) {
    ids.push(coverId);
  }
  ids.push(contentId);
  return ids.join(' ');
};
const getPosition = (idx, columnCount) => ({
  rowIndex: Math.floor(idx / columnCount),
  columnIndex: idx % columnCount
});

const CLASSES$9 = {
  cover: 'dx-card-cover',
  image: 'dx-card-cover-image',
  noImage: 'dx-card-cover-noimage'
};
class Cover extends Component$1 {
  render() {
    const {
      id,
      imageSrc,
      alt,
      template: Template,
      card
    } = this.props;
    const src = imageSrc;
    const containerClasses = combineClasses({
      [CLASSES$9.cover]: true,
      [CLASSES$9.noImage]: !src && !Template
    });
    return createVNode(1, "div", containerClasses, Template ? createComponentVNode(2, Template, {
      "card": card
    }) : createFragment([src && createVNode(1, "img", CLASSES$9.image, null, 1, {
      "src": src,
      "alt": alt
    }), !src && createComponentVNode(2, Icon, {
      "name": 'imagethumbnail',
      "aria-label": messageLocalization.format('dxCardView-cardNoImageAriaLabel')
    })], 0), 0, {
      "id": id
    });
  }
}

class Caption extends Component$1 {
  ref = createRef();
  onClick = e => {
    const args = {
      event: e,
      fieldCaptionElement: getPublicElement(renderer(this.ref.current)),
      field: this.props.field
    };
    this.props.onClick?.(args);
  };
  onDblClick = e => {
    const args = {
      event: e,
      fieldCaptionElement: getPublicElement(renderer(this.ref.current)),
      field: this.props.field
    };
    this.props.onDblClick?.(args);
  };
  render() {
    const Template = this.props.template;
    return createVNode(1, "div", "dx-cardview-field-caption", Template ? createComponentVNode(2, Template, {
      "field": this.props.field
    }) : createFragment([this.props.field.column.caption, createTextVNode(":")], 0), 0, {
      "onClick": this.onClick,
      "onDblClick": this.onDblClick
    }, null, this.ref);
  }
  componentDidMount() {
    const args = {
      fieldCaptionElement: getPublicElement(renderer(this.ref.current)),
      field: this.props.field
    };
    this.props.onPrepared?.(args);
  }
}

const ROOT_CLASS = 'dx-cardview-field-value';
const CLASS$2 = {
  root: ROOT_CLASS,
  textPartHighlighted: `${ROOT_CLASS}__text-part--highlighted`
};
class ValueText extends Component$1 {
  ref = createRef();
  onClick = e => {
    const args = {
      event: e,
      fieldValueElement: getPublicElement(renderer(this.ref.current)),
      field: this.props.field
    };
    this.props.onClick?.(args);
  };
  onDblClick = e => {
    const args = {
      event: e,
      fieldValueElement: getPublicElement(renderer(this.ref.current)),
      field: this.props.field
    };
    this.props.onDblClick?.(args);
  };
  render() {
    const classNames = [CLASS$2.root, `${CLASS$2.root}--text-align-${this.props.field.column.alignment}`].join(' ');
    const content = this.props.field.highlightedText ? this.props.field.highlightedText.map(({
      type,
      text: textPart
    }) => createVNode(1, "span", type === 'highlighted' ? CLASS$2.textPartHighlighted : '', textPart, 0)) : this.props.field.text;
    const Template = this.props.template;
    return createVNode(1, "div", classNames, Template ? createComponentVNode(2, Template, {
      "field": this.props.field
    }) : content, 0, {
      "onClick": this.onClick,
      "onDblClick": this.onDblClick,
      "title": this.props.fieldHintEnabled ? this.props.field.text : undefined
    }, null, this.ref);
  }
  componentDidMount() {
    const args = {
      fieldValueElement: getPublicElement(renderer(this.ref.current)),
      field: this.props.field
    };
    this.props.onPrepared?.(args);
  }
}

const CLASSES$8 = {
  fieldTemplate: 'dx-cardview-field-template'};
class Field extends Component$1 {
  constructor(props) {
    super(props);
    this.containerRef = this.props.elementRef ?? createRef();
  }
  componentDidMount() {
    this.props.onPrepared?.(this.containerRef.current);
  }
  render() {
    const Template = this.props.template;
    if (Template) {
      return createVNode(1, "div", CLASSES$8.fieldTemplate, createComponentVNode(2, Template, {
        "field": this.props.field
      }), 2);
    }
    return createFragment([normalizeProps(createComponentVNode(2, Caption, {
      "field": this.props.field,
      "template": this.props.captionTemplate,
      ...this.props.captionProps
    })), normalizeProps(createComponentVNode(2, ValueText, {
      "fieldHintEnabled": this.props.fieldHintEnabled,
      "field": this.props.field,
      "template": this.props.valueTemplate,
      ...this.props.valueProps
    }))], 4);
  }
}

const CLASSES$7 = {
  cardHeader: 'dx-cardview-card-header',
  cardSelectCheckBox: 'dx-cardview-select-checkbox'
};
class CardHeader extends Component$1 {
  getCheckBoxItem() {
    const {
      isCheckBoxesRendered,
      selectCard,
      card
    } = this.props;
    if (card && isCheckBoxesRendered) {
      return {
        location: 'before',
        name: 'selectionCheckBox',
        widget: 'dxCheckBox',
        cssClass: CLASSES$7.cardSelectCheckBox,
        options: {
          elementAttr: {
            'aria-label': messageLocalization.format('dxCardView-ariaSelectCard')
          },
          value: card.isSelected,
          onValueChanged: e => {
            const event = e.event;
            selectCard?.(card, {
              control: isCommandKeyPressed(event),
              shift: event.shiftKey,
              needToUpdateCheckboxes: true
            });
            event.stopPropagation();
          }
        }
      };
    }
    return null;
  }
  getDefaultToolbarItems() {
    const {
      captionExpr,
      card,
      allowUpdating,
      allowDeleting,
      onEdit,
      onDelete
    } = this.props;
    const checkBoxItem = this.getCheckBoxItem();
    const captionItem = !!captionExpr && card?.[captionExpr] && {
      name: 'caption',
      location: 'before',
      text: card[captionExpr]
    };
    const updateButton = allowUpdating && {
      name: 'updateButton',
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'edit',
        onClick: onEdit,
        stylingMode: 'text'
      }
    };
    const deleteButton = allowDeleting && {
      name: 'deleteButton',
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'trash',
        onClick: onDelete,
        stylingMode: 'text'
      }
    };
    const items = [checkBoxItem, captionItem, updateButton, deleteButton].filter(item => !!item);

    // TODO: fix typings
    return items;
  }
  render() {
    const {
      visible: visibleProp,
      items: userToolbarItems,
      template: Template,
      card
    } = this.props;
    const toolbarItems = normalizeToolbarItems(this.getDefaultToolbarItems(), userToolbarItems, ['caption', 'selectionCheckBox', 'updateButton', 'deleteButton']);
    const visible = isDefined(visibleProp) ? visibleProp : !!toolbarItems.length;
    if (!visible) {
      return createFragment();
    }
    return createVNode(1, "div", CLASSES$7.cardHeader, Template ? createComponentVNode(2, Template, {
      "card": card
    }) : createComponentVNode(2, Toolbar, {
      "items": toolbarItems
    }), 0);
  }
}

const CLASSES$6 = {
  card: 'dx-cardview-card',
  cardHover: 'dx-cardview-card-hoverable',
  content: 'dx-cardview-card-content',
  footer: 'dx-cardview-card-footer',
  selectCard: 'dx-cardview-card-selection'
};
class Card extends Component$1 {
  containerRef = createRef();
  render() {
    if (this.props.elementRef) {
      this.containerRef = this.props.elementRef;
    }
    const {
      hoverStateEnabled,
      cover,
      card,
      footerTemplate: FooterTemplate,
      template: Template,
      contentTemplate: ContentTemplate
    } = this.props;
    const className = combineClasses({
      [CLASSES$6.card]: true,
      [CLASSES$6.cardHover]: !!hoverStateEnabled,
      [CLASSES$6.selectCard]: !!card.isSelected
    });
    const hasCover = !!cover?.imageExpr || !!cover?.template;
    const imageSrc = cover?.imageExpr?.(this.props.card.data);
    const alt = cover?.altExpr?.(this.props.card.data);
    const cardRole = Template ? 'presentation' : 'application';
    const coverId = new Guid();
    const contentId = new Guid();
    return createComponentVNode(2, KbnFocusTrap, {
      "elementRef": this.containerRef,
      "enabled": this.props.kbnEnabled,
      "tabIndex": this.props.tabIndex,
      "className": className,
      "onDblClick": this.onDblClick,
      "onMouseEnter": this.onHoverChanged,
      "onMouseLeave": this.onHoverChanged,
      "onContextMenu": this.props.onContextMenu,
      "onKeyDown": this.props.onKeyDown,
      "role": cardRole,
      "aria-roledescription": getCardRoleDescription(this.props.allowUpdating),
      "aria-label": getCardStateDescription(this.props.position, this.props.isCheckBoxesRendered, this.props.card.isSelected),
      "aria-describedby": getCardDescriptiveLabel(hasCover, coverId, contentId),
      children: Template ? createComponentVNode(2, Template, {
        "card": card
      }) : createFragment([createComponentVNode(2, CardHeader, {
        "template": this.props.header?.template,
        "visible": this.props.header?.visible,
        "card": card,
        "items": this.props.header?.items,
        "isCheckBoxesRendered": this.props.isCheckBoxesRendered,
        "selectCard": this.props.selectCard,
        "onEdit": () => {
          this.props.onEdit?.(this.props.card.key);
        },
        "onDelete": () => {
          this.props.onDelete?.(this.props.card.key);
        },
        "allowUpdating": this.props.allowUpdating,
        "allowDeleting": this.props.allowDeleting
      }), hasCover && createComponentVNode(2, Cover, {
        "id": coverId,
        "card": card,
        "template": this.props.cover?.template,
        "imageSrc": imageSrc,
        "alt": alt
      }), !!this.props.card.fields.length && createVNode(1, "div", CLASSES$6.content, ContentTemplate ? createComponentVNode(2, ContentTemplate, {
        "card": card
      }) : this.props.card.fields.map(field => createComponentVNode(2, Field, {
        "fieldHintEnabled": this.props.fieldHintEnabled,
        "field": field,
        "template": field.column.fieldTemplate,
        "captionTemplate": field.column.fieldCaptionTemplate,
        "valueTemplate": field.column.fieldValueTemplate,
        "captionProps": this.props.fieldProps?.captionProps,
        "valueProps": this.props.fieldProps?.valueProps
      })), 0, {
        "id": contentId
      }), FooterTemplate && createVNode(1, "div", CLASSES$6.footer, createComponentVNode(2, FooterTemplate, {
        "card": card
      }), 2)], 0)
    });
  }
  componentDidMount() {
    const onPreparedArgs = {
      cardElement: getPublicElement(renderer(this.containerRef.current)),
      card: this.props.card
    };
    this.props.onPrepared?.(onPreparedArgs);
    on(this.containerRef.current, 'dxclick', this.onClick);
    if (this.props.onHold) {
      on(this.containerRef.current, 'dxhold', this.onHold);
    }
  }
  componentWillUnmount() {
    off(this.containerRef.current, 'dxclick', this.onClick);
    if (this.props.onHold) {
      off(this.containerRef.current, 'dxhold', this.onHold);
    }
  }
  onHoverChanged = event => {
    const args = {
      eventType: event.type,
      card: this.props.card,
      cardElement: getPublicElement(renderer(this.containerRef.current)),
      event
    };
    this.props.onHoverChanged?.(args);
  };
  onClick = event => {
    const args = {
      card: this.props.card,
      cardElement: getPublicElement(renderer(this.containerRef.current)),
      event
    };
    this.props.onClick?.(args);
    if (this.props.allowSelectOnClick) {
      this.props.selectCard?.(this.props.card, {
        control: isCommandKeyPressed(event),
        shift: event.shiftKey
      });
    }
  };
  onDblClick = event => {
    const args = {
      card: this.props.card,
      cardElement: getPublicElement(renderer(this.containerRef.current)),
      event
    };
    this.props.onDblClick?.(args);
  };
  onHold = event => {
    const {
      onHold,
      card
    } = this.props;
    onHold?.({
      event,
      card
    });
    event.stopPropagation();
  };
}

/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

function PublicMethods(GridCore) {
  return class CardViewWithContentView extends PublicMethods$1(GridCore) {
    getCardElement(cardIndex) {
      const card = renderer(this.element()).find(`.${CLASSES$6.card}`).eq(cardIndex);
      return getPublicElement(card);
    }
    getVisibleCards() {
      const itemsController = this.diContext.get(ItemsController);
      return itemsController.items.peek();
    }
    getCardIndexByKey(key) {
      const itemsController = this.diContext.get(ItemsController);
      const cards = itemsController.items.peek();
      return cards.findIndex(card => card.key === key);
    }
    getKeyByCardIndex(cardIndex) {
      return this.getVisibleCards()[cardIndex]?.key;
    }
  };
}

class Toast extends InfernoWrapper {
  getComponentFabric() {
    return Toast$1;
  }
}

const CLASSES$5 = {
  errorRow: 'dx-gridcore-error-row'
};
class ErrorRow extends BaseInfernoComponent {
  ref = createRef();
  toastRef = createRef();
  render() {
    const lastError = this.props.errors.at(-1);
    return createVNode(1, "div", CLASSES$5.errorRow, this.props.enabled && lastError && createComponentVNode(2, Toast, {
      "componentRef": this.toastRef,
      "visible": true,
      "message": lastError.text,
      "type": 'error',
      "position": {
        my: 'bottom',
        at: 'bottom',
        // @ts-expect-error
        of: wrapRef(this.ref)
      }
    }, lastError.id), 0, null, null, this.ref);
  }
}

const CLASSES$4 = {
  container: 'dx-gridcore-nodata-container',
  element: 'dx-gridcore-nodata-element',
  iconContainer: 'dx-gridcore-nodata-icon-container',
  text: 'dx-gridcore-nodata-text'
};
class NoDataText extends Component$1 {
  render() {
    const Template = this.props.template;
    return createVNode(1, "div", CLASSES$4.container, Template ? createComponentVNode(2, Template, {
      "text": this.props.text
    }) : createVNode(1, "div", CLASSES$4.element, [createVNode(1, "div", CLASSES$4.iconContainer, createComponentVNode(2, Icon, {
      "name": 'cardcontent'
    }), 2), createVNode(1, "div", CLASSES$4.text, this.props.text, 0)], 4), 0);
  }
}

class Scrollable extends InfernoWrapper {
  contentRef = {};
  render() {
    return createFragment([super.render(), this.contentRef.current && createPortal(this.props.children, this.contentRef.current)], 0);
  }
  getComponentFabric() {
    return Scrollable$1;
  }
  updateScrollTop() {
    this.component?.scrollTo(this.props.scrollTop);
  }
  componentDidMount() {
    if (this.props.useNative === undefined) {
      // @ts-expect-error
      delete this.props.useNative;
    }
    super.componentDidMount();
    // @ts-expect-error
    this.contentRef.current = this.component.$content().get(0);
    this.setState({});
    this.updateScrollTop();
  }
  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    this.updateScrollTop();
  }
  clientHeight() {
    return this.component.clientHeight();
  }
}

const CommonPropsContext = createContext({
  rootElementRef: {
    current: null
  }
});

let LoadPanel$1 = class LoadPanel extends InfernoWrapper {
  getComponentFabric() {
    return LoadPanel$2;
  }
};

class LoadPanel extends BaseInfernoComponent {
  calculatePosition(rootElement) {
    const window = getWindow();
    if (rootElement.offsetHeight > window.innerHeight) {
      return {
        of: window,
        boundary: rootElement,
        collision: 'fit'
      };
    }
    return {
      of: rootElement
    };
  }
  render() {
    const {
      rootElementRef
    } = this.context[CommonPropsContext.id];
    const loadPanelProperties = {
      container: rootElementRef.current,
      position: this.calculatePosition(rootElementRef.current),
      ...this.props
    };
    return normalizeProps(createComponentVNode(2, LoadPanel$1, {
      ...loadPanelProperties
    }));
  }
}

const CLASSES$3 = {
  contentView: 'dx-gridcore-contentview'
};
let ContentView$2 = class ContentView extends Component$1 {
  scrollableRef = createRef();
  containerRef = createRef();
  resizeObserverTimeout = null;
  render() {
    return createVNode(1, "div", CLASSES$3.contentView, [normalizeProps(createComponentVNode(2, LoadPanel, {
      ...this.props.loadPanelProps
    })), this.props.noDataTextProps.visible ? normalizeProps(createComponentVNode(2, NoDataText, {
      ...this.props.noDataTextProps
    })) : normalizeProps(createComponentVNode(2, Scrollable, {
      "componentRef": this.props.scrollableRef,
      ...this.props.scrollableProps,
      children: this.props.children
    }, null, this.scrollableRef)), normalizeProps(createComponentVNode(2, ErrorRow, {
      ...this.props.errorRowProps
    }))], 0, {
      "oncontextmenu": this.props.showContextMenu
    }, null, this.containerRef);
  }
  updateSizesInfo() {
    if (this.scrollableRef.current) {
      const clientHeight = this.scrollableRef.current.clientHeight();
      this.props?.onViewportHeightChange?.(clientHeight);
    }
  }
  componentDidMount() {
    this.updateSizesInfo();
    resizeObserverSingleton.observe(this.containerRef.current, entry => {
      // NOTE: Hotfix for demos test resize windows issue
      this.resizeObserverTimeout = setTimeout(() => {
        this.resizeObserverTimeout = null;
        this.props.onWidthChange?.(entry.contentRect.width);
      }, 0);
    });
    this.props.onRendered?.();
  }
  componentDidUpdate() {
    this.updateSizesInfo();
    this.props.onRendered?.();
  }
  componentWillUnmount() {
    resizeObserverSingleton.unobserve(this.containerRef.current);
    if (this.resizeObserverTimeout !== null) {
      clearTimeout(this.resizeObserverTimeout);
    }
  }
};

const CLASSES$2 = {
  content: 'dx-cardview-content',
  grid: 'dx-cardview-content-grid',
  selectCheckBoxesHidden: 'dx-cardview-select-checkboxes-hidden',
  wrapEnabled: 'dx-cardview-word-wrap-enabled'
};
const CardWithKbn = withKeyDownHandler(withKbnNavigationItem(Card));
function getInfernoCardKey(card) {
  if (typeof card.key === 'string' || typeof card.key === 'number') {
    return card.key;
  }
  return undefined;
}
class Content extends Component$1 {
  containerRef = createRef();
  cardElementRefs = [];
  focusFirstCardAfterReload = false;
  getCssVariables() {
    const variables = {};
    if (this.props.cardsPerRow) {
      variables['--dx-cardview-cardsperrow'] = this.props.cardsPerRow;
    }
    if (this.props.cardProps?.minWidth) {
      variables['--dx-cardview-card-min-width'] = `${this.props.cardProps?.minWidth}px`;
    }
    if (this.props.cardProps?.maxWidth) {
      variables['--dx-cardview-card-max-width'] = `${this.props.cardProps?.maxWidth}px`;
    }

    // @ts-expect-error
    if (this.props.cardProps?.cover?.maxHeight) {
      // @ts-expect-error
      variables['--dx-cardview-card-cover-max-height'] = `${this.props.cardProps?.cover?.maxHeight}px`;
    }

    // @ts-expect-error
    if (this.props.cardProps?.cover?.ratio) {
      // @ts-expect-error
      variables['--dx-cardview-card-cover-ratio'] = `${this.props.cardProps?.cover?.ratio}`;
    }
    return variables;
  }
  render() {
    const className = combineClasses({
      [CLASSES$2.content]: true,
      [CLASSES$2.grid]: true,
      [CLASSES$2.selectCheckBoxesHidden]: !!this.props.needToHiddenCheckBoxes,
      [CLASSES$2.wrapEnabled]: !!this.props.wordWrapEnabled
    });
    const CardItem = this.props.kbnEnabled ? CardWithKbn : Card;
    this.cardElementRefs = new Array(this.props.items.length).fill(undefined).map(() => createRef());
    return createComponentVNode(2, KbnNavigationContainer, {
      "enabled": this.props.kbnEnabled,
      "navigationStrategy": this.props.navigationStrategy,
      "onFocusMoved": (newIdx, element) => {
        this.onCardFocusMoved(newIdx, element);
      },
      children: createVNode(1, "div", className, this.props.items.map((item, idx) => normalizeProps(createComponentVNode(2, CardItem, {
        ...this.props.cardProps,
        "elementRef": this.cardElementRefs[idx],
        "navigationIdx": idx,
        "kbnEnabled": this.props.kbnEnabled,
        "navigationStrategy": this.props.navigationStrategy,
        "keyDownConfig": {
          PageUp: () => {
            this.props.onPageChange?.(-1);
            this.focusFirstCardAfterReload = true;
          },
          PageDown: () => {
            this.props.onPageChange?.(1);
            this.focusFirstCardAfterReload = true;
          },
          Space: event => {
            this.props.cardProps?.selectCard?.(item, {
              control: isCommandKeyPressed(event),
              shift: event.shiftKey,
              needToUpdateCheckboxes: true
            });
          },
          'Space+shift': event => {
            this.props.cardProps?.selectCard?.(item, {
              control: isCommandKeyPressed(event),
              shift: event.shiftKey,
              needToUpdateCheckboxes: true
            });
          },
          'a+ctrl': () => {
            this.props.cardProps?.onSelectAllCards?.();
          },
          'f+ctrl': () => {
            this.props.cardProps?.onSearchFocus?.();
          },
          'Enter+shift': () => {
            this.props.cardProps?.onEdit?.(item.key, this.cardElementRefs[idx].current ?? undefined);
          },
          Delete: () => {
            this.props.cardProps?.onDelete?.(item.key, this.cardElementRefs[idx].current ?? undefined);
          }
        },
        "caughtEventPreventDefault": true,
        "card": item,
        "position": getPosition(idx, this.props.cardsPerRow ?? 1),
        "onContextMenu": e => {
          this.props.showCardContextMenu?.(e, item, idx);
        },
        "onFocusMoved": (newIdx, element) => {
          this.onCardFocusMoved(newIdx, element);
        }
      }, getInfernoCardKey(item)))), 0, {
        "style": this.getCssVariables()
      }, null, this.containerRef)
    });
  }
  updateSizesInfo() {
    const firstCardElement = this.cardElementRefs[0]?.current ?? undefined;
    this.props.onFirstElementChange?.(firstCardElement);
    if (!firstCardElement || !this.containerRef.current) {
      return;
    }
    const cardHeight = firstCardElement.offsetHeight;
    const rowGap = parseFloat(getComputedStyle(this.containerRef.current).rowGap);
    const rowHeight = cardHeight + rowGap;
    this.props.onRowHeightChange?.(rowHeight);
    const columnGap = parseFloat(getComputedStyle(this.containerRef.current).columnGap);
    this.props.onColumnGapChange?.(columnGap);
  }
  componentDidMount() {
    this.updateSizesInfo();
  }
  componentDidUpdate() {
    this.handleFocusPageChange();
    this.updateSizesInfo();
  }
  onCardFocusMoved(newIdx, element) {
    const {
      items,
      cardProps
    } = this.props;
    cardProps?.onFocusedCardChanged?.(items[newIdx], newIdx, element);
  }
  handleFocusPageChange() {
    const {
      isLoading,
      navigationStrategy
    } = this.props;
    if (!isLoading && this.focusFirstCardAfterReload) {
      this.focusFirstCardAfterReload = false;
      const [, newActiveItem] = navigationStrategy.getNewActiveItem(() => navigationStrategy.setActiveItem(0, true));
      if (newActiveItem) {
        this.onCardFocusMoved(newActiveItem.idx, newActiveItem.element);
      }
    }
  }
}

let ContentView$1 = class ContentView extends Component$1 {
  render() {
    return normalizeProps(createComponentVNode(2, ContentView$2, {
      ...this.props,
      children: normalizeProps(createComponentVNode(2, Content, {
        ...this.props.contentProps
      }))
    }));
  }
};

function factors(n) {
  const res = [];
  for (let i = 1; i <= n; i += 1) {
    if (n % i === 0) {
      res.push(i);
    }
  }
  return res;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable
  @typescript-eslint/explicit-function-return-type,
  @typescript-eslint/explicit-module-boundary-types,
  spellcheck/spell-checker
*/
class ContentView extends ContentView$3 {
  // @ts-expect-error

  constructor(...args) {
    // @ts-expect-error
    super(...args);
    this.cardMinWidth = this.options.oneWay('cardMinWidth');
    this.rowHeight = signal(0);
    this.columnGap = signal(0);
    this.cardsPerRowProp = this.options.oneWay('cardsPerRow');
    this.cardsPerRow = computed(() => {
      const width = this.width.value;
      const cardMinWidth = this.cardMinWidth.value;
      const pageSize = this.dataController.pageSize.value;
      const cardsPerRowProp = this.cardsPerRowProp.value;
      if (cardsPerRowProp !== 'auto') {
        return cardsPerRowProp;
      }
      const result = factors(pageSize).reverse().find(cardsPerRow => {
        const cardWidth = (width - this.columnGap.value * (cardsPerRow - 1)) / cardsPerRow;
        return cardMinWidth <= cardWidth;
      });
      return result ?? 1;
    });
    this.navigationStrategy = new NavigationStrategyMatrix(this.cardsPerRow.peek());
    this.component = ContentView$1;
    this.items = computed(() => this.itemsController.items.value.filter(item => item.visible));
    effect(() => {
      this.navigationStrategy.updateColumnsCount(this.cardsPerRow.value);
    });
  }
  getProps() {
    return computed(() => ({
      ...this.getBaseProps(),
      contentProps: {
        items: this.items.value,
        kbnEnabled: this.keyboardNavigationController.enabled.value,
        navigationStrategy: this.navigationStrategy,
        isLoading: this.dataController.isReloading.value,
        needToHiddenCheckBoxes: this.selectionController.needToHiddenCheckBoxes.value,
        cardsPerRow: this.cardsPerRow.value,
        onRowHeightChange: height => {
          this.rowHeight.value = height;
        },
        onFirstElementChange: firstElement => {
          this.keyboardNavigationController.setFirstCardElement(firstElement);
        },
        onColumnGapChange: gap => {
          this.columnGap.value = gap;
        },
        onPageChange: this.onPageChange.bind(this),
        showCardContextMenu: this.showCardContextMenu.bind(this),
        wordWrapEnabled: this.options.oneWay('wordWrapEnabled').value,
        cardProps: {
          minWidth: this.cardMinWidth.value,
          maxWidth: this.options.oneWay('cardMaxWidth').value,
          fieldHintEnabled: this.options.oneWay('fieldHintEnabled').value,
          isCheckBoxesRendered: this.selectionController.isCheckBoxesRendered.value,
          allowSelectOnClick: this.selectionController.allowSelectOnClick.value,
          onHold: this.onCardHold.bind(this),
          onClick: this.options.action('onCardClick').value,
          onDblClick: this.options.action('onCardDblClick').value,
          onHoverChanged: this.options.action('onCardHoverChanged').value,
          onPrepared: this.options.action('onCardPrepared').value,
          fieldProps: {
            captionProps: {
              onClick: this.options.action('onFieldCaptionClick').value,
              onDblClick: this.options.action('onFieldCaptionDblClick').value,
              onPrepared: this.options.action('onFieldCaptionPrepared').value
            },
            valueProps: {
              onClick: this.options.action('onFieldValueClick').value,
              onDblClick: this.options.action('onFieldValueDblClick').value,
              onPrepared: this.options.action('onFieldValuePrepared').value
            }
          },
          onEdit: (key, returnFocusTo) => {
            this.keyboardNavigationController.setReturnFocusTo(returnFocusTo);
            this.editingController.editCard(key);
          },
          onDelete: (key, returnFocusTo) => {
            this.keyboardNavigationController.setReturnFocusTo(returnFocusTo);

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.editingController.deleteCard(key);
          },
          allowUpdating: this.editingController.allowUpdating.value,
          allowDeleting: this.editingController.allowDeleting.value,
          footerTemplate: this.options.template('cardFooterTemplate').value,
          template: this.options.template('cardTemplate').value,
          contentTemplate: this.options.template('cardContentTemplate').value,
          cover: {
            imageExpr: this.processExpr(this.options.oneWay('cardCover.imageExpr').value),
            altExpr: this.processExpr(this.options.oneWay('cardCover.altExpr').value),
            // NOTE: Default value set in SCSS (180px / 140px)
            maxHeight: this.options.oneWay('cardCover.maxHeight').value,
            ratio: this.options.oneWay('cardCover.aspectRatio').value,
            template: this.options.template('cardCover.template').value
          },
          header: {
            visible: this.options.oneWay('cardHeader.visible').value,
            items: this.options.oneWay('cardHeader.items').value,
            template: this.options.template('cardHeader.template').value
          },
          toolbar: this.options.oneWay('cardHeader.items').value,
          selectCard: this.selectCard.bind(this),
          onSelectAllCards: this.onSelectAllCards.bind(this),
          onSearchFocus: () => {
            this.searchUIController.doUIAction('focusSearchTextBox');
          },
          onFocusedCardChanged: (card, cardIdx, element) => {
            this.keyboardNavigationController.onFocusedCardChanged(card, cardIdx, element);
          }
        }
      }
    }));
  }
  processExpr(expr) {
    if (!isDefined(expr)) {
      return undefined;
    }
    // @ts-expect-error
    return compileGetter(expr);
  }
  selectCard(card, options) {
    if (options.needToUpdateCheckboxes) {
      this.selectionController.updateSelectionCheckBoxesVisible(true);
    }
    this.selectionController.changeCardSelection(card.index, options);
  }
  onCardHold(e) {
    this.selectionController.processLongTap(e.card);
  }
  showCardContextMenu(e, card, cardIndex) {
    this.contextMenuController.show(e, 'content', {
      card,
      cardIndex
    });
  }
  onSelectAllCards() {
    this.selectionController.selectAll();
  }
  onPageChange(value) {
    if (value < 0) {
      this.dataController.decreasePageIndex();
    } else {
      this.dataController.increasePageIndex();
    }
  }
}

class CardViewOptionsController extends OptionsController {}

class ContextMenuController extends BaseContextMenuController {
  static dependencies = [ColumnsController, CardViewOptionsController, SortingController];
  constructor(columnsController, options, sortingController) {
    super();
    this.columnsController = columnsController;
    this.options = options;
    this.sortingController = sortingController;
  }
  show(event, view, contextInfo = {}, onMenuCloseCallback) {
    super.show(event, view, contextInfo, onMenuCloseCallback);
  }
  getItems(view, targetElement, contextInfo = {}) {
    const items = [];
    if (view === 'headerPanel' && contextInfo.column) {
      items.push(...this.getSortingItems(contextInfo.column));
    }

    // @ts-expect-error
    const event = {
      items: items.length > 0 ? items : undefined,
      target: view,
      targetElement: targetElement,
      columnIndex: undefined,
      card: undefined,
      cardIndex: undefined,
      column: undefined,
      ...contextInfo
    };
    const callback = this.options.action('onContextMenuPreparing').peek();
    callback(event);
    return event.items;
  }
  getSortingItems(column) {
    const mode = this.sortingController.mode.value;
    const isDisabled = mode === 'none' || !column.allowSorting;
    const onItemClick = event => {
      this.handleSortMenuClick(event, mode, column);
    };
    return [{
      text: this.options.oneWay('sorting.ascendingText').peek() ?? messageLocalization.format('dxDataGrid-sortingAscendingText'),
      value: 'asc',
      disabled: isDisabled || column.sortOrder === 'asc',
      icon: 'sortuptext',
      onItemClick
    }, {
      text: this.options.oneWay('sorting.descendingText').peek() ?? messageLocalization.format('dxDataGrid-sortingDescendingText'),
      value: 'desc',
      disabled: isDisabled || column.sortOrder === 'desc',
      icon: 'sortdowntext',
      onItemClick
    }, {
      text: this.options.oneWay('sorting.clearText').peek() ?? messageLocalization.format('dxDataGrid-sortingClearText'),
      value: undefined,
      disabled: isDisabled || !column.sortOrder,
      icon: 'none',
      onItemClick
    }];
  }
  handleSortMenuClick(e, mode, column) {
    const sortOrder = e.itemData?.value;
    switch (mode) {
      case 'single':
        this.sortingController.onSingleModeSortCore(column, true, sortOrder);
        break;
      case 'multiple':
        this.sortingController.onMultipleModeSortCore(column, false, sortOrder);
        break;
    }
  }
}

let ContextMenu$1 = class ContextMenu extends InfernoWrapper {
  contentRef = {};
  getComponentFabric() {
    return ContextMenu$2;
  }
};

function ContextMenu(props) {
  return createVNode(1, "div", CLASSES$c.excludeFlexBox, createComponentVNode(2, ContextMenu$1, {
    "showEvent": undefined,
    "componentRef": props.componentRef,
    "cssClass": props.cssClass,
    "onInitialized": props.onInitialized,
    "onPositioning": props.onPositioning,
    "onItemClick": props.onItemClick
  }), 2);
}

const CLASS$1 = {
  contextMenu: 'dx-context-menu'
};
class BaseContextMenuView extends View {
  constructor(controller) {
    super();
    this.controller = controller;
    this.component = ContextMenu;
  }
  getProps() {
    return computed(() => ({
      componentRef: this.controller.contextMenuRef,
      cssClass: this.getWidgetContainerClass(),
      onInitialized: e => {
        // @ts-expect-error
        e.component?.setAria('role', 'presentation');
        e.component?.$element().addClass(CLASS$1.contextMenu);
      },
      onItemClick: e => {
        e.itemData?.onItemClick?.(e);
      },
      onPositioning: this.controller.onPositioning
    }));
  }

  // TODO: move this to another place
  getWidgetContainerClass() {
    return 'dx-cardview-container';
  }
}

class ContextMenuView extends BaseContextMenuView {
  static dependencies = [ContextMenuController];
  constructor(controller) {
    super(controller);
    this.controller = controller;
  }
}

const CLASS = {
  hidden: 'dx-hidden'
};
class HeaderPanelController {
  static dependencies = [ColumnsController, ColumnChooserView];
  constructor(columnsController, columnChooserView) {
    this.columnsController = columnsController;
    this.columnChooserView = columnChooserView;
    this.isColumnDraggable = column => {
      const canHide = column.allowHiding && this.columnChooserView.dragModeOpened.peek();
      const canReorder = this.canReorder(column);
      return canReorder || canHide;
    };
    this.onColumnMove = (column, toIndex, draggingColumnData) => {
      const {
        columnAfter
      } = draggingColumnData;
      const needPreserveOrder = !this.canReorder(column);
      if (needPreserveOrder) {
        this.columnsController.columnOption(column, 'visible', true);
        return;
      }
      if (columnAfter === undefined) {
        const columnsCount = this.columnsController.columns.peek().length;
        this.columnsController.columnOption(column, 'visible', true);
        this.columnsController.columnOption(column, 'visibleIndex', columnsCount);
        return;
      }
      this.columnsController.updateColumns(columns => {
        const newColumns = [...columns];
        newColumns.forEach((oldColumn, index) => {
          const updatedColumn = {
            ...oldColumn
          };
          if (oldColumn.name === column.name) {
            updatedColumn.visibleIndex = columnAfter.visibleIndex;
            updatedColumn.visible = true;
          } else if (oldColumn.visibleIndex >= columnAfter.visibleIndex) {
            updatedColumn.visibleIndex = oldColumn.visibleIndex + 1;
          }
          newColumns[index] = updatedColumn;
        });
        return newColumns;
      });
    };
    this.onPlaceholderPrepared = e => {
      const $placeholderElement = renderer(e.placeholderElement);
      const {
        column
      } = e.itemData;
      const canReorder = this.canReorder(column);
      $placeholderElement.toggleClass(CLASS.hidden, !canReorder);
    };
  }
  canReorder(column) {
    const allowColumnReordering = this.columnsController.allowColumnReordering.peek();
    return allowColumnReordering && column.allowReordering;
  }
}

const CLASSES$1 = {
  link: 'dx-link',
  headers: 'dx-cardview-headers',
  content: 'dx-cardview-headerpanel-content',
  contentHasHeaderItems: 'dx-cardview-headerpanel-content--with-header-items',
  contentEmpty: 'dx-cardview-headerpanel-content--empty',
  headerPanelTextEmpty: 'dx-cardview-headerpanel-text-empty',
  headerItemContainer: 'dx-cardview-header-item-container',
  sortable: 'dx-cardview-sortable',
  sortablePlaceholder: 'dx-cardview-header-item-sort-indicator'
};
const ItemWithKbn = withKbnNavigationItem(withKeyDownHandler(Item));
const EmptyHeaderPanelText = props => {
  const text = messageLocalization.format('dxCardView-emptyHeaderPanelText');
  const columnChooserText = messageLocalization.format('dxCardView-emptyHeaderPanelColumnChooserText');
  const [leftPart, rightPart] = text.split('{0}');
  return createVNode(1, "span", CLASSES$1.headerPanelTextEmpty, [leftPart, createVNode(1, "a", CLASSES$1.link, columnChooserText, 0, {
    "onClick": props.openColumnChooser
  }), rightPart], 0, {
    "role": 'menuitem'
  });
};
class HeaderPanel extends Component$1 {
  render() {
    const HeaderItem = this.props.kbnEnabled ? ItemWithKbn : Item;
    if (!this.props.visible) {
      return createFragment();
    }
    const {
      sortableConfig
    } = this.props;
    const hasHeaderItems = this.props.visibleColumns.length > 0;
    const contentClassNames = combineClasses({
      [CLASSES$1.content]: true,
      [CLASSES$1.contentHasHeaderItems]: hasHeaderItems,
      [CLASSES$1.contentEmpty]: !hasHeaderItems
    });
    return createVNode(1, "div", CLASSES$1.headers, normalizeProps(createComponentVNode(2, ColumnSortable, {
      ...this.props.draggingOptions,
      "className": CLASSES$1.sortable,
      "source": "header-panel-main",
      "getColumnByIndex": index => this.props.visibleColumns[index],
      "visibleColumns": this.props.visibleColumns,
      "allowDragging": true,
      "onColumnMove": sortableConfig.onColumnMove,
      "columnDragTemplate": Item,
      "itemOrientation": "horizontal",
      "filter": `.${CLASSES$1.headerItemContainer}`,
      "isColumnDraggable": sortableConfig.isColumnDraggable,
      "showDropzone": sortableConfig.showDropzone,
      "placeholderClassName": CLASSES$1.sortablePlaceholder,
      "onPlaceholderPrepared": sortableConfig.onPlaceholderPrepared,
      children: createComponentVNode(2, Scrollable, {
        "direction": 'horizontal',
        "showScrollbar": 'never',
        "useNative": false,
        "scrollByContent": true,
        "useKeyboard": false,
        children: createComponentVNode(2, KbnNavigationContainer, {
          "enabled": this.props.kbnEnabled,
          "navigationStrategy": this.props.navigationStrategy,
          children: createVNode(1, "div", contentClassNames, [!hasHeaderItems && createComponentVNode(2, EmptyHeaderPanelText, {
            "openColumnChooser": this.props.openColumnChooser
          }), this.props.visibleColumns.map((column, idx) => createVNode(1, "div", CLASSES$1.headerItemContainer, createComponentVNode(2, HeaderItem, {
            "navigationIdx": idx,
            "navigationStrategy": this.props.navigationStrategy,
            "showSortIndexes": this.props.showSortIndexes,
            "column": column,
            "template": this.props.itemTemplate,
            "cssClass": this.props.itemCssClass,
            "hasFilters": this.itemHasFilters(column, this.props.filterSyncValue),
            "keyDownConfig": {
              Enter: event => {
                this.props.onColumnSort(column, event);
              },
              'Enter+ctrl': event => {
                this.props.onColumnSort(column, event);
              },
              'Enter+shift': event => {
                this.props.onColumnSort(column, event);
              },
              'ArrowDown+alt': (event, ref) => {
                this.props.onHeaderFilterOpen?.(ref.current, column, () => ref.current?.focus());
              }
            },
            "caughtEventPreventDefault": true,
            "onSortClick": event => {
              this.props.onColumnSort(column, event);
            },
            "onFilterClick": element => {
              this.props.onHeaderFilterOpen?.(element, column);
            },
            "onContextMenu": (event, ref) => {
              this.props.showContextMenu(event, column, idx, () => ref?.focus());
            }
          }), 2))], 0, {
            "role": "menubar"
          })
        })
      })
    })), 2, {
      "onContextMenu": this.props.showContextMenu
    });
  }
  itemHasFilters(column, filterSyncValue) {
    const {
      filterValues
    } = column;
    const columnId = getColumnIdentifier(column);
    const hasHeaderFilterValue = !!filterValues?.length;
    const hasFilterSyncValue = filterHasField(filterSyncValue, columnId);
    return hasHeaderFilterValue || hasFilterSyncValue;
  }
}

/* eslint-disable spellcheck/spell-checker */
class HeaderPanelView extends View {
  static dependencies = [HeaderPanelController, ContextMenuController, SortingController, ColumnsController, CardViewOptionsController, HeaderFilterViewController, KeyboardNavigationController, ColumnChooserController, FilterController, ColumnChooserView];
  constructor(headerPanelController, contextMenuController, sortingController, columnsController, options, headerFilterViewController, keyboardNavigationController, columnChooserController, filterController, columnChooserView) {
    super();
    this.headerPanelController = headerPanelController;
    this.contextMenuController = contextMenuController;
    this.sortingController = sortingController;
    this.columnsController = columnsController;
    this.options = options;
    this.headerFilterViewController = headerFilterViewController;
    this.keyboardNavigationController = keyboardNavigationController;
    this.columnChooserController = columnChooserController;
    this.filterController = filterController;
    this.columnChooserView = columnChooserView;
    this.component = HeaderPanel;
    this.navigationStrategy = new NavigationStrategyHorizontalList();
    this.showDropzone = computed(() => {
      const allowReordering = this.columnsController.allowColumnReordering.value;
      const column = this.columnChooserController.draggingItem.value?.column;
      if (!column) {
        return false;
      }
      const allColumnsHidden = this.columnsController.visibleColumns.value.length === 0;
      const canReorder = allowReordering && column.allowReordering;
      return !canReorder || allColumnsHidden;
    });
  }
  getProps() {
    return computed(() => ({
      visibleColumns: this.columnsController.visibleColumns.value,
      kbnEnabled: this.keyboardNavigationController.enabled.value,
      navigationStrategy: this.navigationStrategy,
      showSortIndexes: this.sortingController.showSortIndexes.value,
      onColumnSort: this.onColumnSort.bind(this),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemTemplate: this.options.template('headerPanel.itemTemplate').value,
      onHeaderFilterOpen: this.onHeaderFilterOpen.bind(this),
      itemCssClass: this.options.oneWay('headerPanel.itemCssClass').value,
      visible: this.options.oneWay('headerPanel.visible').value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draggingOptions: this.options.oneWay('headerPanel.dragging').value,
      sortableConfig: {
        onColumnMove: this.headerPanelController.onColumnMove,
        showDropzone: this.showDropzone.value,
        isColumnDraggable: this.headerPanelController.isColumnDraggable,
        onPlaceholderPrepared: this.headerPanelController.onPlaceholderPrepared
      },
      showContextMenu: this.showContextMenu.bind(this),
      openColumnChooser: () => {
        this.columnChooserView.show();
      },
      filterSyncValue: this.filterController.filterSyncValue.value
    }));
  }
  onColumnSort(column, event) {
    const mode = this.sortingController.mode.peek();
    switch (mode) {
      case 'none':
        return;
      case 'single':
        this.sortingController.onSingleModeSortClick(column, event);
        return;
      case 'multiple':
        this.sortingController.onMultipleModeSortClick(column, event);
        return;
      default:
        throw new Error('Unsupported sorting state');
    }
  }
  onHeaderFilterOpen(element, column, onFilterCloseCallback) {
    if (!element) {
      return;
    }
    this.headerFilterViewController.openPopup(element, column, onFilterCloseCallback);
  }
  showContextMenu(event, column, columnIndex, onMenuCloseCallback) {
    this.contextMenuController.show(event, 'headerPanel', {
      column,
      columnIndex
    }, onMenuCloseCallback);
  }
}

/* eslint-disable spellcheck/spell-checker */

function register(diContext) {
  setupStateManager({
    diContext});
  register$1(diContext);
  diContext.register(ContentView);
  // TODO: fix after refactoring View Composition
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  diContext.addAlias(ContentView$3, ContentView);
  diContext.register(HeaderPanelController);
  diContext.register(HeaderPanelView);
  diContext.register(ContextMenuView);
  diContext.register(ContextMenuController);
  diContext.addAlias(BaseContextMenuController, ContextMenuController);
}

/* eslint-disable spellcheck/spell-checker */

function normalizeEventName(name) {
  return name.substring(2).toLowerCase();
}
class RootElementUpdater extends Component$1 {
  previousClasses = [];
  previousAttributes = {};
  render() {
    // @ts-expect-error
    return this.props.children;
  }
  updateClasses(element) {
    const currentClassName = this.props.className;
    const currentClasses = currentClassName?.split(' ') ?? [];
    const addedClasses = currentClasses.filter(cls => !this.previousClasses.includes(cls));
    const removedClasses = this.previousClasses.filter(cls => !currentClasses.includes(cls));
    addedClasses.forEach(cls => {
      element.classList.add(cls);
    });
    removedClasses.forEach(cls => {
      element.classList.remove(cls);
    });
    this.previousClasses = currentClasses;
  }
  updateAttributes(element) {
    const {
      rootElementRef,
      ref,
      className,
      children,
      ...currentAttributes
    } = this.props;
    const currentAttributeKeys = Object.keys(currentAttributes);
    const previousAttributeKeys = Object.keys(this.previousAttributes);
    currentAttributeKeys.forEach(attrName => {
      if (attrName.startsWith('on')) {
        if (previousAttributeKeys.includes(attrName)) {
          element.removeEventListener(normalizeEventName(attrName),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.previousAttributes[attrName]);
        }
        element.addEventListener(normalizeEventName(attrName), currentAttributes[attrName]);
      } else {
        element[attrName] = currentAttributes[attrName];
      }
    });
    const removedAttrKeys = previousAttributeKeys.filter(attrName => !currentAttributeKeys.includes(attrName));
    removedAttrKeys.forEach(attrName => {
      if (attrName.startsWith('on')) {
        element.removeEventListener(normalizeEventName(attrName),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.previousAttributes[attrName]);
      } else {
        element.removeAttribute(attrName);
      }
    });
    this.previousAttributes = currentAttributes;
  }
  updateClassesAndAttributes() {
    const element = this.props.rootElementRef.current;
    if (!element) {
      throw new Error('root element is not provided');
    }
    this.updateClasses(element);
    this.updateAttributes(element);
  }
  componentDidMount() {
    this.updateClassesAndAttributes();
  }
  componentDidUpdate() {
    this.updateClassesAndAttributes();
  }
}

const CLASSES = {
  cardView: 'dx-cardview'
};
function MainViewComponent({
  Toolbar,
  Content,
  Pager,
  HeaderPanel,
  HeaderFilterPopup,
  FilterPanel,
  ColumnChooser,
  ContextMenu,
  EditPopup,
  config,
  commonProps,
  accessibilityDescription,
  accessibilityStatus,
  onKeyDown
}) {
  return createFragment([createComponentVNode(2, ConfigContext.Provider, {
    "value": config,
    children: createComponentVNode(2, CommonPropsContext.Provider, {
      "value": commonProps,
      children: createComponentVNode(2, RootElementUpdater, {
        "rootElementRef": commonProps.rootElementRef,
        "className": CLASSES.cardView,
        children: createVNode(1, "div", "dx-cardview-root-container", [createComponentVNode(2, A11yStatusContainer, {
          "statusText": accessibilityStatus
        }), createVNode(1, "div", "dx-cardview-header-container", [createComponentVNode(2, Toolbar), createComponentVNode(2, HeaderPanel)], 4), createComponentVNode(2, Content), createComponentVNode(2, FilterPanel), createVNode(1, "div", null, createComponentVNode(2, Pager), 0), createComponentVNode(2, HeaderFilterPopup), createComponentVNode(2, EditPopup), createComponentVNode(2, ColumnChooser), createComponentVNode(2, ContextMenu)], 4, {
          "role": 'group',
          "aria-label": accessibilityDescription,
          "onKeyDown": onKeyDown
        })
      })
    })
  })], 4);
}
class MainView extends View {
  static dependencies = [ContentView, PagerView, ToolbarView, HeaderPanelView, HeaderFilterPopupView, FilterPanelView, ColumnChooserView, EditPopupView, ContextMenuView, CardViewOptionsController, KeyboardNavigationController, AccessibilityController];
  constructor(content, pager, toolbar, headerPanel, headerFilterPopup, filterPanel, columnsChooser, editPopup, contextMenu, options, keyboardNavigation, accessibility) {
    super();
    this.content = content;
    this.pager = pager;
    this.toolbar = toolbar;
    this.headerPanel = headerPanel;
    this.headerFilterPopup = headerFilterPopup;
    this.filterPanel = filterPanel;
    this.columnsChooser = columnsChooser;
    this.editPopup = editPopup;
    this.contextMenu = contextMenu;
    this.options = options;
    this.keyboardNavigation = keyboardNavigation;
    this.accessibility = accessibility;
    this.component = MainViewComponent;
    this.config = computed(() => ({
      rtlEnabled: this.options.oneWay('rtlEnabled').value,
      disabled: this.options.oneWay('disabled').value,
      templatesRenderAsynchronously: this.options.oneWay('templatesRenderAsynchronously').value
    }));
    this.commonProps = {
      rootElementRef: {
        current: this.root
      }
    };
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  getProps() {
    this.commonProps.rootElementRef.current = this.root;
    return computed(() => ({
      Toolbar: this.toolbar.asInferno(),
      Content: this.content.asInferno(),
      Pager: this.pager.asInferno(),
      HeaderPanel: this.headerPanel.asInferno(),
      HeaderFilterPopup: this.headerFilterPopup.asInferno(),
      FilterPanel: this.filterPanel.asInferno(),
      ColumnChooser: this.columnsChooser.asInferno(),
      EditPopup: this.editPopup.asInferno(),
      ContextMenu: this.contextMenu.asInferno(),
      config: this.config.value,
      commonProps: this.commonProps,
      onKeyDown: event => {
        this.keyboardNavigation.onKeyDown(event);
      },
      accessibilityDescription: this.accessibility.componentDescription.value,
      accessibilityStatus: this.accessibility.componentStatus.value
    }));
  }
}

const defaultOptions$1 = {
  headerPanel: {
    visible: true
  }
};

/**
 * @interface
 */

const defaultOptions = {
  ...defaultOptions$3,
  ...defaultOptions$2,
  ...defaultOptions$1
};

/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
class CardViewBase extends GridCoreNew {
  _registerDIContext() {
    super._registerDIContext();
    register(this.diContext);
    this.diContext.register(MainView$1, MainView);
    const optionsController = new CardViewOptionsController(this);
    this.diContext.registerInstance(CardViewOptionsController, optionsController);
    // @ts-expect-error
    this.diContext.registerInstance(GridCoreOptionsController, optionsController);
  }
  _initMarkup() {
    super._initMarkup();
    renderer(this.$element()).addClass('dx-cardview');
  }
  _initDIContext() {
    super._initDIContext();
    this.contentView = this.diContext.get(ContentView);
    this.headerPanel = this.diContext.get(HeaderPanelView);
    this.contextMenu = this.diContext.get(ContextMenuView);
    this.contextMenuController = this.diContext.get(ContextMenuController);
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  _getDefaultOptions() {
    return {
      ...super._getDefaultOptions(),
      ...extend(true, {}, defaultOptions)
    };
  }
}
class CardView extends PublicMethods(CardViewBase) {}

// @ts-expect-error
registerComponent('dxCardView', CardView);

window.$ = window.jQuery = jQuery;
const AspNet = {
  createStore(options) {
    return new CustomStore({
      key: options.key,
      load: loadOptions => Ajax.sendRequest({
        url: options.loadUrl,
        method: 'GET',
        data: loadOptions,
        dataType: 'json'
      }),
      insert: options.insertUrl ? values => Ajax.sendRequest({
        url: options.insertUrl,
        method: 'POST',
        data: JSON.stringify(values),
        contentType: 'application/json',
        dataType: 'json'
      }) : undefined,
      update: options.updateUrl ? (key, values) => Ajax.sendRequest({
        url: options.updateUrl,
        method: 'PUT',
        data: JSON.stringify({
          key,
          values
        }),
        contentType: 'application/json',
        dataType: 'json'
      }) : undefined,
      remove: options.deleteUrl ? key => Ajax.sendRequest({
        url: options.deleteUrl,
        method: 'DELETE',
        data: JSON.stringify(key),
        contentType: 'application/json',
        dataType: 'json'
      }) : undefined
    });
  },
  sendRequest: options => Ajax.sendRequest(options)
};
window.DevExpress = {
  config: configMethod,
  setTemplateEngine,
  data: {
    ArrayStore,
    CustomStore,
    DataSource,
    query,
    Guid,
    AspNet
  },
  ui: {
    notify,
    dialog,
    repaintFloatingActionButton: repaint
  },
  localization,
  utils: {
    getTimeZones: getTimeZones,
    ajax: Ajax
  },
  viz: {
    getPalette,
    registerPalette,
    currentPalette,
    generateColors,
    map: {
      sources: {}
    }
  },
  fileManagement: {
    RemoteFileSystemProvider
  },
  common: {
    charts: {
      registerPattern,
      registerGradient
    }
  }
};
setLicenseCheckSkipCondition();
const themeLoaders = /* #__PURE__ */ Object.assign({"../artifacts/css/dx.carmine.compact.css": () => __vitePreload(() => import('./assets/dx.carmine.compact-YllJu5_J.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.carmine.css": () => __vitePreload(() => import('./assets/dx.carmine-C1YYn_Pr.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.common.css": () => __vitePreload(() => import('./assets/dx.common-Cph7l5t5.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.contrast.compact.css": () => __vitePreload(() => import('./assets/dx.contrast.compact-Bdix6ycS.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.contrast.css": () => __vitePreload(() => import('./assets/dx.contrast-CCJfr63A.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.dark.compact.css": () => __vitePreload(() => import('./assets/dx.dark.compact-O6E787Fw.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.dark.css": () => __vitePreload(() => import('./assets/dx.dark-DcMkMmJv.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkmoon.compact.css": () => __vitePreload(() => import('./assets/dx.darkmoon.compact-QaEi2_DF.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkmoon.css": () => __vitePreload(() => import('./assets/dx.darkmoon-CkY3vlwz.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkviolet.compact.css": () => __vitePreload(() => import('./assets/dx.darkviolet.compact-BP06fhf-.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkviolet.css": () => __vitePreload(() => import('./assets/dx.darkviolet-BUVSS95y.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.dark.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.dark.compact-BmKrEcsK.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.dark.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.dark-DPzmpIFd.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.light.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.light.compact-5EkRDMg7.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.light.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.light-DwYbJb6s.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.dark.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.dark.compact-D_zm3SEh.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.dark.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.dark-DaH3pB9D.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.light.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.light.compact-CHQH74Ou.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.light.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.light-C5tQaRIq.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.greenmist.compact.css": () => __vitePreload(() => import('./assets/dx.greenmist.compact-DNm8tlcv.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.greenmist.css": () => __vitePreload(() => import('./assets/dx.greenmist-CYyv6lLW.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.light.compact.css": () => __vitePreload(() => import('./assets/dx.light.compact-DxXnqUJb.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.light.css": () => __vitePreload(() => import('./assets/dx.light-DNFvzA8L.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.blue.dark.compact-D2SaaS3r.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.dark.css": () => __vitePreload(() => import('./assets/dx.material.blue.dark-LMYrcgv3.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.blue.light.compact-D-yGg2P5.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.light.css": () => __vitePreload(() => import('./assets/dx.material.blue.light-JGZJeQXZ.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.lime.dark.compact-DreUfwQE.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.dark.css": () => __vitePreload(() => import('./assets/dx.material.lime.dark-BIdf2ltL.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.lime.light.compact-BhZppYYb.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.light.css": () => __vitePreload(() => import('./assets/dx.material.lime.light-DwNfNtE3.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.orange.dark.compact-CsEKtEmX.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.dark.css": () => __vitePreload(() => import('./assets/dx.material.orange.dark-z32eD6ru.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.orange.light.compact-_L81zkS6.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.light.css": () => __vitePreload(() => import('./assets/dx.material.orange.light-_ROrgN8j.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.purple.dark.compact-B12LVY9h.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.dark.css": () => __vitePreload(() => import('./assets/dx.material.purple.dark-CHqDA5WC.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.purple.light.compact-BkB2Q6qf.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.light.css": () => __vitePreload(() => import('./assets/dx.material.purple.light-CHcMxH3e.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.teal.dark.compact-C6boEXn3.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.dark.css": () => __vitePreload(() => import('./assets/dx.material.teal.dark-leicWruz.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.teal.light.compact-rKSjL-pp.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.light.css": () => __vitePreload(() => import('./assets/dx.material.teal.light-IwM9xBmn.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.softblue.compact.css": () => __vitePreload(() => import('./assets/dx.softblue.compact-QiUNrA2R.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.softblue.css": () => __vitePreload(() => import('./assets/dx.softblue-CD3XC5nY.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"])


});
const themeId = localStorage.getItem('currentThemeId');
const themeKey = themeId ? Object.keys(themeLoaders).find(p => p.includes(`dx.${themeId}.css`)) : Object.keys(themeLoaders)[0];
if (themeKey) {
  const rawUrl = await themeLoaders[themeKey]();
  const url = new URL(rawUrl, import.meta.url).href;
  await new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}
