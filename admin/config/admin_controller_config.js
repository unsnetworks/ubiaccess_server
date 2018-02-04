 
/*
 * Configuration for admin controller functions
 * 
 * @author Mike
 */
 
var thisModule = [
    {id:'11001', file:'route_manager', path:'/manager/route', method:'createRoute', type:'post', upload:''},
    {id:'11002', file:'route_manager', path:'/manager/route', method:'searchRoute', type:'get', upload:''},
    {id:'11003', file:'route_manager', path:'/manager/route/:id', method:'updateRoute', type:'put', upload:''},
    {id:'11004', file:'route_manager', path:'/manager/route/:id', method:'deleteRoute', type:'delete', upload:''},
    {id:'11005', file:'route_manager', path:'/manager/routefile', method:'getRouteFile', type:'get', upload:''},
    {id:'11006', file:'route_manager', path:'/manager/routefile', method:'saveRouteFile', type:'post', upload:''},
    {id:'11007', file:'socketio_manager', path:'/manager/socketio', method:'createSocketIO', type:'post', upload:''},
    {id:'11008', file:'socketio_manager', path:'/manager/socketio', method:'searchSocketIO', type:'get', upload:''},
    {id:'11009', file:'socketio_manager', path:'/manager/socketio/:id', method:'updateSocketIO', type:'put', upload:''},
    {id:'11010', file:'socketio_manager', path:'/manager/socketio/:id', method:'deleteSocketIO', type:'delete', upload:''},
    {id:'11011', file:'socketio_manager', path:'/manager/socketiofile', method:'getSocketIOFile', type:'get', upload:''},
    {id:'11012', file:'socketio_manager', path:'/manager/socketiofile', method:'saveSocketIOFile', type:'post', upload:''},
    {id:'11013', file:'database_manager', path:'/manager/database', method:'createDatabase', type:'post', upload:''},
    {id:'11014', file:'database_manager', path:'/manager/database', method:'searchDatabase', type:'get', upload:''},
    {id:'11015', file:'database_manager', path:'/manager/database/:id', method:'updateDatabase', type:'put', upload:''},
    {id:'11016', file:'database_manager', path:'/manager/database/:id', method:'deleteDatabase', type:'delete', upload:''},
    {id:'11017', file:'database_manager', path:'/manager/dbfile', method:'getDatabaseFile', type:'get', upload:''},
    {id:'11018', file:'database_manager', path:'/manager/dbfile', method:'saveDatabaseFile', type:'post', upload:''},
    {id:'11019', file:'config_manager', path:'/manager/configfile', method:'getConfigFile', type:'get', upload:''},
    {id:'11020', file:'config_manager', path:'/manager/configfile', method:'saveConfigFile', type:'post', upload:''},
    {id:'11021', file:'config_manager', path:'/manager/viewfilelist', method:'getViewFileList', type:'get', upload:''},
    {id:'11022', file:'config_manager', path:'/manager/viewfile', method:'getViewFile', type:'get', upload:''},
    {id:'11023', file:'config_manager', path:'/manager/viewfile', method:'saveViewFile', type:'post', upload:''},
    {id:'11024', file:'log_manager', path:'/manager/logfile', method:'getLogFile', type:'get', upload:''},
    {id:'11025', file:'stat_route_manager', path:'/manager/statroute', method:'searchStatRoute', type:'get', upload:''},
    {id:'11026', file:'stat_socketio_manager', path:'/manager/statsocketio', method:'searchStatSocketIO', type:'get', upload:''},
    {id:'11027', file:'device_manager', path:'/manager/device', method:'createDevice', type:'post', upload:''},
    {id:'11028', file:'device_manager', path:'/manager/device/:id', method:'readDevice', type:'get', upload:''},
    {id:'11029', file:'device_manager', path:'/manager/device', method:'searchDevice', type:'get', upload:''},
    {id:'11030', file:'device_manager', path:'/manager/device/:id', method:'updateDevice', type:'put', upload:''},
    {id:'11031', file:'device_manager', path:'/manager/device/:id', method:'deleteDevice', type:'delete', upload:''},
    {id:'11032', file:'device_manager', path:'/manager/deviceuser', method:'createDeviceUser', type:'post', upload:''},
    {id:'11033', file:'device_manager', path:'/manager/deviceuser/:id', method:'readDeviceUser', type:'get', upload:''},
    {id:'11034', file:'device_manager', path:'/manager/deviceuser', method:'searchDeviceUser', type:'get', upload:''},
    {id:'11035', file:'device_manager', path:'/manager/deviceuser/:id', method:'updateDeviceUser', type:'put', upload:''},
    {id:'11036', file:'device_manager', path:'/manager/deviceuser/:id', method:'deleteDeviceUser', type:'delete', upload:''},
    {id:'11037', file:'user_manager', path:'/manager/user', method:'createUser', type:'post', upload:''},
    {id:'11038', file:'user_manager', path:'/manager/user/:id', method:'readUser', type:'get', upload:''},
    {id:'11039', file:'user_manager', path:'/manager/user', method:'searchUser', type:'get', upload:''},
    {id:'11040', file:'user_manager', path:'/manager/user/:id', method:'updateUser', type:'put', upload:''},
    {id:'11041', file:'user_manager', path:'/manager/user/:id', method:'deleteUser', type:'delete', upload:''},
    {id:'11042', file:'database_manager', path:'/manager/dbtest', method:'testDatabase', type:'post', upload:''},
    {id:'11043', file:'monitor', path:'/monitor/ping_database', method:'pingDatabase', type:'get', upload:''}
];
 
thisModule.baseDir = 'controller';
 
 
module.exports = thisModule;
 