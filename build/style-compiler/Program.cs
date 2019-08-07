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

                return cli.Execute(argv);
            }
            catch (Exception error)
            {
                Console.Error.WriteLine(error.Message);
                return 1;
            }
        }

        static void EnsureRequiredOptions(params CommandOption[] options)
        {
            if (options.Any(i => !i.HasValue()))
                throw new ArgumentException("Some required options are not specified");
        }

    }

}
