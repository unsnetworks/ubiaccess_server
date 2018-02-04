
/*
 * Configuration for JSON-RPC handler
 * 
 */
 
var thisModule = [
    {file:'user', func:'searchUser', method:'searchUser'},  // searchUser  
	{file:'user', func:'createUser', method:'createUser'},  // createUser 
    {file:'user', func:'updateUser', method:'updateUser'},  // updateUser  
    {file:'user', func:'deleteUser', method:'deleteUser'}   // deleteUser  
];

thisModule.baseDir = 'rpc';
thisModule.jsonrpc_api_path = '/api';

module.exports = thisModule;

