/**
 * nicSave
 * @description: A button for nicEdit ajax content saving
 * @requires: nicCore
 * @author: Brian Kirchoff
 * @version: 0.9.0
 */

/* START CONFIG */
var nicSaveOptions = {
	buttons : {
		'save' : {name : __('Save this content'), type : 'nicEditorSaveButton'}
	}/* NICEDIT_REMOVE_START */,iconFiles : {'save' : 'src/nicSave/icons/save.gif'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var nicEditorSaveButton = nicEditorButton.extend({
	init : function() {
		if(!this.ne.options.onSave) {
			this.margin.setStyle({'display' : 'none'});
		}
	},
	mouseClick : function() {
		var onSave = this.ne.options.onSave;
		var selectedInstance = this.ne.selectedInstance;
		onSave(selectedInstance.getContent(), selectedInstance.elm.id, selectedInstance);
	}
});

nicEditors.registerPlugin(nicPlugin,nicSaveOptions);