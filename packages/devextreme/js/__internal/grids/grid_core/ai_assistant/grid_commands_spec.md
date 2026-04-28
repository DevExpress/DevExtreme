# GridCommands Specification

## Overview

`GridCommands` is a utility class that bridges AI responses and DataGrid API calls. It maintains a registry of command descriptors, builds a unified JSON Schema (draft-07) for AI response structure, validates responses, executes commands sequentially (awaiting async ones), and returns user-facing result messages.

## Dependencies

- **zod** `3.24.4` — used to define per-command `args` schemas in TypeScript and to validate AI responses at runtime
- **zod-to-json-schema** `3.24.6` — converts Zod schemas to JSON Schema draft-07 for `buildResponseSchema()` output sent to the LLM

Each `GridCommand.schema` is defined as a `ZodObject` instead of a raw `JsonSchema`. `buildResponseSchema()` converts registered Zod schemas to JSON Schema via `zodToJsonSchema`. `validateResponse()` uses Zod's `.safeParse()` for per-command arg validation, giving structured error details internally.

## Flow

1. `GridCommands.buildResponseSchema()` — merges per-command schemas into unified JSON Schema draft-07
2. `AIAssistantIntegrationController.buildContext()` — collects current grid state for the AI prompt (uses `this.component`)
3. AI returns `ExecuteGridAssistantCommandResult` (`{ actions: [{ name, args }] }`)
4. `GridCommands.validateResponse(response)` — structural validation against merged schema; any mismatch → fail entirely
5. `GridCommands.executeCommands(actions, customizeResponseText?)` — runs commands in AI-returned order, awaiting each before next; returns `CommandResult[]` used directly to render response

## File Structure

```
ai_assistant/
  grid_commands.ts              # GridCommands class
  types.ts                      # GridCommand interface, CommandResult, shared types
  commands/
    sorting.ts                  # sorting, clearSorting
    filtering.ts                # filterValue, clearFilter, searching
    grouping.ts                 # grouping
    paging.ts                   # page, pageSize, groupPaging
    selection.ts                # selectByKeys, selectByIndexes, selectAll, deselectAll, clearSelection
    columns.ts                  # columnsVisibility, columnsReorder, columnsPinning, columnsResize
    summary.ts                  # summary, clearSummary
    focus.ts                    # rowFocusing
  __tests__/
    grid_commands.test.ts       # GridCommands class tests
    commands/
      sorting.test.ts
      filtering.test.ts
      grouping.test.ts
      paging.test.ts
      selection.test.ts
      columns.test.ts
      summary.test.ts
      focus.test.ts
```

---

## Types (`types.ts`)

```typescript
import type { ZodObject, ZodRawShape } from 'zod';
import type { JsonSchema7Type } from 'zod-to-json-schema';

/** JSON Schema draft-07 object sent to the LLM. */
type JsonSchema = JsonSchema7Type & {
  $schema?: string;
};

type CommandStatus = 'success' | 'failure' | 'aborted';

interface CommandResult {
  status: CommandStatus;
  message: string;
}

interface CommandCallbacks {
  success: (message?: string) => CommandResult;
  failure: (message?: string) => CommandResult;
}

type CommandExecutor = (args: Record<string, unknown>) => Promise<CommandResult>;

interface GridCommand {
  name: string;
  description: string; // Human-readable command purpose, used as branch-level description in schema
  schema: ZodObject<ZodRawShape>;  // Zod schema defining the `args` shape; converted to JSON Schema by buildResponseSchema(), used by validateResponse() via .safeParse()
  execute: (
    component: InternalGrid,
    callbacks: CommandCallbacks,
  ) => CommandExecutor;
}
```

### Execute pattern

`execute` is a factory: it receives `component` and `callbacks`, returns a `CommandExecutor` function that takes `args` and returns `Promise<CommandResult>`. The `callbacks.success()` and `callbacks.failure()` helpers are provided by `GridCommands` and create `CommandResult` with the corresponding status and a custom or default message.

```typescript
// Example command execute:
execute: (component, { success, failure }) => async (args) => {
  try {
    await Promise.resolve(component.option(args.newOptionValue));
    return success('Sorting applied');
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return failure(`Failed to apply sorting: ${message}`);
  }
}
```

---

## GridCommands Class (`grid_commands.ts`)

### Constructor

```typescript
constructor(component: InternalGrid, commands: GridCommand[])
```

