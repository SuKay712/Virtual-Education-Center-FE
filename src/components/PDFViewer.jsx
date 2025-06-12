import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.js";

// Đường dẫn worker
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const PDFViewer = ({ pdfData }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!pdfData) return;
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    let pdfDoc = null;
    let destroyed = false;

    loadingTask.promise.then((pdf) => {
      pdfDoc = pdf;
      if (destroyed) return;
      // Xóa nội dung cũ
      if (containerRef.current) containerRef.current.innerHTML = "";
      // Render từng trang
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        pdf.getPage(pageNum).then((page) => {
          const viewport = page.getViewport({ scale: 1.2 });
          const canvas = document.createElement("canvas");
          canvas.style.marginBottom = "24px";
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // Render page vào canvas
          page.render({ canvasContext: context, viewport });
          if (containerRef.current) containerRef.current.appendChild(canvas);
        });
      }
    });
    return () => {
      destroyed = true;
      if (pdfDoc) pdfDoc.destroy();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [pdfData]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflowX: "auto",
        background: "#fff",
        padding: 16,
      }}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onSelectStart={(e) => e.preventDefault()}
    />
  );
};

export default PDFViewer;
