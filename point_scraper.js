var scraper = require('scraper');
var fs = require('fs');

var base = 'http://www.bwca.net/entry-points/?page='; 

var writeFile = function(entryPoints) {
    console.log(entryPoints)

    fs.writeFile('entry_points.json', JSON.stringify(entryPoints), function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log('Wrote entry points');
          }
    });
};


pages = ['1', '2', '3', '4'];

urls = [];

pages.forEach(function(page) {
    urls.push(base + page);
});

console.log(urls)

entryPoints = {};
count = 0;


urls.forEach(function(url) {
    
    scraper(url, function(err, jQuery) {
        count++;
        if(err) {
            console.error(err);
            return;
        }
        
        console.log('Got Url: ' + url);    
        jQuery('.jrContentTitle a').each(function(index, object) {
            console.log(object); 
            var name = object.innerHTML;
            var url = object.href;
            entryPoints[name] = {'url': url};
        });

        if(count === 4) {
            writeFile(entryPoints);
        }
    });
});

