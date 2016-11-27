var site_info = null;
var posts_ex = null;
var baseurl = '';
var popular_posts_info = null;
var global_json = {};


(function($) {

    function replace_posts( tag, _get_posts ){
        $(tag).each( function(){
            var anchor = $(this);
            var nposts = $(this).attr("nposts");
            console.log("### NPOST: "+nposts );
            _get_posts(nposts, function(_posts){
                var fields = posts_ex.fields;
                console.log("#### POSTS");
                console.log(_posts);
                var i=0;
                _.each(_posts, function(x){console.log(x[0]+"\t"+x[posts_ex['fields']['popular']]+"\t"+i++);});
                anchor.find("article").each(function(){
                    if( _posts.length == 0 ) return;
                    var post = _posts.pop();
                    var img = post[fields["featured_img"]];
                    console.log("==== "+img);
                    var posturl = post[fields["url"]];
                    $(this).find(".article-url").attr("href", base_url+posturl);
                    $(this).find(".article-image").each( function(){
                        var thumb = $(this).attr("data-thumb");
                        if( !img.startsWith("http") || img.startsWith("//") ){
                            if( thumb && thumb.length>0 && !( thumb.startsWith("http") || thumb.startsWith("//") )){
                                img = base_url+"/assets/thumbs/"+thumb+img;
                            }else{
                                img = base_url+img;
                            }
                        }
                        console.log("### img = "+img)
                            $(this).attr("src", img);
                    });
                    $(this).find(".article-title").html(post[fields["title"]]);
                    $(this).find(".article-updated").html(
                            post[fields["year"]]+"-"+post[fields["month"]]
                            +"-"+post[fields["day"]]
                            +" / By: " + post[fields["author"]]
                            );
                    var excerpt = post[fields["excerpt"]];

                    $(this).find(".article-excerpt").html(
                            (!excerpt)?"":excerpt.length<=30 ? excerpt : excerpt.substring(0,30)
                            );
                });
            });
        });
    }

    posts_ex = sk_base_data['list_post'];
    sorted_posts = _.sortBy( posts_ex['data'], function(x){
        return posts_ex['data'][posts_ex['fields']['popular']];
    });
    console.log("### Sorted_posts :" );console.log(sorted_posts);
    replace_posts('.random_posts', function(nposts, cb){
        cb(_.sample( posts_ex['data'], nposts ));
    });
    console.log("BEGIN popular_posts");
    replace_posts('.popular_posts', function(nposts, cb){
        cb( _.last( sorted_posts, nposts ) );
    });

})(jQuery);
