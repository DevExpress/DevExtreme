export declare function ensureDir(dirPath: string): Promise<void>;
export declare function readJson<T = unknown>(filePath: string): Promise<T>;
export declare function writeJson(filePath: string, data: unknown, spaces?: number): Promise<void>;
export declare function processFiles(pattern: string, processor: (filePath: string) => Promise<void>, options?: {
    ignore?: string[];
}): Promise<number>;
export declare function exists(filePath: string): Promise<boolean>;
export declare function copyFile(from: string, to: string): Promise<void>;
export declare function readFileText(filePath: string): Promise<string>;
export declare function writeFileText(filePath: string, content: string): Promise<void>;
