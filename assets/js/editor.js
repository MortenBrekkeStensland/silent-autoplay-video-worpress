(function () {
	var el = wp.element.createElement;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var MediaPlaceholder = wp.blockEditor.MediaPlaceholder;
	var MediaUpload = wp.blockEditor.MediaUpload;
	var PanelBody = wp.components.PanelBody;
	var ToggleControl = wp.components.ToggleControl;
	var TextControl = wp.components.TextControl;
	var Button = wp.components.Button;

	registerBlockType('sav/silent-autoplay-video', {
		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps();

			function onSelectVideo(media) {
				setAttributes({
					mediaId: media.id,
					mediaUrl: media.url,
				});
			}

			function onSelectPoster(media) {
				setAttributes({
					posterId: media.id,
					posterUrl: media.url,
				});
			}

			function onRemovePoster() {
				setAttributes({
					posterId: 0,
					posterUrl: '',
				});
			}

			var inspectorControls = el(
				InspectorControls,
				null,
				el(
					PanelBody,
					{ title: 'Video Settings' },
					el(ToggleControl, {
						label: 'Loop',
						checked: attributes.loop,
						onChange: function (val) {
							setAttributes({ loop: val });
						},
					}),
					el(TextControl, {
						label: 'Max Width',
						value: attributes.maxWidth,
						onChange: function (val) {
							setAttributes({ maxWidth: val });
						},
						help: 'CSS max-width value, e.g. "100%", "800px"',
					}),
					el(
						'div',
						{ className: 'components-base-control' },
						el(
							'label',
							{ className: 'components-base-control__label' },
							'Poster Image'
						),
						attributes.posterUrl
							? el(
									'div',
									null,
									el('img', {
										src: attributes.posterUrl,
										style: {
											maxWidth: '100%',
											marginBottom: '8px',
											display: 'block',
										},
									}),
									el(
										Button,
										{
											variant: 'secondary',
											isDestructive: true,
											onClick: onRemovePoster,
											size: 'small',
										},
										'Remove Poster'
									)
							  )
							: el(MediaUpload, {
									onSelect: onSelectPoster,
									allowedTypes: ['image'],
									render: function (obj) {
										return el(
											Button,
											{
												variant: 'secondary',
												onClick: obj.open,
											},
											'Select Poster Image'
										);
									},
							  })
					)
				)
			);

			if (!attributes.mediaUrl) {
				return el(
					'div',
					blockProps,
					inspectorControls,
					el(MediaPlaceholder, {
						icon: 'format-video',
						labels: {
							title: 'Silent Autoplay Video',
							instructions: 'Select a video from the media library.',
						},
						onSelect: onSelectVideo,
						accept: 'video/*',
						allowedTypes: ['video'],
					})
				);
			}

			return el(
				'div',
				blockProps,
				inspectorControls,
				el(
					'div',
					{
						className: 'sav-editor-preview',
						style: { maxWidth: attributes.maxWidth },
					},
					el('video', {
						src: attributes.mediaUrl,
						muted: true,
						autoPlay: true,
						loop: attributes.loop,
						playsInline: true,
						poster: attributes.posterUrl || undefined,
					}),
					el(
						'div',
						{ className: 'sav-editor-replace' },
						el(MediaUpload, {
							onSelect: onSelectVideo,
							allowedTypes: ['video'],
							value: attributes.mediaId,
							render: function (obj) {
								return el(
									Button,
									{
										onClick: obj.open,
										variant: 'primary',
										size: 'small',
									},
									'Replace Video'
								);
							},
						})
					)
				)
			);
		},

		save: function () {
			return null;
		},
	});
})();
