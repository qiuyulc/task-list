import App from "@/App";
// import User from "@/views/login";
// import Login from "@/views/login/login";
// import Signin from "@/views/login/signin";
import Home from "@/views/home";
import { useRoutes, Navigate } from "react-router-dom";


function RouterView() {
  const router = useRoutes([
    {
      path: "/",
      element: <Navigate to={"home"} />,
    },
    {
      path: "/",
      element: <App />,
      children: [
        // {
        //   path: "user",
        //   element: <User />,
        //   children: [
        //     {
        //       path: "login",
        //       element: <Login />,
        //     },
        //     {
        //       path: "signin",
        //       element: <Signin />,
        //     },
        //   ],
        // },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "*",
          element: <h1>404</h1>,
        },
      ],
    },
  ]);

  return <>{router}</>;
}

export default RouterView;
