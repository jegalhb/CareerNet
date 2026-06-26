// src/pages/JobDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JobDetailStep from '../components/career/JobDetailStep';
import {
    createJobBookmark,
    deleteJobBookmark,
    getApiErrorMessage,
    getJob,
    getJobBookmarkStatus,
} from '../api/careernetApi';
import { useAuth } from '../context/Useauth.jsx';
import { mapApiJobToCard } from '../utils/apiMappers';

const JobDetail = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    const [job, setJob] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
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

    useEffect(() => {
        if (!isLoggedIn || !user?.userId || !jobId) {
            setBookmarked(false);
            return;
        }

        const loadBookmark = async () => {
            try {
                const data = await getJobBookmarkStatus(user.userId, jobId);
                setBookmarked(!!data.bookmarked);
            } catch {
                setBookmarked(false);
            }
        };
        loadBookmark();
    }, [isLoggedIn, user?.userId, jobId]);

    const handleToggleBookmark = async () => {
        if (!isLoggedIn || !user?.userId) {
            alert('로그인 후 관심 직업을 저장할 수 있습니다.');
            return;
        }

        try {
            if (bookmarked) {
                await deleteJobBookmark(user.userId, jobId);
                setBookmarked(false);
            } else {
                await createJobBookmark(user.userId, jobId);
                setBookmarked(true);
            }
        } catch (err) {
            alert(getApiErrorMessage(err));
        }
    };

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
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '18px 0 0' }}>
                    <button
                        type="button"
                        onClick={handleToggleBookmark}
                        style={{
                            border: bookmarked ? '1px solid #1a365d' : '1px solid #d1d5db',
                            background: bookmarked ? '#1a365d' : '#fff',
                            color: bookmarked ? '#fff' : '#374151',
                            borderRadius: '999px',
                            padding: '9px 14px',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: 'pointer',
                        }}
                    >
                        {bookmarked ? '관심 직업 저장됨' : '관심 직업 저장'}
                    </button>
                </div>
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
