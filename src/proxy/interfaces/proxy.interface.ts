export interface Proxy {
    write(data: Buffer): boolean;
    resume(): void;
    close(): void;
    setInterface(proxy: Proxy): void
}