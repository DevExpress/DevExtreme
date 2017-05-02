using System;
using System.Collections.Generic;
using System.IO;
using System.Xml.Serialization;
using Microsoft.AspNetCore.Hosting;

namespace Runner.Tools
{
    public static class WorkerFrameStateHelper
    {
        static readonly object _sync = new object();
        static IDictionary<string, Entry> _state = new Dictionary<string, Entry>();
        static XmlSerializer _serializer = new XmlSerializer(typeof(List<Entry>));

        public static void NotifySuiteStarted(IHostingEnvironment env, string frameSpec, string suiteSpec)
        {
            lock (_sync)
            {
                _state[frameSpec] = new Entry
                {
                    Suite = suiteSpec,
                    StartedAt = DateTime.Now
                };
                var xmlPath = Path.Combine(env.ContentRootPath, "testing/WorkerFrameState.xml");
                using (var stream = File.Open(xmlPath, FileMode.Create, FileAccess.Write, FileShare.Read))
                {
                    _serializer.Serialize(stream, new List<Entry>(_state.Values));
                }
            }
        }

        [XmlType("Entry")]
        public class Entry
        {
            public string Suite;
            public DateTime StartedAt;
        }
    }
}
