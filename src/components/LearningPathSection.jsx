import React from "react";
import { IMAGES } from "../constants/images";
import "./LearningPathSection.scss";

const LearningPathSection = () => (
  <section className="learning-path-section">
    <div className="features">
      <div className="feature feature-fun-learning character-left">
        <div className="feature-content">
          <h2>HỌC VUI VẺ</h2>
          <p>
            Lớp học tràn ngập các dự án sáng tạo và hoạt động thực hành. Chúng
            tôi tạo môi trường tích cực, khuyến khích học viên tự tin khám phá,
            thử nghiệm và thể hiện bản thân. Hãy cùng khám phá niềm vui khi học
            tiếng Anh!
          </p>
        </div>
        <img
          className="feature-character"
          src={IMAGES.girl_2_image}
          alt="Học vui vẻ"
        />
      </div>
      <div className="feature feature-guaranteed-work character-right">
        <div className="feature-content">
          <h2>CAM KẾT ĐẦU RA</h2>
          <p>
            Để đạt được cam kết này, học viên cần đáp ứng các tiêu chí: đạt điểm
            trung bình tối thiểu 80%, duy trì chuyên cần 90% và tham gia đầy đủ
            các hoạt động. Sự nỗ lực của bạn cùng chương trình đào tạo sẽ mở ra
            con đường thành công!
          </p>
        </div>
        <img
          className="feature-character"
          src={IMAGES.boy_1_image}
          alt="Cam kết đầu ra"
        />
      </div>
      <div className="feature feature-resources character-left">
        <div className="feature-content">
          <h2>TÀI NGUYÊN PHONG PHÚ</h2>
          <p>
            Chúng tôi cung cấp bộ công cụ và tài liệu đa dạng, từ thư viện số,
            sách điện tử, bài kiểm tra thực hành đến các nền tảng học tập tương
            tác, giúp bạn học tập hiệu quả mọi lúc, mọi nơi.
          </p>
        </div>
        <img
          className="feature-character"
          src={IMAGES.girl_1_image}
          alt="Đội ngũ giáo viên"
        />
      </div>
      <div className="feature feature-teachers character-right">
        <div className="feature-content">
          <h2>ĐỘI NGŨ GIÁO VIÊN</h2>
          <p>
            Giáo viên có chứng chỉ quốc tế (IELTS, TOEIC, TESOL,...) và kinh
            nghiệm giảng dạy đa dạng. Mỗi giáo viên đều mang đến góc nhìn văn
            hóa và kiến thức chuyên sâu về ngôn ngữ.
          </p>
        </div>
        <img
          className="feature-character"
          src={IMAGES.boy_2_image}
          alt="Tài nguyên phong phú"
        />
      </div>
    </div>
  </section>
);

export default LearningPathSection;
