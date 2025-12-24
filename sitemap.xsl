<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
    <xsl:output method="html" encoding="UTF-8" indent="yes" />
    
    <xsl:template match="/">
        <html lang="en">
        <head>
            <title>XML Sitemap</title>
            <style>
                body { font-family: sans-serif; padding: 20px; color: #333; max-width: 1200px; margin: 0 auto; }
                h1 { color: #1a1a1a; border-bottom: 2px solid #b8860b; padding-bottom: 10px; }
                p { font-size: 14px; color: #666; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                th, td { padding: 12px 15px; border-bottom: 1px solid #ddd; text-align: left; }
                th { background-color: #f8f9fa; font-weight: 600; color: #444; }
                tr:hover { background-color: #f1f1f1; }
                a { color: #b8860b; text-decoration: none; font-weight: 500; }
                a:hover { text-decoration: underline; color: #1a1a1a; }
            </style>
        </head>
        <body>
            <h1>XML Sitemap</h1>
            <p>This is the XML Sitemap for search engines like Google. It helps them index your content.</p>
            <table>
                <tr>
                    <th>Location (URL)</th>
                    <th>Last Modified</th>
                    <th>Priority</th>
                </tr>
                <xsl:for-each select="s:urlset/s:url">
                    <tr>
                        <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                        <td><xsl:value-of select="s:lastmod"/></td>
                        <td><xsl:value-of select="s:priority"/></td>
                    </tr>
                </xsl:for-each>
            </table>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>