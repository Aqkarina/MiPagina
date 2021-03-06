
(function ($, window, i) {
  $.fn.responsiveSlides = function (options) {

 
    var settings = $.extend({
      "auto": true,             
      "speed": 1000,            
      "timeout": 4000,          
      "pager": false,          
      "nav": false,            
      "random": false,         
      "pause": false,           
      "pauseControls": false,  
      "prevText": "Previous",   
      "nextText": "Next",       
      "maxwidth": "",           
      "controls": "",           
      "namespace": "rslides",   
      before: function () {},   
      after: function () {}     
    }, options);

    return this.each(function () {

      
      i++;

      var $this = $(this),

        
        selectTab,
        startCycle,
        restartCycle,
        rotate,
        $tabs,

       
        index = 0,
        $slide = $this.children(),
        length = $slide.size(),
        fadeTime = parseFloat(settings.speed),
        waitTime = parseFloat(settings.timeout),
        maxw = parseFloat(settings.maxwidth),

        
        namespace = settings.namespace,
        namespaceIdx = namespace + i,

        
        navClass = namespace + "_nav " + namespaceIdx + "_nav",
        activeClass = namespace + "_here",
        visibleClass = namespaceIdx + "_on",
        slideClassPrefix = namespaceIdx + "_s",

        
        $pager = $("<ul class='" + namespace + "_tabs " + namespaceIdx + "_tabs' />"),

        
        visible = {"float": "left", "position": "relative"},
        hidden = {"float": "none", "position": "absolute"},

       
        slideTo = function (idx) {
          settings.before();
          $slide
            .stop()
            .fadeOut(fadeTime, function () {
              $(this)
                .removeClass(visibleClass)
                .css(hidden);
            })
            .eq(idx)
            .fadeIn(fadeTime, function () {
              $(this)
                .addClass(visibleClass)
                .css(visible);
              settings.after();
              index = idx;
            });
        };

      
      if (settings.random) {
        $slide.sort(function () {
          return (Math.round(Math.random()) - 0.5);
        });
        $this
          .empty()
          .append($slide);
      }

      
      $slide.each(function (i) {
        this.id = slideClassPrefix + i;
      });

     
      $this.addClass(namespace + " " + namespaceIdx);
      if (options && options.maxwidth) {
        $this.css("max-width", maxw);
      }

      
      $slide
        .hide()
        .eq(0)
        .addClass(visibleClass)
        .css(visible)
        .show();

      
      if ($slide.size() > 1) {

        
        if (waitTime < fadeTime + 100) {
          return;
        }

        
        if (settings.pager) {
          var tabMarkup = [];
          $slide.each(function (i) {
            var n = i + 1;
            tabMarkup +=
              "<li>" +
              "<a href='#' class='" + slideClassPrefix + n + "'>" + n + "</a>" +
              "</li>";
          });
          $pager.append(tabMarkup);

          $tabs = $pager.find("a");

          
          if (options.controls) {
            $(settings.controls).append($pager);
          } else {
            $this.after($pager);
          }

          
          selectTab = function (idx) {
            $tabs
              .closest("li")
              .removeClass(activeClass)
              .eq(idx)
              .addClass(activeClass);
          };
        }

       
        if (settings.auto) {

          startCycle = function () {
            rotate = setInterval(function () {

              
              $slide.stop(true, true);

              var idx = index + 1 < length ? index + 1 : 0;

             
              if (settings.pager) {
                selectTab(idx);
              }

              slideTo(idx);
            }, waitTime);
          };

          
          startCycle();
        }

        
        restartCycle = function () {
          if (settings.auto) {
            
            clearInterval(rotate);
           
            startCycle();
          }
        };

       
        if (settings.pause) {
          $this.hover(function () {
            clearInterval(rotate);
          }, function () {
            restartCycle();
          });
        }

       
        if (settings.pager) {
          $tabs.bind("click", function (e) {
            e.preventDefault();

            if (!settings.pauseControls) {
              restartCycle();
            }

            
            var idx = $tabs.index(this);

           
            if (index === idx || $("." + visibleClass + ":animated").length) {
              return;
            }

           
            selectTab(idx);

           
            slideTo(idx);
          })
            .eq(0)
            .closest("li")
            .addClass(activeClass);

         
          if (settings.pauseControls) {
            $tabs.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }

       
        if (settings.nav) {
          var navMarkup =
            "<a href='#' class='" + navClass + " prev'>" + settings.prevText + "</a>" +
            "<a href='#' class='" + navClass + " next'>" + settings.nextText + "</a>";

          
          if (options.controls) {
            $(settings.controls).append(navMarkup);
          } else {
            $this.after(navMarkup);
          }

          var $trigger = $("." + namespaceIdx + "_nav"),
            $prev = $("." + namespaceIdx + "_nav.prev");

          
          $trigger.bind("click", function (e) {
            e.preventDefault();

            
            if ($("." + visibleClass + ":animated").length) {
              return;
            }

             

            
            var idx = $slide.index($("." + visibleClass)),
              prevIdx = idx - 1,
              nextIdx = idx + 1 < length ? index + 1 : 0;

           
            slideTo($(this)[0] === $prev[0] ? prevIdx : nextIdx);
            if (settings.pager) {
              selectTab($(this)[0] === $prev[0] ? prevIdx : nextIdx);
            }

            if (!settings.pauseControls) {
              restartCycle();
            }
          });

         
          if (settings.pauseControls) {
            $trigger.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }

      }

      
      if (typeof document.body.style.maxWidth === "undefined" && options.maxwidth) {
        var widthSupport = function () {
          $this.css("width", "100%");
          if ($this.width() > maxw) {
            $this.css("width", maxw);
          }
        };

       
        widthSupport();
        $(window).bind("resize", function () {
          widthSupport();
        });
      }

    });

  };
})(jQuery, this, 0);
