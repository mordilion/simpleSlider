/**
 * effects for simpleSlider
 *
 * @version: 1.0.0 - (2011/09/18)
 * @author Henning Huncke
 *
 * Copyright (c) 2011 Henning Huncke (http://www.devjunkie.de)
 * Licensed under the GPL (LICENSE) licens.
 */
 

(function($) {
    
    // overlay horizontal slide effect
    $.simpleSlider.addEffect('overlayHorizontal',
        function (current, next, opts) {
            var options = this.getOptions();
            
            $(next).css({
                'top': 0,
                'left': parseInt(opts.direction + options.width) * -1,
                'z-index': options.zIndex + 100
            }).show().animate({
                'left': 0
            }, {
                duration: options.speed,
                complete: this.complete
            });
            
            $(current).css({
                'z-index': options.zIndex + 90
            });
        }
    );
    
    // overlay vertical slide effect
    $.simpleSlider.addEffect('overlayVertical',
        function (current, next, opts) {
            var options = this.getOptions();
            
            $(next).css({
                'top': parseInt(opts.direction + options.height) * -1,
                'left': 0,
                'z-index': options.zIndex + 100
            }).show().animate({
                'top': 0
            }, {
                duration: options.speed,
                complete: this.complete
            });
            
            $(current).css({
                'z-index': options.zIndex + 90
            });
        }
    );
    
})(jQuery);
