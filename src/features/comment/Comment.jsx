import styles from './comment.module.scss';
import Markdown from 'react-markdown';

export default function Comment({id, author, text}) {
    return (
        <div id={id} className={styles.comment}>
            <p style={{fontStyle: 'italic', fontSize: '12px'}} >{author}</p>
            {/* <p style={{fontSize: '14px'}}>{text}</p> */}
            <Markdown children={text} />
        </div>
    )
}