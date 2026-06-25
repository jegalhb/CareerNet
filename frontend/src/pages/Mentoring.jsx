// src/pages/Mentoring.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { createMentoringRequest, getApiErrorMessage, getMentor, getMentors } from '../api/careernetApi';
import { mapApiMentorToCard } from '../utils/apiMappers';
import { useAuth } from '../context/Useauth.jsx';

const Mentoring = () => {
    const { user, isLoggedIn } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [requestStatus, setRequestStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadMentors = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getMentors();
                setMentors(data.map(mapApiMentorToCard));
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        loadMentors();
    }, []);

    const handleSelectMentor = async (mentor) => {
        setSelectedMentor(mentor);
        setRequestMessage('');
        setRequestStatus('');

        try {
            const detail = await getMentor(mentor.mentorId);
            setSelectedMentor(mapApiMentorToCard(detail));
        } catch {
            setSelectedMentor(mentor);
        }
    };

    const handleCreateRequest = async () => {
        if (!isLoggedIn || !user?.userId) {
            setRequestStatus('로그인 후 멘토링을 신청할 수 있습니다.');
            return;
        }

        const firstJob = selectedMentor?.relatedJobs?.[0];
        if (!selectedMentor || !firstJob?.jobId) {
            setRequestStatus('멘토와 연결된 직업 정보를 불러온 뒤 다시 시도해주세요.');
            return;
        }

        setSubmitting(true);
        setRequestStatus('');
        try {
            const created = await createMentoringRequest({
                userId: user.userId,
                mentorId: selectedMentor.mentorId,
                jobId: firstJob.jobId,
                requestMessage,
            });
            setRequestStatus(`${created.mentorName} 멘토에게 신청이 접수되었습니다.`);
            setRequestMessage('');
        } catch (err) {
            setRequestStatus(getApiErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    const filteredMentors = useMemo(() => {
        const normalized = keyword.trim().toLowerCase();
        if (!normalized) {
            return mentors;
        }
        return mentors.filter((mentor) => (
            mentor.name.toLowerCase().includes(normalized)
            || mentor.jobTitle.toLowerCase().includes(normalized)
            || (mentor.companyName || '').toLowerCase().includes(normalized)
            || (mentor.shortDescription || '').toLowerCase().includes(normalized)
        ));
    }, [mentors, keyword]);

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px 56px' }}>
            <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
                <div style={{ marginBottom: '22px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
                        현직자 1:1 멘토링 광장
                    </h2>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                        백엔드 멘토 API에서 불러온 실무자 멘토를 탐색합니다.
                    </p>
                </div>

                <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="멘토명, 직무, 회사, 설명으로 검색"
                    style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '11px 12px',
                        fontSize: '14px',
                        background: '#fff',
                        marginBottom: '16px',
                    }}
                />

                {loading && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        멘토 정보를 불러오는 중입니다.
                    </div>
                )}

                {error && (
                    <div style={{
                        background: '#fff5f5',
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        borderRadius: '8px',
                        padding: '14px',
                        marginBottom: '16px',
                    }}>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                                총 {filteredMentors.length}명 멘토
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                                {filteredMentors.map((mentor) => (
                                    <button
                                        key={mentor.mentorId}
                                        type="button"
                                        onClick={() => handleSelectMentor(mentor)}
                                        style={{
                                            textAlign: 'left',
                                            background: '#fff',
                                            border: selectedMentor?.mentorId === mentor.mentorId ? '1.5px solid #1a365d' : '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            padding: '15px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                            <img
                                                src={mentor.profileImageUrl}
                                                alt={mentor.name}
                                                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', background: '#e5e7eb' }}
                                            />
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>{mentor.name}</div>
                                                <div style={{ fontSize: '11px', color: '#6b7280' }}>{mentor.companyName}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#1a365d', fontWeight: 700, marginBottom: '6px' }}>
                                            {mentor.jobTitle}
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.55, margin: 0 }}>
                                            {mentor.shortDescription}
                                        </p>
                                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '10px' }}>
                                            추천 {mentor.recommendationCount}회
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <aside style={{
                            position: 'sticky',
                            top: '80px',
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '18px',
                        }}>
                            {selectedMentor ? (
                                <>
                                    <img
                                        src={selectedMentor.profileImageUrl}
                                        alt={selectedMentor.name}
                                        style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', background: '#e5e7eb', marginBottom: '12px' }}
                                    />
                                    <h3 style={{ fontSize: '18px', color: '#111827', margin: '0 0 4px' }}>{selectedMentor.name}</h3>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                                        {selectedMentor.jobTitle} · {selectedMentor.companyName}
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#1f2937', fontWeight: 700, lineHeight: 1.6 }}>
                                        {selectedMentor.headline}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.7 }}>
                                        {selectedMentor.shortDescription}
                                    </p>
                                    {selectedMentor.relatedJobs?.length > 0 && (
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                            {selectedMentor.relatedJobs.slice(0, 3).map((job) => (
                                                <span key={job.jobId} style={{
                                                    fontSize: '11px',
                                                    background: '#eff6ff',
                                                    color: '#1e40af',
                                                    borderRadius: '999px',
                                                    padding: '3px 8px',
                                                }}>
                                                    {job.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <textarea
                                        value={requestMessage}
                                        onChange={(event) => setRequestMessage(event.target.value)}
                                        placeholder="멘토에게 전달할 신청 메시지"
                                        style={{
                                            width: '100%',
                                            minHeight: '86px',
                                            boxSizing: 'border-box',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            fontSize: '12px',
                                            resize: 'vertical',
                                            marginBottom: '10px',
                                        }}
                                    />
                                    {requestStatus && (
                                        <p style={{
                                            fontSize: '12px',
                                            color: requestStatus.includes('접수') ? '#059669' : '#b91c1c',
                                            lineHeight: 1.5,
                                            margin: '0 0 10px',
                                        }}>
                                            {requestStatus}
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleCreateRequest}
                                        disabled={submitting}
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            borderRadius: '8px',
                                            background: submitting ? '#9ca3af' : '#1a365d',
                                            color: '#fff',
                                            padding: '10px',
                                            fontSize: '13px',
                                            fontWeight: 800,
                                            cursor: submitting ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {submitting ? '신청 중...' : '멘토링 신청하기'}
                                    </button>
                                </>
                            ) : (
                                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                                    왼쪽에서 멘토를 선택하면 상세 정보가 표시됩니다.
                                </p>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mentoring;
