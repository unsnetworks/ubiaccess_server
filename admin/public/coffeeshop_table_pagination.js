var seqCode = 0;

var progressOptions = {
      lines: 12 // The number of lines to draw
    , length: 45 // The length of each line
    , width: 20 // The line thickness
    , radius: 60 // The radius of the inner circle
    , scale: 0.35 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.2 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 0.9 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
}

// 프로그레스바의 spinner 객체
var spinner;

var ajaxBaseUrl = '';
var ajaxType = '';
var ajaxListPath = '';
var ajaxAddPath = '';
var ajaxModifyPath = '';
var ajaxDeletePath = '';

var columnNames;
var columnAliases;

var showModifyButton;
var showDeleteButton;

var itemIcon = 'module.png';


var ajaxBaseUrl2 = '';
var ajaxType2 = '';
var ajaxPath2 = '';

var columnNames2;
var columnAliases2;

var itemIcon2 = 'module.png';

var ajaxBaseUrl3 = '';
var ajaxType3 = '';
var ajaxPath3 = '';

var columnNames3;
var columnAliases3;

var itemIcon3 = 'module.png';


var ajaxBaseUrl4 = '';
var ajaxType4 = '';
var ajaxPath4 = '';

var columnNames4;
var columnAliases4;

var itemIcon4 = 'module.png';


var table1;
var table2;
var table3;
var table4;


function initTable(tableTag, colNames, colAliases, columnDefs, aoColumns, sModifyButton, sDeleteButton, baseUrl, type, listPath, addPath, modifyPath, deletePath, icon) {
    ajaxBaseUrl = baseUrl;
    ajaxType = type;
    ajaxListPath = listPath;
    ajaxAddPath = addPath;
    ajaxModifyPath = modifyPath;
    ajaxDeletePath = deletePath;
    
    columnNames = colNames;
    columnAliases = colAliases;
    
    showModifyButton = sModifyButton;
    showDeleteButton = sDeleteButton;
    
    itemIcon = icon;
    
    
    // table 태그의 header 설정
    var threadHtml = "";
    threadHtml += "<tr>";
    for (var i = 0; i < columnAliases.length; i++) {
        threadHtml += "  <th>" + columnAliases[i] + "</th>";
    }
    threadHtml += "  <th>기능</th>";
    threadHtml += "</tr>";
     
    $(tableTag + '>thead').html(threadHtml);
    
    table1 = $(tableTag).dataTable({
        "bInfo":false,
        "bLengthChange":false,
        "searching":false,
        "bPaginate":false,
        "oLanguage":{
            "sEmptyTable":"조회된 데이터가 없습니다."
        },
        order: [],
        "columnDefs":columnDefs,
        "aoColumns" :aoColumns
    });
    
    $(tableTag + ' tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table1.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            
            // 단말 사용자 조회
            //var curData = table1.fnGetData(index);
            //console.log('DATA -> ' + curData[0]);
            var selectedRow = table1.fnGetData( this );
            console.log('id -> ' + selectedRow[1]);

            var searchParams = '&id=' + selectedRow[1];
            
            requestDeviceUserList(1,10, searchParams);
        }
    } );
    
}



function initTable2(tableTag, colNames, colAliases, columnDefs, aoColumns, baseUrl, type, path, icon) {
    ajaxBaseUrl2 = baseUrl;
    ajaxType2 = type;
    ajaxPath2 = path;
    
    columnNames2 = colNames;
    columnAliases2 = colAliases;
     
    itemIcon2 = icon;
    
    
    // table 태그의 header 설정
    var threadHtml = "";
    threadHtml += "<tr>";
    for (var i = 0; i < columnAliases2.length; i++) {
        threadHtml += "  <th>" + columnAliases2[i] + "</th>";
    }
    threadHtml += "  <th>기능</th>";
    threadHtml += "</tr>";
     
    $(tableTag + '>thead').html(threadHtml);
    
    table2 = $(tableTag).dataTable({
        "bInfo":false,
        "bLengthChange":false,
        "searching":false,
        "bPaginate":false,
        "oLanguage":{
            "sEmptyTable":"조회된 데이터가 없습니다."
        },
        order: [],
        "columnDefs":columnDefs,
        "aoColumns" :aoColumns
    });
}



function initTable3(tableTag, colNames, colAliases, columnDefs, aoColumns, baseUrl, type, path, icon) {
    ajaxBaseUrl3 = baseUrl;
    ajaxType3 = type;
    ajaxPath3 = path;
    
    columnNames3 = colNames;
    columnAliases3 = colAliases;
     
    itemIcon3 = icon;
    
    
    // table 태그의 header 설정
    var threadHtml = "";
    threadHtml += "<tr>";
    for (var i = 0; i < columnAliases3.length; i++) {
        threadHtml += "  <th>" + columnAliases3[i] + "</th>";
    }
    threadHtml += "  <th>기능</th>";
    threadHtml += "</tr>";
     
    $(tableTag + '>thead').html(threadHtml);
    
    table3 = $(tableTag).dataTable({
        "bInfo":false,
        "bLengthChange":false,
        "searching":false,
        "bPaginate":false,
        "oLanguage":{
            "sEmptyTable":"조회된 데이터가 없습니다."
        },
        order: [],
        "columnDefs":columnDefs,
        "aoColumns" :aoColumns
    });
    
    
    $(tableTag + ' tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table3.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            
            // 단말 사용자 조회
            //var curData = table1.fnGetData(index);
            //console.log('DATA -> ' + curData[0]);
            var selectedRow = table3.fnGetData( this );
            console.log('user_id -> ' + selectedRow[1]);

            var searchParams = '&user_id=' + selectedRow[1];

            requestUserDeviceList(1,10, searchParams);
        }
    } );
    
    
}


