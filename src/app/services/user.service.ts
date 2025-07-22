import axios from "axios";

// Login Service
export const signin = async (input: any) => {
  console.log("in services ", input);
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/users/login",
      input,
      {
        validateStatus: function (status) {
          return status >= 200 && status < 600; // Accept 2xx, 4xx, and 5xx as valid responses
        },
      }
    );
    console.log("services response:", response.data);
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error; // Rethrow to let handleSubmit catch it
  }
};

// Register Service
export const register = async (input: { firstName: string; lastName: string; email: string; password: string }) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/users/register",
      input,
      {
        validateStatus: function (status) {
          return status >= 200 && status < 600; // Accept 2xx, 4xx, and 5xx as valid responses
        },
      }
    );
    console.log("register services response:", response.data);
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};