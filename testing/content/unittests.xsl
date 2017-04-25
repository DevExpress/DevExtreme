<?xml version="1.0"?>

<!-- This is a modified version of $/CCNetConfig/xsl/unittests.xsl -->

<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:output method="html"/>

    <xsl:variable name="nunit2.result.list" select="//test-results"/>
    <xsl:variable name="nunit2.suite.list" select="$nunit2.result.list//test-suite"/>
    <xsl:variable name="nunit2.case.list" select="$nunit2.suite.list/results/test-case"/>
    <xsl:variable name="nunit2.case.count" select="count($nunit2.case.list)"/>
    <xsl:variable name="nunit2.time" select="sum($nunit2.result.list/test-suite[position()=1]/@time)"/>
    <xsl:variable name="nunit2.failure.list" select="$nunit2.suite.list//failure"/>
    <xsl:variable name="nunit2.failure.count" select="count($nunit2.failure.list)"/>
    <xsl:variable name="nunit2.notrun.list" select="$nunit2.suite.list//reason"/>
    <xsl:variable name="nunit2.notrun.count" select="count($nunit2.notrun.list)"/>

    <xsl:variable name="total.time" select="$nunit2.time"/>
    <xsl:variable name="total.run.count" select="$nunit2.case.count"/>
    <xsl:variable name="total.notrun.count" select="$nunit2.notrun.count"/>
    <xsl:variable name="total.failure.count" select="$nunit2.failure.count"/>

    <xsl:template match="/">
        <style>
          body, tr { color: #000000; background-color: white; font-family: Verdana; font-size: 16px; }

          .sectionheader { background-color:#006; color:#FFF; }

          .skipped-header {
            background: gold;
            color:black
          }

          .header-title { color:#000; font-weight:bold; padding-bottom:10pt; }
          .header-label { font-weight:bold; }
          .header-data { color:#000; }
          .header-data-error { color:#000; white-space:pre; }
          .section-table { margin-top:10px; }
          .section-data { color:#000; }
          .section-oddrow { background-color:#F0F7FF; }
          .section-evenrow { background-color:#FFF; }
          .section-error { color:#F30; white-space:pre; }
          .warning { color: darkorange; }
          .error { color:red }
        </style>

        <xsl:if test="$total.run.count > 0">
            <table class="section-table" cellpadding="2" cellspacing="0" border="0" width="98%">
                <tr>
                    <td class="sectionheader" colspan="2">
                        Tests run: <xsl:value-of select="$total.run.count"/>, 
                        Failures: <xsl:value-of select="$total.failure.count"/>,
                        Skipped: <xsl:value-of select="$total.notrun.count"/>,
                        Time: <xsl:value-of select="$total.time"/> seconds
                    </td>
                </tr>

                <xsl:choose>
                    <xsl:when test="$total.run.count = 0">
                        <tr><td colspan="2" class="section-data">No Tests Run</td></tr>
                        <tr><td colspan="2" class="section-error">This project doesn't have any tests</td></tr>
                    </xsl:when>

                    <xsl:when test="$total.failure.count = 0">
                        <tr><td colspan="2" class="section-data" style="background: lime">All Tests Passed</td></tr>
                    </xsl:when>
                </xsl:choose>

                <xsl:apply-templates select="$nunit2.failure.list"/>

                <tr><td colspan="2"> </td></tr>

                <xsl:if test="$total.failure.count > 0">
                    <tr>
                        <td class="sectionheader" colspan="2" style="background: red">
                            Failures (<xsl:value-of select="$total.failure.count"/>)
                        </td>
                    </tr>

                    <xsl:call-template name="nunit2testdetail">
                        <xsl:with-param name="detailnodes" select="//test-suite/results/test-case[.//failure]"/>
                    </xsl:call-template>

                    <tr><td colspan="2"><hr /></td></tr>
                </xsl:if>


              <xsl:if test="$total.notrun.count > 0">
                <tr>
                  <td class="sectionheader skipped-header" colspan="2">
                    Skipped tests (<xsl:value-of select="$total.notrun.count"/>)
                  </td>
                </tr>
                
                <xsl:call-template name="nunit2testdetail">
                  <xsl:with-param name="detailnodes" select="//test-suite/results/test-case[.//reason]"/>
                </xsl:call-template>

                <tr>
                  <td colspan="2">
                    <hr />
                  </td>
                </tr>
              </xsl:if>


              <xsl:for-each select="$nunit2.suite.list">
                    <xsl:sort select="@time" data-type="number" order="descending"/>
                    <xsl:if test="not(@name = 'Root suite')">
                        <tr style="color: silver">
                            <td>
                                <xsl:value-of select="@name"/>
                            </td>
                            <td>
                                <xsl:value-of select="@time"/> (<xsl:value-of select="@pure-time"/>) seconds
                            </td>
                        </tr>
                    </xsl:if>
                </xsl:for-each>
            </table>
        </xsl:if>
    </xsl:template>

    <xsl:template match="failure">
        <tr>
            <xsl:if test="($nunit2.failure.count + position()) mod 2 = 0">
                <xsl:attribute name="class">section-oddrow</xsl:attribute>
            </xsl:if>
            <td class="section-data">Failure</td>
            <td class="section-data"><xsl:value-of select="../@name"/></td>
        </tr>
    </xsl:template>
    
    <xsl:template name="nunit2testdetail">        
        <xsl:param name="detailnodes"/>

        <xsl:for-each select="$detailnodes">
           
            <xsl:if test="failure">
                <tr>
                    <td colspan="2"><hr /></td>
                </tr>

                <tr>
                    <td class="section-data">Test:</td>
                    <td class="section-data">
                        <xsl:element name="a">
                            <xsl:attribute name="target">_blank</xsl:attribute>
                            <xsl:attribute name="href"><xsl:value-of select="@url"/></xsl:attribute>
                            <xsl:value-of select="@name"/>
                        </xsl:element>
                    </td>
                </tr>
                <tr>
                    <td class="section-data" valign="top">Message:</td>
                    <td class="section-data">
                        <pre><xsl:value-of select="failure//message"/></pre>
                    </td>
                </tr>
            </xsl:if>

          <xsl:if test="reason">
            <tr>
              <td colspan="2">
                <hr />
              </td>
            </tr>

            <tr>
              <td class="section-data">Skipped Test:</td>
              <td class="section-data">
                <xsl:element name="a">
                  <xsl:attribute name="target">_blank</xsl:attribute>
                  <xsl:attribute name="href">
                    <xsl:value-of select="@url"/>
                  </xsl:attribute>
                  <xsl:value-of select="@name"/>
                </xsl:element>
              </td>
            </tr>
            <tr>
              <td class="section-data" valign="top">Reason:</td>
              <td class="section-data">
                <pre>
                  <xsl:value-of select="reason//message"/>
                </pre>
              </td>
            </tr>
          </xsl:if>

        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>