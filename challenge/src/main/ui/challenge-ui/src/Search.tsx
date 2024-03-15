import { useState, useEffect, useMemo } from 'react';
import { RepoInfo } from './ListItem';
import ListItem from './ListItem';
import { formatNumCommas } from './utils';
export type SearchProps = {
    onAddToFavorites: (f: RepoInfo) => void
}

const Search = ({onAddToFavorites}: SearchProps) => {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState<RepoInfo[] | null>(null);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const pageOptions: number[] = useMemo(() => {
        //since github's api won't return results past 1000
        const total = totalResults > 1000 ? Math.floor(1000/perPage) : Math.ceil(totalResults/perPage);
        var pso: number[] = [];
        for(let i = 1; i <= total; i++) pso[i] = i;
        return pso;
    }, 
    [totalResults, perPage]);
    
    const URL = useMemo(() => {
        return `https://api.github.com/search/repositories?q=${searchInput}&page=${currentPage}&per_page=${perPage}`
    }, [searchInput, currentPage, perPage]);

    const callSearch = async () => {
        const controller = new AbortController();
        const reason = new DOMException('signal timed out', 'TimeoutError');
        const timeoutId = setTimeout(() => controller.abort(reason), 5000); //abort if takes more than 5seconds
        let response;
        try {
            response = await fetch(URL, { signal: controller.signal });
            return await response.json();
        } catch(err) {
            console.log("Err: ", err);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    const fetchSearch = () => {
        setError(null);
        setIsLoading(true);
        callSearch().then((resp) => {
            
            if(resp.message) {
                setSearchResults(null)
                setError(resp.message)
            }
            else {
                setTotalResults(resp.total_count);
                setSearchResults(resp?.items?.map(
                    (item: any): RepoInfo => {
                        return { id: item.id, name: item.name, link: item.html_url }     
                    })
                )
            }
            setIsLoading(false);
            }
        ).catch((err) => {
            setSearchResults(null);
            setIsLoading(false);
            setError("Error fetching repos: " + err + "--");
        })
    }

    useEffect(() => {
        if(searchInput && searchInput !== '') {
            fetchSearch();
        }
    }, [currentPage, perPage])

    const goBack = () => {
        if(currentPage > 1) setCurrentPage(currentPage-1);
    }

    const goFirst = () => {
        setCurrentPage(1);
    }

    const goLast = () => {
        setCurrentPage(pageOptions.length-1);
    }

    const goNext = () => {
        if(currentPage < pageOptions.length-1) setCurrentPage(currentPage+1)
    }

    const submitClicked = () => {
        setCurrentPage(1);
        setTotalResults(0);
        fetchSearch();
    }

    const inputEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter") {
            setCurrentPage(1);
            setTotalResults(0);
            fetchSearch();
        }
    }

    const reset = () => {
        setSearchInput('');
        setSearchResults(null);
        setCurrentPage(1);
        setTotalResults(0);
        setError(null);
    }

    return (
        <>
            <h3>Search for repo:</h3>
                {error &&
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p>ERROR: {error}</p>
                        <button onClick={reset}>OK</button>
                    </div>
                }
                <input type="text" onChange={e => setSearchInput(e.target.value)} onKeyDown={inputEnter} value={searchInput}></input>
                <button type={'submit'} onClick={submitClicked}>Search</button>
            {isLoading && <p>Loading...</p>}
            {searchResults && 
                <>
                <div>
                    <p>Total results: {formatNumCommas(totalResults)}</p>
                    <label>Results per page</label>
                    <select id="perPageSelect" defaultValue={perPage} onChange={e => setPerPage(Number(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div className='paginationNav'>
                    
                    <label>Page: </label>
                    <select id="pageSelect" value={currentPage} onChange={e => setCurrentPage(Number(e.target.value))}>
                        {pageOptions.map((pso) => <option value={pso} key={'option'+pso}>{pso}</option>)}
                    </select>

                    <button onClick={goFirst} disabled={currentPage === 1}>FIRST</button>
                    <button onClick={goBack} disabled={currentPage === 1}>PREV</button>
                    <button onClick={goNext} disabled={currentPage === pageOptions.length-1}>NEXT</button>
                    <button onClick={goLast} disabled={currentPage === pageOptions.length-1}>LAST</button>
                </div>
                {isLoading ? <p>Loading...</p> :
                    searchResults.map((result: RepoInfo) => {
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