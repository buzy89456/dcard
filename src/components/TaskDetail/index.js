import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import TaskData from './TaskData';
import EditTask from './EditTask';
import UpdateTask from './UpdateTask';
import DeleteTask from './DeleteTask';

function TaskDetail() {
  const token = localStorage.getItem('accessToken');
  const { owner, repo, issue } = useParams();
  const [taskDetail, setTaskDetail] = useState([]);
  // 編輯完資料後重新渲染
  const [rerender, setRerender] = useState(false);
  // 載入 spinner 動畫用
  const [isLoading, setIsLoading] = useState(false);

  // 設定 0.5 秒後自動關掉 spinner
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading]);

  // 抓取 task 詳細資料
  useEffect(() => {
    setIsLoading(true);
    async function getTaskDetail() {
      try {
        let { data } = await axios({
          method: 'get',
          url: `https://api.github.com/repos/${owner}/${repo}/issues/${issue}`,
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: 'Bearer ' + token,
          },
        });
        setTaskDetail(data);
        // console.log(data);
      } catch (e) {
        console.error(e);
      }
    }
    getTaskDetail();
  }, [rerender]);

  // bootstrap spinner動畫設定
  const spinner = (
    <div className="d-flex justify-content-center">
      <div className="spinner-border text-primary-100" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-gray p-3" style={{ minHeight: '100vh' }}>
        <Container className="p-5 bg-white rounded-4">
          <div className="d-flex">
            <Link
              to={'/task'}
              className="text-decoration-none btn btn-primary-100 me-2"
            >
              返回列表
            </Link>
            {/* labels */}
            <UpdateTask
              taskDetail={taskDetail}
              owner={owner}
              repo={repo}
              issue={issue}
            />
          </div>
          {/* Task 列表 */}
          <div>
            <div className="border border-primary-300 rounded my-3 p-3">
              {isLoading ? (
                spinner
              ) : (
                <div>
                  <TaskData taskDetail={taskDetail} />
                  {taskDetail.state === 'open' && (
                    <div className="d-flex justify-content-end">
                      <EditTask
                        taskDetail={taskDetail}
                        owner={owner}
                        repo={repo}
                        issue={issue}
                        setRerender={setRerender}
                        rerender={rerender}
                      />
                      <DeleteTask
                        owner={owner}
                        repo={repo}
                        issue={issue}
                        setRerender={setRerender}
                        rerender={rerender}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default TaskDetail;
