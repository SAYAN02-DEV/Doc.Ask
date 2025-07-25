import { useAuth } from "./AuthContext";
import { useState } from "react";
import AuthSidePanel from "./AuthSidePanel";

export default function NavigationBar() {
  const { isLoggedIn, logout } = useAuth();
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("login"); // 'login' or 'register'

  const handleLoginClick = () => {
    setPanelMode("login");
    setSidePanelOpen(true);
  };
  const handleRegisterClick = () => {
    setPanelMode("register");
    setSidePanelOpen(true);
  };
  const handleClosePanel = () => setSidePanelOpen(false);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <div className="text-2xl font-bold">Doc.Ask</div>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button className="px-4 py-2 bg-yellow-500 rounded" onClick={logout}>Logout</button>
            <button className="px-4 py-2 bg-gray-700 rounded">My Account</button>
          </>
        ) : (
          <>
            <button className="px-4 py-2 bg-yellow-500 rounded" onClick={handleLoginClick}>Login</button>
            <button className="px-4 py-2 bg-gray-700 rounded" onClick={handleRegisterClick}>Register</button>
          </>
        )}
      </div>
      {/* Side panel placeholder, will be replaced by AuthSidePanel */}
      <AuthSidePanel open={sidePanelOpen} mode={panelMode} onClose={handleClosePanel} />
    </nav>
  );
}
