import Navbar from "../../../components/homepage/Navbar";
import "./index.scss";
import RegisterButton from "../../../components/buttons/RegisterButton";
import { IMAGES } from "../../../constants/images";
import { PiStudent } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa";
import LearningPathSection from "../../../components/LearningPathSection";
import EnglishRoadmapSection from "../../../components/EnglishRoadmapSection";
import ContactConsultModal from "../../../components/ContactConsultModal";
import { useEffect, useState } from "react";
import authAPI from "../../../api/auth";

function Homepage() {
  const [courses, setCourses] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [fade, setFade] = useState("in");
  const [showModal, setShowModal] = useState(false);
  const COURSES_PER_PAGE = 3;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await authAPI.getCourses();
        setCourses(res.data);
      } catch (err) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const handleChangePage = (next) => {
    setFade("out");
    setTimeout(() => {
      setStartIndex((prev) => {
        if (next) {
          return Math.min(
            prev + COURSES_PER_PAGE,
            courses.length - COURSES_PER_PAGE
          );
        } else {
          return Math.max(prev - COURSES_PER_PAGE, 0);
        }
      });
      setFade("in");
    }, 300);
  };

  const visibleCourses = courses.slice(
    startIndex,
    startIndex + COURSES_PER_PAGE
  );

  return (
    <div>
      <Navbar />
      <div
        id="home"
        className="home-container d-flex align-items-center justify-content-center"
      >
        <div className="home-content">
          <h4 className="home-content-title">Kết nối tri thức </h4>
          <h4 className="home-content-title">Mở lối tương lai </h4>
          <p className="home-content-desciption">
            Hãy để giấc mơ học tập của bạn được bay xa, bạn có thể học tập được
            ở bất cứ đâu, bất kì thời điểm nào.
          </p>
          <div style={{ margin: "40px 0" }}>
            <RegisterButton />
          </div>
          <div className="d-flex align-items-center mt-4">
            <div className="home-content-quantity-item">
              <div className="home-content-quantity-number">1000+</div>
              <div className="home-content-quantity-text">Học viên</div>
            </div>
            <div className="line-seperate"></div>
            <div className="home-content-quantity-item">
              <div className="home-content-quantity-number">1000+</div>
              <div className="home-content-quantity-text">Giáo viên</div>
            </div>
          </div>
        </div>
        <div className="home-banner">
          <img
            src={IMAGES.home_banner}
            alt="Descriptive Alt Text"
            style={{ maxWidth: "90%", height: "auto" }}
          />
        </div>
      </div>
      <div id="programs" className="programs-container">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h4 className="programs-title">Các khóa học của Virtual Center</h4>
          <div
            className="d-flex justify-content-center align-items-center mt-5 position-relative"
            style={{ minHeight: 350 }}
          >
            <button
              className="programs-arrow-btn left"
              onClick={() => handleChangePage(false)}
              disabled={startIndex === 0 || fade === "out"}
              style={{ position: "absolute", left: 100, top: "30%", zIndex: 2 }}
            >
              &#8592;
            </button>
            <div
              className={`programs-fade-wrapper ${fade === "in" ? "fade-in" : "fade-out"} d-flex`}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {visibleCourses.length > 0 ? (
                visibleCourses.map((course) => (
                  <div className="programs-card mx-3" key={course.id}>
                    <img
                      src={IMAGES.program_img_1}
                      alt={course.name}
                      className="programs-card-img"
                    />
                    <div className="programs-card-body">
                      <h5 className="programs-card-title">{course.name}</h5>
                      <p className="programs-card-text">{course.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có khóa học nào.</p>
              )}
            </div>
            <button
              className="programs-arrow-btn right"
              onClick={() => handleChangePage(true)}
              disabled={
                startIndex + COURSES_PER_PAGE >= courses.length ||
                fade === "out"
              }
              style={{
                position: "absolute",
                right: 100,
                top: "30%",
                zIndex: 2,
              }}
            >
              &#8594;
            </button>
          </div>
        </div>
        <div className="programs-describe">
          <div className="d-flex justify-content-center align-items-center mt-5">
            <img
              src={IMAGES.program_describe_image}
              alt="Khóa học 1"
              className="programs-describe-img"
            />
            <div className="programs-describe-content">
              <h5 className="programs-describe-title">Dạy học 1 kèm 1</h5>
              <hr className="programs-describe-divider" />
              <div className="programs-describe-body">
                <div className="d-flex align-items-center mb-2">
                  <PiStudent />
                  <div className="ms-2">
                    <span className="orange-primary">1</span> v
                    <span className="orange-primary"> 1</span> trực tuyến
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FaRegClock />
                  <div className="ms-2">
                    <span className="orange-primary">60</span> phút
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LearningPathSection />
      <EnglishRoadmapSection />
      <div id="teachers" className="teachers-container">
        <p className="teachers-title">200+ Giáo viên CÓ CHỨNG CHỈ GIẢNG DẠY</p>
        <p className="teachers-description">
          Đội ngũ giáo viên của chúng tôi là những người có kinh nghiệm và tâm
          huyết với nghề.
        </p>
        <div className="teachers-cards d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="teacher-card flex-row-reverse">
              <img
                src={IMAGES.teacher_portrait}
                alt="Giáo viên 1"
                className="teacher-card-img"
              />
              <div className="teacher-card-info me-3">
                <div className="teacher-card-name">Giáo viên 1</div>
                <hr className="teacher-card-divider" />
                <div className="teacher-card-certificates">
                  <p>Chứng chỉ:</p>
                  <ul>
                    <li>IELTS 8.0</li>
                    <li>TOEFL 110</li>
                    <li>TESOL</li>
                    <li>Chứng chỉ Sư phạm Quốc tế</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="teacher-card">
              <img
                src={IMAGES.teacher_portrait}
                alt="Giáo viên 2"
                className="teacher-card-img"
              />
              <div className="teacher-card-info ms-3">
                <div className="teacher-card-name">Giáo viên 1</div>
                <hr className="teacher-card-divider" />
                <div className="teacher-card-certificates">
                  <p>Chứng chỉ:</p>
                  <ul>
                    <li>IELTS 8.0</li>
                    <li>TOEFL 110</li>
                    <li>TESOL</li>
                    <li>Chứng chỉ Sư phạm Quốc tế</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="teacher-card flex-row-reverse">
              <img
                src={IMAGES.teacher_portrait}
                alt="Giáo viên 1"
                className="teacher-card-img"
              />
              <div className="teacher-card-info me-3">
                <div className="teacher-card-name">Giáo viên 1</div>
                <hr className="teacher-card-divider" />
                <div className="teacher-card-certificates">
                  <p>Chứng chỉ:</p>
                  <ul>
                    <li>IELTS 8.0</li>
                    <li>TOEFL 110</li>
                    <li>TESOL</li>
                    <li>Chứng chỉ Sư phạm Quốc tế</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="teacher-card">
              <img
                src={IMAGES.teacher_portrait}
                alt="Giáo viên 2"
                className="teacher-card-img"
              />
              <div className="teacher-card-info ms-3">
                <div className="teacher-card-name">Giáo viên 1</div>
                <hr className="teacher-card-divider" />
                <div className="teacher-card-certificates">
                  <p>Chứng chỉ:</p>
                  <ul>
                    <li>IELTS 8.0</li>
                    <li>TOEFL 110</li>
                    <li>TESOL</li>
                    <li>Chứng chỉ Sư phạm Quốc tế</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="about" className="about-container">
        <div className="d-flex">
          <div className="about-ceo-image w-50">
            <img src={IMAGES.ceo_image} className="w-100" alt="" />
          </div>
          <div className="about-ceo-content w-50 d-flex flex-column justify-content-center">
            <h4 className="ceo-title">Lời nói từ CEO</h4>
            <p className="ceo-message">
              "Ngôn ngữ mở ra cơ hội. Tại Kyna English, giáo dục là giá trị cốt
              lõi của chúng tôi và việc tận dụng công nghệ sẽ xóa bỏ mọi ranh
              giới của giáo dục truyền thống, mang lại cơ hội tiếp cận bình đẳng
              cho hàng triệu học sinh."
            </p>
            <p className="ceo-name">Bà Trâm Hồ</p>
            <p className="ceo-role">Đồng sáng lập và CEO của Kyna English</p>
            <p className="ceo-bio">
              Sau khi tốt nghiệp từ một trường đại học hàng đầu tại Vương quốc
              Anh, bà Trâm trở về Việt Nam và bắt đầu sự nghiệp tại một công ty
              đầu tư mạo hiểm. Năm 2015, bà thành lập startup edtech đầu tiên
              của mình và đã mở rộng quy mô để đạt hơn 500.000+ học viên trước
              khi chuyển giao dự án này cho một công ty nhân sự hàng đầu tại
              Việt Nam. Sau đó, bà thành lập Kyna English vào năm 2020 với tầm
              nhìn mang đến chương trình đào tạo tiếng Anh chất lượng cao cho
              hàng triệu học sinh tại Đông Nam Á.
            </p>
          </div>
        </div>
        <div className="d-flex flex-row-reverse">
          <div className="about-student-image student-1"></div>
          <div className="about-student-content w-50 d-flex flex-column justify-content-center">
            <h4 className="student-title">Our vision</h4>
            <hr className="student-divider" />
            <p className="student-bio">
              Empower and unlock opportunities for the younger generation
            </p>
          </div>
        </div>
        <div className="d-flex">
          <div className="about-student-image student-2"></div>
          <div className="about-student-content w-50 d-flex flex-column justify-content-center">
            <h4 className="student-title">Our vision</h4>
            <hr className="student-divider" />
            <p className="student-bio">
              Empower and unlock opportunities for the younger generation
            </p>
          </div>
        </div>
      </div>
      <button
        className="floating-consult-btn"
        onClick={() => setShowModal(true)}
        title="Nhận tư vấn miễn phí"
      >
        Nhận tư vấn miễn phí
      </button>
      <ContactConsultModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default Homepage;
