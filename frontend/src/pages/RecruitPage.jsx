import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiErrorMessage, getRecruitments } from '../api/careernetApi';

const RecruitPage = () => {
    const [items, setItems] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                setItems(await getRecruitments());
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        const normalized = keyword.trim().toLowerCase();
        if (!normalized) {
            return items;
        }
        return items.filter((item) => [
            item.companyName,
            item.title,
            item.location,
            item.jobName,
            item.jobCategory,
            item.summary,
        ].some((value) => String(value || '').toLowerCase().includes(normalized)));
    }, [items, keyword]);

    return (
        <PageShell
            title="채용공고"
            description="직업 정보와 연결된 채용공고를 확인하고 실제 시장에서 요구하는 역량을 비교합니다."
        >
            <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="회사명, 직무, 지역으로 검색"
                style={searchInputStyle}
            />

            {loading && <StateText>채용공고를 불러오는 중입니다.</StateText>}
            {error && <ErrorBox>{error}</ErrorBox>}

            {!loading && !error && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                    {filtered.map((item) => (
                        <Link key={item.recruitmentId} to={`/recruit/${item.recruitmentId}`} style={cardLinkStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                                <div>
                                    <div style={{ color: '#1a365d', fontSize: '12px', fontWeight: 800 }}>{item.companyName}</div>
                                    <h3 style={{ margin: '4px 0 0', color: '#111827', fontSize: '17px', lineHeight: 1.35 }}>
                                        {item.title}
                                    </h3>
                                </div>
                                <span style={badgeStyle}>{item.employmentType}</span>
                            </div>
                            <p style={{ margin: '0 0 14px', color: '#4b5563', lineHeight: 1.6, fontSize: '13px' }}>
                                {item.summary}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                                {[item.location, item.careerLevel, item.jobName].filter(Boolean).map((label) => (
                                    <span key={label} style={smallChipStyle}>{label}</span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '12px' }}>
                                <span>{item.jobCategory || '직업 정보'}</span>
                                <strong style={{ color: '#dc2626' }}>{formatDeadline(item.deadlineDate)}</strong>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PageShell>
    );
};

export const PageShell = ({ title, description, children }) => (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px 56px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <div style={{ marginBottom: '22px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
                    {title}
                </h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                    {description}
                </p>
            </div>
            {children}
        </div>
    </div>
);

export const StateText = ({ children }) => (
    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>{children}</div>
);

export const ErrorBox = ({ children }) => (
    <div style={{
        background: '#fff5f5',
        border: '1px solid #fecaca',
        color: '#b91c1c',
        borderRadius: '8px',
        padding: '14px',
        marginBottom: '16px',
    }}>
        {children}
    </div>
);

export const searchInputStyle = {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px 13px',
    fontSize: '14px',
    background: '#fff',
    marginBottom: '18px',
};

export const cardLinkStyle = {
    display: 'block',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '18px',
    color: 'inherit',
    textDecoration: 'none',
};

export const badgeStyle = {
    alignSelf: 'flex-start',
    borderRadius: '999px',
    background: '#eff6ff',
    color: '#1e40af',
    padding: '4px 9px',
    fontSize: '11px',
    fontWeight: 800,
    whiteSpace: 'nowrap',
};

export const smallChipStyle = {
    borderRadius: '999px',
    background: '#f3f4f6',
    color: '#4b5563',
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 700,
};

function formatDeadline(value) {
    if (!value) {
        return '상시채용';
    }
    return `마감 ${new Date(value).toLocaleDateString('ko-KR')}`;
}

export default RecruitPage;
