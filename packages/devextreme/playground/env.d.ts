declare module 'virtual:demos-meta' {
    interface DemoEntry { title: string; name: string; files: string[] }
    interface DemosMeta { demosRoot: string; demos: Record<string, DemoEntry[]> }
    const demosMeta: DemosMeta;
    export default demosMeta;
}
