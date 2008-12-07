/**
 * nicUpload
 * @description: A button to allow users to upload images (hosted by ImageShack)
 * @requires: nicCore, nicPane, nicAdvancedButton
 * @author: Brian Kirchoff
 * @version: 0.9.0
 */

/* START CONFIG */
var nicUploadOptions = {
	buttons : {
		'upload' : {name : 'Upload Image', type : 'nicUploadButton'}
	}
	/* NICEDIT_REMOVE_START */,iconFiles : {'upload' : 'src/nicUpload/icons/upload.gif'}/* NICEDIT_REMOVE_END */
};
/* END CONFIG */

var nicUploadButton = nicEditorAdvancedButton.extend({	
	serverURI : 'http://files.nicedit.com/',

	addPane : function() {
		this.im = this.ne.selectedInstance.selElm().parentTag('IMG');
		this.myID = Math.round(Math.random()*Math.pow(10,15));
		this.requestInterval = 4000;

		this.myFrame = new bkElement('iframe').setAttributes({ src : this.serverURI+'?id='+this.myID, width : '100%', height : '100px', frameBorder : 0, scrolling : 'no' }).setStyle({border : 0}).appendTo(this.pane.pane);
		this.progressWrapper = new bkElement('div').setStyle({display: 'none', width: '100%', height: '20px', border : '1px solid #ccc'}).appendTo(this.pane.pane);
		this.progress = new bkElement('div').setStyle({width: '0%', height: '20px', backgroundColor : '#ccc'}).setContent('&nbsp').appendTo(this.progressWrapper);
		setTimeout(this.makeRequest.closure(this), this.requestInterval);
	},

	makeRequest : function() {
		if(this.pane && this.pane.pane) {
			nicUploadButton.lastPlugin = this;
			var s = new bkElement('script').setAttributes({ type : 'text/javascript', src : this.serverURI+'?check='+this.myID+'&rand='+Math.round(Math.random()*Math.pow(10,15))}).addEvent('load', function() {
				s.parentNode.removeChild(s);
			}).appendTo(document.getElementsByTagName('head')[0]);
			if(this.requestInterval) {
				setTimeout(this.makeRequest.closure(this), this.requestInterval);
			}
		}
	},

	setProgress : function(percent) {
		this.progressWrapper.setStyle({display: 'block'});
		this.progress.setStyle({width : percent+'%'});
	},

	update : function(o) {
		if(!this.requestInterval) return;

		if(o == false) {
			this.progressWrapper.setStyle({display : 'none'});
		} else if(o.url) {
			this.setProgress(100);
			this.requestInterval = false;

			if(!this.im) {
				this.ne.selectedInstance.restoreRng();
				var tmp = 'javascript:nicImTemp();';
				this.ne.nicCommand("insertImage",tmp);
				this.im = this.findElm('IMG','src',tmp);
			}
			var w = parseInt(this.ne.selectedInstance.elm.getStyle('width'));
			if(this.im) {
				this.im.setAttributes({
					src : o.url,
					width : (w && o.width) ? Math.min(w,o.width) : ''
				});
			}

			this.removePane();
		} else if(o.error) {
			this.requestInterval = false;
			this.setProgress(100);
			alert("There was an error uploading your image ("+o.error+").");
			this.removePane();
		} else {
			this.setProgress( Math.round( (o.current/o.total) * 75) );
			this.requestInterval = 1000;
		}
	}

});

nicUploadButton.statusCb = function(o) {
	nicUploadButton.lastPlugin.update(o);
}

nicEditors.registerPlugin(nicPlugin,nicUploadOptions);
