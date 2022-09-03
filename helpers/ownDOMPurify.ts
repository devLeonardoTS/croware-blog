import DOMPurify from "dompurify";

export const ownDOMPurify = (content: any) => {
    const clean = DOMPurify.sanitize(content, {
        USE_PROFILES: {
            html: true,
            svg: true,
            svgFilters: true,
            mathMl: true,
        },
        ADD_TAGS: ["iframe"],
    });
    return clean;
};

export default ownDOMPurify;
