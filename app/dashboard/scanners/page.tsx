"use client";
import { billingService } from "@/services/billing";
import { scannerService } from "@/services/scanners";
import { State } from "@/services/types/billing.type";
import { Scanner } from "@/services/types/scanner.type";
import { House, LocalFireDepartment, Radio } from "@mui/icons-material";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Tab,
  TablePagination,
  Tabs,
  TextField,
  styled,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from "@/hooks/store.hooks";
import { setPageInfo } from "@/store/slices/scanner.slice";


export const StyledTableRow = styled(TableRow)(() => ({
  td: { backgroundColor: "white" },
  th: { backgroundColor: "white" },
  // "&:last-child td, &:last-child th": { borderBottom: "unset" },
}));

export const StyledTableHeaderRow = styled(TableRow)(() => ({
  th: {
    fontSize: ".8rem",
    fontWeight: "bold",
  },
}));

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

export default function Page() {
  const pageInfo = useAppSelector((state) => state.scanner.pageInfo);
  const [page, setPage] = useState(pageInfo?.pageNo || 0);
  const [totalPage, setTotalPage] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState<Scanner[]>([]);
  const [value, setValue] = useState<'allscanners' | 'myscanners'>(pageInfo ? 'myscanners' : 'allscanners');
  const [info, setInfo] = useState({
    alert: ''
  })
  const [search, setSearch] = useState('');
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<State | "">("");
  const [selectedCounty, setSelectedCounty] = useState<string | "">("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (value === 'allscanners') {
      fetchAllScanners();
    } else {
      fetchMyScanners();
    }
  }, [page, rowsPerPage, selectedCounty, selectedState, search])

  useEffect(() => {
    if (value === 'allscanners') {
      fetchStates();
      fetchAllScanners();
    } else {
      fetchMyScanners();
    }
  }, [value])

const fetchStates = async () => {
    const res = await billingService.getStateList();
    setStates(res);
}

const handleStateChange = (e: SelectChangeEvent) => {
  const id = e.target.value;
  const state = states.find((item) => item.state_id === id) || "";
  setSelectedState(state);
}

