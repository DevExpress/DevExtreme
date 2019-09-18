using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading;
using System.Net.Http;
using Directory = System.IO.Directory;
using Path = System.IO.Path;
using IOFile = System.IO.File;

namespace Runner.Controllers
{
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public class TestVectorMapDataController : Controller
    {
        private static readonly System.Text.Encoding Encoding = System.Text.Encoding.UTF8;

        private const int NodeServerCheckTimeout = 100;
        private const int NodeServerKillTimeout = 200;
        private const int NodeScriptTimeout = 15000;
        private const int DirectoryKillTimeout = 5000;

        private const string PathToDataDirectory = "testing/content/VectorMapData/";

        private static readonly string PathToNode;

        static readonly object SYNC = new object();
        static NodeServerContext NodeServerContextInstance;

        static TestVectorMapDataController()
        {
            PathToNode = "node";

            var ccnetDir = Environment.GetEnvironmentVariable("CCNetWorkingDirectory");
            if (ccnetDir != null)
            {
                var customPath = Path.Combine(ccnetDir, "node/node.exe");
                if (IOFile.Exists(customPath))
                    PathToNode = customPath;
            }
        }

        IHostingEnvironment _env;

        public TestVectorMapDataController(IHostingEnvironment env)
        {
            _env = env;
        }

        private string ReadTextFile(string path)
        {
            return System.IO.File.ReadAllText(path, Encoding);
        }

        public object GetTestData()
        {
            var items = Directory.GetFiles(Path.Combine(_env.ContentRootPath, PathToDataDirectory), "*.txt").Select(name =>
             {
                 return new
                 {
                     name = Path.GetFileNameWithoutExtension(name),
                     expected = ReadTextFile(name)
                 };
             });
            return items;
        }

        public IActionResult ParseBuffer(string id)
        {
            return RedirectRequestToNodeServer("parse-buffer", id);
        }

        public IActionResult ReadAndParse(string id)
        {
            return RedirectRequestToNodeServer("read-and-parse", id);
        }

        private sealed class NodeServerContext
        {
            internal readonly string pathToNode;
            internal readonly AutoResetEvent waitHandle = new AutoResetEvent(false);
            internal readonly string arguments;
            internal int counter = 0;
            internal DateTime timeout;

            internal NodeServerContext(string pathToNode, string arguments)
            {
                this.pathToNode = pathToNode;
                this.arguments = arguments;
            }
        }

        private void StartNodeServer()
        {
            lock (SYNC)
            {
                if (NodeServerContextInstance == null)
                {
                    var args = new[] {
                        Path.Combine(_env.ContentRootPath, "testing/helpers/vectormaputils-tester.js"),
                        Path.Combine(_env.ContentRootPath, PathToDataDirectory)
                    };

                    NodeServerContextInstance = new NodeServerContext(PathToNode, String.Join(" ", args.Select(QuoteArg)));
                    ThreadPool.QueueUserWorkItem(NodeServerThreadFunc);
                    NodeServerContextInstance.waitHandle.WaitOne();
                }
                ++NodeServerContextInstance.counter;
            }
        }

        static string QuoteArg(string arg)
        {
            return '"' + arg + '"';
        }

        private void StopNodeServer()
        {
            lock (SYNC)
            {
                --NodeServerContextInstance.counter;
                NodeServerContextInstance.timeout = DateTime.Now.AddMilliseconds(NodeServerKillTimeout);
            }
        }

        private static System.Diagnostics.Process StartProcess(string pathToNode, string arguments)
        {
            return System.Diagnostics.Process.Start(pathToNode, arguments);
        }

        private static void NodeServerThreadFunc(object state)
        {
            using (var process = StartProcess(NodeServerContextInstance.pathToNode, NodeServerContextInstance.arguments))
            {
                NodeServerContextInstance.waitHandle.Set();
                while (true)
                {
                    Thread.Sleep(NodeServerCheckTimeout);
                    lock (SYNC)
                    {
                        if (NodeServerContextInstance.counter == 0 && DateTime.Now > NodeServerContextInstance.timeout)
                        {
                            NodeServerContextInstance = null;
                            process.Kill();
                            return;
                        }
                    }
                }
            }
        }

        private IActionResult RedirectRequestToNodeServer(string action, string arg)
        {
            StartNodeServer();
            try
            {
                using (var client = new HttpClient())
                {
                    var startedAt = DateTime.Now;
                    while (true)
                    {
                        try
                        {
                            using (var message = client.GetAsync(string.Format("http://127.0.0.1:{0}/{1}/{2}", Ports.Get("vectormap-utils-tester"), action, arg)).Result)
                            {
                                var data = message.Content.ReadAsStringAsync().Result;
                                return Content(data, "application/json");
                            }
                        }
                        catch (Exception)
                        {
                            if (DateTime.Now - startedAt > TimeSpan.FromSeconds(5))
                                throw;
                        }
                    }
                }

                // request.Method = "GET";
                // request.ContentLength = 0;
                // request.ContentType = "text/html";
            }
            finally
            {
                StopNodeServer();
            }
        }

        public ActionResult ExecuteConsoleApp(string arg)
        {
            var inputDirectory = Path.Combine(_env.ContentRootPath, PathToDataDirectory);
            var outputDirectory = Path.Combine(inputDirectory, "__Output");
            var arguments = Path.GetFullPath(Path.Combine(_env.ContentRootPath, "artifacts/js/vectormap-utils/dx.vectormaputils.node.js")) + " " + inputDirectory;
            if (Request.Query.ContainsKey("file"))
            {
                arguments += Request.Query["file"];
            }
            arguments += " --quiet --output " + outputDirectory +
                " --settings " + Path.Combine(inputDirectory, "_settings.js") +
                " --process-file-content " + Path.Combine(inputDirectory, "_processFileContent.js");
            var isJson = Request.Query.ContainsKey("json");
            if (isJson)
            {
                arguments += " --json";
            }
            try
            {
                Directory.CreateDirectory(outputDirectory);
                using (var process = StartProcess(PathToNode, arguments))
                {
                    if (!process.WaitForExit(NodeScriptTimeout))
                    {
                        process.Kill();
                    }
                }
                var result = Directory.GetFiles(outputDirectory, isJson ? "*.json" : "*.js").Select(file =>
                {
                    var text = ReadTextFile(file);
                    var variable = (string)null;
                    if (!isJson)
                    {
                        var k = text.IndexOf("=");
                        if (k > 0)
                        {
                            variable = text.Substring(0, k).Trim();
                            text = text.Substring(k + 1, text.Length - k - 2).Trim();
                        }
                    }
                    return new
                    {
                        file = Path.GetFileNameWithoutExtension(file) + Path.GetExtension(file),
                        variable = variable,
                        content = JsonConvert.DeserializeObject(text)
                    };
                }).ToArray();
                return Content(JsonConvert.SerializeObject(result), "application/json");
            }
            finally
            {
                Directory.Delete(outputDirectory, true);
            }
        }

    }
}
