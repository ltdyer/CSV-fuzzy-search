export const useApi = () => {
  const upload = async (formData: FormData) => {
    const response = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result;
  };

  const getAllCsv = async () => {
    const response = await fetch("http://localhost:8080/getAllCsv", {
      method: "GET",
    });

    const result = await response.json();
    return result;
  };

  return {
    upload,
    getAllCsv,
  };
};
