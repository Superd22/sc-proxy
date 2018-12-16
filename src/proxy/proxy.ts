import * as net from "net";
import { Container, Service } from "typedi";
import { ServerProxy } from "./server.proxy";
import { ClientProxy } from "./client.proxy";
import { Proxy } from "./interfaces/proxy.interface";

export class SCProxy {
    protected _server: Proxy;
    protected _client: Proxy;

    constructor(protected localPort: number, protected remoteHost: string, protected remotePort: number, immediate?: boolean) {
        this._client = new ClientProxy(localPort, this.createServer.bind(this));
        if (immediate) {
            this.createServer();
        }
    }

    protected createServer() {
        if (!this._server) {
            this._server = new ServerProxy(this._client, this.remoteHost, this.remotePort);
            this._client.setInterface(this._server);
        }
    }

    public stop() {
        this._client.close();
        this._server.close();
    }
}
