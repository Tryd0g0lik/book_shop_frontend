// download\src\load_catalog\functuions.ts
// This file performs following tasks:
// - open a modal window;
// - sending files;
// - close a modal window.
import { PATHNAME } from '../dorenv_';
import { ModalWindow, ButtonOnForm } from ".";
const CHUNK_SIZE: number = 1024 * 1024;
const buttononform = new ButtonOnForm();
// ---
async function handlerEventsForm(event: Event): Promise<void> {
    /**
     * This method is collection of handlers od forms &  method dropZone (below) it is collection handlers of events.
     */
    const logTemplText = "[handlerEventsForm]";

    try {
        const keyboardKey = (event as KeyboardEvent).key;
        const typeEvent = event.type.toLowerCase();
        let files: FileList | undefined = undefined;
        // DRAG & DROP
        if (
               typeEvent === "drop"
            ){
                files = (event as DragEvent).dataTransfer?.files;
            }
        // MORE EVENTS
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
        // Chenge a text of buttom 1 / 3
        buttononform.handlerOfButtonText(event, "Sending");
        try {
            // --- RECEIVE DATA OF FORMS.
            subHandlerFilesOfForm(files, CHUNK_SIZE);
        } catch (error) {
            // Change a text of buttom 2 / 3
            buttononform.handlerOfButtonText(event, "Error");
            throw error;
        }
        // Change a text of buttom 3 / 3
        buttononform.handlerOfButtonText(event, buttononform.textButtomOfForm);
        buttononform.cleanerOfFormes(event);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`[${logTemplText}][${handlerEventsForm.name}]: ${{ "cause": error }}`);
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
    const logTemplText = "[requestPost]";
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
            if (data) return data;
        }
        else console.log("Files was not sent!")
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`[${logTemplText}][${requestPost.name}]: ${{ "cause": error }}`);
        }
    }
    return false;
}

async function subHandlerFilesOfForm(files: FileList, sizeChank: number): Promise<undefined> {
    const formData = new FormData();
    const logTemplText = "[subHandlerFilesOfForm]";
    // Drap&Drop - Receive files.
    try {
        for (let ind = 0; ind < files.length; ind++) {
            const totalChunks = Math.ceil(files[ind].size / sizeChank);

            // --- SEND FILES TO THE SERVER.
            const f = files[ind].slice(0, -1);
            let sentChunkSize = 0;
            for (let i = 0; i < totalChunks; i++){

                const fileExtention = files[ind].name.split(".").pop() || "";
                const fileName = (files[ind].name as string).slice();
                formData.append("total_chunks", totalChunks.toString());
                formData.append("file_extention", fileExtention);
                formData.append("chunk_index", i.toString());
                // --- SEND FILES TO THE SERVER.
                formData.append("file_name", fileName);
                formData.append("file", f.slice(sentChunkSize, sentChunkSize += sizeChank));
                // Drap&Drop - Receive CSRF token
                const csrftokenHtml: HTMLInputElement | null = document.querySelector("[name='csrfmiddlewaretoken'");
                if (!csrftokenHtml) return;
                formData.append(csrftokenHtml.name, csrftokenHtml.value);
                const response = await requestPost(formData);

                console.log(`Response: ${typeof response === "object"
                    ? Object.keys(response)
                    : response}`);
                if (!response) {
                    throw new Error("Files was not sent!");
                };
            };
        };
    }
    catch (error) {
        throw new Error(`[${logTemplText}][${subHandlerFilesOfForm.name}]: ${(error as Error).message}`);
    };
};

const asyncModalwindow = async () => {
    /**
     * We should get a html block in main html block on the admin 'Catalog' page.
     * This is additional interfecae for a load the XLS file to the cataloc.
     */
    const modalwondow = new ModalWindow();
    // const filesupload = new ButtonOnForm();
    modalwondow.templatePath = "static/modal_pages/confirm_convert_alias.txt";
    const mainHtml: HTMLElement | null = document.querySelector("main[id='main'] header div[class='right']");
    if (!mainHtml) return;

    // It listener a click on a buttom in main html block - it is a form for
    //  a load XLS file to the product catalog.
    mainHtml.onmousedown = async (event) => {
        const zoneHTML: HTMLElement | null = document.querySelector("div.drop-zone[id='download-drop-zone']");
        try {
            if (!zoneHTML) {
                // OPEN FORM
                // Read the template of modal window (*.txt file).
                const modalFormStr = await modalwondow.asyncLoadTemplateOfModalWindow(event as MouseEvent);
                if (!modalFormStr) return;
                // Show/publicaion the modal window.
                await modalwondow.asyncShowModalWindow(mainHtml, modalFormStr);
            };
            if (!zoneHTML) return;
            // It is a button for close the modal window. It is inside of the modal window body.
            const divHtml: HTMLDivElement | null = zoneHTML.querySelector("#download-drop-zone p + div");
            if (divHtml) {
                // CLOSE FORM
                divHtml.onmousedown = (event) => {
                    let currentTarget = event.currentTarget as HTMLDivElement;
                    if (!currentTarget) return;
                    while (currentTarget && !currentTarget.id && currentTarget.id !== "download-drop-zone") {
                        currentTarget = currentTarget.parentElement as HTMLDivElement;
                    }
                    currentTarget.remove();
                };
            };
            // SEND FILE - listeners of Events &
            // It is a drop zone for a load XLS file to the server.
            collectionOfEvents(zoneHTML);
        }
        catch (error) {
            console.error(error);
        }
    };
};

export { asyncModalwindow };
