# discourse-neo4j

Discourse plugin for Neo4j that adds various enhancements, features and formatting

## Overview of what the plugin does

Any visitor to the community is presented with a new home view which acts as a dashboard for community activity.  Topic List appearance has been customised.

## Overview of functionality

The plugin is broadly split into two:

1. Dashboard
2. Topic List customisation.

### Dashboard

This is a collection of widgets which each present either a collection of Users or Topics depending on the specification.

### Topic List

The Topic List is presents a custom format which differs from the Core Discourse as per client specification.

## Technology & Architecture Used

The plugin uses the same technologies as base Discourse, that is:

- Javascript, Hyperscript and the Ember framework
- Ruby on Rails extended with Nokogiri and Httparty gems

The plugin makes use of the main sites WordPress API to retrieve some information for the dashboard.

## Any known issues

- Two of the widgets perform a crawl of the client blog using a back-end process.  This may time out the first time it's run but after that a cache will exist on the server and subsequent page views will show complete data.
