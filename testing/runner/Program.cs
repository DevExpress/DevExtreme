using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json.Serialization;
using Runner.Tools;

namespace Runner
{
    public class Program
    {
        public static int Main(string[] argv)
        {
            try
            {
                var rootPath = Path.Combine(AppContext.BaseDirectory, "../../..");
                Ports.Load(Path.Combine(rootPath, "ports.json"));

                var url = "http://0.0.0.0:" + Ports.Get("qunit");

                var builder = new WebHostBuilder()
                    .UseUrls(url)
                    .UseKestrel()
                    .UseContentRoot(rootPath)
                    .ConfigureServices(services =>
                    {
                        services
                            .AddMvc()
                            .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

                        services.AddWebEncoders();

                        services.Configure<RazorViewEngineOptions>(options => options.ViewLocationExpanders.Add(new ViewLocationExpander()));

                        services.AddSingleton(new RunFlags
                        {
                            SingleRun = argv.Contains("--single-run"),
                            IsContinuousIntegration = IsContinuousIntegration(),
                            IsIntranet = IsIntranet()
                        });
                    })
                    .Configure(app => app
                        .UseStatusCodePages()
                        .UseDeveloperExceptionPage()
                        .UseMvc(routes => routes
                            .MapRoute("RunSuite", "run/{catName}/{suiteName}", new { controller = "Main", action = "RunSuite" }, new { suiteName = @".*\.js" })
                            .MapRoute("RunAll", "run", new { controller = "Main", action = "RunAll" })
                            .MapRoute("default", "{controller=Main}/{action=Index}/{id?}")
                        )
                        .UseFileServer(new FileServerOptions
                        {
                            EnableDirectoryBrowsing = true,
                            EnableDefaultFiles = false,
                            StaticFileOptions = {
                                FileProvider = new PhysicalFileProvider(rootPath),
                                ServeUnknownFileTypes = true,
                                OnPrepareResponse = OnPrepareStaticFileResponse
                            }
                        })
                    );

                using (var host = builder.Build())
                {
                    host.Start();
                    StyleCompilerProcessManager.Start(rootPath);
                    Console.WriteLine($"QUnit runner server listens on {url}...");
                    Thread.Sleep(Timeout.Infinite);
                }

                return 0;
            }
            catch (Exception x)
            {
                Console.Error.WriteLine(x.Message);
                return 1;
            }
        }

        static void OnPrepareStaticFileResponse(StaticFileResponseContext staticFileContext)
        {
            var context = staticFileContext.Context;
            var req = context.Request;
            var res = context.Response;
            var headers = res.Headers;

            if (req.Query.ContainsKey("DX_HTTP_CACHE"))
            {
                headers["Cache-Control"] = "public, max-age=31536000";
            }
            else
            {
                headers["Cache-Control"] = "private, must-revalidate, max-age=0";
            }

            headers.Remove("ETag");
        }

        static bool IsContinuousIntegration()
        {
            return !String.IsNullOrEmpty(Environment.GetEnvironmentVariable("CCNetWorkingDirectory"))
                || !String.IsNullOrEmpty(Environment.GetEnvironmentVariable("DEVEXTREME_DOCKER_CI"));
        }

        static bool IsIntranet()
        {
            try
            {
                var task = Dns.GetHostAddressesAsync("corp.devexpress.com");
                task.Wait();
                return task.Result.Length > 0;
            }
            catch
            {
                return false;
            }
        }
    }
}
