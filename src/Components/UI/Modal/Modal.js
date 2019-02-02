import React, { Fragment, memo } from 'react';

import './Modal.scss';

const modal = memo((props) => (
    <Fragment>
        <div className={['backdrop', props.isOpen ? ['open'] : []].join(' ')} onClick={props.handleClose}/>
        <div 
            className={['modal'].join(' ')}
            style={{
                transform: props.isOpen ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: props.isOpen ? '1' : '0'
            }}
        >
            {props.children}
        </div>
    </Fragment>
));

export default modal;