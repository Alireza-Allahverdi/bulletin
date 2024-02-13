import axios from "axios";

// const mainAddress = "https://usa.iran.liara.run/";
// const mainAddress = "https://bulletin.liara.run/";
const mainAddress = "https://bulletin-git-main-fdsfghgb.vercel.app/";
// const mainAddress = "http://DESKTOP-FLHC7J9:5000/";
// const mainAddress = "http://DESKTOP-T4I47B7:5000/";
// const mainAddress = "http://192.168.100.37:5000/";

export const fetchApi = async (url, body, isUpload = false, token) => {

  let serverResponse = "";
  try {
    if (body) {
      if (isUpload) {
        await axios
          .post(`${mainAddress}${url}`, body, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            serverResponse = res;
          })
          .catch((err) => {
            console.error(err);
            serverResponse = err;
          });
      }
      else {
        await axios
          .post(`${mainAddress}${url}`, body, {
            headers: {
              "Auth-token": token,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            serverResponse = res;
          })
          .catch((err) => {
            console.error(err);
            serverResponse = err;
          });
      }
    } 
    else {
      await axios
        .get(`${mainAddress}${url}`, {
          headers: {
            "Auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          serverResponse = res;
        })
        .catch((err) => {
          console.error(err);
          serverResponse = err;
        });
    }
    return serverResponse;
  } 
  catch (error) {
    console.error(error);
  }
};
