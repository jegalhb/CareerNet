/**
 * CareerNet 개발 명세서 Vol.2
 * PART 3 — 기능 명세서 (FRD)
 * PART 4 — UI/UX 컴포넌트 디자인 가이드
 *
 * 작성 기준
 *  - FRD : IEEE 830 + Agile BDD(Given-When-Then) 혼합 방식
 *  - UI  : Atomic Design 5계층 + Design Token 체계 + Figma 연동 명세
 */
const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
    PageNumberElement, PageBreak, LevelFormat, TabStopType, TabStopPosition,
    Header, Footer, BookmarkStart, BookmarkEnd, SimpleField,
    TableOfContents, VerticalAlign,
} = require('docx');
const fs = require('fs');

// ── 색상 팔레트 ──────────────────────────────────────────────
const C = {
    navy:'1A365D', navyMid:'1E4A8A', blue:'2563EB', blueMid:'3B82F6',
    lightBlue:'DBEAFE', midBlue:'EFF6FF', skyBlue:'BAE6FD',
    green:'065F46', greenMid:'059669', lightGreen:'D1FAE5', mintBg:'F0FDF4',
    purple:'5B21B6', purpleMid:'7C3AED', lightPurp:'EDE9FE',
    orange:'92400E', orangeMid:'D97706', lightOrng:'FEF3C7',
    red:'991B1B', redMid:'DC2626', lightRed:'FEE2E2',
    slate:'334155', slateMid:'475569', slateLight:'64748B',
    gray:'6B7280', lightGray:'F3F4F6', borderGray:'E5E7EB', border:'CBD5E1',
    white:'FFFFFF', black:'111827', codeBg:'0F172A', codeText:'94A3B8',
    amber:'92400E', amberBg:'FFFBEB', amberBorder:'FDE68A',
    teal:'0F766E', tealBg:'F0FDFA', tealLight:'99F6E4',
};

// ── 공통 헬퍼 ────────────────────────────────────────────────
const sp  = (b=0,a=0)=>({before:b,after:a});
const bd  = (c=C.border)=>({style:BorderStyle.SINGLE,size:1,color:c});
const nob = ()=>({style:BorderStyle.NONE,size:0,color:C.white});
const allB= (c=C.border)=>({top:bd(c),bottom:bd(c),left:bd(c),right:bd(c)});
const noB = ()=>({top:nob(),bottom:nob(),left:nob(),right:nob()});

function run(text,opts={}){
    return new TextRun({text,size:22,font:'Arial',color:C.black,...opts});
}
function codeRun(text){
    return new TextRun({text,size:18,font:'Courier New',color:'A5F3FC'});
}
function greenRun(text){
    return new TextRun({text,size:18,font:'Courier New',color:'86EFAC'});
}
function yellowRun(text){
    return new TextRun({text,size:18,font:'Courier New',color:'FDE047'});
}
function pinkRun(text){
    return new TextRun({text,size:18,font:'Courier New',color:'F9A8D4'});
}

function h1(text){
    return new Paragraph({
        heading:HeadingLevel.HEADING_1, spacing:sp(440,160),
        border:{bottom:{style:BorderStyle.SINGLE,size:8,color:C.navy,space:4}},
        children:[new TextRun({text,bold:true,size:38,font:'Arial',color:C.navy})],
    });
}
function h2(text){
    return new Paragraph({
        heading:HeadingLevel.HEADING_2, spacing:sp(320,120),
        children:[new TextRun({text,bold:true,size:28,font:'Arial',color:C.navy})],
    });
}
function h3(text){
    return new Paragraph({
        heading:HeadingLevel.HEADING_3, spacing:sp(240,80),
        children:[new TextRun({text,bold:true,size:24,font:'Arial',color:C.slate})],
    });
}
function h4(text){
    return new Paragraph({
        spacing:sp(180,60),
        children:[new TextRun({text,bold:true,size:22,font:'Arial',color:C.slateMid})],
    });
}
function para(runs,sb=60,sa=60){
    const ch = Array.isArray(runs)
        ? runs.map(r=>typeof r==='string'?run(r):new TextRun({size:22,font:'Arial',color:C.black,...r}))
        : [run(runs)];
    return new Paragraph({spacing:sp(sb,sa),children:ch});
}
function bullet(text,level=0,ref='bul'){
    return new Paragraph({
        numbering:{reference:ref,level},spacing:sp(40,40),
        children:[new TextRun({text,size:21,font:'Arial',color:C.black})],
    });
}
function numbered(text,level=0){
    return bullet(text,level,'num');
}
function note(text,type='info'){
    const map={
        info:{fill:C.midBlue,text:C.navy,border:C.blue},
        warn:{fill:C.lightOrng,text:C.orange,border:C.orangeMid},
        success:{fill:C.lightGreen,text:C.green,border:C.greenMid},
        danger:{fill:C.lightRed,text:C.red,border:C.redMid},
        tip:{fill:C.tealBg,text:C.teal,border:C.teal},
        code:{fill:'F1F5F9',text:'1E293B',border:C.slate},
    };
    const col=map[type]||map.info;
    return new Paragraph({
        spacing:sp(80,80),indent:{left:360},
        shading:{fill:col.fill,type:ShadingType.CLEAR},
        border:{left:{style:BorderStyle.SINGLE,size:16,color:col.border,space:8}},
        children:[new TextRun({text,size:21,font:'Arial',color:col.text})],
    });
}
function codeLine(text,bg=C.codeBg,color='A5F3FC'){
    return new Paragraph({
        spacing:sp(0,0),
        shading:{fill:bg,type:ShadingType.CLEAR},
        children:[new TextRun({text,size:18,font:'Courier New',color})],
    });
}
function codeBlock(lines,bg=C.codeBg){
    return lines.map(l=>Array.isArray(l)
        ? new Paragraph({spacing:sp(0,0),shading:{fill:bg,type:ShadingType.CLEAR},
            children:l.map(seg=>new TextRun({size:18,font:'Courier New',...seg}))})
        : codeLine(l,bg)
    );
}
function divider(){
    return new Paragraph({
        spacing:sp(120,120),
        border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.borderGray,space:1}},
        children:[],
    });
}
function spacer(b=100,a=0){return new Paragraph({spacing:sp(b,a),children:[]}); }
function pageBreak(){return new Paragraph({children:[new PageBreak()]}); }

// ── 셀 헬퍼 ─────────────────────────────────────────────────
function cell(content,opts={}){
    const {fill=C.white,width=2200,bold=false,color=C.black,fs=20,colSpan,rowSpan,align=AlignmentType.LEFT,vAlign=VerticalAlign.CENTER}=opts;
    const paras = Array.isArray(content)&&content[0]instanceof Paragraph ? content
        : [new Paragraph({
            alignment:align, spacing:sp(60,60),
            children:[new TextRun({text:String(content),bold,size:fs,font:'Arial',color})],
        })];
    const cfg={
        borders:allB(), shading:{fill,type:ShadingType.CLEAR},
        margins:{top:80,bottom:80,left:120,right:120},
        width:{size:width,type:WidthType.DXA},
        verticalAlign:vAlign, children:paras,
    };
    if(colSpan) cfg.columnSpan=colSpan;
    if(rowSpan) cfg.rowSpan=rowSpan;
    return new TableCell(cfg);
}
function hCell(text,width=2200,fill=C.navy){
    return cell(text,{fill,width,bold:true,color:C.white,fs:20});
}
function sCell(text,width,fill=C.lightBlue){
    return cell(text,{fill,width,bold:true,color:C.navy,fs:20,colSpan:99});
}
// ── 테이블 래퍼 ────────────────────────────────────────────
function mkTable(cols,rows){
    const totalW=cols.reduce((a,b)=>a+b,0);
    return {totalW,cols,
        build:(headerLabels,dataRows,fillOverride)=>new Table({
            width:{size:totalW,type:WidthType.DXA},
            columnWidths:cols,
            rows:[
                new TableRow({tableHeader:true,
                    children:headerLabels.map((l,i)=>hCell(l,cols[i],fillOverride||C.navy))}),
                ...dataRows.map((r,ri)=>new TableRow({
                    children:r.map((v,ci)=>cell(v,{fill:ri%2===0?C.white:'F8FAFC',width:cols[ci]})),
                })),
            ],
        }),
    };
}

