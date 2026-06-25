package com.careernet.job.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "job_holland_code")
public class JobHollandCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_holland_code_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "holland_type", nullable = false, length = 10)
    private String hollandType;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal weight = BigDecimal.ONE;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 1;

    protected JobHollandCode() {
    }

    public Long getId() {
        return id;
    }

    public Job getJob() {
        return job;
    }

    public String getHollandType() {
        return hollandType;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
