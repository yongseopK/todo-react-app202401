import React, {useEffect, useState} from "react";
import {MdAdd, MdDone, MdDelete} from "react-icons/md";
import './scss/TodoTemplate.scss'
import TodoHeader from "./TodoHeader";
import TodoInput from "./TodoInput";
import TodoMain from "./TodoMain";

import { TODO_URL } from "../../config/host-config";
import {getCurrentLoginUser} from "../../util/login-util";

const TodoTemplate = () => {

    // 토큰 가져오기
    const [token, setToken] = useState(getCurrentLoginUser().token);

    // 서버에서 할 일 목록 (JSON)을 요청해서 받아와야 함
    const API_BASE_URL = TODO_URL;

    // 요청 헤더 객체
    const requestHeader = {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 렌더링 직전에 해야할 코드를 적는 함수
    useEffect(() => {
        const fetchData = async () => {
            // try {
            //     const response = await axios.get(API_BASE_URL);
            //     setTodoList(response.data);
            // } catch (error) {
            //     console.error(error);
            // }

            fetch(API_BASE_URL, {
                method: "GET",
                headers: requestHeader
            })
                .then(res => res.json())
                .then(json => {
                    setTodoList(json.todos);
                })
        };

        fetchData();
    }, []);


    /*
        리액트는 부모 컴포넌트에서 자식 컴포넌트로의 데이터 이동이 반대보다 쉽기 때문에
        할 일 데이터는 상위 부모 컴포넌트가 처리하는것이 좋다.
     */
    const [todoList, setTodoList] = useState([]);


    // 데이터 상향식 전달을 위해 부모가 자식에게 함수를 하나 전달
    const addTodo = (todoText) => {
        // console.log('할일 등록 함수를 todotemplate에서 실행');
        console.log('todoText : ', todoText);

        const makeNewId = () => {
            return todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1;
        };

        const newTodo = {
            title: todoText,
        };

        // todoList.push(newTodo);
        /*
            상태변수 변경은 오로지 setter를 통해서만 가능
            상태값이 변경감지가 되면 리액트는 렌더링을 다시 시작합니다.
            다만 상태변수가 const형태로 불변성을 띄기 때문에
            기존의 상태값을 바꾸는 것은 불가능하고
            새로운 상태를 만들어서 바꿔야 함.
         */
        fetch(API_BASE_URL, {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify(newTodo)
        })
            .then(res => res.json())
            .then(json => {
                setTodoList(json.todos);
            })
    };

    // 할 일 삭제 처리 함수
    const removeTodo = id => {
        console.log('id : ', id);

        fetch(`${API_BASE_URL}/${id}`, {
            method: "delete",
            headers: requestHeader
        }).then(res => res.json())
            .then(json => {
                setTodoList(json.todos);
            })
    };

    // 할 일 체크처리 함수
    const checkTodo = (id, done) => {
        // console.log('check id: ', id);

        // const copyTodoList = [...todoList];
        //
        // const foundTodo = copyTodoList.find(todo => todo.id === id);
        // foundTodo.done = !foundTodo.done;

        // setTodoList(copyTodoList);

        fetch(API_BASE_URL, {
            method: 'PUT',
            headers: requestHeader,
            body: JSON.stringify({
                id: id,
                done: !done
            })
        }).then(res => res.json())
            .then(json => setTodoList(json.todos));
    };

    // const checkTodo = id => setTodoList(todoList.map(todo => (todo.id === id) ? {...todo, done: !todo.done} : todo));

    // 체크가 안된 할 일 개수 카운트하기
    const countRestTodo = todoList.filter(todo => !todo.done).length;

    return (
        <div className='TodoTemplate'>
            <TodoHeader count={countRestTodo}/>
            <TodoMain todoList={todoList} onRemove={removeTodo} onCheck={checkTodo}/>
            <TodoInput onAdd={addTodo} />
        </div>
    );
};

export default TodoTemplate;