import styles from './subreddits.module.css';
import { AiFillCaretRight } from "react-icons/ai";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubreddits } from './subredditsSlice';
import { fetchPage } from '../page/pageSlice';

export default function Subreddits() {
    const dispatch = useDispatch();
    const { list, status, error } = useSelector(state => state.subreddits);
    // { list: [], status: 'idle', error: null }

    useEffect(() => { // 開啟網頁時渲染畫面
        if (status === 'idle') {
            dispatch(fetchSubreddits());
        }
    }, [dispatch, status]);

    const handleClickSubreddit = (subredditUrl) => { // 點擊 subreddit 時渲染 page
        console.log('subredditUrl:', subredditUrl);
        dispatch(fetchPage(subredditUrl));
    };

    function renderList() {
        if (status === 'loading') {
            return (<p>Loading...</p>)
        }
        if (status === 'failed') {
            return (<p>Error: {error}</p>)
        }
        if (status === 'succeeded') {
            return (
                <>
                    {list.map(subreddit => ( // each data
                        <li key={subreddit.id} onClick={() => { handleClickSubreddit(subreddit.url) }}>
                            <div className={styles.subreddit}>
                                <AiFillCaretRight />
                                <span>{subreddit.display_name}</span>
                            </div>
                        </li>
                    ))}
                </>
            )
        }

        return null
    };

    return (
        <ul className={styles.subreddits}>{renderList()}</ul>
    )
};