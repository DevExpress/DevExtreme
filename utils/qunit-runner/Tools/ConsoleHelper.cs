using System;
using System.IO;

namespace Runner.Tools
{
    public class ConsoleWriter {
        readonly TextWriter target;
        readonly string header;

        internal ConsoleWriter(TextWriter target, string header = "") {
            this.target = target;
            this.header = header;
        }

        void WriteCore(string message, ConsoleColor? foreground, bool line) {
            if (foreground.HasValue) {
                Console.ForegroundColor = foreground.Value;
            }

            if (!String.IsNullOrEmpty(message) || line) {
                var msg = $"{this.header}{message}";
                if (line) {
                    ConsoleHelper.Logger.WriteLine(msg);
                    target.WriteLine(msg);
                } else {
                    ConsoleHelper.Logger.Write(msg);
                    target.Write(msg);
                }
            }

            if (foreground.HasValue) {
                Console.ResetColor();
            }
        }
        public void Write(string message, ConsoleColor? foreground = null) {
            WriteCore(message, foreground, false);
        }

        public void WriteLine() {
            WriteCore(null, null, true);
        }

        public void WriteLine(string message, ConsoleColor? foreground = null) {
            WriteCore(message, foreground, true);
        }
    }

    public class Logger {
        readonly string fileName;
        bool time = true;
        public static readonly object olock = new object();
        string path;

        public Logger(string fileName) { this.fileName = fileName; }

        public void SetWorkingFolder(string path) {
            lock (olock) {
                this.path = Path.Combine(path, this.fileName);
            }
        }

        void LogCore(string text) {
            File.AppendAllText(this.path, text);
        }

        public void Write(string text = "") {
            lock (olock) {
                if (String.IsNullOrEmpty(text))
                    return;
                if (this.time) {
                    LogCore($"{DateTime.Now:hh:mm:ss}     ");
                    this.time = false;
                }

                LogCore(text);
            }
        }

        public void WriteLine(string text = "") {
            Write($"{text ?? ""}\r\n");
            this.time = true;
        }
    }
    public static class ConsoleHelper {
        public static readonly Logger Logger = new Logger("testing/RawLog.txt");
        public static readonly ConsoleWriter Out = new ConsoleWriter(Console.Out);
        public static readonly ConsoleWriter Error = new ConsoleWriter(Console.Error, "ERROR: ");

        public static void Write(string message, ConsoleColor? foreground = null) { Out.Write(message, foreground);}
        public static void WriteLine() { Out.WriteLine(); }
        public static void WriteLine(string message, ConsoleColor? foreground = null) {
            Out.WriteLine(message, foreground);
        }
    }
}
