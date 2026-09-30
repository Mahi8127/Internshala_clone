"use client";

import React, { useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MessageNotificationProps {
  senderName: string;
  message: string;
  onClick: () => void;
  onClose: () => void;
}

const MessageNotification = ({
  senderName,
  message,
  onClick,
  onClose,
}: MessageNotificationProps) => {
  const { t } = useLanguage();

  // Automatically close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      className="
        fixed
        bottom-[90px]
        right-6
        z-[9999]
        w-[380px]
        max-w-[calc(100vw-32px)]
        animate-[slideUp_0.35s_ease-out]
      "
    >
      <div
        onClick={onClick}
        className="
          relative
          w-full
          bg-white
          border
          border-gray-200
          rounded-2xl
          shadow-2xl
          px-4
          py-3
          flex
          items-center
          gap-3
          cursor-pointer
          hover:bg-gray-50
          transition-all
        "
      >
        {/* ================================
            CHAT ICON
        ================================= */}

        <div
          className="
            w-12
            h-12
            shrink-0
            rounded-full
            bg-green-500
            flex
            items-center
            justify-center
            text-white
          "
        >
          <MessageCircle size={25} strokeWidth={2} />
        </div>

        {/* ================================
            MESSAGE INFO
        ================================= */}

        <div
          className="
            flex-1
            min-w-0
            pr-5
          "
        >
          <p
            className="
              text-[16px]
              font-semibold
              text-gray-900
              truncate
            "
          >
            {senderName}
          </p>

          <p
            className="
              text-[15px]
              text-gray-500
              truncate
              mt-0.5
            "
          >
            {message}
          </p>
        </div>

        {/* ================================
            CLOSE BUTTON
        ================================= */}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="
            absolute
            top-3
            right-3
            w-6
            h-6
            rounded-full
            flex
            items-center
            justify-center
            text-gray-400
            hover:text-gray-700
            hover:bg-gray-100
            transition
          "
          aria-label={t("publicSpace.chat.closeNotification")}
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
};

export default MessageNotification;

