import { User } from "./User"
import { Embed } from "./Embed"
import { Component } from "./Component"

export interface Message {
    content: string,
    id: string,
    channel_id: string,
    guild_id?: string,
    author: User,
    referenced_message?: Message,
    flags?: number,
    components?: Component[],
    embeds: Embed[]
}