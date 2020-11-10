const Util = require("./Util");

class YouTube {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
    }

    /**
     * Search
     * @param {string} query Search youtube
     * @param {object} options Search options
     * @param {number} [options.limit=20] Limit
     * @param {"video"|"channel"|"playlist"|"all"} options.type="video" Type
     * @param {RequestInit} [options.requestOptions] Request options
     */
    static async search(query, options = { limit: 20, type: "video", requestOptions: {} }) {
        if (!query || typeof query !== "string") throw new Error(`Invalid search query "${query}"!`);
        const url = `https://youtube.com/results?q=${query.trim().split(" ").join("+")}`;
        const html = await Util.getHTML(url, options.requestOptions);
        return Util.parseSearchResult(html, options);
    }

    /**
     * Search one
     * @param {string} query Search query
     * @param {"video"|"channel"|"playlist"|"all"} type="video" Search type
     * @param {RequestInit} requestOptions Request options
     */
    static searchOne(query, type = "video", requestOptions = {}) {
        return new Promise((resolve) => {
            YouTube.search(query, { limit: 1, type: type, requestOptions: requestOptions })
                .then(res => {
                    if (!res || !res.length) return resolve(null);
                    resolve(res[0]);
                })
                .catch(e => {
                    resolve(null);
                });
        });
    }

    /**
     * Returns playlist details
     * @param {string} url Playlist URL
     * @param {object} [options] Options
     * @param {number} [options.limit=100] Playlist video limit
     * @param {RequestInit} [options.requestOptions] Request Options
     */
    static async getPlaylist(url, options = { limit: 100, requestOptions: {} }) {
        if (!url || typeof url !== "string") throw new Error(`Expected playlist url, received ${typeof url}!`);
        Util.validatePlaylist(url);
        url = Util.getPlaylistURL(url);
        const html = await Util.getHTML(url, options && options.requestOptions);
        return Util.getPlaylist(html, options && options.limit);
    }

    /**
     * Returns package version
     */
    static get version() {
        return require("../package.json").version;
    }

}

module.exports = YouTube;