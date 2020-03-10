require 'topic_list_item_serializer'
class ::TopicListItemSerializer

  attributes :excerpt

  def excerpt
      object.excerpt
  end

  def include_excerpt?
    object.excerpt.present? && !(object.archetype == Archetype.private_message)
  end
end
