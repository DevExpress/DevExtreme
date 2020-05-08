export class PostCompiler {
    addBasePath(css: string | Buffer, basePath: string): string {
        const normalizedPath = basePath.replace(/[\/\\]$/, '') + '/';
        return css.toString().replace(/(url\()("|')?(icons|fonts)/g, `$1$2${normalizedPath}$3`);
    }
}