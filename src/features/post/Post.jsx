import styles from './post.module.scss';
import { PiArrowFatUp } from 'react-icons/pi';
import { PiArrowFatDown } from 'react-icons/pi';
import { CgComment } from 'react-icons/cg';
import Comment from '../comment/Comment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComment } from '../comment/commentSlice';
import Markdown from 'react-markdown';

// todo list: 將 showComments 的 flag 挪到 post 裡面，
// 在 addCase fetchComments.pendign 時切換(showComments != showComments)，
// 增加 Post 與 Comments 的組件 rerender 的效能。

export default function Post({ post }) {
    const [showComments, setShowComments] = useState(false);
    const dispatch = useDispatch();
    const { comments, status, error } = useSelector(state => state.comment);
    const timestamp = post.created_utc;
    const postPermalink = post.permalink;

    useEffect(() => {
        if (showComments) {
            dispatch(fetchComment(postPermalink))
        }
    }, [dispatch, showComments, postPermalink]);

    function getImageUrl(postUrl) {
        if (postUrl && postUrl.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
            return (
                <div style={{
                    aspectRatio: 1,
                    minHeight: '220px',
                    maxHeight: 'min(100%, 540px)',
                }}>
                    <img
                        src={postUrl}
                        alt='Post image'
                        style={{ 
                            width: '100%',
                            maxWidth: '100%', 
                            height: '100%',
                            maxHeight: '100vw',
                            objectFit: 'contain',
                            background: '#000',
                            borderRadius: '8px',
                        }}
                    />
                </div>
            )
        };
        return null;
    };

    function getMediaUrl(isVideo, media) {
        if (isVideo === true) {
            return (
                <video
                    controls={true} 
                    // width={media?.reddit_video?.width}
                    // height={media?.reddit_video?.height}
                    src={media?.reddit_video?.fallback_url}
                    style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '220px', 
                        maxHeight: 'min(100%, 540px)', 
                        aspectRatio: 1, 
                        objectFit: 'contain', 
                        background: '#000', 
                        borderRadius: '8px', 
                        outline: 0,
                    }}
                />
            )
        };
        return null;
    };

    function timeAgo(timestamp) {
        // console.log(timestamp);
        // console.log(Date.now());
        const secondsAgo = Math.floor(Date.now() / 1000) - timestamp;
        // js Date.now 回傳自 1970 年到現在的毫秒數 ( 1秒  = 1000 毫秒)
        const minutesAgo = Math.floor(secondsAgo / 60);
        const hoursAgo = Math.floor(secondsAgo / (60 * 60));
        const daysAgo = Math.floor(secondsAgo / (60 * 60 * 24));
        const monthsAgo = Math.floor(secondsAgo / (60 * 60 * 24 * 30));
        const yearsAgo = Math.floor(secondsAgo / (60 * 60 * 24 * 365));
        const remainingMonths = Math.floor((monthsAgo % 12));
        // 一年是 12 個月，因此這裡將計算 mod 幾年之後還剩下幾個月
        if (secondsAgo < 60) {
            return 'A few seconds ago';
        }
        if (minutesAgo < 60) {
            return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
        }
        if (hoursAgo < 24) {
            return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
        }
        if (daysAgo < 30) {
            return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
        }
        if (monthsAgo < 12) {
            return monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`;
        }
        // return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
        if (remainingMonths === 0) { // 如果年份是整數的話，直接回傳幾年 (不會顯示 1 年又 0 個月)
            return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
        } else {
            const yearText = yearsAgo === 1 ? '1 year' : `${yearsAgo} years`;
            // 如果 14 個月 mod 12 餘 2 的話，就會顯示 1 年
            // 這裡在判斷一次只是為了 year 跟 years 的差異
            const monthText = remainingMonths === 1 ? '1 month' : `${remainingMonths} months`;
            // 如果 14 個月 mod 12 餘 2 的話，就會顯示 2 個月
            return `${yearText} and ${monthText} ago`;
            // 因此這裡會顯示 1 年又 2 個月
        }
    };

    function handleClickComments() {
        setShowComments(!showComments)
    };

    function renderComments() {
        if (status === 'loading') {
            return (<p>Loading...</p>)
        }
        if (status === 'failed') {
            return (<p>`Error: ${error}`</p>)
        }
        if (status === 'succeeded') {
            if (showComments) {
                return (<>
                    {comments.map(comment => (
                        <Comment key={comment.id} author={comment.author} text={comment.body} />
                    ))}
                </>)
            }
        }
        return null
    }

    return (
        <li className={styles.post} >
            <div className={styles.content}>
                <div style={{ fontSize: '14px', display: 'flex', flexWrap: 'wrap' }}>
                    <span style={{ fontStyle: 'italic' }}>{post.author}</span>
                    <span style={{ paddingLeft: '1rem', color: '#666' }}>{`• ${timeAgo(timestamp)}`}</span>
                </div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', wordBreak: 'break-all' }}>{post.title}</p>
                <Markdown children={post.selftext} />
                {getImageUrl(post.url)}
                {getMediaUrl(post.is_video, post.media)}
            </div>
            <div className={styles.tool}>
                <div className={styles.likeNum}>
                    <button className={styles.btn}><PiArrowFatUp /></button>
                    <p>{post.ups}</p>
                    <button className={styles.btn}><PiArrowFatDown /></button>
                </div>
                <div>
                    <button
                        disabled={post.num_comments === 0}
                        className={`${styles.btn} ${post.num_comments === 0 && styles.btnDisabled}`}
                        onClick={handleClickComments}
                    >
                        <CgComment style={{ paddingRight: '0.5rem' }} />
                        {post.num_comments}
                    </button>
                </div>
            </div>
            {renderComments()}
            {/* {showComments && (
                <div>
                    {comments.map(comment => (
                        <Comment key={comment.id} author={comment.author} text={comment.body} />
                    ))}
                </div>
            )} */}
        </li>
    )
}

// const comments = [
//     { id: 1, author: 'Angie', text: 'wwwwwwww' },
//     { id: 2, author: 'Reg', text: 'hahahahaha' },
//     { id: 3, author: 'Sharon', text: '...' }
// ];