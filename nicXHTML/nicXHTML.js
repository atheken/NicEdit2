/**
 * @title: nicXHTML
 * @description:  Cleans code produced to be XHTML compliant (Experimental)
 * @requires: nicCore
 * @author: Brian Kirchoff
 * @version: 0.9.0
 */
var nicXHTML = bkClass.extend({
	stripAttributes : ['_moz_dirty','_moz_resizing','_extended'],
	noShort : ['style','title','script','textarea','a'],
	cssReplace : {'font-weight:bold;' : 'strong', 'font-style:italic;' : 'em'},
	sizes : {1 : 'xx-small', 2 : 'x-small', 3 : 'small', 4 : 'medium', 5 : 'large', 6 : 'x-large'},
	
	construct : function(nicEditor) {
		this.ne = nicEditor;
		if(this.ne.options.xhtml) {
			nicEditor.addEvent('get',this.cleanup.closure(this));
		}
	},
	
	cleanup : function(ni) {
		var node = ni.getElm();
		var xhtml = this.toXHTML(node);
		ni.content = xhtml;
	},
	
	toXHTML : function(n,r,d) {
		var txt = '';
		var attrTxt = '';
		var cssTxt = '';
		var nType = n.nodeType;
		var nName = n.nodeName.toLowerCase();
		var nChild = n.hasChildNodes && n.hasChildNodes();
		var extraNodes = new Array();
		
		switch(nType) {
			case 1:
				var nAttributes = n.attributes;
				
				switch(nName) {
					case 'b':
						nName = 'strong';
						break;
					case 'i':
						nName = 'em';
						break;
					case 'font':
						nName = 'span';
						break;
				}
				
				if(r) {
					for(var i=0;i<nAttributes.length;i++) {
						var attr = nAttributes[i];
						
						var attributeName = attr.nodeName.toLowerCase();
						var attributeValue = attr.nodeValue;
						
						if(!attr.specified || !attributeValue || bkLib.inArray(this.stripAttributes,attributeName) || typeof(attributeValue) == "function") {
							continue;
						}
						
						switch(attributeName) {
							case 'style':
								var css = attributeValue.replace(/ /g,"");
								for(itm in this.cssReplace) {
									if(css.indexOf(itm) != -1) {
										extraNodes.push(this.cssReplace[itm]);
										css = css.replace(itm,'');
									}
								}
								cssTxt += css;
								attributeValue = "";
							break;
							case 'class':
								attributeValue = attributeValue.replace("Apple-style-span","");
							break;
							case 'size':
								cssTxt += "font-size:"+this.sizes[attributeValue]+';';
								attributeValue = "";
							break;
						}
						
						if(attributeValue) {
							attrTxt += ' '+attributeName+'="'+attributeValue+'"';
						}
					}

					if(cssTxt) {
						attrTxt += ' style="'+cssTxt+'"';
					}

					for(var i=0;i<extraNodes.length;i++) {
						txt += '<'+extraNodes[i]+'>';
					}
				
					if(attrTxt == "" && nName == "span") {
						r = false;
					}
					if(r) {
						txt += '<'+nName;
						if(nName != 'br') {
							txt += attrTxt;
						}
					}
				}
				

				
				if(!nChild && !bkLib.inArray(this.noShort,attributeName)) {
					if(r) {
						txt += ' />';
					}
				} else {
					if(r) {
						txt += '>';
					}
					
					for(var i=0;i<n.childNodes.length;i++) {
						var results = this.toXHTML(n.childNodes[i],true,true);
						if(results) {
							txt += results;
						}
					}
				}
					
				if(r && nChild) {
					txt += '</'+nName+'>';
				}
				
				for(var i=0;i<extraNodes.length;i++) {
					txt += '</'+extraNodes[i]+'>';
				}

				break;
			case 3:
				//if(n.nodeValue != '\n') {
					txt += n.nodeValue;
				//}
				break;
		}
		
		return txt;
	}
});
nicEditors.registerPlugin(nicXHTML);
