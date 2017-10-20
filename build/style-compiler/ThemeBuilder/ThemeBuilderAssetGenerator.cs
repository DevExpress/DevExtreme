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
        const string THEME_BUILDER_METADATA_FILENAME = "metadata.json";

        const string BOOTSTRAP_VARIABLES_FILENAME = "variables.less";
        const string BOOTSTRAP_METADATA_FILENAME = "bootstrap-metadata.json";
        const string VARIABLES_MIGRATION_METADATA_FILENAME = "variables-migration-metadata.json";
        const string ADDITIONAL_MIGRATION_METADATA_FILENAME = "additional-migration-metadata.json";

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
            new ThemeId(LessRegistry.THEME_IOS7, LessRegistry.COLOR_SCHEME_DEFAULT),
            new ThemeId(LessRegistry.THEME_ANDROID5, LessRegistry.COLOR_SCHEME_LIGHT),
            new ThemeId(LessRegistry.THEME_WIN10, LessRegistry.COLOR_SCHEME_BLACK),
            new ThemeId(LessRegistry.THEME_WIN10, LessRegistry.COLOR_SCHEME_WHITE)
        };

        readonly string
            _sourcePath,
            _version,
            _themeBuilderUIFolder,
            _previewInternalContent,
            _pathToThemeBuilderDataFolder,
            _pathToThemeBuilderJSDataFolder,
            _pathToBootstrapVariableFolder;

        public ThemeBuilderAssetGenerator(string sourcePath, string version, string themeBuilderUIFolder)
        {
            _sourcePath = sourcePath;
            _version = version;
            _themeBuilderUIFolder = themeBuilderUIFolder;
            _previewInternalContent = Path.Combine(_themeBuilderUIFolder, "PreviewInternalContent");
            _pathToThemeBuilderDataFolder = Path.Combine(_themeBuilderUIFolder, "Content", "Data");
            _pathToThemeBuilderJSDataFolder = Path.Combine(_pathToThemeBuilderDataFolder, "JS");
            _pathToBootstrapVariableFolder = Path.Combine(_themeBuilderUIFolder, "Bootstrap");
        }

        public void Generate()
        {
            if (!Directory.Exists(_pathToThemeBuilderJSDataFolder))
                Directory.CreateDirectory(_pathToThemeBuilderJSDataFolder);

            var lessPath = Path.Combine(_pathToThemeBuilderDataFolder, "LESS");
            if (!Directory.Exists(lessPath))
                Directory.CreateDirectory(lessPath);

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
                        GenerateMissingDataForWidgetsPreview(themeItem.Metadata);

                        return new Dictionary<string, string> {
                            { "meta", PrepareMetadata(themeItem.Metadata, theme) },
                            { "less", GetLessTemplateScript(themeItem.LessTemplate) }
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
                File.WriteAllText(Path.Combine(lessPath, "theme-builder-" + theme.FullName + ".less.js"), allLessTemplates[theme.FullName]);

            using (var stream = File.Open(Path.Combine(_pathToThemeBuilderDataFolder, "JS", "dx-theme-builder-metadata.js"), FileMode.Create))
            using (var writer = new StreamWriter(stream))
            {
                foreach (var theme in THEMES)
                    writer.WriteLine(allMetadata[theme.FullName]);
                writer.Write(GetMetadataVersionScript());
            }

            GenerateCombinedDataForWidgetsPreview();

            string bootstrapMetadataContent = File.ReadAllText(Path.Combine(_pathToBootstrapVariableFolder, BOOTSTRAP_METADATA_FILENAME));
            StringBuilder content = new StringBuilder();
            content.Append(String.Concat(
                    "ThemeBuilder.__bootstrap_metadata",
                    " = function() { return ",
                    bootstrapMetadataContent,
                    ";};\n"
                    ));

            File.WriteAllText(Path.Combine(_pathToThemeBuilderJSDataFolder, "dx-theme-builder-bootstrap-metadata.js"), content.ToString());

            string variablesMigrationMetadataContent = File.ReadAllText(Path.Combine(_pathToBootstrapVariableFolder, VARIABLES_MIGRATION_METADATA_FILENAME));
            StringBuilder newContent = new StringBuilder();
            newContent.Append(String.Concat(
                    "ThemeBuilder.__variables_migration_metadata",
                    " = function() { return ",
                    variablesMigrationMetadataContent,
                    ";};\n"
                ));

            File.WriteAllText(Path.Combine(_pathToThemeBuilderJSDataFolder, "dx-theme-builder-variables-migration-metadata.js"), newContent.ToString());

            string additionalMigrationMetadataContent = File.ReadAllText(Path.Combine(_pathToBootstrapVariableFolder, ADDITIONAL_MIGRATION_METADATA_FILENAME));
            StringBuilder dataContent = new StringBuilder();
            dataContent.Append(String.Concat(
                    "ThemeBuilder.__additional_migration_metadata",
                    " = function() { return ",
                    additionalMigrationMetadataContent,
                    ";};\n"
                ));

            File.WriteAllText(Path.Combine(_pathToThemeBuilderJSDataFolder, "dx-theme-builder-additional-migration-metadata.js"), dataContent.ToString());
        }


        string PrepareMetadata(List<ThemeBuilderMetadata> metadata, ThemeId theme)
        {
            string writableContent = JsonConvert.SerializeObject(metadata, Formatting.Indented);
            return "ThemeBuilder.__" + theme.FullName.Replace("-", "_") + "_metadata = function(){ return " + writableContent + ";};";
        }

        string GetMetadataVersionScript()
        {
            return "ThemeBuilder.__get_metadata_version = function() { return \"" + _version + "\"; };";
        }

        void GenerateMissingDataForWidgetsPreview(List<ThemeBuilderMetadata> metadata)
        {
            string[] groups = metadata.Select(d => d.Group).Distinct().ToArray();
            foreach (string group in groups)
            {
                string pathToFile = Path.Combine(_previewInternalContent, group + ".group.json");
                if (!File.Exists(pathToFile))
                {
                    File.WriteAllText(pathToFile, String.Concat("{\n\"id\": \"", group, "\", \n\"widgets\": [\n]\n}"));
                }
            }
        }

        void GenerateCombinedDataForWidgetsPreview()
        {
            string[] files = Directory.GetFiles(_previewInternalContent, "*.group.json");
            StringBuilder content = new StringBuilder();
            foreach (string file in files)
            {
                string fileContent = File.ReadAllText(file);
                content.Append(String.Concat(
                    "ThemeBuilder.__" + Path.GetFileNameWithoutExtension(file).Replace(".", "_").ToLower(),
                    " = function() { return ",
                    fileContent,
                    ";};\n"
                    )); ;
            }
            File.WriteAllText(Path.Combine(_pathToThemeBuilderJSDataFolder, "dx-theme-builder-preview-metadata.js"), content.ToString());
        }

        string GetLessTemplateScript(string less)
        {
            return "lessTemplateLoadedCallback(\"" + less + "\")";
        }
    }
}