**Acceptance criteria:**
- [ ] Stores `component` for use by `executeCommands`
- [ ] Stores commands in an internal registry indexed by `name`
- [ ] Throws if duplicate command names are provided
- [ ] Accepts an empty commands array (no commands registered)

### Helper methods (passed to command execute as `CommandCallbacks`)

#### `success(message?: string): CommandResult`

Returns `{ status: 'success', message: message ?? defaultSuccessMessage }`.

#### `failure(message?: string): CommandResult`

Returns `{ status: 'failure', message: message ?? defaultFailureMessage }`.

**Acceptance criteria:**
- [ ] `success()` without argument returns `CommandResult` with `status: 'success'` and a default message
- [ ] `success('Custom msg')` returns `CommandResult` with `status: 'success'` and `message: 'Custom msg'`
- [ ] `failure()` without argument returns `CommandResult` with `status: 'failure'` and a default message
- [ ] `failure('Custom msg')` returns `CommandResult` with `status: 'failure'` and `message: 'Custom msg'`

### `abort(): void`

Sets an internal `_aborted` flag to `true`. When `executeCommands` is running, it checks this flag before each command iteration. If set, execution stops and returns partial results with an `aborted` entry for the first skipped command. Calling `abort()` when not executing still sets the flag, but the flag is only reset when `executeCommands` actually begins execution (i.e., passes the reentrancy guard). A concurrent call rejected by the reentrancy guard does **not** reset `_aborted`.

**Acceptance criteria:**
- [ ] Sets `_aborted` to `true`
- [ ] Idempotent — calling multiple times has no additional effect
- [ ] Calling when not executing sets the flag; the flag persists until the next successful `executeCommands` start

### `isExecuting(): boolean`

Returns the current value of the internal `_executing` flag (the same flag used by the reentrancy guard).

**Acceptance criteria:**
- [ ] Returns `true` while `executeCommands` is in progress
- [ ] Returns `false` before `executeCommands` is called
- [ ] Returns `false` after `executeCommands` completes (normally, via abort, or via reentrancy rejection)

### JSON Schema LLM Constraints

Not all JSON Schema draft-07 features are supported by LLMs. The following constraints apply when building schemas:

**Not supported (do not use):**
- `oneOf`, `anyOf` on **root** level; `allOf` at any level
- `not` (ignored by LLMs)
- `pattern`, regex-based validation
- `dependencies`
- `if` / `then` / `else`

**Allowed on non-root level:**
- `anyOf` — used inside `items` to bind each command name to its specific args schema

**Partially supported (always add a `description` when using):**
- `format`
- `minimum` / `maximum`
- `examples`

**Required:**
- `additionalProperties` must always be set to `false`

### `buildResponseSchema(): JsonSchema`

