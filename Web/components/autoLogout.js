import { useEffect } from "react";
import { signOut, getSession } from "next-auth/react";
import Swal from "sweetalert2";

const AutoLogout = () => {
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (session) {
        try {
          const res = await fetch(
            "https://api.bd2-cloud.net/api/user/updateStatus",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: session?.user?.email, status: 0 }),
            }
          );
          const json = await res.json();
          if (res.ok && json.status != 404) {
            console.log("User status updated");
          } else if (json.status == 404) {
            console.log("");
          } else {
            console.error("Failed to update user status", res);
            throw new Error("Failed to update user status");
          }
        } catch (err) {
          console.error("Failed to sign out", err);
        }
        Swal.fire({
          title: "Session Expired",
          text: "Your session has expired. Please sign in again.",
          icon: "warning",
        });
        await signOut();
      }
    };

    // Poll every minute (60000 ms) to check the session
    const interval = setInterval(checkSession, 3600000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default AutoLogout;
