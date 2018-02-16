var editor;
var routeEditor;
var configEditor;
var socketIoEditor;
var isConfigFile = false;
var isViewFile = false;

function configInfo() {
    console.log('ok');
    configInitCodeEditor();
}

function databaseInfo() {

    // initialize data table
    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var listPath = '/manager/database';
    var addPath = '/manager/database';
    var modifyPath = '/manager/database';
    var deletePath = '/manager/database';

    var columnNames = ['id', 'database_index', 'name', 'file'];
    var columnAliases = ['#', '데이터베이스', '이름', '파일'];

    var columnDefs = [{
        "targets": [0, 3],
        "orderable": false
                }];

    console.log('columnDefs');


    var aoColumns = [{
            "sWidth": "10%"
                    },
        {
            "sWidth": "10%"
                    },
        {
            "sWidth": "10%"
                    },
        {
            "sWidth": "20%"
                    },
        {
            "sWidth": "30%"
                    }
                ];

    var showModifyButton = true;
    var showDeleteButton = true;

    var itemIcon = 'database.png';


    if (DBTable == 0) {
        console.log('test');
        tableinitTable('#table1', columnNames, columnAliases, columnDefs, aoColumns, showModifyButton, showDeleteButton, ajaxBaseUrl, ajaxType, listPath, addPath, modifyPath, deletePath, itemIcon);
    } else {
        console.log('test1');
        DBDataTable.dataTable().fnClearTable();
        $('#pageButtons').empty();
        DBDataTable.dataTable().fnDestroy();
        tableinitTable('#table1', columnNames, columnAliases, columnDefs, aoColumns, showModifyButton, showDeleteButton, ajaxBaseUrl, ajaxType, listPath, addPath, modifyPath, deletePath, itemIcon);
    }

    datainitCodeEditor();

    console.log(DBTable);
    DBTable = 1;
    console.log(DBTable);

    // show main page
    DBshowPage('DBmainPage');

    showParams('mysqlParams');
}

function routingInfo() {

    console.log('routeForm');

    // initialize data table
    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var listPath = '/manager/route';
    var addPath = '/manager/route';
    var modifyPath = '/manager/route';
    var deletePath = '/manager/route';

    var columnNames = ['id', 'file', 'path', 'method', 'type', 'upload'];
    var columnAliases = ['#', '파일', '패스', '메소드', '유형', '업로드'];

    var columnDefs = [{
        "targets": [0, 4, 5],
        "orderable": false
                }];

    var aoColumns = [{
            "sWidth": "10%"
                    },
        {
            "sWidth": "10%"
                    },
        {
            "sWidth": "20%"
                    },
        {
            "sWidth": "10%"
                    },
        {
            "sWidth": "10%"
                    },
        {
            "sWidth": "10%"
                    },
        {
            "sWidth": "30%"
                    }
                ];

    var showModifyButton = true;
    var showDeleteButton = true;

    var itemIcon = 'module.png';



    if (RoutingTable == 0) {
        console.log('test');
        tableinitTable('#table2', columnNames, columnAliases, columnDefs, aoColumns, showModifyButton, showDeleteButton, ajaxBaseUrl, ajaxType, listPath, addPath, modifyPath, deletePath, itemIcon);
    } else {
        console.log('test1');
        RouteDataTable.dataTable().fnClearTable();
        $('#pageButtons1').empty();
        RouteDataTable.dataTable().fnDestroy();
        tableinitTable('#table2', columnNames, columnAliases, columnDefs, aoColumns, showModifyButton, showDeleteButton, ajaxBaseUrl, ajaxType, listPath, addPath, modifyPath, deletePath, itemIcon);
    }


    routeInitCodeEditor();
    RoutingTable = 1;
    // show main page
    routeshowPage('routemainPage');
}

