import * as React from 'react';

import { Button } from 'devextreme-react/button';
import { Popup } from 'devextreme-react/popup';
import { ScrollView } from 'devextreme-react/scroll-view';
import { TextBox } from 'devextreme-react/text-box';
import Example from './example-block';

const VALID_TEXT = 'good';
const validateText = (text: string) => text === VALID_TEXT;

export default class extends React.Component<any, { visible: boolean; text: string; }> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      visible: false,
      text: `non-${VALID_TEXT}`,
    };

    this.toggle = this.toggle.bind(this);
    this.handleTextUpdate = this.handleTextUpdate.bind(this);
  }

  private handleTextUpdate(e: unknown) {
    this.setState({
      text: e.value,
    });
  }

  private toggle(visible: boolean) {
    const { text } = this.state;
    this.setState({
      visible: visible || !validateText(text),
    });
  }

  public render(): React.ReactNode {
    const { text, visible } = this.state;
    return (
      <Example title="DxPopup" state={this.state}>
        <TextBox value={text} onValueChanged={this.handleTextUpdate} valueChangeEvent="input" />
        <br />
        <Button text="Show popup" onClick={() => this.toggle(true)} />
        <Popup
          visible={visible}
          onHiding={() => this.toggle(false)}
          onShowing={() => this.toggle(true)}
          width={600}
          height={400}
        >
          Enter valid text (it should be `&apos;`good`&apos;`):
          <br />
          <TextBox value={text} onValueChanged={this.handleTextUpdate} valueChangeEvent="input" />
          <br />
          <ScrollView height={80}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed lacus
              egestas, facilisis urna nec, fringilla nibh. Maecenas enim felis, ultricies
              pretium aliquet ut, aliquam id urna. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Nam viverra est at neque fringilla, non iaculis magna
              ultrices. Nunc posuere tincidunt elit a molestie. Nulla aliquet metus ex. Nunc
              aliquam volutpat libero, ac tincidunt felis consectetur id. Sed diam lectus,
              dictum non tempus fringilla, semper in dui. Donec at hendrerit massa. Aenean
              quis suscipit nisi. Cras sed eros tristique, venenatis diam in, rhoncus enim.
              Orci varius natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. Curabitur et ex sit amet odio efficitur fermentum.
            </p>
            <p>
              Donec lobortis hendrerit massa. Praesent tempus cursus tempus. Maecenas at
              dolor lacus. Vestibulum suscipit ac mi vitae posuere. Maecenas id urna eget
              sapien volutpat laoreet. Sed nulla purus, aliquam nec augue vel, consequat
              tincidunt erat. Phasellus hendrerit rhoncus erat, ut fermentum orci molestie a.
              Nam at mi eget erat mattis pulvinar vel sed tellus. Quisque a erat sit amet
              nibh iaculis suscipit lacinia et dui. Praesent ultricies, nulla sit amet
              facilisis laoreet, dolor orci commodo odio, eu vulputate erat nibh ut ligula.
              Ut nec lacus finibus, vehicula leo nec, accumsan quam. Sed ultricies magna
              varius dictum interdum. Nam quis dapibus turpis. Sed lacinia quam aliquet
              placerat eleifend.
            </p>
          </ScrollView>
        </Popup>
      </Example>
    );
  }
}
