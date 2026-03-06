import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import './ExportBatch.css'
import API from '../../api';
const ExportBatchPoints = () => {
  const username = localStorage.getItem("username"); // admin username

  const handleExport = async () => {
    try {
      const res = await fetch(`${API}/admin/batchPoints/${username}`);
      if (!res.ok) throw new Error("Failed to fetch batch points");

      const data = await res.json();

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "BatchPoints");

      // Export as Excel
      XLSX.writeFile(wb, `BatchPoints_${username}.xlsx`);
    } catch (err) {
      console.error("Error exporting points:", err);
      alert("Failed to export batch points.");
    }
  };

  return (
    <div className="export-container">
      <button className="export-batch-btn" onClick={handleExport}>
      Export Batch Points
      </button>
    </div>
  );
};

export default ExportBatchPoints;
