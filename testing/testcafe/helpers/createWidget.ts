import { ClientFunction } from 'testcafe';

export default async function createWidget(
    widgetName: string,
    options: any,
    disableAnimation = false,
    selector = '#container') {
    await ClientFunction(() => {
        const widgetOptions = typeof options === 'function' ? options() : options;
        (window as any).widget = $(`${selector}`)[widgetName](widgetOptions)[widgetName]('instance');
    },
    {
        dependencies:
            {
                widgetName,
                options,
                selector
            }
    }
    )();

    if(disableAnimation) {
        await (ClientFunction(() => {
            (window as any).DevExpress.fx.off = true;
        }))();
    }
}
