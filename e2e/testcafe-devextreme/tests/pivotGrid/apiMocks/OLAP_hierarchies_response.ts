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
                <xsd:element sql:field="HIERARCHY_NAME" name="HIERARCHY_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="HIERARCHY_UNIQUE_NAME" name="HIERARCHY_UNIQUE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="HIERARCHY_GUID" name="HIERARCHY_GUID" type="uuid" minOccurs="0"/>
                <xsd:element sql:field="HIERARCHY_CAPTION" name="HIERARCHY_CAPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_TYPE" name="DIMENSION_TYPE" type="xsd:short" minOccurs="0"/>
                <xsd:element sql:field="HIERARCHY_CARDINALITY" name="HIERARCHY_CARDINALITY" type="xsd:unsignedInt" minOccurs="0"/>
                <xsd:element sql:field="DEFAULT_MEMBER" name="DEFAULT_MEMBER" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="ALL_MEMBER" name="ALL_MEMBER" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DESCRIPTION" name="DESCRIPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="STRUCTURE" name="STRUCTURE" type="xsd:short" minOccurs="0"/>
                <xsd:element sql:field="IS_VIRTUAL" name="IS_VIRTUAL" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="IS_READWRITE" name="IS_READWRITE" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_UNIQUE_SETTINGS" name="DIMENSION_UNIQUE_SETTINGS" type="xsd:int" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_MASTER_UNIQUE_NAME" name="DIMENSION_MASTER_UNIQUE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_IS_VISIBLE" name="DIMENSION_IS_VISIBLE" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="HIERARCHY_ORDINAL" name="HIERARCHY_ORDINAL" type="xsd:unsignedInt" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_IS_SHARED" name="DIMENSION_IS_SHARED" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="HIERARCHY_IS_VISIBLE" name="HIERARCHY_IS_VISIBLE" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="HIERARCHY_ORIGIN" name="HIERARCHY_ORIGIN" type="xsd:unsignedShort" minOccurs="0"/>
                <xsd:element sql:field="HIERARCHY_DISPLAY_FOLDER" name="HIERARCHY_DISPLAY_FOLDER" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="INSTANCE_SELECTION" name="INSTANCE_SELECTION" type="xsd:unsignedShort" minOccurs="0"/>
                <xsd:element sql:field="GROUPING_BEHAVIOR" name="GROUPING_BEHAVIOR" type="xsd:unsignedShort" minOccurs="0"/>
                <xsd:element sql:field="STRUCTURE_TYPE" name="STRUCTURE_TYPE" type="xsd:string" minOccurs="0"/>
              </xsd:sequence>
            </xsd:complexType>
          </xsd:schema>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Address</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Address]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Address</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>12799</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Address].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Address].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>81</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Location</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>City</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[City]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>City</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>589</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[City].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[City].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>67</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Location</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>3</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Commute Distance</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Commute Distance]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Commute Distance</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Commute Distance].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Commute Distance].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>80</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Country</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Country]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Country</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>8</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Country].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Country].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>65</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Location</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Customer</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Customer</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>18486</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Customer].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Customer].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>63</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Contacts</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Customer Geography</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Customer Geography]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Customer Geography</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>19800</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Customer Geography].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Customer Geography].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>1</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>62</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Date of First Purchase</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Date of First Purchase]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date of First Purchase</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1126</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Date of First Purchase].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Date of First Purchase].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>68</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Other</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Education</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Education]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Education</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Education].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Education].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>75</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Email Address</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Email Address]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Email Address</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>18486</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Email Address].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Email Address].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>70</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Contacts</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Gender</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Gender]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Gender</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Gender].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Gender].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>78</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Home Owner</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Home Owner]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Home Owner</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Home Owner].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Home Owner].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>79</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Marital Status</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Marital Status]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Marital Status</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Marital Status].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Marital Status].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>77</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Number of Cars Owned</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Number of Cars Owned]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Number of Cars Owned</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Number of Cars Owned].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Number of Cars Owned].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>73</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Number of Children At Home</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Number of Children At Home]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Number of Children At Home</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>8</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Number of Children At Home].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Number of Children At Home].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>74</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Occupation</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Occupation]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Occupation</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Occupation].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Occupation].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>76</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Phone</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Phone]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Phone</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>8892</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Phone].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Phone].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>69</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Contacts</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Postal Code</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Postal Code]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Postal Code</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>648</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Postal Code].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Postal Code].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>64</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Location</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>3</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>State-Province</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[State-Province]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>State-Province</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>73</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[State-Province].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[State-Province].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>66</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Location</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Total Children</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Total Children]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Total Children</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>8</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Total Children].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Total Children].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>72</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Yearly Income</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Customer].[Yearly Income]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Yearly Income</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Customer].[Yearly Income].[All Customers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Customer].[Yearly Income].[All Customers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>71</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Calendar</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1226</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Calendar].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Calendar].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>3</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar Quarter of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Calendar Quarter of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Calendar Quarter of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Calendar Quarter of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>20</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar Semester of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Calendar Semester of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Calendar Semester of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Calendar Semester of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>18</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Calendar Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Calendar Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Calendar Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Calendar Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>16</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1160</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Date].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Date].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>5</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>3</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day Name</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day Name]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Day Name</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Day Name].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Day Name].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>11</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day of Month</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day of Month]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Day of Month</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>33</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Day of Month].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Day of Month].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>12</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day of Week</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day of Week]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Day of Week</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Day of Week].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Day of Week].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>10</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Day of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Day of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>367</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Day of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Day of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>13</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Fiscal</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1226</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Fiscal].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Fiscal].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>2</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal Quarter of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Fiscal Quarter of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Fiscal Quarter of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Fiscal Quarter of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>19</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal Semester of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Fiscal Semester of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Fiscal Semester of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Fiscal Semester of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>17</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Fiscal Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Fiscal Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Fiscal Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Fiscal Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>4</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Month of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Month of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Month of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>14</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Month of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Month of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>21</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Week of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Date].[Week of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Date.Week of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>55</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Date].[Week of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Date].[Week of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>14</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Calendar</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1226</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Calendar].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Calendar].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>43</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar Quarter of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Calendar Quarter of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Calendar Quarter of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Calendar Quarter of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>60</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar Semester of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Calendar Semester of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Calendar Semester of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Calendar Semester of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>58</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Calendar Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Calendar Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Calendar Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Calendar Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>56</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1160</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Date].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Date].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>45</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>3</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day Name</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day Name]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Day Name</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Day Name].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Day Name].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>51</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day of Month</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day of Month]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Day of Month</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>33</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Day of Month].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Day of Month].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>52</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day of Week</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day of Week]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Day of Week</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Day of Week].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Day of Week].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>50</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Day of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Day of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>367</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Day of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Day of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>53</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Fiscal</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1226</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Fiscal].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Fiscal].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>42</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal Quarter of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Fiscal Quarter of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Fiscal Quarter of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Fiscal Quarter of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>59</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal Semester of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Fiscal Semester of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Fiscal Semester of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Fiscal Semester of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>57</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Fiscal Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Fiscal Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Fiscal Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Fiscal Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>44</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Month of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Month of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Month of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>14</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Month of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Month of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>61</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Week of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Delivery Date].[Week of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Delivery Date.Week of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>55</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Delivery Date].[Week of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Delivery Date].[Week of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>54</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Base Rate</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Base Rate]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Base Rate</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Base Rate].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Base Rate].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>118</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Birth Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Birth Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Birth Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>281</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Birth Date].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Birth Date].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>116</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Department Name</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Department Name]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Department Name</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>18</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Department Name].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Department Name].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>111</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Organization</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Email Address</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Email Address]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Email Address</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>292</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Email Address].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Email Address].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>119</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Contacts</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Emergency Contact Name</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Emergency Contact Name]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Emergency Contact Name</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>292</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Emergency Contact Name].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Emergency Contact Name].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>123</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Contacts</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Emergency Contact Phone</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Emergency Contact Phone]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Emergency Contact Phone</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>290</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Emergency Contact Phone].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Emergency Contact Phone].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>124</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Contacts</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Employee</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employee]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Employee</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>298</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Employee].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Employee].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>110</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Employee Department</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employee Department]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Employee Department</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>383</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Employee Department].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Employee Department].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>109</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Unnatural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Employees</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Employees]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Employees</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>345</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Employees].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Employees].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>2</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>128</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>3</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>End Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[End Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>End Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[End Date].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[End Date].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>131</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>History</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Gender</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Gender]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Gender</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Gender].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Gender].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>125</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Hire Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Hire Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Hire Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>166</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Hire Date].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Hire Date].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>114</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>History</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Hire Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Hire Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Hire Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>10</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Hire Year].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Hire Year].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>132</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>History</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Marital Status</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Marital Status]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Marital Status</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Marital Status].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Marital Status].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>126</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Demographic</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Pay Frequency</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Pay Frequency]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Pay Frequency</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Pay Frequency].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Pay Frequency].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>120</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Organization</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Phone</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Phone]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Phone</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>290</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Phone].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Phone].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>121</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Contacts</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Salaried Flag</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Salaried Flag]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Salaried Flag</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Salaried Flag].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Salaried Flag].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>122</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Organization</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Person Flag</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Sales Person Flag]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Person Flag</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Sales Person Flag].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Sales Person Flag].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>112</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Organization</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sick Leave Hours</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Sick Leave Hours]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sick Leave Hours</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Sick Leave Hours].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Sick Leave Hours].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>115</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Organization</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Start Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Start Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Start Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>172</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Start Date].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Start Date].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>130</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>History</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Status</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Status]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Status</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Status].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Status].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>129</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Organization</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Title</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Title]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Title</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>69</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Title].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Title].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>113</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Organization</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Vacation Hours</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Employee].[Vacation Hours]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Vacation Hours</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Employee].[Vacation Hours].[All Employees]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Employee].[Vacation Hours].[All Employees]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>117</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Organization</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>City</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[City]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>City</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>17</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>589</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Geography].[City].[All Geographies]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Geography].[City].[All Geographies]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>104</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>3</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Country</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Country]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Country</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>17</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>8</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Geography].[Country].[All Geographies]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Geography].[Country].[All Geographies]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>106</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Geography</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Geography]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Geography</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>17</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1315</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Geography].[Geography].[All Geographies]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Geography].[Geography].[All Geographies]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>1</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>103</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Postal Code</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[Postal Code]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Postal Code</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>17</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>648</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Geography].[Postal Code].[All Geographies]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Geography].[Postal Code].[All Geographies]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>107</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>3</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>State-Province</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Geography].[State-Province]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>State-Province</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>17</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>73</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Geography].[State-Province].[All Geographies]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Geography].[State-Province].[All Geographies]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>105</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Carrier Tracking Number</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Carrier Tracking Number]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Carrier Tracking Number</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>3</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Internet Sales Order Details].[Carrier Tracking Number].[All Internet Sales Orders]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Internet Sales Order Details].[Carrier Tracking Number].[All Internet Sales Orders]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>186</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Customer PO Number</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Customer PO Number]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Customer PO Number</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>3</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Internet Sales Order Details].[Customer PO Number].[All Internet Sales Orders]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Internet Sales Order Details].[Customer PO Number].[All Internet Sales Orders]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>187</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Internet Sales Orders</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Internet Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Internet Sales Orders</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>88060</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Internet Sales Order Details].[Internet Sales Orders].[All]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Internet Sales Order Details].[Internet Sales Orders].[All]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>184</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Order Line</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Line]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Order Line</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>10</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Internet Sales Order Details].[Sales Order Line].[All Internet Sales Orders]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Internet Sales Order Details].[Sales Order Line].[All Internet Sales Orders]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>189</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Order Number</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Internet Sales Order Details].[Sales Order Number]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Order Number</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>27661</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Internet Sales Order Details].[Sales Order Number].[All Internet Sales Orders]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Internet Sales Order Details].[Sales Order Number].[All Internet Sales Orders]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>188</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Measures]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Measures</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Measures]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Measures</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>2</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>35</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Measures].[Reseller Sales Amount]</DEFAULT_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>1</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>0</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Category</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Category]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Category</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Category].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Category].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>149</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Class</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Class]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Class</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Class].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Class].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>159</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Color</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Color]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Color</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>12</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Color].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Color].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>150</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Days to Manufacture</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Days to Manufacture]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Days to Manufacture</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Days to Manufacture].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Days to Manufacture].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>157</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Dealer Price</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Dealer Price]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Dealer Price</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>123</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Dealer Price].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Dealer Price].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>158</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Financial</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>End Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[End Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>End Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>5</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[End Date].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[End Date].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>166</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>History</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Large Photo</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Large Photo]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Large Photo</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>506</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Large Photo].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Large Photo].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>168</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>List Price</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[List Price]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>List Price</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>123</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[List Price].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[List Price].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>153</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Financial</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Manufacture Time</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Manufacture Time]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Manufacture Time</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>44</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Manufacture Time].[All]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Manufacture Time].[All]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>144</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Unnatural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Model Name</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Model Name]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Model Name</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>122</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Model Name].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Model Name].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>161</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Product</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Product</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>608</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Product].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Product].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>147</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Product Categories</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Categories]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Product Categories</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>651</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Product Categories].[All]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Product Categories].[All]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>143</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Product Key</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Key]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Product Key</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>506</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Product Key].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Product Key].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>167</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Product Line</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Line]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Product Line</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Product Line].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Product Line].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>162</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Product Model Categories</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Model Categories]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Product Model Categories</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>165</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Product Model Categories].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Product Model Categories].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>142</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Product Model Lines</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Product Model Lines]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Product Model Lines</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>128</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Product Model Lines].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Product Model Lines].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>145</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Reorder Point</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Reorder Point]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Reorder Point</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>8</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Reorder Point].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Reorder Point].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>152</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Safety Stock Level</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Safety Stock Level]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Safety Stock Level</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>8</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Safety Stock Level].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Safety Stock Level].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>151</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Size</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Size]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Size</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>21</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Size].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Size].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>154</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Size Range</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Size Range]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Size Range</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>13</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Size Range].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Size Range].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>155</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Standard Cost</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Standard Cost]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Standard Cost</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>137</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Standard Cost].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Standard Cost].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>148</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Financial</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Start Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Start Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Start Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Start Date].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Start Date].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>165</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>History</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Status</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Status]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Status</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Status].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Status].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>164</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>History</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Stock Level</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Stock Level]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Stock Level</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>615</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Stock Level].[All]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Stock Level].[All]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>146</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Style</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Style]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Style</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Style].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Style].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>160</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Subcategory</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Subcategory]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Subcategory</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>39</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Subcategory].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Subcategory].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>163</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Weight</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Product].[Weight]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Weight</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>130</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Product].[Weight].[All Products]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Product].[Weight].[All Products]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>156</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Stocking</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Discount Percent</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Discount Percent]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Discount Percent</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>12</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Promotion].[Discount Percent].[All Promotions]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Promotion].[Discount Percent].[All Promotions]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>135</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>End Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[End Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>End Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>12</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Promotion].[End Date].[All Promotions]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Promotion].[End Date].[All Promotions]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>140</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Max Quantity</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Max Quantity]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Max Quantity</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Promotion].[Max Quantity].[All Promotions]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Promotion].[Max Quantity].[All Promotions]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>136</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>0</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Min Quantity</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Min Quantity]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Min Quantity</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>8</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Promotion].[Min Quantity].[All Promotions]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Promotion].[Min Quantity].[All Promotions]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>138</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Promotion</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotion]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Promotion</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>18</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Promotion].[Promotion].[All Promotions]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Promotion].[Promotion].[All Promotions]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>134</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Promotion Category</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotion Category]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Promotion Category</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>5</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Promotion].[Promotion Category].[All Promotions]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Promotion].[Promotion Category].[All Promotions]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>139</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Promotion Type</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotion Type]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Promotion Type</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>8</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Promotion].[Promotion Type].[All Promotions]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Promotion].[Promotion Type].[All Promotions]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>137</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Promotions</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Promotions]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Promotions</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>29</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Promotion].[Promotions].[All Promotions]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Promotion].[Promotions].[All Promotions]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>1</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>133</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Unnatural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Start Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Promotion].[Start Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Start Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>10</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Promotion].[Start Date].[All Promotions]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Promotion].[Start Date].[All Promotions]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>141</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Address</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Address]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Address</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>689</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Address].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Address].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>102</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>3</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Annual Revenue</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Annual Revenue]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Annual Revenue</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Annual Revenue].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Annual Revenue].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>95</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Sales Data</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Annual Sales</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Annual Sales]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Annual Sales</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Annual Sales].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Annual Sales].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>94</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Sales Data</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Bank Name</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Bank Name]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Bank Name</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Bank Name].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Bank Name].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>96</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Business Type</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Business Type]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Business Type</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>5</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Business Type].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Business Type].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>90</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>First Order Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[First Order Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>First Order Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[First Order Year].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[First Order Year].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>91</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Last Order Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Last Order Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Last Order Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>7</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Last Order Year].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Last Order Year].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>89</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Min Payment Amount</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Min Payment Amount]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Min Payment Amount</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Min Payment Amount].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Min Payment Amount].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>97</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Min Payment Type</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Min Payment Type]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Min Payment Type</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Min Payment Type].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Min Payment Type].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>98</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Number of Employees</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Number of Employees]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Number of Employees</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Number of Employees].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Number of Employees].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>92</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Order Frequency</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Order Frequency]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Order Frequency</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>5</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Order Frequency].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Order Frequency].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>99</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Order Month</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Order Month]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Order Month</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>15</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Order Month].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Order Month].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>100</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Phone</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Phone]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Phone</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>612</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Phone].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Phone].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>88</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>3</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Product Line</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Product Line]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Product Line</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>5</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Product Line].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Product Line].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>87</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Reseller</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Reseller</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>703</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Reseller].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Reseller].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>86</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Reseller Bank</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Bank]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Reseller Bank</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>711</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Reseller Bank].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Reseller Bank].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>83</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Reseller Order Frequency</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Order Frequency]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Reseller Order Frequency</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>707</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Reseller Order Frequency].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Reseller Order Frequency].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>84</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Reseller Order Month</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Order Month]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Reseller Order Month</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>717</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Reseller Order Month].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Reseller Order Month].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>85</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Order Data</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Reseller Type</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Reseller Type]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Reseller Type</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>707</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Reseller Type].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Reseller Type].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>82</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Year Opened</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller].[Year Opened]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Year Opened</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>34</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller].[Year Opened].[All Resellers]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller].[Year Opened].[All Resellers]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>93</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Carrier Tracking Number</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Carrier Tracking Number]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Carrier Tracking Number</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>3798</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller Sales Order Details].[Carrier Tracking Number].[All Reseller Sales Orders]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller Sales Order Details].[Carrier Tracking Number].[All Reseller Sales Orders]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>192</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Customer PO Number</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Customer PO Number]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Customer PO Number</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>3798</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller Sales Order Details].[Customer PO Number].[All Reseller Sales Orders]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller Sales Order Details].[Customer PO Number].[All Reseller Sales Orders]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>193</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Reseller Sales Orders</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Reseller Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Reseller Sales Orders</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>64654</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller Sales Order Details].[Reseller Sales Orders].[All]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller Sales Order Details].[Reseller Sales Orders].[All]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>190</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Order Line</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Line]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Order Line</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>74</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller Sales Order Details].[Sales Order Line].[All Reseller Sales Orders]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller Sales Order Details].[Sales Order Line].[All Reseller Sales Orders]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>195</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Order Number</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Reseller Sales Order Details].[Sales Order Number]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Order Number</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>3798</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Reseller Sales Order Details].[Sales Order Number].[All Reseller Sales Orders]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Reseller Sales Order Details].[Sales Order Number].[All Reseller Sales Orders]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>194</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Channel]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Channel</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Channel].[Sales Channel]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Channel</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Channel].[Sales Channel].[All Sales Channels]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Channel].[Sales Channel].[All Sales Channels]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>196</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Reason</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reason]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Reason</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>12</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Reason].[Sales Reason].[All Sales Reasons]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Reason].[Sales Reason].[All Sales Reasons]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>176</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Reason Type</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reason Type]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Reason Type</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>5</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Reason].[Sales Reason Type].[All Sales Reasons]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Reason].[Sales Reason Type].[All Sales Reasons]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>177</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Reasons</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Reason].[Sales Reasons]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Reasons</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>16</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Reason].[Sales Reasons].[All Sales Reasons]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Reason].[Sales Reasons].[All Sales Reasons]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>175</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Carrier Tracking Number</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Carrier Tracking Number]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Carrier Tracking Number</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>3799</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Summary Order Details].[Carrier Tracking Number].[All Sales Order Details]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Summary Order Details].[Carrier Tracking Number].[All Sales Order Details]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>180</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Customer PO Number</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Customer PO Number]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Customer PO Number</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>484</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Summary Order Details].[Customer PO Number].[All Sales Order Details]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Summary Order Details].[Customer PO Number].[All Sales Order Details]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>181</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Order Line</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Line]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Order Line</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>63</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Summary Order Details].[Sales Order Line].[All Sales Order Details]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Summary Order Details].[Sales Order Line].[All Sales Order Details]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>183</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Order Number</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Order Number]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Order Number</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>31457</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Summary Order Details].[Sales Order Number].[All Sales Order Details]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Summary Order Details].[Sales Order Number].[All Sales Order Details]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>182</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>4</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Orders</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Summary Order Details].[Sales Orders]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Orders</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>31519</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Summary Order Details].[Sales Orders].[All]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Summary Order Details].[Sales Orders].[All]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>178</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Unnatural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Territory</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Territory</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>26</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Territory].[Sales Territory].[All Sales Territories]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Territory].[Sales Territory].[All Sales Territories]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>1</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>169</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Territory Country</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory Country]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Territory Country</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Territory].[Sales Territory Country].[All Sales Territories]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Territory].[Sales Territory Country].[All Sales Territories]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>171</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Territory Group</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory Group]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Territory Group</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Territory].[Sales Territory Group].[All Sales Territories]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Territory].[Sales Territory Group].[All Sales Territories]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>172</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Sales Territory Region</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Sales Territory].[Sales Territory Region]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Sales Territory Region</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>13</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Sales Territory].[Sales Territory Region].[All Sales Territories]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Sales Territory].[Sales Territory Region].[All Sales Territories]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>170</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Calendar</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1226</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Calendar].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Calendar].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>23</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar Quarter of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Calendar Quarter of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Calendar Quarter of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Calendar Quarter of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>40</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar Semester of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Calendar Semester of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Calendar Semester of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Calendar Semester of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>38</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Calendar Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Calendar Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Calendar Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Calendar Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Calendar Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>36</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Calendar</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Date</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Date]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Date</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1160</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Date].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Date].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>25</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>3</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day Name</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day Name]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Day Name</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Day Name].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Day Name].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>31</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day of Month</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day of Month]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Day of Month</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>33</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Day of Month].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Day of Month].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>32</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day of Week</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day of Week]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Day of Week</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>9</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Day of Week].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Day of Week].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>30</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Day of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Day of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Day of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>367</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Day of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Day of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>33</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>2</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Fiscal</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>1226</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Fiscal].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Fiscal].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>22</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>1</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal Quarter of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal Quarter of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Fiscal Quarter of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Fiscal Quarter of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Fiscal Quarter of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>39</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal Semester of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal Semester of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Fiscal Semester of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>4</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Fiscal Semester of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Fiscal Semester of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>37</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Fiscal Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Fiscal Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Fiscal Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>6</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Fiscal Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Fiscal Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>24</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER>Fiscal</HIERARCHY_DISPLAY_FOLDER>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Month of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Month of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Month of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>14</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Month of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Month of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>41</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Week of Year</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Ship Date].[Week of Year]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Ship Date.Week of Year</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>55</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Ship Date].[Week of Year].[All Periods]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Ship Date].[Week of Year].[All Periods]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>34</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>1</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Source Currency]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Source Currency</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Source Currency].[Source Currency]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Source Currency</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>11</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>107</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Source Currency].[Source Currency].[All Source Currencies]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Source Currency].[Source Currency].[All Source Currencies]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>174</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>2</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_UNIQUE_NAME>[Source Currency]</DIMENSION_UNIQUE_NAME>
            <HIERARCHY_NAME>Source Currency Code</HIERARCHY_NAME>
            <HIERARCHY_UNIQUE_NAME>[Source Currency].[Source Currency Code]</HIERARCHY_UNIQUE_NAME>
            <HIERARCHY_CAPTION>Source Currency Code</HIERARCHY_CAPTION>
            <DIMENSION_TYPE>11</DIMENSION_TYPE>
            <HIERARCHY_CARDINALITY>107</HIERARCHY_CARDINALITY>
            <DEFAULT_MEMBER>[Source Currency].[Source Currency Code].[All Source Currencies]</DEFAULT_MEMBER>
            <ALL_MEMBER>[Source Currency].[Source Currency Code].[All Source Currencies]</ALL_MEMBER>
            <DESCRIPTION/>
            <STRUCTURE>0</STRUCTURE>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
            <HIERARCHY_ORDINAL>173</HIERARCHY_ORDINAL>
            <DIMENSION_IS_SHARED>true</DIMENSION_IS_SHARED>
            <HIERARCHY_IS_VISIBLE>true</HIERARCHY_IS_VISIBLE>
            <HIERARCHY_ORIGIN>6</HIERARCHY_ORIGIN>
            <HIERARCHY_DISPLAY_FOLDER/>
            <INSTANCE_SELECTION>1</INSTANCE_SELECTION>
            <GROUPING_BEHAVIOR>2</GROUPING_BEHAVIOR>
            <STRUCTURE_TYPE>Natural</STRUCTURE_TYPE>
          </row>
        </root>
      </return>
    </DiscoverResponse>
  </soap:Body>
</soap:Envelope>`;
