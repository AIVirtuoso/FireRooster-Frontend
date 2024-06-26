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
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { County, State } from '@/services/types/billing.type';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface IBillingModal {
    handleClose: () => void;
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

export function BillingModal({ handleClose }: IBillingModal) {
    const [states, setStates] = useState<State[]>([]);
    const [counties, setCounties] = useState<County[]>([]);
    const [selectedStates, setSelectedStates] = useState<string[]>([]);
    const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
    const [stateObject, setStateObject] = useState<Record<string, State>>({});
    const [countiesObject, setCountiesObject] = useState<Record<string, County>>({});

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
        setSelectedStates(typeof value === 'string' ? value.split(',') : value);
    }

    const handleCountiesChange = (e: SelectChangeEvent<typeof selectedCounties>) => {
        const value = e.target.value;
        setSelectedCounties(typeof value === 'string' ? value.split(',') : value);
    }

    return (
        <>
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open
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

            <DialogContent dividers>
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
            </DialogContent>

            <DialogActions>
                <Button autoFocus onClick={handleClose}
                    variant='contained'
                >
                    Purchase
                </Button>
            </DialogActions>
        </BootstrapDialog>
        </>
    );
}
