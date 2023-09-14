import {
  Component,
  ComponentBindings,
  Effect,
  InternalState,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { TextArea } from '../../../../editors/text_area';

// istanbul ignore next: should be tested in React infrastructure
export const viewFunction = ({
  props: {
    value,
  },
}: DescriptionEditor): JSX.Element => (
  <TextArea value={value} />
);

@ComponentBindings()
export class DescriptionEditorProps {
  @OneWay() value!: string | undefined;

  @OneWay() valueChange!: (value: string) => void;
}

@Component({ view: viewFunction })
export class DescriptionEditor extends JSXComponent<
DescriptionEditorProps, 'value' | 'valueChange'>() {
  @InternalState()
  value: string | undefined;

  @Effect({ run: 'once' }) // WA props are no accessible on state init
  initDate(): void {
    if (!this.value) {
      this.value = this.props.value;
    }
  }
}
