const InterceptorRegister = require("../interceptor/InterceptorRegister");
const config = require("./config");
const SessionStoreRegister = require("../session/SessionStoreRegister");
const SessionManagerInterceptor = require("../interceptor/SessionManagerInterceptor");

class ConfigLoader {

    /**
     * @type {InterceptorRegister}
     */
    #interceptorRegister;

    constructor() {
        this.#interceptorRegister = new InterceptorRegister();
    }

    /**
     * @param {Express} app
     */
    loadConfig = (app) => {
        this.#loadSessionStore();
        this.#loadInterceptorConfig(app);
    }

    #loadSessionStore = () => {
        let storeRegister = new SessionStoreRegister();
        if (config.setSessionStore) storeRegister = config.setSessionStore(storeRegister);

        this.#interceptorRegister.addInterceptor(new SessionManagerInterceptor(storeRegister))
            .setOrder(0)
            .addPaths("/*");
    }

    /**
     * @param {Express} app
     */
    #loadInterceptorConfig = (app) => {
        if (config.addInterceptors) config.addInterceptors(this.#interceptorRegister);
        this.#interceptorRegister.registerInterceptor(app);
    }

}

module.exports = ConfigLoader;