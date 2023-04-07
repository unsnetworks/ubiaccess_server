const HandlerInterceptor = require("./HandlerInterceptor");
const SessionFactory = require("../session/SessionFactory");
const SessionStore = require("../session/SessionStore");


class SessionManagerInterceptor extends HandlerInterceptor {

    /**
     * @type {SessionFactory}
     */
    #sessionFactory;

    /**
     * @param {SessionStore} store
     */
    constructor(store) {
        super();
        this.#sessionFactory = new SessionFactory(store);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @return {boolean}
     */
    preHandle = (req, res) => {
        this.#addSessionGetterMethod(req, res);
        this.#addSessionRemoveMethod(req, res);
        return true;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @return {boolean}
     */
    postHandle = (req, res) => {
    }


    /**
     * @param {Request} req
     * @param {Response} res
     */
    #addSessionGetterMethod = (req, res) => {
        /**
         * @param { boolean } [status=true]
         * @return {HttpSession}
         */
        req.getSession = async (status = true) => {

            let cookieSessionKey;
            if (req.cookies) cookieSessionKey = req.cookies[SessionStore.sessionKey];

            return await this.#sessionFactory.getSession(cookieSessionKey, res, status);
        }
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    #addSessionRemoveMethod = (req, res) => {

        req.removeSession = async () => {

            let cookieSessionKey;
            if (req.cookies) cookieSessionKey = req.cookies[SessionStore.sessionKey];

            if (cookieSessionKey) await this.#sessionFactory.removeSession(cookieSessionKey);
            res.clearCookie(SessionStore.sessionKey);
        }
    }

}

module.exports = SessionManagerInterceptor;