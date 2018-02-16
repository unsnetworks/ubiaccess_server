var deviceEditor;



function deviceInfo() {

    // initialize data table
    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'get';

    var listPath = '/manager/device';
    var addPath = '/manager/device';
    var modifyPath = '/manager/device';
    var deletePath = '/manager/device';

    var columnNames = ['id', 'name', 'group_id', 'mac', 'mobile', 'osversion', 'manufacturer', 'model', 'display', 'access', 'permission', 'create_date'];
    var columnAliases = ['#', '이름', '그룹ID', 'MAC', '전화', 'OS', '제조사', '모델', '화면', '용도', '접근', '생성일시'];

    var columnDefs = [{
        "targets": [0, 4, 5],
        "orderable": false
                }];

    var aoColumns = [
        {
            "sWidth": "5%"
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
            "sWidth": "10%"
        },
        {
            "sWidth": "5%"
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
            "sWidth": "10%"
        },
        {
            "sWidth": "10%"
        },
        {
            "sWidth": "20%"
        },
        {
            "sWidth": "20%"
        }
                ];

    var showModifyButton = true;
    var showDeleteButton = true;

    var itemIcon = 'device.png';

    if (DeviceTable == 0) {
        initTable('#table4', columnNames, columnAliases, columnDefs, aoColumns, showModifyButton, showDeleteButton, ajaxBaseUrl, ajaxType, listPath, addPath, modifyPath, deletePath, itemIcon);
    } else {
        table1.dataTable().fnClearTable();
        //$('#pageButtons').empty();
        table1.dataTable().fnDestroy();
        initTable('#table4', columnNames, columnAliases, columnDefs, aoColumns, showModifyButton, showDeleteButton, ajaxBaseUrl, ajaxType, listPath, addPath, modifyPath, deletePath, itemIcon);
    }

    // initialize device_user table
    var ajaxBaseUrl2 = 'http://localhost:3000';
    var ajaxType2 = 'get';
    var ajaxPath2 = '/manager/deviceuser';

    var columnNames2 = ['a._id', 'a.device_id', 'a.user_id', 'a.user_name', 'b.emp_type', 'b.emp_charge', 'b.emp_level', 'b.dept_id', 'b.dept_name', 'a.create_date'];
    var columnAliases2 = ['#', '단말ID', '사용자ID', '사용자명', '직종', '직책', '직급', '부서ID', '부서명', '생성일시'];

    var columnDefs2 = [{
        "targets": [0, 4, 5],
        "orderable": false
                }];

    var aoColumns2 = [
        {
            "sWidth": "5%"
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
            "sWidth": "10%"
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
            "sWidth": "10%"
        },
        {
            "sWidth": "20%"
        },
        {
            "sWidth": "20%"
        }
                ];

    var itemIcon2 = 'user.png';

    if (DeviceTable == 0) {
        initTable2('#table5', columnNames2, columnAliases2, columnDefs2, aoColumns2, ajaxBaseUrl2, ajaxType2, ajaxPath2, itemIcon2);
    } else {
        table2.dataTable().fnClearTable();
        //$('#pageButtons').empty();
        table2.dataTable().fnDestroy();
        initTable2('#table5', columnNames2, columnAliases2, columnDefs2, aoColumns2, ajaxBaseUrl2, ajaxType2, ajaxPath2, itemIcon2);
    }


    // initialize user table
    var ajaxBaseUrl3 = 'http://localhost:3000';
    var ajaxType3 = 'get';
    var ajaxPath3 = '/manager/user';

    var columnNames3 = ['_id', 'id', 'name', 'emp_type', 'emp_charge', 'emp_level', 'dept_id', 'dept_name', 'create_date'];
    var columnAliases3 = ['#', '사용자ID', '사용자명', '직종', '직책', '직급', '부서ID', '부서명', '생성일시'];

    var columnDefs3 = [{
        "targets": [0, 3, 4],
        "orderable": false
                }];

    var aoColumns3 = [
        {
            "sWidth": "5%"
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
            "sWidth": "10%"
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
            "sWidth": "20%"
        },
        {
            "sWidth": "20%"
        }
                ];

    var itemIcon3 = 'user3.png';
    if (DeviceTable == 0) {
        initTable3('#table6', columnNames3, columnAliases3, columnDefs3, aoColumns3, ajaxBaseUrl3, ajaxType3, ajaxPath3, itemIcon3);
    } else {
        table3.dataTable().fnClearTable();
        //$('#pageButtons').empty();
        table3.dataTable().fnDestroy();
        initTable3('#table6', columnNames3, columnAliases3, columnDefs3, aoColumns3, ajaxBaseUrl3, ajaxType3, ajaxPath3, itemIcon3);
    }


    // initialize user_device table
    var ajaxBaseUrl4 = 'http://localhost:3000';
    var ajaxType4 = 'get';
    var ajaxPath4 = '/manager/deviceuser';

    var columnNames4 = ['a._id', 'a.device_id', 'a.user_id', 'a.user_name', 'b.emp_type', 'b.emp_charge', 'b.emp_level', 'b.dept_id', 'b.dept_name', 'a.create_date'];
    var columnAliases4 = ['#', '단말ID', '사용자ID', '사용자명', '직종', '직책', '직급', '부서ID', '부서명', '생성일시'];

    var columnDefs4 = [{
        "targets": [0, 4, 5],
        "orderable": false
                }];

    var aoColumns4 = [
        {
            "sWidth": "5%"
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
            "sWidth": "10%"
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
            "sWidth": "10%"
        },
        {
            "sWidth": "20%"
        },
        {
            "sWidth": "20%"
        }
                ];

    var itemIcon4 = 'device3.png';

    if (DeviceTable == 0) {
        initTable4('#table7', columnNames4, columnAliases4, columnDefs4, aoColumns4, ajaxBaseUrl4, ajaxType4, ajaxPath4, itemIcon4);
    } else {
        table4.dataTable().fnClearTable();
        //$('#pageButtons').empty();
        table4.dataTable().fnDestroy();
        initTable4('#table7', columnNames4, columnAliases4, columnDefs4, aoColumns4, ajaxBaseUrl4, ajaxType4, ajaxPath4, itemIcon4);
    }

    DeviceTable = 1;

    deviceinitCodeEditor();

    // show main page
    showPage('mainPage');

}