function socketIoInfo() {
    console.log('socketIoForm 들어옴');

    // initialize data table
    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var listPath = '/manager/socketio';
    var addPath = '/manager/socketio';
    var modifyPath = '/manager/socketio';
    var deletePath = '/manager/socketio';

    var columnNames = ['id', 'file', 'method', 'event'];
    var columnAliases = ['#', '파일', '메소드', '이벤트'];

    var columnDefs = [{
        "targets": [0, 3],
        "orderable": false
                }];

    var aoColumns = [{
            "sWidth": "10%"
                    },
        {
            "sWidth": "10%"
                    },
        {
            "sWidth": "20%"
                    },
        {
            "sWidth": "10%"
                    },
        {
            "sWidth": "30%"
                    }
                ];

    var showModifyButton = true;
    var showDeleteButton = true;

    var itemIcon = 'event_handler.png';

    if (SocketTable == 0) {
        console.log('test');
        tableinitTable('#table3', columnNames, columnAliases, columnDefs, aoColumns, showModifyButton, showDeleteButton, ajaxBaseUrl, ajaxType, listPath, addPath, modifyPath, deletePath, itemIcon);
    } else {
        console.log('test3');
        SocketDataTable.dataTable().fnClearTable();
        $('#pageButtons2').empty();
        SocketDataTable.dataTable().fnDestroy();
        tableinitTable('#table1', columnNames, columnAliases, columnDefs, aoColumns, showModifyButton, showDeleteButton, ajaxBaseUrl, ajaxType, listPath, addPath, modifyPath, deletePath, itemIcon);
    }


    socketIoinitCodeEditor();

    SocketTable = 1;
    // show main page
    socketIoshowPage('socketIomainPage');
}

function viewInfo() {
    initCodeEditor();
}



//config 관련
function doAddSource() {
    console.log('doAddSource 호출됨');

    showPage('sourcePage');

    $('#file-input').val('');
    configEditor.setValue('');
}


function configInitCodeEditor() {
    
    
    console.log(" configEditor " + codeTextArea);
    if(configEditor != undefined){
        console.log('no undefined');
    }else{
    var codeTextArea = document.getElementById('configCodeString');

    configEditor = CodeMirror.fromTextArea(codeTextArea, {
        mode: "javascript",
        lineNumbers: true,
        selectionPointer: true,
        styleActiveLine: true
    });
    }

}


function doSaveFile() {
    if (isConfigFile) {
        doSaveConfigFile();
    } else if (isViewFile) {
        doSaveViewFile();
    }
}


function doGetConfigFile(filename) {
    console.log('doGetConfigFile 호출됨 : ' + filename);

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var ajaxGetFilePath = '/manager/configfile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('configfile에 대한 응답을 받았음.');

            var dataObj = JSON.parse(data);
            //console.log(dataObj.result);

            //var decodedResult = window.atob(dataObj.result);
            var decodedResult = Base64.decode(dataObj.result);

            showConfigFile(filename, decodedResult);

        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}

function showConfigFile(filename, result) {
    $('#file-input').val(filename);
    configEditor.setOption("mode", "javascript");
    configEditor.setValue(result);

    isConfigFile = true;
    isViewFile = false;
}

function doSaveConfigFile() {
    console.log('doSaveConfigFile 호출됨.');

    var filename = $('#file-input').val();
    var contents = editor.getValue();

    if (filename.length < 1 || contents.length < 1) {
        var title = '입력 확인';
        var contents = '파일명과 내용을 먼저 입력하세요.';

        showConfirmDialog('text', title, contents, null, null, '닫기', function () {
            $.closeConfirmDialog();

        });

        return;
    }

    var requestCode = generateRequestCode();

    var compressed = encodeURIComponent(contents);

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;
    params += '&contents=' + compressed;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'post';

    var ajaxGetFilePath = '/manager/configfile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('configfile 저장에 대한 응답을 받았음.');

            console.log(data);

            var title = '저장 확인';
            var contents = '설정 파일이 저장되었습니다.';

            showConfirmDialog('text', title, contents, null, null, '닫기', function () {
                $.closeConfirmDialog();
            });

        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}



//database 관련
function DBdoList() {
    var curPage = 1;
    var curPerPage = 10;

    DBrequestList(curPage, curPerPage);
}

function DBdoAdd() {
    console.log('doAdd 호출됨');

    doAddRow(1, 10);
}

function DBdoAddSource() {
    console.log('doAddSource 호출됨');

    DBshowPage('DBsourcePage');

    $('#file-input1').val('');
    editor.setValue('');
}


function DBshowPage(pageName) {
    $('.DBmainPage').hide();
    $('.DBsourcePage').hide();
    $('.testPage').hide();

    $('.' + pageName).show();
}

function showParams(paramName) {
    $('#mysqlParams').hide();
    $('#oracleParams').hide();

    $('#' + paramName).show();
}

function datainitCodeEditor() {
    var codeTextArea = document.getElementById('dataCodeString');

    editor = CodeMirror.fromTextArea(codeTextArea, {
        mode: "javascript",
        lineNumbers: true,
        selectionPointer: true,
        styleActiveLine: true
    });

}

