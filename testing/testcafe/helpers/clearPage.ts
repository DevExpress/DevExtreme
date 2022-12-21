import { ClientFunction } from 'testcafe';

export async function clearTestPage(): Promise<void> {
  await ClientFunction(() => {
    const body = document.querySelector('body');

    $('#container').remove();
    $('#otherContainer').remove();

    const containerElement = document.createElement('div');
    containerElement.setAttribute('id', 'container');

    const otherContainerElement = document.createElement('div');
    otherContainerElement.setAttribute('id', 'otherContainer');

    body?.prepend(otherContainerElement);
    body?.prepend(containerElement);

    $('#customStylesheetRules').remove();
  })();
}
