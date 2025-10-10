import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// const API_BASE_URL = "https://wertone-billing.onrender.com/";
// const API_BASE_URL = "https://wertone-billing.onrender.com/";

// "enableProguardInReleaseBuilds": true

export const API_BASE_URL = "https://qwikbill.in/qapi/";
// export const API_BASE_URL = "http://192.168.1.35:2235/";

//for preview:>  eas build --platform android  --profile preview
// for development:> eas build --platform android  --profile development
// for production:> eas build --platform android  --profile production
export const NORM_URL="https://qwikbill.in/qapp/"
const apiRequest = async (method, url, data = null, customHeaders = {}) => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const token = userData?.token;

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    };

    const response = await axios({
      url: `${API_BASE_URL}${url}`,
      method,
      data: data ? JSON.stringify(data) : null,
      headers,
      withCredentials: true,
    });

    return response.data || '';
  } catch (error) {
    console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error.response || error.message);
     if (error.response?.status === 401|| error?.data?.status===401) {
      console.log("Unauthorized! Redirecting to login.");
      await AsyncStorage.removeItem("userData"); // clear session
    //   navigate("login",{status:401}); // redirect to login
    }

    throw error.response || error.message;
  }
};

  const deleteApiRequest = async (method, url, headers = {}, payload) => {
  try {
    const config = {
      url: `${API_BASE_URL}${url}`,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      withCredentials: true,
    };

    // only add data if payload is provided and method usually accepts a body
    if (payload) {
      config.data = payload; // let axios handle JSON.stringify internally
    }
    
    const response = await axios(config);
    return response.data || "";
  } catch (error) {
    console.error(
      `Error with ${method.toUpperCase()} request to ${url}:`,
      error.response || error.message
    );
    throw error.response || error.message;
  }
};

  //CREATE
  export const createApi = async (endpoint, data, headers) => {
    return apiRequest('post', endpoint, data, headers);
  };

// READ
  export const readApi = async (endpoint, headers) => {
    return apiRequest('get', endpoint, null, headers);
  };

// UPDATE
export const updateApi = async (endpoint, data, headers) => {
    return apiRequest('put', endpoint, data, headers);
  };

  // DELETE
  export const deleteApi = async (endpoint,headers,payload) => {
    return deleteApiRequest('delete', endpoint, headers,payload);
  };
  export const fontSize = {
    headingLarge: 24,
    headingMedium: 22,
    heading: 20,
    headingSmall: 18,
    labelLarge: 16,
    labelMedium: 14,
    label: 12,
    labelSmall: 10,
    labelXSmall:9,
    labelXXSmall:8,
  };

  export const fontFamily = {
    regular: "Poppins-Regular",
    bold: "Poppins-Bold",
    medium: "Poppins-Medium",
    thin: "Poppins-Thin",
  };
  export const status={
    unpaid:1,
    paid:2,
    partially_paid:3,
    quatation:4

  }
  export const statusName= {
    1:"unpaid",
    2:"paid",
    3:"partially paid",
    4:"Quatation"
  }


  export const statusName1= {
    1:"Unpaid",
    2:"Paid",
    3:"Partially Paid",
    4:"Quotation"
  }

  export const getStatusName = (id) => {
  return statusName1[id] || "Unknown";
};
  export const RoleStatusName={
   1:"owner",
   2:"manager",
   3:"employee",
   4:"viewer",

  }
  export const roleStatus= {
    owner:1,
    manager:2,
    employee:3,
    viewer:4
  }




const getTodaysDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = today.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Ensure we have a valid date
  if (isNaN(date.getTime())) {
    return ""; // Return empty string or a default value if invalid date
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};


export const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};