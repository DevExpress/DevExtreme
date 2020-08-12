import React from 'react';
import { createRef } from 'preact';
import { mount, shallow } from 'enzyme';
import config from '../../../core/config';
import ScrollView, {
  viewFunction,
  Location,
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

    it('should scrollable content has the ref', () => {
      const contentRef = createRef();
      const props = {
        props: {},
        contentRef,
      } as Partial<ScrollView>;
      const scrollView = mount(viewFunction(props as ScrollView) as JSX.Element);
      expect(scrollView.find('.dx-scrollable-content').instance()).toBe(contentRef.current);
    });

    it('should scrollable container has the ref', () => {
      const containerRef = createRef();
      const props = {
        props: {},
        containerRef,
      } as Partial<ScrollView>;
      const scrollView = mount(viewFunction(props as ScrollView) as JSX.Element);
      expect(scrollView.find('.dx-scrollable-container').instance()).toBe(containerRef.current);
    });
  });

  describe('Behavior', () => {
    describe('Methods', () => {
      describe('Content', () => {
        it('should get the content of the widget', () => {
          const scrollView = new ScrollView({});
          const content = { };
          scrollView.contentRef = content as HTMLDivElement;
          expect(scrollView.content()).toMatchObject(content);
        });
      });

      describe('ScrollBy', () => {
        it('should scroll by positive distance as number in the vertical direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 0 };
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(100);

          expect(containerRefMock.scrollTop).toEqual(250);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by positive distance as number in the horizontal direction', () => {
          const containerRefMock = { scrollLeft: 150, scrollTop: 0 };
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(100);

          expect(containerRefMock.scrollLeft).toEqual(250);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by positive distance as number in the both direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 150 };
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(100);

          expect(containerRefMock.scrollTop).toEqual(250);
          expect(containerRefMock.scrollLeft).toEqual(250);
        });

        it('should scroll by positive distance as object in the vertical direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 0 };
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: 100, left: 70 } as Location);

          expect(containerRefMock.scrollTop).toEqual(250);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by positive distance as object in the horizontal direction', () => {
          const containerRefMock = { scrollLeft: 150, scrollTop: 0 };
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: 70, left: 100 } as Location);

          expect(containerRefMock.scrollLeft).toEqual(250);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by positive distance as object in the both direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 150 };
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: 70, left: 70 } as Location);

          expect(containerRefMock.scrollTop).toEqual(220);
          expect(containerRefMock.scrollLeft).toEqual(220);
        });

        it('should scroll by negative distance as number in the vertical direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 0 };
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(-50);

          expect(containerRefMock.scrollTop).toEqual(100);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by negative distance as number in the horizontal direction', () => {
          const containerRefMock = { scrollLeft: 150, scrollTop: 0 };
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(-50);

          expect(containerRefMock.scrollLeft).toEqual(100);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by negative distance as number in the both direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 150 };
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy(-50);

          expect(containerRefMock.scrollTop).toEqual(100);
          expect(containerRefMock.scrollLeft).toEqual(100);
        });

        it('should scroll by negative distance as object in the vertical direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 0 };
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: -50, left: 70 } as Location);

          expect(containerRefMock.scrollTop).toEqual(100);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll by negative distance as object in the horizontal direction', () => {
          const containerRefMock = { scrollLeft: 150, scrollTop: 0 };
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: 70, left: -50 } as Location);

          expect(containerRefMock.scrollLeft).toEqual(100);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll by negative distance as object in the both direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 150 };
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollBy({ top: -70, left: -50 } as Location);

          expect(containerRefMock.scrollTop).toEqual(80);
          expect(containerRefMock.scrollLeft).toEqual(100);
        });
      });

      describe('ScrollTo', () => {
        it('should scroll position as number in the vertical direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 0 };
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo(200);

          expect(containerRefMock.scrollTop).toEqual(200);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll position as number in the horizontal direction', () => {
          const containerRefMock = { scrollLeft: 150, scrollTop: 0 };
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo(200);

          expect(containerRefMock.scrollLeft).toEqual(200);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll position as number in the both direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 150 };
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo(200);

          expect(containerRefMock.scrollTop).toEqual(200);
          expect(containerRefMock.scrollLeft).toEqual(200);
        });

        it('should scroll position as object in the vertical direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 0 };
          const scrollView = new ScrollView({ direction: 'vertical' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo({ top: 100, left: 70 } as Location);

          expect(containerRefMock.scrollTop).toEqual(100);
          expect(containerRefMock.scrollLeft).toEqual(0);
        });

        it('should scroll position as object in the horizontal direction', () => {
          const containerRefMock = { scrollLeft: 150, scrollTop: 0 };
          const scrollView = new ScrollView({ direction: 'horizontal' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo({ top: 70, left: 100 } as Location);

          expect(containerRefMock.scrollLeft).toEqual(100);
          expect(containerRefMock.scrollTop).toEqual(0);
        });

        it('should scroll position as object in the both direction', () => {
          const containerRefMock = { scrollTop: 150, scrollLeft: 150 };
          const scrollView = new ScrollView({ direction: 'both' });
          scrollView.containerRef = containerRefMock as HTMLDivElement;

          scrollView.scrollTo({ top: 70, left: 70 } as Location);

          expect(containerRefMock.scrollTop).toEqual(70);
          expect(containerRefMock.scrollLeft).toEqual(70);
        });
      });

      describe('ScrollToElement', () => {
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
          location: Location,
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

        describe('Element less than container', () => {
          it('should scroll to element from top side by vertical orientation', () => {
            const element = createTargetElement({ location: { top: 20, left: 0 } });
            const containerRef = createContainerRef({ top: 200, left: 0 } as Location);
            const scrollView = new ScrollView({ direction: 'vertical' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollTop).toEqual(element.offsetTop);
            expect(containerRef.scrollLeft).toEqual(0);
          });

          it('should scroll to element from bottom side by vertical orientation', () => {
            const element = createTargetElement({ location: { top: 500, left: 0 } });
            const containerRef = createContainerRef({ top: 100, left: 0 } as Location);
            const scrollView = new ScrollView({ direction: 'vertical' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollTop).toEqual(250);
            expect(containerRef.scrollLeft).toEqual(0);
          });

          it('should scroll to element from left side by horizontal orientation', () => {
            const element = createTargetElement({ location: { left: 20, top: 0 } });
            const containerRef = createContainerRef({ left: 200, top: 0 } as Location);
            const scrollView = new ScrollView({ direction: 'horizontal' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(0);
          });

          it('should scroll to element from right side by horizontal orientation', () => {
            const element = createTargetElement({ location: { left: 500, top: 0 } });
            const containerRef = createContainerRef({ left: 100, top: 0 } as Location);
            const scrollView = new ScrollView({ direction: 'horizontal' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(250);
            expect(containerRef.scrollTop).toEqual(0);
          });

          it('should scroll to element from left side and top side by both orientation', () => {
            const element = createTargetElement({ location: { left: 20, top: 20 } });
            const containerRef = createContainerRef({ left: 100, top: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(element.offsetTop);
          });

          it('should scroll to element from right side and top side by both orientation', () => {
            const element = createTargetElement({ location: { left: 500, top: 20 } });
            const containerRef = createContainerRef({ left: 100, top: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(267);
            expect(containerRef.scrollTop).toEqual(element.offsetTop);
          });

          it('should scroll to element from left side and bottom side by both orientation', () => {
            const element = createTargetElement({ location: { left: 20, top: 500 } });
            const containerRef = createContainerRef({ left: 100, top: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(267);
          });

          it('should scroll to element from right side and bottom side by both orientation', () => {
            const element = createTargetElement({ location: { left: 500, top: 500 } });
            const containerRef = createContainerRef({ left: 100, top: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(267);
            expect(containerRef.scrollTop).toEqual(267);
          });

          it('should do not scroll to an element when it in the visible area', () => {
            const element = createTargetElement({ location: { top: 200, left: 200 } });
            const containerRef = createContainerRef({ top: 100, left: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollTop).toEqual(100);
            expect(containerRef.scrollLeft).toEqual(100);
          });

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
            const containerRef = createContainerRef({ top: 100, left: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollTop).toEqual(217);
            expect(containerRef.scrollLeft).toEqual(217);
          });

          it('it should not scroll to element when it is not located inside the scrollable content', () => {
            const element = createElement({ location: { top: 200, left: 200 } });
            const containerRef = createContainerRef({ top: 100, left: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollTop).toEqual(100);
            expect(containerRef.scrollLeft).toEqual(100);
          });
        });

        describe('Element larger than container', () => {
          it('should scroll to element from top side by vertical orientation', () => {
            const element = createTargetElement({
              location: { top: 20, left: 0 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ top: 200, left: 0 } as Location);
            const scrollView = new ScrollView({ direction: 'vertical' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollTop).toEqual(element.offsetTop);
            expect(containerRef.scrollLeft).toEqual(0);
          });

          it('should scroll to element from bottom side by vertical orientation', () => {
            const element = createTargetElement({
              location: { top: 500, left: 0 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ top: 100, left: 0 } as Location);
            const scrollView = new ScrollView({ direction: 'vertical' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollTop).toEqual(element.offsetTop);
            expect(containerRef.scrollLeft).toEqual(0);
          });

          it('should scroll to element from left side by horizontal orientation', () => {
            const element = createTargetElement({
              location: { left: 20, top: 0 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 200, top: 0 } as Location);
            const scrollView = new ScrollView({ direction: 'horizontal' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(0);
          });

          it('should scroll to element from right side by horizontal orientation', () => {
            const element = createTargetElement({
              location: { left: 500, top: 0 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 0 } as Location);
            const scrollView = new ScrollView({ direction: 'horizontal' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(0);
          });

          it('should scroll to element from left side and top side by both orientation', () => {
            const element = createTargetElement({
              location: { left: 20, top: 20 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(element.offsetTop);
          });

          it('should scroll to element from right side and top side by both orientation', () => {
            const element = createTargetElement({
              location: { left: 500, top: 20 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(element.offsetTop);
          });

          it('should scroll to element from left side and bottom side by both orientation', () => {
            const element = createTargetElement({
              location: { left: 20, top: 500 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(element.offsetTop);
          });

          it('should scroll to element from right side and bottom side by both orientation', () => {
            const element = createTargetElement({
              location: { left: 500, top: 500 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ left: 100, top: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(element.offsetTop);
          });

          it('should do not scroll to an element when it in the visible area', () => {
            const element = createTargetElement({
              location: { left: 200, top: 200 },
              width: 400,
              height: 400,
            });
            const containerRef = createContainerRef({ top: 100, left: 100 } as Location, true);
            const scrollView = new ScrollView({ direction: 'both' } as ScrollViewProps);
            scrollView.containerRef = containerRef;
            scrollView.scrollToElement(element);

            expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            expect(containerRef.scrollTop).toEqual(element.offsetTop);
          });
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

    describe('Ensure location', () => {
      it('should convert number type to Location type', () => {
        expect(ensureLocation(350)).toMatchObject({ top: 350, left: 350 } as Location);
      });

      it('should return Location type if input type is Location', () => {
        const location = { top: 345, left: 10 } as Location;
        expect(ensureLocation(location)).toMatchObject(location);
      });

      it('should to fill undefined value with value by default', () => {
        expect(ensureLocation({ top: 100 } as Location)).toMatchObject({ top: 100, left: 0 });
        expect(ensureLocation({ left: 100 } as Location)).toMatchObject({ left: 100, top: 0 });
        expect(ensureLocation({} as Location)).toMatchObject({ top: 0, left: 0 });
      });
    });
  });
});
