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
                <xsd:element sql:field="DIMENSION_UNIQUE_NAME" name="DIMENSION_UNIQUE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="HIERARCHY_UNIQUE_NAME" name="HIERARCHY_UNIQUE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_NAME" name="LEVEL_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_UNIQUE_NAME" name="LEVEL_UNIQUE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_GUID" name="LEVEL_GUID" type="uuid" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_CAPTION" name="LEVEL_CAPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_NUMBER" name="LEVEL_NUMBER" type="xsd:unsignedInt" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_CARDINALITY" name="LEVEL_CARDINALITY" type="xsd:unsignedInt" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_TYPE" name="LEVEL_TYPE" type="xsd:int" minOccurs="0"/>
                <xsd:element sql:field="DESCRIPTION" name="DESCRIPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="CUSTOM_ROLLUP_SETTINGS" name="CUSTOM_ROLLUP_SETTINGS" type="xsd:int" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_UNIQUE_SETTINGS" name="LEVEL_UNIQUE_SETTINGS" type="xsd:int" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_IS_VISIBLE" name="LEVEL_IS_VISIBLE" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_ORDERING_PROPERTY" name="LEVEL_ORDERING_PROPERTY" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_DBTYPE" name="LEVEL_DBTYPE" type="xsd:int" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_MASTER_UNIQUE_NAME" name="LEVEL_MASTER_UNIQUE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_NAME_SQL_COLUMN_NAME" name="LEVEL_NAME_SQL_COLUMN_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_KEY_SQL_COLUMN_NAME" name="LEVEL_KEY_SQL_COLUMN_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME" name="LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_ATTRIBUTE_HIERARCHY_NAME" name="LEVEL_ATTRIBUTE_HIERARCHY_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_KEY_CARDINALITY" name="LEVEL_KEY_CARDINALITY" type="xsd:unsignedShort" minOccurs="0"/>
                <xsd:element sql:field="LEVEL_ORIGIN" name="LEVEL_ORIGIN" type="xsd:unsignedShort" minOccurs="0"/>
              </xsd:sequence>
            </xsd:complexType>
          </xsd:schema>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Address]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Address].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Address]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Address</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Address].[Address]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Address</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>12798</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4241</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Address</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Address] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Address] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Address] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Address</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[City]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[City].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[City]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>City</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[City].[City]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>City</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>588</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8198</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>City</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[City] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[City] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[City] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>City</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Commute Distance]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Commute Distance].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Commute Distance]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Commute Distance</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Commute Distance].[Commute Distance]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Commute Distance</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Commute Distance Sort</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Commute Distance] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Commute Distance] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Commute Distance] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Commute Distance</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Country]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Country].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Country]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Country</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Country].[Country]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Country</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8195</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Country</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Country] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Country] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Country] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Country</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Customer].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Customer</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Customer].[Customer]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Customer</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>18485</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4129</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Customer</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Customer] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Customer] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Customer] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Customer</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Customer Geography].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Country</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Customer Geography].[Country]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Country</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8195</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Country</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Country] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Country] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Country] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Country</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>State-Province</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Customer Geography].[State-Province]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>State-Province</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>72</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8196</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>State-Province</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[State-Province] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[State-Province] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[State-Province] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>State-Province</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>City</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Customer Geography].[City]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>City</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>588</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8198</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>City</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[City] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[City] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[City] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>City</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Postal Code</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Customer Geography].[Postal Code]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Postal Code</LEVEL_CAPTION>
            <LEVEL_NUMBER>4</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>647</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8199</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Postal Code</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Postal Code] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Postal Code] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Postal Code] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Postal Code</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Customer</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Customer Geography].[Customer]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Customer</LEVEL_CAPTION>
            <LEVEL_NUMBER>5</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>18485</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4129</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Customer</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Customer] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Customer] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Customer] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Customer</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Date of First Purchase]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Date of First Purchase].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Date of First Purchase]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date of First Purchase</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Date of First Purchase].[Date of First Purchase]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date of First Purchase</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1125</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date of First Purchase</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>7</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Date of First Purchase] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Date of First Purchase] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Date of First Purchase] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date of First Purchase</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Education]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Education].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Education]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Education</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Education].[Education]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Education</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Education</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Education] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Education] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Education] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Education</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Email Address]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Email Address].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Email Address]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Email Address</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Email Address].[Email Address]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Email Address</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>18485</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4515</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Email Address</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Email Address] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Email Address] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Email Address] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Email Address</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Gender]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Gender].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Gender]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Gender</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Gender].[Gender]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Gender</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Gender</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Gender] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Gender] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Gender] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Gender</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Home Owner]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Home Owner].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Home Owner]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Home Owner</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Home Owner].[Home Owner]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Home Owner</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Home Owner</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Home Owner] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Home Owner] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Home Owner] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Home Owner</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Marital Status]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Marital Status].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Marital Status]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Marital Status</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Marital Status].[Marital Status]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Marital Status</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Marital Status</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Marital Status] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Marital Status] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Marital Status] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Marital Status</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Number of Cars Owned]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Number of Cars Owned].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Number of Cars Owned]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Number of Cars Owned</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Number of Cars Owned].[Number of Cars Owned]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Number of Cars Owned</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Number of Cars Owned</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Number of Cars Owned] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Number of Cars Owned] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Number of Cars Owned] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Number of Cars Owned</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Number of Children At Home]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Number of Children At Home].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Number of Children At Home]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Number of Children At Home</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Number of Children At Home].[Number of Children At Home]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Number of Children At Home</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Number of Children At Home</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Number of Children At Home] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Number of Children At Home] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Number of Children At Home] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Number of Children At Home</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Occupation]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Occupation].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Occupation]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Occupation</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Occupation].[Occupation]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Occupation</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Occupation</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Occupation] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Occupation] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Occupation] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Occupation</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Phone]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Phone].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Phone]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Phone</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Phone].[Phone]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Phone</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8891</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4515</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Phone</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Phone] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Phone] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Phone] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Phone</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Postal Code]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Postal Code].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Postal Code]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Postal Code</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Postal Code].[Postal Code]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Postal Code</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>647</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8199</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Postal Code</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Postal Code] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Postal Code] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Postal Code] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Postal Code</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[State-Province]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[State-Province].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[State-Province]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>State-Province</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[State-Province].[State-Province]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>State-Province</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>72</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8196</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>State-Province</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[State-Province] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[State-Province] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[State-Province] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>State-Province</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Total Children]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Total Children].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Total Children]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Total Children</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Total Children].[Total Children]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Total Children</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Total Children</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Total Children] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Total Children] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Total Children] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Total Children</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Yearly Income]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Yearly Income].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Yearly Income]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Yearly Income</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Customer].[Yearly Income].[Yearly Income]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Yearly Income</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Yearly Income</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>6</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Customer].[Yearly Income] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Customer].[Yearly Income] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Customer].[Yearly Income] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Yearly Income</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar].[Calendar Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>20</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Calendar Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Calendar Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Calendar Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Semester</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar].[Calendar Semester]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Semester</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>36</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Semester</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Calendar Semester] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Calendar Semester] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Calendar Semester] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Semester</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Quarter</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar].[Calendar Quarter]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Quarter</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>14</LEVEL_CARDINALITY>
            <LEVEL_TYPE>68</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Quarter</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Calendar Quarter] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Calendar Quarter] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Calendar Quarter] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Quarter</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar].[Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>4</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>39</LEVEL_CARDINALITY>
            <LEVEL_TYPE>132</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Month Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Month Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Month Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Month Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Month Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar].[Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>5</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1159</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar Quarter of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Quarter of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar Quarter of Year].[Calendar Quarter of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Quarter of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4578</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Quarter of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Calendar Quarter of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Calendar Quarter of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Calendar Quarter of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Quarter of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar Semester of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Semester of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar Semester of Year].[Calendar Semester of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Semester of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4385</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Semester of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Calendar Semester of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Calendar Semester of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Calendar Semester of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Semester of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Calendar Year].[Calendar Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>20</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Calendar Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Calendar Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Calendar Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Date].[Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1159</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Day Name].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day Name</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Day Name].[Day Name]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day Name</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>516</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Day Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Day Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Day Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day of Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Day of Month].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day of Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day of Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Day of Month].[Day of Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day of Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>32</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4296</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day of Month</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Day of Month] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Day of Month] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Day of Month] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day of Month</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day of Week]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Day of Week].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day of Week]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day of Week</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Day of Week].[Day of Week]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day of Week</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4301</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day of Week</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Day of Week] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Day of Week] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Day of Week] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day of Week</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Day of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Day of Year].[Day of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>366</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4302</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>2</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Day of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Day of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Day of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal].[Fiscal Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4346</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Fiscal Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Fiscal Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Fiscal Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Semester</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal].[Fiscal Semester]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Semester</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4329</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Semester</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Fiscal Semester] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Fiscal Semester] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Fiscal Semester] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Semester</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Quarter</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal].[Fiscal Quarter]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Quarter</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>14</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4337</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Quarter</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Fiscal Quarter] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Fiscal Quarter] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Fiscal Quarter] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Quarter</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal].[Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>4</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>39</LEVEL_CARDINALITY>
            <LEVEL_TYPE>132</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Month Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Month Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Month Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Month Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Month Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal].[Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>5</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1159</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal Quarter of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Quarter of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal Quarter of Year].[Fiscal Quarter of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Quarter of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4336</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Quarter of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Fiscal Quarter of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Fiscal Quarter of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Fiscal Quarter of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Quarter of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal Semester of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Semester of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal Semester of Year].[Fiscal Semester of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Semester of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4328</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Semester of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Fiscal Semester of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Fiscal Semester of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Fiscal Semester of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Semester of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Fiscal Year].[Fiscal Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4346</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Fiscal Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Fiscal Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Fiscal Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Month of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Month of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Month of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Month of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Month of Year].[Month of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Month of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>13</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Month of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Month of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Month of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Month of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Month of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Week of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Week of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Week of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Week of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Date].[Week of Year].[Week of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Week of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>54</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4759</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Week of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Date].[Week of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Date].[Week of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Date].[Week of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Week of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar].[Calendar Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>20</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Calendar Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Calendar Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Calendar Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Semester</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar].[Calendar Semester]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Semester</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>36</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Semester</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Calendar Semester] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Calendar Semester] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Calendar Semester] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Semester</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Quarter</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar].[Calendar Quarter]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Quarter</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>14</LEVEL_CARDINALITY>
            <LEVEL_TYPE>68</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Quarter</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Calendar Quarter] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Calendar Quarter] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Calendar Quarter] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Quarter</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar].[Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>4</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>39</LEVEL_CARDINALITY>
            <LEVEL_TYPE>132</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Month Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Month Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Month Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Month Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Month Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar].[Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>5</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1159</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar Quarter of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Quarter of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar Quarter of Year].[Calendar Quarter of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Quarter of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4578</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Quarter of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Calendar Quarter of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Calendar Quarter of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Calendar Quarter of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Quarter of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar Semester of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Semester of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar Semester of Year].[Calendar Semester of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Semester of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4385</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Semester of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Calendar Semester of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Calendar Semester of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Calendar Semester of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Semester of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Calendar Year].[Calendar Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>20</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Calendar Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Calendar Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Calendar Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Date].[Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1159</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Day Name].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day Name</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Day Name].[Day Name]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day Name</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>516</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Day Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Day Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Day Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day of Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Day of Month].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day of Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day of Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Day of Month].[Day of Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day of Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>32</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4296</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day of Month</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Day of Month] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Day of Month] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Day of Month] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day of Month</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day of Week]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Day of Week].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day of Week]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day of Week</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Day of Week].[Day of Week]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day of Week</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4301</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day of Week</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Day of Week] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Day of Week] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Day of Week] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day of Week</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Day of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Day of Year].[Day of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>366</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4302</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>2</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Day of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Day of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Day of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal].[Fiscal Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4346</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Fiscal Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Fiscal Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Fiscal Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Semester</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal].[Fiscal Semester]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Semester</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4329</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Semester</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Fiscal Semester] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Fiscal Semester] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Fiscal Semester] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Semester</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Quarter</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal].[Fiscal Quarter]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Quarter</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>14</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4337</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Quarter</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Fiscal Quarter] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Fiscal Quarter] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Fiscal Quarter] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Quarter</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal].[Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>4</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>39</LEVEL_CARDINALITY>
            <LEVEL_TYPE>132</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Month Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Month Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Month Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Month Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Month Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal].[Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>5</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1159</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal Quarter of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Quarter of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal Quarter of Year].[Fiscal Quarter of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Quarter of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4336</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Quarter of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Fiscal Quarter of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Fiscal Quarter of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Fiscal Quarter of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Quarter of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal Semester of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Semester of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal Semester of Year].[Fiscal Semester of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Semester of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4328</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Semester of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Fiscal Semester of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Fiscal Semester of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Fiscal Semester of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Semester of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Fiscal Year].[Fiscal Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4346</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Fiscal Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Fiscal Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Fiscal Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Month of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Month of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Month of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Month of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Month of Year].[Month of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Month of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>13</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Month of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Month of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Month of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Month of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Month of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Week of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Week of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Week of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Week of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Delivery Date].[Week of Year].[Week of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Week of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>54</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4759</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Week of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Delivery Date].[Week of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Delivery Date].[Week of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Delivery Date].[Week of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Week of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Base Rate]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Base Rate].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Base Rate]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Base Rate</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Base Rate].[Base Rate]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Base Rate</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Base Rate</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>6</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Base Rate] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Base Rate] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Base Rate] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Base Rate</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Birth Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Birth Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Birth Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Birth Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Birth Date].[Birth Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Birth Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>280</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Birth Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>7</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Birth Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Birth Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Birth Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Birth Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Department Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Department Name].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Department Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Department Name</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Department Name].[Department Name]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Department Name</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>17</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Department Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Department Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Department Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Department Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Department Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Email Address]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Email Address].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Email Address]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Email Address</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Email Address].[Email Address]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Email Address</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>291</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4515</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Email Address</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Email Address] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Email Address] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Email Address] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Email Address</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Emergency Contact Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Emergency Contact Name].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Emergency Contact Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Emergency Contact Name</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Emergency Contact Name].[Emergency Contact Name]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Emergency Contact Name</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>291</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Emergency Contact Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Emergency Contact Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Emergency Contact Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Emergency Contact Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Emergency Contact Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Emergency Contact Phone]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Emergency Contact Phone].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Emergency Contact Phone]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Emergency Contact Phone</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Emergency Contact Phone].[Emergency Contact Phone]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Emergency Contact Phone</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>289</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Emergency Contact Phone</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Emergency Contact Phone] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Emergency Contact Phone] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Emergency Contact Phone] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Emergency Contact Phone</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employee]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employee].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employee]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Employee</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employee].[Employee]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Employee</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>297</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Employee</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Employee] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Employee] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Employee] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Employee</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employee Department]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employee Department].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employee Department]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Department Name</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employee Department].[Department Name]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Department Name</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>17</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Department Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Department Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Department Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Department Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Department Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employee Department]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Title</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employee Department].[Title]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Title</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>68</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Title</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Title] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Title] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Title] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Title</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employee Department]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Employee</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employee Department].[Employee]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Employee</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>297</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Employee</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Employee] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Employee] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Employee] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Employee</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employees]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employees].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>3</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employees]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Employee Level 02</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employees].[Employee Level 02]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Employee Level 02</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>2</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4161</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>ParentEmployeeKey0</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[ParentEmployeeKey0] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[ParentEmployeeKey0] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[ParentEmployeeKey0] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Employees</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>3</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employees]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Employee Level 03</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employees].[Employee Level 03]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Employee Level 03</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>10</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4161</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>ParentEmployeeKey1</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[ParentEmployeeKey1] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[ParentEmployeeKey1] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[ParentEmployeeKey1] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Employees</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>3</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employees]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Employee Level 04</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employees].[Employee Level 04]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Employee Level 04</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>55</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4161</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>ParentEmployeeKey2</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[ParentEmployeeKey2] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[ParentEmployeeKey2] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[ParentEmployeeKey2] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Employees</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>3</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employees]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Employee Level 05</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employees].[Employee Level 05]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Employee Level 05</LEVEL_CAPTION>
            <LEVEL_NUMBER>4</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>243</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4161</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>ParentEmployeeKey3</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[ParentEmployeeKey3] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[ParentEmployeeKey3] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[ParentEmployeeKey3] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Employees</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>3</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employees]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Employee Level 06</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Employees].[Employee Level 06]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Employee Level 06</LEVEL_CAPTION>
            <LEVEL_NUMBER>5</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>34</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4161</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>ParentEmployeeKey4</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[ParentEmployeeKey4] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[ParentEmployeeKey4] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[ParentEmployeeKey4] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Employees</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>3</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[End Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[End Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[End Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>End Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[End Date].[End Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>End Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4657</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>End Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>7</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[End Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[End Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[End Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>End Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Gender]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Gender].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Gender]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Gender</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Gender].[Gender]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Gender</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Gender</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Gender] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Gender] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Gender] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Gender</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Hire Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Hire Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Hire Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Hire Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Hire Date].[Hire Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Hire Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>165</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Hire Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>7</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Hire Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Hire Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Hire Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Hire Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Hire Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Hire Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Hire Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Hire Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Hire Year].[Hire Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Hire Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>9</LEVEL_CARDINALITY>
            <LEVEL_TYPE>20</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Hire Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Hire Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Hire Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Hire Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Hire Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Marital Status]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Marital Status].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Marital Status]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Marital Status</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Marital Status].[Marital Status]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Marital Status</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Marital Status</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Marital Status] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Marital Status] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Marital Status] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Marital Status</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Pay Frequency]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Pay Frequency].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Pay Frequency]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Pay Frequency</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Pay Frequency].[Pay Frequency]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Pay Frequency</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Pay Frequency</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Pay Frequency] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Pay Frequency] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Pay Frequency] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Pay Frequency</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Phone]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Phone].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Phone]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Phone</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Phone].[Phone]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Phone</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>289</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4515</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Phone</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Phone] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Phone] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Phone] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Phone</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Salaried Flag]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Salaried Flag].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Salaried Flag]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Salaried Flag</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Salaried Flag].[Salaried Flag]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Salaried Flag</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Salaried Flag</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>11</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Salaried Flag] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Salaried Flag] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Salaried Flag] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Salaried Flag</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Sales Person Flag]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Sales Person Flag].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Sales Person Flag]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Person Flag</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Sales Person Flag].[Sales Person Flag]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Person Flag</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Person Flag</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>11</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Sales Person Flag] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Sales Person Flag] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Sales Person Flag] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Person Flag</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Sick Leave Hours]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Sick Leave Hours].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Sick Leave Hours]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sick Leave Hours</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Sick Leave Hours].[Sick Leave Hours]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sick Leave Hours</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sick Leave Hours</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>2</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Sick Leave Hours] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Sick Leave Hours] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Sick Leave Hours] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sick Leave Hours</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Start Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Start Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Start Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Start Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Start Date].[Start Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Start Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>171</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4659</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Start Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>7</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Start Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Start Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Start Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Start Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Status]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Status].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Status]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Status</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Status].[Status]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Status</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4660</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Status</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Status] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Status] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Status] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Status</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Title]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Title].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Title]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Title</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Title].[Title]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Title</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>68</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Title</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Title] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Title] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Title] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Title</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Vacation Hours]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Vacation Hours].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Vacation Hours]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Vacation Hours</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Employee].[Vacation Hours].[Vacation Hours]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Vacation Hours</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Vacation Hours</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>2</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Employee].[Vacation Hours] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Employee].[Vacation Hours] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Employee].[Vacation Hours] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Vacation Hours</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[City]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[City].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[City]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>City</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[City].[City]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>City</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>588</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8198</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>City</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Geography].[City] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Geography].[City] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Geography].[City] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>City</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Country]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[Country].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Country]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Country</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[Country].[Country]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Country</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8195</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Country</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Geography].[Country] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Geography].[Country] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Geography].[Country] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Country</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[Geography].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Country</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[Geography].[Country]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Country</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8195</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Country</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Geography].[Country] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Geography].[Country] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Geography].[Country] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Country</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>State-Province</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[Geography].[State-Province]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>State-Province</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>72</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8196</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>State-Province</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Geography].[State-Province] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Geography].[State-Province] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Geography].[State-Province] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>State-Province</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>City</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[Geography].[City]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>City</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>588</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8198</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>City</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Geography].[City] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Geography].[City] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Geography].[City] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>City</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Geography]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Postal Code</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[Geography].[Postal Code]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Postal Code</LEVEL_CAPTION>
            <LEVEL_NUMBER>4</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>647</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8199</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Postal Code</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Geography].[Postal Code] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Geography].[Postal Code] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Geography].[Postal Code] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Postal Code</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Postal Code]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[Postal Code].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Postal Code]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Postal Code</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[Postal Code].[Postal Code]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Postal Code</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>647</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8199</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Postal Code</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Geography].[Postal Code] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Geography].[Postal Code] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Geography].[Postal Code] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Postal Code</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[State-Province]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[State-Province].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[State-Province]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>State-Province</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Geography].[State-Province].[State-Province]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>State-Province</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>72</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8196</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>State-Province</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Geography].[State-Province] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Geography].[State-Province] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Geography].[State-Province] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>State-Province</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Carrier Tracking Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Carrier Tracking Number].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Carrier Tracking Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Carrier Tracking Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Carrier Tracking Number].[Carrier Tracking Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Carrier Tracking Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>2</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Carrier Tracking Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Internet Sales Order Details].[Carrier Tracking Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Internet Sales Order Details].[Carrier Tracking Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Internet Sales Order Details].[Carrier Tracking Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Carrier Tracking Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Customer PO Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Customer PO Number].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Customer PO Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Customer PO Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Customer PO Number].[Customer PO Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Customer PO Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>2</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Customer PO Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Internet Sales Order Details].[Customer PO Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Internet Sales Order Details].[Customer PO Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Internet Sales Order Details].[Customer PO Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Customer PO Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Internet Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Internet Sales Orders].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Internet Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Internet Sales Orders].[Order Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>27660</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Internet Sales Order Details].[Sales Order Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Internet Sales Order Details].[Sales Order Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Internet Sales Order Details].[Sales Order Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Internet Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Line</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Internet Sales Orders].[Order Line]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Line</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>60399</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Internet Sales Order</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Internet Sales Order Details].[Internet Sales Order] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Internet Sales Order Details].[Internet Sales Order] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Internet Sales Order Details].[Internet Sales Order] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Internet Sales Order</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Line].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Order Line</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Line].[Sales Order Line]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Order Line</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>9</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Line</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Internet Sales Order Details].[Sales Order Line] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Internet Sales Order Details].[Sales Order Line] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Internet Sales Order Details].[Sales Order Line] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Line</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Number].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Order Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Number].[Sales Order Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Order Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>27660</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Internet Sales Order Details].[Sales Order Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Internet Sales Order Details].[Sales Order Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Internet Sales Order Details].[Sales Order Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Measures]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>MeasuresLevel</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Measures].[MeasuresLevel]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>MeasuresLevel</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>35</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Measures</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Category]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Category].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Category]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Category</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Category].[Category]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Category</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4546</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Category</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Category] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Category] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Category] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Category</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Class]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Class].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Class]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Class</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Class].[Class]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Class</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Class</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Class] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Class] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Class] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Class</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Color]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Color].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Color]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Color</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Color].[Color]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Color</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>11</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Color</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Color] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Color] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Color] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Color</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Days to Manufacture]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Days to Manufacture].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Days to Manufacture]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Days to Manufacture</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Days to Manufacture].[Days to Manufacture]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Days to Manufacture</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Days to Manufacture</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Days to Manufacture] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Days to Manufacture] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Days to Manufacture] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Days to Manufacture</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Dealer Price]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Dealer Price].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Dealer Price]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Dealer Price</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Dealer Price].[Dealer Price]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Dealer Price</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>122</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Dealer Price</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>6</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Dealer Price] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Dealer Price] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Dealer Price] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Dealer Price</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[End Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[End Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[End Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>End Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[End Date].[End Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>End Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4657</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>End Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[End Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[End Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[End Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>End Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Large Photo]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Large Photo].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Large Photo]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Large Photo</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Large Photo].[Large Photo]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Large Photo</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>505</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Large Photo</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Large Photo] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Large Photo] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Large Photo] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Large Photo</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[List Price]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[List Price].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[List Price]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>List Price</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[List Price].[List Price]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>List Price</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>122</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>List Price</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>6</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[List Price] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[List Price] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[List Price] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>List Price</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Manufacture Time]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Manufacture Time].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Manufacture Time]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Days to Manufacture</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Manufacture Time].[Days to Manufacture]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Days to Manufacture</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Days to Manufacture</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Days to Manufacture] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Days to Manufacture] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Days to Manufacture] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Days to Manufacture</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Manufacture Time]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Subcategory</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Manufacture Time].[Subcategory]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Subcategory</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>38</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Subcategory</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Subcategory] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Subcategory] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Subcategory] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Subcategory</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Model Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Model Name].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Model Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Model Name</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Model Name].[Model Name]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Model Name</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>121</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Model Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Model Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Model Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Model Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Model Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Product</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product].[Product]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Product</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>607</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4145</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Subcategory</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Product] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Product] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Product] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Product</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Categories]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Categories].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Categories]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Category</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Categories].[Category]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Category</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4546</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Category</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Category] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Category] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Category] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Category</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Categories]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Subcategory</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Categories].[Subcategory]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Subcategory</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>38</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Subcategory</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Subcategory] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Subcategory] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Subcategory] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Subcategory</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Categories]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Product</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Categories].[Product]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Product</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>607</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4145</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Subcategory</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Product] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Product] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Product] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Product</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Key]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Key].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Key]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Product Key</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Key].[Product Key]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Product Key</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>505</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Product Key</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Product Key] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Product Key] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Product Key] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Product Key</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Line].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Product Line</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Line].[Product Line]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Product Line</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Product Line</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Product Line] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Product Line] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Product Line] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Product Line</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Model Categories]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Model Categories].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Model Categories]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Category</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Model Categories].[Category]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Category</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4546</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Category</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Category] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Category] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Category] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Category</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Model Categories]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Subcategory</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Model Categories].[Subcategory]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Subcategory</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>38</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Subcategory</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Subcategory] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Subcategory] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Subcategory] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Subcategory</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Model Categories]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Model</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Model Categories].[Model]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Model</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>121</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Model Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Model Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Model Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Model Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Model Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Model Lines]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Model Lines].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Model Lines]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Product Line</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Model Lines].[Product Line]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Product Line</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Product Line</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Product Line] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Product Line] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Product Line] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Product Line</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Model Lines]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Model</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Product Model Lines].[Model]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Model</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>121</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Model Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Model Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Model Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Model Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Model Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Reorder Point]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Reorder Point].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Reorder Point]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Reorder Point</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Reorder Point].[Reorder Point]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Reorder Point</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Reorder Point</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>2</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Reorder Point] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Reorder Point] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Reorder Point] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Reorder Point</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Safety Stock Level]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Safety Stock Level].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Safety Stock Level]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Safety Stock Level</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Safety Stock Level].[Safety Stock Level]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Safety Stock Level</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Safety Stock Level</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>2</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Safety Stock Level] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Safety Stock Level] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Safety Stock Level] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Safety Stock Level</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Size]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Size].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Size]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Size</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Size].[Size]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Size</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>20</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Size</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Size] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Size] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Size] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Size</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Size Range]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Size Range].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Size Range]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Size Range</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Size Range].[Size Range]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Size Range</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>12</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Size Range</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Size Range] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Size Range] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Size Range] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Size Range</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Standard Cost]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Standard Cost].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Standard Cost]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Standard Cost</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Standard Cost].[Standard Cost]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Standard Cost</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>136</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Standard Cost</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>6</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Standard Cost] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Standard Cost] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Standard Cost] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Standard Cost</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Start Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Start Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Start Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Start Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Start Date].[Start Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Start Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4659</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Start Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Start Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Start Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Start Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Start Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Status]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Status].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Status]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Status</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Status].[Status]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Status</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4660</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Status</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Status] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Status] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Status] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Status</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Stock Level]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Stock Level].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Stock Level]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Safety Stock Level</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Stock Level].[Safety Stock Level]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Safety Stock Level</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Safety Stock Level</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>2</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Safety Stock Level] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Safety Stock Level] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Safety Stock Level] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Safety Stock Level</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Stock Level]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Product</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Stock Level].[Product]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Product</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>607</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4145</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Subcategory</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Product] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Product] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Product] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Product</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Style]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Style].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Style]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Style</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Style].[Style]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Style</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Style</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Style] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Style] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Style] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Style</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Subcategory]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Subcategory].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Subcategory]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Subcategory</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Subcategory].[Subcategory]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Subcategory</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>38</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Subcategory</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Subcategory] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Subcategory] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Subcategory] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Subcategory</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Weight]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Weight].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Weight]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Weight</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Product].[Weight].[Weight]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Weight</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>129</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Weight</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>5</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Product].[Weight] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Product].[Weight] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Product].[Weight] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Weight</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Discount Percent]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Discount Percent].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Discount Percent]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Discount Percent</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Discount Percent].[Discount Percent]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Discount Percent</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>11</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Discount Percent</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>5</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Discount Percent] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Discount Percent] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Discount Percent] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Discount Percent</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[End Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[End Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[End Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>End Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[End Date].[End Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>End Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>11</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4292</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>End Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>7</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[End Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[End Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[End Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>End Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Max Quantity]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Max Quantity].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Max Quantity]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Max Quantity</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Max Quantity].[Max Quantity]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Max Quantity</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4561</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Max Quantity</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Max Quantity] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Max Quantity] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Max Quantity] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Max Quantity</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Min Quantity]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Min Quantity].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Min Quantity]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Min Quantity</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Min Quantity].[Min Quantity]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Min Quantity</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4562</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Min Quantity</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Min Quantity] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Min Quantity] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Min Quantity] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Min Quantity</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotion]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotion].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotion]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Promotion</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotion].[Promotion]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Promotion</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>17</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4209</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Start Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Promotion] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Promotion] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Promotion] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Promotion</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotion Category]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotion Category].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotion Category]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Promotion Category</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotion Category].[Promotion Category]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Promotion Category</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Promotion Category</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Promotion Category] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Promotion Category] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Promotion Category] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Promotion Category</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotion Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotion Type].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotion Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Promotion Type</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotion Type].[Promotion Type]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Promotion Type</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Promotion Type</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Promotion Type] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Promotion Type] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Promotion Type] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Promotion Type</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotions]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotions].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotions]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Category</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotions].[Category]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Category</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Promotion Category</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Promotion Category] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Promotion Category] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Promotion Category] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Promotion Category</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotions]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Type</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotions].[Type]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Type</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>7</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Promotion Type</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Promotion Type] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Promotion Type] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Promotion Type] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Promotion Type</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotions]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Promotion</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Promotions].[Promotion]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Promotion</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>17</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4209</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Start Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Promotion] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Promotion] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Promotion] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Promotion</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Start Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Start Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Start Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Start Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Promotion].[Start Date].[Start Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Start Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>9</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4294</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Start Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>7</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Promotion].[Start Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Promotion].[Start Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Promotion].[Start Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Start Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Address]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Address].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Address]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Address</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Address].[Address]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Address</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>688</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4241</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Address</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Address] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Address] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Address] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Address</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Annual Revenue]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Annual Revenue].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Annual Revenue]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Annual Revenue</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Annual Revenue].[Annual Revenue]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Annual Revenue</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Annual Revenue</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>6</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Annual Revenue] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Annual Revenue] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Annual Revenue] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Annual Revenue</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Annual Sales]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Annual Sales].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Annual Sales]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Annual Sales</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Annual Sales].[Annual Sales]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Annual Sales</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Annual Sales</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>6</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Annual Sales] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Annual Sales] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Annual Sales] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Annual Sales</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Bank Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Bank Name].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Bank Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Bank Name</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Bank Name].[Bank Name]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Bank Name</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Bank Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Bank Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Bank Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Bank Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Bank Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Business Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Business Type].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Business Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Business Type</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Business Type].[Business Type]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Business Type</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Business Type</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Business Type] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Business Type] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Business Type] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Business Type</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[First Order Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[First Order Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[First Order Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>First Order Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[First Order Year].[First Order Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>First Order Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>First Order Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[First Order Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[First Order Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[First Order Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>First Order Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Last Order Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Last Order Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Last Order Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Last Order Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Last Order Year].[Last Order Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Last Order Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>6</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Last Order Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Last Order Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Last Order Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Last Order Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Last Order Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Min Payment Amount]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Min Payment Amount].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Min Payment Amount]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Min Payment Amount</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Min Payment Amount].[Min Payment Amount]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Min Payment Amount</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Min Payment Amount</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>6</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Min Payment Amount] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Min Payment Amount] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Min Payment Amount] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Min Payment Amount</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Min Payment Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Min Payment Type].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Min Payment Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Min Payment Type</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Min Payment Type].[Min Payment Type]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Min Payment Type</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Min Payment Type</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Min Payment Type] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Min Payment Type] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Min Payment Type] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Min Payment Type</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Number of Employees]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Number of Employees].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Number of Employees]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Number of Employees</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Number of Employees].[Number of Employees]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Number of Employees</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Number of Employees</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Number of Employees] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Number of Employees] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Number of Employees] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Number of Employees</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Order Frequency]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Order Frequency].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Order Frequency]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Frequency</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Order Frequency].[Order Frequency]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Frequency</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Order Frequency</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Order Frequency] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Order Frequency] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Order Frequency] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Order Frequency</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Order Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Order Month].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Order Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Order Month].[Order Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>14</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Order Month</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Order Month] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Order Month] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Order Month] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Order Month</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Phone]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Phone].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Phone]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Phone</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Phone].[Phone]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Phone</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>611</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Phone</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Phone] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Phone] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Phone] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Phone</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Product Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Product Line].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Product Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Product Line</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Product Line].[Product Line]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Product Line</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Product Line</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Product Line] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Product Line] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Product Line] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Product Line</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Reseller</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller].[Reseller]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Reseller</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>702</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4193</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Reseller</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Reseller] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Reseller] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Reseller] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Reseller</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Bank]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Bank].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Bank]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Bank Name</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Bank].[Bank Name]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Bank Name</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Bank Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Bank Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Bank Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Bank Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Bank Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Bank]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Reseller</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Bank].[Reseller]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Reseller</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>702</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4193</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Reseller</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Reseller] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Reseller] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Reseller] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Reseller</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Order Frequency]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Order Frequency].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Order Frequency]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Frequency</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Order Frequency].[Order Frequency]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Frequency</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Order Frequency</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Order Frequency] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Order Frequency] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Order Frequency] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Order Frequency</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Order Frequency]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Reseller</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Order Frequency].[Reseller]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Reseller</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>702</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4193</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Reseller</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Reseller] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Reseller] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Reseller] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Reseller</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Order Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Order Month].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Order Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Order Month].[Order Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>14</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Order Month</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Order Month] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Order Month] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Order Month] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Order Month</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Order Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Reseller</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Order Month].[Reseller]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Reseller</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>702</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4193</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Reseller</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Reseller] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Reseller] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Reseller] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Reseller</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Type].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Business Type</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Type].[Business Type]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Business Type</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Business Type</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Business Type] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Business Type] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Business Type] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Business Type</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Reseller</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Reseller Type].[Reseller]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Reseller</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>702</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4193</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Reseller</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Reseller] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Reseller] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Reseller] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Reseller</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Year Opened]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Year Opened].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Year Opened]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Year Opened</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller].[Year Opened].[Year Opened]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Year Opened</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>33</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Year Opened</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller].[Year Opened] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller].[Year Opened] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller].[Year Opened] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Year Opened</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Carrier Tracking Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Carrier Tracking Number].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Carrier Tracking Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Carrier Tracking Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Carrier Tracking Number].[Carrier Tracking Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Carrier Tracking Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3797</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Carrier Tracking Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller Sales Order Details].[Carrier Tracking Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller Sales Order Details].[Carrier Tracking Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller Sales Order Details].[Carrier Tracking Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Carrier Tracking Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Customer PO Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Customer PO Number].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Customer PO Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Customer PO Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Customer PO Number].[Customer PO Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Customer PO Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3797</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Customer PO Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller Sales Order Details].[Customer PO Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller Sales Order Details].[Customer PO Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller Sales Order Details].[Customer PO Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Customer PO Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Reseller Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Reseller Sales Orders].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Reseller Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Reseller Sales Orders].[Order Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3797</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller Sales Order Details].[Sales Order Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller Sales Order Details].[Sales Order Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller Sales Order Details].[Sales Order Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Reseller Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Line</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Reseller Sales Orders].[Order Line]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Line</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>60856</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Reseller Sales Order</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller Sales Order Details].[Reseller Sales Order] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller Sales Order Details].[Reseller Sales Order] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller Sales Order Details].[Reseller Sales Order] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Reseller Sales Order</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Line].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Order Line</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Line].[Sales Order Line]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Order Line</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>73</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Line</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller Sales Order Details].[Sales Order Line] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller Sales Order Details].[Sales Order Line] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller Sales Order Details].[Sales Order Line] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Line</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Number].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Order Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Number].[Sales Order Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Order Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3797</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Reseller Sales Order Details].[Sales Order Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Reseller Sales Order Details].[Sales Order Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Reseller Sales Order Details].[Sales Order Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Channel]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Channel].[Sales Channel]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Channel].[Sales Channel].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Channel]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Channel].[Sales Channel]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Channel</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Channel].[Sales Channel].[Sales Channel]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Channel</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Channel</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Channel].[Sales Channel] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Channel].[Sales Channel] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Channel].[Sales Channel] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Channel</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reason]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Reason].[Sales Reason].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reason]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Reason</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Reason].[Sales Reason].[Sales Reason]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Reason</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>11</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Reason</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Reason].[Sales Reason] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Reason].[Sales Reason] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Reason].[Sales Reason] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Reason</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reason Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Reason].[Sales Reason Type].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reason Type]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Reason Type</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Reason].[Sales Reason Type].[Sales Reason Type]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Reason Type</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Reason Type</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Reason].[Sales Reason Type] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Reason].[Sales Reason Type] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Reason].[Sales Reason Type] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Reason Type</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reasons]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Reason].[Sales Reasons].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reasons]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Reason Type</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Reason].[Sales Reasons].[Reason Type]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Reason Type</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>4</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Reason Type</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Reason].[Sales Reason Type] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Reason].[Sales Reason Type] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Reason].[Sales Reason Type] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Reason Type</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reasons]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Reason</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Reason].[Sales Reasons].[Sales Reason]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Reason</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>11</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Reason</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Reason].[Sales Reason] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Reason].[Sales Reason] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Reason].[Sales Reason] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Reason</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Carrier Tracking Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Carrier Tracking Number].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Carrier Tracking Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Carrier Tracking Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Carrier Tracking Number].[Carrier Tracking Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Carrier Tracking Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3798</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Carrier Tracking Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Summary Order Details].[Carrier Tracking Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Summary Order Details].[Carrier Tracking Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Summary Order Details].[Carrier Tracking Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Carrier Tracking Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Customer PO Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Customer PO Number].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Customer PO Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Customer PO Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Customer PO Number].[Customer PO Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Customer PO Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>483</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Customer PO Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Summary Order Details].[Customer PO Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Summary Order Details].[Customer PO Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Summary Order Details].[Customer PO Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Customer PO Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Line].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Line]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Order Line</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Line].[Sales Order Line]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Order Line</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>62</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Line</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Summary Order Details].[Sales Order Line] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Summary Order Details].[Sales Order Line] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Summary Order Details].[Sales Order Line] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Line</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Number].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Number]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Order Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Number].[Sales Order Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Order Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>31456</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Summary Order Details].[Sales Order Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Summary Order Details].[Sales Order Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Summary Order Details].[Sales Order Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Sales Orders].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Number</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Sales Orders].[Order Number]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Number</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>31456</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Number</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Summary Order Details].[Sales Order Number] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Summary Order Details].[Sales Order Number] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Summary Order Details].[Sales Order Number] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Number</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Order Line</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Summary Order Details].[Sales Orders].[Order Line]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Order Line</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>62</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Order Line</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Summary Order Details].[Sales Order Line] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Summary Order Details].[Sales Order Line] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Summary Order Details].[Sales Order Line] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Order Line</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Group</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory].[Group]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Group</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Territory Group</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Territory].[Sales Territory Group] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Territory].[Sales Territory Group] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Territory].[Sales Territory Group] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Territory Group</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Country</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory].[Country]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Country</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8195</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Territory Country</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Territory].[Sales Territory Country] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Territory].[Sales Territory Country] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Territory].[Sales Territory Country] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Territory Country</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Region</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory].[Region]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Region</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>12</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Territory Region</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Territory].[Sales Territory Region] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Territory].[Sales Territory Region] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Territory].[Sales Territory Region] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Territory Region</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory Country]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory Country].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory Country]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Territory Country</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory Country].[Sales Territory Country]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Territory Country</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>8195</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Territory Country</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Territory].[Sales Territory Country] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Territory].[Sales Territory Country] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Territory].[Sales Territory Country] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Territory Country</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory Group]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory Group].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory Group]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Territory Group</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory Group].[Sales Territory Group]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Territory Group</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Territory Group</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Territory].[Sales Territory Group] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Territory].[Sales Territory Group] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Territory].[Sales Territory Group] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Territory Group</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory Region]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory Region].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory Region]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Sales Territory Region</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Sales Territory].[Sales Territory Region].[Sales Territory Region]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Sales Territory Region</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>12</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Sales Territory Region</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Sales Territory].[Sales Territory Region] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Sales Territory].[Sales Territory Region] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Sales Territory].[Sales Territory Region] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Sales Territory Region</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar].[Calendar Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>20</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Calendar Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Calendar Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Calendar Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Semester</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar].[Calendar Semester]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Semester</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>36</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Semester</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Calendar Semester] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Calendar Semester] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Calendar Semester] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Semester</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Quarter</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar].[Calendar Quarter]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Quarter</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>14</LEVEL_CARDINALITY>
            <LEVEL_TYPE>68</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Quarter</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Calendar Quarter] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Calendar Quarter] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Calendar Quarter] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Quarter</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar].[Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>4</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>39</LEVEL_CARDINALITY>
            <LEVEL_TYPE>132</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Month Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Month Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Month Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Month Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Month Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar].[Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>5</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1159</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar Quarter of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Quarter of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar Quarter of Year].[Calendar Quarter of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Quarter of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4578</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Quarter of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Calendar Quarter of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Calendar Quarter of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Calendar Quarter of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Quarter of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar Semester of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Semester of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar Semester of Year].[Calendar Semester of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Semester of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4385</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Semester of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Calendar Semester of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Calendar Semester of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Calendar Semester of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Semester of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Calendar Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Calendar Year].[Calendar Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Calendar Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>20</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Calendar Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Calendar Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Calendar Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Calendar Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Calendar Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Date].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Date]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Date].[Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1159</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Day Name].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day Name]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day Name</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Day Name].[Day Name]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day Name</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>516</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Day Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Day Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Day Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day of Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Day of Month].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day of Month]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day of Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Day of Month].[Day of Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day of Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>32</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4296</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day of Month</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Day of Month] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Day of Month] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Day of Month] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day of Month</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day of Week]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Day of Week].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day of Week]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day of Week</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Day of Week].[Day of Week]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day of Week</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4301</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day of Week</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Day of Week] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Day of Week] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Day of Week] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day of Week</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Day of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Day of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Day of Year].[Day of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Day of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>366</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4302</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Day of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>2</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Day of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Day of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Day of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Day of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal].[Fiscal Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4346</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Fiscal Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Fiscal Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Fiscal Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Semester</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal].[Fiscal Semester]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Semester</LEVEL_CAPTION>
            <LEVEL_NUMBER>2</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>8</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4329</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Semester</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Fiscal Semester] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Fiscal Semester] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Fiscal Semester] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Semester</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Quarter</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal].[Fiscal Quarter]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Quarter</LEVEL_CAPTION>
            <LEVEL_NUMBER>3</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>14</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4337</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Quarter</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Fiscal Quarter] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Fiscal Quarter] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Fiscal Quarter] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Quarter</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Month</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal].[Month]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Month</LEVEL_CAPTION>
            <LEVEL_NUMBER>4</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>39</LEVEL_CARDINALITY>
            <LEVEL_TYPE>132</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Month Name</LEVEL_ORDERING_PROPERTY>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Month Name] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Month Name] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Month Name] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Month Name</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>2</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Date</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal].[Date]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Date</LEVEL_CAPTION>
            <LEVEL_NUMBER>5</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1159</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4289</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Date</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Date] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Date] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Date] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Date</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>1</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal Quarter of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Quarter of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal Quarter of Year].[Fiscal Quarter of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Quarter of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4336</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Quarter of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Fiscal Quarter of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Fiscal Quarter of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Fiscal Quarter of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Quarter of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal Semester of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Semester of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal Semester of Year].[Fiscal Semester of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Semester of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>3</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4328</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Semester of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Fiscal Semester of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Fiscal Semester of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Fiscal Semester of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Semester of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Fiscal Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Fiscal Year].[Fiscal Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Fiscal Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>5</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4346</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Fiscal Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Fiscal Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Fiscal Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Fiscal Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Fiscal Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Month of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Month of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Month of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Month of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Month of Year].[Month of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Month of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>13</LEVEL_CARDINALITY>
            <LEVEL_TYPE>0</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Month of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Month of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Month of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Month of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Month of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Week of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Week of Year].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Week of Year]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Week of Year</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Ship Date].[Week of Year].[Week of Year]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Week of Year</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>54</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4759</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Week of Year</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>17</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Ship Date].[Week of Year] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Ship Date].[Week of Year] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Ship Date].[Week of Year] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Week of Year</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Source Currency]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Source Currency].[Source Currency]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Source Currency].[Source Currency].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Source Currency]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Source Currency].[Source Currency]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Source Currency</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Source Currency].[Source Currency].[Source Currency]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Source Currency</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>106</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4177</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Source Currency</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>130</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Source Currency].[Source Currency] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Source Currency].[Source Currency] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Source Currency].[Source Currency] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Source Currency</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>2</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Source Currency]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Source Currency].[Source Currency Code]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>(All)</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Source Currency].[Source Currency Code].[(All)]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>(All)</LEVEL_CAPTION>
            <LEVEL_NUMBER>0</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>1</LEVEL_CARDINALITY>
            <LEVEL_TYPE>1</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>(All)</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Source Currency]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_UNIQUE_NAME>[Source Currency].[Source Currency Code]</HIERARCHY_UNIQUE_NAME>
            <LEVEL_NAME>Source Currency Code</LEVEL_NAME>
            <LEVEL_UNIQUE_NAME>[Source Currency].[Source Currency Code].[Source Currency Code]</LEVEL_UNIQUE_NAME>
            <LEVEL_CAPTION>Source Currency Code</LEVEL_CAPTION>
            <LEVEL_NUMBER>1</LEVEL_NUMBER>
            <LEVEL_CARDINALITY>106</LEVEL_CARDINALITY>
            <LEVEL_TYPE>4273</LEVEL_TYPE>
            <DESCRIPTION/>
            <CUSTOM_ROLLUP_SETTINGS>0</CUSTOM_ROLLUP_SETTINGS>
            <LEVEL_UNIQUE_SETTINGS>0</LEVEL_UNIQUE_SETTINGS>
            <LEVEL_IS_VISIBLE>true</LEVEL_IS_VISIBLE>
            <LEVEL_ORDERING_PROPERTY>Source Currency Code</LEVEL_ORDERING_PROPERTY>
            <LEVEL_DBTYPE>3</LEVEL_DBTYPE>
            <LEVEL_NAME_SQL_COLUMN_NAME>NAME( [$Source Currency].[Source Currency Code] )</LEVEL_NAME_SQL_COLUMN_NAME>
            <LEVEL_KEY_SQL_COLUMN_NAME>KEY( [$Source Currency].[Source Currency Code] )</LEVEL_KEY_SQL_COLUMN_NAME>
            <LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>UNIQUENAME( [$Source Currency].[Source Currency Code] )</LEVEL_UNIQUE_NAME_SQL_COLUMN_NAME>
            <LEVEL_ATTRIBUTE_HIERARCHY_NAME>Source Currency Code</LEVEL_ATTRIBUTE_HIERARCHY_NAME>
            <LEVEL_KEY_CARDINALITY>1</LEVEL_KEY_CARDINALITY>
            <LEVEL_ORIGIN>6</LEVEL_ORIGIN>
          </row>
        </root>
      </return>
    </DiscoverResponse>
  </soap:Body>
</soap:Envelope>`;