function doSearchDevice() {
    console.log('doSearchDevice() called.');

    var id = $('#deviceIdInput').val();
    var mac = $('#macInput').val();
    var access = $('#accessInput').val();
    var permission = $('#permissionInput').val();

    var searchParams = '';
    if (id && id.trim().length > 0) {
        searchParams += '&id=' + id;
    }

    if (mac && mac.trim().length > 0) {
        searchParams += '&mac=' + mac;
    }

    if (access && access.trim().length > 0) {
        searchParams += '&access=' + access;
    }

    if (permission && permission.trim().length > 0) {
        searchParams += '&permission=' + permission;
    }

    var curPage = 1;
    var curPerPage = 10;

    if (searchParams.length > 0) {
        requestList(curPage, curPerPage, searchParams);
    } else {
        requestList(curPage, curPerPage);
    }
}


function doSearchUser() {
    console.log('doSearchUser() called.');

    var userId = $('#userIdInput').val();

    var searchParams = '';
    if (userId && userId.trim().length > 0) {
        searchParams += '&id=' + userId;
    }

    var curPage = 1;
    var curPerPage = 10;

    if (searchParams.length > 0) {
        requestList3(curPage, curPerPage, searchParams);
    } else {
        requestList3(curPage, curPerPage);
    }
}


function doAddUserToDevice() {
    console.log('doAddUserToDevice() called.');

    var deviceId = '';
    var userId = '';
    var userName = '';

    var deviceIndex = table1.$('tr.selected').index();
    console.log('device index -> ' + deviceIndex);
    if (deviceIndex < 0) {
        var title = '선택 확인';
        var contents = '단말을 먼저 선택하세요.';

        showConfirmDialog('text', title, contents, null, null, '닫기', function () {
            $.closeConfirmDialog();
        });

        return;
    } else {
        var deviceRow = table1.fnGetData(deviceIndex);
        console.log('device id -> ' + deviceRow[1]);

        deviceId = deviceRow[1];
    }

    var userIndex = table3.$('tr.selected').index();
    console.log('user index -> ' + userIndex);
    if (userIndex < 0) {
        var title = '선택 확인';
        var contents = '사용자를 먼저 선택하세요.';

        showConfirmDialog('text', title, contents, null, null, '닫기', function () {
            $.closeConfirmDialog();
        });

        return;
    } else {
        var userRow = table3.fnGetData(userIndex);
        console.log('user id -> ' + userRow[1] + ', user name -> ' + userRow[2]);

        userId = userRow[1];
        userName = userRow[2];
    }

    requestAddUserToDevice(deviceId, userId, userName, 1, 10);
}


/*
 * 단말 사용자 정보 추가하기
 *
 * Param #1  attrNames    칼럼의 이름 (배열)
 * Param #2  attrValues   칼럼의 값 (배열)
 * Param #3  page         현재 페이지 (1부터 시작)
 * Param #4  perPage      한 페이지 당 아이템 수
 */
function requestAddUserToDevice(deviceId, userId, userName, page, perPage) {
    console.log('requestAddUserToDevice 호출됨 : ' + deviceId + ', ' + userId + ', ' + userName);

    var attrNames = ['device_id', 'user_id', 'user_name'];
    var attrValues = [deviceId, userId, userName];


    var requestCode = generateRequestCode();

    var params = 'requestCode=' + requestCode;
    params += '&columnNames=' + attrNames.join();
    params += '&columnValues=' + attrValues.join();

    console.log('params : ' + params);


    $.ajax({
        url: ajaxBaseUrl2 + ajaxPath2,
        type: 'post',
        data: params,
        headers: {
            'userid': 'admin01'
        },
        success: function (data) {
            console.log('requestAddUserToDevice에 대한 응답을 받았음.');

            $.closeConfirmDialog();

            console.log(data);
            println('아이템 추가 완료.');

            var dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
                var searchParams = '&id=' + deviceId;

                requestDeviceUserList(page, perPage, searchParams);
            } else {
                showErrorDialog(dataObj.code, dataObj.message);
            }
        },
        error: function (err) {
            $.closeConfirmDialog();

            console.log('에러가 발생함.');
            console.dir(err);
            showErrorDialog(err.status, err.statusText);
        }
    });

    showProgressDialog();
}




function doList() {
    var curPage = 1;
    var curPerPage = 10;

    requestList(curPage, curPerPage);
}

function doAdd() {
    console.log('doAdd 호출됨');

    doAddRow(1, 10);
}

function doAddSource() {
    console.log('doAddSource 호출됨');

    showPage('sourcePage');

    $('#file-input').val('');
    editor.setValue('');
}


function showPage(pageName) {
    $('.mainPage').hide();
    $('.sourcePage').hide();

    $('.' + pageName).show();
}


function deviceinitCodeEditor() {
    var codeTextArea = document.getElementById('CodeString');

    editor = CodeMirror.fromTextArea(codeTextArea, {
        mode: "javascript",
        lineNumbers: true,
        selectionPointer: true,
        styleActiveLine: true
    });

}

function println(data) {
    $('#results').html('<p>' + data + '</p>');
}