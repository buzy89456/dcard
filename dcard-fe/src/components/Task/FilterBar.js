import Nav from 'react-bootstrap/Nav';

export default function FilterBar({ taskStatus, setTaskStatus }) {
  const status = ['All', 'Open', 'In Progress', 'Done'];
  return (
    <>
      <Nav>
        {status.map((v, i) => (
          <Nav.Item key={i}>
            <Nav.Link
              className={taskStatus === v && 'active'}
              onClick={() => {
                setTaskStatus(v);
              }}
              style={{ cursor: 'pointer' }}
            >
              {v}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </>
  );
}
