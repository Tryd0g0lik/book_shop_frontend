// download\src\load_catalog\functuions.ts
// This file performs following tasks:
// - open a modal window;
// - sending files;
// - close a modal window.
import { PATHNAME, MAX_CHUNK_SIZE_FILE_BYTES } from '../dorenv_';
import { ModalWindow, ButtonOnForm } from ".";
import {Timer} from "../timer";
// Size of chunk for sending of chunks
const CHUNK_SIZE: number = Number(MAX_CHUNK_SIZE_FILE_BYTES) // 1024 * 1024;
const buttononform = new ButtonOnForm();
// ---- Templete of a heandler of events ----
// After events we read the *.txt file from path 'download/static/modal_pages'
// This is the heandler  which is open the form for upload the file.
type T = {"templatePath": string, "prefixLog": string}
function getFormDropZone(props: T): CallableFunction {
    const {templatePath, prefixLog} = props;
    async function asyncLoadTemplateOfModalWindow(event: MouseEvent): Promise<string | undefined> {
        /**
         * Open a modal window.
         * We have a task  it read a template HTML/txt file and send it next handlers.
         * This html file is location by a server path - 'templatePath' or can inser new template whem we initional the ModalWindow's obj.
         * @param event: MouseEvent.
            && target.getAttribute("name") !== "download-catalog"
         * @returns Promise<string | undefined> or err.
        */

        const regex = /(\.txt|\.html)$/i;
        try {
            let target = event.target as HTMLElement | null;
            if (!target) return;
            let i = 0;
            while (!target.hasAttribute("data-name")) {
                target = target.parentElement as HTMLElement;
                if (i > 4) return;
                i++;
            }
            const dataName: string | null = target.getAttribute("data-name");
            if (!dataName) return;
            if (dataName.toLowerCase() !== "download-catalog") return;
            // Read the template HTML/txt of file.
            if ( !(regex.test(templatePath as string))) throw new Error(`[${prefixLog}][${asyncLoadTemplateOfModalWindow.name}]:
                ${{ "cause": "Template path is not a valid file!" }}` );
            const file_ = await fetch(window.location.origin + "/" + templatePath as string);
            if (!file_.ok) {
                new Error(`[${prefixLog}][${asyncLoadTemplateOfModalWindow.name}]: Templete html, for reciving modal html block was hot found!`);
            };
            return await file_.text();
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.includes(`${prefixLog}`)){
                    throw new Error(`[${prefixLog}][${asyncLoadTemplateOfModalWindow.name}]: ${{ "cause": error.message }}`);
                }
                else {
                    throw new Error(`${error.message }`);
                };
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
    const timer = new Timer(3);
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
        // ============================================
        // CHECKING OF A FILE SIZE
        // ============================================
        const resultBool = modalW.checkSizeFile(files);
        if (!resultBool) {
            // Chenge a text of buttom 1 / 4
            // If the file size is too large
            buttononform.handlerOfButtonText(event, "More when the max-size!");
            timer.getTimer()
            return
        };
        if (!files || files.length === 0) return;
        // Chenge a text of buttom 2 / 4
        buttononform.handlerOfButtonText(event, "Sending now");
        try {
            // --- RECEIVE DATA OF FORMS.
            subHandlerFilesOfForm(files, CHUNK_SIZE);
        } catch (error) {
            // Change a text of buttom 3 / 4
            buttononform.handlerOfButtonText(event, "Error");
            throw error;
        }
        // Change a text of buttom 4 / 4
        buttononform.handlerOfButtonText(event, buttononform.textButtomOfForm);

        // ============================================
        // CLEARING OF FORM
        // ============================================
        buttononform.cleanerOfFormes(event);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`[${prefixLog}][${handlerEventsForm.name}]: ${{ "cause": error }}`);
        }
    }
    // this.cleanerOfFormes(event);
}

async function collectionOfEvents(dropZone: HTMLElement): Promise<void> {
    const formHtml: HTMLFormElement | null = dropZone.querySelector(`form[action='${PATHNAME}']`);
    if (!formHtml) return;
    // else if ((formHtml as HTMLFormElement).files.length === 0) return;
    // Drap&Drop - File entering to the zone of drop
    dropZone.removeEventListener("dragenter", (event) => {
        event.preventDefault();
    });
    dropZone.addEventListener("dragenter", (event) => {
        event.preventDefault();
    });
    dropZone.removeEventListener("dragover", (event) => {
        event.preventDefault();
    });
    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    // Drap&Drop - File exit from the zone of drop
    dropZone.removeEventListener("dragleave", (event) => {
        event.preventDefault();
    });
    dropZone.addEventListener("dragleave", (event) => {
        event.preventDefault();
    });
    // Drap&Drop - File drop
    dropZone.removeEventListener("drop", async (event) => {
        event.preventDefault();
        // await this.handlerOfDrapDropForm(event);
        handlerEventsForm(event);
    });

    dropZone.addEventListener("drop", async (event) => {
        /**
         * Drap&Drop - Here we get data from a browser.
         */
        event.preventDefault();
        // await this.handlerOfDrapDropForm(event);
        handlerEventsForm(event);
    });
    // ---

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
}

