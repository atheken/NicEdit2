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
		this.requestInterval = 1000;

		this.myFrame = new bkElement('iframe').setAttributes({ width : '100%', height : '100px', frameBorder : 0, scrolling : 'no' }).setStyle({border : 0}).appendTo(this.pane.pane);
		this.progressWrapper = new bkElement('div').setStyle({display: 'none', width: '100%', height: '20px', border : '1px solid #ccc'}).appendTo(this.pane.pane);
		this.progress = new bkElement('div').setStyle({width: '0%', height: '20px', backgroundColor : '#ccc'}).setContent('&nbsp').appendTo(this.progressWrapper);

		setTimeout(this.addForm.closure(this),50);
	},

	addForm : function() {
		var myDoc = this.myDoc = this.myFrame.contentWindow.document;
		myDoc.open();
		myDoc.write("<html><body>");
		myDoc.write('<form method="post" action="'+this.serverURI+'?id='+this.myID+'" enctype="multipart/form-data">');
		myDoc.write('<input type="hidden" name="APC_UPLOAD_PROGRESS" value="'+this.myID+'" />');
		myDoc.write('<div style="position: absolute; margin-left: 160px;"><img src="http://imageshack.us/img/imageshack.png" width="30" style="float: left;" /><div style="float: left; margin-left: 5px; font-size: 10px;">Hosted by<br /><a href="http://www.imageshack.us/" target="_blank">ImageShack</a></div></div>');
		myDoc.write('<div style="font-size: 14px; font-weight: bold; padding-top: 5px;">Insert a Image</div>');
		myDoc.write('<input name="nicImage" type="file" style="margin-top: 10px;" />');
		myDoc.write('</form>');
		myDoc.write("</body></html>");
		myDoc.close();

		this.myBody = myDoc.body;

		this.myForm = $BK(this.myBody.getElementsByTagName('form')[0]);
		this.myInput = $BK(this.myBody.getElementsByTagName('input')[1]).addEvent('change', this.startUpload.closure(this));
		this.myStatus = new bkElement('div',this.myDoc).setStyle({textAlign : 'center', fontSize : '14px'}).appendTo(this.myBody);
  },

	startUpload : function() {
		this.myForm.setStyle({display : 'none'});
		this.myStatus.setContent('<img src="http://files.nicedit.com/ajax-loader.gif" style="float: right; margin-right: 40px;" /><strong>Uploading...</strong><br />Please wait');
		this.setProgress(10);
		this.myForm.submit();
		setTimeout(this.makeRequest.closure(this),this.requestInterval);
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
			if(o.interval) {
				this.requestInterval = o.interval;
			}
		}
	}

});

nicUploadButton.statusCb = function(o) {
	nicUploadButton.lastPlugin.update(o);
}

nicEditors.registerPlugin(nicPlugin,nicUploadOptions);
