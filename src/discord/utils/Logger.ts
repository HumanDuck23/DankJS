import chalk from "chalk"

/**
 * Logger Utilities
 */
export class Logger {

    static infoColor: string = "#498bf5"
    static warnColor: string = "#f5d849"
    static errorColor: string = "#eb6538"
    static debugColor: string = "#8938eb"
    static startupColor: string = "#ebe238"

    /**
     * Log an info message
     * @param message
     */
    static info(message: string) {
        const t = chalk.hex(this.infoColor)(`[${new Date().toISOString().split("T")[1]}] info || ${chalk.white(message)}`)
        console.log(chalk.bold(t))
    }

    /**
     * Log a warning message
     * @param message
     */
    static warn(message: string) {
        const t = chalk.hex(this.warnColor)(`[${new Date().toISOString().split("T")[1]}] warn || ${chalk.white(message)}`)
        console.log(chalk.bold(t))
    }


    /**
     * Log an error message
     * @param message
     */
    static error(message: string) {
        const t = chalk.hex(this.errorColor)(`[${new Date().toISOString().split("T")[1]}] error || ${chalk.white(message)}`)
        console.log(chalk.bold(t))
    }

    /**
     * Log a debug message
     * @param message
     */
    static debug(message: string) {
        const t = chalk.hex(this.debugColor)(`[${new Date().toISOString().split("T")[1]}] debug || ${chalk.white(message)}`)
        console.log(chalk.bold(t))
    }

    /**
     * Log a startup message
     * @param message
     */
    static startup(message: string) {
        const t = chalk.hex(this.startupColor)(`[${new Date().toISOString().split("T")[1]}] startup || ${chalk.white(message)}`)
        console.log(chalk.bold(t))
    }

}