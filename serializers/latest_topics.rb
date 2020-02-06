class ::DiscourseNeo4j::LatestTopicsSerializer < ApplicationSerializer
    attributes :id,
               :title,
               :user_id,
               :username,
               :posts_count,
               :views,
               :like_count,
               :avatar_template

  def avatar_template
      User.avatar_template(:username,:uploaded_avatar_id)
  end  
end