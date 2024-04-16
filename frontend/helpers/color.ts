import randomColor from "randomcolor";

export const generateRandomColors = (count: number): string[] => {
    return randomColor({ count, luminosity: "light" });
};
