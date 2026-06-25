// src/pages/JobInfo.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiErrorMessage, getJobs } from '../api/careernetApi';
import { mapApiJobToCard } from '../utils/apiMappers';

const JobInfo = () => {
    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('전체');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getJobs();
                setJobs(data.map(mapApiJobToCard));
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    }, []);

    const categories = useMemo(
        () => ['전체', ...Array.from(new Set(jobs.map((job) => job.category))).filter(Boolean)],
        [jobs]
    );

    const filteredJobs = useMemo(() => {
        const normalized = keyword.trim().toLowerCase();
        return jobs.filter((job) => {
            const matchesCategory = category === '전체' || job.category === category;
            const matchesKeyword = !normalized
                || job.title.toLowerCase().includes(normalized)
                || job.category.toLowerCase().includes(normalized)
                || job.desc.toLowerCase().includes(normalized);
            return matchesCategory && matchesKeyword;
        });
    }, [jobs, keyword, category]);

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px 56px' }}>
            <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
                <div style={{ marginBottom: '22px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
                        전체 직업 정보 탐색
                    </h2>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                        백엔드 직업 API에서 불러온 직업 정보를 탐색합니다.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 220px',
                    gap: '10px',
                    marginBottom: '18px',
                }}>
                    <input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="직업명, 분야, 설명으로 검색"
                        style={{
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '11px 12px',
                            fontSize: '14px',
                            background: '#fff',
                        }}
                    />
                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        style={{
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '11px 12px',
                            fontSize: '14px',
                            background: '#fff',
                        }}
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        직업 정보를 불러오는 중입니다.
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
                    <>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                            총 {filteredJobs.length}개 직업
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '12px',
                        }}>
                            {filteredJobs.map((job) => (
                                <Link
                                    key={job.jobId}
                                    to={`/jobs/${job.jobId}`}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                        minHeight: '186px',
                                        background: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '28px' }}>{job.emoji}</span>
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>
                                                {job.title}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#6b7280' }}>{job.category}</div>
                                        </div>
                                    </div>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#4b5563',
                                        lineHeight: 1.55,
                                        margin: 0,
                                        flex: 1,
                                    }}>
                                        {job.desc}
                                    </p>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {job.hollandCodes.map((code) => (
                                            <span key={code} style={{
                                                fontSize: '10px',
                                                background: '#eff6ff',
                                                color: '#1e40af',
                                                padding: '3px 7px',
                                                borderRadius: '999px',
                                            }}>
                                                {code}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280' }}>
                                        <span>{job.avgSalary}</span>
                                        <span>{job.outlookLabel}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default JobInfo;
