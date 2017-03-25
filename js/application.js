/*================================================================
App bluerabbit
==================================================================*/
'use strict';

var app = angular.module('bluerabbit', ['ngRoute','ngResource','ngCookies','ngToast','ngAnimate','ui.bootstrap','googleplus','facebook', 'angular.filter', 'slickCarousel', 'ngImgCrop']);

app.constant('URL', {
  //BASE_URL: "http://ec2-35-164-152-22.us-west-2.compute.amazonaws.com:9000"
  BASE_URL: "http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com:9000"
  //BASE_URL: "http://localhost:9000"
  //BASE_URL: "http://192.168.0.84:9000"
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/landing', {
          controller: 'mainController',
          templateUrl: './partials/_page-landing.html'
    })
    	.when('/product-description', {
            controller: '',
            templateUrl: './partials/_product-description.html'
    	})
    	.when('/checkout', {
            controller: 'checkoutCtrl',
            templateUrl: './partials/cart-page.html'
    	})
    	.when('/search-page', {
            controller: 'productController',
            templateUrl: './partials/_page-search.html'
    	})
    	.when('/myaccount', {
            controller: 'loginController',
            templateUrl: './partials/_myaccount.html'
    	})
    	// .when('/login', {
      //       controller: 'loginController',
      //       templateUrl: './partials/login.html'
    	// })
    	// .when('/signup', {
      //       controller: 'loginController',
      //       templateUrl: './partials/signup.html'
    	// })
    	.when('/products', {
            controller: '',
            templateUrl: './partials/_products-page.html'
    	})

    	.otherwise({ redirectTo: '/landing' });


}]);

//google plus config
app.config(['GooglePlusProvider','FacebookProvider', function(GooglePlusProvider,FacebookProvider) {
     GooglePlusProvider.init({
       clientId: '395593907364-cc9p9l4njfd08koqqoouqucgd2u4hbo6.apps.googleusercontent.com',
       apiKey: 'eMDg9klaLT6SqzxwEDDjXupk'
     });
     FacebookProvider.init({
         appId:'1272767759478704'
    });
}]);

app.run(function($rootScope, $location) {

 $rootScope.$on('$routeChangeSuccess', function (event, currentRoute, previousRoute) {
   window.scrollTo(0, 0);
 });
});

/*! lightslider - v1.1.6 - 2016-10-25
* https://github.com/sachinchoolur/lightslider
* Copyright (c) 2016 Sachin N; Licensed MIT */
(function ($, undefined) {
    'use strict';
    var defaults = {
        item: 3,
        autoWidth: false,
        slideMove: 1,
        slideMargin: 10,
        addClass: '',
        mode: 'slide',
        useCSS: true,
        cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',
        easing: 'linear', //'for jquery animation',//
        speed: 400, //ms'
        auto: false,
        pauseOnHover: false,
        loop: false,
        slideEndAnimation: true,
        pause: 2000,
        keyPress: false,
        controls: true,
        prevHtml: '',
        nextHtml: '',
        rtl: false,
        adaptiveHeight: false,
        vertical: false,
        verticalHeight: 500,
        vThumbWidth: 100,
        thumbItem: 10,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
        enableTouch: true,
        enableDrag: true,
        freeMove: true,
        swipeThreshold: 40,
        responsive: [],
        /* jshint ignore:start */
        onBeforeStart: function ($el) {},
        onSliderLoad: function ($el) {},
        onBeforeSlide: function ($el, scene) {},
        onAfterSlide: function ($el, scene) {},
        onBeforeNextSlide: function ($el, scene) {},
        onBeforePrevSlide: function ($el, scene) {}
        /* jshint ignore:end */
    };
    $.fn.lightSlider = function (options) {
        if (this.length === 0) {
            return this;
        }

        if (this.length > 1) {
            this.each(function () {
                $(this).lightSlider(options);
            });
            return this;
        }

        var plugin = {},
            settings = $.extend(true, {}, defaults, options),
            settingsTemp = {},
            $el = this;
        plugin.$el = this;

        if (settings.mode === 'fade') {
            settings.vertical = false;
        }
        var $children = $el.children(),
            windowW = $(window).width(),
            breakpoint = null,
            resposiveObj = null,
            length = 0,
            w = 0,
            on = false,
            elSize = 0,
            $slide = '',
            scene = 0,
            property = (settings.vertical === true) ? 'height' : 'width',
            gutter = (settings.vertical === true) ? 'margin-bottom' : 'margin-right',
            slideValue = 0,
            pagerWidth = 0,
            slideWidth = 0,
            thumbWidth = 0,
            interval = null,
            isTouch = ('ontouchstart' in document.documentElement);
        var refresh = {};

        refresh.chbreakpoint = function () {
            windowW = $(window).width();
            if (settings.responsive.length) {
                var item;
                if (settings.autoWidth === false) {
                    item = settings.item;
                }
                if (windowW < settings.responsive[0].breakpoint) {
                    for (var i = 0; i < settings.responsive.length; i++) {
                        if (windowW < settings.responsive[i].breakpoint) {
                            breakpoint = settings.responsive[i].breakpoint;
                            resposiveObj = settings.responsive[i];
                        }
                    }
                }
                if (typeof resposiveObj !== 'undefined' && resposiveObj !== null) {
                    for (var j in resposiveObj.settings) {
                        if (resposiveObj.settings.hasOwnProperty(j)) {
                            if (typeof settingsTemp[j] === 'undefined' || settingsTemp[j] === null) {
                                settingsTemp[j] = settings[j];
                            }
                            settings[j] = resposiveObj.settings[j];
                        }
                    }
                }
                if (!$.isEmptyObject(settingsTemp) && windowW > settings.responsive[0].breakpoint) {
                    for (var k in settingsTemp) {
                        if (settingsTemp.hasOwnProperty(k)) {
                            settings[k] = settingsTemp[k];
                        }
                    }
                }
                if (settings.autoWidth === false) {
                    if (slideValue > 0 && slideWidth > 0) {
                        if (item !== settings.item) {
                            scene = Math.round(slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove));
                        }
                    }
                }
            }
        };

        refresh.calSW = function () {
            if (settings.autoWidth === false) {
                slideWidth = (elSize - ((settings.item * (settings.slideMargin)) - settings.slideMargin)) / settings.item;
            }
        };

        refresh.calWidth = function (cln) {
            var ln = cln === true ? $slide.find('.lslide').length : $children.length;
            if (settings.autoWidth === false) {
                w = ln * (slideWidth + settings.slideMargin);
            } else {
                w = 0;
                for (var i = 0; i < ln; i++) {
                    w += (parseInt($children.eq(i).width()) + settings.slideMargin);
                }
            }
            return w;
        };
        plugin = {
            doCss: function () {
                var support = function () {
                    var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
                    var root = document.documentElement;
                    for (var i = 0; i < transition.length; i++) {
                        if (transition[i] in root.style) {
                            return true;
                        }
                    }
                };
                if (settings.useCSS && support()) {
                    return true;
                }
                return false;
            },
            keyPress: function () {
                if (settings.keyPress) {
                    $(document).on('keyup.lightslider', function (e) {
                        if (!$(':focus').is('input, textarea')) {
                            if (e.preventDefault) {
                                e.preventDefault();
                            } else {
                                e.returnValue = false;
                            }
                            if (e.keyCode === 37) {
                                $el.goToPrevSlide();
                            } else if (e.keyCode === 39) {
                                $el.goToNextSlide();
                            }
                        }
                    });
                }
            },
            controls: function () {
                if (settings.controls) {
                    $el.after('<div class="lSAction"><a class="lSPrev">' + settings.prevHtml + '</a><a class="lSNext">' + settings.nextHtml + '</a></div>');
                    if (!settings.autoWidth) {
                        if (length <= settings.item) {
                            $slide.find('.lSAction').hide();
                        }
                    } else {
                        if (refresh.calWidth(false) < elSize) {
                            $slide.find('.lSAction').hide();
                        }
                    }
                    $slide.find('.lSAction a').on('click', function (e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        } else {
                            e.returnValue = false;
                        }
                        if ($(this).attr('class') === 'lSPrev') {
                            $el.goToPrevSlide();
                        } else {
                            $el.goToNextSlide();
                        }
                        return false;
                    });
                }
            },
            initialStyle: function () {
                var $this = this;
                if (settings.mode === 'fade') {
                    settings.autoWidth = false;
                    settings.slideEndAnimation = false;
                }
                if (settings.auto) {
                    settings.slideEndAnimation = false;
                }
                if (settings.autoWidth) {
                    settings.slideMove = 1;
                    settings.item = 1;
                }
                if (settings.loop) {
                    settings.slideMove = 1;
                    settings.freeMove = false;
                }
                settings.onBeforeStart.call(this, $el);
                refresh.chbreakpoint();
                $el.addClass('lightSlider').wrap('<div class="lSSlideOuter ' + settings.addClass + '"><div class="lSSlideWrapper"></div></div>');
                $slide = $el.parent('.lSSlideWrapper');
                if (settings.rtl === true) {
                    $slide.parent().addClass('lSrtl');
                }
                if (settings.vertical) {
                    $slide.parent().addClass('vertical');
                    elSize = settings.verticalHeight;
                    $slide.css('height', elSize + 'px');
                } else {
                    elSize = $el.outerWidth();
                }
                $children.addClass('lslide');
                if (settings.loop === true && settings.mode === 'slide') {
                    refresh.calSW();
                    refresh.clone = function () {
                        if (refresh.calWidth(true) > elSize) {
                            /**/
                            var tWr = 0,
                                tI = 0;
                            for (var k = 0; k < $children.length; k++) {
                                tWr += (parseInt($el.find('.lslide').eq(k).width()) + settings.slideMargin);
                                tI++;
                                if (tWr >= (elSize + settings.slideMargin)) {
                                    break;
                                }
                            }
                            var tItem = settings.autoWidth === true ? tI : settings.item;

                            /**/
                            if (tItem < $el.find('.clone.left').length) {
                                for (var i = 0; i < $el.find('.clone.left').length - tItem; i++) {
                                    $children.eq(i).remove();
                                }
                            }
                            if (tItem < $el.find('.clone.right').length) {
                                for (var j = $children.length - 1; j > ($children.length - 1 - $el.find('.clone.right').length); j--) {
                                    scene--;
                                    $children.eq(j).remove();
                                }
                            }
                            /**/
                            for (var n = $el.find('.clone.right').length; n < tItem; n++) {
                                $el.find('.lslide').eq(n).clone().removeClass('lslide').addClass('clone right').appendTo($el);
                                scene++;
                            }
                            for (var m = $el.find('.lslide').length - $el.find('.clone.left').length; m > ($el.find('.lslide').length - tItem); m--) {
                                $el.find('.lslide').eq(m - 1).clone().removeClass('lslide').addClass('clone left').prependTo($el);
                            }
                            $children = $el.children();
                        } else {
                            if ($children.hasClass('clone')) {
                                $el.find('.clone').remove();
                                $this.move($el, 0);
                            }
                        }
                    };
                    refresh.clone();
                }
                refresh.sSW = function () {
                    length = $children.length;
                    if (settings.rtl === true && settings.vertical === false) {
                        gutter = 'margin-left';
                    }
                    if (settings.autoWidth === false) {
                        $children.css(property, slideWidth + 'px');
                    }
                    $children.css(gutter, settings.slideMargin + 'px');
                    w = refresh.calWidth(false);
                    $el.css(property, w + 'px');
                    if (settings.loop === true && settings.mode === 'slide') {
                        if (on === false) {
                            scene = $el.find('.clone.left').length;
                        }
                    }
                };
                refresh.calL = function () {
                    $children = $el.children();
                    length = $children.length;
                };
                if (this.doCss()) {
                    $slide.addClass('usingCss');
                }
                refresh.calL();
                if (settings.mode === 'slide') {
                    refresh.calSW();
                    refresh.sSW();
                    if (settings.loop === true) {
                        slideValue = $this.slideValue();
                        this.move($el, slideValue);
                    }
                    if (settings.vertical === false) {
                        this.setHeight($el, false);
                    }

                } else {
                    this.setHeight($el, true);
                    $el.addClass('lSFade');
                    if (!this.doCss()) {
                        $children.fadeOut(0);
                        $children.eq(scene).fadeIn(0);
                    }
                }
                if (settings.loop === true && settings.mode === 'slide') {
                    $children.eq(scene).addClass('active');
                } else {
                    $children.first().addClass('active');
                }
            },
            pager: function () {
                var $this = this;
                refresh.createPager = function () {
                    thumbWidth = (elSize - ((settings.thumbItem * (settings.thumbMargin)) - settings.thumbMargin)) / settings.thumbItem;
                    var $children = $slide.find('.lslide');
                    var length = $slide.find('.lslide').length;
                    var i = 0,
                        pagers = '',
                        v = 0;
                    for (i = 0; i < length; i++) {
                        if (settings.mode === 'slide') {
                            // calculate scene * slide value
                            if (!settings.autoWidth) {
                                v = i * ((slideWidth + settings.slideMargin) * settings.slideMove);
                            } else {
                                v += ((parseInt($children.eq(i).width()) + settings.slideMargin) * settings.slideMove);
                            }
                        }
                        var thumb = $children.eq(i * settings.slideMove).attr('data-thumb');
                        if (settings.gallery === true) {
                            pagers += '<li style="width:100%;' + property + ':' + thumbWidth + 'px;' + gutter + ':' + settings.thumbMargin + 'px"><a href="#"><img src="' + thumb + '" /></a></li>';
                        } else {
                            pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                        }
                        if (settings.mode === 'slide') {
                            if ((v) >= w - elSize - settings.slideMargin) {
                                i = i + 1;
                                var minPgr = 2;
                                if (settings.autoWidth) {
                                    pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                                    minPgr = 1;
                                }
                                if (i < minPgr) {
                                    pagers = null;
                                    $slide.parent().addClass('noPager');
                                } else {
                                    $slide.parent().removeClass('noPager');
                                }
                                break;
                            }
                        }
                    }
                    var $cSouter = $slide.parent();
                    $cSouter.find('.lSPager').html(pagers); 
                    if (settings.gallery === true) {
                        if (settings.vertical === true) {
                            // set Gallery thumbnail width
                            $cSouter.find('.lSPager').css('width', settings.vThumbWidth + 'px');
                        }
                        pagerWidth = (i * (settings.thumbMargin + thumbWidth)) + 0.5;
                        $cSouter.find('.lSPager').css({
                            property: pagerWidth + 'px',
                            'transition-duration': settings.speed + 'ms'
                        });
                        if (settings.vertical === true) {
                            $slide.parent().css('padding-right', (settings.vThumbWidth + settings.galleryMargin) + 'px');
                        }
                        $cSouter.find('.lSPager').css(property, pagerWidth + 'px');
                    }
                    var $pager = $cSouter.find('.lSPager').find('li');
                    $pager.first().addClass('active');
                    $pager.on('click', function () {
                        if (settings.loop === true && settings.mode === 'slide') {
                            scene = scene + ($pager.index(this) - $cSouter.find('.lSPager').find('li.active').index());
                        } else {
                            scene = $pager.index(this);
                        }
                        $el.mode(false);
                        if (settings.gallery === true) {
                            $this.slideThumb();
                        }
                        return false;
                    });
                };
                if (settings.pager) {
                    var cl = 'lSpg';
                    if (settings.gallery) {
                        cl = 'lSGallery';
                    }
                    $slide.after('<ul class="lSPager ' + cl + '"></ul>');
                    var gMargin = (settings.vertical) ? 'margin-left' : 'margin-top';
                    $slide.parent().find('.lSPager').css(gMargin, settings.galleryMargin + 'px');
                    refresh.createPager();
                }

                setTimeout(function () {
                    refresh.init();
                }, 0);
            },
            setHeight: function (ob, fade) {
                var obj = null,
                    $this = this;
                if (settings.loop) {
                    obj = ob.children('.lslide ').first();
                } else {
                    obj = ob.children().first();
                }
                var setCss = function () {
                    var tH = obj.outerHeight(),
                        tP = 0,
                        tHT = tH;
                    if (fade) {
                        tH = 0;
                        tP = ((tHT) * 100) / elSize;
                    }
                    ob.css({
                        'height': tH + 'px',
                        'padding-bottom': tP + '%'
                    });
                };
                setCss();
                if (obj.find('img').length) {
                    if ( obj.find('img')[0].complete) {
                        setCss();
                        if (!interval) {
                            $this.auto();
                        }   
                    }else{
                        obj.find('img').on('load', function () {
                            setTimeout(function () {
                                setCss();
                                if (!interval) {
                                    $this.auto();
                                }
                            }, 100);
                        });
                    }
                }else{
                    if (!interval) {
                        $this.auto();
                    }
                }
            },
            active: function (ob, t) {
                if (this.doCss() && settings.mode === 'fade') {
                    $slide.addClass('on');
                }
                var sc = 0;
                if (scene * settings.slideMove < length) {
                    ob.removeClass('active');
                    if (!this.doCss() && settings.mode === 'fade' && t === false) {
                        ob.fadeOut(settings.speed);
                    }
                    if (t === true) {
                        sc = scene;
                    } else {
                        sc = scene * settings.slideMove;
                    }
                    //t === true ? sc = scene : sc = scene * settings.slideMove;
                    var l, nl;
                    if (t === true) {
                        l = ob.length;
                        nl = l - 1;
                        if (sc + 1 >= l) {
                            sc = nl;
                        }
                    }
                    if (settings.loop === true && settings.mode === 'slide') {
                        //t === true ? sc = scene - $el.find('.clone.left').length : sc = scene * settings.slideMove;
                        if (t === true) {
                            sc = scene - $el.find('.clone.left').length;
                        } else {
                            sc = scene * settings.slideMove;
                        }
                        if (t === true) {
                            l = ob.length;
                            nl = l - 1;
                            if (sc + 1 === l) {
                                sc = nl;
                            } else if (sc + 1 > l) {
                                sc = 0;
                            }
                        }
                    }

                    if (!this.doCss() && settings.mode === 'fade' && t === false) {
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                    ob.eq(sc).addClass('active');
                } else {
                    ob.removeClass('active');
                    ob.eq(ob.length - 1).addClass('active');
                    if (!this.doCss() && settings.mode === 'fade' && t === false) {
                        ob.fadeOut(settings.speed);
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                }
            },
            move: function (ob, v) {
                if (settings.rtl === true) {
                    v = -v;
                }
                if (this.doCss()) {
                    if (settings.vertical === true) {
                        ob.css({
                            'transform': 'translate3d(0px, ' + (-v) + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, ' + (-v) + 'px, 0px)'
                        });
                    } else {
                        ob.css({
                            'transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                            '-webkit-transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                        });
                    }
                } else {
                    if (settings.vertical === true) {
                        ob.css('position', 'relative').animate({
                            top: -v + 'px'
                        }, settings.speed, settings.easing);
                    } else {
                        ob.css('position', 'relative').animate({
                            left: -v + 'px'
                        }, settings.speed, settings.easing);
                    }
                }
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            fade: function () {
                this.active($children, false);
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            slide: function () {
                var $this = this;
                refresh.calSlide = function () {
                    if (w > elSize) {
                        slideValue = $this.slideValue();
                        $this.active($children, false);
                        if ((slideValue) > w - elSize - settings.slideMargin) {
                            slideValue = w - elSize - settings.slideMargin;
                        } else if (slideValue < 0) {
                            slideValue = 0;
                        }
                        $this.move($el, slideValue);
                        if (settings.loop === true && settings.mode === 'slide') {
                            if (scene >= (length - ($el.find('.clone.left').length / settings.slideMove))) {
                                $this.resetSlide($el.find('.clone.left').length);
                            }
                            if (scene === 0) {
                                $this.resetSlide($slide.find('.lslide').length);
                            }
                        }
                    }
                };
                refresh.calSlide();
            },
            resetSlide: function (s) {
                var $this = this;
                $slide.find('.lSAction a').addClass('disabled');
                setTimeout(function () {
                    scene = s;
                    $slide.css('transition-duration', '0ms');
                    slideValue = $this.slideValue();
                    $this.active($children, false);
                    plugin.move($el, slideValue);
                    setTimeout(function () {
                        $slide.css('transition-duration', settings.speed + 'ms');
                        $slide.find('.lSAction a').removeClass('disabled');
                    }, 50);
                }, settings.speed + 100);
            },
            slideValue: function () {
                var _sV = 0;
                if (settings.autoWidth === false) {
                    _sV = scene * ((slideWidth + settings.slideMargin) * settings.slideMove);
                } else {
                    _sV = 0;
                    for (var i = 0; i < scene; i++) {
                        _sV += (parseInt($children.eq(i).width()) + settings.slideMargin);
                    }
                }
                return _sV;
            },
            slideThumb: function () {
                var position;
                switch (settings.currentPagerPosition) {
                case 'left':
                    position = 0;
                    break;
                case 'middle':
                    position = (elSize / 2) - (thumbWidth / 2);
                    break;
                case 'right':
                    position = elSize - thumbWidth;
                }
                var sc = scene - $el.find('.clone.left').length;
                var $pager = $slide.parent().find('.lSPager');
                if (settings.mode === 'slide' && settings.loop === true) {
                    if (sc >= $pager.children().length) {
                        sc = 0;
                    } else if (sc < 0) {
                        sc = $pager.children().length;
                    }
                }
                var thumbSlide = sc * ((thumbWidth + settings.thumbMargin)) - (position);
                if ((thumbSlide + elSize) > pagerWidth) {
                    thumbSlide = pagerWidth - elSize - settings.thumbMargin;
                }
                if (thumbSlide < 0) {
                    thumbSlide = 0;
                }
                this.move($pager, thumbSlide);
            },
            auto: function () {
                if (settings.auto) {
                    clearInterval(interval);
                    interval = setInterval(function () {
                        $el.goToNextSlide();
                    }, settings.pause);
                }
            },
            pauseOnHover: function(){
                var $this = this;
                if (settings.auto && settings.pauseOnHover) {
                    $slide.on('mouseenter', function(){
                        $(this).addClass('ls-hover');
                        $el.pause();
                        settings.auto = true;
                    });
                    $slide.on('mouseleave',function(){
                        $(this).removeClass('ls-hover');
                        if (!$slide.find('.lightSlider').hasClass('lsGrabbing')) {
                            $this.auto();
                        }
                    });
                }
            },
            touchMove: function (endCoords, startCoords) {
                $slide.css('transition-duration', '0ms');
                if (settings.mode === 'slide') {
                    var distance = endCoords - startCoords;
                    var swipeVal = slideValue - distance;
                    if ((swipeVal) >= w - elSize - settings.slideMargin) {
                        if (settings.freeMove === false) {
                            swipeVal = w - elSize - settings.slideMargin;
                        } else {
                            var swipeValT = w - elSize - settings.slideMargin;
                            swipeVal = swipeValT + ((swipeVal - swipeValT) / 5);

                        }
                    } else if (swipeVal < 0) {
                        if (settings.freeMove === false) {
                            swipeVal = 0;
                        } else {
                            swipeVal = swipeVal / 5;
                        }
                    }
                    this.move($el, swipeVal);
                }
            },

            touchEnd: function (distance) {
                $slide.css('transition-duration', settings.speed + 'ms');
                if (settings.mode === 'slide') {
                    var mxVal = false;
                    var _next = true;
                    slideValue = slideValue - distance;
                    if ((slideValue) > w - elSize - settings.slideMargin) {
                        slideValue = w - elSize - settings.slideMargin;
                        if (settings.autoWidth === false) {
                            mxVal = true;
                        }
                    } else if (slideValue < 0) {
                        slideValue = 0;
                    }
                    var gC = function (next) {
                        var ad = 0;
                        if (!mxVal) {
                            if (next) {
                                ad = 1;
                            }
                        }
                        if (!settings.autoWidth) {
                            var num = slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove);
                            scene = parseInt(num) + ad;
                            if (slideValue >= (w - elSize - settings.slideMargin)) {
                                if (num % 1 !== 0) {
                                    scene++;
                                }
                            }
                        } else {
                            var tW = 0;
                            for (var i = 0; i < $children.length; i++) {
                                tW += (parseInt($children.eq(i).width()) + settings.slideMargin);
                                scene = i + ad;
                                if (tW >= slideValue) {
                                    break;
                                }
                            }
                        }
                    };
                    if (distance >= settings.swipeThreshold) {
                        gC(false);
                        _next = false;
                    } else if (distance <= -settings.swipeThreshold) {
                        gC(true);
                        _next = false;
                    }
                    $el.mode(_next);
                    this.slideThumb();
                } else {
                    if (distance >= settings.swipeThreshold) {
                        $el.goToPrevSlide();
                    } else if (distance <= -settings.swipeThreshold) {
                        $el.goToNextSlide();
                    }
                }
            },



            enableDrag: function () {
                var $this = this;
                if (!isTouch) {
                    var startCoords = 0,
                        endCoords = 0,
                        isDraging = false;
                    $slide.find('.lightSlider').addClass('lsGrab');
                    $slide.on('mousedown', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        if ($(e.target).attr('class') !== ('lSPrev') && $(e.target).attr('class') !== ('lSNext')) {
                            startCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            isDraging = true;
                            if (e.preventDefault) {
                                e.preventDefault();
                            } else {
                                e.returnValue = false;
                            }
                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            $slide.scrollLeft += 1;
                            $slide.scrollLeft -= 1;
                            // *
                            $slide.find('.lightSlider').removeClass('lsGrab').addClass('lsGrabbing');
                            clearInterval(interval);
                        }
                    });
                    $(window).on('mousemove', function (e) {
                        if (isDraging) {
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            $this.touchMove(endCoords, startCoords);
                        }
                    });
                    $(window).on('mouseup', function (e) {
                        if (isDraging) {
                            $slide.find('.lightSlider').removeClass('lsGrabbing').addClass('lsGrab');
                            isDraging = false;
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            var distance = endCoords - startCoords;
                            if (Math.abs(distance) >= settings.swipeThreshold) {
                                $(window).on('click.ls', function (e) {
                                    if (e.preventDefault) {
                                        e.preventDefault();
                                    } else {
                                        e.returnValue = false;
                                    }
                                    e.stopImmediatePropagation();
                                    e.stopPropagation();
                                    $(window).off('click.ls');
                                });
                            }

                            $this.touchEnd(distance);

                        }
                    });
                }
            },




            enableTouch: function () {
                var $this = this;
                if (isTouch) {
                    var startCoords = {},
                        endCoords = {};
                    $slide.on('touchstart', function (e) {
                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
                        startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
                        clearInterval(interval);
                    });
                    $slide.on('touchmove', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        var orig = e.originalEvent;
                        endCoords = orig.targetTouches[0];
                        var xMovement = Math.abs(endCoords.pageX - startCoords.pageX);
                        var yMovement = Math.abs(endCoords.pageY - startCoords.pageY);
                        if (settings.vertical === true) {
                            if ((yMovement * 3) > xMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageY, startCoords.pageY);
                        } else {
                            if ((xMovement * 3) > yMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageX, startCoords.pageX);
                        }

                    });
                    $slide.on('touchend', function () {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        var distance;
                        if (settings.vertical === true) {
                            distance = endCoords.pageY - startCoords.pageY;
                        } else {
                            distance = endCoords.pageX - startCoords.pageX;
                        }
                        $this.touchEnd(distance);
                    });
                }
            },
            build: function () {
                var $this = this;
                $this.initialStyle();
                if (this.doCss()) {

                    if (settings.enableTouch === true) {
                        $this.enableTouch();
                    }
                    if (settings.enableDrag === true) {
                        $this.enableDrag();
                    }
                }

                $(window).on('focus', function(){
                    $this.auto();
                });
                
                $(window).on('blur', function(){
                    clearInterval(interval);
                });

                $this.pager();
                $this.pauseOnHover();
                $this.controls();
                $this.keyPress();
            }
        };
        plugin.build();
        refresh.init = function () {
            refresh.chbreakpoint();
            if (settings.vertical === true) {
                if (settings.item > 1) {
                    elSize = settings.verticalHeight;
                } else {
                    elSize = $children.outerHeight();
                }
                $slide.css('height', elSize + 'px');
            } else {
                elSize = $slide.outerWidth();
            }
            if (settings.loop === true && settings.mode === 'slide') {
                refresh.clone();
            }
            refresh.calL();
            if (settings.mode === 'slide') {
                $el.removeClass('lSSlide');
            }
            if (settings.mode === 'slide') {
                refresh.calSW();
                refresh.sSW();
            }
            setTimeout(function () {
                if (settings.mode === 'slide') {
                    $el.addClass('lSSlide');
                }
            }, 1000);
            if (settings.pager) {
                refresh.createPager();
            }
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).outerHeight(true));
            }
            if (settings.adaptiveHeight === false) {
                if (settings.mode === 'slide') {
                    if (settings.vertical === false) {
                        plugin.setHeight($el, false);
                    }else{
                        plugin.auto();
                    }
                } else {
                    plugin.setHeight($el, true);
                }
            }
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
            if (settings.mode === 'slide') {
                plugin.slide();
            }
            if (settings.autoWidth === false) {
                if ($children.length <= settings.item) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            } else {
                if ((refresh.calWidth(false) < elSize) && (w !== 0)) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            }
        };
        $el.goToPrevSlide = function () {
            if (scene > 0) {
                settings.onBeforePrevSlide.call(this, $el, scene);
                scene--;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforePrevSlide.call(this, $el, scene);
                    if (settings.mode === 'fade') {
                        var l = (length - 1);
                        scene = parseInt(l / settings.slideMove);
                    }
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimation === true) {
                    $el.addClass('leftEnd');
                    setTimeout(function () {
                        $el.removeClass('leftEnd');
                    }, 400);
                }
            }
        };
        $el.goToNextSlide = function () {
            var nextI = true;
            if (settings.mode === 'slide') {
                var _slideValue = plugin.slideValue();
                nextI = _slideValue < w - elSize - settings.slideMargin;
            }
            if (((scene * settings.slideMove) < length - settings.slideMove) && nextI) {
                settings.onBeforeNextSlide.call(this, $el, scene);
                scene++;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforeNextSlide.call(this, $el, scene);
                    scene = 0;
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimation === true) {
                    $el.addClass('rightEnd');
                    setTimeout(function () {
                        $el.removeClass('rightEnd');
                    }, 400);
                }
            }
        };
        $el.mode = function (_touch) {
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).outerHeight(true));
            }
            if (on === false) {
                if (settings.mode === 'slide') {
                    if (plugin.doCss()) {
                        $el.addClass('lSSlide');
                        if (settings.speed !== '') {
                            $slide.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $slide.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                } else {
                    if (plugin.doCss()) {
                        if (settings.speed !== '') {
                            $el.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $el.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                }
            }
            if (!_touch) {
                settings.onBeforeSlide.call(this, $el, scene);
            }
            if (settings.mode === 'slide') {
                plugin.slide();
            } else {
                plugin.fade();
            }
            if (!$slide.hasClass('ls-hover')) {
                plugin.auto();
            }
            setTimeout(function () {
                if (!_touch) {
                    settings.onAfterSlide.call(this, $el, scene);
                }
            }, settings.speed);
            on = true;
        };
        $el.play = function () {
            $el.goToNextSlide();
            settings.auto = true;
            plugin.auto();
        };
        $el.pause = function () {
            settings.auto = false;
            clearInterval(interval);
        };
        $el.refresh = function () {
            refresh.init();
        };
        $el.getCurrentSlideCount = function () {
            var sc = scene;
            if (settings.loop) {
                var ln = $slide.find('.lslide').length,
                    cl = $el.find('.clone.left').length;
                if (scene <= cl - 1) {
                    sc = ln + (scene - cl);
                } else if (scene >= (ln + cl)) {
                    sc = scene - ln - cl;
                } else {
                    sc = scene - cl;
                }
            }
            return sc + 1;
        }; 
        $el.getTotalSlideCount = function () {
            return $slide.find('.lslide').length;
        };
        $el.goToSlide = function (s) {
            if (settings.loop) {
                scene = (s + $el.find('.clone.left').length - 1);
            } else {
                scene = s;
            }
            $el.mode(false);
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
        };
        $el.destroy = function () {
            if ($el.lightSlider) {
                $el.goToPrevSlide = function(){};
                $el.goToNextSlide = function(){};
                $el.mode = function(){};
                $el.play = function(){};
                $el.pause = function(){};
                $el.refresh = function(){};
                $el.getCurrentSlideCount = function(){};
                $el.getTotalSlideCount = function(){};
                $el.goToSlide = function(){}; 
                $el.lightSlider = null;
                refresh = {
                    init : function(){}
                };
                $el.parent().parent().find('.lSAction, .lSPager').remove();
                $el.removeClass('lightSlider lSFade lSSlide lsGrab lsGrabbing leftEnd right').removeAttr('style').unwrap().unwrap();
                $el.children().removeAttr('style');
                $children.removeClass('lslide active');
                $el.find('.clone').remove();
                $children = null;
                interval = null;
                on = false;
                scene = 0;
            }

        };
        setTimeout(function () {
            settings.onSliderLoad.call(this, $el);
        }, 10);
        $(window).on('resize orientationchange', function (e) {
            setTimeout(function () {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                refresh.init();
            }, 200);
        });
        return this;
    };
}(jQuery));

