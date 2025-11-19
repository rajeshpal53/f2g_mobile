import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// const API_BASE_URL = "https://wertone-billing.onrender.com/";
// const API_BASE_URL = "https://wertone-billing.onrender.com/";

// "enableProguardInReleaseBuilds": true

export const API_BASE_URL = "https://f2gfinance.com/fapi/";
// export const API_BASE_URL = "http://192.168.1.35:2235/";

//for preview:>  eas build --platform android  --profile preview
// for development:> eas build --platform android  --profile development
// for production:> eas build --platform android  --profile production
export const NORM_URL="https://f2gfinance.com/"
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

export const statusOptions = [
  { id: 1, label: 'Login Incomplete',value: 'login incomplete' },
  { id: 2, label: 'Login Done',value: 'login done' },
  { id: 3, label: ' Post PD Doc', value: 'pd doc' },
  { id: 4, label: 'Reject', value: 'reject' },
  { id: 5, label: 'L and T Stage',value: 'l and t stage' },
  { id: 6, label: 'Sub Approved',value: 'sub approved' },
  { id: 7, label: 'Approved',value: 'approved' },
  { id: 8, label: 'Disbursed',value: 'disbursed' },
  { id: 9, label: 'OTC/PDD Pending',value: 'otc/pdd pending' },
  { id: 10, label: 'Billing in Process',value: 'billing in process' },
  { id: 11, label: 'Billing Cleared',value: 'billing cleared' },
  { id: 12, label: 'Lead Generated',value: 'lead generated' },
  { id: 13, label: 'Booking Initiated',value: 'booking initiated' },
];


export const valuesByStatusfk={
  1:"login incomplete",
  2:"login done",
  3:"pd doc",
  4:"reject",
  5:"l and t stage",
  6:"sub approved",
  7:"approved",
  8:"disbursed",
  9:"otc/pdd pending",
  10:"billing in process",
  11:"billing cleared",
  12:"lead generated",
  13:"booking initiated"
}

export const  statusfkByValues={
 "login incomplete":1,
  "login done":2,
  "pd doc":3,
  "reject":4,
  "l and t stage":5,
  "sub approved":6,
  "approved":7,
  "disbursed":8,
  "otc/pdd pending":9,
  "billing in process":10,
  "billing cleared":11,
  "lead generated":12,
  "booking initiated":13
}





  export const loanTypes = [
  { label: "Home Loan", value: "home",id :1},
  { label: "Personal Loan", value: "personal",id:2},
  {label:"Loan against property",value:"property",id:3},
  { label: "Car Loan", value: "car",id:4},
  { label: "Business Loan", value: "business",id :5},
   {label :" CV loan",value:" cvLoan",id:6},
   {label:"Auto loan" ,value:"auto",id:7},
    { label: "Other", value: "other",id:8 },

];

  export const selectLoanFromValuesById = {
  1: "home",
  2: "personal",
  3: "property",
  4: "car",
  5: "business",
  6: "cvLoan",
  7: "auto",
  8: "other",
};

export const selectLoanFromId  = {
  1: "Home Loan",
  2: "Personal Loan",
  3: "Loan against property",
  4: "Car Loan",
  5: "Business Loan",
  6: "CV Loan",
  7: "Auto Loan",
  8: "Other",
};

  export const selectLoanFrom = {
  home: "Home Loan",
  personal: "Personal Loan",
  property: "Loan against property",
  car: "Car Loan",
  business: "Business Loan",
  cvLoan: "CV Loan",
  auto: "Auto Loan",
  other: "Other",
};



export const statusById = {
  1: "login incomplete",
  2: "login done",
  3: "pd doc",
  4: "reject",
  5: "l and t stage",
  6: "sub approved",
  7: "approved",
  8: "disbursed",
  9: "otc/pdd pending",
  10: "billing in process",
  11: "billing cleared",
  12:"lead generated",
  13:"booking initiated"
};

// ✅ Define color mapping for each status
export const statusColors = {
  "login incomplete": "#F87171", // red-400 (attention needed)
  "login done": "#34D399", // green-400 (success)
  "pd doc": "#60A5FA", // blue-400 (info)
  "reject": "#EF4444", // red-500 (error)
  "l and t stage": "#FBBF24", // yellow-400 (in progress)
  "sub approved": "#A78BFA", // purple-400 (reviewed)
  "approved": "#22C55E", // green-500 (approved)
  "disbursed": "#3B82F6", // blue-500 (completed)
  "otc/pdd pending": "#FACC15", // yellow-400 (pending)
  "billing in process": "#FB923C", // orange-400 (processing)
  "billing cleared": "#10B981", // emerald-500 (done)
  "lead generated": "#8B5CF6", // violet-500
  "booking initiated": "#06B6D4", // cyan-500
};


// ✅ Function to get color from statusFk (id)
export const colorByStatusFk = (statusFk) => {
  const statusName = statusById[statusFk];
  return statusColors[statusName] || "#9CA3AF"; // default: gray-400 if not found
};




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


export const formatDateWithoutTime = (dateString) => {
  const date = new Date(dateString);

  // Ensure valid date
  if (isNaN(date.getTime())) {
    return ""; // Return empty string if invalid date
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // ✅ dd-mm-yyyy
};

export const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};