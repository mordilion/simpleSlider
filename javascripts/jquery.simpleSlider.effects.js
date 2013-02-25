/**
 * effects for simpleSlider
 *
 * @version: 1.4.19 - (2012/04/10)
 * @author Henning Huncke
 *
 * Copyright (c) 2011-2012 Henning Huncke (http://www.devjunkie.de)
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

    $.simpleSlider.stepMethodBackgroundPosition = function (now, fx) {
        if (fx.prop == 'backgroundPosition' || fx.prop == 'background-position') {
            $.simpleSlider.animateBackgroundPosition(fx);
        }
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
        var self     = instance;
        var spw      = options.squaresPerWidth;
        var sph      = options.squaresPerHeight;
        var callback = function () {
            if ($('div[id*="simpleSlider-square-"]:animated', next).length === 1) {
                $('div[id*="simpleSlider-square-"]', next).remove();
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

        var speedModifier = spw > sph ? spw / 2 : sph / 2;
        var delayModifier = speedModifier * 4;
        var dimension = $.simpleSlider.buildSquareMatrix(next, options);
        $('div[id*="simpleSlider-square"]', next).css(init).each(function (index) {
            var square = $(this);
            var row = parseInt(this.id.substr(this.id.indexOf('-', 19)+1));
            var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
            var wait = spw > sph ? col - 1 : row - 1;

            if (options.direction === '+') {
                wait = (spw + sph) - wait - 2;
            }
            wait *= options.speed / delayModifier;

            square.delay(wait).animate(ani, {
                duration: options.speed / speedModifier,
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
            var options = $.extend({}, this.getOptions(), opts, {squaresPerHeight: 1});
            var self    = this;
            var margin  = parseInt(current.css('margin-left'));

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            margin += opts.direction === '+' ? dimension[0] : 0;

            $('img:first', current).hide();
            $('div[id*="simpleSlider-square"]', current).show().animate({
                'width': 0,
                'margin-left': margin
            }, {
                duration: options.speed,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            });
        }
    );

    // vertical blind effect
    $.simpleSlider.addEffect('blindVertical',
        function (current, next, opts) {
            var options = $.extend({}, this.getOptions(), opts, {squaresPerWidth: 1});
            var self    = this;
            var margin  = parseInt(current.css('margin-top'));

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            margin += opts.direction === '+' ? dimension[1] : 0;

            $('img:first', current).hide();
            $('div[id*="simpleSlider-square"]', current).show().animate({
                'height': 0,
                'margin-top': margin
            }, {
                duration: options.speed,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            });
        }
    );

    // rain effect
    $.simpleSlider.addEffect('rain',
        function (current, next, opts) {
            var options  = $.extend({}, this.getOptions(), opts);
            var self     = this;
            var spw      = options.squaresPerWidth;
            var sph      = options.squaresPerHeight;
            var callback = function () {
                if ($('div[id*="simpleSlider-square-"]:visible', current).length === 0) {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            }

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var speedModifier = spw > sph ? sph : spw;
            var delayModifier = spw + sph - 1;
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            $('img:first', current).hide();

            $('div[id*="simpleSlider-square"]', current).each(function (index) {
                var square = $(this);
                var row = parseInt(this.id.substr(this.id.indexOf('-', 19)+1));
                var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
                var wait = (row + col) - 1;

                if (opts.direction === '+') {
                    wait = (spw + sph) - wait;
                }
                wait *= options.speed / delayModifier;

                square.delay(wait).fadeOut(options.speed / speedModifier, callback);
            });
        }
    );

    // rain grow effect
    $.simpleSlider.addEffect('rainGrow',
        function (current, next, opts) {
            var options  = $.extend({}, this.getOptions(), opts);
            var self     = this;
            var spw      = options.squaresPerWidth;
            var sph      = options.squaresPerHeight;
            var callback = function () {
                if ($('div[id*="simpleSlider-square-"]:visible', current).length === 0) {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            }

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var speedModifier = spw > sph ? sph : spw;
            var delayModifier = spw + sph - 1;
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            var marginLeft = opts.direction !== '+' ? dimension[0] : 0;
            var marginTop = opts.direction !== '+' ? dimension[1] : 0;
            var backgroundPosition = '0 0';
            $('img:first', current).hide();

            $('div[id*="simpleSlider-square"]', current).each(function (index) {
                var square = $(this);
                var row = parseInt(this.id.substr(this.id.indexOf('-', 19)+1));
                var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
                var wait = (row + col) - 1;

                if (opts.direction === '+') {
                    wait = (spw + sph) - wait;
                    backgroundPosition = square.css('background-position');
                } else {
                    backgroundPosition = '-' + ((col) * dimension[0]) + 'px -' + ((row) * dimension[1]) + 'px';
                }
                wait *= options.speed / delayModifier;

                square.delay(wait).animate({
                    'height': 0,
                    'width': 0,
                    'margin-left': marginLeft,
                    'margin-top': marginTop,
                    'backgroundPosition': backgroundPosition
                }, {
                    duration: options.speed / speedModifier,
                    step: $.simpleSlider.stepMethodBackgroundPosition,
                    complete: callback
                });

            });
        }
    );

    // rain random effect
    $.simpleSlider.addEffect('rainRandom',
        function (current, next, opts) {
            var options  = $.extend({}, this.getOptions(), opts);
            var self     = this;
            var spw      = options.squaresPerWidth;
            var sph      = options.squaresPerHeight;
            var callback = function () {
                if ($('div[id*="simpleSlider-square-"]:visible', current).length === 0) {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            }

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var speedModifier = spw > sph ? (spw * sph) / spw : (spw * sph) / sph;
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            $('img:first', current).hide();

            var lastWait = 0;
            $('div[id*="simpleSlider-square"]', current).each(function (index) {
                square = $(this);
                var row = parseInt(this.id.substr(this.id.indexOf('-', 19)+1));
                var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
                var wait = 0;
                do {
                    var wait = (Math.random() * (spw * sph)) * (options.speed / (spw * sph));
                } while(wait === lastWait);
                lastWait = wait;

                square.delay(wait).fadeOut(options.speed / speedModifier, callback);
            });
        }
    );

    // rain winding effect
    $.simpleSlider.addEffect('rainWinding',
        function (current, next, opts) {
            var options  = $.extend({}, this.getOptions(), opts);
            var self     = this;
            var spw      = options.squaresPerWidth;
            var sph      = options.squaresPerHeight;
            var callback = function () {
                if ($('div[id*="simpleSlider-square-"]:visible', current).length === 0) {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            }

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var speedModifier = spw > sph ? (spw * sph) / spw : (spw * sph) / sph;
            var delayModifier = spw * sph - 1;
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            var marginLeft = opts.direction !== '+' ? dimension[0] : 0;
            var marginTop = opts.direction !== '+' ? dimension[1] : 0;
            var backgroundPosition = '0 0';
            $('img:first', current).hide();

            $('div[id*="simpleSlider-square"]', current).each(function (index) {
                var square = $(this);
                var row = parseInt(this.id.substr(this.id.indexOf('-', 19)+1));
                var col = parseInt(this.id.substr(this.id.lastIndexOf('-')+1));
                var wait = col + (spw * (row - 1));

                if (opts.direction === '+') {
                    wait = (spw * sph) - wait;
                    backgroundPosition = square.css('background-position');
                } else {
                    backgroundPosition = '-' + ((col) * dimension[0]) + 'px -' + ((row) * dimension[1]) + 'px';
                }
                wait *= options.speed / delayModifier;

                square.delay(wait).animate({
                    'height': 0,
                    'width': 0,
                    'margin-left': marginLeft,
                    'margin-top': marginTop,
                    'backgroundPosition': backgroundPosition
                }, {
                    duration: options.speed / speedModifier,
                    step: $.simpleSlider.stepMethodBackgroundPosition,
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

    // split slide
    $.simpleSlider.addEffect('splitSlide',
        function (current, next, opts) {
            var options = $.extend({}, this.getOptions(), opts, {squaresPerHeight: 2, squaresPerWidth: 2});
            var self    = this;
            var marginH = parseInt(current.css('height'));
            var marginW = parseInt(current.css('width'));

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var dimension = $.simpleSlider.buildSquareMatrix(current, options);

            $('img:first', current).hide();
            $('div[id*="simpleSlider-square"]', current).show();
            $('div[id="simpleSlider-square-1-1"]', current).animate({
                'height': 0,
                'width': 0
            }, {
                duration: options.speed,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                }
            });
            $('div[id="simpleSlider-square-1-2"]', current).animate({
                'height': 0,
                'width': 0,
                'margin-left': marginW / 2,
                'backgroundPosition': '-' + marginW + 'px 0px'
            }, {
                duration: options.speed,
                step: $.simpleSlider.stepMethodBackgroundPosition,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                }
            });
            $('div[id="simpleSlider-square-2-1"]', current).animate({
                'height': 0,
                'width': 0,
                'margin-top': marginH / 2,
                'backgroundPosition': '0px -' + marginH + 'px'
            }, {
                duration: options.speed,
                step: $.simpleSlider.stepMethodBackgroundPosition,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            });
            $('div[id="simpleSlider-square-2-2"]', current).animate({
                'height': 0,
                'width': 0,
                'margin-top': marginH / 2,
                'margin-left': marginW / 2,
                'backgroundPosition': '-' + marginW + 'px -' + marginH + 'px'
            }, {
                duration: options.speed,
                step: $.simpleSlider.stepMethodBackgroundPosition,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                }
            });
        }
    );

    // split slide horizontal
    $.simpleSlider.addEffect('splitSlideHorizontal',
        function (current, next, opts) {
            var options = $.extend({}, this.getOptions(), opts, {squaresPerHeight: 1, squaresPerWidth: 2});
            var self    = this;
            var margin  = parseInt(current.css('width'));

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var dimension = $.simpleSlider.buildSquareMatrix(current, options);

            $('img:first', current).hide();
            $('div[id*="simpleSlider-square"]', current).show();
            $('div[id="simpleSlider-square-1-1"]', current).animate({
                'width': 0
            }, {
                duration: options.speed,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                }
            });
            $('div[id="simpleSlider-square-1-2"]', current).animate({
                'width': 0,
                'margin-left': margin / 2,
                'backgroundPosition': '-' + margin + 'px 0px'
            }, {
                duration: options.speed,
                step: $.simpleSlider.stepMethodBackgroundPosition,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            });
        }
    );

    // split slide vertical
    $.simpleSlider.addEffect('splitSlideVertical',
        function (current, next, opts) {
            var options = $.extend({}, this.getOptions(), opts, {squaresPerHeight: 2, squaresPerWidth: 1});
            var self    = this;
            var margin  = parseInt(current.css('height'));

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var dimension = $.simpleSlider.buildSquareMatrix(current, options);

            $('img:first', current).hide();
            $('div[id*="simpleSlider-square"]', current).show();
            $('div[id="simpleSlider-square-1-1"]', current).animate({
                'height': 0
            }, {
                duration: options.speed,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                }
            });
            $('div[id="simpleSlider-square-2-1"]', current).animate({
                'height': 0,
                'margin-top': margin / 2,
                'backgroundPosition': '0px -' + margin + 'px'
            }, {
                duration: options.speed,
                step: $.simpleSlider.stepMethodBackgroundPosition,
                complete: function () {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            });
        }
    );

    // swirl
    $.simpleSlider.addEffect('swirl',
        function (current, next, opts) {
            var options  = $.extend({}, this.getOptions(), opts);
            var self     = this;
            var spw      = options.squaresPerWidth;
            var sph      = options.squaresPerHeight;
            var callback = function () {
                if ($('div[id*="simpleSlider-square-"]:visible', current).length === 0) {
                    $('div[id*="simpleSlider-square-"]', current).remove();
                    self.complete();
                }
            }

            next.css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            current.css('z-index', options.zIndex + 100);

            var speedModifier = spw > sph ? (spw * sph) / spw : (spw * sph) / sph;
            var delayModifier = (spw * sph);
            var dimension = $.simpleSlider.buildSquareMatrix(current, options);
            $('img:first', current).hide();

            var dowhile = true;
            var index = 0;
            var dir = 0;
            var col = 1;
            var row = 1;

            while (dowhile) {
                var count = (dir == 0 || dir == 2) ? spw : sph;

                for (var i = 1; i <= count; i++) {
                    var square = $('div[id="simpleSlider-square-' + row + '-' + col + '"]', current);

                    if (i == count) {
                        dir = ++dir % 4;
                    }

                    switch (dir) {
                        case 0:
                            col++;
                            spw = i == count ? --spw : spw;
                            break;

                        case 1:
                            row++;
                            sph = i == count ? --sph : sph;
                            break;

                        case 2:
                            col--;
                            spw = i == count ? --spw : spw;
                            break;

                        case 3:
                            row--;
                            sph = i == count ? --sph : sph;
                            break;
                    }

                    square.delay((options.speed / delayModifier) * index).fadeOut(options.speed / speedModifier, callback);
                    index++;
                }

                var maxSquares = sph > spw ? sph : spw;
                var minSquares = sph < spw ? sph : spw;
                var check = maxSquares - minSquares;

                dowhile = (spw > check) || (sph > check);
            }
        }
    );

})(jQuery);
