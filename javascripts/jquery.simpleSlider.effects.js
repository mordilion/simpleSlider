/**
 * effects for simpleSlider
 *
 * @version: 1.3.15 - (2011/11/10)
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
        
        for (var row = 1; row <= opts.squaresPerHeight; row++) {
            for (var col = 1; col <= opts.squaresPerWidth; col++) {
                var el = element.append('<div id="simpleSlider-square-' + row + '-' + col + '" />').find('#simpleSlider-square-' + row + '-' + col);
                $(el).css({
                    'display': 'block',
                    'position': 'absolute',
                    'left': (col-1) * squareWidth,
                    'top': (row-1) * squareHeight,
                    'width': squareWidth,
                    'height': squareHeight,
                    'background-image': 'url(' + element.find('img:first').attr('src') + ')',
                    'background-position': '-' + ((col-1) * squareWidth) + 'px -' + ((row-1) * squareHeight) + 'px'
                });
            }
        }
        
        return new Array(squareWidth, squareHeight);
    };
    
    // method for animate the css value for background-position
    $.simpleSlider.animateBackgroundPosition = function (fx) {
	    if (!fx.set) {
		    var position = $(fx.elem).css('background-position') || '0 0';
		    $(fx.elem).css('background-position', position);
		    fx.start = $.simpleSlider.parseBackgroundPosition(position);
		    
		    position = $.fn.jquery >= '1.6' ? fx.end : fx.options.curAnim['backgroundPosition'] || fx.options.curAnim['background-position'];
		    fx.end = $.simpleSlider.parseBackgroundPosition(position);
		    
		    fx.set = true;
	    }

	    $(fx.elem).css(
	        'background-position',
	        (fx.start[0] + (fx.pos * (fx.end[0] - fx.start[0]))) + 'px ' + (fx.start[1] + (fx.pos * (fx.end[1] - fx.start[1]))) + 'px'
		);
    };
    
    // method to parse the given background-position value on animate
    $.simpleSlider.parseBackgroundPosition = function (value) {
        var position = value.split(/ /);
        
        position[0] = parseFloat(position[0]);
        position[1] = parseFloat(position[1]);

        return position;
    };
    
    // main method for slice effects
    $.simpleSlider.sliceEffect = function (current, next, options, instance, init, ani) {
        var self        = instance;
        var spw         = options.squaresPerWidth;
        var sph         = options.squaresPerHeight;
        var callback    = function () {
            if ($('div:[id*="simpleSlider-square-"]:animated', next).length == 1) {
                $('div:[id*="simpleSlider-square-"]', next).remove();
                $('img:first', current).hide();
                $('img:first', next).show();
                self.complete();
            }
        }
        
        $('img:first', next).hide();
        next.css({
            'top': 0,
            'left': 0,
            'z-index': options.zIndex + 100
        }).show();
        current.css('z-index', options.zIndex + 90);
        
        var dimension = $.simpleSlider.buildSquareMatrix(next, options);
        $('div:[id*="simpleSlider-square"]', next).css(init).each(function (index) {
            var square = $(this);
            var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
            var wait = col - 1;
            
            if (options.direction == '+') {
                wait = (spw + sph) - wait;
            }
            wait *= (options.speed / spw);
            
            square.delay(wait).animate(ani, {
                duration: options.speed / 2,
                complete: callback
            });
        });
    };
    
    // overlay horizontal slide effect
    $.simpleSlider.addEffect('overlayHorizontal',
        function (current, next, opts) {
            var options = this.getOptions();
            
            next.css({
                'top': 0,
                'left': parseInt(opts.direction + options.width) * -1,
                'z-index': options.zIndex + 100
            }).show().animate({
                'left': 0
            }, {
                duration: options.speed,
                complete: this.complete
            });
            
            current.css('z-index', options.zIndex + 90);
        }
    );
    
    // overlay vertical slide effect
    $.simpleSlider.addEffect('overlayVertical',
        function (current, next, opts) {
            var options = this.getOptions();
            
            next.css({
                'top': parseInt(opts.direction + options.height) * -1,
                'left': 0,
                'z-index': options.zIndex + 100
            }).show().animate({
                'top': 0
            }, {
                duration: options.speed,
                complete: this.complete
            });
            
            current.css('z-index', options.zIndex + 90);
        }
    );
    
    // horizontal fade & slide effect
    $.simpleSlider.addEffect('fadeslideHorizontal',
        function (current, next, opts) {
            var options = this.getOptions();
            
            next.css({
                'top': 0,
                'left': parseInt(opts.direction + options.width) * -1,
                'opacity': 0,
                'z-index': options.zIndex + 100
            }).show().animate({
                'left': 0,
                'opacity': 1
            }, {
                duration: options.speed,
                complete: this.complete
            });
            
            current.css('z-index', options.zIndex + 90);
        }
    );
    
    // vertical fade & slide effect
    $.simpleSlider.addEffect('fadeslideVertical',
        function (current, next, opts) {
            var options = this.getOptions();
            
            next.css({
                'top': parseInt(opts.direction + options.height) * -1,
                'left': 0,
                'opacity': 0,
                'z-index': options.zIndex + 100
            }).show().animate({
                'top': 0,
                'opacity': 1
            }, {
                duration: options.speed,
                complete: this.complete
            });
            
            current.css('z-index', options.zIndex + 90);
        }
    );
    
    // horizontal blind effect
    $.simpleSlider.addEffect('blindHorizontal',
        function (current, next, opts) {
            var options     = $.extend({}, this.getOptions(), opts, {squaresPerHeight: 1});
            var self        = this;
            var margin      = parseInt(current.css('margin-left'));
            
            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);
            
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            margin += opts.direction == '+' ? dimension[0] : 0;
            
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
            var margin      = parseInt(current.css('margin-top'));
            
            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);
            
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            margin += opts.direction == '+' ? dimension[1] : 0;
            
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
    
    // rain effect
    $.simpleSlider.addEffect('rain',
        function (current, next, opts) {
            var options     = $.extend({}, this.getOptions(), opts);
            var self        = this;
            var spw         = options.squaresPerWidth;
            var sph         = options.squaresPerHeight;
            var callback    = function () {
                if ($('div:[id*="simpleSlider-square-"]:visible', current).length == 0) {
                    $('div:[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            }
            
            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);
            
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            $('img:first', current).hide();
            
            $('div:[id*="simpleSlider-square"]', current).each(function (index) {
                var square = $(this);
                var row = parseInt(this.id.substr(this.id.indexOf('-', 19)+1));
                var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
                var wait = (row + col) - 1;
                
                if (opts.direction == '+') {
                    wait = (spw + sph) - wait;
                }
                wait *= options.speed / (spw + sph - 1);

                square.delay(wait).fadeOut(Math.floor(options.speed / 4), callback);
            });
        }
    );
    
    // rain grow effect
    $.simpleSlider.addEffect('rainGrow',
        function (current, next, opts) {
            var options     = $.extend({}, this.getOptions(), opts);
            var self        = this;
            var spw         = options.squaresPerWidth;
            var sph         = options.squaresPerHeight;
            var callback    = function () {
                if ($('div:[id*="simpleSlider-square-"]:visible', current).length == 0) {
                    $('div:[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            }
            
            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);
            
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            var marginLeft = opts.direction != '+' ? dimension[0] : 0;
            var marginTop = opts.direction != '+' ? dimension[1] : 0;
            var backgroundPosition = '0 0';
            $('img:first', current).hide();
            
            $('div:[id*="simpleSlider-square"]', current).each(function (index) {
                var square = $(this);
                var row = parseInt(this.id.substr(this.id.indexOf('-', 19)+1));
                var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
                var wait = (row + col) - 1;
                
                if (opts.direction == '+') {
                    wait = (spw + sph) - wait;
                    backgroundPosition = square.css('background-position');
                } else {
                    backgroundPosition = '-' + ((col) * dimension[0]) + 'px -' + ((row) * dimension[1]) + 'px';
                }
                wait *= options.speed / (spw + sph - 1);
                
                square.delay(wait).animate({
                    'height': 0,
                    'width': 0,
                    'margin-left': marginLeft,
                    'margin-top': marginTop,
                    'backgroundPosition': backgroundPosition
                }, {
                    duration: options.speed / 4,
                    step: function (now, fx) {
                        if (fx.prop == 'backgroundPosition' || fx.prop == 'background-position') {
                            $.simpleSlider.animateBackgroundPosition(fx);
                        }
                    },                    
                    complete: callback
                });

            });
        }
    );
    
    // rain random effect
    $.simpleSlider.addEffect('rainRandom',
        function (current, next, opts) {
            var options     = $.extend({}, this.getOptions(), opts);
            var self        = this;
            var spw         = options.squaresPerWidth;
            var sph         = options.squaresPerHeight;
            var callback    = function () {
                if ($('div:[id*="simpleSlider-square-"]:visible', current).length == 0) {
                    $('div:[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            }

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);
            
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            $('img:first', current).hide();
            
            var lastWait = 0;
            $('div:[id*="simpleSlider-square"]', current).each(function (index) {
                square = $(this);
                var row = parseInt(this.id.substr(this.id.indexOf('-', 19)+1));
                var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
                var wait = 0;
                do {
                    var wait = Math.floor(Math.random() * (spw * sph)) * (options.speed / (spw * sph));
                } while(wait == lastWait);
                lastWait = wait;

                square.delay(wait).fadeOut(Math.floor(options.speed / 4), callback);
            });
        }
    );
    
    // rain winding effect
    $.simpleSlider.addEffect('rainWinding',
        function (current, next, opts) {
            var options     = $.extend({}, this.getOptions(), opts);
            var self        = this;
            var spw         = options.squaresPerWidth;
            var sph         = options.squaresPerHeight;
            var callback    = function () {
                if ($('div:[id*="simpleSlider-square-"]:visible', current).length == 0) {
                    $('div:[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            }

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);
            
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            var marginLeft = opts.direction != '+' ? dimension[0] : 0;
            var marginTop = opts.direction != '+' ? dimension[1] : 0;
            var backgroundPosition = '0 0';
            $('img:first', current).hide();
            
            $('div:[id*="simpleSlider-square"]', current).each(function (index) {
                var square = $(this);
                var row = parseInt(this.id.substr(this.id.indexOf('-', 19)+1));
                var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
                var wait = col + (spw * (row - 1));
                
                if (opts.direction == '+') {
                    wait = (spw * sph) - wait;
                    backgroundPosition = square.css('background-position');
                } else {
                    backgroundPosition = '-' + ((col) * dimension[0]) + 'px -' + ((row) * dimension[1]) + 'px';
                }
                wait *= options.speed / (spw * sph - 1);

                square.delay(wait).animate({
                    'height': 0,
                    'width': 0,
                    'margin-left': marginLeft,
                    'margin-top': marginTop,
                    'backgroundPosition': backgroundPosition
                }, {
                    duration: options.speed / 4,
                    step: function (now, fx) {
                        if (fx.prop == 'backgroundPosition' || fx.prop == 'background-position') {
                            $.simpleSlider.animateBackgroundPosition(fx);
                        }
                    },                    
                    complete: callback
                });
            });
        }
    );
    
    // slice up effect
    $.simpleSlider.addEffect('sliceUp',
        function (current, next, opts) {
            var options = $.extend({}, this.getOptions(), opts, {squaresPerHeight: 1});
            
            $.simpleSlider.sliceEffect(current, next, options, this, {'top': options.height}, {'top': 0});
        } 
    );
    
    // slice down effect
    $.simpleSlider.addEffect('sliceDown',
        function (current, next, opts) {
            var options = $.extend({}, this.getOptions(), opts, {squaresPerHeight: 1});
            
            $.simpleSlider.sliceEffect(current, next, options, this, {'top': options.height * -1}, {'top': 0});
        } 
    );
    
})(jQuery);
