import ajax from 'devextreme/core/utils/ajax';

const sendRequestOrig = ajax.sendRequest;
const fetchOrig = fetch;
const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore';

ajax.sendRequest = (options) => {
    options.xhrFields = {
        withCredentials: true,
    };
    
    return sendRequestOrig(options);
}

async function fetchAntiForgeryToken(): Promise<{ headerName: string; token: string }> {
    try {
        const response = await fetchOrig(`${BASE_PATH}/api/Common/GetAntiForgeryToken`, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to retrieve anti-forgery token: ${errorMessage || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(errorMessage);
    }
}

async function getAntiForgeryTokenValue(): Promise<{ headerName: string; token: string }> {
    const tokenMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    if (tokenMeta) {
        const headerName = tokenMeta.dataset.headerName || 'RequestVerificationToken';
        const token = tokenMeta.getAttribute('content') || '';
        return Promise.resolve({ headerName, token });
    }

    const tokenData = await fetchAntiForgeryToken();
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = tokenData.token;
    meta.dataset.headerName = tokenData.headerName;
    document.head.appendChild(meta);
    return tokenData;
}

window.fetch = async (url, options = {}) => {
    const { headerName, token } = await getAntiForgeryTokenValue();

    options.headers = {
        [headerName]: token,
        ...(options.headers || {})
    };
    
    options.credentials = 'include';
    
    return await fetchOrig(url, options);
}