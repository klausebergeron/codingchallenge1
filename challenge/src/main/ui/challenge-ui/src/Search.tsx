import { useState, useEffect } from 'react';
import { RepoInfo } from './ListItem';
import ListItem from './ListItem';
export type SearchProps = {
    onAddToFavorites: (f: RepoInfo) => void
}

const Search = ({onAddToFavorites}: SearchProps) => {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState<RepoInfo[] | null>(null);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const totalPages = Math.ceil(totalResults/perPage);
    
    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if(!!event.target.value) {
            setSearchInput(event.target.value);
        }
        else setSearchInput('');
    }

    const fetchSearch = () => {
        const URL = `https://api.github.com/search/repositories?q=${searchInput}&page=${currentPage}&per_page=${perPage}`;
        setError(null);
        if(searchInput) {
            setIsLoading(true);
            return fetch(URL)
                .then((resp) => resp.json())
                .then((jsonResp) => {
                    //need to have some way to tell the user that they can't see past first 1000 results
                    setTotalResults(jsonResp?.total_count);
                    setSearchResults(jsonResp.items?.map(
                        (item: any): RepoInfo => { 
                            return {
                                id: item.id, name: item.name, link: item.html_url 
                            } 
                    }));
                    setIsLoading(false);
                })
                .catch((err) => {
                    setSearchResults(null);
                    setIsLoading(false);
                    setError("Error fetching repos: " + err);
                })
        }
    }

    useEffect(() => {
        fetchSearch();
    }, [currentPage, perPage])

    const goBack = () => {
        if(currentPage > 1) setCurrentPage(currentPage-1);
    }

    const goFirst = () => {
        setCurrentPage(1);
    }

    const goLast = () => {
        setCurrentPage(totalPages);
    }

    const goNext = () => {
        if(currentPage < totalPages) setCurrentPage(currentPage+1)
    }

    const getPageSelectionOptions = () => {
        const options = [];
        for(let i: number = 1; i <= totalPages; i++) {
            options.push(
                <option key={"option"+i} value={i}>
                    {i}
                </option>
            )
        }
        return options;
    }

    return (
        <>
            <h3>Search for repo:</h3>
                {error && <p>ERROR: {error}</p>}
                <input type="text" onChange={handleChangeInput} value={searchInput}></input>
                <button type={'submit'} onClick={fetchSearch}>Search</button>
            {isLoading && <p>Loading...</p>}
            {searchResults && 
                <>
                <div>
                    <p>Total results: {totalResults.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    <label>Results per page</label>
                    <select id="perPageSelect" defaultValue={perPage} onChange={e => setPerPage(e.target.value)}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div className='paginationNav'>
                    
                    <label>Page: </label>
                    <select id="pageSelect" value={currentPage} onChange={e => setCurrentPage(e.target.value)}>
                        {getPageSelectionOptions()}
                    </select>

                    <button onClick={goFirst} disabled={currentPage === 1}>FIRST</button>
                    <button onClick={goBack} disabled={currentPage === 1}>PREV</button>
                    <button onClick={goNext} disabled={currentPage === totalPages}>NEXT</button>
                    <button onClick={goLast} disabled={currentPage === totalPages}>LAST</button>
                </div>
                    {searchResults.map((result: RepoInfo) => {
                        return (
                            <ListItem
                                info={result} 
                                onAddToFavorites={onAddToFavorites}
                                key={result.id}
                            />
                        )
                        })
                    }
                </>
            }
        </>
    )
}

export default Search;