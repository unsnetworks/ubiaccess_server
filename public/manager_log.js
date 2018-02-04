var logEditor;

function logInfo() {
    logInitCodeEditor();
}

function logInitCodeEditor() {
    var codeTextArea = document.getElementById('logCodeString');

    logEditor = CodeMirror.fromTextArea(codeTextArea, {
        mode: "javascript",
        lineNumbers: true,
        selectionPointer: true,
        styleActiveLine: true
    });

    $('.form_date').datetimepicker({
        language: 'ko',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });
    $('.form_time').datetimepicker({
        language: 'ko',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 1,
        minView: 0,
        maxView: 1,
        forceParse: 0,
        minuteStep: 1
    });

}


function doGetLogFile() {
    console.log('doGetViewFile 호출됨.');

    var filename = $('#logFileSelect').val();
    var fileDate = $('#fileDateInput').val();
    var beginTime = $('#beginTimeInput').val();
    var endTime = $('#endTimeInput').val();

    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;
    params += '&fileDate=' + fileDate;
    params += '&beginTime=' + beginTime + ':00';
    params += '&endTime=' + endTime + ':00';


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var ajaxGetFilePath = '/manager/logfile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('logfile에 대한 응답을 받았음.');

            var dataObj = JSON.parse(data);
            var decodedResult = Base64.decode(dataObj.result);
            showLogFile(decodedResult);

        },
        error: function (err) {
            console.log('에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}

function showLogFile(result) {
    //editor.setOption("mode", "xml");
    logEditor.setOption("mode", "application/x-ejs");
    logEditor.setValue(result);

    var lineCount = logEditor.lineCount() - 1;
    $('#lineCount').text(lineCount + ' lines');
}

function doClear() {
    //editor.setOption("mode", "xml");
    logEditor.setOption("mode", "application/x-ejs");
    logEditor.setValue('');

    var lineCount = logEditor.lineCount() - 1;
    $('#lineCount').text(lineCount + ' lines');
}


function println(data) {
    $('#results').html('<p>' + data + '</p>');
}