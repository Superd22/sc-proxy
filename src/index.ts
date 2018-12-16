import { Container } from "typedi";
import { SCProxy } from "./proxy/proxy";
import { StarCitizenInterceptor } from "./interceptor/starcitizen.interceptor";

/*
class SCReverseProxy {
    protected _interceptor = Container.get(StarCitizenInterceptor);
    constructor() { }

    public async init() {
        // Wait for the game to be launched
        await this._interceptor.waitForStarCitizen();

        

        // We can now init our proxy
        const proxy = Container.get(SCProxy);
    }
}
*/

Container.get(SCProxy);