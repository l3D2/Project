import { useEffect } from "react";
import { signOut, getSession } from "next-auth/react";

const AutoLogout = () => {
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        // If the session is not found (expired), log the user out
        signOut();
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
