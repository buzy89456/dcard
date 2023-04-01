import { useEffect, useState } from 'react';
import axios from 'axios';

function LabelsTask({ taskDetail, owner, repo, issue, rerender, setRerender }) {
  const labelArray = ['Open', 'In Progress', 'Done'];
  const [taskLabels, setTaskLabels] = useState([]);
  const [labelDisplay, setLabelDisplay] = useState('');
  const labels = taskDetail.labels;

  useEffect(() => {
    if (labels) {
      // 取得所有的 labels
      const labelsStatus = labels.map((v) => v.name);
      setTaskLabels(labelsStatus);
      // 取得 Open / In Progress / Done
      const newLabel = labelsStatus.filter((v) => labelArray.includes(v));
      setLabelDisplay(newLabel);
    }
  }, [labels]);

  const updateLabels = async (newLabels) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios({
        method: 'patch',
        url: `https://api.github.com/repos/${owner}/${repo}/issues/${issue}`,
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: 'Bearer ' + token,
        },
        data: { labels: newLabels },
      });
      setRerender(!rerender);
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
          {labelDisplay.length > 0 ? labelDisplay : '請選擇 Labels'}
        </button>
        <ul className="dropdown-menu" style={{ cursor: 'pointer' }}>
          {labelArray.map((v, i) => {
            return (
              <li
                key={i}
                onClick={() => {
                  // 如果原本沒有任何狀態(Open / In Progress / Done)
                  if (!labelArray.some((v2) => taskLabels.includes(v2))) {
                    setTaskLabels([v, ...taskLabels]);
                    updateLabels([v, ...taskLabels]);
                  }
                  // 將原本的狀態刪除，更改後的狀態加入 labels
                  else if (!taskLabels.includes(v)) {
                    const newTaskLabels = taskLabels.filter(
                      (v2) => !labelArray.includes(v2)
                    );
                    setTaskLabels([v, ...newTaskLabels]);
                    updateLabels([v, ...newTaskLabels]);
                  }
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

export default LabelsTask;
