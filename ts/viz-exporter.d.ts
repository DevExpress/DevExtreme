declare module DevExpress.exporter {

    export interface dxExporterOptions extends DevExpress.DOMComponentOptions {
        /** @docid dxexporteroptions_exportFormat */
        exportFormat?: Array<string>;

        /** @docid dxexporteroptions_fileName */
        fileName?: string;

        /** @docid dxexporteroptions_printingEnabled */
        printingEnabled?: boolean;

        /** @docid dxexporteroptions_serverUrl */
        serverUrl?: string;

        /** @docid dxexporteroptions_showMenu */
        showMenu?: boolean;

        /** @docid dxexporteroptions_sourceContainer */
        sourceContainer?: string;
    }

    /** @docid dxexporter */
    export class dxExporter extends DevExpress.DOMComponent {
        constructor(element: JQuery, options?: dxExporterOptions);
        constructor(element: Element, options?: dxExporterOptions);

        /** @docid dxexportermethods_exportTo */
        exportTo(fileName: string, format: string): void;

        /** @docid dxexportermethods_print */
        print(): void;
    }

}

interface JQuery {

    dxExporter(options?: DevExpress.exporter.dxExporterOptions): JQuery;
    dxExporter(methodName: string, ...params: any[]): any;
    dxExporter(methodName: "instance"): DevExpress.exporter.dxExporter;

}
