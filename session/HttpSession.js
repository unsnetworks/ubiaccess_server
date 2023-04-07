class HttpSession {

    /**
     * @type { Map<string, any> }
     */
    #map
    #id

    constructor(id, map) {
        this.#map = new Map();
        if (id) this.#id = id;
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
     * @return { void}
     */
    setAttribute = (name, attr) => {
        this.#map.set(name, attr);
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

module.exports = HttpSession;