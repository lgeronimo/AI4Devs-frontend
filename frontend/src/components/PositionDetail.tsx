import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPositionDetail, getCandidatesByPosition } from '../services/positionDetailService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Candidate {
  id: number;
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

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }

    const movedCandidate = candidates.find(
      candidate => candidate.id.toString() === draggableId
    );

    if (!movedCandidate) return;

    const newCandidates = candidates.filter(
      candidate => candidate.id.toString() !== draggableId
    );

    const updatedCandidate = {
      ...movedCandidate,
      currentInterviewStep: destination.droppableId
    };

    newCandidates.splice(destination.index, 0, updatedCandidate);

    setCandidates(newCandidates);

    // TODO: Actualizar en el backend
    // updateCandidateStage(updatedCandidate.id, applicationId, destination.droppableId);
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
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {position?.interviewFlow.interviewSteps.map((step) => (
            <Droppable droppableId={step.name} key={step.id}>
              {(provided) => (
                <div 
                  className="kanban-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h2 className="text-lg font-semibold">{step.name}</h2>
                  <div className="space-y-3">
                    {candidates
                      .filter(candidate => candidate.currentInterviewStep === step.name)
                      .map((candidate, index) => (
                        <Draggable key={candidate.id.toString()} draggableId={candidate.id.toString()} index={index}>
                          {(provided) => (
                            <div 
                              className="kanban-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <p className="font-medium">{candidate.fullName}</p>
                              <div className="text-sm text-gray-600 score-badge">
                                {renderStars(candidate.averageScore)}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default PositionDetail;
