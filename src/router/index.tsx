import App from "@/App";
// import User from "@/views/login";
// import Login from "@/views/login/login";
// import Signin from "@/views/login/signin";
import Home from "@/views/home";
import History from "@/views/history";
// import Test from '@/views/test/index'
import { useRoutes, Navigate } from "react-router-dom";
import Version from "@/views/version";

function RouterView() {
  const router = useRoutes([
    {
      path: "/",
      element: <Navigate to={"/home"} />,
    },
    {
      path: "/",
      element: <App />,
      children: [
        // {
        //   path:'test',
        //   element:<Test/>
        // },
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
          path: "version",
          element: <Version />,
        },
        {
          path: "history",
          element: <History />,
        },
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
