import { useEffect, useState } from "react";
import studentAPI from "../../../api/studentAPI";
import "./Bill.scss";

function Bill() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 5;

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const response = await studentAPI.getBills();
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const renderStatus = (status) => {
    let className = "bill-status ";
    switch (status) {
      case "PAID":
        className += "paid";
        break;
      case "PENDING":
        className += "pending";
        break;
      case "CANCELLED":
        className += "cancelled";
        break;
      default:
        break;
    }
    return <span className={className}>{status}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2);
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(bills.length / billsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bill-container">
      <div className="bill-content">
        <div className="bill-header d-flex gap-3 align-items-center">
          <h2 className="bill-title">My Bills</h2>
        </div>
        {loading ? (
          <p>Loading bills...</p>
        ) : bills.length === 0 ? (
          <p>No bills found.</p>
        ) : (
          <>
            <div className="bill-table-wrapper">
              <table className="bill-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Course</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Bought at</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBills.map((bill, idx) => (
                    <tr key={bill.id}>
                      <td>{indexOfFirstBill + idx + 1}</td>
                      <td>{bill.course?.name}</td>
                      <td>{bill.price}đ</td>
                      <td>{renderStatus(bill.status)}</td>
                      <td>{formatDate(bill.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Bill;
