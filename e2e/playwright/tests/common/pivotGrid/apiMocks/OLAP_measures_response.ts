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
                <xsd:element sql:field="MEASURE_NAME" name="MEASURE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="MEASURE_UNIQUE_NAME" name="MEASURE_UNIQUE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="MEASURE_CAPTION" name="MEASURE_CAPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="MEASURE_GUID" name="MEASURE_GUID" type="uuid" minOccurs="0"/>
                <xsd:element sql:field="MEASURE_AGGREGATOR" name="MEASURE_AGGREGATOR" type="xsd:int" minOccurs="0"/>
                <xsd:element sql:field="DATA_TYPE" name="DATA_TYPE" type="xsd:unsignedShort" minOccurs="0"/>
                <xsd:element sql:field="NUMERIC_PRECISION" name="NUMERIC_PRECISION" type="xsd:unsignedShort" minOccurs="0"/>
                <xsd:element sql:field="NUMERIC_SCALE" name="NUMERIC_SCALE" type="xsd:short" minOccurs="0"/>
                <xsd:element sql:field="MEASURE_UNITS" name="MEASURE_UNITS" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DESCRIPTION" name="DESCRIPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="EXPRESSION" name="EXPRESSION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="MEASURE_IS_VISIBLE" name="MEASURE_IS_VISIBLE" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="LEVELS_LIST" name="LEVELS_LIST" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="MEASURE_NAME_SQL_COLUMN_NAME" name="MEASURE_NAME_SQL_COLUMN_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="MEASURE_UNQUALIFIED_CAPTION" name="MEASURE_UNQUALIFIED_CAPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="MEASUREGROUP_NAME" name="MEASUREGROUP_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="MEASURE_DISPLAY_FOLDER" name="MEASURE_DISPLAY_FOLDER" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DEFAULT_FORMAT_STRING" name="DEFAULT_FORMAT_STRING" type="xsd:string" minOccurs="0"/>
              </xsd:sequence>
            </xsd:complexType>
          </xsd:schema>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Sales Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Sales Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Sales Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Sales Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Sales Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>$#,##0.00;($#,##0.00)</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Order Quantity</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Order Quantity]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Order Quantity</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>3</DATA_TYPE>
            <NUMERIC_PRECISION>10</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Order Quantity</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Order Quantity</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>#,#</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Extended Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Extended Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Extended Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Extended Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Extended Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Tax Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Tax Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Tax Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Tax Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Tax Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Freight Cost</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Freight Cost]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Freight Cost</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Freight Cost</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Freight Cost</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Total Product Cost</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Total Product Cost]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Total Product Cost</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Total Product Cost</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Total Product Cost</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Standard Product Cost</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Standard Product Cost]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Standard Product Cost</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Standard Product Cost</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Standard Product Cost</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Order Count</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Order Count]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Order Count</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>8</MEASURE_AGGREGATOR>
            <DATA_TYPE>3</DATA_TYPE>
            <NUMERIC_PRECISION>10</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Order Count</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Order Count</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Orders</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>#,#</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Customer Count</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Customer Count]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Customer Count</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>8</MEASURE_AGGREGATOR>
            <DATA_TYPE>3</DATA_TYPE>
            <NUMERIC_PRECISION>10</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Customer Count</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Customer Count</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Customers</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>#,#</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Sales Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Sales Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Sales Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Sales Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Sales Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Order Quantity</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Order Quantity]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Order Quantity</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>3</DATA_TYPE>
            <NUMERIC_PRECISION>10</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Order Quantity</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Order Quantity</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>#,#</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Extended Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Extended Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Extended Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Extended Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Extended Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Tax Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Tax Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Tax Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Tax Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Tax Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Freight Cost</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Freight Cost]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Freight Cost</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Freight Cost</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Freight Cost</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Discount Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Discount Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Discount Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>5</DATA_TYPE>
            <NUMERIC_PRECISION>16</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Discount Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Discount Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Total Product Cost</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Total Product Cost]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Total Product Cost</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Total Product Cost</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Total Product Cost</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Standard Product Cost</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Standard Product Cost]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Standard Product Cost</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Standard Product Cost</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Standard Product Cost</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Order Count</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Order Count]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Order Count</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>8</MEASURE_AGGREGATOR>
            <DATA_TYPE>3</DATA_TYPE>
            <NUMERIC_PRECISION>10</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Order Count</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Order Count</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Orders</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>#,#</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Order Quantity</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Order Quantity]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Order Quantity</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>3</DATA_TYPE>
            <NUMERIC_PRECISION>10</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Order Quantity</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Order Quantity</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>#,#</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Extended Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Extended Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Extended Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>5</DATA_TYPE>
            <NUMERIC_PRECISION>16</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Extended Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Extended Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Standard Product Cost</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Standard Product Cost]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Standard Product Cost</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>5</DATA_TYPE>
            <NUMERIC_PRECISION>16</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Standard Product Cost</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Standard Product Cost</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Total Product Cost</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Total Product Cost]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Total Product Cost</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>5</DATA_TYPE>
            <NUMERIC_PRECISION>16</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Total Product Cost</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Total Product Cost</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Sales Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Sales Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Sales Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>5</DATA_TYPE>
            <NUMERIC_PRECISION>16</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Sales Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Sales Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Tax Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Tax Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Tax Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>5</DATA_TYPE>
            <NUMERIC_PRECISION>16</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Tax Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Tax Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Freight Cost</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Freight Cost]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Freight Cost</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>5</DATA_TYPE>
            <NUMERIC_PRECISION>16</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Freight Cost</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Freight Cost</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Order Count</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Order Count]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Order Count</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>8</MEASURE_AGGREGATOR>
            <DATA_TYPE>3</DATA_TYPE>
            <NUMERIC_PRECISION>10</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Order Count</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Order Count</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Orders</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>#,#</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Sales Amount Quota</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Sales Amount Quota]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Sales Amount Quota</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>1</MEASURE_AGGREGATOR>
            <DATA_TYPE>6</DATA_TYPE>
            <NUMERIC_PRECISION>19</NUMERIC_PRECISION>
            <NUMERIC_SCALE>4</NUMERIC_SCALE>
            <DESCRIPTION/>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Sales Amount Quota</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Sales Amount Quota</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Targets</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Gross Profit</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Gross Profit]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Gross Profit</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Internet Sales Amount] 
    - 
    [Measures].[Internet Total Product Cost]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Gross Profit</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Gross Profit</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Gross Profit Margin</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Gross Profit Margin]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Gross Profit Margin</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>( 
      [Measures].[Internet Sales Amount] 
      - 
      [Measures].[Internet Total Product Cost] 
    ) 
    /
    [Measures].[Internet Sales Amount]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Gross Profit Margin</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Gross Profit Margin</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Average Unit Price</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Average Unit Price]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Average Unit Price</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Internet Unit Price] 
    /
    [Measures].[Internet Transaction Count]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Average Unit Price</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Average Unit Price</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Average Sales Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Average Sales Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Average Sales Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Internet Sales Amount] 
    /
    [Measures].[Internet Order Count]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Average Sales Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Average Sales Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Ratio to All Products</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Ratio to All Products]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Ratio to All Products</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Internet Sales Amount]
    /
    ( 
      Root( [Product] ),
      [Measures].[Internet Sales Amount] 
    )</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Ratio to All Products</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Ratio to All Products</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Internet Ratio to Parent Product</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Internet Ratio to Parent Product]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Internet Ratio to Parent Product</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>Case

        When [Product].[Product Model Categories].CurrentMember.Level.Ordinal 
             = 0
        Then 1

        Else [Measures].[Internet Sales Amount]
             /
             ( [Product].[Product Model Categories].CurrentMember.Parent,
               [Measures].[Internet Sales Amount] )

    End</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Internet Ratio to Parent Product</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Internet Ratio to Parent Product</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Growth in Customer Base</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Growth in Customer Base]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Growth in Customer Base</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>Case

        When [Date].[Fiscal].CurrentMember.Level.Ordinal = 0
        Then "NA"

        When IsEmpty
             (  
               ( 
                 [Date].[Fiscal].CurrentMember.PrevMember, 
                 [Measures].[Customer Count] 
               ) 
             ) 
        Then Null

        Else ( 
               ( [Date].[Fiscal].CurrentMember, [Measures].[Customer Count] ) 
               -
               ( [Date].[Fiscal].PrevMember, [Measures].[Customer Count] ) 
             ) 
             /
             ( [Date].[Fiscal].PrevMember,[Measures].[Customer Count] )

    End</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Growth in Customer Base</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Growth in Customer Base</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Internet Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Gross Profit</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Gross Profit]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Gross Profit</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Reseller Sales Amount] 
    - 
    [Measures].[Reseller Total Product Cost]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Gross Profit</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Gross Profit</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Gross Profit Margin</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Gross Profit Margin]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Gross Profit Margin</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>( 
      [Measures].[Reseller Sales Amount] 
      - 
      [Measures].[Reseller Total Product Cost] 
    ) 
    /
    [Measures].[Reseller Sales Amount]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Gross Profit Margin</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Gross Profit Margin</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Average Unit Price</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Average Unit Price]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Average Unit Price</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Reseller Unit Price] 
    /
    [Measures].[Reseller Transaction Count]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Average Unit Price</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Average Unit Price</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Average Sales Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Average Sales Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Average Sales Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Reseller Sales Amount] 
    /
    [Measures].[Reseller Order Count]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Average Sales Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Average Sales Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Ratio to All Products</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Ratio to All Products]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Ratio to All Products</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Reseller Sales Amount]
    /
    ( 
      Root( [Product] ),
      [Measures].[Reseller Sales Amount] 
    )</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Ratio to All Products</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Ratio to All Products</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Reseller Ratio to Parent Product</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Reseller Ratio to Parent Product]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Reseller Ratio to Parent Product</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>Case

        When [Product].[Product Model Categories].CurrentMember.Level.Ordinal 
             = 0
        Then 1

        Else [Measures].[Reseller Sales Amount]
             /
             ( [Product].[Product Model Categories].CurrentMember.Parent,
               [Measures].[Reseller Sales Amount] )

    End</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Reseller Ratio to Parent Product</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Reseller Ratio to Parent Product</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Discount Percentage</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Discount Percentage]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Discount Percentage</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Discount Amount] 
    / 
    [Measures].[Reseller Sales Amount]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Discount Percentage</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Discount Percentage</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Reseller Sales</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Average Unit Price</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Average Unit Price]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Average Unit Price</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Unit Price] 
    /
    [Measures].[Transaction Count]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Average Unit Price</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Average Unit Price</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Average Sales Amount</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Average Sales Amount]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Average Sales Amount</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Sales Amount] 
    /
    [Measures].[Order Count]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Average Sales Amount</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Average Sales Amount</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Gross Profit</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Gross Profit]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Gross Profit</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Sales Amount] 
    - 
    [Measures].[Total Product Cost]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Gross Profit</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Gross Profit</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Currency</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Gross Profit Margin</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Gross Profit Margin]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Gross Profit Margin</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>( 
      [Measures].[Sales Amount] 
      - 
      [Measures].[Total Product Cost] 
    ) 
    /
    [Measures].[Sales Amount]</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Gross Profit Margin</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Gross Profit Margin</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Ratio to All Products</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Ratio to All Products]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Ratio to All Products</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>[Measures].[Sales Amount]
    /
    ( 
      Root( [Product] ),
      [Measures].[Sales Amount] 
    )</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Ratio to All Products</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Ratio to All Products</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <MEASURE_NAME>Ratio to Parent Product</MEASURE_NAME>
            <MEASURE_UNIQUE_NAME>[Measures].[Ratio to Parent Product]</MEASURE_UNIQUE_NAME>
            <MEASURE_CAPTION>Ratio to Parent Product</MEASURE_CAPTION>
            <MEASURE_AGGREGATOR>127</MEASURE_AGGREGATOR>
            <DATA_TYPE>12</DATA_TYPE>
            <NUMERIC_PRECISION>65535</NUMERIC_PRECISION>
            <NUMERIC_SCALE>-1</NUMERIC_SCALE>
            <DESCRIPTION/>
            <EXPRESSION>Case

        When [Product].[Product Model Categories].CurrentMember.Level.Ordinal 
             = 0
        Then 1

        Else [Measures].[Sales Amount]
             /
             ( [Product].[Product Model Categories].CurrentMember.Parent,
               [Measures].[Sales Amount] )

    End</EXPRESSION>
            <MEASURE_IS_VISIBLE>true</MEASURE_IS_VISIBLE>
            <MEASURE_NAME_SQL_COLUMN_NAME>Ratio to Parent Product</MEASURE_NAME_SQL_COLUMN_NAME>
            <MEASURE_UNQUALIFIED_CAPTION>Ratio to Parent Product</MEASURE_UNQUALIFIED_CAPTION>
            <MEASUREGROUP_NAME>Sales Summary</MEASUREGROUP_NAME>
            <MEASURE_DISPLAY_FOLDER/>
            <DEFAULT_FORMAT_STRING>Percent</DEFAULT_FORMAT_STRING>
          </row>
        </root>
      </return>
    </DiscoverResponse>
  </soap:Body>
</soap:Envelope>`;
