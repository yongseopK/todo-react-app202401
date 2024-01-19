import './App.css';
import TodoTemplate from "./component/todo/TodoTemplate";
import React from "react";
import Header from "./component/layout/Header";
import Footer from "./component/layout/Footer";
import {Route, Routes} from "react-router-dom";
import Join from "./component/user/Join";

function App() {
    return (
        <>
            <Header/>
            <Routes>
                <Route path={"/"} element={<TodoTemplate/>}/>
                <Route path={"/join"} element={<Join/>}/>
            </Routes>
            <Footer/>
        </>
    );
}

export default App;
