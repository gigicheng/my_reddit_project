import styles from './header.module.css';
import { PiRedditLogoFill } from "react-icons/pi";
import { LuSearch } from "react-icons/lu";

export default function Header() {
    return (
        <header className={styles.container}>
            <div className={styles.icon} >
                <PiRedditLogoFill />
                <span style={{ paddingLeft: '5px'}}>Reddit Project</span>
            </div>
            <div className={styles.search} >
                <input className={styles.searchBar} type="text" placeholder="Search" />
                <button className={styles.searchBtn} ><LuSearch /></button>
            </div>
        </header>
    )
};