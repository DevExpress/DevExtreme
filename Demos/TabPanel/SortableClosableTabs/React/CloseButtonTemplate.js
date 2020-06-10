import React from 'react';

class CloseButtonTemplate extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <i
          className="dx-icon dx-icon-close"
          onClick={this._onClick}
        />
      </React.Fragment>
    );
  }
  _onClick = () => {
    this.props.onItemClick(this.props.item);
  }
}

export default CloseButtonTemplate;