function doGetFile(filename) {
    console.log('doGetFile 호출됨 : ' + filename);

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var ajaxGetFilePath = '/manager/dbfile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('dbfile에 대한 응답을 받았음.');

            var dataObj = JSON.parse(data);
            //console.log(dataObj.result);

            //var decodedResult = window.atob(dataObj.result);
            var decodedResult = Base64.decode(dataObj.result);

            showDatabaseFile(filename, decodedResult);
        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}

function showDatabaseFile(filename, result) {
    // show source page
    DBshowPage('DBsourcePage');

    $('#file-input1').val(filename);
    editor.setValue(result);
}

function doSaveDatabaseFile() {
    console.log('doSaveDatabaseFile 호출됨.');

    var filename = $('#file-input1').val();
    var contents = editor.getValue();

    if (filename.length < 1 || contents.length < 1) {
        var title = '입력 확인';
        var contents = '파일명과 내용을 먼저 입력하세요.';

        showConfirmDialog('text', title, contents, null, null, '닫기', function () {
            $.closeConfirmDialog();

        });

        return;
    }

    var requestCode = generateRequestCode();

    //console.log(contents);

    // base64 encode
    //var encodedContents = Base64.encode(contents);
    //var encodedContents = window.btoa(contents);

    // gzip compress
    //var gzip = new Zlib.Gzip(contents);
    //var compressed = gzip.compress();

    var compressed = encodeURIComponent(contents);

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;
    params += '&contents=' + compressed;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'post';

    var ajaxGetFilePath = '/manager/dbfile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('dbfile 저장에 대한 응답을 받았음.');

            console.log(data);

            DBshowPage('DBmainPage');

            showModifyResultDialog(1, 10);
        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}

function databaseTypeChanged() {
    var databaseType = $('#databaseTypeSelect').val();

    showParams(databaseType + 'Params');
}

function doDatabaseTest() {
    var databaseType = $('#databaseTypeSelect').val();

    var requestCode = generateRequestCode();
    var params = 'requestCode=' + requestCode;

    if (databaseType == 'mysql') {
        var host = $('#hostInput').val();
        var user = $('#userInput').val();
        var password = $('#passwordInput').val();
        var database = $('#databaseInput').val();


        if (host.length < 1 || user.length < 1 || password.length < 1) {
            var title = '입력 확인';
            var contents = '파라미터를 먼저 입력하세요.';

            showConfirmDialog('text', title, contents, null, null, '닫기', function () {
                $.closeConfirmDialog();

            });

            return;
        }

        params += '&databaseType=' + databaseType;
        params += '&host=' + host;
        params += '&user=' + user;
        params += '&password=' + password;
        params += '&database=' + database;
        
        
    } else if (databaseType == 'oracle') {
        var user = $('#oracleUserInput').val();
        var password = $('#oraclePasswordInput').val();
        var connectString = $('#connectStringInput').val();


        if (user.length < 1 || password.length < 1 || connectString.length < 1) {
            var title = '입력 확인';
            var contents = '파라미터를 먼저 입력하세요.';

            showConfirmDialog('text', title, contents, null, null, '닫기', function () {
                $.closeConfirmDialog();

            });

            return;
        }

        params += '&databaseType=' + databaseType;
        params += '&user=' + user;
        params += '&password=' + password;
        params += '&connectString=' + connectString;
    }

    var ajaxBaseUrl = 'http://localhost:3000';
    var ajaxType = 'post';
    var ajaxPath = '/manager/dbtest';


    $.ajax({
        url: ajaxBaseUrl + ajaxPath,
        type: ajaxType,
        data: params,
        success: function (data) {
            console.log('dbtest에 대한 응답을 받았음.');

            console.log(data);

            var dataObj = JSON.parse(data);

            var title = '데이터베이스 테스트 결과';
            var contents = 'code : ' + dataObj.code + ', message : ' + dataObj.message + '<br>' + dataObj.result;

            showConfirmDialog('text', title, contents, null, null, '닫기', function () {
                $.closeConfirmDialog();

            });

        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            var dataObj = JSON.parse(err.responseText);

            var title = '데이터베이스 테스트 결과';
            var contents = 'code : ' + dataObj.code + ', message : ' + dataObj.message + '<br>' + JSON.stringify(dataObj.result);

            showConfirmDialog('text', title, contents, null, null, '닫기', function () {
                $.closeConfirmDialog();

            });

        }
    });

}


