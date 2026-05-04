import { RouterProvider } from "react-router";
import { router } from "./routes/routes";
import QueryProvider from "./providers/QueryProvider";
import { PopupProvider } from "./providers/PopupProvider";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <QueryProvider>
      <Toaster position="top-right" />
      <PopupProvider>
        <RouterProvider router={router} />
      </PopupProvider>
    </QueryProvider>
  );
}
