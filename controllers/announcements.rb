class ::DiscourseNeo4j::AnnouncementsController < ::ApplicationController

  def topics
    @results = ::DiscourseNeo4j::ListTopics::list_minimal(category_id: SiteSetting.neo4j_latest_announcements_category, quantity: SiteSetting.neo4j_latest_announcements_number_of_entries)

    render_json_dump serialize_data(@results, ::DiscourseNeo4j::AnnouncementTopicsSerializer)
  end
end
