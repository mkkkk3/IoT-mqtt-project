import React, { useContext } from "react";
import MainNavigation from "./main-navigation";
import NotificationContext from "../../store/notification-context";
import Notification from "../ui/notification";
import Footer from "./footer";

function Layout(props) {
  const notificationCtx = useContext(NotificationContext);

  const activeNotification = notificationCtx.notification;

  return (
    <React.Fragment>
      <MainNavigation />
      <main className="font-body">{props.children}</main>
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        ></Notification>
      )}
      <Footer />
    </React.Fragment>
  );
}

export default Layout;
