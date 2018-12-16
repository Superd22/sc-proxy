import { Service } from "typedi";
import { exec } from "child_process";
const ps = require('ps-node');



@Service()
export class StarCitizenInterceptor {


    /**
     * Wait for Star Citizen to be launched returns true when it is.
     */
    public async waitForStarCitizen(): Promise<boolean> {
        const isLaunched = await this.isRunning("starcitizen.exe");
        if (isLaunched) return true;
        else {
            await new Promise((resolve) => setTimeout(() => resolve(), 1000));
            return this.waitForStarCitizen();
        }
    }

    protected isRunning(name: string) {
        console.log(`CHECKING FOR SC`);
        return new Promise(function (resolve, reject) {
            if (!name) {
                reject(false)
            } else {
                exec("tasklist.exe", function (err, stdout, stderr) {
                    resolve(stdout.toLowerCase().indexOf(name.toLowerCase()) > -1)
                })
            }

        })
    }


}