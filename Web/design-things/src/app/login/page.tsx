'use client'

import { Form, Formik, ErrorMessage, Field, FormikHelpers } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import { useAuth } from "<prefix>/context/userContext"
import { LoginData } from "<prefix>/types/account"
import { toast } from "react-toastify"
import Link from "next/link"
import Wrapper from "<prefix>/components/wrapper"

const LoginScheme = Yup.object().shape({
    username: Yup.string().required('Username Required'),
    password: Yup.string().required('Password required')
})

export default function Login() {
    const { login } = useAuth()
    const router = useRouter()
    const initialValues: LoginData = { username: '', password: '' }

    const SubmitHandling = async (data: LoginData, action: FormikHelpers<LoginData>) => {
        try {
            const Granted = await login(data)
            if (Granted) {
                toast.success('Login Successfully')
                action.resetForm()
                router.push('/')
            } else {
                toast.error('User is not Verified')
                action.resetForm()
            }
        } catch (error: any) {
            console.error("Error on Logging In: ", error)
            toast.error('Login Failed')
        }
    }

    return (
        <Wrapper>
            <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign In to Web Story</h1>
                <p className="text-lg text-center text-gray-600 mb-8">Please enter your credentials to continue</p>

                <Formik
                    initialValues={initialValues}
                    validationSchema={LoginScheme}
                    onSubmit={(values, action) => {
                        SubmitHandling(values, action)
                    }}
                >
                    {() => {
                        return (
                            <Form>
                                <div className="mb-4">
                                    <Field
                                        type='text'
                                        autoComplete='on'
                                        name='username'
                                        placeholder='Username'
                                        className='border-[1px] h-12 border-gray-300 rounded-sm px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    />
                                    <ErrorMessage
                                        name='username'
                                        component='div'
                                        className='text-[12px] text-red-500 mt-1'
                                    />
                                </div>

                                <div className="mb-6">
                                    <Field
                                        type='password'
                                        autoComplete='on'
                                        name='password'
                                        placeholder='Password'
                                        className='border-[1px] h-12 border-gray-300 rounded-sm px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    />
                                    <ErrorMessage
                                        name='password'
                                        component='div'
                                        className='text-[12px] text-red-500 mt-1'
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-yellow-400 px-6 py-3 rounded-md w-full text-white font-bold hover:brightness-105 hover:text-white transition"
                                >
                                    Log In
                                </button>

                                <div className="flex justify-center items-center mt-6">
                                    <p className="text-sm text-gray-600">Do not have an account?</p>
                                    <Link href={'/register'} className="text-blue-400 ml-2 text-sm font-semibold hover:underline">
                                        Sign up
                                    </Link>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </Wrapper>
    )
}
