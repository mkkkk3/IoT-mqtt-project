import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationContext from "../../store/notification-context";

function Notification(props) {
  const notificationCtx = useContext(NotificationContext);

  const { title, message, status } = props;

  let typeOfNotificationSVG;

  if (status === "success") {
    typeOfNotificationSVG = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#FBF4EE"
        version="1.1"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <g>
          <path d="M448 256c-11.782 0-21.333 9.551-21.333 21.333V448h-384V64h384c0 11.782 9.551 21.333 21.333 21.333 11.782 0 21.333-9.551 21.333-21.333V42.667c0-11.782-9.551-21.333-21.333-21.333H21.333C9.551 21.333 0 30.885 0 42.667v426.667c0 11.782 9.551 21.333 21.333 21.333H448c11.782 0 21.333-9.551 21.333-21.333v-192c0-11.783-9.551-21.334-21.333-21.334z"></path>
          <path d="M505.752 91.582c-8.331-8.331-21.839-8.331-30.17 0l-236.25 236.25-71.476-125.083c-5.846-10.23-18.877-13.784-29.107-7.938-10.23 5.846-13.784 18.877-7.938 29.107l85.333 149.333c6.979 12.213 23.661 14.447 33.607 4.501l256-256c8.332-8.332 8.332-21.839.001-30.17z"></path>
        </g>
      </svg>
    );
  }

  if (status === "error") {
    typeOfNotificationSVG = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 16"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path
          fill="#FBF4EE"
          fillRule="evenodd"
          d="M7.493.015l-.386.04c-1.873.187-3.76 1.153-5.036 2.579C.66 4.211-.057 6.168.009 8.253c.115 3.601 2.59 6.65 6.101 7.518a8.034 8.034 0 006.117-.98 8 8 0 003.544-4.904c.172-.701.212-1.058.212-1.887s-.04-1.186-.212-1.887C14.979 2.878 12.315.498 9 .064 8.716.027 7.683-.006 7.493.015m1.36 1.548a6.519 6.519 0 013.091 1.271c.329.246.976.893 1.222 1.222.561.751.976 1.634 1.164 2.479a6.766 6.766 0 010 2.93c-.414 1.861-1.725 3.513-3.463 4.363a6.76 6.76 0 01-1.987.616c-.424.065-1.336.065-1.76 0-1.948-.296-3.592-1.359-4.627-2.993a7.502 7.502 0 01-.634-1.332A6.158 6.158 0 011.514 8c0-1.039.201-1.925.646-2.84.34-.698.686-1.18 1.253-1.747A5.956 5.956 0 015.16 2.16a6.452 6.452 0 013.693-.597M7.706 4.29c-.224.073-.351.201-.413.415-.036.122-.04.401-.034 2.111.008 1.97.008 1.971.066 2.08a.687.687 0 00.346.308c.132.046.526.046.658 0a.687.687 0 00.346-.308c.058-.109.058-.11.066-2.08.008-2.152.008-2.154-.145-2.335-.124-.148-.257-.197-.556-.205a1.705 1.705 0 00-.334.014m.08 6.24a.858.858 0 00-.467.402.849.849 0 00-.025.563A.777.777 0 008 12c.303 0 .612-.22.706-.505a.849.849 0 00-.025-.563.948.948 0 00-.348-.352c-.116-.06-.429-.089-.547-.05"
        ></path>
      </svg>
    );
  }

  if (status === "pending") {
    typeOfNotificationSVG = (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-6 h-6 sm:w-8 sm:h-8 text-page4 animate-spin fill-page1"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  const closeNotificationSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="w-8 h-8 sm:w-10 sm:h-10 hover:scale-110 active:scale-90 duration-100 hover:cursor-pointer"
    >
      <g>
        <g>
          <path
            stroke="#FBF4EE"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 9l3 3m0 0l3 3m-3-3l-3 3m3-3l3-3M4 16.8V7.2c0-1.12 0-1.68.218-2.108.192-.377.497-.682.874-.874C5.52 4 6.08 4 7.2 4h9.6c1.12 0 1.68 0 2.108.218a2 2 0 01.874.874C20 5.52 20 6.08 20 7.2v9.6c0 1.12 0 1.68-.218 2.108a2.001 2.001 0 01-.874.874c-.428.218-.986.218-2.104.218H7.197c-1.118 0-1.678 0-2.105-.218a2 2 0 01-.874-.874C4 18.48 4 17.92 4 16.8z"
          ></path>
        </g>
      </g>
    </svg>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: -500 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 1, y: -500 }}
        className="fixed top-0 w-full py-2 px-10 sm:px-20 md:px-16 lg:px-20 h-28 flex justify-end z-50"
      >
        <div className="w-full md:w-2/3 lg:w-1/2 h-full bg-page1 shadow-2xl border-4 border-page1">
          <div className="w-full h-full grid grid-cols-12 bg-pageMenu">
            <div className="w-full h-full col-span-2 sm:col-span-2 flex items-center justify-center">
              {typeOfNotificationSVG}
            </div>
            <div className="w-full h-full col-span-8 sm:col-span-8 flex items-center justify-center p-3 overflow-hidden">
              <span className="font-body text-page1 text-base sm:text-lg font-bold tracking-wide">
                {message}
              </span>
            </div>
            <div
              className="w-full h-full col-span-2 sm:col-span-2 flex items-center justify-center"
              onClick={notificationCtx.hideNotification}
            >
              {closeNotificationSVG}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Notification;