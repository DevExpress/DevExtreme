import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView, AllDayPanelLayout } from '../layout';
import { AllDayPanelTableBody } from '../table_body';
import { DefaultSizes } from '../../../../const';

describe('AllDayPanelLayout', () => {
  const viewData: any = {
    groupedData: [{
      allDayPanel: [{
        startDate: new Date(2020, 6, 9),
        endDate: new Date(2020, 6, 10),
        text: '',
        index: 0,
        isFirstGroupCell: false,
        isLastGroupCell: false,
        key: '1',
      }],
      dateTable: [[]],
      groupIndex: 1,
    }],
    cellCountInGroupRow: 1,
    leftVirtualCellWidth: 100,
    rightVirtualCellWidth: 200,
    leftVirtualCellCount: 34,
    rightVirtualCellCount: 44,
  };
  const allDayPanelData = viewData.groupedData[0].allDayPanel;

  describe('Render', () => {
    const render = (viewModel) => shallow(
      <LayoutView
        allDayPanelData={allDayPanelData}
        {...viewModel}
        props={{
          visible: true,
          viewData,
          ...viewModel.props,
        }}
      /> as any,
    );

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render components and pass correct arguments to them', () => {
      const dataCellTemplate = () => null;
      const layout = render({
        classes: 'some-class',
        restAttributes: { style: { height: 500 } },
        emptyTableHeight: 123,
        props: {
          dataCellTemplate,
        },
      });

      expect(layout.hasClass('some-class'))
        .toBe(true);

      const allDayTable = layout.find('.dx-scheduler-all-day-table');

      expect(allDayTable.prop('height'))
        .toBe(123);

      expect(allDayTable.exists())
        .toBe(true);
      expect(allDayTable.hasClass('dx-scheduler-all-day-table'))
        .toBe(true);

      const tableBody = allDayTable.find(AllDayPanelTableBody);

      expect(tableBody.exists())
        .toBe(true);

      expect(tableBody)
        .toHaveLength(1);

      expect(tableBody.props())
        .toMatchObject({
          viewData: allDayPanelData,
          dataCellTemplate,
          leftVirtualCellWidth: 100,
          rightVirtualCellWidth: 200,
          leftVirtualCellCount: 34,
          rightVirtualCellCount: 44,
        });
    });

    it('should not be rendered if "visible" is false', () => {
      const layout = render({ props: { visible: false } });

      const allDayTable = layout.find('.dx-scheduler-all-day-table');
      expect(allDayTable.exists())
        .toBe(false);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('allDayPanelData', () => {
        const layout = new AllDayPanelLayout({ viewData });

        expect(layout.allDayPanelData)
          .toStrictEqual(viewData.groupedData[0].allDayPanel);
      });

      it('emptyTableHeight should not return height if allDayPanel data is present', () => {
        const layout = new AllDayPanelLayout({ viewData });

        expect(layout.emptyTableHeight)
          .toEqual(undefined);
      });

      it('emptyTableHeight should return default height if allDayPanel data is empty', () => {
        const layout = new AllDayPanelLayout({
          viewData: {
            groupedData: [{
              dateTable: [[]],
              allDayPanel: undefined,
              groupIndex: 1,
            }],
            cellCountInGroupRow: 1,
          } as any,
        });

        expect(layout.emptyTableHeight)
          .toEqual(DefaultSizes.allDayPanelHeight);
      });

      describe('classes', () => {
        it('should not add dx-hidden class if "visible" is true', () => {
          const layout = new AllDayPanelLayout({
            className: 'some-class',
            visible: true,
          });

          expect(layout.classes.split(' '))
            .toEqual([
              'dx-scheduler-all-day-panel',
              'some-class',
            ]);
        });

        it('should add dx-hidden class if "visible" is false', () => {
          const layout = new AllDayPanelLayout({
            className: 'some-class',
            visible: false,
          });

          expect(layout.classes.split(' '))
            .toEqual([
              'dx-scheduler-all-day-panel',
              'dx-hidden',
              'some-class',
            ]);
        });
      });
    });
  });
});
