(function () {
	function initVideo(wrapper) {
		var video = wrapper.querySelector('.sav-video');
		var canvas = wrapper.querySelector('.sav-canvas');
		if (!video || !canvas) return;

		var ctx = canvas.getContext('2d');
		var canvasActive = false;
		var manualInterval = null;

		function sizeCanvas() {
			canvas.width = video.videoWidth || 640;
			canvas.height = video.videoHeight || 360;
		}

		function showCanvas() {
			video.style.position = 'absolute';
			video.style.width = '1px';
			video.style.height = '1px';
			video.style.opacity = '0';
			video.style.pointerEvents = 'none';
			// Video must be display:block for frame data even when visually hidden
			video.style.display = 'block';
			canvas.style.display = 'block';
			canvasActive = true;
			sizeCanvas();
		}

		function hideCanvas() {
			canvasActive = false;
			if (manualInterval) {
				clearInterval(manualInterval);
				manualInterval = null;
			}
			video.style.position = '';
			video.style.width = '';
			video.style.height = '';
			video.style.opacity = '';
			video.style.pointerEvents = '';
			video.style.display = '';
			video.classList.add('sav-native');
			canvas.style.display = 'none';
		}

		// Draw loop at display refresh rate (used by both tiers)
		function drawFrameLoop() {
			if (!canvasActive) return;
			if (video.readyState >= 2) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			}
			requestAnimationFrame(drawFrameLoop);
		}

		// Last-resort: advance currentTime via setInterval, draw via requestAnimationFrame
		function startManualAdvance() {
			// Advance time at ~30fps
			manualInterval = setInterval(function () {
				if (video.readyState >= 2) {
					video.currentTime += 1 / 30;
					if (video.duration && video.currentTime >= video.duration) {
						if (video.loop) {
							video.currentTime = 0;
						} else {
							clearInterval(manualInterval);
							manualInterval = null;
						}
					}
				}
			}, 1000 / 30);

			// Draw at display refresh rate (separate from time advancement)
			drawFrameLoop();
		}

		function listenForInteraction() {
			var events = ['click', 'touchstart', 'keydown'];
			events.forEach(function (evt) {
				document.addEventListener(
					evt,
					function handler() {
						hideCanvas();
						video.play().catch(function () {});
						events.forEach(function (e) {
							document.removeEventListener(e, handler);
						});
					},
					{ once: true }
				);
			});
		}

		video.addEventListener('loadedmetadata', sizeCanvas);

		// Ensure autoplay-friendly attributes are set
		video.muted = true;
		video.setAttribute('muted', '');
		video.setAttribute('playsinline', '');
		video.setAttribute('webkit-playsinline', '');

		var playPromise = video.play();

		if (playPromise !== undefined) {
			playPromise
				.then(function () {
					// Native autoplay works — show video, canvas stays hidden
					video.classList.add('sav-native');
				})
				.catch(function () {
					// Autoplay blocked — show canvas
					showCanvas();

					// Retry play() now that attributes are explicitly set.
					// If this works, the video plays in the background and we
					// draw frames smoothly with requestAnimationFrame.
					video.play()
						.then(function () {
							// Video is playing natively (hidden) — draw at display refresh rate
							drawFrameLoop();
						})
						.catch(function () {
							// Truly blocked — advance time manually, draw at 60fps
							startManualAdvance();
						});

					listenForInteraction();
				});
		}
	}

	// Initialize all instances on the page
	document.querySelectorAll('.sav-video-wrapper').forEach(initVideo);
})();
