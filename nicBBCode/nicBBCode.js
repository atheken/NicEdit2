/**
 * nicBBCode
 * @description: Allows nicEdit to create BBCode for use in forums and other applications
 * @requires: nicCore, nicXHTML
 * @author: Brian Kirchoff
 * @version: 0.9.0
 */
var nicBBCode = bkClass.extend({
	construct : function(nicEditor) {
		this.ne = nicEditor;
		if(this.ne.options.bbCode) {
			nicEditor.addEvent('get',this.bbGet.closure(this));
			nicEditor.addEvent('set',this.bbSet.closure(this));
			
			var loadedPlugins = this.ne.loadedPlugins;
			for(itm in loadedPlugins) {
				if(loadedPlugins[itm].toXHTML) {
					this.xhtml = loadedPlugins[itm];
				}
			}
		}
	},
	
	bbGet : function(ni) {
		var xhtml = this.xhtml.toXHTML(ni.getElm());
		ni.content = this.toBBCode(xhtml);
	},
	
	bbSet : function(ni) {
		ni.content = this.fromBBCode(ni.content);
	},
	
	toBBCode : function(xhtml) {
		function rp(r,m) {
			xhtml = xhtml.replace(r,m);
		}
		
		rp(/\n/gi,"");
		rp(/<strong>(.*?)<\/strong>/gi,"[b]$1[/b]");
		rp(/<em>(.*?)<\/em>/gi,"[i]$1[/i]");
		rp(/<span.*?style="text-decoration:underline;">(.*?)<\/span>/gi,"[u]$1[/u]");
		rp(/<ul>(.*?)<\/ul>/gi,"[list]$1[/list]");
		rp(/<li>(.*?)<\/li>/gi,"[*]$1[/*]");
		rp(/<ol>(.*?)<\/ol>/gi,"[list=1]$1[/list]");
		rp(/<img.*?src="(.*?)".*?>/gi,"[img]$1[/img]");
		rp(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi,"[url=$1]$2[/url]");
		rp(/<br.*?>/gi,"\n");
		rp(/<.*?>.*?<\/.*?>/gi,"");
		
		return xhtml;
	},
	
	fromBBCode : function(bbCode) {
		function rp(r,m) {
			bbCode = bbCode.replace(r,m);
		}		
		
		rp(/\[b\](.*?)\[\/b\]/gi,"<strong>$1</strong>");
		rp(/\[i\](.*?)\[\/i\]/gi,"<em>$1</em>");
		rp(/\[u\](.*?)\[\/u\]/gi,"<span style=\"text-decoration:underline;\">$1</span>");
		rp(/\[list\](.*?)\[\/list\]/gi,"<ul>$1</ul>");
		rp(/\[list=1\](.*?)\[\/list\]/gi,"<ol>$1</ol>");
		rp(/\[\*\](.*?)\[\/\*\]/gi,"<li>$1</li>");
		rp(/\[img\](.*?)\[\/img\]/gi,"<img src=\"$1\" />");
		rp(/\[url=(.*?)\](.*?)\[\/url\]/gi,"<a href=\"$1\">$2</a>");
		rp(/\n/gi,"<br />");
		//rp(/\[.*?\](.*?)\[\/.*?\]/gi,"$1");
		
		return bbCode;
	}

	
});
nicEditors.registerPlugin(nicBBCode);