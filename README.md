# **UbiAccess Server**

UbiAccess server is a highly-extensible, open-source Node.js framework with MVC pattern. It enables you to create dynamic end-to-end REST APIs for web front-end and mobile app with little or zero coding in less than 30 seconds. Relational database such as MySQL and Oracle can be accessed with only a few steps.

###  

## **Features**

#### 1. Node.js based framework for Cloud Service

UbiAccess server exploits benefits of Node.js especially for application framework running on cloud. Web developers can use one language and technology for both front-end and back-end development. Mobile developers can also access to this framework with its outstanding performance and without the concerns of concurrency and heavy CPU processing. 

 

#### 2. MVC (Model-View-Controller) Pattern

MVC pattern is prevalent in providing web service. Many Spring developers are good at coding with MVC pattern. UbiAccess server is designed using MVC pattern and any developers accustomed to MVC can make server modules for web and mobile clients quickly.

 

#### 3. Integration Framework for Web and Mobile Service

UbiAccess provides an ideal integration framework for web developers and mobile developers. Leveraging the power of Node.js and high-level database abstractions, UbiAccess can connect together. There is so much to be connected together including inbound and outbound sockets and HTTP requests and responses in this framework.

####  

#### 4. Rapid Development in 1 or 2 Days only

With its simple configuration, UbiAccess server has been crafted with ease of use in mind. Real world web application or application module for mobile apps can be made quickly. For example, tiny application server functions can be made in 1 or 2 days.

 

#### 5. Support for REST, Ajax, RPC & Web Socket APIs

REST API is ready to use and JSON nature of UbiAccess server will make you feel comfortable in developing client apps which connect to this framework. Web developers can use Ajax to connect to this framework and Web Socket is also covered using socket.io library.

 

#### 6. Out-of-the-box Database Access

Relational database such as MySQL and Oracle can be accessed with MVC pattern. UbiAccess Server has several utility functions to handle database query and this makes it simple and powerful. You can extend DAO functions as you want to address requirements of your project.

 

#### 7. Extended to LBS and Medical domain

If you want to make LBS(Location Based Service) applied web service or mobile app, you are able to use spatial databases in existing databases such as MySQL(or MariaDB) or MongoDB. UbiAccess Server shows how to use MySQL and MongoDB as spatial database to make LBS service. There are also extended examples and documentation for medical domain. Mobile EHR or Fhir standard can be extended on this server.



#### 8. Open Source

Open sourced to the world under MIT License. Get involved. Submit an issue/bug on Github.

 



## **Getting started**

1. Quick installation using npm is as follows.

```
npm install ubiaccess_server
```

>  UbiAccess Server requires Node.js 8.x or newer. Node.js 8.9.x LTS is recommended for long-term support from Node.js team.

Then you can change directory to the node_modules/ubiaccess_server.



2. Starting the server

Run node command to get the server started.

```
 node app.js
```



3. Adding your own controller

Now that we started the server, it’s time to add our own controller.

Let’s add a simple ‘Hello world!’ controller as follows:

- Create a new file in /controller called hello.js.

- Paste the following contents into the file:

  ```javascript
  let util = require('../util/util');

  let thisModule = {};

  thisModule.hello = (req, res) => {
      util.sendHtml(res, 'Hello world!');
  };

  module.exports = thisModule;
  ```



-  Update /config/controller_config.js to add the controller:

  ```javascript
  let thisModule = [
      {id:'1', file:'hello', path:'/examples/hello', method:'hello', 
       type:'get', upload:''},
  ```



- Restart the server using ‘npm start’ or ‘node app.js’

>  If your server is still running,press CTRL+C to stop it before restarting it.



- Visit <http://127.0.0.1:3000/examples/hello> in a web browser to see ‘Hello world!’







## **Examples and tutorials**

### **1. Sending request from web browser**

- Create hello.html file in public folder

​       Codes in body tag are as follows.

```html
<body>
        <h1>Hello example</h1>
        <br>
        <div>
           <input type="button" value="Request" onclick="request()" >
        </div>
        <hr>
        <p>Response</p>
        <div id="output"></div>
    </body>
```

