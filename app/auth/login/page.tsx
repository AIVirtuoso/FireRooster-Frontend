'use client';
import { Alert, CircularProgress, Snackbar, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth';
import { useState } from 'react';
import { useErrorMessage } from '@/hooks/useGlobalError';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '@/hooks/store.hooks';
import { setUserData } from '@/store/slices/auth.slice';

const loginSchema = z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type TLoginSchema = z.infer<typeof loginSchema>;

export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        getValues,
        setValue,
    } = useForm<TLoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const router = useRouter();
    const dispatch = useAppDispatch();

    const [openSnack, setOpenSnack] = useState(false);
    const { errorMessage, handleError, clearErrorMessage } = useErrorMessage();
    console.log('BASE_URL', process.env.NEXT_PUBLIC_SERVER_BASE_URL);
    const onSubmit = async (data: TLoginSchema) => {
        try {
            const resp = await authService.logIn(data);
            console.log('loginResp ', resp);
            clearErrorMessage();
            const authToken = resp?.access_token;
            if (authToken) localStorage.setItem('auth', authToken);
            const user = resp?.user;
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                dispatch(setUserData(user));
            }
            reset();
            router.push('/dashboard/alerts');
        } catch (error) {
            handleError(error);
            handleOpenSnack();
            console.log('Login error', error);
        }
    };

    const handleOpenSnack = () => {
        setOpenSnack(true);
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpenSnack(false);
    };

    return (
        <>
            <div className="text-3xl font-bold mb-6">Sign in</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    {...register('email', { value: getValues('email') || '' })}
                    error={Boolean(errors?.email?.message)}
                    variant="outlined"
                    label="Email"
                    helperText={errors?.email?.message}
                    onChange={(e) => setValue('email', e.target.value)}
                />
                <TextField
                    {...register('password', { value: getValues('password') || '' })}
                    error={Boolean(errors?.password?.message)}
                    variant="outlined"
                    label="Password"
                    type="password"
                    helperText={errors?.password?.message}
                    onChange={(e) => setValue('password', e.target.value)}
                />
                <div className="text-lg">
                    By accessing this site, you agree to the{' '}
                    <a className="text-gray-400 hover:underline hover:text-gray-500" href="#">
                        Terms of Service
                    </a>
                </div>
                {/* <button
          className="bg-sky-400 hover:bg-sky-500 text-white py-3 rounded-md"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Sign In"}
        </button> */}
                <LoadingButton
                    sx={{
                        [`&:hover`]: { background: 'rgba(30, 41, 59, 0.8)' },
                        background: 'rgb(30, 41, 59)',
                        padding: '10px 20px',
                    }}
                    loading={isSubmitting}
                    variant="contained"
                    type="submit"
                >
                    Sign in
                </LoadingButton>
                <div className="flex justify-between">
                    <div>
                        Don&apos;t have an account?
                        <Link className="text-gray-400 hover:underline hover:text-gray-500 mx-1" href="signup">
                            Sign up
                        </Link>
                    </div>
                    <a className="text-gray-400 hover:underline hover:text-gray-500" href="#">
                        Forgot password
                    </a>
                </div>
            </form>

            {errorMessage && (
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
