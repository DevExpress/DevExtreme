using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StyleCompiler.ThemeBuilder
{
    class ThemeBuilderAssetGenerator
    {
        readonly static ThemeId[] THEMES = new ThemeId[] {
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_LIGHT),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_DARK),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_CARMINE),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_DARKMOON),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_SOFTBLUE),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_DARKVIOLET),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_GREENMIST),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_LIGHT, LessRegistry.SIZE_SCHEME_COMPACT),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_DARK, LessRegistry.SIZE_SCHEME_COMPACT),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_CARMINE, LessRegistry.SIZE_SCHEME_COMPACT),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_DARKMOON, LessRegistry.SIZE_SCHEME_COMPACT),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_SOFTBLUE, LessRegistry.SIZE_SCHEME_COMPACT),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_DARKVIOLET, LessRegistry.SIZE_SCHEME_COMPACT),
            new ThemeId(LessRegistry.THEME_GENERIC, LessRegistry.COLOR_SCHEME_GREENMIST, LessRegistry.SIZE_SCHEME_COMPACT),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_BLUE_LIGHT),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_ORANGE_LIGHT),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_LIME_LIGHT),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_PURPLE_LIGHT),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_TEAL_LIGHT),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_BLUE_DARK),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_ORANGE_DARK),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_LIME_DARK),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_PURPLE_DARK),
            new ThemeId(LessRegistry.THEME_MATERIAL, LessRegistry.COLOR_SCHEME_TEAL_DARK),

            new ThemeId(LessRegistry.THEME_IOS7, LessRegistry.COLOR_SCHEME_DEFAULT),
            new ThemeId(LessRegistry.THEME_ANDROID5, LessRegistry.COLOR_SCHEME_LIGHT),
            new ThemeId(LessRegistry.THEME_WIN10, LessRegistry.COLOR_SCHEME_BLACK),
            new ThemeId(LessRegistry.THEME_WIN10, LessRegistry.COLOR_SCHEME_WHITE)
        };

        readonly string
            _sourcePath,
            _version,
            _themeBuilderUIFolder,
            _pathToThemeBuilderDataFolder,
            _pathToThemeBuilderMetadata;

        public ThemeBuilderAssetGenerator(string sourcePath, string version, string themeBuilderUIFolder)
        {
            _sourcePath = sourcePath;
            _version = version;
            _themeBuilderUIFolder = themeBuilderUIFolder;
            _pathToThemeBuilderDataFolder = Path.Combine(_themeBuilderUIFolder, "data");
            _pathToThemeBuilderMetadata = Path.Combine(_pathToThemeBuilderDataFolder, "metadata");
        }

        public void Generate()
        {
            var lessPath = Path.Combine(_pathToThemeBuilderDataFolder, "less");

            if (!Directory.Exists(lessPath))
                Directory.CreateDirectory(lessPath);
            if (!Directory.Exists(_pathToThemeBuilderMetadata))
                Directory.CreateDirectory(_pathToThemeBuilderMetadata);

            var allMetadata = new ConcurrentDictionary<string, string>();
            var allLessTemplates = new ConcurrentDictionary<string, string>();
            var tasks = new List<Task>();
            foreach (var theme in THEMES)
            {
                var task = new Task(delegate ()
                {
                    var paths = ThemeBuilderLessFilesReader.GetLessPaths(_sourcePath, theme);
                    var bag = PersistentCache.Instance.Get(new[] { "tb-asset-gen", theme.FullName }, paths, delegate ()
                    {
                        var themeItem = ThemeBuilderItem.Get(_sourcePath, theme, paths);

                        return new Dictionary<string, string> {
                            { "meta", PrepareMetadata(themeItem.Metadata, theme) },
                            { "less", themeItem.LessTemplate }
                        };
                    });

                    allMetadata[theme.FullName] = bag["meta"];
                    allLessTemplates[theme.FullName] = bag["less"];
                });
                task.Start();
                tasks.Add(task);
            }
            Task.WaitAll(tasks.ToArray());

            foreach (var theme in THEMES)
                File.WriteAllText(Path.Combine(lessPath, "theme-builder-" + theme.FullName + ".less"), allLessTemplates[theme.FullName]);

            using (var stream = File.Open(Path.Combine(_pathToThemeBuilderMetadata, "dx-theme-builder-metadata.js"), FileMode.Create))
            using (var writer = new StreamWriter(stream))
            {
                writer.WriteLine("module.exports = {");
                foreach (var theme in THEMES)
                    writer.WriteLine(allMetadata[theme.FullName]);
                writer.Write(GetMetadataVersionScript());
                writer.WriteLine("}");
            }
        }


        string PrepareMetadata(List<ThemeBuilderMetadata> metadata, ThemeId theme)
        {
            string writableContent = JsonConvert.SerializeObject(metadata, Formatting.Indented);
            return theme.FullName.Replace("-", "_") + "_metadata: " + writableContent + ",";
        }

        string GetMetadataVersionScript()
        {
            return "_metadata_version: \"" + _version + "\",";
        }
    }
}
