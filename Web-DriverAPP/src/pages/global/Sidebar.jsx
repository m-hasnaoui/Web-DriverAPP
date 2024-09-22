import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {
  AccountBoxOutlined,
  AltRouteOutlined,
  Autorenew,
  Badge,
  ContactPage,
  Dashboard,
  DirectionsOutlined,
  Group,
  Inventory,
  LocalShippingOutlined,
  Outbox,
  RouteOutlined,
  ShoppingCart,
  SystemUpdateAlt,
  DeliveryDiningOutlined,
  DomainVerificationOutlined,
  EditRoadOutlined,
  AddRoadOutlined,
  SettingsInputAntennaOutlined,
  HomeRepairServiceOutlined,
  WorkHistoryOutlined,
  AssessmentOutlined,
} from "@mui/icons-material";

import { ReactSession } from "react-client-session";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState();

  useEffect(() => {
    // console.log(ReactSession.get("visibility").filter((item) => item.page == "Chauffeur")[0].visibility);
    const setHeight = () => {
      const fullHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

      document.getElementById("mySidebar").style.height = `${fullHeight}px`;
    };

    setHeight();

    window.addEventListener("resize", setHeight);
    window.addEventListener("DOMSubtreeModified", setHeight);

    return () => {
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("DOMSubtreeModified", setHeight);
    };
  }, []);

  return (
    <div id="mySidebar" style={{ display: "flex" }}>
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
            flexGrow: 1,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    DriverAPP
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`../../assets/user.png`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {ReactSession.get("username")}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    {"Dépôt: "} {ReactSession.get("deposit")}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    {"Role: "} {ReactSession.get("role")}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              {ReactSession.get("role") === "admin" ? (
                <>
                  <Item
                    title="Dashboard"
                    to="/dashboard"
                    icon={<Dashboard />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Utilisateur"
                    to="/utilisateur"
                    icon={<Group />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Profile"
                    to="/profile"
                    icon={<ContactPage />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </>
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Pointing"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Pointing"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Pointing"
                  to="/pointing"
                  icon={<WorkHistoryOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Report"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Report"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Report"
                  to="/report"
                  icon={<AssessmentOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Report Pointing"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Report Pointing"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Report Pointing"
                  to="/report_pointing"
                  icon={<AssessmentOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Caisse"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Caisse"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Caisse Agadir"
                  to="/caisse"
                  icon={<HomeRepairServiceOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Caisse Berrechid"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Caisse Berrechid"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Caisse berrechid"
                  to="/caisse_berrechid"
                  icon={<HomeRepairServiceOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Chauffeur"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Chauffeur"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Chauffeur"
                  to="/chauffeur"
                  icon={<AccountBoxOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Vehicule"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Vehicule"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Vehicule"
                  to="/vehicule"
                  icon={<LocalShippingOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Affectation Vehicule Chauffeur"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Affectation Vehicule Chauffeur"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Affectation Vehicule Chauffeur"
                  to="/affectation_vehicule_chauffeur"
                  icon={<AltRouteOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </div>
  );
};

export default Sidebar;
