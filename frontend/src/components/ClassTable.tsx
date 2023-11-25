import React from "react";

import { Container, Table } from "react-bootstrap";

type ClassTuple = [number, string, string];

const ClassTable: React.FC<{ classTuple: ClassTuple[] }> = ({ classTuple }) => {
    return (
        <Container>
            <h2 className='mt-3'>Course List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        classTuple.map((course, index) => (
                            <tr key={index}>
                                <td>{course[1]}</td>
                                <td>{course[2]}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </Container>
    );
};

export default ClassTable;