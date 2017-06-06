var Byuli= {
 default_path: null,
 setPath: function(url){
  this.default_path= url;
 },
 include: function()
 {
  var jsList= this.include.arguments;
  for ( var i=0; i<jsList.length; i++ )
  {
   var tag= "<script languge=\"javascript\"";
   tag+= "src=\"" + this.default_path + jsList[i] + ".js\"></script>";
   document.write(tag);
  }
 }
}


$(document).ready(function(){
    //var url ="http://tools.search.yahoo.com/kr-eol.html";
    //var url ="http://blog.ionic.io/popover-support-landed/";

    /* getUrlTest(url ,function(data){
        console.log("callback",data);
     })*/
    
    Byuli.setPath("/custom_js/");
    Byuli.include(
    "clock",
	   "crawl",
     "date",
     "map",
     "db",
    "setting", 
     "app",
     "settree"
    );

   
})