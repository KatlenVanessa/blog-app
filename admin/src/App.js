import React, { useState } from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost ";
import UpdatePost from "./components/UpdatePost";
import NotFound from "./components/NotFound";
import NavBar from "./components/NavBar";
import SearchForm from "./components/SearchForm";

function App() {

  const [closedNav, setClosedNav] = useState(false);

  const toggleNav = () => {
    setClosedNav(!closedNav);
  };

  const getNavWidth = () => (closedNav ? "w-16" : "w-56");

  return (
    <div className="flex">
      {/* nav section */}
      <div className={`${getNavWidth()} h-screen bg-purple-200 transition-width border border-r`}>
        <div className="sticky top-0">
          <NavBar closed={closedNav}></NavBar>
        </div>
      </div>

      {/* content section */}
      <div className="flex-1 min-h-screen bg-purple-50">
        <div className="sticky top-0">
          <div className="flex item-center p-2 space-x-2">
            <button onClick={toggleNav}>
              {closedNav ? (
                <AiOutlineMenuUnfold size={35} />
              ) : (
                <AiOutlineMenuFold size={35} />
              )}
            </button>
            <SearchForm />
          </div>
        </div>
        <div className="max-w-screen-lg mx-auto">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/update-post/:slug' element={<UpdatePost />} />
            <Route path='/*' element={<NotFound />} />
          </Routes>

        </div>
      </div>

    </div>
  );
}

export default App;
