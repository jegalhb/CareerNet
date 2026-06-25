// src/pages/Mentoring.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getApiErrorMessage, getMentors } from '../api/careernetApi';
import { mapApiMentorToCard } from '../utils/apiMappers';

const Mentoring = () => {
    const [mentors, setMentors] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [selectedMentor, setSelectedMentor] = useState(null);
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
                                        onClick={() => setSelectedMentor(mentor)}
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
                                    <button
                                        type="button"
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            borderRadius: '8px',
                                            background: '#1a365d',
                                            color: '#fff',
                                            padding: '10px',
                                            fontSize: '13px',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        멘토링 신청하기
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
