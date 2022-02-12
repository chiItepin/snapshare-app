import { AxiosError } from 'axios';

const handleAxiosErrorMessage = (err: AxiosError): string => {
  if (err.response?.request?.response) {
    return JSON.parse(err.response?.request?.response)?.message;
  }
  return err.message;
};

export default handleAxiosErrorMessage;
