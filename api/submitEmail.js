import axios from "axios";
import FormData from "form-data";

export default async ({
    description,
    issueType,
    ulb,
    department,
    userName,
    userEmail,
    location,
}) => {
    const formData = new FormData();

    const locationString = `${location.city}, ${location.state} (${location.coordinates})`;

    formData.append("issue_text", description || "");
    formData.append("extra_info", "true");
    formData.append("grievance_location", locationString || "");
    formData.append("grievance_type", issueType || "");
    formData.append("ulb", ulb || "");
    formData.append("department", department || "");
    formData.append("user_name", userName || "");
    formData.append("user_mobile", "");
    formData.append("user_email", userEmail || "");

    try {
        const response = await axios.post(
            "https://govt-issueportalautomation.onrender.com/submit-email/",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        console.log("Response: ", response.data);
    } catch (error) {
        console.log(error);
    }
};
