const HandlerInterceptor = require("./HandlerInterceptor");

class SecondInterceptor extends HandlerInterceptor {

    /**
     * @param {Request} req
     * @param {Response} res
     * @return {boolean}
     */
    preHandle = (req, res) => {
        console.log("SecondInterceptor preHandle() called.")
        return true;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @return {boolean}
     */
    postHandle = (req, res) => {
        console.log("SecondInterceptor postHandle() called.")
    }

}

module.exports = SecondInterceptor;