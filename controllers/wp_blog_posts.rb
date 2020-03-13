require 'nokogiri'
# require_relative '../lib/featuredmember'

class ::DiscourseNeo4j::WpBlogPostsController < ::ApplicationController
  include HTTParty
  #include FeaturedMember

  def latest_post
    query="#{SiteSetting.neo4j_blog_url}/wp-json/wp/v2/posts?_fields=id,date,excerpt,title,link,tags,author"

    response = self.class.get(query)

    if response.success?

       blogpost = response.select do |post|
         post['tags'].include? SiteSetting.neo4j_blog_post_filter_tag_id
       end 

      render_json_dump blogpost.first
    else
      raise response.response
    end
  end

  def featured_member
    query="#{SiteSetting.neo4j_blog_url}/wp-json/wp/v2/posts?_fields=content, tags"

    response = self.class.get(query)

    if response.success?
      
      blogpost = response.select do |post|
        post['tags'].include? SiteSetting.neo4j_blog_post_filter_tag_id
      end 

      document = Nokogiri::HTML(blogpost.first['content']['rendered'])

      member = DiscourseNeo4j::FeaturedMember.new

      member.image_source = document.css('img').first.attributes['src'].value
      member.link = document.css('a')[3].attributes['href'].value

      render_json_dump member
    else
      raise response.response
    end
  end

  def author
    params.require(:id)

    query="#{SiteSetting.neo4j_blog_url}/wp-json/wp/v2/users/#{params[:id]}"
  
    response = self.class.get(query)

    if response.success?
      render_json_dump response.parsed_response
    else
      raise response.response
    end
  end
end
