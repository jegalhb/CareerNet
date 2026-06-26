// src/pages/MyPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    getApiErrorMessage,
    getUserAssessment,
    getUserAssessments,
    getUserJobBookmarks,
    getUserMentoringRequests,
} from '../api/careernetApi';
import { useAuth } from '../context/Useauth.jsx';

const TABS = [
    { id: 'profile', label: '내 프로필', path: '/mypage/profile' },
    { id: 'roadmap', label: '내 진로 로드맵', path: '/mypage/roadmap' },
    { id: 'bookmarks', label: '즐겨찾기', path: '/mypage/bookmarks' },
    { id: 'tests', label: '검사 결과', path: '/mypage/tests' },
    { id: 'mentoring', label: '멘토링 내역', path: '/mypage/mentoring' },
];

const TYPE_NAMES = {
    R: '실재형',
    I: '탐구형',
    A: '예술형',
    S: '사회형',
    E: '진취형',
    C: '관습형',
};

const ROADMAP_STEPS = [
    {
        label: '진단',
        title: '진단 단계',
        desc: '나의 흥미와 강점을 확인하고 첫 진로 방향을 잡습니다.',
        items: ['흥미검사(Holland) 완료하기', '강점 자기진단 작성하기', '진로 상담사와 결과 리뷰 신청'],
    },
    {
        label: '직업선택',
        title: '직업선택 단계',
        desc: '검사 결과와 관심 분야를 바탕으로 후보 직업을 좁혀갑니다.',
        items: ['관심 직업 5개 이상 탐색하기', '직업별 연봉 및 전망 비교하기', '현직자 멘토 1명 이상 연결 신청'],
    },
    {
        label: '역량강화',
        title: '역량강화 단계',
        desc: '목표 직업에 필요한 지식, 기술, 경험을 준비합니다.',
        items: ['목표 직업 필수 스킬 3개 정리', '온라인 강의 수강 계획 수립', '포트폴리오 초안 작성 시작'],
    },
    {
        label: '멘토링',
        title: '멘토링 단계',
        desc: '실무자와 연결해 직무 현실과 준비 방향을 구체화합니다.',
        items: ['멘토링 신청하기', '현직자 인터뷰 노트 작성', '멘토 피드백 기반 로드맵 수정'],
    },
    {
        label: '취업',
        title: '취업 단계',
        desc: '이력서, 포트폴리오, 면접 준비를 통해 실제 지원으로 이어갑니다.',
        items: ['이력서 및 포트폴리오 최종본 완성', '목표 기업 지원 목록 작성', '최종 면접 대비 모의 면접 실시'],
    },
];

