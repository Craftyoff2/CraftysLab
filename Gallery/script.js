// Modal image functionality
document.addEventListener('DOMContentLoaded', function() {
	var modal = document.getElementById('imgModal');
	var modalImg = document.getElementById('modalImg');
	var captionText = document.getElementById('caption');
	var closeBtn = document.getElementsByClassName('close')[0];

	// Attach click event to all .polaroid divs and images inside .gallery
	document.querySelectorAll('.gallery .polaroid').forEach(function(div) {
		div.style.cursor = 'pointer';
		div.addEventListener('click', function(e) {
			// Prevent double event if clicking image inside div
			if (e.target.tagName === 'IMG') {
				showModal(e.target);
			} else {
				var img = div.querySelector('img');
				if (img) showModal(img);
			}
		});
	});

					function showModal(img) {
						modal.style.display = 'block';
						setTimeout(function() {
							modal.classList.add('show');
						}, 10); // allow reflow for transition
						modalImg.src = img.src;
						captionText.innerHTML = img.alt || '';
						// Reset animation
						modalImg.classList.remove('zoomOut');
						modalImg.style.animation = 'none';
						void modalImg.offsetWidth;
						modalImg.style.animation = '';

						// Wait for image to load, then position caption below image
						modalImg.onload = function() {
							var rect = modalImg.getBoundingClientRect();
							captionText.style.top = (rect.bottom + 20) + 'px';
							captionText.style.left = '50%';
							captionText.style.transform = 'translate(-50%, 0)';
							captionText.style.position = 'fixed';
							captionText.style.width = rect.width + 'px';
							captionText.style.maxWidth = '90vw';
						};
					}

		// Animate close and hide modal after animation
			function closeModal() {
				modal.classList.remove('show');
				modalImg.classList.add('zoomOut');
				setTimeout(function() {
					modal.style.display = 'none';
					modalImg.classList.remove('zoomOut');
				}, 400); // match animation duration and fade
			}

			closeBtn.onclick = closeModal;
			modal.onclick = function(event) {
				if (event.target === modal) {
					closeModal();
				}
			}

			// Double-tap to zoom modal image
			let lastTap = 0;
			modalImg.addEventListener('touchend', function(e) {
				var currentTime = new Date().getTime();
				var tapLength = currentTime - lastTap;
				if (tapLength < 400 && tapLength > 0) {
					toggleZoom();
					e.preventDefault();
				}
				lastTap = currentTime;
			});
			modalImg.addEventListener('dblclick', function(e) {
				toggleZoom();
			});

			function toggleZoom() {
				if (modalImg.style.transform.includes('scale(2)')) {
					modalImg.style.transform = 'translate(-50%, -50%) scale(1)';
				} else {
					modalImg.style.transform = 'translate(-50%, -50%) scale(2)';
				}
			}
});
