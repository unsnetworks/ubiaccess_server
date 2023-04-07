const HandlerInterceptor = require("./HandlerInterceptor");

class InterceptorRegistryInfo {

    /**
     * @type {HandlerInterceptor}
     */
    #interceptor;
    /**
     * @type {number}
     */
    #order;
    /**
     * @type {string[]}
     */
    #paths;
    /**
     * @type {string[]}
     */
    #excludePaths;

    /**
     * @param {HandlerInterceptor} interceptor
     */
    constructor(interceptor) {
        if (!(interceptor instanceof HandlerInterceptor)) throw new Error("must be use HandlerInterceptor");
        this.#interceptor = interceptor;
        this.#paths = ["/*"];
        this.#excludePaths = [];
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {function[]} resCallbacks
     * @return {Promise<boolean>}
     */
    intercept = async (req, res, resCallbacks) => {
        const b = await this.#interceptor.preHandle(req, res);

        resCallbacks.push(this.#interceptor.postHandle)
        return b;
    }

    /**
     * @param {number} order
     * @return {InterceptorRegistryInfo}
     */
    setOrder = (order) => {
        this.#order = order;
        return this;
    }

    /**
     * @return {number}
     */
    getOrder = () => this.#order;

    /**
     * @param {...string} paths
     * @return {InterceptorRegistryInfo}
     */
    addPaths = (...paths) => {
        if (paths.length === 1 && Array.isArray(paths[0])) paths = paths[0];
        this.#paths = paths;
        return this;
    }

    /**
     * @param {...string} paths
     * @return {InterceptorRegistryInfo}
     */
    excludePaths = (...paths) => {
        if (paths.length === 1 && Array.isArray(paths[0])) paths = paths[0];
        this.#excludePaths = paths;
        return this;
    }

    /**
     * @param {string} url
     * @return {Promise<boolean>}
     */
    support = async (url) => {
        if (url.endsWith("/")) url = url.slice(0, -1);

        const queryStringIndex = url.indexOf('?'); // 쿼리스트링 시작 인덱스 찾기

        // 쿼리스트링이 있는 경우
        if (queryStringIndex !== -1) url = url.substring(0, queryStringIndex); // 쿼리스트링을 제외한 경로 추출

        const first = this.#excludePaths.some(path => path === "/*" || path === url || url + "/*" === path || (path.length < url.length && path.endsWith("/*") && url.startsWith(path.slice(0, -1))));

        if (first) return false;

        return this.#paths.some(path => path === "/*" || path === url || url + "/*" === path || (path.length < url.length && path.endsWith("/*") && url.startsWith(path.slice(0, -1))));
    }

}

module.exports = InterceptorRegistryInfo;