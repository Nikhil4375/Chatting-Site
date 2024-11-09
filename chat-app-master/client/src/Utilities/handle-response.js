import { authenticationService } from "../Services/authenticationService";
import { useSnackbar } from "notistack";

const useHandleResponse = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleResponse = (response) => {
    return response.text().then((text) => {
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (error) {
        // Handle cases where the response is not JSON
        enqueueSnackbar("Invalid response format received from server", {
          variant: "error",
        });
        return Promise.reject("Invalid JSON response");
      }

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          authenticationService.logout();
          enqueueSnackbar("User Unauthorized", {
            variant: "error",
          });
        }

        const error =
          (data && data.message) ||
          response.statusText ||
          "An unexpected error occurred";
        enqueueSnackbar(error, {
          variant: "error",
        });
        return Promise.reject(error);
      }

      return data;
    });
  };

  return handleResponse;
};

export default useHandleResponse;
