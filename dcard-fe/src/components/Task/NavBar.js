import { useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

export default function NavBar({
  searchWord,
  setSearchWord,
  getSearchTask,
  clearSearch,
}) {
  const navigate = useNavigate();
  // 登出清除 localStorage
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    navigate('/');
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <Container>
          <div className="d-flex m-auto">
            <Form.Control
              type="search"
              className="rounded-0"
              placeholder="請輸入 Task 內容"
              onChange={(e) => {
                setSearchWord(e.target.value);
              }}
              value={searchWord}
            ></Form.Control>
            <Button
              variant="primary-300"
              type="submit"
              onClick={getSearchTask}
              className="me-1 rounded-0 rounded-end"
            >
              Search
            </Button>
            <Button
              variant="outline-primary-300"
              type="submit"
              onClick={clearSearch}
            >
              Clear
            </Button>
          </div>
          <Button variant="outline-info" type="submit" onClick={logout}>
            Log Out
          </Button>
        </Container>
      </nav>
    </>
  );
}
