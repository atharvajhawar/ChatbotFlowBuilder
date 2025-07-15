// src/components/TextNode.jsx
import React from "react";
import { Handle, Position } from "reactflow";

function TextNode({ data, selected }) {
  return (
    <div
      style={{
        background: selected ? "#e3f2fd" : "#f1f8e9",
        border: selected ? "2px solid #1976d2" : "1.5px solid #b2dfdb",
        borderRadius: 12,
        minWidth: 220,
        padding: 16,
        boxShadow: selected ? "0 4px 16px #1976d233" : "0 2px 8px #0001",
        transition: "border 0.2s, background 0.2s, box-shadow 0.2s",
        position: "relative",
        cursor: "pointer",
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 22, marginRight: 8, color: "#1976d2" }}>💬</span>
        <span style={{ fontWeight: 600, color: "#1976d2", fontSize: 16 }}>Send Message</span>
      </div>
      <div style={{ fontSize: 15, color: "#333", minHeight: 24 }}>{data.label}</div>
      {/* Target handle (left) */}
      <Handle type="target" position={Position.Left} style={{ background: "#1976d2" }} />
      {/* Source handle (right) */}
      <Handle type="source" position={Position.Right} style={{ background: "#43a047" }} />
    </div>
  );
}

export default TextNode;