const MyPage = () => {
    const { user, isLoggedIn, authLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [mentoringRequests, setMentoringRequests] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const activeTab = useMemo(() => {
        const found = TABS.find((tab) => location.pathname.startsWith(tab.path));
        return found?.id || 'profile';
    }, [location.pathname]);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            navigate('/');
        }
    }, [authLoading, isLoggedIn, navigate]);

    useEffect(() => {
        if (!user?.userId) {
            return;
        }

        const loadData = async () => {
            setLoading(true);
            setError('');
            try {
                if (activeTab === 'tests') {
                    const data = await getUserAssessments(user.userId);
                    setAssessments(data);
                    if (data.length) {
                        const detail = await getUserAssessment(user.userId, data[0].assessmentId);
                        setSelectedAssessment(detail);
                    } else {
                        setSelectedAssessment(null);
                    }
                }

                if (activeTab === 'mentoring') {
                    const data = await getUserMentoringRequests(user.userId);
                    setMentoringRequests(data);
                }

                if (activeTab === 'bookmarks') {
                    const data = await getUserJobBookmarks(user.userId);
                    setBookmarks(data);
                }
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [activeTab, user?.userId]);

    const handleSelectAssessment = async (assessmentId) => {
        if (!user?.userId) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            setSelectedAssessment(await getUserAssessment(user.userId, assessmentId));
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !isLoggedIn) {
        return (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#6b7280' }}>
                사용자 정보를 확인하는 중입니다.
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px 56px' }}>
            <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', color: '#111827', margin: '0 0 6px', fontWeight: 800 }}>
                        마이페이지
                    </h2>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                        검사 결과와 멘토링 신청 내역을 확인합니다.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                    {TABS.map((tab) => (
                        <Link
                            key={tab.id}
                            to={tab.path}
                            style={{
                                textDecoration: 'none',
                                borderRadius: '999px',
                                padding: '8px 14px',
                                fontSize: '13px',
                                fontWeight: 800,
                                background: activeTab === tab.id ? '#1a365d' : '#fff',
                                color: activeTab === tab.id ? '#fff' : '#4b5563',
                                border: activeTab === tab.id ? '1px solid #1a365d' : '1px solid #e5e7eb',
                            }}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

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

                {activeTab === 'profile' && (
                    <ProfilePanel user={user} />
                )}

                {activeTab === 'roadmap' && (
                    <RoadmapPanel />
                )}

                {activeTab === 'bookmarks' && (
                    <BookmarkPanel bookmarks={bookmarks} loading={loading} />
                )}

                {activeTab === 'tests' && (
                    <AssessmentPanel
                        assessments={assessments}
                        selectedAssessment={selectedAssessment}
                        loading={loading}
                        onSelectAssessment={handleSelectAssessment}
                    />
                )}

                {activeTab === 'mentoring' && (
                    <MentoringPanel requests={mentoringRequests} loading={loading} />
                )}
            </div>
        </div>
    );
};

const ProfilePanel = ({ user }) => (
    <section style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '22px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#1a365d',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 800,
            }}>
                {user?.userNm?.slice(0, 1) || '?'}
            </div>
            <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{user?.userNm}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{user?.email}</div>
            </div>
        </div>
        <InfoGrid items={[
            ['사용자 ID', user?.userId],
            ['최종 학력', user?.education || '미입력'],
            ['관심 분야', user?.interest || '미입력'],
            ['권한', user?.role || 'USER'],
        ]} />
    </section>
);

const RoadmapPanel = () => (
    <section style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
    }}>
        <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '18px', color: '#111827', margin: '0 0 6px', fontWeight: 800 }}>
                내 진로 로드맵
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                진단부터 취업 준비까지 지금 필요한 행동을 단계별로 확인합니다.
            </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '18px' }}>
            {ROADMAP_STEPS.map((step, index) => {
                const isDone = index === 0;
                const isActive = index === 1;
                return (
                    <div key={step.label} style={{
                        border: isActive ? '1.5px solid #1a365d' : '1px solid #e5e7eb',
                        background: isDone ? '#eff6ff' : isActive ? '#1a365d' : '#fff',
                        color: isActive ? '#fff' : '#374151',
                        borderRadius: '8px',
                        padding: '13px 10px',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            margin: '0 auto 8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isActive ? 'rgba(255,255,255,0.22)' : isDone ? '#2563eb' : '#f3f4f6',
                            color: isDone || isActive ? '#fff' : '#6b7280',
                            fontSize: '12px',
                            fontWeight: 800,
                        }}>
                            {isDone ? '✓' : index + 1}
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 800 }}>{step.label}</div>
                        {isActive && <div style={{ fontSize: '10px', marginTop: '4px', color: '#dbeafe' }}>진행중</div>}
                    </div>
                );
            })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
            {ROADMAP_STEPS.map((step, index) => (
                <div key={step.title} style={{
                    border: index === 1 ? '1.5px solid #1a365d' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    background: index === 1 ? '#f8fbff' : '#fff',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '14px', color: '#111827', fontWeight: 800, margin: 0 }}>
                            {step.title}
                        </h4>
                        {index === 1 && (
                            <span style={{ fontSize: '10px', color: '#1e40af', background: '#dbeafe', borderRadius: '999px', padding: '3px 7px', fontWeight: 800 }}>
                                진행중
                            </span>
                        )}
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.55, margin: '0 0 12px' }}>
                        {step.desc}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {step.items.map((item, itemIndex) => (
                            <label key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', color: '#374151' }}>
                                <input type="checkbox" defaultChecked={index === 0 && itemIndex === 0} />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const AssessmentPanel = ({ assessments, selectedAssessment, loading, onSelectAssessment }) => (
    <section style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px', alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '15px', color: '#1a365d', margin: '0 0 12px', fontWeight: 800 }}>
                검사 결과 목록
            </h3>
            {loading && !assessments.length && <p style={{ fontSize: '13px', color: '#6b7280' }}>불러오는 중입니다.</p>}
            {!loading && !assessments.length && <p style={{ fontSize: '13px', color: '#6b7280' }}>저장된 검사 결과가 없습니다.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {assessments.map((assessment) => (
                    <button
                        key={assessment.assessmentId}
                        type="button"
                        onClick={() => onSelectAssessment(assessment.assessmentId)}
                        style={{
                            textAlign: 'left',
                            border: selectedAssessment?.assessmentId === assessment.assessmentId ? '1.5px solid #1a365d' : '1px solid #e5e7eb',
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>
                            {assessment.assessmentType} · {assessment.hollandCode}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                            {formatDateTime(assessment.createdAt)}
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '18px' }}>
            {selectedAssessment ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', color: '#111827', margin: '0 0 4px', fontWeight: 800 }}>
                                Holland 코드 {selectedAssessment.hollandCode}
                            </h3>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>
                                주 유형: {selectedAssessment.primaryType} · {TYPE_NAMES[selectedAssessment.primaryType] || '분석 완료'}
                            </p>
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '12px' }}>
                            {formatDateTime(selectedAssessment.createdAt)}
                        </div>
                    </div>

                    <ScoreBars scores={selectedAssessment.percentScores} />

                    <h4 style={{ fontSize: '14px', color: '#1a365d', margin: '20px 0 10px', fontWeight: 800 }}>
                        추천 직업
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(selectedAssessment.recommendations || []).map((recommendation) => (
                            <Link
                                key={recommendation.recommendationId}
                                to={`/jobs/${recommendation.job.jobId}`}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '12px',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '11px 12px',
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '13px', color: '#111827', fontWeight: 800 }}>
                                        {recommendation.rankNo}. {recommendation.job.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                        {recommendation.job.category}
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 800 }}>
                                    {recommendation.matchScore}% {recommendation.matchLabel}
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>검사 결과를 선택해주세요.</p>
            )}
        </div>
    </section>
);

const BookmarkPanel = ({ bookmarks, loading }) => (
    <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '18px' }}>
        <h3 style={{ fontSize: '15px', color: '#1a365d', margin: '0 0 12px', fontWeight: 800 }}>
            즐겨찾는 직업
        </h3>
        {loading && <p style={{ fontSize: '13px', color: '#6b7280' }}>불러오는 중입니다.</p>}
        {!loading && !bookmarks.length && (
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
                아직 저장한 직업이 없습니다. 직업 상세 화면에서 관심 직업을 저장해보세요.
            </p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {bookmarks.map((bookmark) => (
                <Link
                    key={bookmark.bookmarkId}
                    to={`/jobs/${bookmark.job.jobId}`}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '14px',
                        background: '#fff',
                    }}
                >
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                        {bookmark.job.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '10px' }}>
                        {bookmark.job.category} · {formatDateTime(bookmark.createdAt)}
                    </div>
                    <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.6, margin: '0 0 10px' }}>
                        {bookmark.job.summary}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(bookmark.job.hollandTypes || []).map((code) => (
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
                </Link>
            ))}
        </div>
    </section>
);

const MentoringPanel = ({ requests, loading }) => (
    <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '18px' }}>
        <h3 style={{ fontSize: '15px', color: '#1a365d', margin: '0 0 12px', fontWeight: 800 }}>
            멘토링 신청 내역
        </h3>
        {loading && <p style={{ fontSize: '13px', color: '#6b7280' }}>불러오는 중입니다.</p>}
        {!loading && !requests.length && <p style={{ fontSize: '13px', color: '#6b7280' }}>아직 신청한 멘토링이 없습니다.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {requests.map((request) => (
                <div key={request.mentoringRequestId} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '14px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                            {request.mentorName}
                        </div>
                        <span style={{
                            fontSize: '11px',
                            color: '#1e40af',
                            background: '#eff6ff',
                            borderRadius: '999px',
                            padding: '3px 8px',
                            fontWeight: 800,
                        }}>
                            {request.status}
                        </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                        {request.jobName} · {formatDateTime(request.createdAt)}
                    </div>
                    {request.requestMessage && (
                        <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                            {request.requestMessage}
                        </p>
                    )}
                </div>
            ))}
        </div>
    </section>
);

const ScoreBars = ({ scores = {} }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {Object.entries(scores).map(([type, score]) => (
            <div key={type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#374151', fontWeight: 800 }}>{type} · {TYPE_NAMES[type]}</span>
                    <span style={{ color: '#1a365d', fontWeight: 800 }}>{score}%</span>
                </div>
                <div style={{ height: '7px', background: '#e5e7eb', borderRadius: '999px' }}>
                    <div style={{
                        height: '7px',
                        width: `${score}%`,
                        background: '#1a365d',
                        borderRadius: '999px',
                    }} />
                </div>
            </div>
        ))}
    </div>
);

const InfoGrid = ({ items }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
        {items.map(([label, value]) => (
            <div key={label} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '13px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '14px', color: '#111827', fontWeight: 800 }}>{value}</div>
            </div>
        ))}
    </div>
);

function formatDateTime(value) {
    if (!value) {
        return '';
    }
    return new Date(value).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default MyPage;
