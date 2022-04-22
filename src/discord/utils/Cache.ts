import * as fs from "fs"

/**
 * Small Cache Class
 */
export class Cache {

    file: string = "cache.json"

    get(key: string): any {
        return this.getCache()[key]
    }

    set(key: string, value: any): void {
        const cache = this.getCache()
        cache[key] = value
        this.setCache(cache)
    }

    getCache(): any {
        if (!fs.existsSync(this.file)) return {}
        return JSON.parse(fs.readFileSync(this.file, "utf8"))
    }

    setCache(cache: any): void {
        fs.writeFileSync(this.file, JSON.stringify(cache))
    }

}