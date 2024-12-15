import LogInterface from "./LogInterface";
import { LogOutput } from "./LogOutput";

export default class LabelLog implements LogInterface {
    private readonly _label: string;
    private _outputs: LogOutput[];

    constructor(label: string, outputs: LogOutput[]) {
        this._label = label;
        this._outputs = outputs.map(output => output.label(label));
    }

    label(label: string): LogInterface {
        return new LabelLog(label, this._outputs);
    }

    log(message: string) {
        this._outputs.forEach(output => output.log(message));
    }

    assert(condition: boolean, message: string): void;
    debug(message: string): void;
    log(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    //group(name: string): LogInterface;
    time(label: string): void;
    time(f: () => void, label?: string): void;
    time(f: () => Promise<void>, label?: string): Promise<void>;
    timeEnd(label: string): void;
}