# name: discourse-neo4j
# about: Discourse plugin for Neo4j that adds various enhancements, features and formatting
# version: 0.1
# authors: merefield@gmail.com
# url: https://github.com/paviliondev/discourse-neo4j

gem 'mime-types-data', '3.2019.1009'
gem 'mime-types', '3.3.1'
gem 'httparty', '0.17.3'
require 'net/http'

register_asset "stylesheets/discourse-neo4j-common.scss"

PLUGIN_NAME ||= "discourse-neo4j".freeze

after_initialize do
  module ::DiscourseNeo4j
    PLUGIN_NAME = "discourseneo4j".freeze

    class Engine < ::Rails::Engine
      engine_name DiscourseNeo4j::PLUGIN_NAME
      isolate_namespace DiscourseNeo4j
    end
  end

  Discourse::Application.routes.append do
    mount ::DiscourseNeo4j::Engine, at: '/'
  end

  load File.expand_path('../lib/featuredmember.rb', __FILE__)
  load File.expand_path('../controllers/wpblogposts.rb', __FILE__)
  load File.expand_path('../serializers/ninjas.rb', __FILE__)
  load File.expand_path('../controllers/ninjas.rb', __FILE__)
  load File.expand_path('../serializers/announcementtopics.rb', __FILE__)
  load File.expand_path('../controllers/announcementtopics.rb', __FILE__)

  ::DiscourseNeo4j::Engine.routes.draw do
    get "/wplatestblogpost" => "wpblogposts#latest_post"
    get "/wpblogauthor" => "wpblogposts#author"
    get "/wpfeaturedmember" => "wpblogposts#featured_member"
    get "/announcementtopics" => "announcementtopics#topics"
    get "/ninjas" => "ninjas#list"
  end

  UsersController.class_eval do
    def perform_account_activation
      raise Discourse::InvalidAccess.new if honeypot_or_challenge_fails?(params)

      if @user = EmailToken.confirm(params[:token])
        
        # Log in the user unless they need to be approved
        if Guardian.new(@user).can_access_forum?
          @user.enqueue_welcome_message('welcome_user') if @user.send_welcome_message
          log_on_user(@user)

          destination_url = cookies[:neo4j_discourse_redirect]

          cookies[:neo4j_discourse_redirect] = nil

          return redirect_to(destination_url)
        else
          @needs_approval = true
        end

      else
        flash.now[:error] = I18n.t('activation.already_done')
      end
    end
  end

  module EnableTopicListItemExcerpt
    def excerpt
      object.excerpt
    end

    def include_excerpt?
      object.excerpt.present?
    end
  end

  class ::TopicListItemSerializer
  prepend EnableTopicListItemExcerpt
  end
end
