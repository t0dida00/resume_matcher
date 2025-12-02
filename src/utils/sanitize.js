function sanitizeFilename(name) {
    return (name || "cv.pdf")
        .replace(/[/\\?%*:|"<>]/g, "_")
        .replace(/[^\w.\-]/g, "_");
}

module.exports = { sanitizeFilename };
