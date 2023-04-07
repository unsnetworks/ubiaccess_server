class SessionStore {

    static sessionKey = "USESSION_ID";
    static expireTime = 1800;

    /**
     * @return { HttpSession }
     */
    #createSession = () => {
        throw new Error("#createSession is not implemented");
    }

    /**
     * @param { HttpSession } session
     */
    #saveSession = (session) => {
        throw new Error("#saveSession is not implemented");
    }

    /**
     * @param { string } key
     * @param { Response } res
     * @param { boolean } status
     * @returns { HttpSession }
     */
    getSession = (key, res, status = true) => {
        throw new Error("getSession is not implemented");
    }

    /**
     * @param { string } key
     */
    removeSession = (key) => {
        throw new Error("removeSession is not implemented");
    }

}

module.exports = SessionStore;