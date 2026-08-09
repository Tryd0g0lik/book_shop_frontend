// download\src\index.ts
import { asyncModalwindow } from "./load_catalog/functions";
import { publishButtomDownloadCatalog } from "./functions";

const servises = async () => {
    try {
        publishButtomDownloadCatalog();
        setTimeout(() => new Promise((resolve) => {
             asyncModalwindow();
             return resolve
            }), 700);

    }
    catch (error) {
        console.error(error);
    }
};

document.removeEventListener("DOMContentLoaded", servises);

document.addEventListener("DOMContentLoaded", servises);
