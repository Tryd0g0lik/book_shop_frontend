// // download/src/timer.ts

// class Timer {
//     private startTime: number;
//     private endTimer: number;
//     // private startTime: number;
//     private durations: number;
//     PREFIXLOG: string = "[timer]";
//     constructor(_t: number) {
//         /**
//          * @param _t: time is seconds
//          */
//         // this.startTime = Date.now();
//         this.startTime = 0;
//         this.endTimer = 0;

//         this.durations = _t;

//     };

//     async sleep(): Promise<void> {
//         // Here is we get the time and keeping track of timer.
//         // Goal of method is to get the current state on a given range of times.
//         // Simple nead to stop the main loop and starting his again.
//         const logText = `${this.PREFIXLOG}[${this.sleep.name}]`;
//         this.startTime = Date.now();
//         this.endTimer = this.startTime + this.durations;
//         try {
//             return new Promise((resolve) => {
//                 let nowTime = Date.now();
//                 while (this.endTimer >= nowTime) {
//                     console.log("time left: ", String((this.endTimer - nowTime) < 0 ? 0 : this.endTimer - nowTime ));
//                     nowTime = Date.now();
//                 };
//                 // setTimeout(resolve, this.durations);
//                 return resolve();
//             });
//         }
//         catch (err) {
//             if (err instanceof Error) {
//                 console.error(`${logText} Error in timer function: ${err.message}`, {cause: err });
//             };
//         };
//     };
// }

// export { Timer };
