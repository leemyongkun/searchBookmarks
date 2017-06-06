//var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
//var dayNames= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

var monthNames = [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ];
var dayNames= ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"]
var newDate = new Date();

newDate.setDate(newDate.getDate());

//EN
//$('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());

//KR
$('#Date').html( newDate.getFullYear()+"년 " + monthNames[newDate.getMonth()]+" "+newDate.getDate() + '일 '+" " +dayNames[newDate.getDay()] );

setInterval( function() {
	var seconds = new Date().getSeconds();

	$("#sec").html(( seconds < 10 ? "0" : "" ) + seconds);
	},1000);

setInterval( function() {

	var minutes = new Date().getMinutes();
	$("#min").html(( minutes < 10 ? "0" : "" ) + minutes);
    },1000);

setInterval( function() {

	var hours = new Date().getHours();

	$("#hours").html(( hours < 10 ? "0" : "" ) + hours);
    }, 1000);
