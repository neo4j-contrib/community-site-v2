class DiscourseNeo4j::ListTopics

  def self.list_complete (category_id:, quantity:)
    Topic
      .select("topics.id,topics.title,topics.excerpt,topics.user_id,topics.posts_count,topics.views,topics.like_count,users.username,users.uploaded_avatar_id")
      .joins("LEFT OUTER JOIN users ON users.id = topics.user_id")    
      .where(category_id: category_id, pinned_at: nil)
      .take(quantity)
  end

  def self.list_minimal (category_id:, quantity:)
    Topic
      .select("topics.id,topics.title")
      .where(category_id: category_id)
      .take(quantity)
  end
end
