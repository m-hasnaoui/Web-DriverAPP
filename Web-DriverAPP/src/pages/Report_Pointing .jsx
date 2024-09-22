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
  Typography,
  Select,
  FormControl,
  InputLabel,
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
} from "@mui/x-data-grid";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import config from "./global/config";
import { ReactSession } from "react-client-session";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import MenuItem from "@mui/material/MenuItem";

function Report_Pointing() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";
  const [dataProfile, setDataProfile] = useState([]);

  const [error, setError] = useState(false);
  const [dataSelectDriver, setDataSelectDriver] = useState([]);

  const [DateStart, setDateStart] = useState(dayjs().add(-7, "day"));
  const [DateEnd, setDateEnd] = useState(dayjs());
  const [DataPresence, setDataPresence] = useState(1);

  const requestGetSelectDriver = async (startDateRP, endDateRP, statut) => {
    await axios
      .get(urlSelect, {
        params: {
          startDateRP: startDateRP.format("YYYY-MM-DD"),
          endDateRP: endDateRP.format("YYYY-MM-DD"),
          statut: statut,
        },
      })
      .then((response) => {
        setDataSelectDriver(response.data);
        // console.log(response.data);
        // console.log(startDateRP, endDateRP);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const presenceOptions = [
    { value: 1, label: "Présente" },
    { value: 0, label: "Absente" },
  ];

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

  const handleExport = () => {
    const exportData = dataSelectDriver.map((Report_Pointing) => ({
      ...Report_Pointing,
      startDateRP: DateStart.format("YYYY-MM-DD"),
      endDateRP: DateEnd.format("YYYY-MM-DD"),
    }));

    const csvOptions = {
      fileName: `Report_N°_${DateStart.format("YYYY-MM-DD")}_${DateEnd.format(
        "YYYY-MM-DD"
      )}`,
      delimiter: ";",
      utf8WithBom: true,
    };

    const csvContent = [
      [
        "Prenom",
        "Nom",
        "ste",
        "matricule",
        "total_status_1",
        "total_sunday_status_1",

        "avance",
      ],
      ...exportData.map((row) => [
        // row.idDriver,
        row.prenom,
        row.nom,
        row.ste,
        row.matricule,
        row.total_status_1,
        row.total_sunday_status_1,
        // row.Num_CNSS,
        // row.code_banque,
        row.avance,
      ]),
    ]
      .map((e) => e.join(csvOptions.delimiter))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `${csvOptions.fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    // {
    //   field: "idAVD",
    //   headerName: "ID",
    //   flex: 0.5,
    //   cellClassName: "name-column--cell2",
    // },
    {
      field: "numE",
      headerName: "Numéro d'employé",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "regNumber",
      headerName: "Matricule",
      flex: 1,
      cellClassName: "name-column--cell",
    },

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
      headerName: "Date de Pointage",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 100,
    //   cellClassName: "actions",
    //   renderCell: (params) => {
    //     return [
    //       (dataProfile.length > 0 && dataProfile[0].op_edit === 1) ||
    //       ReactSession.get("role") === "admin" ? (
    //         <GridActionsCellItem
    //           key={`edit-${params.row.idDriver}`}
    //           icon={<InventoryOutlinedIcon style={{ color: "green" }} />}
    //           label="Edit"
    //           className="textPrimary"
    //           onClick={() => selectPointing(params.row, "Edit")}
    //           color="inherit"
    //           disabled={params.row.statut === "oui" || params.row.statut === 1}
    //         />
    //       ) : null,
    //       (dataProfile.length > 0 && dataProfile[0].op_delete === 1) ||
    //       ReactSession.get("role") === "admin" ? (
    //         <GridActionsCellItem
    //           key={`delete-${params.row.idDriver}`}
    //           icon={<DeleteIcon />}
    //           label="Delete"
    //           onClick={() => selectPointing(params.row, "Delete")}
    //           color="inherit"
    //         />
    //       ) : null,
    //     ];
    //   },
    // },
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await requestGetProfile(ReactSession.get("idUser"), "Report Pointing");
        await requestGetSelectDriver(DateStart, DateEnd, DataPresence);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    // if (!loading) {
    //   window.location.reload();
    // }
  }, [DateStart, DateEnd, DataPresence]);

  return (
    <Box m="25px">
      {loading ? (
        <Header title="Loading" subtitle="" />
      ) : (
        <Header title="Rapport de Pointage" subtitle="" />
      )}
      {loading ? null : (dataProfile.length > 0 &&
          dataProfile[0].op_add === 1) ||
        ReactSession.get("role") === "admin" ? (
        <Box
          display="flex"
          justifyContent="end"
          alignItems="center"
          mt="20px"
          gap="16px"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={DateStart}
              onChange={(newValue) => setDateStart(newValue)}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: false } }}
            />
            <DatePicker
              label="End Date"
              value={DateEnd}
              onChange={(newValue) => setDateEnd(newValue)}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: false } }}
            />
          </LocalizationProvider>

          <FormControl style={{ width: "10%" }}>
            <InputLabel id="demo-simple-select-label" style={{ width: "100%" }}>
              Présence
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Présence"
              value={DataPresence}
              onChange={(e) => setDataPresence(e.target.value)}
            >
              {presenceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={handleExport}
            sx={{ ml: 2 }}
          >
            Export
          </Button>
        </Box>
      ) : null}

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
            dataSelectDriver.length > 0
              ? dataSelectDriver.map((Report_Pointing) => ({
                  ...Report_Pointing,
                  id: Report_Pointing.idP, // Ensure each row has a unique `id` property
                }))
              : []
          }
          getRowId={(row) => row.idP} // Use this if `idDriver` is unique and can be used as `id`
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

export default Report_Pointing;
