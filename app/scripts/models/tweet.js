module.exports = (function () {

    var webGl = true;

    function normalizeImg(img) {

        var normalized = img.replace('_replace', '');
        return normalized;

    };

    function Tweet(tweet) {

        if (webGl) {

            var glTweet = {};
            glTweet._id = tweet.id;
            glTweet.original = tweet;
            if (tweet.user != undefined) {
                glTweet.followers = tweet.user.followers_count;
                glTweet.text = tweet.text;
                glTweet.user = tweet.user.name;
                glTweet.image = normalizeImg(tweet.user.profile_image_url);
                glTweet.created_at = tweet.created_at;
            } else {
                glTweet.followers = null;
                glTweet.text = null;
                glTweet.user = null;
            }
            return glTweet;

        } else {

            return tweet;

        }

    }

    return Tweet;

})();





