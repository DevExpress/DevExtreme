import { ClientFunction } from 'testcafe';

export async function createWidget(widgetName: string, options: any, disableAnimation = false, selector = "#container") {
    await ClientFunction(() => {
        (window as any).widget = $(`${selector}`)[widgetName](options)[widgetName]("instance");
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

    if(disableAnimation)
        await (ClientFunction(() => (window as any).DevExpress.fx.off = true))();
}
