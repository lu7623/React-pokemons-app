import { PokemonRequest } from '../api/types';
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
} from 'react-router-dom';
import Loading from './components/Loading';

export function PokemonDetails() {
  const { details } = useLoaderData() as PokemonRequest;
  const navigation = useNavigation();
  const { pageId } = useParams();
  const { search } = useLocation();
  const url = pageId ? `/page/${pageId}${search}` : '..';
  const navigate = useNavigate();
  return (
    <>
      {navigation.state === 'loading' ? (
        <Loading />
      ) : (
        details && (
          <div
            className="over"
            onClick={() => {
              navigate(url);
            }}
          >
            <div className="details" onClick={(e) => e.stopPropagation()}>
              <div className="close">
                <Link className="closeBtn" to={url}></Link>
              </div>

              <h2>{details.pokemon.name.toUpperCase()}</h2>
              <h3>
                Type:
                {details.pokemon.types.map((type) => (
                  <span className="type" key={type.type.name}>
                    {type.type.name}
                  </span>
                ))}
              </h3>
              <h4 className="size">Height: {details.pokemon.height / 10} m</h4>
              <h4 className="size">Weight: {details.pokemon.weight / 10} kg</h4>
              <div style={{ display: 'flex' }}>
                <img
                  src={
                    details.pokemon.sprites.front_default
                      ? details.pokemon.sprites.front_default
                      : '/notAvaliable.jpg'
                  }
                  alt="pokemon"
                  width={200}
                />
                <img
                  src={
                    details.pokemon.sprites.back_default
                      ? details.pokemon.sprites.back_default
                      : '/notAvaliable.jpg'
                  }
                  alt="pokemon"
                  width={200}
                />
              </div>
              <p>{details.desc ? details.desc : ''}</p>
              <h3>Stats: </h3>
              <div className="stat">
                {details.pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    {stat.stat.name} - {stat.base_stat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}