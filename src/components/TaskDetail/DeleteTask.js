import { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

export default function DeleteTask({
  owner,
  repo,
  issue,
  setRerender,
  rerender,
}) {
  // 刪除 task 的彈跳視窗
  const [deleteModal, setDeleteModal] = useState(false);
  const handleDeleteClose = () => setDeleteModal(false);
  const handleDeleteShow = () => setDeleteModal(true);
  // 刪除 task
  const deleteTask = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios({
        method: 'patch',
        url: `https://api.github.com/repos/${owner}/${repo}/issues/${issue}`,
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: 'Bearer ' + token,
        },
        data: {
          state: 'closed',
        },
      });
      handleDeleteClose();
      setRerender(!rerender);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Button variant="primary-300" onClick={handleDeleteShow}>
        刪除
      </Button>

      {/* Delete Modal */}
      <Modal show={deleteModal} onHide={handleDeleteClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-primary-300">
            確定要刪除此Task嗎?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="border-0">
          <Button variant="outline-primary-300" onClick={handleDeleteClose}>
            取消
          </Button>
          <Button variant="primary-300" onClick={deleteTask}>
            確定
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
