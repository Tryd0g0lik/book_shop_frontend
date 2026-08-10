// download\src\load_catalog\functuions.ts
// This file performs following tasks:
// - open a modal window;
// - sending files;
// - close a modal window.
import { PATHNAME,LANGUAGE_SUPPORTED_OF_BROWSER, MAX_CHUNK_SIZE_FILE_BYTES } from "../dorenv_";
import { ModalWindow, ButtonOnForm } from ".";

// Size of chunk for sending of chunks
const CHUNK_SIZE: number = Number(MAX_CHUNK_SIZE_FILE_BYTES); // 1024 * 1024;
const buttononform = new ButtonOnForm();
// ---- Templete of a heandler of events ----
// After events we read the *.txt file from path 'download/static/modal_pages'
// This is the heandler  which is open the form for upload the file.
type T = { templatePath: string, prefixLog: string };
function getFormDropZone(props: T): CallableFunction {

    const { templatePath, prefixLog } = props;

    async function asyncLoadTemplateOfModalWindow(event: MouseEvent): Promise<string | undefined> {
        /**
         * Open a modal window.
         * We have a task  it read a template HTML/txt file and send it next handlers.
         * This html file is location by a server path - 'templatePath' or can inser new template whem we initional the ModalWindow's obj.
         * @param event: MouseEvent.
            && target.getAttribute("name") !== "download-catalog"
         * @returns Promise<string | undefined> or err.
        */
       const warnText: string = `${prefixLog}[${getFormDropZone.name}][${asyncLoadTemplateOfModalWindow.name}]:`;
        const regex = /(\.txt|\.html)$/i;
        try {
            let target = event.target as HTMLElement | null;
            if (!target) return;
            let controller: number = 0;
            // Search for the first element with a "data-name" attribute
            while (!target.hasAttribute("data-name")) {

                target = target.parentElement as HTMLElement;
                if (controller > 4) {
                    console.warn(warnText + "The 'data-name' not found!" + " Idexes of the element more 4");
                    return;
                };
                if (!target){
                    console.warn(warnText  + "The 'data-name' not found!");
                    return;
                }
                controller++;
            }
            const dataName = target.getAttribute("data-name");
            if ((dataName as string).toLowerCase() !== "download-catalog") return;
            // Read the template HTML/txt of file.
            if (!(regex.test(templatePath as string))) throw new Error(`[${prefixLog}][${asyncLoadTemplateOfModalWindow.name}]:
                Massage: ${"Template path is not a valid file!"}`);
            const file_ = await fetch(window.location.origin + "/" + templatePath as string);
            if (!file_.ok) {
                new Error(`[${prefixLog}][${asyncLoadTemplateOfModalWindow.name}]: Templete html, for reciving modal html block was hot found!`);
            };
            return await file_.text();
        }
        catch (error) {
            if (error instanceof Error) {

                throw new Error(`[${prefixLog}][${asyncLoadTemplateOfModalWindow.name}]: Name: ${error.name} & Massage: ${error.message}`, { cause: error });

            }
        }
    }
    return asyncLoadTemplateOfModalWindow;
}

// --- Heandler of events ---
// After event that is starting the upload of a file through the form (from *.txt template of fiorm).
async function handlerEventsForm(event: Event): Promise<void> {
    /**
     * This method is collection of handlers of forms &  method dropZone (below) it is collection handlers of events.
     */
    const prefixLog = "[handlerEventsForm]";

    try {
        const keyboardKey = (event as KeyboardEvent).key;
        const typeEvent = event.type.toLowerCase();
        let files: FileList | undefined = undefined;
        const modalW = new ModalWindow();
        // ============================================
        // DRAG & DROP
        // ============================================
        if (
               typeEvent === "drop"
            ) {
                files = (event as DragEvent).dataTransfer?.files;
        }

        // ============================================
        // MORE EVENTS
        // ============================================
        else if ((typeEvent !== "submit") && (
            typeEvent === "mousedown" && (
                event.target as HTMLElement).tagName.toLowerCase() !== "input") && (
                keyboardKey && keyboardKey.toLowerCase() !== "enter"
                && keyboardKey.toLowerCase() !== "escape"
            )
        ) return;
        else {
            files = (event.target as HTMLFormElement).files;
        }
        if (!files || files.length === 0) return;
        // ============================================
        // CHECKING OF A FILE SIZE
        // ============================================
        const resultBool = modalW.checkSizeFile(files);
        if (!resultBool) {
            // Chenge a text of button 1 / 4
            // If the file size is too large
            await buttononform.handlerOfButtonText(event, "More when the max-size!");
            return;
        };
        if (!files || files.length === 0) return;
        // Chenge a text of button 2 / 4
        await buttononform.handlerOfButtonText(event, "Sending now");
        try {
            // --- RECEIVE DATA OF FORMS.
            subHandlerFilesOfForm(files, CHUNK_SIZE);
        }
        catch (error) {
            // Change a text of button 3 / 4
            await buttononform.handlerOfButtonText(event, "Error");
            throw error;
        }

        // ============================================
        // CLEARING OF FORM
        // ============================================
        buttononform.cleanerOfFormes(event);
        // Change a text of button 4 / 4
        await buttononform.handlerOfButtonText(event, buttononform.textButtomOfForm);
    }
    catch (error) {
        if (error instanceof Error) {
            console.debug(`${prefixLog} DEBUG Got server's error: "${error.message}" Now not sleep.`);
            throw new Error(`[${prefixLog}][${handlerEventsForm.name}]: Name: ${error.message} & Massage: ${error.message}.`, { cause: error });
        }
    }
}

