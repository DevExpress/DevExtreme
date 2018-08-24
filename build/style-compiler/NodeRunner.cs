using System;
using System.Diagnostics;
using System.IO;
using Newtonsoft.Json;

namespace StyleCompiler
{

    static class NodeRunner
    {
        static readonly object PROCESS_START_LOCK = new object();

        public static string CompileLess(string less)
        {
            return RunExternalApp(ResolveNodeToolPath("node"), $"node_modules/less/bin/lessc --autoprefix=\"{ReadBrowsersList()}\" -", Utils.GetRepoRootPath(), less);
        }

        static string ReadBrowsersList()
        {
            dynamic manifest = JsonConvert.DeserializeObject(File.ReadAllText(Path.Combine(Utils.GetRepoRootPath(), "package.json")));
            return string.Join(",", manifest["browserslist"]);
        }

        static string RunExternalApp(string path, string arguments, string workingDirectory, string stdIn)
        {
            var processStartInfo = new ProcessStartInfo
            {
                FileName = path,
                Arguments = arguments,
                RedirectStandardOutput = true,
                RedirectStandardInput = true,
                RedirectStandardError = true,
                UseShellExecute = false
            };

            if (workingDirectory != null)
                processStartInfo.WorkingDirectory = workingDirectory;

            using (var process = new Process())
            {
                process.StartInfo = processStartInfo;

                lock (PROCESS_START_LOCK)
                {
                    // lock is used to prevent hanging on Mac
                    process.Start();
                }

                if (stdIn != null)
                {
                    process.StandardInput.Write(stdIn);
                    process.StandardInput.Dispose();
                }

                var stdOut = process.StandardOutput.ReadToEnd();
                var stdErr = process.StandardError.ReadToEnd();

                process.WaitForExit();

                if (process.ExitCode != 0)
                    throw new Exception(stdErr);

                return stdOut;
            }
        }

        static string ResolveNodeToolPath(string name)
        {
            var ccnetDir = Environment.GetEnvironmentVariable("CCNetWorkingDirectory");

            if (ccnetDir != null)
            {
                var customPath = Path.Combine(ccnetDir, "node", name);
                var candidates = new[] { customPath, customPath + ".exe", customPath + ".cmd" };

                foreach (var i in candidates)
                {
                    if (File.Exists(i))
                        return i;
                }
            }

            return name;
        }

    }
}