/*! ngImgCrop v0.3.2 License: MIT */ ! function() {
  "use strict";
  var e = angular.module("ngImgCrop", []);
  e.factory("cropAreaCircle", ["cropArea", function(e) {
    var t = function() {
      e.apply(this, arguments), this._boxResizeBaseSize = 20, this._boxResizeNormalRatio = .9, this._boxResizeHoverRatio = 1.2, this._iconMoveNormalRatio = .9, this._iconMoveHoverRatio = 1.2, this._boxResizeNormalSize = this._boxResizeBaseSize * this._boxResizeNormalRatio, this._boxResizeHoverSize = this._boxResizeBaseSize * this._boxResizeHoverRatio, this._posDragStartX = 0, this._posDragStartY = 0, this._posResizeStartX = 0, this._posResizeStartY = 0, this._posResizeStartSize = 0, this._boxResizeIsHover = !1, this._areaIsHover = !1, this._boxResizeIsDragging = !1, this._areaIsDragging = !1
    };
    return t.prototype = new e, t.prototype._calcCirclePerimeterCoords = function(e) {
      var t = this._size / 2,
        i = e * (Math.PI / 180),
        r = this._x + t * Math.cos(i),
        s = this._y + t * Math.sin(i);
      return [r, s]
    }, t.prototype._calcResizeIconCenterCoords = function() {
      return this._calcCirclePerimeterCoords(-45)
    }, t.prototype._isCoordWithinArea = function(e) {
      return Math.sqrt((e[0] - this._x) * (e[0] - this._x) + (e[1] - this._y) * (e[1] - this._y)) < this._size / 2
    }, t.prototype._isCoordWithinBoxResize = function(e) {
      var t = this._calcResizeIconCenterCoords(),
        i = this._boxResizeHoverSize / 2;
      return e[0] > t[0] - i && e[0] < t[0] + i && e[1] > t[1] - i && e[1] < t[1] + i
    }, t.prototype._drawArea = function(e, t, i) {
      e.arc(t[0], t[1], i / 2, 0, 2 * Math.PI)
    }, t.prototype.draw = function() {
      e.prototype.draw.apply(this, arguments), this._cropCanvas.drawIconMove([this._x, this._y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio), this._cropCanvas.drawIconResizeBoxNESW(this._calcResizeIconCenterCoords(), this._boxResizeBaseSize, this._boxResizeIsHover ? this._boxResizeHoverRatio : this._boxResizeNormalRatio)
    }, t.prototype.processMouseMove = function(e, t) {
      var i = "default",
        r = !1;
      if (this._boxResizeIsHover = !1, this._areaIsHover = !1, this._areaIsDragging) this._x = e - this._posDragStartX, this._y = t - this._posDragStartY, this._areaIsHover = !0, i = "move", r = !0, this._events.trigger("area-move");
      else if (this._boxResizeIsDragging) {
        i = "nesw-resize";
        var s, o, a;
        o = e - this._posResizeStartX, a = this._posResizeStartY - t, s = o > a ? this._posResizeStartSize + 2 * a : this._posResizeStartSize + 2 * o, this._size = Math.max(this._minSize, s), this._boxResizeIsHover = !0, r = !0, this._events.trigger("area-resize")
      } else this._isCoordWithinBoxResize([e, t]) ? (i = "nesw-resize", this._areaIsHover = !1, this._boxResizeIsHover = !0, r = !0) : this._isCoordWithinArea([e, t]) && (i = "move", this._areaIsHover = !0, r = !0);
      return this._dontDragOutside(), angular.element(this._ctx.canvas).css({
        cursor: i
      }), r
    }, t.prototype.processMouseDown = function(e, t) {
      this._isCoordWithinBoxResize([e, t]) ? (this._areaIsDragging = !1, this._areaIsHover = !1, this._boxResizeIsDragging = !0, this._boxResizeIsHover = !0, this._posResizeStartX = e, this._posResizeStartY = t, this._posResizeStartSize = this._size, this._events.trigger("area-resize-start")) : this._isCoordWithinArea([e, t]) && (this._areaIsDragging = !0, this._areaIsHover = !0, this._boxResizeIsDragging = !1, this._boxResizeIsHover = !1, this._posDragStartX = e - this._x, this._posDragStartY = t - this._y, this._events.trigger("area-move-start"))
    }, t.prototype.processMouseUp = function() {
      this._areaIsDragging && (this._areaIsDragging = !1, this._events.trigger("area-move-end")), this._boxResizeIsDragging && (this._boxResizeIsDragging = !1, this._events.trigger("area-resize-end")), this._areaIsHover = !1, this._boxResizeIsHover = !1, this._posDragStartX = 0, this._posDragStartY = 0
    }, t
  }]), e.factory("cropAreaSquare", ["cropArea", function(e) {
    var t = function() {
      e.apply(this, arguments), this._resizeCtrlBaseRadius = 10, this._resizeCtrlNormalRatio = .75, this._resizeCtrlHoverRatio = 1, this._iconMoveNormalRatio = .9, this._iconMoveHoverRatio = 1.2, this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio, this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio, this._posDragStartX = 0, this._posDragStartY = 0, this._posResizeStartX = 0, this._posResizeStartY = 0, this._posResizeStartSize = 0, this._resizeCtrlIsHover = -1, this._areaIsHover = !1, this._resizeCtrlIsDragging = -1, this._areaIsDragging = !1
    };
    return t.prototype = new e, t.prototype._calcSquareCorners = function() {
      var e = this._size / 2;
      return [
        [this._x - e, this._y - e],
        [this._x + e, this._y - e],
        [this._x - e, this._y + e],
        [this._x + e, this._y + e]
      ]
    }, t.prototype._calcSquareDimensions = function() {
      var e = this._size / 2;
      return {
        left: this._x - e,
        top: this._y - e,
        right: this._x + e,
        bottom: this._y + e
      }
    }, t.prototype._isCoordWithinArea = function(e) {
      var t = this._calcSquareDimensions();
      return e[0] >= t.left && e[0] <= t.right && e[1] >= t.top && e[1] <= t.bottom
    }, t.prototype._isCoordWithinResizeCtrl = function(e) {
      for (var t = this._calcSquareCorners(), i = -1, r = 0, s = t.length; s > r; r++) {
        var o = t[r];
        if (e[0] > o[0] - this._resizeCtrlHoverRadius && e[0] < o[0] + this._resizeCtrlHoverRadius && e[1] > o[1] - this._resizeCtrlHoverRadius && e[1] < o[1] + this._resizeCtrlHoverRadius) {
          i = r;
          break
        }
      }
      return i
    }, t.prototype._drawArea = function(e, t, i) {
      var r = i / 2;
      e.rect(t[0] - r, t[1] - r, i, i)
    }, t.prototype.draw = function() {
      e.prototype.draw.apply(this, arguments), this._cropCanvas.drawIconMove([this._x, this._y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);
      for (var t = this._calcSquareCorners(), i = 0, r = t.length; r > i; i++) {
        var s = t[i];
        this._cropCanvas.drawIconResizeCircle(s, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i ? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio)
      }
    }, t.prototype.processMouseMove = function(e, t) {
      var i = "default",
        r = !1;
      if (this._resizeCtrlIsHover = -1, this._areaIsHover = !1, this._areaIsDragging) this._x = e - this._posDragStartX, this._y = t - this._posDragStartY, this._areaIsHover = !0, i = "move", r = !0, this._events.trigger("area-move");
      else if (this._resizeCtrlIsDragging > -1) {
        var s, o;
        switch (this._resizeCtrlIsDragging) {
          case 0:
            s = -1, o = -1, i = "nwse-resize";
            break;
          case 1:
            s = 1, o = -1, i = "nesw-resize";
            break;
          case 2:
            s = -1, o = 1, i = "nesw-resize";
            break;
          case 3:
            s = 1, o = 1, i = "nwse-resize"
        }
        var a, n = (e - this._posResizeStartX) * s,
          h = (t - this._posResizeStartY) * o;
        a = n > h ? this._posResizeStartSize + h : this._posResizeStartSize + n;
        var c = this._size;
        this._size = Math.max(this._minSize, a);
        var l = (this._size - c) / 2;
        this._x += l * s, this._y += l * o, this._resizeCtrlIsHover = this._resizeCtrlIsDragging, r = !0, this._events.trigger("area-resize")
      } else {
        var u = this._isCoordWithinResizeCtrl([e, t]);
        if (u > -1) {
          switch (u) {
            case 0:
              i = "nwse-resize";
              break;
            case 1:
              i = "nesw-resize";
              break;
            case 2:
              i = "nesw-resize";
              break;
            case 3:
              i = "nwse-resize"
          }
          this._areaIsHover = !1, this._resizeCtrlIsHover = u, r = !0
        } else this._isCoordWithinArea([e, t]) && (i = "move", this._areaIsHover = !0, r = !0)
      }
      return this._dontDragOutside(), angular.element(this._ctx.canvas).css({
        cursor: i
      }), r
    }, t.prototype.processMouseDown = function(e, t) {
      var i = this._isCoordWithinResizeCtrl([e, t]);
      i > -1 ? (this._areaIsDragging = !1, this._areaIsHover = !1, this._resizeCtrlIsDragging = i, this._resizeCtrlIsHover = i, this._posResizeStartX = e, this._posResizeStartY = t, this._posResizeStartSize = this._size, this._events.trigger("area-resize-start")) : this._isCoordWithinArea([e, t]) && (this._areaIsDragging = !0, this._areaIsHover = !0, this._resizeCtrlIsDragging = -1, this._resizeCtrlIsHover = -1, this._posDragStartX = e - this._x, this._posDragStartY = t - this._y, this._events.trigger("area-move-start"))
    }, t.prototype.processMouseUp = function() {
      this._areaIsDragging && (this._areaIsDragging = !1, this._events.trigger("area-move-end")), this._resizeCtrlIsDragging > -1 && (this._resizeCtrlIsDragging = -1, this._events.trigger("area-resize-end")), this._areaIsHover = !1, this._resizeCtrlIsHover = -1, this._posDragStartX = 0, this._posDragStartY = 0
    }, t
  }]), e.factory("cropArea", ["cropCanvas", function(e) {
    var t = function(t, i) {
      this._ctx = t, this._events = i, this._minSize = 80, this._cropCanvas = new e(t), this._image = new Image, this._x = 0, this._y = 0, this._size = 200
    };
    return t.prototype.getImage = function() {
      return this._image
    }, t.prototype.setImage = function(e) {
      this._image = e
    }, t.prototype.getX = function() {
      return this._x
    }, t.prototype.setX = function(e) {
      this._x = e, this._dontDragOutside()
    }, t.prototype.getY = function() {
      return this._y
    }, t.prototype.setY = function(e) {
      this._y = e, this._dontDragOutside()
    }, t.prototype.getSize = function() {
      return this._size
    }, t.prototype.setSize = function(e) {
      this._size = Math.max(this._minSize, e), this._dontDragOutside()
    }, t.prototype.getMinSize = function() {
      return this._minSize
    }, t.prototype.setMinSize = function(e) {
      this._minSize = e, this._size = Math.max(this._minSize, this._size), this._dontDragOutside()
    }, t.prototype._dontDragOutside = function() {
      var e = this._ctx.canvas.height,
        t = this._ctx.canvas.width;
      this._size > t && (this._size = t), this._size > e && (this._size = e), this._x < this._size / 2 && (this._x = this._size / 2), this._x > t - this._size / 2 && (this._x = t - this._size / 2), this._y < this._size / 2 && (this._y = this._size / 2), this._y > e - this._size / 2 && (this._y = e - this._size / 2)
    }, t.prototype._drawArea = function() {}, t.prototype.draw = function() {
      this._cropCanvas.drawCropArea(this._image, [this._x, this._y], this._size, this._drawArea)
    }, t.prototype.processMouseMove = function() {}, t.prototype.processMouseDown = function() {}, t.prototype.processMouseUp = function() {}, t
  }]), e.factory("cropCanvas", [function() {
    var e = [
        [-.5, -2],
        [-3, -4.5],
        [-.5, -7],
        [-7, -7],
        [-7, -.5],
        [-4.5, -3],
        [-2, -.5]
      ],
      t = [
        [.5, -2],
        [3, -4.5],
        [.5, -7],
        [7, -7],
        [7, -.5],
        [4.5, -3],
        [2, -.5]
      ],
      i = [
        [-.5, 2],
        [-3, 4.5],
        [-.5, 7],
        [-7, 7],
        [-7, .5],
        [-4.5, 3],
        [-2, .5]
      ],
      r = [
        [.5, 2],
        [3, 4.5],
        [.5, 7],
        [7, 7],
        [7, .5],
        [4.5, 3],
        [2, .5]
      ],
      s = [
        [-1.5, -2.5],
        [-1.5, -6],
        [-5, -6],
        [0, -11],
        [5, -6],
        [1.5, -6],
        [1.5, -2.5]
      ],
      o = [
        [-2.5, -1.5],
        [-6, -1.5],
        [-6, -5],
        [-11, 0],
        [-6, 5],
        [-6, 1.5],
        [-2.5, 1.5]
      ],
      a = [
        [-1.5, 2.5],
        [-1.5, 6],
        [-5, 6],
        [0, 11],
        [5, 6],
        [1.5, 6],
        [1.5, 2.5]
      ],
      n = [
        [2.5, -1.5],
        [6, -1.5],
        [6, -5],
        [11, 0],
        [6, 5],
        [6, 1.5],
        [2.5, 1.5]
      ],
      h = {
        areaOutline: "#fff",
        resizeBoxStroke: "#fff",
        resizeBoxFill: "#444",
        resizeBoxArrowFill: "#fff",
        resizeCircleStroke: "#fff",
        resizeCircleFill: "#444",
        moveIconFill: "#fff"
      };
    return function(c) {
      var l = function(e, t, i) {
          return [i * e[0] + t[0], i * e[1] + t[1]]
        },
        u = function(e, t, i, r) {
          c.save(), c.fillStyle = t, c.beginPath();
          var s, o = l(e[0], i, r);
          c.moveTo(o[0], o[1]);
          for (var a in e) a > 0 && (s = l(e[a], i, r), c.lineTo(s[0], s[1]));
          c.lineTo(o[0], o[1]), c.fill(), c.closePath(), c.restore()
        };
      this.drawIconMove = function(e, t) {
        u(s, h.moveIconFill, e, t), u(o, h.moveIconFill, e, t), u(a, h.moveIconFill, e, t), u(n, h.moveIconFill, e, t)
      }, this.drawIconResizeCircle = function(e, t, i) {
        var r = t * i;
        c.save(), c.strokeStyle = h.resizeCircleStroke, c.lineWidth = 2, c.fillStyle = h.resizeCircleFill, c.beginPath(), c.arc(e[0], e[1], r, 0, 2 * Math.PI), c.fill(), c.stroke(), c.closePath(), c.restore()
      }, this.drawIconResizeBoxBase = function(e, t, i) {
        var r = t * i;
        c.save(), c.strokeStyle = h.resizeBoxStroke, c.lineWidth = 2, c.fillStyle = h.resizeBoxFill, c.fillRect(e[0] - r / 2, e[1] - r / 2, r, r), c.strokeRect(e[0] - r / 2, e[1] - r / 2, r, r), c.restore()
      }, this.drawIconResizeBoxNESW = function(e, r, s) {
        this.drawIconResizeBoxBase(e, r, s), u(t, h.resizeBoxArrowFill, e, s), u(i, h.resizeBoxArrowFill, e, s)
      }, this.drawIconResizeBoxNWSE = function(t, i, s) {
        this.drawIconResizeBoxBase(t, i, s), u(e, h.resizeBoxArrowFill, t, s), u(r, h.resizeBoxArrowFill, t, s)
      }, this.drawCropArea = function(e, t, i, r) {
        var s = e.width / c.canvas.width,
          o = e.height / c.canvas.height,
          a = t[0] - i / 2,
          n = t[1] - i / 2;
        c.save(), c.strokeStyle = h.areaOutline, c.lineWidth = 2, c.beginPath(), r(c, t, i), c.stroke(), c.clip(), i > 0 && c.drawImage(e, a * s, n * o, i * s, i * o, a, n, i, i), c.beginPath(), r(c, t, i), c.stroke(), c.clip(), c.restore()
      }
    }
  }]), e.service("cropEXIF", [function() {
    function e(e) {
      return !!e.exifdata
    }

    function t(e, t) {
      t = t || e.match(/^data\:([^\;]+)\;base64,/im)[1] || "", e = e.replace(/^data\:([^\;]+)\;base64,/gim, "");
      for (var i = atob(e), r = i.length, s = new ArrayBuffer(r), o = new Uint8Array(s), a = 0; r > a; a++) o[a] = i.charCodeAt(a);
      return s
    }

    function i(e, t) {
      var i = new XMLHttpRequest;
      i.open("GET", e, !0), i.responseType = "blob", i.onload = function() {
        (200 == this.status || 0 === this.status) && t(this.response)
      }, i.send()
    }

    function r(e, r) {
      function a(t) {
        var i = s(t),
          a = o(t);
        e.exifdata = i || {}, e.iptcdata = a || {}, r && r.call(e)
      }
      if (e.src)
        if (/^data\:/i.test(e.src)) {
          var n = t(e.src);
          a(n)
        } else if (/^blob\:/i.test(e.src)) {
        var h = new FileReader;
        h.onload = function(e) {
          a(e.target.result)
        }, i(e.src, function(e) {
          h.readAsArrayBuffer(e)
        })
      } else {
        var c = new XMLHttpRequest;
        c.onload = function() {
          if (200 != this.status && 0 !== this.status) throw "Could not load image";
          a(c.response), c = null
        }, c.open("GET", e.src, !0), c.responseType = "arraybuffer", c.send(null)
      } else if (window.FileReader && (e instanceof window.Blob || e instanceof window.File)) {
        var h = new FileReader;
        h.onload = function(e) {
          u && console.log("Got file of length " + e.target.result.byteLength), a(e.target.result)
        }, h.readAsArrayBuffer(e)
      }
    }

    function s(e) {
      var t = new DataView(e);
      if (u && console.log("Got file of length " + e.byteLength), 255 != t.getUint8(0) || 216 != t.getUint8(1)) return u && console.log("Not a valid JPEG"), !1;
      for (var i, r = 2, s = e.byteLength; s > r;) {
        if (255 != t.getUint8(r)) return u && console.log("Not a valid marker at offset " + r + ", found: " + t.getUint8(r)), !1;
        if (i = t.getUint8(r + 1), u && console.log(i), 225 == i) return u && console.log("Found 0xFFE1 marker"), l(t, r + 4, t.getUint16(r + 2) - 2);
        r += 2 + t.getUint16(r + 2)
      }
    }

    function o(e) {
      var t = new DataView(e);
      if (u && console.log("Got file of length " + e.byteLength), 255 != t.getUint8(0) || 216 != t.getUint8(1)) return u && console.log("Not a valid JPEG"), !1;
      for (var i = 2, r = e.byteLength, s = function(e, t) {
          return 56 === e.getUint8(t) && 66 === e.getUint8(t + 1) && 73 === e.getUint8(t + 2) && 77 === e.getUint8(t + 3) && 4 === e.getUint8(t + 4) && 4 === e.getUint8(t + 5)
        }; r > i;) {
        if (s(t, i)) {
          var o = t.getUint8(i + 7);
          o % 2 !== 0 && (o += 1), 0 === o && (o = 4);
          var n = i + 8 + o,
            h = t.getUint16(i + 6 + o);
          return a(e, n, h)
        }
        i++
      }
    }

    function a(e, t, i) {
      for (var r, s, o, a, n, h = new DataView(e), l = {}, u = t; t + i > u;) 28 === h.getUint8(u) && 2 === h.getUint8(u + 1) && (a = h.getUint8(u + 2), a in _ && (o = h.getInt16(u + 3), n = o + 5, s = _[a], r = c(h, u + 5, o), l.hasOwnProperty(s) ? l[s] instanceof Array ? l[s].push(r) : l[s] = [l[s], r] : l[s] = r)), u++;
      return l
    }

    function n(e, t, i, r, s) {
      var o, a, n, c = e.getUint16(i, !s),
        l = {};
      for (n = 0; c > n; n++) o = i + 12 * n + 2, a = r[e.getUint16(o, !s)], !a && u && console.log("Unknown tag: " + e.getUint16(o, !s)), l[a] = h(e, o, t, i, s);
      return l
    }

    function h(e, t, i, r, s) {
      var o, a, n, h, l, u, g = e.getUint16(t + 2, !s),
        d = e.getUint32(t + 4, !s),
        f = e.getUint32(t + 8, !s) + i;
      switch (g) {
        case 1:
        case 7:
          if (1 == d) return e.getUint8(t + 8, !s);
          for (o = d > 4 ? f : t + 8, a = [], h = 0; d > h; h++) a[h] = e.getUint8(o + h);
          return a;
        case 2:
          return o = d > 4 ? f : t + 8, c(e, o, d - 1);
        case 3:
          if (1 == d) return e.getUint16(t + 8, !s);
          for (o = d > 2 ? f : t + 8, a = [], h = 0; d > h; h++) a[h] = e.getUint16(o + 2 * h, !s);
          return a;
        case 4:
          if (1 == d) return e.getUint32(t + 8, !s);
          for (a = [], h = 0; d > h; h++) a[h] = e.getUint32(f + 4 * h, !s);
          return a;
        case 5:
          if (1 == d) return l = e.getUint32(f, !s), u = e.getUint32(f + 4, !s), n = new Number(l / u), n.numerator = l, n.denominator = u, n;
          for (a = [], h = 0; d > h; h++) l = e.getUint32(f + 8 * h, !s), u = e.getUint32(f + 4 + 8 * h, !s), a[h] = new Number(l / u), a[h].numerator = l, a[h].denominator = u;
          return a;
        case 9:
          if (1 == d) return e.getInt32(t + 8, !s);
          for (a = [], h = 0; d > h; h++) a[h] = e.getInt32(f + 4 * h, !s);
          return a;
        case 10:
          if (1 == d) return e.getInt32(f, !s) / e.getInt32(f + 4, !s);
          for (a = [], h = 0; d > h; h++) a[h] = e.getInt32(f + 8 * h, !s) / e.getInt32(f + 4 + 8 * h, !s);
          return a
      }
    }

    function c(e, t, i) {
      for (var r = "", s = t; t + i > s; s++) r += String.fromCharCode(e.getUint8(s));
      return r
    }

    function l(e, t) {
      if ("Exif" != c(e, t, 4)) return u && console.log("Not valid EXIF data! " + c(e, t, 4)), !1;
      var i, r, s, o, a, h = t + 6;
      if (18761 == e.getUint16(h)) i = !1;
      else {
        if (19789 != e.getUint16(h)) return u && console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"), !1;
        i = !0
      }
      if (42 != e.getUint16(h + 2, !i)) return u && console.log("Not valid TIFF data! (no 0x002A)"), !1;
      var l = e.getUint32(h + 4, !i);
      if (8 > l) return u && console.log("Not valid TIFF data! (First offset less than 8)", e.getUint32(h + 4, !i)), !1;
      if (r = n(e, h, h + l, d, i), r.ExifIFDPointer) {
        o = n(e, h, h + r.ExifIFDPointer, g, i);
        for (s in o) {
          switch (s) {
            case "LightSource":
            case "Flash":
            case "MeteringMode":
            case "ExposureProgram":
            case "SensingMethod":
            case "SceneCaptureType":
            case "SceneType":
            case "CustomRendered":
            case "WhiteBalance":
            case "GainControl":
            case "Contrast":
            case "Saturation":
            case "Sharpness":
            case "SubjectDistanceRange":
            case "FileSource":
              o[s] = p[s][o[s]];
              break;
            case "ExifVersion":
            case "FlashpixVersion":
              o[s] = String.fromCharCode(o[s][0], o[s][1], o[s][2], o[s][3]);
              break;
            case "ComponentsConfiguration":
              o[s] = p.Components[o[s][0]] + p.Components[o[s][1]] + p.Components[o[s][2]] + p.Components[o[s][3]]
          }
          r[s] = o[s]
        }
      }
      if (r.GPSInfoIFDPointer) {
        a = n(e, h, h + r.GPSInfoIFDPointer, f, i);
        for (s in a) {
          switch (s) {
            case "GPSVersionID":
              a[s] = a[s][0] + "." + a[s][1] + "." + a[s][2] + "." + a[s][3]
          }
          r[s] = a[s]
        }
      }
      return r
    }
    var u = !1,
      g = this.Tags = {
        36864: "ExifVersion",
        40960: "FlashpixVersion",
        40961: "ColorSpace",
        40962: "PixelXDimension",
        40963: "PixelYDimension",
        37121: "ComponentsConfiguration",
        37122: "CompressedBitsPerPixel",
        37500: "MakerNote",
        37510: "UserComment",
        40964: "RelatedSoundFile",
        36867: "DateTimeOriginal",
        36868: "DateTimeDigitized",
        37520: "SubsecTime",
        37521: "SubsecTimeOriginal",
        37522: "SubsecTimeDigitized",
        33434: "ExposureTime",
        33437: "FNumber",
        34850: "ExposureProgram",
        34852: "SpectralSensitivity",
        34855: "ISOSpeedRatings",
        34856: "OECF",
        37377: "ShutterSpeedValue",
        37378: "ApertureValue",
        37379: "BrightnessValue",
        37380: "ExposureBias",
        37381: "MaxApertureValue",
        37382: "SubjectDistance",
        37383: "MeteringMode",
        37384: "LightSource",
        37385: "Flash",
        37396: "SubjectArea",
        37386: "FocalLength",
        41483: "FlashEnergy",
        41484: "SpatialFrequencyResponse",
        41486: "FocalPlaneXResolution",
        41487: "FocalPlaneYResolution",
        41488: "FocalPlaneResolutionUnit",
        41492: "SubjectLocation",
        41493: "ExposureIndex",
        41495: "SensingMethod",
        41728: "FileSource",
        41729: "SceneType",
        41730: "CFAPattern",
        41985: "CustomRendered",
        41986: "ExposureMode",
        41987: "WhiteBalance",
        41988: "DigitalZoomRation",
        41989: "FocalLengthIn35mmFilm",
        41990: "SceneCaptureType",
        41991: "GainControl",
        41992: "Contrast",
        41993: "Saturation",
        41994: "Sharpness",
        41995: "DeviceSettingDescription",
        41996: "SubjectDistanceRange",
        40965: "InteroperabilityIFDPointer",
        42016: "ImageUniqueID"
      },
      d = this.TiffTags = {
        256: "ImageWidth",
        257: "ImageHeight",
        34665: "ExifIFDPointer",
        34853: "GPSInfoIFDPointer",
        40965: "InteroperabilityIFDPointer",
        258: "BitsPerSample",
        259: "Compression",
        262: "PhotometricInterpretation",
        274: "Orientation",
        277: "SamplesPerPixel",
        284: "PlanarConfiguration",
        530: "YCbCrSubSampling",
        531: "YCbCrPositioning",
        282: "XResolution",
        283: "YResolution",
        296: "ResolutionUnit",
        273: "StripOffsets",
        278: "RowsPerStrip",
        279: "StripByteCounts",
        513: "JPEGInterchangeFormat",
        514: "JPEGInterchangeFormatLength",
        301: "TransferFunction",
        318: "WhitePoint",
        319: "PrimaryChromaticities",
        529: "YCbCrCoefficients",
        532: "ReferenceBlackWhite",
        306: "DateTime",
        270: "ImageDescription",
        271: "Make",
        272: "Model",
        305: "Software",
        315: "Artist",
        33432: "Copyright"
      },
      f = this.GPSTags = {
        0: "GPSVersionID",
        1: "GPSLatitudeRef",
        2: "GPSLatitude",
        3: "GPSLongitudeRef",
        4: "GPSLongitude",
        5: "GPSAltitudeRef",
        6: "GPSAltitude",
        7: "GPSTimeStamp",
        8: "GPSSatellites",
        9: "GPSStatus",
        10: "GPSMeasureMode",
        11: "GPSDOP",
        12: "GPSSpeedRef",
        13: "GPSSpeed",
        14: "GPSTrackRef",
        15: "GPSTrack",
        16: "GPSImgDirectionRef",
        17: "GPSImgDirection",
        18: "GPSMapDatum",
        19: "GPSDestLatitudeRef",
        20: "GPSDestLatitude",
        21: "GPSDestLongitudeRef",
        22: "GPSDestLongitude",
        23: "GPSDestBearingRef",
        24: "GPSDestBearing",
        25: "GPSDestDistanceRef",
        26: "GPSDestDistance",
        27: "GPSProcessingMethod",
        28: "GPSAreaInformation",
        29: "GPSDateStamp",
        30: "GPSDifferential"
      },
      p = this.StringValues = {
        ExposureProgram: {
          0: "Not defined",
          1: "Manual",
          2: "Normal program",
          3: "Aperture priority",
          4: "Shutter priority",
          5: "Creative program",
          6: "Action program",
          7: "Portrait mode",
          8: "Landscape mode"
        },
        MeteringMode: {
          0: "Unknown",
          1: "Average",
          2: "CenterWeightedAverage",
          3: "Spot",
          4: "MultiSpot",
          5: "Pattern",
          6: "Partial",
          255: "Other"
        },
        LightSource: {
          0: "Unknown",
          1: "Daylight",
          2: "Fluorescent",
          3: "Tungsten (incandescent light)",
          4: "Flash",
          9: "Fine weather",
          10: "Cloudy weather",
          11: "Shade",
          12: "Daylight fluorescent (D 5700 - 7100K)",
          13: "Day white fluorescent (N 4600 - 5400K)",
          14: "Cool white fluorescent (W 3900 - 4500K)",
          15: "White fluorescent (WW 3200 - 3700K)",
          17: "Standard light A",
          18: "Standard light B",
          19: "Standard light C",
          20: "D55",
          21: "D65",
          22: "D75",
          23: "D50",
          24: "ISO studio tungsten",
          255: "Other"
        },
        Flash: {
          0: "Flash did not fire",
          1: "Flash fired",
          5: "Strobe return light not detected",
          7: "Strobe return light detected",
          9: "Flash fired, compulsory flash mode",
          13: "Flash fired, compulsory flash mode, return light not detected",
          15: "Flash fired, compulsory flash mode, return light detected",
          16: "Flash did not fire, compulsory flash mode",
          24: "Flash did not fire, auto mode",
          25: "Flash fired, auto mode",
          29: "Flash fired, auto mode, return light not detected",
          31: "Flash fired, auto mode, return light detected",
          32: "No flash function",
          65: "Flash fired, red-eye reduction mode",
          69: "Flash fired, red-eye reduction mode, return light not detected",
          71: "Flash fired, red-eye reduction mode, return light detected",
          73: "Flash fired, compulsory flash mode, red-eye reduction mode",
          77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
          79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
          89: "Flash fired, auto mode, red-eye reduction mode",
          93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
          95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
          1: "Not defined",
          2: "One-chip color area sensor",
          3: "Two-chip color area sensor",
          4: "Three-chip color area sensor",
          5: "Color sequential area sensor",
          7: "Trilinear sensor",
          8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
          0: "Standard",
          1: "Landscape",
          2: "Portrait",
          3: "Night scene"
        },
        SceneType: {
          1: "Directly photographed"
        },
        CustomRendered: {
          0: "Normal process",
          1: "Custom process"
        },
        WhiteBalance: {
          0: "Auto white balance",
          1: "Manual white balance"
        },
        GainControl: {
          0: "None",
          1: "Low gain up",
          2: "High gain up",
          3: "Low gain down",
          4: "High gain down"
        },
        Contrast: {
          0: "Normal",
          1: "Soft",
          2: "Hard"
        },
        Saturation: {
          0: "Normal",
          1: "Low saturation",
          2: "High saturation"
        },
        Sharpness: {
          0: "Normal",
          1: "Soft",
          2: "Hard"
        },
        SubjectDistanceRange: {
          0: "Unknown",
          1: "Macro",
          2: "Close view",
          3: "Distant view"
        },
        FileSource: {
          3: "DSC"
        },
        Components: {
          0: "",
          1: "Y",
          2: "Cb",
          3: "Cr",
          4: "R",
          5: "G",
          6: "B"
        }
      },
      _ = {
        120: "caption",
        110: "credit",
        25: "keywords",
        55: "dateCreated",
        80: "byline",
        85: "bylineTitle",
        122: "captionWriter",
        105: "headline",
        116: "copyright",
        15: "category"
      };
    this.getData = function(t, i) {
      return (t instanceof Image || t instanceof HTMLImageElement) && !t.complete ? !1 : (e(t) ? i && i.call(t) : r(t, i), !0)
    }, this.getTag = function(t, i) {
      return e(t) ? t.exifdata[i] : void 0
    }, this.getAllTags = function(t) {
      if (!e(t)) return {};
      var i, r = t.exifdata,
        s = {};
      for (i in r) r.hasOwnProperty(i) && (s[i] = r[i]);
      return s
    }, this.pretty = function(t) {
      if (!e(t)) return "";
      var i, r = t.exifdata,
        s = "";
      for (i in r) r.hasOwnProperty(i) && (s += "object" == typeof r[i] ? r[i] instanceof Number ? i + " : " + r[i] + " [" + r[i].numerator + "/" + r[i].denominator + "]\r\n" : i + " : [" + r[i].length + " values]\r\n" : i + " : " + r[i] + "\r\n");
      return s
    }, this.readFromBinaryFile = function(e) {
      return s(e)
    }
  }]), e.factory("cropHost", ["$document", "cropAreaCircle", "cropAreaSquare", "cropEXIF", function(e, t, i, r) {
    var s = function(e) {
      var t = e.getBoundingClientRect(),
        i = document.body,
        r = document.documentElement,
        s = window.pageYOffset || r.scrollTop || i.scrollTop,
        o = window.pageXOffset || r.scrollLeft || i.scrollLeft,
        a = r.clientTop || i.clientTop || 0,
        n = r.clientLeft || i.clientLeft || 0,
        h = t.top + s - a,
        c = t.left + o - n;
      return {
        top: Math.round(h),
        left: Math.round(c)
      }
    };
    return function(o, a, n) {
      function h() {
        c.clearRect(0, 0, c.canvas.width, c.canvas.height), null !== l && (c.drawImage(l, 0, 0, c.canvas.width, c.canvas.height), c.save(), c.fillStyle = "rgba(0, 0, 0, 0.65)", c.fillRect(0, 0, c.canvas.width, c.canvas.height), c.restore(), u.draw())
      }
      var c = null,
        l = null,
        u = null,
        g = [100, 100],
        d = [300, 300],
        f = 200,
        p = "image/png",
        _ = null,
        m = function() {
          if (null !== l) {
            u.setImage(l);
            var e = [l.width, l.height],
              t = l.width / l.height,
              i = e;
            i[0] > d[0] ? (i[0] = d[0], i[1] = i[0] / t) : i[0] < g[0] && (i[0] = g[0], i[1] = i[0] / t), i[1] > d[1] ? (i[1] = d[1], i[0] = i[1] * t) : i[1] < g[1] && (i[1] = g[1], i[0] = i[1] * t), o.prop("width", i[0]).prop("height", i[1]).css({
              "margin-left": -i[0] / 2 + "px",
              "margin-top": -i[1] / 2 + "px"
            }), u.setX(c.canvas.width / 2), u.setY(c.canvas.height / 2), u.setSize(Math.min(200, c.canvas.width / 2, c.canvas.height / 2))
          } else o.prop("width", 0).prop("height", 0).css({
            "margin-top": 0
          });
          h()
        },
        v = function(e) {
          return angular.isDefined(e.changedTouches) ? e.changedTouches : e.originalEvent.changedTouches
        },
        S = function(e) {
          if (null !== l) {
            var t, i, r = s(c.canvas);
            "touchmove" === e.type ? (t = v(e)[0].pageX, i = v(e)[0].pageY) : (t = e.pageX, i = e.pageY), u.processMouseMove(t - r.left, i - r.top), h()
          }
        },
        z = function(e) {
          if (e.preventDefault(), e.stopPropagation(), null !== l) {
            var t, i, r = s(c.canvas);
            "touchstart" === e.type ? (t = v(e)[0].pageX, i = v(e)[0].pageY) : (t = e.pageX, i = e.pageY), u.processMouseDown(t - r.left, i - r.top), h()
          }
        },
        I = function(e) {
          if (null !== l) {
            var t, i, r = s(c.canvas);
            "touchend" === e.type ? (t = v(e)[0].pageX, i = v(e)[0].pageY) : (t = e.pageX, i = e.pageY), u.processMouseUp(t - r.left, i - r.top), h()
          }
        };
      this.getResultImageDataURI = function() {
        var e, t;
        return t = angular.element("<canvas></canvas>")[0], e = t.getContext("2d"), t.width = f, t.height = f, null !== l && e.drawImage(l, (u.getX() - u.getSize() / 2) * (l.width / c.canvas.width), (u.getY() - u.getSize() / 2) * (l.height / c.canvas.height), u.getSize() * (l.width / c.canvas.width), u.getSize() * (l.height / c.canvas.height), 0, 0, f, f), null !== _ ? t.toDataURL(p, _) : t.toDataURL(p)
      }, this.setNewImageSource = function(e) {
        if (l = null, m(), n.trigger("image-updated"), e) {
          var t = new Image;
          "http" === e.substring(0, 4).toLowerCase() && (t.crossOrigin = "anonymous"), t.onload = function() {
            n.trigger("load-done"), r.getData(t, function() {
              var e = r.getTag(t, "Orientation");
              if ([3, 6, 8].indexOf(e) > -1) {
                var i = document.createElement("canvas"),
                  s = i.getContext("2d"),
                  o = t.width,
                  a = t.height,
                  h = 0,
                  c = 0,
                  u = 0;
                switch (e) {
                  case 3:
                    h = -t.width, c = -t.height, u = 180;
                    break;
                  case 6:
                    o = t.height, a = t.width, c = -t.height, u = 90;
                    break;
                  case 8:
                    o = t.height, a = t.width, h = -t.width, u = 270
                }
                i.width = o, i.height = a, s.rotate(u * Math.PI / 180), s.drawImage(t, h, c), l = new Image, l.src = i.toDataURL("image/png")
              } else l = t;
              m(), n.trigger("image-updated")
            })
          }, t.onerror = function() {
            n.trigger("load-error")
          }, n.trigger("load-start"), t.src = e
        }
      }, this.setMaxDimensions = function(e, t) {
        if (d = [e, t], null !== l) {
          var i = c.canvas.width,
            r = c.canvas.height,
            s = [l.width, l.height],
            a = l.width / l.height,
            n = s;
          n[0] > d[0] ? (n[0] = d[0], n[1] = n[0] / a) : n[0] < g[0] && (n[0] = g[0], n[1] = n[0] / a), n[1] > d[1] ? (n[1] = d[1], n[0] = n[1] * a) : n[1] < g[1] && (n[1] = g[1], n[0] = n[1] * a), o.prop("width", n[0]).prop("height", n[1]).css({
            "margin-left": -n[0] / 2 + "px",
            "margin-top": -n[1] / 2 + "px"
          });
          var f = c.canvas.width / i,
            p = c.canvas.height / r,
            _ = Math.min(f, p);
          u.setX(u.getX() * f), u.setY(u.getY() * p), u.setSize(u.getSize() * _)
        } else o.prop("width", 0).prop("height", 0).css({
          "margin-top": 0
        });
        h()
      }, this.setAreaMinSize = function(e) {
        e = parseInt(e, 10), isNaN(e) || (u.setMinSize(e), h())
      }, this.setResultImageSize = function(e) {
        e = parseInt(e, 10), isNaN(e) || (f = e)
      }, this.setResultImageFormat = function(e) {
        p = e
      }, this.setResultImageQuality = function(e) {
        e = parseFloat(e), !isNaN(e) && e >= 0 && 1 >= e && (_ = e)
      }, this.setAreaType = function(e) {
        var r = u.getSize(),
          s = u.getMinSize(),
          o = u.getX(),
          a = u.getY(),
          g = t;
        "square" === e && (g = i), u = new g(c, n), u.setMinSize(s), u.setSize(r), u.setX(o), u.setY(a), null !== l && u.setImage(l), h()
      }, c = o[0].getContext("2d"), u = new t(c, n), e.on("mousemove", S), o.on("mousedown", z), e.on("mouseup", I), e.on("touchmove", S), o.on("touchstart", z), e.on("touchend", I), this.destroy = function() {
        e.off("mousemove", S), o.off("mousedown", z), e.off("mouseup", S), e.off("touchmove", S), o.off("touchstart", z), e.off("touchend", S), o.remove()
      }
    }
  }]), e.factory("cropPubSub", [function() {
    return function() {
      var e = {};
      this.on = function(t, i) {
        return t.split(" ").forEach(function(t) {
          e[t] || (e[t] = []), e[t].push(i)
        }), this
      }, this.trigger = function(t, i) {
        return angular.forEach(e[t], function(e) {
          e.call(null, i)
        }), this
      }
    }
  }]), e.directive("imgCrop", ["$timeout", "cropHost", "cropPubSub", function(e, t, i) {
    return {
      restrict: "E",
      scope: {
        image: "=",
        resultImage: "=",
        changeOnFly: "=",
        areaType: "@",
        areaMinSize: "=",
        resultImageSize: "=",
        resultImageFormat: "@",
        resultImageQuality: "=",
        onChange: "&",
        onLoadBegin: "&",
        onLoadDone: "&",
        onLoadError: "&"
      },
      template: "<canvas></canvas>",
      controller: ["$scope", function(e) {
        e.events = new i
      }],
      link: function(i, r) {
        var s, o = i.events,
          a = new t(r.find("canvas"), {}, o),
          n = function(e) {
            var t = a.getResultImageDataURI();
            s !== t && (s = t, angular.isDefined(e.resultImage) && (e.resultImage = t), e.onChange({
              $dataURI: e.resultImage
            }))
          },
          h = function(t) {
            return function() {
              e(function() {
                i.$apply(function(e) {
                  t(e)
                })
              })
            }
          };
        o.on("load-start", h(function(e) {
          e.onLoadBegin({})
        })).on("load-done", h(function(e) {
          e.onLoadDone({})
        })).on("load-error", h(function(e) {
          e.onLoadError({})
        })).on("area-move area-resize", h(function(e) {
          e.changeOnFly && n(e)
        })).on("area-move-end area-resize-end image-updated", h(function(e) {
          n(e)
        })), i.$watch("image", function() {
          a.setNewImageSource(i.image)
        }), i.$watch("areaType", function() {
          a.setAreaType(i.areaType), n(i)
        }), i.$watch("areaMinSize", function() {
          a.setAreaMinSize(i.areaMinSize), n(i)
        }), i.$watch("resultImageSize", function() {
          a.setResultImageSize(i.resultImageSize), n(i)
        }), i.$watch("resultImageFormat", function() {
          a.setResultImageFormat(i.resultImageFormat), n(i)
        }), i.$watch("resultImageQuality", function() {
          a.setResultImageQuality(i.resultImageQuality), n(i)
        }), i.$watch(function() {
          return [r[0].clientWidth, r[0].clientHeight]
        }, function(e) {
          a.setMaxDimensions(e[0], e[1]), n(i)
        }, !0), i.$on("$destroy", function() {
          a.destroy()
        })
      }
    }
  }])
}();

"use strict";

app.controller('checkoutCtrl', function($scope, $location, $rootScope, $http, $timeout, Auth,  $cookies, $cookieStore, ngToast) {
  // Activate Next Step
  $(document).ready(function() {

      var navListItems = $('ul.setup-panel li a'),
          allWells = $('.setup-content');

      allWells.hide();

      navListItems.click(function(e)
      {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this).closest('li');

        if (!$item.hasClass('disabled')) {
            navListItems.closest('li').removeClass('active');
            $item.addClass('active');
            allWells.hide();
            $target.show();
        }
      });

      $('ul.setup-panel li.active a').trigger('click');

      // DEMO ONLY //
      $('#activate-step-2').on('click', function(e) {
          $('ul.setup-panel li:eq(1)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-2"]').trigger('click');
          //$(this).remove();
      })
      $('#step-back-1').on('click', function(e) {
          //$('ul.setup-panel li:eq(1)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-1"]').trigger('click');
          //$(this).remove();
      })

      $('#activate-step-3').on('click', function(e) {
          $('ul.setup-panel li:eq(1)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-3"]').trigger('click');
          //$(this).remove();
      })

      $('#activate-step-4').on('click', function(e) {
          $('ul.setup-panel li:eq(2)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-4"]').trigger('click');
          //$(this).remove();
      })

  });

  $scope.init = function(){
    $scope.getcartItems();
    $scope.getAddressByUserId ();
    $scope.getMinimumOrderCost();
  }


//get cart details
  $scope.getcartItems = function () {
    // $scope.getUserId = localStorage.getItem('userId');
    // $scope.sessionId = "aa565asdasdy87sadasd987";
    //cookieStore
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    $scope.gettingCartData =[];
    console.log('cart page');
    Auth.getCartList({
      UserId : $scope.getUserId,
      sessionID: $scope.sessionId,
    })
    .success(function (data) {
      console.log(data.length);
      $rootScope.cartLength = data.length;
      $scope.allCartItems = data;
      console.log('get cart data',data);
      angular.forEach($scope.allCartItems, function (value, key) {
        var obj = {
          "qty":value.quantity,
          "cartPrice" : value.product.salePrice
        };
        $scope.gettingCartData.push(obj);

      });
      $scope.totalCost = 0;
      for (var i = 0; i < $scope.gettingCartData.length; i++) {
          $scope.totalCost += $scope.gettingCartData[i].qty * $scope.gettingCartData[i].cartPrice ;
            console.log("prce", $scope.totalCost);
      }


    }).error(function(data){
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Problem in get cart api'
      // });
    });
  };


  //updateCart increment
  //$scope.countQuantity = 0;
  $scope.updateCartByIncrement = function(quantity,productId) {
    $scope.countQuantity =quantity + 1;
    console.log("countQuantity",$scope.countQuantity);
    $scope.getUserId = $cookieStore.get('userId');
    Auth.updateCart({UserID:$scope.getUserId, "quantity": $scope.countQuantity}, productId)
    .success(function(data){
      console.log('updated resp', data);
      $scope.getcartItems();
        }).error(function(data){
          console.log('Not updated in cart increment ',data);
        });
  }

  //updateCart on decrement
  //$scope.countQuantity = 0;
  $scope.updateCartByDecrementing = function(quantity,productId) {
    $scope.countQuantity =quantity - 1;
    console.log("countQuantity",$scope.countQuantity);
    $scope.getUserId = $cookieStore.get('userId');
    Auth.updateCart({UserID:$scope.getUserId, "quantity": $scope.countQuantity}, productId)
    .success(function(data){
      console.log('updated decrement', data);
      $scope.getcartItems();
        }).error(function(data){
          console.log('Not updated in cart',data);
        });
  }

  //delte cart
  $scope.deleteCart = function (productId,quantity) {
    // $scope.getUserId = localStorage.getItem('userId');
    // $scope.userToken = localStorage.getItem('token');
    // $scope.sessionId = "aa565asdasdy87sadasd987";
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    Auth.deleteCart({UserID:$scope.getUserId,sessionID : $scope.sessionId,isDeleted: true}, productId)
    .success(function(data){
      console.log('deleted resp', data);
      $scope.getcartItems();
      // ngToast.create({
      //   className: 'success',
      //   content: 'Item Deleted from Cart'
      // });
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);

        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in deleting from Cart'
          // });
        });
      };

      //continue shipping
      $scope.continueShipping = function(){
          $location.path('/search-page')
      }

    //get address by userId
    $scope.getAddressByUserId = function(){
      $scope.getUserId = $cookieStore.get('userId');
      Auth.getAddressByUserId().success(function(data){
        $scope.getAddressByUserId = data;
        if($scope.getAddressByUserId.length) {
          $scope.showDiv = 'savedAddress';
          $scope.saveAddressColor = '#d92e4a';
        } else {
          $scope.showDiv = 'newAddress';
          $scope.saveAddressColor = '#d92e4a';
        }
      }).error(function(data){
        console.log(data);
      });
    }


    //selectedAddress
    $scope.addressIdSelected = null;
    $scope.selectedAddress = function(id, addresstype){
      $scope.addressIdSelected = id;
      console.log("$scope.addressIdSelected",$scope.addressIdSelected);
      $scope.showAddressType = false;
      $scope.addNewAddressRadio = false;
      $scope.addrestTypeRadio = false;
      $scope.addressIdSelected = id;
      $scope.addressTypeChosen = addresstype;
      // for (var i = 0; i < $scope.getAddressByUserId.length; i++) {
      //   if(id == $scope.getAddressByUserId[i]._id){
      //     console.log("$scope.getAddressByUserId[i]._id",$scope.getAddressByUserId[i]._id);
      //     $scope.name = $scope.getAddressByUserId[i].name;
      //     $scope.landlineNumber = $scope.getAddressByUserId[i].landLineNumber;
      //     $scope.mobileNumber = $scope.getAddressByUserId[i].mobileNumber;
      //     $scope.companyName = $scope.getAddressByUserId[i].companyName;
      //     $scope.street1 = $scope.getAddressByUserId[i].street1;
      //     $scope.city = $scope.getAddressByUserId[i].city;
      //     $scope.pincode = $scope.getAddressByUserId[i].pinCode;
      //     $scope.state = $scope.getAddressByUserId[i].state;
      //     $scope.country = $scope.getAddressByUserId[i].state;
      //   }
      //
      // }
      if($scope.isChecked) {
       $scope.isChecked = true;
       }else{
        $scope.isChecked = false;
       }

    }

    $scope.editAddress = function() {
      $scope.showDiv =  'newAddress';
    }

    //getLoactions
    $scope.getLocationDeliver = function(){
      Auth.getLocationDeliver()
      .success(function(data){
        console.log("locationdeliver",data);
        $scope.locationDeliverName = data;
        $scope.city = 'Select Location';
      }).error(function(data){

      });
}
    $scope.getLocationDeliver();
  //post address
  $scope.showDiv =  "display:none;";
  $scope.country = "UAE";
  $scope.state = "Dubai";
  $scope.mobileNumber = "+971";
  $scope.addAddress = function () {

    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');

    //  $scope.addressObject = $scope.addressType.push($('#addressType').val());
    //  console.log("$scope.addressObject ",$scope.myaddressType[$('#addressType').val()]);
    // $scope.myAddressType = $scope.addressType;

    var addressDetails = {
      userID:$scope.getUserId,
      name:$scope.name,
      addressType:$scope.addressType,
      authToken: $scope.userToken,
      houseNo:$scope.houseNo,
      streetName:$scope.streetName,
      landmark: $scope.landmark,
      street4: $scope.street3,
      companyName:$scope.companyName,
      officeNumber:$scope.officeNumber,
      mobileNumber:$scope.mobileNumber,
      landLineNumber:$scope.landlineNumber,
      pinCode: $scope.pincode,
      city:$scope.city,
      state: $scope.state,
      country:$scope.country
    }
    Auth.addAddress(addressDetails)
    .success(function(data){
      console.log('addressDetails', data);
      //$scope.getAddressByUserId ();
      // ngToast.create({
      //   className: 'success',
      //   content: 'New Address Added'
      // });

      location.reload(true);
      //$scope.getAddressByUserId ();
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);
        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in adding address'
          // });
        });
      };

      $scope.addrestTypeRadio = false;
      $scope.addNewAddressRadio = false;
      //clearAddress to add new address
      $scope.clearAddress = function(){
        $scope.showAddressType = false;
        $scope.addrestTypeRadio = false;
        $scope.addNewAddressRadio = true;
        //clear textbox
        // $scope.name = "";
        // $scope.landlineNumber = "";
        // $scope.mobileNumber = "";
        // $scope.companyName = "";
        // $scope.street1 = "";
        // $scope.city = "";
        // $scope.pincode = "";
        // $scope.state = "";
        // $scope.country = "";
      }

      //make COD
      $scope.isSelectedCOD = true;
      $scope.makePaymentBtn = false;
      $scope.isThankyou = true;
      $scope.isCod = function(value){
        console.log("isSelectedCOD",value);
        if ($scope.isSelectedCOD == value) {
          $scope.makePaymentBtn = false;
        }
      }
      $scope.isPaymentPanel = false;
      $scope.makeCodPayment = function(){
        $scope.isPaymentPanel = true;
        var codDetails = {
          "UserID":$scope.getUserId,
        	"paymentMethod":1,
        	"address":$scope.addressIdSelected,
        	"billingAddress":$scope.addressIdSelected,
          "deliveryOrderAmount":$scope.deliveryOrderAmount
        }
        Auth.makeCOD(codDetails)
        .success(function(data){
          console.log('codDetails', data);
          $scope.isThankyou = false;
          $scope.getcartItems();
          // ngToast.create({
          //   className: 'success',
          //   content: "Order is Placed"
          // });
          $scope.codOrderDetails =  data;
          $scope.receipt_details = data;
        }).error(function(data){
          console.log(data);
        });
      }

      //thankyou btn
      $scope.thankYou = function(){
        window.location = "#/landing";
      }

      //minimum order value to be calculated to add delivery
      $scope.getMinimumOrderCost = function() {

        Auth.getMinimumOrder().success(function(data) {
          for (var i = 0; i < data.length; i++) {
            $scope.minimumOrderAmount = data[i].minimumOrderAmount;
            $scope.deliveryOrderAmount = data[i].deliveryOrderAmount;
          }
        }).error(function(data) {
          console.log("getMinimumOrder api fails");
        });
      }

      $scope.init();
});

