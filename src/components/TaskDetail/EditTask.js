import { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';

export default function EditTask({
  taskDetail,
  owner,
  repo,
  issue,
  setRerender,
  rerender,
}) {
  // 編輯 task 資料
  const [taskTitle, setTaskTitle] = useState('');
  const [taskBody, setTaskBody] = useState('');

  // 編輯 task 的彈跳視窗
  const [editModal, setEditModal] = useState(false);
  const handleEditClose = () => setEditModal(false);
  // 點開彈跳視窗抓取 task 的原始標題與內容
  const handleEditShow = () => {
    setEditModal(true);
    setTaskTitle(taskDetail.title);
    setTaskBody(taskDetail.body);
  };
  // 編輯 task
  const editTask = async () => {
    const token = localStorage.getItem('accessToken');
    if (!taskTitle) {
      alert('請輸入標題名稱');
      return;
    }
    if (!taskBody || taskBody.length < 30) {
      alert('內容不得小於30字');
      return;
    }
    try {
      await axios({
        method: 'patch',
        url: `https://api.github.com/repos/${owner}/${repo}/issues/${issue}`,
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: 'Bearer ' + token,
        },
        data: { title: taskTitle, body: taskBody },
      });
      handleEditClose();
      setRerender(!rerender);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Button
        variant="outline-primary-300"
        className="mx-4"
        onClick={handleEditShow}
      >
        編輯
      </Button>

      {/* Edit Modal */}
      <Modal show={editModal} onHide={handleEditClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-primary-300">編輯 Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="row mb-2">
            <Col xs={2}>
              <Form.Label className="text-info-dark">標題</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                className="text-info-dark"
                value={taskTitle}
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
                onChange={(e) => {
                  setTaskBody(e.target.value);
                }}
              ></Form.Control>
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-primary-300" onClick={handleEditClose}>
            取消
          </Button>
          <Button variant="primary-300" onClick={editTask}>
            更新
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
