$(document).ready(function(){
    
    $('html').click(function(e) {
        var target = $(e.target);
        // console.log('target is ', target[0].id);
        if(!$('.side-menu').hasClass('nav-open') && target[0].title == "menu") {
            $('.side-menu').addClass('nav-open');
        }
        else {
            $('.side-menu').removeClass('nav-open');
        }

        if(target[0].id =='manage') {
        	$('#manage').addClass('active');
        } else {
        	$('#addInventory').removeClass('active');
        }

        if(target[0].id == 'addInventory') {
        	$('#addInventory').removeClass('active');
        } else {
        	$('#manage').addClass('active');
        }
        
    });

    $(window).resize(function () {
        console.log($(window).width());
        var winWidth = $(window).width() - 250;
        $('.grid').css('width', winWidth);
    });

    
});

