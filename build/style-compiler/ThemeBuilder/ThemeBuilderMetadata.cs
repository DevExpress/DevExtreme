namespace StyleCompiler.ThemeBuilder
{
    class ThemeBuilderMetadata
    {
        public string Name { get; set; }
        public string Key { get; set; }
        public string Type { get; set; }
        public string TypeValues { get; set; }
        public string Group { get; set; }
        public string PaletteColorOpacity { get; set; }
        public string Inherit { get; set; }
        public string ColorFunctions { get; set; }
        public bool IsLastSubGroupItem { get; set; }
    }
}
