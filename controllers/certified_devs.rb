class ::DiscourseNeo4j::CertifiedDevsController < ::ApplicationController
  def list
    
    sql = <<~SQL
        SELECT u.id, u.name, u.username_lower as username, d.likes_received, u.first_seen_at, u.uploaded_avatar_id, g.name as group_name
        FROM directory_items d
        LEFT JOIN users u ON (u.id = d.user_id AND u.active AND u.silenced_till IS NULL AND u.id > 0)
        INNER JOIN group_users gu ON (gu.user_id = d.user_id AND gu.group_id = #{SiteSetting.neo4j_certified_devs_group})
        INNER JOIN groups g ON (g.id = gu.group_id)
        WHERE
            u.moderator = FALSE
        and u.admin = FALSE
        order by likes_received DESC
        LIMIT 3
    SQL

    output = DB.query(sql)

    render_json_dump serialize_data(output, ::DiscourseNeo4j::CertifiedDevsSerializer)
  end
end
