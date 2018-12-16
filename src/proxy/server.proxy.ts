import * as net from "net";
import config from "../../config/config.json"
import { Proxy } from "./interfaces/proxy.interface";
import { PacketDecoder } from "../decoder/packet.decoder";

export class ServerProxy implements Proxy {
    protected _remoteSocket = new net.Socket();
    protected _client: Proxy;

    constructor(client: Proxy, remoteHost: string, remotePort: number) {
        if (client) {
            this.setInterface(client);
        }

        console.log(`[SERVER] Connecting to remote`);
        this._remoteSocket.connect(remotePort, remoteHost);
    }

    public setInterface(proxy: Proxy) {
        this._client = proxy;

        this._remoteSocket.on('data', this.onData.bind(this))
        this._remoteSocket.on('drain', this.onDrain.bind(this))
        this._remoteSocket.on('close', this.onClose.bind(this))
        this._remoteSocket.on('error', this.onError.bind(this))
    }

    public write(data: Buffer) {
        return this._remoteSocket.write(data);
    }

    public resume() {
        console.log(`[SERVER] RESUME`);
        this._remoteSocket.resume();
    }

    public close() {
        console.log(`[SERVER] CLOSE`);
        this._remoteSocket.end();
    }

    protected onData(data: Buffer) {
        // console.log(`[SERVER]`, data);

        new PacketDecoder(data);

        this._client.write(data);
    }

    protected onDrain() {
        console.debug(`[SERVER] DRAINED`);
        this._client.resume();
    }

    protected onClose(hadError: boolean) {
        console.log(`[SERVER] CLOSED`);
        this._client.close();
    }

    protected onError(error: Error) {
        console.error('[SERVER] ERROR', error);
    }
}