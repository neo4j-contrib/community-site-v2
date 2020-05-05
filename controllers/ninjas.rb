class ::DiscourseNeo4j::NinjasController < ::ApplicationController
  def list
    
    sql = <<~SQL
        SELECT u.id, u.name, u.username_lower as username, d.likes_received, u.first_seen_at, u.uploaded_avatar_id
        FROM directory_items d
        LEFT JOIN users u ON (u.id = d.user_id AND u.active AND u.silenced_till IS NULL AND u.id > 0)
        WHERE d.period_type = 4
        and u.moderator = FALSE
        and u.admin = FALSE
        order by likes_received DESC
        LIMIT #{SiteSetting.neo4j_ninjas_number_of_entries}
    SQL

    output = DB.query(sql)

    render_json_dump serialize_data(output, ::DiscourseNeo4j::NinjasSerializer)
  end
end