async function requestPost(formData: FormData): Promise<boolean | object> {
    /**
     * Drap&Drop - Here we send files to the server.
     * @param formData: FormData - form data for request.
     * @return Promise<Boolean | JsonSourceFile> - false or data of json/object.
     */
    const prefixLog = "[requestPost]";
    try {
        const response = await fetch(window.location.origin + PATHNAME,
            {
                method: "POST",
                body: formData,
            },
        );
        if (response.ok) {
            console.log("Files was sent successfully!");
            const data = await response.json();
            data["status"] = response.status;
            return data;
        }
        else {
            console.log("Files was not sent!");
            const data = Object.assign({}, { "status": response["status"] });
            return data;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`[${prefixLog}][${requestPost.name}]: ${error}`);
        }
    }
    return false;
}

async function subHandlerFilesOfForm(files: FileList, chunkSize: number): Promise<undefined> {
    const formData = new FormData();
    const prefixLog = "[subHandlerFilesOfForm]";
    // Drap&Drop - Receive files.
    try {
        for (let ind = 0; ind < files.length; ind++) {
            const file = files[ind];
            const totalChunks = Math.ceil(file.size / chunkSize);

            // let sentChunkSize = 0;
            for (let i = 0; i < totalChunks; i++) {
                // --- SEND FILES TO THE SERVER.
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
                // --- SEND FILES TO THE SERVER.
                formData.append("file_name", fileName);
                // formData.append("file", f.slice(sentChunkSize, sentChunkSize + sizeChank));
                // formData.append("file", f.(sentChunkSize, sentChunkSize + sizeChank));
                console.log("Numb chunk: ", endByte);

                // Drap&Drop - Receive CSRF token
                const csrftokenHtml: HTMLInputElement | null = document.querySelector("[name='csrfmiddlewaretoken'");
                if (!csrftokenHtml) return;
                formData.append(csrftokenHtml.name, csrftokenHtml.value);
                const response = await requestPost(formData);

                console.log(`Response: ${typeof response === "object"
                    ? Object.keys(response).map(key => `${key}: ${(response as any)[key]}`)
                    : response}`);
                if (!response) {
                    throw new Error("Files was not sent!");
                };
            };
        };
    }
    catch (error) {
        throw new Error(`[${prefixLog}][${subHandlerFilesOfForm.name}]: ${(error as Error).message}`);
    };
};

const asyncModalwindow = async () => {
    /**
     * We should get a html block in main html block on the admin 'Catalog' page.
     * This is additional interfecae for a load the XLS file to the cataloc.
     */
    const modalwondow = new ModalWindow();
    modalwondow.templatePath = "static/modal_pages/confirm_convert_alias.txt";
    const mainHtml: HTMLElement | null = document.querySelector("main[id='main'] header div[class='right']");
    if (!mainHtml) return;

    // It listener a click on a buttom in main html block - it is a form for
    //  a load XLS file to the product catalog.
    mainHtml.onmousedown = async (event) => {
        const zoneHTML: HTMLElement | null = document.querySelector("div.drop-zone[id='download-drop-zone']");
        try {
            if (!zoneHTML) {
                // ============================================
                // EVENT OF OPEN FORM
                // ============================================
                // Read the template of modal window (*.txt file).
                const props = {"templatePath": modalwondow.templatePath, "prefixLog": modalwondow.__prefixLog};
                const formDropZone = getFormDropZone(props);

                const modalFormStr = await formDropZone(event as MouseEvent);
                if (!modalFormStr) return;
                // ============================================
                // SHOW/publicaion THE MODAL WINDOW.
                // ============================================
                await modalwondow.asyncShowModalWindow(mainHtml, modalFormStr);
            };
            if (!zoneHTML) return;
            // It is a button for close the modal window. It is inside of the modal window body.
            const divHtml: HTMLDivElement | null = zoneHTML.querySelector("#download-drop-zone p + div");
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
            collectionOfEvents(zoneHTML);
        }
        catch (error) {
            console.error(error);
        }
    };
};

export { asyncModalwindow };
