import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditProfilePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        bio: "",
        link: "",
        profileImg: null,
        coverImg: null,
    });

    const { data: authUser, isLoading: isLoadingUser } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/users/profile/me");
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong!");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
    });

    // Set initial form data when authUser is loaded
    useEffect(() => {
        if (authUser) {
            setFormData(prev => ({
                ...prev,
                fullName: authUser.fullName || "",
                username: authUser.username || "",
                email: authUser.email || "",
                bio: authUser.bio || "",
                link: authUser.link || "",
                profileImg: authUser.profileImg || null,
                coverImg: authUser.coverImg || null,
            }));
        }
    }, [authUser]);

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async (formData) => {
            try {
                const res = await fetch("/api/users/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong!");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            navigate(`/profile/${formData.username}`);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Only include fields that have been changed
        const updatedData = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== "") {
                updatedData[key] = formData[key];
            }
        });
        updateProfile(updatedData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload an image file");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, [e.target.name]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoadingUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
            <div className="flex w-full border-b border-gray-700">
                <div className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer">
                    Edit Profile
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                </div>
            </div>

            <div className="p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Profile Image</label>
                        <input
                            type="file"
                            name="profileImg"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input file-input-bordered w-full max-w-xs"
                        />
                        {(formData.profileImg || authUser?.profileImg) && (
                            <img
                                src={formData.profileImg || authUser.profileImg}
                                alt="Profile preview"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Cover Image</label>
                        <input
                            type="file"
                            name="coverImg"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input file-input-bordered w-full max-w-xs"
                        />
                        {(formData.coverImg || authUser?.coverImg) && (
                            <img
                                src={formData.coverImg || authUser.coverImg}
                                alt="Cover preview"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="textarea textarea-bordered w-full"
                            placeholder="Write something about yourself"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Link</label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            placeholder="Add your website"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Change Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            placeholder="Current password"
                        />
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            placeholder="New password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn btn-primary w-full"
                    >
                        {isPending ? (
                            <span className="loading loading-spinner loading-md"></span>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage; 