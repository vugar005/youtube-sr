/*
 * MIT License
 *
 * Copyright (c) 2020-present DevAndromeda
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Channel from "./Channel";
import Thumbnail from "./Thumbnail";

class Video {
    id?: string;
    title?: string;
    description?: string;
    durationFormatted: string;
    duration: number;
    uploadedAt?: string;
    views: number;
    thumbnail?: Thumbnail;
    channel?: Channel;
    videos?: Video[];
    likes: number;
    dislikes: number;
    live: boolean;
    private: boolean;
    tags: string[];

    constructor(data: any) {
        if (!data) throw new Error(`Cannot instantiate the ${this.constructor.name} class without data!`);

        this._patch(data);
    }

    /**
     * Patch raw data
     * @private
     * @ignore
     */
    private _patch(data: any): void {
        if (!data) data = {};

        this.id = data.id || null;
        this.title = data.title || null;
        this.description = data.description || null;
        this.durationFormatted = data.duration_raw || "0:00";
        this.duration = (data.duration < 0 ? 0 : data.duration) || 0;
        this.uploadedAt = data.uploadedAt || null;
        this.views = parseInt(data.views) || 0;
        this.thumbnail = new Thumbnail(data.thumbnail || {});
        this.channel = new Channel(data.channel || {});
        this.likes = data.ratings?.likes || 0;
        this.dislikes = data.ratings?.dislikes || 0;
        this.live = !!data.live;
        this.private = !!data.private;
        this.tags = data.tags || [];

        this.videos = data.videos || [];
    }

    get url() {
        if (!this.id) return null;
        return `https://www.youtube.com/watch?v=${this.id}`;
    }

    /**
     * YouTube video embed html
     * @param {object} options Options
     * @param {string} [options.id] DOM element id
     * @param {number} [options.width] Iframe width
     * @param {number} [options.height] Iframe height
     */
    embedHTML(options = { id: "ytplayer", width: 640, height: 360 }): string {
        if (!this.id) return null;
        return `<iframe title="__youtube_sr_frame__" id="${options.id || "ytplayer"}" type="text/html" width="${options.width || 640}" height="${options.height || 360}" src="${this.embedURL}" frameborder="0"></iframe>`;
    }

    /**
     * Creates mix playlist url from this video
     */
    createMixURL() {
        return `${this.url}&list=RD${this.id}`;
    }

    /**
     * YouTube video embed url
     */
    get embedURL(): string {
        if (!this.id) return null;
        return `https://www.youtube.com/embed/${this.id}`;
    }

    get type(): "video" {
        return "video";
    }

    toString(): string {
        return this.url || "";
    }

    toJSON() {
        return {
            id: this.id,
            url: this.url,
            title: this.title,
            description: this.description,
            duration: this.duration,
            duration_formatted: this.durationFormatted,
            uploadedAt: this.uploadedAt,
            thumbnail: this.thumbnail.toJSON(),
            channel: {
                name: this.channel.name,
                id: this.channel.id,
                icon: this.channel.iconURL()
            },
            views: this.views,
            type: this.type,
            tags: this.tags,
            ratings: {
                likes: this.likes,
                dislikes: this.dislikes
            },
            live: this.live,
            private: this.private
        };
    }
}

export default Video;
