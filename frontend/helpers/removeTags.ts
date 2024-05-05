export const removeTags = (text: string) => {
    //remove HTML tags but keep the text
    return text.replace(/<[^>]*>?/gm, "");
}