app.controller('loginController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore, GooglePlus, Facebook, ngToast, URL){
  'use strict';
  $scope.hideAddress = true;
  $scope.BASE_URL = URL.BASE_URL;
  $('.modal').on('hidden.bs.modal', function (e) {
    $(this).find("input").val('').end();
    $scope.errorMessage =  "";
  })

  if ($cookieStore.get('userId')) {
    $scope.show_myaccnt = true;
    $scope.not__logged = false;
    $scope.getEmailId = $cookieStore.get('emailId');
    $scope.userName = $cookieStore.get('userName');
  } else {
    $scope.show_myaccnt = false;
    $scope.not__logged = true;
  }


  $scope.regexEmail = new RegExp(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);
  $scope.Signupform = function(signupform) {
    var regexEmail = new RegExp(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);
    $scope.errorMessage = "";
      var signupcredintials = {};
    if (!$scope.signupform.$valid) {
      $scope.erroralert = true;
      if (signupform.$error.required) {
        $scope.errorMessage = "All fields required";
      } else if (!regexEmail.test($scope.email)) {
          $scope.errorMessage = "Please enter a valid email id";
      } else if (signupform.$error.minlength) {
          $scope.errorMessage = 'Minimum password length 6 required';
      }
    } else {
        // if($scope.signupcredintials) {}
          signupcredintials = {
              name: $scope.name,
              email: $scope.email,
              mobile_number:$scope.mobile_number,
              password: $scope.password,
            }
        Auth.register(signupcredintials).success(function(data) {
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("userId", data._id);
        // localStorage.setItem("name", data.email);
        //localStorage.setItem("loggedIn", true);
        //cookieStore
         $cookieStore.put("token", data.token);
         $cookieStore.put("userId", data._id);
         $cookieStore.put("emailId", $scope.email);
         $cookieStore.put("userName", data.name);
         $scope.getEmailId = $cookieStore.get('email');
         $cookieStore.put('loggedIn', true);
         //$location.path('/landing');
        // $scope.getUserProfile();
         //location.reload(true);
        location.reload(true);
        // ngToast.create({
        //   className: 'success',
        //   content: 'Account created successfully'
        // });
      }).error(function(data) {
        console.log('data', data);
        $scope.erroralert = true;
        $scope.errorMessage = data.errors.email.message;
      });
    };
    $timeout(function () {
      $scope.errorMessage = "";
    }, 3000);
  }

  $scope.loginform = function () {
    $scope.erroralert = false;
    $scope.errorMessage = "";
    if (!$scope.krazyloginform.$valid) {
      $scope.errorMessage = "All fields required";
      $scope.erroralert = true;
    } else {
      Auth.login ({
        email: $scope.email,
        password: $scope.password,
      }).success(function (data) {
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("userId", data._id);
        // localStorage.setItem("email", data.email);
        // localStorage.setItem('loggedIn', true);

        //cookieStore
         $cookieStore.put("token", data.token);

         $cookieStore.put("userId", data._id);
         $cookieStore.put("emailId", $scope.email);
         $cookieStore.put("userName", data.name);
         $cookieStore.put('loggedIn', true);
         $scope.getEmailId = $cookieStore.get('email');
         $scope.userId = $cookieStore.get('userId');
         console.log("user id ",$scope.userId);
         $('.modal').css("display", "none");
         $('.modal-open').removeClass();
          //$location.path('/landing');
          location.reload(true);
          // $('#loginmodal').modal('hide');
      }).error(function(data) {
        console.log('data', data);
          $scope.erroralert = true;
          $scope.errorMessage = data.message;
      });
    }
    $timeout(function () {
      $scope.errorMessage = "";
    }, 3000);
  }
  // Define user empty data :/
$scope.user = {};

// Defining user logged status
$scope.logged = false;
  $scope.logout = function () {

    //remove from cart
    $scope.cookieUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    Auth.emptyCart({UserID:$scope.cookieUserId,sessionID : $scope.sessionId,isDeleted: true})
    .success(function(data){
      console.log('empty cart', data);
        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in deleting from Cart'
          // });
        });

    $rootScope.user = {};
    // localStorage.removeItem("token");
    // localStorage.removeItem("userId");
    // localStorage.removeItem("email");
    // localStorage.setItem('loggedIn', false);
    $cookieStore.remove("emailId");
    $cookieStore.remove("userId");
    $cookieStore.remove("userName");
    //facebook logout
     var _self = this;
     Facebook.logout(function(response) {
        // user is now logged out
        console.log("log out");
        $rootScope.$apply(function() {
        $rootScope.user = _self.user = {};
      });
      //G+ logout
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
   });
    //cookieStore
    $cookieStore.remove("token");
    $cookieStore.remove("userId");
    $cookieStore.remove("email");
    $cookieStore.put('loggedIn', false);
    // $scope.emptyCart();
    $location.path('/landing');
    //10 seconds delay
    $timeout(function () {
      location.reload();
    }, 3000);
  }
  $scope.hideCartValue = false;
  if ($cookieStore.get('loggedIn') == false) {
    $scope.hideCartValue = true;
  }

  $scope.forgotPassword = function () {
    Auth.forgotpassword({
      email: $scope.forgot.email
    }).success(function (data) {
      $scope.forgotalert = true;
      $scope.forgotError = "Email is sent to registered ID";
    }).error(function (data) {
      $scope.forgotalert = true;
      $scope.forgotError = data.error;
    });
  }

  $scope.product = function() {
      Auth.products().success(function(data) {
      console.log('data',data);
    }).error(function(data) {
      console.log('data', data);
    });
  }
  //   $scope.product();


//closing pop-up on redirect to another pop-up
  $scope.closeModal = function() {
    $('.modal').click();
  }

  $scope.tabsMyaccount = function(){
    var navItems = $('.admin-menu li > a');
  var navListItems = $('.admin-menu li');
  var allWells = $('.admin-content');
  var allWellsExceptFirst = $('.admin-content:not(:first)');

  allWellsExceptFirst.hide();
  navItems.click(function(e)
  {
      e.preventDefault();
      navListItems.removeClass('active');
      $(this).closest('li').addClass('active');

      allWells.hide();
      var target = $(this).attr('data-target-id');
      $('#' + target).show();
  });
  }

  //get Profile of users
  $scope.getUserProfile = function() {
       $scope.showTab = 'profile';
    $scope.userProfileShow =  true;
    Auth.userProfile().success(function(data) {
      $scope.userDetails = data;
      if (data.image_url) {
        $scope.hideAvatar = false;
      } else {
        $scope.hideAvatar = true;
      }
      console.log('user profile',data.name);
      $cookieStore.put('userName', data.name);
      $cookieStore.put('emailId', data.email);
      $scope.userId = $cookieStore.get('userId');
      $scope.userName = $cookieStore.get('userName');
      $scope.userEmail = $cookieStore.get('emailId');
    }).error(function(data) {
      console.log('data', data);
    });
  }

  //reset or change password
  $scope.showChangePassword = function(){
    $scope.userChangePassword =  true;
  }

  // var token ={
  //   "token" : authToken
  // }
  $scope.changePassword = function() {
      var PwdauthToken = $cookieStore.get('token');
      $scope.userId = $cookieStore.get('userId');
    var passwordToChange = {
      "oldPassword": $scope.oldPassword,
      "newPassword": $scope.newPassword
    }

      var BASE_URL = "http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com:9000";
        var config = {
            headers : {
                'Authorization': 'Bearer '+PwdauthToken,
                'Content-Type': 'application/json'
            }
        }

        $http.post(BASE_URL +  '/api/users/'+$scope.userId+'/password', passwordToChange, config)
        .success(function (data, status, headers, config) {
            console.log('user profile', data.name);
            $scope.userName = data.name;
            $scope.userEmail = data.email;

        })
        .error(function (data, status, header, config) {
            $scope.ResponseDetails = "Data: " + data +
                "<hr />status: " + status +
                "<hr />headers: " + header +
                "<hr />config: " + config;
        });
      $scope.editPassword = false;

  }

  //NOTE : GooglePlus login
  $scope.googlePlusLogin = function () {
         GooglePlus.login().then(function (authResult) {
             console.log("authResult",authResult);

             GooglePlus.getUser().then(function (data) {
                 console.log("user",data);
                 $scope.userName = data.name;
                 $scope.emailId = data.email;
                 $scope.imageUrls = data.picture;
                 console.log("$scope.imageUrls",$scope.imageUrls);
                 $cookieStore.put("emailId", $scope.emailId);
                 $cookieStore.put('userName', $scope.userName);
                 $cookieStore.put('imageUrls', data.picture);
                 localStorage.setItem('imageUrls', data.picture);
                 $scope.imageUrls = localStorage.getItem('imageUrls');
                 console.log("$scope.imageUrls",$scope.imageUrls);
                 var socailParams = {
                   "email": $scope.emailId,
                   "name": $scope.userName
                 }
                 Auth.socailLogin(socailParams).success(function(data) {
                   console.log('social Resp', data);
                   $cookieStore.put("token", data.token);
                   $cookieStore.put("userId", data._id);
                   $cookieStore.put("emailId", $scope.emailId);
                   $cookieStore.put('userName', data.name);

                   $('.modal').css("display", "none");
                   $('.modal-open').removeClass();
                   $scope.closeModal();
                   location.reload();
                 }).error(function(data) {
                   console.log('data', data);
                 });

             });

         }, function (err) {
             console.log(err);
         });

        // $window.location.href = 'http://localhost:9000/auth/google';
        // // $scope.userId = $cookieStore.get('userId');
        //location.reload();
       };

  //NOTE:FB login

$scope.fbLoginAuth = function() {
  $scope.login = function() {
    // From now on you can use the Facebook service just as Facebook api says
    Facebook.login(function(response) {
      // Do something with response.
        $scope.me();
      console.log("Facebook", response);
      $scope.getLoginStatus();
    });
  };
  $scope.login();
  $scope.getLoginStatus = function() {
    Facebook.getLoginStatus(function(response) {
      console.log(response);
      $scope.me();
      $('.modal').css("display", "none");
      $('.modal-open').removeClass();
      $scope.closeModal();

      // if (response.status === 'connected') {
      //   $scope.me();
      //   $scope.loggedIn = true;
      // } else {
      //   $scope.loggedIn = false;
      // }
    });
  };
  $scope.getLoginStatus();
  //Facbook-me
  $scope.me = function() {
    Facebook.api('/me', { locale: 'en_US', fields: 'name, email' }, function(response) {
      /**
       * Using $scope.$apply since this happens outside angular framework.
       */
      $scope.$apply(function() {
        $scope.user = response;
        $scope.userName = response.name;
        $scope.emailId = response.email
        $cookieStore.put("emailId", $scope.emailId);
        $cookieStore.put('userName', $scope.userName);
        console.log("$scope.user",$scope.user);


      });
      var socailParams = {
        "email": $scope.emailId,
        "name": $scope.userName
      }
      Auth.socailLogin(socailParams).success(function(data) {
        console.log('social Resp', data);
        $cookieStore.put("token", data.token);
        $cookieStore.put("userId", data._id);
        $cookieStore.put('userName', data.name);
        $('.modal').css("display", "none");
        $('.modal-open').removeClass();
        $scope.closeModal();
        location.reload(true);
      }).error(function(data) {
        console.log('data', data);
      });

    });
  };
};

//home
$scope.redirectLanding = function() {
  // location.reload();
  $location.path('/landing');
}

//load modal windows on click
$scope.signupModal = function(){
  $('#loginmodal').modal('show');
  $('#signupmodal').modal('hide');
}
$scope.loginModal = function(){
  $('#loginmodal').modal('hide');
  $('#signupmodal').modal('show');
}

//order getOrderBuYUserId
$scope.getOrdersByUserId = function() {

  Auth.getOrdersByUserId().success(function(data) {
    $scope.orderHistoryLive = data;
    $scope.orderHistory = data;
    for (var i = 0; i < $scope.orderHistory.length; i++) {
      console.log($scope.orderHistory[i].itmes);
      $scope.orderDetailsProduct = $scope.orderHistory[i].itmes;
      $scope.ordersProductName = $scope.orderHistory[i].itmes[i];
      console.log("name",$scope.ordersProductName);
    }

    console.log('user orders', $scope.orderHistory);
    console.log('user orders', $scope.orderHistoryLive);
  }).error(function(data) {
    console.log('data', data);
  });
};

$scope.showLiveOrders = true;
$scope.liveOrders = function(){
  $scope.showLiveOrders = true;
  $scope.showPastOrders = false;
}
$scope.pastOrders = function(){
  $scope.showPastOrders = true;
  $scope.showLiveOrders = false;
}

//get Address
$scope.getAddressMyAccount = function(){
  Auth.getAddressByUserId().success(function(data){
    $scope.getAddressByUserId = data;
  }).error(function(data){
    console.log(data);
  });
}

//delete Address by Address ID
$scope.deleteAddress = function(addressId){
  console.log(addressId);
  Auth.deleteAddress(addressId)
  .success(function(data){
    $scope.getAddressMyAccount();
    console.log('address deleted', data);
    // ngToast.create({
    //   className: 'success',
    //   content: data.message
    // });
      }).error(function(data){
        console.log(data);
      });
}
//edit Address by Address ID
$scope.showEditAddressFields = false;
$scope.getAddressIdToEdit = function(addressId){
  $scope.showEditAddressFields = true;
  console.log(addressId);
  $scope.getAddressId = addressId;
  for (var i = 0; i < $scope.getAddressByUserId.length; i++) {
    if ($scope.getAddressByUserId[i]._id === addressId) {
        $scope.name = $scope.getAddressByUserId[i].name;
        $scope.addressType = $scope.getAddressByUserId[i].addressType;
        $scope.houseNo = $scope.getAddressByUserId[i].houseNo;
        $scope.streetName = $scope.getAddressByUserId[i].streetName;
        $scope.landmark = $scope.getAddressByUserId[i].landmark;
        $scope.companyName = $scope.getAddressByUserId[i].companyName;
        $scope.officeNumber = $scope.getAddressByUserId[i].officeNumber;
        $scope.mobileNumber = $scope.getAddressByUserId[i].mobileNumber;
        $scope.landLineNumber = $scope.getAddressByUserId[i].landLineNumber;
        $scope.pinCode = $scope.getAddressByUserId[i].pinCode;
        $scope.city = $scope.getAddressByUserId[i].city;
        $scope.state = $scope.getAddressByUserId[i].state;
        $scope.country = $scope.getAddressByUserId[i].country;
    }
  }
}
$scope.editAddress = function(){

  var addressDetails = {
  name: $scope.name,
  userID: $scope.userId ,
  addressType: $scope.addressType,
  // "authToken": "",
  houseNo: $scope.houseNo,
  streetName: $scope.streetName,
  landmark: $scope.landmark,
  // street4: Near to hotel,
  companyName: $scope.companyName,
  // officeNumber: 1234567890,
  mobileNumber: $scope.mobileNumber,
  landLineNumber: $scope.landLineNumber,
  pinCode: $scope.pinCode,
  city: $scope.city,
  state: $scope.state,
  country: $scope.country
  // isDefault: True
};
  Auth.editAddress($scope.getAddressId,addressDetails)
  .success(function(data){
    $scope.getAddressMyAccount();
    $scope.showEditAddressFields = false;
    console.log('address deleted', data);
    // ngToast.create({
    //   className: 'success',
    //   content: "Successfully Updated the address"
    // });
      }).error(function(data){
        console.log(data);
      });
}

//upload formdata imageUrls
      var formdata = new FormData();
      $scope.isDataAvailable = false;
      $scope.getTheFiles = function($files) {
        //load modal for crop
        // $('#imageCropModal').modal('show');
        angular.forEach($files, function(value, key) {
          formdata.append(key, value);
          console.log(formdata);
        });
        console.log($('#file1').val());
        console.log(formdata);
        formdata.append('file', formdata);
        Auth.imageUpload(formdata)
          .success(function(data) {
            console.log('profile formdata', data);
            $scope.profileImage = data.url;
            $scope.isDataAvailable = true;

          }).error(function(data) {
            console.log(data);
          });
      };
      //crop image
      $scope.cropImages = function(){
          $('#imageCropModal').modal('show');
      }
      $scope.myImage = '';
      $scope.myCroppedImage = '';

      var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
          $scope.$apply(function($scope) {
            $scope.myImage = evt.target.result;
          //  console.log("evt.target.result",evt.target.result);
          });
        };
        $scope.fileToForm = file;
        reader.readAsDataURL(file);
        console.log("file)", $scope.fileToForm);

      };
      angular.element(document.querySelector('#file1')).on('change', handleFileSelect);
      //selct crop and preview
      // $scope.showCropImage = false;
      $scope.selectedCropImage = function(cropImg){
        $scope.showCropImage = true;
        $scope.croppedImage = cropImg;
        //console.log("$scope.croppedImage",$scope.croppedImage);
  $('#imageCropModal').modal('hide');
        var base64_string = cropImg;
        // $(function () {
        //     var $img = $("<img/>");
        //     $img.attr("src", "data:image/png;base64," + base64_string);
        //      $("#img_preview").append($img);
        //     console.log("$img",$img);
        // });
        // $scope.imagePreviewOfCrop = 'data:image/png;base64,' + cropImg;
        // console.log("  $scope.imagePreviewOfCrop ",  $scope.imagePreviewOfCrop );
        //api call
        // var formdata = new FormData();
        // formdata.append('file', formdata);
        // console.log("formdata new",formdata);
        // Auth.imageUpload(formdata)
        //   .success(function(data) {
        //     console.log('profile formdata', data);
        //     $scope.profileImage = data.url;
        //     $scope.isDataAvailable = true;
        //     $('#imageCropModal').modal('hide');
        //   }).error(function(data) {
        //     console.log(data);
        //   });
      }

  //image profile
      $scope.hideAvatar = true;
      $scope.ProfileUpdate = function() {
        $scope.hideAvatar = false;
        var profileDetails = {
          "name": $scope.userName,
          "image_url": $scope.profileImage,
          "mobile_number":$scope.mobile_number
        }
        Auth.profileImageUpload(profileDetails)
          .success(function(data) {
            $scope.getUserProfile();
            $scope.showAvatar = false;
            console.log('profile updated data', data);
            $scope.emailId = data.email;
            $scope.userName = data.name;
            $scope.editImage=false;
            // ngToast.create({
            //   className: 'success',
            //   content: "Successfully Updated the address"
            // });
          }).error(function(data) {
            console.log(data);
          });

      };

      //post feedBack
      $scope.feedBack = function(){
        $scope.userId = $cookieStore.get('userId');
        var feedBackDetails = {
          "userID": $scope.userId,
          "feedBackComments" : $scope.feedBackComments
        }
        Auth.feedBack(feedBackDetails)
          .success(function(data) {
            $scope.feedBackComments = "";
            console.log('profile updated data', data);

            ngToast.create({
              className: 'success',
              content: "Feedback Sent Successfully",
              maxNumber:1,
               timeout:1000,
               dismissOnTimeout:	true
            });
          }).error(function(data) {
            console.log(data);
            // ngToast.create({
            //   className: 'warning',
            //   content: data.message
            // });
          });

      }

      //empty cart
      $scope.emptyCart = function () {
        $scope.cookieUserId = $cookieStore.get('userId');
        $scope.userToken = $cookieStore.get('token');
        $scope.sessionId = $cookieStore.get('sessionId');

        Auth.emptyCart({UserID:$scope.cookieUserId,sessionID : $scope.sessionId,isDeleted: true})
        .success(function(data){
          console.log('empty cart', data);
            }).error(function(data){
              // ngToast.create({
              //   className: 'warning',
              //   content: 'Problem in deleting from Cart'
              // });
            });
          };

          $scope.showContactUs = function(){
            $location.path('/myaccount').search({
              show_contactUs: "contactNsupport"
            });
          }


          if($routeParams.show_contactUs){
            $scope.showTab = 'contactNsupport';
            $scope.ContactSupport = true;
            $scope.OldContactSupport = false;
          }


}).directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };

            return {
                link: fn_link
            }
        } ]);

