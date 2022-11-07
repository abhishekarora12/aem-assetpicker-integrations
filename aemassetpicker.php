<?php
/**
 * Plugin Name:       AEM Assetpicker
 * Description:       Embed an image or video asset from AEM Digital Assets Manager
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           2.0.0
 * Author:            Abhishek Arora
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       aemassetpicker
 *
 * @package           adobe
 */

/**
 * Plugin Settings Page
 * 
 * Generated by the WordPress Option Page generator
 * at http://jeremyhixon.com/wp-tools/option-page/
 */
class Aemassetpicker {
	private $aemassetpicker_options;

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'aemassetpicker_add_plugin_page' ) );
		add_action( 'admin_init', array( $this, 'aemassetpicker_page_init' ) );
	}

	public function aemassetpicker_add_plugin_page() {
		add_options_page(
			'AEM Assetpicker', // page_title
			'AEM Assetpicker', // menu_title
			'manage_options', // capability
			'aemassetpicker', // menu_slug
			array( $this, 'aemassetpicker_create_admin_page' ) // function
		);
	}

	public function aemassetpicker_create_admin_page() {
		$this->aemassetpicker_options = get_option( 'aemassetpicker_option_name' ); ?>

		<div class="wrap">
			<h2>AEM Assetpicker Settings</h2>
			<p>Changing the options here affects all the aemassetpicker blocks</p>
			<?php settings_errors(); ?>

			<form method="post" action="options.php">
				<?php
					settings_fields( 'aemassetpicker_option_group' );
					do_settings_sections( 'aemassetpicker-admin' );
					submit_button();
				?>
			</form>
		</div>
	<?php }

	public function aemassetpicker_page_init() {
		register_setting(
			'aemassetpicker_option_group', // option_group
			'aemassetpicker_option_name', // option_name
			array( $this, 'aemassetpicker_sanitize' ) // sanitize_callback
		);

		add_settings_section(
			'aemassetpicker_setting_section', // id
			'Global Settings', // title
			array( $this, 'aemassetpicker_section_info' ), // callback
			'aemassetpicker-admin' // page
		);

		add_settings_field(
			'aem_author_url_0', // id
			'AEM AUTHOR URL', // title
			array( $this, 'aem_author_url_0_callback' ), // callback
			'aemassetpicker-admin', // page
			'aemassetpicker_setting_section' // section
		);

		add_settings_field(
			'aem_publish_url_1', // id
			'AEM PUBLISH URL', // title
			array( $this, 'aem_publish_url_1_callback' ), // callback
			'aemassetpicker-admin', // page
			'aemassetpicker_setting_section' // section
		);
	}

	public function aemassetpicker_sanitize($input) {
		$sanitary_values = array();
		if ( isset( $input['aem_author_url_0'] ) ) {
			$sanitary_values['aem_author_url_0'] = sanitize_text_field( $input['aem_author_url_0'] );
		}

		if ( isset( $input['aem_publish_url_1'] ) ) {
			$sanitary_values['aem_publish_url_1'] = sanitize_text_field( $input['aem_publish_url_1'] );
		}

		return $sanitary_values;
	}

	public function aemassetpicker_section_info() {
		
	}

	public function aem_author_url_0_callback() {
		printf(
			'<input class="regular-text" type="text" name="aemassetpicker_option_name[aem_author_url_0]" id="aem_author_url_0" value="%s">',
			isset( $this->aemassetpicker_options['aem_author_url_0'] ) ? esc_attr( $this->aemassetpicker_options['aem_author_url_0']) : ''
		);
	}

	public function aem_publish_url_1_callback() {
		printf(
			'<input class="regular-text" type="text" name="aemassetpicker_option_name[aem_publish_url_1]" id="aem_publish_url_1" value="%s">',
			isset( $this->aemassetpicker_options['aem_publish_url_1'] ) ? esc_attr( $this->aemassetpicker_options['aem_publish_url_1']) : ''
		);
	}

}
if ( is_admin() )
	$aemassetpicker = new Aemassetpicker();

/**
 * Puts settings option on plugin screen
 */
function aemassetpicker_plugin_settings_link( $links ) : array {
    $label = esc_html__( 'Settings', 'aemassetpicker-plugin' );
    $slug  = 'aemassetpicker';

    array_unshift( $links, "<a href='options-general.php?page=$slug'>$label</a>" );

    return $links;
}
add_action( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'aemassetpicker_plugin_settings_link', 10 );

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_aemassetpicker_block_init() {
	//Enqueue Scripts
	wp_enqueue_script( 'aemassetpicker_globalsettings', plugins_url( 'build/globalsettings.js' , __FILE__ ) );

	// Get options from php
	$aemassetpicker_options = get_option( 'aemassetpicker_option_name' ); // Array of All Options

	// Send options to javascript
	wp_localize_script( 'aemassetpicker_globalsettings', 'GLOBAL_ASSETPICKER_OPTIONS', $aemassetpicker_options );

	// Register Block
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_aemassetpicker_block_init' );
