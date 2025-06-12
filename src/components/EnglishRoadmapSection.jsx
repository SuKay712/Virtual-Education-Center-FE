import React from "react";
import { IMAGES } from "../constants/images";
import "./EnglishRoadmapSection.scss";

const roadmapData = [
  {
    label: "MẦM NON",
    age: "02 - 05 tuổi",
    image: IMAGES.boy_kindergarten_image,
    roadmap: IMAGES.roadmap_kindergarten_image,
    items: [
      "Khám phá tiếng Anh: Từ vựng & âm thanh đầu đời",
      "Giao tiếp tiếng Anh: Cuộc sống hàng ngày",
      "Hành trình tiếng Anh: Kỹ năng tích hợp",
    ],
  },
  {
    label: "STARTERS",
    age: "05 - 08 tuổi",
    image: IMAGES.girl_starter_image,
    roadmap: IMAGES.roadmap_starter_image,
    items: [
      "Tự tin nói tiếng Anh cho người mới bắt đầu",
      "Phonics & Đọc hiểu: Phiên bản Starters",
      "Khám phá tiếng Anh: Học qua dự án",
    ],
  },
  {
    label: "MOVERS",
    age: "09 - 12 tuổi",
    image: IMAGES.girl_mover_image,
    roadmap: IMAGES.roadmap_mover_image,
    items: [
      "Tiếng Anh thực hành: Kết nối thế giới",
      "Cầu nối kỹ năng: Hội nhập toàn cầu",
      "Khám phá tiếng Anh: Học qua dự án",
    ],
  },
  {
    label: "FLYERS",
    age: "13 - 17 tuổi",
    image: IMAGES.girl_flyers_image,
    roadmap: IMAGES.roadmap_flyers_image,
    items: [
      "Nền tảng tiếng Anh Flyers",
      "Luyện thi Flyers chuyên sâu",
      "Lộ trình học Flyers toàn diện",
    ],
  },
  {
    label: "Người lớn",
    age: "18+ tuổi",
    image: IMAGES.boy_teenadults_image,
    roadmap: IMAGES.roadmap_teenadults_image,
    items: [
      "Thành thạo giao tiếp tiếng Anh nâng cao",
      "Tiếng Anh học thuật & chuyên nghiệp",
      "Tiếng Anh thực tiễn cho cuộc sống & sự nghiệp",
    ],
  },
];

const EnglishRoadmapSection = () => (
  <section className="english-roadmap-section vi-bg">
    <div className="roadmap-header">
      <h2 className="roadmap-title">LỘ TRÌNH HỌC TIẾNG ANH</h2>
      <div className="roadmap-badge">ROADMAP</div>
    </div>
    <div className="roadmap-list">
      {roadmapData.map((block, idx) => {
        const isReverse = idx % 2 === 1;
        return (
          <div
            className={`roadmap-block${isReverse ? " roadmap-block-reverse" : ""}`}
            key={block.label}
          >
            {/* Nhân vật */}
            <div className="roadmap-block-character-wrap">
              <img
                src={block.image}
                alt={block.label}
                className="roadmap-block-character-img"
              />
            </div>
            {/* Nội dung */}
            <div className="roadmap-block-main">
              <div className="roadmap-block-age-title">
                <span className="roadmap-block-age">{block.age}</span>
                <div className="roadmap-block-age-underline"></div>
              </div>
              <ol className="roadmap-block-list">
                {block.items.map((item, i) => (
                  <li key={i}>
                    <span className="roadmap-block-num">
                      {String(i + 1).padStart(2, "0")}.
                    </span>{" "}
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            {/* Roadmap + badge label */}
            <div className="roadmap-block-roadwrap">
              <div className="roadmap-block-label-badge roadmap-block-label-green">
                {block.label}
              </div>
              <img
                src={block.roadmap}
                alt="roadmap"
                className="roadmap-block-road"
              />
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default EnglishRoadmapSection;
