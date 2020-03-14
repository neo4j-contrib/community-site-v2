require 'nokogiri'

class ::DiscourseNeo4j::WpBlogPostsController < ::ApplicationController
  include HTTParty

  def latest_post
    render_json_dump DiscourseNeo4j::WpRetrieve.latest_post
  end

  def featured_member
    render_json_dump DiscourseNeo4j::WpRetrieve.featured_member
  end

  def author
    params.require(:id)

    render_json_dump DiscourseNeo4j::WpRetrieve.author(id: params[:id])
  end
end
