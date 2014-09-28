module.exports = (function () {

    'use strict';

    var webGl = true;

    var normalizeImg = function(img) {
        return img.replace('_replace', '');
    };

    var Tweet = function(tweet) {
        if (webGl) {
            var glTweet = {};
            glTweet._id = tweet.id;
            glTweet.original = tweet;
            if (typeof tweet.user !== undefined) {
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
    };

    return Tweet;

})();





