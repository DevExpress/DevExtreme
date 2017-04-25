using System;
using System.IO;
using System.Linq;

namespace StyleCompiler.ThemeBuilder
{
    static class ThemeBuilderLessFilesReader
    {

        public static string[] GetLessPaths(string sourcePath, ThemeId themeId)
        {
            return LessAggregation.EnumerateAllItems(sourcePath, "")
                .First(item => IsCssFileForTheme(item.CssFile, themeId))
                .Segments
                .SelectMany(s => s.LessFiles)
                .Select(i => Path.Combine(sourcePath, i))
                .ToArray();
        }

        public static string ReadPaths(string[] paths)
        {
            return String.Join("\n", paths.Select(p => LessAggregation.InlineImports(p)));
        }


        static bool IsCssFileForTheme(LessAggregation.ICssFileInfo cssFile, ThemeId themeId)
        {
            var themeCssFile = cssFile as LessAggregation.ThemeCssFileInfo;
            if (themeCssFile == null)
                return false;

            return themeCssFile.ThemeName == themeId.Theme
                && themeCssFile.ColorSchemeName == themeId.ColorScheme
                && LessRegistry.SizeSchemesEqual(themeCssFile.SizeSchemeName, themeId.SizeScheme);
        }
    }
}
