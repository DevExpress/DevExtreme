import React, { createRef } from 'react';
import { shallow } from 'enzyme';
import { TextSvgElement, viewFunction as TextSvgComponent } from '../svg_text';
import * as utilsModule from '../utils';

describe('TextSvgElement', () => {
  describe('View', () => {
    const textRef = createRef();
    const commonProps = {
      strokeWidth: 2,
      fill: 'red',
      stroke: '#ffaa66',
      strokeOpacity: 0.9,
      opacity: 0.8,
    };

    const getProps = (text) => ({
      text,
      x: 10,
      y: 20,
      ...commonProps,
    });

    const render = (text, textItems, {
      styles, textAnchor, isStroked,
    }) => {
      const props = getProps(text);
      const viewModel = {
        textRef: textRef as unknown as SVGGraphicsElement,
        textItems,
        styles,
        textAnchor,
        isStroked,
        computedProps: props,
      };

      const svgText = shallow(<TextSvgComponent {...viewModel as any} />);

      return {
        props: svgText.props(),
        instance: svgText.instance(),
        children: svgText.children(),
      };
    };

    it('should pass empty text (no content)', () => {
      const { props, instance, children } = render(undefined, undefined, { styles: { whiteSpace: 'pre' }, textAnchor: 'middle', isStroked: false });
      expect(props).toMatchObject({
        x: 10,
        y: 20,
        textAnchor: 'middle',
        style: { whiteSpace: 'pre' },
        ...commonProps,
      });
      expect(instance).toBe(textRef.current);
      expect(children).toHaveLength(0);
    });

    it('should pass text from props', () => {
      const { props, instance, children } = render('Some text', [], { styles: { whiteSpace: 'pre' }, textAnchor: 'middle', isStroked: false });
      expect(props).toMatchObject({
        x: 10,
        y: 20,
        textAnchor: 'middle',
        style: { whiteSpace: 'pre' },
        ...commonProps,
      });
      expect(instance).toBe(textRef.current);
      expect(children).toHaveLength(1);
      expect(children.at(0).text()).toBe('Some text');
    });

    it('should pass multiline text', () => {
      const { children } = render('Some\ntext', [
        { style: { fontSize: '12px' }, className: 'first-line', value: 'Some' },
        { style: { fontSize: '14px' }, className: 'second-line', value: 'text' },
      ], { styles: {}, textAnchor: 'middle', isStroked: false });
      expect(children).toHaveLength(2);
      expect(children.at(0).text()).toBe('Some');
      expect(children.at(0).hasClass('first-line')).toBe(true);
      expect(children.at(0).prop('style')).toStrictEqual({ fontSize: '12px' });
      expect(children.at(1).text()).toBe('text');
      expect(children.at(1).hasClass('second-line')).toBe(true);
      expect(children.at(1).prop('style')).toStrictEqual({ fontSize: '14px' });
    });

    it('should pass multiline text with stroke', () => {
      const { children } = render('Some\ntext', [
        { style: { fontSize: '12px' }, className: 'first-line', value: 'Some' },
        { style: { fontSize: '14px' }, className: 'second-line', value: 'text' },
      ], { styles: {}, textAnchor: 'middle', isStroked: true });
      expect(children).toHaveLength(4);
      expect(children.at(0).text()).toBe(children.at(2).text());
      expect(children.at(0).hasClass('first-line')).toBe(children.at(2).hasClass('first-line'));
      expect(children.at(0).prop('style')).toStrictEqual(children.at(2).prop('style'));
      expect(children.at(1).text()).toBe(children.at(3).text());
      expect(children.at(1).hasClass('second-line')).toBe(children.at(3).hasClass('second-line'));
      expect(children.at(1).prop('style')).toStrictEqual(children.at(3).prop('style'));
    });

    it('should pass transform and dash style', () => {
      jest.spyOn(utilsModule, 'getGraphicExtraProps').mockImplementation(() => ({ transform: 'transformation', 'stroke-dasharray': 'dash' }));
      const computedProps = getProps('some text');
      const rect = shallow(<TextSvgComponent {...{ computedProps } as any} />);

      expect(rect.props()).toMatchObject({ transform: 'transformation', 'stroke-dasharray': 'dash' });
      expect(utilsModule.getGraphicExtraProps)
        .toHaveBeenCalledWith(computedProps, computedProps.x, computedProps.y);
    });
  });

  describe('Behavior', () => {
    describe('effectUpdateText', () => {
      it('should not create tspan for single line text', () => {
        const text = new TextSvgElement({
          text: 'Text',
        });
        text.parseTspanElements = jest.fn();
        text.effectUpdateText();

        expect(text.parseTspanElements).toHaveBeenCalledTimes(0);
      });

      it('should align text nodes to center', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          textsAlignment: 'center',
        });
        text.textRef = React.createRef() as any;
        text.textRef.current = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn(), getSubStringLength: () => 100 },
            { setAttribute: jest.fn(), getSubStringLength: () => 40 },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.current?.children[0].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.current?.children[1].setAttribute).toHaveBeenCalledTimes(0);
      });

      it('should align text nodes to right', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          textsAlignment: 'right',
        });
        text.textRef = React.createRef() as any;
        text.textRef.current = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn(), getSubStringLength: () => 100 },
            { setAttribute: jest.fn(), getSubStringLength: () => 40 },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.current?.children[0].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.current?.children[1].setAttribute).toHaveBeenCalledTimes(1);
        expect(text.textRef.current?.children[1].setAttribute).toHaveBeenCalledWith('dx', 30);
      });

      it('should align text nodes to left', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          textsAlignment: 'left',
        });
        text.textRef = React.createRef() as any;
        text.textRef.current = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn(), getSubStringLength: () => 100 },
            { setAttribute: jest.fn(), getSubStringLength: () => 40 },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.current?.children[0].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.current?.children[1].setAttribute).toHaveBeenCalledTimes(1);
        expect(text.textRef.current?.children[1].setAttribute).toHaveBeenCalledWith('dx', -30);
      });

      it('should locate text nodes by default', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          x: 50,
          y: 100,
        });
        text.textRef = React.createRef() as any;
        text.textRef.current = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn() }, { setAttribute: jest.fn() },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.current?.children[0].setAttribute).toHaveBeenCalledTimes(2);
        expect(text.textRef.current?.children[1].setAttribute).toHaveBeenCalledTimes(2);
        expect(text.textRef.current?.children[0].setAttribute).nthCalledWith(1, 'x', 50);
        expect(text.textRef.current?.children[0].setAttribute).lastCalledWith('y', 100);
        expect(text.textRef.current?.children[1].setAttribute).nthCalledWith(1, 'x', 50);
        expect(text.textRef.current?.children[1].setAttribute).lastCalledWith('dy', 12);
      });

      it('"dy" attribute value should be calculated considering font size specified in "styles" property', () => {
        const text = new TextSvgElement({
          styles: { 'font-size': 15 },
          text: 'Multiline\ntext',
          x: 50,
          y: 100,
        });

        text.textRef = React.createRef() as any;
        text.textRef.current = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn() }, { setAttribute: jest.fn() },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.current?.children[0].setAttribute).toHaveBeenCalledTimes(2);
        expect(text.textRef.current?.children[1].setAttribute).lastCalledWith('dy', 15);
      });

      it('should locate text nodes with style', () => {
        const text = new TextSvgElement({
          text: '<div><p>Text1</p><br /><p style="font-size: 18px">TextText2</p><p>StilText2</p></div>',
          x: 50,
          y: 100,
        });
        text.textRef = React.createRef() as any;
        text.textRef.current = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.current?.children[0].setAttribute).toHaveBeenCalledTimes(2);
        expect(text.textRef.current?.children[1].setAttribute).toHaveBeenCalledTimes(2);
        expect(text.textRef.current?.children[2].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.current?.children[0].setAttribute).nthCalledWith(1, 'x', 50);
        expect(text.textRef.current?.children[0].setAttribute).lastCalledWith('y', 100);
        expect(text.textRef.current?.children[1].setAttribute).nthCalledWith(1, 'x', 50);
        expect(text.textRef.current?.children[1].setAttribute).lastCalledWith('dy', 18);
      });

      it('should pass stroke to text nodes', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          stroke: 'red',
          strokeWidth: 2,
          strokeOpacity: 0.75,
        });
        text.textRef = React.createRef() as any;
        text.textRef.current = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.current?.children[0].setAttribute).toHaveBeenCalledTimes(4);
        expect(text.textRef.current?.children[1].setAttribute).toHaveBeenCalledTimes(4);
        expect(text.textRef.current?.children[2].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.current?.children[3].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.current?.children[0].setAttribute).nthCalledWith(1, 'stroke', 'red');
        expect(text.textRef.current?.children[0].setAttribute).nthCalledWith(2, 'stroke-width', '2');
        expect(text.textRef.current?.children[0].setAttribute).nthCalledWith(3, 'stroke-opacity', '0.75');
        expect(text.textRef.current?.children[0].setAttribute).nthCalledWith(4, 'stroke-linejoin', 'round');
        expect(text.textRef.current?.children[1].setAttribute).nthCalledWith(1, 'stroke', 'red');
        expect(text.textRef.current?.children[1].setAttribute).nthCalledWith(2, 'stroke-width', '2');
        expect(text.textRef.current?.children[1].setAttribute).nthCalledWith(3, 'stroke-opacity', '0.75');
        expect(text.textRef.current?.children[1].setAttribute).nthCalledWith(4, 'stroke-linejoin', 'round');
      });

      it('should pass stroke to text nodes - default opacity', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          stroke: 'any',
          strokeWidth: 1,
        });
        text.textRef = React.createRef() as any;
        text.textRef.current = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.current?.children[0].setAttribute).nthCalledWith(3, 'stroke-opacity', '1');
        expect(text.textRef.current?.children[1].setAttribute).nthCalledWith(3, 'stroke-opacity', '1');
      });
    });
  });

  describe('Logic', () => {
    describe('styles', () => {
      it('should apply whiteSpace by default', () => {
        const text = new TextSvgElement({ });

        expect(text.styles).toStrictEqual({ whiteSpace: 'pre' });
      });

      it('should apply styles from props', () => {
        const text = new TextSvgElement({ styles: { fill: 'red', fontSize: '14px' } });

        expect(text.styles).toStrictEqual({
          whiteSpace: 'pre',
          fill: 'red',
          fontSize: '14px',
        });
      });
    });

    describe('isStroked', () => {
      it('should return false if at least one of the properties is not defined: stroke or strokeWidth', () => {
        const text0 = new TextSvgElement({ });
        const text1 = new TextSvgElement({ stroke: '#232323' });
        const text2 = new TextSvgElement({ strokeWidth: 2 });

        expect(text0.isStroked).toBe(false);
        expect(text1.isStroked).toBe(false);
        expect(text2.isStroked).toBe(false);
      });

      it('should return true if defined both props: stroke and strokeWidth', () => {
        const text = new TextSvgElement({ stroke: '#232323', strokeWidth: 2 });
        expect(text.isStroked).toBe(true);
      });
    });

    describe('textAnchor', () => {
      it('should return undefined by default', () => {
        const text = new TextSvgElement({ });
        expect(text.textAnchor).toBe(undefined);
      });

      it('should applay not inverted anchor when rtl is off', () => {
        const text0 = new TextSvgElement({ align: 'center' });
        const text1 = new TextSvgElement({ align: 'left' });
        const text2 = new TextSvgElement({ align: 'right' });

        expect(text0.textAnchor).toBe('middle');
        expect(text1.textAnchor).toBe('start');
        expect(text2.textAnchor).toBe('end');
      });

      it('should applay inverted anchor when rtl is on', () => {
        const text0 = new TextSvgElement({ align: 'center' });
        text0.config = { rtlEnabled: true };
        const text1 = new TextSvgElement({ align: 'left' });
        text1.config = { rtlEnabled: true };
        const text2 = new TextSvgElement({ align: 'right' });
        text2.config = { rtlEnabled: true };

        expect(text0.textAnchor).toBe('middle');
        expect(text1.textAnchor).toBe('end');
        expect(text2.textAnchor).toBe('start');
      });
    });

    describe('textItems', () => {
      it('should return undefined when no text', () => {
        const text = new TextSvgElement({ });
        expect(text.textItems).toBe(undefined);
      });

      it('should return undefined when simple text (single line, isStroked === false)', () => {
        const text = new TextSvgElement({ text: 'Single line text' });
        expect(text.textItems).toBe(undefined);
      });

      it('should return one text item when single line text with stroke', () => {
        const text = new TextSvgElement({ text: 'Text with stroke', stroke: '#cccccc', strokeWidth: 1 });
        expect(text.textItems).toHaveLength(1);
        expect(text.textItems?.[0]).toStrictEqual({
          value: 'Text with stroke',
          height: 0,
        });
      });

      it('should return text items when text with new line symbol', () => {
        const text = new TextSvgElement({ text: 'Multi\nline\ntext' });

        expect(text.textItems).toHaveLength(3);
        expect(text.textItems?.[0]).toStrictEqual({
          value: 'Multi',
          line: 0,
          height: 0,
        });
        expect(text.textItems?.[2]).toStrictEqual({
          value: 'text',
          line: 2,
          height: 0,
        });
      });

      it('should return text items from parsed HTML text', () => {
        const text = new TextSvgElement({ text: '<div style="font-size: 20px"><p style="font-size: 16px"><b>Text1</b></p><br /><p class="second-line"><i>TextText2</i></p></div>' });

        expect(text.textItems).toHaveLength(2);
        expect(text.textItems?.[0]).toStrictEqual({
          value: 'Text1',
          style: { fontSize: '16px', fontWeight: 'bold' },
          className: '',
          line: 0,
          height: 16,
        });
        expect(text.textItems?.[1]).toStrictEqual({
          value: 'TextText2',
          style: { fontSize: '20px', fontStyle: 'italic' },
          className: 'second-line',
          line: 1,
          height: 20,
        });
      });
    });
  });

  describe('Getters', () => {
    it('should be returned props by computedProps', () => {
      const text = new TextSvgElement({ text: 'some text' });

      expect(text.computedProps).toStrictEqual({ text: 'some text' });
    });
  });
});