function initTable4(tableTag, colNames, colAliases, columnDefs, aoColumns, baseUrl, type, path, icon) {
    ajaxBaseUrl4 = baseUrl;
    ajaxType4 = type;
    ajaxPath4 = path;
    
    columnNames4 = colNames;
    columnAliases4 = colAliases;
     
    itemIcon4 = icon;
    
    
    // table 태그의 header 설정
    var threadHtml = "";
    threadHtml += "<tr>";
    for (var i = 0; i < columnAliases4.length; i++) {
        threadHtml += "  <th>" + columnAliases4[i] + "</th>";
    }
    threadHtml += "  <th>기능</th>";
    threadHtml += "</tr>";
     
    $(tableTag + '>thead').html(threadHtml);
    
    table4 = $(tableTag).dataTable({
        "bInfo":false,
        "bLengthChange":false,
        "searching":false,
        "bPaginate":false,
        "oLanguage":{
            "sEmptyTable":"조회된 데이터가 없습니다."
        },
        order: [],
        "columnDefs":columnDefs,
        "aoColumns" :aoColumns
    });
}



/*
 * 리스트 요청하기
 *
 * Param #1  page     현재 페이지 (1부터 시작)
 * Param #2  perPage  한 페이지 당 아이템 수
 */
function requestList(page, perPage, searchParams) {
    console.log('requestList 호출됨.');
    
    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&columnNames=' + columnNames.join();
    params += '&page=' + page;
    params += '&perPage=' + perPage;
    
    if (searchParams) {
        params += searchParams;
    }

    $.ajax({
        url:ajaxBaseUrl + ajaxListPath,
        type:ajaxType,
        data:params,
        headers: {
            'userid':'admin01'
        },
        //processData: true,
        success:function(data) {
            console.log('requestList에 대한 응답을 받았음.');
            console.log(data);
            
            var dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
                // set table data
                setResultToTable(dataObj.result, columnNames, '#table1', dataObj.page, dataObj.perPage, dataObj.totalRecords);

                // set page buttons using pagination.js
                setPagination(dataObj.page, dataObj.perPage, dataObj.totalRecords, '#pageButtons');
            } else {
                showErrorDialog(dataObj.code, dataObj.message);
            }
             
        },
        error:function(err) {
            console.log('에러가 발생함.');
            console.dir(err);
            
            showErrorDialog(err.status, err.statusText);
        }
    });
}



/*
 * 사용자 리스트 요청하기
 *
 * Param #1  page     현재 페이지 (1부터 시작)
 * Param #2  perPage  한 페이지 당 아이템 수
 */
function requestList3(page, perPage, searchParams) {
    console.log('requestList3 호출됨.');
    
    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&columnNames=' + columnNames3.join();
    params += '&page=' + page;
    params += '&perPage=' + perPage;
    
    if (searchParams) {
        params += searchParams;
    }

    $.ajax({
        url:ajaxBaseUrl3 + ajaxPath3,
        type:ajaxType3,
        data:params,
        headers: {
            'userid':'admin01'
        },
        //processData: true,
        success:function(data) {
            console.log('requestList3에 대한 응답을 받았음.');
            console.log(data);
            
            var dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
                // set table data
                setResultToTable3(dataObj.result, columnNames3, '#table3', dataObj.page, dataObj.perPage, dataObj.totalRecords);

                // set page buttons using pagination.js
                setPagination3(dataObj.page, dataObj.perPage, dataObj.totalRecords, '#pageButtons3');
            } else {
                showErrorDialog(dataObj.code, dataObj.message);
            }
             
        },
        error:function(err) {
            console.log('에러가 발생함.');
            console.dir(err);
            
            showErrorDialog(err.status, err.statusText);
        }
    });
}




/*
 * 추가 요청하기
 *
 * Param #1  attrNames    수정할 칼럼의 이름 (배열)
 * Param #2  attrValues   수정할 칼럼의 값 (배열)
 * Param #3  page         현재 페이지 (1부터 시작)
 * Param #4  perPage      한 페이지 당 아이템 수
 */
function requestAdd(attrNames, attrValues, page, perPage) {
    console.log('requestAdd 호출됨 : ' + attrNames.length + ', ' + attrValues.length);

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&columnNames=' + attrNames.join();
    params += '&columnValues=' + attrValues.join();
    
    console.log('params : ' + params);


    $.ajax({
        url:ajaxBaseUrl + ajaxAddPath,
        type:'post',
        data:params,
        headers: {
            'userid':'admin01'
        },
        success:function(data) {
            console.log('requestAdd에 대한 응답을 받았음.');
            
            $.closeConfirmDialog();

            console.log(data);
            println('아이템 추가 완료.');

            var dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
                requestList(page, perPage);
                //showAddResultDialog(page, perPage);
            } else {
                showErrorDialog(dataObj.code, dataObj.message);
            }
        },
        error:function(err) {
            $.closeConfirmDialog();

            console.log('에러가 발생함.');
            console.dir(err);
            showErrorDialog(err.status, err.statusText);
        }
    });

    showProgressDialog();
}


/*
 * 수정 요청하기
 *
 * Param #1  attrNames    수정할 칼럼의 이름 (배열)
 * Param #2  attrValues   수정할 칼럼의 값 (배열)
 * Param #3  page         현재 페이지 (1부터 시작)
 * Param #4  perPage      한 페이지 당 아이템 수
 */
