class ::DiscourseNeo4j::LatestTopicsController < ::ApplicationController

  def topics
    params.require(:category_id)
    params.require(:quantity)

    @results = Topic
                .select("topics.id,topics.title,topics.user_id,topics.posts_count,topics.views,topics.like_count,users.username,users.uploaded_avatar_id")
                .joins("LEFT OUTER JOIN users ON users.id = topics.user_id")    
                .where(category_id: params[:category_id])
                .take(params[:quantity])

    render_json_dump serialize_data(@results, ::DiscourseNeo4j::LatestTopicsSerializer)
  end
end