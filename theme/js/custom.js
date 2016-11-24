var site_info = null;
var posts_ex = null;
var baseurl = '';
var popular_posts_info = null;
var global_json = {};


(function($) {

  function with_ajax_json( name, url, callback_first, callback_next ){
    if( !global_json[name] ){
      $.getJSON( url, function(result){
        global_json[name] = result;
        callback_first(result);
        callback_next(result);
      });
    }else{
      callback_next(global_json[name]);
    }
  }

  function with_popular_posts( callback ){
    with_ajax_json( 'popular_posts', base_url+'/api/v1/posts/popular-post-ids.json',
        function(result){ popular_posts_info = result; },
        function(r){ callback(r); });
  }

  function with_site_info( callback ){
    with_ajax_json( 'site_info' , base_url+'/api/v1/site/info.json',
        function(result){ site_info = result;baseurl=site_info['data']['baseurl']; },
        function(r){ callback(r); });
  }

  function with_posts_ex( callback ){
    with_ajax_json( 'posts_ex', base_url+'/api/v1/posts/list-excerpt.json',
        function(r){ posts_ex=r;},
        function(r){ callback(r) }
        );
  }

  function replace_posts( tag, _get_posts ){
    $(tag).each( function(){
      var anchor = $(this);
      var nposts = $(this).attr("nposts");
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

  //  $.getJSON('/api/v1/site/info.json', function(site_info){
  //    $.getJSON('/api/v1/posts/list-excerpt.json',function(posts_ex){
  //      $.getJSON('
  //with_site_info( function(site_info){
  with_posts_ex( function(_post_ex){
    //with_popular_posts( function( popular_posts_info ){
    var sorted_posts = _.sortBy( posts_ex['data'], function(x){return +x[posts_ex['fields']['popular']];} );
    //var i=0 ;
    //_.each(sorted_posts, function(x){console.log(x[0]+"\t"+x[posts_ex['fields']['popular']]+"\t"+i++);});
    replace_posts('.random_posts', function(nposts, cb){
      cb(_.sample( posts_ex['data'], nposts ));
    });
    console.log("BEGIN popular_posts");
    replace_posts('.popular_posts', function(nposts, cb){
      console.log("### nposts = "+nposts);
      cb( _.last( sorted_posts, nposts ) );
    });
    //});
  });
  //});

})(jQuery);
