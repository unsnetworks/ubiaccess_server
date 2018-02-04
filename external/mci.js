/*
 * mci processing
 *
 * @author Mike
 */

var mci = {};

var logger = require('../logger');

var uuid = require('node-uuid');
var moment = require('moment');

var app;
var config;
var pool;

// Initialization
mci.init = function(inApp, inConfig, externalConfig, external) {
    logger.debug('mci.init called.');
    
    app = inApp;
    config = inConfig;
    
    var name = externalConfig.name;
    logger.debug('name : ' + name);
    pool = external.pools[name];
    
}
 

// Request send
mci.send = function(params, callback, receiver) {
	logger.debug('mci.send called.');
	
    // create request body
    var request = {};
    request['cfs_sheader_001'] = createSystemHeader(params[0]);
    request['cfs_bheader_s00'] = createBusinessHeader();
    request[params[1]] = createValues(params);    
    
    var requestStr = JSON.stringify(request);
    console.dir(requestStr);
    
    // check length
    var dataLen = requestStr.length;
    var dataLenStr = dataLen.toString();
    for (var i = 0; i < 10; i++) {
        if (dataLenStr.length < 10) {
            dataLenStr = '0' + dataLenStr;
        } else {
            break;
        }	
    }
    var prefix = dataLenStr;
    var output = prefix + requestStr;
 
    sendData(output, callback, receiver);
    
};

function createSystemHeader(interfaceId) {
    var systemHeader = {
        tlgrLngtVl:'',
        uuid:uuid.v1(),
        tlgrPrgrNo:'1',
        tlgrTypeCd:'Q',
        inrfId:interfaceId,
        tlgrRqstDt:moment().format('YYYYMMDDHHmmssSSS') + '000',
        lnkdSystInfmVl:'',
        sesnId:'',
        tlgrRqstSystIp:'119.6.3.92',
        tlgrMediDvsnCd:'MO',
        tlgrRqstSystId:'bm0',
        tlgrTrnmSrvcId:'DRS_100000_1001',
        tlgrTrnmUserId:'MOBILE',
        tlgrRecvSrvcId:'',
        tlgrRecvUserId:'',
        prsgRsltDvsnCd:'',
        filePrsgYn:'',
        syncPrsgDvsnCd:'S',
        ectnYn:'N',
        cmrnYn:'N',
        systEnvrDvsnCd:'D',
        testTlgrYn:'N',
        inrfSttsCd:'',
        wndoHndeId:'',
        dataInfmYn:'',
        tlgrVrsnCeckYn:'',
        rqstTlgrVrsnNo:'',
        rspnTlgrVrsnNo:'',
        cmrnTrgtYn:'',
        systHedrRmrkVl:''
    };
    
    return systemHeader;
}

function createBusinessHeader() {
    var businessHeader = {
        evntTypCd:'',
        hsptCd:'',
        cntrCd:'',
        dprtCd:'',
        natnCd:'ko',
        lnggCd:'KR',
        aftrMtrlExstYn:'',
        mxmmRqstVl:'',
        mesgCd:'',
        mesgCtn:'',
        adddMesgCd:'',
        adddMesgCtn:'',
        errPrgmNm:'',
        errFuncNm:'',
        errLineNo:'',
        errSqlNo:'',
        errTpNo:'',
        errMesgPrsgDvsnCd:'',
        excfCd:'',
        dtlsExcfCd:'',
        mesgMngmDvsnYn:'',
        userId:'MOBILE',
        scryAplyYn:'',
        bswrHedrRmrkVl:''
    };
    
    return businessHeader;
}

function createValues(params) {
    var values = {};
    
    var paramData = params[2];
     
    console.log('paramData -> ' + paramData);
    
    var data = JSON.parse(paramData);
    console.log('DEBUG 2');

    for (var i = 0; i < data.names.length; i++) {
        values[data.names[i]] = data.values[i];
    }
    
    return values;
}


function sendData(output, callback, receiver) {
    // get connection from connection pool
	pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null);
            
            return;
        } 
        
        var curId = uuid.v1();
        conn.id = curId;
        logger.debug('Client connection ID : ' + conn.id);
        
        // data transfer
        console.log('about to send output.');
        conn._socket.write(output);
        callback(null, 'output sent.');
         
        // check connection in Pool
        console.log('all before release : ' + pool._allConnections.length);
        console.log('free before release : ' + pool._freeConnections.length);

    },
    receiver);
    
}



module.exports = mci;
