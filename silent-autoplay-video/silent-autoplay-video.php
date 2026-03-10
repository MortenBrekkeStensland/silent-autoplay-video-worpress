<?php
/**
 * Plugin Name: Silent Autoplay Video
 * Description: A Gutenberg block for muted autoplay videos with Safari canvas fallback.
 * Version: 1.0.0
 * Author: PresentationTools A/S
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: silent-autoplay-video
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function sav_register_block() {
	register_block_type( __DIR__ );
}

add_action( 'init', 'sav_register_block' );
