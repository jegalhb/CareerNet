import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiErrorMessage, getJobs } from '../api/careernetApi';
import { mapApiJobToCard } from '../utils/apiMappers';

const JobSlider = () => {
    const [jobs, setJobs] = useState([]);
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [error, setError] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data.slice(0, 12).map(mapApiJobToCard));
            } catch (err) {
                setError(getApiErrorMessage(err));
            }
        };
        loadJobs();
    }, []);

    useEffect(() => {
        if (isPlaying && jobs.length > 1) {
            timerRef.current = setInterval(() => {
                setIndex((prev) => (prev + 1) % jobs.length);
            }, 4000);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, jobs.length]);

    const handlePrev = () => setIndex((prev) => (prev - 1 + jobs.length) % jobs.length);
    const handleNext = () => setIndex((prev) => (prev + 1) % jobs.length);
    const currentJob = jobs[index];

    return (
        <div className="job-slider-wrap ann-parent">
            <div className="slider-header">
                <span className="slider-title">직업정보</span>
                <div className="slider-controls">
                    <button className="slider-ctrl-btn" onClick={handlePrev} disabled={!jobs.length}>‹</button>
                    <button className="slider-ctrl-btn" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? '일시정지' : '재생'}
                    </button>
                    <button className="slider-ctrl-btn" onClick={handleNext} disabled={!jobs.length}>›</button>
                </div>
            </div>

            {error && <p style={{ color: '#b91c1c', fontSize: '12px' }}>{error}</p>}
            {!error && !currentJob && <p style={{ color: '#6b7280', fontSize: '12px' }}>직업 정보를 불러오는 중입니다.</p>}

            {currentJob && (
                <Link to={`/jobs/${currentJob.jobId}`} className="info-slider-card" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <div>
                        <div className="card-job-title" style={{ fontSize: '14px', marginBottom: '10px', textAlign: 'left' }}>
                            {currentJob.title}
                        </div>
                        <div className="card-top-split">
                            <div className="card-display-zone">
                                <img src={currentJob.imageUrl} alt={`${currentJob.title} 관련 이미지`} />
                            </div>
                            <div className="card-stats-zone">
                                <div className="stat-row">
                                    <span className="stat-label">직무 분야</span>
                                    <span className="stat-value">{currentJob.category}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">평균 연봉</span>
                                    <span className="stat-value">{currentJob.avgSalary}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">전망</span>
                                    <span className="stat-value">{currentJob.outlookLabel}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="card-bottom-desc">{currentJob.desc}</p>
                </Link>
            )}
        </div>
    );
};

export default JobSlider;
