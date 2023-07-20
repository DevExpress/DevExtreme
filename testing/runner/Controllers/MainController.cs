using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Runner.Models;
using Runner.Tools;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using IOFile = System.IO.File;

namespace Runner.Controllers
{
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public class MainController : Controller
    {
        static readonly object IO_SYNC = new object();
        readonly string _completedSuitesFileName;

        UIModelHelper _uiModelHelper;
        IWebHostEnvironment _env;
        RunFlags _runFlags;

        public MainController(IWebHostEnvironment env, RunFlags runFlags)
        {
            ConsoleHelper.Logger.SetWorkingFolder(env.ContentRootPath);
            _env = env;
            _runFlags = runFlags;

            _completedSuitesFileName = Path.Combine(_env.ContentRootPath, "testing/CompletedSuites.txt");
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
            HashSet<string> includeSet = null, excludeSet = null, excludeSuites = null;
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

            if (_runFlags.IsContinuousIntegration) {
                if (IOFile.Exists(_completedSuitesFileName)) {
                    var completedSuites = IOFile.ReadAllLines(_completedSuitesFileName);
                    excludeSuites = new HashSet<string>(completedSuites);
                }
            }

            var model = new RunAllViewModel
            {
                Constellation = constellation ?? "",
                CategoriesList = include,
                Version = JsonConvert.DeserializeObject<IDictionary>(packageJson)["version"].ToString(),
                Suites = UIModelHelper.GetAllSuites(HasDeviceModeFlag(), constellation, includeSet, excludeSet, excludeSuites, partIndex, partCount)
            };

            AssignBaseRunProps(model);

            return View(model);
        }

        [HttpPost]
        public void NotifyTestStarted(string name) {
            lock (IO_SYNC) {
                ConsoleHelper.Logger.WriteLine($"       [ run] {name}");
            }
        }
        [HttpPost]
        public void NotifyTestCompleted(string name, bool passed) {
            lock (IO_SYNC) {
                ConsoleHelper.Logger.WriteLine($"       [{(passed ? "  ok" : "fail")}] {name}");
            }
        }
        [HttpPost]
        public void NotifySuiteFinalized(string name, bool passed, int runtime)
        {
            Response.ContentType = "text/plain";
            lock (IO_SYNC)
            {
                if (passed && _runFlags.IsContinuousIntegration)
                {
                    IOFile.AppendAllLines(_completedSuitesFileName, new[] { name });
                }
                ConsoleHelper.Write("[");
                if (passed)
                    ConsoleHelper.Write(" OK ", ConsoleColor.Green);
                else
                    ConsoleHelper.Write("FAIL", ConsoleColor.Red);

                TimeSpan runSpan = TimeSpan.FromMilliseconds(runtime);
                ConsoleHelper.WriteLine($"] {name} in {Math.Round(runSpan.TotalSeconds, 3)}s");

                NotifyIsAlive();
            }
        }

        static readonly object IOLock = new object();

        [HttpPost]
        public void NotifyIsAlive() {
            if (_runFlags.IsContinuousIntegration)
                lock (IOLock) {
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
                    ConsoleHelper.WriteLine();
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

            m.IsContinuousIntegration = _runFlags.IsContinuousIntegration;
            m.IsIntranet = _runFlags.IsIntranet;
            m.NoGlobals = q.ContainsKey("noglobals");
            m.NoTimers = q.ContainsKey("notimers");
            m.NoTryCatch = q.ContainsKey("notrycatch");
            m.NoJQuery = q.ContainsKey("nojquery");
            m.ShadowDom = q.ContainsKey("shadowDom");
            m.WorkerInWindow = q.ContainsKey("workerinwindow");
            m.NoRenovation = q.ContainsKey("norenovation") || false;
            m.NoCsp = q.ContainsKey("nocsp") || false;
        }

        bool HasDeviceModeFlag()
        {
            return Request.Query.ContainsKey("deviceMode");
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