​      The web page shows a button. If you click the button, request method is called. 

- Send request using axios

​      Request method needs to be defined in <script> tag.

​      Axios library is used to make a request. Axios request is simple enough to put
only several parameters such as request method, url and requestType.

```javascript
function request() {
  axios({
    method:'get',
    url:'http://localhost:3000/examples/hello',
    responseType:'text'
  }).then(function (response) {
    console.log('Response -> ' + JSON.stringify(response));

    if (response.status == 200) {
      println(response.data);
    }
  }).catch(function (error) {
    println('Error -> ' + JSON.stringify(error));
  });
}
```

​      You can see response if response.status is 200. JQuery and Axios library need to be loaded before used.



```html
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js" 
        integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" 
        crossorigin="anonymous">
</script>

<!-- Axios -->
<script src="https://unpkg.com/axios/dist/axios.min.js">
</script>

```



- Open web page in browser and click [Request] button

​      You can see response data





### 2. Parameter listing and Logging

- Create a new file in /controller called params.js.


- Paste the following contents into the file.

```javascript
let util = require('../util/util');
let logger = require('../logger');

var thisModule = {};

thisModule.params = (req, res) => {
    logger.debug('params:params controller called.');

    const params = req.query;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    util.sendHtml(res, 'PARAMS -> ' + JSON.stringify(params));
};

module.exports = thisModule;
```



- Update /config/controller_config.js to add the controller:

```javascript
let thisModule = [
    {id:'2', file:'params', path:'/examples/params', method:'params', 
     type:'get', upload:''},
```

 

- Restart the server using ‘node app.js’


- Visit <http://127.0.0.1:3000/examples/params>?id=john in a web browser to see parameter passed to the server.


- Create a file called params.html in public folder and make a request using axios

```javascript
function request() {
  var id = $('#idInput').val();

  axios({
    method:'get',
    url:'http://localhost:3000/examples/params',
    responseType:'text',
    params: {
      id: id
    }
  }).then(function (response) {
    console.log('Response -> ' + JSON.stringify(response));

    if (response.status == 200) {
      println(response.data);
    }
  }).catch(function (error) {
    println('Error -> ' + JSON.stringify(error));
  });
}
```

​      If a user enters id in input box and click request button, a request can be made using the entered value.



- Visit http://localhost:3000/public/params.html in a web browser and click the request button.







### 3. Request using POST method and JSON response parsing

- Create a new file in /controller called json.js.


- Paste the following contents into the file.

```javascript
let util = require('../util/util');
let logger = require('../logger');

let thisModule = {};

thisModule.json = (req, res) => {
    logger.debug('json:json controller called.');

    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    util.sendJson(res, params.requestCode, 200, 'success', 
                  'string', 'PARAMS -> ' + JSON.stringify(params));
};

module.exports = thisModule;
```

  

- Update /config/controller_config.js to add the controller:

```javascript
let thisModule = [
    {id:'3', file:'json', path:'/examples/json', method:'json', 
     type:'post', upload:''},
```

 

- Create a file called params.html in public folder and make a request using axios

​      request method is set to post and responseType is set to json

​      parameters for post method are added using data property.

​      response will be a JSON object.

```javascript
function request() {
  var id = $('#idInput').val();

  axios({
    method:'post',
    url:'http://127.0.0.1:3000/examples/json',
    responseType:'json',
    data: {
      requestCode: 101,
      id: id
    }
  }).then(function (response) {
    console.log('Response -> ' + JSON.stringify(response));

    if (response.status == 200) {
      println('requestCode : ' + response.data.requestCode);
      println('code : ' + response.data.code + ',message : ' + 
               response.data.message);
      println('resultType : ' + response.data.resultType);
      println('result : ' + response.data.result);
    }
  }).catch(function (error) {
    println('Error -> ' + JSON.stringify(error));
  });
}
```



- Visit http://localhost:3000/public/params.html in a web browser and click the request button.







### 4. Configuration for Logging

- Log files are created in log folder and the daily rotated file name is server.

