import { Proxy } from "./interfaces/proxy.interface";
import * as net from "net";
import config from "../../config/config.json";
import { ServerProxy } from "./server.proxy";
import { PacketDecoder } from "../decoder/packet.decoder";

export class ClientProxy implements Proxy {
    protected _clientSocket: net.Socket;
    protected _server: Proxy;

    constructor(localPort: number, protected connectCallback: () => void) {
        const server = net.createServer((localsocket) => {
            this._clientSocket = localsocket;

            this._clientSocket.on('connect', this.onConnect.bind(this))
            this._clientSocket.on('data', this.onData.bind(this))
            this._clientSocket.on('drain', this.onDrain.bind(this))
            this._clientSocket.on('close', this.onClose.bind(this))
        });

        server.listen(localPort);
        console.log(`[CLIENT] LISTENING ON ${localPort}`);
    }

    public setInterface(proxy: Proxy) {
        this._server = proxy;
    }

    public write(data: Buffer) {
        if (this._clientSocket)
            return this._clientSocket.write(data);
        else {
            console.log("[CLIENT] NO CLIENT");
            return true;
        }
    }

    public resume() {
        console.log(`[CLIENT] RESUME`);
        if (this._clientSocket)
            this._clientSocket.resume();
    }

    public close() {
        console.log(`[CLIENT] CLOSED`);
        if (this._clientSocket)
            this._clientSocket.end();
    }

    protected onConnect() {
        console.log(`[CLIENT] NEW CONNECTION`);
        this.connectCallback();
    }

    protected onData(data: Buffer) {
        // console.log(`[CLIENT]`, data);
        new PacketDecoder(data);

        if (!this._server) {
            this.connectCallback();
        }
        const flushed = this._server.write(data);
        if (!flushed) {
            console.warn("[CLIENT] remote not flushed; pausing local");
            this._clientSocket.pause();
        }
    }

    protected onDrain() {
        console.debug(`[CLIENT] DRAINED`);
        this._server.resume();
    }

    protected onClose(hadError: boolean) {
        console.log(`[CLIENT] CLOSED`);
        this._server.close();
    }

}