// ── 커버 페이지 ────────────────────────────────────────────
function makeCover(){
    return [
        spacer(1200),
        new Paragraph({
            alignment:AlignmentType.CENTER,spacing:sp(0,100),
            children:[new TextRun({text:'CareerNet',bold:true,size:80,font:'Arial',color:C.navy})],
        }),
        new Paragraph({
            alignment:AlignmentType.CENTER,spacing:sp(0,40),
            children:[new TextRun({text:'프로젝트 개발 명세서',size:48,font:'Arial',color:C.slate})],
        }),
        new Paragraph({
            alignment:AlignmentType.CENTER,spacing:sp(0,60),
            children:[new TextRun({text:'Vol.2 — 기능 명세서(FRD)  ·  UI/UX 디자인 가이드',size:28,font:'Arial',color:C.gray})],
        }),
        new Paragraph({
            alignment:AlignmentType.CENTER,spacing:sp(0,0),
            border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.borderGray,space:1}},
            children:[],
        }),
        spacer(80),
        ...[
            ['문서 버전',   'v2.0.0  (초판)'],
            ['최초 작성일', '2025년 6월'],
            ['갱신 정책',   '기능 추가·변경 시마다 해당 섹션 버전 독립 갱신 — 변경 이력 테이블(§0.3) 참조'],
            ['작성 기준',   'IEEE 830 + Agile BDD(Given-When-Then) + Atomic Design 5계층'],
            ['대상 독자',   '프론트엔드·백엔드 개발자, UX 디자이너, QA 엔지니어, 신규 합류자'],
            ['연관 문서',   'Vol.1 (시스템 아키텍처·데이터 모델링 명세서)'],
        ].map(([k,v])=>new Paragraph({
            alignment:AlignmentType.CENTER,spacing:sp(30,30),
            children:[
                new TextRun({text:`${k}  `,bold:true,size:22,font:'Arial',color:C.slate}),
                new TextRun({text:v,size:22,font:'Arial',color:C.gray}),
            ],
        })),
        pageBreak(),
    ];
}

// ── 변경 이력 섹션 ─────────────────────────────────────────
function makeChangelog(){
    const tbl = mkTable([1400,1600,1800,4226],[]);
    return [
        h2('§ 0.1  문서 갱신 가이드'),
        note('이 문서는 기능 추가·변경·폐기가 발생할 때마다 갱신합니다. 새 기능 추가 시 아래 절차를 따르세요.','tip'),
        spacer(80),
        ...['1. 해당 기능의 FR-ID를 신규 채번 (FR-XXX-NNN 형식)',
            '2. 섹션별 버전 번호를 패치 버전 증가 (예: v1.0.0 → v1.0.1)',
            '3. §0.3 변경 이력 테이블에 행 추가',
            '4. 관련 인수 기준(Given-When-Then) 시나리오 업데이트',
            '5. PART 4 컴포넌트 가이드의 Props 테이블 동기화',
        ].map(t=>bullet(t)),
        spacer(120),
        h2('§ 0.2  기능 요구사항 ID 체계'),
        note('FR-[도메인코드]-[3자리 일련번호]  |  예: FR-AUTH-001 = 인증 도메인 첫 번째 요구사항','code'),
        spacer(80),
        tbl.build(
            ['도메인 코드','도메인 이름','섹션','현재 FR 범위'],
            [
                ['AUTH',  '인증·회원',        '3.1', 'FR-AUTH-001 ~ 010'],
                ['ASSESS','적성검사',          '3.2', 'FR-ASSESS-001 ~ 015'],
                ['JOB',   '직업정보·탐색',    '3.3', 'FR-JOB-001 ~ 010'],
                ['ROAD',  '진로 로드맵',       '3.4', 'FR-ROAD-001 ~ 008'],
                ['MENT',  '멘토링',            '3.5', 'FR-MENT-001 ~ 008 (예정)'],
                ['MYPAGE','마이페이지',        '3.6', 'FR-MYPAGE-001 ~ 008 (예정)'],
                ['PERF',  '성능·비기능',       '3.7', 'FR-PERF-001 ~ 005'],
            ]
        ),
        spacer(120),
        h2('§ 0.3  변경 이력 (Change Log)'),
        note('기능 추가 또는 변경 시 아래 테이블에 행을 삽입하세요. 삭제는 금지 — 폐기(Deprecated) 상태로 표시하세요.','warn'),
        spacer(80),
        mkTable([1200,1200,1400,5226],[]).build(
            ['날짜','버전','변경자','변경 내용'],
            [
                ['2025-06-01','v2.0.0','Tech Lead','초판 작성 — FRD(3.1~3.4, 3.7) + UI/UX 가이드(4.1~4.6) 전체'],
                ['(갱신 시 추가)','—','—','—'],
            ]
        ),
        pageBreak(),
    ];
}

// ═══════════════════════════════════════════════════════════
// PART 3  기능 명세서 (FRD)
// ═══════════════════════════════════════════════════════════

// ── FRD 단일 카드 생성 ─────────────────────────────────────
function frCard(id,title,priority,status,desc,stories,gwts,nfr){
    /* priority: P0/P1/P2/P3   status: Done/In Progress/Planned/Deprecated */
    const prioColor={P0:C.red,P1:C.orange,P2:C.navy,P3:C.gray}[priority]||C.gray;
    const prioFill ={P0:C.lightRed,P1:C.lightOrng,P2:C.midBlue,P3:C.lightGray}[priority]||C.lightGray;
    const statColor={Done:C.green,'In Progress':C.navy,Planned:C.purple,Deprecated:C.gray}[status]||C.gray;
    const statFill ={Done:C.lightGreen,'In Progress':C.lightBlue,Planned:C.lightPurp,Deprecated:C.lightGray}[status]||C.lightGray;

    return [
        // 헤더 바
        new Table({
            width:{size:9026,type:WidthType.DXA},columnWidths:[1600,3226,1600,2600],
            rows:[new TableRow({children:[
                    cell([new Paragraph({spacing:sp(60,60),children:[
                                new TextRun({text:id,bold:true,size:20,font:'Courier New',color:C.navy})]})],
                        {fill:C.midBlue,width:1600}),
                    cell([new Paragraph({spacing:sp(60,60),children:[
                                new TextRun({text:title,bold:true,size:22,font:'Arial',color:C.black})]})],
                        {fill:C.white,width:3226}),
                    cell([new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(60,60),children:[
                                new TextRun({text:priority,bold:true,size:20,font:'Arial',color:prioColor})]})],
                        {fill:prioFill,width:1600}),
                    cell([new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(60,60),children:[
                                new TextRun({text:status,bold:true,size:20,font:'Arial',color:statColor})]})],
                        {fill:statFill,width:2600}),
                ]})]
        }),
        // 설명
        new Paragraph({
            spacing:sp(60,60),indent:{left:0},
            shading:{fill:'FAFCFF',type:ShadingType.CLEAR},
            border:{left:{style:BorderStyle.SINGLE,size:12,color:C.blue,space:8}},
            children:[new TextRun({text:desc,size:21,font:'Arial',color:C.black})],
        }),
        // 사용자 스토리
        ...(stories.length?[
            new Paragraph({spacing:sp(80,20),children:[new TextRun({text:'📋  사용자 스토리',bold:true,size:20,font:'Arial',color:C.navy})]}),
            ...stories.map(s=>new Paragraph({
                spacing:sp(30,30),indent:{left:240},
                children:[
                    new TextRun({text:'As a ',size:20,font:'Arial',color:C.gray,italics:true}),
                    new TextRun({text:s[0],size:20,font:'Arial',color:C.navy,bold:true,italics:true}),
                    new TextRun({text:',  I want to ',size:20,font:'Arial',color:C.gray,italics:true}),
                    new TextRun({text:s[1],size:20,font:'Arial',color:C.black,italics:true}),
                    new TextRun({text:'  so that ',size:20,font:'Arial',color:C.gray,italics:true}),
                    new TextRun({text:s[2],size:20,font:'Arial',color:C.greenMid,italics:true}),
                ],
            })),
        ]:[]),
        // Given-When-Then
        ...(gwts.length?[
            new Paragraph({spacing:sp(80,20),children:[new TextRun({text:'✅  인수 기준 (Given-When-Then)',bold:true,size:20,font:'Arial',color:C.navy})]}),
            ...gwts.flatMap(([label,lines])=>[
                new Paragraph({spacing:sp(40,10),indent:{left:240},
                    children:[new TextRun({text:`▸ ${label}`,bold:true,size:19,font:'Arial',color:C.slateMid})]}),
                ...lines.map(l=>{
                    const kw=l.match(/^(Given|When|Then|And|But|Scenario)/)?.[1];
                    const kwColor={Given:C.green,When:C.navy,Then:C.purple,And:C.slateMid,But:C.red,Scenario:C.orange}[kw]||C.black;
                    return new Paragraph({
                        spacing:sp(10,10),indent:{left:480},
                        shading:{fill:'F8FAFC',type:ShadingType.CLEAR},
                        children:[
                            new TextRun({text:kw?`${kw} `:'' ,bold:true,size:19,font:'Courier New',color:kwColor}),
                            new TextRun({text:kw?l.slice(kw.length+1):l,size:19,font:'Courier New',color:C.slate}),
                        ],
                    });
                }),
            ]),
        ]:[]),
        // 비기능 요구사항
        ...(nfr&&nfr.length?[
            new Paragraph({spacing:sp(80,20),children:[new TextRun({text:'⚙️  비기능 요구사항',bold:true,size:20,font:'Arial',color:C.navy})]}),
            ...nfr.map(n=>new Paragraph({
                spacing:sp(20,20),indent:{left:240},
                children:[new TextRun({text:`• ${n}`,size:20,font:'Arial',color:C.slate})],
            })),
        ]:[]),
        spacer(120),
    ];
}

