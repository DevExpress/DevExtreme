import * as React from 'react';
import { __collectChildren } from '../collect-nested';

export const ColumnProps: {
  column?: string;
} = {
  column: 'Default ColumnField',
};

export const Column: React.FunctionComponent<typeof ColumnProps> & {
  propName: string;
} = () => null;
Column.propName = 'columns';
Column.defaultProps = ColumnProps;

export const RowProps: {
  row?: string;
} = {
  row: 'Default RowField',
};

export const Row: React.FunctionComponent<typeof RowProps> & {
  propName: string;
} = () => null;
Row.propName = 'rows';
Row.defaultProps = RowProps;

describe('collectChildren', () => {
  test('1st level', () => {
    const nestedProps = __collectChildren(<Column column="columnField" />);
    const desiredProps = {
      columns: [{
        column: 'columnField',
      },
      ],
    };
    expect(nestedProps).toEqual(desiredProps);
  });

  test('1st level default', () => {
    const nestedProps = __collectChildren(<Column />);
    const desiredProps = {
      columns: [{
        column: 'Default ColumnField',
      },
      ],
    };
    expect(nestedProps).toEqual(desiredProps);
  });

  test('1+2 defined', () => {
    const nestedProps = __collectChildren(
      <Column column="columnField">
        <Row row="rowField" />
      </Column>,
    );
    const desiredProps = {
      columns: [{
        column: 'columnField',
        rows: [{ row: 'rowField' }],
      },
      ],
    };
    expect(nestedProps).toEqual(desiredProps);
  });

  test('1 defined, 2 default', () => {
    const nestedProps = __collectChildren(
      <Column column="columnField">
        <Row />
      </Column>,
    );
    const desiredProps = {
      columns: [{
        column: 'columnField',
        rows: [{ row: 'Default RowField' }],
      },
      ],
    };
    expect(nestedProps).toEqual(desiredProps);
  });

  test('1+2 default', () => {
    const nestedProps = __collectChildren(
      <Column>
        <Row />
      </Column>,
    );
    const desiredProps = {
      columns: [{
        column: 'Default ColumnField',
        rows: [{ row: 'Default RowField' }],
      },
      ],
    };
    expect(nestedProps).toEqual(desiredProps);
  });

  test('1 default, 2 defined + default', () => {
    const nestedProps = __collectChildren(
      <Column>
        <Row row="rowField" />
        <Row />
      </Column>,
    );
    const desiredProps = {
      columns: [{
        column: 'Default ColumnField',
        rows: [
          { row: 'rowField' },
          { row: 'Default RowField' },
        ],
      },
      ],
    };
    expect(nestedProps).toEqual(desiredProps);
  });
});
