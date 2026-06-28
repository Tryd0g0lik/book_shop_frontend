// download\src\index.ts
import { asyncModalwindow } from "./load_catalog/functions";
import { publishButtomDownloadCatalog } from "./functions";

document.removeEventListener("DOMContentLoaded", async () => {
    // EVENT LISTENER
    try {
        // EVENT DOM DOWNLOAD
        publishButtomDownloadCatalog();
        // eVENT MOUSDOWN
        await asyncModalwindow();
    }
    catch (error) {
        console.error(error);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        publishButtomDownloadCatalog();
        await asyncModalwindow();
    }
    catch (error) {
        console.error(error);
    }
});