function makePart3(){
    return [
        h1('PART 3  기능 명세서 (FRD)'),
        para('이 문서는 CareerNet의 모든 기능을 사용자 스토리(User Story)와 BDD 인수 기준(Given-When-Then)으로 명시합니다. 개발자는 구현 전에 이 명세를 검토하고, QA 엔지니어는 이 시나리오를 테스트 케이스의 기준으로 사용합니다.',80,100),
        note('우선순위 기준 — P0: 서비스 불가(Blocker) | P1: 핵심 기능(Critical) | P2: 주요 기능(Major) | P3: 개선 사항(Minor)','info'),
        note('상태 기준 — Done: 구현 완료 | In Progress: 개발 중 | Planned: 백로그 확정 | Deprecated: 폐기 예정','warn'),
        spacer(160),

        // ── 3.1 인증·회원 ──────────────────────────────────────
        h2('3.1  인증 및 회원 관리'),
        spacer(40),

        ...frCard(
            'FR-AUTH-001','로그인 드롭다운','P1','Done',
            'GNB의 [로그인] 버튼 클릭 시 드롭다운이 나타나며, 단일 폼에서 로그인과 회원가입 전환이 가능해야 한다.',
            [['비회원 사용자','로그인 버튼 클릭으로 드롭다운을 열어 로그인하고 싶다','페이지 이동 없이 빠르게 인증할 수 있다'],
                ['회원가입 희망 사용자','드롭다운 안에서 회원가입 탭으로 전환하고 싶다','별도 페이지 이동 없이 가입을 완료할 수 있다']],
            [['정상 로그인',
                ['Scenario: 유효한 계정으로 로그인',
                    'Given 사용자가 GNB의 [로그인] 버튼을 클릭하여 드롭다운을 열었을 때',
                    'When 유효한 이메일과 비밀번호를 입력하고 [로그인하기]를 클릭하면',
                    'Then 드롭다운이 닫히고',
                    'And GNB 우측에 사람 아이콘(마이페이지)이 활성화 상태로 표시된다',
                    'And authStore.isLoggedIn이 true로 변경된다']],
                ['잘못된 자격증명',
                    ['Scenario: 잘못된 비밀번호 입력',
                        'Given 로그인 드롭다운이 열려 있을 때',
                        'When 등록되지 않은 이메일 또는 잘못된 비밀번호를 입력하면',
                        'Then 폼 아래에 "아이디 또는 비밀번호가 올바르지 않습니다" 오류 메시지가 표시된다',
                        'And 드롭다운은 닫히지 않는다']],
                ['외부 클릭 닫힘',
                    ['Scenario: 드롭다운 외부 클릭 시 닫힘',
                        'Given 로그인 드롭다운이 열려 있을 때',
                        'When 드롭다운 영역 외부를 클릭하면',
                        'Then 드롭다운이 닫힌다']]],
            ['응답 시간: 로그인 API 응답 1,500ms 이내','드롭다운 열림/닫힘 애니메이션: 200ms 이하 (framer-motion)','JWT 토큰은 localStorage에 저장, 새로고침 후 자동 복원']
        ),

        ...frCard(
            'FR-AUTH-002','회원가입','P1','Done',
            '로그인 드롭다운 내 [회원가입하기] 탭에서 이름·이메일·비밀번호·최종학력·관심분야를 입력하여 가입할 수 있어야 한다.',
            [['신규 사용자','이름·이메일·비밀번호로 계정을 생성하고 싶다','진로 검사 결과를 저장하고 개인화 서비스를 받을 수 있다']],
            [['정상 가입',
                ['Scenario: 유효한 정보로 회원가입',
                    'Given 회원가입 탭이 열려 있을 때',
                    'When 이름, 유효한 이메일, 8자 이상 비밀번호를 입력하고 [가입 완료하기]를 클릭하면',
                    'Then "회원가입 완료! 로그인해주세요." 메시지가 표시되고',
                    'And 탭이 로그인으로 자동 전환된다']],
                ['이메일 중복',
                    ['Scenario: 이미 등록된 이메일로 가입 시도',
                        'Given 회원가입 탭이 열려 있을 때',
                        'When 이미 DB에 존재하는 이메일을 입력하면',
                        'Then "이미 사용 중인 이메일입니다." 오류 메시지가 표시된다']]],
            ['비밀번호: 서버 저장 시 BCrypt 해싱 필수','이메일: 형식 검증(RFC 5322) + 중복 검사']
        ),

        ...frCard(
            'FR-AUTH-003','마이페이지 드롭다운','P1','Done',
            '로그인 상태에서 GNB 사람 아이콘 클릭 시 마이페이지 드롭다운이 열리며, 내 로드맵·즐겨찾기·검사 결과 등으로 빠르게 이동 가능해야 한다.',
            [['로그인된 사용자','GNB에서 한 번의 클릭으로 마이페이지 주요 항목에 접근하고 싶다','매번 마이페이지 페이지로 이동하지 않아도 된다']],
            [['드롭다운 메뉴 이동',
                ['Scenario: 마이페이지 항목 클릭',
                    'Given 로그인 상태에서 GNB 사람 아이콘을 클릭하여 드롭다운을 열었을 때',
                    'When [내 진로 로드맵] 항목을 클릭하면',
                    'Then /mypage/roadmap 경로로 이동하고',
                    'And 드롭다운이 닫힌다']]],
            ['드롭다운은 최대 7개 메뉴 항목 표시','로그아웃 클릭 시 authStore 초기화 + / 경로로 리다이렉트']
        ),

        spacer(80),
        // ── 3.2 적성검사 ────────────────────────────────────────
        h2('3.2  다중 적성검사 시스템'),
        spacer(40),

        ...frCard(
            'FR-ASSESS-001','검사 선택 화면','P0','Done',
            'Step 1에서 4가지 검사(Holland·적성·가치관·Big Five) 중 1~4개를 복수 선택하여 검사를 시작할 수 있어야 한다. 선택 개수에 따라 예상 소요 시간과 총 문항 수가 동적으로 업데이트된다.',
            [['진로 탐색 사용자','여러 검사를 선택하여 더 정확한 진로 추천을 받고 싶다','단일 검사보다 신뢰도 높은 직업 매칭 결과를 얻을 수 있다']],
            [['단일 선택',
                ['Scenario: Holland 검사만 선택',
                    'Given 검사 선택 화면이 표시될 때',
                    'When Holland 검사 카드를 클릭하면 (기본 선택)',
                    'Then 카드에 체크마크가 표시되고 Deep Blue 테두리가 활성화된다',
                    'And 하단 요약에 "1개 선택 · 24문항 · 약 5분"이 표시된다']],
                ['복수 선택',
                    ['Scenario: 3개 검사 동시 선택',
                        'Given 검사 선택 화면이 표시될 때',
                        'When Holland, 적성, Big Five 카드를 순서대로 클릭하면',
                        'Then 3개 카드 모두 선택 상태로 표시된다',
                        'And 하단에 "앙상블 통합 추천 모드" 안내 문구가 나타난다',
                        'And 총 68문항 · 약 16분으로 요약이 업데이트된다']],
                ['최소 1개 강제',
                    ['Scenario: 마지막 선택 해제 시도',
                        'Given 1개 검사만 선택된 상태일 때',
                        'When 해당 카드를 다시 클릭하면',
                        'Then 선택이 해제되지 않고 현재 상태가 유지된다']]],
            ['검사 카드에 이름·설명·소요시간·문항 수·이론적 배경을 표시해야 함']
        ),

        ...frCard(
            'FR-ASSESS-002','검사 진행 및 Sticky 진행 바','P0','Done',
            '선택된 검사를 순서대로 진행하며, 화면 상단에 고정(sticky)된 진행 바가 스크롤을 내려도 항상 보여야 한다. 진행 바는 전체 진행률·검사 뱃지·페이지 도트 인디케이터를 포함한다.',
            [['검사 진행 중인 사용자','현재 얼마나 진행했는지 스크롤 위치와 관계없이 항상 확인하고 싶다','검사 이탈 없이 끝까지 완료할 수 있다']],
            [['Sticky 동작 확인',
                ['Scenario: 스크롤 내림 시 진행 바 고정',
                    'Given 검사가 진행 중이고 문항이 화면 아래로 스크롤될 때',
                    'When 사용자가 화면을 아래로 스크롤하면',
                    'Then 진행 바는 GNB(56px) + 스테퍼(52px) = top: 108px 위치에 고정된다',
                    'And 스크롤 10px 초과 시 진행 바에 drop-shadow 그림자가 나타난다']],
                ['페이지 전환',
                    ['Scenario: 페이지 내 모든 문항 응답 후 다음 이동',
                        'Given 현재 페이지의 4개 문항 모두에 응답했을 때',
                        'When [다음] 버튼을 클릭하면',
                        'Then 다음 페이지로 이동하고',
                        'And 진행 바의 도트 인디케이터가 다음 칸으로 이동한다',
                        'And 페이지 상단으로 자동 스크롤된다']],
                ['미응답 차단',
                    ['Scenario: 미응답 문항 존재 시 다음 버튼 비활성',
                        'Given 현재 페이지에 응답하지 않은 문항이 1개 이상 있을 때',
                        'Then [다음] 버튼이 비활성화(회색)되어 클릭할 수 없다']]],
            ['진행 바 top 값은 CSS 변수로 관리하여 GNB 높이 변경 시 단일 지점 수정 가능해야 함','진행 바 배경: linear-gradient(to bottom, #f9fafb 82%, transparent) — 콘텐츠와 자연스러운 분리']
        ),

        ...frCard(
            'FR-ASSESS-003','앙상블 결과 통합','P0','Done',
            '모든 선택된 검사 완료 후, 각 검사 결과를 균등 가중치로 앙상블하여 0~100 적합도 점수로 직업을 추천해야 한다. 단일 검사 선택 시에도 동일한 결과 화면 구조를 유지해야 한다.',
            [['검사 완료 사용자','여러 검사 결과를 통합한 정확한 직업 추천을 받고 싶다','단순 흥미만이 아니라 적성·가치관·성격까지 종합 반영된 진로를 탐색할 수 있다']],
            [['정상 추천',
                ['Scenario: 2개 검사(Holland+Big5) 완료 후 결과',
                    'Given Holland와 Big Five 두 검사를 모두 완료했을 때',
                    'When 결과 화면이 표시되면',
                    'Then 상위 8개 직업이 matchScore 내림차순으로 나열된다',
                    'And 각 직업 카드에 Holland 기여 점수와 Big5 기여 점수가 뱃지로 표시된다',
                    'And 탭 네비게이션에 "통합 추천" + "Holland 세부" + "Big Five 세부" 탭이 있다']],
                ['세부 탭 확인',
                    ['Scenario: 검사별 세부 탭 전환',
                        'Given 결과 화면에서 "Holland" 탭을 클릭하면',
                        'Then Holland RIASEC 6개 유형의 점수 바 차트가 표시된다',
                        'And 상위 3개 유형이 강조(★) 표시된다']]],
            ['앙상블 공식: weight = 1/n (n=선택 검사 수). 공식 변경 시 multiMatcher.js 단일 지점 수정','직업 추천 최소 3개 · 최대 8개 표시 (데이터 부족 시 "결과 준비 중" 메시지)']
        ),

        ...frCard(
            'FR-ASSESS-004','이전 검사 결과 저장 및 조회','P2','Planned',
            '로그인 사용자는 과거에 실시한 검사 결과를 마이페이지에서 다시 확인하고 재분석할 수 있어야 한다.',
            [['재방문 사용자','예전 검사 결과를 다시 보고 싶다','진로 변화 추이를 비교할 수 있다']],
            [['결과 조회',
                ['Scenario: 마이페이지에서 이전 검사 결과 조회',
                    'Given 2회 이상 검사를 완료한 로그인 사용자가',
                    'When /mypage/tests 페이지에 접근하면',
                    'Then 검사 완료 일시 내림차순으로 결과 목록이 표시된다',
                    'And 각 항목에는 Holland 코드와 추천 직업 Top 3가 표시된다']]],
            ['저장: 백엔드 TB_ASSESSMENT 테이블 — HollandMatcherService.processAssessment() 호출','비로그인 사용자는 결과 화면 하단에 "결과 저장을 위해 로그인하세요" CTA 표시']
        ),

        spacer(80),
        // ── 3.3 직업 정보 ──────────────────────────────────────
        h2('3.3  직업 정보 탐색'),
        spacer(40),

        ...frCard(
            'FR-JOB-001','직업 상세 탭 (개요·로드맵·멘토)','P1','Done',
            '직업 상세 화면은 "직업 개요 / 진로 로드맵 / 현직자 멘토" 3개 탭으로 구성되며, 각 탭의 내용은 jobDatabase.js의 해당 직업 데이터를 기반으로 표시되어야 한다.',
            [['직업 탐색 사용자','관심 직업의 상세 정보를 탭 형태로 체계적으로 보고 싶다','직업·로드맵·멘토 정보를 한 화면에서 효율적으로 탐색할 수 있다']],
            [['개요 탭',
                ['Scenario: 직업 개요 탭 표시',
                    'Given 사용자가 특정 직업 카드를 클릭하면',
                    'Then 직업 소개·근무 환경·핵심 스킬·관련 전공 섹션이 표시된다',
                    'And 적성 검사 완료 상태라면 나와의 적합도 분석 섹션이 추가로 표시된다']],
                ['로드맵 탭',
                    ['Scenario: 진로 로드맵 탭 전환',
                        'When [진로 로드맵] 탭을 클릭하면',
                        'Then jobDatabase의 roadmapSteps를 타임라인 형태로 표시한다',
                        'And 하단에 [내 로드맵에 추가] CTA 버튼이 표시된다']]],
            ['직업 카드 헤더: 홀랜드 코드 뱃지 표시 (TYPE_INFO 색상 사용)','적합도 점수 바: 완성 애니메이션 0.8s ease 적용']
        ),

        ...frCard(
            'FR-JOB-002','직업 슬라이더 (JobSlider)','P2','Done',
            '메인 페이지의 직업 슬라이더는 4초마다 자동 슬라이딩되며, 일시정지·이전·다음 컨트롤을 제공해야 한다. 이미지 로드 실패 시 대체 이미지를 표시해야 한다.',
            [['메인 방문자','다양한 직업을 스크롤 없이 자동으로 탐색하고 싶다','노력 없이 흥미로운 직업을 발견할 수 있다']],
            [['자동 재생',
                ['Scenario: 4초 간격 자동 슬라이딩',
                    'Given 슬라이더가 자동 재생 상태일 때',
                    'When 4초가 경과하면',
                    'Then 다음 직업으로 전환된다',
                    'And 현재 직업 이름과 통계가 업데이트된다']],
                ['이미지 오류',
                    ['Scenario: 이미지 로드 실패',
                        'When 직업 이미지 URL이 404를 반환하면',
                        'Then placehold.co 대체 이미지로 교체된다']]],
            ['setInterval cleanup: useEffect return에서 clearInterval 필수 (메모리 누수 방지)','isPlaying 상태가 false일 때 interval 중단']
        ),

        ...frCard(
            'FR-JOB-003','직업 즐겨찾기','P2','Planned',
            '로그인 사용자는 직업 카드의 하트 버튼을 눌러 즐겨찾기를 추가·제거할 수 있어야 하며, 마이페이지 즐겨찾기 탭에서 목록을 확인할 수 있어야 한다.',
            [['직업 탐색 사용자','마음에 드는 직업을 저장해두고 나중에 비교하고 싶다','반복 탐색 없이 저장된 직업을 빠르게 재확인할 수 있다']],
            [['즐겨찾기 추가',
                ['Scenario: 직업 카드 즐겨찾기 등록',
                    'Given 로그인 상태에서 직업 카드를 보고 있을 때',
                    'When [즐겨찾기] 하트 버튼을 클릭하면',
                    'Then 하트 아이콘이 채워진 상태로 변경된다',
                    'And 백엔드 POST /api/bookmarks 호출 후 TB_BOOKMARK에 저장된다',
                    'And 마이페이지 즐겨찾기 목록에 추가된다']],
                ['비로그인 시도',
                    ['Scenario: 비로그인 상태에서 즐겨찾기 클릭',
                        'Given 비로그인 상태에서',
                        'When 하트 버튼을 클릭하면',
                        'Then 로그인 드롭다운이 자동으로 열린다']]],
            ['job.id 불변 원칙 준수 — TB_BOOKMARK 외래키 참조','중복 즐겨찾기 시도 시 409 Conflict → 클라이언트에서 무시']
        ),

        spacer(80),
        // ── 3.4 진로 로드맵 ────────────────────────────────────
        h2('3.4  진로 로드맵'),
        spacer(40),

        ...frCard(
            'FR-ROAD-001','로드맵 스테퍼','P1','Done',
            '진로 로드맵은 [진단→직업선택→역량강화→멘토링→취업] 5단계 스테퍼로 표시되며, 각 단계 클릭 시 해당 단계의 할 일 목록이 아코디언으로 펼쳐져야 한다.',
            [['진로 설계 사용자','내가 현재 어느 단계에 있는지 시각적으로 확인하고 싶다','다음 단계로 나아가기 위해 무엇을 해야 할지 명확히 알 수 있다']],
            [['단계 클릭 체크리스트',
                ['Scenario: 2단계(직업선택) 클릭',
                    'Given 로드맵 스테퍼가 표시될 때',
                    'When [직업선택] 단계를 클릭하면',
                    'Then 해당 단계가 active 상태로 하이라이트된다',
                    'And 아코디언이 열리며 4개의 할 일 항목이 표시된다',
                    'And 이미 완료된 단계(0단계)는 done 스타일(파란 배경)로 유지된다']],
                ['체크박스 토글',
                    ['Scenario: 할 일 항목 완료 체크',
                        'When 아코디언 내 체크박스를 클릭하면',
                        'Then 체크박스가 활성화되고 텍스트에 취소선이 적용된다',
                        'And (로그인 상태) 백엔드 PUT /api/roadmap/checklist/{id} 호출']]],
            ['완료 단계 표시: step-circle 배경 #dbeafe, 아이콘 색 #1e40af','진행중 뱃지: position absolute, top: -4px, Deep Blue 배경']
        ),

        spacer(80),
        // ── 3.7 성능·비기능 요구사항 ──────────────────────────
        h2('3.7  성능 및 비기능 요구사항'),
        spacer(40),

        ...frCard(
            'FR-PERF-001','초기 로딩 성능','P1','Planned',
            '메인 페이지 최초 방문 시 Largest Contentful Paint(LCP) 2.5초 이내, Total Blocking Time(TBT) 300ms 이하를 달성해야 한다.',
            [],
            [['LCP 기준',
                ['Scenario: 빠른 네트워크(4G) 환경에서 메인 페이지 로드',
                    'Given 사용자가 처음 메인 페이지에 접속할 때',
                    'Then LCP ≤ 2.5s, TBT ≤ 300ms, CLS ≤ 0.1을 만족해야 한다']]],
            ['Vite 코드 스플리팅: React.lazy + Suspense로 페이지별 청크 분리','로컬 데이터(assessmentRegistry.js, jobDatabase.js) 번들 크기 최적화 — 트리 쉐이킹 확인','이미지: Unsplash URL lazy loading 적용']
        ),

        ...frCard(
            'FR-PERF-002','접근성(Accessibility)','P1','Planned',
            '모든 인터랙티브 요소는 키보드 내비게이션과 스크린 리더를 지원해야 하며, WCAG 2.1 AA 기준을 충족해야 한다.',
            [],
            [['키보드 내비게이션',
                ['Scenario: 키보드만으로 검사 진행',
                    'Given 키보드만 사용하는 사용자가 적성검사 화면에 있을 때',
                    'When Tab 키로 포커스를 이동하면',
                    'Then 각 척도 버튼에 순서대로 포커스가 이동한다',
                    'And Enter 키로 선택 가능하다']]],
            ['색상 대비: 텍스트/배경 최소 4.5:1 (Deep Blue #1a365d는 이미 충족)','검사 문항 번호: aria-label 속성 추가 필요','모달 포커스 트랩(focus-trap) 구현 필요']
        ),

        pageBreak(),
    ];
}