app.controller('mainController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore,$interval, ngToast ){
  'use strict';
  $scope.showTab = "Recommended";
  $(document).ready(function() {
    $('.products-tab').hide();
    $('.products-tab').first().show();
    $('#tabs-menu a').first().addClass('active');

    $('#tabs-menu a').click(function(e) {
      $('.products-tab').hide();
      $('#tabs-menu a').removeClass('active');

      $(this).addClass('active');
      e.preventDefault();
      var thisTab = $(this).attr('href');
      $(thisTab).show();
    });
  });

  $('.header-menu__list').find('a').click(function(){
    var $href = $(this).attr('href');
    var $anchor = $($href).offset();
    window.scrollTo($anchor.left,$anchor.top  - 147);
    return false;
  });

  $(document).ready(function(){
  	$('.search-icon').click(function() {
  		$('.search-box').show();
      $('.close-icon').show();
  	});
  	$('.close-icon').click(function() {
  		$('.search-box').hide();
      $('.close-icon').hide();
  	});
  });

  // $(document).ready(function() {
  //     $("#lightSlider").lightSlider({
  //         item: 5,
  //         autoWidth: false,
  //         slideMove: 5, // slidemove will be 1 if loop is true
  //         slideMargin: 10,
  //
  //         addClass: '',
  //         mode: "slide",
  //         useCSS: true,
  //         cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
  //         easing: 'linear', //'for jquery animation',////
  //
  //         speed: 400, //ms'
  //         auto: false,
  //         loop: false,
  //         slideEndAnimation: true,
  //         pause: 2000,
  //
  //         keyPress: false,
  //         controls: true,
  //         prevHtml: '',
  //         nextHtml: '',
  //
  //         rtl:false,
  //         adaptiveHeight:false,
  //
  //         vertical:false,
  //         verticalHeight:500,
  //         vThumbWidth:100,
  //
  //         thumbItem:10,
  //         pager: true,
  //         gallery: false,
  //         galleryMargin: 5,
  //         thumbMargin: 5,
  //         currentPagerPosition: 'middle',
  //
  //         enableTouch:true,
  //         enableDrag:true,
  //         freeMove:true,
  //         swipeThreshold: 40,
  //
  //         responsive : [],
  //
  //         onBeforeStart: function (el) {},
  //         onSliderLoad: function (el) {},
  //         onBeforeSlide: function (el) {},
  //         onAfterSlide: function (el) {},
  //         onBeforeNextSlide: function (el) {},
  //         onBeforePrevSlide: function (el) {}
  //     });
  // });

  //
  // $scope.slickConfig = {
  //     enabled: true,
  //     autoplay: true,
  //     draggable: false,
  //     autoplaySpeed: 3000,
  //     method: {},
  //     event: {
  //         beforeChange: function (event, slick, currentSlide, nextSlide) {
  //         },
  //         afterChange: function (event, slick, currentSlide, nextSlide) {
  //         }
  //     }
  // };

  //section slider
  $scope.myInterval = 8000;
  $scope.noWrapSlides = false;

//   var slideIndex = 0;
// $scope.showSlides = function() {
//     var i;
//     var slides = document.getElementsByClassName("mySlides");
//     var dots = document.getElementsByClassName("dot");
//     for (i = 0; i < slides.length; i++) {
//        slides[i].style.display = "none";
//     }
//     slideIndex++;
//     if (slideIndex> slides.length) {slideIndex = 1}
//     // for (i = 0; i < dots.length; i++) {
//     //   //  dots[i].className = dots[i].className.replace(" active", "");
//     // }
//     slides[slideIndex-1].style.display = "block";
//     //$(slides[slideIndex-1]).css("display","block");
//     //dots[slideIndex-1].className += " active";
//     setTimeout($scope.showSlides, 6000); // Change image every 2 seconds
// }

  //create session id

    $scope.createUUID = function() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      console.log("uuid",uuid);
      //cookie store
      //cookieStore
       $cookieStore.put("sessionId", uuid);
      return uuid;
    }

    if ($cookieStore.get('sessionId')) {
      //$scope.createUUID();
      console.log("cookie will not store sessionId as there is  session id");
    } else {
      console.log("cookie will  store sessionId ");
      $scope.createUUID();
    }

    console.log("cookie",$cookieStore.get('sessionId'));

  //slider

