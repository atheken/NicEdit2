/**
 * nicCode
 * @description: Adds button to edit the HTML in a editor
 * @requires: nicCore, nicPane, nicAdvancedButton
 * @author: Brian Kirchoff
 * @version: 0.9.0
 */

/* START CONFIG */
var nicCodeOptions = {
	buttons : {
		'xhtml' : {name : 'Edit HTML', type : 'nicCodeButton'}
	}
	/* NICEDIT_REMOVE_START */,iconFiles : {'xhtml' : 'src/nicCode/icons/xhtml.gif'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var nicCodeButton = nicEditorAdvancedButton.extend({
	width : '350px',
		
	addPane : function() {
		this.addForm({
			'' : {type : 'title', txt : 'Edit HTML'},
			'code' : {type : 'content', 'value' : this.ne.selectedInstance.getContent(), style : {width: '340px', height : '200px'}}
		});
	},
	
	submit : function(e) {
		var code = this.inputs['code'].value;
		this.ne.selectedInstance.setContent(code);
		this.removePane();
	}
});

nicEditors.registerPlugin(nicPlugin,nicCodeOptions);
