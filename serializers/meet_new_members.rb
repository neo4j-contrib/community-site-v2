class ::DiscourseNeo4j::MeetNewMembersSerializer < ApplicationSerializer
  attributes :id,
             :title,
             :user_id,
             :username,
             :posts_count,
             :views,
             :like_count,
             :avatar_template,
             :excerpt

  def excerpt
    object.excerpt
  end

  def avatar_template
    User.avatar_template(object.username,object.uploaded_avatar_id)
  end
end
