var message =["<div class='progress'>",
"<div class='progress-bar progress-bar-info' role='progressbar' style='width:0%'></div></div>",
"<div class='progress'><div class='progress-bar progress-bar-success' id='progress-complete' style='width: 0%'></div>",
"<div class='progress-bar progress-bar-danger' id='progress-danger' style='width: 0%'></div></div>",
"<span class='label label-info'>Sync</span>    <span id='sync_result'> Waiting...</span><br>",
"<span class='label label-success'>Crawling Success </span>    <span id='crawl_success'> Waiting...</span> <br>",
"<span class='label label-danger'>Crawling Fail</span>    <span id='crawl_fail'>Waiting...</span><br><br>",
"<span><font color='red'><b>The crawl items may differ depending on the network status.</b></font></span>"
].join('');



function menuToggle(menu){
  
  if(menu == "menuBookmark"){

    $('#pictureBackground').hide();
    $('#bookmarkBackground').show();
    $('#fileButton').hide();
    //$('body').css('padding-top',70);

    $("#detailBookmark").show();
    $("#init").show();

    $('#googleCheckLabel').hide();
    $('#clockCheckLabel').hide();
  }

  if(menu == "menuPicture"){
      $('#bookmarkBackground').hide();
    $('#pictureBackground').show();
    $('#fileButton').show();
    $('body').css('padding-top',0);

    $("#detailBookmark").hide();
    $("#init").hide();

    $('#googleCheckLabel').show();
    $('#clockCheckLabel').show();
  }
}



function setBackgroundImage(imagePath){
      $('#pictureBackground').css("background-image","url("+imagePath+")"); 
	  
}


function buttonEventInit(callback_setEnvironment){


  $('#bookmarkSearch').on('click',function(){
    $('#data').click();
     executeBookmarkSearch();
     $('#searchQuery').focus();
  });

  $('#searchQuery').on('keydown',function(event){
    if(event.keyCode == 13){
        executeBookmarkSearch();
    }
 });



 $('#init').on('click',function(){

    bootbox.dialog({
      message: message,
      title: "Synchronization for Bookmarks",
      closeButton: false,
      buttons: {
        done: {
          label: "Done",
          className: "btn-info",
          callback: function() {
              setEnvironment(getItems);
              location.reload(); 
          }
        },
        success: {
          label: "Yes",
          className: "btn-success",
           
          callback: function() {
              if(initStatus){
                bootbox.alert("The sync is in progress.", function() {});
                return false;
              }else{
                initProcess(); 
                $('.btn-success').hide();
                $('.btn-danger').hide();
              }
              

              return false;
          }
        },
        danger: {
          label: "No",
          className: "btn-danger",
          callback: function() {
              if(initStatus){
                bootbox.alert("During synchronization , you can not stop progress.", function() {});
                return false;  
              }else{

              }
              
          }
        }
      }
    });
    $('.btn-info').hide();
   
 });


 $('#bookmark_back').on('click',function(){
    
    menuToggle("menuBookmark");
    updateBackgroundFlag('bookmark');
 });

 $('#picture_back').on('click',function(){
  
     menuToggle("menuPicture");
     updateBackgroundFlag('picture');
 });


 $('#files').on('change',function(event){
    
    var preview = $('#img');
    var file    = this.files[0];
    var reader  = new FileReader();
    
    reader.onloadend = function () {
      updateImageFile(reader.result);
      setBackgroundImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
      
 });

 $('#fileButton').on('click',function(){
    $('#files').click();
 })
  
 $('#search').on('click',function(){
    var query = $('#query').val();
    executeSearch(query,true);
 });


 $('#query').on('keydown',function(event){
    if(event.keyCode == 13){
        var query = $('#query').val();
        executeSearch(query,true);
    }
 });

 $('#googleCheck').on('click',function(){

    var flag = $(this).is(":checked");
    if(flag==true){
      $("#googleSearchArea").show();
      googleSearchCheckUpdate('y');
    }else{
      $("#googleSearchArea").hide();
      googleSearchCheckUpdate('n');
    }
 });

 $('#clockCheck').on('click',function(){
  var flag = $(this).is(":checked");
    if(flag==true){
      $("#clockArea").show();
      clockCheckUpdate('y');
    }else{
      $("#clockArea").hide();
      clockCheckUpdate('n');
    }
 });


 callback_setEnvironment(getItems);
}
