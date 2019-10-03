import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import TextBox from '../../model/textBox';

fixture `Mask T814440`
    .page(url(__dirname, './pages/t814440.html'));

test("'onInput' and 'onValueChanged' events should raise then the mask enabled (T814440)", async t => {
    const textBox = new TextBox('#textbox');
    const { input } = textBox;
    const eventLog = Selector('#eventLog');

    await t
        .typeText(input, '1', { caretPos: 0 })
        .expect(input.value).eql('1')
        .expect(textBox.option('value')).eql('1')
        .expect(textBox.option('text')).eql('1')
        .expect(eventLog.value).eql('changed\ninput\n')

        .typeText(input, '2')
        .expect(input.value).eql('1')
        .expect(textBox.option('value')).eql('1')
        .expect(textBox.option('text')).eql('1')
        .expect(eventLog.value).eql('changed\ninput\n')

        .pressKey('backspace')
        .expect(input.value).eql('_')
        .expect(textBox.option('value')).eql('')
        .expect(textBox.option('text')).eql('_')
        .expect(eventLog.value).eql('changed\ninput\nchanged\ninput\n')

        .pressKey('backspace')
        .expect(input.value).eql('_')
        .expect(textBox.option('value')).eql('')
        .expect(textBox.option('text')).eql('_')
        .expect(eventLog.value).eql('changed\ninput\nchanged\ninput\n')
});
