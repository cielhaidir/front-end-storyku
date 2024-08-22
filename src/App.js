import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import StoryManagement from './components/Stories/StoryManagement'
import CreateStory from './components/Stories/CreateStory'
import CreateChapter from './components/Chapters/CreateChapter'
import EditStory from './components/Stories/EditStory'
import DetailStory from './components/Stories/DetailStory'
import EditChapter from './components/Chapters/EditChapter'
import DetailChapter from './components/Chapters/DetailChapter'
import { MdDashboard } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { GiScrollQuill } from "react-icons/gi";

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col container p-10 bg-base-100 ">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/stories" element={<StoryManagement />} />
              <Route path="/stories/:id" element={<DetailStory />} />
              <Route path="/stories/add" element={<CreateStory />} />
              <Route path="/stories/add-chapter" element={<CreateChapter />} />
              <Route path="/stories/edit/:id" element={<EditStory />} />
              <Route path="/stories/:storyId/chapters/edit/:chapterId" element={<EditChapter />} />
              <Route path="/stories/:storyId/chapters/:chapterId" element={<DetailChapter />} />
            </Routes>
          </div>

          <div className="drawer-side shadow-xl z-50">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay">

            </label>
      
            <ul className="menu bg-base-150 text-base-content min-h-full w-60 p-0 ">
            <div className="flex justify-center items-center text-cyan-500 text-3xl font-bold py-5">
                <GiScrollQuill className="mr-2 text-3xl " />
                <h3 className="">STORYKU</h3>
              </div>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "bg-cyan-500 text-white text-lg focus:text-white rounded-none focus:bg-cyan-500 active:bg-cyan-500 py-4 px-6" : "py-4 rounded-none text-lg px-6"
                  }
                >
                  <MdDashboard />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/stories"
                  className={({ isActive }) =>
                    isActive ? "bg-cyan-500 text-white text-lg focus:text-white rounded-none focus:bg-cyan-500 active:bg-cyan-500 py-4 px-6" : "py-4 rounded-none text-lg px-6"
                  }
                >
                  <ImBooks />
                  Story Management
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
