import axios from 'axios';

export const getPositionDetail = async (positionId) => {
    try {
        const response = await axios.get(`http://localhost:3010/positions/${positionId}/interview-flow`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching position detail:', error.response.data);
    }
};

export const getCandidatesByPosition = async (positionId) => {
    try {
        const response = await axios.get(`http://localhost:3010/positions/${positionId}/candidates`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching candidates:', error.response.data);
    }
}; 

export const updateCandidateStage = async (candidateId, applicationId, newStepId) => {
    try {
        const response = await axios.put(`http://localhost:3010/candidates/${candidateId}`, {
            applicationId,
            currentInterviewStep: newStepId
        });
        return response.data;
    } catch (error) {
        throw new Error('Error updating candidate stage:', error.response.data);
    }
}; 