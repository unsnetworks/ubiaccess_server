const SessionStore = require("./SessionStore");
const MemorySessionStore = require("./MemorySessionStore");
const SessionStoreRegister = require("./SessionStoreRegister");

class SessionFactory {

    /**
     @type { SessionStore }
     */
    #sessionStore;

    /**
     * @param {SessionStoreRegister} register
     */
    constructor(register) {
        this.#sessionStore = register.getStore();
    }

    /**
     * @param { string } key
     * @param { Response } res
     * @param { boolean } status
     * @returns { HttpSession }
     */
    getSession = async (key, res, status) => {
        const [httpSession, returnKey] = await this.#sessionStore.getSession(key, res, status);
        if (httpSession) res.cookie(SessionStore.sessionKey, returnKey, {
            httpOnly: true,
            maxAge: SessionStore.expireTime * 1000
        });
        else {
            res.clearCookie(SessionStore.sessionKey);
            if (returnKey) await this.#sessionStore.removeSession(returnKey);
        }

        return httpSession;
    }

    /**
     * @param { string } key
     */
    removeSession = async (key) => {
        return await this.#sessionStore.removeSession(key);
    }

}

module.exports = SessionFactory;