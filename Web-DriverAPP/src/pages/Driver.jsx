import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  useMediaQuery,
  FormLabel,
} from "@mui/material";
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
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import * as React from "react";
import axios from "axios";
import Header from "../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { green, red } from "@mui/material/colors";
import config from "./global/config";
import { ReactSession } from "react-client-session";
import { Form, Formik } from "formik";
import ButtonWrapper from "../components/FormsUI/Button";
import RadioGroupWrapper from "../components/FormsUI/Radio";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SnackbarProvider, enqueueSnackbar, useSnackbar } from "notistack";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import Resizer from "react-image-file-resizer";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import BadgeIcon from "@mui/icons-material/Badge";

function Driver() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "Driver.php";
  const url1 = config.apiUrl + "upload.php";

  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";
  const [dataProfile, setDataProfile] = useState([]);

  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [dataFile, setDataFile] = useState([]);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [modalUploadEdit, setModalUploadEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [isZoomed, setIsZoomed] = useState(false);

  const [DriverSelected, setDriverSelected] = useState({
    idDriver: "",
    nom: "",
    prenom: "",
    address: "",
    dispo: "",
    tell: "",
    active: 1,
    ste: "",
    date_embauche: "",
    sf: "",
    numE: "",
    numCin: "",
    date_obtention_permis: "",
    date_fin_permis: "",
    date_fin_cin: "",
    valide_cin: "",
    date_naissance: "",
    lieu_naissance: "",
    date_derniere_visite_medicale: "",
    num_carte_driver_pro: "",
    date_fin_driver_pro: "",
    Num_CNSS: "",
    type_contrat: "",
    date_fin_FCD: "",
    numRib: "",
    code_banque: "",
    agence_bancaire: "",
    remarque_sortie: "",
    cin: null,
    rib: null,
    image: null,
    permis: null,
    document: null,
    username: "",
    num_permis: "",
  });

  const handleClickOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    if (!isZoomed) {
      setOpen(false);
      setSelectedImage(null);
    }
  };

  const handleZoomChange = (zoomed) => {
    setIsZoomed(zoomed);
  };

  const HandleChange = (e) => {
    const { name, value, checked } = e.target;
    setDriverSelected((prevState) => ({
      ...prevState,
      [name]: name === "active" ? (checked ? "1" : "0") : value,
    }));
    //console.log(DriverSelected);
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = selectedImage;
    link.download = "image.jpg"; // Change the filename if needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resizeFileToBlob = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1024,
        1024,
        "JPEG",
        80, // Adjust quality to reduce size
        0,
        (uri) => {
          // Convert base64 to Blob
          fetch(uri)
            .then((res) => res.blob())
            .then((blob) => resolve(blob));
        },
        "base64"
      );
    });

  // const handleFileChange = async (event) => {
  //   const { name, files } = event.target;
  //   if (files.length > 0) {
  //     const resizedBlob = await resizeFileToBlob(files[0]);
  //     setDriverSelected((prevState) => ({
  //       ...prevState,
  //       [name]: resizedBlob,
  //     }));
  //   }
  // };
  const handleFileChange = async (event) => {
    const { name, files } = event.target;
    if (files.length > 0) {
      const resizedBlob = await resizeFileToBlob(files[0]);
      setDriverSelected((prevState) => ({
        ...prevState,
        [name]: resizedBlob,
      }));
    }
  };

  const columnsUpload = [
    {
      field: "idFile",
      headerName: "ID",
      flex: 0.2,
      cellClassName: "name-column--cell2",
    },
    {
      field: "idDriver",
      headerName: "ID",
      flex: 0.2,
      cellClassName: "name-column--cell2",
    },
    {
      field: "permis",
      headerName: "Permis",
      cellClassName: "name-column--cell2",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value) {
          const url = `data:image/png;base64,${params.value}`;
          return (
            <Avatar
              src={url}
              alt="Image"
              // sx={{ width: 40, height: 40 }}
              onClick={() => handleClickOpen(url)}
              style={{ cursor: "pointer" }}
            />
          );
        } else {
          <Avatar>
            <BadgeIcon />
          </Avatar>;
        }
      },
    },
    {
      field: "cin",
      headerName: "CIN",
      cellClassName: "name-column--cell2",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value) {
          const url = `data:image/png;base64,${params.value}`;
          return (
            <Avatar
              src={url}
              alt="Image"
              // sx={{ width: 40, height: 40 }}
              onClick={() => handleClickOpen(url)}
              style={{ cursor: "pointer" }}
            />
          );
        } else {
          return (
            <Avatar>
              <BadgeIcon />
            </Avatar>
          );
        }
      },
    },
    {
      field: "rib",
      headerName: "NÂ° RIB",
      cellClassName: "name-column--cell2",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value) {
          const url = `data:image/png;base64,${params.value}`;
          return (
            <Avatar
              src={url}
              alt="rib"
              // sx={{ width: 40, height: 40 }}
              onClick={() => handleClickOpen(url)}
              style={{ cursor: "pointer" }}
            />
          );
        } else {
          return (
            <Avatar>
              <AccountBalanceIcon />
            </Avatar>
          );
        }
      },
    },
    {
      field: "document",
      headerName: "Document",
      cellClassName: "name-column--cell2",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value) {
          const url = `data:image/png;base64,${params.value}`;
          return (
            <Avatar
              src={url}
              alt="document"
              // sx={{ width: 40, height: 40 }}
              onClick={() => handleClickOpen(url)}
              style={{ cursor: "pointer" }}
            />
          );
        } else {
          return (
            <Avatar>
              {" "}
              <DocumentScannerIcon />{" "}
            </Avatar>
          );
        }
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      renderCell: (params) => [
        (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
        ReactSession.get("role") == "admin" ? (
          <>
            <GridActionsCellItem
              key={`delete-${params.row.idFile}`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => selectDriver(params.row, "Delete")}
              color="inherit"
            />
            <GridActionsCellItem
              key={`edit-${params.row.idFile}`}
              icon={<EditIcon />}
              label="Edit"
              onClick={() => selectDriver(params.row, "Update")}
              color="inherit"
            />
          </>
        ) : null,
      ],
    },
  ];
  const clearSelected = () => {
    setDriverSelected({
      idDriver: "",
      nom: "",
      prenom: "",
      address: "",
      dispo: "",
      tell: "",
      active: 1,
      ste: "",
      date_embauche: "",
      sf: "",
      numE: "",
      numCin: "",
      date_obtention_permis: "",
      date_fin_permis: "",
      date_fin_cin: "",
      valide_cin: "",
      date_naissance: "",
      lieu_naissance: "",
      date_derniere_visite_medicale: "",
      num_carte_driver_pro: "",
      date_fin_driver_pro: "",
      Num_CNSS: "",
      type_contrat: "",
      date_fin_FCD: "",
      numRib: "",
      code_banque: "",
      agence_bancaire: "",
      remarque_sortie: "",
      cin: null,
      rib: null,
      image: null,
      permis: null,
      document: null,
      username: "",
      num_permis: "",
    });
  };

  const toggleModal = (modal, setModal) => {
    setModal(!modal);
  };

  const openCloseModalInsert = () => {
    clearSelected();
    toggleModal(modalAdd, setModalAdd);
    setError(false);
  };

  const openCloseModalEdit = () => {
    toggleModal(modalEdit, setModalEdit);
  };

  const openCloseModalDelete = () => {
    toggleModal(modalDelete, setModalDelete);
  };

  const openCloseModalShow = () => {
    requestGetFile();

    toggleModal(modalShow, setModalShow);
  };

  const openCloseModalUpload = () => {
    toggleModal(modalUpload, setModalUpload);
  };

  const openCloseModalUploadEdit = () => {
    requestGetFile(DriverSelected.idDriver);

    toggleModal(modalUploadEdit, setModalUploadEdit);
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
  const requestGetFile = async (id) => {
    try {
      const response = await axios.get(url1, {
        params: {
          idDriver: id,
        },
      });
      setDataFile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const requestPostUpload = async () => {
    const formData = new FormData();
    formData.append("idDriver", DriverSelected.idDriver);
    formData.append("idUser", ReactSession.get("idUser"));
    formData.append("METHOD", "POST");

    if (DriverSelected.permis) {
      formData.append("permis", DriverSelected.permis);
    }
    if (DriverSelected.cin) {
      formData.append("cin", DriverSelected.cin);
    }
    if (DriverSelected.rib) {
      formData.append("rib", DriverSelected.rib);
    }
    if (DriverSelected.document) {
      formData.append("document", DriverSelected.document);
    }

    try {
      const response = await axios.post(url1, formData);
      setDataFile((prevData) => [...prevData, response.data]);
      clearSelected();
      requestGetFile();
      openCloseModalUpload();
    } catch (error) {
      console.error(error);
    }
  };

  const requestPutUpload = async () => {
    const formData = new FormData();
    formData.append("METHOD", "PUT");

    // Append only the fields that are provided, retaining old values for unchanged fields
    if (DriverSelected.permis) {
      formData.append("permis", DriverSelected.permis);
    } else {
      formData.append("permis", DriverSelected.currentPermis);
    }

    if (DriverSelected.cin) {
      formData.append("cin", DriverSelected.cin);
    } else {
      formData.append("cin", DriverSelected.currentCin);
    }

    if (DriverSelected.rib) {
      formData.append("rib", DriverSelected.rib);
    } else {
      formData.append("rib", DriverSelected.currentRib);
    }

    if (DriverSelected.document) {
      formData.append("document", DriverSelected.document);
    } else {
      formData.append("document", DriverSelected.currentDocument);
    }

    try {
      const response = await axios.post(url1, formData, {
        params: { idDriver: DriverSelected.idDriver },
      });

      // Update the state with the new data or handle the response accordingly
      setDataFile((prevData) => {
        const updatedData = prevData.map((file) => {
          if (file.idDriver === DriverSelected.idDriver) {
            return {
              ...file,
              permis: DriverSelected.permis
                ? DriverSelected.permis
                : file.permis,
              cin: DriverSelected.cin ? DriverSelected.cin : file.cin,
              rib: DriverSelected.rib ? DriverSelected.rib : file.rib,
              document: DriverSelected.document
                ? DriverSelected.document
                : file.document,
            };
          }
          return file;
        });
        return updatedData;
      });

      clearSelected();
      requestGetFile();
      openCloseModalUploadEdit();
    } catch (error) {
      console.error(error);
    }
  };

  const requestPost = async () => {
    if (
      !DriverSelected.nom ||
      !DriverSelected.prenom ||
      !DriverSelected.address ||
      !DriverSelected.tell ||
      // !DriverSelected.dispo ||
      // !DriverSelected.ste ||
      // !DriverSelected.date_embauche ||
      // !DriverSelected.sf ||
      // !DriverSelected.numE ||
      !DriverSelected.numCin ||
      !DriverSelected.type_contrat ||
      // !DriverSelected.date_obtention_permis ||
      // !DriverSelected.date_fin_permis ||
      // !DriverSelected.date_fin_cin ||
      // !DriverSelected.valide_cin ||
      // !DriverSelected.date_naissance ||
      // !DriverSelected.lieu_naissance ||
      // !DriverSelected.date_derniere_visite_medicale ||
      // !DriverSelected.num_carte_driver_pro ||
      // !DriverSelected.date_fin_driver_pro ||
      // !DriverSelected.date_fin_FCD ||
      // !DriverSelected.rib ||
      // !DriverSelected.code_banque ||
      // !DriverSelected.agence_bancaire ||
      // !DriverSelected.remarque_sortie ||
      !DriverSelected.Num_CNSS
    ) {
      setError(true);
      return;
    }

    const f = new FormData();
    f.append("nom", DriverSelected.nom);
    f.append("prenom", DriverSelected.prenom);
    f.append("address", DriverSelected.address);
    f.append("tell", DriverSelected.tell);
    f.append("dispo", "disponible");
    f.append("active", 1);
    f.append("ste", DriverSelected.ste ? DriverSelected.ste : "--");
    f.append(
      "num_permis",
      DriverSelected.num_permis ? DriverSelected.num_permis : "--"
    );
    f.append(
      "date_embauche",
      DriverSelected.date_embauche ? DriverSelected.date_embauche : "0000-00-00"
    );
    f.append("sf", DriverSelected.sf ? DriverSelected.sf : "--");
    f.append("numE", DriverSelected.numE ? DriverSelected.numE : "--");
    f.append("numCin", DriverSelected.numCin);
    f.append(
      "date_obtention_permis",
      DriverSelected.date_obtention_permis
        ? DriverSelected.date_obtention_permis
        : "0000-00-00"
    );
    f.append(
      "date_fin_permis",
      DriverSelected.date_fin_permis
        ? DriverSelected.date_fin_permis
        : "0000-00-00"
    );
    f.append(
      "date_fin_cin",
      DriverSelected.date_fin_cin ? DriverSelected.date_fin_cin : "0000-00-00"
    );
    f.append(
      "valide_cin",
      DriverSelected.valide_cin ? DriverSelected.valide_cin : "--"
    );
    f.append(
      "date_naissance",
      DriverSelected.date_naissance
        ? DriverSelected.date_naissance
        : "0000-00-00"
    );
    f.append(
      "lieu_naissance",
      DriverSelected.lieu_naissance ? DriverSelected.lieu_naissance : "--"
    );
    f.append(
      "date_derniere_visite_medicale",
      DriverSelected.date_derniere_visite_medicale
        ? DriverSelected.date_derniere_visite_medicale
        : "0000-00-00"
    );
    f.append(
      "num_carte_driver_pro",
      DriverSelected.num_carte_driver_pro
        ? DriverSelected.num_carte_driver_pro
        : "--"
    );
    f.append(
      "date_fin_driver_pro",
      DriverSelected.date_fin_driver_pro
        ? DriverSelected.date_fin_driver_pro
        : "0000-00-00"
    );
    f.append("Num_CNSS", DriverSelected.Num_CNSS);
    f.append("type_contrat", DriverSelected.type_contrat);
    f.append(
      "date_fin_FCD",
      DriverSelected.date_fin_FCD ? DriverSelected.date_fin_FCD : "0000-00-00"
    );
    f.append("numRib", DriverSelected.numRib ? DriverSelected.numRib : "--");
    f.append(
      "code_banque",
      DriverSelected.code_banque ? DriverSelected.code_banque : "--"
    );
    f.append(
      "agence_bancaire",
      DriverSelected.agence_bancaire ? DriverSelected.agence_bancaire : "--"
    );
    f.append(
      "remarque_sortie",
      DriverSelected.remarque_sortie ? DriverSelected.remarque_sortie : "--"
    );

    if (DriverSelected.image) {
      f.append("image", DriverSelected.image);
    }
    f.append("idUser", ReactSession.get("idUser"));

    f.append("METHOD", "POST");

    try {
      const response = await axios.post(url, f);
      setData(data.concat(response.data));
      clearSelected();
      requestGet();

      openCloseModalInsert();
    } catch (error) {
      //console.log(error);
    }
  };

  const requestPut = async () => {
    const f = new FormData();
    f.append("idDriver", DriverSelected.idDriver);
    f.append("nom", DriverSelected.nom);
    f.append("prenom", DriverSelected.prenom);
    f.append("address", DriverSelected.address);
    f.append("tell", DriverSelected.tell);
    f.append("dispo", DriverSelected.dispo);
    f.append("active", DriverSelected.active);
    f.append("ste", DriverSelected.ste);
    f.append("date_embauche", DriverSelected.date_embauche);
    f.append("sf", DriverSelected.sf);
    f.append("numE", DriverSelected.numE);
    f.append("numCin", DriverSelected.numCin);
    f.append("date_obtention_permis", DriverSelected.date_obtention_permis);
    f.append("date_fin_permis", DriverSelected.date_fin_permis);
    f.append("date_fin_cin", DriverSelected.date_fin_cin);
    f.append("valide_cin", DriverSelected.valide_cin);
    f.append("date_naissance", DriverSelected.date_naissance);
    f.append("lieu_naissance", DriverSelected.lieu_naissance);
    f.append(
      "date_derniere_visite_medicale",
      DriverSelected.date_derniere_visite_medicale
    );
    f.append("num_carte_driver_pro", DriverSelected.num_carte_driver_pro);
    f.append("date_fin_driver_pro", DriverSelected.date_fin_driver_pro);
    f.append("Num_CNSS", DriverSelected.Num_CNSS);
    f.append("type_contrat", DriverSelected.type_contrat);
    f.append("date_fin_FCD", DriverSelected.date_fin_FCD);
    f.append("numRib", DriverSelected.numRib);
    f.append("code_banque", DriverSelected.code_banque);
    f.append("agence_bancaire", DriverSelected.agence_bancaire);
    f.append("remarque_sortie", DriverSelected.remarque_sortie);

    const ActiveValue =
      DriverSelected.active === "active"
        ? "1"
        : DriverSelected.active === "non active"
        ? "0"
        : DriverSelected.active;
    f.append("active", ActiveValue);
    if (DriverSelected.image) {
      f.append("image", DriverSelected.image);
    } else {
      f.append("image", DriverSelected.currentimage);
    }

    f.append("METHOD", "PUT");

    try {
      await axios.post(url, f, {
        params: { idDriver: DriverSelected.idDriver },
      });

      setData((prevData) => {
        return prevData.map((driver) =>
          driver.idDriver === DriverSelected.idDriver
            ? {
                ...driver,
                image: DriverSelected.image,
                // image: DriverSelected.image ? DriverSelected.image : file.image,
                nom: DriverSelected.nom,
                prenom: DriverSelected.prenom,
                address: DriverSelected.address,
                tell: DriverSelected.tell,
                dispo: DriverSelected.dispo,
                active: DriverSelected.active,
                ste: DriverSelected.ste,
                date_embauche: DriverSelected.date_embauche,
                sf: DriverSelected.sf,
                numE: DriverSelected.numE,
                numCin: DriverSelected.numCin,
                date_obtention_permis: DriverSelected.date_obtention_permis,
                date_fin_permis: DriverSelected.date_fin_permis,
                date_fin_cin: DriverSelected.date_fin_cin,
                valide_cin: DriverSelected.valide_cin,
                date_naissance: DriverSelected.date_naissance,
                lieu_naissance: DriverSelected.lieu_naissance,
                date_derniere_visite_medicale:
                  DriverSelected.date_derniere_visite_medicale,
                num_carte_driver_pro: DriverSelected.num_carte_driver_pro,
                date_fin_driver_pro: DriverSelected.date_fin_driver_pro,
                Num_CNSS: DriverSelected.Num_CNSS,
                type_contrat: DriverSelected.type_contrat,
                date_fin_FCD: DriverSelected.date_fin_FCD,
                numRib: DriverSelected.numRib,
                code_banque: DriverSelected.code_banque,
                agence_bancaire: DriverSelected.agence_bancaire,
                remarque_sortie: DriverSelected.remarque_sortie,
              }
            : driver
        );
      });

      requestGet();
      openCloseModalEdit();
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
          idDriver: DriverSelected.idDriver,
        },
      });
      setData(
        data.filter((Driver) => Driver.idDriver !== DriverSelected.idDriver)
      );
      openCloseModalDelete();
    } catch (error) {
      console.error(error);
    }
  };

  const selectDriver = (Driver, choix) => {
    setDriverSelected({
      ...Driver,
      currentimage: Driver.image,
      currentPermis: Driver.permis,
      currentCin: Driver.cin,
      currentRib: Driver.rib,
      currentDocument: Driver.document,
    });

    if (choix === "Edit") {
      openCloseModalEdit();
    } else if (choix === "Delete") {
      openCloseModalDelete();
    } else if (choix === "Update") {
      openCloseModalUploadEdit();
    } else if (choix === "Upload") {
      openCloseModalUpload();
    } else if (choix === "Show") {
      openCloseModalShow();
    }
  };

  const [open, setOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const columns = [
    { field: "idDriver", headerName: "ID", width: 80 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        if (params.value) {
          const url = `data:image/png;base64,${params.value}`;
          return (
            <Avatar
              src={url}
              alt="Image"
              onClick={() => handleClickOpen(url)}
              style={{ cursor: "pointer" }}
            />
          );
        } else {
          return <Avatar>{params.row.nom.charAt(0)}</Avatar>;
        }
      },
    },
    { field: "prenom", headerName: "Prenom", width: 120 },
    { field: "nom", headerName: "Nom", width: 120 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "tell", headerName: "Tell", width: 100 },
    { field: "numE", headerName: "Num E", width: 100 },
    { field: "numCin", headerName: "N° CIN", width: 100 },
    { field: "Num_CNSS", headerName: "Num CNSS", width: 120 },
    { field: "type_contrat", headerName: "Type de Contrat", width: 120 },
    { field: "num_permis", headerName: "Numero de Permis", width: 120 },
    {
      field: "date_naissance",
      headerName: "Date Naissance",
      width: 150,
      renderCell: (params) => {
        return params.value === "0000-00-00"
          ? "_"
          : selectDriver.date_naissance;
      },
    },
    { field: "lieu_naissance", headerName: "Lieu Naissance", width: 150 },
    { field: "ste", headerName: "Ste", width: 120 },

    {
      field: "date_embauche",
      headerName: "Date Embauche",
      width: 150,
      renderCell: (params) => {
        return params.value === "0000-00-00" ? "_" : selectDriver.date_embauche;
      },
    },

    { field: "sf", headerName: "SF", width: 100 },

    {
      field: "date_obtention_permis",
      headerName: "Date Obtention Permis",
      width: 150,
      renderCell: (params) => {
        return params.value === "0000-00-00"
          ? "_"
          : selectDriver.date_obtention_permis;
      },
    },

    {
      field: "date_fin_permis",
      headerName: "Date Fin Permis",
      width: 150,
      renderCell: (params) => {
        return params.value === "0000-00-00"
          ? "_"
          : selectDriver.date_fin_permis;
      },
    },
    {
      field: "date_fin_cin",
      headerName: "Date Fin CIN",
      width: 150,
      renderCell: (params) => {
        return params.value === "0000-00-00" ? "_" : selectDriver.date_fin_cin;
      },
    },
    { field: "valide_cin", headerName: "Validité de CIN", width: 150 },

    {
      field: "date_derniere_visite_medicale",
      headerName: "Date Derniere Visite Medicale",
      width: 150,
      renderCell: (params) => {
        return params.value === "0000-00-00"
          ? "_"
          : selectDriver.date_derniere_visite_medicale;
      },
    },
    {
      field: "num_carte_driver_pro",
      headerName: "Num Carte Driver Pro",
      width: 150,
    },
    {
      field: "date_fin_driver_pro",
      headerName: "Date Fin Driver Pro",
      width: 150,
      renderCell: (params) => {
        return params.value === "0000-00-00"
          ? "_"
          : selectDriver.date_fin_driver_pro;
      },
    },

    {
      field: "date_fin_FCD",
      headerName: "Date Fin FCD",
      width: 150,
      renderCell: (params) => {
        return params.value === "0000-00-00" ? "_" : selectDriver.date_fin_FCD;
      },
    },
    { field: "numRib", headerName: "N° RIB", width: 180 },
    { field: "code_banque", headerName: "Code Banque", width: 150 },
    { field: "agence_bancaire", headerName: "Agence Bancaire", width: 150 },
    { field: "remarque_sortie", headerName: "Remarque de Sortie", width: 150 },
    {
      field: "dispo",
      headerName: "Dispo",
      width: 120,
      cellClassName: "name-column--cell",
    },
    {
      field: "active",
      headerName: "Active",
      width: 120,
      cellClassName: "name-column--cell2",
    },
    ...(ReactSession.get("role") === "admin"
      ? [
          {
            field: "username",
            headerName: "Nom d'utilisateur",

            cellClassName: "name-column--cell2",
            width: 120,
          },
        ]
      : []),
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => [
        (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
        ReactSession.get("role") == "admin" ? (
          <GridActionsCellItem
            key={`edit-${params.row.idDriver}`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => selectDriver(params.row, "Edit")}
            color="inherit"
          />
        ) : null,
        (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
        ReactSession.get("role") == "admin" ? (
          <GridActionsCellItem
            key={`delete-${params.row.idDriver}`}
            icon={<DeleteIcon style={{ color: "secondary" }} />}
            label="Delete"
            onClick={() => selectDriver(params.row, "Delete")}
            color="inherit"
          />
        ) : null,
        <GridActionsCellItem
          key={`upload-${params.row.idDriver}`}
          icon={<UploadFileRoundedIcon style={{ color: "action" }} />}
          label="Upload"
          onClick={() => selectDriver(params.row, "Upload")}
          color="inherit"
        />,
        <GridActionsCellItem
          key={`upload-${params.row.idDriver}`}
          icon={<VisibilityRoundedIcon style={{ color: "green" }} />}
          label="Upload"
          onClick={() => {
            selectDriver(params.row, "Show");
            requestGetFile(params.row.idDriver);
          }}
          color="inherit"
        />,
      ],
    },
  ];

  const [loading, setLoading] = useState(true);

  // Now you can use defaultDriverId as defaultValue

  useEffect(() => {
    const fetchData = async () => {
      try {
        await requestGetProfile(ReactSession.get("idUser"), "Chauffeur");
        await requestGet();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <Box m="25px">
      {loading ? (
        <Header title="Loading" subtitle="" />
      ) : (
        <Header title="Driver" subtitle="Liste des Drivers" />
      )}
      {loading ? null : (dataProfile.length > 0 &&
          dataProfile[0].op_add == 1) ||
        ReactSession.get("role") == "admin" ? (
        <Box display="flex" justifyContent="end" mt="20px">
          <Button
            prenom="submit"
            color="secondary"
            variant="contained"
            onClick={() => openCloseModalInsert()}
          >
            Nouvelle Driver
          </Button>
        </Box>
      ) : null}
      <Modal isOpen={modalAdd} fullscreen>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Ajouter Driver
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
              label="Nom"
              onChange={HandleChange}
              name="nom"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="prenom"
              type="text"
              label="Prenom"
              onChange={HandleChange}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Address"
              onChange={HandleChange}
              name="address"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Tell"
              onChange={HandleChange}
              name="tell"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Numéro Employé"
              onChange={HandleChange}
              name="numE"
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Numéro de CIN"
              onChange={HandleChange}
              name="numCin"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Numéro CNSS"
              type="text"
              onChange={HandleChange}
              name="Num_CNSS"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Type de Contrat"
              type="text"
              onChange={HandleChange}
              name="type_contrat"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Situation familiale"
              onChange={HandleChange}
              name="sf"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="STE"
              type="text"
              onChange={HandleChange}
              name="ste"
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              variant="filled"
              label="Date d'embauche"
              type="date"
              onChange={HandleChange}
              name="date_embauche"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Date de Naissance"
              type="date"
              onChange={HandleChange}
              name="date_naissance"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Lieu de naissance"
              onChange={HandleChange}
              name="lieu_naissance"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Validité de CIN"
              onChange={HandleChange}
              name="valide_cin"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Date de fin CIN"
              type="date"
              onChange={HandleChange}
              name="date_fin_cin"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Numero De Permis"
              type="text"
              onChange={HandleChange}
              name="num_permis"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="Date d'obtention du permis"
              onChange={HandleChange}
              name="date_obtention_permis"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="Date de fin du permis"
              onChange={HandleChange}
              name="date_fin_permis"
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="Date dernière visite médicale"
              onChange={HandleChange}
              name="date_derniere_visite_medicale"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="Date de fin FCD"
              onChange={HandleChange}
              name="date_fin_FCD"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Numéro carte driver pro"
              onChange={HandleChange}
              name="num_carte_driver_pro"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="Date de fin driver pro"
              onChange={HandleChange}
              name="date_fin_driver_pro"
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="N° RIB"
              onChange={HandleChange}
              name="numRib"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Code banque"
              onChange={HandleChange}
              name="code_banque"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              type="text"
              variant="filled"
              label="Agence bancaire"
              onChange={HandleChange}
              name="agence_bancaire"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Remarque de Sortie"
              onChange={HandleChange}
              name="remarque_sortie"
              sx={{ gridColumn: "span 4" }}
            />
            <RadioGroup
              row
              aria-labelledby="demo-form-control-label-placement"
              onChange={HandleChange}
              name="dispo"
              sx={{ gridColumn: "span 8" }}
            >
              <FormControlLabel
                value="disponible"
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
                label="disponible"
              />
              <FormControlLabel
                value="non disponible"
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
                label="non disponible"
                labelPlacement="start"
              />
            </RadioGroup>
            <input
              type="file"
              onChange={handleFileChange}
              name="image"
              style={{ gridColumn: "span 4" }}
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
            <Snackbar
              open={error}
              autoHideDuration={6000}
              onClose={() => setError(false)}
            >
              <Alert onClose={() => setError(false)} severity="error">
                Missing required fields
              </Alert>
            </Snackbar>
          )}
          <button className="btn btn-primary" onClick={() => requestPost()}>
            Ajouter
          </button>{" "}
          <button
            className="btn btn-danger"
            onClick={() => openCloseModalInsert()}
          >
            Fermer
          </button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalEdit} fullscreen>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Modifier un Driver
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
              name="nom"
              type="text"
              label="Nom"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.nom}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="prenom"
              type="text"
              label="Prenom"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.prenom}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="address"
              type="text"
              label="Address"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.address}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="tell"
              type="text"
              label="Tell"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.tell}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="numE"
              type="text"
              label="Num E"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.numE}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="numCin"
              type="text"
              label="N° CIN"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.numCin}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="Num_CNSS"
              type="text"
              label="Num CNSS"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.Num_CNSS}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="type_contrat"
              type="text"
              label="Type de Contrat"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.type_contrat}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="lieu_naissance"
              type="text"
              label="Lieu Naissance"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.lieu_naissance}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="date_naissance"
              type="date"
              label="Date de Naissance"
              InputLabelProps={{ shrink: true }}
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.date_naissance}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="valide_cin"
              type="text"
              label="Validité de CIN"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.valide_cin}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="date_fin_cin"
              type="date"
              label="Date Fin CIN"
              InputLabelProps={{ shrink: true }}
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.date_fin_cin}
              sx={{ gridColumn: "span 2" }}
            />
            {/* <TextField
              fullWidth
              variant="filled"
              name="matricule"
              type="text"
              label="Matricule"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.matricule}
              sx={{ gridColumn: "span 4" }}
            /> */}
            <TextField
              fullWidth
              variant="filled"
              name="ste"
              type="text"
              label="Ste"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.ste}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="date_embauche"
              type="date"
              label="Date Embauche"
              InputLabelProps={{ shrink: true }}
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.date_embauche}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="date_obtention_permis"
              type="date"
              label="Date Obtention Permis"
              InputLabelProps={{ shrink: true }}
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.date_obtention_permis}
              sx={{ gridColumn: "span 4" }}
            />
            {/* <TextField
              fullWidth
              variant="filled"
              name="sf"
              type="text"
              label="SF"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.sf}
              sx={{ gridColumn: "span 4" }}
            /> */}
            <TextField
              fullWidth
              variant="filled"
              name="date_fin_permis"
              type="date"
              label="Date Fin Permis"
              InputLabelProps={{ shrink: true }}
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.date_fin_permis}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="date_derniere_visite_medicale"
              type="date"
              label="Date Derniere Visite Medicale"
              InputLabelProps={{ shrink: true }}
              onChange={HandleChange}
              value={
                DriverSelected && DriverSelected.date_derniere_visite_medicale
              }
              sx={{ gridColumn: "span 4" }}
            />{" "}
            <TextField
              fullWidth
              variant="filled"
              name="date_fin_FCD"
              type="date"
              label="Date Fin FCD"
              InputLabelProps={{ shrink: true }}
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.date_fin_FCD}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="num_carte_driver_pro"
              type="text"
              label="Num Carte Driver Pro"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.num_carte_driver_pro}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="date_fin_driver_pro"
              type="date"
              label="Date Fin Driver Pro"
              InputLabelProps={{ shrink: true }}
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.date_fin_driver_pro}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="numRib"
              type="text"
              label="N° RIB"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.numRib}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="code_banque"
              type="text"
              label="Code Banque"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.code_banque}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="agence_bancaire"
              type="text"
              label="Agence Bancaire"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.agence_bancaire}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              name="remarque_sortie"
              type="text"
              label="Remarque de Sortie"
              onChange={HandleChange}
              value={DriverSelected && DriverSelected.remarque_sortie}
              sx={{ gridColumn: "span 4" }}
            />
            <Box
              display="flex"
              flexDirection="row"
              gap="20px"
              sx={{
                gridColumn: "span 8",
                alignItems: "center",
              }}
            >
              <RadioGroup
                row
                aria-labelledby="demo-form-control-label-placement"
                onChange={HandleChange}
                name="dispo"
                value={DriverSelected.dispo || ""}
                sx={{ gridColumn: "span 8" }}
              >
                <FormControlLabel
                  value="disponible"
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
                  label="disponible"
                />
                <FormControlLabel
                  value="non disponible"
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
                  label="non disponible"
                  labelPlacement="start"
                />
              </RadioGroup>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  value={DriverSelected && DriverSelected.active}
                  checked={
                    (DriverSelected && parseInt(DriverSelected.active) === 1) ||
                    DriverSelected.active === "active"
                  }
                  onChange={HandleChange}
                  name="active" // Assuming the name of the checkbox input is "valide"
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Active"
              sx={{ gridColumn: "span 4" }} // Add your label text here
            />
            <Box gridColumn="span 4">
              <FormLabel htmlFor="image"> Image</FormLabel>
              <input
                type="file"
                onChange={handleFileChange}
                name="image"
                style={{ width: "100%", marginTop: "5px" }}
              />
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
          <button className="btn btn-primary" onClick={() => requestPut()}>
            Modifier
          </button>
          <button
            className="btn btn-danger"
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
          {DriverSelected && DriverSelected.idDriver} ?
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
      <Modal
        size="xl"
        isOpen={modalShow}
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
                dataFile.length > 0
                  ? dataFile.map((file, index) => ({
                      id: `${file.idFile}-${index}`, // Ensure unique id by appending index
                      idFile: file.idFile,
                      idDriver: file.idDriver,
                      cin: file.cin,
                      rib: file.rib,
                      permis: file.permis,
                      document: file.document,
                    }))
                  : []
              }
              getRowId={(row) => row.id}
              columns={columnsUpload}
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
          {/* <button className="btn btn-danger" onClick={() => requestDelete()}>
            Oui
          </button> */}
          <button
            className="btn btn-secondary"
            onClick={() => openCloseModalShow()}
          >
            {" "}
            Non
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalUpload}>
        <ModalHeader
          style={{
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            borderBottom: "1px solid",
            borderBottomColor: theme.palette.mode === "dark" ? "#444" : "#ddd",
          }}
        >
          Ajouter Driver
        </ModalHeader>

        <ModalBody
          style={{
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            padding: "20px",
          }}
        >
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(8, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 8" },
            }}
          >
            <Box gridColumn="span 4">
              <FormLabel htmlFor="permis">Permis</FormLabel>
              <input
                type="file"
                onChange={handleFileChange}
                name="permis"
                style={{ width: "100%", marginTop: "5px" }}
              />
            </Box>
            <Box gridColumn="span 4">
              <FormLabel htmlFor="cin">CIN</FormLabel>
              <input
                type="file"
                // id="cin"
                onChange={handleFileChange}
                name="cin"
                style={{ width: "100%", marginTop: "5px" }}
              />
            </Box>
            <Box gridColumn="span 4">
              <FormLabel htmlFor="rib">RIB</FormLabel>
              <input
                type="file"
                // id="rib"
                onChange={handleFileChange}
                name="rib"
                style={{ width: "100%", marginTop: "5px" }}
              />
            </Box>
            <Box gridColumn="span 4">
              <FormLabel htmlFor="document">Document</FormLabel>
              <input
                type="file"
                // id="document"
                onChange={handleFileChange}
                name="document"
                style={{ width: "100%", marginTop: "5px" }}
              />
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter
          style={{
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            borderTop: "1px solid",
            borderTopColor: theme.palette.mode === "dark" ? "#444" : "#ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          {error && (
            <SnackbarProvider sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error">Missing required fields</Alert>
            </SnackbarProvider>
          )}
          <div>
            <button
              className="btn btn-primary"
              onClick={() => requestPostUpload()}
              style={{ marginRight: "10px" }}
            >
              Ajouter
            </button>
            <button
              className="btn btn-danger"
              onClick={() => openCloseModalUpload()}
            >
              Fermer
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalUploadEdit}>
        <ModalHeader
          style={{
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            borderBottom: "1px solid",
            borderBottomColor: theme.palette.mode === "dark" ? "#444" : "#ddd",
          }}
        >
          Modifier Driver
        </ModalHeader>

        <ModalBody
          style={{
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            padding: "20px",
          }}
        >
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(8, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 8" },
            }}
          >
            <Box gridColumn="span 4">
              <FormLabel htmlFor="permis">Permis</FormLabel>
              <input
                type="file"
                onChange={handleFileChange}
                name="permis"
                style={{ width: "100%", marginTop: "5px" }}
              />
            </Box>
            <Box gridColumn="span 4">
              <FormLabel htmlFor="cin">CIN</FormLabel>
              <input
                type="file"
                onChange={handleFileChange}
                name="cin"
                style={{ width: "100%", marginTop: "5px" }}
              />
            </Box>
            <Box gridColumn="span 4">
              <FormLabel htmlFor="rib">RIB</FormLabel>
              <input
                type="file"
                onChange={handleFileChange}
                name="rib"
                style={{ width: "100%", marginTop: "5px" }}
              />
            </Box>
            <Box gridColumn="span 4">
              <FormLabel htmlFor="document">Document</FormLabel>
              <input
                type="file"
                onChange={handleFileChange}
                name="document"
                style={{ width: "100%", marginTop: "5px" }}
              />
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter
          style={{
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            borderTop: "1px solid",
            borderTopColor: theme.palette.mode === "dark" ? "#444" : "#ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          {error && (
            <SnackbarProvider sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error">Missing required fields</Alert>
            </SnackbarProvider>
          )}
          <div>
            <button
              className="btn btn-primary"
              onClick={() => requestPutUpload()}
              style={{ marginRight: "10px" }}
            >
              Modifier
            </button>
            <button
              className="btn btn-danger"
              onClick={() => openCloseModalUploadEdit()}
            >
              Fermer
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <Box
        m="40px 0 0 0"
        height="75vh"
        width="91vw"
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
          "& .MuiDataGrid-root .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
      >
        <DataGrid
          rows={
            data.length > 0
              ? data.map((driver, index) => ({
                  id: `${driver.idDriver}-${index}`, // Ensure unique id by appending index
                  idDriver: driver.idDriver,
                  address: driver.address,
                  prenom: driver.prenom,
                  nom: driver.nom,
                  tell: driver.tell,
                  dispo: driver.dispo,
                  active: driver.active == 1 ? "active" : "non active",
                  image: driver.image,
                  ste: driver.ste,
                  num_permis: driver.num_permis,
                  date_embauche: driver.date_embauche,
                  sf: driver.sf,
                  numE: driver.numE,
                  numCin: driver.numCin,
                  date_obtention_permis: driver.date_obtention_permis,
                  date_fin_permis: driver.date_fin_permis,
                  date_fin_cin: driver.date_fin_cin,
                  valide_cin: driver.valide_cin,
                  date_naissance: driver.date_naissance,
                  lieu_naissance: driver.lieu_naissance,
                  date_derniere_visite_medicale:
                    driver.date_derniere_visite_medicale,
                  num_carte_driver_pro: driver.num_carte_driver_pro,
                  date_fin_driver_pro: driver.date_fin_driver_pro,
                  Num_CNSS: driver.Num_CNSS,
                  type_contrat: driver.type_contrat,
                  date_fin_FCD: driver.date_fin_FCD,
                  numRib: driver.numRib,
                  code_banque: driver.code_banque,
                  agence_bancaire: driver.agence_bancaire,
                  remarque_sortie: driver.remarque_sortie,
                  username: driver.username,
                }))
              : []
          }
          columns={columns}
          getRowId={(row) => row.idDriver}
          components={{ Toolbar: CustomToolbar }}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          // sx={{
          //   "& .MuiDataGrid-virtualScroller": {
          //     overflowX: "auto",
          //   },
          //   "& .MuiDataGrid-columnHeaders": {
          //     display: "flex",
          //     alignItems: "center",
          //   },
          // }}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <span>Photo</span>
            <Button
              onClick={() => handleDownload(selectedImage)}
              variant="contained"
              color="primary"
            >
              Download
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Zoom
            zoomMargin={40} // Adjust the margin for better user experience
            onZoomChange={handleZoomChange} // Handle zoom state changes
          >
            <img
              src={selectedImage}
              alt="Enlarged"
              style={{ width: "100%", height: "auto" }}
            />
          </Zoom>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

const csvOptions = {
  fileName: "BD_Driver",
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

export default Driver;
