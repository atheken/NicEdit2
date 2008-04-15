/**
 * NicEdit Plugin
 * Base class for nicEdit plugins, by default loads buttons from plugin config into the panel.  You should extend this when you create your own plugin
 * @author: Brian Kirchoff
 * @requires: nicCore
 * @version 0.9
 */
 
var nicPlugin = bkClass.extend({
	
	construct : function(nicEditor,options) {
		this.options = options;
		this.ne = nicEditor;
		this.ne.addEvent('panel',this.loadPanel.closure(this));
		
		this.init();
	},

	loadPanel : function(np) {
		var buttons = this.options.buttons;
		for(var button in buttons) {
			np.addButton(button,this.options);
		}
		np.reorder();
	},

	init : function() {  }
});
