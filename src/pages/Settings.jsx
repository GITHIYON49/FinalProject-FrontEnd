import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { logout } from "../features/authSlice";
import { clearAuthData } from "../utils/authHelper";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";

const Settings = () => {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyDigest: false,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Settings updated");
  };

  const handleDeleteAccount = async () => {
    try {
      await userAPI.delete(user._id);

      toast.success("Account deleted successfully");
      clearAuthData();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your application preferences
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>

        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              title: "Email Notifications",
              description: "Receive notifications via email",
            },
            {
              key: "pushNotifications",
              title: "Push Notifications",
              description: "Receive browser push notifications",
            },
            {
              key: "taskReminders",
              title: "Task Reminders",
              description: "Get reminders for upcoming task deadlines",
            },
            {
              key: "weeklyDigest",
              title: "Weekly Digest",
              description: "Receive a weekly summary of your activity",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-gray-200 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings[item.key] ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings[item.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-red-900">
              Danger Zone
            </h2>
            <p className="text-sm text-red-700 mt-1">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteDialog(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
        >
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>

      {showDeleteDialog && (
        <DeleteAccountDialog
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
};

const DeleteAccountDialog = ({ onConfirm, onCancel }) => {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Delete Account
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              This action cannot be undone. This will permanently delete your
              account and remove all your data.
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4">
          <p className="text-sm text-red-800 font-medium mb-2">
            Please type <span className="font-bold">DELETE</span> to confirm:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            autoFocus
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== "DELETE"}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
