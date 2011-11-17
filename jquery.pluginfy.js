//Wrap in a closure to secure $ for jQuery
(function( $ ) {
	var plugins = {};
    //Proto is your object literal
    $.pluginfy = function( proto ) {
		//Rather than asking for a separate name parameter, just have it stored in the object
		var name = proto._name;
		
		//Store the plugin so we can create new instances as needed
		plugins[name] = function () {};
		plugins[name].prototype = proto;
		
		var plugin = plugins[name];
		
        //Create the prototype function for the plugin
        $.fn[name] = function( options ) {
 
            //args isset to everything passed in after options item
            var args = Array.prototype.slice.call( arguments , 1 );
 
            //Don't waste time if there are no matching elements
            if( this.length ) {
 
                //Support chaining by returning this
                return this.each( function() {
 
					//Retrieve the instance from $.data() OR create the instance, _init() it, and store that instance in $.data()
                    var instance = $.data( this , name ) 
					
					if (!instance) {
						var pluginInst = new plugin();
						//Let's do the legwork rather than the plugin
						pluginInst.element = this;
						pluginInst.$element = $(this);
						pluginInst.options = $.extend(true, {}, plugin.prototype.options, options);
						pluginInst._init();
						
						instance = $.data( this, name, pluginInst );
					}
                    
					//If the first arg is a string we assume you are calling a method inside the plugin instance
                    if( typeof options === "string" ){
 
                        //underscored methods are "private" (similar to jQuery UI's $.widget we allow this to make methods not availble via public api)
                        options = options.replace( /^_/ , "" );
 
                        //Check if underscore filtered method exists
                        if( instance[options] ) {
 
                            //Call method with args
                            instance[options].apply( instance , args );
                        }
                    }
                });
            }
        };
    };
}( jQuery ));