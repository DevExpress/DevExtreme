import { h, createRef } from 'preact';
import { mount, shallow } from 'enzyme';
import ScrollView, { viewFunction, Location } from '../../js/renovation/scroll-view';
import Widget from '../../js/renovation/widget';

describe('ScrollView', () => {
  describe('Render', () => {
    it('should render scrollable content', () => {
      const scrollView = shallow(viewFunction({ props: { } } as any) as any);
      const scrollViewContent = scrollView.find('.dx-scrollable-wrapper .dx-scrollable-container .dx-scrollable-content');
      expect(scrollViewContent.exists()).toBe(true);
    });

    it('should render slot', () => {
      const props = {
        props: { children: <div className="content" /> },
      } as Partial<ScrollView>;
      const scrollView = shallow(viewFunction(props as any) as any);
      expect(scrollView.find('.dx-scrollable-content .content').exists()).toBe(true);
    });

    it('should pass all necessary properties to the Widget', () => {
      const cssClasses = 'dx-scrollview';
      const props = {
        props: {
          width: '120px',
          height: '300px',
          rtlEnabled: true,
          disabled: true,
        },
        cssClasses,
      } as Partial<ScrollView>;
      const scrollView = mount(viewFunction(props as any) as any);

      expect(scrollView.find(Widget).props()).toMatchObject({
        classes: cssClasses,
        ...props.props,
      });
    });

    it('should scrollable content has the ref', () => {
      const contentRef = createRef();
      const props = {
        props: {},
        contentRef,
      } as Partial<ScrollView>;
      const scrollView = mount(viewFunction(props as any) as any);
      expect(scrollView.find('.dx-scrollable-content').instance()).toBe(contentRef.current);
    });
  });

  describe('Behavior', () => {
    describe('Methods', () => {
      describe('Content', () => {
        it('should get the content of the widget', () => {
          const scrollView = new ScrollView({});
          const content = { };
          scrollView.contentRef = content as any;
          expect(scrollView.content()).toMatchObject(content);
        });
      });

      describe('ScrollBy', () => {
        it('should scroll by distance in the vertical direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 0 };
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as any;

          scrollView.scrollBy(100);

          expect(containerRefMock.scrollTop).toEqual(250);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by distance in the horizontal direction', () => {
          const containerRefMock = { scrollLeft: 150, scrollTop: 0 };
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as any;

          scrollView.scrollBy(100);

          expect(containerRefMock.scrollLeft).toEqual(250);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by distance in the both direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 150 };
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as any;

          scrollView.scrollBy(100);

          expect(containerRefMock.scrollTop).toEqual(250);
          expect(containerRefMock.scrollLeft).toEqual(250);
        });

        it('should scroll by distance as object in the vertical direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 0 };
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as any;

          scrollView.scrollBy({ top: 100, left: 70 } as Location);

          expect(containerRefMock.scrollTop).toEqual(250);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by distance as object in the horizontal direction', () => {
          const containerRefMock = { scrollLeft: 150, scrollTop: 0 };
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as any;

          scrollView.scrollBy({ top: 70, left: 100 } as Location);

          expect(containerRefMock.scrollLeft).toEqual(250);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by distance as object in the both direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 150 };
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as any;

          scrollView.scrollBy({ top: 70, left: 70 } as Location);

          expect(containerRefMock.scrollTop).toEqual(220);
          expect(containerRefMock.scrollLeft).toEqual(220);
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssClasses', () => {
        it('should add scrolling classes', () => {
          const { cssClasses } = new ScrollView({});
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollview'));
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable'));
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-native'));
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-native-generic'));
        });

        it('should add vertical direction class', () => {
          const { cssClasses } = new ScrollView({ direction: 'vertical' });
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-vertical'));
        });

        it('should add horizontal direction class', () => {
          const { cssClasses } = new ScrollView({ direction: 'horizontal' });
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-horizontal'));
        });

        it('should add both direction class', () => {
          const { cssClasses } = new ScrollView({ direction: 'both' });
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-both'));
        });
      });
    });

    describe('Default options', () => {
      it('should define rtlEnabled', () => {
        const props = new ScrollViewProps();
        expect(props.rtlEnabled).toEqual(config().rtlEnabled);
      });
    });
  });
});
