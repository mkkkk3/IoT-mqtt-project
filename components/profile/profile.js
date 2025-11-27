import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NotificationContext from "../../store/notification-context";
import { useRouter } from "next/router";

function Profile(props) {
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  let commentsNumber = 0;
  props.lakes.map((el) => {
    commentsNumber = commentsNumber + el.comments.length;
  });

  const [showEmail, setShowEmail] = useState(false);
  const [showLakeModal, setShowLakeModal] = useState(false);
  const showLakeModalHandler = () => {
    setShowLakeModal((prevState) => !prevState);
  };
  const [homepageIsHovered, setHomepageIsHovered] = useState(false);

  const homepageHandleMouseEnter = () => {
    setHomepageIsHovered(true);
  };

  const homepageHandleMouseLaeve = () => {
    setHomepageIsHovered(false);
  };

  const showEmailHandler = () => {
    setShowEmail((prevState) => !prevState);
  };

  const deleteLakeHandler = async (lakeId) => {
    notificationCtx.showNotification({
      title: "delete",
      message: "Deleting your lake",
      status: "pending",
    });
    try {
      const response = await fetch(`/api/user/${lakeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      notificationCtx.showNotification({
        title: "Successs!",
        message: "Successfully deleted lake",
        status: "success",
      });
      router.push("/");
    } catch (error) {
      notificationCtx.showNotification({
        title: "Error!",
        message: "Something went wrong, when deleting lake",
        status: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <div className="md:flex md:flex-row">
        <div className="w-full md:w-[25%] h-[20rem] sm:h-[10rem] md:h-[40rem] border-2 border-pageMenu bg-page2 overflow-hidden">
          <div className="w-full h-full grid grid-rows-2 grid-cols-2 gap-4 p-4 sm:grid-cols-4 sm:grid-rows-1 md:grid-rows-4 md:grid-cols-1">
            <div
              onMouseEnter={homepageHandleMouseEnter}
              onMouseLeave={homepageHandleMouseLaeve}
              className="relative group col-span-1 row-span-1 bg-pageMenu shadow-2xl"
            >
              <div className="w-full h-full relative overflow-hidden group bg-page1">
                <div className="absolute inset-0 bg-pageMenu translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
                <div className="w-full h-full grid grid-cols-12 group-hover:text-page1 text-pageMenu relative z-10 duration-300">
                  <div className="relative flex items-center justify-center col-span-6 group-hover:text-page1 text-pageMenu">
                    <div className="lg:p-3 lg:absolute">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-full"
                      >
                        <g
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          className="stroke-pageMenu group-hover:stroke-page1"
                        >
                          <motion.path
                            initial={{ pathLength: 1 }}
                            animate={{
                              pathLength: homepageIsHovered ? [0, 1] : 1,
                            }}
                            transition={{ duration: 2 }}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></motion.path>
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-center col-span-6 place-items-center">
                    <span className="font-page font-bold tracking-wide text-xs min-[480px]:text-xl sm:text-xs md:text-sm lg:text-xl text-center me-4 break-all">
                      {props.username}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group col-span-1 row-span-1 bg-pageMenu shadow-2xl">
              <div className="w-full h-full relative overflow-hidden group bg-pageMenu">
                <div className="absolute inset-0 bg-page1 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
                <div className="w-full h-full grid grid-cols-12 text-page1 group-hover:text-pageMenu relative z-10 duration-300">
                  <div
                    className={`flex items-center justify-center ${
                      showEmail ? "col-span-4" : "col-span-8"
                    } text-page1 group-hover:text-pageMenu`}
                  >
                    <span className="py-3 px-2 font-page font-bold tracking-wide text-xs min-[480px]:text-xl sm:text-xs md:text-sm lg:text-xl text-center">
                      your email
                    </span>
                  </div>
                  <div className="flex items-center justify-center col-span-1 place-items-center">
                    <span className="mb-2 font-page font-bold tracking-wide text-4xl min-[480px]:text-5xl sm:text-4xl lg:text-5xl">
                      :
                    </span>
                  </div>
                  <div
                    className={`relative flex items-center justify-center ${
                      showEmail ? "col-span-7" : "col-span-3"
                    } place-items-center`}
                  >
                    <span
                      onClick={showEmailHandler}
                      className={`${
                        showEmail ? "" : "hover:underline"
                      } duration-150 hover:cursor-pointer py-3 px-2 font-page font-bold tracking-wide text-xs min-[480px]:text-xl sm:text-xs md:text-sm lg:text-xl text-center break-all`}
                    >
                      {showEmail ? `${props.user.user.email}` : "***"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group col-span-1 row-span-1 bg-pageMenu shadow-2xl">
              <div className="w-full h-full relative overflow-hidden group bg-pageMenu">
                <div className="absolute inset-0 bg-page1 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
                <div className="w-full h-full grid grid-cols-12 text-page1 group-hover:text-pageMenu relative z-10 duration-300">
                  <div className="flex items-center justify-center col-span-8 text-page1 group-hover:text-pageMenu">
                    <span className="py-3 px-2 font-page font-bold tracking-wide text-xs min-[480px]:text-xl sm:text-xs md:text-sm lg:text-xl text-center">
                      number of your lakes
                    </span>
                  </div>
                  <div className="flex items-center justify-center col-span-1 place-items-center">
                    <span className="mb-2 font-page font-bold tracking-wide text-4xl min-[480px]:text-5xl sm:text-4xl lg:text-5xl">
                      :
                    </span>
                  </div>
                  <div className="flex items-center justify-center col-span-3 place-items-center">
                    <span className="font-page font-bold tracking-wide text-xl min-[480px]:text-3xl sm:text-2xl lg:text-3xl overflow-x-scroll me-1">
                      {props.lakes.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group col-span-1 row-span-1 bg-pageMenu shadow-2xl">
              <div className="w-full h-full relative overflow-hidden group bg-pageMenu">
                <div className="absolute inset-0 bg-page1 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
                <div className="w-full h-full grid grid-cols-12 text-page1 group-hover:text-pageMenu relative z-10 duration-300">
                  <div className="flex items-center justify-center col-span-8 text-page1 group-hover:text-pageMenu">
                    <span className="py-3 px-2 font-page font-bold tracking-wide text-xs min-[480px]:text-xl sm:text-xs md:text-sm lg:text-xl text-center">
                      comments on your lakes
                    </span>
                  </div>
                  <div className="flex items-center justify-center col-span-1 place-items-center">
                    <span className="mb-2 font-page font-bold tracking-wide text-4xl min-[480px]:text-5xl sm:text-4xl lg:text-5xl">
                      :
                    </span>
                  </div>
                  <div className="flex items-center justify-center col-span-3 place-items-center">
                    <span className="font-page font-bold tracking-wide text-xl min-[480px]:text-3xl sm:text-2xl lg:text-3xl overflow-x-scroll me-1">
                      {commentsNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[75%] h-[30rem] md:h-[40rem] border-2 border-pageMenu bg-page1 p-5 overflow-hidden">
          <div className="w-full h-full border-4 border-pageMenu bg-page1 shadow-2xl overflow-hidden">
            <div className="w-full h-[5.7rem] flex flex-col overflow-hidden bg-page2 shadow-xl">
              <div className="w-full h-full grid grid-cols-12">
                <div className="w-full h-full col-span-10 sm:col-span-11 flex flex-col">
                  <span className="px-1 sm:px-2 mt-1 w-full text-center sm:text-left font-page text-xl sm:text-4xl tracking-wide font-extrabold text-pageMenu">
                    manage your lakes
                  </span>
                  <span className="px-1 mt-1 sm:px-2 opacity-50 font-page text-xs tracking-wide font-semibold text-pageMenu">
                    Welcome to the user's profile {props.username}. Here, you
                    can check your statistics, edit, delete, and manage your
                    lakes.
                  </span>
                </div>
                <div className="w-full h-full col-span-2 sm:col-span-1 border-s-4 border-pageMenu flex items-center justify-center bg-page4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={showLakeModalHandler}
                    className="w-full h-[2.5rem] flex items-center justify-center hover:cursor-pointer"
                  >
                    <div>
                      {showLakeModal ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="w-7 h-7 sm:w-10 sm:h-10"
                        >
                          <path
                            fill="#1E1B13"
                            fillRule="evenodd"
                            d="M1.606 6.08a1 1 0 011.313.526L2 7l.92-.394v-.001c0-.001 0 0 0 0l.003.009.021.045c.02.042.051.108.094.194.086.172.219.424.4.729.364.612.917 1.426 1.67 2.237a11.966 11.966 0 00.59.592C7.18 11.8 9.251 13 12 13c1.209 0 2.278-.231 3.22-.602 1.227-.483 2.254-1.21 3.096-1.998a13.053 13.053 0 002.733-3.725l.027-.058.005-.011a1 1 0 011.838.788L22 7l.92.394-.003.005-.004.008-.011.026-.04.087a14.045 14.045 0 01-.741 1.348 15.368 15.368 0 01-1.711 2.256l.797.797a1 1 0 01-1.414 1.415l-.84-.84a11.81 11.81 0 01-1.897 1.256l.782 1.202a1 1 0 11-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 01-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 01-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 01-1.414-1.414l.797-.797A15.406 15.406 0 011.72 8.605a13.457 13.457 0 01-.591-1.107 5.418 5.418 0 01-.033-.072l-.01-.021-.002-.007-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 01.525-1.314z"
                            clipRule="evenodd"
                            className="stroke-3"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="#1E1B13"
                          strokeWidth="0.84"
                          viewBox="0 0 24 24"
                          className="w-7 h-7 min-[340px]:w-8 min-[340px]:h-8 sm:w-10 sm:h-10"
                        >
                          <g
                            fill="#1E1B13"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          >
                            <path d="M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM9.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z"></path>
                            <path d="M12 3.25c-4.514 0-7.555 2.704-9.32 4.997l-.031.041c-.4.519-.767.996-1.016 1.56-.267.605-.383 1.264-.383 2.152 0 .888.116 1.547.383 2.152.25.564.617 1.042 1.016 1.56l.032.041C4.445 18.046 7.486 20.75 12 20.75c4.514 0 7.555-2.704 9.32-4.997l.031-.041c.4-.518.767-.996 1.016-1.56.267-.605.383-1.264.383-2.152 0-.888-.116-1.547-.383-2.152-.25-.564-.617-1.041-1.016-1.56l-.032-.041C19.555 5.954 16.514 3.25 12 3.25zM3.87 9.162C5.498 7.045 8.15 4.75 12 4.75c3.85 0 6.501 2.295 8.13 4.412.44.57.696.91.865 1.292.158.358.255.795.255 1.546s-.097 1.188-.255 1.546c-.169.382-.426.722-.864 1.292C18.5 16.955 15.85 19.25 12 19.25c-3.85 0-6.501-2.295-8.13-4.412-.44-.57-.696-.91-.865-1.292-.158-.358-.255-.795-.255-1.546s.097-1.188.255-1.546c.169-.382.426-.722.864-1.292z"></path>
                          </g>
                        </svg>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            {props.lakes.length === 0 && (
              <div className="w-full h-[calc(100%-5.7rem)] border-t-4 border-pageMenu p-5 overflow-y-scroll flex items-center justify-center">
                <span className="font-page text-2xl sm:text-5xl md:text-4xl lg:text-5xl text-pageMenu font-extrabold tracking-wide text-center overflow-hidden bg-page1 p-5">
                  no lakes yet...
                </span>
              </div>
            )}
            {props.lakes.length !== 0 && (
              <div className="w-full h-[calc(100%-5.7rem)] border-t-4 border-pageMenu p-5 overflow-y-scroll">
                {props.lakes.map((el) => {
                  return (
                    <div
                      key={el._id}
                      className="w-full h-[12rem] bg-page1 border-4 border-pageMenu mb-5 shadow-lg"
                    >
                      <div className="relative w-full h-full grid grid-cols-12">
                        <div
                          className={`w-full h-full ${
                            showLakeModal
                              ? "absolute z-20"
                              : "lg:col-span-9 md:col-span-8 sm:col-span-8 col-span-6"
                          } p-2`}
                        >
                          <div className="w-full h-full bg-page1 flex flex-col">
                            <span className="font-page text-pageMenu font-bold sm:tracking-wide text-[20px] min-[360px]:text-[24px] sm:text-[32px] lg:text-[36px] truncate">
                              {el.title} - {el.location}
                            </span>
                            <span className="font-page text-pageMenu font-bold sm:tracking-wide text-[10px] min-[360px]:text-xs sm:text-base lg:text-lg truncate opacity-50">
                              {el.subtitle}
                            </span>
                            <span className="mt-1 w-full h-[6.7rem] sm:h-[5.8rem] lg:h-[5rem] overflow-y-scroll bg-page1 font-page text-pageMenu font-bold text-[10px] min-[360px]:text-xs overflow-hidden break-words">
                              {el.description}
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-full lg:col-span-3 md:col-span-4 sm:col-span-4 col-span-6 p-2">
                          <div className="relative w-full h-full grid grid-cols-2 grid-rows-2 gap-2">
                            <Link
                              href={`/list/${el._id}`}
                              className="w-full h-full col-span-2 row-span-1"
                            >
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-full h-full border-4 border-pageMenu flex items-center justify-center bg-page4 hover:cursor-pointer hover:shadow-2xl duration-100"
                              >
                                <span className="font-page text-pageMenu font-bold sm:tracking-wide text-[10px] min-[360px]:text-xs sm:text-base lg:text-lg text-center">
                                  show this lake
                                </span>
                              </motion.div>
                            </Link>
                            <Link
                              href={`/list/${el._id}/edit`}
                              className="w-full h-full col-span-1 row-span-1"
                            >
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-full h-full border-4 border-pageMenu flex items-center justify-center bg-page1 hover:cursor-pointer hover:shadow-2xl duration-100"
                              >
                                <span className="font-page text-pageMenu font-bold sm:tracking-wide text-[10px] min-[360px]:text-xs sm:text-base lg:text-lg text-center">
                                  edit
                                </span>
                              </motion.div>
                            </Link>
                            <motion.div
                              id={el._id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteLakeHandler(el._id)}
                              className="w-full h-full col-span-1 row-span-1 border-4 border-pageMenu flex items-center justify-center bg-page2 hover:cursor-pointer hover:shadow-2xl duration-100"
                            >
                              <span className="font-page text-pageMenu font-bold sm:tracking-wide text-[10px] min-[360px]:text-xs sm:text-base lg:text-lg text-center">
                                delete
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Profile;
