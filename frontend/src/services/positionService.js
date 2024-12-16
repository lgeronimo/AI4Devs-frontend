import axios from 'axios';

export const getPositions = async () => {
    try {
        const response = await axios.get('http://localhost:3010/positions');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener las posiciones:', error.response.data);
    }
}; 