import styles from './page.module.scss';
import Post from '../post/Post';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPage } from './pageSlice';

export default function Page() {
  const dispatch = useDispatch()
  const { posts, status, error } = useSelector(state => state.page);

  useEffect(() => {
    if (status === 'idle') { // 開啟網頁時渲染 page 為 /r/Home (selectedSubredditUrl: /r/Home)
      dispatch(fetchPage())
    }
  }, [dispatch, status]);

  function renderPage() {
    if (status === 'loading') {
      return (<p>Loading...</p>)
    }
    if (status === 'failed') {
      return (<p>Error: {error}</p>)
    }
    if (status === 'succeeded') {
      return (
        <>
          {posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </>
      )
    }
    return null
  };

  return (
    <div className={styles.page}>
      <ul>{renderPage()}</ul>
    </div>
  )
};

// {Array.from({length: 10}).map((_, i) => <Post key={i} />)}