//routing 관련
function routedoList() {
    console.log('routedoList');
    var curPage = 1;
    var curPerPage = 10;


    routerequestList(curPage, curPerPage);
}

/*function routedoAdd() {
    console.log('doAdd 호출됨');
    
    doAddRow(1, 10);
}*/

function routedoAddSource() {
    console.log('routedoAddSource 호출됨');

    routeshowPage('routesourcePage');

    $('#file-input2').val('');
    routeEditor.setValue('');
}


function routeshowPage(pageName) {

    $('.routemainPage').hide();
    $('.routesourcePage').hide();

    $('.' + pageName).show();
}

function routeInitCodeEditor() {
    var codeTextArea = document.getElementById('routeCodeString');

    routeEditor = CodeMirror.fromTextArea(codeTextArea, {
        mode: "javascript",
        lineNumbers: true,
        selectionPointer: true,
        styleActiveLine: true
    });
    console.log("dddd");
    console.log(routeEditor);

}

function routedoGetFile(filename) {
    console.log('doGetFile 호출됨 : ' + filename);

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var ajaxGetFilePath = '/manager/routefile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('routefile에 대한 응답을 받았음.');

            var dataObj = JSON.parse(data);
            //console.log(dataObj.result);

            //var decodedResult = window.atob(dataObj.result);
            var decodedResult = Base64.decode(dataObj.result);

            showRouteFile(filename, decodedResult);

        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}

function showRouteFile(filename, result) {
    // show source page
    routeshowPage('routesourcePage');

    $('#file-input2').val(filename);
    routeEditor.setValue(result);
}

function doSaveRouteFile() {
    console.log('doSaveRouteFile 호출됨.');

    var filename = $('#file-input2').val();
    var contents = routeEditor.getValue();

    if (filename.length < 1 || contents.length < 1) {
        var title = '입력 확인';
        var contents = '파일명과 내용을 먼저 입력하세요.';

        showConfirmDialog('text', title, contents, null, null, '닫기', function () {
            $.closeConfirmDialog();

        });

        return;
    }

    var requestCode = generateRequestCode();

    //console.log(contents);

    // base64 encode
    //var encodedContents = Base64.encode(contents);
    //var encodedContents = window.btoa(contents);

    // gzip compress
    //var gzip = new Zlib.Gzip(contents);
    //var compressed = gzip.compress();

    var compressed = encodeURIComponent(contents);

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;
    params += '&contents=' + compressed;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'post';

    var ajaxGetFilePath = '/manager/routefile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('routefile 저장에 대한 응답을 받았음.');

            console.log(data);

            routeshowPage('routemainPage');

            showModifyResultDialog(1, 10);
        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}



//socketIo 관련
function socketdoList() {
    console.log('socketIo 리스트 호출');

    var curPage = 1;
    var curPerPage = 10;

    socketrequestList(curPage, curPerPage);
}

/*function socketIodoAdd() {
    console.log('socketIo 호출됨');
    
    doAddRow(1, 10);
}*/

function socketIodoAddSource() {
    console.log('socketIodoAddSource 호출됨');

    socketIoshowPage('socketIosourcePage');

    $('#file-input3').val('');
    socketIoEditor.setValue('');
}


function socketIoshowPage(pageName) {

    $('.socketIomainPage').hide();
    $('.socketIosourcePage').hide();

    console.log('pageName');
    console.log(pageName);

    $('.' + pageName).show();
}


function socketIoinitCodeEditor() {

    console.log('socketIoinitCodeEditor')

    var codeTextArea = document.getElementById('socketIoCodeString');

    socketIoEditor = CodeMirror.fromTextArea(codeTextArea, {
        mode: "javascript",
        lineNumbers: true,
        selectionPointer: true,
        styleActiveLine: true
    });

}

function socketIodoGetFile(filename) {
    console.log('doGetFile 호출됨 : ' + filename);

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var ajaxGetFilePath = '/manager/socketiofile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('socketiofile에 대한 응답을 받았음.');

            var dataObj = JSON.parse(data);
            //console.log(dataObj.result);

            //var decodedResult = window.atob(dataObj.result);
            var decodedResult = Base64.decode(dataObj.result);

            showSocketIOFile(filename, decodedResult);

        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}

