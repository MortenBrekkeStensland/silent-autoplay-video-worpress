<?php
/**
 * Plugin Name: Silent Autoplay Video
 * Description: A Gutenberg block for muted autoplay videos with Safari canvas fallback.
 * Version: 1.3
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

function sav_footer_script() {
	if ( ! has_block( 'sav/silent-autoplay-video' ) ) {
		return;
	}
	?>
	<script>
	(function () {
		if (window._savDone) return;
		window._savDone = true;

		window.addEventListener('load', function () {
			var wrappers = document.querySelectorAll('.sav-video-wrapper');
			console.log('[SAV] Wrappers found: ' + wrappers.length);

			wrappers.forEach(function (wrapper) {
				var video = wrapper.querySelector('video.sav-video');
				var canvas = wrapper.querySelector('canvas.sav-canvas');
				if (!video || !canvas || video._sav) return;
				video._sav = true;

				var ctx = canvas.getContext('2d');
				var src = video.src || '(no src)';
				console.log('[SAV] Processing: ' + src + ' paused=' + video.paused);

				// Already playing — nothing to do, but handle tab switch
				if (!video.paused) {
					console.log('[SAV] Native autoplay OK');
					document.addEventListener('visibilitychange', function () {
						if (!document.hidden && video.paused) {
							console.log('[SAV] Tab resumed — restarting video');
							video.play().catch(function () {});
						}
					});
					return;
				}

				// Try to play
				video.muted = true;
				video.setAttribute('muted', '');
				video.setAttribute('playsinline', '');
				video.setAttribute('webkit-playsinline', '');

				var p = video.play();
				if (!p || !p.then) return;

				p.then(function () {
					console.log('[SAV] play() succeeded');
					document.addEventListener('visibilitychange', function () {
						if (!document.hidden && video.paused) {
							console.log('[SAV] Tab resumed — restarting video');
							video.play().catch(function () {});
						}
					});
				}).catch(function () {
					console.log('[SAV] play() blocked — canvas fallback');

					// Hide video, show canvas
					video.style.display = 'none';
					canvas.style.display = 'block';
					canvas.width = video.videoWidth || 640;
					canvas.height = video.videoHeight || 360;

					video.addEventListener('loadedmetadata', function () {
						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;
					});

					// Advance video at real-time speed using rAF + elapsed time
					var running = true;
					var lastTime = 0;

					function tick(now) {
						if (!running) return;
						if (lastTime > 0 && video.readyState >= 2) {
							var delta = (now - lastTime) / 1000;
							video.currentTime += delta;
							ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
							if (video.duration && video.currentTime >= video.duration) {
								if (video.loop) {
									video.currentTime = 0;
								} else {
									running = false;
									return;
								}
							}
						}
						lastTime = now;
						requestAnimationFrame(tick);
					}

					requestAnimationFrame(tick);

					// On real interaction, switch to native playback
					['click', 'touchstart', 'keydown'].forEach(function (evt) {
						document.addEventListener(evt, function handler() {
							running = false;
							video.style.display = '';
							canvas.style.display = 'none';
							video.play().catch(function () {});
							document.removeEventListener(evt, handler);
						}, { once: true });
					});
				});
			});
		});
	})();
	</script>
	<?php
}

add_action( 'wp_footer', 'sav_footer_script' );
