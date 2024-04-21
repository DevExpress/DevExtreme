import React from 'react';

interface ColorIconProps {
  key: number;
  color: string;
  onClick: Function;
}

class ColorIcon extends React.Component<ColorIconProps> {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(): void {
    this.props.onClick(this.props.color);
  }

  render(): JSX.Element {
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
