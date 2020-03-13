class ::DiscourseNeo4j::MeetNewMembersController < ::ApplicationController

  def topics
    @results = ::DiscourseNeo4j::ListTopics::list_complete(category_id: SiteSetting.neo4j_meet_new_members_category, quantity: SiteSetting.neo4j_meet_new_members_number_of_entries)

    render_json_dump serialize_data(@results, ::DiscourseNeo4j::MeetNewMembersSerializer)
  end
end
