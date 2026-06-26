import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiErrorMessage, getCommunityPosts } from '../api/careernetApi';
import { ErrorBox, PageShell, StateText, badgeStyle, cardLinkStyle, searchInputStyle } from './RecruitPage.jsx';

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                setPosts(await getCommunityPosts());
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
            return posts;
        }
        return posts.filter((post) => [post.category, post.title, post.summary, post.author]
            .some((value) => String(value || '').toLowerCase().includes(normalized)));
    }, [posts, keyword]);

    return (
        <PageShell title="커뮤니티" description="진로 탐색 후기, 질문, 공지사항을 확인합니다.">
            <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="게시글 제목, 분류, 작성자로 검색"
                style={searchInputStyle}
            />
            {loading && <StateText>게시글을 불러오는 중입니다.</StateText>}
            {error && <ErrorBox>{error}</ErrorBox>}
            {!loading && !error && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filtered.map((post) => (
                        <Link key={post.postId} to={`/community/${post.postId}`} style={cardLinkStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: 0 }}>
                                    <span style={badgeStyle}>{post.category}</span>
                                    {post.pinned && <span style={{ ...badgeStyle, background: '#fef2f2', color: '#b91c1c' }}>공지</span>}
                                </div>
                                <span style={{ color: '#9ca3af', fontSize: '12px' }}>{formatDate(post.createdAt)}</span>
                            </div>
                            <h3 style={{ color: '#111827', fontSize: '17px', margin: '0 0 6px' }}>{post.title}</h3>
                            <p style={{ color: '#4b5563', fontSize: '13px', lineHeight: 1.6, margin: '0 0 10px' }}>{post.summary}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '12px' }}>
                                <span>{post.author}</span>
                                <span>조회 {post.viewCount}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PageShell>
    );
};

export function formatDate(value) {
    if (!value) {
        return '';
    }
    return new Date(value).toLocaleDateString('ko-KR');
}

export default CommunityPage;
