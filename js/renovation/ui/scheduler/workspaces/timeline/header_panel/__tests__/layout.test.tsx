import React from 'react';
import { shallow } from 'enzyme';
import {
  viewFunction as LayoutView,
} from '../layout';
import { HORIZONTAL_GROUP_ORIENTATION } from '../../../../consts';
import { TimelineDateHeaderLayout } from '../date_header/layout';
import { DateHeaderData } from '../../../types';

describe('TimelineHeaderPanelLayout', () => {
  describe('Render', () => {
    const dateHeaderData: DateHeaderData = {
      dataMap: [[]],
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      leftVirtualCellWidth: 0,
      rightVirtualCellWidth: 0,
    };
    const baseProps = {
      dateHeaderData,
      groupOrientation: HORIZONTAL_GROUP_ORIENTATION,
      groups: [],
      groupByDate: false,
      groupPanelCellBaseColSpan: 5,
      columnCountPerGroup: 15,
      isRenderDateHeader: true,
      resourceCellTemplate: () => null,
      dateCellTemplate: () => null,
      timeCellTemplate: () => null,
    };

    const render = (viewModel) => shallow(
      <LayoutView
        {...viewModel}
        props={{
          ...baseProps,
          ...viewModel.props,
        }}
      />,
    );

    it('should pass correct props to base Header Layout', () => {
      const layout = render({});

      expect(layout.props())
        .toMatchObject({
          ...baseProps,
          dateHeaderTemplate: TimelineDateHeaderLayout,
        });
    });
  });
});
