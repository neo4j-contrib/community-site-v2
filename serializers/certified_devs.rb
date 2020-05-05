class ::DiscourseNeo4j::CertifiedDevsSerializer < ApplicationSerializer
  attributes  :id,
              :name,
              :username,
              :created_at,
              :avatar_template,
              :group_name

  def avatar_template
      User.avatar_template(object.username,object.uploaded_avatar_id)
  end
end