// ═══════════════════════════════════════════════════════════
// PART 4  UI/UX 컴포넌트 디자인 가이드
// ═══════════════════════════════════════════════════════════
function makePart4(){
    return [
        h1('PART 4  UI/UX 컴포넌트 디자인 가이드'),
        para('이 가이드는 CareerNet의 모든 UI 요소를 Atomic Design 5계층으로 분류하고, Design Token 기반의 일관된 스타일 규격을 정의합니다. Figma 컴포넌트 명명 규칙과 React 컴포넌트 Props가 1:1 대응됩니다.',80,100),
        note('갱신 원칙: 새 컴포넌트 추가 시 이 가이드의 해당 계층 섹션에 먼저 스펙을 기록한 후 구현합니다. 구현이 스펙보다 앞서면 안 됩니다.','warn'),
        spacer(160),

        // ── 4.1 Design Token ──────────────────────────────────
        h2('4.1  Design Token 체계'),
        para([
            {text:'Design Token',bold:true},
            '은 색상·타이포그래피·간격·그림자 등 디자인 결정을 중앙화한 변수입니다. ',
            {text:'Figma Variables',bold:true,color:C.purple},
            ' ↔ ',
            {text:'tailwind.config.js',bold:true,color:C.navy},
            ' ↔ ',
            {text:'CSS 변수',bold:true,color:C.teal},
            ' 세 레이어가 동기화됩니다.',
        ],60,100),

        h3('4.1.1  Color Token'),
        note('Figma 명명 규칙: brand/{scale} / gray/{scale} / semantic/{role}  |  Tailwind: theme.extend.colors','code'),
        spacer(60),
        mkTable([2200,1800,1800,3226],[]).build(
            ['Token 이름 (CSS 변수)','Tailwind 클래스','Hex 값','사용 맥락'],
            [
                ['--color-brand-900','brand-900','#1A365D','주요 헤더, 버튼 배경, 강조 텍스트'],
                ['--color-brand-800','brand-800','#1E4A8A','호버 상태 브랜드 색상'],
                ['--color-brand-600','brand-600','#2563EB','링크, 아이콘, 보조 강조'],
                ['--color-brand-100','brand-100','#DBEAFE','카드 배경, 뱃지 배경'],
                ['--color-brand-50', 'brand-50', '#EFF6FF','섹션 배경, 호버 상태'],
                ['--color-semantic-success','green-700','#059669','완료 상태, 성공 메시지'],
                ['--color-semantic-warning','amber-700','#D97706','경고, 진행 중 상태'],
                ['--color-semantic-error',  'red-700',  '#DC2626','오류 메시지, P0 우선순위'],
                ['--color-semantic-info',   'blue-600', '#2563EB','안내 메시지, P2 우선순위'],
                ['--color-gray-50','gray-50','#F9FAFB','페이지 배경'],
                ['--color-gray-200','gray-200','#E5E7EB','구분선, 비활성 테두리'],
                ['--color-gray-400','gray-400','#9CA3AF','플레이스홀더, 보조 텍스트'],
                ['--color-gray-800','gray-800','#1F2937','본문 텍스트'],
            ]
        ),

        spacer(160),
        h3('4.1.2  Typography Token'),
        mkTable([2400,1600,1800,3226],[]).build(
            ['Token 이름','크기 (Tailwind)','Font Weight','사용 컴포넌트'],
            [
                ['--text-display-lg','text-4xl (36px)','700 (Bold)','히어로 섹션 h1'],
                ['--text-display-md','text-3xl (30px)','700','페이지 타이틀'],
                ['--text-heading-lg','text-2xl (24px)','700','섹션 헤더 h2'],
                ['--text-heading-md','text-xl (20px)','600','서브 섹션 h3'],
                ['--text-heading-sm','text-base (16px)','600','카드 타이틀'],
                ['--text-body-lg',   'text-sm (14px)', '400','본문 텍스트'],
                ['--text-body-md',   'text-xs (13px)', '400','보조 설명, 뱃지'],
                ['--text-caption',   'text-[11px]',    '500','캡션, 레이블'],
                ['--text-code',      'text-[12px]',    '400','코드 블록, FR-ID'],
            ]
        ),

        spacer(160),
        h3('4.1.3  Spacing Token'),
        note('기준 단위: 4px (Tailwind 기본). 모든 spacing은 이 단위의 배수여야 합니다.','info'),
        spacer(60),
        mkTable([1800,1600,2000,3626],[]).build(
            ['Token','px 값','Tailwind','사용 예시'],
            [
                ['--space-1','4px','p-1','미세 조정, 아이콘 내부 여백'],
                ['--space-2','8px','p-2','컴팩트 뱃지, 칩'],
                ['--space-3','12px','p-3','버튼 세로 패딩'],
                ['--space-4','16px','p-4','카드 내부 기본 패딩'],
                ['--space-5','20px','p-5','섹션 내부 패딩'],
                ['--space-6','24px','p-6','페이지 수평 패딩(모바일)'],
                ['--space-8','32px','p-8','섹션 간 마진'],
                ['--space-16','64px','p-16','페이지 상·하 패딩'],
            ]
        ),

        spacer(160),
        h3('4.1.4  Shadow & Border Radius Token'),
        mkTable([2200,2000,4826],[]).build(
            ['Token','값','사용 맥락'],
            [
                ['--shadow-sm','0 1px 3px rgba(0,0,0,0.06)','일반 카드 기본 상태'],
                ['--shadow-md','0 4px 12px rgba(26,54,93,0.10)','카드 호버 상태, Sticky 진행 바'],
                ['--shadow-lg','0 8px 24px rgba(0,0,0,0.12)','드롭다운, 모달'],
                ['--shadow-xl','0 8px 32px rgba(0,0,0,0.20)','히어로 검색창'],
                ['--radius-sm','6px','뱃지, 작은 버튼, 체크박스'],
                ['--radius-md','8~10px','입력 필드, 일반 버튼'],
                ['--radius-lg','12~14px','카드, 섹션 컨테이너'],
                ['--radius-xl','20~24px','알약형 버튼, 태그 칩'],
                ['--radius-full','9999px','아바타, 진행 바, 도트'],
            ]
        ),

        spacer(200),

        // ── 4.2 Atoms ──────────────────────────────────────────
        h2('4.2  Atoms — 원자 컴포넌트'),
        para([
            {text:'Atoms',bold:true},
            '은 더 이상 분해할 수 없는 최소 UI 단위입니다. ',
            {text:'Figma 명명 규칙:',bold:true,color:C.navy},
            ' Atom / [ComponentName] / [Variant] / [State]',
        ],60,100),

        h3('4.2.1  Button'),
        note('Figma: Atom / Button / Primary|Secondary|Ghost|Danger / Default|Hover|Disabled|Loading','code'),
        spacer(60),
        mkTable([1600,1600,1600,4226],[]).build(
            ['Variant','배경','텍스트','사용 맥락 / 규칙'],
            [
                ['Primary',  '#1A365D (brand-900)','#FFFFFF','주요 액션 (로그인, 검사 시작, 결과 보기). 페이지당 최대 1개.'],
                ['Secondary','#FFFFFF',            '#2563EB (brand-600)','보조 액션 (취소, 이전). 테두리: 1.5px solid brand-600.'],
                ['Ghost',    'transparent',        '#1A365D','3순위 액션 (닫기, 다시하기). 테두리 없음.'],
                ['Danger',   '#DC2626 (red-600)', '#FFFFFF','파괴적 액션 (삭제, 로그아웃). 사용 전 확인 모달 필수.'],
                ['Pill',     '#EFF6FF (brand-50)','#2563EB (brand-600)','필터 태그 선택. 선택 시 Primary로 전환.'],
            ]
        ),
        spacer(100),
        ...codeBlock([
            '// Button Props Interface (TypeScript)',
            'interface ButtonProps {',
            '  variant : "primary" | "secondary" | "ghost" | "danger" | "pill";',
            '  size    : "sm" | "md" | "lg";   // sm: h-8, md: h-10, lg: h-12',
            '  disabled?: boolean;             // opacity-60, cursor-not-allowed',
            '  loading ?: boolean;             // 스피너 표시, 클릭 비활성',
            '  onClick ?: () => void;',
            '  children: React.ReactNode;',
            '}',
        ],'1E293B'),

        spacer(160),
        h3('4.2.2  Input / Select / Textarea'),
        note('Figma: Atom / Input / Text|Select|Textarea / Default|Focus|Error|Disabled','code'),
        spacer(60),
        mkTable([2000,3426,3600],[]).build(
            ['상태','시각 스타일','접근성 요구사항'],
            [
                ['Default','border: 1px solid #E5E7EB, bg: #FFFFFF, radius: 8px','placeholder 색상 gray-400, aria-label 필수'],
                ['Focus',  'border: 1.5px solid #2563EB (brand-600), outline: none','focus-visible: 2px offset ring (접근성)'],
                ['Error',  'border: 1.5px solid #DC2626 (red-600), bg: #FFF1F2','aria-invalid="true", aria-describedby → error message id'],
                ['Disabled','bg: #F3F4F6, color: #9CA3AF, cursor: not-allowed','aria-disabled="true"'],
            ]
        ),

        spacer(160),
        h3('4.2.3  Badge / Tag / Chip'),
        mkTable([1800,2000,2000,3226],[]).build(
            ['종류','크기 (px)','색상 조합','사용 예시'],
            [
                ['Status Badge',  '10px / pad 2-8',  'fill + bold text',  'FR 상태(Done/Planned), 직업 전망(↑)'],
                ['Holland Code',  '11px / pad 3-10', '각 유형 accent 색',  '직업 상세 헤더, 검사 결과'],
                ['Category Tag',  '10px / pad 2-7',  'gray-100 / gray-600','직업 카테고리, 검사 종류'],
                ['Assessment Tag','11px / pad 4-12', '검사별 bg+accent',   '선택된 검사 뱃지, 결과 요약'],
                ['Skill Tag',     '12px / pad 5-12', 'brand-50 / brand-600','직업 핵심 스킬 목록'],
            ]
        ),

        spacer(160),
        h3('4.2.4  Progress Bar'),
        note('Figma: Atom / ProgressBar / Linear|Dot / Active|Inactive|Done  — 3가지 진행 표시 원소','info'),
        spacer(60),
        mkTable([2000,3000,4026],[]).build(
            ['종류','규격','사용 위치'],
            [
                ['Linear Bar (전체)','height: 5px, radius: 999px, bg: brand-900→brand-600 gradient','Sticky 진행 바 — 전체 검사 대비 진행률'],
                ['Linear Bar (검사 내)','height: 6px, radius: 999px, 검사별 accent 색','AssessmentStep 개별 검사 헤더'],
                ['Dot Indicator','현재: 18px×6px(capsule), 완료: 6px(circle, brand-200), 미완: 6px(gray-200)','Sticky 진행 바 하단 — 현재 페이지 위치'],
                ['Radar Chart', 'SVG 220×220, 6각형(Holland) / 8각형(적성) / 10각형(가치관) / 5각형(Big5)','검사 결과 화면 좌측'],
            ]
        ),

        spacer(200),

        // ── 4.3 Molecules ─────────────────────────────────────
        h2('4.3  Molecules — 분자 컴포넌트'),
        para([
            {text:'Molecules',bold:true},
            '은 2개 이상의 Atom이 결합되어 단일 역할을 수행하는 단위입니다. ',
            {text:'Figma: Molecule / [Name] / [Variant]',bold:true,color:C.navy},
        ],60,100),

        h3('4.3.1  SearchBox'),
        note('Figma: Molecule / SearchBox / Default|Focus|Filled','code'),
        spacer(60),
        mkTable([2200,6826],[]).build(
            ['구성 요소','규격'],
            [
                ['CategorySelect','너비 80px min. border-right: 1px solid gray-200. options: 전체/직업/학과/자격증'],
                ['TextInput','flex: 1, placeholder: "직업명, 학과, 관심 분야를 검색하세요", Enter 키 검색 트리거'],
                ['SearchButton','bg: brand-900, color: white, hover: brand-800. 아이콘(돋보기) + "검색" 텍스트'],
                ['컨테이너', 'height: 48px, radius: 10px, overflow: hidden, shadow-xl. bg: white'],
            ]
        ),

        spacer(120),
        h3('4.3.2  QuickMenuItem'),
        note('Figma: Molecule / QuickMenuItem / Default|Hover  — GNB 아래 5개 아이콘 메뉴 항목','code'),
        spacer(60),
        ...codeBlock([
            'interface QuickMenuItemProps {',
            '  icon    : React.ReactNode;   // SVG 24×24, stroke: brand-900',
            '  label   : string;            // 최대 6자 권장',
            '  route   : string;            // React Router 경로',
            '}',
            '// 호버 상태: border brand-600, bg brand-50, icon bg → brand-900',
            '// 아이콘 컨테이너: 40×40, radius: 10px, bg: brand-50',
        ],'1E293B'),

        spacer(120),
        h3('4.3.3  ScaleButton (검사 척도 버튼)'),
        note('Figma: Molecule / ScaleButton / 1~5 / Default|Selected  — 5점 척도 개별 버튼','code'),
        spacer(60),
        mkTable([2200,6826],[]).build(
            ['Props / 상태','규격'],
            [
                ['Default 상태','border: 1.5px solid gray-200, bg: white, color: gray-600. radius: 8px'],
                ['Selected 상태','border: 2px solid {dimColor}, bg: {dimColor}12, color: {dimColor}, fontWeight: 700'],
                ['이모지 영역','fontSize: 14px, marginBottom: 2px (😶 🙁 😐 🙂 😄)'],
                ['점수 텍스트','fontSize: 10px (1~5), label: 9px (전혀 아니다 ~ 매우 그렇다)'],
                ['레이아웃','flex: 1, minWidth: 52px, height: auto. 5개가 균등 flex row 배치'],
            ]
        ),

        spacer(120),
        h3('4.3.4  StepperItem'),
        note('Figma: Molecule / StepperItem / Done|Active|Inactive  — 로드맵 스테퍼 개별 단계','code'),
        spacer(60),
        mkTable([2000,3200,3826],[]).build(
            ['상태','Circle 스타일','Label 스타일'],
            [
                ['Inactive','width/height: 40px, radius: 50%, border: 2px solid gray-200, bg: white, icon: gray-400','11px, color: gray-400, fontWeight: 500'],
                ['Done',    'bg: brand-100 (#dbeafe), border: brand-600 (#2563eb), icon: brand-800','11px, color: brand-800, fontWeight: 500'],
                ['Active',  'bg: brand-900, border: brand-900, icon: white, box-shadow: 0 0 0 4px brand-900/12','11px, color: brand-900, fontWeight: 700'],
                ['Badge',   '(Active에만) "진행중" 뱃지: absolute, top: -4px, right: calc(50%-26px), bg: brand-900','9px, color: white, radius: 8px, pad: 1px 5px'],
            ]
        ),

        spacer(200),

        // ── 4.4 Organisms ────────────────────────────────────
        h2('4.4  Organisms — 유기체 컴포넌트'),
        para([
            {text:'Organisms',bold:true},
            '는 Molecules 및 Atoms의 조합으로 독립적인 UI 블록을 형성합니다. ',
            {text:'Figma: Organism / [Name]',bold:true,color:C.navy},
        ],60,100),

        h3('4.4.1  GNB (Global Navigation Bar)'),
        spacer(60),
        mkTable([2000,7026],[]).build(
            ['영역','명세'],
            [
                ['전체 컨테이너','height: 56px, position: sticky, top: 0, z-index: 40, bg: white, border-bottom: 2px solid brand-900, shadow-sm'],
                ['로고 영역','좌측. logo-mark: 32×32 brand-900 배경 radius-6 + "CN" 텍스트. logo-text: 16px bold brand-900'],
                ['GNB 네비게이션','중앙. 5개 메뉴. active: border-bottom 2px brand-900, font-semibold. hover: color brand-900'],
                ['우측 컨트롤 영역','마이페이지 아이콘(34×34 circle) + 로그인 버튼(pill) + 햄버거(34×34 radius-6)'],
                ['마이페이지 아이콘','비로그인: 숨김. 로그인: 표시. 클릭 시 MypageDropdown 토글'],
                ['로그인 버튼','border: 1.5px solid brand-600, radius: 20px, text: brand-600. 클릭 시 LoginDropdown 토글'],
                ['햄버거 버튼','모바일만 표시. 클릭 시 모바일 메뉴 슬라이드 다운'],
                ['드롭다운 닫힘','useRef + mousedown 이벤트로 외부 클릭 감지. overlay div 사용 금지(배경 클릭 차단)'],
            ]
        ),

        spacer(120),
        h3('4.4.2  Sticky Progress Bar (검사 진행 바)'),
        note('GNB(56px) + CareerDesign 스테퍼(52px) = top: 108px 고정. CSS 변수 --gnb-height, --stepper-height 사용 권장.','warn'),
        spacer(60),
        mkTable([2400,6626],[]).build(
            ['구성 요소','명세'],
            [
                ['외부 컨테이너','position: sticky, top: 108px, z-index: 20. margin: -16px (좌우 부모 패딩 상쇄). padding-bottom: 10px. bg: linear-gradient(to bottom, #f9fafb 82%, transparent)'],
                ['내부 카드','bg: white, radius: 12px. 스크롤 감지(isScrolled) 시: border-color #cbd5e1, box-shadow 0 2px 14px rgba(26,54,93,0.09)'],
                ['검사 뱃지 행','flex wrap, gap: 5px. 완료: bg lightGreen + ✓. 현재: 검사 accent bg + ▶ + 1.5px border. 미시작: gray-100'],
                ['전체 진행률 바','height: 5px, radius-full, gradient brand-900→brand-600, transition: width 0.45s cubic-bezier(0.4,0,0.2,1)'],
                ['페이지 도트','현재 페이지: width 18px×height 6px (캡슐형). 완료: 6px circle brand-200. 미완: 6px circle gray-200. transition: width 0.25s'],
                ['문항 수 텍스트','우측 정렬. "이 검사 N/T문항". 10px gray-400'],
            ]
        ),

        spacer(120),
        h3('4.4.3  JobCard'),
        spacer(60),
        ...codeBlock([
            'interface JobCardProps {',
            '  jobId      : string;      // job_001 등',
            '  title      : string;',
            '  emoji      : string;',
            '  desc       : string;',
            '  outlook    : "up" | "stable" | "down";',
            '  matchScore?: number;      // 0~100, 표시 시 컬러 분기',
            '  videoUrl  ?: string;      // 있으면 "실무 영상" 버튼 표시',
            '  onBookmark?: (id) => void;',
            '  onSelect  ?: (job) => void;',
            '}',
            '// 카드 height: auto, radius: 12px, border: 1px gray-200',
            '// 호버: border brand-900, shadow-md, translateY(-1px)',
            '// card-media: height 120~130px, overflow: hidden',
        ],'1E293B'),

        spacer(120),
        h3('4.4.4  AssessmentCard (검사 선택 카드)'),
        spacer(60),
        mkTable([2400,6626],[]).build(
            ['상태','시각 스타일'],
            [
                ['Default (비선택)','border: 1.5px solid gray-200, bg: white, radius: 14px, shadow: none'],
                ['Selected (선택)','border: 2px solid {accent}, shadow: 0 4px 16px {accent}20, translateY(-2px)'],
                ['체크 아이콘 (우상단)','비선택: 22×22 circle, border: 2px gray-300, bg: white. 선택: bg: {accent}, ✓ white'],
                ['이모지 아이콘 박스','48×48, radius: 12px, bg: {bg} (검사별 연한 색), fontSize: 24px'],
                ['선택 시 태그 행','검사 tags[] → 검사별 bg+accent 색 칩 표시 (opacity 0 → 1 fade-in)'],
            ]
        ),

        spacer(120),
        h3('4.4.5  LoginDropdown / MypageDropdown'),
        mkTable([2000,7026],[]).build(
            ['속성','명세'],
            [
                ['위치','position: absolute, top: calc(100% + 8px), right: 0, z-index: 50'],
                ['크기','LoginDropdown: width 260px. MypageDropdown: width 220px'],
                ['모서리','radius: 12px, border: 1px gray-200, shadow-xl'],
                ['헤더','bg: brand-900, 상단 radius 유지. 텍스트 white'],
                ['애니메이션','framer-motion: opacity 0→1, translateY -8→0, duration: 0.18s'],
                ['닫힘 조건','useRef mousedown + 외부 클릭 감지. 동일 버튼 재클릭으로도 닫힘'],
                ['최소 터치 타겟','메뉴 항목 최소 height: 36px (모바일 접근성)'],
            ]
        ),

        spacer(200),

        // ── 4.5 Templates & Pages ─────────────────────────────
        h2('4.5  Templates & Pages — 레이아웃 구조'),

        h3('4.5.1  페이지 공통 레이아웃'),
        note('모든 페이지는 아래 구조를 따릅니다. 컨텐츠 영역 max-width는 900~1280px (페이지별 상이).','info'),
        spacer(60),
        ...codeBlock([
            '<html>',
            '  <body bg="#f9fafb">         // --color-gray-50',
            '    <GNB />                   // sticky top-0, h-14(56px), z-40',
            '    <CareerDesignStepper />   // sticky top-[56px], z-30  (진로설계 전용)',
            '    <StickyProgressBar />     // sticky top-[108px], z-20 (검사 진행 전용)',
            '    <main max-w-[900px] mx-auto px-4>',
            '      {/* 페이지 콘텐츠 */}',
            '    </main>',
            '    <Footer />                // bg brand-900 (배너 역할)',
            '  </body>',
            '</html>',
        ],'1E293B'),

        spacer(120),
        h3('4.5.2  반응형 브레이크포인트'),
        mkTable([1800,2000,2000,3226],[]).build(
            ['브레이크포인트','범위','Tailwind 접두어','주요 변경 사항'],
            [
                ['Mobile S', '0~480px',   'default','단일 컬럼. GNB 햄버거 메뉴 표시'],
                ['Mobile L', '481~768px', 'sm:',   '검사 선택 2열 그리드'],
                ['Tablet',   '769~1024px','md:',   'GNB 데스크탑 메뉴 표시. Quick Menu 5열'],
                ['Desktop',  '1025px+',   'lg:',   '메인 그리드 3열. 최대 max-w-7xl'],
            ]
        ),

        spacer(200),

        // ── 4.6 인터랙션 & 애니메이션 가이드 ─────────────────
        h2('4.6  인터랙션 & 애니메이션 가이드'),
        note('원칙: 애니메이션은 사용자 행동에 즉각 반응하며, 60fps를 유지합니다. 모든 transition 속성은 will-change: auto 사용 금지.','warn'),
        spacer(80),
        mkTable([2400,2400,4226],[]).build(
            ['트리거','효과','구현 방식'],
            [
                ['카드 호버','translateY(-1~2px) + shadow 강화 + border 색 변경','CSS transition: all 0.18s'],
                ['버튼 호버','background 색상 darkening','CSS transition: background 0.2s'],
                ['드롭다운 열림·닫힘','opacity 0→1 + translateY -8→0px','framer-motion AnimatePresence, duration: 0.18s'],
                ['검사 척도 버튼 선택','border 색 + background tint + fontWeight','CSS transition: all 0.15s'],
                ['진행 바 증가','width 변화','CSS transition: width 0.45s cubic-bezier(0.4,0,0.2,1)'],
                ['페이지 도트 활성화','width 6px → 18px (캡슐 변형)','CSS transition: all 0.25s ease'],
                ['점수 바 렌더','0% → N% 증가','CSS transition: width 0.6~0.8s ease, 마운트 시 트리거'],
                ['검사 완료 전환','탭 오버레이 전환','React state 변경 + 자연스러운 mount'],
                ['Sticky 바 그림자','shadow: none → shadow-md','scroll listener + state, transition: box-shadow 0.2s'],
            ]
        ),

        spacer(160),
        h3('4.6.1  접근성 애니메이션 대응'),
        note('prefers-reduced-motion 미디어 쿼리 대응: 시스템에서 애니메이션 감소를 설정한 사용자에게는 transition 및 animation을 즉시 전환으로 대체해야 합니다.','danger'),
        spacer(60),
        ...codeBlock([
            '/* tailwind.config.js 또는 index.css에 추가 */',
            '@media (prefers-reduced-motion: reduce) {',
            '  *, *::before, *::after {',
            '    animation-duration: 0.01ms !important;',
            '    animation-iteration-count: 1 !important;',
            '    transition-duration: 0.01ms !important;',
            '  }',
            '}',
        ],'1E293B'),

        spacer(200),

        // ── 4.7 Figma 연동 가이드 ─────────────────────────────
        h2('4.7  Figma 파일 구조 및 연동 가이드'),
        para([
            {text:'Figma 권장 파일 구조',bold:true},
            ': 2025년 실무 기준 멀티파일 모듈형 아키텍처 적용.',
        ],60,100),

        mkTable([2400,3000,3626],[]).build(
            ['Figma 파일 이름','내용','연결 대상'],
            [
                ['CareerNet — 🎨 Tokens','Color·Typography·Spacing·Shadow 변수. Figma Variables 사용','tailwind.config.js, index.css CSS 변수'],
                ['CareerNet — ⚛ Components','Atoms·Molecules·Organisms 라이브러리. Auto-layout 적용','React 컴포넌트 Props와 1:1 명명'],
                ['CareerNet — 📐 Templates','페이지 레이아웃 뼈대. 실제 데이터 없음','pages/ 디렉토리 구조'],
                ['CareerNet — 🖥 Screens','실제 데이터 적용 화면. 개발자 핸드오프용','Figma Dev Mode로 CSS 추출'],
                ['CareerNet — 📖 Docs','디자인 가이드 문서 페이지 (이 문서의 시각화)','이 Word 문서와 병행 유지'],
            ]
        ),

        spacer(100),
        h3('4.7.1  Figma 컴포넌트 명명 규칙'),
        note('슬래시(/)로 계층 구분. Figma Assets 패널에서 자동 그룹핑 됩니다.','info'),
        spacer(60),
        ...codeBlock([
            '// Atom 예시',
            'Button / Primary / Default',
            'Button / Primary / Hover',
            'Button / Primary / Disabled',
            'Button / Secondary / Default',
            '',
            '// Molecule 예시',
            'ScaleButton / 1-Strongly-Disagree / Default',
            'ScaleButton / 3-Neutral / Selected',
            'StepperItem / Active',
            'StepperItem / Done',
            '',
            '// Organism 예시',
            'GNB / Logged-Out',
            'GNB / Logged-In',
            'StickyProgressBar / Scrolled',
            'StickyProgressBar / Default',
            'AssessmentCard / Holland / Selected',
        ],'0F172A'),

        spacer(100),
        h3('4.7.2  개발 핸드오프 체크리스트'),
        ...([
            'Figma Dev Mode에서 CSS 값 추출 시 Design Token 이름과 일치하는지 확인',
            '컴포넌트 Props 인터페이스가 Figma Variant 이름과 대응되는지 검토',
            'Auto-layout gap·padding 값이 Spacing Token(4px 배수)과 일치하는지 확인',
            '텍스트 스타일이 Typography Token 정의와 일치하는지 확인',
            '색상이 Color Token을 직접 입력이 아닌 Variables로 참조하는지 확인',
            '반응형 브레이크포인트별 Auto-layout 크기 제약 설정',
            '인터랙티브 컴포넌트(드롭다운, 모달)에 Prototype 연결',
        ]).map(t=>bullet(t)),

        spacer(200),
        divider(),
        spacer(100),

        // ── 문서 마무리 ────────────────────────────────────────
        para([
            {text:'문서 끝 (Vol.2)  —  ',bold:true,color:C.navy},
            {text:'PART 5 (개발 로드맵 & 백로그)는 Vol.3 문서에서 이어집니다.'},
        ],60,30),
        para([
            {text:'다음 갱신 예정 항목: ',bold:true,color:C.slate},
            {text:'FR-MENT-001~008 (멘토링 시스템), FR-MYPAGE-001~008 (마이페이지), 4.8 다크모드 토큰 가이드'},
        ],30,60),
    ];
}

