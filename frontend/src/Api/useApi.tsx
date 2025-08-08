import type { status } from "../Interfaces/interfaces";

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

  const getCsvById = async (id: number) => {
    const response = await fetch(`http://localhost:8080/getCsv/${id}`, {
      method: "GET",
    });

    const result = await response.json();
    return result;
  };

  const getCompanyById = async (id: number) => {
    const response = await fetch(`http://localhost:8080/getCompany/${id}`, {
      method: "GET",
    });

    const result = await response.json();
    return result;
  };

  const updateCsvStatus = async (id: number, status: status) => {
    const response = await fetch(`http://localhost:8080/updateCsvStatus`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        csvId: id,
      }),
    });
    const result = await response.json();
    return result;
  };

  const downloadCsv = async (id: number) => {
    const response = await fetch(`http://localhost:8080/downloadCsv/${id}`, {
      method: "GET",
    });
    const blobResp = await response.blob();
    const url = URL.createObjectURL(blobResp);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `csvfile_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getCsvDetails = async (id: number) => {
    const response = await fetch(`http://localhost:8080/getCsvDetails/${id}`, {
      method: "GET",
    });

    const result = await response.json();
    return result;
  };

  return {
    upload,
    getAllCsv,
    getCsvById,
    getCompanyById,
    updateCsvStatus,
    downloadCsv,
    getCsvDetails,
  };
};
