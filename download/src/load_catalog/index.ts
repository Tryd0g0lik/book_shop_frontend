// download\src\load_catalog\index.ts
// Send (from an admin's catalog) a file to the server.
class ModalWindow {
    __templatePathname?: string;
    logTemplText?: string;


    constructionor() {
        /**
         * @param __templatePathname: string | undefined - path to a template html/txt file. This is the 'confirm_convert_alias.txt' now.
         * @param logTemplText: string - Prefix for a tex log.
         */
        this.__templatePathname = undefined;
        this.logTemplText = "[ModalWindow]";
    }

    static __getClassName(): string {
        return this.name;
    }

    set templatePath(value: string) {
        this.__templatePathname = value;
    }

    get templatePath() {
        return this.__templatePathname as string;
    }

    async asyncLoadTemplateOfModalWindow(event: MouseEvent): Promise<string | undefined> {
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
            if ( !(regex.test(this.templatePath as string))) throw new Error(`[${this.logTemplText}][${this.asyncLoadTemplateOfModalWindow.name}]: ${{ "cause": "Template path is not a valid file!" }}` );
            const file_ = await fetch(window.location.origin + "/" + this.templatePath as string);
            if (!file_.ok) {
                new Error(`[${this.logTemplText}][${this.asyncLoadTemplateOfModalWindow.name}]: Templete html, for reciving modal html block was hot found!`);
            };
            return await file_.text();
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.includes(`${this.logTemplText}`)){
                    throw new Error(`[${this.logTemplText}][${this.asyncLoadTemplateOfModalWindow.name}]: ${{ "cause": error.message }}`);
                }
                else {
                    throw new Error(`${{ "cause": error.message }}`);
                };
            }
        }
    }

    async asyncShowModalWindow(parentHtml: HTMLElement, bodyStr: string): Promise<void> {
        /**
         *
         * We have a task  it show a modal window with a html block.
         * @param parentHtml: HTMLElement - parent html block for a modal window.
         * @param bodyStr: string - html content of modal window for a html parent.
         * @returns Promis<void> or err.
         */
        try {
            parentHtml.insertAdjacentHTML("afterbegin", bodyStr);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`[${this.logTemplText}][${this.asyncShowModalWindow.name}]: ${{ "cause": error }}`);
            };
        }
    }
}

class ButtonOnForm {

    textButtomOfForm?: string;
    logTemplText?: string;
    constructor() {
        this.textButtomOfForm = "Download";
        this.logTemplText = "[FilesUpload]";
    }

    handlerOfButtonText(event: Event, text = "Sending"): void {
        /**
         * This method work with a buttom of form.
         * @param text: string - text of buttom. Default: "Sending".
         * @retrun void.
         */
        try {
            let target = event.target as HTMLElement | null;
            while (target && target.id && target.id !== "download-drop-zone") {
                target = target.parentElement;
            };
            if (!target) return;
            const buttomHtml: HTMLButtonElement | null = target.querySelector("button");
            if (!buttomHtml) {
                return;
             };

            if (!buttomHtml.textContent.toLowerCase().includes("sending")){
                buttomHtml.classList.add("active");
                this.textButtomOfForm = buttomHtml.innerHTML;
                buttomHtml.innerHTML = "";
                buttomHtml.insertAdjacentText("beforeend", text);
            } else {

                buttomHtml.innerHTML = "";
                if (text.toLowerCase().includes("error")) {
                    buttomHtml.insertAdjacentText("beforeend", text);
                }
                else {
                    buttomHtml.insertAdjacentHTML("beforeend", this.textButtomOfForm as string);
                    buttomHtml.classList.remove("active");
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`[${this.logTemplText}][${this.handlerOfButtonText.name}]: ${{ "cause": error }}`);
            }
        }
    }

    cleanerOfFormes(event: Event): void {
        // Clean a form.
        const currentTarget = event.currentTarget as HTMLFormElement | null;
        if (!currentTarget) return;
        else if (currentTarget.tagName.toLowerCase() !== "form") {
            (currentTarget.querySelector("form") as HTMLFormElement).reset();
        }
        else {
            currentTarget.reset();
        }
    }
};
export { ModalWindow, ButtonOnForm };
