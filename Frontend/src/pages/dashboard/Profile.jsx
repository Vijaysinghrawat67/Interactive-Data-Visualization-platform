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
    enableReinitialize: true,
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
        setPreview(null);
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
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          My Profile
        </h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none rounded-md text-white font-semibold transition"
          aria-label={editMode ? "Cancel edit" : "Edit profile"}
        >
          {editMode ? (
            <>
              <X className="w-5 h-5" /> Cancel
            </>
          ) : (
            <>
              <Pencil className="w-5 h-5" /> Edit
            </>
          )}
        </button>
      </div>

      {/* Content */}
      {!editMode ? (
        <>
          {/* Profile Info Card */}
          <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={preview || user?.profileImage || "/placeholder.jpg"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 flex-shrink-0"
            />
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-blue-600 font-medium">@{user.username}</p>
              <p className="text-gray-700 dark:text-gray-300 text-base max-w-lg leading-relaxed">
                {user.bio || "No bio available."}
              </p>

              {/* Contact Info */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300 text-sm">
                {user.email && (
                  <DetailRow icon={<Mail className="w-5 h-5 text-blue-600" />} label="Email" value={`mailto:${user.email}`} />
                )}
                {user.phNumber && (
                  <DetailRow icon={<Phone className="w-5 h-5 text-blue-600" />} label="Phone" value={`tel:${user.phNumber}`} />
                )}
                {user.location && (
                  <DetailRow icon={<MapPin className="w-5 h-5 text-blue-600" />} label="Location" value={user.location} />
                )}
              </div>
            </div>
          </section>

          {/* Social & Website Card */}
          <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Social & Website
            </h3>
            <div className="flex flex-wrap gap-8 text-gray-700 dark:text-gray-300 text-sm">
              {user.socialLinks?.website && (
                <DetailRow icon={<Globe className="w-5 h-5 text-blue-600" />} label="Website" value={user.socialLinks.website} />
              )}
              {user.socialLinks?.github && (
                <DetailRow icon={<Github className="w-5 h-5 text-blue-600" />} label="GitHub" value={user.socialLinks.github} />
              )}
              {user.socialLinks?.linkedin && (
                <DetailRow icon={<Linkedin className="w-5 h-5 text-blue-600" />} label="LinkedIn" value={user.socialLinks.linkedin} />
              )}
              {!user.socialLinks?.website && !user.socialLinks?.github && !user.socialLinks?.linkedin && (
                <p className="text-gray-400 italic">No social or website links provided.</p>
              )}
            </div>
          </section>
        </>
      ) : (
        // Edit Form
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            label="Name"
            error={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
          />
          <Input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            label="Email"
            error={formik.touched.email && formik.errors.email}
            onBlur={formik.handleBlur}
          />
          <Input
            name="phNumber"
            value={formik.values.phNumber}
            onChange={formik.handleChange}
            label="Phone"
            error={formik.touched.phNumber && formik.errors.phNumber}
            onBlur={formik.handleBlur}
          />
          <Input
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            label="Location"
          />
          <Input
            name="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            label="Bio"
          />
          <Input
            name="website"
            value={formik.values.website}
            onChange={formik.handleChange}
            label="Website"
          />
          <Input
            name="github"
            value={formik.values.github}
            onChange={formik.handleChange}
            label="GitHub"
          />
          <Input
            name="linkedin"
            value={formik.values.linkedin}
            onChange={formik.handleChange}
            label="LinkedIn"
          />

          {/* Profile Image Upload */}
          <div className="col-span-2 flex flex-col items-start gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              onChange={handleImageChange}
              accept="image/*"
              className="text-sm text-gray-700 dark:text-gray-300"
            />
            {(preview || user?.profileImage) && (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={preview || user?.profileImage}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white rounded-md font-semibold flex items-center justify-center gap-2 transition"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Input component for form fields
const Input = ({ label, name, value, onChange, type = "text", error, onBlur }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`w-full rounded-md p-2 border ${
        error
          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      } dark:bg-slate-800 dark:text-white transition`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// DetailRow component to show label + icon + value/link
const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 min-w-[160px]">
    <div className="flex items-center gap-2 font-semibold text-gray-600 dark:text-gray-400">
      {icon} <span>{label}:</span>
    </div>
    <div className="truncate">
      {value ? (
        <a
          href={value}
          className="text-blue-600 hover:underline dark:text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
          title={value}
        >
          {value.length > 30 ? value.slice(0, 30) + "..." : value}
        </a>
      ) : (
        <span className="text-gray-400 italic">Not provided</span>
      )}
    </div>
  </div>
);