// ═══════════════════════════════════════════════════════════
// 문서 조립
// ═══════════════════════════════════════════════════════════
const doc = new Document({
    creator: 'CareerNet Tech Lead',
    title:   'CareerNet 프로젝트 개발 명세서 Vol.2',
    description:'기능 명세서(FRD) 및 UI/UX 컴포넌트 디자인 가이드',
    styles:{
        default:{document:{run:{font:'Arial',size:22}}},
        paragraphStyles:[
            {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,
                run:{size:38,bold:true,font:'Arial',color:C.navy},
                paragraph:{spacing:{before:440,after:160},outlineLevel:0}},
            {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,
                run:{size:28,bold:true,font:'Arial',color:C.navy},
                paragraph:{spacing:{before:320,after:120},outlineLevel:1}},
            {id:'Heading3',name:'Heading 3',basedOn:'Normal',next:'Normal',quickFormat:true,
                run:{size:24,bold:true,font:'Arial',color:C.slate},
                paragraph:{spacing:{before:240,after:80},outlineLevel:2}},
        ],
    },
    numbering:{config:[
            {reference:'bul',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,
                    style:{paragraph:{indent:{left:540,hanging:260}}}}]},
            {reference:'bul2',levels:[{level:0,format:LevelFormat.BULLET,text:'◦',alignment:AlignmentType.LEFT,
                    style:{paragraph:{indent:{left:800,hanging:260}}}}]},
            {reference:'num',levels:[{level:0,format:LevelFormat.DECIMAL,text:'%1.',alignment:AlignmentType.LEFT,
                    style:{paragraph:{indent:{left:540,hanging:260}}}}]},
        ]},
    sections:[{
        properties:{
            page:{
                size:{width:11906,height:16838},
                margin:{top:1080,right:1080,bottom:1080,left:1080},
            },
        },
        headers:{
            default:new Header({children:[new Paragraph({
                    alignment:AlignmentType.RIGHT,
                    border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.border,space:4}},
                    children:[new TextRun({text:'CareerNet 개발 명세서 Vol.2  |  FRD + UI/UX 가이드  |  내부용',size:18,font:'Arial',color:C.gray})],
                })]}),
        },
        footers:{
            default:new Footer({children:[new Paragraph({
                    border:{top:{style:BorderStyle.SINGLE,size:4,color:C.border,space:4}},
                    tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],
                    children:[
                        new TextRun({text:'© 2025 CareerNet Project  — 갱신: 기능 변경 시마다',size:18,font:'Arial',color:C.gray}),
                        new TextRun({text:'\t',size:18}),
                        new TextRun({text:'페이지 ',size:18,font:'Arial',color:C.gray}),
                        new PageNumberElement({size:18,font:'Arial',color:C.gray}),
                    ],
                })]})
        },
        children:[
            ...makeCover(),
            ...makeChangelog(),
            ...makePart3(),
            ...makePart4(),
        ],
    }],
});

Packer.toBuffer(doc).then(buf=>{
    fs.writeFileSync('/mnt/user-data/outputs/CareerNet_Dev_Spec_Vol2.docx',buf);
    console.log('✅ 완료: CareerNet_Dev_Spec_Vol2.docx');
}).catch(e=>{
    console.error('❌',e.message);
    process.exit(1);
});