// // src\catalog_filters.ts
// class VisualEffect{
//     divHtml: HTMLDivElement | null;
//     constructor(obj: HTMLDivElement | null = null ){
//         this.divHtml = obj ? obj : document.querySelector("div.changelist-filter");
//     }

//     is_exist(): boolean {
//         if (this.divHtml) {
//             return true;
//         }
//         return false;
//     }
// }

// function handlerEvent(event: MouseEvent): void {
//     if ((event.type !== "mousedown") || ((event.target as HTMLElement)?.tagName.toLowerCase() !== "div")||(
//         !(event.target as HTMLDivElement).classList.contains("changelist-filter"))
//     ) return;
//     event.preventDefault();

//     const target = event.target as HTMLDivElement;
//     const divBox = new VisualEffect(target);
//     const

//     if (!this.is_exist()) return;
//     const ulHtmlArr = this.divHtml?.querySelectorAll(" div > ul") as HTMLElement[] | undefined;
//     if (!ulHtmlArr) return;
//     Array.from(ulHtmlArr).forEach((ulHtml) => {

//     })
// }
/***
 * Для реализации нужен API с целью обращения к базе данных без перезагруяки страниц
 *
 * div.changelist-filter.col3 > ul.incative {
    overflow: hidden;
    display: block;
    min-height: 33px;
    max-height: 3px;
}

 */
