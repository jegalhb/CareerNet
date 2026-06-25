// src/pages/CareerDesign.jsx
import React, { useState,useEffect } from 'react';
import AssessmentSelector from '../components/career/AssessmentSelector';
import MultiAssessmentRunner from '../components/career/MultiAssessmentRunner';
import MultiResultStep from '../components/career/MultiResultStep';
import JobDetailStep from '../components/career/JobDetailStep';

/**
 * 진로설계 메인 페이지
 *
 * Phase 1 — AssessmentSelector   : 검사 선택 (1~4개)
 * Phase 2 — MultiAssessmentRunner : 선택된 검사 순차 진행
 * Phase 3 — MultiResultStep       : 통합 결과 + 직업 추천
 * Phase 4 — JobDetailStep         : 직업 상세
 */
const CareerDesign = () => {
    const [phase, setPhase] = useState('select'); // select | running | result | detail
    const [selectedIds, setSelectedIds]     = useState([]);   // ['HOLLAND','BIG5', ...]
    const [allResults, setAllResults]       = useState({});   // { HOLLAND: {...}, ... }
    const [recommendations, setRecs]        = useState([]);
    const [selectedJob, setSelectedJob]     = useState(null);

    useEffect(() => {
        document.body.classList.toggle('assessment-running-mode', phase === 'running');

        return () => {
            document.body.classList.remove('assessment-running-mode');
        };
    }, [phase]);

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleSelectDone = (ids) => {
        setSelectedIds(ids);
        setAllResults({});
        setPhase('running');
        scrollTop();
    };

    const handleRunnerDone = (results, recs) => {
        setAllResults(results);
        setRecs(recs);
        setPhase('result');
        scrollTop();
    };

    const handleJobSelect = (job) => {
        setSelectedJob(job);
        setPhase('detail');
        scrollTop();
    };

    const handleReset = () => {
        setPhase('select');
        setSelectedIds([]);
        setAllResults({});
        setRecs([]);
        setSelectedJob(null);
        scrollTop();
    };

    const handleBackToResult = () => { setPhase('result'); scrollTop(); };
    const handleBackToSelect = () => { setPhase('select'); scrollTop(); };

    // ── 상단 진행 스테퍼 ──────────────────────────────────
    const PHASES = [
        { id: 'select',  label: '검사 선택' },
        { id: 'running', label: '검사 진행' },
        { id: 'result',  label: '통합 결과' },
        { id: 'detail',  label: '직업 탐색' },
    ];
    const currentIdx = PHASES.findIndex(p => p.id === phase);


    return (
        <div style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '60px' }}>

            {/* 상단 스테퍼 */}
            <div style={{
                background: '#fff', borderBottom: '1px solid #e5e7eb',
                padding: '16px 24px', position: 'sticky', top: phase === 'running' ? '0' :'56px', zIndex: 900,
            }}>
                <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
                    {PHASES.map((p, idx) => {
                        const isDone   = idx < currentIdx;
                        const isActive = idx === currentIdx;
                        return (
                            <React.Fragment key={p.id}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px',
                                    fontWeight: isActive ? 700 : 500,
                                    background: isActive ? '#1a365d' : isDone ? '#dbeafe' : 'transparent',
                                    color: isActive ? '#fff' : isDone ? '#1e40af' : '#9ca3af',
                                    cursor: isDone ? 'pointer' : 'default',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s',
                                }}
                                     onClick={() => {
                                         if (isDone) {
                                             if (idx === 0) handleReset();
                                             if (idx === 2 && phase === 'detail') setPhase('result');
                                         }
                                     }}
                                >
                  <span style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: isActive ? 'rgba(255,255,255,0.25)'
                          : isDone  ? '#2563eb' : '#e5e7eb',
                      color: isActive || isDone ? '#fff' : '#9ca3af',
                      fontSize: '10px', fontWeight: 700,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isDone ? '✓' : idx + 1}
                  </span>
                                    {p.label}
                                </div>
                                {idx < PHASES.length - 1 && (
                                    <div style={{
                                        flex: 1, height: '2px', margin: '0 2px',
                                        background: isDone ? '#93c5fd' : '#e5e7eb',
                                    }} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* 페이즈별 콘텐츠 */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
                {phase === 'select' && (
                    <AssessmentSelector onConfirm={handleSelectDone} />
                )}
                {phase === 'running' && (
                    <MultiAssessmentRunner
                        selectedIds={selectedIds}
                        onComplete={handleRunnerDone}
                        onBack={handleBackToSelect}
                    />
                )}
                {phase === 'result' && (
                    <MultiResultStep
                        allResults={allResults}
                        recommendations={recommendations}
                        selectedIds={selectedIds}
                        onSelectJob={handleJobSelect}
                        onReset={handleReset}
                    />
                )}
                {phase === 'detail' && selectedJob && (
                    <JobDetailStep
                        job={selectedJob}
                        allResults={allResults}
                        onBack={handleBackToResult}
                        onReset={handleReset}
                    />
                )}
            </div>
        </div>
    );
};

export default CareerDesign;