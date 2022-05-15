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

/*-------------sidebar-------------------------*/
$(document).ready(function(){
   $("#sidebarToggle").click(function(){
     $(".innerwrapper").toggleClass("sb-sidenav-toggled");
   });
 });

 
/*------------------createtable-------------------*/
$(document).ready(function(){
   $("#colNumber").on("input", function(){
      let number = $("#colNumber").val();
      let allCol="";
      for (let i=0; i<number; i++)
      {
         let html = `<tr>
         <th scope="row">${i+1}</th>
         <td>
           <input type="text" id="colName"  name="colName${i+1}"  class="form-control" aria-describedby="passwordHelpInline" required>
         </td>
         <td>
           <select class="form-select" aria-label="Default select example"  name="dataType${i+1}" required>
             <option value="">Select Datatype</option>
             <option value="string">String</option>
            <option value="boolean">Boolean</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="datetime">Datetime</option>
           </select>
         </td>
         <td>
           <input class="form-check-input" type="radio" name="primaryKey" id="primaryKey" value="${i+1}" required> 
         </td>
       </tr>
       `
       allCol+=html;
      }
      $("#createTable tbody").empty();
      $('#createTable tbody').append(allCol);
    });
 });
 

 /*------------------edittable-------------------*/
 
 $("#insert-btn").click(function(){
    $("#edit-form").attr('action', '/insertdata');
 })

 $("#delete-btn").click(function(){
   $("#edit-form").attr('action', '/deletedata');
})

/*---------------insert data------------------*/
$('#for-date-col').dateptimepicker({
   format: 'YYYY/MM/DD HH:mm:ss'
})