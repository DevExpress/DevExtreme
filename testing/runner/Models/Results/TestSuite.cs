using System.Collections.Generic;
using System.Xml.Serialization;

namespace Runner.Models.Results
{
    public class TestSuite : ResultItem
    {
        [XmlAttribute]
        public double time;

        [XmlAttribute("pure-time")]
        public double pureTime;

        [XmlArray("results")]
        [XmlArrayItem("test-case", typeof(TestCase))]
        [XmlArrayItem("test-suite", typeof(TestSuite))]
        public List<ResultItem> results = new List<ResultItem>();
    }

}
