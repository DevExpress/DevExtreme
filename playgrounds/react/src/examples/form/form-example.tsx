import {
  Form, FormItem, FormItemLabel, RadioButton, RadioGroup,
} from '@devextreme/react';

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
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
}
