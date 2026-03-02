# Grid Core Architecture

## Overview

The **grid_core** is the foundational architecture for all grid-based components in DevExtreme (DataGrid, TreeList, CardView, etc.). It provides a modular, extensible framework for building complex data-driven grid widgets with features like sorting, filtering, editing, selection, and paging.

This document describes the architectural patterns, core concepts, and design principles of the grid_core module system.

---

## Core Architectural Patterns

### Separation of Concerns

Grid functionality is divided into three distinct layers:

- **Controllers**: Business logic, state management, and data operations
- **Views**: UI rendering and DOM manipulation
- **Widget**: Orchestration layer that coordinates controllers and views

This separation enables:
- Independent testing of business logic
- Reusable controllers across different grid types
- Easy extension without modifying core components

### Modular Composition

Grid features are implemented as independent modules that can be:
- Registered dynamically
- Extended via extender functions
- Combined to build different grid variants (DataGrid, TreeList, etc.)
- Enabled/disabled based on configuration

### Cross-Cutting Concerns

Features that span multiple components use the **extender pattern**:
- A module can provide extenders for existing controllers/views
- Extenders are applied during module processing
- Enables features like virtual scrolling to enhance multiple controllers without tight coupling

---

## Architecture

The grid_core architecture is based on a module registration system with dynamic composition.

### Base Classes

#### ModuleItem

The root base class for all grid components.

**Key Responsibilities:**
- Lifecycle management (`init()`, `beginUpdate()`, `endUpdate()`, `dispose()`)
- Option access through the widget component
- Action/callback registration via `callbackNames()`
- Public method declaration via `publicMethods()`

**Key Concepts:**
- **Update Lock**: Batching mechanism to prevent redundant operations during bulk updates
- **Option Cache**: Performance optimization for frequently accessed options
- **Actions**: Type-safe event handlers registered through action configs

```typescript
class ModuleItem {
  component: InternalGrid;
  beginUpdate() / endUpdate();  // Batching mechanism
  option(name?, value?);        // Access widget options
  callbackNames(): string[];    // Declare callbacks
  publicMethods(): string[];    // Expose public API
}
```

#### Controller

Extends `ModuleItem` for business logic components.

**Characteristics:**
- No UI responsibilities
- Manages state and coordinates operations
- Provides data and behavior to views
- Examples: `DataController`, `SelectionController`, `EditingController`

```typescript
class Controller extends ModuleItem {
  // Pure business logic
  // State management
  // Coordination between modules
}
```

#### ViewController

Extends `Controller` with access to views.

**Characteristics:**
- Can access other views via `getView(name)`
- Coordinates between business logic and UI
- Examples: `EditorFactory`, `ContextMenuController`

```typescript
class ViewController extends Controller {
  getView<T>(name: T): Views[T];
  getViews(): Views;
}
```

#### View

Extends `ModuleItem` for UI rendering components.

**Key Responsibilities:**
- DOM manipulation and rendering
- Event handling
- Resize management
- Template rendering

**Key Concepts:**
- **Deferred Rendering**: Views are marked for render and updated in batches
- **Render Lifecycle**: `_renderCore()` → `renderCompleted` callback
- **Resize Lifecycle**: `_resizeCore()` → `resizeCompleted` callback
- **Visibility Management**: Hidden views skip rendering

```typescript
class View extends ModuleItem {
  render($parent, options?);    // Main render method
  resize();                     // Handle resize
  _renderCore(options?);        // Override for custom rendering
  _invalidate(requireResize?, requireReady?); // Mark for re-render
}
```

### Module System

#### Module Registration

Modules are registered globally and processed when a widget is instantiated:

```typescript
// Module structure
interface Module {
  name: string;
  controllers?: Record<string, typeof Controller>;
  views?: Record<string, typeof View>;
  extenders?: {
    controllers?: Record<string, ExtenderFunction>;
    views?: Record<string, ExtenderFunction>;
  };
  defaultOptions?: () => Options;
}

// Registration
gridHelper.registerModule('selection', {
  controllers: {
    selection: SelectionController
  },
  extenders: {
    controllers: {
      data: (Base) => class extends Base { /* enhancements */ }
    }
  }
});
```

#### Module Processing

During widget initialization:

1. **Collection**: All registered modules are gathered
2. **Ordering**: Modules are sorted by `modulesOrder` if specified
3. **Type Aggregation**: Controllers and views are collected from all modules
4. **Extender Application**: Extenders are applied in registration order, creating enhanced types
5. **Instantiation**: Enhanced types are instantiated and stored in `_controllers` and `_views`
6. **Public Method Registration**: Methods from `publicMethods()` are exposed on the widget

#### Extender Pattern

Extenders enable cross-cutting concerns without modifying original classes:

```typescript
// Virtual scrolling extends data controller
const dataExtender = (Base: typeof DataController) =>
  class VirtualScrollingDataControllerExtender extends Base {
    // Override or add methods
    load() {
      // Enhanced loading with virtual scrolling
      return super.load();
    }
  };
```

**Benefits:**
- Non-invasive feature addition
- Composition over inheritance
- Clear dependency relationships
- Multiple extenders can be chained

### Widget Base (GridCoreWidget)

The base widget class that orchestrates the grid system:

**Key Responsibilities:**
- Module initialization via `getGridCoreHelper().processModules()`
- Option management and distribution
- Lifecycle coordination (`beginUpdate`/`endUpdate` propagation)
- Public API exposure from controllers/views
- Update batching across all modules

**Lifecycle Flow:**
```
_init() →
  processModules() →
    instantiate controllers/views →
    register public methods

_renderContent() →
  getView('gridView').update()

_optionChanged() →
  propagate to all modules via callModuleItemsMethod()
```

---

## Relationships and Communication

### Controller-to-Controller Communication

Controllers communicate by looking up other controllers and calling their methods:

```typescript
class SelectionController extends Controller {
  selectRows(keys) {
    this.getController('data').refresh();
  }
}
```

This creates implicit dependencies that are resolved at runtime.

### Controller-to-View Communication

- Controllers call `getView(name)._invalidate()` to trigger re-render
- Views observe controller callbacks for updates
- Controllers provide data through public methods or callbacks

### Widget-to-Module Communication

- Widget calls `getController(name).method()` to invoke controller logic
- Widget propagates `optionChanged` to all modules via `callModuleItemsMethod()`
- Modules access widget options via `this.component`

---

## Generating the Module Relationships Diagram

The `generate-architecture-doc.ts` script statically analyzes grid_core TypeScript source files and produces two artifacts in the `__docs__/artifacts/` directory:

- **`grid_core_architecture.generated.json`** — structured data with all modules, controllers, views, extenders, runtime dependencies, and inheritance chains.
- **`grid_core_architecture.generated.html`** — an interactive Cytoscape.js visualization of the module relationships.

### Usage

Run from the `__docs__` directory:

```bash
npx tsx ./scripts/generate-architecture-doc.ts
```

### Options

| Flag | Description |
|------|-------------|
| `--json` | Generate JSON output only |
| `--html` | Generate HTML output only |

When no flags are provided, both JSON and HTML files are generated.
