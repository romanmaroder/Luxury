window.onload = function () {
    // Открытие мобильного меню
    var navBtn = document.getElementById('navigationBtn'),
        navList = document.getElementById('navigationList'),
        navLinks = document.querySelectorAll('ul.navigation-list >li >a');

    navBtn.addEventListener('click', function (event) {
        // event.preventDefault();
        navBtn.classList.toggle('navigation-btn--active');
        if (navBtn.classList.contains('navigation-btn--active')) {
            navBtn.style.position = "fixed";
        } else {
            navBtn.style.position = "absolute";
        }
        navList.classList.toggle('navigation-list--open');
    });

    // По клику на пункт мобильного меню скрываем меню

    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function (event) {
            // event.preventDefault();
            navList.classList.remove('navigation-list--open');
            navBtn.classList.toggle('navigation-btn--active');
            navBtn.style.position = "absolute";
        });
    }
    // При изменени ширины экрана убираем класс у меню
    window.addEventListener("resize", function () {
        var width = document.documentElement.clientWidth;
        if (width > 768) {
            navList.classList.remove('navigation-list--open');
            navBtn.classList.remove('navigation-btn--active');
        }
    });

    // Owl-carousel
    $(document).ready(function () {
        $(".owl-carousel-top").owlCarousel({
            items: 1,
            loop: true,
            // dotsEach: true,
            // autoplay: true,
            // autoplayHoverPause: true,
            // autoplayTimeout: 2000,
            // smartSpeed: 850,
            slideTransition:'linear',
            lazyLoad: true

        });
    });     
   
    $(document).ready(function () {
        $(".owl-carousel-today").owlCarousel({
            items: 1,
            loop: true,
            dots:true,
            margin:100,
            // dotsEach: true,
            // autoplay: true,
            // autoplayHoverPause: true,
            // autoplayTimeout: 2000,
            // smartSpeed: 850,
            slideTransition:'linear',
            lazyLoad: true

        });
    }); 
    
    $(document).ready(function () {
        $(".owl-carousel-feedback").owlCarousel({
            items: 1,
            loop: true,
            dots:false,
            nav:true,
            navText:["",""],
            margin:100,
            // dotsEach: true,
            // autoplay: true,
            // autoplayHoverPause: true,
            // autoplayTimeout: 2000,
            // smartSpeed: 850,
            slideTransition:'linear',
            lazyLoad: true

        });
    }); 
};