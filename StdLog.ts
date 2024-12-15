import chalk from 'chalk';
import { LogOutput } from "./LogOutput";

const defaultColors = [
    'blue',
    'magenta',
    'cyan',
    'green',
];
let colorIndex = 0;

export class StdLog extends LogOutput {
    debug(message: string, prefix: string = ''): void {
        console.debug(prefix + ' ' + chalk.gray(message));
    }

    warn(message: string, prefix: string = ''): void {
        console.warn(prefix + ' ' + chalk.yellow(message));
    }

    error(message: string, prefix: string = ''): void {
        console.error(prefix + ' ' + chalk.red(message));
    }

    assert(condition: boolean, message: string, prefix: string = ''): void {
        console.assert(condition, prefix + ' ' + chalk.red(message));
    }

    label(label: string): LogOutput {
        const color = defaultColors[colorIndex];
        colorIndex = (colorIndex + 1) % defaultColors.length;

        return new LabelStdLog(label, color, this);
    }

    log(message: string, prefix: string = ''): void {
        console.log(prefix + ' ' + chalk.gray(message));
    }

    info(message: string, prefix: string = ''): void {
        console.info(prefix + ' ' + chalk.bold(message));
    }

    time(label: string): void;
    time(f: () => void, label?: string): void;
    time(f: () => Promise<void>, label?: string): Promise<void>;

    time(arg: string | (() => void) | (() => Promise<void>), label?: string, prefix: string = ''): void | Promise<void> {
        if (typeof arg === 'function') {
            const label = ''+arg();
            console.time(label);
            const result = arg();
            if (result instanceof Promise) {
                return result.then(() => console.timeEnd(label));
            } else {
                return console.timeEnd(prefix + ' ' + chalk.gray(label));
            }
        } else {
            console.time(arg);
        }
    }

    timeEnd(label: string, prefix: string = ''): void {
        console.timeEnd(prefix + ' ' + chalk.gray(label));
    }
}

class LabelStdLog extends LogOutput {
    private readonly _label: string;
    private readonly _parent: StdLog;
    private readonly _color: string;
    private readonly _prefix: string;

    constructor(label: string, color: string, parent: StdLog) {
        super();
        this._label = label;
        this._parent = parent;
        this._color = color;
        this._prefix = `${chalk.white('[')}${chalk[this._color](this._label)}${chalk.white(']')}`;
    }

    debug(message: string, prefix: string = ''): void {
        this._parent.debug(message, this._prefix + ' ' + prefix);
    }

    log(message: string, prefix: string = ''): void {
        this._parent.log(message, this._prefix + ' ' + prefix);
    }

    info(message: string, prefix: string = ''): void {
        this._parent.info(message, this._prefix + ' ' + prefix);
    }

    warn(message: string, prefix: string = ''): void {
        this._parent.warn(message, this._prefix + ' ' + prefix);
    }

    error(message: string, prefix: string = ''): void {
        this._parent.error(message, this._prefix + ' ' + prefix);
    }

    assert(condition: boolean, message: string, prefix: string = ''): void {
        this._parent.assert(condition, message, this._prefix + ' ' + prefix);
    }

    label(label: string): LogOutput {
        const color = defaultColors[colorIndex];
        colorIndex = (colorIndex + 1) % defaultColors.length;

        return new LabelStdLog(label, color, this);
    }

    time(label: string): void;
    time(f: () => void, label?: string): void;
    time(f: () => Promise<void>, label?: string): Promise<void>;

    time(arg: string | (() => void) | (() => Promise<void>), label?: string, prefix: string = ''): void | Promise<void> {
        if (typeof arg === 'function') {
            const label = ''+arg;
            this._parent.time(label);
            const result = arg();
            if (result instanceof Promise) {
                return result.then(() => this._parent.timeEnd(label, this._prefix + ' ' + prefix));
            } else {
                return this._parent.timeEnd(label, this._prefix + ' ' + prefix);
            }
        } else {
            this._parent.time(arg);
        }
    }

    timeEnd(label: string, prefix: string = ''): void {
        this._parent.timeEnd(label, this._prefix + ' ' + prefix);
    }
}