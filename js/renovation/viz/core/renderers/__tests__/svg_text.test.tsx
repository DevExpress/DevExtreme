import React, { createRef } from 'react';
import { shallow } from 'enzyme';
import { TextSvgElement, viewFunction as TextSvgComponent } from '../svg_text';

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
        props,
      };

      const svgText = shallow(<TextSvgComponent {...viewModel as any} /> as JSX.Element);

      return {
        props: svgText.props(),
        instance: svgText.instance(),
        children: svgText.children(),
      };
    };

    it('Default render (empty text)', () => {
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

    it('Default render', () => {
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

    it('Multiline render', () => {
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

    it('Multiline render (text with stroke)', () => {
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
  });

  describe('Behavior', () => {
    describe('effectUpdateText', () => {
      it('Single line text', () => {
        const text = new TextSvgElement({
          text: 'Text',
        });
        text.parseTspanElements = jest.fn();
        text.effectUpdateText();

        expect(text.parseTspanElements).toHaveBeenCalledTimes(0);
      });

      it('Align text nodes to center', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          textsAlignment: 'center',
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn(), getSubStringLength: () => (100) },
            { setAttribute: jest.fn(), getSubStringLength: () => (40) },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.children[0].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.children[1].setAttribute).toHaveBeenCalledTimes(0);
      });

      it('Align text nodes to right', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          textsAlignment: 'right',
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn(), getSubStringLength: () => (100) },
            { setAttribute: jest.fn(), getSubStringLength: () => (40) },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.children[0].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.children[1].setAttribute).toHaveBeenCalledTimes(1);
        expect(text.textRef.children[1].setAttribute).toHaveBeenCalledWith('dx', 30);
      });

      it('Align text nodes to leftt', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          textsAlignment: 'left',
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn(), getSubStringLength: () => (100) },
            { setAttribute: jest.fn(), getSubStringLength: () => (40) },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.children[0].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.children[1].setAttribute).toHaveBeenCalledTimes(1);
        expect(text.textRef.children[1].setAttribute).toHaveBeenCalledWith('dx', -30);
      });

      it('Locate text nodes by default', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          x: 50,
          y: 100,
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn() }, { setAttribute: jest.fn() },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.children[0].setAttribute).toHaveBeenCalledTimes(2);
        expect(text.textRef.children[1].setAttribute).toHaveBeenCalledTimes(2);
        expect(text.textRef.children[0].setAttribute).nthCalledWith(1, 'x', 50);
        expect(text.textRef.children[0].setAttribute).lastCalledWith('y', 100);
        expect(text.textRef.children[1].setAttribute).nthCalledWith(1, 'x', 50);
        expect(text.textRef.children[1].setAttribute).lastCalledWith('dy', 12);
      });

      it('Locate text nodes with style', () => {
        const text = new TextSvgElement({
          text: '<div><p>Text1</p><br /><p style="font-size: 18px">TextText2</p><p>StilText2</p></div>',
          x: 50,
          y: 100,
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.children[0].setAttribute).toHaveBeenCalledTimes(2);
        expect(text.textRef.children[1].setAttribute).toHaveBeenCalledTimes(2);
        expect(text.textRef.children[2].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.children[0].setAttribute).nthCalledWith(1, 'x', 50);
        expect(text.textRef.children[0].setAttribute).lastCalledWith('y', 100);
        expect(text.textRef.children[1].setAttribute).nthCalledWith(1, 'x', 50);
        expect(text.textRef.children[1].setAttribute).lastCalledWith('dy', 18);
      });

      it('dashStyle=dash', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          dashStyle: 'dash',
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            {}, {},
          ],
        } as any;
        text.effectUpdateText();
        expect(text.textRef.setAttribute).toHaveBeenCalledTimes(1);
        expect(text.textRef.setAttribute).toHaveBeenCalledWith('stroke-dasharray', '4,3');
      });

      it('dashStyle=longdash dot', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          dashStyle: 'longdash dot',
          strokeWidth: 4,
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            {}, {},
          ],
        } as any;
        text.effectUpdateText();
        expect(text.textRef.setAttribute).toHaveBeenCalledTimes(1);
        expect(text.textRef.setAttribute).toHaveBeenCalledWith('stroke-dasharray', '32,12,4,12');
      });

      it('transformation', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          rotate: 25,
          translateX: 15,
          translateY: -25,
          scaleX: 1.1,
          scaleY: 0.8,
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            {}, {},
          ],
        } as any;
        text.effectUpdateText();
        expect(text.textRef.setAttribute).toHaveBeenCalledTimes(1);
        expect(text.textRef.setAttribute).toHaveBeenCalledWith('transform', 'translate(15,-25) rotate(25,0,0) scale(1.1,0.8)');
      });

      it('Stroke text nodes', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          stroke: 'red',
          strokeWidth: 2,
          strokeOpacity: 0.75,
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.children[0].setAttribute).toHaveBeenCalledTimes(4);
        expect(text.textRef.children[1].setAttribute).toHaveBeenCalledTimes(4);
        expect(text.textRef.children[2].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.children[3].setAttribute).toHaveBeenCalledTimes(0);
        expect(text.textRef.children[0].setAttribute).nthCalledWith(1, 'stroke', 'red');
        expect(text.textRef.children[0].setAttribute).nthCalledWith(2, 'stroke-width', '2');
        expect(text.textRef.children[0].setAttribute).nthCalledWith(3, 'stroke-opacity', '0.75');
        expect(text.textRef.children[0].setAttribute).nthCalledWith(4, 'stroke-linejoin', 'round');
        expect(text.textRef.children[1].setAttribute).nthCalledWith(1, 'stroke', 'red');
        expect(text.textRef.children[1].setAttribute).nthCalledWith(2, 'stroke-width', '2');
        expect(text.textRef.children[1].setAttribute).nthCalledWith(3, 'stroke-opacity', '0.75');
        expect(text.textRef.children[1].setAttribute).nthCalledWith(4, 'stroke-linejoin', 'round');
      });

      it('Stroke text nodes - default opacity', () => {
        const text = new TextSvgElement({
          text: 'Multiline\ntext',
          stroke: 'any',
          strokeWidth: 1,
        });
        text.textRef = {
          setAttribute: jest.fn(),
          children: [
            { setAttribute: jest.fn() },
            { setAttribute: jest.fn() },
          ],
        } as any;
        text.effectUpdateText();

        expect(text.textRef.children[0].setAttribute).nthCalledWith(3, 'stroke-opacity', '1');
        expect(text.textRef.children[1].setAttribute).nthCalledWith(3, 'stroke-opacity', '1');
      });
    });
  });

  describe('Logic', () => {
    it('styles (no style)', () => {
      const text = new TextSvgElement({ });

      expect(text.styles).toStrictEqual({ whiteSpace: 'pre' });
    });

    it('styles', () => {
      const text = new TextSvgElement({ styles: { fill: 'red', fontSize: '14px' } });

      expect(text.styles).toStrictEqual({
        whiteSpace: 'pre',
        fill: 'red',
        fontSize: '14px',
      });
    });

    describe('isStroked', () => {
      it('At least one of the properties is not defined: stroke or strokeWidth', () => {
        const text0 = new TextSvgElement({ });
        const text1 = new TextSvgElement({ stroke: '#232323' });
        const text2 = new TextSvgElement({ strokeWidth: 2 });

        expect(text0.isStroked).toBe(false);
        expect(text1.isStroked).toBe(false);
        expect(text2.isStroked).toBe(false);
      });

      it('Defined only both props: stroke and strokeWidth', () => {
        const text = new TextSvgElement({ stroke: '#232323', strokeWidth: 2 });
        expect(text.isStroked).toBe(true);
      });
    });

    describe('textAnchor', () => {
      it('Default', () => {
        const text = new TextSvgElement({ });
        expect(text.textAnchor).toBe(undefined);
      });

      it('rtl is off', () => {
        const text0 = new TextSvgElement({ align: 'center' });
        const text1 = new TextSvgElement({ align: 'left' });
        const text2 = new TextSvgElement({ align: 'right' });

        expect(text0.textAnchor).toBe('middle');
        expect(text1.textAnchor).toBe('start');
        expect(text2.textAnchor).toBe('end');
      });

      it('rtl is on', () => {
        const text0 = new TextSvgElement({ align: 'center' });
        const text1 = new TextSvgElement({ align: 'left', rtl: true });
        const text2 = new TextSvgElement({ align: 'right', rtl: true });

        expect(text0.textAnchor).toBe('middle');
        expect(text1.textAnchor).toBe('end');
        expect(text2.textAnchor).toBe('start');
      });
    });

    describe('textItems', () => {
      it('No text', () => {
        const text = new TextSvgElement({ });
        expect(text.textItems).toBe(undefined);
      });

      it('Simple text', () => {
        const text = new TextSvgElement({ text: 'Single line text' });
        expect(text.textItems).toBe(undefined);
      });

      it('Simple text with stroke', () => {
        const text = new TextSvgElement({ text: 'Text with stroke', stroke: '#cccccc', strokeWidth: 1 });
        expect(text.textItems).toHaveLength(1);
        expect(text.textItems[0]).toStrictEqual({
          value: 'Text with stroke',
          height: 0,
        });
      });

      it('Text with new line symbol', () => {
        const text = new TextSvgElement({ text: 'Multi\nline\ntext' });

        expect(text.textItems).toHaveLength(3);
        expect(text.textItems[0]).toStrictEqual({
          value: 'Multi',
          line: 0,
          height: 0,
        });
        expect(text.textItems[2]).toStrictEqual({
          value: 'text',
          line: 2,
          height: 0,
        });
      });

      it('Parse HTML text', () => {
        const text = new TextSvgElement({ text: '<div style="font-size: 20px"><p style="font-size: 16px"><b>Text1</b></p><br /><p class="second-line"><i>TextText2</i></p></div>' });

        expect(text.textItems).toHaveLength(2);
        expect(text.textItems[0]).toStrictEqual({
          value: 'Text1',
          style: { fontSize: '16px', fontWeight: 'bold' },
          className: '',
          line: 0,
          height: 16,
        });
        expect(text.textItems[1]).toStrictEqual({
          value: 'TextText2',
          style: { fontSize: '20px', fontStyle: 'italic' },
          className: 'second-line',
          line: 1,
          height: 20,
        });
      });
    });
  });
});