function requestEdit(id, attrNames, attrValues, page, perPage) {
    console.log('requestEdit 호출됨 : ' + id + ', ' + attrNames.length + ', ' + attrValues.length);

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&columnNames=' + attrNames.join();
    params += '&columnValues=' + attrValues.join();
    params += '&page=' + page;
    params += '&perPage=' + perPage;
    
    console.log('params : ' + params);


    $.ajax({
        url:ajaxBaseUrl + ajaxModifyPath + '/' + id,
        type:'put',
        data:params,
        headers: {
            'userid':'admin01'
        },
        success:function(data) {
            $.closeConfirmDialog();

            console.log('requestEdit에 대한 응답을 받았음.');
            console.log(data);
            println('아이템 수정 완료.');

            var dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
                requestList(page, perPage);
                //showModifyResultDialog(page, perPage);
            } else {
                showErrorDialog(dataObj.code, dataObj.message);
            }
        },
        error:function(err) {
            $.closeConfirmDialog();

            console.log('에러가 발생함.');
            console.dir(err);
            showErrorDialog(err.status, err.statusText);
        }
    });

    showProgressDialog();
}



/*
 * 삭제 요청하기
 *
 * Param #1  id           삭제할 아이디
 * Param #2  page         현재 페이지 (1부터 시작)
 * Param #3  perPage      한 페이지 당 아이템 수
 */
function requestDelete(id, page, perPage) {
    console.log('requestDelete 호출됨 : ' + id + ', ' + page + ', ' + perPage);

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&id=' + id;
    params += '&page=' + page;
    params += '&perPage=' + perPage;
    
    console.log('params : ' + params);


    $.ajax({
        url:ajaxBaseUrl + ajaxDeletePath + '/' + id,
        type:'delete',
        data:params,
        headers: {
            'userid':'admin01'
        },
        success:function(data) {
            $.closeConfirmDialog();

            console.log('requestDelete에 대한 응답을 받았음.');
            console.log(data);
            println('아이템 삭제 완료.');

            var dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
                requestList(page, perPage);
            } else {
                showErrorDialog(dataObj.code, dataObj.message);
            }
        },
        error:function(err) {
            $.closeConfirmDialog();

            console.log('에러가 발생함.');
            console.dir(err);
            showErrorDialog(err.status, err.statusText);
        }
    });

    showProgressDialog();
}



/*
 * DeviceUser 리스트 요청하기
 *
 * Param #1  page     현재 페이지 (1부터 시작)
 * Param #2  perPage  한 페이지 당 아이템 수
 */
function requestDeviceUserList(page, perPage, searchParams) {
    console.log('requestDeviceUserList 호출됨.');
    
    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&columnNames=' + columnNames2.join();
    params += '&page=' + page;
    params += '&perPage=' + perPage;

    if (searchParams) {
        params += searchParams;
    }

    $.ajax({
        url:ajaxBaseUrl2 + ajaxPath2,
        type:ajaxType2,
        data:params,
        headers: {
            'userid':'admin01'
        },
        //processData: true,
        success:function(data) {
            console.log('requestDeviceUserList에 대한 응답을 받았음.');
            console.log(data);
            
            var dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
                // set table data
                setResultToTable2(dataObj.result, columnNames2, '#table2', dataObj.page, dataObj.perPage, dataObj.totalRecords);

                // set page buttons using pagination.js
                setPagination2(dataObj.page, dataObj.perPage, dataObj.totalRecords, '#pageButtons2');
            } else {
                showErrorDialog(dataObj.code, dataObj.message);
            }
             
        },
        error:function(err) {
            console.log('에러가 발생함.');
            console.dir(err);
            
            showErrorDialog(err.status, err.statusText);
        }
    });
}



/*
 * UserDevice 리스트 요청하기
 *
 * Param #1  page     현재 페이지 (1부터 시작)
 * Param #2  perPage  한 페이지 당 아이템 수
 */
function requestUserDeviceList(page, perPage, searchParams) {
    console.log('requestUserDeviceList 호출됨.');
    
    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&columnNames=' + columnNames4.join();
    params += '&page=' + page;
    params += '&perPage=' + perPage;

    if (searchParams) {
        params += searchParams;
    }

    $.ajax({
        url:ajaxBaseUrl4 + ajaxPath4,
        type:ajaxType4,
        data:params,
        headers: {
            'userid':'admin01'
        },
        //processData: true,
        success:function(data) {
            console.log('requestUserDeviceList에 대한 응답을 받았음.');
            console.log(data);
            
            var dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
                // set table data
                setResultToTable4(dataObj.result, columnNames4, '#table4', dataObj.page, dataObj.perPage, dataObj.totalRecords);

                // set page buttons using pagination.js
                setPagination4(dataObj.page, dataObj.perPage, dataObj.totalRecords, '#pageButtons4');
            } else {
                showErrorDialog(dataObj.code, dataObj.message);
            }
             
        },
        error:function(err) {
            console.log('에러가 발생함.');
            console.dir(err);
            
            showErrorDialog(err.status, err.statusText);
        }
    });
}





/*
 * 확인 대화상자 또는 프로그레스 대화상자 띄우기
 *
 * Param #1  contentsType     대화상자의 내용 부분의 형식   'text' - 일반 안내글, 'progress' - 프로그레스
 * Param #2  title            대화상자의 제목
 * Param #3  contents         대화상자의 내용글
 * Param #4  button1Text      첫번째 버튼에 표시될 글자
 * Param #5  button1Callback  첫번째 버튼을 클릭했을 때 동작할 함수명
 * Param #6  button2Text      두번째 버튼에 표시될 글자
 * Param #7  button2Callback  두번째 버튼을 클릭했을 때 동작할 함수명
 */
