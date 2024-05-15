/**
 * 
 * @param words String, Array of strings or Map of strings and frequencies
 * @param normalize Normalize frequencies (recommended)
 * @param savePath Path to save image
 * @param opts Other options
 */
export declare function generate(words: string | string[] | Map<string, number>, normalize?: boolean, savePath?: string, opts?: {
    minSize: number;
    maxSize: number;
    backgroundColor: string;
    font: string;
    padding: number;
}): Promise<void>;
export * from "./generate";
