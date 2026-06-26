import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getApiErrorMessage, getRecruitment } from '../api/careernetApi';
import { ErrorBox, PageShell, StateText, badgeStyle, smallChipStyle } from './RecruitPage.jsx';

const RecruitDetailPage = () => {
    const { recruitmentId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                setItem(await getRecruitment(recruitmentId));
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [recruitmentId]);

    return (
        <PageShell title="채용공고 상세" description="공고의 주요 조건과 연결된 직업 정보를 함께 확인합니다.">
            {loading && <StateText>채용공고를 불러오는 중입니다.</StateText>}
            {error && <ErrorBox>{error}</ErrorBox>}
            {item && (
                <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
                        <div>
                            <div style={{ color: '#1a365d', fontSize: '13px', fontWeight: 800 }}>{item.companyName}</div>
                            <h2 style={{ margin: '6px 0 0', color: '#111827', fontSize: '24px' }}>{item.title}</h2>
                        </div>
                        <span style={badgeStyle}>{item.employmentType}</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                        {[item.location, item.careerLevel, item.jobName, item.jobCategory].filter(Boolean).map((label) => (
                            <span key={label} style={smallChipStyle}>{label}</span>
                        ))}
                    </div>

                    <p style={{ color: '#374151', lineHeight: 1.75, fontSize: '14px', margin: '0 0 18px' }}>
                        {item.description || item.summary}
                    </p>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {item.jobId && (
                            <Link to={`/jobs/${item.jobId}`} style={primaryButtonStyle}>연결된 직업 정보 보기</Link>
                        )}
                        {item.sourceUrl && (
                            <a href={item.sourceUrl} target="_blank" rel="noreferrer" style={secondaryButtonStyle}>
                                원문 공고 열기
                            </a>
                        )}
                    </div>
                </section>
            )}
        </PageShell>
    );
};

const primaryButtonStyle = {
    border: 'none',
    borderRadius: '8px',
    background: '#1a365d',
    color: '#fff',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 800,
    textDecoration: 'none',
};

const secondaryButtonStyle = {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#fff',
    color: '#374151',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 800,
    textDecoration: 'none',
};

export default RecruitDetailPage;
