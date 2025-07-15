import React from "react";

function SettingsPanel({ selectedNode, onChange }) {
  if (!selectedNode) return null;

  return (
    <div style={{ padding: 16 }}>
      <h3>Settings</h3>
      <label>
        Message Text:
        <input
          type="text"
          value={selectedNode.data.label}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            marginTop: 8,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </label>
    </div>
  );
}

export default SettingsPanel;