function showSocketIOFile(filename, result) {
    // show source page
    socketIoshowPage('socketIosourcePage');

    $('#file-input3').val(filename);
    socketIoEditor.setValue(result);
}

function doSaveSocketIOFile() {
    console.log('doSaveSocketIOFile 호출됨.');

    var filename = $('#file-input3').val();
    var contents = socketIoEditor.getValue();

    if (filename.length < 1 || contents.length < 1) {
        var title = '입력 확인';
        var contents = '파일명과 내용을 먼저 입력하세요.';

        showConfirmDialog('text', title, contents, null, null, '닫기', function () {
            $.closeConfirmDialog();

        });

        return;
    }

    var requestCode = generateRequestCode();

    //console.log(contents);

    // base64 encode
    //var encodedContents = Base64.encode(contents);
    //var encodedContents = window.btoa(contents);

    // gzip compress
    //var gzip = new Zlib.Gzip(contents);
    //var compressed = gzip.compress();

    var compressed = encodeURIComponent(contents);

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;
    params += '&contents=' + compressed;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'post';

    var ajaxGetFilePath = '/manager/socketiofile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('socketiofile 저장에 대한 응답을 받았음.');

            console.log(data);

            socketIoshowPage('socketIomainPage');

            showModifyResultDialog(1, 10);
        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}

function doAddSource() {
    console.log('doAddSource 호출됨');

    DBshowPage('DBssourcePage');

    $('#file-input4').val('');
    editor.setValue('');
}


function initCodeEditor() {
    
    
    if(editor != undefined){
        console.log('view no undefined');
    }else{
    
    var codeTextArea = document.getElementById('CodeString');

    editor = CodeMirror.fromTextArea(codeTextArea, {
        mode: "javascript",
        lineNumbers: true,
        selectionPointer: true,
        styleActiveLine: true
    });
    }

}


function doSaveFile() {
    if (isConfigFile) {
        doSaveConfigFile();
    } else if (isViewFile) {
        doSaveViewFile();
    }
}


function doGetViewFileList() {
    console.log('doGetViewFileList 호출됨.');

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var ajaxGetFilePath = '/manager/viewfilelist';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('viewfilelist에 대한 응답을 받았음.');

            var dataObj = JSON.parse(data);

            showViewFileList(dataObj.result);

        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}

function showViewFileList(result) {
    var output = "";
    for (var i = 0; i < result.length; i++) {
        output += "<option value=\"" + result[i] + "\">"
        output += result[i] + "</option>\n";
    }

    $('#viewFileSelect').html(output);
}


function doGetViewFile() {
    console.log('doGetViewFile 호출됨.');

    var filename = $('#viewFileSelect').val();

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var ajaxGetFilePath = '/manager/viewfile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('viewfile에 대한 응답을 받았음.');

            var dataObj = JSON.parse(data);
            var decodedResult = Base64.decode(dataObj.result);

            showViewFile(filename, decodedResult);

        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}

function showViewFile(filename, result) {
    $('#file-input4').val(filename);
    //editor.setOption("mode", "xml");
    editor.setOption("mode", "application/x-ejs");
    editor.setValue(result);

    isConfigFile = false;
    isViewFile = true;
}

function doSaveViewFile() {
    console.log('doSaveViewFile 호출됨.');

    var filename = $('#file-input4').val();
    var contents = editor.getValue();

    if (filename.length < 1 || contents.length < 1) {
        var title = '입력 확인';
        var contents = '파일명과 내용을 먼저 입력하세요.';

        showConfirmDialog('text', title, contents, null, null, '닫기', function () {
            $.closeConfirmDialog();

        });

        return;
    }

    var requestCode = generateRequestCode();

    var compressed = encodeURIComponent(contents);

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;
    params += '&contents=' + compressed;


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'post';

    var ajaxGetFilePath = '/manager/viewfile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('viewfile 저장에 대한 응답을 받았음.');

            console.log(data);

            var title = '저장 확인';
            var contents = '뷰 파일이 저장되었습니다.';

            showConfirmDialog('text', title, contents, null, null, '닫기', function () {
                $.closeConfirmDialog();
            });

        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}




function println(data) {
    $('#results3').html('<p>' + data + '</p>');
}


function println(data) {
    $('#results2').html('<p>' + data + '</p>');
}


function println(data) {
    $('#results1').html('<p>' + data + '</p>');
}


function println(data) {
    $('#results').html('<p>' + data + '</p>');
}