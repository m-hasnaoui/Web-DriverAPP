import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import {
  Box,
  useTheme,
  Button,
  useMediaQuery,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
} from "@mui/material";
import Header from "../components/Header";
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
import EditIcon from "@mui/icons-material/Edit";

import { pink, green, red } from "@mui/material/colors";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import config from "./global/config";
import { ReactSession } from "react-client-session";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import DateTimePicker from "../components/FormsUI/DataTimePicker";
import ButtonWrapper from "../components/FormsUI/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import HistoryIcon from "@mui/icons-material/History";
import DoneOutlineOutlinedIcon from "@mui/icons-material/DoneOutlineOutlined";
import { DoneOutlineOutlined } from "@mui/icons-material";

function Pointing() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "Pointing.php";
  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";
  const [dataProfile, setDataProfile] = useState([]);

  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDeleteHis, setModalDeleteHis] = useState(false);
  const [dataSelectDriver, setDataSelectDriver] = useState([]);
  const [dataSelectPointing, setDataSelectPointing] = useState([]);
  const [DateStartP, setDateStartP] = useState(dayjs());
  const [DateEndP, setDateEndP] = useState(dayjs().add(7, "day"));

  const [PointingSelected, setPointingSelected] = useState({
    idP: "",
    idDriver: "",
    nom: "",
    prenom: "",
    statut: "",
    date_pointing: "",
    avance: "",
    username: "",
    userUpdate: "",
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const label = { inputProps: { "aria-label": "avance" } };
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  // const HandleChange = (e) => {
  //   const { name, value } = e.target;
  //   setPointingSelected((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  //   console.log(PointingSelected);
  // };
  const HandleChange = (e) => {
    const { name, value, checked } = e.target;
    setPointingSelected((prevState) => ({
      ...prevState,
      [name]: name === "statut" ? (checked ? "1" : "0") : value,
    }));
    // console.log(PointingSelected);
  };
  const requestGetSelectPointing = async (startDateP, endDateP) => {
    await axios
      .get(urlSelect, {
        params: {
          // startDate: "2024-05-01",
          startDateP: startDateP.format("YYYY-MM-DD"),
          // endDate: "2024-07-23",
          endDateP: endDateP.format("YYYY-MM-DD"),
        },
      })
      .then((response) => {
        setDataSelectPointing(response.data);

        // console.log(startDate, endDate);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clearSelected = () => {
    setPointingSelected({
      idP: "",
      idDriver: "",
      nom: "",
      prenom: "",
      statut: "",
      date_pointing: "",
      avance: "",
      username: "",
      userUpdate: "",
    });
  };

  const openCloseModalInsert = () => {
    setModalAdd(!modalAdd);
    // requestGetSelectDriver();
    setChecked(false);

    setError(false);
  };

  const openCloseModalEdit = () => {
    // const a = "2024-05-23";
    // const b = "2024-07-23";
    requestGetSelectPointing(DateStartP, DateEndP);
    setModalEdit(!modalEdit);
    requestGetSelectDriver(selectedDate);
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
    requestGetSelectDriver(selectedDate);
  };
  const openCloseModalDeleteHis = () => {
    setModalDeleteHis(!modalDeleteHis);
    requestGetSelectPointing(DateStartP, DateEndP);

    // const a = "2024-05-23";
    // const b = "2024-07-23";
    // requestGetSelectPointing(a, b);
  };

  const requestGetSelectDriver = async (date) => {
    await axios
      .get(url, {
        params: {
          date_pointing: date,
        },
      })
      .then((response) => {
        setDataSelectDriver(response.data);

        // console.log(response.data);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  // const requestGetSelectDriver = async () => {
  //   await axios
  //     .get(urlSelect, { params: { driver_P: "" } })
  //     .then((response) => {
  //       setDataSelectDriver(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const requestGetProfile = async (id, page) => {
    await axios
      .get(urlProfile, {
        params: { idUser: id, page: page },
      })
      .then((response) => {
        setDataProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const requestGet = async () => {
    await axios
      .get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const requestPostAll = async () => {
    try {
      for (const record of dataSelectDriver) {
        const f = new FormData();
        f.append("idDriver", record.idDriver);
        f.append("date_pointing", selectedDate);
        f.append("avance", record.avance ? record.avance : "0.0");
        f.append("idUser", ReactSession.get("idUser"));
        f.append("METHOD", "POST");

        await axios.post(url, f);
      }

      requestGet();
      requestGetSelectDriver(selectedDate);

      alert("Tous les enregistrements ont été ajoutés avec succès !");
    } catch (error) {
      console.log(error);

      alert("Une erreur s'est produite lors de l'ajout d'enregistrements.");
    }
  };

  const requestPost = async () => {
    // const today = new Date();
    // const formattedDate = today.toISOString().split("T")[0];
    // PointingSelected.date_pointing =

    // Proceed with the rest of the function
    // if (!PointingSelected.date_pointing || !PointingSelected.idDriver) {
    //   setError(true);
    //   return;
    // }
    // console.log(PointingSelected.date);
    // console.log(selectedDate);
    const dateP = selectedDate;
    // console.log(PointingSelected.idDriver);

    var f = new FormData();
    f.append("idDriver", PointingSelected.idDriver);
    f.append("date_pointing", dateP);

    f.append(
      "avance",
      PointingSelected.avance ? PointingSelected.avance : "0.0"
    );
    f.append("idUser", ReactSession.get("idUser"));
    f.append("METHOD", "POST");
    try {
      const response = await axios.post(url, f);
      setData(data.concat(response.data));
      clearSelected();
      requestGet();
      openCloseModalInsert();
      requestGetSelectDriver(selectedDate);
    } catch (error) {
      console.log(error);
    }
  };

  const requestPut = async () => {
    var f = new FormData();
    f.append("idP", PointingSelected.idP);
    f.append("avance", PointingSelected.avance);
    const ActiveValue =
      PointingSelected.statut === "oui"
        ? "1"
        : PointingSelected.statut === "non"
        ? "0"
        : PointingSelected.statut;
    f.append("statut", ActiveValue);
    f.append("userUpdate", ReactSession.get("username"));

    f.append("METHOD", "PUT");
    try {
      await axios.post(url, f, {
        params: { idP: PointingSelected.idP },
      });

      setData((prevData) => {
        return prevData.map((pointing) =>
          pointing.idP === PointingSelected.idP
            ? { ...pointing, ...PointingSelected }
            : pointing
        );
      });

      requestGet();
      openCloseModalDelete();
    } catch (error) {
      console.error(error);
    }
  };
  const requestDelete = async () => {
    try {
      var f = new FormData();
      f.append("METHOD", "DELETE");

      await axios.post(url, f, {
        params: {
          idP: PointingSelected.idP,
        },
      });
      setData(data.filter((Pointing) => Pointing.idP !== PointingSelected.idP));
      openCloseModalDelete();
    } catch (error) {
      console.error(error);
    }
  };
  const requestDeleteHisP = async () => {
    try {
      var f = new FormData();
      f.append("METHOD", "DELETE");

      await axios.post(url, f, {
        params: {
          idP: PointingSelected.idP,
        },
      });
      setData(data.filter((Pointing) => Pointing.idP !== PointingSelected.idP));
      openCloseModalDeleteHis();
    } catch (error) {
      console.error(error);
    }
  };

  const selectPointing = (pointing, choice) => {
    setPointingSelected(pointing);
    if (choice === "Edit") {
      openCloseModalInsert();
    } else if (choice === "Delete") {
      openCloseModalDelete();
    }
  };
  const selectPointingHis = (pointing, choice) => {
    setPointingSelected(pointing);
    if (choice === "Delete") {
      openCloseModalDeleteHis();
    }
  };

  const columns = [
    {
      field: "idDriver",
      headerName: "ID",
      flex: 0.5,
      cellClassName: "name-column--cell2",
    },
    {
      field: "prenom",
      headerName: "Prenom",
      flex: 0.6,
      cellClassName: "name-column--cell",
    },
    {
      field: "nom",
      headerName: "Nom",
      flex: 0.6,
      cellClassName: "name-column--cell",
    },

    {
      field: "date_pointing",
      headerName: "Date Pointing",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return params.value || selectedDate;
      },
    },
    {
      field: "avance",
      headerName: "Avance (DH)",
      flex: 0.7,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return params.value === null ? 0 : selectPointing.avance;
      },
    },
    {
      field: "statut",
      headerName: "Statut",
      flex: 0.7,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return params.value === 1 ? "oui" : "non";
      },
    },
    ...(ReactSession.get("role") === "admin"
      ? [
          {
            field: "username",
            headerName: "Nom d'utilisateur",
            flex: 0.5,
            // width: 150,
            cellClassName: "name-column--cell2",
            renderCell: (params) => {
              return params.value === null ? "_" : selectPointing.username;
            },
          },
        ]
      : []),
    // {
    //   field: "idDriver",
    //   headerName: "Solde",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },

    // {
    //   field: "idDriver",
    //   headerName: "idDriver",
    //   headerAlign: "left",
    //   align: "left",
    //   flex: 1,
    // },
    // {
    //   field: "oldsolde",
    //   headerName: "idDriver",
    //   headerAlign: "left",
    //   align: "left",
    //   flex: 1,
    // },
    // {
    //   field: "date_charging",
    //   headerName: "Date Charging",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    ...(ReactSession.get("role") === "admin"
      ? [
          {
            field: "userUpdate",
            headerName: "utilisateur-mise à jour",
            flex: 0.5,
            // width: 150,
            cellClassName: "name-column--cell2",
            renderCell: (params) => {
              return params.value === null ? "_" : selectPointing.userUpdate;
            },
          },
        ]
      : []),

    {
      field: "actions",
      statut: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      renderCell: (params) => {
        return [
          (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`edit-${params.row.idP}`}
              icon={<InventoryOutlinedIcon style={{ color: "green" }} />}
              label="Edit"
              className="textPrimary"
              onClick={() => selectPointing(params.row, "Edit")}
              color="inherit"
              disabled={
                params.row.statut === "oui" ||
                params.row.statut === 1 ||
                params.row.statut === 0
              }
            />
          ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`delete-${params.row.idP}`}
              icon={<EditIcon />}
              label="Delete"
              onClick={() => selectPointing(params.row, "Delete")}
              color="inherit"
              disabled={
                // params.row.statut === "non" ||
                // params.row.statut === 0 ||
                params.row.statut === null
              }
            />
          ) : null,
        ];
      },
    },
  ];
  const columnsHis = [
    // {
    //   field: "idP",
    //   headerName: "ID",
    //   flex: 0.5,
    //   cellClassName: "name-column--cell2",
    // },
    // {
    //   field: "idDriver",
    //   headerName: "ID",
    //   flex: 0.5,
    //   cellClassName: "name-column--cell2",
    // },
    {
      field: "prenom",
      headerName: "Prenom",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "nom",
      headerName: "Nom",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "date_pointing",
      headerName: "Date Pointing",
      flex: 1,
      cellClassName: "name-column--cell",
      // renderCell: (params) => {
      //   return params.value || selectedDate;
      // },
    },
    {
      field: "avance",
      headerName: "Avance (DH)",
      flex: 0.5,
      cellClassName: "name-column--cell",
      // renderCell: (params) => {
      //   return params.value === null ? 0 : selectPointing.avance;
      // },
    },
    {
      field: "statut",
      headerName: "Statut",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return params.value === 1 ? "oui" : "non";
      },
    },

    {
      field: "actions",
      statut: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      renderCell: (params) => {
        return [
          // (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
          // ReactSession.get("role") == "admin" ? (
          //   <GridActionsCellItem
          //     key={`edit-${params.row.idP}`}
          //     icon={<InventoryOutlinedIcon style={{ color: "green" }} />}
          //     label="Edit"
          //     className="textPrimary"
          //     onClick={() => selectPointingHis(params.row, "Edit")}
          //     color="inherit"
          //     disabled={params.row.statut === "oui" || params.row.statut === 1}
          //     hidden={true}
          //   />
          // ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`delete-${params.row.idP}`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => selectPointingHis(params.row, "Delete")}
              color="inherit"
              disabled={
                params.row.statut === "non" || params.row.statut === null
              }
            />
          ) : null,
        ];
      },
    },
  ];
  const [loading, setLoading] = useState(true);

  // Now you can use defaultPointingId as defaultValue

  useEffect(() => {
    const fetchData = async () => {
      try {
        requestGetProfile(ReactSession.get("idUser"), "Pointing");
        requestGetSelectDriver(selectedDate);
        await requestGetSelectPointing(DateStartP, DateEndP);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [DateStartP, DateEndP]);

  return (
    <Box m="25px">
      {loading ? (
        <Header title="Loading" subtitle="" />
      ) : (
        <Header title="Pointing" subtitle="Liste des Pointings" />
      )}
      {loading ? null : (dataProfile.length > 0 &&
          dataProfile[0].op_add == 1) ||
        ReactSession.get("role") == "admin" ? (
        <Box display="flex" justifyContent="end" mt="20px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={dayjs(selectedDate)}
              onChange={(newDate) => {
                const formattedDate = newDate.format("YYYY-MM-DD");
                setSelectedDate(formattedDate);
                requestGetSelectDriver(formattedDate);
              }}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: false } }}
            />
          </LocalizationProvider>
          <IconButton
            color="secondary"
            onClick={openCloseModalEdit}
            sx={{ ml: 2 }}
          >
            <HistoryIcon />
          </IconButton>
          <IconButton
            type="submit"
            color="secondary"
            variant="contained"
            onClick={requestPostAll}
            sx={{ ml: 2, color: green[600] }}
          >
            <DoneOutlineOutlined />
          </IconButton>
        </Box>
      ) : null}
      <Modal isOpen={modalAdd}>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Pointage : {selectedDate}{" "}
        </ModalHeader>

        <ModalBody
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(8, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 8" },
            }}
          >
            <Box
              sx={{
                gridColumn: "span 2",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" color={colors.greenAccent[500]}>
                Avance
              </Typography>
              <Checkbox
                icon={<AddIcon />}
                checkedIcon={<ClearIcon />}
                checked={checked}
                onChange={handleCheckboxChange}
                sx={{
                  color: green[600],
                  "&.Mui-checked": {
                    color: red[600],
                  },
                }}
              />
            </Box>
            {checked && (
              <TextField
                label="Avance"
                type="number"
                onChange={HandleChange}
                name="avance"
                sx={{ gridColumn: "span 4" }}
              />
            )}
          </Box>
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          {error && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error">Missing required fields</Alert>
            </Stack>
          )}
          <button className="btn btn-primary" onClick={() => requestPost()}>
            Ajouter
          </button>{" "}
          <button
            className=" btn btn-danger"
            onClick={() => openCloseModalInsert()}
          >
            Fermer
          </button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={modalDelete}
        style={
          theme.palette.mode === "dark"
            ? { backgroundColor: colors.primary[500] }
            : { backgroundColor: "#fcfcfc" }
        }
      >
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Mettre à jour pointage : {selectedDate}{" "}
        </ModalHeader>
        <ModalBody
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(8, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 8" },
            }}
          >
            <Box
              sx={{
                gridColumn: "span 2",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" color={colors.greenAccent[500]}>
                Avance
              </Typography>
              <Checkbox
                icon={<AddIcon />}
                checkedIcon={<ClearIcon />}
                checked={checked}
                onChange={handleCheckboxChange}
                sx={{
                  color: green[600],
                  "&.Mui-checked": {
                    color: red[600],
                  },
                }}
              />
            </Box>
            {checked && (
              <TextField
                label="Avance"
                type="number"
                onChange={HandleChange}
                name="avance"
                sx={{ gridColumn: "span 4" }}
              />
            )}
          </Box>
          <FormControlLabel
            label="Présente"
            control={
              <Checkbox
                color="secondary"
                checked={
                  (PointingSelected &&
                    parseInt(PointingSelected.statut) === 1) ||
                  PointingSelected.statut === "oui"
                }
                onChange={HandleChange}
                name="statut"
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            sx={{ gridColumn: "span 4" }}
          />
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <button className="btn btn-danger" onClick={() => requestPut()}>
            Oui
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => openCloseModalDelete()}
          >
            {" "}
            Non
          </button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={modalDeleteHis}
        style={
          theme.palette.mode === "dark"
            ? { backgroundColor: colors.primary[500] }
            : { backgroundColor: "#fcfcfc" }
        }
      >
        <ModalBody
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Etes-vous sûr que vous voulez supprimer
          {/* {Caisse && Caisse.idAM} ? */}
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <button
            className="btn btn-danger"
            onClick={() => requestDeleteHisP()}
          >
            Oui
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => openCloseModalDeleteHis()}
          >
            {" "}
            Non
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit} size="xl">
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Pointing
          {/* {selectedDate}{" "} */}
        </ModalHeader>

        <ModalBody
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <Box display="flex" justifyContent="end" mt="20px">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={DateStartP}
                onChange={(newValue) => setDateStartP(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: false } }}
              />
              <DatePicker
                label="End Date"
                value={DateEndP}
                onChange={(newValue) => setDateEndP(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: false } }}
              />
            </LocalizationProvider>

            {/* <Button onClick={() => requestGetSelectDriver(DateStart, DateEnd)}>
            Get Report
          </Button> */}
          </Box>
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .name-column--cell2": {
                color: colors.redAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
            }}
          >
            <DataGrid
              rows={
                dataSelectPointing.length >= 0
                  ? dataSelectPointing.map((Pointing) => {
                      return {
                        id: Pointing.idP,
                        idP: Pointing.idP,
                        date_pointing: Pointing.date_pointing,

                        // regNumber: Pointing.statut + " " + Pointing.regNumber,
                        idDriver: Pointing.idDriver,
                        nom: Pointing.nom,
                        prenom: Pointing.prenom,
                        statut: Pointing.statut,
                        avance: Pointing.avance,
                        // == 1 ? "oui" : "non",
                        username: Pointing.username,
                        userUpdate: Pointing.userUpdate,
                      };
                    })
                  : []
              }
              getRowId={(row) => row.id}
              columns={columnsHis}
              components={{ Toolbar: CustomToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
          </Box>
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          {error && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error">Missing required fields</Alert>
            </Stack>
          )}
          {/* <button className="btn btn-primary" onClick={() => requestPost()}>
            Ajouter
          </button>{" "} */}
          <button
            className=" btn btn-danger"
            onClick={() => openCloseModalEdit()}
          >
            Fermer
          </button>
        </ModalFooter>
      </Modal>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .name-column--cell2": {
            color: colors.redAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={
            dataSelectDriver.length >= 0
              ? dataSelectDriver.map((Pointing) => {
                  return {
                    id: Pointing.idDriver,
                    idP: Pointing.idP,
                    date_pointing: Pointing.date_pointing,

                    // regNumber: Pointing.statut + " " + Pointing.regNumber,
                    idDriver: Pointing.idDriver,
                    nom: Pointing.nom,
                    prenom: Pointing.prenom,
                    statut: Pointing.statut,
                    avance: Pointing.avance,
                    username: Pointing.username,
                    userUpdate: Pointing.userUpdate,

                    // == 1 ? "oui" : "non",
                  };
                })
              : []
          }
          getRowId={(row) => row.id}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </Box>
  );
}

const csvOptions = {
  fileName: "BD_Pointing",
  delimiter: ";",
  utf8WithBom: true,
};
const printOptions = {
  hideFooter: true,
  hideToolbar: true,
  includeCheckboxes: true,
};

function CustomExportButtons(props) {
  return (
    <GridToolbarExportContainer {...props}>
      <GridCsvExportMenuItem options={csvOptions} />
      <GridPrintExportMenuItem options={printOptions} />
    </GridToolbarExportContainer>
  );
}

function CustomToolbar(props) {
  return (
    <GridToolbarContainer {...props}>
      <GridToolbarColumnsButton />
      {/* <GridToolbarFilterButton /> */}
      <GridToolbarDensitySelector />
      <CustomExportButtons />
      <Box
        sx={{
          marginLeft: "auto",
          pl: 0,
          pr: 0,
          pb: 0,
          pt: 0,
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
}

export default Pointing;
