import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  useMediaQuery,
  FormLabel,
  FormControl,
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
import { useTheme } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function Caisse2() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "caisse_2.php";
  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";
  const [dataProfile, setDataProfile] = useState([]);
  const [dataVehicle, setDataVehicle] = useState([]);
  const [dataManagement, setDataManagement] = useState([]);
  const [dataSold, setDataSold] = useState([]);
  const [dataGestionidM, setdataGestionidM] = useState([]);
  const [error, setError] = useState(false);

  const [data, setData] = useState([]);
  const [showTotal, setShowTotal] = useState(false);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [DataSUM, setDataSUM] = useState({ total_sum: 0 });

  const [selectedCaisse, setSelectedCaisse] = useState({
    idCaisse: "",
    date_caisse: new Date().toISOString().slice(0, 10),
    designation: "",
    num_bl: "",
    montant: "",
    // avance: "",
    sens: "",
    username: "",
  });
  const [DateStart, setDateStart] = useState(dayjs().add(-7, "day"));
  const [DateEnd, setDateEnd] = useState(dayjs());
  const toggleShowTotal = () => {
    setShowTotal((prevShowTotal) => !prevShowTotal);
  };

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCaisse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const sensMap = {
    1: "avance",
    "-1": "consomation",
  };

  const clearSelected = () => {
    setSelectedCaisse({
      idCaisse: "",
      date_caisse: new Date().toISOString().slice(0, 10),
      designation: "",
      num_bl: "",
      montant: "",
      //   avance: "",
      sens: "",
      username: "",
    });
  };

  const openCloseModalInsert = () => {
    requestGetSolde();
    clearSelected();
    setModalAdd(!modalAdd);
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
  };

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

  const requestGet = async (startDate, endDate) => {
    try {
      const response = await axios.get(url, {
        params: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
        },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const requestGetSolde = async () => {
    await axios
      .get(urlSelect, { params: { solde: 2 } })
      .then((response) => {
        setDataSold(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPost = async () => {
    if (
      !selectedCaisse.date_caisse ||
      !selectedCaisse.designation ||
      // !selectedCaisse.num_bl ||
      !selectedCaisse.montant ||
      !selectedCaisse.sens
    ) {
      setError(true);
      return;
    }

    var f = new FormData();
    f.append("date_caisse", selectedCaisse.date_caisse);
    f.append("designation", selectedCaisse.designation);
    f.append("num_bl", selectedCaisse.num_bl ? selectedCaisse.num_bl : "0.0");
    // f.append("num_bl", selectedCaisse.num_bl);
    f.append("montant", selectedCaisse.montant);
    // f.append("avance", selectedCaisse.avance);
    f.append("sens", selectedCaisse.sens);
    f.append("idUser", ReactSession.get("idUser"));
    f.append("METHOD", "POST");

    try {
      const response = await axios.post(url, f);
      setData(data.concat(response.data));
      clearSelected();
      requestGet(DateStart, DateEnd);
      openCloseModalInsert();
    } catch (error) {
      console.log(error);
    }
  };
  const requestGetSum = async (startDateSUM1, endDateSUM1) => {
    try {
      const response = await axios.get(urlSelect, {
        params: {
          startDateSUM1: startDateSUM1.format("YYYY-MM-DD"),
          endDateSUM1: endDateSUM1.format("YYYY-MM-DD"),
          idSolde: 2,
        },
      });

      if (response.data.length > 0) {
        setDataSUM(response.data[0]);
      } else {
        setDataSUM({ total_sum: 0 });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const requestPut = async () => {
    var f = new FormData();
    f.append("date_caisse", selectedCaisse.date_caisse);
    f.append("designation", selectedCaisse.designation);
    f.append("num_bl", selectedCaisse.num_bl);
    f.append("montant", selectedCaisse.montant);
    f.append("avance", selectedCaisse.avance);
    f.append("sens", selectedCaisse.sens);
    f.append("METHOD", "PUT");
    try {
      await axios.post(url, f, {
        params: { idCaisse: selectedCaisse.idCaisse },
      });
      requestGet(DateStart, DateEnd);
      openCloseModalEdit();
    } catch (error) {
      console.error(error);
    }
  };

  const requestDelete = async () => {
    try {
      var f = new FormData();
      f.append("METHOD", "DELETE");
      // Add additional parameters to the FormData object
      f.append("montant", selectedCaisse.montant);
      f.append("sens", selectedCaisse.sens);

      await axios.post(url, f, {
        params: {
          idCaisse: selectedCaisse.idCaisse,
        },
      });
      setData(
        data.filter((Caisse) => Caisse.idCaisse !== selectedCaisse.idCaisse)
      );
      openCloseModalDelete();
      requestGetSum(DateStart, DateEnd);
    } catch (error) {
      console.error(error);
    }
  };
  const selectCaisse = (caisse, action) => {
    setSelectedCaisse(caisse);
    action === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };
  const columns = [
    { field: "idCaisse", headerName: "ID", flex: 0.5 },
    { field: "date_caisse", headerName: "Date", flex: 1 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "num_bl", headerName: "N° BL", flex: 1 },
    {
      field: "sens",
      headerName: "Sens",
      flex: 1,
      valueGetter: (params) => sensMap[params.row.sens] || params.row.sens,
    },

    {
      field: "montant",
      headerName: "Montant",
      flex: 1,
    },
    // { field: "avance", headerName: "Avance", flex: 1 },
    ...(ReactSession.get("role") === "admin"
      ? [
          {
            field: "username",
            headerName: "Nom d'utilisateur",
            width: 100,
            cellClassName: "name-column--cell2",
          },
        ]
      : []),
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      renderCell: (params) => {
        return [
          (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`edit-${params.row.idCaisse}`}
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => selectCaisse(params.row, "Edit")}
              color="inherit"
              disabled={true}
              hidden={true}
            />
          ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`delete-${params.row.idCaisse}`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => selectCaisse(params.row, "Delete")}
              color="inherit"
            />
          ) : null,
        ];
      },
    },
  ];
  const [loading, setLoading] = useState(true);

  // Now you can use defaultAutorouteId as defaultValue

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(ReactSession.get('idUser'));
        await requestGetProfile(ReactSession.get("idUser"), "Caisse Berrechid");
        await requestGet(DateStart, DateEnd);
        await requestGetSolde();
        requestGetSum(DateStart, DateEnd);

        // console.log(dataProfile[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [DateStart, DateEnd]);
  return (
    <Box m="25px">
      {loading ? (
        <Header title="Loading" subtitle="" />
      ) : (
        <Header title="Caisse Berrechid" subtitle=" List Caisse Berrechid" />
      )}
      {loading ? null : (dataProfile.length > 0 &&
          dataProfile[0].op_add == 1) ||
        ReactSession.get("role") == "admin" ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="end"
          mt="20px"
        >
          <Box display="flex" justifyContent="end" mt="20px">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date Start"
                value={DateStart}
                onChange={(newValue) => setDateStart(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: false } }}
              />
              <DatePicker
                label="Date End"
                value={DateEnd}
                onChange={(newValue) => setDateEnd(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: false } }}
              />
            </LocalizationProvider>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              onClick={openCloseModalInsert}
            >
              Nouveau
            </Button>
          </Box>
          <Box
            mt="30px"
            display="flex"
            justifyContent="end"
            alignItems="center"
          >
            <Typography variant="h4" color={colors.greenAccent[500]}>
              Total : {showTotal ? `${DataSUM.total_sum ?? 0} Dh` : "******"}
            </Typography>
            <IconButton onClick={toggleShowTotal}>
              {showTotal ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>
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
          Ajouter une Gestion{" "}
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
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              fullWidth
              defaultValue={new Date().toISOString().slice(0, 10)}
              variant="filled"
              type="date"
              label="Date :"
              onChange={HandleChange}
              name="date_caisse"
              sx={{ gridColumn: "span 8" }}
              //   hidden={selectedCaisse.operation !== "chargement"}
            />
            <FormControl component="fieldset" sx={{ gridColumn: "span 8" }}>
              <FormLabel component="legend">Sens:</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-form-control-label-placement"
                onChange={HandleChange}
                name="sens"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <FormControlLabel
                  value="1"
                  control={
                    <Radio
                      sx={{
                        color: green[800],
                        "&.Mui-checked": {
                          color: green[600],
                        },
                      }}
                    />
                  }
                  label="avance"
                  sx={{ marginRight: "16px" }}
                />
                <FormControlLabel
                  value="-1"
                  control={
                    <Radio
                      sx={{
                        color: red[800],
                        "&.Mui-checked": {
                          color: red[600],
                        },
                      }}
                    />
                  }
                  label="cunsumation"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="N° Bl"
              onChange={HandleChange}
              name="num_bl"
              sx={{ gridColumn: "span 4" }}
              //   hidden={selectedCaisse.operation !== "chargement"}
            />
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Montant :"
              onChange={HandleChange}
              name="montant"
              sx={{ gridColumn: "span 4" }}
              //   hidden={selectedCaisse.operation !== "chargement"}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Designation :"
              onChange={HandleChange}
              name="designation"
              sx={{ gridColumn: "span 8" }}
              //   hidden={selectedCaisse.operation !== "chargement"}
            />

            <>
              {dataSold.length > 0 ? null : (
                <TextField
                  label={`Solde`}
                  value="0 DH"
                  variant="standard"
                  // variant="filled"
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Solde: 0DH"
                  sx={{ gridColumn: "span 2" }}
                  disabled
                />
              )}
              {dataSold.map((solde) => (
                <TextField
                  key={solde.idSolde}
                  value={solde.solde + " DH"}
                  variant="standard"
                  label={`Solde`}
                  helperText={`Solde: ${solde.solde}`}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ gridColumn: "span 2" }}
                  disabled
                />
              ))}
            </>
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
        <ModalBody
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Etes-vous sûr que vous voulez supprimer l'Affectation N°{" "}
          {/* {Caisse && Caisse.idAM} ? */}
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <button className="btn btn-danger" onClick={() => requestDelete()}>
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
            data.length >= 0
              ? data.map((caisse) => {
                  return {
                    id: caisse.idCaisse,
                    idCaisse: caisse.idCaisse,
                    date_caisse: caisse.date_caisse,
                    designation: caisse.designation,
                    num_bl: caisse.num_bl,
                    montant: caisse.montant,
                    sens: caisse.sens,
                    username: caisse.username,
                  };
                })
              : []
          }
          getRowId={(row) => row.idCaisse}
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
  fileName: "BD_Caisse_Berrechid",
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

export default Caisse2;
