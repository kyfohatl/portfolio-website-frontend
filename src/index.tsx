import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './pages/Home';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Techstack from "./pages/Techstack";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Examples from "./pages/Examples"
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import EditBlog from "./pages/EditBlog"
import ViewBlogs from './pages/ViewBlogs';
import ViewBlog from './pages/ViewBlog';
import FacebookRedirect from './pages/auth_redirects/FacebookRedirect';
import GoogleRedirect from './pages/auth_redirects/GoogleRedirect';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="techstack" element={<Techstack />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="examples" element={<Examples />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="editblog" element={<EditBlog />} />
        <Route path="editblog/:blogId" element={<EditBlog />} />
        <Route path="viewblogs" element={<ViewBlogs />} />
        <Route path="blog/:blogId" element={<ViewBlog />} />
        <Route path="signin/facebook" element={<FacebookRedirect />} />
        <Route path="signin/google" element={<GoogleRedirect />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
