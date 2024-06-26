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
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
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
    const [selectedState, setSelectedState] = useState<State | null>(null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

    useEffect(() => {
        fetchStates();
    }, [])

    const fetchStates = async () => {
        const res = await billingService.getStateList();
        console.log(res);
        setStates(res);
    }

    const handleStateChange = (e: SelectChangeEvent) => {
        const id = e.target.value;
        const state = states.find((item) => item.state_id === id) || null;
        setSelectedState(state);
    }

    const handleCountyChange = (e: SelectChangeEvent) => {
        const id = e.target.value;
        setSelectedCounty(id);
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
                    <div className="w-48">
                        <FormControl size="small" fullWidth>
                            <InputLabel id="state-filter-label">Select state</InputLabel>
                            <Select
                                labelId="state-filter-label"
                                id="state-filter"
                                label="Select state"
                                name='state'
                                value={selectedState?.state_id}
                                onChange={handleStateChange}
                                MenuProps={MenuProps}
                            >
                                { states.map((state) => (
                                    <MenuItem key={state.state_id} value={state.state_id}>
                                        {state.state_name}
                                    </MenuItem>
                                ))} 
                            </Select>
                        </FormControl>
                    </div>
                    
                    <div className="w-48">
                        <FormControl size="small" fullWidth>
                            <InputLabel id="county-filter-label">Select county</InputLabel>
                            <Select
                                labelId="county-filter-label"
                                id="county-filter"
                                label="Select county"
                                name='county'
                                value={selectedCounty || undefined}
                                onChange={handleCountyChange}
                                MenuProps={MenuProps}
                                disabled={!selectedState}
                            >
                                { selectedState?.county_list.map((county) => (
                                    <MenuItem key={county.county_id} value={county.county_id}>
                                        {county.county_name}
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
