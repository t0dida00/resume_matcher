// Kiểm tra chữ ký PDF (%PDF-)
function isPdfBuffer(buf) {
    if (!buf || buf.length < 5) return false;
    const header = buf.subarray(0, 5).toString("ascii");
    return header === "%PDF-";
}

module.exports = { isPdfBuffer };
