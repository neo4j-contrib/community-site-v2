class ::DiscourseNeo4j::AnnouncementtopicsController < ::ApplicationController

  def topics
    @results = Topic.where(category_id: SiteSetting.neo4j_latest_announcements_category).take(SiteSetting.neo4j_latest_announcements_number_of_entries)

    render_json_dump serialize_data(@results, ::DiscourseNeo4j::AnnouncementTopicsSerializer)
  end
end