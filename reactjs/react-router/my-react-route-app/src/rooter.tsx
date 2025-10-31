
import {
  createBrowserRouter,
} from "react-router-dom";
import ChatList from "./ChatList";
import Root from "./Root";
import FriendCircle from "./FriendCircle";
import Me from "./Me";
import Chat from "./Chat";
import DiscooberPage from "./DiscooberPage";

 const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: "",
        element: <ChatList/>,
      },
      {
        path: "me",
        element:<Me/>
      },
      {
        path:"discover",
        element:<DiscooberPage/>
      }
    ],
  },
  {
    path: "/friend-circle",
    element:<FriendCircle/>
  },
  {
    path: "/chat/:friendId",
    element:<Chat/>
  }
]);
export default router;

