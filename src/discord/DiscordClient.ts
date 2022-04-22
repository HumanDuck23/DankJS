import { Cache } from "./utils/Cache"
import { HttpUtils } from "./utils/HttpUtils"
import { WebSocket } from "ws"
import { EventEmitter } from "events"
import { OpCodes } from "./interfaces/OpCodes"
import { Message } from "./interfaces/Message"
import { Logger } from "./utils/Logger"

export class DiscordClient extends EventEmitter {

    socket: WebSocket | null = null

    heartbeat: number = -1
    heartbeatInterval: NodeJS.Timer | null = null

    messageCache: { [key: string]: Message } = {}

    constructor(token: string, private wpm: number = 60) {
        super()
        HttpUtils.setToken(token)
    }

    /**
     * Connect to the Discord gateway
     */
    connect() {
        this.loadGatewayEndpoint()
            .then(ep => {
                const gateway = `${ep}/?v=${HttpUtils.apiVersion}&encoding=json`
                this.socket = new WebSocket(gateway)

                this.socket.on("open", () => {
                    this.emit("socketOpen")
                })
                this.socket.on("close", () => {
                    this.emit("socketClose")
                })
                this.socket.on("message", (message) => {
                    this.handleSocketMessage(JSON.parse(message.toString()))
                })
            })
    }

    /**
     * Load the gateway endpoint to connect to
     * @returns {Promise<any>}
     */
    loadGatewayEndpoint(): Promise<any> {
        return new Promise<any>(resolve => {
            const cached_endpoint = Cache.get("gateway_endpoint")
            if (cached_endpoint) {
                resolve(cached_endpoint)
            } else {
                HttpUtils.GET("/gateway", {}, false)
                    .then(res => {
                        Cache.set("gateway_endpoint", res.data.url)
                        resolve(res.data.url)
                    })
            }
        })
    }

    /**
     * Handles a message from the websocket
     * @param data
     */
    handleSocketMessage(data: any): void {
        switch (data.op) {
            case OpCodes.Heartbeat: // Client needs to send a heartbeat right now
                clearInterval(<NodeJS.Timer>this.heartbeatInterval)
                break

            case OpCodes.Hello:
                this.heartbeat = data.d.heartbeat_interval
                this.startHeartbeat()

                this.identify()
                break

            case OpCodes.Dispatch:
                this.handleMessage(data)
                break

        }
    }

    /**
     * Handles incoming dispatches from the gateway
     * @param {{t: string, d: Message}} message
     */
    handleMessage(message: { t: string, d: Message }): void {
        switch (message.t) {
            case "MESSAGE_CREATE":
                this.getMessage(message.d.id, message.d.channel_id)
                    .then(msg => {
                        // cache messages for 60 seconds (for when they get edited)
                        this.messageCache[msg.id] = msg
                        setTimeout(() => {
                            delete this.messageCache[msg.id]
                        }, 60000)
                        this.emit("messageCreate", msg)
                    })
                break

            case "MESSAGE_UPDATE":
                this.getMessage(message.d.id, message.d.channel_id)
                    .then(msg => {
                        const old = this.messageCache[msg.id]
                        this.emit("messageEdit", msg, old)
                    })
                break

            case "READY":
                this.emit("ready", message.d)
                break
        }
    }

    /**
     * Get a message from the API
     * @param {string} id
     * @param {string} channelID
     * @returns {Promise<Message>}
     */
    getMessage(id: string, channelID: string): Promise<Message> {
        return new Promise<Message>(resolve => {
            HttpUtils.GET(`/channels/${channelID}/messages?limit=1&around=${id}`, {}, true, false)
                .then(res => {
                    resolve(res.data[0])
                })
        })
    }

    /**
     * Start the heartbeat loop
     * Jitter: 0.5
     */
    startHeartbeat(): void {
        if (this.heartbeat > 0) {
            const jitter = Math.random() * 0.5
            setTimeout(() => {
                this.heartbeatInterval = setInterval(() => {
                    this.heartbeatFunc()
                }, this.heartbeat)
            }, this.heartbeat * jitter)

            this.emit("heartbeatStart", [this.heartbeat, jitter])
        }
    }

    /**
     * Send a heartbeat
     */
    heartbeatFunc(): void {
        this.emit("heartbeat")
        this.sendPayload({
            op: 1,
            d: null
        })
    }

    /**
     * Identify the client to the gateway
     */
    identify(): void {
        this.sendPayload({
            op: 2,
            d: {
                token: HttpUtils.token,
                intents: 513,
                properties: {
                    $os: "windows",
                    $browser: "firefox",
                    $device: "firefox"
                }
            }
        })
    }

    /**
     * Calculate nonce
     * @returns {string}
     */
    calculateNonce(): string {
        const unixts = new Date().getTime() / 1000
        return ((unixts * 1000 - 1420070400000) * 4194304).toString()
    }

    /**
     * Send a payload to the gateway
     * @param payload
     */
    sendPayload(payload: any): void {
        this.socket?.send(JSON.stringify(payload))
    }

}