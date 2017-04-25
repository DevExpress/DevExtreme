using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace Runner.Tools
{
    static class StyleCompilerProcessManager
    {
        static string _rootPath;

        public static void Start(string rootPath)
        {
            _rootPath = rootPath;
            new Thread(ThreadFunc).Start();
        }

        static void ThreadFunc()
        {
            while (true)
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = "dotnet",
                    Arguments = "style-compiler.dll test-server",
                    WorkingDirectory = Path.Combine(_rootPath, "build/style-compiler/bin/Debug/dist"),
                    UseShellExecute = false,
                    RedirectStandardInput = true,
                };

                using (var proc = Process.Start(startInfo))
                {
                    proc.WaitForExit();
                }

                Console.WriteLine("Style compiler server exited, restarting...");
                Thread.Sleep(1000);
            }
        }
    }

}
