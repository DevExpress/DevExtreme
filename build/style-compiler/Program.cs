using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.DependencyInjection;
using StyleCompiler.ThemeBuilder;

namespace StyleCompiler
{
    public class Program
    {
        public static int Main(string[] argv)
        {
            try
            {
                var sourcePath = Utils.GetStylesPath();

                var cli = new CommandLineApplication();

                cli.Command("themes", c =>
                {
                    var versionOption = c.Option("--version", "", CommandOptionType.SingleValue);
                    var outputPathOption = c.Option("--output-path", "", CommandOptionType.SingleValue);
                    c.OnExecute(delegate
                    {
                        EnsureRequiredOptions(versionOption, outputPathOption);
                        CreateThemes(sourcePath, versionOption.Value(), outputPathOption.Value());
                        return 0;
                    });
                });

                cli.Command("tb-assets", c =>
                {
                    var versionOption = c.Option("--version", "", CommandOptionType.SingleValue);
                    var themeBuilderUiPath = c.Option("--tb-ui-path", "", CommandOptionType.SingleValue);
                    c.OnExecute(delegate
                    {
                        EnsureRequiredOptions(versionOption, themeBuilderUiPath);
                        new ThemeBuilderAssetGenerator(sourcePath, versionOption.Value(), themeBuilderUiPath.Value()).Generate();
                        return 0;
                    });
                });

                cli.Command("custom-theme", c =>
                {
                    var baseThemeOption = c.Option("--base-theme", "", CommandOptionType.SingleValue);
                    var baseColorSchemeOption = c.Option("--base-color-scheme", "", CommandOptionType.SingleValue);
                    var baseSizeSchemeOption = c.Option("--base-size-scheme", "", CommandOptionType.SingleValue);
                    var customMetaPathOption = c.Option("--custom-meta-path", "", CommandOptionType.SingleValue);
                    var outputPathOption = c.Option("--output-path", "", CommandOptionType.SingleValue);
                    c.OnExecute(delegate
                    {
                        EnsureRequiredOptions(baseThemeOption, baseColorSchemeOption, customMetaPathOption, outputPathOption);
                        CustomThemeGenerator.Generate(
                            sourcePath,
                            new ThemeId(
                                baseThemeOption.Value(),
                                baseColorSchemeOption.Value(),
                                baseSizeSchemeOption.Value()
                            ),
                            customMetaPathOption.Value(),
                            outputPathOption.Value()
                        );
                        return 0;
                    });

                });

                cli.Command("test-server", c =>
                {
                    c.OnExecute(delegate
                    {
                        RunTestServer();
                        return 0;
                    });
                });

                return cli.Execute(argv);
            }
            catch (Exception error)
            {
                Console.Error.WriteLine(error.Message);
                return 1;
            }
        }
        static void RunTestServer()
        {
            var url = "http://0.0.0.0:" + Ports.Get("style-compiler");

            var builder = new WebHostBuilder()
                .UseUrls(url)
                .UseKestrel()
                .ConfigureServices(services => services.AddMvcCore())
                .Configure(app => app.UseMvc());

            using (var host = builder.Build())
            {
                host.Start();
                Console.WriteLine($"Style compiler server listens on {url}...");
                WaitForStdInEof();
            }
        }

        static void WaitForStdInEof()
        {
            // based on http://stackoverflow.com/a/13614987
            using (var stdin = Console.OpenStandardInput())
            {
                while (true)
                {
                    if (stdin.ReadByte() < 0)
                    {
                        Console.WriteLine("stdin closed");
                        break;
                    }
                }
            }
        }

        static void CreateThemes(string sourcePath, string version, string outputPath)
        {
            Directory.CreateDirectory(outputPath);

            var lessCache = new CompiledLessCache(sourcePath);
            lessCache.Inflate(PersistentCache.Instance);

            foreach (var distributionName in LessRegistry.CssDistributions.Keys)
            {
                var aggregate = LessAggregation.EnumerateAllItems(sourcePath, distributionName);
                foreach (var item in aggregate)
                {

                    using (var stream = File.Create(Path.Combine(outputPath, item.CssFile.GetFileName())))
                    using (var writer = new StreamWriter(stream))
                    {
                        writer.WriteLine(LicenseHeaderHelper.FormatForCssDistribution(distributionName, version));

                        foreach (var segment in item.Segments)
                        {
                            writer.WriteLine(lessCache.GetCssForSegment(segment.Key));
                        }
                    }
                }
            }

            var iconsSrcFolder = LessRegistry.GetIconsPath(sourcePath);
            var iconsDestFolder = Path.Combine(outputPath, "icons");

            Directory.GetFiles(iconsSrcFolder, "*.*", SearchOption.AllDirectories).ToList()
                .ForEach(fileName =>
                {
                    string relativePath = fileName.Remove(0, iconsSrcFolder.Length);
                    string destFileName = iconsDestFolder + relativePath;
                    if (!Directory.Exists(Path.GetDirectoryName(destFileName)))
                    {
                        Directory.CreateDirectory(Path.GetDirectoryName(destFileName));
                    }

                    File.Copy(fileName, destFileName, true);
                });
        }

        static void EnsureRequiredOptions(params CommandOption[] options)
        {
            if (options.Any(i => !i.HasValue()))
                throw new ArgumentException("Some required options are not specified");
        }

    }

}