​      logger.js file is in root folder and you can configure logging in it.

​      You can change the name of log file and log level in the logger.js

​      MySQL database is used for storing request parameters and responses.

​      You need to install MySQL and connection parameters are set in the config/config.js file.

​      Change host, port, user and password properties according to your database configuration.

```javascript
    db_stat: {                             
        type : 'mysql',
        connectionLimit : 10, 
        host     : '127.0.0.1',
        port     : 3306, 
        user     : 'root',
        password : 'admin',
        database : 'ubiaccess',
        debug    :  false
    },
```

 



### 5. MySQL Database and DAO

​      Relational databases such as MySQL, Oracle and SQLite are supported.

​      In this section, we will make a controller and DAO functions to read and update database records.

- Load world database

​      You need to load world database which contains information on many nations.



- Add database connection information

​      If you confirmed that world database is loaded in your MySQL database, add database connection information in the config/config.js file as follows.

```javascript
module.exports = {
       ...
	db: [                                   
        {                                    
            name : 'database_mysql',
            type : 'mysql',
            connectionLimit : 10, 
            host     : '127.0.0.1',
            port     : 3306, 
            user     : 'root',
            password : 'admin',
            database : 'world',
            debug    :  false,
            stat_database : 'ubiaccess'
        },
```

​       connection parameters such as host, port, user and password can be different according to your database configuration

 

- Create a DAO file

​      Create a world.js file in database folder.

​      DAO file has functions to manipulate database query and update.

```javascript
let thisModule = {};
let logger = require('../logger');

let sql = {
    readCountry:
        'select \
            name, continent, population, GNP \
         from world.country \
         where \
            name = ?'
};

thisModule.readCountry = (pool, data, callback) => {
	logger.debug('world.readCountry DAO called.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.readCountry, data, callback);
};

module.exports = thisModule;
```

​      world.js is a module and readCountry function is added to the module.exports.

​      A SQL statement is defined in the sql variable and you can use it in the readCountry function.

​      The readCountry SQL has one parameter you can pass it to query name, continent, population and GNP columns from world.country table.

 

- Register the DAO file in database_config.js

​      Once a DAO file created, it needs to be registered in config/database_config.js file.

```javascript
module.exports = [
    {id:'1', database_index:0, name:'world', file:'world'}
];
```

​      information on the DAO file is added to the array.

​      database_index : index of the database connection information in db array in config.js.

 

- Create a controller file

​      Create a world.js file in databasefolder.

​      A controller has routing functions to handle client requests

​      if the client request has POST method,request parameters are in req.body property.

```javascript
thisModule.readCountry = (req, res) => {
    logger.debug('world:readCountry controller called.');

    var params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));
```

​      You can use query method to use DAO method defined in the world.js DAO file. 

​      query method call the DAO method and send response to the client according to the query result.

​      You only need to pass input parameters and several parameters in the values variable.

```javascript
let input = [params.name];

let values = {
  input: input,
  params: params,
  database_type: 'mysql',
  database_name: 'database_mysql',
  database_file: 'world',
  database_module: 'readCountry',
  req: req,
  res: res
}; 

util.query(values);
```



- Register the controller function

​      A controller created for a client request needs to be registered in controller_config.js file.

```javascript
{id:'4', file:'world', path:'/examples/readCountry', method:'readCountry', 
 type:'post', upload:''},
```

 

- Create world.html file in public folder

​      Client request function called getCountry can be created in a web page called world.html.

```javascript
function readCountry() {
  var name = $('#nameInput').val();

  axios({
    method:'post',
    url:'http://127.0.0.1:3000/examples/readCountry',
    responseType:'json',
    data: {
      requestCode: 101,
      name: name
    }
  }).then(function (response) {

```



- Restart the server and open world.html page

​      If you click readCountry button, JSON response containing database query result is printed.





### 6. Column mapping and handling of query results

​      You can use utility functions in DAO file.

​      In case you need to map columns in query results to response properties, you only need to pass additional mapper variable.



- Create a readCountry2 function in /controller/world.js file.

