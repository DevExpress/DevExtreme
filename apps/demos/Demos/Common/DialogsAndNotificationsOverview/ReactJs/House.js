import React, { useCallback } from 'react';
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
export function House(props) {
  const renderAgentDetails = useCallback(() => {
    const agent = props.house.Agent;
    return (
      <div className="agent-details">
        <img
          alt={agent.Name}
          src={agent.Picture}
        />
        <div>
          <div className="name large-text">{agent.Name}</div>
          <div className="phone">Tel: {agent.Phone}</div>
        </div>
      </div>
    );
  }, [props.house.Agent]);
  const show = useCallback(() => {
    props.show(props.house);
  }, [props]);
  return (
    <div>
      <div
        onClick={show}
        className="item-content"
      >
        <img
          alt={props.house.Address}
          src={props.house.Image}
        />

        <div className="item-options">
          <div>
            <div className="address">{props.house.Address}</div>
            <div className="price large-text">{formatCurrency(props.house.Price)}</div>
            <div className="agent">
              <div id={`house${props.house.ID}`}>
                <img
                  alt="Listing agent"
                  src="../../../../images/icon-agent.svg"
                />
                Listing agent
              </div>
            </div>
          </div>
        </div>
        <Popover
          showEvent="mouseenter"
          hideEvent="mouseleave"
          position={position}
          target={`#house${props.house.ID}`}
          width={260}
          contentRender={renderAgentDetails}
        />
      </div>
    </div>
  );
}
