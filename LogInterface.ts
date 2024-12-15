export default interface LogInterface {
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