import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './pages/Home';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Skills from "./pages/Skills";
import Examples from "./pages/Examples"
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import EditBlog from "./pages/EditBlog"
import ViewBlogs from './pages/ViewBlogs';
import ViewBlog from './pages/ViewBlog';
import FacebookRedirect from './pages/auth_redirects/FacebookRedirect';
import GoogleRedirect from './pages/auth_redirects/GoogleRedirect';
import routes from './resources/routes/routes';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.skills} element={<Skills />} />
        <Route path={routes.examples} element={<Examples />} />
        <Route path={routes.signUp} element={<SignUp />} />
        <Route path={routes.signIn} element={<SignIn />} />
        <Route path={routes.editBlog} element={<EditBlog />} />
        <Route path={routes.editSpecificBlog} element={<EditBlog />} />
        <Route path={routes.viewBlogs} element={<ViewBlogs />} />
        <Route path={routes.viewBlogs} element={<ViewBlog />} />
        <Route path={routes.facebookSignIn} element={<FacebookRedirect />} />
        <Route path={routes.googleSignIn} element={<GoogleRedirect />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
