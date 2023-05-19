import React from 'react';
import ScrollView from 'devextreme-react/scroll-view';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import service from './data.js';

const showScrollBarModeLabel = { 'aria-label': 'Show Scrollbar Mode' };

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showScrollBarMode: 'onScroll',
      pullDown: false,
      scrollByContent: true,
      scrollByThumb: true,
      content: service.getContent(),
    };
    this.getInstance = this.getInstance.bind(this);
    this.pullDownValueChanged = this.pullDownValueChanged.bind(this);
    this.reachBottomValueChanged = this.reachBottomValueChanged.bind(this);
    this.scrollbarModelValueChanged = this.scrollbarModelValueChanged.bind(this);
    this.scrollByContentValueChanged = this.scrollByContentValueChanged.bind(this);
    this.scrollByThumbValueChanged = this.scrollByThumbValueChanged.bind(this);
    this.updateTopContent = this.updateTopContent.bind(this);
    this.updateBottomContent = this.updateBottomContent.bind(this);
    this.updateContent = this.updateContent.bind(this);
  }

  render() {
    const {
      showScrollBarMode, content, scrollByThumb, scrollByContent, pullDown,
    } = this.state;
    return (
      <div id="scrollview-demo">
        <ScrollView id="scrollview" ref={this.getInstance}
          reachBottomText="Updating..."
          scrollByContent={scrollByContent}
          bounceEnabled={pullDown}
          onReachBottom={this.updateBottomContent}
          onPullDown={this.updateTopContent}
          showScrollbar={showScrollBarMode}
          scrollByThumb={scrollByThumb}>
          <div className="text-content">
            {content}
          </div>
        </ScrollView>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Show scrollbar: </span>
            <SelectBox
              items={showScrollbarModes}
              valueExpr="value"
              inputAttr={showScrollBarModeLabel}
              displayExpr="text"
              value={showScrollBarMode}
              onValueChanged={this.scrollbarModelValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="Update content on the ReachBottom event"
              defaultValue={true}
              onValueChanged={this.reachBottomValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="Update content on the PullDown event"
              value={pullDown}
              onValueChanged={this.pullDownValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="Scroll by content"
              value={scrollByContent}
              onValueChanged={this.scrollByContentValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="Scroll by thumb"
              value={scrollByThumb}
              onValueChanged={this.scrollByThumbValueChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  getInstance(ref) {
    this.scrollView = ref.instance;
  }

  pullDownValueChanged(args) {
    this.setState({
      pullDown: args.value,
    });
  }

  reachBottomValueChanged(args) {
    this.scrollView.option('onReachBottom', args.value ? this.updateBottomContent : null);
  }

  scrollbarModelValueChanged(args) {
    this.setState({
      showScrollBarMode: args.value,
    });
  }

  scrollByContentValueChanged(args) {
    this.setState({
      scrollByContent: args.value,
    });
  }

  scrollByThumbValueChanged(args) {
    this.setState({
      scrollByThumb: args.value,
    });
  }

  updateTopContent(args) {
    this.updateContent(args, 'PullDown');
  }

  updateBottomContent(args) {
    this.updateContent(args, 'ReachBottom');
  }

  updateContent(args, eventName) {
    const updateContentText = `\n Content has been updated on the ${eventName} event.\n\n`;
    if (this.updateContentTimer) { clearTimeout(this.updateContentTimer); }
    this.updateContentTimer = setTimeout(() => {
      this.setState({
        content: eventName === 'PullDown' ? updateContentText + this.state.content : this.state.content + updateContentText,
      });
      args.component.release();
    }, 500);
  }
}

const showScrollbarModes = [{
  text: 'On Scroll',
  value: 'onScroll',
}, {
  text: 'On Hover',
  value: 'onHover',
}, {
  text: 'Always',
  value: 'always',
}, {
  text: 'Never',
  value: 'never',
}];

export default App;
