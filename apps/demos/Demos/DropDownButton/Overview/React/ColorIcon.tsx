import React from 'react';

interface ColorIconProps {
  key: number;
  color: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (string) => void;
}

class ColorIcon extends React.Component<ColorIconProps> {
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
        className="color dx-icon dx-icon-square"
        style={{ color: this.props.color }}
      />
    );
  }
}

export default ColorIcon;
