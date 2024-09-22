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

function Decharge() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "decharge.php";
  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";

  const [dataProfile, setDataProfile] = useState([]);
  const [data, setData] = useState([]);
  const [dataSelectDriver, setDataSelectDriver] = useState([]);
  const [dataSelectTrajectory, setDataSelectTrajectory] = useState([]);
  const [dataSelectMission, setDataSelectMission] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [error, setError] = useState("");

  const [DechargeSelected, setDechargeSelected] = useState({
    idDecharge: "",
    idAVD: "",
    idAMD: "",
    idTraj: "",
    quantite: "",
    date_decharge: "",
    idMission: "",
    nom: "",
    regNumber: "",
    prenom: "",
    type: "",
  });

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setDechargeSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(DechargeSelected);
  };

  const clearSelected = () => {
    setDechargeSelected({
      idDecharge: "",
      idAVD: "",
      idAMD: "",
      idTraj: "",
      quantite: "",
      date_decharge: "",
      idMission: "",
      nom: "",
      regNumber: "",
      prenom: "",
      type: "",
    });
  };

  const openCloseModalInsert = () => {
    setModalAdd(!modalAdd);
    requestGetSelectTrajectory();
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
    requestGetSelectTrajectory();
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
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
  const requestGetSelectDriver = async (idtraj) => {
    await axios
      .get(urlSelect, { params: { dechargeAVD: "", idTraj: idtraj } })
      .then((response) => {
        setDataSelectDriver(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestGetSelectTrajectory = async () => {
    await axios
      .get(urlSelect, { params: { traj: "" } })
      .then((response) => {
        setDataSelectTrajectory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestGetSelectMission = async (idavd) => {
    await axios
      .get(urlSelect, {
        params: { dechargeAMD: "", idAVD: idavd },
      })
      .then((response) => {
        setDataSelectMission(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPost = async () => {
    var f = new FormData();
    f.append("idAVD", DechargeSelected.idAVD);
    f.append("idAMD", DechargeSelected.idAMD);
    f.append("quantite", DechargeSelected.quantite);
    f.append("date_decharge", DechargeSelected.date_decharge);
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

  const requestPut = async () => {
    // console.error(DechargeSelected);
    var f = new FormData();
    f.append("idDecharge", DechargeSelected.idDecharge);
    f.append("idAVD", DechargeSelected.idAVD);
    f.append("idAMD", DechargeSelected.idAMD);
    f.append("quantite", DechargeSelected.quantite);
    f.append("date_decharge", DechargeSelected.date_decharge);
    f.append("METHOD", "PUT");
    try {
      await axios.post(url, f, {
        params: { idDecharge: DechargeSelected.idDecharge },
      });

      setData((prevData) => {
        return prevData.map((Decharge) =>
          Decharge.idDecharge === DechargeSelected.idDecharge
            ? {
                ...Decharge,
                idAVD: DechargeSelected.idAVD,
                idAMD: DechargeSelected.idAMD,
                quantite: DechargeSelected.quantite,
                date_decharge: DechargeSelected.date_decharge,
              }
            : Decharge
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
      .post(url, f, { params: { idDecharge: DechargeSelected.idDecharge } })
      .then((response) => {
        setData(
          data.filter(
            (Decharge) => Decharge.idDecharge !== DechargeSelected.idDecharge
          )
        );
        openCloseModalDelete();
        clearSelected();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectDecharge = (Decharge, choix) => {
    setDechargeSelected(Decharge);
    choix === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };
  const columns = [
    {
      field: "idDecharge",
      headerName: "ID",
      flex: 0.5,
      cellClassName: "name-column--cell2",
    },

    { field: "nom", headerName: "Chauffeur", flex: 1 },
    {
      field: "regNumber",
      headerName: "Matricule",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "idMission",
      headerName: "Mission",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantite",
      headerName: "Quantité",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "date_decharge",
      headerName: "Date Décharge",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      renderCell: (params) => {
        return [
          (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`edit-${params.row.idDecharge}`}
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => selectDecharge(params.row, "Edit")}
              color="inherit"
            />
          ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <GridActionsCellItem
              key={`delete-${params.row.idDecharge}`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => selectDecharge(params.row, "Delete")}
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
        // console.log(ReactSession.get('idUser'));
        requestGetProfile(ReactSession.get("idUser"), "Déchargement");
        requestGet();
        // console.log(dataProfile[0]);
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
        <Header title="Déchargement" subtitle="Liste des Déchargements" />
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
            Nouveau Décharge
          </Button>
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
          Ajouter un Décharge{" "}
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
            <TextField
              fullWidth
              variant="filled"
              select
              name="idTraj"
              label={
                dataSelectTrajectory.length > 0
                  ? "Traject"
                  : "pas de Trajects disponibles"
              }
              onChange={(e) => {
                DechargeSelected.idTraj = e.target.value;
                requestGetSelectDriver(e.target.value);
              }}
              SelectProps={{
                native: true,
              }}
              sx={{ gridColumn: "span 8" }}
              // disabled= {dataSelectTrajectory.length > 0 ? false : true}
            >
              {dataSelectTrajectory.length > 0 ? (
                <option value="" selected hidden disabled>
                  Choisissez un Traject
                </option>
              ) : null}
              {dataSelectTrajectory.map((user) => (
                <option value={user.idTraj} key={user.idTraj}>
                  {user.label}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              select
              label={
                dataSelectDriver.length > 0
                  ? "Chauffeur"
                  : "pas de Chauffeurs disponibles"
              }
              onChange={(e) => {
                DechargeSelected.idAVD = e.target.value;
                requestGetSelectMission(e.target.value);
              }}
              name="idAVD"
              SelectProps={{
                native: true,
              }}
              sx={{ gridColumn: "span 4" }}
              // disabled= {dataSelectDriver.length > 0 ? false : true}
            >
              {dataSelectDriver.length > 0 ? (
                <option value="" selected hidden disabled>
                  Choisissez un Chauffeur
                </option>
              ) : null}
              {dataSelectDriver.map((user) => (
                <option value={user.idAVD} key={user.idAVD}>
                  {user.prenom +
                    " " +
                    user.nom +
                    " / " +
                    user.type +
                    " " +
                    user.regNumber}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              select
              label={
                dataSelectMission.length > 0
                  ? "Mission N°"
                  : "pas de Missions disponibles"
              }
              onChange={HandleChange}
              name="idAMD"
              SelectProps={{
                native: true,
              }}
              // disabled= {dataSelectMission.length > 0 ? false : true}
              sx={{ gridColumn: "span 4" }}
            >
              {dataSelectMission.length > 0 ? (
                <option value="" selected hidden disabled>
                  Choisissez une Mission
                </option>
              ) : null}
              {dataSelectMission.map((item) => (
                <option value={item.idAMD} key={item.idAMD}>
                  {item.idMission}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Quantité"
              // onBlur={handleBlur}
              onChange={HandleChange}
              name="quantite"
              // error={!!touched.firstName && !!errors.firstName}
              // helperText={touched.firstName && errors.firstName}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="date Décharge"
              // onBlur={handleBlur}
              onChange={HandleChange}
              name="date_decharge"
              // error={!!touched.firstName && !!errors.firstName}
              // helperText={touched.firstName && errors.firstName}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          {error && <p style={{ color: "red" }}>{error}</p>}
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
            onClick={() => {
              if (DechargeSelected.idAVD != "" && DechargeSelected.idAMD != "" && DechargeSelected.idTraj != "" && DechargeSelected.date_decharge != "") {
                requestPost();
              }
              else{
                setError("Veuillez remplir tous les champs !");
              }
            }}
          >
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

      <Modal isOpen={modalEdit}>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Modifier une Décharge{" "}
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
              name="idAVD"
              SelectProps={{
                native: true,
              }}
              defaultValue={
                DechargeSelected &&
                DechargeSelected.prenom + " " + DechargeSelected.nom
              }
              sx={{ gridColumn: "span 4" }}
            >
              {dataSelectDriver.map((user) => (
                <option value={user.idAVD} key={user.idAVD}>
                  {user.prenom + " " + user.nom}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              id="outlined-select-currency"
              select
              label="Mission"
              onChange={HandleChange}
              name="idAMD"
              SelectProps={{
                native: true,
              }}
              defaultValue={DechargeSelected && DechargeSelected.idMission}
              sx={{ gridColumn: "span 4" }}
            >
              {dataSelectMission.map((mission) => (
                <option value={mission.idAMD} key={mission.idAMD}>
                  {mission.idMission}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Quantité"
              onChange={HandleChange}
              name="quantite"
              value={DechargeSelected && DechargeSelected.quantite}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="Date Fin"
              onChange={HandleChange}
              name="date_decharge"
              value={DechargeSelected && DechargeSelected.date_decharge}
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
          Etes-vous sûr que vous voulez supprimer l'Décharge N°{" "}
          {DechargeSelected && DechargeSelected.idDecharge} ?
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
          rows={data.map((decharge) => {
            return {
              id: decharge.idDecharge,
              idDecharge: decharge.idDecharge,
              nom: decharge.prenom + " " + decharge.nom,
              idAVD: decharge.idAVD,
              idAMD: decharge.idAMD,
              idMission: decharge.idMission,
              regNumber: decharge.type + " " + decharge.regNumber,
              quantite: decharge.quantite,
              date_decharge: decharge.date_decharge,
            };
          })}
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
  fileName: "BD_Décharge",
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

export default Decharge;
