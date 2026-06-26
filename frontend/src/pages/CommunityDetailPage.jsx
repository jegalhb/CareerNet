import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApiErrorMessage, getCommunityPost } from '../api/careernetApi';
import { ErrorBox, PageShell, StateText, badgeStyle } from './RecruitPage.jsx';
import { formatDate } from './CommunityPage.jsx';

const CommunityDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                setPost(await getCommunityPost(postId));
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [postId]);

    return (
        <PageShell title="커뮤니티 상세" description="게시글 내용을 확인합니다.">
            {loading && <StateText>게시글을 불러오는 중입니다.</StateText>}
            {error && <ErrorBox>{error}</ErrorBox>}
            {post && (
                <article style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <span style={badgeStyle}>{post.category}</span>
                        {post.pinned && <span style={{ ...badgeStyle, background: '#fef2f2', color: '#b91c1c' }}>공지</span>}
                    </div>
                    <h2 style={{ color: '#111827', fontSize: '24px', margin: '0 0 10px' }}>{post.title}</h2>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '22px' }}>
                        {post.author} · {formatDate(post.createdAt)} · 조회 {post.viewCount}
                    </div>
                    <p style={{ whiteSpace: 'pre-line', color: '#374151', fontSize: '14px', lineHeight: 1.8, margin: 0 }}>
                        {post.content || post.summary}
                    </p>
                </article>
            )}
        </PageShell>
    );
};

export default CommunityDetailPage;
