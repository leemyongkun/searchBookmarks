function createTree(data,flag){
  var id_value;

  if(flag=='default'){
    id_value='';
  }else{
    id_value='Group';
  }

  var id ,flag, url;

  $('#data'+id_value).on('dblclick', '.jstree-anchor', function (e) { 

    if(flag=='file'){
      newTab(url);
    };

  });


  $('#data'+id_value).on('select_node.jstree', function (e, data) {
    var splitData = data.node.data.split(" ");
    id = Number(splitData[0]);
    flag = splitData[1];
    url  = splitData[2]; 
  }).jstree({
    
      'core' : {
        'data' : data,
        "check_callback" : false
     },
  plugins: ["themes","dnd","contextmenu","ui", "crrm",],
    "contextmenu": {
      "items": function ($node) {
        return {
          "Panel": {
            "_class": "class",  
            "icon": "/img/new2.png",
            "label": "new Panel",
            "action": function (obj) {
              var inst = $.jstree.reference(obj.reference),
              item = inst.get_node(obj.reference);
              var data = item.data.split(" ");
              var id = data[0];
              var flag = data[1];
              var url = data[2];

              if(flag == "file"){
                chrome.windows.create({
                  top:0,
                  left:2000,
                  width:800,
                  height:500,
                  type:'detached_panel',
                  url: url,
                  focused: true
                },function(window){
                  panel = window.id
                }) 
              }else{
                  bootbox.alert("Can't open the folder Type.", function() {});
              }
            }
          }
          ,
          "Rename": {
            "separator_before"  : true,
            "_class": "class",  
            "icon": "/img/rename.gif",
            "label": "Update",
            "action": function (obj) {
              var inst = $.jstree.reference(obj.reference),
              item = inst.get_node(obj.reference);
              updateBookmark('rename', item);
            }
          },
          "Delete": {
            "label": "Delete",
            "_class": "class",  
            "icon": "/img/trash.gif",
            "action": function (obj) {
              var inst = $.jstree.reference(obj.reference),
              item = inst.get_node(obj.reference);
              updateBookmark('delete', item);
            }
          } 
        };
      }

    } 

  });
}