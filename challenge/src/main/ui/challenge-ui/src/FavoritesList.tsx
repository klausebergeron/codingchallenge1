import {useState} from 'react';
import ListItem, { RepoInfo } from './ListItem'

export type FavoritesListProps = {
    favoritesList: RepoInfo[] | null;
    onDelete: (f: RepoInfo) => void;
}

//only function we need to pass is refresh for when one is added
const FavoritesList = ({favoritesList, onDelete}: FavoritesListProps) => {
    const [favorites, setFavorites] = useState<RepoInfo[] | null>(favoritesList);

    return (
        <>
        <h3>Favorites</h3>
        <div>
            {
                (favorites && favorites.length > 0) ?
                favorites.map((result: RepoInfo) => {
                    return (
                        <ListItem
                            info={result}
                            onDelete={onDelete}
                            key={'favorite'+result.id}
                        />
                    )
                })
                :
                <p>No Repos in Favorites List</p>
            }
        </div>
        </>
    )
}

export default FavoritesList;