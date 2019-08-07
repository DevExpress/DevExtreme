import { ClientFunction } from 'testcafe';

const offAnimation = ClientFunction(() => (window as any).DevExpress.fx.off = true);

export async function createWidget(widgetName: string, options: any, disableAnimation: boolean = false) {
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
    )()

    disableAnimation && await offAnimation();
}

export function getContainerFileUrl() {
    return getFileUrl(`/testing/functional/tests/container.html`);
}

export function getFileUrl(relativePath: string) {
    return `file://${process.cwd()}/${relativePath}`;
}