function showConfirmDialog(contentsType, title, contents, button1Text, button1Callback, button2Text, button2Callback) {
    $('#modalConfirmTitle').html(title);

    if (contentsType == 'progress') {

        var target = document.getElementById('progressView');
        if (!spinner) {
            spinner = new Spinner(progressOptions).spin(target);
        }
        
        $('#modalProgressView').show();
        $('#modalTextView').hide();

    } else if (contentsType == 'text') {
        $('#modalProgressView').hide();
        $('#modalTextView').show();

        $('#modalConfirmContents').html(contents);
    }

    if (button1Text) {
        $('#modalConfirmButton1').attr('value', button1Text);
    }

    if (button1Callback) {
        $('#modalConfirmButton1').show();
        $('#modalConfirmButton1').on('click', button1Callback);
    } else {
        $('#modalConfirmButton1').hide();
    }

    if (button2Text) {
        $('#modalConfirmButton2').attr('value', button2Text);
    }

    if (button2Callback) {
        $('#modalConfirmButton2').show();
        $('#modalConfirmButton2').on('click', button2Callback);
    } else {
        $('#modalConfirmButton2').hide();
    }

    // modal 대화상자는 asynchronous 방식이므로 너무 빨리 show를 연속으로 실행하면 문제 발생
    // hidden 상태인지 확인 후 show 함

    $.displayConfirmDialog();

}

$.displayConfirmDialog = function() {

    setTimeout(function() {
        //if ($('#modalConfirm').is(':hidden')) {
            $('#modalConfirm').modal('show');   
        //}
    }, 200);

};
$.closeConfirmDialog = function() {

    setTimeout(function() {
        //if ($('#modalConfirm').is(':visible')) {
            $('#modalConfirm').modal('hide');   
        //}
    }, 700);

};

$.displayEditDialog = function() {

    setTimeout(function() {
        //if ($('#modalEdit').is(':hidden')) {
            $('#modalEdit').modal('show');   
        //}
    }, 200);

};
$.closeEditDialog = function() {

    setTimeout(function() {
        //if ($('#modalEdit').is(':visible')) {
            $('#modalEdit').modal('hide');   
        //}
    }, 700);

};


/*
 * 삭제 확인 대화상자 띄우기
 */
function showDeleteConfirmDialog(id, page, perPage) {
    var title = '삭제 확인';
    var contents = '삭제하시겠습니까?';
    var button1Clicked = function() {
        $.closeConfirmDialog();
        
        requestDelete(id, page, perPage);
    }

    var button2Clicked = function() {
        $.closeConfirmDialog();
    }

    showConfirmDialog('text', title, contents, '예', button1Clicked, '아니오', button2Clicked);
}

/*
 * 추가 결과 대화상자 띄우기
 */
function showAddResultDialog(page, perPage) {
    var title = '추가 결과';
    var contents = '정상적으로 추가되었습니다.';

    showConfirmDialog('text', title, contents, null, null, '닫기', function() {
        $.closeConfirmDialog();
        
        requestList(page, perPage);
    });
}

/*
 * 수정 결과 대화상자 띄우기
 */
function showModifyResultDialog(page, perPage) {
    var title = '수정 결과';
    var contents = '정상적으로 수정되었습니다.';

    showConfirmDialog('text', title, contents, null, null, '닫기', function() {
        $.closeConfirmDialog();
        
        requestList(page, perPage);
    });
}

/*
 * 삭제 결과 대화상자 띄우기
 */
function showDeleteResultDialog(page, perPage) {
    var title = '삭제 결과';
    var contents = '정상적으로 삭제되었습니다.';

    showConfirmDialog('text', title, contents, null, null, '닫기', function() {
        $.closeConfirmDialog();
        
        requestList(page, perPage);
    });
}

/*
 * 에러 대화상자 띄우기
 */
function showErrorDialog(errorCode, errorMessage) {
    var title = '에러';
    var contents = '데이터 처리중 에러가 발생했습니다 : ' + errorCode + ', ' + errorMessage;

    showConfirmDialog('text', title, contents, null, null, '확인', function() {
        $.closeConfirmDialog();
    });
}

/*
 * 프로그레스 대화상자 띄우기
 */
function showProgressDialog() {
    var title = '요청 처리중입니다.';

    showConfirmDialog('progress', title, null, null, null, '취소', function() {
        $.closeConfirmDialog();
    });
}




function setResultToTable(result, attrNames, dataTableTag, page, perPage, totalRecords) {
    console.dir(result);

    //$('#table1').dataTable().fnClearTable();
    table1.fnClearTable();

    result.forEach(function(elem, index) {
        var row = [
            //"<img src='module.png' width='40%'>"
            "<img src='" + itemIcon + "' width='25em'>"
        ];

        var attrValues = [];
        for (var i = 0; i < attrNames.length; i++) {
            if (i > 0) {
                row.push(elem[attrNames[i]]);
            }

            attrValues.push(elem[attrNames[i]]);
        }

        var buttonHtml = "";
        //console.log('attrNames : ' + attrNames.join());
        //console.log('attrValues : ' + attrValues.join());

        if (showModifyButton) {
            /*
            // button size : btn-sm btn-xs
            buttonHtml += "<button type='button' class='edit-modal btn btn-success btn-xs' onclick='requestDeviceUserList(1,10)'><span class='glyphicon glyphicon-list-alt'></span>사용자</button>";
            */
            
            buttonHtml += "<button type='button' class='edit-modal btn btn-info btn-xs' style='margin-left:0.2em' onclick='doEditRow(\"" + elem['id'] + "\", \"" + attrNames.join() + "\", \"" + attrValues.join() + "\", \"" + page + "\", \"" + perPage + "\")'><span class='glyphicon glyphicon-edit'></span>수정</button>";
            
        }

        if (showDeleteButton) {
            buttonHtml += "<button type='button' class='delete-modal btn btn-danger btn-xs' style='margin-left:0.2em' onclick='doDeleteRow(\"" + elem['id'] + "\", \"" + page + "\", \"" + perPage + "\")'><span class='glyphicon glyphicon-trash'></span>삭제</button>";
        }

        row.push(buttonHtml);

        //$(dataTableTag).dataTable().fnAddData(row);
        table1.fnAddData(row);

    });
}