Generates a unified JSON Schema draft-07 using `anyOf` inside `items` to bind each command name to its specific args schema. Each `anyOf` branch is a complete `{name, args}` object with a branch-level `description`. Each `GridCommand.schema` defines the full `args` object schema including `required`, `properties`, and `additionalProperties: false`.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["actions"],
  "additionalProperties": false,
  "properties": {
    "actions": {
      "type": "array",
      "description": "List of grid commands to execute",
      "items": {
        "anyOf": [
          {
            "type": "object",
            "description": "Apply sorting to one or more columns",
            "required": ["name", "args"],
            "additionalProperties": false,
            "properties": {
              "name": {
                "type": "string",
                "enum": ["sorting"]
              },
              "args": <sorting command schema>
            }
          },
          {
            "type": "object",
            "description": "Remove all sorting",
            "required": ["name", "args"],
            "additionalProperties": false,
            "properties": {
              "name": {
                "type": "string",
                "enum": ["clearSorting"]
              },
              "args": {
                "type": "object",
                "additionalProperties": false,
                "properties": {}
              }
            }
          }
        ]
      }
    }
  }
}
```

No-arg commands (e.g. `clearSorting`, `selectAll`) use `args: { type: "object", additionalProperties: false, properties: {} }`.

**Acceptance criteria:**
- [ ] Returns valid JSON Schema draft-07 object
- [ ] `actions.items` uses `anyOf` with one branch per registered command
- [ ] Each branch has a `description` with the command's purpose (from `GridCommand.description`)
- [ ] Each branch has `name.enum` with exactly one command name
- [ ] Each branch has `args` with that command's own schema (including `required` and `additionalProperties: false`)
- [ ] No `anyOf` at root schema level
- [ ] No use of `allOf`, `if/then/else`, `not`, `pattern`, `dependencies`
- [ ] `additionalProperties: false` is set on every object level
- [ ] Schema changes when commands are added/removed from the registry
- [ ] With no commands registered, `anyOf` is an empty array
- [ ] No-arg commands have `args: { type: "object", additionalProperties: false, properties: {} }`

### `validateResponse(response: ExecuteGridAssistantCommandResult): boolean`

Validates the AI response against the per-command schemas defined in each `GridCommand.schema`. Since each command has its own `anyOf` branch with explicit `required` and `additionalProperties: false`, validation checks each action's `args` against the matching command's schema.

- `response.actions` must be an array
- Each action must have `name` (string, known command) and `args` (object, not `null`)
- Each action's `args` is validated against the matching command's `schema` (which defines its own `required` properties, allowed property types, and `additionalProperties: false`)
- Extra/unknown properties in `args` are rejected (enforced by per-command `additionalProperties: false`)
- `null` values: if `args` is `null` instead of an object, validation fails (inconsistent with schema)
- Empty string `name` (`""`) is treated as an unknown command — validation fails
- Any mismatch → return `false` (entire response rejected)

**Acceptance criteria:**
- [ ] Returns `true` for a valid response with known command names and correct arg types
- [ ] Returns `false` if `response.actions` is not an array
- [ ] Returns `false` if `response.actions` is missing
- [ ] Returns `false` if any action has an unknown `name`
- [ ] Returns `false` if any action's `name` is not a string (e.g. `name: 123`)
- [ ] Returns `false` if any action's `name` is an empty string (`""`)
- [ ] Returns `false` if any action is missing `name` or `args`
- [ ] Returns `false` if any action's `args` is `null` (must be an object)
- [ ] Returns `false` if any action's `args` has wrong types for required properties
- [ ] Returns `false` if any action's `args` is missing required properties for that command (as defined by command's `schema.required`)
- [ ] Returns `false` if any action's `args` contains extra properties not in that command's schema
- [ ] Returns `true` for an empty `actions` array
- [ ] Returns `true` for no-arg commands when `args` is `{}`
- [ ] Rejects the entire response on first mismatch

### `async executeCommands(commands, customizeResponseText?): Promise<CommandResult[]>`

**Precondition:** `validateResponse` must be called before `executeCommands`. If the response is invalid, `executeCommands` should not be called. However, as a defensive measure, if an unknown command name is encountered during execution, it records a `failure` result for that command and continues to the next.

**Reentrancy guard:** `executeCommands` tracks whether it is currently executing via an internal `_executing` flag. If called while a previous execution is still in progress, it throws an error immediately (does not queue or execute). This makes the programming error explicit and impossible to silently ignore.

**Abort support:** `_aborted` is reset to `false` only when `executeCommands` successfully starts (passes the reentrancy guard). A concurrent call rejected by the reentrancy guard does **not** reset the flag — so `abort()` called during an in-progress execution is never lost. Before each loop iteration, the method checks `_aborted`. If `true`, it pushes a `CommandResult` with `status: 'aborted'` and a default message (e.g. `'Command execution aborted'`) for the first skipped command, then breaks. The method returns the partial `CommandResult[]` containing results for already-completed commands plus one `aborted` entry. Remaining commands are not represented in results. After abort-induced exit, `_executing` is set to `false` so subsequent calls work normally.

- Uses `this.component` (no `component` parameter)
- Resets `_aborted = false` only on actual execution start (not on reentrancy rejection)
- Iterates commands in AI-returned order
- Before each iteration, checks `_aborted`; if `true`, pushes `{ status: 'aborted', message: defaultAbortedMessage }` and breaks
- For each command: finds matching `GridCommand` by `name`, calls `execute(this.component, { success, failure })` to get executor, then calls `executor(args)`
- If command name is unknown (defensive), records `failure('Unknown command: <name>')` and continues
- Awaits each command before proceeding to next
- If executor throws, catches and records `failure(<error message>)`
- If `customizeResponseText` is provided, applies message override per command after execution (see Message Customization section below)
- Returns `CommandResult[]` on success or abort; throws if called concurrently

**Acceptance criteria:**
- [ ] Uses `this.component` (no `component` parameter)
- [ ] Resets `_aborted` to `false` only on actual execution start (not on reentrancy rejection)
- [ ] Executes commands in the order provided in `commands` array
- [ ] Each command is awaited before the next one starts
- [ ] Returns one `CommandResult` per executed command (plus one `aborted` entry if aborted)
- [ ] A throwing executor produces `CommandResult` with `status: 'failure'` and the error message
- [ ] An async executor that rejects produces `CommandResult` with `status: 'failure'`
- [ ] Unknown command name (defensive) produces `CommandResult` with `status: 'failure'` and message containing the command name
- [ ] Returns empty array for empty `commands`
- [ ] If called while another `executeCommands` is in progress, throws an error
- [ ] After the first call completes, subsequent calls work normally
- [ ] Commands that succeed have `status: 'success'`; commands that fail have `status: 'failure'`
- [ ] `abort()` called during execution → results contain completed commands + one `{ status: 'aborted' }` entry, then stops
- [ ] `abort()` called before first command executes → returns `[{ status: 'aborted', message: ... }]`
- [ ] `_aborted` is reset only on actual execution start, so a previous `abort()` does not affect the next successful call
- [ ] A concurrent call rejected by reentrancy guard does **not** reset `_aborted`
- [ ] `_executing` is set to `false` after abort-induced exit
- [ ] Only one `aborted` result is added (for the first skipped command); remaining commands are not represented
- [ ] Without `customizeResponseText`, all messages are defaults from command executors
- [ ] `customizeResponseText` is called once per executed command with correct `commandName` and `commandArgs`
- [ ] `customizeResponseText` returning `{ success: 'X', failure: 'Y' }` replaces the message for the matching status
- [ ] `customizeResponseText` returning `{ success: 'X' }` only replaces message when status is `'success'`; `'failure'` stays default
- [ ] `customizeResponseText` returning `undefined` leaves the default message unchanged
- [ ] `customizeResponseText` is not called for the `aborted` entry or for commands skipped by abort
- [ ] `customizeResponseText` is not called for commands that were not executed (e.g. validation failed)

### Message Customization

Users can provide a `customizeResponseText` callback to override default success/failure messages per command.

#### Type

```typescript
type CommandMessages = {
  success: string;
  failure: string;
};

