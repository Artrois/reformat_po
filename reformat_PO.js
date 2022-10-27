//This file takes muster PO and reformats to ersetze_*.po
const fs = require('fs');
//const yaml = require('js-yaml');
let path = require('path');


const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

const myArgs = process.argv.slice(2);
let file_exists = false;




if (myArgs.length !== 2){
    console.log('Wrong parameters given: node translate_PO_YML.js [source.po] [target.po]. See example:');
    console.log("node ./reformat_PO.js ./anzeigetexte.user.muster.po ./ersetze_anzeigetexte_user.po");
    process.exit(1);
} 


//check if file exists
fs.stat(myArgs[0], function(err, stat) {
    if (err == null) {
        file_exists = true;
        console.log(`File exists: ${myArgs[0]}, continue counting chars.`);
        count_chars(myArgs[0], myArgs[1]);
    } else if (err.code === 'ENOENT') {
      // file does not exist
      console.log(`File does not exist: ${myArgs[0]}`);
      process.exit(1);
    } else {
      console.log('Some other error: ', err.code);
      process.exit(1);
    }
  });


/**
 * loads PO file into memory and counts number of characters for each msgid
 * @param {string} path2file source file to read
 * @param {string} path2file_target target file where to write the buffer
 * @returns null 
 */
async function count_chars(path2file, path2file_target){
    //state machine
    let state_machine = 0;//0 = initial state, 1=comment/unknown id, 2=msgid, 3=msgstr 
  //extract file ending
  let extension = path.extname(path2file);
  console.log('Detected extension: ' + extension);
  switch (extension){
    case '.po':
        const nReadlines = require('n-readlines');
        const broadbandLines = new nReadlines(path2file);
        let line;
        let lineNumber = 0;
        let temp_msgid = "";
        let full_buffer2bewritten = "";
        while (line = broadbandLines.next()) {
            //run state machine with the states //0 = initial state, 1=comment/unknown id/skip, 2=msgid, 3=msgstr 
            lineNumber++;
            const koi8rdecoder = new TextDecoder("koi8-r");
            let cur_line = koi8rdecoder.decode(line);
            console.log(`${lineNumber}: source: ${cur_line}`);

            let cur_line_tmp = cur_line.replace(/  +/g, ' ').trim();
            
            //state machine transitions
            if (cur_line_tmp.startsWith("#")){
                state_machine = 1;//skip comments
            }
            else if (cur_line_tmp.startsWith("domain")){
                state_machine = 1;//skip useless tags
            }
            else if(cur_line_tmp.startsWith("msgid")){
                state_machine = 2;//this is start for a msgid and msgstr block => need to store the id
            }
            else if(cur_line_tmp.startsWith("msgstr") && (state_machine == 2)){
                //we have proper msgstr block formed => take stored id and form translation line to target file
                state_machine = 3;
            }
            else {
                state_machine = 1;
            }

            console.log("state machine: " + state_machine);
            let split_array = "";
            let tmp = "";
            let tmp2 = "";
            //state machine actions
            switch(state_machine){
                case 0:
                    //initial state
                    //we shouldnt run into this
                    break;
                case 1://skip sate
                    continue;
                case 2:
                    split_array = cur_line_tmp.split(' ');
                    temp_msgid = split_array[1];
                    break;
                case 3:
                    let tmp = temp_msgid.split('.');//remove trailing .suffix
                    let translated1="";
                    let translated2="";
                    let full_line = "";
                    if (tmp[0].endsWith('"')){translated1 = tmp[0];}else{translated1 = tmp[0] + '"';}
                    
                    split_array = cur_line_tmp.split(' ');
                    translated2 = split_array[1];
                    full_line = temp_msgid + " " + translated1 + " " + translated2 + "\n";
                    full_buffer2bewritten += full_line;
                    console.log("output: " + full_line);

                    break;
            }


        }
        if (lineNumber<3){
            console.log("Not enough lines to read/translate =>exit");
            process.exit(1);
        }
        try{
            //overwrite if target PO exists and put header
            fs.writeFileSync(path2file_target, "msgid            msgstr_debug          msgstr_user\n", { flag: 'w+' });
            fs.writeFileSync(path2file_target, "#\n", { flag: 'a+' });
        }
        catch (err){
            console.log("Writing headers failed with: %s %s", err, "=>exit");
            process.exit(1);
        }

        try{
            fs.writeFileSync(path2file_target, full_buffer2bewritten, { flag: 'a+' });
        }
        catch (err){
            console.log("Writing msgstrings failed with: %s %s", err, "=>exit");
        }
        
        break;

    case '.yml':
        console.log("error: yml extension not supported => exit");
        process.exit(1);
   /*      let arrayOfStrings2BeTranslated = process_YML(path2file);

        var readlineSync = require('readline-sync');
        if (readlineSync.keyInYN('Do you want to start translation of YAML?')) {
            // 'Y' key was pressed.
            console.log('Translating in 2 secs...');
            await sleep(2000);
            if (arrayOfStrings2BeTranslated.length === 0) throw "count_chars(): nothing to be translated"
            let translated_yaml = await trans.translateString(arrayOfStrings2BeTranslated, target_lang, source_lang);
            if (translated_yaml.translations.length !== arrayOfStrings2BeTranslated.length)throw "array to be translated not matches array with translations"
            store_YAML(translated_yaml, path2file, "." + target_lang)
        } else {
            // Another key was pressed.
            console.log('Canceled...');
            // Do something...
        }*/
        break; 
        default:
            console.log("error: %s extension not supported => exit", extension)
  }
}
