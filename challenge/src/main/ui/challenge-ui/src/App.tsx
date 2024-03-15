import FavoritesList from './FavoritesList';
import  Search from './Search';
import { useCallback, useEffect, useState } from 'react';
import { RepoInfo } from './ListItem';

function App() {

  const [displayedList, setDisplayedList] = useState<RepoInfo[] | null>(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const URL = `http://localhost:5173/favorites`;

  const handleResponse = (responseBody: string[]) => {
          const list = responseBody.map((r) => {
            const info = JSON.parse(r);
            return {
              id: info.id.toString(),
              name: info.name,
              link: info.link
            }
          })
          setDisplayedList(list);
          setIsLoading(false);
          setError(null);
  }

  useEffect(() => {
      const getFavsList = async () => {
        setError(null);
        setIsLoading(true);
        await doFetch('GET', null)
        .then((data) => {
          setIsLoading(false);
          handleResponse(data);
        })
        .catch(err => {
          setError(err);
        })        
    };

    getFavsList();
  }, [])

  // useEffect(() => {
  //   // fetch data
  //   const dataFetch = async () => {
  //     const data = await (
  //       await fetch(
  //         'https://run.mocky.io/v3/d6155d63-938f-484c-8d87-6f918f126cd4',
  //       )
  //     ).json();

  //     // set state when the data received
  //     setData(data);
  //   };

  //   dataFetch();
  // }, []);

  async function doFetch(method: string, body: any) {
    let response = await fetch(URL, {
      body: body ? JSON.stringify(body) : null,
      method: method,
      mode: 'same-origin',
      referrer: '',
      credentials: 'omit',
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': URL},
    })
    return await response.json();
  }

  //callback to cache function def between re-renders of Search
  const onAddToFavorites = useCallback((f: RepoInfo) => {
    setError(null);
    setIsLoading(true);
    doFetch('POST', f)
      .then((resp) => {
        setIsLoading(false);
        handleResponse(resp);
      })
      .catch(err => {
        setError(err);
      })
  }, [])

  //callback to cache function def between re-renders of FavoritesList
  const onDeleteFromFavorites = useCallback((f: RepoInfo) => {
    setError(null);
    setIsLoading(true);
    doFetch('DELETE', f)
    .then((resp) => {
      setIsLoading(false);
      handleResponse(resp);
    })
    .catch(err => {
      setError(err);
    })
  }, [])



  return (
    <>
      <h1>
        GIT Hub API Coding challenge
      </h1>
      <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
        <div>
          <Search onAddToFavorites={onAddToFavorites}/>
        </div>
        <div>
          {error && <div>{error}</div>}
          {isLoading && <div>Loading...</div>}
          {displayedList &&
            <FavoritesList favoritesList={displayedList} onDelete={onDeleteFromFavorites} />
          }
        </div>
      </div>
    </>
  )
}

export default App
