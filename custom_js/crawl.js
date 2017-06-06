var initStatus;
var crawlTotalCount = 0;
var crawlCompleteCount = 0;
var crawlFailCount = 0;

function getUrl(url,callback){
    
 $.ajax({
      type: "GET",
      url: url,
      timeout: 60000,
      success:function(data) {
        callback(data);

        crawlCompleteCount++;
        setTimeout(function(){
            var percent =(100* (Number(crawlCompleteCount/crawlTotalCount))).toFixed(0) ;
            $('.progress-bar-success').html("Crawling ["+crawlCompleteCount+" / "+crawlTotalCount+"]").css('width',percent+'%');
        },500);

        crawlStatus();
      },
      error:function(error){
        crawlFailCount++;
    
         setTimeout(function(){
            var percent =(100* (Number(crawlFailCount/crawlTotalCount))).toFixed(0) ;
            $('.progress-bar-danger').html("Crawling  ["+crawlFailCount+" / "+crawlTotalCount+"]").css('width',percent+'%');
         },500);

         crawlStatus();
      }

    });
  

}

var crawlStatus = function(){
    var sum = crawlCompleteCount+crawlFailCount;
    

    if(crawlTotalCount == sum){
      $('#crawl_success').html(" "+crawlCompleteCount);
      $('#crawl_fail').html(" "+crawlFailCount);
      initStatus = false;
      $('.btn-info').show();
    };
}

function parsing(data){

          data = asciible(data);
          var startBody = data.indexOf("<body");
          var endBody = data.indexOf("</body");
          data = data.substring(startBody, endBody);
          //data = parsing(data);
          
          startScript = data.indexOf("<script");
          endScript = data.indexOf("</script")+9;
          var scriptStr;
          while(startScript != -1){
              
              scriptStr = data.substring(startScript,endScript);
              data = data.replace(scriptStr,"");

              startScript = data.indexOf("<script");
              endScript = data.indexOf("</script")+9;
           // 
              if(startScript == endScript) break;
              if(endScript == -1) break;
              console.log("startScript:endScript",startScript,endScript);
          }

          
          var RegExpTag = "<[^<|>]*>";  
          data = data.replace("<br>","");
          data = data.replace(RegExpTag,""); 
          data = data.replace(/(<([^>]+)>)/ig,"");


          RegExpJS = "/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi";
          data = data.replace(RegExpJS,""); 

          RegExpCSS = "/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi";
          RegExpCSS = "s!<(s(?:cript|tyle))[^>]*>.*?</\1>!!gis";
          data = data.replace(RegExpCSS,""); 
          
 

          RegExpDS = /<!--[^>](.*?)-->/g;   
          data = data.replace(RegExpDS,""); 
          
          data = data.replace("&laquo;","");
          data = data.replace("&raquo;","");
          data = data.replace("&nbsp;","");
          data = data.replace("/[\r|\n|\t]/g", ""); 

          return data;
}


function asciible(markup) {
  //var markup = $('#textToConvert').val();
  var reg = /<|>|&|"/g;
  var startTime = new Date().getTime();
  
  /* ASCII Entities */
  
  /* Do & first to preserve other entities */
  if($('#preserveAscii').attr("checked") == true) { 
    markup = markup.replace(/&(?!(#\d{1,3};|(\w{1,5};)))/g,'&#38;');
  } else {
    markup = markup.replace(/&/g,'&#38;');
  }
  
  // convert new lines to <br />
  function insertBr(str, p1, p2, offset, s) {
    return '<br />' + str;
  }
  if($('#addBr').attr("checked") == true) {
    markup = markup.replace(/(\n\r)|(\r\n)|\n|\r/g,insertBr);
  }
  
  // strip new lines
  /*if($('#stripNewLine').attr("checked") == true) {
    if($('#replaceWithSpace').attr("checked") == true) {
      markup = markup.replace(/(\n\r)|(\r\n)|\n|\r/g,' ');
    } else {
      markup = markup.replace(/(\n\r)|(\r\n)|\n|\r/g,'');
    }
  }*/
  //꼭필요함
    markup = markup.replace(/(\n\r)|(\r\n)|\n|\r/g,'');
  
  /* handle multi spaces */
  function getNonBreakingSpaces(str, p1, p2, offset, s) {
    var spaces = '';
    /*for(i = 0; i < str.length; i++) {
      spaces += '&nbsp;';
    }*/
    return spaces;
  }
  //var spaceOption = $("input[@name='spaceOpts']:checked").val();
  var spaceOption = '1';
  if(spaceOption === '1') { //if convert to non-breaking 
    markup = markup.replace(/( ){2,}/g,getNonBreakingSpaces);
  } else if(spaceOption === '2') { //if trim to single space
    markup = markup.replace(/( ){2,}/g,' ');
  }
  
  /* handle tabs */
 // var tabOption = $("input[@name='tabOpts']:checked").val();
  var tabOption = '1';
  if(tabOption === '1') { //if convert to non-breaking spaces
    var spaces = '';
    for(i = 0; i < $('#tabSpaces').val(); i++) {
      spaces += '&nbsp;';
    }
    markup = markup.replace(/\t/g,spaces);
  } else if(tabOption === '2') { //if ascii encode
    markup = markup.replace(/\t/g,'&#09;');
  }



  return markup;
  
 /* var endTime = new Date().getTime();
  $('#safeText').val(markup);
  $('#divTagPreview').html(markup);
  $('#preTagPreview').html(markup);
  $('#totalTime').text((endTime - startTime) + ' milliseconds');*/
}