/* eslint-disable no-alert */
/* eslint-disable max-len */
import * as React from 'react';
import { Button } from 'devextreme-react/button';
import { ScrollView } from 'devextreme-react/scroll-view';
import { TextBox } from 'devextreme-react/text-box';
import Example from './example-block';

export default class extends React.Component<any, { text: string }> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      text: 'Clear me',
    };

    this.clearText = this.clearText.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  private handleTextChange(e: unknown) {
    this.setState({
      text: e.value,
    });
  }

  private clearText() {
    this.setState({
      text: '',
    });
  }

  public render(): React.ReactNode {
    const { text } = this.state;
    return (
      <Example title="DxScrollView" state={this.state}>
        <ScrollView height="150px">
          <Button text="Show alert" onClick={() => alert('shown')} />
          <Button text="Clear TextBox" onClick={this.clearText} />
          <br />
          <br />
          <TextBox value={text} onValueChanged={this.handleTextChange} valueChangeEvent="keydown" />
          <br />
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, eveniet tempore, perspiciatis totam qui est minima dicta beatae dolores, omnis enim ut incidunt. Ut reprehenderit, tempore iusto deserunt doloremque fugit.</p>
            <p>Sint natus quia repellendus cum neque. Velit similique dicta corrupti nesciunt quas ea quam minima, aliquid qui ratione suscipit magnam molestiae aspernatur iure, tenetur sapiente voluptates laborum quidem nisi molestias.</p>
            <p>Id, nesciunt adipisci sint. Doloribus minima expedita, soluta. Eveniet reiciendis eius ducimus provident autem amet alias quis natus. In veritatis, repellendus laborum illo voluptates est quis consectetur consequuntur reiciendis rem!</p>
            <p>In cum, ipsum ratione beatae odio officia doloribus ullam magnam impedit repudiandae odit, vero! Minus quisquam earum aliquam tempore iusto consequatur modi laborum facilis dolorum! Earum, exercitationem error. Placeat, optio!</p>
            <p>Necessitatibus praesentium quisquam autem non dolores, doloremque architecto, suscipit nemo nisi et laboriosam temporibus maiores, quasi amet unde aut consectetur dolor quo. Minus laudantium, enim iste nesciunt ea pariatur eveniet!</p>
            <p>Illo, delectus deleniti nesciunt minima nisi eius accusantium asperiores corporis id repudiandae quia. Cum esse magni accusantium omnis laboriosam iure excepturi, saepe placeat laudantium amet molestiae dolores hic, labore laborum!</p>
            <p>Impedit deleniti rem delectus illum accusamus magni facere nam dolore dolor veniam quos accusantium nostrum magnam, velit praesentium! Optio amet quasi minus perspiciatis ex sit, similique reiciendis libero nostrum voluptatibus?</p>
            <p>Qui quidem natus voluptatibus et id doloribus distinctio tempora, eius, error rerum, commodi in accusamus iusto quos adipisci quasi? Quis error quae expedita hic modi ipsum pariatur, minima alias nesciunt.</p>
            <p>Voluptas illum excepturi aut quae, autem impedit sed non at corporis inventore itaque nostrum repellendus placeat, eum consequuntur cumque, vel voluptates esse. Suscipit mollitia aliquam optio, consectetur dicta quis officia.</p>
            <p>Possimus voluptas saepe quam reiciendis rerum reprehenderit error adipisci totam. Tempore doloribus, porro nemo odio neque rerum voluptatum dignissimos illo quis! Quidem quos maiores ipsum explicabo dolorem pariatur quas assumenda.</p>
            <p>Nisi maiores illum soluta provident placeat aspernatur cumque quod voluptatibus impedit id et minus, dicta tempore accusamus at inventore veritatis neque culpa mollitia. Animi, necessitatibus in dolorem perspiciatis harum voluptatum.</p>
            <p>Quas reprehenderit eveniet ex dicta soluta atque, quae facilis itaque mollitia consequatur consectetur, minima? Aliquid quae inventore eius odit vero ipsam quisquam adipisci harum vitae ad quis, tempora reprehenderit quia.</p>
            <p>Labore, temporibus, doloremque? Voluptates aut voluptatum corporis eum, consectetur labore similique quisquam, velit officia soluta nesciunt numquam quo, nostrum. Molestias delectus facilis odio id quae eveniet molestiae nobis sed fugit!</p>
            <p>Corporis nam quidem error. Excepturi eos nemo quas at ullam nesciunt quae, ipsam ad ducimus esse voluptatum, vel, sed consectetur. Laboriosam non, ipsam eos, reiciendis fugiat earum facere temporibus voluptas!</p>
            <p>Quos maiores, cumque nobis! Quisquam rem quidem, ex necessitatibus at ullam! Excepturi sit asperiores ad quibusdam, eum modi sed iusto perspiciatis vel officia hic nam perferendis ipsa saepe reiciendis non.</p>
          </div>
        </ScrollView>
      </Example>
    );
  }
}
