import React, { useState } from "react";
import { X, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface LanguageOtpModalProps {
  onClose: () => void;
  onVerified: () => void;
}

const LanguageOtpModal = ({
  onClose,
  onVerified,
}: LanguageOtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const verifyOTP = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be a 6-digit number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/language/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Invalid OTP. Please try again."
        );
        return;
      }

      if (data.success && data.verified) {
        toast.success(
          "French language verified successfully."
        );

        onVerified();
      } else {
        setError("OTP verification failed.");
      }
    } catch (error) {
      console.error(
        "Verify language OTP error:",
        error
      );

      setError(
        "Unable to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setResending(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/language/send-otp",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to resend OTP."
        );
        return;
      }

      if (data.success) {
        setOtp("");

        toast.success(
          "A new OTP has been sent to your email."
        );
      } else {
        setError("Failed to resend OTP.");
      }
    } catch (error) {
      console.error(
        "Resend language OTP error:",
        error
      );

      setError(
        "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        overflow-y-auto
        bg-black/50
        px-3 py-4
        sm:px-5 sm:py-6
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-md
          max-h-[calc(100vh-2rem)]
          overflow-y-auto
          rounded-2xl
          bg-white
          p-5
          shadow-2xl
          sm:p-6
          md:p-7
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-3 top-3
            flex h-9 w-9
            items-center justify-center
            rounded-full
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-700
            sm:right-4 sm:top-4
          "
          aria-label="Close"
        >
          <X size={19} />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center sm:mb-5">
          <div
            className="
              flex
              h-12 w-12
              items-center justify-center
              rounded-full
              bg-blue-50
              text-blue-600
              sm:h-14 sm:w-14
            "
          >
            <Mail
              size={23}
              className="sm:h-[26px] sm:w-[26px]"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="px-1 text-center sm:px-2">
          <h2
            className="
              text-lg
              font-bold
              leading-6
              text-gray-900
              sm:text-xl
              sm:leading-7
            "
          >
            French Language Verification
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-sm
              text-xs
              leading-5
              text-gray-500
              sm:text-sm
              sm:leading-6
            "
          >
            We have sent a 6-digit verification
            code to your registered email address.
          </p>
        </div>

        {/* OTP input */}
        <div className="mt-5 sm:mt-6">
          <label
            htmlFor="language-otp"
            className="
              mb-2
              block
              text-xs
              font-semibold
              text-gray-700
              sm:text-sm
            "
          >
            Enter OTP
          </label>

          <input
            id="language-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              const value = event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

              setOtp(value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                verifyOTP();
              }
            }}
            placeholder="Enter 6-digit OTP"
            className="
              w-full
              rounded-xl
              border border-gray-300
              px-3 py-3
              text-center
              text-base
              font-semibold
              tracking-[0.3em]
              outline-none
              transition
              placeholder:tracking-normal
              placeholder:text-gray-400
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              sm:px-4
              sm:py-3.5
              sm:text-lg
              sm:tracking-[0.4em]
            "
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="
              mt-2
              text-center
              text-xs
              font-medium
              leading-5
              text-red-500
              sm:mt-3
              sm:text-sm
            "
          >
            {error}
          </p>
        )}

        {/* Verify */}
        <button
          type="button"
          onClick={verifyOTP}
          disabled={loading || resending}
          className="
            mt-4
            flex
            min-h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:mt-5
            sm:min-h-12
            sm:text-base
          "
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend */}
        <div
          className="
            mt-4
            flex
            flex-wrap
            items-center
            justify-center
            gap-1
            text-center
          "
        >
          <span
            className="
              text-xs
              text-gray-500
              sm:text-sm
            "
          >
            Didn't receive the code?
          </span>

          <button
            type="button"
            onClick={resendOTP}
            disabled={loading || resending}
            className="
              text-xs
              font-semibold
              text-blue-600
              transition
              hover:text-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:text-sm
            "
          >
            {resending
              ? "Sending..."
              : "Resend OTP"}
          </button>
        </div>

        {/* Cancel */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading || resending}
          className="
            mt-2
            min-h-10
            w-full
            rounded-xl
            px-4
            py-2.5
            text-xs
            font-semibold
            text-gray-600
            transition
            hover:bg-gray-100
            disabled:opacity-50
            sm:mt-3
            sm:min-h-11
            sm:py-3
            sm:text-sm
          "
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LanguageOtpModal;