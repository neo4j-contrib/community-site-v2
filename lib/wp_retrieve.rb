require 'nokogiri'

class DiscourseNeo4j::WpRetrieve
  include HTTParty

  def self.wp_cache_key(collection)
    "neo4j_wp_#{collection}"
  end

  def self.latest_post

    query="#{SiteSetting.neo4j_blog_url}/wp-json/wp/v2/posts?_fields=id,content,date,excerpt,title,link,tags,author"

    Discourse.cache.fetch(wp_cache_key(query), expires_in: 1.hour) do

      response = get(query)

      if response.success?

        blogpost = response.select do |post|
          post['tags'].include? SiteSetting.neo4j_blog_post_filter_tag_id
        end 

        document = Nokogiri::HTML(blogpost.first['content']['rendered'])

        begin
          link = response.parsed_response[0]["link"]
        rescue
          link = ""
        end

        bullets = []

        begin
          document.css('h3').each do |title|
            bullets << {title:title.children.text, link: "#{link}##{title.attributes["id"].value}"}
          end
        rescue
          bullets = []
        end

        { id: blogpost.first["id"],
          link: blogpost.first["link"],
          title: blogpost.first["title"]["rendered"],
          author: blogpost.first["author"],
          date: blogpost.first["date"],
          excerpt: blogpost.first["excerpt"]["rendered"],
          bullets: bullets }
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

        begin
          member.image_source = document.css('img').first.attributes['src'].value
        rescue
          member.image_source = ""
        end
        begin
          member.link = document.css('.medium').first.attributes['href'].value
        rescue
          member.link = ""
        end

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
