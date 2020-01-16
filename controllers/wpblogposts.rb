class ::DiscourseNeo4j::WpblogpostsController < ::ApplicationController
  include HTTParty

  def posts
    query="#{SiteSetting.neo4j_blog_url}/wp-json/wp/v2/posts?_fields=id,date,excerpt,title,link,tags,author"

    response = self.class.get(query)

    if response.success?
      render_json_dump response.parsed_response
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