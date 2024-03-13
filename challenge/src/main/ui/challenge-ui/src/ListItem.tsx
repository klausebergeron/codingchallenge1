export type ListItemProps = {
    info: RepoInfo;
    onAddToFavorites?: (id: RepoInfo) => void;
    onDelete?: (f: RepoInfo) => void;
}

export type RepoInfo = {
    id: number;
    name: string;
    link: string;
}

const ListItem = ({info, onAddToFavorites, onDelete}: ListItemProps) => {
    
    const handleDelete = (f: RepoInfo) => {
        console.log("Deleting from favlist in ListItem component")
        if(onDelete) onDelete(f);
    }

    return (
        <ul key={info.id}>
            <div style={{width: "300px", display: "flex", justifyContent: "space-between"}}>
                <a href={info.link} target="_blank">{info.name}</a>
                {onAddToFavorites ? //if list item in search
                    <button onClick={() => onAddToFavorites(info)}>Add to Favorites</button>
                    :
                    <button onClick={() => handleDelete(info)}>DELETE</button>
                }
            </div>
        </ul>
    )
}

export default ListItem;