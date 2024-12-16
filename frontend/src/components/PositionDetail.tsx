import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPositionDetail, getCandidatesByPosition } from '../services/positionDetailService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { log } from 'console';

interface Candidate {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

interface InterviewStep {
  id: number;
  name: string;
  orderIndex: number;
}

interface PositionDetail {
  positionName: string;
  interviewFlow: {
    id: number;
    description: string;
    interviewSteps: InterviewStep[];
  };
}

const PositionDetail = () => {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState<PositionDetail | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const [positionData, candidatesData] = await Promise.all([
          getPositionDetail(positionId),
          getCandidatesByPosition(positionId)
        ]);

        setPosition(positionData);
        setCandidates(candidatesData);
      } catch (error) {
        console.error('Error fetching position data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositionData();
  }, [positionId]);

  const renderStars = (score: number) => {
    const stars = [];
    const roundedScore = Math.round(score);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          style={{ color: i < roundedScore ? '#fbbf24' : '#d1d5db' }}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-center text-blue-600">{position?.positionName}</h1>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {position?.interviewFlow.interviewSteps.map((step) => (
          <div 
            key={step.id}
            className="kanban-column"
          >
            <h2 className="text-lg font-semibold">{step.name}</h2>
            <div className="space-y-3">
              {candidates
                .filter(candidate => candidate.currentInterviewStep === step.name)
                .map((candidate, index) => (
                  <div 
                    key={index}
                    className="kanban-card"
                  >
                    <p className="font-medium">{candidate.fullName}</p>
                    <div className="text-sm text-gray-600 score-badge">
                      {renderStars(candidate.averageScore)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PositionDetail;
