const SessionStore = require("./SessionStore");
const HttpSession = require("./HttpSession");
const redis = require("redis");
const UUID = require("../util/UUID");
const RedisSession = require("./RedisSession");

class RedisSessionStore extends SessionStore {

    #client;
    static #instance;

    /**
     * @param {Object} option
     */
    constructor(option) {
        super();

        if (!RedisSessionStore.#instance) {
            RedisSessionStore.#instance = this;

            this.#client = redis.createClient(option);

            this.#client.on("connect", () => {
                console.log("Redis Client Connected!")
            });

            this.#client.on("error", (err) => {
                console.error("RedisSessionFactory Client Connect Error." + err)
            });

            this.#client.connect().then();
        }

        return RedisSessionStore.#instance;
    }

    /**
     * @return { string }
     */
    #createSession = async () => {
        const session = new HttpSession();

        let key = UUID.randomUUID();
        let isExits = true;

        while (isExits) {
            isExits = await this.#isExists(key);
            if (isExits) key = UUID.randomUUID();
        }

        const allAttr = session.getAllAttributes();
        await this.#saveSession(key, allAttr);

        return key;
    }

    /**
     * @param {string} key
     * @return {Promise<boolean>}
     */
    #isExists = async (key) => {
        return await this.#client.exists(key);
    }

    /**
     * @param { string } key
     * @param { Map } sessionAttr
     */
    #saveSession = async (key, sessionAttr) => {

        const s = JSON.stringify([...sessionAttr]);

        console.log(s)

        await this.#client.multi()
            .set(key, s)
            .expire(key, SessionStore.expireTime)
            .exec();
    }

    /**
     * @param { string } key
     * @param { Response } res
     * @param { boolean } status
     * @returns { Promise<any[]> }
     */
    getSession = async (key, res, status) => {
        let obj;

        if (key) obj = await this.#client.get(key, (err) => {
                console.error("RedisSessionFactory getAttribute error: " + err)
            });

        if (!obj && status) {
            key = await this.#createSession();
            obj = await this.#client.get(key, (err) => {
                console.error("RedisSessionFactory getAttribute error: " + err)
            });
        } else if (!obj && !status) {
            return [null, key];
        }

        await this.#client.multi()
            .expire(key, SessionStore.expireTime)
            .exec();

        obj = JSON.parse(obj);
        const map = new Map(obj.map(([mapKey, mapValue]) => [mapKey, mapValue]));

        return [new RedisSession(key, map, this.#saveSession), key];
    }

    /**
     * @param { string } key
     */
    removeSession = async (key) => {
        const isExists = await this.#isExists(key);
        if (isExists) this.#client.del(key, (err) => {
            console.error("RedisSessionFactory removeSession error: " + err)
        });
    }

}

module.exports = RedisSessionStore;