$('#prv-testimonial').on('click', function(){
    var $last = $('#testimonial-list .slide-list:last');
    $last.remove().css({ 'margin-left': '-248px' });
    $('#testimonial-list .slide-list:first').before($last);
    $last.animate({ 'margin-left': '0px' }, 1000);
});


function nextSlider(){
  $('#nxt-testimonial').on('click', function(){
      var $first = $('#testimonial-list .slide-list:first');
      $first.animate({ 'margin-left': '-248px' }, 1000, function() {
          $first.remove().css({ 'margin-left': '0px' });
          $('#testimonial-list .slide-list:last').after($first);
      });
  });
}
setTimeout(nextSlider, 8000);


//category scrooll
$('#next').on('click',function(e){
  e.preventDefault();
  $('.scroll-menu').animate({'margin-left':'0px'}, 1000, function(){
    // $('#next').addClass('hidden');
    // $('#prev').removeClass('hidden');
  });
});
$('#prev').on('click',function(e){
  e.preventDefault();
  $('.scroll-menu').animate({'margin-left':'-190px'}, 1000, function(){
    // $('#prev').addClass('hidden');
    // $('#next').removeClass('hidden');
  });
});

  //redirection
  $(".search-box").keypress(function (e) {
      var code = e.keyCode ? e.keyCode : e.which;
      if (code.toString() == 13) {
         nextpage(); // call the function to redirect to another page
          return false;
      }
    });

  // Function that redirect the user to another page
  function nextpage() {
    window.location = "#/search-page";
  }


  //scrooling page,showing header fixed

