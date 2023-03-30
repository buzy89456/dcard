import { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

export default function AddTask({ rerender, setRerender, setPage, setTask }) {
  // 新增 task 的彈跳視窗
  const [addModal, setAddModal] = useState(false);
  const handleAddClose = () => setAddModal(false);
  const handleAddShow = () => {
    // 點開時清空上次輸入的資料
    setRepo('');
    setTaskTitle('');
    setTaskBody('');
    setAddModal(true);
  };
  // 新增 task 資料
  const [repo, setRepo] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskBody, setTaskBody] = useState('');

  const addTask = async () => {
    // 表單驗證
    if (!repo) {
      alert('請輸入repo名稱');
      return;
    }
    if (!taskTitle) {
      alert('請輸入標題名稱');
      return;
    }
    if (!taskBody || taskBody.length < 30) {
      alert('內容不得小於30字');
      return;
    }
    try {
      const owner = localStorage.getItem('userEmail');
      const token = localStorage.getItem('accessToken');
      await axios({
        method: 'post',
        url: `https://api.github.com/repos/${owner}/${repo}/issues`,
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: 'Bearer ' + token,
        },
        data: { title: taskTitle, body: taskBody },
      });
      alert('新增成功，若資料沒有顯示請重新整理頁面');
      handleAddClose();
      setPage(1);
      setTask([]);
      setRerender(!rerender);
    } catch (e) {
      // console.error(e);
      alert(`${e.response.data.message} 請確認輸入的資料是否正確`);
    }
  };
  return (
    <>
      <Button variant="primary-300" onClick={handleAddShow}>
        新增 Task
      </Button>

      {/* Add Modal */}
      <Modal show={addModal} onHide={handleAddClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-primary-300">新增 Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="row mb-2">
            <Col xs={2}>
              <Form.Label className="text-info-dark">Repo</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                className="text-info-dark"
                placeholder="請輸入Repo名稱"
                value={repo}
                onChange={(e) => {
                  setRepo(e.target.value);
                }}
              ></Form.Control>
            </Col>
          </Form.Group>
          <Form.Group className="row mb-2">
            <Col xs={2}>
              <Form.Label className="text-info-dark">標題</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                className="text-info-dark"
                value={taskTitle}
                placeholder="請輸入標題"
                onChange={(e) => {
                  setTaskTitle(e.target.value);
                }}
              ></Form.Control>
            </Col>
          </Form.Group>
          <Form.Group className="row">
            <Col xs={2}>
              <Form.Label className="text-info-dark">內容</Form.Label>
            </Col>
            <Col>
              <Form.Control
                minLength="30"
                style={{ minHeight: 300 }}
                as="textarea"
                className="text-info-dark"
                value={taskBody}
                placeholder="請輸入內容，最少需30字"
                onChange={(e) => {
                  setTaskBody(e.target.value);
                }}
              ></Form.Control>
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-primary-300" onClick={handleAddClose}>
            取消
          </Button>
          <Button variant="primary-300" onClick={addTask}>
            新增
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
