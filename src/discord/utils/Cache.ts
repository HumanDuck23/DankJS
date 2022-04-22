import * as fs from "fs"

/**
 * Small Cache Class
 */
export class Cache {

    static file: string = "cache.json"

    static get(key: string): any {
        return this.getCache()[key]
    }

    static set(key: string, value: any): void {
        const cache = this.getCache()
        cache[key] = value
        this.setCache(cache)
    }

    static getCache(): any {
        if (!fs.existsSync(this.file)) return {}
        return JSON.parse(fs.readFileSync(this.file, "utf8"))
    }

    static setCache(cache: any): void {
        fs.writeFileSync(this.file, JSON.stringify(cache))
    }

}