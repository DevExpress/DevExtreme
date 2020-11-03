import React from 'react';
import DropDownButton from 'devextreme-react/drop-down-button';
import Toolbar from 'devextreme-react/toolbar';
import { Template } from 'devextreme-react/core/template';
import service from './data.js';
import notify from 'devextreme/ui/notify';
import 'whatwg-fetch';

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
        className={this.props.color ? 'color dx-icon dx-icon-square' : 'color dx-icon dx-icon-square dx-theme-text-color'}
        style={{ color: this.props.color }}
      />
    );
  }
}

class App extends React.Component {
  onButtonClick(e) {
    notify(`Go to ${ e.component.option('text') }'s profile`, 'success', 600);
  }

  onItemClick(e) {
    notify(e.itemData.name || e.itemData, 'success', 600);
  }

  onColorClick(color) {
    this.setState({
      color: color
    });
    this.colorPicker.element().getElementsByClassName('dx-icon-square')[0].style.color = color;
    this.colorPicker.close();
  }

  itemTemplateRender(item) {
    return (<div style={{ fontSize: `${item.size }px` }}>
      {item.text}
    </div>);
  }

  constructor(props) {
    super(props);
    this.onColorClick = this.onColorClick.bind(this);

    this.data = service.getData();
    this.state = {
      alignment: 'left',
      color: null,
      fontSize: 14,
      lineHeight: 1.35
    };

    this.toolbarItems = [
      {
        location: 'before',
        widget: 'dxDropDownButton',
        options: {
          displayExpr: 'name',
          keyExpr: 'id',
          selectedItemKey: 3,
          width: 125,
          stylingMode: 'text',
          useSelectMode: true,
          onSelectionChanged: (e) => {
            this.setState({
              alignment: e.item.name.toLowerCase()
            });
          },
          items: this.data.alignments
        }
      },
      {
        location: 'before',
        widget: 'dxDropDownButton',
        options: {
          items: this.data.colors,
          icon: 'square',
          stylingMode: 'text',
          dropDownOptions: { width: 'auto' },
          onInitialized: ({ component }) => {
            this.colorPicker = component;
          },
          dropDownContentTemplate: 'colorpicker'
        }
      },
      {
        location: 'before',
        widget: 'dxDropDownButton',
        options: {
          stylingMode: 'text',
          displayExpr: 'text',
          keyExpr: 'size',
          useSelectMode: true,
          items: this.data.fontSizes,
          selectedItemKey: 14,
          onSelectionChanged:(e) => {
            this.setState({
              fontSize: e.item.size
            });
          },
          itemTemplate: 'fontItem'
        }
      },
      {
        location: 'before',
        widget: 'dxDropDownButton',
        options: {
          stylingMode: 'text',
          icon: 'indent',
          displayExpr: 'text',
          keyExpr: 'lineHeight',
          useSelectMode: true,
          items: this.data.lineHeights,
          selectedItemKey: 1.35,
          onSelectionChanged: (e) => {
            this.setState({
              lineHeight: e.item.lineHeight
            });
          }
        }
      }
    ];
  }

  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Single usage</div>
          <div className="dx-field">
            <div className="dx-field-label">
                Custom static text
            </div>
            <div className="dx-field-value">
              <DropDownButton
                text="Download Trial"
                icon="save"
                dropDownOptions={{ width: 230 }}
                items={this.data.downloads}
                onItemClick={this.onItemClick}
              />
            </div>
          </div>

          <div className="dx-field">
            <div className="dx-field-label">
                    Custom main button action
            </div>
            <div className="dx-field-value">
              <DropDownButton
                splitButton={true}
                useSelectMode={false}
                text="Sandra Johnson"
                icon="../../../../images/gym/coach-woman.png"
                items={this.data.profileSettings}
                displayExpr="name"
                keyExpr="id"
                onButtonClick={this.onButtonClick}
                onItemClick={this.onItemClick}
              />
            </div>
          </div>
        </div>

        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Usage in a toolbar</div>
          <div className="dx-field">
            <Toolbar items={this.toolbarItems}>
              <Template name="colorpicker">
                <div className="custom-color-picker">
                  {this.data.colors.map((color, i) => (
                    <ColorIcon key={i} color={color} onClick={this.onColorClick} />
                  ))}
                </div>
              </Template>
              <Template name="fontItem" render={ this.itemTemplateRender }>
              </Template>
            </Toolbar>
          </div>
          <div className={ this.state.color ? 'dx-field' : 'dx-field dx-theme-text-color' } style={{
            color: this.state.color,
            textAlign: this.state.alignment,
            lineHeight: this.state.lineHeight,
            fontSize: `${this.state.fontSize }px`
          }}>
            <p id="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
