import { h } from 'preact';
import { mount } from 'enzyme';
import {
  viewFunction as LayoutView,
  DateTableLayoutBase,
} from '../layout';
import { Table } from '../../table';
import { VirtualTable } from '../../virtual_table';
import { DateTableBody } from '../table_body';

jest.mock('devextreme-generator/component_declaration/common', () => ({
  ...require.requireActual('devextreme-generator/component_declaration/common'),
  Fragment: ({ children }) => <div>{children}</div>,
}));
jest.mock('../table_body', () => ({
  DateTableBody: () => null,
}));

describe('DateTableLayoutBase', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30), groups: 1 }],
          [{ startDate: new Date(2020, 6, 9, 0, 30), endDate: new Date(2020, 6, 9, 1), groups: 2 }],
        ],
      }],
    };
    const cellTemplate = () => null;

    const render = (viewModel) => mount(LayoutView({
      ...viewModel,
      props: {
        cellTemplate,
        viewData,
        ...viewModel.props,
      },
    }) as any).childAt(0).childAt(0);

    afterEach(() => jest.resetAllMocks());

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(layout.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render table', () => {
      const layout = render({});

      expect(layout.find(Table).exists())
        .toBe(true);

      const tableBody = layout.find(DateTableBody);
      expect(tableBody.exists())
        .toBe(true);
      expect(tableBody.props())
        .toMatchObject({
          viewData,
          cellTemplate,
        });
    });

    it('should render virtual table', () => {
      const layout = render({ isVirtual: true });

      expect(layout.find(VirtualTable).exists())
        .toBe(true);

      const tableBody = layout.find(DateTableBody);
      expect(tableBody.exists())
        .toBe(true);
      expect(tableBody.props())
        .toMatchObject({
          viewData,
          cellTemplate,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('isVirtual', () => {
        [true, false].forEach((isVirtual) => {
          it(`should get correct virtual flag if isVirtual=${isVirtual}`, () => {
            const layout = new DateTableLayoutBase({ viewData: { groupedData: [], isVirtual } });

            expect(layout.isVirtual)
              .toBe(isVirtual);
          });
        });
      });
    });
  });
});
