import { ClientFunction } from 'testcafe';
import { removeStylesheetRulesFromPage } from './domUtils';

export async function clearTestPage(): Promise<void> {
  await ClientFunction(async () => {
    const body = document.querySelector('body');

    $('#container').remove();
    $('#otherContainer').remove();

    const containerElement = document.createElement('div');
    containerElement.setAttribute('id', 'container');

    const otherContainerElement = document.createElement('div');
    otherContainerElement.setAttribute('id', 'otherContainer');

    body?.prepend(otherContainerElement);
    body?.prepend(containerElement);

    await removeStylesheetRulesFromPage();
  })();
}
