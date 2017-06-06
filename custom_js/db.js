var createStatement = "CREATE TABLE IF NOT EXISTS bookmark (id TEXT PRIMARY KEY, parentId TEXT, title TEXT, url TEXT, idx INTEGER, flag TEXT , date TEXT, level INTEGER, domain TEXT, text TEXT, crawlYN TEXT, childrenSize INTEGER)";
var createEnvStatement = "CREATE TABLE IF NOT EXISTS environment (initFlag TEXT, updatedDate TEXT, imageFilePath TEXT, selectBackground TEXT, clockChecked INTEGER , googleSearchChecked INTEGER)";
var dropStatement = "DROP TABLE bookmark";
var dropEnvStatement = "DROP TABLE environment";
var selectEnvStatement = "SELECT * FROM environment";
var selectAllStatement = "SELECT  id,  parent,   CASE WHEN(flag=='folder') THEN text||' [<font color=red><b>'||childrenSize||'</b></font>]' ELSE text END AS text,   icon,   data,   flag  FROM ( SELECT id,  CASE WHEN(parentId=='0') THEN '#' ELSE parentId END as parent,   CASE WHEN(crawlYN is null  AND flag=='file')  THEN '<font color=red><del>' ||title||'</del> <font color=blue>[disconnect]</font> </font>' ELSE title END as text,   CASE WHEN(flag == 'file') THEN 'chrome://favicon/'||url ELSE '' END as icon,    id || ' ' || flag||' '||url||' '|| CASE WHEN (crawlYN is null) THEN 'n' ELSE 'y' END as data,    childrenSize ,   flag FROM bookmark) A ";
var selectAllforFileStatement = "SELECT id, url as data FROM bookmark WHERE flag == 'file'";
var updateTextStatement = "UPDATE bookmark SET text = ? , crawlYN = ? WHERE id = ?";
var selectHostGroup = "SELECT  domain as id ,   '#' AS parent ,   domain || ' [<font color=red><b>'||COUNT(domain) ||'</b></font>]' AS text,   'chrome://favicon/'||url AS icon,   id || ' ' || 'folder ' || url||' '|| CASE WHEN (crawlYN is null) THEN 'n' ELSE 'y' END as data FROM bookmark WHERE domain != '' GROUP BY domain UNION ALL SELECT   id,    domain AS parent,    CASE WHEN(crawlYN is null  AND flag=='file')  THEN '<font color=red><del>' ||title||'</del> <font color=blue>[disconnect]</font> </font>' ELSE title END as text,    CASE WHEN(flag == 'file') THEN 'chrome://favicon/'||url ELSE '' END as icon,   id ||' '|| flag || ' ' || url||' '|| CASE WHEN (crawlYN is null) THEN 'n' ELSE 'y' END as data FROM bookmark WHERE flag ='file' AND domain != ''";
var insertStatement = "INSERT INTO bookmark(id,parentId,title,url,idx,flag,date,level,domain,childrenSize) VALUES (?,?,?,?,?,?,?,?,?,?)";
var insertInitStatement = "INSERT INTO environment(initFlag, updatedDate, selectBackground) values (?,?,?)";
var db = openDatabase("BMM", "1.0", "Bookmark Manager", 200000);   
var updateImageFilePath = "UPDATE environment SET imageFilePath = ?";
var dataset;
var backup = [];

var moveElementStatement = "UPDATE bookmark SET parentId = ? WHERE id = ?";

function dbConnect(){
  if(!!window.openDatabase) {
       dbInit(dropTable);
  }else{
      bootbox.alert("Your browser does not support the current expansion program.", function() {
      });
  }
}

function dbInit(callback_drop){
  callback_drop(createTable);
 
}
function dropTable(callback_createTable){
    
    db.transaction(function (tx){
      tx.executeSql(dropStatement,[]);
    });

    db.transaction(function (tx){
      tx.executeSql(dropEnvStatement,[]);
    });
    
    callback_createTable(initData);
}

function initData(){
    
    var initFlag = "N", updatedDate ="", selectBackground="bookmark";

    db.transaction(function(tx){
      tx.executeSql(insertInitStatement,[initFlag , updatedDate,selectBackground]);
    });
  
}



function createTable(callback_init){
    
    db.transaction(function(tx){
      tx.executeSql(createStatement,[]);
    });

    db.transaction(function(tx){
      tx.executeSql(createEnvStatement,[]);
    });
    callback_init();
}


function updateImageFile(imageFilePath){
    db.transaction(function(tx){
      tx.executeSql(updateImageFilePath,[imageFilePath]);
    });
}



