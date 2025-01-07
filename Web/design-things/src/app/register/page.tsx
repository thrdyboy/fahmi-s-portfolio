'use client'

import Wrapper from '<prefix>/components/wrapper'
import { SignUpAcc } from '<prefix>/services/accountService'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

const regScheme = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters long").required("Password is required"),
    role: Yup.string().oneOf(["user", "author"], "Invalid role").required("Role is required"),
})

const initialValues = {
    name: "",
    email: "",
    username: "",
    password: "",
    role: "user"
}

export default function Register() {
    const router = useRouter()
    const HandlingSubmit = async (data: typeof initialValues, actions: FormikHelpers<typeof initialValues>) => {
        try {
            const success = await SignUpAcc(data)
            if (success) {
                toast.success("Account created successfully")
                actions.resetForm()
                router.push('/')
            } else {
                toast.error("Registration failed!")
            }

        } catch (error: any) {
            console.error("Error during Registration: ", error)
            const errMsg = error.response?.data?.message || "Registration Failed"
            toast.error(errMsg)
            actions.setSubmitting(false)
        }
    }

    return (
        <Wrapper>
            <div className="w-[1248px] h-[755px] bg-white relative overflow-hidden rounded-lg shadow-lg">
                {/* Left Image Section */}
                <img
                    className="w-[590px] h-[780px] absolute left-0 top-[-23px] object-cover"
                    src="https://via.placeholder.com/590x780"
                    alt="Placeholder"
                />

                {/* Go Back Link */}
                <div className="absolute left-[649px] top-[37px] flex items-center gap-2">
                    <Link href={'/'}><p className="text-[#61758a] text-lg font-Roboto cursor-pointer">Go back</p></Link>
                </div>

                {/* Sign-In Link */}
                <div className="absolute right-[70px] top-[37px] flex items-center">
                    <span className="text-[#61758a] text-lg font-normal font-Roboto">Have an account? </span>
                    <Link href={'/login'}><span className="text-[#61758a] text-lg font-normal font-Roboto underline cursor-pointer ml-2">Sign In</span></Link>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={regScheme}
                    onSubmit={HandlingSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="absolute w-[460px] top-[110px] left-[684px]">
                            <h1 className="text-[#3e42db] text-[32px] font-semibold mb-6">Sign up to Web Story</h1>

                            <div className="mb-4">
                                <label className="block text-[#3e42db] text-lg font-medium mb-2" htmlFor="name">Full Name</label>
                                <Field
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Fill your Name"
                                    className="w-full h-[59px] px-5 py-[19px] rounded-lg shadow-sm border border-[#3e42db] text-[#343030] text-lg"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[#333030] text-lg font-medium mb-2" htmlFor="email">Email</label>
                                <Field
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Your email"
                                    className="w-full h-[59px] px-5 py-[19px] rounded-lg border border-[#b0b3ad] text-[#61758a] text-lg"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[#333030] text-lg font-medium mb-2" htmlFor="username">Username</label>
                                <Field
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                />
                                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[#333030] text-lg font-medium mb-2" htmlFor="password">Password</label>
                                <Field
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full h-[59px] px-5 py-[19px] rounded-lg border border-[#b0b3ad] text-[#61758a] text-lg"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <Field
                                    as="select"
                                    name="role"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    <option value="user">User</option>
                                    <option value="author">Author</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    className="w-full bg-[#3e42db] py-[17px] rounded-lg text-white text-xl font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Create account"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Wrapper>
    )
}