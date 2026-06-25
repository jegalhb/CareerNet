package com.careernet.job.domain;

public class Job {

    private final String jobId;
    private final String jobName;
    private final String category;
    private final String avgSalary;
    private final String outlookLabel;
    private final String hollandCodes;

    public Job(
            String jobId,
            String jobName,
            String category,
            String avgSalary,
            String outlookLabel,
            String hollandCodes
    ) {
        this.jobId = jobId;
        this.jobName = jobName;
        this.category = category;
        this.avgSalary = avgSalary;
        this.outlookLabel = outlookLabel;
        this.hollandCodes = hollandCodes;
    }

    public String getJobId() {
        return jobId;
    }

    public String getJobName() {
        return jobName;
    }

    public String getCategory() {
        return category;
    }

    public String getAvgSalary() {
        return avgSalary;
    }

    public String getOutlookLabel() {
        return outlookLabel;
    }

    public String getHollandCodes() {
        return hollandCodes;
    }
}