function updateText(id, crawlYN, text, callback){
   

    var obj = [];
    obj[0] = text;
    obj[1] = crawlYN;
    obj[2] = id;
    
    callback(obj);
}

function insertData(data,callback){
    
    if(data == null){
      return false;
    }
   
    var id,parentId,title,url,idx,flag,date,level,domain,siteText,childrenSize=0;
    var a;
    id = data.id;
    parentId = data.parentId;
    title = data.title;
    url = data.url;
    idx = data.index;



    a = document.createElement('a');
    a.href = url;
    domain = a.host;

    if(data.children){
      flag = "folder";
      childrenSize = data.children.length;
    }else{
      flag="file";
    }
    

    date = getDate(data.dateAdded);
    level = map.get(id);


    var object=[];
    
    object[0]=id;
    object[1]=parentId;
    object[2]=title;
    object[3]=url;
    object[4]=idx;
    object[5]=flag;
    object[6]=date;
    object[7]=level;
    object[8]=domain;
    object[9]=childrenSize;
 

    callback(object);
}



function selectRow(query, callBack){ 
   var data = [];

   db.transaction(function (tx) {
      tx.executeSql(query, [], function(tx, rs){
         for(var i=0; i<rs.rows.length; i++) {
            var row = rs.rows.item(i);
            data[i] = row;
         }
         callBack(data); 
      }, onError);
   });

} 



 
function onError(tx, error) 
{   
  if(error.code == 5){
    dbConnect();
    buttonEventInit(setEnvironment);
  }

}



var bookmarkSearchStatement = "SELECT id, parentId, CASE WHEN(crawlYN is null  AND flag=='file')  THEN '<font color=red><del>' ||title||'</del> <font color=blue>[disconnect]</font> </font>' ELSE title END as title, url, idx, flag, date, domain, text, childrenSize FROM bookmark ";
function bookmarkSearch(query, parameter, callBack){
    var condition ="WHERE ";
    var conTitle = "( ";
    var conText = "( ";
      
    var param = parameter.split(" ");
    var paramSize = param.length;

    var bufferTitle = [];
    var bufferText = [];

    for(var i=0; i< paramSize ; i++){
      conTitle +=  "title LIKE '%"+param[i]+"%' ";
      conText += "text LIKE '%"+param[i]+"%' ";

      if(i < (paramSize-1)){
        conTitle += " AND ";
        conText += " AND ";
      }

    }

    condition += conTitle+") OR "+conText+") ORDER BY flag desc ";
    query += condition;
    
    

    var data = [];
    db.transaction(function (tx) {
      tx.executeSql(query, [], function(tx, rs){

         for(var i=0; i<rs.rows.length; i++) {
            
            var row = rs.rows.item(i);
            data[i] = row;
         }
         callBack(data); 
      }, null);
   });

} 
var updateBackgroundFlagStatement =  "UPDATE environment SET selectBackground = ?";
function updateBackgroundFlag(backgroundFlag){
  
  db.transaction(function(tx){
      tx.executeSql(updateBackgroundFlagStatement,[backgroundFlag]);

    });
}


function moveElement(parentId,id){
   db.transaction(function(tx){
      tx.executeSql(moveElementStatement,[parentId,id]);
    });
}


var deleteItemStatement="DELETE FROM bookmark WHERE id=? OR parentId=?";
function deleteItem(currentId){

    db.transaction(function(tx){
      tx.executeSql(deleteItemStatement,[currentId,currentId]);
    });

}

var updateItemStatement="UPDATE bookmark SET title=? , url=? WHERE id=?";
function updateItem(title, url, id){

    db.transaction(function(tx){
      tx.executeSql(updateItemStatement,[title,url,id]);
    });
}

function createItem(currentId){

}
 
var updateInitFlagStatement = "UPDATE environment SET initFlag =?";
function updateInitFlag(){
    var flag = "Y";
    db.transaction(function(tx){
      tx.executeSql(updateInitFlagStatement,[flag]);
    });
}

var clockCheckUpdateStatement = "UPDATE environment SET clockChecked = ?";
function clockCheckUpdate(flag){
    db.transaction(function(tx){
      tx.executeSql(clockCheckUpdateStatement,[flag]);
    });
}

var googleSearchCheckUpdateStatement = "UPDATE environment SET googleSearchChecked = ?";
function googleSearchCheckUpdate(flag){
    db.transaction(function(tx){
      tx.executeSql(googleSearchCheckUpdateStatement,[flag]);
    });
}


