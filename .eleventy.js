const fs = require('fs');
const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const responsiveImage = require('./src/_includes/shortcodes/responsive-image');
const markdownLib = markdownIt({ html: true, typographer: true });
const md = new markdownIt();

module.exports = function (eleventyConfig) {
    eleventyConfig.addWatchTarget('src/scss');

    eleventyConfig.setLibrary('md', markdownLib);

    eleventyConfig.addFilter('markdown', (value) => md.renderInline(value));

    eleventyConfig.addShortcode('responsiveImage', responsiveImage);

    // Make 404 page work with `eleventy --serve`
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, browserSync) {
                const content_404 = fs.readFileSync('public/404.html');

                browserSync.addMiddleware('*', (req, res) => {
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            },
        },
    });

    // compress html
    eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
        // Eleventy 1.0+: use this.inputPath and this.outputPath instead
        if (outputPath.endsWith('.html')) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
            return minified;
        }

        return content;
    });

    return {
        dir: {
            input: 'src',
            output: 'public',
        },
    };
};
