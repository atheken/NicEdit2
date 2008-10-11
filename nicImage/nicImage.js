/**
 * nicImage
 * @description: Adds buttons to insert images in the editor area
 * @requires: nicCore, nicPane, nicAdvancedButton
 * @author: Brian Kirchoff
 * @version: 0.9.0
 */

/* START CONFIG */
var nicImageOptions = {
	buttons : {
		'image' : {name : 'Add Image', type : 'nicImageButton', tags : ['IMG']}
	}
	/* NICEDIT_REMOVE_START */,iconFiles : {'image' : 'src/nicImage/icons/image.gif'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var nicImageButton = nicEditorAdvancedButton.extend({	
	addPane : function() {
		this.im = this.ne.selectedInstance.selElm().parentTag('IMG');
		this.addForm({
			'' : {type : 'title', txt : 'Add/Edit Image'},
			'src' : {type : 'text', txt : 'URL', 'value' : 'http://', style : {width: '150px'}},
			'alt' : {type : 'text', txt : 'Alt Text', style : {width: '100px'}},
			'align' : {type : 'select', txt : 'Align', options : {none : 'Default','left' : 'Left', 'right' : 'Right'}}
		},this.im);
	},
	
	submit : function(e) {
		var src = this.inputs['src'].value;
		if(src == "" || src == "http://") {
			alert("You must enter a Image URL to insert");
			return false;
		}
		this.removePane();

		if(!this.im) {
			var tmp = 'javascript:nicImTemp();';
			this.ne.nicCommand("insertImage",tmp);
			this.im = this.findElm('IMG','src',tmp);
		}
		if(this.im) {
			this.im.setAttributes({
				src : this.inputs['src'].value,
				alt : this.inputs['alt'].value,
				align : this.inputs['align'].value
			});
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicImageOptions);
