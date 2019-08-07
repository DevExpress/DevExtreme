using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace StyleCompiler
{

    static class LessAggregation
    {

        public interface ICssFileInfo
        {
        }

        public class CommonCssFileInfo : ICssFileInfo
        {
            string _distributionName;
            bool _appendCommonPostfix;

            public CommonCssFileInfo(string distributionName, bool appendCommonPostfix)
            {
                _distributionName = distributionName;
                _appendCommonPostfix = appendCommonPostfix;
            }
        }

        public class ThemeCssFileInfo : ICssFileInfo
        {
            LessRegistry.KnownThemeInfo _theme;
            string _colorSchemeName;
            string _sizeSchemeName;

            public ThemeCssFileInfo(string distributionName, LessRegistry.KnownThemeInfo theme, string colorSchemeName, string sizeSchemeName)
            {
                DistributionName = distributionName;
                _theme = theme;
                _colorSchemeName = colorSchemeName;
                _sizeSchemeName = sizeSchemeName;
            }

            public string DistributionName { get; private set; }
            public string ThemeName { get { return _theme.Name; } }
            public string ColorSchemeName { get { return _colorSchemeName; } }
            public string SizeSchemeName { get { return _sizeSchemeName; } }

        }

        public class Item
        {
            public ICssFileInfo CssFile;
            public CacheableSegment[] Segments;
        }

        public class CacheableSegment
        {
            public string Key;
            public string[] LessFiles;
        }

        public static string InlineImports(string lessFileName)
        {
            var pattern = "@import \"([\\w\\.\\/]*)\";";

            return Regex.Replace(
                File.ReadAllText(lessFileName), pattern,
                m =>
                {
                    var importPath = m.Groups[1].Value;
                    var extensionPresent = importPath.EndsWith(".less");

                    return File.ReadAllText(
                        Path.GetFullPath(
                            Path.Combine(
                                Path.GetDirectoryName(lessFileName),
                                importPath.Replace('/', Path.DirectorySeparatorChar) + (extensionPresent ? "" : ".less")
                            )
                        )
                    );
                },
                RegexOptions.Singleline
            );
        }

        public static Item CreateCommonItem(string distributionName)
        {
            return new Item
            {
                CssFile = new CommonCssFileInfo(distributionName, LessRegistry.CssDistributions[distributionName].UseCommonPostfix),
                Segments = new CacheableSegment[] { CreateCommonSegment(distributionName) }
            };
        }

        public static Item CreateThemeItem(string sourcePath, string distributionName, LessRegistry.KnownThemeInfo theme, string colorSchemeName, string sizeSchemeName)
        {
            var distribution = LessRegistry.CssDistributions[distributionName];
            var segments = new List<CacheableSegment>();

            if (!distribution.CommonsInExternalFiles)
                segments.Add(CreateCommonSegment(distributionName));

            foreach (var moduleName in ResolveModules(distributionName))
            {
                var lessFiles = LessRegistry.GetThemeLessFiles(sourcePath, moduleName, theme.Name, colorSchemeName, sizeSchemeName);
                if (lessFiles == null)
                    continue;

                segments.Add(new CacheableSegment
                {
                    Key = String.Join("|", moduleName, theme.Name, colorSchemeName, sizeSchemeName),
                    LessFiles = lessFiles
                });
            }

            return new Item
            {
                CssFile = new ThemeCssFileInfo(distributionName, theme, colorSchemeName, sizeSchemeName),
                Segments = segments.ToArray()
            };
        }

        public static IEnumerable<Item> EnumerateAllItems(string sourcePath, string distributionName)
        {
            var distribution = LessRegistry.CssDistributions[distributionName];

            if (distribution.CommonsInExternalFiles)
                yield return CreateCommonItem(distributionName);

            if (distribution.SupportedThemes != null)
            {
                var singleSchemeMode = Utils.IsQUnitCI();

                foreach (var themeName in distribution.SupportedThemes)
                {
                    var theme = LessRegistry.KnownThemeMap[themeName];
                    var schemes = from colorSchemeName in theme.ColorSchemeNames
                                  from sizeSchemeName in EnumerateSizeSchemes(distributionName, themeName)
                                  select (colorSchemeName, sizeSchemeName);

                    foreach (var s in schemes)
                    {
                        yield return CreateThemeItem(sourcePath, distributionName, theme, s.colorSchemeName, s.sizeSchemeName);
                        if (singleSchemeMode)
                            break;
                    }
                }
            }
        }

        static IEnumerable<string> EnumerateSizeSchemes(string distributionName, string themeName)
        {
            var dist = LessRegistry.CssDistributions[distributionName];
            var sizes = dist.SupportedSizeSchemes;
            if (sizes == null || !sizes.ContainsKey(themeName))
                return new string[] { null };

            return sizes[themeName];
        }

        static CacheableSegment CreateCommonSegment(string distributionName)
        {
            return new CacheableSegment
            {
                Key = distributionName + "_common",
                LessFiles = LessRegistry.GetCommonLessFiles(ResolveModules(distributionName))
            };
        }

        static string[] ResolveModules(string distributionName)
        {
            var dist = LessRegistry.CssDistributions[distributionName];
            return LessRegistry.ResolveRequiredModules(dist.Modules);
        }

    }

}
