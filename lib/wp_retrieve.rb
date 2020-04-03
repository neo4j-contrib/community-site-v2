require 'nokogiri'

class DiscourseNeo4j::WpRetrieve
  include HTTParty

  def self.wp_cache_key(collection)
    "neo4j_wp_#{collection}"
  end

  def self.latest_post

    query="#{SiteSetting.neo4j_blog_url}/wp-json/wp/v2/posts?_fields=id,date,excerpt,title,link,tags,author"

    Discourse.cache.fetch(wp_cache_key(query), expires_in: 1.hour) do

      response = get(query)

      if response.success?

        blogpost = response.select do |post|
          post['tags'].include? SiteSetting.neo4j_blog_post_filter_tag_id
        end 

        blogpost.first
      else
        Rails.logger.warn ("Neo4j Featured Latest Post Retrieve: There was a problem")
      end
    end
  end

  def self.featured_member

    query="#{SiteSetting.neo4j_blog_url}/wp-json/wp/v2/posts?_fields=content, tags"

    Discourse.cache.fetch(wp_cache_key(query), expires_in: 1.hour) do

      response = get(query)

      if response.success?

        blogpost = response.select do |post|
          post['tags'].include? SiteSetting.neo4j_blog_post_filter_tag_id
        end 

        document = Nokogiri::HTML(blogpost.first['content']['rendered'])

        member = DiscourseNeo4j::FeaturedMember.new

        member.image_source = document.css('img').first.attributes['src'].value
        member.link =  document.css('.medium').first.attributes['href'].value

        member
      else
        Rails.logger.warn ("Neo4j Featured Member Retrieve: There was a problem")
        {}
      end
    end
  end

  def self.author(id:)

    query="#{SiteSetting.neo4j_blog_url}/wp-json/wp/v2/users/#{id}"

    Discourse.cache.fetch(wp_cache_key(query), expires_in: 1.hour) do  

      response = get(query)

      if response.success?
        response.parsed_response
      else
        Rails.logger.warn ("Neo4j Author Retrieve: There was a problem")
        {}
      end
    end
  end
end
