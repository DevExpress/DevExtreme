import React from 'react';

const fontFamily = "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif";
class Form extends React.Component {

  componentDidMount() {
    this.props.onRef(this);
  }

  render() {
    return (
      <div id="custom_markup_container" ref={node => this.node = node}>
        <svg width="820px" height="420px">
          <path d="M 13 407 L 128 407 L 232 39 L 13 39" fill="#6D39C3"></path>
          <path d="M 46 381 L 161 381 L 265 13 L 46 13" opacity="0.5" fill="#6D39C3"></path>
          <path d="M 638 365 L 630 396 L 799 396 L 807 365" fill="#6D39C3"></path>
          <path d="M 609 376 L 601 407 L 770 407 L 778 376" opacity="0.5" fill="#6D39C3"></path>
          <text transform="translate(30,89)"
            style={{ fill: '#FFFFFF', fontFamily, fontSize: 36, fontWeight: 'bold' }}>
            <tspan x="0" y="0">Export </tspan>
            <tspan x="0" y="38">Custom</tspan>
            <tspan x="0" y="76">Markup</tspan>
          </text>
          <text transform="translate(32,199)"
            style={{ opacity: 0.8, fill: '#FFFFFF', fontFamily, fontSize: 14 }}>
            <tspan x="0" y="0">Export a chart with</tspan>
            <tspan x="0" y="19.2">custom elements</tspan>
          </text>
          <text x="650" y="385"
            style={{ opacity: 0.8, fill: '#FFFFFF', fontFamily, fontSize: 12 }}>UNdata (www.data.un.org)</text>
          <path opacity="0.8" d="M 0 0 L 820 0 L 820 420 L 0 420 L 0 0" stroke="#999999" strokeWidth="1"
            strokeLinecap="butt" fill="none" strokeLinejoin="miter"></path>
        </svg>
      </div>
    );
  }

  getElement() {
    return this.node;
  }
}
export default Form;
