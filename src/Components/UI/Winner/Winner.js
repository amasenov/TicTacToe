import React, { memo } from 'react';
import Modal from '../Modal/Modal';
import Button from '@material-ui/core/Button';

import styles from './Winner.module.scss';

const winner = memo((props) => (
    <Modal isOpen={props.isOpen}>
        <div  className={[styles.Winner, ].join(' ')} >
            {!!props.winner ? (
                <p>{props.winner}</p>
            ) : null}
            <p>Would you want to play again?</p>
            <div className={['flex', 'flex--justify-center', 'flex--align-center'].join(' ')} onClick={props.startNewGame}>
                <Button variant="contained" color="primary">New game?</Button>
            </div>
        </div>
    </Modal>
));

export default winner;