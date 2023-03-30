import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import NavBar from './NavBar';
import FilterBar from './FilterBar';
import SortBar from './SortBar';
import TaskItem from './TaskItem';
import AddTask from './AddTask';

export default function TaskList() {
  const navigate = useNavigate();
  // task 項目
  const [task, setTask] = useState([]);
  // task 呈現項目
  const [taskDisplay, setTaskDisplay] = useState([]);
  // 過濾 task 狀態
  const [taskStatus, setTaskStatus] = useState('Open');
  // task 排序
  const [sort, setSort] = useState('desc');
  // task 搜尋
  const [searchWord, setSearchWord] = useState('');
  const [searchStatus, setSearchStatus] = useState(false);
  // github 頁數設定
  const [page, setPage] = useState(1);
  // 載入 spinner 動畫用
  const [isLoading, setIsLoading] = useState(false);
  // 新增 Task 後重新渲染
  const [rerender, setRerender] = useState(false);

  // 設定 0.5 秒後自動關掉 spinner
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading]);
  // 當 task 選擇篩選或排序後顯示 spinner
  useEffect(() => {
    setIsLoading(true);
  }, [taskStatus, sort]);

  // task 狀態篩選
  const statusFilter = (currentFilter, taskArray) => {
    if (currentFilter === 'Open') return taskArray;
    if (currentFilter === 'In Progress') {
      return taskArray.filter((v, i) => {
        return v.state === 'open';
      });
    }
    if (currentFilter === 'Done') {
      return taskArray.filter((v, i) => {
        return v.state === 'closed';
      });
    }
  };

  // task 依時間排序
  const dateSort = (currentSort, taskArray) => {
    if (currentSort === 'desc') return taskArray;
    if (currentSort === 'asc') {
      let newArray = [...taskArray];
      return newArray.reverse();
    }
  };

  // 列表滾到底偵測
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight + 20 >= scrollHeight) {
      setPage(page + 1);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [task]);

  // Task 抓取 function
  async function getTask() {
    const token = localStorage.getItem('accessToken');
    // 沒有 token 返回登入頁
    if (!token) {
      navigate('/');
      return;
    }
    // 沒有搜尋 Task 時執行
    if (!searchStatus) {
      try {
        let { data } = await axios({
          method: 'get',
          url: 'https://api.github.com/issues',
          params: {
            filter: 'created',
            state: 'all',
            per_page: '10',
            page: page,
          },
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: 'Bearer ' + token,
          },
        });
        // 如果抓到資料則放入 Task 中，沒抓到移除監聽事件
        if (data.length > 0) {
          setTask([...task, ...data]);
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // 搜尋 Task 時執行
      try {
        let { data } = await axios({
          method: 'get',
          url: 'https://api.github.com/search/issues',
          params: {
            q:
              searchWord +
              ' in:body' +
              ` involves:${localStorage.getItem('userEmail')}`,
            sort: 'created',
            per_page: '10',
            page: page,
          },
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: 'Bearer ' + token,
          },
        });
        if (data.items.length > 0) {
          setTask([...task, ...data.items]);
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  // 當 page 改變或 searchStatus 改變時進行 Task 資料抓取
  useEffect(() => {
    getTask();
  }, [page, searchStatus, rerender]);

  // 執行 Task Search時將頁數、task 清空，
  const getSearchTask = () => {
    setPage(1);
    setSearchStatus(true);
    setTask([]);
  };

  // 清除 Task Search
  const clearSearch = () => {
    setPage(1);
    setSearchStatus(false);
    setTask([]);
    setSearchWord('');
  };

  // Task 列表頁顯示
  useEffect(() => {
    let newTask = statusFilter(taskStatus, task);
    newTask = dateSort(sort, newTask);
    setTaskDisplay(newTask);
  }, [task, taskStatus, sort]);

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
      <div className="bg-gray" style={{ minHeight: '100vh' }}>
        <NavBar
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          getSearchTask={getSearchTask}
          clearSearch={clearSearch}
        />

        <Container className="p-5 bg-white rounded-4 mt-3">
          <Row>
            {/* 篩選 */}
            <Col xs="4">
              <FilterBar
                taskStatus={taskStatus}
                setTaskStatus={setTaskStatus}
              />
            </Col>
            {/* 排序 */}
            <Col xs="4">
              <SortBar sort={sort} setSort={setSort} />
            </Col>
            {/* 新增 */}
            <Col xs="4">
              <div className="d-flex justify-content-end">
                <AddTask
                  rerender={rerender}
                  setRerender={setRerender}
                  setPage={setPage}
                  setTask={setTask}
                />
              </div>
            </Col>
          </Row>

          {/* Task 列表 */}
          <div>
            {isLoading ? spinner : <TaskItem taskDisplay={taskDisplay} />}
          </div>
        </Container>
      </div>
    </>
  );
}
