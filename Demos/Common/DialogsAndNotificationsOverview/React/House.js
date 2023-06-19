import React from 'react';

import Popover from 'devextreme-react/popover';

const formatCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format;

const position = {
  offset: '0, 2',
  at: 'bottom',
  my: 'top',
  collision: 'fit flip',
};

class House extends React.PureComponent {
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.renderAgentDetails = this.renderAgentDetails.bind(this);
  }

  render() {
    const { house } = this.props;
    return (
      <div>
        <div onClick={this.show} className="item-content">

          <img src={house.Image} />

          <div className="item-options">
            <div>
              <div className="address">{house.Address}</div>
              <div className="price large-text">{formatCurrency(house.Price)}</div>
              <div className="agent">
                <div id={`house${house.ID}`}>
                  <img src="../../../../images/icon-agent.svg" />
                                    Listing agent
                </div>
              </div>
            </div>
          </div>
          <Popover
            showEvent="mouseenter"
            hideEvent="mouseleave"
            position={position}
            target={`#house${house.ID}`}
            width={260}
            contentRender={this.renderAgentDetails}
          />
        </div>
      </div>
    );
  }

  renderAgentDetails() {
    const agent = this.props.house.Agent;
    return (
      <div className="agent-details">
        <img src={agent.Picture} />
        <div>
          <div className="name large-text">{agent.Name}</div>
          <div className="phone">Tel: {agent.Phone}</div>
        </div>
      </div>
    );
  }

  show() {
    this.props.show(this.props.house);
  }
}

export default House;
