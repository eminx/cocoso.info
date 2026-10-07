"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "detectContentType", {
    enumerable: true,
    get: function() {
        return detectContentType;
    }
});
const _detector = require("next/dist/compiled/image-detector/detector.js");
const _imagetype = require("./image-type");
async function detectContentType(buffer) {
    if (buffer.byteLength === 0) {
        return null;
    }
    if ([
        0xff,
        0xd8,
        0xff
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.JPEG;
    }
    if ([
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.PNG;
    }
    if ([
        0x47,
        0x49,
        0x46,
        0x38
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.GIF;
    }
    if ([
        0x52,
        0x49,
        0x46,
        0x46,
        0,
        0,
        0,
        0,
        0x57,
        0x45,
        0x42,
        0x50
    ].every((b, i)=>!b || buffer[i] === b)) {
        return _imagetype.WEBP;
    }
    if ([
        0x3c,
        0x3f,
        0x78,
        0x6d,
        0x6c
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.SVG;
    }
    if ([
        0x3c,
        0x73,
        0x76,
        0x67
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.SVG;
    }
    if ([
        0,
        0,
        0,
        0,
        0x66,
        0x74,
        0x79,
        0x70,
        0x61,
        0x76,
        0x69,
        0x66
    ].every((b, i)=>!b || buffer[i] === b)) {
        return _imagetype.AVIF;
    }
    if ([
        0x00,
        0x00,
        0x01,
        0x00
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.ICO;
    }
    if ([
        0x69,
        0x63,
        0x6e,
        0x73
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.ICNS;
    }
    if ([
        0x49,
        0x49,
        0x2a,
        0x00
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.TIFF;
    }
    if ([
        0x42,
        0x4d
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.BMP;
    }
    if ([
        0xff,
        0x0a
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.JXL;
    }
    if ([
        0x00,
        0x00,
        0x00,
        0x0c,
        0x4a,
        0x58,
        0x4c,
        0x20,
        0x0d,
        0x0a,
        0x87,
        0x0a
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.JXL;
    }
    if ([
        0,
        0,
        0,
        0,
        0x66,
        0x74,
        0x79,
        0x70,
        0x68,
        0x65,
        0x69,
        0x63
    ].every((b, i)=>!b || buffer[i] === b)) {
        return _imagetype.HEIC;
    }
    if ([
        0x25,
        0x50,
        0x44,
        0x46,
        0x2d
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.PDF;
    }
    if ([
        0x00,
        0x00,
        0x00,
        0x0c,
        0x6a,
        0x50,
        0x20,
        0x20,
        0x0d,
        0x0a,
        0x87,
        0x0a
    ].every((b, i)=>buffer[i] === b)) {
        return _imagetype.JP2;
    }
    const format = (0, _detector.detector)(buffer.subarray(0, 1024));
    switch(format){
        case 'webp':
            return _imagetype.WEBP;
        case 'png':
            return _imagetype.PNG;
        case 'jpg':
            return _imagetype.JPEG;
        case 'gif':
            return _imagetype.GIF;
        case 'svg':
            return _imagetype.SVG;
        case 'jxl':
        case 'jxl-stream':
            return _imagetype.JXL;
        case 'jp2':
            return _imagetype.JP2;
        case 'tiff':
            return _imagetype.TIFF;
        case 'bmp':
            return _imagetype.BMP;
        case 'ico':
            return _imagetype.ICO;
        case 'icns':
            return _imagetype.ICNS;
        case 'heif':
        case 'cur':
        case 'dds':
        case 'j2c':
        case 'ktx':
        case 'pnm':
        case 'psd':
        case 'tga':
        case undefined:
            return null // unsupported formats
            ;
        default:
            format; // exhaustive check
            return null // impossible to reach
            ;
    }
}

//# sourceMappingURL=detect-content-type.js.map