import chalk, { ChalkInstance } from 'chalk';
import { LogOutput } from "./LogOutput";

type Color = ColorAnsi256 | ColorHex;

type ColorAnsi256 = {
    type: 'ansi256',
    color: number;
}

type ColorHex = {
    type: 'hex',
    color: string;
};

function colorText(color: Color, text: string) {
    if(color.type === 'ansi256') {
        return chalk.ansi256(color.color)(text);
    } else if(color.type === 'hex') {
        return chalk.hex(color.color)(text);
    }
}

const debugColor: Color = {type: 'ansi256', color: 142};
const infoColor: Color = {type: 'ansi256', color: 142};
const warningColor: Color = {type: 'ansi256', color: 166};
const errorColor: Color = {type: 'ansi256', color: 196};

const defaultColors = [
    {type: 'ansi256', color: 69},
    {type: 'ansi256', color: 6},
    {type: 'ansi256', color: 223},
    {type: 'ansi256', color: 182},
    {type: 'ansi256', color: 81},
    {type: 'ansi256', color: 30},
    {type: 'ansi256', color: 111},
    {type: 'ansi256', color: 140},
    {type: 'ansi256', color: 22},
    {type: 'ansi256', color: 57},
    {type: 'ansi256', color: 217},
    {type: 'ansi256', color: 213},
    {type: 'ansi256', color: 39},
    {type: 'ansi256', color: 89},
    {type: 'ansi256', color: 202},

];
let colorIndex = 0;

export class StdLog extends LogOutput {
    debug(message: string, prefix: string = ''): void {
        console.debug(prefix + ' ' + colorText(debugColor, message));
    }

    warn(message: string, prefix: string = ''): void {
        console.warn(prefix + ' ' + colorText(warningColor, message));
    }

    error(message: string, prefix: string = ''): void {
        console.error(prefix + ' ' + colorText(errorColor, message));
    }

    assert(condition: boolean, message: string, prefix: string = ''): void {
        console.assert(condition, prefix + ' ' + colorText(errorColor, message));
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
    private readonly _color: Color;
    private readonly _prefix: string;

    constructor(label: string, color: Color, parent: StdLog) {
        super();
        this._label = label;
        this._parent = parent;
        this._color = color;
        this._prefix = `${chalk.white('[')}${colorText(this._color, this._label + ' ' + color.color)}${chalk.white(']')}`;
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
