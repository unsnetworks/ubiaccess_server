const SessionStore =  require("./SessionStore");
const HttpSession =  require("./HttpSession");
const UUID = require("../util/UUID");

class MemorySessionStore extends SessionStore {

    #map;

    constructor() {
        super();
        this.#map = new Map();
    }


    /**
     * @return { string }
     */
    #createSession = () => {
        const session = new HttpSession();

        let key = UUID.randomUUID();
        let isExits = true;

        while (isExits) {
            isExits = this.#isExists(key);
            if (isExits) key = UUID.randomUUID();
        }

        this.#saveSession(key, session)
        return key;
    }

    /**
     * @param {string} key
     * @return {boolean}
     */
    #isExists = (key) => {
        return this.#map.has(key)
    }

    /**
     * @param { string } key
     * @param { HttpSession } session
     */
    #saveSession = (key, session) => {
        this.#map.set(key, session);
    }

    /**
     * @param { string } key
     * @param { Response } res
     * @param { boolean } status
     * @returns { any[] }
     */
    getSession = (key, res, status = true) => {

        let session;

        if (key) session = this.#map.get(key);

        if (!session && status) {
            key = this.#createSession();
            session = this.#map.get(key);

        } else if (!session && !status) {
            return [null, key];
        }

        return [session, key];

    }

    /**
     * @param { string } key
     */
    removeSession = (key) => {
        this.#map.delete(key);
    }

}

module.exports = MemorySessionStore;