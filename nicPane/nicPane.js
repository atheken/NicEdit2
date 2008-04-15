/**
 * NicEdit Pane
 * @description: Popup overlay that can contain dialogs, tooltips, select boxes, etc.
 * @requires: nicCore
 * @author: Brian Kirchoff
 * @version: 0.9.0
 */
 
 /* START CONFIG */
var nicPaneOptions = {/* NICEDIT_REMOVE_START */
	iconFiles : {'close' : 'src/nicPane/icons/close.gif'}
/* NICEDIT_REMOVE_END */ };
/* END CONFIG */

var nicEditorPane = bkClass.extend({
	construct : function(elm,nicEditor,options,openButton) {
		this.ne = nicEditor;
		this.elm = elm;
		this.pos = elm.pos();
		
		this.contain = new bkElement('div').setStyle({zIndex : '99999', overflow : 'hidden', position : 'absolute', left : this.pos[0]+'px', top : this.pos[1]+'px'})
		this.pane = new bkElement('div').setStyle({fontSize : '12px', border : '1px solid #ccc', 'overflow': 'hidden', padding : '4px', textAlign: 'left', backgroundColor : '#ffffc9'}).addClass('pane').setStyle(options).appendTo(this.contain);
		
		if(openButton && !openButton.options.noClose) {
			this.close = new bkElement('div').setStyle({'float' : 'right', height: '16px', width : '16px', cursor : 'pointer'}).setStyle(this.ne.getIcon('close',nicPaneOptions)).addEvent('mousedown',openButton.removePane.closure(this)).appendTo(this.pane);
		}
		
		this.contain.noSelect().appendTo(document.body);
		
		this.position();
		this.init();	
	},
	
	init : function() { },
	
	position : function() {
		if(this.ne.nicPanel) {
			var panelElm = this.ne.nicPanel.elm;	
			var panelPos = panelElm.pos();
			var newLeft = panelPos[0]+parseInt(panelElm.getStyle('width'))-(parseInt(this.pane.getStyle('width'))+8);
			if(newLeft < this.pos[0]) {
				this.contain.setStyle({left : newLeft+'px'});
			}
		}
	},
	
	toggle : function() {
		this.isVisible = !this.isVisible;
		this.contain.setStyle({display : ((this.isVisible) ? 'block' : 'none')});
	},
	
	remove : function() {
		if(this.contain) {
			this.contain.remove();
			this.contain = null;
		}
	},
	
	append : function(c) {
		c.appendTo(this.pane);
	},
	
	setContent : function(c) {
		this.pane.setContent(c);
	}
	
});