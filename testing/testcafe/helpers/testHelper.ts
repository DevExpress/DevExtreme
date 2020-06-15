import { ClientFunction } from 'testcafe';

export async function createWidget(
    widgetName: string,
    options: any,
    disableAnimation = false,
    selector = "#container")
{
    await ClientFunction(() => {
        const widgetoptions = typeof options === 'function' ? options() : options;
        (window as any).widget = $(`${selector}`)[widgetName](widgetoptions)[widgetName]("instance");
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
