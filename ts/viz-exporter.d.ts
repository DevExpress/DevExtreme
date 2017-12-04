declare module DevExpress.exporter {

    export interface dxExporterOptions extends DevExpress.DOMComponentOptions {
        /** Specifies a set of formats available for exporting into. */
        exportFormat?: Array<string>;

        /** Specifies a name that should be assigned to the file with the exported widget. */
        fileName?: string;

        /** Specifies whether or not to enable printing operation. */
        printingEnabled?: boolean;

        /** Specifies the URL of the server that supplies the exporting service. */
        serverUrl?: string;

        /** Specifies whether to show the export menu or not. */
        showMenu?: boolean;

        /** Specifies a div container that holds the widget to be exported. */
        sourceContainer?: string;
    }

    /**
 * The Exporter widget allows you to export your chart, gauge or any other DevExtreme data visualization widget into an image or a document. The Exporter works in conjunction with other widgets and should not be used separately.
 * @deprecated [note]This widget is <span style="color:red">deprecated</span>. Instead of it, use the built-in client-side exporting. For further information, refer to the export option of a particular widget.
 */
    export class dxExporter extends DevExpress.DOMComponent {
        constructor(element: JQuery, options?: dxExporterOptions);
        constructor(element: Element, options?: dxExporterOptions);

        /** Exports a DevExtreme data visualization widget into a file with a specified name and format. */
        exportTo(fileName: string, format: string): void;

        /** Calls the browser's print window. */
        print(): void;
    }

}

interface JQuery {

    dxExporter(options?: DevExpress.exporter.dxExporterOptions): JQuery;
    dxExporter(methodName: string, ...params: any[]): any;
    dxExporter(methodName: "instance"): DevExpress.exporter.dxExporter;

}
