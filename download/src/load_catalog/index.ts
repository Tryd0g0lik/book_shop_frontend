// download\src\load_catalog\index.ts


// Send (from an admin's catalog) a file to the server.
const pathname = "/download/files/";

class ModalWindow {
    __templatePathname?: string;
    logTemplText?: string;
    __sizeFile: number = 1024;
    __textButtomOfForm?: string;
    constructionor() {
        /**
         * @param __templatePathname: string | undefined - path to a template html/txt file. This is the 'confirm_convert_alias.txt' now.
         * @param logTemplText: string - Prefix for a tex log.
         */
        this.__templatePathname = undefined;
        this.logTemplText = "[ModalWindow]";
        this.__textButtomOfForm = "Download";
    }

    static __getClassName(): string{
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
         * @returns Promise<string | undefined> or err.
         */
        const regex = /(\.txt|\.html)$/i;
        try {
            let target = event.target as HTMLElement | null;
            if (!target) return;
            while (!target.hasAttribute("data-name")
                && target.getAttribute("name") !== "download-catalog") {
                target = target.parentElement as HTMLElement;
            }
            const dataName: string | null = target.getAttribute("data-name");
            if (!dataName) return;
            if (dataName.toLowerCase() !== "download-catalog") return;
            // Read the template HTML/txt of file.
            if ( !(regex.test(this.templatePath as string))) throw new Error(`[${this.logTemplText}][${this.asyncLoadTemplateOfModalWindow.name}]: ${{"cause": "Template path is not a valid file!"}}` );
            const file_ = await fetch(window.location.origin + "/" + this.templatePath as string);
            if (!file_.ok) {
                new Error(`[${this.logTemplText}][${this.asyncLoadTemplateOfModalWindow.name}]: Templete html, for reciving modal html block was hot found!`);
            };
            return await file_.text();
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.includes(`${this.logTemplText}`)){
                    throw new Error(`[${this.logTemplText}][${this.asyncLoadTemplateOfModalWindow.name}]: ${{"cause": error}}`);
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
                throw new Error(`[${this.logTemplText}][${this.asyncShowModalWindow.name}]: ${ {"cause": error }}`);
            };
        }
    }
    async dropZone(dropZone: HTMLElement): Promise<void> {
        const formHtml: HTMLFormElement | null = dropZone.querySelector(`form[action='${pathname}']`);
        if (!formHtml) return;
        // else if ((formHtml as HTMLFormElement).files.length === 0) return;
        // Drap&Drop - File entering to the zone of drop
        dropZone.removeEventListener("dragenter", event => {
            event.preventDefault();
        });
        dropZone.addEventListener("dragenter", event => {
            event.preventDefault();
        });
        dropZone.removeEventListener("dragover", event => {
            event.preventDefault();
        });
        dropZone.addEventListener("dragover", event => {
            event.preventDefault();
        });

        // Drap&Drop - File exit from the zone of drop
        dropZone.removeEventListener("dragleave", event => {
            event.preventDefault();
        });
        dropZone.addEventListener("dragleave", event => {
            event.preventDefault();
        });
        // Drap&Drop - File drop
        dropZone.removeEventListener("drop", async event => {
            event.preventDefault();
            await this.handlerOfDrapDropForm(event);
        });

        dropZone.addEventListener("drop", async event => {
            /**
             * Drap&Drop - Here we get data from a browser.
             */
            event.preventDefault();
            await this.handlerOfDrapDropForm(event);
        });
        // ---

        formHtml.removeEventListener("mousedown", (event: MouseEvent) => {
            this.handlerEventsForm(event);
        });
        formHtml.addEventListener("mousedown", (event: MouseEvent) => {
            this.handlerEventsForm(event);
        });
        formHtml.removeEventListener("keydown", (event: KeyboardEvent) => {
            this.handlerEventsForm(event);
        });
        formHtml.addEventListener("keydown", (event: KeyboardEvent) => {
            this.handlerEventsForm(event);
        });
        formHtml.removeEventListener("submit", (event: SubmitEvent) => {
            this.handlerEventsForm(event);
        });
        formHtml.addEventListener("submit", (event: SubmitEvent) => {
            this.handlerEventsForm(event);
        });
         formHtml.removeEventListener("change", (event: Event) => {
            this.handlerEventsForm(event);
        });
        formHtml.addEventListener("change", (event: Event) => {
            this.handlerEventsForm(event);
        });
    }

    async handlerOfDrapDropForm(event: DragEvent): Promise<void> {
        const files: FileList | undefined = event.dataTransfer?.files;
        if (!files) return;
        // Receive data of forms.

        try {
            const formData = this.handlerFilesOfForm(files, this.__sizeFile);
            if (!formData) return;
            // --- SEND FILES TO THE SERVER.
            await this.requestPost(formData);
        }
        catch (error: Error | unknown) {
            if (error instanceof Error) {
                throw new Error(`[${this.logTemplText}][${this.dropZone.name}]: ${{"cause": error }}`);
            };
        }
    }

    async handlerEventsForm(event: Event): Promise<void> {
        /**
         * This method is collection of handlers od forms &  method dropZone (below) it is collection handlers of events.
         */
        try {
            const keyboardKey = (event as KeyboardEvent).key;
            const typeEvent = event.type.toLowerCase();
            if ((typeEvent !== "submit") && (
                typeEvent === "mousedown" && (
                    event.target as HTMLElement).tagName.toLowerCase() !== "input") && (
                    keyboardKey && keyboardKey.toLowerCase() !== "enter"
                    && keyboardKey.toLowerCase() !== "escape"
                )
            ) return;
            const files: FileList | undefined = (event.target as HTMLFormElement).files;
            if (!files || files.length === 0) return;
            // Chenge a text of buttom 1 / 2
            this.__handlerOfButtom(event, "Sending");
            // --- RECEIVE DATA OF FORMS.
            const formData = this.handlerFilesOfForm(files, this.__sizeFile);
            if (!formData) return;
            // --- SEND FILES TO THE SERVER.
            const responce = await this.requestPost(formData);
            // Change a text of buttom 2 / 2
            if (!responce) {
                this.__handlerOfButtom(event, "Error");
                return;
            };
            this.__handlerOfButtom(event, this.__textButtomOfForm);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`[${this.logTemplText}][${this.handlerEventsForm.name}]: ${{"cause": error }}`);
            }
        }
    }

    handlerFilesOfForm(files: FileList, sizeFile: number): FormData | undefined {
        const formData = new FormData();
        // Drap&Drop - Receive files.
        Array.from(files).forEach(file => {
            for (let i = 0; i < file.size; i += sizeFile) {
                formData.append(file.name, file.slice(i, i + sizeFile));
            };
        });
        // Drap&Drop - Receive CSRF token
        const csrftokenHtml: HTMLInputElement | null = document.querySelector("[name='csrfmiddlewaretoken'");
        if (!csrftokenHtml) return;
        formData.append(csrftokenHtml.name, csrftokenHtml.value);
    return formData;
    }

    __handlerOfButtom(event: Event, text = "Sending"): void {
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
            if (!buttomHtml) return;

            if (buttomHtml.textContent.length > 10){
                buttomHtml.classList.add("active");
                this.__textButtomOfForm = buttomHtml.innerHTML;
                buttomHtml.innerHTML = "";
                buttomHtml.insertAdjacentText("beforeend", text);
            } else {

                buttomHtml.innerHTML = "";
                if (text.toLowerCase().includes("error")) {
                    buttomHtml.insertAdjacentText("beforeend", text);
                }
                else {
                    buttomHtml.insertAdjacentHTML("beforeend", this.__textButtomOfForm as string);
                    buttomHtml.classList.remove("active");
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`[${this.logTemplText}][${this.__handlerOfButtom.name}]: ${{ "cause": error }}`);
            }
        }
    }

    cleanerOfFormes(event: Event): void {
        // Clean a form.
        const currentTarget = event.currentTarget as HTMLFormElement | null;
        if (!currentTarget) return;
        currentTarget.reset();
    }

    async requestPost(formData: FormData): Promise<boolean | object> {
        /**
         * Drap&Drop - Here we send files to the server.
         * @param formData: FormData - form data for request.
         * @return Promise<Boolean | JsonSourceFile> - false or data of json/object.
         */
        try {
            const response = await fetch(pathname,
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
                throw new Error(`[${this.logTemplText}][${this.requestPost.name}]: ${{ "cause": error }}`);
            }
        }
        return false;
    }
};
export { ModalWindow };
