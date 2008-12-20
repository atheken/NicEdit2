/**
 * NicEdit Floating Panel Support
 * @description: Adds support to create a floating editor panel
 * @author: Brian Kirchoff
 * @version: 0.9.0
 * @requires: nicCore
 */

nicEditor = nicEditor.extend({
        floatingPanel : function() {
                this.floating = new bkElement('DIV').setStyle({position: 'absolute', top : '-1000px'}).appendTo(document.body);
                this.addEvent('focus', this.reposition.closure(this)).addEvent('blur', this.hide.closure(this));
                this.setPanel(this.floating);
        },
        
        reposition : function() {
                var e = this.selectedInstance.e;
                this.floating.setStyle({ width : (parseInt(e.getStyle('width')) || e.clientWidth)+'px' });
                var top = e.offsetTop-this.floating.offsetHeight;
                if(top < 0) {
                        top = e.offsetTop+e.offsetHeight;
                }
                
                this.floating.setStyle({ top : top+'px', left : e.offsetLeft+'px', display : 'block' });
        },
        
        hide : function() {
                this.floating.setStyle({ top : '-1000px'});
        }
});