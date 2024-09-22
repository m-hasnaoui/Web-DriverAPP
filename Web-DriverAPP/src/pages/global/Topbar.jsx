import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ReactSession } from "react-client-session";
import { useNavigate } from "react-router-dom";
import { ExitToApp } from "@mui/icons-material";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    ReactSession.set("username", "");
    ReactSession.set("role", "");
    navigate("/login");
    window.location.reload();
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2} alignItems="end">
      <IconButton onClick={colorMode.toggleColorMode}>
        {theme.palette.mode === "dark" ? (
          <DarkModeOutlinedIcon />
        ) : (
          <LightModeOutlinedIcon />
        )}
      </IconButton>
      <IconButton onClick={handleLogout}>
        <ExitToApp />
      </IconButton>
    </Box>
  );
};

export default Topbar;

// import { Box, IconButton, useTheme } from "@mui/material";
// import { useContext, useEffect, useState } from "react";
// import { ColorModeContext } from "../../theme";
// import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import { ReactSession } from "react-client-session";
// import { useNavigate } from "react-router-dom";
// import { ExitToApp } from "@mui/icons-material";

// const TIMEOUT_DURATION = 1000; // 12 minutes in milliseconds

// const Topbar = () => {
//   const theme = useTheme();
//   const colorMode = useContext(ColorModeContext);
//   const navigate = useNavigate();
//   const [logoutTimer, setLogoutTimer] = useState(null);

//   useEffect(() => {
//     let timerId;

//     const resetTimer = () => {
//       if (timerId) {
//         clearTimeout(timerId);
//       }
//       timerId = setTimeout(logout, TIMEOUT_DURATION);
//       setLogoutTimer(timerId);
//     };

//     const handleUserActivity = () => {
//       resetTimer();
//     };

//     resetTimer();

//     // Setup event listeners for user activity
//     window.addEventListener("click", handleUserActivity);
//     window.addEventListener("mousemove", handleUserActivity);
//     window.addEventListener("keypress", handleUserActivity);
//     window.addEventListener("scroll", handleUserActivity);

//     // Setup event listener for visibility change
//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     // Cleanup event listeners and timer on component unmount or logout
//     return () => {
//       if (timerId) {
//         clearTimeout(timerId);
//       }
//       window.removeEventListener("click", handleUserActivity);
//       window.removeEventListener("mousemove", handleUserActivity);
//       window.removeEventListener("keypress", handleUserActivity);
//       window.removeEventListener("scroll", handleUserActivity);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   const handleLogout = () => {
//     ReactSession.set("username", "");
//     ReactSession.set("role", "");
//     navigate("/login");
//     clearTimeout(logoutTimer);
//     setLogoutTimer(null);
//     window.location.reload();
//   };

//   const logout = () => {
//     ReactSession.set("username", "");
//     ReactSession.set("role", "");
//     navigate("/login");
//     window.location.reload();
//   };

//   const handleVisibilityChange = () => {
//     if (document.visibilityState === "hidden") {
//       // User navigated away or minimized the page
//       logout();
//     } else {
//       // User came back to the page, reset the timer
//       resetTimer();
//     }
//   };

//   const resetTimer = () => {
//     clearTimeout(logoutTimer);
//     const timerId = setTimeout(logout, TIMEOUT_DURATION);
//     setLogoutTimer(timerId);
//   };

//   return (
//     <Box display="flex" justifyContent="space-between" p={2} alignItems="end">
//       <IconButton onClick={colorMode.toggleColorMode}>
//         {theme.palette.mode === "dark" ? (
//           <DarkModeOutlinedIcon />
//         ) : (
//           <LightModeOutlinedIcon />
//         )}
//       </IconButton>
//       <IconButton onClick={handleLogout}>
//         <ExitToApp />
//       </IconButton>
//     </Box>
//   );
// };

// export default Topbar;
