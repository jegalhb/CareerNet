// src/components/JobCard.jsx
import React, { useState } from 'react';

const JobCard = ({ emoji, title, desc, outlook, videoUrl }) => {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <div className="job-card">
            <div className="card-media">
                {!showVideo ? (
                    <div className="card-media-img">{emoji}</div>
                ) : (
                    <div className="card-media-video show">
            <span style={{ color: '#fff', fontSize: '11px', textAlign: 'center', padding: '8px' }}>
              ▶ YouTube iframe 영역<br />
              <span style={{ opacity: 0.6 }}>({videoUrl || "videoUrl prop"})</span>
            </span>
                    </div>
                )}
                <button className="video-btn" onClick={() => setShowVideo(!showVideo)}>
                    <i className={`ti ${showVideo ? 'ti-photo' : 'ti-player-play'}`} aria-hidden="true"></i>
                    {showVideo ? ' 이미지 보기' : ' 실무 영상'}
                </button>
            </div>
            <div className="card-body">
                <div className="card-job-title">{title}</div>
                <div className="card-desc">{desc}</div>
                <div className="card-footer">
          <span className={`outlook-badge ${outlook === 'stable' ? 'outlook-stable' : 'outlook-up'}`}>
            {outlook === 'stable' ? '→ 안정적' : '↑ 전망 밝음'}
          </span>
                    <button className="roadmap-add-btn">
                        <i className="ti ti-heart" aria-hidden="true"></i> 즐겨찾기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCard;