import { RadioButton, RadioGroup } from '@devextreme/react';
import {
  CustomRule, CustomRule1, Form, FormItem, FormItemHint, FormItemLabel,
} from './components';

export function FormExample() {
  return (
    <div className="example">
      <div className="example__title">Form example:</div>
      <div className="example__control">
        <div className="example__play-part">
          <span>Simple form: </span>
          <Form>
            <FormItem name="example">
              <RadioGroup defaultValue="second">
                <RadioButton value="first" label="First" name="example" />
                <RadioButton value="second" label="Second" name="example" />
                <RadioButton value="third" label="Third" name="example" />
              </RadioGroup>
              <FormItemLabel>Radio group:</FormItemLabel>
              <CustomRule message="Should not be First" validate={(value) => value !== 'first'} />
              <CustomRule1 message="Should be First or Second" validate={(value) => value === 'first' || value === 'second'} />
              <FormItemHint>This is a hint: </FormItemHint>
            </FormItem>
            <br />
            <FormItem name="example1">
              <RadioGroup defaultValue={3}>
                <RadioButton value={1} label="1" name="example1" />
                <RadioButton value={2} label="2" name="example1" />
                <RadioButton value={3} label="3" name="example1" />
                <RadioButton value={4} label="4" name="example1" />
              </RadioGroup>
              <FormItemLabel>Radio group 2:</FormItemLabel>
              <CustomRule message="Should be > 3" validate={(value) => (value as number) > 3} />
            </FormItem>
            <div>blalbla</div>
          </Form>
        </div>
      </div>
    </div>
  );
}
