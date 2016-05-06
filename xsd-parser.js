var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');
var path  = require('path');

var url = "http://localhost:8080";

request(url, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);

        $('#menu2').find('.doc-link').each(function (i, doc){

            var fileName = $(this).text();
            var loadPath = '';
            if (loadPath == 'egaischeque.joint.2.xsd') {
                loadPath = url + '/info/xsdRetail/' + fileName
            } else {
                loadPath = url + '/info/xsdWholesale/' + fileName
            }

            request(loadPath, function (error, response, body) {
                if(!error) {
                    if (!fs.existsSync('xsd')){
                        fs.mkdirSync('xsd');
                    }

                    var xsd = cheerio.load(body)('pre').text();
                    fs.writeFile( path.join('xsd', fileName), xsd, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                        console.log("Сохранен файл схемы ", fileName);
                    });
                } else {
                    console.log("Произошла ошибка при загрузке xsd схемы: ", loadPath, error);
                }
            })
        });
    } else {
        console.log("Произошла ошибка: " + error);
    }
});