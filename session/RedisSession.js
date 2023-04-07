const HttpSession = require("./HttpSession");

class RedisSession extends HttpSession {

    /**
     * @type { Map<string, any> }
     */
    #map
    #id
    #fun

    constructor(id, map, fun) {
        super();
        this.#map = new Map();
        if (id) this.#id = id;
        if (fun && (typeof fun === "function")) this.#fun = fun;
        if (map) this.#map = map;
    }

    /**
     * @param { string } name
     * @return { any }
     */
    getAttribute = (name) => {
        return this.#map.get(name);
    }

    /**
     * @param { string } name
     * @param { any } attr
     * @return {void}
     */
    setAttribute = async (name, attr) => {
        this.#map.set(name, attr);
        if (this.#fun) await this.#fun(this.#id, this.getAllAttributes());
    }

    /**
     * @return { Map<string, any> }
     */
    getAllAttributes = () => {
        return this.#deepCopyMap(this.#map);
    }

    /**
     * @param {Map<string, any>} map
     * @returns {Map<string, any>}
     */
    #deepCopyMap = (map) => {
        const newMap = new Map();
        map.forEach((value, key) => {
            if (value instanceof Map) newMap.set(key, this.#deepCopyMap(value));
            else if (value instanceof Array) newMap.set(key, [...value]);
            else newMap.set(key, value);
        });
        return newMap;
    }

}

module.exports = RedisSession;