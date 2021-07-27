export interface BrowserInfo {
    webkit?: boolean;
    chrome?: boolean;
    mozilla?: boolean;
    unknown?: boolean;
    msie?: boolean;
    version?: string;
}

declare const browser: BrowserInfo;

export default browser;
