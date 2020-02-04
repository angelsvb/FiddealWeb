const replaceInFiles = require('replace-in-files');
const childProcess = require('child_process');

async function main(){
    console.log("INICIANT PUBLICACIÓ FIDDEAL WEB-APP");

    /*OPCIONS VARIABLES DE CODI*/
    const options = {
        files : [
            'public/javascripts/utilities/storage.js'
        ],
        from: "let inLocalDeveloptment = true",
        to: "let inLocalDeveloptment = false",
        optionsForFiles: {},
        saveOldFile: false,
        encoding: 'utf8',
        shouldSkipBinaryFiles: true,
        onlyFindPathsWithoutReplace: false,
        returnPaths: true,
        returnCountOfMatchesByPaths: true,
    };

    console.log("       =====> SWITCH TO PRODUCTION STATUS");
    await replaceInFiles(options);
    options.from=/.*version = "\d\.\d\.\d";/g;
    options.to=(args1) => {
        let typeUpgrade = process.argv.slice(2)[0];
        if (!typeUpgrade) typeUpgrade = "";

        let version = args1.substring(15);
        version = version.substring(0, version.length-1);

        let splitted = version.split(".");
        let major = parseInt(splitted[0] ? splitted[0] : "0");
        let minor = parseInt(splitted[1] ? splitted[1] : "0");
        let patch = parseInt(splitted[2] ? splitted[2] : "0");

        let newVersion = "";
        switch (typeUpgrade.toString().toUpperCase()){
            case "MAJOR":
                newVersion = (major+1) + ".0.0";
                break;
            case "MINOR":
                newVersion = major + "." + (minor+1) + ".0";
                break;
            case "PATCH":
                newVersion = major + "." + minor + "." + (patch+1);
                break;
            default:
                console.log("           Versió no actualitzada");
                return args1;
        }

        console.log("           Nova versió: " + newVersion);
        return "let version = \"" + newVersion + "\";";
    };
    await replaceInFiles(options);

    console.log("       =====> BROWSERIFY JAVASCRIPT");
    childProcess.execSync('browserify ./public/javascripts/index.js -o ./public/bundled/index.js -v');
    childProcess.execSync('browserify ./public/javascripts/productes.js -o ./public/bundled/productes.js -v');
    childProcess.execSync('browserify ./public/javascripts/compres.js -o ./public/bundled/compres.js -v');
    childProcess.execSync('browserify ./public/javascripts/perfil.js -o ./public/bundled/perfil.js -v');
    childProcess.execSync('browserify ./public/javascripts/horari.js -o ./public/bundled/horari.js -v');
    childProcess.execSync('browserify ./public/javascripts/facturacio.js -o ./public/bundled/facturacio.js -v');
    childProcess.execSync('browserify ./public/javascripts/categories.js -o ./public/bundled/categories.js -v');
    childProcess.execSync('browserify ./public/javascripts/legal.js -o ./public/bundled/legal.js -v');

    console.log("       =====> MINIFY JAVASCRIPT");
    childProcess.execSync('node-minify --compressor terser --input ./public/bundled/index.js --output ./public/bundled/index.min.js');
    childProcess.execSync('node-minify --compressor terser --input ./public/bundled/productes.js --output ./public/bundled/productes.min.js');
    childProcess.execSync('node-minify --compressor terser --input ./public/bundled/compres.js --output ./public/bundled/compres.min.js');
    childProcess.execSync('node-minify --compressor terser --input ./public/bundled/perfil.js --output ./public/bundled/perfil.min.js');
    childProcess.execSync('node-minify --compressor terser --input ./public/bundled/horari.js --output ./public/bundled/horari.min.js');
    childProcess.execSync('node-minify --compressor terser --input ./public/bundled/facturacio.js --output ./public/bundled/facturacio.min.js');
    childProcess.execSync('node-minify --compressor terser --input ./public/bundled/categories.js --output ./public/bundled/categories.min.js');
    childProcess.execSync('node-minify --compressor terser --input ./public/bundled/legal.js --output ./public/bundled/legal.min.js');

    console.log("\n       =====> MINIFY CSS");
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/categories.css --output ./public/stylesheets/categories.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/compres.css --output ./public/stylesheets/compres.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/compres_manuals.css --output ./public/stylesheets/compres_manuals.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/cookies_custom.css --output ./public/stylesheets/cookies_custom.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/dialogs.css --output ./public/stylesheets/dialogs.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/facturacio.css --output ./public/stylesheets/facturacio.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/fiddeal.css --output ./public/stylesheets/fiddeal.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/header_and_footer.css --output ./public/stylesheets/header_and_footer.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/horari.css --output ./public/stylesheets/horari.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/index.css --output ./public/stylesheets/index.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/initialize_horari.css --output ./public/stylesheets/initialize_horari.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/legal.css --output ./public/stylesheets/legal.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/ofertes.css --output ./public/stylesheets/ofertes.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/perfil.css --output ./public/stylesheets/perfil.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/productes.css --output ./public/stylesheets/productes.min.css');
    childProcess.execSync('node-minify --compressor clean-css --input ./public/stylesheets/style.css --output ./public/stylesheets/style.min.css');

    /*OPCIONS .CSS i .JS a .MIN.CSS i .MIN.JS*/
    options.files = [
        'public/*.html',
        'public/html/*.html'
    ];
    options.from= /bundled\/.*\.js|stylesheets\/.*\.css/g;
    options.to = (args1) => {
        try {
            if (!args1.includes(".min")){
                if (args1.includes("stylesheets"))
                    return args1.replace(".css", ".min.css");
                else
                    return args1.replace(".js", ".min.js");
            } else
                return args1;
        } catch (error){
            console.log(error);
            return args1;
        }
    };

    console.log("\n       =====> SET USED JAVASCRIPT & CSS TO .min\n");
    await replaceInFiles(options);

    console.log("PUBLICACIÓ FIDDEAL WEB-APP - CORRECTE");
}

main();
