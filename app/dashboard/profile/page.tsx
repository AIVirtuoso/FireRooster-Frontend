"use client";
import {
  Box,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useAppSelector } from "@/hooks/store.hooks";

const profileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email("Please provide a valid email"),
});
type TProfileSchema = z.infer<typeof profileSchema>;

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
const alerts = [
  "Fire",
  // "Police", "Army"
];
const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function Page() {
  const user = useAppSelector(state => state.auth.user);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: user
  });
  const [filterState, setFilterState] = useState("");
  const [filterAlert, setFilterAlert] = useState<string[]>([]);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  const handleStateChange = (event: SelectChangeEvent) => {
    setFilterState(event.target.value as string);
  };

  const handleAlertChange = (event: SelectChangeEvent<typeof filterAlert>) => {
    const {
      target: { value },
    } = event;
    setFilterAlert(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    if (window.innerWidth < 640) {
      setIsMobileWidth(true);
    } else {
      setIsMobileWidth(false);
    }
  }, []);

  return (
    <>
      <div className="flex justify-between mb-4 items-center p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Profile</div>
      </div>
      <Divider />
      <form className="mt-8 xl:w-[50rem] w-full">
        <Stack
          direction={`${isMobileWidth ? "column" : "row"}`}
          spacing={2}
          className="mb-8 w-full"
        >
          <TextField
            {...register("first_name", {
              value: getValues("first_name" || ""),
            })}
            className="sm:w-1/2 sm:mb-0 mb-8"
            error={Boolean(errors?.first_name?.message)}
            variant="outlined"
            label="First name"
            helperText={errors?.first_name?.message}
            onChange={(e) => setValue("first_name", e.target.value)}
          />
          <TextField
            {...register("last_name", { value: getValues("last_name" || "") })}
            sx={{ marginTop: isMobileWidth ? "2rem !important" : "0px" }}
            className="sm:w-1/2"
            error={Boolean(errors?.last_name?.message)}
            variant="outlined"
            label="Last name"
            helperText={errors?.last_name?.message}
            onChange={(e) => setValue("last_name", e.target.value)}
          />
        </Stack>
        <TextField
          {...register("email", { value: getValues("email" || "") })}
          className="w-full"
          error={Boolean(errors?.email?.message)}
          variant="outlined"
          label="Email"
          helperText={errors?.email?.message}
          onChange={(e) => setValue("email", e.target.value)}
        />
        <FormControl size="medium" fullWidth sx={{ margin: "2rem 0" }}>
          <InputLabel id="state-filter-label">Select state</InputLabel>
          <Select
            labelId="state-filter-label"
            id="state-filter"
            label="Select state s"
            value={filterState}
            onChange={handleStateChange}
            MenuProps={MenuProps}
          >
            {usStates.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: "1.2rem" }}>
          <InputLabel id="multiple-checkbox-alert-label">
            Select alert (multiple options)
          </InputLabel>
          <Select
            labelId="multiple-checkbox-alert-label"
            id="multiple-checkbox-alert"
            multiple
            value={filterAlert}
            onChange={handleAlertChange}
            input={<OutlinedInput label="Select alert (multiple options) s" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {alerts.map((alert) => (
              <MenuItem key={alert} value={alert}>
                <Checkbox
                  checked={filterAlert.indexOf(alert) > -1}
                  sx={{
                    color: "rgb(30, 41, 59)",
                    "&.Mui-checked": {
                      color: "rgb(30, 41, 59)",
                    },
                  }}
                />
                {alert}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                sx={{
                  color: "rgb(30, 41, 59)",
                  "&.Mui-checked": {
                    color: "rgb(30, 41, 59)",
                  },
                }}
              />
            }
            label="Email alert"
          />
          {/* <FormControlLabel
            control={<Checkbox disabled />}
            label="Phone alert (coming soon)"
          /> */}
        </FormGroup>
        <LoadingButton
          sx={{
            [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
            background: "rgb(30, 41, 59)",
            padding: "10px 20px",
            marginTop: "1.4rem",
          }}
          loading={isSubmitting}
          variant="contained"
          type="submit"
        >
          Save changes
        </LoadingButton>
      </form>
    </>
  );
}
