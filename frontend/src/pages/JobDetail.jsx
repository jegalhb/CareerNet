// src/pages/JobDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JobDetailStep from '../components/career/JobDetailStep';
import { getApiErrorMessage, getJob } from '../api/careernetApi';
import { mapApiJobToCard } from '../utils/apiMappers';

const JobDetail = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadJob = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getJob(jobId);
                setJob(mapApiJobToCard(data));
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        loadJob();
    }, [jobId]);

    if (loading) {
        return <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#6b7280' }}>직업 상세 정보를 불러오는 중입니다.</div>;
    }

    if (error) {
        return <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#b91c1c' }}>{error}</div>;
    }

    if (!job) {
        return <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>직업 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '56px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
                <JobDetailStep
                    job={job}
                    assessmentResult={null}
                    onBack={() => navigate('/jobs')}
                    onReset={() => navigate('/design')}
                />
            </div>
        </div>
    );
};

export default JobDetail;
