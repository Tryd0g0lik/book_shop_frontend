// This file it is an additional to the Wagtail interface.
// That additional in page  of position product of 'catalog',
// UTL (exemple, backend): '/admin/catalog/productgalleryimagemodel/edit/1/'.

function customForm() {

    if (!(window.location.href.match(/((admin\/catalog\/\w+\/)(edit\/[0-1]+\/?))/))) return;
    const boxHtmlAll = document.querySelectorAll(".custom-property-value");

    // Find all elements with the id "inline_child_". It is a list from boxes which conteins additional properties
    // It is a main sections of the code.
    const inlineChildPropertyHtmlAll = [] as HTMLElement[];
    boxHtmlAll.forEach((boxHtml) => {
        const inlineChildArr = boxHtml.querySelectorAll<HTMLElement>("[id^='inline_child_']");
        inlineChildPropertyHtmlAll.push(...inlineChildArr as unknown as HTMLElement[]);
    });

    if (inlineChildPropertyHtmlAll.length !== 0) {
        const worksBoks = Array.from(inlineChildPropertyHtmlAll).filter(item => item.id.startsWith("inline_child_")
            && item.id.split("-")[item.id.split("-").length - 1].match(/[0-9]+/) !== null);

        worksBoks.forEach((item: HTMLElement) => {
            const itemContent = item.querySelector("[id^='inline_child_'][id$='-panel-content']");
            if (itemContent === null) return;
            const buttomHTMLAll = item.querySelectorAll("button.w-panel__toggle");
            // Add all attributes which we are getting (in code) when cliking on the buttum.
            itemContent.setAttribute("hidden", "until-found");
            buttomHTMLAll[0].setAttribute("aria-expanded", "false");
        });
    }
};

document.removeEventListener("DOMContentLoaded", () => {
    try {
        customForm();
    }
    catch (error) {
        console.error(error);
    };
});
document.addEventListener("DOMContentLoaded", () => {
    try {
        customForm();
    }
    catch (error) {
        console.error(error);
    };
});
