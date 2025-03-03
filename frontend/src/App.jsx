import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <div className=" text-3xl text-red-800">Hello</div>
      <Outlet />
    </div>
  );
}

export default App;
