/*
 * MCI 처리 모듈
 */


var logger = require('../logger');
var util = require('../util/mci_util');

var thisModule = {};

/*
 * inpatient_list
 *
 * POST http://host:port/memphis/inpatient_list
 */
 
thisModule.inpatient_list = (req, res) => {
	logger.debug('inpatient_list 호출됨.');
    logger.debug('요청 패스 -> /memphis/inpatient_list POST');
 
    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

   
    let input = {
        careWardCd: params.wardId,
        cdVl1: params.deptId,
        cdVl2: params.userId
    };
    
	try {
        
        // mapper object
        let mapper = {
            id: 'ptno',
            name: 'ptntNm',
            gender: 'gendCd',
            age: 'cdVl1',
            location1: 'careWardCd',
            location2: 'carePtrmNo',
            location3: 'careSckbNo',
            admDate: 'mdcrDt',
            doctor1Name: 'userNm1',
            doctor2Name: 'userNm2'
        };
 
        
        let values = {
            req: req,
            res: res,
            params: params,
            input: input,
            mapper: mapper,
            interfaceId: 'mnd_ifsmttg_l08',
            requestId: 'mns_ifsmttg_081',
            inname: 'mnc_ifsmttg_082', 
            outname: 'mns_ifsmttg_082'
        }; 
        
        util.query(values);
        
    } catch(err) {
		sendJson(res, params.requestCode, 400, '/memphis/inpatient_list 라우팅 중 실패', 'error', err);
	}
        
};



/*
 * inpatient_list with no mapper
 *
 * POST http://host:port/memphis/inpatient_list
 */
 
thisModule.inpatient_list2 = (req, res) => {
	logger.debug('inpatient_list2 호출됨.');
    logger.debug('요청 패스 -> /memphis/inpatient_list2 POST');
 
    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

   
    let input = {
        careWardCd: params.wardId,
        cdVl1: params.deptId,
        cdVl2: params.userId
    };
    
	try {
        
        let values = {
            req: req,
            res: res,
            params: params,
            input: input,
            interfaceId: 'mnd_ifsmttg_l08',
            requestId: 'mns_ifsmttg_081',
            inname: 'mnc_ifsmttg_082', 
            outname: 'mns_ifsmttg_082'
        }; 
        
        util.query(values);
        
    } catch(err) {
		sendJson(res, params.requestCode, 400, '/memphis/inpatient_list2 라우팅 중 실패', 'error', err);
	}
        
};



/*
 * inpatient_list3
 *
 * POST http://host:port/memphis/inpatient_list3
 */
 
thisModule.inpatient_list3 = (req, res) => {
	logger.debug('inpatient_list3 호출됨.');
    logger.debug('요청 패스 -> /memphis/inpatient_list3 POST');
 
    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

   
    let input = {
        careWardCd: params.wardId,
        cdVl1: params.deptId,
        cdVl2: params.userId
    };
    
	try {
        
        // mapper object
        let mapper = {
            id: 'ptno',
            name: 'ptntNm',
            gender: 'gendCd',
            age: 'cdVl1',
            location1: 'careWardCd',
            location2: 'carePtrmNo',
            location3: 'careSckbNo',
            admDate: 'mdcrDt',
            doctor1Name: 'userNm1',
            doctor2Name: 'userNm2'
        };
 
        
        let values = {
            req: req,
            res: res,
            params: params,
            input: input,
            mapper: mapper,
            interfaceId: 'mnd_ifsmttg_l08',
            requestId: 'mns_ifsmttg_081',
            inname: 'mnc_ifsmttg_082', 
            outname: 'mns_ifsmttg_082'
        }; 
        
        util.query(values, (output) => {
            if (output && output.length > 0) {
                output[0].added = 'added value for test';
            }

            util.sendResponse(res, params.requestCode, 200, "success", 'string', 'plain/text', 'none', '1.0', output);
        });
        
        
        
    } catch(err) {
		sendJson(res, params.requestCode, 400, '/memphis/inpatient_list3 라우팅 중 실패', 'error', err);
	}
        
};




// module.exports에 할당
module.exports = thisModule;

