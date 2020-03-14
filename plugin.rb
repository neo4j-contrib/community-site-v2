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

  load File.expand_path('../lib/featured_member.rb', __FILE__)
  load File.expand_path('../lib/select_topics.rb', __FILE__)
  load File.expand_path('../lib/wp_retrieve.rb', __FILE__)
  load File.expand_path('../controllers/wp_blog_posts.rb', __FILE__)
  load File.expand_path('../serializers/ninjas.rb', __FILE__)
  load File.expand_path('../controllers/ninjas.rb', __FILE__)
  load File.expand_path('../serializers/announcements.rb', __FILE__)
  load File.expand_path('../controllers/announcements.rb', __FILE__)
  load File.expand_path('../serializers/can_you_help.rb', __FILE__)
  load File.expand_path('../controllers/can_you_help.rb', __FILE__)
  load File.expand_path('../serializers/community_content.rb', __FILE__)
  load File.expand_path('../controllers/community_content.rb', __FILE__)
  load File.expand_path('../serializers/community_projects.rb', __FILE__)
  load File.expand_path('../controllers/community_projects.rb', __FILE__)
  load File.expand_path('../serializers/meet_new_members.rb', __FILE__)
  load File.expand_path('../controllers/meet_new_members.rb', __FILE__)
  load File.expand_path('../controllers/certified_devs.rb', __FILE__)
  load File.expand_path('../serializers/certified_devs.rb', __FILE__)
  load File.expand_path('../serializers/topic_list_item_edits.rb', __FILE__)

  ::DiscourseNeo4j::Engine.routes.draw do
    get "/wp_latest_blogpost" => "wp_blog_posts#latest_post"
    get "/wp_blog_author" => "wp_blog_posts#author"
    get "/wp_featured_member" => "wp_blog_posts#featured_member"
    get "/ninjas" => "ninjas#list"
    get "/certified_devs" => "certified_devs#list"
    get "/announcements" => "announcements#topics"
    get "/can_you_help" => "can_you_help#topics"
    get "/community_content" => "community_content#topics"
    get "/community_projects" => "community_projects#topics"
    get "/meet_new_members" => "meet_new_members#topics"
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
end
