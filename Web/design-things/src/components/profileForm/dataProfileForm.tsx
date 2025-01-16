import React, { useState } from "react";
import { useAuth } from "<prefix>/context/userContext";
import { CreateProfile } from "<prefix>/services/accountService";
import { createProfile } from "<prefix>/types/account";
import { toast } from "react-toastify";

const CreateProfileComponents: React.FC = () => {
    const [bio, setBio] = useState<string>('')
    const [avatar, setAvatar] = useState<File | null>(null)
    const [review, setReview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { user } = useAuth()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatar(file)
        }
    }

    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setReview(null)

        if (user?.token) {
            try {
                const formData = {
                    bio,
                    avatarUrl: avatar
                }

                const response = await CreateProfile(formData as createProfile, user?.token)

                if (response) {
                    toast.success("Profile Created")
                    setReview("Profile created Succesfully")
                } else {
                    toast.error("Failed to make the Profile")
                    setReview("Failed to make the Profile")
                }

            } catch (error) {
                console.error("Error creating Profile: ", error)
                setReview("An Error Occured. Please Try Again")

            } finally {
                setIsSubmitting(false)
            }
        }

    }

    return (
        <div>
            <h1>Create Profile</h1>
            <form onSubmit={HandleSubmit}>
                <div>
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="avatar">Avatar:</label>
                    <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Create Profile"}
                </button>
            </form>

            {review && <p>{review}</p>}
        </div>
    )
}

export default CreateProfileComponents