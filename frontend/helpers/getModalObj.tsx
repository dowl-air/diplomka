import { LinkedDataSearchResponse } from "@/types/LinkedData";

export const getModalObj = (linkedData: LinkedDataSearchResponse, extractedData: any, id: string) => {
    if (!id) return null;
    // search in "Wikidata" of objects first
    for (const obj of linkedData) {
        if (obj.WikiData) {
            const wikidata = obj.WikiData.search.find((data) => data.id === id);
            if (wikidata) return wikidata;
        }
    }

    //search in "DBPedia" of objects
    for (const obj of linkedData) {
        if (obj.DBPedia) {
            const dbpedia = obj.DBPedia.docs.find((data) => data.resource[0] === id);
            if (dbpedia) return dbpedia;
        }
    }
    // search extracted data as object of objects and return the first match
    const queue: any[] = [extractedData]; // Queue to store objects for BFS traversal

    while (queue.length > 0) {
        const currentObject = queue.shift(); // Dequeue the first object

        if (typeof currentObject === "object" && currentObject !== null) {
            for (const key in currentObject) {
                if (
                    (key === "id" && currentObject[key] === id) ||
                    (key === "@id" && currentObject[key] === id) ||
                    (key === "name" && currentObject[key] === id) ||
                    (key === "title" && currentObject[key] === id)
                ) {
                    return currentObject;
                } else {
                    queue.push(currentObject[key]); // Enqueue child objects for later search
                }
            }
        }
    }

    return null;
};
