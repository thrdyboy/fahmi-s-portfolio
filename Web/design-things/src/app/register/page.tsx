"use client"

import Wrapper from "<prefix>/components/wrapper";
import { SignUpAcc } from "<prefix>/services/accountService";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as Yup from "yup";

const regScheme = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters long")
        .required("Password is required"),
    role: Yup.string()
        .oneOf(["user", "author"], "Invalid role")
        .required("Role is required"),
})

const initialValues = {
    name: "",
    email: "",
    username: "",
    password: "",
    role: "user",
}

export default function Register() {
    const router = useRouter();
    const HandlingSubmit = async (
        data: typeof initialValues,
        actions: FormikHelpers<typeof initialValues>
    ) => {
        try {
            const success = await SignUpAcc(data);
            if (success) {
                toast.success("Account created successfully")
                actions.resetForm();
                router.push("/");
            } else {
                toast.error("Registration failed!")
            }
        } catch (error: any) {
            console.error("Error during Registration: ", error);
            const errMsg = error.response?.data?.message || "Registration Failed";
            toast.error(errMsg);
            actions.setSubmitting(false);
        }
    };

    return (
        <Wrapper>
            <div className="flex justify-center items-center w-full h-full">
                <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <Link href={'/'}>
                            <p className="text-gray-500 hover:text-blue-600 text-lg font-medium cursor-pointer">
                                ← Go back
                            </p>
                        </Link>
                        <div className="flex items-center">
                            <span className="text-gray-500 text-lg">Have an account?</span>
                            <Link href={'/login'}>
                                <span className="text-blue-600 font-medium hover:underline cursor-pointer ml-2">
                                    Sign In
                                </span>
                            </Link>
                        </div>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={regScheme}
                        onSubmit={HandlingSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                                    Sign up to Web Story
                                </h1>

                                <div className="space-y-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="name">
                                            Full Name
                                        </label>
                                        <Field
                                            id="name"
                                            type="text"
                                            name="name"
                                            placeholder="Enter your full name"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <Field
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="username">
                                            Username
                                        </label>
                                        <Field
                                            type="text"
                                            name="username"
                                            placeholder="Choose a username"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                                        />
                                        <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="password">
                                            Password
                                        </label>
                                        <Field
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder="Create a password"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                                        />
                                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="role">
                                            Role
                                        </label>
                                        <Field
                                            as="select"
                                            name="role"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                                        >
                                            <option value="user">User</option>
                                            <option value="author">Author</option>
                                        </Field>
                                        <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 py-3 rounded-lg text-white text-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Submitting..." : "Create Account"}
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Wrapper>
    )
}