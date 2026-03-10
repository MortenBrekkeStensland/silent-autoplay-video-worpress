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
			canvas.style.display = 'none';
		}

		// Smooth canvas loop using requestAnimationFrame — requires video.play() to work
		function drawFrameLoop() {
			if (!canvasActive) return;
			if (video.readyState >= 2) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			}
			requestAnimationFrame(drawFrameLoop);
		}

		// Last-resort fallback: manually advance currentTime at ~30fps
		function startManualAdvance() {
			manualInterval = setInterval(function () {
				if (video.readyState >= 2) {
					video.currentTime += 1 / 30;
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
		}

		function listenForInteraction() {
			var events = ['click', 'scroll', 'touchstart', 'keydown'];
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
					// Native autoplay works — canvas stays hidden
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
							// Truly blocked — manually advance currentTime as last resort
							startManualAdvance();
						});

					listenForInteraction();
				});
		}
	}

	// Initialize all instances on the page
	document.querySelectorAll('.sav-video-wrapper').forEach(initVideo);
})();