// $(window).scroll(function(){
//   var elementPosition = $('#scroll-menu-fixed').offset().top;
//   if($(window).scrollTop() > elementPosition){
//     $('#scroll-menu-fixed').css('position','fixed').css({"top":"0","right":"0","left":"0"});
//   } else {
//     $('#scroll-menu-fixed').css('position','static');
//   }
// });

  //get all products in landing page
  $scope.product = function() {
    $scope.productslist = [];
    $scope.loading = true;
    Auth.products().success(function(data) {
    console.log('data',data);
    $scope.allProducts = data;
     angular.forEach($scope.allProducts, function (value, key) {
       var obj = {
         "id" : value._id,
         "name" : value.name,
         "description" : value.description,
         "price" : value.salePrice,
         "imag_url" : value.mainImageUrl
       };
       $scope.productslist.push(obj);
       console.log("product id", $scope.productslist);
     });
       $scope.getCategoriesList ();
    }).error(function(data) {
      console.log('data', data);
        console.log("no Products",data);
    });
  }
  $scope.product();

  //get list of categories
  $scope.getCategoriesList = function(){
    $scope.loading = true;
    Auth.getCategories().success (function (data) {
      console.log('get cat data', data);
      $scope.getCategoryList = data;
    }).error(function(data){
      console.log('data', data);
         console.log("no categories");
    });
  }
  $scope.activeTab = 0;
  $scope.categoryNames = "Recommended";
  $scope.setActiveTab = function(tabToSet, categoryName){
    $scope.activeTab = tabToSet;
    $scope.categoryNames = categoryName;
  }

  $scope.initSetTab = function(dir) {
    var parent = angular.element('.menu-tabs__list');
    var $activeateElm = null;
    for(var i=0; i<parent.children().length; i++) {
      if($(parent.children()[i]).children().hasClass('active')) {
        if(dir === 'next') {
          $activeateElm = $(parent.children()[i]).next();
        } else {
          $activeateElm = $(parent.children()[i]).prev();
        }
      }
    }
    $timeout(function() {
      angular.element($activeateElm.find('a')).trigger('click');
    }, 0);
  }

  //POST create add to cart
  $scope.userToken = $cookieStore.get('token');
  var count = 0;
  $scope.addToCart = function(productId) {
    $scope.loading = true;
    if ($cookieStore.get('token')) {

        count++;
        //cookieStore
        $scope.getUserId = $cookieStore.get('userId');
        $scope.userToken = $cookieStore.get('token');
        $scope.sessionId = $cookieStore.get('sessionId');
        //check for no dupes on cart
        $scope.gettingCartIds = [];
        angular.forEach($scope.allCartItems, function(value, key) {
          var obj = {
            "cartIds": value._id,
            "cartQty": value.quantity,
            "productIds": value.product._id
          };
          $scope.gettingCartIds.push(obj);
        });

        //loop to check if prodct id exist in cart then increment qty
        $scope.incrementQty = false;
        $scope.addCart = false;
        for (var i = 0; i < $scope.gettingCartIds.length; i++) {
          console.log($scope.gettingCartIds[i].productIds);
          if ($scope.gettingCartIds[i].productIds === productId) {
            console.log("that cart id of prod", $scope.gettingCartIds[i].cartQty);
            console.log("call increment function");
            $scope.cartQuantity = $scope.gettingCartIds[i].cartQty;
            $scope.cartIds = $scope.gettingCartIds[i].cartIds;
            $scope.incrementQty = true;
          } else {
            console.log("i am here");
            $scope.addCart = true;
          }
        }

        if ($scope.incrementQty === true) {
          console.log('add to quantity');
          $scope.updateCartByIncrement($scope.cartQuantity, $scope.cartIds);
        } else if($scope.incrementQty === false && $scope.addCart === true || $scope.allCartItems.length === 0) {
          // do add to cart if not matching
          console.log('add new item');
          var addQuantity = 1;
          $scope.cartlist = [];
          var productInfo = {
            product: productId,
            quantity: addQuantity,
            UserID: $scope.getUserId,
            sessionID: $scope.sessionId,
            authToken: $scope.userToken,
            isDeleted: false
          }
          Auth.addCart(productInfo)
            .success(function(data) {
              //console.log('data', data);
              $scope.getcartItems();
              ngToast.create({
                className: 'success',
                content: 'Item Added to Cart',
                timeout:1000
              });

              angular.forEach(data, function(value, key) {
                var obj = {
                  "user_id": value.UserID,
                  "productId": value.product,
                  "quantity": value.quantity,
                };
                $scope.cartlist.push(obj);
                console.log("cart", $scope.cartlist);
              });
            }).error(function(data) {
              // ngToast.create({
              //   className: 'warning',
              //   content: 'Problem in Adding to Cart',
              //   timeout:1000
              // });
            });
        }
      }  else {
        $('#loginmodal').modal('toggle');
      }
  };

  //getCart items
  $scope.getcartItems = function () {
    $scope.loading = true;
    // $scope.getUserId = localStorage.getItem('userId');
    // $scope.sessionId = "aa565asdasdy87sadasd987";
    //cookieStore
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    $scope.gettingCartData =[];
    console.log('cart page');
    Auth.getCartList({
      UserId : $scope.getUserId,
      sessionID: $scope.sessionId,
    })
    .success(function (data) {
      console.log(data.length);
      $rootScope.cartLength = data.length;
      $scope.allCartItems = data;
      console.log('get cart data',data);
      $scope.getCategoriesList();
      angular.forEach($scope.allCartItems, function (value, key) {
        var obj = {
          "qty":value.quantity,
          "cartPrice" : value.product.salePrice,
          "productIds" : value.product._id
        };
        $scope.gettingCartData.push(obj);

      });
      console.log("gettingCartData",$scope.gettingCartData);
      $scope.totalCost = 0;
      for (var i = 0; i < $scope.gettingCartData.length; i++) {
          $scope.totalCost += $scope.gettingCartData[i].qty * $scope.gettingCartData[i].cartPrice ;
            console.log("prce", $scope.totalCost);
      }


    }).error(function(data){
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Problem in Get Cart API',
      //   timeout:1000
      // });
    });
  };
  $scope.getcartItems();

  //updateCart increment
  //$scope.countQuantity = 0;
  $scope.updateCartByIncrement = function(quantity,productId) {
    $scope.loading = true;
    $scope.countQuantity =quantity + 1;
    console.log("countQuantity",$scope.countQuantity);
    $scope.getUserId = $cookieStore.get('userId');
    Auth.updateCart({UserID:$scope.getUserId, "quantity": $scope.countQuantity}, productId)
    .success(function(data){
      console.log('updated resp', data);
      // ngToast.create({
      //   className: 'success',
      //   content: 'Quantity Increased in cart',
      //   timeout:1000
      // });
      $scope.getcartItems();
        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in incrementing cart',
          //   timeout:1000
          // });
        });
  }


      //slider
      // $('#myCarousel').carousel({
      //   interval: 1000000
      // })

      $('.carousel .item').each(function(){
        var next = $(this).next();
        if (!next.length) {
          next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        if (next.next().length>0) {
          next.next().children(':first-child').clone().appendTo($(this));
        }
        else {
        	$(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
      });


      //google maps
      //get deliver location
      $scope.getLocationDeliver = function(){
      //  var locations = [];
            Auth.getLocationDeliver().success (function (data) {
              console.log('getLocationDeliver', data);
              $scope.locationDeliver = data;
              //google maps
              var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: new google.maps.LatLng(25.27, 55.29),
                mapTypeId: google.maps.MapTypeId.ROADMAP
              });

              var infowindow = new google.maps.InfoWindow();

              var marker, i;
              //loops data from api
              for (var i = 0; i < data.length; i++) {
                $scope.lat = data[i].lat;
                $scope.lng = data[i].lng;
                $scope.locName = data[i].name;
                $scope.locations = [data[i].name,data[i].lat,data[i].lng];
                console.log("locations",$scope.locations);
                //google maps
                        marker = new google.maps.Marker({
                          position: new google.maps.LatLng(data[i].lat,data[i].lng),
                          map: map
                        });

                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                          return function() {
                            infowindow.setContent(data[i].name);
                            infowindow.open(map, marker);
                          }
                        })(marker, i));
              }

            }).error(function(data){
              console.log('data', data);

            });

      };
      $scope.getLocationDeliver();

  //Note :redirect to show wish list
