  Meteor.startup(function () {
    //var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getList: function (uri, parsingRule) {
        result = Meteor.http.get(uri);
        //$ = cheerio.load(result.content);
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        //var body = $('#stream-items-id > li:nth-child(n) > div > div > p').text();
        var body = result.content;
        //var filtered = body.replace(/^#.*\n|^\s*\n/gm, "").trim();
        var re = new RegExp(parsingRule,"gm");
        var filtered = body.replace(re, "").trim();
        return filtered;
      },
    })
  });