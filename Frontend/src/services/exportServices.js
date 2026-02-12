import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api/export" || "http://localhost:8000/api/export",
    withCredentials: true,
    responseType: "blob"
})

export const exportData = async (types, format) => {
    const response = await api.post("/generate", { types, format });

    // 🔽 Create downloadable file
    const blob = new Blob([response.data], {
        type:
            format === "pdf"
                ? "application/pdf"
                : "text/csv"
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `expense-tracker-export.${format === "pdf" ? "pdf" : "csv"}`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
    return true
}