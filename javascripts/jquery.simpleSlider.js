/**
 * simpleSlider - jQuery plugin
 *
 * @version: 1.1.0 - (2011/09/18)
 * @author Henning Huncke
 *
 * Copyright (c) 2011 Henning Huncke (http://www.devjunkie.de)
 * Licensed under the GPL (LICENSE) licens.
 *
 * Built for jQuery library
 * http://jquery.com
 */
 

(function($) {

    /** 
     * static constructs
     ********************************************************************************/
    $.simpleSlider = {
        version: '1.1.0',
    
        addEffect: function (name, fn) {
            effects[name] = fn;
        },
        
        defaults: {
            height: 260,                // height of the slider panel
            width: 600,                 // width of the slider panel
            zIndex: 9000,               // z-index offset

            auto: true,                 // slide automaticly
            delay: 3000,                // delay between images in ms
            effect: 'random',           // "random" => random effect or "vertical", "horizontal", ...
            index: 0,                   // index of the first image to show
            keepSlide: true,            // keep automatic sliding
            speed: 1200,                // animation speed
            titleOpacity: 0.7,          // opacity of the title
            titleSpeed: 500,            // speed of title fade in ms
            
            hoverPause: true,           // pause slide on hover
            navigation: true,           // show previous, next and buttons
            numeric: false,             // show the buttons as numeric
            nextText: 'next',           // text showing on the next button
            title: true,                // show the image title
            previousText: 'prev'        // text showing on the previous button
        }
    };
    /********************************************************************************/
    
    
    var instances   = [];
    var effects     = [];
    
    
    /**
     * default effects
     ********************************************************************************/
    // random effect
    $.simpleSlider.addEffect('random',
        function (current, next, opts) {
            var name = opts.last;
            var effect = null;
            
            do {
                for (key in effects) {
                    if (key != 'random') {
                        if (parseInt(Math.random() * 2) == 1) {
                            name = key;
                            break;
                        }
                    }
                }
            } while(opts.last == name);
            
            effect = effects[name];
            if (effect) {
                effect.call(this, current, next, opts);
            }
            return name;
        }
    );
     
    // the simple horizontal slide effect
    $.simpleSlider.addEffect('horizontal',
        function (current, next, opts) {
            var options = this.getOptions();
        
            $(next).css({
                'top': 0,
                'left': parseInt(opts.direction + options.width) * -1,
                'z-index': options.zIndex + 100
            }).show().animate({
                'left': opts.direction + '=' + options.width
            }, options.speed);
            
            $(current).css({
                'z-index': options.zIndex + 90
            }).animate({
                'left': opts.direction + '=' + options.width
            }, {
                duration: options.speed,
                complete: this.complete
            });
        }
    );
    
    // the simple vertical slide effect
    $.simpleSlider.addEffect('vertical',
        function (current, next, opts) {
            var options = this.getOptions();
        
            $(next).css({
                'top': parseInt(opts.direction + options.height) * -1,
                'left': 0,
                'z-index': options.zIndex + 100
            }).show().animate({
                'top': opts.direction + '=' + options.height
            }, options.speed);
            
            $(current).css({
                'z-index': options.zIndex + 90
            }).animate({
                'top': opts.direction + '=' + options.height
            }, {
                duration: options.speed,
                complete: this.complete
            });
        }
    );
    
    // the simple fade effect
    $.simpleSlider.addEffect('fade',
        function (current, next, opts) {
            var options = this.getOptions();
            
            $(current).css({
                'z-index': options.zIndex + 100
            });
            
            $(next).css({
                'top': 0,
                'left': 0,
                'z-index': options.zIndex + 90
            }).show();
            
            $(current).fadeOut(options.speed, this.complete);
        }
    );
    /********************************************************************************/
    
    
    /**
     * slider object
     ********************************************************************************/
    function SimpleSlider(element, options) {
        var self        = this;
        var list        = $('ul:first', element);
        var wrapper     = null;
        var timeout     = null;
        
        var count       = $('li', list).length;
        var index       = 0;
        
        var last        = '';

        var clicked     = false;        
        var slideable   = true;
        var pause       = false;
        
        
        /**
         * initialization needed elements
         */
        function init() {
            // setup the panel
            $(element).css({
                'height': options.height, 
                'width': options.width, 
                'overflow': 'hidden', 
                'position': 'relative'
            }).wrap('<div class="simpleSlider" id="simpleSlider-' + element.id + '" />');
            wrapper = $('#simpleSlider-' + element.id);
                
            // setup the title
            $(element).append('<div class="simpleSlider-title" id="simpleSlider-' + element.id + '-title" />');
            var title = getTitle();
            $(title).css({
                'bottom': 0, 
                'left': 0, 
                'width': options.width - parseInt($(title).css('padding-left')) - parseInt($(title).css('padding-right')),
                'opacity': options.titleOpacity,
                'position': 'absolute',
                'z-index': options.zIndex + 120
            }).hide();
            
            // setup all list elements
            $('li', list).css({
                'position': 'absolute',
                'z-index': options.zIndex + 100
            }).each(function () {
                $('div:first', this).hide();
            });
        };
        
        /**
         * initialization the navigation elements
         */
        function initNavigation() {
            // setup navigation buttons
            $(wrapper).append('<ol class="simpleSlider-navigation-buttons" id="simpleSlider-' + element.id + '-navigation-buttons" />');
            var buttons = getNavigationButtons();
            
            $(buttons).css({'z-index': options.zIndex + 120});
            for (var i = 1; i <= count; i++) {
                var li = $(buttons).append('<li />').find('li:last');
                var link = options.numeric ? i : '';
                $(li).append('<a class="simpleSlider-navigation-button" id="simpleSlider-' + element.id + '-navigation-button-' + i + '" href="javascript:void(0);" rel="' + (i - 1) + '">' + link + '</a>');
            }
            
            // setup navigation (prev, next)
            $(element).append('<div class="simpleSlider-navigation" id="simpleSlider-' + element.id + '-navigation" style="position: absolute" />');
            var navigation = getNavigation();
            
            $(navigation).css({'width': options.width, 'height': options.height, 'z-index': options.zIndex + 110})
                .append('<a class="simpleSlider-navigation-previous" id="simpleSlider-' + element.id + '-navigation-previous" href="javascript:void(0);" rel="prev">' + options.previousText + '</a>')
                .append('<a class="simpleSlider-navigation-next" id="simpleSlider-' + element.id + '-navigation-next" href="javascript:void(0);" rel="next">' + options.nextText + '</a>');
                
            $('a:[class*="simpleSlider-navigation"]', $(wrapper)).click(function () {
                clearTimeout(timeout);
                slide($(this).attr('rel'), true);
            });
            
            $(getNavigation(true) + ', ' + getTitle(true)).mouseover(function () {
                if (options.hoverPause) {
                    clearTimeout(timeout);
                    pause = true;
                }
                
                $(getButtonPrevious(true) + ', ' + getButtonNext(true)).show();
            }).mouseout(function () {
                pause = false;
                $(getButtonPrevious(true) + ', ' + getButtonNext(true)).hide();
                resetTimeout();
            });
            
            $(getButtonPrevious(true) + ', ' + getButtonNext(true)).hide();
        };
        
        
        /**
         * returns the next button element
         */ 
        function getButtonNext(asSelector) {
            var selector = '#simpleSlider-' + element.id + '-navigation-next';
            if (asSelector) {
                return selector;
            }
            return $(selector, wrapper);
        };
        
        
        /**
         * returns the previous button element
         */ 
        function getButtonPrevious(asSelector) {
            var selector = '#simpleSlider-' + element.id + '-navigation-previous';
            if (asSelector) {
                return selector;
            }
            return $(selector, wrapper);
        };
        
        
        /**
         * returns the element by given index
         */
        function getElement(i) {
            return $('li:eq(' + i + ')', $('ul:first', element));
        };
        
        
        /**
         * returns the index by given modifier
         */
        function getIndex(modifier) {
            if (!modifier) {
                return index;
            }
            return (index + modifier) < 0 ? count - 1 : (index + modifier) >= count ? 0 : (index + modifier);
        };
        
        
        /**
         * returns the navigation element (prev, next)
         */ 
        function getNavigation(asSelector) {
            var selector = '#simpleSlider-' + element.id + '-navigation';
            if (asSelector) {
                return selector;
            }
            return $(selector, wrapper);
        };
        

        /**
         * returns the navigation buttons element
         */        
        function getNavigationButtons(asSelector) {
            var selector = '#simpleSlider-' + element.id + '-navigation-buttons';
            if (asSelector) {
                return selector;
            }
            return $(selector, wrapper);
        };
        
        
        /**
         * returns the title element or the selector
         */
        function getTitle(asSelector) {
            var selector = '#simpleSlider-' + element.id + '-title';
            if (asSelector) {
                return selector;
            }
            return $(selector, wrapper);
        };
        
        
        /**
         * reset the timeout
         */
        function resetTimeout() {
            if (pause) {
                return;
            }
        
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            
            if (!clicked || options.keepSlide) {
                if (options.auto) {
                    timeout = setTimeout(function () {
                        slide('auto', false);
                    }, options.delay);
                }
            }
        };
        
        
        /**
         * reset the title element
         */
        function resetTitle() {
            if (!options.title) {
                return;
            }
            
            var text = $('div:first', getElement(index)).html();

            if (text === null) {
                text = '';
            }
            
            $(getTitle()).fadeOut(function () {
                if (text.length != 0) {
                    $(this).html(text).fadeIn(options.titleSpeed);
                }
            });
        };
        
        
        /**
         * reset the navigation
         */
        function resetNavigation() {
            var buttons = getNavigationButtons();
            $('a', buttons).removeClass('current');
            $('li:eq(' + index + ') a', buttons).addClass('current');
        };
        
        
        /**
         * reset all list elements
         */
        function resetListElements(nextIndex) {
            for (var i = 0; i < count; i++) {
                if (i == index || i == nextIndex) {
                    continue;
                }
                
                $(getElement(i)).css('z-index', options.zIndex);
            }
        };
    
        
        /**
         * starts the slide
         */
        function slide(to, click) {
            var effect      = null;
            var name        = '';
            var opts        = {};
            var nextIndex   = 0;
            var direction   = '+';
            var current     = null;
            var next        = null;
            
            if (!slideable) {
                return;
            }
            
            slideable = false;
            clicked = click;
            
            switch (to) {
                case 'auto':
                case 'next': 
                    nextIndex = getIndex(1);
                    break;
                
                case 'prev':
                    nextIndex = getIndex(-1);
                    direction = '+';
                    break;
                    
                default:
                    nextIndex = parseInt(to);
                    nextIndex = nextIndex < count && nextIndex >= 0 ? nextIndex : 0;
                    if (nextIndex < index) {
                        direction = '+';
                    }
                    break;
            }
            
            if (index != nextIndex) {
                current = getElement(index);
                next = getElement(nextIndex);
                index = nextIndex;
                $.extend(opts, {direction: direction});
                
                if ($.isArray(options.effect)) {
                    do {
                        name = options.effect[Math.floor(Math.random() * options.effect.length)];
                    } while(name == last);
                    last = name;
                } else if (options.effect == 'random') {
                    direction = Math.floor(Math.random() * 2) == 0 ? '+' : '-';
                    $.extend(opts, {last: last, direction: direction});
                    name = 'random';
                } else {
                    name = options.effect;
                }
                
                var effect = effects[name];
                
                if (effect) {
                    resetListElements();
                    var result = effect.call(self, current, next, opts);
                    if (options.effect == 'random') {
                        last = result;
                    }
                }
            } else {
                resetTimeout();
                slideable = true;
            }
        };
        
        
        // API methods
        $.extend(self, {
            /**
             * public method for slide to previous
             */
            previous: function () {
                self.slide('prev', true);
                return self;
            },
            
            /**
             * public method to slide to next
             */
            next: function () {
                self.slide('next', true);
                return self;
            },
            
            /**
             * public method to finishing the slide (must be called after the slide is finished)
             */
            complete: function () {
                resetNavigation();
                resetTitle(getElement(index));
                resetTimeout(clicked);
                slideable = true;
            },
            
            /**
             * public method to get current options
             */
            getOptions: function () {
                return options;
            }
        });
  
        init();
        if (options.navigation) {
            initNavigation();
        }
        
        index = options.index < 0 ? count - 1 : options.index >= count ? 0 : options.index;
        resetNavigation();
        resetTitle(getElement(index));
        resetListElements();
        if (options.auto) {
            resetTimeout();
        }
    };
    /********************************************************************************/
    
    
    /**
     * jQuery plugin initialization
     ********************************************************************************/
    $.fn.simpleSlider = function (options) {
        var element = this;
        var dataName = 'simpleSlider';
        
        // if already constructed the return it
        if (element.data(dataName)) {
            return element.data(dataName);
        }
        
        options = $.extend(true, {}, $.simpleSlider.defaults, options);
        
        this.each(function () {
            element = new SimpleSlider(this, options);
            instances.push(element);
            $(this).data(dataName, element);
        });
        
        return this;
    };
    /********************************************************************************/
    
})(jQuery);
