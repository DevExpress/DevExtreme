namespace Runner.Models
{
    public abstract class BaseRunViewModel
    {
        public string IEMode { get; set; }
        public bool NoTryCatch { get; set; }
        public bool NoGlobals { get; set; }
        public bool NoTimers { get; set; }
        public bool NoJQuery { get; set; }
        public string JQueryVersion { get; set; }
        public bool NoRenovation { get; set; }
        public bool WorkerInWindow { get; set; }
        public bool IsContinuousIntegration { get; set; }
        public bool IsIntranet { get; set; }
    }
}
