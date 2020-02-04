const replaceInFiles = require('replace-in-files');
const childProcess = require('child_process');

async function main(){
    console.log("PASSANT A DESENVOLUPAMENT DE FIDDEAL WEB-APP");

    /*OPCIONS VARIABLES DE CODI*/
    const options = {
        files : [
            'public/javascripts/utilities/storage.js'
        ],
        from: "let inLocalDeveloptment = false",
        to: "let inLocalDeveloptment = true",
        optionsForFiles: {},
        saveOldFile: false,
        encoding: 'utf8',
        shouldSkipBinaryFiles: true,
        onlyFindPathsWithoutReplace: false,
        returnPaths: true,
        returnCountOfMatchesByPaths: true,
    };

    console.log("       =====> SWITCH TO DEVELOPMENT STATUS");
    await replaceInFiles(options);

    /*OPCIONS .MIN.CSS i .MIN.JS a .CSS i .JS*/
    options.files = [
        'public/*.html',
        'public/html/*.html'
    ];
    options.from = /bundled\/.*\.min\.js|stylesheets\/.*\.min\.css/g;
    options.to = (args1) => {
        try {
            if (args1.includes(".min")){
                if (args1.includes("stylesheets"))
                    return args1.replace(".min.css", ".css");
                else
                    return args1.replace(".min.js", ".js");
            } else
                return args1;
        } catch (error){
            console.log(error);
            return args1;
        }
    };

    console.log("       =====> SET USED JAVASCRIPT & CSS TO NON MINIFIED");
    await replaceInFiles(options);

    console.log("       =====> BROWSERIFY JAVASCRIPT JS\n");
    childProcess.execSync("browserify --debug ./public/javascripts/index.js -o ./public/bundled/index.js -v");
    childProcess.execSync("browserify --debug ./public/javascripts/productes.js -o ./public/bundled/productes.js -v");
    childProcess.execSync("browserify --debug ./public/javascripts/compres.js -o ./public/bundled/compres.js -v");
    childProcess.execSync("browserify --debug ./public/javascripts/perfil.js -o ./public/bundled/perfil.js -v");
    childProcess.execSync("browserify --debug ./public/javascripts/horari.js -o ./public/bundled/horari.js -v");
    childProcess.execSync("browserify --debug ./public/javascripts/facturacio.js -o ./public/bundled/facturacio.js -v");
    childProcess.execSync("browserify --debug ./public/javascripts/categories.js -o ./public/bundled/categories.js -v");
    childProcess.execSync("browserify --debug ./public/javascripts/legal.js -o ./public/bundled/legal.js -v");

    console.log("EN MODE DESENVOLUPAMENT DE FIDDEAL WEB-APP");
}

main();
