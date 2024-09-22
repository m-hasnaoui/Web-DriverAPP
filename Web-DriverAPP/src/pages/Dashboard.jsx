import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  Box,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import Header from "../components/Header";
import StatBox from "../components/StatBox";
import { tokens } from "../theme";
import {
  DataGrid,
  GridActionsCellItem,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { AddCircle, Delete, Message } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import config from "./global/config";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "dashboard.php";

  // const [data, setDataDeposit] = useState([]);

  const [dataDeposit, setDataDeposit] = useState([]);

  const [dataProfile, setDataProfile] = useState([]);
  const [dataUnite, setDataUnite] = useState([]);
  const [dataStatut, setDataStatut] = useState([]);
  const [dataSelected, setDataSelected] = useState({
    deposit: "",
    profile: "",
    unites: "",
  });

  const clearSelected = () => {
    setDataSelected({
      deposit: "",
      profile: "",
    });
  };

  const [textValueD, setTextValueD] = useState("");
  const [textValueP, setTextValueP] = useState("");
  const [textValueU, setTextValueU] = useState("");
  const [textValueS, setTextValueS] = useState("");

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setDataSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(dataSelected);
  };

  const requestGetDeposit = async () => {
    try {
      const response = await axios.get(url, {
        params: { deposit: "" },
      });
      setDataDeposit(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const requestGetProfile = async () => {
    try {
      const response = await axios.get(url, {
        params: { profile: "" },
      });
      setDataProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const requestGetUnite = async () => {
    try {
      const response = await axios.get(url, {
        params: { unite: "" },
      });
      setDataUnite(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const requestGetStatut = async () => {
    try {
      const response = await axios.get(url, {
        params: { statut: "" },
      });
      setDataStatut(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const requestPostDeposit = async (deposit) => {
    var f = new FormData();
    f.append("deposit", deposit);
    f.append("METHOD", "POST");
    try {
      const response = await axios.post(url, f, {
        params: { deposit: "" },
      });
      // setDataDeposit(response.data);
      requestGetDeposit();
    } catch (error) {
      console.error(error);
    }
  };

  const requestPostProfile = async (profile) => {
    var f = new FormData();
    f.append("profile", profile);
    f.append("METHOD", "POST");
    try {
      const response = await axios.post(url, f, {
        params: { profile: "" },
      });
      // setDataDeposit(response.data);
      requestGetProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const requestPostUnite = async (unite) => {
    var f = new FormData();
    f.append("unite", unite);
    f.append("METHOD", "POST");
    try {
      const response = await axios.post(url, f, {
        params: { unite: "" },
      });
      // setDataDeposit(response.data);
      requestGetUnite();
    } catch (error) {
      console.error(error);
    }
  };

  const requestPostStatut = async (statut) => {
    var f = new FormData();
    f.append("statut", statut);
    f.append("METHOD", "POST");
    try {
      const response = await axios.post(url, f, {
        params: { statut: "" },
      });
      // setDataDeposit(response.data);
      requestGetStatut();
    } catch (error) {
      console.error(error);
    }
  };

  const requestDeleteDeposit = async (deposit) => {
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios
      .post(url, f, { params: { deposit: deposit } })
      .then((response) => {
        // setDataDeposit(response.data);
        requestGetDeposit();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestDeleteProfile = async (profile) => {
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios
      .post(url, f, { params: { profile: profile } })
      .then((response) => {
        // setDataProfile(response.data);
        requestGetProfile();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestDeleteUnite = async (unite) => {
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios
      .post(url, f, { params: { unite: unite } })
      .then((response) => {
        // setDataUnite(response.data);
        requestGetUnite();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestDeleteStatut = async (statut) => {
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios
      .post(url, f, { params: { statut: statut } })
      .then((response) => {
        // setDataStatut(response.data);
        requestGetStatut();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    requestGetDeposit();
    requestGetProfile();
    requestGetUnite();
    requestGetStatut();
  }, []);

  return (
    <Box m="25px">
      <Header
        title="Dashboard"
        subtitle="Configurer tous les options possibles de l'application."
      />
      <Box m="40px 0 0 0" height="75vh" sx={{}}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Box
              p="10px 0px 10px 0px"
              // gridColumn="span 3"
              // backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dépôt"
                // onBlur={handleBlur}
                value={textValueD}
                onChange={(e) => {
                  HandleChange(e);
                  setTextValueD(e.target.value);
                }}
                name="deposit"
                // error={!!touched.firstName && !!errors.firstName}
                // helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 8" }}
              />
              <IconButton
                color="secondary"
                size="large"
                onClick={
                  dataSelected.deposit != ""
                    ? () => {
                        requestPostDeposit(dataSelected.deposit);
                        // clearSelected();
                        setTextValueD("");
                      }
                    : () => {}
                }
              >
                <AddCircle fontSize="inherit" />
              </IconButton>
            </Box>
            <Box
              p="10px 0px 10px 0px"
              // gridColumn="span 3"
              // backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                fullWidth
                variant="filled"
                select
                label={
                  dataDeposit.length > 0
                    ? "Choisissez un Profile"
                    : "pas de Profiles disponibles"
                }
                onChange={HandleChange}
                name="deposit"
                SelectProps={{
                  native: true,
                }}
                sx={{ gridColumn: "span 4" }}
              >
                {dataDeposit.length > 0 ? (
                  <option value="" selected></option>
                ) : null}{" "}
                {dataDeposit.map((item) => (
                  <option value={item.deposit} key={item.deposit}>
                    {item.deposit}
                  </option>
                ))}
              </TextField>
              <IconButton
                color="secondary"
                size="large"
                onClick={() => {
                  requestDeleteDeposit(dataSelected.deposit);
                }}
              >
                <Delete fontSize="inherit" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              p="10px 0px 10px 0px"
              // gridColumn="span 3"
              // backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Profile"
                // onBlur={handleBlur}
                value={textValueP}
                onChange={(e) => {
                  HandleChange(e);
                  setTextValueP(e.target.value);
                }}
                name="profile"
                // error={!!touched.firstName && !!errors.firstName}
                // helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 8" }}
              />
              <IconButton
                color="secondary"
                size="large"
                onClick={
                  dataSelected.profile != ""
                    ? () => {
                        requestPostProfile(dataSelected.profile);
                        // clearSelected();
                        setTextValueP("");
                      }
                    : () => {}
                }
              >
                <AddCircle fontSize="inherit" />
              </IconButton>
            </Box>
            <Box
              p="10px 0px 10px 0px"
              // gridColumn="span 3"
              // backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                fullWidth
                variant="filled"
                select
                label={
                  dataProfile.length > 0
                    ? "Choisissez un Profile"
                    : "pas de Profiles disponibles"
                }
                onChange={HandleChange}
                name="profile"
                SelectProps={{
                  native: true,
                }}
                sx={{ gridColumn: "span 4" }}
              >
                {dataProfile.length > 0 ? (
                  <option value="" selected></option>
                ) : null}
                {dataProfile.map((item) => (
                  <option value={item.profile} key={item.profile}>
                    {item.profile}
                  </option>
                ))}
              </TextField>
              <IconButton
                color="secondary"
                size="large"
                onClick={() => {
                  requestDeleteProfile(dataSelected.profile);
                }}
              >
                <Delete fontSize="inherit" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              p="10px 0px 10px 0px"
              // gridColumn="span 3"
              // backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Unite"
                // onBlur={handleBlur}
                value={textValueU}
                onChange={(e) => {
                  HandleChange(e);
                  setTextValueU(e.target.value);
                }}
                name="unite"
                // error={!!touched.firstName && !!errors.firstName}
                // helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 8" }}
              />
              <IconButton
                color="secondary"
                size="large"
                onClick={
                  dataSelected.unite != ""
                    ? () => {
                        requestPostUnite(dataSelected.unite);
                        // clearSelected();
                        setTextValueU("");
                      }
                    : () => {}
                }
              >
                <AddCircle fontSize="inherit" />
              </IconButton>
            </Box>
            <Box
              p="10px 0px 10px 0px"
              // gridColumn="span 3"
              // backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                fullWidth
                variant="filled"
                select
                label={
                  dataUnite.length > 0
                    ? "Choisissez une Unite"
                    : "pas d'Unites disponibles"
                }
                onChange={HandleChange}
                name="unite"
                SelectProps={{
                  native: true,
                }}
                sx={{ gridColumn: "span 4" }}
              >
                {dataUnite.length > 0 ? (
                  <option value="" selected></option>
                ) : null}
                {dataUnite.map((item) => (
                  <option value={item.unite} key={item.unite}>
                    {item.unite}
                  </option>
                ))}
              </TextField>
              <IconButton
                color="secondary"
                size="large"
                onClick={() => {
                  requestDeleteUnite(dataSelected.unite);
                }}
              >
                <Delete fontSize="inherit" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              p="10px 0px 10px 0px"
              // gridColumn="span 3"
              // backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Statut"
                // onBlur={handleBlur}
                value={textValueS}
                onChange={(e) => {
                  HandleChange(e);
                  setTextValueS(e.target.value);
                }}
                name="statut"
                // error={!!touched.firstName && !!errors.firstName}
                // helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 8" }}
              />
              <IconButton
                color="secondary"
                size="large"
                onClick={
                  dataSelected.statut != ""
                    ? () => {
                        requestPostStatut(dataSelected.statut);
                        // clearSelected();
                        setTextValueS("");
                      }
                    : () => {}
                }
              >
                <AddCircle fontSize="inherit" />
              </IconButton>
            </Box>
            <Box
              p="10px 0px 10px 0px"
              // gridColumn="span 3"
              // backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                fullWidth
                variant="filled"
                select
                label={
                  dataStatut.length > 0
                    ? "Choisissez un Statut"
                    : "pas de Statut disponible"
                }
                onChange={HandleChange}
                name="statut"
                SelectProps={{
                  native: true,
                }}
                sx={{ gridColumn: "span 4" }}
              >
                {dataStatut.length > 0 ? (
                  <option value="" selected></option>
                ) : null}
                {dataStatut.map((item) => (
                  <option value={item.statut} key={item.statut}>
                    {item.statut}
                  </option>
                ))}
              </TextField>
              <IconButton
                color="secondary"
                size="large"
                onClick={() => {
                  requestDeleteStatut(dataSelected.statut);
                }}
              >
                <Delete fontSize="inherit" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;
