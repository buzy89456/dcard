import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

export default function TaskItem({ taskDisplay }) {
  return (
    <>
      {taskDisplay.map((v, i) => {
        const url = new URL(`${v.url}`);
        const pathname = url.pathname.split('/');
        const [owner, repo, issue_number] = [
          pathname[2],
          pathname[3],
          pathname[5],
        ];
        return (
          <div
            key={v.id}
            className="border border-primary-300 rounded my-3 p-3"
          >
            <Link
              to={`/task/${owner}/${repo}/${issue_number}`}
              className="text-decoration-none"
            >
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="h4 text-info-dark mb-0">{v.title}</h3>
                <p
                  className={
                    'text-white p-2 rounded-2 mb-0 ' +
                    (v.state === 'open' ? 'text-bg-warning' : 'text-bg-success')
                  }
                >
                  {v.state}
                </p>
              </div>
            </Link>
            <p className="text-primary-100 fs-sm">
              {repo} / {moment(v.created_at).format('YYYY-MM-DD, h:mm a')}
            </p>
          </div>
        );
      })}
    </>
  );
}
