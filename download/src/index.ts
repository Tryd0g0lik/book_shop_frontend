
function publishButtomDownloadCatalog() {
    /**
     * Wagtail admin interface receivung a buttom ('<button type="button" data-name="download-catalog" ...>') for a download XLS file.
     * This function is a filter for this buttom. We can see it only on the page of catalog of product (publish her).
     */
    const regex_catalog = /(admin\/catalog\/\products\/)/;
    const regex_product_edit = /((admin\/catalog\/products\/)(edit\/[0-1]+\/?))/;
    const buttomHtml = document.querySelector("[data-name='download-catalog']");
    try {
        if (!buttomHtml) return;
        if (!(window.location.href.match(regex_catalog))
            && !(window.location.href.match(regex_product_edit))) {
            buttomHtml.remove();
        };


    } catch (error) {
        throw error
    }
}

document.addEventListener("DOMContentLoaded", () =>{
    try{
        publishButtomDownloadCatalog();
    } catch (error) {
        console.error(error);
    }
});
