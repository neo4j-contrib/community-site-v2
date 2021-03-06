class ::DiscourseNeo4j::NinjasSerializer < ApplicationSerializer
  attributes  :id,
              :name,
              :username,
              :likes_received,
              :first_seen_at,
              :avatar_template

  def avatar_template
      User.avatar_template(object.username,object.uploaded_avatar_id)
  end
end