function setResultToTable2(result, attrNames, dataTableTag, page, perPage, totalRecords) {
    console.dir(result);

    //$('#table2').dataTable().fnClearTable();
    table2.fnClearTable();

    result.forEach(function(elem, index) {
        var row = [
            //"<img src='module.png' width='40%'>"
            "<img src='" + itemIcon2 + "' width='35em'>"
        ];

        var attrValues = [];
        for (var i = 0; i < attrNames.length; i++) {
            var beginIndex = attrNames[i].indexOf('.');
            var origAttrName = attrNames[i];
            console.log('orig attr name #' + i + ' -> ' + origAttrName);
            
            if (beginIndex > 0) {
                origAttrName = attrNames[i].substring(beginIndex+1, attrNames[i].length);
            }
            if (i > 0) {
                row.push(elem[origAttrName]);
            }

            attrValues.push(elem[origAttrName]);
        }

        var buttonHtml = "";
        console.log('attrNames : ' + attrNames.join());
        console.log('attrValues : ' + attrValues.join());

 
        buttonHtml += "<button type='button' class='edit-modal btn btn-info btn-xs' style='margin-left:0.2em' onclick='doEditRow2(\"" + elem['id'] + "\", \"" + attrNames.join() + "\", \"" + attrValues.join() + "\", \"" + page + "\", \"" + perPage + "\")'><span class='glyphicon glyphicon-edit'></span>수정</button>";


        buttonHtml += "<button type='button' class='delete-modal btn btn-danger btn-xs' style='margin-left:0.2em' onclick='doDeleteRow2(\"" + elem['id'] + "\", \"" + page + "\", \"" + perPage + "\")'><span class='glyphicon glyphicon-trash'></span>삭제</button>";

        row.push(buttonHtml);

        //$(dataTableTag).dataTable().fnAddData(row);
        table2.fnAddData(row);

    });
}



function setResultToTable3(result, attrNames, dataTableTag, page, perPage, totalRecords) {
    console.dir(result);

    //$('#table1').dataTable().fnClearTable();
    table3.fnClearTable();

    result.forEach(function(elem, index) {
        var row = [
            //"<img src='module.png' width='40%'>"
            "<img src='" + itemIcon3 + "' width='25em'>"
        ];

        var attrValues = [];
        for (var i = 0; i < attrNames.length; i++) {
            if (i > 0) {
                row.push(elem[attrNames[i]]);
            }

            attrValues.push(elem[attrNames[i]]);
        }

        var buttonHtml = "";
        //console.log('attrNames : ' + attrNames.join());
        //console.log('attrValues : ' + attrValues.join());

        if (showModifyButton) {
            /*
            // button size : btn-sm btn-xs
            buttonHtml += "<button type='button' class='edit-modal btn btn-success btn-xs' onclick='requestDeviceUserList(1,10)'><span class='glyphicon glyphicon-list-alt'></span>사용자</button>";
            */
            
            buttonHtml += "<button type='button' class='edit-modal btn btn-info btn-xs' style='margin-left:0.2em' onclick='doEditRow(\"" + elem['id'] + "\", \"" + attrNames.join() + "\", \"" + attrValues.join() + "\", \"" + page + "\", \"" + perPage + "\")'><span class='glyphicon glyphicon-edit'></span>수정</button>";
            
        }

        if (showDeleteButton) {
            buttonHtml += "<button type='button' class='delete-modal btn btn-danger btn-xs' style='margin-left:0.2em' onclick='doDeleteRow(\"" + elem['id'] + "\", \"" + page + "\", \"" + perPage + "\")'><span class='glyphicon glyphicon-trash'></span>삭제</button>";
        }

        row.push(buttonHtml);

        //$(dataTableTag).dataTable().fnAddData(row);
        table3.fnAddData(row);

    });
}



function setResultToTable4(result, attrNames, dataTableTag, page, perPage, totalRecords) {
    console.dir(result);

    //$('#table2').dataTable().fnClearTable();
    table4.fnClearTable();

    result.forEach(function(elem, index) {
        var row = [
            //"<img src='module.png' width='40%'>"
            "<img src='" + itemIcon4 + "' width='30em'>"
        ];

        var attrValues = [];
        for (var i = 0; i < attrNames.length; i++) {
            var beginIndex = attrNames[i].indexOf('.');
            var origAttrName = attrNames[i];
            console.log('orig attr name #' + i + ' -> ' + origAttrName);
            
            if (beginIndex > 0) {
                origAttrName = attrNames[i].substring(beginIndex+1, attrNames[i].length);
            }
            if (i > 0) {
                row.push(elem[origAttrName]);
            }

            attrValues.push(elem[origAttrName]);
        }

        var buttonHtml = "";
        console.log('attrNames : ' + attrNames.join());
        console.log('attrValues : ' + attrValues.join());

 
        buttonHtml += "<button type='button' class='edit-modal btn btn-info btn-xs' style='margin-left:0.2em' onclick='doEditRow2(\"" + elem['id'] + "\", \"" + attrNames.join() + "\", \"" + attrValues.join() + "\", \"" + page + "\", \"" + perPage + "\")'><span class='glyphicon glyphicon-edit'></span>수정</button>";


        buttonHtml += "<button type='button' class='delete-modal btn btn-danger btn-xs' style='margin-left:0.2em' onclick='doDeleteRow2(\"" + elem['id'] + "\", \"" + page + "\", \"" + perPage + "\")'><span class='glyphicon glyphicon-trash'></span>삭제</button>";

        row.push(buttonHtml);

        //$(dataTableTag).dataTable().fnAddData(row);
        table4.fnAddData(row);

    });
}




