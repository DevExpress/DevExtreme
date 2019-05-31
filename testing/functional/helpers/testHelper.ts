import { ClientFunction } from 'testcafe';

export async function createWidget(widgetName: string, options: any) {
    await ClientFunction(() => {
        $("#container")[widgetName](options);
    },
        {
            dependencies:
            {
                widgetName: widgetName,
                options
            }
        }
    )()
}

export function getContainerFileUrl() {
    return getFileUrl(`/testing/functional/tests/container.html`);
}

export function getFileUrl(relativePath: string) {
    return `file://${process.cwd()}/${relativePath}`;
}
