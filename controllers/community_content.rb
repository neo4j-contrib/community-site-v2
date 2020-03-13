class ::DiscourseNeo4j::CommunityContentController < ::ApplicationController

  def topics
    @results = ::DiscourseNeo4j::ListTopics::list_complete(category_id: SiteSetting.neo4j_community_content_category, quantity: SiteSetting.neo4j_community_content_number_of_entries)

    render_json_dump serialize_data(@results, ::DiscourseNeo4j::CommunityContentSerializer)
  end
end
