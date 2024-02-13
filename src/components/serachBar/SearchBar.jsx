import { faPen, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

function SearchBar(props) {

    const [searchInput, setSearchInput] = useState("")

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchInput) return
        props.searchHandler(searchInput)
    }
    const onChangeSearch = (e) => {
        if (props.onChangeSearch) {
            props.searchHandler(e.target.value)
        }
        setSearchInput(e.target.value)
    }

    return (
        <div className='searchBarContainer'>
            {
                props.isInChat &&
                <button className='newMsgBtn'>
                    <FontAwesomeIcon icon={faPen} />
                </button>
            }
            <form onSubmit={handleSearch} className={`searchForm ${props.isInChat ? "searchBarChat" : "searchBar"}`}>
                <span onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                    type="search"
                    placeholder={props.placeHolder}
                    onChange={onChangeSearch}
                />
            </form>
        </div>
    )
}

export default SearchBar