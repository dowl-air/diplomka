import { collapseAllNested, darkStyles, JsonView } from "react-json-view-lite";

const ExternalButton = ({ node }: { node: any }) => {
    if (node.resource) {
        return (
            <a target="_blank" href={node.resource}>
                <button className="btn btn-sm btn-primary my-2">Visit DBPedia</button>
            </a>
        );
    } else if (node.concepturi) {
        return (
            <a target="_blank" href={node.concepturi}>
                <button className="btn btn-sm btn-primary my-2">Visit Wikidata</button>
            </a>
        );
    }
};

const DialogLabel = ({ node }: { node: any }) => {
    if (!node) return null;
    if (node.resource) {
        return <div className="badge bg-orange-500 text-black">DBPedia</div>;
    } else if (node.concepturi) {
        return <div className="badge badge-primary">Wikidata</div>;
    } else return <div className="badge bg-gray-400 text-black">Extracted data</div>;
};

const NodeDialog = ({ node }: { node: any }) => {
    return (
        <>
            <dialog id="node-modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-6">
                        {node && node.label} <DialogLabel node={node} />
                    </h3>
                    {node && <ExternalButton node={node} />}
                    <JsonView data={node} shouldExpandNode={collapseAllNested} style={darkStyles} />
                </div>
            </dialog>
        </>
    );
};

export default NodeDialog;
