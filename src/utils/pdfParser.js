// Polyfill cho Node.js (DOMMatrix không tồn tại trong Node.js)
if (typeof global !== "undefined" && !global.DOMMatrix) {
    global.DOMMatrix = class DOMMatrix {
        constructor(init) {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
            if (Array.isArray(init) && init.length === 6) {
                [this.a, this.b, this.c, this.d, this.e, this.f] = init;
            }
        }
    };
}
const { PDFParse } = require("pdf-parse");

// Parse PDF buffer và trích xuất thông tin
async function parsePDF(buffer) {
    try {
        // Tạo instance của PDFParse với buffer PDF
        const parser = new PDFParse({ data: buffer });

        // Lấy thông tin metadata
        const infoResult = await parser.getInfo({ parsePageInfo: true });

        // Lấy nội dung text
        const textResult = await parser.getText();

        // Giải phóng tài nguyên
        await parser.destroy();
        return {
            success: true,
            info: {
                // pages: infoResult.total,
                // title: infoResult.info?.Title || "N/A",
                author: infoResult.info?.Author || "N/A",
                // subject: infoResult.info?.Subject || "N/A",
                // creator: infoResult.info?.Creator || "N/A",
                // producer: infoResult.info?.Producer || "N/A",
                // creationDate: infoResult.info?.CreationDate || "N/A",
            },
            text: textResult.text,
            // normalizedText: normalizedText,
            // totalPages: infoResult.total,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
}

module.exports = { parsePDF };


