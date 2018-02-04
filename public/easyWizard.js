function form_wizard_Info(){
	$("#myModal").wizard({
		onfinish: function () {
			console.log("Hola mundo");
		}
	});
}


$.fn.wizard = function(config) {
	FormdoAdd();
	if (!config) {
    //config = {};
  };
  var containerSelector = config.containerSelector || ".wizard-content";
  var stepSelector = config.stepSelector || ".wizard-step";
  var steps = $(this).find(containerSelector+" "+stepSelector);
  var stepCount = steps.size();
  //var exitText = config.exit || 'Salir';
  var backText = config.back || '이전';
  var nextText = config.next || '다음';
  var finishText = config.finish || '저장';
  var isModal = config.isModal || true;
  var validateNext = config.validateNext || function(){return true;};
  var validateFinish = config.validateFinish || function(){return true;};
    //////////////////////
	
    var step = 1;
    var container = $(this).find(containerSelector);
    steps.hide();
    $(steps[0]).show();
    if (isModal) {
      $(this).on('hidden.bs.modal', function () {
        step = 1;
        $($(containerSelector+" .wizard-steps-panel .step-number")
          .removeClass("done")
          .removeClass("doing")[0])
        .toggleClass("doing");
        
        $($(containerSelector+" .wizard-step")
          .hide()[0])
        .show();

        btnBack.hide();
        //btnExit.show();
        btnFinish.hide();
        btnNext.show();

      });
    };
    $(this).find(".wizard-steps-panel").remove();
    container.prepend('<div class="wizard-steps-panel steps-quantity-'+ stepCount +'"></div>');
    var stepsPanel = $(this).find(".wizard-steps-panel");
    for(s=1;s<=stepCount;s++){
      stepsPanel.append('<div class="step-number step-'+ s +'"><div class="number">'+ s +'</div></div>');
    }
    $(this).find(".wizard-steps-panel .step-"+step).toggleClass("doing");
    //////////////////////
    /*var contentForModal = "";
    if(isModal){
      contentForModal = ' data-dismiss="modal"';
    }*/
    var btns = "";
    /*btns += '<button type="button" class="btn btn-default wizard-button-exit"'+contentForModal+'>'+ exitText +'</button>';*/
    btns += '<button type="button" id="btnBack" class="btn btn-default wizard-button-back">'+ backText +'</button>';
    btns += '<button type="button" class="btn btn-default wizard-button-next">'+ nextText +'</button>';
    btns += '<button type="button" id="editDialogSaveButton" class="btn btn-primary wizard-button-finish">'+ finishText +'</button>';
    $(this).find(".wizard-buttons").html("");
    $(this).find(".wizard-buttons").append(btns);
    //var btnExit = $(this).find(".wizard-button-exit");
    var btnBack = $(this).find(".wizard-button-back");
    var btnFinish = $(this).find(".wizard-button-finish");
    var btnNext = $(this).find(".wizard-button-next");

    btnNext.on("click", function () {
      if(!validateNext(step, steps[step-1])){
        return;
      };
      $(container).find(".wizard-steps-panel .step-"+step).toggleClass("doing").toggleClass("done");
      step++;
      steps.hide();
      $(steps[step-1]).show();
      $(container).find(".wizard-steps-panel .step-"+step).toggleClass("doing");
      if(step==stepCount){
        btnFinish.show();
        btnNext.hide();
      }
      //btnExit.hide();
      btnBack.show();
    });

    btnBack.on("click", function () {
      $(container).find(".wizard-steps-panel .step-"+step).toggleClass("doing");
      step--;
      steps.hide();
      $(steps[step-1]).show();
      $(container).find(".wizard-steps-panel .step-"+step).toggleClass("doing").toggleClass("done");
      if(step==1){
        btnBack.hide();
        //btnExit.show();
      }
      btnFinish.hide();
      btnNext.show();
    });

    btnFinish.on("click", function () {
      if(!validateFinish(step, steps[step-1])){
        return;
      }
      if(!!config.onfinish){
		console.log(columnNames.join());
        FormdoModalAddSave(columnNames.join(),DBcolumnNames.join());
      }
    });

    btnBack.hide();
    btnFinish.hide();
    return this;
  };


function FormdoAdd(){
	
	console.log('FormdoAdd 호출됨');
	
	var ajaxBaseUrl = 'http://localhost:3000';
	
	var DBcolumnNames = ['id', 'database_index', 'name', 'file'];
    var DBcolumnAliases = ['#', '데이터베이스', '이름', '파일'];
	var DBaddPath = '/manager/database';
	
	var columnNames = ['id', 'file', 'path', 'method', 'type', 'upload'];
    var columnAliases = ['#', '파일', '패스', '메소드', '유형', '업로드'];
	var addPath = '/manager/route';
	
	FormdoAddRow(ajaxBaseUrl,addPath,columnNames,columnAliases,DBaddPath,DBcolumnNames,DBcolumnAliases);
}


function doSaveFormFile() {
    console.log('doSaveFormFile 호출됨.');

    var filename = $('#dialog-input-1').val();
    var filename1 = $('#dialog-input-9').val();
	var method = $('#dialog-input-3').val();
	
    console.log(filename);
    if (filename.length < 1) {

        console.log('test');

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

    var params = 'requestCode=' + requestCode;
    params += '&filename=' + filename;
	params += '&filename1=' + filename1;
	params += '&method=' + method;

    console.log(params);

    /* var DBparams = 'requestCode=' + requestCode;
     DBparams += '&filename=' + filename1;
     DBparams += '&contents=' + compressed1;*/


    var ajaxBaseUrl = 'http://localhost:3000';
    //var ajaxBaseUrl = 'http://192.168.0.5:3000';

    var ajaxType = 'post';

    var ajaxGetFilePath = '/manager/form_wizardfile';


    $.ajax({
        url: ajaxBaseUrl + ajaxGetFilePath,
        type: ajaxType,
        data: params,
        //processData: true,
        success: function (data) {
            console.log('form_wizardfile 저장에 대한 응답을 받았음.');

            console.log(data);

            formshowModifyResultDialog(filename,filename1);
        },
        error: function (err) {
            console.log('from wizard route 에러가 발생함.');
            console.dir(err);

            showErrorDialog(err.status, err.statusText);
        }
    });
}



