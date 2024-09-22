import { useEffect, useState } from "react";
import { Navigate, useNavigate, Routes, Route } from "react-router-dom";
import Sidebar from "./pages/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ReactSession } from "react-client-session";
import Topbar from "./pages/global/Topbar.jsx";
import Driver from "./pages/Driver.jsx";
import Vehicle from "./pages/Vehicle.jsx";
// import Trajectory from "./pages/Trajectory.jsx";
// import Management from "./pages/Management.jsx";
import User from "./pages/User.jsx";
import Login from "./pages/Login.jsx";
// import Mission from "./pages/Mission.jsx";
import AssociationVD from "./pages/AssociationVD.jsx";
// import AssociationMD from "./pages/AssociationMD.jsx";
// import Decharge from "./pages/Decharge.jsx";
// import Suivi_Mission from "./pages/Suivi_Mission.jsx";
// import Client from "./pages/Client.jsx";
// import Produit from "./pages/Produit.jsx";
import Profile from "./pages/Profiles.jsx";
import Welcome from "./pages/Welcome.jsx";
import Dashboard from "./pages/Dashboard.jsx";
// import Livraison from "./pages/Livraison.jsx";
// import Livraison_Valide from "./pages/Livraison_Valide.jsx";
// import AutorouteGestion from "./pages/Autoroute_Gestion.jsx";
// import AssociationAutoroute from "./pages/AssociationAutoroute.jsx";
// import Autoroute from "./pages/Autoroute.jsx";
import Pointing from "./pages/Pointing.jsx";
import Caisse from "./pages/Caisse.jsx";
import Report from "./pages/Report.jsx";
import Caisse2 from "./pages/Caisse2.jsx";
import Report_Pointing from "./pages/Report_Pointing .jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSidebar, setIsSidebar] = useState(true);
  ReactSession.setStoreType("localStorage");
  const navigate = useNavigate();
  const username = ReactSession.get("username");

  const handleLogin = () => {
    if (username && username !== "") {
      setLoggedIn(true);
      navigate("/");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    handleLogin();
    // eslint-disable-next-line
  }, [username]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {loggedIn ? (
            <>
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                  <Route
                    path="/"
                    element={
                      ReactSession.get("role") === "admin" ? (
                        <Dashboard />
                      ) : (
                        <Welcome />
                      )
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      loggedIn ? (
                        <Navigate to="/" />
                      ) : (
                        <Login onLogin={handleLogin} />
                      )
                    }
                  />
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Report"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Report"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/report" element={<Report />} />
                  ) : null}
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Pointing"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Pointing"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="pointing" element={<Pointing />} />
                  ) : null}
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Chauffeur"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Chauffeur"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/chauffeur" element={<Driver />} />
                  ) : null}
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Vehicule"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Vehicule"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/vehicule" element={<Vehicle />} />
                  ) : null}
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Affectation Vehicule Chauffeur"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Affectation Vehicule Chauffeur"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route
                      path="/affectation_vehicule_chauffeur"
                      element={<AssociationVD />}
                    />
                  ) : null}
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Report Pointing"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Report Pointing"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route
                      path="/report_pointing"
                      element={<Report_Pointing />}
                    />
                  ) : null}

                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Caisse"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Caisse"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/caisse" element={<Caisse />} />
                  ) : null}
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Caisse Berrechid"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Caisse Berrechid"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/caisse_berrechid" element={<Caisse2 />} />
                  ) : null}
                  {ReactSession.get("role") == "admin" ? (
                    <Route path="/dashboard" element={<Dashboard />} />
                  ) : null}
                  {ReactSession.get("role") == "admin" ? (
                    <Route path="/utilisateur" element={<User />} />
                  ) : null}
                  {ReactSession.get("role") == "admin" ? (
                    <Route path="/profile" element={<Profile />} />
                  ) : null}
                </Routes>
              </main>
            </>
          ) : (
            <main className="content">
              <Routes>
                <Route
                  path="/login"
                  element={<Login onLogin={handleLogin} />}
                />
                <Route path="/*" element={<Navigate to="/login" />} />
              </Routes>
            </main>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
