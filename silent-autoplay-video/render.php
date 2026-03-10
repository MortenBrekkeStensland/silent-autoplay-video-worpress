<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$media_url = $attributes['mediaUrl'] ?? '';
if ( ! $media_url ) {
	return;
}

$poster_url = $attributes['posterUrl'] ?? '';
$loop       = ! empty( $attributes['loop'] );
$max_width  = $attributes['maxWidth'] ?? '100%';

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'sav-video-wrapper',
	'style' => 'max-width:' . esc_attr( $max_width ),
) );

$video_attrs = 'class="sav-video" src="' . esc_url( $media_url ) . '" muted autoplay playsinline preload="auto"';
if ( $loop ) {
	$video_attrs .= ' loop';
}
if ( $poster_url ) {
	$video_attrs .= ' poster="' . esc_url( $poster_url ) . '"';
}
?>
<div <?php echo $wrapper_attributes; ?>>
	<video <?php echo $video_attrs; ?>></video>
	<canvas class="sav-canvas" aria-hidden="true"></canvas>
</div>
