  Meteor.startup(function () {
    //var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getList: function (uri, parsingRule) {          
        var options = {};
        var reqOpt  = {};
        
        if (proxyURL.length > 0)
            reqOpt.proxy = proxyURL;
                
        options.npmRequestOptions = reqOpt;
        
        console.log("Sending HTTP GET to", uri, "...");
        var result = Meteor.http.get(uri, options);
        console.log("Done.");
        //$ = cheerio.load(result.content);
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        //var body = $('#stream-items-id > li:nth-child(n) > div > div > p').text();
        var lines = result.content.split("\n");
        //var re    = new RegExp(parsingRule,"gm");
        var re    = new RegExp(parsingRule);
        var list  = "";
        var count = 0;
        var arr   = [];
        _.each(lines, function(line){
            var match = re.exec(line);
            if ((match !== undefined) && (match != null)){
                if (match.length > 1){
                    var filtered= match[1].trim();
                    if (filtered.length>0){
                        list += filtered + "\n";
                        count++;
                        arr.push(filtered);
                    }
                }
            }
        });
        // Sort and remove duplicates
        //reduced = arr.sort().filter(function(el,i,a){if(i==a.indexOf(el))return 1;return 0})
        
        // Only remove duplicates
        reduced = arr.filter(function(el,i,a){if(i==a.indexOf(el))return 1;return 0})
        var reducedCount = reduced.length;

        list = reduced.join("\n").trim();
        console.log("Original entries obtained: ", count);
        console.log("Reduced set of entries   : ", reducedCount);
        return list.trim();
       },
    })
  });
  
  
  function sort_unique(arr) {
    arr = arr.sort(function (a, b) { return a*1 - b*1; });
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
        if (arr[i-1] !== arr[i]) {
            ret.push(arr[i]);
        }
    }
    return ret;
}
