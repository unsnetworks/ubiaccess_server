const HandlerInterceptor = require("./HandlerInterceptor");
const InterceptorRegistryInfo = require("./InterceptorRegistryInfo");

class InterceptorRegister {

    /**
     * @type { InterceptorRegistryInfo[] }
     */
    #interceptors;

    constructor() {
        this.#interceptors = [];
    }

    /**
     * @param { HandlerInterceptor } interceptor
     * @return { InterceptorRegistryInfo }
     */
    addInterceptor = (interceptor) => {
        const info = new InterceptorRegistryInfo(interceptor);
        this.#interceptors.push(info);
        return info;
    }

    #sortInterceptors = () => {
        const withOrder = this.#interceptors
            .filter((interceptor) => interceptor.getOrder() !== undefined)
            .sort((f, s) => f.getOrder() - s.getOrder());

        const withoutOrder = this.#interceptors
            .filter((interceptor) => interceptor.getOrder() === undefined);

        this.#interceptors = [...withOrder, ...withoutOrder];
    }

    /**
     * @param { Express } app
     */
    registerInterceptor = (app) => {
        this.#sortInterceptors();
        app.use(this.#launchInterceptor);
    }

    /**
     * @param { Request } req
     * @param { Response } res
     * @param { function } next
     */
    #launchInterceptor = async (req, res, next) => {
        const responseCallback = [];

        let success = true;
        for (let i = 0; i < this.#interceptors.length; i++) {
            const interceptorInfo = this.#interceptors[i];

            const support = await interceptorInfo.support(req.url);
            if (support) success = await interceptorInfo.intercept(req, res, responseCallback);

            if (!success) break;
        }

        if (success) next();

        responseCallback.reverse().forEach(fun => res.on("finish", () => fun(req, res)));
    }

}

module.exports = InterceptorRegister;