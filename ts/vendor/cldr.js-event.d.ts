// Type definitions for Cldr.js 0.4.4
// Project: https://github.com/rxaviers/cldrjs
// Definitions by: Raman But-Husaim <https://github.com/RamanBut-Husaim>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// The definition file for event module.

declare namespace cldr {
    interface CldrStatic {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(event: string, listener: (path: string, value: any) => void): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        once(event: string, listener: (path: string, value: any) => void): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        off(event: string, listener: (path: string, value: any) => void): void;
    }

    interface CldrFactory {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(event: string, listener: (path: string, value: any) => void): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        once(event: string, listener: (path: string, value: any) => void): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        off(event: string, listener: (path: string, value: any) => void): void;
    }
}

declare module "cldr/event" {
    export = cldr;
}
