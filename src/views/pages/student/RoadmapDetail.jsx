import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import accountAPI from "../../../api/accountAPI";
import studentAPI from "../../../api/studentAPI";
import { IMAGES } from "../../../constants/images";
import CourseDetailModal from "../../../components/modal/CourseDetailModal";
import "./Course.scss";

const RoadmapDetail = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await accountAPI.getRoadmapDetail(roadmapId);
        setRoadmap(response.data);
      } catch (error) {
        setRoadmap(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [roadmapId]);

  const handleShowCourseDetail = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const handlePurchaseCourse = async (courseId) => {
    try {
      await studentAPI.purchaseCourse(courseId);
      // Refresh the roadmap data after purchase
      const response = await accountAPI.getRoadmapDetail(roadmapId);
      setRoadmap(response.data);
      // Close the modal after successful purchase
      handleCloseModal();
    } catch (error) {
      console.error("Error purchasing course:", error);
      alert("Có lỗi xảy ra khi mua khóa học. Vui lòng thử lại sau.");
    }
  };

  if (loading)
    return <div className="modern-roadmap-detail-page">Đang tải...</div>;
  if (!roadmap)
    return (
      <div className="modern-roadmap-detail-page">Không tìm thấy lộ trình.</div>
    );

  // Nếu roadmap có chia block (sections), render theo block, nếu không thì render 1 block
  const blocks = roadmap.blocks || [
    {
      name: roadmap.name,
      description: roadmap.description,
      courses: roadmap.courses || [],
    },
  ];

  return (
    <div className="modern-roadmap-detail-page">
      <button
        className="modern-back-btn"
        onClick={() => navigate("/student/course")}
      >
        ← Quay lại
      </button>
      <div className="modern-roadmap-detail-header">
        <h1 className="modern-roadmap-detail-title">
          Lộ trình học {roadmap.name}
        </h1>
        <p className="modern-roadmap-detail-desc">{roadmap.description}</p>
      </div>
      <div className="modern-roadmap-blocks">
        {blocks.map((block, idx) => (
          <div className="modern-roadmap-block" key={idx}>
            <h2 className="modern-roadmap-block-title">
              {idx + 1}. {block.name}
            </h2>

            {block.description && (
              <p className="modern-roadmap-block-desc">{block.description}</p>
            )}
            <div className="modern-roadmap-block-courses">
              {block.courses && block.courses.length > 0 ? (
                block.courses.map((course, cidx) => (
                  <div
                    className="modern-course-card detail f8-style"
                    key={course.id}
                  >
                    <div className="modern-course-img-col">
                      <div className="modern-course-img-bg">
                        <img
                          src={course.image || IMAGES.france_image}
                          alt={course.name}
                          className="modern-course-img"
                        />
                      </div>
                    </div>
                    <div className="modern-course-info-col">
                      <div className="modern-course-info-header">
                        <h3 className="modern-course-title">{course.name}</h3>
                        {course.price === 0 && (
                          <span className="modern-course-badge-free">
                            Miễn phí
                          </span>
                        )}
                        {course.price > 0 && (
                          <span className="modern-course-price">
                            {course.price.toLocaleString("vi-VN")} ₫
                          </span>
                        )}
                      </div>

                      <p className="modern-course-desc">{course.description}</p>
                      <div className="modern-course-info-footer">
                        <div className="modern-course-meta">
                          <span>{course.num_classes} buổi</span>
                        </div>
                        <button
                          className="modern-course-detail-btn big"
                          onClick={() => handleShowCourseDetail(course)}
                        >
                          XEM KHÓA HỌC
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>Chưa có khóa học nào trong block này.</div>
              )}
            </div>
          </div>
        ))}
      </div>
      {showModal && selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={handleCloseModal}
          onPurchase={() => handlePurchaseCourse(selectedCourse.id)}
        />
      )}
    </div>
  );
};

export default RoadmapDetail;
