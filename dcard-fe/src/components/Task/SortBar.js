import Form from 'react-bootstrap/Form';

export default function SortBar({ sort, setSort }) {
  return (
    <>
      <Form.Select
        className="text-primary-300"
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
        }}
      >
        <option value="desc">從新到舊</option>
        <option value="asc">從舊到新</option>
      </Form.Select>
    </>
  );
}