​      Just copy readCountry function and change name of the function.

​      Add mapper variable.

​      The name column will be mapped to name property in response and GNP column to GNP perperty.

```javascript
let mapper = {
  name: 'name',
  GNP: 'GNP'
};
```



- Add the mapper variable to the values variable 

```javascript
let values = {
  input: input,
  mapper: mapper,
  params: params,
  database_type: 'mysql',
  database_name: 'database_mysql',
  database_file: 'world',
  database_module: 'readCountry',
  req: req,
  res: res
}; 
```



- Register readCountry2 controller function inconfig/controller_config.js

```javascript
{id:'5', file:'world', path:'/examples/readCountry2', method:'readCountry2',  type:'post', upload:''},
```



- Open world.html file and click readCountry2 button

​      Only name and GNP columns are printed. Those columns are mapped incontroller.

 



### 7. Direct handling of query results

​      In case you need to handle the query results directly, you can make it return query result.



- Create a readCountry3 function in /controller/world.js file.

​       Just copy readCountry function and change name of the function.

​      Add result flag to the values variable. 

```javascript
let values = {
  input: input,
  result: true,
  params: params,
  database_type: 'mysql',
  database_name: 'database_mysql',
  database_file: 'world',
  database_module: 'readCountry',
  req: req,
  res: res
}; 
```



- Add callback parameter in calling query function

```javascript
util.query(values, (output) => {
  if (output && output.length > 0) {
    output[0].added = 'added value for test';
  }

  util.sendJson(res, params.requestCode, 200, 
                values.database_file + ':' + values.database_module + 
                ' success', 'list', output);
});
```



- Register readCountry3 controller function inconfig/controller_config.js

```javascript
{id:'6', file:'world', path:'/examples/readCountry3', method:'readCountry3',    type:'post', upload:''},
```

 

- Open world.html file and click readCountry3 button

​      added property is added in the controller.

 



### 8. Creating Update Controller

- Add updateCountry DAO function in database/world.js file.


- Add updateCountry controller function in controller/world.js file.


- Register updateCountry controller function inconfig/controller_config.js


- Open world.html file and click updateCountry button.
- See examples for more information.







### 9. Direct handling of update results

- Add updateCountry2 controller function in controller/world.jsfile.


- Register updateCountry2 controller function in config/controller_config.js


- Open world.html file and click updateCountry2 button.
- See examples for more information.







### 10. Query emp table using Oracle Database

- Load emp table to Oracle database.
- Add database connection information to config/config.js file.
- Create employee.js file in database folder and add getEmployee DAO function.
- Register it to the config/database_config.js file.
- Create employee.js file in controller folder.
- Add getEmployee function in employee.js file.
- Register getEmployee function in config/controller_config.js
- Open employee.html file and click getEmployee button.
- See examples for more information.







### 11. Update emp table

- Add updateEmployee employee.js function incontroller/employee.js file.
- Register updateEmployee function in config/controller_config.js
- Open employee.html file and click updateEmployee button.
- See examples for more information.







### 12. File Upload

- Create controller/file.js file and add uploadFile function.
- Register uploadFile controller in config/controller_config.js.
- Create database/memo.js file to execute SQL for inserting a record into test.memotable.
- Register memo DAO file in config/database_config.js
- Create controller/memo.js file and add insertMemo function
- Register insertMemo controller in config/controller_config.js
- Open memo.html and enter texts and select an image file before clicking save button.
- See examples for more information.







## Documentation

- There are additional examples and documentation for this server.


1. Mobile App examples and documentation

2. Socket.IO, RPC examples and documentation

3. LBS(Location Based Service) examples and documentation

4. Medical(EHR) examples and documentation

   ​

- For more information, please feel free to ask. 






## License

Licensed under the MIT License. See [LICENSE](https://github.com/franciscop/server/blob/master/LICENSE) for the full license.





## Author & support

This package was created by Mike and members of U&S Networks Inc. but hopefully developed and maintained by many others.

You can also [sponsor the project](http://unsnetworks.com/sponsor), get your logo in here and some other perks with tons of ♥

