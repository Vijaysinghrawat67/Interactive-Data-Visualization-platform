import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/services/axios";
import { toast } from "sonner";
import {
  Loader,
  Pencil,
  Save,
  X,
  Github,
  Linkedin,
  Globe,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  bio: Yup.string().optional(),
  location: Yup.string().optional(),
  website: Yup.string().url("Invalid URL").optional(),
  github: Yup.string().url("Invalid URL").optional(),
  linkedin: Yup.string().url("Invalid URL").optional(),
});

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);

  // Fetch user profile details from API
  const fetchUser = async () => {
    try {
      const res = await api.get("/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = res.data.data;
      setUser(userData);
    } catch (err) {
      toast.error("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phNumber: user?.phNumber || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.socialLinks?.website || "",
      github: user?.socialLinks?.github || "",
      linkedin: user?.socialLinks?.linkedin || "",
      profileImage: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      try {
        await api.put("/api/v1/user/update-profile", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Profile updated!");
        setEditMode(false);
        fetchUser(); // Reload updated profile data
      } catch (err) {
        toast.error("Profile update failed.");
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("profileImage", file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("profileImage", null);
    setPreview(null);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {editMode ? (
            <>
              <X className="w-4 h-4" /> Cancel
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" /> Edit
            </>
          )}
        </button>
      </div>

      {/* Display user profile or edit form based on editMode */}
      {!editMode ? (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={user?.profileImage || "/placeholder.jpg"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
              />
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
                <p className="text-gray-500">@{user.username}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-md">{user.bio || "No bio available"}</p>
              </div>
            </div>

            {/* Display Email, Phone, Location */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-700 dark:text-gray-300 mt-4">
              {user.email && (
                <DetailRow icon={<Mail className="w-4 h-4 text-blue-600" />} label="Email" value={user.email} />
              )}
              {user.phNumber && (
                <DetailRow icon={<Phone className="w-4 h-4 text-blue-600" />} label="Phone" value={user.phNumber} />
              )}
              {user.location && (
                <DetailRow icon={<MapPin className="w-4 h-4 text-blue-600" />} label="Location" value={user.location} />
              )}
            </div>
          </div>

          {/* Display Social Links */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Social & Website</h3>
            <div className="flex flex-wrap gap-6 text-sm text-gray-700 dark:text-gray-300">
              {user.socialLinks?.website && (
                <DetailRow icon={<Globe className="w-4 h-4 text-blue-600" />} label="Website" value={user.socialLinks.website} />
              )}
              {user.socialLinks?.github && (
                <DetailRow icon={<Github className="w-4 h-4 text-blue-600" />} label="GitHub" value={user.socialLinks.github} />
              )}
              {user.socialLinks?.linkedin && (
                <DetailRow icon={<Linkedin className="w-4 h-4 text-blue-600" />} label="LinkedIn" value={user.socialLinks.linkedin} />
              )}
            </div>
          </div>
        </div>
      ) : (
        // Edit Form
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="name" value={formik.values.name} onChange={formik.handleChange} label="Name" error={formik.errors.name} />
          <Input name="email" value={formik.values.email} onChange={formik.handleChange} label="Email" error={formik.errors.email} />
          <Input name="phNumber" value={formik.values.phNumber} onChange={formik.handleChange} label="Phone" error={formik.errors.phNumber} />
          <Input name="location" value={formik.values.location} onChange={formik.handleChange} label="Location" />
          <Input name="bio" value={formik.values.bio} onChange={formik.handleChange} label="Bio" />
          <Input name="website" value={formik.values.website} onChange={formik.handleChange} label="Website" />
          <Input name="github" value={formik.values.github} onChange={formik.handleChange} label="GitHub" />
          <Input name="linkedin" value={formik.values.linkedin} onChange={formik.handleChange} label="LinkedIn" />
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Profile Image</label>
            <input type="file" name="profileImage" onChange={handleImageChange} accept="image/*" />
            {preview || user?.profileImage ? (
              <div className="mt-2">
                <img
                  src={preview || user?.profileImage}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-500 text-xs mt-1 hover:underline"
                >
                  Remove Image
                </button>
              </div>
            ) : null}
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Input Component for reusable form fields
const Input = ({ label, name, value, onChange, type = "text", error }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md p-2 border border-gray-300 dark:bg-slate-800 dark:text-white"
    />
    {error && <div className="text-red-500 text-xs">{error}</div>}
  </div>
);

// DetailRow component for displaying details like Email, Phone, etc.
const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
    <div className="flex items-center gap-2 min-w-[90px] font-medium text-gray-600 dark:text-gray-400">
      {icon} {label}:
    </div>
    <div>
      {value ? (
        <a href={value} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      ) : (
        <span className="text-gray-400">Not provided</span>
      )}
    </div>
  </div>
);
