using System.Collections.Generic;
using System.Linq;

namespace StyleCompiler.ThemeBuilder
{
    class ThemeBuilderItem
    {
        public string LessTemplate { get; set; }
        public List<ThemeBuilderMetadata> Metadata { get; set; }

        private ThemeBuilderItem()
        {

        }

        public static ThemeBuilderItem Get(string sourcePath, ThemeId theme, string[] lessPaths)
        {
            lessPaths = lessPaths.Distinct().ToArray();
            var lessParser = new ThemeBuilderLessParser(ThemeBuilderLessFilesReader.ReadPaths(lessPaths));
            var meta = lessParser.GenerateThemeBuilderMetadata();

            string lessData = ThemeBuilderLessFilesReader.ReadPaths(lessPaths);
            lessData = ImageInliner.InlineImages(lessData, sourcePath);
            lessData = ThemeBuilderLessParser.MinifyLess(lessData);

            return new ThemeBuilderItem
            {
                Metadata = meta,
                LessTemplate = lessData
            };
        }
    }
}
