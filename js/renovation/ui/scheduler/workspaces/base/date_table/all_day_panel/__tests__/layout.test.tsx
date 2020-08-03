import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView, AllDayPanelLayout } from '../layout';
import { AllDayPanelTitle } from '../title';
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
    />).childAt(0);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render correctly', () => {
      const layout = render({ props: { visible: true } });

      expect(layout.is('.dx-scheduler-all-day-panel'))
        .toBe(true);
      expect(layout.find(AllDayPanelTitle).exists())
        .toBe(true);

      const allDayTable = layout.find('div > .dx-scheduler-all-day-table');
      expect(allDayTable.exists())
        .toBe(true);

      const tableBodies = allDayTable.find(AllDayPanelTableBody);
      expect(tableBodies.exists())
        .toBe(true);
      expect(tableBodies)
        .toHaveLength(1);
    });

    it('should not be rendered if hidden', () => {
      const layout = render({ props: { visible: false } });

      expect(layout)
        .toHaveLength(0);
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
    });
  });
});
