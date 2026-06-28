// download\src\load_catalog\functuions.ts
// This file performs following tasks:
// - open a modal window;
// - sending files;
// - close a modal window.

import { ModalWindow } from ".";
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
            modalwondow.collectionEvents(zoneHTML)
        }
        catch (error) {
            console.error(error);
        }
    };
};

export { asyncModalwindow };
