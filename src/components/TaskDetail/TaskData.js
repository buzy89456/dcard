import moment from 'moment-timezone';

export default function TaskData({ taskDetail }) {
  const labels = taskDetail.labels;
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="h4 text-info-dark mb-0">{taskDetail.title}</h3>
        <p
          className={
            'text-white p-2 rounded-2 mb-0 ' +
            (taskDetail.state === 'open'
              ? 'text-bg-warning'
              : 'text-bg-success')
          }
        >
          {taskDetail.state}
        </p>
      </div>
      <div className="d-flex justify-content-between">
        <p className="text-primary-100 fs-sm mb-0">
          created by : {taskDetail.user && taskDetail.user.login}
        </p>
        {taskDetail.state === 'closed' && (
          <p className="text-primary-100 fs-sm mb-0">
            closed by:
            {taskDetail.closed_by && taskDetail.closed_by.login}
          </p>
        )}
      </div>
      <div className="d-flex justify-content-between">
        <p className="text-primary-100 fs-sm mb-0">
          created at :{' '}
          {moment(taskDetail.created_at).format('YYYY-MM-DD, h:mm a')}
        </p>
        {taskDetail.state === 'closed' && (
          <p className="text-primary-100 fs-sm mb-0">
            closed at :{' '}
            {moment(taskDetail.closed_at).format('YYYY-MM-DD, h:mm a')}
          </p>
        )}
      </div>
      <p className="d-block mt-2 bg-gray p-3 rounded-2">{taskDetail.body}</p>
      {labels &&
        labels.map((v, i) => {
          return (
            <span
              className="d-inline-block bg-primary fs-sm p-1 me-1 text-info rounded"
              key={v.id}
            >
              {v.name}
            </span>
          );
        })}
    </>
  );
}
