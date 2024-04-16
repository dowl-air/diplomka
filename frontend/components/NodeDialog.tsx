import { allExpanded, darkStyles, JsonView } from "react-json-view-lite";

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
                    <JsonView data={node} shouldExpandNode={allExpanded} style={darkStyles} />
                </div>
            </dialog>
        </>
    );
};

export default NodeDialog;
