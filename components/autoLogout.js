import { useEffect } from "react";
import { signOut, getSession } from "next-auth/react";

const AutoLogout = () => {
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        try {
          const res = await fetch(
            "https://api.bd2-cloud.net/api/user/updateStatus",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: credentials.email, status: 1 }),
            }
          );
          if (res.ok) {
            console.log("User status updated");
          } else {
            console.error("Failed to update user status", res);
            throw new Error("Failed to update user status");
          }
        } catch (err) {
          console.error("Failed to sign out", err);
        }
        await signOut();
      }
    };

    // Poll every minute (60000 ms) to check the session
    const interval = setInterval(checkSession, 60000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return null; // No UI needed
};

export default AutoLogout;
