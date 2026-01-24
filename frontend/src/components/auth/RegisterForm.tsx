import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomButton, InputWithLabel } from "../global/FormElements";
import { Title } from "../global/Titles";
import GoogleSign from "./GoogleSign";
import { registerUser } from "@/store/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import useCustomToast from "@/hooks/useCustomToast";

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default function RegisterForm() {
    // redux
    const isLoading = useAppSelector((state) => state.user.isLoading);
    const dispatch = useAppDispatch();

    // navigate
    const navigate = useNavigate();

    // toast
    const showToast = useCustomToast();

    // ref
    const firstNameRef = useRef<null | HTMLInputElement>(null);
    const lastNameRef = useRef<null | HTMLInputElement>(null);
    const emailRef = useRef<null | HTMLInputElement>(null);
    const passwordRef = useRef<null | HTMLInputElement>(null);

    // handle register
    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(
            formData.entries()
        ) as unknown as RegisterForm;

        dispatch(registerUser(data)).unwrap().then((res) => {
            showToast(res.message);

            // clear inputs
            if (firstNameRef.current && lastNameRef.current && emailRef.current && passwordRef.current) {
                firstNameRef.current.value = "";
                firstNameRef.current.disabled = true;
                lastNameRef.current.value = "";
                lastNameRef.current.disabled = true;
                emailRef.current.value = "";
                emailRef.current.disabled = true;
                passwordRef.current.value = "";
                passwordRef.current.disabled = true;
            }

            navigate("/auth/login");
        }).catch((err) => {
            showToast(err, false);
        });
    };

    return (
        <form
            onSubmit={handleRegister}
            className="w-[500px] flex justify-center flex-col gap-y-4 p-8 rounded-md"
        >
            <Title className="text-center text-4xl mb-4">Register</Title>

            <GoogleSign />
            <div className="flex w-full items-center gap-2 text-xs">
                <div className="h-px w-full bg-[#E4E4E7] dark:bg-[#353535]"></div>
                OR
                <div className="h-px w-full bg-[#E4E4E7] dark:bg-[#353535]"></div>
            </div>
            <div className="flex gap-2">
                <div>
                    <InputWithLabel 
                        className="h-12"
                        label="First Name" 
                        type="text" 
                        placeholder="First Name" 
                        id="firstName" 
                        name="firstName" 
                        ref={firstNameRef}
                    />
                </div>
                <div>
                    <InputWithLabel 
                        className="h-12"
                        label="Last Name" 
                        type="text" 
                        placeholder="Last Name" 
                        id="lastName" 
                        name="lastName" 
                        ref={lastNameRef}
                    />
                </div>
            </div>
            <div>
                <InputWithLabel 
                    className="h-12"
                    label="Email"
                    type="email" 
                    placeholder="Email" 
                    id="email" 
                    name="email" 
                    ref={emailRef}
                />
            </div>
            <div>
                <InputWithLabel 
                    className="h-12"
                    label="Password" 
                    type="password" 
                    placeholder="Password" 
                    id="password" 
                    name="password" 
                    ref={passwordRef}
                />
            </div>
            <CustomButton className="h-12" loading={isLoading}>Register</CustomButton>
            <p className="text-xs">
                Do you have an account?{" "}
                <Link to="/auth/login" className="text-bluedefault underline">
                    Login
                </Link>
            </p>
        </form>
    );
}
