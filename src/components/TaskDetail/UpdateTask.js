import { useEffect, useState } from 'react';
import axios from 'axios';

function UpdateTask({ taskDetail, owner, repo, issue }) {
  // Task 原本的labels
  const labels = taskDetail.labels;
  // 設定的labels
  const labelArray = ['Open', 'In Progress', 'Done'];
  const [taskLabel, setTaskLabel] = useState('');

  useEffect(() => {
    // 如果有多個 labels，篩選後顯示要的結果
    if (labels && labels.length > 0) {
      const labelsStatus = labels.filter((v, i) => {
        return v.name === ('Open' || 'In Progress' || 'Done');
      });
      setTaskLabel(labelsStatus[0].name);
      //   console.log(labelsStatus);
    }
  }, [labels]);

  const updateLabels = async () => {
    const token = localStorage.getItem('accessToken');
    // const newLabels = [...labels];
    try {
      await axios({
        method: 'patch',
        url: `https://api.github.com/repos/${owner}/${repo}/issues/${issue}`,
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: 'Bearer ' + token,
        },
        data: { labels: ['Open'] },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="dropdown">
        <button
          className="btn btn-secondary bg-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {taskLabel}
        </button>
        <ul className="dropdown-menu" style={{ cursor: 'pointer' }}>
          {labelArray.map((v, i) => {
            return (
              <li
                key={i}
                onClick={() => {
                  setTaskLabel(v);
                  updateLabels();
                }}
              >
                <p className="dropdown-item">{v}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default UpdateTask;
