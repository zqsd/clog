import LogInterface from "./LogInterface";

export abstract class LogOutput implements LogInterface {
    abstract log(message: string): void;
    abstract debug(message: string): void;
    abstract info(message: string): void;
    abstract warn(message: string): void;
    abstract error(message: string): void;
    abstract assert(condition: boolean, message: string): void;
    abstract label(label: string): LogOutput;
    abstract time(label: string): void;
    abstract time(f: () => void, label?: string): void;
    abstract time(f: () => Promise<void>, label?: string): Promise<void>;
    abstract timeEnd(label: string): void;
}