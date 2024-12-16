import { getCandidatesByPosition, getInterviewFlowByPosition } from '../presentation/controllers/positionController';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/:id/candidates', getCandidatesByPosition);
router.get('/:id/interview-flow', getInterviewFlowByPosition);

router.get('/', async (req, res) => {
    try {
        const positions = await prisma.position.findMany();
        res.json(positions);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las posiciones' });
    }
});

export default router;
