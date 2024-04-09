export const getFileExtension = (filename: string): string => {
    const lastDotIndex: number = filename.lastIndexOf(".");
    if (lastDotIndex === -1) {
        // No dot found in the filename, return an empty string
        return "";
    }
    return filename.slice(lastDotIndex + 1);
};

export const  getFileNameWithoutExtension = (filename: string): string => {
    const lastDotIndex: number = filename.lastIndexOf(".");
    if (lastDotIndex === -1) {
        // No dot found in the filename, return the filename as it is
        return filename;
    }
    return filename.slice(0, lastDotIndex);
};