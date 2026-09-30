"use client";

import { selectuser } from "@/Feature/Userslice";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Image, Send, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { t } = useLanguage();
  const user = useSelector(selectuser);
  const currentUserId = user?._id || user?.id || "";

  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/")
    ) {
      toast.error(t("publicSpace.createPost.selectMedia"));
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreatePost = async () => {
    if (!currentUserId) {
      toast.error(t("publicSpace.loginFirst"));
      return;
    }

    if (!selectedFile) {
      toast.error(t("publicSpace.createPost.selectMedia"));
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("userId", currentUserId);
      formData.append("caption", caption.trim());
      formData.append("media", selectedFile);

      const response = await fetch(
        "http://internshala-backend-5ycp.onrender.com/api/posts/create",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("CREATE POST RESPONSE:", data);

      if (!response.ok) {
        // Show the actual backend message.
        toast.error(data.message || t("publicSpace.createPost.failedCreate"));
        return;
      }

      toast.success(t("publicSpace.createPost.postCreated"));

      setCaption("");
      removeFile();

      onPostCreated();
    } catch (error: any) {
      console.error("Create post error:", error);

      toast.error(
        error?.message || t("publicSpace.createPost.unableToConnect")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {t("publicSpace.createPost.title")}
      </h2>

      <p className="text-sm text-gray-500 mt-1 mb-5">
        {t("publicSpace.createPost.subtitle")}
      </p>

      {/* Caption */}
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder={t("publicSpace.createPost.placeholder")}
        rows={4}
        className="w-full resize-none rounded-xl border border-gray-500 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-500 text-gray-700"
      />

      {/* Media button */}
      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          <Image size={18} />
          {t("publicSpace.createPost.photoVideo")}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*, video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Preview */}
      {previewUrl && selectedFile && (
        <div className="relative mt-4 rounded-xl overflow-hidden border border-gray-200">
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 z-10 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
          >
            <X size={18} />
          </button>

          {selectedFile.type.startsWith("video/") ? (
            <video
              src={previewUrl}
              controls
              className="w-full max-h-72 object-contain bg-black"
            />
          ) : (
            <img
              src={previewUrl}
              alt={t("publicSpace.createPost.previewAlt")}
              className="w-full max-h-72 object-contain"
            />
          )}
        </div>
      )}

      {/* Selected File */}
      {selectedFile && (
        <p className="text-xs text-gray-500 mt-2 truncate">
          {selectedFile.name}
        </p>
      )}

      {/* Post Button */}
      <button
        type="button"
        onClick={handleCreatePost}
        disabled={loading}
        className="w-full mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={18} />

        {loading ? t("publicSpace.createPost.posting") : t("publicSpace.createPost.post")}
      </button>
    </div>
  );
};

export default CreatePost;