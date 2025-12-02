export default `<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <DiscoverResponse xmlns="urn:schemas-microsoft-com:xml-analysis" xmlns:ddl2="http://schemas.microsoft.com/analysisservices/2003/engine/2" xmlns:ddl2_2="http://schemas.microsoft.com/analysisservices/2003/engine/2/2" xmlns:ddl100="http://schemas.microsoft.com/analysisservices/2008/engine/100" xmlns:ddl100_100="http://schemas.microsoft.com/analysisservices/2008/engine/100/100" xmlns:ddl200="http://schemas.microsoft.com/analysisservices/2010/engine/200" xmlns:ddl200_200="http://schemas.microsoft.com/analysisservices/2010/engine/200/200" xmlns:ddl300="http://schemas.microsoft.com/analysisservices/2011/engine/300" xmlns:ddl300_300="http://schemas.microsoft.com/analysisservices/2011/engine/300/300" xmlns:ddl400="http://schemas.microsoft.com/analysisservices/2012/engine/400" xmlns:ddl400_400="http://schemas.microsoft.com/analysisservices/2012/engine/400/400" xmlns:ddl410="http://schemas.microsoft.com/analysisservices/2012/engine/410" xmlns:ddl410_410="http://schemas.microsoft.com/analysisservices/2012/engine/410/410" xmlns:ddl500="http://schemas.microsoft.com/analysisservices/2013/engine/500" xmlns:ddl500_500="http://schemas.microsoft.com/analysisservices/2013/engine/500/500" xmlns:ddl600="http://schemas.microsoft.com/analysisservices/2013/engine/600" xmlns:ddl600_600="http://schemas.microsoft.com/analysisservices/2013/engine/600/600">
      <return>
        <root xmlns="urn:schemas-microsoft-com:xml-analysis:rowset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxmla="http://schemas.microsoft.com/analysisservices/2003/xmla">
          <xsd:schema xmlns:sql="urn:schemas-microsoft-com:xml-sql" targetNamespace="urn:schemas-microsoft-com:xml-analysis:rowset" elementFormDefault="qualified">
            <xsd:element name="root">
              <xsd:complexType>
                <xsd:sequence minOccurs="0" maxOccurs="unbounded">
                  <xsd:element name="row" type="row"/>
                </xsd:sequence>
              </xsd:complexType>
            </xsd:element>
            <xsd:simpleType name="uuid">
              <xsd:restriction base="xsd:string">
                <xsd:pattern value="[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}"/>
              </xsd:restriction>
            </xsd:simpleType>
            <xsd:complexType name="xmlDocument">
              <xsd:sequence>
                <xsd:any/>
              </xsd:sequence>
            </xsd:complexType>
            <xsd:complexType name="row">
              <xsd:sequence>
                <xsd:element sql:field="CATALOG_NAME" name="CATALOG_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="SCHEMA_NAME" name="SCHEMA_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="CUBE_NAME" name="CUBE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="MEASUREGROUP_NAME" name="MEASUREGROUP_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DESCRIPTION" name="DESCRIPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="IS_WRITE_ENABLED" name="IS_WRITE_ENABLED" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="MEASUREGROUP_CAPTION" name="MEASUREGROUP_CAPTION" type="xsd:string" minOccurs="0"/>
              </xsd:sequence>
            </xsd:complexType>
          </xsd:schema>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASUREGROUP_NAME>Internet Customers</MEASUREGROUP_NAME>
            <DESCRIPTION/>
            <IS_WRITE_ENABLED>false</IS_WRITE_ENABLED>
            <MEASUREGROUP_CAPTION>Internet Customers</MEASUREGROUP_CAPTION>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASUREGROUP_NAME>Internet Orders</MEASUREGROUP_NAME>
            <DESCRIPTION/>
            <IS_WRITE_ENABLED>false</IS_WRITE_ENABLED>
            <MEASUREGROUP_CAPTION>Internet Orders</MEASUREGROUP_CAPTION>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <DESCRIPTION/>
            <IS_WRITE_ENABLED>false</IS_WRITE_ENABLED>
            <MEASUREGROUP_CAPTION>Internet Sales</MEASUREGROUP_CAPTION>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASUREGROUP_NAME>Reseller Orders</MEASUREGROUP_NAME>
            <DESCRIPTION/>
            <IS_WRITE_ENABLED>false</IS_WRITE_ENABLED>
            <MEASUREGROUP_CAPTION>Reseller Orders</MEASUREGROUP_CAPTION>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <DESCRIPTION/>
            <IS_WRITE_ENABLED>false</IS_WRITE_ENABLED>
            <MEASUREGROUP_CAPTION>Reseller Sales</MEASUREGROUP_CAPTION>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASUREGROUP_NAME>Sales Orders</MEASUREGROUP_NAME>
            <DESCRIPTION/>
            <IS_WRITE_ENABLED>false</IS_WRITE_ENABLED>
            <MEASUREGROUP_CAPTION>Sales Orders</MEASUREGROUP_CAPTION>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASUREGROUP_NAME>Sales Reasons</MEASUREGROUP_NAME>
            <DESCRIPTION/>
            <IS_WRITE_ENABLED>false</IS_WRITE_ENABLED>
            <MEASUREGROUP_CAPTION>Sales Reasons</MEASUREGROUP_CAPTION>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <DESCRIPTION/>
            <IS_WRITE_ENABLED>false</IS_WRITE_ENABLED>
            <MEASUREGROUP_CAPTION>Sales Summary</MEASUREGROUP_CAPTION>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASUREGROUP_NAME>Sales Targets</MEASUREGROUP_NAME>
            <DESCRIPTION/>
            <IS_WRITE_ENABLED>false</IS_WRITE_ENABLED>
            <MEASUREGROUP_CAPTION>Sales Targets</MEASUREGROUP_CAPTION>
          </row>
        </root>
      </return>
    </DiscoverResponse>
  </soap:Body>
</soap:Envelope>`;
