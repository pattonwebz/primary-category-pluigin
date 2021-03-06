<?php
 /**
  * Plugin Name: Primary Category Plugin
  * Plugin URI:
  * Description: Plugin allowing post authors to select a primary category for posts.
  * Author: William Patton
  * Author URI: https://www.pattonwebz.com
  * Version: 1.0.0
  * License: GPL-2.0+
  * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
  *
  * @package  Primary Category Plugin
  */

/** -------------------------------- *
 * constants
 *  -------------------------------- */

if ( ! defined( 'PRIMARY_CATEGORY_PLUGIN_DIR' ) ) {
	define( 'PRIMARY_CATEGORY_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'PRIMARY_CATEGORY_PLUGIN_URL' ) ) {
	define( 'PRIMARY_CATEGORY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

/** -------------------------------- *
 * includes
 * ---------------------------------- */

include( PRIMARY_CATEGORY_PLUGIN_DIR . 'inc/class-pwwp-primary-category-metabox-modifications.php' ); // adds and modifies metaboxes that are output in post editor.
include( PRIMARY_CATEGORY_PLUGIN_DIR . 'inc/actions-and-filters.php' ); // any actions and filters exposed by the plugin.
include( PRIMARY_CATEGORY_PLUGIN_DIR . 'inc/class-pwwp-widget-primary-categories.php' ); // class to build a category widget that shows only primary categories. Based on the core categories widget.
include( PRIMARY_CATEGORY_PLUGIN_DIR . 'inc/class-pwwp-pc-query-shortcode.php' );

/**
 * TODO: Work out how to save and get term_meta properly
 * NOTE: setting and deleting posts from meta in a sane way could be done by having 1 more post meta key which is not updated through ajax - use this as a note of the previous term and remove from it while adding to the new term.
 * TODO: Deal with unchecking of primary category.
 */
