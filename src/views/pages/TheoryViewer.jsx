import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminAPI from "../../api/adminAPI";
import { toast } from "react-toastify";
import PDFViewer from "../../components/PDFViewer";
import "./TheoryViewer.scss";

const TheoryViewer = () => {
  const { theoryId } = useParams();
  const navigate = useNavigate();
  const [pdfData, setPdfData] = useState(null);
  const [theoryName, setTheoryName] = useState("");

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const response = await adminAPI.downloadTheory(theoryId);
        if (!response.data) {
          throw new Error("No PDF data received");
        }
        let pdfArrayBuffer;
        if (response.data instanceof Blob) {
          pdfArrayBuffer = await response.data.arrayBuffer();
        } else {
          pdfArrayBuffer = response.data;
        }
        setPdfData(pdfArrayBuffer);
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const filename = contentDisposition.split("filename=")[1];
          setTheoryName(filename || "Theory Document");
        } else {
          setTheoryName("Theory Document");
        }
      } catch (error) {
        toast.error("Không thể tải file PDF");
        navigate(-1);
      }
    };
    loadPDF();
  }, [theoryId, navigate]);

  // Ngăn chặn các phím tắt phổ biến
  useEffect(() => {
    const preventDownload = (e) => {
      if (
        ((e.ctrlKey || e.metaKey) &&
          (e.key === "s" || e.key === "p" || e.key === "u" || e.key === "i")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        toast.warning("Tính năng này đã bị vô hiệu hóa");
      }
    };
    window.addEventListener("keydown", preventDownload);
    return () => window.removeEventListener("keydown", preventDownload);
  }, []);

  // Ngăn chặn click chuột phải
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      toast.warning("Tính năng này đã bị vô hiệu hóa");
    };
    window.addEventListener("contextmenu", preventContextMenu);
    return () => window.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  // Ngăn chặn kéo thả
  useEffect(() => {
    const preventDrag = (e) => {
      e.preventDefault();
    };
    window.addEventListener("dragstart", preventDrag);
    return () => window.removeEventListener("dragstart", preventDrag);
  }, []);

  return (
    <div className="theory-viewer-page">
      <div className="theory-viewer-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <h2>{theoryName}</h2>
      </div>
      <div className="theory-viewer-container">
        {pdfData ? (
          <PDFViewer pdfData={pdfData} />
        ) : (
          <div className="loading-pdf">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Đang tải PDF...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheoryViewer;
