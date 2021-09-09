using System;
using System.IO;

namespace Runner.Tools {
    public class ConsoleWriter {
        readonly TextWriter target;
        readonly string header;

        internal ConsoleWriter(TextWriter target, string header = "") {
            this.target = target;
            this.header = header;
        }
        public void Write(string message, ConsoleColor? foreground = null) {
            if (foreground.HasValue) {
                Console.ForegroundColor = foreground.Value;
            }

            var msg = $"{this.header}{message}";
            ConsoleHelper.Logger.Write(msg);
            target.Write(msg);
            Console.ResetColor();
        }

        public void WriteLine() {
            ConsoleHelper.Logger.WriteLine();
            target.WriteLine();
        }

        public void WriteLine(string message, ConsoleColor? foreground = null) {
            Write(message, foreground);
            WriteLine();
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
            lock (olock) {
                File.AppendAllText(this.path, text);
            }
        }

        public void Write(string text = "") {
            if (this.time) {
                LogCore($"{DateTime.Now:hh:mm:ss}     ");
                this.time = false;
            }
            LogCore(text);
        }
        public void WriteLine() {
            Write($"\r\n");
            this.time = true;
        }
        public void WriteLine(string text) {
            Write(text);
            WriteLine();
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
