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
                <xsd:element sql:field="DIMENSION_NAME" name="DIMENSION_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_UNIQUE_NAME" name="DIMENSION_UNIQUE_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_GUID" name="DIMENSION_GUID" type="uuid" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_CAPTION" name="DIMENSION_CAPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_ORDINAL" name="DIMENSION_ORDINAL" type="xsd:unsignedInt" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_TYPE" name="DIMENSION_TYPE" type="xsd:short" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_CARDINALITY" name="DIMENSION_CARDINALITY" type="xsd:unsignedInt" minOccurs="0"/>
                <xsd:element sql:field="DEFAULT_HIERARCHY" name="DEFAULT_HIERARCHY" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DESCRIPTION" name="DESCRIPTION" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="IS_VIRTUAL" name="IS_VIRTUAL" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="IS_READWRITE" name="IS_READWRITE" type="xsd:boolean" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_UNIQUE_SETTINGS" name="DIMENSION_UNIQUE_SETTINGS" type="xsd:int" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_MASTER_NAME" name="DIMENSION_MASTER_NAME" type="xsd:string" minOccurs="0"/>
                <xsd:element sql:field="DIMENSION_IS_VISIBLE" name="DIMENSION_IS_VISIBLE" type="xsd:boolean" minOccurs="0"/>
              </xsd:sequence>
            </xsd:complexType>
          </xsd:schema>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Customer</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Customer]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Customer</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>5</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>7</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>18485</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Customer].[Customer Geography]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Customer</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Date</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Date]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Date</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>2</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>1159</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Date].[Fiscal]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Date</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Delivery Date</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Delivery Date]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Delivery Date</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>4</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>1159</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Delivery Date].[Fiscal]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Date</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Employee</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Employee]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Employee</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>8</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>297</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Employee].[Employee Department]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Employee</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Geography</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Geography]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Geography</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>7</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>17</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>656</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Geography].[Geography]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Geography</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Internet Sales Order Details</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Internet Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Internet Sales Order Details</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>15</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>60399</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Internet Sales Order Details].[Internet Sales Orders]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Internet Sales Order Details</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Measures</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Measures]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Measures</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>1</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>2</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>35</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Measures]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Measures</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Product</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Product]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Product</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>10</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>8</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>607</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Product].[Product Model Categories]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Product</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Promotion</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Promotion]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Promotion</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>9</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>14</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>17</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Promotion].[Promotions]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Promotion</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Reseller</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Reseller</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>6</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>13</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>702</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Reseller].[Reseller Type]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Reseller</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Reseller Sales Order Details</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Reseller Sales Order Details]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Reseller Sales Order Details</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>16</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>60856</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Reseller Sales Order Details].[Reseller Sales Orders]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Reseller Sales Order Details</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Sales Channel</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Channel]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Sales Channel</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>17</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>3</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Sales Channel].[Sales Channel]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Sales Channel</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Sales Reason</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Reason]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Sales Reason</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>13</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>11</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Sales Reason].[Sales Reasons]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Sales Reason</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Sales Summary Order Details</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Summary Order Details]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Sales Summary Order Details</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>14</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>7547</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Sales Summary Order Details].[Sales Orders]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Sales Summary Order Details</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Sales Territory</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Sales Territory]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Sales Territory</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>11</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>3</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>12</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Sales Territory].[Sales Territory]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Sales Territory</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Ship Date</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Ship Date]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Ship Date</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>3</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>1</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>1159</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Ship Date].[Fiscal]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Date</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
          <row>
            <CATALOG_NAME>Adventure Works DW Standard Edition</CATALOG_NAME>
            <CUBE_NAME>Adventure Works</CUBE_NAME>
            <DIMENSION_NAME>Source Currency</DIMENSION_NAME>
            <DIMENSION_UNIQUE_NAME>[Source Currency]</DIMENSION_UNIQUE_NAME>
            <DIMENSION_CAPTION>Source Currency</DIMENSION_CAPTION>
            <DIMENSION_ORDINAL>12</DIMENSION_ORDINAL>
            <DIMENSION_TYPE>11</DIMENSION_TYPE>
            <DIMENSION_CARDINALITY>106</DIMENSION_CARDINALITY>
            <DEFAULT_HIERARCHY>[Source Currency].[Source Currency]</DEFAULT_HIERARCHY>
            <DESCRIPTION/>
            <IS_VIRTUAL>false</IS_VIRTUAL>
            <IS_READWRITE>false</IS_READWRITE>
            <DIMENSION_UNIQUE_SETTINGS>1</DIMENSION_UNIQUE_SETTINGS>
            <DIMENSION_MASTER_NAME>Source Currency</DIMENSION_MASTER_NAME>
            <DIMENSION_IS_VISIBLE>true</DIMENSION_IS_VISIBLE>
          </row>
        </root>
      </return>
    </DiscoverResponse>
  </soap:Body>
</soap:Envelope>`;
