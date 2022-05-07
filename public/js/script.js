"use strict"
/*------------for navbar--------------------*/
$(function() {
    $(".navbar li a").click(function() {
       $(".navbar li a").removeClass("active");
       $(this).addClass("active");
    });
});

/*------------signup/login form--------------------*/
$(function() {
   $("#go-to-login").click(function(e) {
      $(".back").css("display", "block");
      $(".front").css("display", "none");
      e.preventDefault();
   });
   
   $("#go-to-signup").click(function(e) {
      $(".front").css("display", "block");
      $(".back").css("display", "none");
      e.preventDefault();
   });
});

/*------------go top button--------------------*/
$(window).scroll(function(){
   if ($(this).scrollTop() > 100) {
       $('.back-to-top').show().fadeIn();
   } else {
       $('.back-to-top').fadeOut().hide();
   }
});
