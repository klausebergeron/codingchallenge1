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
    const totalPages: number = useMemo(() => {return Math.ceil(totalResults/perPage)}, [totalResults, perPage]);
    
    const URL = useMemo(() => {
        return `https://api.github.com/search/repositories?q=${searchInput}&page=${currentPage}&per_page=${perPage}`
    }, [searchInput, currentPage, perPage]);

    const pageSelectionOptions = useMemo(() => {
        const options = [];
        for(let i: number = 1; i <= totalPages; i++) {
            options.push(
                <option key={"option"+i} value={i}>
                    {i}
                </option>
            )
        }
        return options;
    }, [totalResults, perPage])

    const callSearch = async () => {
        const controller = new AbortController();
        const reason = new DOMException('signal timed out', 'TimeoutError');
        const timeoutId = setTimeout(() => controller.abort(reason), 5000); //abort if takes more than 5seconds
        let response;
        try {
            response = await fetch(URL, { signal: controller.signal });
        } finally {
            clearTimeout(timeoutId);
        }
        return await response.json();
    }

    const fetchSearch = () => {
        setError(null);
        if(searchInput) {
            setIsLoading(true);
            callSearch().then((resp) => {
                if(resp.message) {
                    setSearchResults(null)
                    setError(resp.message)
                }
                else {
                    setTotalResults(resp?.total_count);
                    const newSearchResults = resp.items?.map(
                        (item: any): RepoInfo => { 
                            return {
                                id: item.id, name: item.name, link: item.html_url 
                            }
                    })
                    setSearchResults(newSearchResults);
                }
                setIsLoading(false);
                })
                .catch((err) => {
                    console.log("Error: ", err);
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

    return (
        <>
            <h3>Search for repo:</h3>
                {error && <p>ERROR: {error}</p>}
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
                        {pageSelectionOptions}
                    </select>

                    <button onClick={goFirst} disabled={currentPage === 1}>FIRST</button>
                    <button onClick={goBack} disabled={currentPage === 1}>PREV</button>
                    <button onClick={goNext} disabled={currentPage === totalPages}>NEXT</button>
                    <button onClick={goLast} disabled={currentPage === totalPages}>LAST</button>
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