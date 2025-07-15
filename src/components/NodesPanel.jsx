// src/components/NodesPanel.jsx
import React from "react";

const nodeTypes = [
  {
    type: "textNode",
    label: "Message",
    icon: "💬", // You can use an icon library or SVG here
  },
];

function NodesPanel() {
  // Handle drag start
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Nodes Panel</h3>
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          onDragStart={(event) => onDragStart(event, node.type)}
          draggable
          style={{
            border: "1px solid #aaa",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            textAlign: "center",
            cursor: "grab",
            background: "#f9f9f9",
          }}
        >
          <div style={{ fontSize: 24 }}>{node.icon}</div>
          <div>{node.label}</div>
        </div>
      ))}
    </div>
  );
}

export default NodesPanel;