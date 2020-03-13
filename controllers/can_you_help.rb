class ::DiscourseNeo4j::CanYouHelpController < ::ApplicationController

  def topics
    @results = ::DiscourseNeo4j::ListTopics::list_complete(category_id: SiteSetting.neo4j_can_you_help_category, quantity: SiteSetting.neo4j_can_you_help_number_of_entries)

    render_json_dump serialize_data(@results, ::DiscourseNeo4j::CanYouHelpSerializer)
  end
end