async function collectionOfEvents(dropZone: HTMLElement): Promise<void> {
    const formHtml: HTMLFormElement | null = dropZone.querySelector(`form[action="${PATHNAME}"]`);
    if (!formHtml) return;
    // ============================================
    // --- EVENT Drag & Drop Excel file ---
    // Zone Excel file is entering the zone of drag&drop
    // ============================================
    const modeNamesArr = ["dragenter", "dragover", "dragleave", "drop"];
    modeNamesArr.forEach((view) => {
        dropZone.removeEventListener(view, (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        dropZone.addEventListener(view, (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    });
    [0, 1].forEach((i) => {
        dropZone.removeEventListener(modeNamesArr[i], () => dropZone.classList.remove("highlight"));
        dropZone.addEventListener(modeNamesArr[i], () => dropZone.classList.add("highlight"));
    });
    [2, 3].forEach((i) => {
        dropZone.removeEventListener(modeNamesArr[i], () => dropZone.classList.remove("highlight"));
        dropZone.addEventListener(modeNamesArr[i], () => dropZone.classList.remove("highlight"));
    });

    dropZone.removeEventListener("drop", async ( event ) => handlerEventsForm(event), false);
    dropZone.addEventListener("drop", async ( event ) => handlerEventsForm(event), false);

    // ============================================
    // --- EVENT Mouse Down ---
    // Form the choosing of the Excel file
    // ============================================

    formHtml.removeEventListener("mousedown", (event: MouseEvent) => {
        handlerEventsForm(event);
    });
    formHtml.addEventListener("mousedown", (event: MouseEvent) => {
        handlerEventsForm(event);
    });
    formHtml.removeEventListener("keydown", (event: KeyboardEvent) => {
        handlerEventsForm(event);
    });
    formHtml.addEventListener("keydown", (event: KeyboardEvent) => {
        handlerEventsForm(event);
    });
    formHtml.removeEventListener("submit", (event: SubmitEvent) => {
        handlerEventsForm(event);
    });
    formHtml.addEventListener("submit", (event: SubmitEvent) => {
        handlerEventsForm(event);
    });
    formHtml.removeEventListener("change", (event: Event) => {
        handlerEventsForm(event);
    });
    formHtml.addEventListener("change", (event: Event) => {
        handlerEventsForm(event);
    });
};

async function requestPost(formData: FormData): Promise<{ status: number, detail: string }> {
    /**
     * Drap&Drop - Here we send files to the server.
     * @param formData: FormData - form data for request.
     * @return Promise<Boolean | JsonSourceFile> - false or data of json/object.
     */
    const prefixLog = "[requestPost]";
    let response;
    try {
        // ============================================
        // THE CHUNKS OF FILE SENDING TO THE SERVER
        // ============================================
        response = await fetch(window.location.origin + PATHNAME,
            {
                method: "POST",
                body: formData,
            },
        );
        if (response.ok) {
            console.log("Files was sent successfully!");
            const data = await response.json();
            data["status"] = response.status;
            data["detail"] = response.statusText;
            return data;
        }

        console.log("Files was not sent!");
        const data = Object.assign({}, { status: response["status"], detail: response.statusText });
        return data;
    }
    catch (error) {
        if (error instanceof Error) {
            const errorT = `[${prefixLog}][${requestPost.name}]: ${error}`;
            console.error(errorT);
            return { status: 500, detail: errorT };
        }
    }
    return Object.assign({ status: (response as Response)["status"], detail: (response as Response).statusText });
}

async function subHandlerFilesOfForm(files: FileList, chunkSize: number): Promise<{ status: number, detail: string }> {
    const formData = new FormData();
    const prefixLog = "[subHandlerFilesOfForm]";
    let response: { status: number, detail: string } = { status: 400, detail: "Not found" };
    // Drap&Drop - Receive files.
    try {
        for (let ind = 0; ind < files.length; ind++) {
            const file = files[ind];
            const totalChunks = Math.ceil(file.size / chunkSize);
            for (let i = 0; i < totalChunks; i++) {
                // ============================================
                // --- SEND FILES TO THE SERVER ---.
                // ============================================
                const startByte = i * chunkSize;
                const endByte = Math.min(startByte + chunkSize, file.size);
                const f = file.slice(startByte, endByte);
                const files_name_arr = file.name.split(".");
                const fileExtention = files_name_arr[files_name_arr.length - 1] || "";
                const fileName = (file.name as string).slice();
                formData.append("file", f);
                formData.append("total_chunks", totalChunks.toString());
                formData.append("file_extention", fileExtention);
                formData.append("chunk_index", i.toString());
                formData.append("file_name", fileName);
                console.log("Numb chunk: ", endByte);

                // Drap&Drop - Receive CSRF token
                const csrftokenHtml: HTMLInputElement | null = document.querySelector("[name='csrfmiddlewaretoken'");
                if (!csrftokenHtml) return { status: 403, detail: "CSRF Token not found" };
                formData.append(csrftokenHtml.name, csrftokenHtml.value);
                // ============================================
                // --- RESPONSE FROM THE SERVER ---
                // ============================================
                response = await requestPost(formData);
            };
        };
        return response;
    }
    catch (error) {
        throw new Error(`[${prefixLog}][${subHandlerFilesOfForm.name}]: Name: ${(error as Error).name} & ${(error as Error).message}.`, { cause: error });
    };
};

const asyncModalwindow = async () => {
    /**
     * We should get a html block in main html block on the admin 'Catalog' page.
     * This is additional interfecae for a load the XLS file to the cataloc.
     */
    const modalwindow = new ModalWindow();
    modalwindow.templatePath = "static/modal_pages/confirm_convert_alias.txt";
    // ============================================
    // Languages RU US FR
    // ============================================
    const langRuUsFr: string = LANGUAGE_SUPPORTED_OF_BROWSER.split("-")[0]
    if (langRuUsFr === "ru") {
        modalwindow.templatePath = "static/modal_pages/confirm_convert_alias_ru.txt";
    } else if (langRuUsFr === "fr"){
        modalwindow.templatePath = "static/modal_pages/confirme_conversion_aliases_fr.html";
    }
    const mainHtml: HTMLElement | null = document.querySelector("main[id='main'] header div[class='right']");
    if (!mainHtml) return;
    // ============================================
    // CHANGING THE TEXT OF FORM IT OVER BUTTOM
    // Lemiter of sise for  sending of file.
    // ============================================
    // It listener a click on a button in main html block - it is a form for
    //  a load XLS file to the product catalog.
    mainHtml.onmousedown = async (event) => {
        let zoneHTML: HTMLElement | null = document.querySelector("div.drop-zone[id='download-drop-zone']");

        try {
            if (!zoneHTML) {
                // ============================================
                // --- EVENT OF OPEN FORM ---
                // ============================================
                // Read the template of modal window (*.txt file).
                const props = { templatePath: modalwindow.templatePath, prefixLog: modalwindow.__prefixLog };
                const formDropZone = getFormDropZone(props);

                const modalFormStr = await formDropZone(event as MouseEvent);
                if (!modalFormStr) return;
                // ============================================
                // SHOW/publicaion THE MODAL WINDOW.
                // ============================================
                await modalwindow.asyncShowModalWindow(mainHtml, modalFormStr);
            };
            zoneHTML = document.querySelector("div.drop-zone[id='download-drop-zone']");
            // It is a button for close the modal window. It is inside of the modal window body.
            const divHtml: HTMLDivElement | null = (zoneHTML as HTMLElement).querySelector("#download-drop-zone p + div");
            if (divHtml) {
                // ============================================
                // HEANDLER OF AN EVENT OF A CLOSE FORM
                // ============================================
                divHtml.onmousedown = (event) => {
                    let currentTarget = event.currentTarget as HTMLDivElement;
                    if (!currentTarget) return;
                    while (currentTarget && !currentTarget.id && currentTarget.id !== "download-drop-zone") {
                        currentTarget = currentTarget.parentElement as HTMLDivElement;
                    }
                    currentTarget.remove();
                };
            };
            // ============================================
            // EVENT OF SEND FILE - listeners of Events &
            // It is a drop zone for a load XLS file to the server.
            // ============================================
            collectionOfEvents(zoneHTML as HTMLElement);
        }
        catch (error) {
            console.error(error);
        }
    };
};

export { asyncModalwindow };
