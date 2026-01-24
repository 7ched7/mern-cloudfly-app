import { Link } from "react-router-dom";
import { CustomButton, InputField } from "../global/FormElements";
import { Title } from "../global/Titles";
import useCustomToast from "@/hooks/useCustomToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { forgotPassword } from "@/store/user/userSlice";
import { useRef } from "react";

interface ForgotPasswordForm {
    email: string;
}

export default function ForgotPasswordForm() {
    // redux
    const isLoading = useAppSelector((state) => state.user.isLoading);
    const dispatch = useAppDispatch();

    // toast
    const showToast = useCustomToast();

    // ref
    const emailRef = useRef<null | HTMLInputElement>(null);

    // handle forgot password
    const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(
            formData.entries()
        ) as unknown as ForgotPasswordForm;

        dispatch(forgotPassword(data)).unwrap().then((res) => {
            showToast(res.message);

            // clear input
            if (emailRef.current) {
                emailRef.current.value = "";
            }
            
        }).catch((err) => {
            showToast(err, false);
        });
    };

    return (
        <form
            onSubmit={handleForgotPassword}
            className="w-[500px] flex justify-center flex-col gap-y-4 p-8 rounded-md"
        >
            <Title className="text-center text-4xl mb-4">Forgot your password?</Title>

            <div>
                <InputField 
                    className="h-12"
                    type="email" 
                    placeholder="Enter your email" 
                    id="email" 
                    name="email" 
                    ref={emailRef}
                />
            </div>
            <CustomButton className="h-12" loading={isLoading}>Send reset password link</CustomButton>
            <Link to="/auth/login" className="text-bluedefault underline text-xs">
                Go back
            </Link>
        </form>
    );

}
