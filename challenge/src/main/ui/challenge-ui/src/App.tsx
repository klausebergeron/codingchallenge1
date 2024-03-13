import FavoritesList from './FavoritesList';
import  Search from './Search';
import { useEffect, useState } from 'react';
import { RepoInfo } from './ListItem';

function App() {

  const [displayedList, setDisplayedList] = useState<RepoInfo[] | null>(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const URL = `http://localhost:8080/favorites`;

  const testData = {items: [{id:"760869210",name:"klauseb"}, {id:"748202207",name:"klauseba"}]}
  const headers = {
    "Access-Control-Allow-Origin": "*", 
    'Access-Control-Allow-Credentials' : true,
    'Content-Type': 'application/json'
  }

  const handleResponse = (responseBody: RepoInfo[]) => {
          //todo - data sanitization
          console.log("Response body: ", responseBody);
          setDisplayedList(responseBody);
          setIsLoading(false);
          setError(null);
  }

  useEffect(() => {
    getFavsList();
  }, [])

  const getFavsList = () => {
    console.log("Calling getFavsList...")
      setError(null);
      setIsLoading(true);
      fetch(URL, {
        body: null,
        method: 'GET',
        mode: 'same-origin',
        headers: {'Content-Type': 'application/json'},
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data: ", data)
      })
      .catch(err => {
        console.log("Error: ", err ? err : 'none');
      })        
  }

  const onAddToFavorites = (f: RepoInfo) => {
    console.log("Calling onAddToFavorites for: ", f);
    const str = '{id:"'+f.id+'",name:"'+f.name+'"}'
    setError(null);
    setIsLoading(true);
    return fetch(URL, {
      method: 'POST',
      body: str,
      mode: 'no-cors',
      headers: headers
    }).then((resp) => resp.json())
      .then((jsonResp) => {
        console.log("jsonResp: ", jsonResp)
        //handleResponse(jsonResp);
      })
      // .catch(err => {
      //   console.log("Error: ", err);
      //   setError(err);
      // })
  }

  const onDeleteFromFavorites = (f: RepoInfo) => {
    const repoInfStr = JSON.stringify(f);
    setError(null);
    setIsLoading(true);
    return fetch(URL, {
      method: 'DELETE',
      body: repoInfStr,
      mode: 'no-cors',
      headers: headers
    }).then((resp) => resp.json())
      .then((jsonResp) => {
        handleResponse(jsonResp);
      }).catch(err => {
        console.log("Error: ", err);
        setError(err);
      })
  }



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
