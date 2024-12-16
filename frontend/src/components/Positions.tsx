import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { getPositions } from '../services/positionService';

type Position = {
    id: number;
    title: string;
    jobDescription: string;
    applicationDeadline: string;
    status: 'Open' | 'Hired' | 'Closed' | 'Draft';
};

function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

const Positions: React.FC = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const data = await getPositions();
                setPositions(data);
            } catch (error) {
                setError('Error loading positions');
            }
        };

        fetchPositions();
    }, []);

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Positions</h2>
            {error && <p className="text-danger">{error}</p>}
            <Row>
                {positions.map((position) => (
                    <Col md={4} key={position.id} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>{position.title}</Card.Title>
                                <Card.Text>
                                    <strong>Job Description:</strong> {position.jobDescription}<br />
                                    <strong>Deadline:</strong> {formatDate(position.applicationDeadline)}
                                </Card.Text>
                                <span className={`badge ${position.status === 'Open' ? 'bg-success' : position.status === 'Hired' ? 'bg-secondary' : position.status === 'Closed' ? 'bg-danger' : 'bg-warning'} text-white`}>
                                    {position.status}
                                </span>
                                <div className="d-flex justify-content-between mt-3">
                                    <Button variant="primary">View Process</Button>
                                    <Button variant="secondary">Edit</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Positions;