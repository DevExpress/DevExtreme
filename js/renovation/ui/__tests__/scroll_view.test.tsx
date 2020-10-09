import React from 'react';
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
import ScrollView, {
  viewFunction,
  Location,
  ScrollOffset,
  ScrollViewProps,
  ensureLocation,
} from '../scroll_view';
import { Widget } from '../common/widget';

const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';

describe('ScrollView', () => {
  describe('Render', () => {
    it('should render scrollable content', () => {
      const scrollView = shallow(viewFunction({ props: { } } as ScrollView) as JSX.Element);
      const scrollViewContent = scrollView.find('.dx-scrollable-wrapper .dx-scrollable-container .dx-scrollable-content');
      expect(scrollViewContent.exists()).toBe(true);
    });

    it('should render slot', () => {
      const props = {
        props: { children: <div className="content" /> },
      } as Partial<ScrollView>;
      const scrollView = shallow(viewFunction(props as ScrollView) as JSX.Element);
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
      const scrollView = mount(viewFunction(props as ScrollView) as JSX.Element);

      expect(scrollView.find(Widget).props()).toMatchObject({
        classes: cssClasses,
        ...props.props,
      });
    });

    it('should have ref to scrollable content', () => {
      const contentRef = React.createRef();
      const props = {
        props: {},
        contentRef,
      } as any as Partial<ScrollView>;
      const scrollView = mount(viewFunction(props as ScrollView) as JSX.Element);
      expect(scrollView.find('.dx-scrollable-content').instance()).toBe(contentRef.current);
    });

    it('should have ref to scrollable container', () => {
      const containerRef = React.createRef();
      const props = {
        props: {},
        containerRef,
      } as any as Partial<ScrollView>;
      const scrollView = mount(viewFunction(props as ScrollView) as JSX.Element);
      expect(scrollView.find('.dx-scrollable-container').instance()).toBe(containerRef.current);
    });
  });

  describe('Behavior', () => {
    describe('Methods', () => {
      const createElement = ({
        location,
        width = 50,
        height = 50,
        offsetParent = {},
        className = '',
        isInScrollableContent = false,
      }): HTMLElement => {
        const checkSelector = (selector: string): boolean => className.indexOf(selector.replace('.', '')) > -1;
        return {
          offsetHeight: height,
          offsetWidth: width,
          offsetTop: location.top,
          offsetLeft: location.left,
          offsetParent,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          closest: (selector: string): Element | null => (
            isInScrollableContent ? {} as Element : null
          ),
          matches: (selector: string): boolean => checkSelector(selector),
        } as HTMLElement;
      };

      const createContainerRef = (
        location: Partial<Location>,
        hasScrollBars?: boolean,
      ): HTMLDivElement => ({
        scrollTop: location.top,
        scrollLeft: location.left,
        offsetHeight: 300,
        offsetWidth: 300,
        clientWidth: hasScrollBars ? 283 : 300,
      }) as HTMLDivElement;

      const createTargetElement = (args): HTMLElement => {
        const scrollableContent = createElement({
          location: { },
          className: SCROLLABLE_CONTENT_CLASS,
        });
        return createElement({
          ...args,
          ...{ offsetParent: scrollableContent, isInScrollableContent: true },
        });
      };

      describe('Content', () => {
        it('should get the content of the widget', () => {
          const scrollView = new ScrollView({});
          const content = { };
          scrollView.contentRef = content as HTMLDivElement;
          expect(scrollView.content()).toEqual(content);
        });
      });

      describe('ScrollBy', () => {
        it('should scroll by positive distance as number in the vertical direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 0 });
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(100);

          expect(containerRefMock.scrollTop).toEqual(250);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by positive distance as number in the horizontal direction', () => {
          const containerRefMock = createContainerRef({ top: 0, left: 150 });
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(100);

          expect(containerRefMock.scrollLeft).toEqual(250);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by positive distance as number in the both direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 150 });
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(100);

          expect(containerRefMock.scrollTop).toEqual(250);
          expect(containerRefMock.scrollLeft).toEqual(250);
        });

        it('should scroll by positive distance as object in the vertical direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 0 });
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: 100 });

          expect(containerRefMock.scrollTop).toEqual(250);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by positive distance as object in the horizontal direction', () => {
          const containerRefMock = createContainerRef({ top: 0, left: 150 });
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: 70, left: 100 });

          expect(containerRefMock.scrollLeft).toEqual(250);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by positive distance as object in the both direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 150 });
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: 70, left: 70 });

          expect(containerRefMock.scrollTop).toEqual(220);
          expect(containerRefMock.scrollLeft).toEqual(220);
        });

        it('should scroll by negative distance as number in the vertical direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 0 });
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(-50);

          expect(containerRefMock.scrollTop).toEqual(100);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by negative distance as number in the horizontal direction', () => {
          const containerRefMock = createContainerRef({ top: 0, left: 150 });
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(-50);

          expect(containerRefMock.scrollLeft).toEqual(100);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by negative distance as number in the both direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 150 });
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(-50);

          expect(containerRefMock.scrollTop).toEqual(100);
          expect(containerRefMock.scrollLeft).toEqual(100);
        });

        it('should scroll by negative distance as object in the vertical direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 0 });
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: -50, left: 70 });

          expect(containerRefMock.scrollTop).toEqual(100);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by negative distance as object in the horizontal direction', () => {
          const containerRefMock = createContainerRef({ top: 0, left: 150 });
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: 70, left: -50 });

          expect(containerRefMock.scrollLeft).toEqual(100);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by negative distance as object in the both direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 150 });
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: -70, left: -50 });

          expect(containerRefMock.scrollTop).toEqual(80);
          expect(containerRefMock.scrollLeft).toEqual(100);
        });
      });

      describe('ScrollTo', () => {
        it('should scroll to position as number in the vertical direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 0 });
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo(200);

          expect(containerRefMock.scrollTop).toEqual(200);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll position as number in the horizontal direction', () => {
          const containerRefMock = createContainerRef({ top: 0, left: 150 });
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo(200);

          expect(containerRefMock.scrollLeft).toEqual(200);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll position as number in the both direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 150 });
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo(200);

          expect(containerRefMock.scrollTop).toEqual(200);
          expect(containerRefMock.scrollLeft).toEqual(200);
        });

        it('should scroll position as object in the vertical direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 0 });
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo({ top: 100, left: 70 });

          expect(containerRefMock.scrollTop).toEqual(100);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll position as object in the horizontal direction', () => {
          const containerRefMock = createContainerRef({ top: 0, left: 150 });
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo({ top: 70, left: 100 });

          expect(containerRefMock.scrollLeft).toEqual(100);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll position as object in the both direction', () => {
          const containerRefMock = createContainerRef({ top: 150, left: 150 });
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo({ top: 70, left: 70 });

          expect(containerRefMock.scrollTop).toEqual(70);
          expect(containerRefMock.scrollLeft).toEqual(70);
        });
      });

      describe('ScrollToElement', () => {
        const getOffsetValue = (
          name: keyof ScrollOffset,
          offset?,
        ): number => (offset ? offset[name] : 0);

        const offsets = [undefined, {
          left: 10,
          right: 20,
          top: 10,
          bottom: 20,
        }];

        each(offsets).describe('Element is smaller than container. Offset: %o', (offset) => {
          it('should scroll to element from top side by vertical orientation', () => {
            const element = createTargetElement({ location: { top: 20, left: 0 } });
            const containerRef = createContainerRef({ top: 200, left: 0 });
            const scrollView = new ScrollView({ direction: 'vertical' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
            expect(containerRef.scrollLeft).toEqual(0);
          });

          it('should scroll to element from bottom side by vertical orientation', () => {
            const element = createTargetElement({ location: { top: 500, left: 0 } });
            const containerRef = createContainerRef({ top: 100, left: 0 });
            const scrollView = new ScrollView({ direction: 'vertical' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset));
            expect(containerRef.scrollLeft).toEqual(0);
          });

          it('should scroll to element from left side by horizontal orientation', () => {
            const element = createTargetElement({ location: { left: 20, top: 0 } });
            const containerRef = createContainerRef({ left: 200, top: 0 });
            const scrollView = new ScrollView({ direction: 'horizontal' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
            expect(containerRef.scrollTop).toEqual(0);
          });

          it('should scroll to element from right side by horizontal orientation', () => {
            const element = createTargetElement({ location: { left: 500, top: 0 } });
            const containerRef = createContainerRef({ left: 100, top: 0 });
            const scrollView = new ScrollView({ direction: 'horizontal' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset));
            expect(containerRef.scrollTop).toEqual(0);
          });

          it('should scroll to element from left side and top side by both orientation', () => {
            const element = createTargetElement({ location: { left: 20, top: 20 } });
            const containerRef = createContainerRef({ left: 100, top: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
            expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
          });

          it('should scroll to element from right side and top side by both orientation', () => {
            const element = createTargetElement({ location: { left: 500, top: 20 } });
            const containerRef = createContainerRef({ left: 100, top: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(267 + getOffsetValue('right', offset));
            expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
          });

          it('should scroll to element from left side and bottom side by both orientation', () => {
            const element = createTargetElement({ location: { left: 20, top: 500 } });
            const containerRef = createContainerRef({ left: 100, top: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
            expect(containerRef.scrollTop).toEqual(267 + getOffsetValue('bottom', offset));
          });

          it('should scroll to element from right side and bottom side by both orientation', () => {
            const element = createTargetElement({ location: { left: 500, top: 500 } });
            const containerRef = createContainerRef({ left: 100, top: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(267 + getOffsetValue('right', offset));
            expect(containerRef.scrollTop).toEqual(267 + getOffsetValue('bottom', offset));
          });

          it('should do not scroll to an element when it in the visible area', () => {
            const element = createTargetElement({ location: { top: 200, left: 200 } });
            const containerRef = createContainerRef({ top: 100, left: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollTop).toEqual(100);
            expect(containerRef.scrollLeft).toEqual(100);
          });
        });

        /* eslint-disable jest/no-identical-title */
        each(offsets).describe('Element larger than container. Offset: %o', (offset) => {
          it('should scroll to element from top side by vertical orientation', () => {
            const element = createTargetElement({
              location: { top: 20, left: 0 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ top: 200, left: 0 });
            const scrollView = new ScrollView({ direction: 'vertical' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset));
            expect(containerRef.scrollLeft).toEqual(0);
          });

          it('should scroll to element from bottom side by vertical orientation', () => {
            const element = createTargetElement({
              location: { top: 500, left: 0 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ top: 100, left: 0 });
            const scrollView = new ScrollView({ direction: 'vertical' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
            expect(containerRef.scrollLeft).toEqual(0);
          });

          it('should scroll to element from left side by horizontal orientation', () => {
            const element = createTargetElement({
              location: { left: 20, top: 0 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 200, top: 0 });
            const scrollView = new ScrollView({ direction: 'horizontal' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset));
            expect(containerRef.scrollTop).toEqual(0);
          });

          it('should scroll to element from right side by horizontal orientation', () => {
            const element = createTargetElement({
              location: { left: 500, top: 0 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 0 });
            const scrollView = new ScrollView({ direction: 'horizontal' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
            expect(containerRef.scrollTop).toEqual(0);
          });

          it('should scroll to element from left side and top side by both orientation', () => {
            const element = createTargetElement({
              location: { left: 20, top: 20 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(137 + getOffsetValue('right', offset));
            expect(containerRef.scrollTop).toEqual(137 + getOffsetValue('bottom', offset));
          });

          it('should scroll to element from right side and top side by both orientation', () => {
            const element = createTargetElement({
              location: { left: 500, top: 20 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
            expect(containerRef.scrollTop).toEqual(137 + getOffsetValue('bottom', offset));
          });

          it('should scroll to element from left side and bottom side by both orientation', () => {
            const element = createTargetElement({
              location: { left: 20, top: 500 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(137 + getOffsetValue('right', offset));
            expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
          });

          it('should scroll to element from right side and bottom side by both orientation', () => {
            const element = createTargetElement({
              location: { left: 500, top: 500 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
            expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
          });

          it('should do not scroll to an element when it in the visible area', () => {
            const element = createTargetElement({
              location: { left: 200, top: 200 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ top: 100, left: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element, offset);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
            expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
          });
        });
        /* eslint-enable jest/no-identical-title */

        describe('Other scenarios', () => {
          it('it should scroll to element when it is located inside the positioned element', () => {
            const content = createElement({
              location: { },
              className: SCROLLABLE_CONTENT_CLASS,
            });
            const parent = createElement({
              location: { top: 250, left: 250 },
              offsetParent: content,
            });
            const element = createElement({
              location: { top: 200, left: 200 },
              offsetParent: parent,
              isInScrollableContent: true,
            });
            const containerRef = createContainerRef({ top: 100, left: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollTop).toEqual(217);
            expect(containerRef.scrollLeft).toEqual(217);
          });

          it('it should not scroll to element when it is not located inside the scrollable content', () => {
            const element = createElement({ location: { top: 200, left: 200 } });
            const containerRef = createContainerRef({ top: 100, left: 100 }, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollTop).toEqual(100);
            expect(containerRef.scrollLeft).toEqual(100);
          });
        });
      });

      describe('ScrollHeight', () => {
        it('should get height of the scroll content', () => {
          const scrollView = new ScrollView({});
          scrollView.contentRef = { offsetHeight: 300 } as HTMLDivElement;

          expect(scrollView.scrollHeight()).toEqual(300);
        });
      });

      describe('ScrollWidth', () => {
        it('should get width of the scroll content', () => {
          const scrollView = new ScrollView({});
          scrollView.contentRef = { offsetWidth: 400 } as HTMLDivElement;

          expect(scrollView.scrollWidth()).toEqual(400);
        });
      });

      describe('ScrollOffset', () => {
        it('should get scroll offset', () => {
          const scrollView = new ScrollView({});
          const location = { left: 130, top: 560 };
          scrollView.containerRef = createContainerRef(location);

          expect(scrollView.scrollOffset()).toEqual(location);
        });

        it('should get scroll top', () => {
          const scrollView = new ScrollView({});
          scrollView.containerRef = createContainerRef({ left: 130, top: 560 });

          expect(scrollView.scrollTop()).toEqual(560);
        });

        it('should get scroll left', () => {
          const scrollView = new ScrollView({});
          scrollView.containerRef = createContainerRef({ left: 130, top: 560 });

          expect(scrollView.scrollLeft()).toEqual(130);
        });
      });

      describe('ClientHeight', () => {
        it('should get client height of the scroll container', () => {
          const scrollView = new ScrollView({});
          scrollView.containerRef = { clientHeight: 120 } as HTMLDivElement;

          expect(scrollView.clientHeight()).toEqual(120);
        });
      });

      describe('ClientWidth', () => {
        it('should get client width of the scroll container', () => {
          const scrollView = new ScrollView({});
          scrollView.containerRef = { clientWidth: 120 } as HTMLDivElement;

          expect(scrollView.clientWidth()).toEqual(120);
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

    describe('Ensure location', () => {
      it('should convert number type to Location type', () => {
        expect(ensureLocation(350)).toMatchObject({ top: 350, left: 350 });
      });

      it('should return Location type if input type is Location', () => {
        const location = { top: 345, left: 10 };
        expect(ensureLocation(location)).toMatchObject(location);
      });

      it('should fill undefined value with value by default', () => {
        expect(ensureLocation({ top: 100 })).toMatchObject({ top: 100, left: 0 });
        expect(ensureLocation({ left: 100 })).toMatchObject({ left: 100, top: 0 });
        expect(ensureLocation({})).toMatchObject({ top: 0, left: 0 });
      });
    });
  });
});
