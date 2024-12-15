import { Clog } from "./CLog";
import { StdLog } from "./StdLog";

/*
const log = new Clog();
log.log("Hello, local!");
const server = log.label("server");
server.log("Hello, world wide web!");
log.time(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
}, "hello world");
*/

const log = new StdLog();
const log2 = log.label("server");
const log3 = log2.label('http');
log3.log('starting');
log3.info('listening on port 8080');
log3.warn('warning');
log3.error('error');


/*
for(let i = 0; i < 20; i++) {
    const randomHex = () => Math.random().toString(16).slice(2, 12);
    const hexString = randomHex();
    log.label(hexString).log('pouet');
}
*/
