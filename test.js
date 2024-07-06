import axios from "axios";

const CheckUserRegistered = async (email) => {
  const data = {
    email: email,
  };

  try {
    const response = await axios.post("http://api.bd2-cloud.net/api", data);
    console.log("User is registered:", response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("User is not registered.");
    } else {
      console.error("Error checking registration:", error);
    }
  }
};

CheckUserRegistered("testapi@gmail.com");
