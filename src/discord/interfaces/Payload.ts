import { OpCodes } from "./OpCodes"

export interface Payload {
    op: OpCodes,
    d: any,
    s?: number,
    t?: string
}