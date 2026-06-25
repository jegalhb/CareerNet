CREATE TABLE app_user (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    education_level VARCHAR(50),
    interest VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

CREATE TABLE job (
    job_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    summary VARCHAR(500),
    description TEXT,
    required_skills TEXT,
    roadmap TEXT,
    avg_salary VARCHAR(100),
    outlook_label VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

CREATE TABLE job_holland_code (
    job_holland_code_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_id BIGINT NOT NULL,
    holland_type VARCHAR(10) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    sort_order INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_job_holland_code_job
        FOREIGN KEY (job_id) REFERENCES job(job_id)
);

CREATE TABLE assessment_result (
    assessment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    assessment_type VARCHAR(30) NOT NULL,
    holland_code VARCHAR(10),
    primary_type VARCHAR(10),
    score_r INT NOT NULL DEFAULT 0,
    score_i INT NOT NULL DEFAULT 0,
    score_a INT NOT NULL DEFAULT 0,
    score_s INT NOT NULL DEFAULT 0,
    score_e INT NOT NULL DEFAULT 0,
    score_c INT NOT NULL DEFAULT 0,
    pct_r INT NOT NULL DEFAULT 0,
    pct_i INT NOT NULL DEFAULT 0,
    pct_a INT NOT NULL DEFAULT 0,
    pct_s INT NOT NULL DEFAULT 0,
    pct_e INT NOT NULL DEFAULT 0,
    pct_c INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assessment_result_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id)
);

CREATE TABLE assessment_answer (
    answer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assessment_id BIGINT NOT NULL,
    question_id INT NOT NULL,
    question_type VARCHAR(10) NOT NULL,
    score INT NOT NULL,
    CONSTRAINT fk_assessment_answer_result
        FOREIGN KEY (assessment_id) REFERENCES assessment_result(assessment_id)
);

CREATE TABLE assessment_recommendation (
    recommendation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assessment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    match_score INT NOT NULL,
    match_label VARCHAR(50),
    rank_no INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assessment_recommendation_result
        FOREIGN KEY (assessment_id) REFERENCES assessment_result(assessment_id),
    CONSTRAINT fk_assessment_recommendation_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    CONSTRAINT fk_assessment_recommendation_job
        FOREIGN KEY (job_id) REFERENCES job(job_id)
);

CREATE TABLE mentor (
    mentor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    company_name VARCHAR(150),
    profile_image_url VARCHAR(500),
    headline VARCHAR(255),
    short_description VARCHAR(500),
    interview_title VARCHAR(255),
    interview_content TEXT,
    career_summary TEXT,
    recommendation_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

CREATE TABLE mentor_job (
    mentor_job_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    mentor_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    priority INT NOT NULL DEFAULT 1,
    recommendation_weight DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    CONSTRAINT fk_mentor_job_mentor
        FOREIGN KEY (mentor_id) REFERENCES mentor(mentor_id),
    CONSTRAINT fk_mentor_job_job
        FOREIGN KEY (job_id) REFERENCES job(job_id),
    CONSTRAINT uq_mentor_job UNIQUE (mentor_id, job_id)
);

CREATE TABLE mentoring_request (
    mentoring_request_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    mentor_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    request_message TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_mentoring_request_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    CONSTRAINT fk_mentoring_request_mentor
        FOREIGN KEY (mentor_id) REFERENCES mentor(mentor_id),
    CONSTRAINT fk_mentoring_request_job
        FOREIGN KEY (job_id) REFERENCES job(job_id)
);

CREATE INDEX idx_job_category ON job(category);
CREATE INDEX idx_assessment_result_user ON assessment_result(user_id);
CREATE INDEX idx_assessment_recommendation_assessment ON assessment_recommendation(assessment_id);
CREATE INDEX idx_mentor_active_count ON mentor(is_active, recommendation_count);
CREATE INDEX idx_mentor_job_job ON mentor_job(job_id);
