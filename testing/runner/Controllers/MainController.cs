using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Runner.Models;
using Runner.Tools;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using IOFile = System.IO.File;

namespace Runner.Controllers
{
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public class MainController : Controller
    {
        static readonly object IO_SYNC = new object();

        UIModelHelper _uiModelHelper;
        IHostingEnvironment _env;
        RunFlags _runFlags;

        public MainController(IHostingEnvironment env, RunFlags runFlags)
        {
            _env = env;
            _runFlags = runFlags;
        }

        protected UIModelHelper UIModelHelper
        {
            get
            {
                if (_uiModelHelper == null)
                    _uiModelHelper = new UIModelHelper(ActionContext, _env);
                return _uiModelHelper;
            }
        }

        [ActionContext]
        public ActionContext ActionContext { get; set; }


        public IActionResult Index()
        {
            return View();
        }

        public object CategoriesJson()
        {
            return UIModelHelper.ReadCategories();
        }

        public object SuitesJson(string id)
        {
            return UIModelHelper.ReadSuites(id);
        }

        public IActionResult RunSuite(string catName, string suiteName, string frame)
        {
            var model = new RunSuiteViewModel
            {
                Title = suiteName,
                ScriptVirtualPath = UIModelHelper.GetSuiteVirtualPath(catName, suiteName),
            };

            AssignBaseRunProps(model);

            return View(model);
        }

        public IActionResult RunAll(string constellation, string include, string exclude)
        {
            HashSet<string> includeSet = null, excludeSet = null;
            int partIndex = 0;
            int partCount = 1;

            if (!String.IsNullOrEmpty(include))
                includeSet = new HashSet<string>(include.Split(','));
            if (!String.IsNullOrEmpty(exclude))
                excludeSet = new HashSet<string>(exclude.Split(','));
            if (!String.IsNullOrEmpty(constellation) && constellation.Contains('(') && constellation.EndsWith(')')) {
                var constellationParts = constellation.TrimEnd(')').Split('(');
                var parts = constellationParts[1].Split('/');

                constellation = constellationParts[0];
                partIndex = Int32.Parse(parts[0]) - 1;
                partCount = Int32.Parse(parts[1]);
            }

            var packageJson = IOFile.ReadAllText(Path.Combine(_env.ContentRootPath, "package.json"));

            var model = new RunAllViewModel
            {
                Constellation = constellation ?? "",
                CategoriesList = include,
                Version = JsonConvert.DeserializeObject<IDictionary>(packageJson)["version"].ToString(),
                Suites = UIModelHelper.GetAllSuites(HasDeviceModeFlag(), constellation, includeSet, excludeSet, partIndex, partCount)
            };

            AssignBaseRunProps(model);

            return View(model);
        }

        [HttpPost]
        public void NotifySuiteFinalized(string name, bool passed, int runtime)
        {
            Response.ContentType = "text/plain";
            lock (IO_SYNC)
            {
                Console.Write("[");
                if (passed)
                {
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.Write(" OK ");
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.Write("FAIL");
                }
                Console.ResetColor();
                TimeSpan runSpan = TimeSpan.FromMilliseconds(runtime);
                Console.WriteLine($"] {name} in {Math.Round(runSpan.TotalSeconds, 3)}s");

                if (_runFlags.IsContinuousIntegration)
                    IOFile.WriteAllText(Path.Combine(_env.ContentRootPath, "testing/LastSuiteTime.txt"), DateTime.Now.ToString("s"));
            }
        }

        [HttpPost]
        public void SaveResults()
        {
            var singleRun = _runFlags.SingleRun;
            var hasFailure = false;
            var xml = "";

            Response.ContentType = "text/plain";
            try
            {
                var json = new StreamReader(Request.Body).ReadToEnd();
                ValidateResultsJson(json);

                var results = Runner.Models.Results.TestResults.LoadFromJson(json);
                hasFailure = results.failures > 0;
                xml = results.ToXmlText();

                if (singleRun)
                {
                    Console.WriteLine();
                    results.PrintTextReport();
                }
            }
            catch (Exception x)
            {
                LogMiscErrorCore("Failed to save results. " + x);
                hasFailure = true;
            }

            IOFile.WriteAllText(ResultXmlPath(), xml);

            if (singleRun)
            {
                Environment.Exit(hasFailure ? 1 : 0);
            }
        }

        public ContentResult DisplayResults()
        {
            var xslUrl = Url.Content("~/testing/content/unittests.xsl");
            var xml = new StringBuilder();
            xml.AppendLine("<?xml version=\"1.0\"?>");
            xml.AppendLine("<?xml-stylesheet type=\"text/xsl\" href=\"" + xslUrl + "\"?>");
            xml.AppendLine("<cruisecontrol>");
            xml.Append(IOFile.ReadAllText(ResultXmlPath()));
            xml.AppendLine("</cruisecontrol>");

            return Content(xml.ToString(), "text/xml");
        }

        [HttpPost]
        public void LogMiscError()
        {
            Response.ContentType = "text/plain";
            LogMiscErrorCore(Request.Form["msg"]);
        }

        void LogMiscErrorCore(string data)
        {
            if (_runFlags.IsContinuousIntegration)
            {
                lock (IO_SYNC)
                {
                    IOFile.AppendAllText(Path.Combine(_env.ContentRootPath, "testing/MiscErrors.log"), data + Environment.NewLine);
                }
            }
        }

        void AssignBaseRunProps(BaseRunViewModel m)
        {
            var q = Request.Query;

            m.IEMode = IEMode();
            m.IsContinuousIntegration = _runFlags.IsContinuousIntegration;
            m.IsIntranet = _runFlags.IsIntranet;
            m.JQueryVersion = JQueryVersion();
            m.NoGlobals = q.ContainsKey("noglobals");
            m.NoTimers = q.ContainsKey("notimers");
            m.NoTryCatch = q.ContainsKey("notrycatch");
            m.NoJQuery = q.ContainsKey("nojquery");
            m.WorkerInWindow = q.ContainsKey("workerinwindow");
            m.NoRenovation = q.ContainsKey("norenovation") || false;
        }

        string JQueryVersion()
        {
            var requestValue = Request.Query["jquery"];
            if (!String.IsNullOrEmpty(requestValue))
                return requestValue;
            return null;
        }

        bool HasDeviceModeFlag()
        {
            return Request.Query.ContainsKey("deviceMode");
        }

        string IEMode()
        {
            var requestValue = Request.Query["ieMode"];
            if (!String.IsNullOrEmpty(requestValue))
                return requestValue;
            return "edge";
        }

        string ResultXmlPath()
        {
            return Path.Combine(_env.ContentRootPath, "testing/Results.xml");
        }

        static void ValidateResultsJson(string json)
        {
            var zeroIndex = json.IndexOf("\\u0000");
            if (zeroIndex > -1)
                throw new Exception("Result JSON has bad content: " + json.Substring(zeroIndex - 200, 400));
        }
    }
}
