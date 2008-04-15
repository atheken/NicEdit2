var nicEditorIFrameInstance = nicEditorInstance.extend({
	savedStyles : [],
	
	init : function() {	
		var c = this.elm.innerHTML.replace(/^\s+|\s+$/g, '');
		this.elm.innerHTML = '';
		(!c) ? c = "<br />" : c;
		this.initialContent = c;
		
		this.elmFrame = new bkElement('iframe').setAttributes({'src' : 'javascript:;', 'frameBorder' : 0, 'allowTransparency' : 'true', 'scrolling' : 'no'}).setStyle({height: '100px', width: '100%'}).addClass('frame').appendTo(this.elm);

       	if(this.copyElm) { this.elmFrame.setStyle({width : (this.elm.offsetWidth-4)+'px'}); }
		
		var styleList = {'fontSize' : 'font-size', 'fontFamily' : 'font-family', 'fontWeight' : 'font-weight', 'color' : 'color'};
		for(itm in styleList) {
			this.savedStyles[itm] = this.elm.getStyle(styleList[itm]);
		}
     	
     	setTimeout(this.initFrame.closure(this),50);
	},
	
	disable : function() {
		this.elm.innerHTML = this.getContent();
	},
	
	initFrame : function() {
		this.frameDoc = $BK(this.elmFrame.contentWindow.document);
		this.frameDoc.designMode = "on";		
        this.frameDoc.open();
        this.frameDoc.write('<html><head></head><body id="nicEditContent" style="margin: 0 !important; background-color: transparent !important;">'+this.initialContent+'</body></html>');
        this.frameDoc.close();

        this.frameWin = $BK(this.elmFrame.contentWindow);
        this.frameContent = $BK(this.frameWin.document.body).setStyle(this.savedStyles);
        this.instanceDoc = this.frameWin.document.defaultView;
        
        this.heightUpdate();
        this.frameDoc.addEvent('mousedown', this.selected.closureListener(this)).addEvent('keyup',this.heightUpdate.closureListener(this)).addEvent('keydown',this.keyDown.closureListener(this)).addEvent('keyup',this.selected.closure(this));
	},
	
	getElm : function() {
        return this.frameContent;
	},
	
	setContent : function(c) {
		this.content = c;
		this.ne.fireEvent('set',this);
		this.frameContent.innerHTML = this.content;	
		this.heightUpdate();
	},
	
	getSel : function() {
		return (this.frameWin) ? this.frameWin.getSelection() : this.frameDoc.selection;
	},
	
	heightUpdate : function() {
		var updateHeight = this.frameContent.offsetHeight;		
		this.elmFrame.style.height = Math.max(updateHeight,this.initialHeight)+'px';
    },
    
    nicCommand : function(cmd,args) {
		this.frameDoc.execCommand(cmd,false,args);
		setTimeout(this.heightUpdate.closure(this),100);
	}

	
});