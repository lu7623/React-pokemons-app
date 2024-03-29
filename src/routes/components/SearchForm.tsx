import { useContext, useState } from 'react';
import { searchContext } from '../root';

export default function SearchForm({
  callback,
}: {
  callback: (str: string) => void;
}) {
  const storageSearchText = localStorage.getItem('search');
  const searchText = useContext(searchContext);
  const [search, setSearch] = useState(
    storageSearchText ? storageSearchText : searchText
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('search', search);
    callback(search);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="find"
          id="find"
          value={search}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
        <p>
          You can type pokemon name (e.g. pikachu or bulbasaur) or number 1-1010
        </p>
      </form>
    </>
  );
}
