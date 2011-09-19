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

    // build the matrix for square effects
    $.simpleSlider.buildSquareMatrix = function (element, opts) {
        var squareWidth = Math.ceil(opts.width / opts.squaresPerWidth);
        var squareHeight = Math.ceil(opts.height / opts.squaresPerHeight);
        
        for (var i = 1; i <= opts.squaresPerHeight; i++) {
            for (var j = 1; j <= opts.squaresPerWidth; j++) {
                var el = $(element).append('<div id="simpleSlider-square-' + i + '-' + j + '" />').find('#simpleSlider-square-' + i + '-' + j);
                $(el).css({
                    'display': 'block',
                    'position': 'absolute',
                    'left': (j-1) * squareWidth,
                    'top': (i-1) * squareHeight,
                    'width': squareWidth,
                    'height': squareHeight,
                    'background-image': 'url(' + $(element).find('img:first').attr('src') + ')',
                    'background-position': '-' + ((j-1) * squareWidth) + 'px -' + ((i-1) * squareHeight) + 'px'
                });
            }
        }
        
        return new Array(squareWidth, squareHeight);
    };
    
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
            
            $(current).css('z-index', options.zIndex + 90);
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
            
            $(current).css('z-index', options.zIndex + 90);
        }
    );
    
    // horizontal blind effect
    $.simpleSlider.addEffect('blindHorizontal',
        function (current, next, opts) {
            var options     = $.extend({}, this.getOptions(), opts, {squaresPerHeight: 1});
            var self        = this;
            var margin      = parseInt($(current).css('margin-left'));
            
            $(next).css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            $(current).css('z-index', options.zIndex + 100);
            
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            margin = opts.direction == '+' ? dimension[0] : 0;
            
            $('img:first', current).hide();
            $('div:[id*="simpleSlider-square"]', current).show().animate({
                'width': 0,
                'margin-left': margin
            }, {
                duration: options.speed,
                complete: function () {
                    $('div:[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            });
        } 
    );
    
    // vertical blind effect
    $.simpleSlider.addEffect('blindVertical',
        function (current, next, opts) {
            var options     = $.extend({}, this.getOptions(), opts, {squaresPerWidth: 1});
            var self        = this;
            var margin      = parseInt($(current).css('margin-top'));
            
            $(next).css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            $(current).css('z-index', options.zIndex + 100);
            
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            margin = opts.direction == '+' ? dimension[1] : 0;
            
            $('img:first', current).hide();
            $('div:[id*="simpleSlider-square"]', current).show().animate({
                'height': 0,
                'margin-top': margin
            }, {
                duration: options.speed,
                complete: function () {
                    $('div:[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            });
        } 
    );
    
})(jQuery);