$scope.showWishList = function(){
  $location.path('/search-page').search({
    show_wishlist: true,
  });
}

//NOTE: redirect to search on click product
  $scope.showProductSearchPage = function(productName, catname, productIds){
    $location.path('/search-page').search({
      show_productDetails: productName,
      category: catname,
      product_id:productIds
    });
  }
  $scope.ourMenu = function(catname){
    $location.path('/search-page').search({
      showMenuResult: true,
      category: catname,
    });
  }

  //NOTE : todays deal api
  $scope.getTodaysDeal = function(){
        Auth.todaysDeal().success (function (data) {
          console.log('get todaysDeal', data);
          $scope.getTodaysDealProduct = data;
        }).error(function(data){
          console.log('data', data);
             console.log("no categories");
        });
  };
  // $scope.getTodaysDeal();

  $scope.getWishList = function () {
    $scope.loading = true;
    // $scope.getUserId = localStorage.getItem('userId');
    // $scope.sessionId = "aa565asdasdy87sadasd987";
    //cookieStore
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    $scope.gettingCartData =[];
    console.log('cart page');
    Auth.getWishList({
      UserId : $scope.getUserId,
      sessionID: $scope.sessionId
    })
    .success(function (data) {
      console.log(data.length);
      $scope.getWishlistData = data;
      $scope.getListOfFav = data;
      $scope.getWishListProductId = [];
      angular.forEach($scope.getWishlistData, function (value, key) {
        var obj = {
          "productIds":value.product._id,
        };
        $scope.getWishListProductId.push(obj.productIds);

      });
      console.log("list of product ids",$scope.getProductIdList);
      console.log("$scope.getWishListProductId",$scope.getWishListProductId);
      // //objects heart to bind in UI
      // $scope.heartList = {};
      // for (var i = 0; i < $scope.getWishListProductId.length; i++) {
      //   $scope.heartList[i] = $scope.getWishListProductId[i];
      //
      // }
      // console.log("$scope.heartList;",$scope.heartList);
      // //objects product to bind in UI
      // $scope.productList = {};
      // for (var i = 0; i < $scope.getProductIdList.length; i++) {
      //   $scope.productList[i] = $scope.getProductIdList[i];
      //
      // }
      // console.log("$scope.productList;",$scope.productList);
      //
      // //two level loops
      // for (var i = 0; i < $scope.getWishListProductId.length; i++) {
      //   for (var i = 0; i < $scope.getProductIdList.length; i++) {
      //       if ($scope.getWishListProductId[i] = $scope.getProductIdList[i]) {
      //         $scope.showHeart = $scope.getWishListProductId;
      //       }
      //
      //   }
      //
      // }

      // //heart list
      // if ($scope.heartList = $scope.productList) {
      //   $scope.showHeart = true;
      // } else {
      //   $scope.showHeart = false;
      // }
    }).error(function(data){
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Problem in getting data from wish list'
      // });
    });
  };

$scope.getWishList();
        //check the heart
        $scope.hideWishlist= true;
        $scope.isInWishlist = function(productId){
          for (var i = 0; i < $scope.getListOfFav.length; i++) {

              if ($scope.getListOfFav[i].product._id == productId) {
                $scope.hideWishlist= true;
                $scope.showFilledHeart = true;
                return true;
              } else {
                $scope.hideWishlist= true;
                  $scope.showFilledHeart = false;

                // return false;
              }

          }
        }
  //POST create wish list
  // var count = 0;
  $scope.addWishList = function (productId) {
    $scope.loading = true;
    //$scope.productIdWishList = productId;
    if ($cookieStore.get('userId')) {
        // for (var i = 0; i < $scope.getWishListProductId.length; i++) {
        //
        //   if ($scope.getWishListProductId[i] == productId) {
        //     $scope.isProdSishList = true;
        //   } else {
        //     $scope.isProdSishList = false;
        //
        //   }
        // }


        // if (!$scope.getWishlistData.length === '') {
          console.log("added to cart");

          var count = 1;
          console.log("quantity count",count);

          //cookieStore
          $scope.getUserId = $cookieStore.get('userId');
          $scope.userToken = $cookieStore.get('token');
          $scope.sessionId = $cookieStore.get('sessionId');
          //check if already added to wish list


                                    $scope.cartlist =[];
                                    var wishListInfo = {
                                      product:productId,
                                      quantity: count,
                                      UserID:$scope.getUserId,
                                      sessionID:$scope.sessionId,
                                      authToken: $scope.userToken,
                                      isDeleted: false
                                    }
                                    Auth.addWishList(wishListInfo)
                                    .success(function(data){
                                      //console.log('data', data);
                                      $scope.getcartItems();
                                      $scope.getWishList();


                                      angular.forEach(data, function (value, key) {
                                            var obj = {
                                              "user_id" : value.UserID,
                                              "productId" : value.product,
                                              "quantity" : value.quantity,
                                            };
                                            $scope.cartlist.push(obj);
                                            console.log("cart",$scope.cartlist);
                                          });
                                        }).error(function(data){
                                          // ngToast.create({
                                          //   className: 'warning',
                                          //   content: 'Problem in server'
                                          // });
                                        });

                    // }
        } else {
            $('#loginmodal').modal('toggle');
        }
  };

  //delete wish list
  $scope.deleteWishList =  function(productId){
    console.log("delete view id ",productId);
    for (var i = 0; i < $scope.getWishlistData.length; i++) {
      if ($scope.getWishlistData[i].product._id == productId) {
        $scope.wishListId = $scope.getWishlistData[i]._id;
      }
    }
    console.log("$scope.wishListId",$scope.wishListId);
    $scope.getUserId = $cookieStore.get('userId');
    console.log($scope.getUserId );
    Auth.deleteWishList($scope.wishListId,{UserID:$scope.getUserId,product:productId, isDeleted: "true"}).success(function(data) {
      $scope.deltedWishList = data;
      $scope.getWishList();
      console.log("done delted");
      $scope.hideWishlist= true;
      $scope.showFilledHeart = false
      // $scope.getCategoriesList();
      $scope.showMenuResult  = true;
    }).error(function(data) {
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Check Product list API '
      // });
    });
  }

      //show searchPage
      $scope.showSearchPage = function(catname){
        $location.path('/search-page').search({
          showMenuResult: true,
          category: catname,
        });
      }

      //new Banner API
      //NOTE : todays deal api
      $scope.getAllBanner = function(){
            Auth.getBanners().success (function (data) {
              console.log('getBanners', data);
              $scope.getBanners = data;
            }).error(function(data){
              console.log('data', data);
            });
      };
      $scope.getAllBanner();

})

