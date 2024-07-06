const CheckUserRegistered = async (email) => {
  try {
    const res = await axios.post(
      "https://api.bd2-cloud.net/api/user/get-user",
      {
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.json());
  } catch (err) {
    console.log(err);
  }
};

const RegisterUser = async (email) => {};

module.exports = {
  CheckUserRegistered,
};
