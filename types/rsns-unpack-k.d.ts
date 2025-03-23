declare module 'rsns-unpack-k' {
  export class RsnsUnpacker {
    constructor();
    getLatestVersion(): Promise<string>;
    getBinaryConfig(name: string): Promise<any[]>;
    getTranslate(name: string): Promise<{ [key: string]: { [key:string]:{}} }>;
    getCharacterImage(id: number): Promise<Buffer>;
  }
  
  export function getJimpPNG(buffer: Buffer): Promise<Buffer>;
} 