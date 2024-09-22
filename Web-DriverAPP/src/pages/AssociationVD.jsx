import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import { Box, useTheme, Button, useMediaQuery, TextField } from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import config from "./global/config";
import { ReactSession } from "react-client-session";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import DateTimePicker from "../components/FormsUI/DataTimePicker";
import ButtonWrapper from "../components/FormsUI/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
function AssociationVD() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "association_vd.php";
  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";
  const [dataProfile, setDataProfile] = useState([]);

  const [data, setData] = useState([]);
  const [dataSelectDriver, setDataSelectDriver] = useState([]);
  const [dataSelectVehicle, setDataSelectVehicle] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [AssociationVDSelected, setAssociationVDSelected] = useState({
    idAVD: "",
    idDriver: "",
    idVcl: "",
    date_start: "",
    date_end: "",
    nom: "",
    regNumber: "",
    prenom: "",
    type: "",
    numE: "",
    date_c: "",
    time: null,
    username: "",
  });

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setAssociationVDSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    //console.log(AssociationVDSelected);
  };

  const FORM_VALIDATION = Yup.object().shape({
    idDriver: Yup.string().required("Required"),
    idVcl: Yup.string().required("Required"),
    date_start: Yup.date().required("Required"),
    date_end: Yup.date().required("Required"),
    time: Yup.date().required("Required"),
  });
  const clearSelected = () => {
    setAssociationVDSelected({
      idAVD: "",
      idDriver: "",
      idVcl: "",
      date_start: "",
      date_end: "",
      nom: "",
      regNumber: "",
      prenom: "",
      type: "",
      numE: "",
      time: null,
      username: "",
    });
  };

  const openCloseModalInsert = () => {
    clearSelected();
    setModalAdd(!modalAdd);
    requestGetSelectDriver();
    requestGetSelectVehicle();
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
    requestGetSelectDriver();
    requestGetSelectVehicle();
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
        //console.log(error);
      });
  };
  const requestGet = async () => {
    await axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const requestGetSelectDriver = async () => {
    await axios
      .get(urlSelect, { params: { vd: "" } })
      .then((response) => {
        setDataSelectDriver(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const requestGetSelectVehicle = async () => {
    await axios
      .get(urlSelect, { params: { v: "" } })
      .then((response) => {
        setDataSelectVehicle(response.data);
        //console.log(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const requestPost = async (values) => {
    var f = new FormData();
    f.append("idDriver", values.idDriver);
    f.append("idVcl", values.idVcl);
    f.append("date_start", values.date_start);
    f.append("date_end", values.date_end);
    f.append("time", values.time ? values.time.format("HH:mm") : null); // Format the time correctly
    f.append("idUser", ReactSession.get("idUser"));
    f.append("METHOD", "POST");

    await axios
      .post(url, f)
      .then((response) => {
        setData(data.concat(response.data));
        requestGet();
        openCloseModalInsert();
        clearSelected();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const requestGetCheck = async () => {
  //   await axios
  //     .get(urlSelect, {
  //       params: { idVcl: VehicleSelected.idVcl, checkVcl },
  //     })
  //     .then((response) => {
  //       response.data.checkVcl == 1 ? setCheckVcl(true) : setCheckVcl(false);
  //       console.warn(response.data.checkVcl);
  //     })
  //     .catch((error) => {
  //       //console.log(error);
  //     });
  // };

  const requestPut = async () => {
    var f = new FormData();
    f.append("idAVD", AssociationVDSelected.idAVD);
    f.append("idDriver", AssociationVDSelected.idDriver);
    f.append("idVcl", AssociationVDSelected.idVcl);
    f.append("date_start", AssociationVDSelected.date_start);
    f.append("date_end", AssociationVDSelected.date_end);
    f.append("time", AssociationVDSelected.time);
    f.append("METHOD", "PUT");
    try {
      await axios.post(url, f, {
        params: { idAVD: AssociationVDSelected.idAVD },
      });

      setData((prevData) => {
        return prevData.map((AssociationVD) =>
          AssociationVD.idAVD === AssociationVDSelected.idAVD
            ? {
                ...AssociationVD,
                idDriver: AssociationVDSelected.idDriver,
                idVcl: AssociationVDSelected.idVcl,
                date_start: AssociationVDSelected.date_start,
                date_end: AssociationVDSelected.date_end,
                time: AssociationVDSelected.time,
              }
            : AssociationVD
        );
      });

      requestGet();
      openCloseModalEdit();
    } catch (error) {
      console.error(error);
    }
  };

  const requestDelete = async () => {
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios
      .post(url, f, { params: { idAVD: AssociationVDSelected.idAVD } })
      .then((response) => {
        setData(
          data.filter(
            (AssociationVD) =>
              AssociationVD.idAVD !== AssociationVDSelected.idAVD
          )
        );
        openCloseModalDelete();
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const selectAssociationVD = (AssociationVD, choix) => {
    setAssociationVDSelected(AssociationVD);
    choix === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };

  const columns = [
    {
      field: "idAVD",
      headerName: "ID",
      flex: 0.5,
      cellClassName: "name-column--cell2",
    },
    {
      field: "numE",
      headerName: "Numéro d'employé",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "nom", headerName: "Chauffeur", flex: 1 },
    {
      field: "regNumber",
      headerName: "Matricule",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "date_start",
      headerName: "Date Début",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "date_end",
      headerName: "Date Fin",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "time",
      headerName: "Heure",

      cellClassName: "name-column--cell2",
    },
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
              key={`edit-${params.row.idAVD}`}
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => {
                // requestGetCheck();
                selectAssociationVD(params.row, "Edit");
              }}
              color="inherit"
            />
          ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`delete-${params.row.idAVD}`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => selectAssociationVD(params.row, "Delete")}
              color="inherit"
            />
          ) : null,
        ];
      },
    },
  ];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // //console.log(ReactSession.get('idUser'));
        requestGetProfile(
          ReactSession.get("idUser"),
          "Affectation Vehicule Chauffeur"
        );
        requestGet();

        // //console.log(dataProfile[0]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    if (!loading) {
      window.location.reload();
    }
  }, []);
  return (
    <Box m="25px">
      {loading ? (
        <Header title="Loading" subtitle="" />
      ) : (
        <Header
          title="Affectation Vehicule Chauffeur"
          subtitle="Liste des Affectations"
        />
      )}
      {loading ? null : (dataProfile.length > 0 &&
          dataProfile[0].op_add == 1) ||
        ReactSession.get("role") == "admin" ? (
        <Box display="flex" justifyContent="end" mt="20px">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={() => openCloseModalInsert()}
          >
            Nouvelle Affectation
          </Button>
        </Box>
      ) : null}
      <Modal isOpen={modalAdd}>
        <ModalHeader
          toggle={() => {
            openCloseModalInsert();
          }}
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Ajouter une Affectation
        </ModalHeader>
        <Formik
          initialValues={{
            ...AssociationVDSelected,
            time: AssociationVDSelected.time
              ? dayjs(AssociationVDSelected.time)
              : null,
          }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values) => {
            requestPost(values);
          }}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
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
                  gridTemplateColumns="repeat(12, 1fr)"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 12",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    select
                    label={
                      dataSelectDriver.length > 0
                        ? "Chauffeur"
                        : "pas de Chauffeurs disponibles"
                    }
                    name="idDriver"
                    value={values.idDriver}
                    onChange={(event) =>
                      setFieldValue("idDriver", event.target.value)
                    }
                    SelectProps={{
                      native: true,
                    }}
                    error={touched.idDriver && Boolean(errors.idDriver)}
                    helperText={touched.idDriver && errors.idDriver}
                    sx={{ gridColumn: "span 6" }}
                  >
                    {dataSelectDriver.length > 0 ? (
                      <option value="" selected hidden disabled>
                        Choisissez un Chauffeur
                      </option>
                    ) : null}
                    {dataSelectDriver.map((user) => (
                      <option value={user.idDriver} key={user.idDriver}>
                        {user.prenom + " " + user.nom}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    select
                    label={
                      dataSelectVehicle.length > 0
                        ? "Matricule"
                        : "pas de véhicules disponibles"
                    }
                    name="idVcl"
                    value={values.idVcl}
                    onChange={(event) =>
                      setFieldValue("idVcl", event.target.value)
                    }
                    SelectProps={{
                      native: true,
                    }}
                    error={touched.idVcl && Boolean(errors.idVcl)}
                    helperText={touched.idVcl && errors.idVcl}
                    sx={{ gridColumn: "span 6" }}
                  >
                    {dataSelectVehicle.length > 0 ? (
                      <option value="" selected hidden disabled>
                        Choisissez une Véhicule
                      </option>
                    ) : null}
                    {dataSelectVehicle.map((vcl) => (
                      <option value={vcl.idVcl} key={vcl.idVcl}>
                        {vcl.regNumber}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    type="date"
                    label="Date Début"
                    name="date_start"
                    value={values.date_start}
                    onChange={(event) =>
                      setFieldValue("date_start", event.target.value)
                    }
                    sx={{ gridColumn: "span 6" }}
                    error={touched.date_start && Boolean(errors.date_start)}
                    helperText={touched.date_start && errors.date_start}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    type="date"
                    label="Date Fin"
                    name="date_end"
                    value={values.date_end}
                    onChange={(event) =>
                      setFieldValue("date_end", event.target.value)
                    }
                    sx={{ gridColumn: "span 6" }}
                    error={touched.date_end && Boolean(errors.date_end)}
                    helperText={touched.date_end && errors.date_end}
                    InputLabelProps={{ shrink: true }}
                  />

                  <Box sx={{ gridColumn: "span 12" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["TimePicker"]}>
                        <TimePicker
                          label="Heure"
                          value={values.time}
                          onChange={(value) => {
                            setFieldValue("time", value);
                          }}
                          slotProps={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              variant="outlined"
                              error={touched.time && Boolean(errors.time)}
                              helperText={touched.time && errors.time}
                              sx={{ gridColumn: "span 12" }}
                            />
                          )}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Box>
              </ModalBody>
              <ModalFooter
                style={
                  theme.palette.mode === "dark"
                    ? { backgroundColor: colors.primary[500] }
                    : { backgroundColor: "#fcfcfc" }
                }
              >
                <ButtonWrapper className="btn btn-primary">
                  Ajouter
                </ButtonWrapper>{" "}
                <button
                  className="btn btn-danger"
                  onClick={() => openCloseModalInsert()}
                >
                  Fermer
                </button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal isOpen={modalEdit}>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Modifier une Affectation{" "}
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
              variant="filled"
              id="outlined-select-currency"
              select
              label="Chauffeur"
              onChange={HandleChange}
              name="idDriver"
              SelectProps={{
                native: true,
              }}
              defaultValue={AssociationVDSelected && AssociationVDSelected.nom}
              sx={{ gridColumn: "span 4" }}
            >
              <option
                selected
                value={AssociationVDSelected.idDriver}
                key={AssociationVDSelected.idDriver}
              >
                {(
                  AssociationVDSelected.prenom +
                  " " +
                  AssociationVDSelected.nom
                ).replace(/undefined/g, "")}
              </option>
              {dataSelectDriver.map((user) => (
                <option value={user.idDriver} key={user.idDriver}>
                  {user.prenom + " " + user.nom}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              id="outlined-select-currency"
              select
              label="Matricule"
              onChange={HandleChange}
              name="idVcl"
              SelectProps={{
                native: true,
              }}
              defaultValue={
                AssociationVDSelected && AssociationVDSelected.idVcl
              }
              sx={{ gridColumn: "span 4" }}
            >
              <option
                selected
                value={AssociationVDSelected.idVcl}
                key={AssociationVDSelected.idVcl}
              >
                {AssociationVDSelected.regNumber.replace(/undefined/g, "")}
              </option>
              {dataSelectVehicle.map((user) => (
                <option value={user.idVcl} key={user.idVcl}>
                  {user.regNumber}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="Date Début"
              onChange={HandleChange}
              name="date_start"
              value={AssociationVDSelected && AssociationVDSelected.date_start}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="Date Fin"
              onChange={HandleChange}
              name="date_end"
              value={AssociationVDSelected && AssociationVDSelected.date_end}
              sx={{ gridColumn: "span 4" }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="Heure"
                  value={dayjs(AssociationVDSelected.time, "HH:mm")}
                  onChange={(value) => {
                    HandleChange({
                      target: {
                        name: "time",
                        value: dayjs(value).format("HH:mm"),
                      },
                    });
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "filled",
                      sx: { gridColumn: "span 8" },
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <button className="btn btn-primary" onClick={() => requestPut()}>
            Modifier
          </button>{" "}
          <button
            className=" btn btn-danger"
            onClick={() => openCloseModalEdit()}
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
          {AssociationVDSelected && AssociationVDSelected.idAVD} ?
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
            data.length > 0
              ? data.map((associationVD) => ({
                  id: associationVD.idAVD, // Ensure the unique id field is correctly mapped
                  idAVD: associationVD.idAVD,
                  numE: associationVD.numE,
                  nom: `${associationVD.prenom || ""} ${
                    associationVD.nom || ""
                  }`.trim(),
                  idDriver: associationVD.idDriver,
                  idVcl: associationVD.idVcl,
                  regNumber: `${associationVD.type || ""} ${
                    associationVD.regNumber || ""
                  }`.trim(),
                  date_start: associationVD.date_start,
                  date_end: associationVD.date_end,
                  time: associationVD.time,
                  username: associationVD.username,
                }))
              : []
          }
          getRowId={(row) => row.id} // Specify the custom id prop
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
  fileName: "BD_Affectation_Vehicule_Chauffeur",
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

export default AssociationVD;
