/**
 * nicAdvancedButton
 * @description: Panel button with support for opening a nicPane with configuration form
 * @requires: nicCore, nicPane
 * @author: Brian Kirchoff
 * @version: 0.9.0
 */
 
var nicEditorAdvancedButton = nicEditorButton.extend({
	
	init : function() {
		this.ne.addEvent('selected',this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));	
	},
	
	mouseClick : function() {
		if(!this.isDisabled) {
			if(this.pane && this.pane.pane) {
				this.removePane();
			} else {
				this.pane = new nicEditorPane(this.contain,this.ne,{width : (this.width || '270px'), backgroundColor : '#fff'},this);
				this.addPane();
				this.ne.selectedInstance.saveRng();
			}
		}
	},
	
	addForm : function(f,elm) {
		this.form = new bkElement('form').addEvent('submit',this.submit.closureListener(this));
		this.pane.append(this.form);
		this.inputs = {};
		
		for(itm in f) {
			var field = f[itm];
			var val = '';
			if(elm) {
				val = elm.getAttribute(itm);
			}
			if(!val) {
				val = field['value'] || '';
			}
			var type = f[itm].type;
			
			if(type == 'title') {
					new bkElement('div').setContent(field.txt).setStyle({fontSize : '14px', fontWeight: 'bold', padding : '0px', margin : '2px 0'}).appendTo(this.form);
			} else {
				var contain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(this.form);
				if(field.txt) {
					new bkElement('label').setAttributes({'for' : itm}).setContent(field.txt).setStyle({margin : '2px 4px', fontSize : '13px', width: '50px', lineHeight : '20px', textAlign : 'right', 'float' : 'left'}).appendTo(contain);
				}
				
				switch(type) {
					case 'text':
						this.inputs[itm] = new bkElement('input').setAttributes({id : itm, 'value' : val, 'type' : 'text'}).setStyle({margin : '2px 0', fontSize : '13px', 'float' : 'left', height : '20px', border : '1px solid #ccc', overflow : 'hidden'}).setStyle(field.style).appendTo(contain);
						break;
					case 'select':
						this.inputs[itm] = new bkElement('select').setAttributes({id : itm}).setStyle({border : '1px solid #ccc', 'float' : 'left', margin : '2px 0'}).appendTo(contain);
						for(opt in field.options) {
							var o = new bkElement('option').setAttributes({value : opt, selected : (opt == val) ? 'selected' : ''}).setContent(field.options[opt]).appendTo(this.inputs[itm]);
						}
						break;
					case 'content':
						this.inputs[itm] = new bkElement('textarea').setAttributes({id : itm}).setStyle({border : '1px solid #ccc', 'float' : 'left'}).setStyle(field.style).appendTo(contain);
						this.inputs[itm].value = val;
				}	
			}
		}
		new bkElement('input').setAttributes({'type' : 'submit'}).setStyle({backgroundColor : '#efefef',border : '1px solid #ccc', margin : '3px 0', 'float' : 'left', 'clear' : 'both'}).appendTo(this.form);
		this.form.onsubmit = bkLib.cancelEvent;	
	},
	
	submit : function() { },
	
	findElm : function(tag,attr,val) {
		var list = this.ne.selectedInstance.getElm().getElementsByTagName(tag);
		for(var i=0;i<list.length;i++) {
			if(list[i].getAttribute(attr) == val) {
				return $BK(list[i]);
			}
		}
	},
	
	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
		}	
	}	
});