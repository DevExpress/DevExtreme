import React from 'react';

class ColorIcon extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.color);
  }

  render() {
    return (
      <i
        onClick={this.onClick}
        className={
          this.props.color
            ? 'color dx-icon dx-icon-square'
            : 'color dx-icon dx-icon-square dx-theme-text-color'
        }
        style={{ color: this.props.color }}
      />
    );
  }
}
export default ColorIcon;
