import React, { createRef } from 'react';
import { mount } from 'enzyme';
import { InfoText, InfoTextProps, viewFunction as InfoTextComponent } from '../info';
import messageLocalization from '../../../../localization/message';

jest.mock('../../../../localization/message', () => ({
  getFormatter: jest.fn(),
}));

describe('Info, separate view and component approach', () => {
  describe('View', () => {
    it('should render valid markup', () => {
      const ref = createRef<HTMLDivElement>() as any;
      const tree = mount(<InfoTextComponent {...{
        text: 'some text',
        props: { rootElementRef: ref } as Partial<InfoTextProps>,
      } as Partial<InfoText> as any}
      />);
      expect(tree.html())
        .toBe('<div class="dx-info">some text</div>');
      expect(ref.current).not.toBeNull();
    });
  });

  describe('Logic', () => {
    it('text with default infoText', () => {
      (messageLocalization.getFormatter as jest.Mock).mockReturnValue(() => 'Page {0} of {1} ({2} items)');
      const infoText = new InfoText({ pageCount: 20, pageIndex: 5, totalCount: 200 });
      expect(infoText.text).toBe('Page 6 of 20 (200 items)');
      expect(messageLocalization.getFormatter).toBeCalledWith('dxPager-infoText');
    });

    it('text with changed infoText', () => {
      const infoText = new InfoText({
        infoText: 'Page {0} of {1} ({2} items) (custom)', pageCount: 20, pageIndex: 5, totalCount: 200,
      });
      expect(infoText.text).toBe('Page 6 of 20 (200 items) (custom)');
    });
  });
});
