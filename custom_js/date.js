function getDate(in_date){
	var date = new Date(in_date);
 
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString();
	var dd  = date.getDate().toString();
	var hh = date.getHours().toString();
	var MM = date.getMinutes().toString();
	var ss = date.getSeconds().toString();


	var mmChars = mm.split('');
	var ddChars = dd.split('');
	var hhChars = hh.split('');
	var MMChars = MM.split('');
	var ssChars = ss.split('');

	var datestring = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]) + ' ' + (hhChars[1]?hh:"0"+hhChars[0]) + ':' + (MMChars[1]?MM:"0"+MMChars[0]) + ':' + (ssChars[1]?ss:"0"+ssChars[0]);
	return datestring;
}