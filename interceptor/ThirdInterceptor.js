const HandlerInterceptor = require("./HandlerInterceptor");

class ThirdInterceptor extends HandlerInterceptor {

    /**
     * @param {Request} req
     * @param {Response} res
     * @return {boolean}
     */
    preHandle = (req, res) => {
        console.log("ThirdInterceptor preHandle() called.")
        return true;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @return {boolean}
     */
    postHandle = (req, res) => {
        console.log("ThirdInterceptor postHandle() called.")
    }

}

module.exports = ThirdInterceptor;