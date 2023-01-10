import {
  CustomRule, CustomRule1, Form, FormItem, FormItemLabel, RadioButton, RadioGroup,
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
              <CustomRule message="we out" validate={() => false} />
              <CustomRule1 message="we out too" validate={() => false} />
              <CustomRule message="we in" validate={() => true} />
            </FormItem>
            <div>blalbla</div>
          </Form>
        </div>
      </div>
    </div>
  );
}
