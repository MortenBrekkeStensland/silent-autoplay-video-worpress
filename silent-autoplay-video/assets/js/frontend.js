(function () {
	function initVideo(wrapper) {
		var video = wrapper.querySelector('.sav-video');
		var canvas = wrapper.querySelector('.sav-canvas');
		if (!video || !canvas) return;

		var ctx = canvas.getContext('2d');

		function sizeCanvas() {
			canvas.width = video.videoWidth || 640;
			canvas.height = video.videoHeight || 360;
		}

		video.addEventListener('loadedmetadata', sizeCanvas);

		var playPromise = video.play();

		if (playPromise !== undefined) {
			playPromise
				.then(function () {
					// Native autoplay works — canvas stays hidden
				})
				.catch(function () {
					// Autoplay blocked (Safari) — fall back to canvas rendering
					video.style.position = 'absolute';
					video.style.width = '1px';
					video.style.height = '1px';
					video.style.opacity = '0';
					video.style.pointerEvents = 'none';

					canvas.style.display = 'block';
					sizeCanvas();

					var interval = setInterval(function () {
						if (video.readyState >= 2) {
							video.currentTime += 1 / 30;
							ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
							if (video.duration && video.currentTime >= video.duration) {
								if (video.loop) {
									video.currentTime = 0;
								} else {
									clearInterval(interval);
								}
							}
						}
					}, 1000 / 30);

					// On first user interaction, switch to native playback
					var events = ['click', 'scroll', 'touchstart', 'keydown'];
					events.forEach(function (evt) {
						document.addEventListener(
							evt,
							function handler() {
								clearInterval(interval);
								video.style.position = '';
								video.style.width = '';
								video.style.height = '';
								video.style.opacity = '';
								video.style.pointerEvents = '';
								canvas.style.display = 'none';
								video.play().catch(function () {});
								events.forEach(function (e) {
									document.removeEventListener(e, handler);
								});
							},
							{ once: true }
						);
					});
				});
		}
	}

	// Initialize all instances on the page
	document.querySelectorAll('.sav-video-wrapper').forEach(initVideo);
})();