/*
 * 요청 코드 생성
 * 고유한 문자열 값 (시간과 시퀀스 번호 이용)
 */
function generateRequestCode() {
    var date = new Date();

    var seqCodeStr = getSeqCode();


    var components = [
        date.getFullYear(),
        ("0" + (date.getMonth() + 1)).slice(-2),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
        seqCodeStr
    ];

    //console.log('시간 값');
    //console.dir(components);

    var curCode = components.join("");
    return curCode;
}

/*
 * 시퀀스 번호 확인 (01 ~ 99)
 */
function getSeqCode() {
    seqCode += 1;
    if (seqCode > 99) {
        seqCode = 0;
    }
    var seqCodeStr = String(seqCode);
    if (seqCodeStr.length == 1) {
        seqCodeStr = '0' + seqCodeStr;
    }

    return seqCodeStr;
}

/*
 * 아이템 추가
 *
 */
function doAddRow(page, perPage) {
    console.log('doAddRow 호출됨.');
 
    var inputHtml = "";

    // 첫번째 id 칼럼 사용함
    for (var i = 0; i < columnNames.length; i++) {
        inputHtml += "<div class='form-group'>";
        inputHtml += "  <label class='col-sm-3 control-label'>" + columnAliases[i] + "</label>";
        inputHtml += "  <div class='col-sm-9'>";

        var curAttrName = columnNames[i];
        if (curAttrName == 'ST_X(location)') {
            curAttrName = 'location_X';
        } else if (curAttrName == 'ST_Y(location)') {
            curAttrName = 'location_Y';
        }
        
        inputHtml += "    <input type='text' class='form-control' id='dialog-input-" + curAttrName + "' value=''>";

        inputHtml += "  </div>";
        inputHtml += "</div>";
    }

    $('#editDialogBody').html(inputHtml);

    // 첫번째 id 칼럼 사용함
    $('#editDialogSaveButton').attr('onclick', 'doModalAddSave("' + columnNames.join() + '", "' + page + '", "' + perPage + '")');

    $.displayEditDialog();
}


function doEditRow(id, attrNamesStr, attrValuesStr, page, perPage) {
    console.log('doEditRow 호출됨 : ' + id);

    var attrNames = attrNamesStr.split(',');
    var attrValues = attrValuesStr.split(',');

    var inputHtml = "";

    for (var i = 0; i < attrNames.length; i++) {
        inputHtml += "<div class='form-group'>";
        inputHtml += "  <label class='col-sm-3 control-label'>" + attrNames[i] + "</label>";
        inputHtml += "  <div class='col-sm-9'>";

        
        var curAttrName = attrNames[i];
        if (curAttrName == 'ST_X(location)') {
            curAttrName = 'location_X';
        } else if (curAttrName == 'ST_Y(location)') {
            curAttrName = 'location_Y';
        }
        
        
        if (i == 0 || i == 11) {
            inputHtml += "    <input disabled type='text' class='form-control' id='dialog-input-" + curAttrName + "' value='" + attrValues[i] + "'>";
        } else if (i == 9) {
            inputHtml += "    <select class='form-control' id='dialog-input-" + curAttrName + "'>";
            
            var options = ['public', 'private'];
            for (var j = 0; j < options.length; j++) {
                if (attrValues[i] == options[j]) {
                    inputHtml += "    <option selected>" + options[j] + "</option>";
                } else {
                    inputHtml += "    <option>" + options[j] + "</option>";
                }
            }
            inputHtml += "    </select>";
        
        } else if (i == 10) {
            inputHtml += "    <select class='form-control' id='dialog-input-" + curAttrName + "'>";
            
            var options = ['normal', 'blocked', 'password'];
            for (var j = 0; j < options.length; j++) {
                if (attrValues[i] == options[j]) {
                    inputHtml += "    <option selected>" + options[j] + "</option>";
                } else {
                    inputHtml += "    <option>" + options[j] + "</option>";
                }
            }
            inputHtml += "    </select>";
            
        } else {
            inputHtml += "    <input type='text' class='form-control' id='dialog-input-" + curAttrName + "' value='" + attrValues[i] + "'>";
        }

        inputHtml += "  </div>";
        inputHtml += "</div>";
    }

    $('#editDialogBody').html(inputHtml);

    $('#editDialogSaveButton').attr('onclick', 'doModalEditSave("' + id + '", "' + attrNamesStr + '", "' + page + '", "' + perPage + '")');

    $.displayEditDialog();
}

function doDeleteRow(id, page, perPage) {
    console.log('doDeleteRow 호출됨 : ' + id + ', ' + page + ', ' + perPage);

    showDeleteConfirmDialog(id, page, perPage);
}

function doModalDelete() {
    $.closeEditDialog();
}

function doModalDeleteClose() {
    $.closeEditDialog();
}


function doModalEditSave(id, attrNamesStr, page, perPage) {
    console.log('doModalEditSave 호출됨 : ' + id);

    $.closeEditDialog();

    var attrNames = attrNamesStr.split(',');

    var attrValues = [];
    for (var i = 0; i < attrNames.length; i++) {
        // create_date 제외
        if (attrNames[i] == 'create_date') {
            delete attrNames[i];
            continue;
        }
        
        var curAttrName = attrNames[i];
        if (curAttrName == 'ST_X(location)') {
            curAttrName = 'location_X';
        } else if (curAttrName == 'ST_Y(location)') {
            curAttrName = 'location_Y';
        }
        var input = $('#dialog-input-' + curAttrName).val(); 
        
        attrValues.push(input);
        console.log('입력값 #' + i + ' : ' + input);
    }
 
    requestEdit(id, attrNames, attrValues, page, perPage);
 
}


