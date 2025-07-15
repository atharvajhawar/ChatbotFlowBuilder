// src/components/FlowCanvas.jsx
import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import TextNode from "./TextNode";
import SettingsPanel from "./SettingsPanel";
import NodesPanel from "./NodesPanel";

// Define nodeTypes OUTSIDE the component
const nodeTypes = {
  textNode: TextNode,
};

const initialNodes = [];
const initialEdges = [];

function FlowCanvas() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [error, setError] = useState("");

  // Handle drop from NodesPanel
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Use a more unique ID for each node
      const newNode = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type, // use the type from the panel, e.g. "textNode"
        position,
        data: { label: "Edit me" },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode); // Automatically select the new node
    },
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Clear selection when clicking on empty canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle label change
  const onLabelChange = (newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
    setSelectedNode((node) =>
      node ? { ...node, data: { ...node.data, label: newLabel } } : node
    );
  };

  const handleSave = () => {
    setError(""); // Clear previous error
    if (nodes.length > 1) {
      // Find nodes with no outgoing edge (source handle not connected)
      const nodeIdsWithOutgoing = new Set(edges.map(e => e.source));
      const nodesWithNoOutgoing = nodes.filter(n => !nodeIdsWithOutgoing.has(n.id));
      if (nodesWithNoOutgoing.length > 1) {
        setError("Error: More than one node has an empty target handle (no outgoing edge).");
        return;
      }
    }
    alert("Flow saved successfully!");
    // Optionally: console.log({ nodes, edges });
  };

  // Export flow as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chatbot-flow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import flow from JSON
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { nodes: importedNodes, edges: importedEdges } = JSON.parse(e.target.result);
        setNodes(importedNodes || []);
        setEdges(importedEdges || []);
        setSelectedNode(null);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Remove isValidConnection restriction to allow multiple outgoing edges per node

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      <div style={{ flex: 1, position: "relative" }} ref={reactFlowWrapper}>
        {/* Save Button and Export/Import - absolute inside canvas */}
        <div style={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 20,
          display: "flex",
          gap: 12,
          alignItems: "center",
          background: "#fff",
          padding: "8px 20px 8px 20px",
          borderRadius: 8,
          boxShadow: "0 2px 12px #0002"
        }}>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
          <button
            onClick={handleExport}
            style={{
              padding: "8px 16px",
              background: "#43a047",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Export
          </button>
          <label style={{
            margin: 0,
            cursor: "pointer",
            background: "#43a047",
            borderRadius: 4,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 15,
            display: "inline-block",
            padding: "8px 16px",
            border: "none",
            transition: "background 0.2s, color 0.2s",
            boxShadow: "none"
          }}
           onMouseOver={e => e.currentTarget.style.background = '#388e3c'}
           onMouseOut={e => e.currentTarget.style.background = '#43a047'}
          >
            <input type="file" accept="application/json" onChange={handleImport} style={{ display: "none" }} />
            Import
          </label>
          {error && (
            <div style={{ color: "red", marginTop: 8, fontWeight: "bold" }}>{error}</div>
          )}
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <div style={{ width: 300, borderLeft: "1px solid #eee", background: "#fff" }}>
        {selectedNode ? (
          <SettingsPanel selectedNode={selectedNode} onChange={onLabelChange} />
        ) : (
          <NodesPanel />
        )}
      </div>
    </div>
  );
}

export default FlowCanvas;