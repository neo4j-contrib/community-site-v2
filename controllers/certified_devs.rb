class ::DiscourseNeo4j::CertifiedDevsController < ::ApplicationController
  def list
    
    sql = <<~SQL
        SELECT u.id, u.name, u.username_lower as username, u.created_at, u.uploaded_avatar_id, g.name as group_name
        FROM users u
        INNER JOIN group_users gu ON (gu.user_id = u.id)
        INNER JOIN groups g ON (g.id = gu.group_id)
        WHERE
            u.moderator = FALSE
        AND u.admin = FALSE
        AND u.active = TRUE
        AND u.silenced_till IS NULL
        AND u.id > 0
        AND gu.group_id = #{SiteSetting.neo4j_certified_devs_group}
        order by u.created_at DESC
        LIMIT 3
    SQL

    output = DB.query(sql)

    render_json_dump serialize_data(output, ::DiscourseNeo4j::CertifiedDevsSerializer)
  end
end
