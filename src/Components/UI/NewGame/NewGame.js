import React, { memo } from 'react';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Fab from '@material-ui/core/Fab';

import styles from './NewGame.module.scss';

const newGame = memo((props) => (
    <Modal isOpen={props.isOpen}>
        <div  className={[styles.NewGame, ].join(' ')} >
            <p>What would you want to play?</p>
            <ul className={['no-list-style', 'flex', 'flex--justify-center', 'flex--align-center'].join(' ')}>
                <li className={[styles.SelectItem].join(' ')} onClick={() => props.selectIcon(true)}>
                    <Fab color="primary" aria-label="Cross">
                        <FontAwesomeIcon icon={faTimes}/>
                    </Fab>
                </li>
                <li className={[styles.SelectItem].join(' ')} onClick={() => props.selectIcon(false)}>
                    <Fab color="secondary" aria-label="Circle">
                        <FontAwesomeIcon icon={faCircle}/>
                    </Fab>
                </li>
            </ul>
        </div>
    </Modal>
));

export default newGame;