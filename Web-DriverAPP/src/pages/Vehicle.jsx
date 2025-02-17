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
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
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
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import config from "./global/config";
import { ReactSession } from "react-client-session";
import { green, red } from "@mui/material/colors";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import ButtonWrapper from "../components/FormsUI/Button";
import { Form, Formik } from "formik";
import * as Yup from "yup";

function Vehicle() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "vehicle.php";
  const urlProfile = config.apiUrl + "profile.php";
  const urlSelect = config.apiUrl + "selection.php";
  const urld = config.apiUrl + "dashboard.php";

  const [data, setData] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [dataProfile, setDataProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkVcl, setCheckVcl] = useState();
  const [dataDeposit, setDataDeposit] = useState([]);

  const [VehicleSelected, setVehicleSelected] = useState({
    idVcl: "",
    regNumber: "",
    type: "",
    deposit: "",
    active: 1,
    username: "",
  });
  const FORM_VALIDATION = Yup.object().shape({
    regNumber: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
    deposit: Yup.string().required("Required"),
    // deposit: Yup.number().required("Required"),
  });
  const HandleChange = (e) => {
    const { name, value, checked } = e.target;
    setVehicleSelected((prevState) => ({
      ...prevState,
      [name]: name === "active" ? (checked ? "1" : "0") : value,
    }));
    // console.log(VehicleSelected);
  };
  const requestGetDeposit = async () => {
    try {
      const response = await axios.get(urld, {
        params: { deposit: "" },
      });
      setDataDeposit(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const depot = [
    {
      value: "Agadir",
      label: "Agadir",
    },
    {
      value: "Berrechid",
      label: "Berrechid",
    },
  ];
  const clearSelected = () => {
    setVehicleSelected({
      idVcl: "",
      regNumber: "",
      type: "",
      deposit: "",
      active: 1,
      username: "",
    });
  };

  const openCloseModalInsert = () => {
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

  const requestGetCheck = async () => {
    await axios
      .get(urlSelect, {
        params: { idVcl: VehicleSelected.idVcl, checkVcl },
      })
      .then((response) => {
        response.data.checkVcl == 1 ? setCheckVcl(true) : setCheckVcl(false);
        console.warn(response.data.checkVcl);
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPost = async (VehicleSelected) => {
    var f = new FormData();
    f.append("regNumber", VehicleSelected.regNumber);
    f.append("type", VehicleSelected.type);
    f.append("deposit", VehicleSelected.deposit);
    f.append("active", 1);
    f.append("idUser", ReactSession.get("idUser"));
    f.append("METHOD", "POST");
    try {
      const response = await axios.post(url, f);
      setData(data.concat(response.data));
      openCloseModalInsert();
      clearSelected();
    } catch (error) {
      console.error(error);
    }
  };

  const requestPut = async () => {
    var f = new FormData();
    f.append("regNumber", VehicleSelected.regNumber);
    f.append("type", VehicleSelected.type);
    f.append("deposit", VehicleSelected.deposit);
    const ActiveValue =
      VehicleSelected.active === "active"
        ? "1"
        : VehicleSelected.active === "non active"
        ? "0"
        : VehicleSelected.active;
    f.append("active", ActiveValue);
    f.append("METHOD", "PUT");
    try {
      await axios.post(url, f, {
        params: { idVcl: VehicleSelected.idVcl },
      });

      setData((prevData) => {
        return prevData.map((vehicle) =>
          vehicle.idVcl === VehicleSelected.idVcl
            ? { ...vehicle, ...VehicleSelected }
            : vehicle
        );
      });
      requestGet();
      openCloseModalEdit();
      clearSelected();
    } catch (error) {
      console.error(error);
    }
  };

  const requestDelete = async () => {
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios
      .post(url, f, { params: { idVcl: VehicleSelected.idVcl } })
      .then((response) => {
        setData(
          data.filter((vehicle) => vehicle.idVcl !== VehicleSelected.idVcl)
        );
        openCloseModalDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectVehicle = (vehicle, choix) => {
    setVehicleSelected(vehicle);
    choix === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };

  const columns = [
    {
      field: "idVcl",
      headerName: "ID",
      flex: 0.1,
      cellClassName: "name-column--cell",
    },
    {
      field: "regNumber",
      headerName: "Matricule",
      flex: 0.3,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "deposit",
      headerName: "Dépôt",
      headerAlign: "left",
      align: "left",
      flex: 0.2,
    },
    {
      field: "active",
      headerName: "Statut",
      headerAlign: "left",
      align: "left",
      flex: 0.25,
      cellClassName: "name-column--cell",
    },
    ...(ReactSession.get("role") === "admin"
      ? [
          {
            field: "username",
            headerName: "Nom d'utilisateur",
            flex: 0.25,
            cellClassName: "name-column--cell2",
          },
        ]
      : []),
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",

      renderCell: (params) => {
        return [
          (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`edit-${params.row.idVcl}`}
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => {
                requestGetCheck();
                selectVehicle(params.row, "Edit");
              }}
              color="inherit"
            />
          ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`delete-${params.row.idVcl}`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => selectVehicle(params.row, "Delete")}
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
        // console.log(ReactSession.get('idUser'));
        requestGetProfile(ReactSession.get("idUser"), "Vehicule");

        requestGet();
        requestGetDeposit();

        // console.log(dataProfile[0]);
        await new Promise((resolve) => setTimeout(resolve, 200));
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
        <Header title="Véhicule" subtitle="Liste des Véhicules" />
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
            Nouvelle Véhicule
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
          Ajouter une Véhicule{" "}
        </ModalHeader>
        <Formik
          initialValues={{
            ...VehicleSelected,
          }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(VehicleSelected) => {
            requestPost(VehicleSelected);
          }}
        >
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
                gridTemplateColumns="repeat(8, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextfieldWrapper
                  fullWidth
                  type="text"
                  label="Matricule"
                  name="regNumber"
                  // error={!!touched.firstName && !!errors.firstName}
                  // helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextfieldWrapper
                  fullWidth
                  type="text"
                  label="Type"
                  // onBlur={handleBlur}

                  name="type"
                  // error={!!touched.firstName && !!errors.firstName}
                  // helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextfieldWrapper
                  fullWidth
                  select
                  label="Dépôt"
                  // onBlur={handleBlur}

                  name="deposit"
                  // error={!!touched.firstName && !!errors.firstName}
                  // helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 8" }}
                  // onChange={HandleChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  {" "}
                  {dataDeposit.length > 0 ? (
                    <option value="" selected hidden disabled>
                      Choisissez Dépôts
                    </option>
                  ) : null}
                  {dataDeposit.map((option) => (
                    <option key={option.deposit} value={option.deposit}>
                      {option.deposit}
                    </option>
                  ))}
                </TextfieldWrapper>
              </Box>
            </ModalBody>
            <ModalFooter
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              <ButtonWrapper className="btn btn-primary">Ajouter</ButtonWrapper>{" "}
              <button
                className=" btn btn-danger"
                onClick={() => openCloseModalInsert()}
              >
                Fermer
              </button>
            </ModalFooter>
          </Form>
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
          Modifier une Véhicule{" "}
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
              type="text"
              label="Matricule"
              onChange={HandleChange}
              name="regNumber"
              value={VehicleSelected && VehicleSelected.regNumber}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Type"
              onChange={HandleChange}
              name="type"
              value={VehicleSelected && VehicleSelected.type}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              id="outlined-select-currency"
              select
              label="Dépôt"
              onChange={HandleChange}
              name="deposit"
              SelectProps={{
                native: true,
              }}
              defaultValue={VehicleSelected && VehicleSelected.deposit}
              sx={{ gridColumn: "span 4" }}
            >
              <option
                selected
                disabled
                value={VehicleSelected.deposit}
                key={VehicleSelected.deposit}
              >
                {VehicleSelected.deposit.replace(/undefined/g, "")}
              </option>{" "}
              {dataDeposit.map((user) => (
                <option value={user.deposit} key={user.deposit}>
                  {user.deposit}
                </option>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  checked={
                    (VehicleSelected &&
                      parseInt(VehicleSelected.active) === 1) ||
                    VehicleSelected.active === "active"
                  }
                  onChange={HandleChange}
                  name="active"
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Active"
              sx={{ gridColumn: "span 4" }}
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
          <button
            className="btn btn-primary"
            onClick={async () => {
              await axios
                .get(urlSelect, {
                  params: { idVcl: VehicleSelected.idVcl, checkVcl },
                })
                .then((response) => {
                  response.data.checkVcl == 1 &&
                  ReactSession.get("role") != "admin"
                    ? alert(
                        "Ce véhicule a été attribué à un chauffeur !\nVeuillez le changer dans la page 'Affectation Véhicule Chauffeur'"
                      )
                    : requestPut();
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            Modifier
          </button>{" "}
          <button
            className=" btn btn-danger"
            onClick={() => {
              openCloseModalEdit();
            }}
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
          Etes-vous sûr que vous voulez supprimer{" "}
          {VehicleSelected &&
            VehicleSelected.type + " " + VehicleSelected.regNumber}{" "}
          ?
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
            onClick={() => {
              if (
                window.confirm(
                  "Cet véhicule existe dans d'autres tableaux, êtes-vous sûr de vouloir le supprimer ?"
                )
              ) {
                requestDelete();
              }
            }}
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
          rows={data.map((vehicle) => ({
            ...vehicle,
            active: vehicle.active === 1 ? "active" : "non active",
          }))}
          getRowId={(row) => row.idVcl}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>
    </Box>
  );
}

const csvOptions = {
  fileName: "BD_Vehicle",
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
      <GridToolbarDensitySelector />
      <CustomExportButtons />
      <Box sx={{ marginLeft: "auto", pl: 0, pr: 0, pb: 0, pt: 0 }}>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
}

export default Vehicle;
