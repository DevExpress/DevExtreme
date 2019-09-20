import { ClientFunction } from 'testcafe';

export async function createWidget(widgetName: string, options: any, disableAnimation = false) {
    await ClientFunction(() => {
        (window as any).widget = $("#container")[widgetName](options)[widgetName]("instance");
    },
        {
            dependencies:
            {
                widgetName: widgetName,
                options
            }
        }
    )();

    if(disableAnimation)
        await (ClientFunction(() => (window as any).DevExpress.fx.off = true))();
}

export function getContainerFileUrl() {
    return getFileUrl(`/testing/functional/tests/container.html`);
}

export function getFileUrl(relativePath: string) {
    return `file://${process.cwd()}/${relativePath}`;
}
