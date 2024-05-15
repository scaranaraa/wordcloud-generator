export declare function generate(words: string[] | Map<string, number>, normalize?: boolean, savePath?: string, opts?: {
    minSize: number;
    maxSize: number;
    backgroundColor: string;
    font: string;
    padding: number;
}): Promise<void>;
export * from "./generate";
