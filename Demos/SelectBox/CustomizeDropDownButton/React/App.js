import React from 'react';
import SelectBox from 'devextreme-react/select-box';

import { Template } from 'devextreme-react/core/template';
import {
  products, simpleProducts, simpleProductLabel, deferredProductLabel, productLabel,
} from './data.js';
import ImageIcon from './imageIcon.js';
import IndicatorIcon from './indicatorIcon.js';
import ConditionalIcon from './conditionalIcon.js';
import Item from './item.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.deferredProducts = {
      loadMode: 'raw',
      load: () => {
        this.setState({ isLoaded: false });
        const promise = new Promise((resolve) => {
          setTimeout(() => {
            resolve(simpleProducts);
            this.setState({ isLoaded: true });
          }, 3000);
        });

        return promise;
      },
    };
    this.state = {
      selectedItem: products[0],
      isLoaded: true,
    };
    this.renderLoadIndicator = this.renderLoadIndicator.bind(this);
    this.renderConditionalIcon = this.renderConditionalIcon.bind(this);
    this.selectionChanged = this.selectionChanged.bind(this);
  }

  render() {
    return (
      <div className='dx-fieldset'>
        <div className='dx-field'>
          <div className='dx-field-label'>Image as the icon</div>
          <div className='dx-field-value'>
            <SelectBox dataSource={simpleProducts}
              inputAttr={simpleProductLabel}
              dropDownButtonRender={ImageIcon} />
          </div>
        </div>
        <div className='dx-field'>
          <div className='dx-field-label'>Load indicator as the icon</div>
          <div className='dx-field-value'>
            <SelectBox dataSource={this.deferredProducts}
              inputAttr={deferredProductLabel}
              dropDownButtonTemplate='loadIndicator'>
              <Template name='loadIndicator' render={this.renderLoadIndicator} />
            </SelectBox>
          </div>
        </div>
        <div className='dx-field'>
          <div className='dx-field-label'>Value-dependent icon</div>
          <div className='dx-field-value'>
            <SelectBox dataSource={products}
              defaultValue={products[0].ID}
              selectedItem={this.state.selectedItem}
              displayExpr='Name'
              inputAttr={productLabel}
              showClearButton={true}
              valueExpr='ID'
              itemRender={Item}
              dropDownButtonTemplate='conditionalIcon'
              onSelectionChanged={this.selectionChanged}
            >
              <Template name='conditionalIcon' render={this.renderConditionalIcon} />
            </SelectBox>
          </div>
        </div>
      </div>
    );
  }

  renderLoadIndicator() {
    return <IndicatorIcon isLoaded={this.state.isLoaded} />;
  }

  renderConditionalIcon() {
    return <ConditionalIcon value={this.state.selectedItem} />;
  }

  selectionChanged({ selectedItem }) {
    this.setState({ selectedItem });
  }
}

export default App;
