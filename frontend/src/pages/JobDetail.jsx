// src/pages/JobDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const JobDetail = () => {
    const { jobId } = useParams(); // URL 주소창에서 /jobs/뒤에 오는 키워드를 자동으로 읽어옵니다.

    return (
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <h2>🔍 직업 상세 조회: <span style={{ color: 'var(--blue-600)' }}>{jobId}</span></h2>
            <p style={{ color: 'var(--gray-600)', marginTop: '10px' }}>
                이 페이지의 URL 주소를 복사해서 타인에게 공유하면 이 직업의 정보가 그대로 보이게 됩니다.
            </p>
        </div>
    );
};

export default JobDetail;