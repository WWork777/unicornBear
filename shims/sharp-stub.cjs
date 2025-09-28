// Minimal CommonJS stub for sharp used only during SSG builds to avoid loading
// native binaries. Exports a factory that returns an object with noop methods
// commonly used by imagetools-core / vite-imagetools.

module.exports = function () {
  return {
    resize() { return this; },
    toFormat() { return this; },
    toFile: async function () { return { info: { format: 'jpg', size: 0 } }; },
    toBuffer: async function () { return Buffer.from(''); },
    metadata: async function () { return { format: 'jpg', width: 0, height: 0 }; },
  };
};

// Also provide top-level async helpers that some consumers call directly
module.exports.resize = function () { return module.exports(); };
module.exports.toBuffer = async function () { return Buffer.from(''); };
module.exports.metadata = async function () { return { format: 'jpg', width: 0, height: 0 }; };
