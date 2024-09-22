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
  Alert,
  Stack,
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
  GridToolbarQuickFilter,
  GridFilterInputValue,
} from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import config from "./global/config";
import { ReactSession } from "react-client-session";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Caisse = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "caisse.php";
  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";

  const [dataProfile, setDataProfile] = useState([]);
  const [data, setData] = useState([]);
  const [dataSold, setDataSold] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [DateStart, setDateStart] = useState(dayjs().add(-7, "day"));
  const [DateEnd, setDateEnd] = useState(dayjs());
  const [DataSUM, setDataSUM] = useState({ total_sum: 0 });
  const [showTotal, setShowTotal] = useState(false);

  const [selectedCaisse, setSelectedCaisse] = useState({
    idCaisse: "",
    date_caisse: new Date().toISOString().slice(0, 10),
    designation: "",
    num_bl: "",
    montant: "",
    sens: "",
    username: "",
    userUpdate: "",
  });

  const handleChange = (e) => {
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
      sens: "",
      username: "",
      userUpdate: "",
    });
  };
  const toggleShowTotal = () => {
    setShowTotal((prevShowTotal) => !prevShowTotal);
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
    try {
      const response = await axios.get(urlProfile, {
        params: { idUser: id, page: page },
      });
      setDataProfile(response.data);
    } catch (error) {
      console.error(error);
    }
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
  const requestGetSum = async (startDateSUM1, endDateSUM1) => {
    try {
      const response = await axios.get(urlSelect, {
        params: {
          startDateSUM1: startDateSUM1.format("YYYY-MM-DD"),
          endDateSUM1: endDateSUM1.format("YYYY-MM-DD"),
          idSolde: 1,
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

  const requestGetSolde = async () => {
    try {
      const response = await axios.get(urlSelect, { params: { solde: 1 } });
      setDataSold(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const requestPost = async () => {
    if (
      !selectedCaisse.date_caisse ||
      !selectedCaisse.designation ||
      !selectedCaisse.montant ||
      !selectedCaisse.sens
    ) {
      setError(true);
      return;
    }

    const formData = new FormData();
    formData.append("date_caisse", selectedCaisse.date_caisse);
    formData.append("designation", selectedCaisse.designation);
    formData.append("num_bl", selectedCaisse.num_bl || "0.0");
    formData.append("montant", selectedCaisse.montant);
    formData.append("sens", selectedCaisse.sens);
    formData.append("idUser", ReactSession.get("idUser"));

    formData.append("METHOD", "POST");

    try {
      const response = await axios.post(url, formData);
      setData([...data, response.data]);
      clearSelected();
      requestGet(DateStart, DateEnd);
      requestGetSum(DateStart, DateEnd);

      openCloseModalInsert();
    } catch (error) {
      console.error(error);
    }
  };

  const requestPut = async () => {
    const formData = new FormData();
    formData.append("date_caisse", selectedCaisse.date_caisse);
    formData.append("designation", selectedCaisse.designation);
    formData.append("num_bl", selectedCaisse.num_bl);
    formData.append("montant", selectedCaisse.montant);
    formData.append("sens", selectedCaisse.sens);

    formData.append("METHOD", "PUT");

    try {
      await axios.post(url, formData, {
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
  // const customSensFilter = {
  //   filterOperators: [
  //     {
  //       label: "contains",
  //       value: "contains",
  //       getApplyFilterFn: (filterItem) => {
  //         if (!filterItem.value) {
  //           return null;
  //         }
  //         const valueFormatted = filterItem.value.toLowerCase();
  //         return ({ value }) => {
  //           const sensValue = value === -1 ? "avance" : "consomation";
  //           return sensValue.toLowerCase().includes(valueFormatted);
  //         };
  //       },
  //       InputComponent: GridFilterInputValue,
  //     },
  //   ],
  // };

  const columns = [
    { field: "idCaisse", headerName: "ID", flex: 0.5 },
    { field: "date_caisse", headerName: "Date", flex: 1 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "num_bl", headerName: "N° BL", flex: 1 },
    {
      field: "sens",
      headerName: "Sens",
      flex: 1,
      // renderCell: (params) => (params.value === 1 ? "avance" : "consomation"),
      valueGetter: (params) => sensMap[params.row.sens] || params.row.sens,
    },
    { field: "montant", headerName: "Montant", flex: 1 },
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
    // ...(ReactSession.get("role") === "admin"
    //   ? [
    //       {
    //         field: "userUpdate",
    //         headerName: "utilisateur-mise à jour",
    //         flex: 0.5,
    //         // width: 150,
    //         cellClassName: "name-column--cell2",
    //         renderCell: (params) => {
    //           return params.value === null ? "_" : selectPointing.userUpdate;
    //         },
    //       },
    //     ]
    //   : []),
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await requestGetProfile(ReactSession.get("idUser"), "Caisse");
        await requestGet(DateStart, DateEnd);
        await requestGetSolde();
        requestGetSum(DateStart, DateEnd);
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
        <>
          <Header title="Caisse Agadir" subtitle="List Caisse" />
          {(dataProfile.some((profile) => profile.op_add === 1) ||
            ReactSession.get("role") === "admin") && (
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
                  Total :{" "}
                  {showTotal ? `${DataSUM.total_sum ?? 0} Dh` : "******"}
                </Typography>
                <IconButton onClick={toggleShowTotal}>
                  {showTotal ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
            </Box>
          )}

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
                  onChange={handleChange}
                  name="date_caisse"
                  sx={{ gridColumn: "span 8" }}
                  //   hidden={selectedCaisse.operation !== "chargement"}
                />
                <FormControl component="fieldset" sx={{ gridColumn: "span 8" }}>
                  <FormLabel component="legend">Sens:</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-form-control-label-placement"
                    onChange={handleChange}
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
                  onChange={handleChange}
                  name="num_bl"
                  sx={{ gridColumn: "span 4" }}
                  //   hidden={selectedCaisse.operation !== "chargement"}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Montant :"
                  onChange={handleChange}
                  name="montant"
                  sx={{ gridColumn: "span 4" }}
                  //   hidden={selectedCaisse.operation !== "chargement"}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Designation :"
                  onChange={handleChange}
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
                      key="default-solde"
                      value={`${solde.solde} DH`}
                      variant="standard"
                      label={`Solde`}
                      helperText={`Solde: ${solde.solde}`}
                      InputProps={{ readOnly: true }}
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
              <button
                className="btn btn-danger"
                onClick={() => requestDelete()}
              >
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
              rows={data.map((caisse) => ({
                id: caisse.idCaisse,
                idCaisse: caisse.idCaisse,
                date_caisse: caisse.date_caisse,
                designation: caisse.designation,
                num_bl: caisse.num_bl,
                montant: caisse.montant,
                sens: caisse.sens,

                username: caisse.username,
              }))}
              getRowId={(row) => row.idCaisse}
              columns={columns}
              components={{ Toolbar: CustomToolbar }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const CustomExportButtons = (props) => (
  <GridToolbarExportContainer {...props}>
    <GridCsvExportMenuItem
      options={{
        fileName: "BD_Caisse_Agadir",
        delimiter: ";",
        utf8WithBom: true,
      }}
    />
    <GridPrintExportMenuItem
      options={{ hideFooter: true, hideToolbar: true, includeCheckboxes: true }}
    />
  </GridToolbarExportContainer>
);

const CustomToolbar = (props) => (
  <GridToolbarContainer {...props}>
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
    <CustomExportButtons />
    <Box sx={{ marginLeft: "auto" }}>
      <GridToolbarQuickFilter /> {/* Ensure this is used correctly */}
    </Box>
  </GridToolbarContainer>
);

export default Caisse;
