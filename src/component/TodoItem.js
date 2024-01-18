import React from 'react';
import {MdDelete, MdDone} from "react-icons/md";
import "./scss/TodoItem.scss";
import cn from 'classnames';

const TodoItem = ({item, onRemove, onCheck}) => {

    const {id, title, done} = item;

    const removeHandler = e => {
      onRemove(id);
    };

    const checkHandler = e => {
        // console.log('check~');
        onCheck(id, done);
    };

    return (
        <li className='todo-list-item'>
            <div className={cn('check-circle', {active: done})} onClick={checkHandler}>
                {done && <MdDone/>}
            </div>
            <span className={cn('text', {finish: done})}>{title}</span>
            <div className='remove' onClick={removeHandler}>
                <MdDelete />
            </div>
        </li>
    );
};

export default TodoItem;