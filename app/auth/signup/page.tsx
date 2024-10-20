"use client";
import { Alert, Snackbar, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import authService from "@/services/auth";
import { useRouter } from "next/navigation";
import { useErrorMessage } from "@/hooks/useGlobalError";
import { useState } from "react";

const signupSchema = z
  .object({
    email: z.string().email("Please provide a valid email"),
    first_name: z.string().min(1, "Field is required"),
    last_name: z.string().min(1, "Field is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    password2: z.string().min(1, "Passwords must match"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });
type TSignupSchema = z.infer<typeof signupSchema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();

  const [openSnack, setOpenSnack] = useState(false);
  const { errorMessage, handleError, clearErrorMessage } = useErrorMessage();

  const onSubmit = async (data: TSignupSchema) => {
    try {
      await authService.signUp(data);
      clearErrorMessage();
      reset();
      router.push("/auth/login");
    } catch (error) {
      handleError(error);
      handleOpenSnack();
      console.log("Signup error: ", error);
    }
  };

  const handleOpenSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnack(false);
  };

  return (
    <>
      <div className="text-3xl font-bold mb-6">Sign up</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("first_name", { value: getValues("first_name") })}
          error={Boolean(errors?.first_name?.message)}
          variant="outlined"
          label="First name"
          helperText={errors?.first_name?.message}
          onChange={(e) => setValue("first_name", e.target.value)}
        />
        <TextField
          {...register("last_name", { value: getValues("last_name") })}
          error={Boolean(errors?.last_name?.message)}
          variant="outlined"
          label="Last name"
          helperText={errors?.last_name?.message}
          onChange={(e) => setValue("last_name", e.target.value)}
        />
        <TextField
          {...register("email", { value: getValues("email") })}
          error={Boolean(errors?.email?.message)}
          variant="outlined"
          label="Email"
          helperText={errors?.email?.message}
          onChange={(e) => setValue("email", e.target.value)}
        />
        <TextField
          {...register("password", { value: getValues("password") })}
          error={Boolean(errors?.password?.message)}
          variant="outlined"
          label="Password"
          type="password"
          helperText={errors?.password?.message}
          onChange={(e) => setValue("password", e.target.value)}
        />
        <TextField
          {...register("password2", {
            value: getValues("password2"),
          })}
          error={Boolean(errors?.password2?.message)}
          variant="outlined"
          label="Confirm password"
          type="password"
          helperText={errors?.password2?.message}
          onChange={(e) => setValue("password2", e.target.value)}
        />
        <div className="text-lg">
          By accessing this site, you agree to the{" "}
          <a
            className="text-gray-400 hover:underline hover:text-gray-500 mx-1"
            href="#"
          >
            Terms of Service
          </a>
        </div>
        <LoadingButton
          sx={{
            [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
            background: "rgb(30, 41, 59)",
            padding: "10px 20px",
          }}
          loading={isSubmitting}
          variant="contained"
          type="submit"
        >
          Sign up
        </LoadingButton>
        <div className="flex justify-between">
          <div>
            Already have an account?
            <Link
              className="text-gray-400 hover:underline hover:text-gray-500 mx-1"
              href="login"
            >
              Log in
            </Link>
          </div>
        </div>
      </form>
      {errorMessage && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={openSnack}
          autoHideDuration={3000}
          onClose={handleCloseSnack}
        >
          <Alert severity="error" variant="filled" onClose={handleCloseSnack}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
