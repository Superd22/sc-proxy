import * as dns from "dns";

import { SCProxy } from "../proxy/proxy";
import * as fs from "fs";
import ProxyDNS from 'proxy-dns';

export class SCLBInterceptor {

    protected _proxy: SCProxy;
    protected _ALBProxy: SCProxy;

    constructor() {
        this.init();
    }

    protected async init() {
        const ips = await this.resolve();
        this.fakeALB();
        this._proxy = new SCProxy(8000, ips[0], 8000);

        let hosts = fs.readFileSync(`C:/Windows/System32/drivers/etc/hosts`, "utf8");
        hosts += `\n127.0.0.1 public.universe.robertsspaceindustries.com #SCAUTO`;
        fs.writeFileSync(`C:/Windows/System32/drivers/etc/hosts`, hosts);
    }

    protected fakeALB() {
        const dns = new ProxyDNS({
            ttl: 600
        });

        dns.use(function* (next: any) {
            if (this.domain === 'public.universe.robertsspaceindustries.com') {
                this.answers = [
                    '127.0.0.1'
                ];
            }
            yield next;
        });

        dns.listen(53);
    }

    /**
     * Resolve Public Universe IPs
     */
    protected async resolve() {
        return new Promise<string[]>((resolve, reject) => {
            dns.resolve("public.universe.robertsspaceindustries.com", (err, address) => {
                if (err) reject(err);
                else {
                    resolve(address);
                }
            });
        });
    }
}

new SCLBInterceptor();