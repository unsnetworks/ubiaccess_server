const MemorySessionStore = require("./MemorySessionStore");
const SessionStore = require("./SessionStore");

class SessionStoreRegister {

    /**
     * @type {SessionStore}
     */
    #sessionStore;

    constructor() {
        this.#sessionStore = new MemorySessionStore();
    }

    /**
     * @param {SessionStore} store
     * @return {SessionStoreRegister}
     */
    setStore = (store) => {
        if (!(store instanceof SessionStore)) throw new Error("Must use the SessionStore.");
        this.#sessionStore = store;

        return this;
    }

    /**
     * @return {SessionStore}
     */
    getStore = () => this.#sessionStore;

    /**
     * @param {number} expireTime
     * @return {SessionFactory}
     */
    setExpireTime = (expireTime) => {
        SessionStore.expireTime = expireTime;

        return this;
    }

}

module.exports = SessionStoreRegister;