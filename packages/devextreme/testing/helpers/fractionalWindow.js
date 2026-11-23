const WINDOWS_SCALE_ZOOM = 1.25;
const FRACTIONAL_WINDOW_HEIGHT = 481.6;

export function createWindowWithOwnModule(modulePath, onReady) {
    const importMap = document.querySelector('script[type="importmap"]');
    const runnerModule = document.querySelector('script[type="module"]');
    const frame = document.createElement('iframe');

    frame.style.zoom = WINDOWS_SCALE_ZOOM;
    frame.style.height = `${FRACTIONAL_WINDOW_HEIGHT}px`;
    frame.addEventListener('load', () => {
        frame.contentWindow.ownModule.then((ownModule) => onReady(frame.contentWindow, ownModule));
    }, { once: true });
    frame.setAttribute('srcdoc', `<!DOCTYPE html>
        <script type="importmap" nonce="${importMap.nonce}">${importMap.textContent}</script>
        <script type="module" nonce="${runnerModule.nonce}">
            window.ownModule = import('${modulePath}');
        </script>`);

    document.getElementById('qunit-fixture').appendChild(frame);
}
