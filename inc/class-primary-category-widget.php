<?php
 /**
  * class-primary-category-widget.php
  *
  * Adds a class to output necesary items for a widget. This class is based on
  * the core category widget but is modified to only output categories that are
  * tagged as 'primary'.
  *
  * @package  Primary Category Plugin
  */

/**
 * This class is based off the WP_Widget_Categories class provided by core. It
 * started as a duplicate and was then modified to work with only 'primary'
 * categories that are tagged.
 */
class PWWP_Widget_Primary_Categories extends WP_Widget {

    /**
     * Sets up a new Primary Categories widget instance.
     */
    public function __construct() {
        $widget_ops = array(
            'classname' => 'widget_primary_categories',
            'description' => __( 'A list or dropdown of only `primary` categories.' ),
            'customize_selective_refresh' => true,
        );
        parent::__construct( 'primary_categories', __( 'Primary Categories' ), $widget_ops );
    }

    /**
     * Outputs the content for the current Primary Categories widget instance.
     */
    public function widget( $args, $instance ) {
        static $first_dropdown = true;

        /** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
        $title = apply_filters( 'widget_title', empty( $instance['title'] ) ? __( 'Primary Categories' ) : $instance['title'], $instance, $this->id_base );

        $c = ! empty( $instance['count'] ) ? '1' : '0';
        $h = ! empty( $instance['hierarchical'] ) ? '1' : '0';
        $d = ! empty( $instance['dropdown'] ) ? '1' : '0';

        echo $args['before_widget'];
        if ( $title ) {
            echo $args['before_title'] . $title . $args['after_title'];
        }

        $cat_args = array(
            'orderby'      => 'name',
            'show_count'   => $c,
            'hierarchical' => $h
        );

        if ( $d ) {
            $dropdown_id = ( $first_dropdown ) ? 'cat' : "{$this->id_base}-dropdown-{$this->number}";
            $first_dropdown = false;

            echo '<label class="screen-reader-text" for="' . esc_attr( $dropdown_id ) . '">' . $title . '</label>';

            $cat_args['show_option_none'] = __( 'Select Category' );
            $cat_args['id'] = $dropdown_id;

            /**
             * Filters the arguments for the primary Categories widget drop-down.
             *
             * @see wp_dropdown_categories()
             *
             * @param array $cat_args An array of Categories widget drop-down arguments.
             */
            wp_dropdown_categories( apply_filters( 'widget_primary_categories_dropdown_args', $cat_args ) );
            ?>

<script type='text/javascript'>
/* <![CDATA[ */
(function() {
    var dropdown = document.getElementById( "<?php echo esc_js( $dropdown_id ); ?>" );
    function onCatChange() {
        if ( dropdown.options[ dropdown.selectedIndex ].value > 0 ) {
            location.href = "<?php echo home_url(); ?>/?cat=" + dropdown.options[ dropdown.selectedIndex ].value;
        }
    }
	dropdown.onchange = onCatChange;
})();
/* ]]> */
</script>

<?php
        } else {
?>
        <ul>
<?php
        $cat_args['title_li'] = '';

        /**
         * Filters the arguments for the Categories widget.
         *
         * @param array $cat_args An array of Categories widget options.
         */
        wp_list_categories( apply_filters( 'widget_primary_categories_args', $cat_args ) );
?>
        </ul>
<?php
        }

    	echo $args['after_widget'];
    }

    /**
     * Handles updating settings for the current Primary Categories widget instance.
     *
     * @param array $new_instance New settings for this instance as input by the user via
     *                            WP_Widget::form().
     * @param array $old_instance Old settings for this instance.
     * @return array Updated settings to save.
     */
    public function update( $new_instance, $old_instance ) {
        $instance = $old_instance;
        $instance['title'] = sanitize_text_field( $new_instance['title'] );
        $instance['count'] = !empty($new_instance['count']) ? 1 : 0;
        $instance['hierarchical'] = !empty($new_instance['hierarchical']) ? 1 : 0;
        $instance['dropdown'] = !empty($new_instance['dropdown']) ? 1 : 0;

    	return $instance;
    }

    /**
     * Outputs the settings form for the Primary Categories widget.

     * @param array $instance Current settings.
     */
    public function form( $instance ) {
        //Defaults
        $instance = wp_parse_args( (array) $instance, array( 'title' => '') );
        $title = sanitize_text_field( $instance['title'] );
        $count = isset($instance['count']) ? (bool) $instance['count'] :false;
        $hierarchical = isset( $instance['hierarchical'] ) ? (bool) $instance['hierarchical'] : false;
        $dropdown = isset( $instance['dropdown'] ) ? (bool) $instance['dropdown'] : false;
        ?>
        <p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e( 'Title:' ); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" /></p>

        <p><input type="checkbox" class="checkbox" id="<?php echo $this->get_field_id('dropdown'); ?>" name="<?php echo $this->get_field_name('dropdown'); ?>"<?php checked( $dropdown ); ?> />
        <label for="<?php echo $this->get_field_id('dropdown'); ?>"><?php _e( 'Display as dropdown' ); ?></label><br />

        <input type="checkbox" class="checkbox" id="<?php echo $this->get_field_id('count'); ?>" name="<?php echo $this->get_field_name('count'); ?>"<?php checked( $count ); ?> />
        <label for="<?php echo $this->get_field_id('count'); ?>"><?php _e( 'Show post counts' ); ?></label><br />

        <input type="checkbox" class="checkbox" id="<?php echo $this->get_field_id('hierarchical'); ?>" name="<?php echo $this->get_field_name('hierarchical'); ?>"<?php checked( $hierarchical ); ?> />
        <label for="<?php echo $this->get_field_id('hierarchical'); ?>"><?php _e( 'Show hierarchy' ); ?></label></p>
        <?php
    }

}
