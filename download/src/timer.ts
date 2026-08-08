// download/src/timer.ts

class Timer {
    private startTime: number;
    private endTimer: number;
    PREFIXLOG: string = '[timer]';
    constructor(_t: number) {
        /**
         * @param _t: time is seconds
         */
        this.startTime = Date.now();
        this.endTimer = this.startTime + _t;
    };

    getTimer(): boolean {
        // Here is we get the time and keeping track of timer.
        // Goal of method is to get the current state on a given range of times.
        // Simple nead to stop the main loop and starting his again.
        const logT = `${this.PREFIXLOG}[${this.getTimer.name}]`;
        try {
            let nowTime=Date.now();
            while (this.endTimer >= nowTime) {
                nowTime = Date.now();
                console.log("time left: ", String(this.endTimer - nowTime));
            };
        } catch (err) {
            if (err instanceof Error) {
                console.error(`${logT} Error in timer function: ${err.message}`);
                return false;
            };
        }
        return true;
    };
}

export { Timer };
