// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./Login";
// import Signup from "./Signup";
// import Welcome from "./Welcome";
// import Donate from "./Donate";
// import Request from "./Request";


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/welcome" element={<Welcome />} />
//         <Route path="/donate" element={<Donate />} />
//         <Route path="/request" element={<Request />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Welcome from "./Welcome";
import Donate from "./Donate";
import Request from "./Request";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/request" element={<Request />} />
      </Routes>
    </Router>
  );
}

export default App;

