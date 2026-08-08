// download\src\load_catalog\index.ts
import { Timer } from "../timer";
import { MAX_FILE_SIZE_BYTES } from "../dorenv_";

// Send (from an admin's catalog) a file to the server.
class ModalWindow {
    __templatePathname?: string;
    __prefixLog: string = "[ModalWindow]";
    __MAX_FILE_SIZE_BYTES: number = Number(MAX_FILE_SIZE_BYTES);
    constructionor() {
        /**
         * @param __templatePathname: string | undefined - path to a template html/txt file. This is the 'confirm_convert_alias.txt' now.
         * @param __prefixLog: string - Prefix for a tex log.
         * @param MAX_FILE_SIZE_BYTES: number - THis is max size of bytes/Mb for upload a single Excel file.
         */
        this.__templatePathname = undefined;
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

    checkSizeFile(file?: FileList) {
        // Check valid of a file size
        // true if the file less then the 'MAX_FILE_SIZE_BYTES' or more.
        try {
            if (!file) return false;
            for (let i = 0; i < file.length; i++) {
                if (file[i].size > this.__MAX_FILE_SIZE_BYTES) return false;
            }
        } catch (err) {
            if (err instanceof Error) {
                const errorT = `${this.__prefixLog}[${this.checkSizeFile.name}]: ${err.name} => ${err.message}`;
                console.error(errorT);
                return false;
            }
        }
        return true;
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
                throw new Error(`[${this.__prefixLog}][${this.asyncShowModalWindow.name}]: ${error}`);
            }
        }
    }
};


class ButtonOnForm {
    textButtomOfForm?: string;
    __prefixLog?: string;
    timer = new Timer(3);
    __spanHTML?: HTMLSpanElement | ChildNode;
    __textElemenet?: string | ChildNode;
    constructor() {
        this.textButtomOfForm = "It was uploaded successfully!";
        this.__prefixLog = "[FilesUpload]";
        this.__spanHTML = undefined;
        this.__textElemenet = undefined;
    };

    handlerOfButtonText(event: Event, text = "Sending"): void {
        /**
         * This method work with a buttom of form.
         * HEre is we created a new buttom with the 'text' name;
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
            if (!(buttomHtml).hasChildNodes()) {
                throw new Error(`${this.__prefixLog}[${this.handlerOfButtonText.name}]: Error => Buttom of test not found!`);
            };
            const childrens: NodeListOf<ChildNode> = buttomHtml.childNodes;
            // ============================================
            // GETING THE BUTTOM OF CHILDREN RLRMRNTS
            // ============================================
            if (childrens.length >= 3){
                this.__spanHTML = childrens[1].cloneNode(true) as ChildNode;
                this.__textElemenet = childrens[2].cloneNode(true) as ChildNode;
            };
            // ---
            if (!buttomHtml.textContent.toLowerCase().includes("sending")) {
                buttomHtml.classList.add("active");
                // ============================================
                // CHANGING THE TEXT OF BUTTOM
                // ============================================
                buttomHtml.innerText = "";
                buttomHtml.insertAdjacentElement("afterbegin", this.__spanHTML as HTMLSpanElement);
                buttomHtml.insertAdjacentText("beforeend", text);
            } else {
                buttomHtml.innerText = "";

                if (text.toLowerCase().includes("error")) {
                    // buttomHtml.querySelector("span")?.remove();

                    // buttomHtml.insertAdjacentElement("afterbegin", spanHTML);
                    buttomHtml.insertAdjacentText("beforeend", text);
                }
                else {
                    // ============================================
                    // CHANGING THE TEXT OF BUTTOM
                    // ============================================
                    buttomHtml.insertAdjacentElement("afterbegin", this.__spanHTML as HTMLSpanElement);
                    buttomHtml.insertAdjacentHTML("beforeend", this.textButtomOfForm as string);
                    // ============================================
                    // TIMER 3 seconds
                    // ============================================
                    this.timer.getTimer();
                    // ============================================
                    // REMOVE THE CLASS NAME
                    // ============================================
                    buttomHtml.classList.remove("active");
                    // ============================================
                    // CHANGING THE TEXT OF BUTTOM
                    // ============================================
                    buttomHtml.innerText = "";
                    buttomHtml.insertAdjacentElement("afterbegin", this.__spanHTML as HTMLSpanElement);
                    buttomHtml.insertAdjacentText("beforeend", (this.__textElemenet as HTMLTextAreaElement).textContent);
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`[${this.__prefixLog}][${this.handlerOfButtonText.name}]: ${{"cause": error}}`);
            }
        }
    };

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
