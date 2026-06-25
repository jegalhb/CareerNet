import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

function unwrap(response) {
    const body = response.data;
    if (!body?.success) {
        throw new Error(body?.message || 'API 요청에 실패했습니다.');
    }
    return body.data;
}

export function getApiErrorMessage(error) {
    return error?.response?.data?.message || error?.message || 'API 요청 중 오류가 발생했습니다.';
}

export async function signupUser(formData) {
    return unwrap(await api.post('/auth/signup', formData));
}

export async function loginUser(email, password) {
    return unwrap(await api.post('/auth/login', { email, password }));
}

export async function getUser(userId) {
    return unwrap(await api.get(`/users/${userId}`));
}

export async function getJobs(params = {}) {
    return unwrap(await api.get('/jobs', { params }));
}

export async function getJob(jobId) {
    return unwrap(await api.get(`/jobs/${jobId}`));
}

export async function getJobMentors(jobId) {
    return unwrap(await api.get(`/jobs/${jobId}/mentors`));
}

export async function getTopMentor(jobId) {
    return unwrap(await api.get(`/jobs/${jobId}/mentors/top`));
}

export async function getMentors(params = {}) {
    return unwrap(await api.get('/mentors', { params }));
}

export async function getMentor(mentorId) {
    return unwrap(await api.get(`/mentors/${mentorId}`));
}

export async function submitHollandAssessment(userId, answers) {
    return unwrap(await api.post('/assessments/holland', { userId, answers }));
}
