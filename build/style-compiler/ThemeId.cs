namespace StyleCompiler
{
    class ThemeId
    {
        public readonly string
            Theme,
            ColorScheme,
            SizeScheme;

        public ThemeId(string theme, string colorScheme, string sizeScheme = null)
        {
            Theme = theme;
            ColorScheme = colorScheme;
            SizeScheme = sizeScheme;
        }

        public string FullName
        {
            get
            {
                var result = Theme + "-" + ColorScheme;
                if (!LessRegistry.IsDefaultSizeScheme(SizeScheme))
                    result += "-" + SizeScheme;
                return result;
            }
        }
    }

}
