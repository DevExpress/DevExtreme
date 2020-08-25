import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView, AllDayPanelLayout } from '../layout';
import { AllDayPanelTableBody } from '../table_body';
import { GroupedViewData } from '../../../../types.d';

describe('AllDayPanelLayout', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [
        { allDayPanel: [{ startDate: new Date(2020, 6, 9, 0) }] },
        { allDayPanel: [{ startDate: new Date(2020, 6, 9, 1) }] },
      ],
    };
    const render = (viewModel) => shallow(<LayoutView {...{
      ...viewModel,
      props: {
        visible: true,
        ...viewModel.props,
        viewData,
      },
    }}
    />);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render correctly', () => {
      const layout = render({ classes: 'some-class' });

      expect(layout.hasClass('some-class'))
        .toBe(true);

      const allDayTable = layout.find('.dx-scheduler-all-day-table');
      expect(allDayTable.exists())
        .toBe(true);

      const tableBodies = allDayTable.find(AllDayPanelTableBody);
      expect(tableBodies.exists())
        .toBe(true);
      expect(tableBodies)
        .toHaveLength(1);
    });

    it('should not be rendered table if hidden', () => {
      const layout = render({ props: { visible: false } });

      const allDayTable = layout.find('.dx-scheduler-all-day-table');
      expect(allDayTable.exists())
        .toBe(false);
    });

    it('should render correct height', () => {
      const layout = render({ style: { height: 100 } });

      expect(layout.prop('style'))
        .toStrictEqual({ height: 100 });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('allDayPanelData', () => {
        const viewData = {
          groupedData: [
            {
              allDayPanel: [{ startDate: new Date(2020, 6, 9, 0) }],
            },
          ],
        } as GroupedViewData;
        const layout = new AllDayPanelLayout({ viewData });

        expect(layout.allDayPanelData)
          .toStrictEqual([{ startDate: new Date(2020, 6, 9, 0) }]);
      });

      it('style', () => {
        const layout = new AllDayPanelLayout({ height: 100 });

        expect(layout.style)
          .toStrictEqual({ height: '100px' });
      });

      describe('classes', () => {
        it('if visible', () => {
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

        it('if hidden', () => {
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
