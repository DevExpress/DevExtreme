import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView, AllDayPanelLayout } from '../layout';
import { AllDayPanelTableBody } from '../table_body';
import * as utilsModule from '../../../../utils';

const addHeightToStyle = jest.spyOn(utilsModule, 'addHeightToStyle');

describe('AllDayPanelLayout ', () => {
  const viewData = {
    groupedData: [{
      allDayPanel: [{
        startDate: new Date(2020, 6, 9),
        endDate: new Date(2020, 6, 10),
        text: '',
        index: 0,
      }],
      dateTable: [[]],
    }],
    cellCountInGroupRow: 1,
  };
  const allDayPanelData = viewData.groupedData[0].allDayPanel;

  describe('Render', () => {
    const render = (viewModel) => shallow(
      <LayoutView
        allDayPanelData={allDayPanelData}
        {...viewModel}
        props={{
          visible: true,
          ...viewModel.props,
        }}
      />,
    );

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render components correctly', () => {
      const dataCellTemplate = () => null;
      const style = { height: 100 };
      const layout = render({
        classes: 'some-class',
        style,
        restAttributes: { style: { height: 500 } },
        props: { dataCellTemplate },
      });

      expect(layout.hasClass('some-class'))
        .toBe(true);
      expect(layout.prop('style'))
        .toEqual(style);

      const allDayTable = layout.find('.dx-scheduler-all-day-table');

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

      it('style', () => {
        const layout = new AllDayPanelLayout({ height: 100 });

        expect(layout.style)
          .toStrictEqual({ height: '100px' });
        expect(addHeightToStyle)
          .toHaveBeenCalledTimes(1);
        expect(addHeightToStyle)
          .toHaveBeenCalledWith(100, undefined);
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
