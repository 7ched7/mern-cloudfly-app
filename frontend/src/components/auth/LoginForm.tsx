import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomButton, InputWithLabel } from "../global/FormElements";
import { Title } from "../global/Titles";
import GoogleSign from "./GoogleSign";
import useCustomToast from "@/hooks/useCustomToast";
import { loginUser, setUser } from "@/store/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginForm() {
    // redux
    const isLoading = useAppSelector((state) => state.user.isLoading);
    const dispatch = useAppDispatch();

    // navigate
    const navigate = useNavigate();

    // toast
    const showToast = useCustomToast();

    // ref
    const emailRef = useRef<null | HTMLInputElement>(null);
    const passwordRef = useRef<null | HTMLInputElement>(null);

     // button loading
    const [btnLoading, setBtnLoading] = useState(false);

    // handle login
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(
            formData.entries()
        ) as unknown as LoginForm;

        setBtnLoading(true);
        dispatch(loginUser(data)).unwrap().then((res) => {     
            showToast(`Welcome, ${res?.firstName}!`);
            
            // clear inputs
            if (emailRef.current && passwordRef.current) {
                emailRef.current.value = "";
                emailRef.current.disabled = true;
                passwordRef.current.value = "";
                passwordRef.current.disabled = true;
            }

            // set and redirect user
            setTimeout(() => {
                dispatch(setUser(res));
                navigate("/drive");
                setBtnLoading(false);
            }, 1000);
        }).catch((err) => {
            showToast(err, false);
            setBtnLoading(false);
        });
    };

    return (
        <form
            onSubmit={handleLogin}
            className="w-[500px] flex justify-center flex-col gap-y-4 p-8 rounded-md"
        >
            <Title className="text-center text-4xl mb-4">Login</Title>
            
            <GoogleSign />
            <div className="flex w-full items-center gap-2 text-xs">
                <div className="h-px w-full bg-[#E4E4E7] dark:bg-[#353535]"></div>
                OR
                <div className="h-px w-full bg-[#E4E4E7] dark:bg-[#353535]"></div>
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
                    id="password" name="password" 
                    ref={passwordRef}
                />
            </div>
            <CustomButton className="h-12" disabled={btnLoading} loading={isLoading}>Login</CustomButton>
            <div className="flex justify-between">
                <p className="text-xs">
                    Not a member yet?{" "}
                    <Link to="/auth/register" className="text-bluedefault underline">
                        Register
                    </Link>
                </p>
                <Link to="/auth/forgot-password" className="text-bluedefault underline text-xs">
                        Forgot Password
                </Link>
            </div>
        </form>
    );
}