function doModalAddSave(attrNamesStr, page, perPage) {
    console.log('doModalAddSave 호출됨.');

    $.closeEditDialog();

    var attrNames = attrNamesStr.split(',');

    var attrValues = [];
    for (var i = 0; i < attrNames.length; i++) {
        
        var curAttrName = attrNames[i];
        if (curAttrName == 'ST_X(location)') {
            curAttrName = 'location_X';
        } else if (curAttrName == 'ST_Y(location)') {
            curAttrName = 'location_Y';
        }
        var input = $('#dialog-input-' + curAttrName).val(); 
        
        attrValues.push(input);
        console.log('입력값 #' + i + ' : ' + input);
    }
 
    requestAdd(attrNames, attrValues, page, perPage);
 
}

function doModalEditClose() {
    $.closeEditDialog();
}





/*
 * Pagination using bootstrap
 *
 * param #1 page            current page
 * param #2 perPage         count of buttons in PageButtons tag
 * param #3 totalRecords    total records in database table
 * param #4 pageButtonsTag  jQuery object in which page buttons will be inserted 
 */
var debugPagination = true;

function setPagination(page, perPage, totalRecords, pageButtonsTag) {
    if (debugPagination) {
        console.log('setPagination called : ' + page + ', ' + perPage + ', ' + totalRecords);
    }
    
    // calculate total page count
    var pageCount = Math.ceil(totalRecords / perPage);
    if (debugPagination) {
        console.log('pageCount : ' + pageCount);
    }
    

    var buttonHtml = "";
    buttonHtml += "<ul class='pagination'>";

    // enable or disable first and previous buttons
    // show first and previous buttons if previousPage is bigger than 0
    var currentMin = (Math.floor((page-1)/perPage))*perPage+1;
    var previousPage = currentMin-1;
    if (debugPagination) {
        console.log('currentMin : ' + currentMin);
        console.log('previousPage : ' + previousPage);
    }

    if (currentMin > 1) {
        // First Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestList(1, " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Previous Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestList(" + previousPage + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    } else {
        // First Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Previous Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    }

    var initial = (Math.floor((page-1) / perPage) * perPage) + 1;
    
    var max = (pageCount - initial) + 1;
    if (max > 10) {
        max = initial + 10;
    } else {
        max = initial + max;
    }
    if (debugPagination) {
        console.log('initial : ' + initial + ', max : ' + max);
    }
 
    for (var i = initial; i < max; i++) {
        if (i != page) {
            buttonHtml += "  <li><a href='javascript:requestList(" + i + ", " + perPage + ")'>";
            buttonHtml += "" + i;
            buttonHtml += "</a></li>";
        } else {
            buttonHtml += "  <li class='active'><a href='#'>";
            buttonHtml += "" + i;
            buttonHtml += "<span class='sr-only'>(current)</span></a></div>";
        }
    }

    // enable or disable next and last buttons
    // show next and last buttons if nextPage is smaller than pageCount
    var currentMax = (Math.floor((page-1)/perPage)+1)*perPage;
    var nextPage = currentMax + 1;
    if (debugPagination) {
        console.log('currentMax : ' + currentMax);
        console.log('nextPage : ' + nextPage);
    }

    if (currentMax < pageCount) {
        // Next Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestList(" + nextPage + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Last Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestList(" + (pageCount) + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    } else {
        // Next Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Last Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    }

    buttonHtml += "</ul>";

    $(pageButtonsTag).html(buttonHtml);
}



function setPagination2(page, perPage, totalRecords, pageButtonsTag) {
    if (debugPagination) {
        console.log('setPagination2 called : ' + page + ', ' + perPage + ', ' + totalRecords);
    }
    
    // calculate total page count
    var pageCount = Math.ceil(totalRecords / perPage);
    if (debugPagination) {
        console.log('pageCount : ' + pageCount);
    }
    

    var buttonHtml = "";
    buttonHtml += "<ul class='pagination'>";

    // enable or disable first and previous buttons
    // show first and previous buttons if previousPage is bigger than 0
    var currentMin = (Math.floor((page-1)/perPage))*perPage+1;
    var previousPage = currentMin-1;
    if (debugPagination) {
        console.log('currentMin : ' + currentMin);
        console.log('previousPage : ' + previousPage);
    }

    if (currentMin > 1) {
        // First Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestDeviceUserList(1, " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Previous Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestDeviceUserList(" + previousPage + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    } else {
        // First Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Previous Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    }

    var initial = (Math.floor((page-1) / perPage) * perPage) + 1;
    
    var max = (pageCount - initial) + 1;
    if (max > 10) {
        max = initial + 10;
    } else {
        max = initial + max;
    }
    if (debugPagination) {
        console.log('initial : ' + initial + ', max : ' + max);
    }
 
    for (var i = initial; i < max; i++) {
        if (i != page) {
            buttonHtml += "  <li><a href='javascript:requestDeviceUserList(" + i + ", " + perPage + ")'>";
            buttonHtml += "" + i;
            buttonHtml += "</a></li>";
        } else {
            buttonHtml += "  <li class='active'><a href='#'>";
            buttonHtml += "" + i;
            buttonHtml += "<span class='sr-only'>(current)</span></a></div>";
        }
    }

    // enable or disable next and last buttons
    // show next and last buttons if nextPage is smaller than pageCount
    var currentMax = (Math.floor((page-1)/perPage)+1)*perPage;
    var nextPage = currentMax + 1;
    if (debugPagination) {
        console.log('currentMax : ' + currentMax);
        console.log('nextPage : ' + nextPage);
    }

    if (currentMax < pageCount) {
        // Next Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestDeviceUserList(" + nextPage + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Last Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestDeviceUserList(" + (pageCount) + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    } else {
        // Next Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Last Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    }

    buttonHtml += "</ul>";

    $(pageButtonsTag).html(buttonHtml);
}


function setPagination3(page, perPage, totalRecords, pageButtonsTag) {
    if (debugPagination) {
        console.log('setPagination3 called : ' + page + ', ' + perPage + ', ' + totalRecords);
    }
    
    // calculate total page count
    var pageCount = Math.ceil(totalRecords / perPage);
    if (debugPagination) {
        console.log('pageCount : ' + pageCount);
    }
    

    var buttonHtml = "";
    buttonHtml += "<ul class='pagination'>";

    // enable or disable first and previous buttons
    // show first and previous buttons if previousPage is bigger than 0
    var currentMin = (Math.floor((page-1)/perPage))*perPage+1;
    var previousPage = currentMin-1;
    if (debugPagination) {
        console.log('currentMin : ' + currentMin);
        console.log('previousPage : ' + previousPage);
    }

    if (currentMin > 1) {
        // First Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestList3(1, " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Previous Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestList3(" + previousPage + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    } else {
        // First Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Previous Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    }

    var initial = (Math.floor((page-1) / perPage) * perPage) + 1;
    
    var max = (pageCount - initial) + 1;
    if (max > 10) {
        max = initial + 10;
    } else {
        max = initial + max;
    }
    if (debugPagination) {
        console.log('initial : ' + initial + ', max : ' + max);
    }
 
    for (var i = initial; i < max; i++) {
        if (i != page) {
            buttonHtml += "  <li><a href='javascript:requestList3(" + i + ", " + perPage + ")'>";
            buttonHtml += "" + i;
            buttonHtml += "</a></li>";
        } else {
            buttonHtml += "  <li class='active'><a href='#'>";
            buttonHtml += "" + i;
            buttonHtml += "<span class='sr-only'>(current)</span></a></div>";
        }
    }

    // enable or disable next and last buttons
    // show next and last buttons if nextPage is smaller than pageCount
    var currentMax = (Math.floor((page-1)/perPage)+1)*perPage;
    var nextPage = currentMax + 1;
    if (debugPagination) {
        console.log('currentMax : ' + currentMax);
        console.log('nextPage : ' + nextPage);
    }

    if (currentMax < pageCount) {
        // Next Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestList3(" + nextPage + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Last Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestList3(" + (pageCount) + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    } else {
        // Next Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Last Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    }

    buttonHtml += "</ul>";

    $(pageButtonsTag).html(buttonHtml);
}


function setPagination4(page, perPage, totalRecords, pageButtonsTag) {
    if (debugPagination) {
        console.log('setPagination4 called : ' + page + ', ' + perPage + ', ' + totalRecords);
    }
    
    // calculate total page count
    var pageCount = Math.ceil(totalRecords / perPage);
    if (debugPagination) {
        console.log('pageCount : ' + pageCount);
    }
    

    var buttonHtml = "";
    buttonHtml += "<ul class='pagination'>";

    // enable or disable first and previous buttons
    // show first and previous buttons if previousPage is bigger than 0
    var currentMin = (Math.floor((page-1)/perPage))*perPage+1;
    var previousPage = currentMin-1;
    if (debugPagination) {
        console.log('currentMin : ' + currentMin);
        console.log('previousPage : ' + previousPage);
    }

    if (currentMin > 1) {
        // First Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestUserDeviceList(1, " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Previous Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestUserDeviceList(" + previousPage + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    } else {
        // First Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Previous Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    }

    var initial = (Math.floor((page-1) / perPage) * perPage) + 1;
    
    var max = (pageCount - initial) + 1;
    if (max > 10) {
        max = initial + 10;
    } else {
        max = initial + max;
    }
    if (debugPagination) {
        console.log('initial : ' + initial + ', max : ' + max);
    }
 
    for (var i = initial; i < max; i++) {
        if (i != page) {
            buttonHtml += "  <li><a href='javascript:requestUserDeviceList(" + i + ", " + perPage + ")'>";
            buttonHtml += "" + i;
            buttonHtml += "</a></li>";
        } else {
            buttonHtml += "  <li class='active'><a href='#'>";
            buttonHtml += "" + i;
            buttonHtml += "<span class='sr-only'>(current)</span></a></div>";
        }
    }

    // enable or disable next and last buttons
    // show next and last buttons if nextPage is smaller than pageCount
    var currentMax = (Math.floor((page-1)/perPage)+1)*perPage;
    var nextPage = currentMax + 1;
    if (debugPagination) {
        console.log('currentMax : ' + currentMax);
        console.log('nextPage : ' + nextPage);
    }

    if (currentMax < pageCount) {
        // Next Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestUserDeviceList(" + nextPage + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Last Page
        buttonHtml += "  <li>";
        buttonHtml += "    <a href='javascript:requestUserDeviceList(" + (pageCount) + ", " + perPage + ")'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    } else {
        // Next Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
        // Last Page
        buttonHtml += "  <li class='disabled'>";
        buttonHtml += "    <a href='#'>";
        buttonHtml += "      <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span>";
        buttonHtml += "    </a>";
        buttonHtml += "  </li>";
    }

    buttonHtml += "</ul>";

    $(pageButtonsTag).html(buttonHtml);
}



