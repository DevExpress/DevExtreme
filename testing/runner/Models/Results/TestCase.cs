using System.Xml.Serialization;

namespace Runner.Models.Results
{
    public class TestCase : ResultItem
    {
        public class MessageContainer
        {
            public string message;
        }

        [XmlAttribute]
        public string url;

        [XmlAttribute]
        public bool executed = true;

        [XmlAttribute]
        public string time;

        [XmlIgnore]
        public bool executedSpecified { get { return !executed; } }

        public MessageContainer failure;

        public MessageContainer reason;
    }

}
