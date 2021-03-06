angular.module('directives.displaySlider',[])
.directive('displaySlider', [ '$timeout', function($timeout) {
    var def = {
        transclude : true,
        scope:{ sliderId:'@' },
        link : function(scope, element, attrs) {
            $timeout(function() {
                $("#"+scope.sliderId).each(function(){
                    $(this).amazingslider({
                        lightboxmode:true,
                        lightboxid:$(this).attr('id'),
                        jsfolder:'/static/img/',
                        width:690,
                        height:0,
                        skinsfoldername:"",
                        loadimageondemand:false,
                        isresponsive:true,
                        autoplayvideo:false,
                        pauseonmouseover:false,
                        addmargin:true,
                        randomplay:false,
                        playvideoonclickthumb:true,
                        slideinterval:5000,
                        enabletouchswipe:true,
                        transitiononfirstslide:false,
                        loop:0,
                        autoplay:false,
                        navplayvideoimage:"play-32-32-0.png",
                        navpreviewheight:60,
                        timerheight:2,
                        shownumbering:false,
                        skin:"Gallery",
                        textautohide:false,
                        addgooglefonts:true,
                        navshowplaypause:true,
                        navshowplayvideo:true,
                        navshowplaypausestandalonemarginx:8,
                        navshowplaypausestandalonemarginy:8,
                        navbuttonradius:0,
                        navthumbnavigationarrowimageheight:32,
                        navpreviewarrowheight:8,
                        showshadow:false,
                        navfeaturedarrowimagewidth:16,
                        navpreviewwidth:120,
                        googlefonts:"Inder",
                        textpositionmarginright:24,
                        bordercolor:"#ffffff",
                        navthumbnavigationarrowimagewidth:32,
                        navthumbtitlehovercss:"text-decoration:underline;",
                        arrowwidth:32,
                        texteffecteasing:"easeOutCubic",
                        texteffect:"",
                        navspacing:8,
                        navarrowimage:"navarrows-28-28-0.png",
                        ribbonimage:"ribbon_topleft-0.png",
                        navwidth:52,
                        showribbon:false,
                        arrowtop:50,
                        timeropacity:0.6,
                        navthumbnavigationarrowimage:"carouselarrows-32-32-0.png",
                        navshowplaypausestandalone:false,
                        navpreviewbordercolor:"#ffffff",
                        ribbonposition:"topleft",
                        navthumbdescriptioncss:"display:block;position:relative;padding:2px 4px;text-align:left;font:normal 12px Arial,Helvetica,sans-serif;color:#333;",
                        navborder:0,
                        navthumbtitleheight:20,
                        textpositionmargintop:24,
                        navswitchonmouseover:false,
                        playvideoimage:"playvideo-64-64-0.png",
                        arrowimage:"arrows-32-32-0.png",
                        textstyle:"static",
                        playvideoimageheight:64,
                        navfonthighlightcolor:"#666666",
                        showbackgroundimage:false,
                        navpreviewborder:4,
                        navopacity:0.8,
                        shadowcolor:"#aaaaaa",
                        navbuttonshowbgimage:false,
                        navbuttonbgimage:"navbuttonbgimage-28-28-0.png",
                        textbgcss:"display:block; position:absolute; top:0px; left:0px; width:100%; height:100%; background-color:#fff; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; opacity:0.7; filter:alpha(opacity=70);",
                        playvideoimagewidth:64,
                        bottomshadowimagewidth:110,
                        showtimer:false,
                        navradius:0,
                        navshowpreview:false,
                        navmarginy:8,
                        navmarginx:8,
                        navfeaturedarrowimage:"featuredarrow-16-8-0.png",
                        navfeaturedarrowimageheight:8,
                        navstyle:"thumbnails",
                        textpositionmarginleft:24,
                        descriptioncss:"display:block; position:relative; font:14px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#333;",
                        navplaypauseimage:"navplaypause-48-48-0.png",
                        backgroundimagetop:-10,
                        arrowstyle:"mouseover",
                        timercolor:"#ffffff",
                        numberingformat:"%NUM/%TOTAL ",
                        navfontsize:12,
                        navhighlightcolor:"#333333",
                        navimage:"bullet-24-24-5.png",
                        navheight:52,
                        navshowplaypausestandaloneautohide:true,
                        navbuttoncolor:"",
                        navshowarrow:false,
                        navshowfeaturedarrow:false,
                        titlecss:"display:block; position:relative; font: 16px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#000;",
                        ribbonimagey:0,
                        ribbonimagex:0,
                        navshowplaypausestandaloneposition:"bottomright",
                        shadowsize:0,
                        arrowhideonmouseleave:1000,
                        navshowplaypausestandalonewidth:48,
                        navshowplaypausestandaloneheight:48,
                        backgroundimagewidth:120,
                        navcolor:"#999999",
                        navthumbtitlewidth:120,
                        navpreviewposition:"top",
                        arrowheight:32,
                        arrowmargin:8,
                        texteffectduration:1000,
                        bottomshadowimage:"bottomshadow-110-95-4.png",
                        border:6,
                        timerposition:"bottom",
                        navfontcolor:"#333333",
                        navthumbnavigationstyle:"arrow",
                        borderradius:0,
                        navbuttonhighlightcolor:"",
                        textpositionstatic:"bottom",
                        navthumbstyle:"imageonly",
                        textcss:"display:block; padding:8px 16px; text-align:left; ",
                        navbordercolor:"#ffffff",
                        navpreviewarrowimage:"previewarrow-16-8-0.png",
                        showbottomshadow:false,
                        navdirection:"horizontal",
                        textpositionmarginstatic:0,
                        backgroundimage:"",
                        navposition:"bottom",
                        navpreviewarrowwidth:16,
                        bottomshadowimagetop:95,
                        textpositiondynamic:"bottomleft",
                        navshowbuttons:false,
                        navthumbtitlecss:"display:block;position:relative;padding:2px 4px;text-align:left;font:bold 14px Arial,Helvetica,sans-serif;color:#333;",
                        textpositionmarginbottom:24,
                        transition:""
                    });
                    //TODO: replace with stg better !
                    $('[class^=amazingslider-slider-]').hide();
                    $('[class^=amazingslider-nav-]').css('background-color','#f5f5f5');
                    $('.amazingslider-slider-0').show();
                });    
            }, 0);  
        }
    };
return def;
}]);