import styles from './header.module.scss';
import { PiRedditLogoFill } from "react-icons/pi";
import { LuSearch } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPage, setSearchTerm } from '../page/pageSlice';
import { useState, useEffect } from 'react';

export default function Header() {
    const [ term, setTerm ] = useState('');
    const dispatch = useDispatch();
    const { searchTerm } = useSelector(state => state.page);

    useEffect(() => {
        setTerm(searchTerm);
    },[searchTerm]);

    const handleChange = (e) => {
        setTerm(e.target.value)
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setSearchTerm(term));
        dispatch(fetchPage());
    };

    return (
        <header className={styles.container}>
            <div className={styles.icon} >
                <PiRedditLogoFill />
                <span style={{ paddingLeft: '5px'}}>Reddit Project</span>
            </div>
            <form className={styles.search} onSubmit={handleSearch}>
                <input 
                    className={styles.searchBar} 
                    type="text" 
                    placeholder="Search" 
                    value={term}
                    onChange={handleChange}
                />
                <button className={styles.searchBtn}><LuSearch /></button>
            </form>
        </header>
    )
};