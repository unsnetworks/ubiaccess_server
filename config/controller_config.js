 
/*
 * Configuration for controller functions
 * 
 * @author Mike
 */
 
var thisModule = [
    {id:'1', file:'hello', path:'/examples/hello', method:'hello', type:'get', upload:''},
    {id:'2', file:'params', path:'/examples/params', method:'params', type:'get', upload:''},
    {id:'3', file:'json', path:'/examples/json', method:'json', type:'post', upload:''},
    {id:'4', file:'world', path:'/examples/readCountry', method:'readCountry', type:'post', upload:''},
    {id:'5', file:'world', path:'/examples/readCountry2', method:'readCountry2', type:'post', upload:''},
    {id:'6', file:'world', path:'/examples/readCountry3', method:'readCountry3', type:'post', upload:''},
    {id:'7', file:'world', path:'/examples/updateCountry', method:'updateCountry', type:'post', upload:''},
    {id:'8', file:'world', path:'/examples/updateCountry2', method:'updateCountry2', type:'post', upload:''},
    {id:'9', file:'employee', path:'/examples/getEmployee', method:'getEmployee', type:'post', upload:''},
    {id:'10', file:'employee', path:'/examples/updateEmployee', method:'updateEmployee', type:'post', upload:''},
    {id:'11', file:'memo', path:'/examples/insertMemo', method:'insertMemo', type:'post', upload:'photo'},
    {id:'12', file:'file', path:'/examples/uploadFile', method:'uploadFile', type:'post', upload:'photo'},
    {id:'101', file:'memphis_mci', path:'/memphis/inpatient_list', method:'inpatient_list', type:'post', upload:''},
    {id:'102', file:'memphis_mci', path:'/memphis/inpatient_list2', method:'inpatient_list2', type:'post', upload:''},
    {id:'103', file:'memphis_mci', path:'/memphis/inpatient_list3', method:'inpatient_list3', type:'post', upload:''}
];
 
thisModule.baseDir = 'controller';
 
 
module.exports = thisModule;
 