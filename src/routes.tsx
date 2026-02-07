import { createBrowserRouter } from "react-router";

import LoginPage from "./pages/login";
import Dashboard from "./pages/home";
import { TankProvider } from "./context/tank-data";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <TankProvider>
        <Dashboard />
      </TankProvider>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "*", element: <div>404</div> },
]);
