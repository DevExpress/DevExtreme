import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';
// eslint-disable-next-line spellcheck/spell-checker
import { optionalNullish } from './utils';

const columnsVisibilityCommandSchema = z.object({
  dataField: z.string(),
  visible: z.boolean(),
}).strict();

export const columnsVisibilityCommand = defineGridCommand({
  name: 'columnsVisibility',
  description: 'Show or hide a column.',
  schema: columnsVisibilityCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const columnsController = component.getController('columns');
    const column: Column | undefined = columnsController.columnOption(args.dataField);

    const caption = column?.caption ?? args.dataField;
    const defaultMessage = args.visible
      ? `Display the column "${caption}".`
      : `Hide the column "${caption}".`;

    if (!component.option('columnChooser.enabled')) {
      return Promise.resolve(failure(defaultMessage));
    }

    if (!column || (!args.visible && column.allowHiding === false)) {
      return Promise.resolve(failure(defaultMessage));
    }

    try {
      columnsController.columnOption(column.index, 'visible', args.visible);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

const columnsReorderCommandSchema = z.object({
  dataField: z.string(),
  // eslint-disable-next-line spellcheck/spell-checker
  visibleIndex: z.number().int().nonnegative(),
}).strict();

export const columnsReorderCommand = defineGridCommand({
  name: 'columnsReorder',
  description: 'Move a column to a new visible position. visibleIndex is the 0-based target slot among visible columns. When two columns share the same visibleIndex, the moved column is placed before the existing one in that slot. POSITIONING RULES — always compute from the CURRENT visibleIndex values in the context; the rules below hold regardless of where the moved column currently is. BEFORE: to place a column before a column at visibleIndex N, set visibleIndex=N. AFTER: to place a column after a column at visibleIndex N, ALWAYS set visibleIndex=N+1, never N. FIRST: to move a column to the first position (beginning), set visibleIndex=0. LAST: to move a column to the last position (end), set visibleIndex to the highest visibleIndex among visible columns PLUS ONE (i.e. the count of visible columns); using the last column\'s own visibleIndex is WRONG — it would place the column before the last one. Example: columns are Product(0), Amount(1), Region(2), Sector(3), SaleDate(4), Customer(5). To move Product after SaleDate (between SaleDate and Customer), set visibleIndex=5. To move Amount to the last position, set visibleIndex=6 (not 5). SWAP RULE: when the user asks to swap, exchange, switch, or replace the positions of two columns, return exactly two columnsReorder actions built from the columns\' CURRENT visibleIndex values in the context, with no +1 adjustment: first move the column with the SMALLER visibleIndex to the other column\'s visibleIndex, then move the column with the LARGER visibleIndex to the first column\'s original visibleIndex. The action order matters. Example: with Product(0), Amount(1), Region(2), to swap Region and Product return [{dataField: "Product", visibleIndex: 2}, {dataField: "Region", visibleIndex: 0}].',
  schema: columnsReorderCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const columnsController = component.getController('columns');
    const column: Column | undefined = columnsController.columnOption(args.dataField);

    const caption = column?.caption ?? args.dataField;
    // Render position as 1-based for the user-facing message
    const defaultMessage = `Move the column "${caption}" to position ${args.visibleIndex + 1}.`;

    const reorderingAllowed = !!component.option('allowColumnReordering') && !!column?.allowReordering;

    if (!reorderingAllowed) {
      return Promise.resolve(failure(defaultMessage));
    }

    try {
      columnsController.columnOption(column.index, 'visibleIndex', args.visibleIndex);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

const columnsPinningCommandSchema = z.object({
  dataField: z.string(),
  fixed: z.boolean(),
  // eslint-disable-next-line spellcheck/spell-checker
  fixedPosition: optionalNullish(z.enum(['left', 'right'])),
}).strict();

export const columnsPinningCommand = defineGridCommand({
  name: 'columnsPinning',
  description: 'Pin a column to the left or right edge, or unpin it. fixedPosition is optional: when omitted with fixed=true, the grid resolves it to "left" for LTR layouts and "right" for RTL. Ignored when fixed=false.',
  schema: columnsPinningCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const columnsController = component.getController('columns');
    const column: Column | undefined = columnsController.columnOption(args.dataField);

    const caption = column?.caption ?? args.dataField;
    const defaultMessage = args.fixed
      ? `Fix the column "${caption}".`
      : `Unfix the column "${caption}".`;

    const fixingAllowed = !!component.option('columnFixing.enabled') && !!column?.allowFixing;

    if (!fixingAllowed) {
      return Promise.resolve(failure(defaultMessage));
    }

    try {
      columnsController.columnOption(column.index, {
        fixed: args.fixed,
        fixedPosition: args.fixed ? args.fixedPosition : undefined,
      });

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

const columnsResizeCommandSchema = z.object({
  dataField: z.string(),
  width: z.union([z.number(), z.string()]),
}).strict();

export const columnsResizeCommand = defineGridCommand({
  name: 'columnsResize',
  description: 'Resize a column. Pass a number for pixel width, or a string for CSS dimensions ("auto", "50%", "120px").',
  schema: columnsResizeCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const columnsController = component.getController('columns');
    const column: Column | undefined = columnsController.columnOption(args.dataField);

    const caption = column?.caption ?? args.dataField;
    const defaultMessage = `Change the "${caption}" column width to ${args.width}.`;

    const resizingAllowed = !!component.option('allowColumnResizing') && !!column?.allowResizing;

    if (!resizingAllowed) {
      return Promise.resolve(failure(defaultMessage));
    }

    try {
      columnsController.columnOption(column.index, 'width', args.width);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});