const handleCountyChange = (e: SelectChangeEvent) => {
  const id = e.target.value;
  setSelectedCounty(id);
}

  const handleChangePage = (event: unknown, newPage: number) => {

    console.log("newPage: ", newPage);

    setPage(newPage);
    dispatch(setPageInfo({ pageName: pageInfo?.pageName || '', pageNo: newPage}));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: "allscanners" | 'myscanners') => {
    setData([]);
    setValue(newValue);
    setSelectedState("");
    setSelectedCounty("");
    setStates([]);
    setPage(0);
    setTotalPage(0);
    setSearch("");
    dispatch(setPageInfo({ pageName: newValue, pageNo: 0}));
  };

  const handleInfoChange = (event: SelectChangeEvent) => {
    const name = event.target.name;
    const value = event.target.value;

    setInfo({
      ...info,
      [name]: value
    })
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearch(value)
  }

  const fetchAllScanners = async () => {
    const res = await scannerService.getAllScanners({ 
      limit: rowsPerPage, page: page + 1, 
      ...(selectedCounty && { county_id: [Number(selectedCounty)] }),
      ...(selectedState && { state_id: [Number(selectedState.state_id)] }),
      search
    });
    setTotalPage(res.pagination.total);
    setData(res.data);
  }

  const fetchMyScanners = async () => {
    const res = await scannerService.getMyScanners({
      limit: rowsPerPage, page: page + 1, 
      ...(selectedCounty && { county_id: [Number(selectedCounty)] }),
      ...(selectedState && { state_id: [Number(selectedState.state_id)] }),
      search
    })
    setTotalPage(res.pagination.total);
    setData(res.data);
    setStates(res.states);
  }

  const handleDelete = async (scanner_id: number) => {
    const res = await scannerService.deletePurchasedScanner({
      scanner_id: scanner_id
    })
    fetchMyScanners()
  }

  const handleClickRow = async (scanner_id: number) => {
    router.push(`/dashboard/scanners/${scanner_id}/alert`)
  }

  return (
    <>
      <div className=" mb-4 p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Scanners</div>

        <div className="flex mt-6 gap-2">
          <div className="w-48">
            <FormControl size="small" fullWidth>
              <TextField size="small" onChange={handleSearchChange} 
                value={search} name="search" label="Search scanners"
              />
            </FormControl>
          </div>

          <div className="w-48">
            <FormControl size="small" fullWidth>
              <InputLabel id="state-filter-label">Select state</InputLabel>
              <Select
                labelId="state-filter-label"
                id="state-filter"
                label="Select state"
                name='state'
                value={selectedState && selectedState.state_id}
                onChange={handleStateChange}
                MenuProps={MenuProps}
              >
                <MenuItem value={""}>All states</MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.state_id} value={state.state_id}>
                    {state.state_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="w-48">
            <FormControl size="small" fullWidth>
              <InputLabel id="state-filter-label">Select county</InputLabel>
              <Select
                labelId="state-filter-label"
                id="state-filter"
                label="Select county"
                value={selectedCounty && selectedCounty}
                onChange={handleCountyChange}
                MenuProps={MenuProps}
                name='county'
                disabled={!selectedState}
              >
                <MenuItem value={""}>All county</MenuItem>
                {selectedState && selectedState.county_list.map((county) => (
                  <MenuItem key={county.county_id} value={county.county_id}>
                    {county.county_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="w-48">
            <FormControl size="small" fullWidth>
              <InputLabel id="alert-filter-label">Select alert</InputLabel>
              <Select
                labelId="alert-filter-label"
                id="alert-filter"
                label="Select alert"
                value={info.alert}
                onChange={handleInfoChange}
                name='alert'
              >
                <MenuItem value={""}>All alerts</MenuItem>
                <MenuItem value={"fire"}>
                  Fire alert{" "}
                  <LocalFireDepartment color="warning" className="ms-1" />
                </MenuItem>
                <MenuItem value={"police"}>Police alert</MenuItem>
                <MenuItem value={30}>Menu 3</MenuItem>
              </Select>
            </FormControl>
          </div>

        </div>
      </div>

      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'black', 
            },
            '& .MuiTab-root.Mui-selected': {
              color: 'black',
            },
            '& .MuiTab-root': {
              textTransform: 'none'
            },
          }}
        >
          <Tab value="allscanners" label="All Scanners" />
          <Tab value="myscanners" label="My Scanners" />
        </Tabs>
      </Box>

      <Divider />
      <Paper sx={{ width: "100%", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0)" }} className="mt-8">
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
                  <TableCell
                    onClick={() => handleClickRow(item.scanner_id)}>{item.scanner_title}
                  </TableCell>
                  <TableCell
                    scope="row"
                    onClick={() => handleClickRow(item.scanner_id)}
                  >
                      {item.listeners_count}
                  </TableCell>
                  <TableCell onClick={() => handleClickRow(item.scanner_id)}>{item.state_name}</TableCell>
                  <TableCell align="center" onClick={() => handleClickRow(item.scanner_id)}>
                    <div className="font-bold">{item.county_name}</div>
                  </TableCell>
                  <TableCell align="center" style={{width: "100px"}} onClick={() => handleClickRow(item.scanner_id)}>
                    {
                      (value === 'allscanners' && 
                        <span onClick={() => handleClickRow(item.scanner_id)}> 
                        Details
                        </span>
                      )
                    }
                    {
                      (value === 'myscanners' && 
                        <IconButton
                          aria-label="delete"
                          onClick={(e) => {
                            handleDelete(item.scanner_id);
                          }}
                        >
                          <DeleteIcon sx={{ color: 'black' }} />
                        </IconButton>
                      )
                    }
                      
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
      </Paper>
    </>
  );
}
