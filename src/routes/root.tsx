import './App.css';
import { useState, useEffect, createContext } from 'react';
import { Pokemon } from '../api/types';
import { getPokemon, getPokemonPage } from '../api/getPokemons';
import { useParams, useSearchParams } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import { PokemonPage } from './PokemonPage';
import Loading from './components/Loading';

export const searchContext = createContext('');
export const pokemonsContext = createContext<Pokemon[]>([]);

export function Root() {
  const storageSearchText = localStorage.getItem('search');
  const [search, setSearch] = useState(
    storageSearchText ? storageSearchText : ''
  );
  const [error, setError] = useState<Error>();
  const { pageId } = useParams();
  const [load, setload] = useState(false);
  const [searchParams] = useSearchParams();
  const qty = searchParams.get('qty');
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  async function fetchData(searchStr: string, page = 1, qty = 20) {
    setload(true);
    try {
      if (searchStr === '') {
        const { pokemons } = await getPokemonPage(page, qty);
        setPokemons(pokemons);
      } else {
        const p = await getPokemon(searchStr);
        setPokemons([p]);
      }
    } catch {
      setPokemons([]);
    }
    setload(false);
  }

  useEffect(() => {
    fetchData(search.toLowerCase().trim(), Number(pageId), Number(qty));
  }, [search, qty, pageId]);

  const handleForm = (str: string) => {
    setSearch(str);
  };

  const showError = () => {
    setError(new Error('Some generated error'));
  };

  if (error) throw error;
  return (
    <>
      <div className="App">
        <div className="header">
          <div className="Logo"></div>
          <searchContext.Provider value={search}>
            <SearchForm callback={handleForm} />
          </searchContext.Provider>
          <div className="Img"></div>
        </div>
        {load ? <Loading /> : null}
        <div style={load ? { opacity: '30%' } : { opacity: '100%' }}>
          <pokemonsContext.Provider value={pokemons}>
            <PokemonPage />
          </pokemonsContext.Provider>
        </div>
      </div>
      <button className="error" onClick={showError}>
        Error
      </button>
    </>
  );
}
