import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import TextBox from '../../model/textBox';

fixture `Mask T814440`
    .page(url(__dirname, './pages/t814440.html'));

test("'onInput' and 'onValueChanged' events should raise then the mask enabled (T814440)", async t => {
    const textBox = new TextBox('#textbox1');
    const { input } = textBox;
    const eventLog = Selector('#eventLog');

    await t
        .typeText(input, '1')
        .expect(input.value).eql('1_')
        .expect(textBox.option('value')).eql('')
        .expect(textBox.option('text')).eql('1_')
        .expect(eventLog.value).eql('input\n')

        .pressKey('2 3')
        .expect(input.value).eql('12')
        .expect(textBox.option('value')).eql('')
        .expect(textBox.option('text')).eql('12')
        .expect(eventLog.value).eql('input\ninput\n')

        .pressKey('backspace backspace backspace')
        .expect(input.value).eql('__')
        .expect(textBox.option('value')).eql('')
        .expect(textBox.option('text')).eql('__')
        .expect(eventLog.value).eql('input\ninput\ninput\ninput\n')

        .pressKey('enter')
        .expect(input.value).eql('__')
        .expect(textBox.option('value')).eql('')
        .expect(textBox.option('text')).eql('__')
        .expect(eventLog.value).eql('input\ninput\ninput\ninput\n')

        .pressKey('2 enter')
        .expect(input.value).eql('2_')
        .expect(textBox.option('value')).eql('2')
        .expect(textBox.option('text')).eql('2_')
        .expect(eventLog.value).eql('input\ninput\ninput\ninput\ninput\nchanged\n');
});

test("'onInput' and 'onValueChanged' events should raise then the mask enabled (with 'valueChangeEvent') (T814440)", async t => {
    const textBox = new TextBox('#textbox2');
    const { input } = textBox;
    const eventLog = Selector('#eventLog');

    await t
        .typeText(input, '1')
        .expect(input.value).eql('1_')
        .expect(textBox.option('value')).eql('1')
        .expect(textBox.option('text')).eql('1_')
        .expect(eventLog.value).eql('changed\ninput\n')

        .pressKey('2 3')
        .expect(input.value).eql('12')
        .expect(textBox.option('value')).eql('12')
        .expect(textBox.option('text')).eql('12')
        .expect(eventLog.value).eql('changed\ninput\nchanged\ninput\n')

        .pressKey('backspace backspace backspace')
        .expect(input.value).eql('__')
        .expect(textBox.option('value')).eql('')
        .expect(textBox.option('text')).eql('__')
        .expect(eventLog.value).eql('changed\ninput\nchanged\ninput\nchanged\ninput\nchanged\ninput\n')

        .pressKey('2 enter')
        .expect(input.value).eql('2_')
        .expect(textBox.option('value')).eql('2')
        .expect(textBox.option('text')).eql('2_')
        .expect(eventLog.value).eql('changed\ninput\nchanged\ninput\nchanged\ninput\nchanged\ninput\ninput\nchanged');
});
