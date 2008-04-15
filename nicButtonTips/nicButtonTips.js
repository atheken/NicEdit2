/**
 * nicButtonTips
 * @description: Tooltips when buttons are moused over describing their function
 * @requires: nicCore, nicPane
 * @author: Brian Kirchoff
 * @version: 0.9.0
 */
var nicButtonTips = bkClass.extend({
	construct : function(nicEditor) {
		this.ne = nicEditor;
		nicEditor.addEvent('buttonOver',this.show.closure(this)).addEvent('buttonOut',this.hide.closure(this));

	},
	
	show : function(button) {
		this.timer = setTimeout(this.create.closure(this,button),400);
	},
	
	create : function(button) {
		this.timer = null;
		if(!this.pane) {
			this.pane = new nicEditorPane(button.button,this.ne,{fontSize : '12px', marginTop : '5px'});
			this.pane.setContent(button.options.name);
		}		
	},
	
	hide : function(button) {
		if(this.timer) {
			clearTimeout(this.timer);
		}
		if(this.pane) {
			this.pane = this.pane.remove();
		}
	}
});
nicEditors.registerPlugin(nicButtonTips);