/**
 * Represents progress information for a file.
 * @type {ProgressInfo}
 * @property {string} filename - The filename.
 * @property {number} progress - The progress value.
 */
export type ProgressInfo = {
    /**
     * The filename.
     */
    filename: string;
    
    /**
     * The progress value.
     */
    progress: number;
};