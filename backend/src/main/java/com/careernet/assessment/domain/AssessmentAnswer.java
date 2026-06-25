package com.careernet.assessment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "assessment_answer")
public class AssessmentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private AssessmentResult assessmentResult;

    @Column(name = "question_id", nullable = false)
    private int questionId;

    @Column(name = "question_type", nullable = false, length = 10)
    private String questionType;

    @Column(nullable = false)
    private int score;

    protected AssessmentAnswer() {
    }

    public AssessmentAnswer(AssessmentResult assessmentResult, int questionId, String questionType, int score) {
        this.assessmentResult = assessmentResult;
        this.questionId = questionId;
        this.questionType = questionType;
        this.score = score;
    }
}
