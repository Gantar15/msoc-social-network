
import {FC, useRef} from 'react';
import Image from 'next/image';
import ShareIcon from '@material-ui/icons/Share';
import MessageIcon from '@material-ui/icons/Message';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import A from '../A/A';
import styles from './post.module.scss';


const Post: FC = () => {
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const showMoreRef = useRef<HTMLDivElement>(null);

    const showMoreHandler = () => {
        if(descriptionRef.current && showMoreRef.current){
            descriptionRef.current.style.maxHeight = descriptionRef.current?.scrollHeight+'px';
            showMoreRef.current.style.display = 'none';
        }
    };

    return (
        <section className={styles.post}>
            <header>
                <div className={styles.authorBlock}>
                    <A href="/user/3540" className={styles.authorImageBlock}>
                        <Image width="45" height="45" className={styles.authorImage} src="/imgs/photo1.jpg"/>
                    </A>
                    <div className={styles.nameBlock}>
                        <A href="/user/3540">
                            <span>Владилен Минин</span>
                        </A>
                        <time>3 часа назад</time>
                    </div>
                </div>
                <MoreHorizIcon className={styles.postOptions}/>
            </header>
            <section>
                <div className={styles.descriptionBlock}>
                    <p ref={descriptionRef}>
                        Лишь тщательные исследования конкурентов, которые представляют собой яркий пример континентально-европейского типа политической культуры, будут в равной степени предоставлены сами себе. В целом, конечно, синтетическое тестирование позволяет оценить значение прогресса профессионального сообщества. Учитывая ключевые сценарии поведения, дальнейшее развитие различных форм деятельности напрямую зависит от форм воздействия. Безусловно, базовый вектор развития играет определяющее значение для соответствующих условий активизации. Современные технологии достигли такого уровня, что курс на социально-ориентированный национальный проект создаёт необходимость включения в производственный план целого ряда внеочередных мероприятий с учётом комплекса стандартных подходов. Идейные соображения высшего порядка, а также граница обучения кадров, в своём классическом представлении, допускает внедрение существующих финансовых и административных условий. Элементы политического процесса, превозмогая сложившуюся непростую экономическую ситуацию, призваны к ответу. Ясность нашей позиции очевидна: базовый вектор развития не оставляет шанса для новых принципов формирования материально-технической и кадровой базы. Идейные соображения высшего порядка, а также перспективное планирование способствует подготовке и реализации поэтапного и последовательного развития общества. Банальные, но неопровержимые выводы, а также стремящиеся вытеснить традиционное производство, нанотехнологии формируют глобальную экономическую сеть и при этом - разоблачены.
                    </p>
                    <div ref={showMoreRef} onClick={showMoreHandler} className={styles.more} data-active>
                        Читать дальше
                    </div>
                </div>
                <div className={styles.postMainContent}>
                    <div className={styles.postMainContentItem} data-image-item>
                        <div className={styles.backdropBlock}>
                            <FullscreenIcon className={styles.icon}/>
                        </div>
                        <Image className={styles.image} width="100" height="100" layout="responsive" src="/imgs/post1.jpg"/>
                    </div>
                    <div className={styles.postMainContentItem} data-image-item>
                        <div className={styles.backdropBlock}>
                            <FullscreenIcon className={styles.icon}/>
                        </div>
                        <Image className={styles.image} width="100" height="100" layout="responsive" src="/imgs/post1-2.jpg"/>
                    </div>
                    <div className={styles.postMainContentItem} data-image-item>
                        <div className={styles.backdropBlock}>
                            <FullscreenIcon className={styles.icon}/>
                        </div>
                        <Image className={styles.image} width="100" height="100" layout="responsive" src="/imgs/post1-3.jpg"/>
                    </div>
                </div>
            </section>
            <footer>
                <ul className={styles.options}>
                    <li className={styles.option}>
                        <div>
                            <ShareIcon className={styles.icon}/>
                        </div>
                        <span className={styles.counter}>
                            3
                        </span>
                    </li>
                    <li className={styles.option} data-active>
                        <div>
                            <ThumbUpAltIcon className={styles.icon}/>
                        </div>
                        <span className={styles.counter}>
                            67
                        </span>
                    </li>
                    <li className={styles.option}>
                        <div>
                            <ThumbDownAltIcon className={styles.icon}/>
                        </div>
                        <span className={styles.counter}>
                            0
                        </span>
                    </li>
                    <li className={styles.option}>
                        <div>
                            <MessageIcon className={styles.icon}/>
                        </div>
                        <span className={styles.counter}>
                            8
                        </span>
                    </li>
                </ul>
            </footer>
        </section>
    );
};

export default Post;