export class PacketDecoder {
    constructor(public readonly packet: Buffer) {
        console.log(packet.toString('hex'));
    }



}