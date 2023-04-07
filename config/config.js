/*
 * Main configuration
 *
 * configuration for server port, database, external interface, passport tokens
 *
 * @author Mike
 */
const SessionStoreRegister = require("../session/SessionStoreRegister");
const RedisSessionStore = require("../session/RedisSessionStore");
const SecondInterceptor = require("../interceptor/SecondInterceptor");
const FirstInterceptor = require("../interceptor/FirstInterceptor");
const ThirdInterceptor = require("../interceptor/ThirdInterceptor");

module.exports = {
	server_port: 3000,                     // server port
    server_ssl_port: 3001,                  // SSL server port
	db: [                                  // database array
        {                                   // #0 test database for MySQL
            name : 'database_mysql',
            type : 'mysql',
            connectionLimit : 10, 
            host     : '127.0.0.1',
            user     : 'root',
            password : 'admin',
            database : 'test',
            debug    :  false,
            stat_database : 'ubiaccess'
        }
    ],
    db_stat: {                              // database for stat logging
        type : 'mysql',
        connectionLimit : 10, 
        host     : '127.0.0.1',
        user     : 'root',
        password : 'admin',
        database : 'ubiaccess',
        debug    :  false
    },
    external: [                             // external interface array
        {                                   // #0 test interface for socket outbound
            name : 'external01',
            protocol : 'socket', 
            direction : 'outbound',
            host     : '127.0.0.1',
            port     : 7001,
            connectionLimit : 10,
            acquireTimeout : 10000,
            connectTimeout : 10000
        },
        {                                   // #1 test interface for socket inbound
            name : 'external02',
            protocol : 'socket', 
            direction : 'inbound',
            port     : 7002
        },
        {                                   // #2 test interface for http outbound
            name : 'external03',
            protocol : 'http', 
            direction : 'outbound',
            host     : '127.0.0.1',
            port     : 7003
        }
    ],
	facebook: {		                          // passport facebook
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {		                           // passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		                            // passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	},
    // redis: {
    //     socket: {
    //         host: "127.0.0.1",
    //         port: 6379,
    //     }
    // },
    /**
     * @param { InterceptorRegister } register
     */
    addInterceptors: (register) => {
        register.addInterceptor(new SecondInterceptor())
            .addPaths("/*")
            .excludePaths("/check")
            .setOrder(1)
        register.addInterceptor(new FirstInterceptor())
            .addPaths("/*")
            // .setOrder(2)
        register.addInterceptor(new ThirdInterceptor())
            .addPaths("/*")
            .setOrder(1)
    },
    /**
     * @param {SessionStoreRegister} register
     * @return {SessionStoreRegister}
     */
    setSessionStore: (register) => {
        // register.setStore(new RedisSessionStore(this.redis))
        //     .setExpireTime(10)

        return register;
    },
}

