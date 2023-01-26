import { RadioButton } from '@devextreme/react';
import { CustomRule, CustomRule1 } from '../validation/components/dummy-validation';
import {
  Form,
  FormItemHint,
  FormItemHoc,
  FormItemLabel,
  FormItemPlain,
} from './components';
import { RadioGroupEditor as RadioGroup } from './components/form-item-hoc-approach/radio-group-form-editor';

export function FormExample() {
  return (
    <div className="example">
      <div className="example__title">Form example:</div>
      <div className="example__control">
        <div className="example__play-part">
          <span>Simple form: </span>
          <Form>
            <FormItemPlain name="example">
              <RadioGroup defaultValue="second">
                <RadioButton value="first" label="First" />
                <RadioButton value="second" label="Second" />
                <RadioButton value="third" label="Third" />
              </RadioGroup>
              <FormItemLabel>Radio group:</FormItemLabel>
              <CustomRule
                message="Should not be First"
                validate={(value) => value !== 'first'}
              />
              <CustomRule1
                message="Should be First or Second"
                validate={(value) => value === 'first' || value === 'second'}
              />
              <FormItemHint>This is a hint: </FormItemHint>
            </FormItemPlain>
            <br />
            <FormItemPlain name="example1">
              <RadioGroup defaultValue={3}>
                <RadioButton value={1} label="1" />
                <RadioButton value={2} label="2" />
                <RadioButton value={3} label="3" />
                <RadioButton value={4} label="4" />
              </RadioGroup>
              <FormItemLabel>Radio group 2:</FormItemLabel>
              <CustomRule
                message="Should be > 3"
                validate={(value) => (value as number) > 3}
              />
            </FormItemPlain>
          </Form>
          <br />
          <Form>
            <FormItemHoc name="example2">
              <RadioGroup defaultValue="Toe">
                <RadioButton value="Tic" label="Tic" />
                <RadioButton value="Tac" label="Tac" />
                <RadioButton value="Toe" label="Toe" />
              </RadioGroup>
              <CustomRule
                message="Should not be Toe"
                validate={(value) => value !== 'Toe'}
              />
              <FormItemLabel>Second approach:</FormItemLabel>
            </FormItemHoc>
          </Form>
        </div>
      </div>
    </div>
  );
}
