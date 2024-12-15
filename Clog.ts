import { LogOutput } from "./LogOutput";
import { StdLog } from "./StdLog";
import LogInterface from "./LogInterface";
import LabelLog from "./LabelLog";

export class Clog implements LogInterface {
    outputs: LogOutput[] = [];

    constructor(outputs: LogOutput[] | undefined = undefined) {
        this.outputs = outputs ? outputs : [new StdLog()];
    }

    assert(condition: boolean, message: string) {
        if(!condition) {
            this.error(message);
            throw new Error(message);
        }
    }

    debug(message: string) {
        this.outputs.forEach(output => output.debug(message));
    }

    log(message: string) {
        this.outputs.forEach(output => output.log(message));
    }

    /*message(message: string) {
        this.outputs.forEach(output => output.message(message));
    }

    /*info(message: string) {
        this.outputs.forEach(output => output.info(message));
    }*/

    warn(message: string) {
        this.outputs.forEach(output => output.warn(message));
    }

    error(message: string) {
        this.outputs.forEach(output => output.error(message));
    }

    label(label: string): LogInterface {
        return new LabelLog(label, this.outputs);
    }

    time(label: string): void;
    time(f: () => void, label?: string): void;
    time(f: () => Promise<void>, label?: string): Promise<void>;

    time(arg: string | (() => void) | (() => Promise<void>), label?: string): void | Promise<void> {
        if (typeof arg === 'function') {
            if(!label) label = ''+arg;
            this.time(label);
            const result = arg();
            if (result instanceof Promise) {
                return result.then(() => this.timeEnd(label!));
            } else {
                return this.timeEnd(label);
            }
        } else {
            this.outputs.forEach(output => output.time(arg));
        }
    }

    timeEnd(label: string): void {
        this.outputs.forEach(output => output.timeEnd(label));
    }

    //TODO: group
}