import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { billingService } from '@/services/billing';
import { useEffect, useState } from 'react';
import { Alert, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination } from '@mui/material';
import { County, State } from '@/services/types/billing.type';
import { StyledTableHeaderRow, StyledTableRow } from '@/app/dashboard/scanners/page';
import { scannerService } from '@/services/scanners';
import { Scanner } from '@/services/types/scanner.type';
import { SubEnum, subInfo } from '@/lib/constants';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  }
}));

interface IBillingModal {
    handleClose: () => void;
    type: SubEnum
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
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
    const [countiesObject, setCountiesObject] = useState<Record<string, County>>({});

    const [selectedScanners, setSelectedScanners] = useState<number[]>([]);
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchStates();
    }, [])

    useEffect(() => {
        let countyArr: County[] = [];
        selectedStates.map((id) => {
            if (stateObject[id]) {
                countyArr.push(...stateObject[id].county_list);
            }
        })

        const obj: Record<string, County> = {};
        countyArr.map(item => obj[item.county_id] = item);

        setCounties(countyArr);
        setCountiesObject(obj);
    }, [selectedStates])

    useEffect(() => {
        if (!selectedStates.length && !selectedCounties.length) {
            setData([]);
            setPage(0);
            setTotalPage(0);
        } else if (selectedStates.length) {
            fetchAllScanners();
        }
    }, [page, rowsPerPage, selectedStates, selectedCounties])

    const fetchStates = async () => {
        const res = await billingService.getStateList();
        setStates(res);
        const obj: Record<string, State> = {};
        res.map((item) => {
            obj[item.state_id] = item;
        })
        setStateObject(obj);
    }

    const handleStateChange = (e: SelectChangeEvent<typeof selectedStates>) => {
        const value = e.target.value;
        const valueArr = typeof value === 'string' ? value.split(',') : value
        if (valueArr.length > subInfo[type].state) {
            setErrMsg(`Cannot select more than ${subInfo[type].state} states!`);
        } else {
            setSelectedStates(valueArr);
        }
    }

    const handleCountiesChange = (e: SelectChangeEvent<typeof selectedCounties>) => {
        const value = e.target.value;
        const valueArr = typeof value === 'string' ? value.split(',') : value
        if (valueArr.length > subInfo[type].county) {
            setErrMsg(`Cannot select morethan ${subInfo[type].county} counties!`);
        } else {
            setSelectedCounties(valueArr);
        }
    }

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
        limit: rowsPerPage, page: page + 1, 
        ...(selectedCounties.length && { county_id: selectedCounties.map(Number) }),
        ...(selectedStates.length && { state_id: selectedStates.map(Number) }),
      });
      setTotalPage(res.pagination.total);
      setData(res.data);
    }

    const handleSelectScanner = (id: number, checked: boolean) => {
        const scannersArr = checked ? [...selectedScanners, id] : selectedScanners.filter((item) => item !== id);

        if (scannersArr.length > subInfo[type].scanners) {
            setErrMsg(`Cannot select more than ${subInfo[type].scanners} scanners!`);
            return;
        }
        setSelectedScanners(scannersArr);
    }

    const handleCloseSnack = () => {
        setErrMsg("");
        setSuccessMsg("");
    }

    const handlePurchase = async () => {
        const res = await billingService.addSelectedScanners(selectedScanners);
        if (res.status) {
            setSuccessMsg(res.message);
            setTimeout(() => handleClose(), 1000);
        }
    }

    return (
        <>
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }} id="customized-dialog-title">
                Billing
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent dividers sx={{
                maxHeight: '100vh',
                height: '100%'
            }}>
                <div className='flex gap-4'>
                    <div>
                        <FormControl sx={{ width: 250 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Select state</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={selectedStates}
                                onChange={handleStateChange}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.map((item) => stateObject[item].state_name).join(', ')}
                                MenuProps={MenuProps}
                            >
                                {states.map((state) => (
                                    <MenuItem key={state.state_id} value={state.state_id}>
                                        <Checkbox checked={selectedStates.some((id) => id === state.state_id)} />
                                        <ListItemText primary={state.state_name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div>
                        <FormControl sx={{ width: 250 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Select county</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={selectedCounties}
                                onChange={handleCountiesChange}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.map((item) => countiesObject[item].county_name).join(', ')}
                                MenuProps={MenuProps}
                                disabled={!counties.length}
                            >
                                {counties.map((county) => (
                                    <MenuItem key={county.county_id} value={county.county_id}>
                                        <Checkbox checked={selectedCounties.some((id) => id == county.county_id)} />
                                        <ListItemText primary={county.county_name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                { data.length ? <Paper sx={{ width: "100%", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0)" }} className="mt-8">
                    <TableContainer sx={{maxHeight: '50vh'}}>
                        <Table
                            sx={{
                                // minWidth: 1450,
                                overflowX: "scroll",
                                marginBottom: "20px",
                            }}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <StyledTableHeaderRow>
                                    <TableCell className="uppercase" sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'white' }}>
                                        <div className="font-bold">Receiver</div>
                                    </TableCell>
                                    <TableCell className="uppercase" sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'white' }}>
                                        <div className="font-bold">Listeners</div>
                                    </TableCell>
                                    <TableCell className="uppercase" sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'white' }}>
                                        <div className="font-bold">State</div>
                                    </TableCell>
                                    <TableCell align="center" className="uppercase" sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'white' }}>
                                        <div className="font-bold">County</div>
                                    </TableCell>
                                    <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'white' }}></TableCell>
                                </StyledTableHeaderRow>
                            </TableHead>

                            <TableBody sx={{maxHeight: 'calc(50vh - 56px)', overflowY: 'auto'}}>
                                {data.map((item) => (
                                    <StyledTableRow
                                        key={item.id}
                                        className="cursor-pointer"
                                    >
                                        <TableCell>{item.scanner_title}</TableCell>
                                        <TableCell scope="row">{item.listeners_count}</TableCell>
                                        <TableCell>{item.state_name}</TableCell>
                                        <TableCell align="center">
                                            <div className="font-bold">{item.county_name}</div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Checkbox checked={selectedScanners.includes(item.scanner_id)}
                                                onChange={(e, checked) => handleSelectScanner(item.scanner_id, checked)}
                                                sx={{ p: 0}}
                                            />
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={totalPage}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper> : null }
            </DialogContent>

            <DialogActions>
                <div>
                    <button
                        className="w-full bg-gray-700 hover:bg-gray-600 py-2 px-4 text-white rounded-md"
                        onClick={handlePurchase}
                    >
                        Subscribe
                    </button>
              </div>
            </DialogActions>
        </BootstrapDialog>


        { (errMsg || successMsg) && <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open
            autoHideDuration={3000}
            onClose={handleCloseSnack}
        >
            <Alert severity={errMsg ? "error": "success"} variant="filled" 
                onClose={handleCloseSnack}
            >
                {errMsg || successMsg}
            </Alert>
        </Snackbar> }
        </>
    );
}