type CustomizeResponseText = (
  commandName: string,
  commandArgs: Record<string, unknown>,
) => Partial<CommandMessages> | undefined;
```

#### Usage

`customizeResponseText` is passed to `GridCommands` (e.g. via constructor or `executeCommands` options). For each executed command, if provided, it is called with the command name and args. The callback can:

- Return `{ success, failure }` — overrides both messages
- Return `{ success }` or `{ failure }` — overrides only specified, keeps default for the other
- Return `undefined` — uses default messages

> **Note:** `customizeResponseText` can override any message, including diagnostic failure messages set by the command executor (e.g. `'Column "foo" does not exist'`). This is by design — the consumer takes full responsibility for the content of overridden messages. If preserving diagnostic detail is important, the callback should return `undefined` for commands whose failure messages should not be altered.

#### Example

```typescript
customizeResponseText: (commandName, commandArgs) => {
  switch (commandName) {
    case 'filtering':
      return {
        success: `Successfully filtered ${commandArgs.dataField}`,
        failure: `Failed to filter ${commandArgs.dataField}`,
      };
    case 'sorting': {
      return {
        success: `Successfully sorted ${commandArgs.dataField}`,
      };
    }
    default:
      return undefined;
  }
}
```

#### Integration in `executeCommands`

```typescript
// Inside GridCommands.executeCommands:
for (const { name, args } of commands) {
  if (this._aborted) {
    results.push({ status: 'aborted', message: defaultAbortedMessage });
    break;
  }

  const executor = command.execute(this.component, callbacks);
  const result = await executor(args);

  // Apply message customization
  const customMessages = customizeResponseText?.(name, args);

  if (isDefined(customMessages?.[result.status])) {
      result.message = customMessages[result.status];
  }

  results.push(result);
}
```

---

## Command Specifications

### Sorting (`sorting.ts`)

#### `sorting`

- **Description:** Apply sorting to one or more columns
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `columnsController.columnOption(dataField, 'sortOrder', sortOrder)` for each column
- **Success message:** TODO
- **Failure message:** TODO

#### `clearSorting`

- **Description:** Remove all sorting
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `columnsController.columnOption(i, 'sortOrder', undefined)` for each column
- **Success message:** TODO
- **Failure message:** TODO

---

### Filtering (`filtering.ts`)

#### `filterValue`

- **Description:** Apply a filter expression
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `component.option('filterValue', value)`
- **Success message:** TODO
- **Failure message:** TODO

#### `clearFilter`

- **Description:** Clear all filters
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `dataController.clearFilter()`
- **Success message:** TODO
- **Failure message:** TODO

#### `searching`

- **Description:** Set search panel text
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `component.option('searchPanel.text', value)`
- **Success message:** TODO
- **Failure message:** TODO

---

### Grouping (`grouping.ts`)

#### `grouping`

- **Description:** Group by one or more columns
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `columnsController.columnOption(dataField, 'groupIndex', index)` for each column
- **Success message:** TODO
- **Failure message:** TODO

---

### Paging (`paging.ts`)

#### `page`

- **Description:** Navigate to a specific page
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `dataController.pageIndex(index)`
- **Success message:** TODO
- **Failure message:** TODO

#### `pageSize`

- **Description:** Change the page size
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `dataController.pageSize(size)`
- **Success message:** TODO
- **Failure message:** TODO

#### `groupPaging`

- **Description:** Navigate group paging
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** TODO
- **Success message:** TODO
- **Failure message:** TODO

---

### Selection (`selection.ts`)

#### `selectByKeys`

- **Description:** Select rows by key values
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `selectionController.selectRows(keys, preserve)`
- **Success message:** TODO
- **Failure message:** TODO

#### `selectByIndexes`

- **Description:** Select rows by row indexes
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `selectionController.selectRowsByIndexes(indexes)`
- **Success message:** TODO
- **Failure message:** TODO

#### `selectAll`

- **Description:** Select all rows
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `selectionController.selectAll()`
- **Success message:** TODO
- **Failure message:** TODO

#### `deselectAll`

- **Description:** Deselect all rows
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `selectionController.deselectAll()`
- **Success message:** TODO
- **Failure message:** TODO

#### `clearSelection`

- **Description:** Clear selection
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `selectionController.clearSelection()`
- **Success message:** TODO
- **Failure message:** TODO

---

### Columns (`columns.ts`)

#### `columnsVisibility`

- **Description:** Show or hide columns
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `columnsController.columnOption(dataField, 'visible', value)` for each column
- **Success message:** TODO
- **Failure message:** TODO

#### `columnsReorder`

- **Description:** Reorder columns
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `columnsController.columnOption(dataField, 'visibleIndex', index)` for each column
- **Success message:** TODO
- **Failure message:** TODO

#### `columnsPinning`

- **Description:** Pin/unpin columns
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `columnsController.columnOption(dataField, { fixed, fixedPosition })` for each column
- **Success message:** TODO
- **Failure message:** TODO

#### `columnsResize`

- **Description:** Resize columns
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `columnsController.columnOption(dataField, 'width', value)` for each column
- **Success message:** TODO
- **Failure message:** TODO

---

### Summary (`summary.ts`)

#### `summary`

- **Description:** Configure summary items
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `component.option('summary', value)`
- **Success message:** TODO
- **Failure message:** TODO

#### `clearSummary`

- **Description:** Remove all summary items
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `component.option('summary', {})`
- **Success message:** TODO
- **Failure message:** TODO

---

### Focus (`focus.ts`)

#### `rowFocusing`

- **Description:** Focus a specific row
- **Args schema:**
  ```json
  TODO
  ```
- **Execute:** `component.option('focusedRowKey', key)` + `focusController.navigateToRow(key)`
- **Success message:** TODO
- **Failure message:** TODO

---

## Integration with AIAssistantIntegrationController
  ```json
  TODO
  ```

In `ai_assistant_integration_controller.ts`:

1. Instantiate `GridCommands` with `this.component` and full command list
2. `buildContext()` — implemented directly on the controller (not delegated to `gridCommands`)
3. `buildResponseSchema()` → `gridCommands.buildResponseSchema()`
4. In `onComplete` callback:
   - `gridCommands.validateResponse(response)` → if `false`, return failure text
   - `const results = await gridCommands.executeCommands(response.actions, customizeResponseText)`
   - Use `results` directly to render response message in chat (handle `aborted` status entries appropriately)
5. In `abortRequest()`:
   - Call existing `this.abort?.()` to abort LLM request
   - Call `this.gridCommands?.abort()` to abort in-progress command execution
6. Add `isExecutingCommands()` method:
   - Returns `this.gridCommands?.isExecuting ?? false`
7. Wire popup `onHidden` to call `abortRequest()` so closing the chat aborts both LLM and command execution

### `buildContext(): Record<string, unknown>`

Implemented on `AIAssistantIntegrationController`, not on `GridCommands`. The controller already owns `this.component` and is the orchestration layer between the grid and the AI. This keeps `GridCommands` focused on schema building, validation, and execution.

Collects current grid state from `this.component`:

- **columns** — all columns (including hidden) with: `dataField`, `caption`, `dataType`, `visible`, `sortOrder`, `sortIndex`, `groupIndex`, `filterValue`, `fixed`, `fixedPosition`, `width`, `visibleIndex`
- **filtering** — current `filterValue`, `filterPanel` state
- **paging** — `pageIndex`, `pageSize`, `totalCount`
- **search** — current search text
- **selection** — selected keys
- **summary** — current summary configuration

**Acceptance criteria:**
- [ ] Uses `this.component` (no `component` parameter)
- [ ] Returns an object containing all listed state categories
- [ ] `columns` includes all columns (both visible and hidden) with their `visible` flag
- [ ] `columns` includes all listed properties for each column
- [ ] `paging` reflects current `pageIndex`, `pageSize`, and `totalCount`
- [ ] `search` reflects current search panel text (empty string if none)
- [ ] `selection` reflects currently selected keys (empty array if none)
- [ ] `summary` reflects current summary configuration (empty if none)
- [ ] Context updates correctly after grid state changes

---

## Out of Scope (Future Iterations)

The following items are intentionally deferred and should be addressed when custom (user-defined) commands are supported:

For next iteration, we might consider:
- **Structured validation errors:** `validateResponse` currently returns a bare `boolean`. For production debugging, a structured result like `{ valid: boolean; errors: ValidationError[] }` would help explain *why* validation failed. Acceptable for v1 since the controller shows a generic failure message.
- **Schema versioning:** No `schemaVersion` field or graceful degradation for unknown commands. If commands are added/removed between versions and the LLM provider caches tool definitions, stale schemas will hard-fail at validation. Low risk for v1 since `buildResponseSchema()` is called dynamically per request.
- **Mid-command abort:** Abort is only checked between commands. If a single command executor is long-running (e.g. `selectAll` on a large dataset), it cannot be interrupted mid-execution. A future iteration could pass an `AbortSignal` to `CommandExecutor` so individual commands can cooperatively check for cancellation.
- **Command executor return shape validation:** Currently, all built-in command executors are guaranteed to return a valid `CommandResult` (`{ status, message }`). When custom commands are allowed, `executeCommands` should defensively validate the executor's return value. We must agree how to treat malformed results.
- **Per-command timeouts:** No timeout mechanism for individual command executors. A misbehaving executor could hang indefinitely.
- **Actions array length limit:** No cap on the number of actions in a response.
- **No input sanitization on args.** LLM-generated args are passed directly to `component.option()` and `columnOption()`. If `dataField` contains a crafted value, could it access unintended columns or trigger injection? The spec should note that args must be validated against actual grid state (e.g., `dataField` must match an existing column).

We consider these as excessive:
- **No rollback on partial failure.** If action 3 of 5 fails, actions 1–2 have already mutated the grid. There's no mention of whether this is acceptable or whether a transaction/rollback mechanism is needed.
- **No allowlist for option paths.** `component.option('searchPanel.text', value)` uses a string path — if this pattern is generalized, an LLM could set arbitrary options.

---

## Implementation Order

1. `types.ts` — interfaces
2. `grid_commands.ts` — class skeleton with `buildResponseSchema`, `validateResponse`, `executeCommands`
3. Tests for `GridCommands` class
4. Commands one by one (each includes schema + execute + tests):
   1. `sorting.ts` (sorting, clearSorting)
   2. `filtering.ts` (filterValue, clearFilter, searching)
   3. `grouping.ts`
   4. `paging.ts` (page, pageSize, groupPaging)
   5. `selection.ts` (selectByKeys, selectByIndexes, selectAll, deselectAll, clearSelection)
   6. `columns.ts` (columnsVisibility, columnsReorder, columnsPinning, columnsResize)
   7. `summary.ts` (summary, clearSummary)
   8. `focus.ts` (rowFocusing)
5. Wire into `AIAssistantIntegrationController`
6. Integration tests covering end-to-end flow with mocked AI responses