app.controller('productController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore, ngToast){
  'use strict';

$('#next').on('click',function(e){
  e.preventDefault();
  $('.search-page__tab-list').animate({'margin-left':'0px'}, 1000, function(){
    // $('#next').addClass('hidden');
    // $('#prev').removeClass('hidden');
  });
});
$('#prev').on('click',function(e){
  e.preventDefault();
  $('.search-page__tab-list').animate({'margin-left':'-190px'}, 1000, function(){
    // $('#prev').addClass('hidden');
    // $('#next').removeClass('hidden');
  });
});

$(document).ready(function(){
  $('#AddButton').click( function() {
    var counter = $('#TextBox').val();
    counter++ ;
    $('#TextBox').val(counter);
    console.log('click');
  });
  $('#minusButton').click( function() {
    var counter = $('#TextBox').val();
    counter-- ;
    $('#TextBox').val(counter);
  });
  moveScroller();
});

$(window).on('scroll', function() {
  $('.target').each(function() {
    if($(window).scrollTop() >= ($(this).offset().top - 104)) {
      var id = $scope.clearSpaces($(this).attr('id'));
      var $elm = '#'+id+'-a';
      $('#tabs-menu a').removeClass('active');
      $($elm).addClass('active');
    }
  });
});

function moveScroller() {
  var $anchor = $("#scroller-anchor");
  var $scroller = $('#scroller');

  var move = function() {
    var st = $(window).scrollTop();
    var ot = $anchor.offset().top;
    if(st > ot) {
      $scroller.css({
        position: "fixed",
        top: "0px",
        width: "70%"
      });
      $anchor.css({
        height: "104px"
      });
    } else {
      if(st <= ot) {
        $scroller.css({
          position: "relative",
          top: "",
          width: "100%"
        });
        $anchor.css({
          height: "0px"
        });
      }
    }
  };
  $(window).scroll(move);
  move();
}

$scope.init = function() {
  $scope.product();
  $scope.getWishList();
}

//invoke wishList on routeParams
if($routeParams.showMenuResult){
  $scope.showMenuResult = true;
  $scope.categoryNames = $routeParams.category;
}

//show menu
if($routeParams.show_wishlist){
  $scope.show_wishlist = true;
}

$scope.initSetFirtsTab = function() {
  if($location.path() === '/search-page') {

  }
}
//window height for cart__search
console.log("$(window).height(); ",$(window).height());
  $scope.cartHeight = $(window).innerHeight()/2;


  $scope.createUUID = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    console.log("uuid",uuid);
    //cookie store
    //cookieStore
     $cookieStore.put("sessionId", uuid);
    return uuid;
  }

  if ($cookieStore.get('sessionId')) {
    //$scope.createUUID();
    console.log("cookie will not store sessionId as there is  session id");
  } else {
    console.log("cookie will  store sessionId ");
    $scope.createUUID();
  }

  console.log("cookie",$cookieStore.get('sessionId'));

  //NOTE: get product name from  url
  $scope.showParticularProducts = function(id){
      if($routeParams.show_productDetails){

        Auth.products().success(function(data) {
          $scope.searchPagelist = false;
          $scope.particularProduct = true;
          $scope.show_wishlist  = false;
          $scope.showMenuResult  = true;
          $scope.hideAutocomplete = false;

          for (var i = 0; i < data.length; i++) {
            if (id == data[i]._id) {
              $scope.search_result_product = data[i];

            }
          }
              $scope.showParticularProductsDiv = true;

          console.log("$scope.search_result ",$scope.search_result_product );
          console.log("data[i]",$scope.search_result_product);
        }).error(function(data) {
        });
      }
  }

  $scope.$on('$routeChangeSuccess', function() {
   console.log("$routeParams",$routeParams);
   $scope.showParticularProducts ($routeParams.product_id);
});
  if($routeParams.show_productDetails){
    $scope.showParticularProducts($routeParams.product_id);
    $scope.showParticularProductsDiv = true;
    $scope.categoryNames = $routeParams.category;
  }

  //minimum order value to be calculated to add delivery
  $scope.getMinimumOrder = function() {

    Auth.getMinimumOrder().success(function(data) {
      for (var i = 0; i < data.length; i++) {
        $scope.minimumOrderAmount = data[i].minimumOrderAmount;
        $scope.deliveryOrderAmount = data[i].deliveryOrderAmount;
      }
    }).error(function(data) {
      console.log("getMinimumOrder api fails");
    });
  }

  $scope.getcartItems = function () {
    $scope.loading = true;
    // $scope.getUserId = localStorage.getItem('userId');
    // $scope.sessionId = "aa565asdasdy87sadasd987";
    //cookieStore
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    $scope.gettingCartData =[];
    console.log('cart page');
    Auth.getCartList({
      UserId : $scope.getUserId,
      sessionID: $scope.sessionId,
    })
    .success(function (data) {
      console.log(data.length);
      $rootScope.cartLength = data.length;
      $scope.allCartItems = data;
      console.log('get cart data',data);
      $scope.getCategoriesList();
      $scope.getMinimumOrder();
      angular.forEach($scope.allCartItems, function (value, key) {
        var obj = {
          "qty":value.quantity,
          "cartPrice" : value.product.salePrice,
          "productIds" : value.product._id
        };
        $scope.gettingCartData.push(obj);

      });

      console.log("gettingCartData",$scope.gettingCartData);
      $scope.totalCost = 0;
      $scope.subTotalCost = 0;
    //  $scope.deliveryOrderAmount = 0;
      for (var i = 0; i < $scope.gettingCartData.length; i++) {
          $scope.subTotalCost += $scope.gettingCartData[i].qty * $scope.gettingCartData[i].cartPrice ;
          $scope.totalCost += $scope.gettingCartData[i].qty * $scope.gettingCartData[i].cartPrice ;
            console.log("prce", $scope.totalCost);
      }
      $scope.showDeliveryCost = true;

      //calculate delivery cost
      if ($scope.totalCost <= $scope.minimumOrderAmount) {
          //$scope.showDeliveryCost = true;
          $timeout(function() {
            $scope.totalCost += $scope.deliveryOrderAmount;
          }, 500);

      } else {
        $scope.showDeliveryCost = false;
      }

      //cart length zero total is zero
      if ($scope.gettingCartData.length === 0) {
        $scope.totalCost = 0;
      }

    }).error(function(data){
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Problem in Get Cart API'
      // });
    });
  };
  $scope.getcartItems();

  //updateCart increment
  //$scope.countQuantity = 0;
  $scope.updateCartByIncrement = function(quantity,productId) {
    $scope.countQuantity =quantity + 1;
    console.log("countQuantity",$scope.countQuantity);
    $scope.getUserId = $cookieStore.get('userId');
    Auth.updateCart({UserID:$scope.getUserId, "quantity": $scope.countQuantity}, productId)
    .success(function(data){
      console.log('updated resp', data);
      $scope.getcartItems();
        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in incrementing cart'
          // });
        });
  }

  //updateCart on decrement
  $scope.countQuantity = 0;
  $scope.updateCartByDecrementing = function(quantity,productId) {
    $scope.countQuantity =quantity - 1;
    console.log("countQuantity",$scope.countQuantity);
    $scope.getUserId = $cookieStore.get('userId');
    if ($scope.countQuantity > 0) {
      Auth.updateCart({UserID:$scope.getUserId, "quantity": $scope.countQuantity}, productId)
      .success(function(data){
        console.log('updated decrement', data);
        $scope.getcartItems();
          }).error(function(data){
            // ngToast.create({
            //   className: 'warning',
            //   content: 'Problem in decrement cart'
            // });
          });
        } else {
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Minimum quantity is 1'
          // });
        }
  }

  //search -autoComplete
  $scope.autocompleteSearch = function (searchNames) {
    $scope.loading = true;
    Auth.autocompleteSearchItem (searchNames).success ( function (data) {
      $scope.searchPagelist = true;
      $scope.particularProduct = false;
      $scope.show_wishlist  = false;
      $scope.showMenuResult  = false;
      $scope.hideAutocomplete = true;
      //NOTE : uncomment if know more is creating a issue
      // $location.search('show_productDetails', null)
      console.log('autcomplete data', data);
      $scope.searchAutocompleteId = data;
    }).error(function(data){
      console.log("autocomplete search",data);
    });
  };

  //search
  $scope.searchList = function (searchName) {
    $scope.loading = true;
    Auth.searchItem (searchName).success ( function (data) {
      $scope.searchPagelist = true;
      $scope.particularProduct = false;
      $scope.show_wishlist  = false;
      $scope.showMenuResult  = false;
      $scope.hideAutocomplete = false;
      $scope.categoryNames = $routeParams.category;
      console.log('search data', data);
      $scope.search_result = data;

    }).error(function(data){
      console.log("problem in search term API",data);
    });
  };

  //POST create add to cart
  var count = 0;
  $scope.addToCart = function(productId) {
    $scope.loading = true;
    if ($cookieStore.get('token')) {
        count++;
        //cookieStore
        $scope.getUserId = $cookieStore.get('userId');
        $scope.userToken = $cookieStore.get('token');
        $scope.sessionId = $cookieStore.get('sessionId');
        //check for no dupes on cart
        $scope.gettingCartIds = [];
        angular.forEach($scope.allCartItems, function(value, key) {
          var obj = {
            "cartIds": value._id,
            "cartQty": value.quantity,
            "productIds": value.product._id
          };
          $scope.gettingCartIds.push(obj);
        });

        //loop to check if prodct id exist in cart then increment qty
        $scope.incrementQty = false;
        $scope.addCart = false;
        for (var i = 0; i < $scope.gettingCartIds.length; i++) {
          console.log($scope.gettingCartIds[i].productIds);
          if ($scope.gettingCartIds[i].productIds === productId) {
            console.log("that cart id of prod", $scope.gettingCartIds[i].cartQty);
            console.log("call increment function");
            $scope.cartQuantity = $scope.gettingCartIds[i].cartQty;
            $scope.cartIds = $scope.gettingCartIds[i].cartIds;
            $scope.incrementQty = true;
          } else {
            console.log("i am here");
            $scope.addCart = true;
          }
        }

        if ($scope.incrementQty === true) {
          console.log('add to quantity');
          $scope.updateCartByIncrement($scope.cartQuantity, $scope.cartIds);
        } else if($scope.incrementQty === false && $scope.addCart === true || $scope.allCartItems.length === 0) {
          // do add to cart if not matching
          console.log('add new item');
          var addQuantity = 1;
          $scope.cartlist = [];
          var productInfo = {
            product: productId,
            quantity: addQuantity,
            UserID: $scope.getUserId,
            sessionID: $scope.sessionId,
            authToken: $scope.userToken,
            isDeleted: false
          }
          Auth.addCart(productInfo)
            .success(function(data) {
              //console.log('data', data);
              $scope.getcartItems();
              // ngToast.create({
              //   className: 'success',
              //   content: 'Item Added to Cart'
              // });

              angular.forEach(data, function(value, key) {
                var obj = {
                  "user_id": value.UserID,
                  "productId": value.product,
                  "quantity": value.quantity,
                };
                $scope.cartlist.push(obj);
                console.log("cart", $scope.cartlist);
              });
            }).error(function(data) {
              // ngToast.create({
              //   className: 'warning',
              //   content: 'Problem in Adding to Cart'
              // });
            });
        }
      }  else {
        $('#loginmodal').modal('toggle');
      }
  };

  //delte cart
  $scope.deleteCart = function (productId,quantity) {
    $scope.loading = true;
    // $scope.getUserId = localStorage.getItem('userId');
    // $scope.userToken = localStorage.getItem('token');
    // $scope.sessionId = "aa565asdasdy87sadasd987";
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    Auth.deleteCart({UserID:$scope.getUserId,sessionID : $scope.sessionId,isDeleted: true}, productId)
    .success(function(data){
      console.log('deleted resp', data);
      $scope.getcartItems();
      // ngToast.create({
      //   className: 'success',
      //   content: 'Item Deleted from Cart'
      // });
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);

        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in deleting from Cart'
          // });
        });
      };

      $scope.wishListShow = function () {
        $scope.show_wishlist  = true;
        $scope.searchPagelist = false;
        $scope.particularProduct = false;

        $scope.showMenuResult  = false;
        $scope.getWishList();
      }

      //get all products in landing page
      $scope.product = function() {
        $scope.loading = true;
        $scope.productslist = [];
        Auth.products().success(function(data) {
          $scope.allProducts = data;
          console.log("data",data);
          $scope.getWishList();
          //loop to get product id
          $scope.getProductIdList = [];
          angular.forEach($scope.allProducts, function (value, key) {
            var obj = {
              "productIds":value._id,
            };
            $scope.getProductIdList.push(obj.productIds);

          });


          // for (var i = 0; i < $scope.getWishListProductId.length; i++) {
          //   // $scope.getWishListProductId[i]
          // }
        //  $scope.showMenuResult  = true;
        }).error(function(data) {
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Check Product list API ',
          //   timeout:1000
          // });
        });
      }

      //get wish list

      $scope.getWishList = function () {
        $scope.loading = true;
        // $scope.getUserId = localStorage.getItem('userId');
        // $scope.sessionId = "aa565asdasdy87sadasd987";
        //cookieStore
        $scope.getUserId = $cookieStore.get('userId');
        $scope.userToken = $cookieStore.get('token');
        $scope.sessionId = $cookieStore.get('sessionId');

        $scope.gettingCartData =[];
        console.log('cart page');
        Auth.getWishList({
          UserId : $scope.getUserId,
          sessionID: $scope.sessionId
        })
        .success(function (data) {
          console.log(data.length);
          $scope.getWishlistData = data;
          $scope.getListOfFav = data;
          $scope.getWishListProductId = [];
          angular.forEach($scope.getWishlistData, function (value, key) {
            var obj = {
              "productIds":value.product._id,
            };
            $scope.getWishListProductId.push(obj.productIds);

          });
          console.log("list of product ids",$scope.getProductIdList);
          console.log("$scope.getWishListProductId",$scope.getWishListProductId);
          //objects heart to bind in UI
          $scope.heartList = {};
          for (var i = 0; i < $scope.getWishListProductId.length; i++) {
            $scope.heartList[i] = $scope.getWishListProductId[i];

          }
          console.log("$scope.heartList;",$scope.heartList);
          //objects product to bind in UI
          $scope.productList = {};
          for (var i = 0; i < $scope.getProductIdList.length; i++) {
            $scope.productList[i] = $scope.getProductIdList[i];

          }
          console.log("$scope.productList;",$scope.productList);

          //two level loops
          for (var i = 0; i < $scope.getWishListProductId.length; i++) {
            for (var i = 0; i < $scope.getProductIdList.length; i++) {
                if ($scope.getWishListProductId[i] = $scope.getProductIdList[i]) {
                  $scope.showHeart = $scope.getWishListProductId;
                }

            }

          }

          //heart list
          if ($scope.heartList = $scope.productList) {
            $scope.showHeart = true;
          } else {
            $scope.showHeart = false;
          }
        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in getting data from wish list'
          // });
        });
      };

      //check the heart
      $scope.hideWishlist= true;
      $scope.isInWishlist = function(productId){
        for (var i = 0; i < $scope.getListOfFav.length; i++) {

            if ($scope.getListOfFav[i].product._id == productId) {
              $scope.hideWishlist= true;
              $scope.showFilledHeart = true;
              return true;
            } else {
              $scope.hideWishlist= true;
                $scope.showFilledHeart = false;

              // return false;
            }

        }
      }

      //POST create wish list
      // var count = 0;
      $scope.addWishList = function (productId) {
        $scope.loading = true;
        //$scope.productIdWishList = productId;
        if ($cookieStore.get('userId')) {
            // for (var i = 0; i < $scope.getWishListProductId.length; i++) {
            //
            //   if ($scope.getWishListProductId[i] == productId) {
            //     $scope.isProdSishList = true;
            //   } else {
            //     $scope.isProdSishList = false;
            //
            //   }
            // }


            // if ($scope.isProdSishList == false || $scope.getWishlistData.length === 0) {
              console.log("added to cart");

              var count = 1;
              console.log("quantity count",count);

              //cookieStore
              $scope.getUserId = $cookieStore.get('userId');
              $scope.userToken = $cookieStore.get('token');
              $scope.sessionId = $cookieStore.get('sessionId');
              //check if already added to wish list


                                        $scope.cartlist =[];
                                        var wishListInfo = {
                                          product:productId,
                                          quantity: count,
                                          UserID:$scope.getUserId,
                                          sessionID:$scope.sessionId,
                                          authToken: $scope.userToken,
                                          isDeleted: false
                                        }
                                        Auth.addWishList(wishListInfo)
                                        .success(function(data){
                                          //console.log('data', data);
                                          // $scope.getcartItems();
                                          $scope.getWishList();


                                          angular.forEach(data, function (value, key) {
                                                var obj = {
                                                  "user_id" : value.UserID,
                                                  "productId" : value.product,
                                                  "quantity" : value.quantity,
                                                };
                                                $scope.cartlist.push(obj);
                                                console.log("cart",$scope.cartlist);
                                              });
                                            }).error(function(data){
                                              // ngToast.create({
                                              //   className: 'warning',
                                              //   content: 'Problem in server'
                                              // });
                                            });

                        // }
            } else {
                $('#loginmodal').modal('toggle');
            }
      };


          //checkout
          $scope.checkout = function() {
            if($cookieStore.get('userId')){
              if ($scope.allCartItems.length == 0) {
                // ngToast.create({
                //   className: 'warning',
                //   content: 'Please add item to cart to checkout',
                //   timeout:1000
                // });
              } else {
                window.location = "#/checkout";
              }
            } else {
              console.log("Please Login");
              // window.location = "#/landing";
              $('#loginmodal').modal('toggle');
            }
          }

          $scope.clearSpaces = function(string) {
            if(!angular.isString(string)) {
              return string;
            }
            return string.replace(/[\s]/g, '');
          }

          $scope.setActiveTab = function(categoryName){
              $scope.categoryNames = categoryName;
              var elm = '#'+$scope.clearSpaces(categoryName);
              var top = $(elm).offset().top - 104;
              console.log('top', top);
              $("html, body").animate({
                  scrollTop: top
              }, 600);
              $scope.searchPagelist = false;
              $scope.particularProduct = false;
              $scope.show_wishlist  = false;
              $scope.showMenuResult  = true;
              $scope.showdiv = false;
              // $scope.activeTab = tabToSet;
              // $scope.categoryNames = categoryName;
              // console.log("clicked",tabToSet);
          }

          //get list of categories
          $scope.getCategoriesList = function(){
            // angular.forEach($scope.allProducts, function(key, value) {
            //
            // });
            /*Auth.getCategories().success (function (data) {
              $scope.getCategoryList = data;
              // $scope.categoryNames = "Recommended";
              $scope.showMenuResult  = true;
            }).error(function(data){
              ngToast.create({
                className: 'warning',
                content: 'check category api'
              });
            });*/
          }




        //delete wish list
        $scope.deleteWishList =  function(productId){
          console.log("delete view id ",productId);
          for (var i = 0; i < $scope.getWishlistData.length; i++) {
            if ($scope.getWishlistData[i].product._id == productId) {
              $scope.wishListId = $scope.getWishlistData[i]._id;
            }
          }
          console.log("$scope.wishListId",$scope.wishListId);
          $scope.getUserId = $cookieStore.get('userId');
          console.log($scope.getUserId );
          Auth.deleteWishList($scope.wishListId,{UserID:$scope.getUserId,product:productId, isDeleted: "true"}).success(function(data) {
            $scope.deltedWishList = data;
            $scope.getWishList();
            console.log("done delted");
            $scope.hideWishlist= true;
            $scope.showFilledHeart = false
            // $scope.getCategoriesList();
            $scope.showMenuResult  = true;
          }).error(function(data) {
            // ngToast.create({
            //   className: 'warning',
            //   content: 'Check Product list API '
            // });
          });
        }
        //Fb sharer
        $scope.FbShare = function(name,id){

            FB.ui({
              method: 'share',
              display: 'popup',
              href: 'http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com/krazy-meals/#/search-page?show_productDetails='+name+'&product_id='+id,
            }, function(response){});

          }
        $scope.twitterShare = function(ids){
          var twitterHandle = 'Krazy Meals';
            //window.open("https://twitter.com/share?url="+encodeURIComponent(url));
            window.open('https://twitter.com/share?url='+escape('http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com/krazy-meals/#/search-page?show_productDetails='+ids)+'&text='+document.title + ' via @' + twitterHandle, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
          }

          //show mimage modal
          $scope.showImage = function(prodId){
            console.log("prodId",prodId);

            for (var i = 0; i < $scope.allProducts.length; i++) {
              if ($scope.allProducts[i]._id === prodId) {
                $scope.ImageGallery = $scope.allProducts[i];
              }
            }
            // $scope.imageGallery2 = image2;
            // $scope.imageGallery3 = image3;
			       $('#imagemodal').modal('show');
          }
          //image caroscel
          $("#nextImage").click(function(event){
              event.preventDefault();
          });
          $("#prevImage").click(function(event){
              event.preventDefault();
          });
    $scope.init();
});

app.filter('trimSpaces', [function() {
  return function(string) {
    if(!angular.isString(string)) {
      return string;
    }
    return string.replace(/[\s]/g, '');
  };
}]);

'use strict';
app.factory('Auth', function($http, $window, $cookieStore) {
  //var BASE_URL = "http://ec2-35-164-152-22.us-west-2.compute.amazonaws.com:9000";
  //var BASE_URL = "http://ec2-54-187-15-116.us-west-2.compute.amazonaws.com:9000";
  var BASE_URL = "http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com:9000";
  //var BASE_URL = "http://localhost:9000";
  //var BASE_URL = "http://192.168.0.84:9000";
    var authToken = $cookieStore.get('token');
    console.log("authToken",authToken);
    var userId = $cookieStore.get('userId');
    console.log("serv",authToken);
    //var authToken = localStorage.getItem("authToken");
    //$http.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

  return {
    register : function(inputs) {
      return $http.post(BASE_URL + '/api/users', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },

    login : function (inputs) {
      return $http.post(BASE_URL + '/auth/local', inputs,{
        header: {
          'sender': 'web',
          'Content-Type': 'application/json'
        }
      });
    },

    userProfile : function () {
      return $http.get(BASE_URL + '/api/users/me',{
        headers: {
          'Authorization': 'Bearer '+authToken,
          'Content-Type': 'application/json'

        }
      });
      // $http.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
    },

    forgotpassword : function (inputs) {
      return $http.post(BASE_URL + '/api/users/forgotpassword', inputs,{
        header: {
          'sender': 'web',
          'Content-Type': 'application/json'
        }
      });
    },

    changePassword : function (inputs,PwdauthToken) {
      return $http.post(BASE_URL + '/api/users/'+userId+'/password',inputs,{
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+PwdauthToken,
        }
      });
    },

    socailLogin : function (inputs) {
      return $http.post(BASE_URL + '/auth/local?from=app',inputs,{
        header: {
          'Content-Type': 'application/json'
        }
      });
    },

    products : function(inputs) {
      return $http.get(BASE_URL + '/api/products', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    addCart : function(inputs) {
      return $http.post(BASE_URL + '/api/shoppingCart', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getCartList : function(inputs) {
      return $http.post(BASE_URL + '/api/shoppingCart/getCartItems', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    deleteCart : function(inputs,id) {
      return $http.post(BASE_URL + '/api/shoppingCart/updateCart/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    updateCart : function(inputs,id) {
      return $http.post(BASE_URL + '/api/shoppingCart/updateCart/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    addWishList : function(inputs) {
      return $http.post(BASE_URL + '/api/wishLists', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getWishList : function(inputs) {
      return $http.post(BASE_URL + '/api/wishLists/getListItems', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    addAddress : function(inputs) {
      return $http.post(BASE_URL + '/api/address', inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    getAddressByUserId : function() {
      return $http.get(BASE_URL + '/api/address/getaddressByUserId/'+userId, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    autocompleteSearchItem : function(id,inputs) {
      return $http.get(BASE_URL + '/api/autocompleteSearchs/autoComplete/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    searchItem : function(id,inputs) {
      return $http.get(BASE_URL + '/api/products/searchProducts/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getCategories : function(inputs) {
      return $http.get(BASE_URL + '/api/categories', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getOrdersByUserId : function(inputs) {
      return $http.get(BASE_URL + '/api/orders/getOrdersByUser/'+userId, inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    deleteAddress : function(addressId) {
      return $http.delete(BASE_URL + '/api/address/'+addressId , {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    editAddress : function(addressId, addressDetails) {
      return $http.put(BASE_URL + '/api/address/'+addressId ,addressDetails, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    makeCOD : function(inputs) {
      return $http.post(BASE_URL + '/api/checkout/makePayment' ,inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    todaysDeal : function(inputs) {
      return $http.get(BASE_URL + '/api/todaysDeal' ,inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    imageUpload : function(formdata) {
      return $http.post(BASE_URL + '/api/users/image/upload', formdata, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': undefined
        }
      });
    },
    profileImageUpload : function(inputs) {
      return $http.put(BASE_URL + '/api/users/'+userId,inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    feedBack : function(inputs) {
      return $http.post(BASE_URL + '/api/order/feedback',inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    getLocationDeliver : function(inputs) {
      return $http.get(BASE_URL + '/api/deliver/Location',inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getMinimumOrder : function() {
      return $http.get(BASE_URL + '/api/admin/config', {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    deleteWishList : function(wishListId,inputs) {
      return $http.post(BASE_URL + '/api/wishLists/updateList/'+wishListId, inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    emptyCart : function(inputs) {
      return $http.post(BASE_URL + '/api/shoppingCart/emptyCart', inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    getBanners : function() {
      return $http.get(BASE_URL + '/api/banner', {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },


  };
});
