using System.Xml.Serialization;

namespace Runner.Models.Results
{
    public abstract class ResultItem
    {
        [XmlAttribute]
        public string name;
    }
}
