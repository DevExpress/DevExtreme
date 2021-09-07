import React from 'react';

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  render() {
    const { info } = this.props;
    return (
      <span>
        <span
          className={info.node ? 'link' : ''}
          onClick={this.onClick}
        >
          {info.text}
        </span>
        {this.props.isLast ? '' : ' > '}
      </span>
    );
  }

  onClick() {
    this.props.onClick(this.props.info.node);
  }
}

export default Breadcrumb;
