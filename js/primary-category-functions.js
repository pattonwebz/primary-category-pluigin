 /**
  * primary-category-functions.js
  *
  * Holds all the functions used to deal with everything inside the post edit
  * screen related to setting of primary categories.
  *
  * @package  Primary Category Plugin
  */

function pwwp_pc_initiate(){
	// add any buttons that should exist and set the correct one to selected.
	pwwp_pc_bootstrap();
	// sets up the inital checkbox change binds.
	pwwp_pc_bind_on_checkbox_change();
	// start the click event binds for our added buttons.
	pwwp_pc_bind_on_button_make_primary();
}

/**
 * Function used to bootstrap and initate the primary category system.
 */
function pwwp_pc_bootstrap() {
	// on initial load find any already checked items and add their buttons.
	jQuery("#categorychecklist").contents().find(":checkbox:checked").each( function(){
		is_checked = this.checked;
		if( true === is_checked ){
			// Add a class to one of the wrappers help help identify it later.
			jQuery( this ).parent().parent().addClass( 'pwwp-pc-checked' );
			// toggle the addition of a button aside the category selected.
			pwwp_pc_toggle_button_in_label( this );
		}
	});

	// if the global object we added has a category already set then button for
	// it should be set to selected.
	if( pwwp_pc_data.primary_category_id ){
		// get an item that might be checked,
		var item_maybe_checked = jQuery( '#category-' + pwwp_pc_data.primary_category_id ).contents().find( ':checkbox:checked' );
		// if the item that might be checked has a length then it is checked.
		if ( jQuery( item_maybe_checked ).length > 0 ){
			// loop through the buttons (there should only be one) and set them
			// up as selected.
			jQuery( '#category-' + pwwp_pc_data.primary_category_id + ' .pwwp-pc-primary' ).each( function() {
				// set a better screen reader text to show it's selected.
				jQuery( this ).parent().find( '.screen-reader-text' ).val( 'This Posts Primary Category' );
				jQuery( this ).parent().addClass( 'pwwp-pc-cat-selected' );
				// disable the button and set it's value to selected
				jQuery( this ).prop( 'disabled', true );
				jQuery( this ).val('Selected');
			})
		};
	} else {
		// if there is no primary already set then find all buttons and click
		// the first one that is found.
		var buttons = jQuery( '#category-' + pwwp_pc_data.primary_category_id + ' .pwwp-pc-primary' );
		if( typeof jQuery( buttons )[0] !== "undefined" && jQuery( buttons )[0].length > 0 ) {
			jQuery( buttons )[0].click();
		}
	}

}

/**
 * Bind to the checkboxes beside categories in the category select box and
 * triggers on change.
 */
function pwwp_pc_bind_on_checkbox_change() {
	// fund all checkboxes inside the contaner and bind to the 'change' event.
	jQuery("#categorychecklist").contents().find(":checkbox").bind('change', function(){
		// cast this to a variable for clarity.
        is_checked = this.checked;
		if( true === is_checked ){
			// Add a class to one of the wrappers help help identify it later.
			jQuery( this ).parent().parent().addClass( 'pwwp-pc-checked' );
			// toggle the addition of a button aside the category selected.
			pwwp_pc_toggle_button_in_label( this );
		} else {
			/**
			 * This else clause triggers to remove added classes and labels.
			 */
			jQuery( this ).parent().parent().removeClass( 'pwwp-pc-checked' );
			pwwp_pc_toggle_button_in_label( this, false );
		}
	});
}

/**
 * Function to handle adding/removing of a button and lable from aside categories.
 * @param  {Mixed}   [element=false] either contains a jQuery object or false if empty
 * @param  {Boolean} [toAdd=true]    flag to decide if we're adding or removing items, default is adding
 */
function pwwp_pc_toggle_button_in_label( element = false, toAdd = true ) {
	// if element is false then we were not passed an element to act on.
	if( false !== element ){
		/**
		 * Either perform the actions to add the label or remove it.
		 */
		if( true === toAdd ) {
			// fund the correct place beside the chosen element and append some markup.
			jQuery( element ).parent().after( '<label><input type="button" class="pwwp-pc-primary button button-small button-primary" value="Make Primary" style="margin-left: 10px !important; float: right;"><span class="screen-reader-text">Make Primary</span></label>' );
			//  mark one of te wrappers to indicate checked
			jQuery( element ).parent().parent().addClass( 'pwwp-pc-checked' );
			// ensure a click event is bound to any newly added buttons.
			pwwp_pc_bind_off_button_make_primary();
			pwwp_pc_bind_on_button_make_primary();
		} else {
			var container;
			// find the elements outter wrapper.
			container = jQuery( element ).parent().parent();
			// find the item we want (a button to remove).
			var item = jQuery( jQuery( container ).find( '.pwwp-pc-primary' ) );
			// remove the button.
			if( jQuery( item ).first().is(':disabled') ) {
				// the button being removed is the selected primary category,
				// click next button to prevent hanging data.
				jQuery( jQuery(item).first() ).remove();
				jQuery( '#categorychecklist' ).find( '.pwwp-pc-primary' ).first().click();
			} else {
				// just remove button.
				jQuery( jQuery(item).first() ).remove();
			}
			// remove the class from the container.
			jQuery( container ).parent().parent().removeClass( 'pwwp-pc-checked' );
		}
	}
}

/**
 * Update the category value inside the custom meta box
 * @param  {Boolean} [success=false] [description]
 * @param  {[type]}  value           [description]
 * @return {[type]}                  [description]
 */
