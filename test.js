const test = async () => {
  const data = {
    email: "userData.email",
    name: "userData.name",
    imgurl: "userData.imgurl",
    password: "hashedpassword",
  };
  const response = await fetch("http://api.bd2-cloud.net/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    alert("Registration Successful!");
  } else if (response.status === 404) {
    alert("User is not registered.");
  } else {
    console.error("Error checking registration:");
  }
};

test();
