export type WikiDataObject = {
    aliases: string[];
    concepturi: string;
    description: string;
    display: {
        description: {
            language: string;
            value: string;
        };
        label: {
            language: string;
            value: string;
        };
    };
    id: string;
    label: string;
    match: {
        language: string;
        text: string;
        type: string;
    };
    pageid: number;
    repository: string;
    title: string;
    url: string;
};

export type WikiDataResponse = {
    search: WikiDataObject[];
    searchinfo: {
        search: string;
    };
    "search-continue"?: number;
    success: number;
};

export type DBPediaObject = {
    category: string[];
    comment: string[];
    label: string[];
    resource: string[];
    type: string[];
    typeName: string[];
};

export type DBPediaResponse = {
    docs: DBPediaObject[];
};

export type LinkedDataSearchResponse = {
    searchTerm: string;
    index: number;
    DBPedia: DBPediaResponse | null;
    WikiData: WikiDataResponse | null;
}[];
