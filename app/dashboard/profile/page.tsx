"use client";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  TextareaAutosize
} from "@mui/material";

import { billingService } from "@/services/billing";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useAppSelector } from "@/hooks/store.hooks";
import { profileService } from "@/services/profile";
import { State } from "@/services/types/billing.type";
import UploadCSVButton from "@/components/upload-csv/uploadCSVButton"
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Controller, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

const profileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email("Please provide a valid email"),
  phone_number: z.string().nonempty("Phone number is required"),
  prompt: z.string(),
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

function getCurrentCounty(selectedState: State | "", selectedCounty: string) {
  if (selectedState === "")
    return "";
  let countyName = '';
  const county = selectedState.county_list.find(county => county.county_id === selectedCounty);
  if (county)
    countyName = county.county_name;
  return countyName;
}

export default function Page() {
  const user = useAppSelector(state => state.auth?.user);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
    control,
  } = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  });
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<State | "">("");
  const [selectedCounty, setSelectedCounty] = useState<string | "">("");
  const [uploadDisabled, setUploadDisabled] = useState(false);

  const fetchStates = async () => {
    const res = await billingService.getStateList();
    setStates(res);
  };

  const handleStateChange = (e: SelectChangeEvent) => {
    const id = e.target.value;
    const state = states.find((item) => item.state_id === id) || "";
    if (state === "") setSelectedCounty("");
    setSelectedState(state);
  };

  const handleCountyChange = (e: SelectChangeEvent) => {
    const id = e.target.value;
    setSelectedCounty(id);
  };

  useEffect(() => {
    if (window.innerWidth < 640) {
      setIsMobileWidth(true);
    } else {
      setIsMobileWidth(false);
    }
  }, []);
  
  useEffect(() => {
    try {
      const fetchProfile = async () => {
        const response = await profileService.getProfileInfo();
        console.log(response);
        reset(response);
      }
      fetchProfile();
      fetchStates();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, [])

  useEffect(() => {
    if (selectedState.toString().length > 0 && selectedCounty.toString().length > 0)
      setUploadDisabled(false);
    else
      setUploadDisabled(true);
  }, [selectedState, selectedCounty])

  const onSubmit = async (formData: TProfileSchema) => {
    try {
      const setProfile = async () => {
        const response = profileService.setProfileInfo(formData);
        console.log(response)
      }
      setProfile();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  console.log(user)
  return (
    <>
      <div className="flex justify-between mb-4 items-center p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Profile</div>
      </div>
      <Divider />
      <form className="mt-8 xl:w-[50rem] w-full" onSubmit={handleSubmit(onSubmit)}>
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

        <Controller
          name="phone_number"
          control={control}
          defaultValue={getValues("phone_number" || "")}
          render={({ field }: { field: ControllerRenderProps<TProfileSchema, "phone_number"> }) => (
            <div style={{ marginTop: '1rem' }}>
              <PhoneInput
                country={'us'}
                value={field.value || ""}
                onChange={(value) => field.onChange({ target: { name: field.name, value } })}
                onBlur={field.onBlur}
                inputProps={{
                  name: field.name,
                  ref: field.ref,
                  required: true,
                }}
                inputStyle={{ width: '100%' }}
              />
              {errors.phone_number && (
                <p style={{ color: 'red' }}>{errors.phone_number.message}</p>
              )}
            </div>
          )}
        />

        {
          user.tier == 6 && (
            <>
              <div className="flex mt-8 gap-2 mb-8">
                <div className="w-60">
                  <FormControl size="small" fullWidth>
                    <InputLabel id="state-filter-label">Select state</InputLabel>
                    <Select
                      labelId="state-filter-label"
                      id="state-filter"
                      label="Select state"
                      name="state"
                      value={selectedState && selectedState.state_id}
                      onChange={handleStateChange}
                      MenuProps={MenuProps}
                    >
                      {states.map((state) => (
                        <MenuItem key={state.state_id} value={state.state_id}>
                          {state.state_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-60">
                  <FormControl size="small" fullWidth>
                    <InputLabel id="state-filter-label">Select county</InputLabel>
                    <Select
                      labelId="state-filter-label"
                      id="state-filter"
                      label="Select county"
                      value={selectedCounty}
                      onChange={handleCountyChange}
                      MenuProps={MenuProps}
                      name="county"
                      disabled={!selectedState}
                    >
                      {selectedState &&
                        selectedState.county_list.map((county) => (
                          <MenuItem key={county.county_id} value={county.county_id}>
                            {county.county_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-60">
                  <UploadCSVButton disabled={uploadDisabled} state={selectedState ? selectedState.state_name : ""} county={getCurrentCounty(selectedState, selectedCounty)} />
                </div>
              </div>
              <Box fontWeight={"bold"}>Prompt</Box>
              <FormControl fullWidth>
                <TextareaAutosize
                  minRows={4}
                  maxRows={12}
                  placeholder="Enter prompt here..."
                  {...register("prompt")} // Register the textarea  
                  style={{ width: '100%', boxSizing: 'border-box' }} // Add padding and box-sizing  
                />
              </FormControl>
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
            </>
          )
        }
        
      </form>
    </>
  );
}
