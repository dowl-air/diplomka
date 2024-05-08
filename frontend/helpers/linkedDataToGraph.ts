import { DBPediaResponse, LinkedDataSearchResponse, WikiDataResponse } from "@/types/LinkedData";
import { MultiDirectedGraph } from "graphology";
import { isEmptyObject } from "./object";
import { generateRandomColors } from "./color";
import { removeTags } from "./removeTags";

const createDBPediaNodes = (linkedData: DBPediaResponse, searchTerm: string) => {
    const nodes = linkedData.docs.map((doc) => {
        return {
            "@id": doc.resource[0],
            "@type": "dbpedia",
            "@parent": searchTerm,
            label: removeTags(doc.label[0]),
            description: doc.comment[0],
            url: doc.resource[0],
            obj: doc,
        };
    });
    return nodes;
};

const createWikiNodes = (linkedData: WikiDataResponse, searchTerm: string) => {
    const nodes = linkedData.search.map((search) => {
        return {
            "@id": search.id,
            "@type": "wikidata",
            "@parent": searchTerm,
            label: search.label,
            description: search.description,
            url: search.url,
            obj: search,
        };
    });
    return nodes;
};

const createBaseNodes = (colors: string[], linkedData: LinkedDataSearchResponse) => {
    if (isEmptyObject(linkedData)) return [];
    const nodes = [];
    for (const query of linkedData) {
        nodes.push({
            "@id": query.searchTerm,
            "@type": "searchTerm",
            label: query.searchTerm,
            color: colors.pop(),
        });
    }
    return nodes;
};

export const createGraphFromLinkedData = (linkedData: LinkedDataSearchResponse) => {
    const graph = new MultiDirectedGraph();

    if (!linkedData || linkedData.length === 0) return graph;

    const baseColors = generateRandomColors(linkedData.length);

    const rootSearchTerm: string = linkedData.find((data) => data.index === 0)?.searchTerm || "root";

    //add root node
    graph.addNode(rootSearchTerm, {
        "@id": rootSearchTerm,
        "@type": "root",
        x: Math.random(),
        y: Math.random(),
        size: 10,
        color: "#000000",
        label: rootSearchTerm,
    });

    //remove first element from linkedData temporarily
    const linkedDataWithoutRoot = [...linkedData];
    linkedDataWithoutRoot.shift();

    const baseNodes = createBaseNodes(baseColors, linkedDataWithoutRoot);
    //remove duplicates (same id)
    const uniqueBaseNodes = baseNodes.filter(
        (node, index, self) => index === self.findIndex((t) => t["@id"] === node["@id"]) && node["@id"] !== rootSearchTerm
    );
    for (const node of uniqueBaseNodes) {
        graph.addNode(node["@id"], { ...node, x: Math.random(), y: Math.random(), size: 10 });
        graph.addEdgeWithKey(`${node["@id"]}-root`, node["@id"], rootSearchTerm, { label: "root" });
    }

    const wikiNodes = [];
    for (const query of linkedData) {
        if (query.WikiData) wikiNodes.push(...createWikiNodes(query.WikiData, query.searchTerm));
    }
    //remove duplicates (same id)
    const uniqueWikiNodes = wikiNodes.filter((node, index, self) => index === self.findIndex((t) => t["@id"] === node["@id"]));
    for (const node of uniqueWikiNodes) {
        graph.addNode(node["@id"], { ...node, x: Math.random(), y: Math.random(), size: 8, color: "#8a8a8a" });
        graph.addEdgeWithKey(`${node["@id"]}-searchTerm`, node["@id"], node["@parent"], { label: "searchTerm" });
    }

    const dbpediaNodes = [];
    for (const query of linkedData) {
        if (query.DBPedia) dbpediaNodes.push(...createDBPediaNodes(query.DBPedia, query.searchTerm));
    }
    // remove duplicates (same resource)
    const uniqueDBPediaNodes = dbpediaNodes.filter((node, index, self) => index === self.findIndex((t) => t["@id"] === node["@id"]));
    for (const node of uniqueDBPediaNodes) {
        graph.addNode(node["@id"], { ...node, x: Math.random(), y: Math.random(), size: 8, color: "#333333" });
        graph.addEdgeWithKey(`${node["@id"]}-searchTerm`, node["@id"], node["@parent"], { label: "searchTerm" });
    }
    return graph;
};
