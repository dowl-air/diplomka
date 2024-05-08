export const getDataToSearch = (data: any): String[] => {
    if (!data) return [];

    const searchObject = (obj: any) => {
        const queue: any[] = [obj]; // Queue to store objects for BFS traversal
        const results: string[] = []; // Array to store found "name" values

        while (queue.length > 0) {
            const currentObject = queue.shift(); // Dequeue the first object

            if (typeof currentObject === "object" && currentObject !== null) {
                for (const key in currentObject) {
                    if (key === "name") {
                        if (typeof currentObject[key] === "string" && currentObject[key].length > 0) results.push(currentObject[key]);
                    } else {
                        queue.push(currentObject[key]); // Enqueue child objects for later search
                    }
                }
            }
        }

        return results;
    };

    if (typeof data === "object") {
        const results = searchObject(data);
        return results;
    }

    return [];
};
