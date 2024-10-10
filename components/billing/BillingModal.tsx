import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { billingService } from "@/services/billing";
import { useEffect, useState } from "react";
import {
  Alert,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Snackbar,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  CardActions,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TablePagination from "@mui/material/TablePagination";
import { County, State } from "@/services/types/billing.type";
import { scannerService } from "@/services/scanners";
import { Scanner } from "@/services/types/scanner.type";
import { SubEnum, subInfo } from "@/lib/constants";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface IBillingModal {
  handleClose: () => void;
  type: SubEnum;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function BillingModal({ handleClose, type }: IBillingModal) {
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState<Scanner[]>([]);

  const [states, setStates] = useState<State[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [stateObject, setStateObject] = useState<Record<string, State>>({});
  const [countiesObject, setCountiesObject] = useState<Record<string, County>>(
    {}
  );

  const [selectedScanners, setSelectedScanners] = useState<number[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchStates();
    fetchSelectedScanners();
  }, []);

  useEffect(() => {
    let countyArr: County[] = [];
    selectedStates.forEach((id) => {
      if (stateObject[id]) {
        countyArr.push(...stateObject[id].county_list);
      }
    });

    const obj: Record<string, County> = {};
    countyArr.forEach((item) => (obj[item.county_id] = item));

    setCounties(countyArr);
    setCountiesObject(obj);
  }, [selectedStates]);

  useEffect(() => {
    if (!selectedStates.length && !selectedCounties.length) {
      setData([]);
      setPage(0);
      setTotalPage(0);
    } else if (selectedStates.length) {
      fetchAllScanners();
    }
  }, [page, rowsPerPage, selectedStates, selectedCounties]);

  const fetchStates = async () => {
    const res = await billingService.getStateList();
    setStates(res);
    const obj: Record<string, State> = {};
    res.forEach((item) => {
      obj[item.state_id] = item;
    });
    setStateObject(obj);
  };

  const fetchSelectedScanners = async () => {
    const scanners = await billingService.getSelectedList();
    const _selectedStates: string[] = [];
    const _selectedCounties: string[] = [];
    const _selectedScanners: number[] = [];
    scanners.forEach((scanner) => {
      _selectedStates.push(scanner.state_id);
      _selectedCounties.push(scanner.county_id);
      _selectedScanners.push(scanner.scanner_id);
    });

    setSelectedStates(Array.from(new Set(_selectedStates)));
    setSelectedCounties(Array.from(new Set(_selectedCounties)));
    setSelectedScanners(Array.from(new Set(_selectedScanners)));
  };

  const handleStateChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    const valueArr = typeof value === "string" ? value.split(",") : value;
    if (valueArr.length > subInfo[type].state) {
      setErrMsg(`Cannot select more than ${subInfo[type].state} states!`);
    } else {
      setSelectedStates(valueArr);
    }
  };

  const handleCountiesChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    const valueArr = typeof value === "string" ? value.split(",") : value;
    if (valueArr.length > subInfo[type].county) {
      setErrMsg(`Cannot select more than ${subInfo[type].county} counties!`);
    } else {
      setSelectedCounties(valueArr);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchAllScanners = async () => {
    const res = await scannerService.getAllScanners({
      limit: rowsPerPage,
      page: page + 1,
      ...(selectedCounties.length && {
        county_id: selectedCounties.map(Number),
      }),
      ...(selectedStates.length && { state_id: selectedStates.map(Number) }),
    });
    setTotalPage(res.pagination.total);
    setData(res.data);
  };

  const handleSelectScanner = (id: number, checked: boolean) => {
    const scannersArr = checked
      ? [...selectedScanners, id]
      : selectedScanners.filter((item) => item !== id);

    if (scannersArr.length > subInfo[type].scanners) {
      setErrMsg(`Cannot select more than ${subInfo[type].scanners} scanners!`);
      return;
    }
    setSelectedScanners(scannersArr);
  };

  const handleCloseSnack = () => {
    setErrMsg("");
    setSuccessMsg("");
  };

  const handlePurchase = async () => {
    const res = await billingService.addSelectedScanners(selectedScanners);
    if (res.status) {
      setSuccessMsg(res.message);
      setTimeout(() => handleClose(), 1000);
    }
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: "center", margin: 'auto' }}
          id="customized-dialog-title"
        >
          Billing
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            maxHeight: "100vh",
            height: "100%",
          }}
        >
          {isMobile ? (
            <Accordion sx={{marginBottom: "8px"}}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Filters</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* State Selector */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="state-select-label">Select State</InputLabel>
                      <Select
                        labelId="state-select-label"
                        id="state-select"
                        multiple
                        value={selectedStates}
                        onChange={handleStateChange}
                        input={<OutlinedInput label="Select State" />}
                        renderValue={(selected) =>
                          selected
                            .map((id) => stateObject[id]?.state_name)
                            .join(", ")
                        }
                        MenuProps={MenuProps}
                      >
                        {states.map((state) => (
                          <MenuItem key={state.state_id} value={state.state_id}>
                            <Checkbox
                              checked={selectedStates.includes(state.state_id)}
                            />
                            <ListItemText primary={state.state_name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* County Selector */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="county-select-label">Select County</InputLabel>
                      <Select
                        labelId="county-select-label"
                        id="county-select"
                        multiple
                        value={selectedCounties}
                        onChange={handleCountiesChange}
                        input={<OutlinedInput label="Select County" />}
                        renderValue={(selected) =>
                          selected
                            .map((id) => countiesObject[id]?.county_name)
                            .join(", ")
                        }
                        MenuProps={MenuProps}
                        disabled={!counties.length}
                      >
                        {counties.map((county) => (
                          <MenuItem
                            key={county.county_id}
                            value={county.county_id}
                          >
                            <Checkbox
                              checked={selectedCounties.includes(county.county_id)}
                            />
                            <ListItemText primary={county.county_name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ) : (
            // Desktop Filters
            <Grid container spacing={2} mb={2}>
              {/* State Selector */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="state-select-label">Select State</InputLabel>
                  <Select
                    labelId="state-select-label"
                    id="state-select"
                    multiple
                    value={selectedStates}
                    onChange={handleStateChange}
                    input={<OutlinedInput label="Select State" />}
                    renderValue={(selected) =>
                      selected
                        .map((id) => stateObject[id]?.state_name)
                        .join(", ")
                    }
                    MenuProps={MenuProps}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.state_id} value={state.state_id}>
                        <Checkbox
                          checked={selectedStates.includes(state.state_id)}
                        />
                        <ListItemText primary={state.state_name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* County Selector */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="county-select-label">Select County</InputLabel>
                  <Select
                    labelId="county-select-label"
                    id="county-select"
                    multiple
                    value={selectedCounties}
                    onChange={handleCountiesChange}
                    input={<OutlinedInput label="Select County" />}
                    renderValue={(selected) =>
                      selected
                        .map((id) => countiesObject[id]?.county_name)
                        .join(", ")
                    }
                    MenuProps={MenuProps}
                    disabled={!counties.length}
                  >
                    {counties.map((county) => (
                      <MenuItem key={county.county_id} value={county.county_id}>
                        <Checkbox
                          checked={selectedCounties.includes(county.county_id)}
                        />
                        <ListItemText primary={county.county_name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {data.length ? (
            isMobile ? (
              <Grid container spacing={2}>
                {data.map((item) => (
                  <Grid item xs={12} key={item.scanner_id}>
                    <Card variant="outlined">
                      <CardContent sx={{ padding: '8px', paddingBottom: "0px" }}>
                        <Typography variant="h6">{item.scanner_title}</Typography>
                        <Typography variant="body2">
                          Listeners: {item.listeners_count}
                        </Typography>
                        <Typography variant="body2">
                          State: {item.state_name}
                        </Typography>
                        <Typography variant="body2">
                          County: {item.county_name}
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <Checkbox
                          checked={selectedScanners.includes(item.scanner_id)}
                          onChange={(e, checked) =>
                            handleSelectScanner(item.scanner_id, checked)
                          }
                          color="primary"
                        />
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <TablePagination
                    component="div"
                    count={totalPage}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                  />
                </Grid>
              </Grid>
            ) : (
              // Desktop Table View
              <Paper
                sx={{
                  width: "100%",
                  boxShadow:
                    "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0)",
                }}
                className="mt-4"
              >
                <TableContainer sx={{ maxHeight: "50vh" }}>
                  <Table
                    sx={{
                      overflowX: "auto",
                      marginBottom: "20px",
                    }}
                    aria-label="scanners table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Receiver</TableCell>
                        <TableCell>Listeners</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>County</TableCell>
                        <TableCell>Select</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.map((item) => (
                        <TableRow key={item.scanner_id}>
                          <TableCell>{item.scanner_title}</TableCell>
                          <TableCell>{item.listeners_count}</TableCell>
                          <TableCell>{item.state_name}</TableCell>
                          <TableCell>{item.county_name}</TableCell>
                          <TableCell>
                            <Checkbox
                              checked={selectedScanners.includes(item.scanner_id)}
                              onChange={(e, checked) =>
                                handleSelectScanner(item.scanner_id, checked)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={totalPage}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                />
              </Paper>
            )
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePurchase}
            fullWidth
            sx={{
              backgroundColor: "gray",
              "&:hover": { backgroundColor: "darkgray" },
            }}
          >
            Subscribe
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {(errMsg || successMsg) && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open
          autoHideDuration={3000}
          onClose={handleCloseSnack}
        >
          <Alert
            severity={errMsg ? "error" : "success"}
            variant="filled"
            onClose={handleCloseSnack}
          >
            {errMsg || successMsg}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