function pwwp_pc_update_custom_metabox_on_success( success = false, value ) {
	// make sure we were passed a value that doesn't indicate failure.
	if( false !== success ){
		// get the #id of the wrapper that would contain our primary category meta value.
		var parentid = jQuery( '#postcustom #postcustomstuff input[value="_pwwp_pc_selected"]' ).parent().parent( 'tr' ).attr( 'id' );
		if ( jQuery( parentid ).length > 0 ) {
			// since we found the parent, grab the value from the textarea.
			var val = jQuery( '#' + parentid ).find( '#' + parentid + '-value' ).val();
		}
		// if the current value in the textarea doesn't match what we passed...
		if ( val !== value ){
			// then update the value in the textarea to new value.
			jQuery( '#' + parentid ).find( '#' + parentid + '-value' ).val( value );
		}
	}
}

/**
 * Function to send the ajax request used to set or update primary category stored in post meta.
 * @param  {String} [cat=''] a string containing the nicename of category to save in post meta
 * @return return NULL on failure
 */
function pwwp_pc_make_ajax_request( category = '' ) {
	// no category passed will result in fail in request...
	if ( '' === category ) {
		// so there was no category passed, return.
		return;
	}

	/**
	 * Build a data object to pass to the AJAX request. It should contain
	 * curreent post ID and a category string. Also passes the action name
	 * we're sending the data to.
	 *
	 * We rely on data passed to wp_inline_script found in global pwwp_pc_data,
	 * check that exists before we do anything.
	 */
	if( pwwp_pc_data ){
		// the global object we need data from exists so continue building object.
		var data = {
			'action'		: 'pwwp_pc_save_primary_category',
			'nonce'			: pwwp_pc_data.nonce,
			'ID'			: pwwp_pc_data.post_id,
			'category'		: category,
			'old_term_id'	: pwwp_pc_data.primary_category_id,
		};

	}

	// Make the AJAX request.
	// NOTE: ajaxurl is a global aviable in admin area pointing to site ajax url.
	jQuery.post(ajaxurl, data, function(response) {
		// if we got a response...
		if( response ){
			// TODO: VALIDATE HERE

			// send the response and category to a function that will update if
			// the request succeeded.
			pwwp_pc_update_custom_metabox_on_success( response, category );
		} else {
			var response = 'The server did not respond.';
		}
		console.log('Primary Category: Got this response from the server - ' + JSON.stringify( response ) );
	});

/**
 * Function which binds our added buttons to the click event handler we want.
 */
}
function pwwp_pc_bind_on_button_make_primary() {
	// on click trigger our hander.
	jQuery(".pwwp-pc-primary").on('click', pwwp_pc_button_click_handler );
}
/**
 * Function which unbinds our added buttons from our handler.
 */
function pwwp_pc_bind_off_button_make_primary() {
	// unbind on click trigger our hander.
	jQuery(".pwwp-pc-primary").off('click', pwwp_pc_button_click_handler );
}


/**
 * Resets all the buttons already in place to their default values. This is done
 * prior to updating the selected button based on the click event.
 */
function pwwp_pc_reset_all_buttons() {
	pwwp_pc_bind_off_button_make_primary();
	// loop through all of the added buttons.
	jQuery(".pwwp-pc-primary").each( function( index ) {
		// remove the class indicating a button is active.
		jQuery( this ).parent().removeClass( 'pwwp-pc-cat-selected' )
		// remove any classes indicating that an item is selected.
		jQuery( this ).parent().parent().removeClass( 'pwwp-pc-checked' );
		// Sent the screen reader text to it's defautl value.
		jQuery( this ).parent().find( '.screen-reader-text' ).val( 'Make Primary' );
		// make the button NOT disabled.
		jQuery( this ).prop( 'disabled', false );
		// set the value of the button back to the default.
		jQuery( this ).val('Make Primary');
	});
	pwwp_pc_bind_on_button_make_primary();
}

/**
 * Click handler for when people click the button to set categories as primary.
 * @param  {object} event object describing the event (will be a click event)
 */
function pwwp_pc_button_click_handler( event ) {
	// we're handling everything this button does, prevent default behaviors.
	event.preventDefault();
	// Preventing default halts the submit but clicking triggers our handler
	// + issues a click = 2 times triggered. Need to stop propagation too.
    event.stopImmediatePropagation();

	// reset all the buttons to start with a clean slate.
	pwwp_pc_reset_all_buttons();
	// add a class indicating this item is selected as primary cat.
	jQuery( this ).parent().addClass( 'pwwp-pc-cat-selected')

	/**
	 * We chould always have the class this test for since we just added it above...
	 */
	if( jQuery( this ).parent().hasClass( 'pwwp-pc-cat-selected' ) ) {
		// set a better screen reader text to show it's selected.
		jQuery( this ).parent().find( '.screen-reader-text' ).val( 'This Posts Primary Category' );
		// disable the button and set it's value to selected
		jQuery( this ).prop( 'disabled', true );
		jQuery( this ).val('Selected');

		// Grab all text in a wrapper for our selected category.
		var cat = jQuery( this ).parent().parent().text();
		// Find and remove the text that is from our button
		// TODO: we can't rely on a string replace because 'Make Primary' might be translated
		cat = cat.replace('Make Primary', '');
		// remove whitespace, should be left with only nicename of a category.
		cat = cat.trim();

		console.log( 'will make request with this category: ' + cat )
		// trigger the ajax request to update category in post meta.
		pwwp_pc_make_ajax_request( cat );
	} else {
		/**
		 * This else clause should never trigger, if it does set things back to
		 * default values.
		 */
		jQuery( this ).parent().find( '.screen-reader-text' ).val( 'Make Primary' );
		jQuery( this ).prop( 'disabled', false );
		jQuery( this ).val('Make Primary');
	}


}

/**
 * When the document is ready initiate the primary category system.
 */
jQuery( document ).ready( function() {
	pwwp_pc_initiate();
});
