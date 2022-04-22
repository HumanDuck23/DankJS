import axios, { AxiosResponse } from "axios"
import { Logger } from "./Logger"

/**
 * Class that contains methods used all the time relating to http requests to the discord api
 */
export class HttpUtils {
    static apiVersion: string = "9"
    static apiUrl: string = "https://discord.com/api/v" + this.apiVersion
    static token: string = ""

    /**
     * Set the token
     * @param {string} token
     */
    static setToken(token: string) {
        this.token = token
    }

    /**
     * Send a get request to the discord api
     * @param {string} endpoint - The endpoint to send the request to
     * @param {object} [headers] - The headers to send with the request (optional)
     * @param {boolean} auth - Whether to send the token with the request
     * @returns {Promise<AxiosResponse>}
     */
    static GET(endpoint: string, headers?: object, auth: boolean = true): Promise<AxiosResponse> {
        if (this.token === "" && auth) {
            Logger.error("No token set")
            return new Promise<AxiosResponse>(resolve => {
                resolve({ data: "", status: -1, statusText: "No token", config: {}, headers: {} })
            })
        } else {
            return new Promise<AxiosResponse>(resolve => {
                if (auth) {
                    headers = {
                        ...headers,
                        Authorization: this.token,
                        "content-type": "application/json",
                        "connection": "keep-alive",
                        "accept-encoding": "gzip, deflate, br",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
                    }
                }
                axios.get(`${this.apiUrl}${endpoint}`, {
                    headers: { ...headers }
                })
                    .then(resolve)
                    .catch(err => {
                        Logger.error(`HttpUtils.GET: ${endpoint} ${err}`)
                    })
            })
        }
    }

    /**
     * Send a post request to the discord api
     * @param {string} endpoint - The endpoint to send the request to
     * @param {object} data - The data to send with the request
     * @param {object} [headers] - The headers to send with the request (optional)
     * @returns {Promise<AxiosResponse>}
     */
    static POST(endpoint: string, data: object, headers?: object): Promise<AxiosResponse> {
        if (this.token === "") {
            Logger.error("No token set")
            return new Promise<AxiosResponse>(resolve => {
                resolve({ data: "", status: -1, statusText: "No token", config: {}, headers: {} })
            })
        } else {
            return new Promise<AxiosResponse>(resolve => {
                axios.post(`${this.apiUrl}${endpoint}`, data, {
                    headers: {
                        ...headers,
                        Authorization: this.token,
                        "content-type": "application/json",
                        "connection": "keep-alive",
                        "accept-encoding": "gzip, deflate, br",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
                    }
                })
                    .then(resolve)
                    .catch(err => {
                        Logger.error(`HttpUtils.POST: ${endpoint} ${err}`)
                    })
            })
        }
    }
}