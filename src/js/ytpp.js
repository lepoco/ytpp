/*!
 * YTPP v1.0.0 (https://github.com/rapiddev/ytpp)
 * Copyright 2011-2020 The RapidDev | Leszek Pomianowski (https://rdev.cc/)
 * Licensed under MPL-2.0 (https://github.com/rapiddev/ytpp/blob/main/LICENSE)
 */
class YTPP
{
	static #_version = '1.0.0';
	static #_yturl   = 'https://www.googleapis.com/youtube/v3/';

	#_containers;

	#_apiKey       = '';
	#_playlist     = '';

	#_auto         = false;
	#_debug        = false;

	#_format       = '16by9';
	#_loop         = false;
	#_rounded      = true;
	#_autoplay     = false;
	#_playnext     = true;
	#_showControls = false;
	#_showTitles   = false;
	#_showInfo     = false;
	#_showRelated  = false;

	#_videos       = [];
	#_players      = [];

	constructor(configuration = null)
	{
		if(configuration == null)
			return;

		if(configuration.hasOwnProperty('container'))
			this.#_containers = configuration.container;

		if(configuration.hasOwnProperty('api'))
			this.#_apiKey = configuration.api;

		if(configuration.hasOwnProperty('playlist'))
			this.#_playlist = configuration.playlist;

		if(configuration.hasOwnProperty('auto'))
			this.#_auto = configuration.auto;

		if(configuration.hasOwnProperty('debug'))
			this.#_debug = configuration.debug;

		if(configuration.hasOwnProperty('loop'))
			this.#_loop = configuration.loop;

		if(configuration.hasOwnProperty('format'))
			this.#_format = configuration.format;

		if(configuration.hasOwnProperty('rounded'))
			this.#_rounded = configuration.rounded;

		if(configuration.hasOwnProperty('autoplay'))
			this.#_autoplay = configuration.autoplay;

		if(configuration.hasOwnProperty('playnext'))
			this.#_playnext = configuration.playnext;

		if(configuration.hasOwnProperty('show'))
		{

			if(configuration.show.hasOwnProperty('controls'))
				this.#_showControls = configuration.show.controls;

			if(configuration.show.hasOwnProperty('titles'))
				this.#_showTitles = configuration.show.titles;

			if(configuration.show.hasOwnProperty('info'))
				this.#_showInfo = configuration.show.info;

			if(configuration.show.hasOwnProperty('related'))
				this.#_showRelated = configuration.show.related;
		}

		

		if(this.#_debug)
		{
			if(!this.#_auto)
			{
				console.log( '================\n YouTube Player\n================\nhttps://rdev.cc/\nv.' + YTPP.#_version );
				YTPP.ConsoleWrite( 'Debug mode enabled' );
				YTPP.ConsoleWrite( 'Loaded configuration', '#fff', configuration );
			}

			if(this.#_playlist != '')
				YTPP.ConsoleWrite( 'Playlist:', '#fff', this.#_playlist );
			
			if(this.#_apiKey != '')
				YTPP.ConsoleWrite( 'API Key:', '#fff', this.#_apiKey );
		}
	}

	Show()
	{
		let parsed;
		let single = false;

		if( this.#_containers == '' || this.#_containers == undefined )
		{
			parsed = document.getElementsByClassName('ytpp-player');

			if(parsed == undefined)
			{
				if(this.#_debug)
					YTPP.ConsoleWrite('Elements with class .ytpp-player do not exist!', 'red');

				return;
			}
		}
		else if(typeof this.#_containers === 'string' || this.#_containers instanceof String)
		{
			if(this.#_containers.startsWith('.'))
			{
				parsed = document.getElementsByClassName( this.#_containers.substring(1) );

				if(parsed == undefined)
				{
					if(this.#_debug)
						YTPP.ConsoleWrite('Elements with class ' + this.#_containers + ' do not exist!', 'red');

					return;
				}
			}
			else if(this.#_containers.startsWith('#'))
			{
				parsed = document.getElementById( this.#_containers.substring(1) );
				single = true;

				if(parsed == undefined)
				{
					if(this.#_debug)
						YTPP.ConsoleWrite('Element with identifier ' + this.#_containers + ' does not exist!', 'red');

					return;
				}
			}
			else
			{
				if(this.#_debug)
					YTPP.ConsoleWrite('An error occurred while finding the element/s. Only classes and IDs are available.', 'red');

				return;
			}
		}	
		else
		{
			if(this.#_containers instanceof HTMLCollection)
			{
				parsed = this.#_containers;
			}
			else if(this.#_containers instanceof HTMLElement)
			{
				parsed = this.#_containers;
				single = true;
			}
			else
			{
				if(this.#_debug)
					YTPP.ConsoleWrite('An error occurred while finding the element/s. Only HTMLCollection\'s and HTMLElement\'s are available.', 'red');

				return;
			}
		}

		if(single)
		{
			this.#_containers = [ parsed ];
		}
		else
		{
			this.#_containers = [];
			for (let i = 0; i < parsed.length; i++)
				this.#_containers[i] = parsed[i];
		}

		this.LoadElements();
	}

	LoadElements()
	{
		if(this.#_debug)
			YTPP.ConsoleWrite('Loading YouTube iFrame API');

		let YTPP_Hook = this;

		let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		window.onYouTubeIframeAPIReady = function ()
		{
			if(YTPP_Hook.IsDebug())
				YTPP.ConsoleWrite('YouTube iFrame API loaded!');

			YTPP_Hook.BuildPlayers( );
		};
	}

	BuildPlayers( )
	{
		if(this.#_debug)
			YTPP.ConsoleWrite( 'Players detected:', '#fff', this.#_containers.length );

		let containerConfig = {};

		for (let i = 0; i < this.#_containers.length; i++)
		{
			containerConfig =
			{
				id: i,
				container: this.#_containers[i],
				api: this.#_containers[i].dataset.hasOwnProperty('api') ? this.#_containers[i].dataset.api : this.#_apiKey,
				playlist: this.#_containers[i].dataset.hasOwnProperty('playlist') ? this.#_containers[i].dataset.playlist : this.#_playlist,
				autoplay: this.#_containers[i].dataset.hasOwnProperty('autoplay') ? YTPP.#ParseTrue(this.#_containers[i].dataset.autoplay) : this.#_autoplay,
				playnext: this.#_containers[i].dataset.hasOwnProperty('playnext') ? YTPP.#ParseTrue(this.#_containers[i].dataset.playnext) : this.#_playnext,
				format: this.#_containers[i].dataset.hasOwnProperty('format') ? this.#_containers[i].dataset.format : this.#_format,
				loop: this.#_containers[i].dataset.hasOwnProperty('loop') ? this.#_containers[i].dataset.loop : this.#_loop,
				rounded: this.#_containers[i].dataset.hasOwnProperty('rounded') ? YTPP.#ParseTrue(this.#_containers[i].dataset.rounded) : this.#_rounded,
				show:
				{
					controls: this.#_containers[i].dataset.hasOwnProperty('showcontrols') ? YTPP.#ParseTrue(this.#_containers[i].dataset.showcontrols) : this.#_showControls,
					titles: this.#_containers[i].dataset.hasOwnProperty('showtitles') ? YTPP.#ParseTrue(this.#_containers[i].dataset.showtitles) : this.#_showTitles,
					info: this.#_containers[i].dataset.hasOwnProperty('showinfo') ? YTPP.#ParseTrue(this.#_containers[i].dataset.showinfo) : this.#_showInfo,
					related: this.#_containers[i].dataset.hasOwnProperty('showrelated') ? YTPP.#ParseTrue(this.#_containers[i].dataset.showrelated) : this.#_showRelated
				},
				videos: []
			};

			console.log( containerConfig );

			this.GetVideos( containerConfig );
		}
	}

	GetVideos( config )
	{
		if(config.playlist == '' || config.playlist == undefined)
		{
			if(this.#_debug)
				YTPP.ConsoleWrite( 'Playlist was not provided for container #' + config.id, 'red' );

			return;
		}

		let isDebug = this.#_debug;
		let xmlhttp  = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState == XMLHttpRequest.DONE)
			{
				if (xmlhttp.status == 200)
				{
					if (/^[\],:{}\s]*$/.test(xmlhttp.responseText.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
					{
						///Detect if correct response

						let parsedJson = JSON.parse(xmlhttp.responseText);

						if(parsedJson.hasOwnProperty('items'))
						{
							for (let i = 0; i < parsedJson.items.length; i++)
							{
								config.videos[i] =
								{
									id:          parsedJson.items[i].snippet.resourceId.videoId,
									title:       parsedJson.items[i].snippet.title,
									description: parsedJson.items[i].snippet.description,
									publishedAt: parsedJson.items[i].snippet.publishedAt,
									thumbnail:   parsedJson.items[i].snippet.thumbnails.default.url
								};
							}

							YTPP.CreateIframe( config );
						}
					}
				}
				else if (xmlhttp.status == 400)
				{
					if( isDebug )
						YTPP.ConsoleWrite( 'There was an error 400 when quering videos' );
				}
				else
				{
					if( isDebug )
						YTPP.ConsoleWrite( 'Something else other than 200 was returned when quering videos' );
				}
			}
		};

		xmlhttp.open('GET', YTPP.#_yturl + 'playlistItems?playlistId=' + config.playlist + '&key=' + config.api + '&fields=items&part=snippet&maxResults=50', true);
		xmlhttp.send();
	}

	static CreateIframe( playerData )
	{
		let container = document.createElement('div');
		container.classList.add('ytpp-frame');

		if(playerData.format == '2by1')
			container.classList.add('ytpp-v2by1');
		else if(playerData.format == '21by9')
			container.classList.add('ytpp-v21by9');
		else
			container.classList.add('ytpp-v16by9');

		if(playerData.rounded)
			container.classList.add('ytpp-frame__rounded');

		let subcontainer = document.createElement('div');
		subcontainer.classList.add('embed-responsive-item');
		subcontainer.style.position = "absolute";
		subcontainer.style.top = 0;
		subcontainer.style.left = 0;
		subcontainer.style.width = "100%";
		subcontainer.style.height = "100%";
		subcontainer.style.border = "none";

		container.appendChild(subcontainer);
		playerData.container.appendChild(container);

		playerData.player = new YT.Player( subcontainer, {
			videoId: playerData.videos[0].id,
			playerVars:
			{
				'html5':          1,
				'fs':             0,
				'playsinline':    1,
				'modestbranding': 1,
				'list':           playerData.playlist,
				'listType':       playerData.playNext ? 'playlist' : 'none',
				'loop':           playerData.loop ? 1 : 0,
				'showinfo':       playerData.showInfo ? 1 : 0,
				'autoplay':       playerData.autoplay ? 1 : 0,
				'rel':            playerData.showRelated ? 1 : 0,
				'controls':       playerData.showControls ? 1 : 0
			},
			events:
			{
				'onReady': function(e)
				{
					console.log(e);
					//console.log('CODE: ', e.data);
					//console.log("target: "+e.target.getIframe().id);
					//ready
				},
				'onStateChange': function(e)
				{
					console.log(e);
					//state change
				}
			}
		});

		YTPP.CreateCarousel( playerData );
	}

	static CreateCarousel( playerData )
	{

		let player = playerData.player;
		let carouselContainer = document.createElement('div');
		carouselContainer.classList.add('ytpp-carousel');

		let carouselTrack = document.createElement('div');
		carouselTrack.classList.add('ytpp-carousel-track');

		let carouselStrip = document.createElement('div');
		carouselStrip.classList.add('ytpp-carousel-strip');

		let carouselItem;
		for (let i = 0; i < playerData.videos.length; i++)
		{
			carouselItem = document.createElement('div');
			carouselItem.classList.add( 'ytpp-playlist-' + i );
			carouselItem.classList.add( 'ytpp-item' );
			
			if( playerData.rounded )
				carouselItem.classList.add( 'ytpp-item__rounded' );

			carouselItem.dataset.id = playerData.videos[i].id; 
			carouselItem.onclick = function()
			{
				let selectedItems = document.getElementsByClassName('ytpp-item active');
				while(selectedItems.length > 0)
					selectedItems[0].classList.remove('active');

				this.classList.add( 'active' );
				player.loadVideoById({ videoId: this.dataset.id });
			};

			if(i == 0)
				carouselItem.classList.add( 'active' );

			let image = document.createElement('img');
			image.src = playerData.videos[i].thumbnail;
			carouselItem.appendChild(image);

			if(playerData.show.title)
			{
				let title = document.createElement('p');
				title.innerHTML = playerData.videos[i].title;
				carouselItem.appendChild(title);
			}

			carouselStrip.appendChild(carouselItem);
		}

		carouselTrack.appendChild(carouselStrip);
		carouselContainer.appendChild(carouselTrack);
		playerData.container.appendChild(carouselContainer);

		carouselTrack.style.width = 'calc(110px * ' + playerData.videos.length + ')';

		//console.log(carouselTrack.clientHeight + "px");
		//carouselContainer.style.minHeight = carouselTrack.clientHeight + "px";
	}

	IsDebug()
	{
		return this.#_debug;
	}

	static #ParseTrue( value )
	{
		return ( value == true || value == 'true' || value == 1 || value == '1' || value > 0 );
	}

	static ConsoleWrite(message, color="#fff", data = null )
	{
		if(data != null)
			console.log( "%cYTPP: "+"%c" + message, "color:#dc3545;font-weight: bold;", "color: " + color, data );
		else
			console.log( "%cYTPP: "+"%c" + message, "color:#dc3545;font-weight: bold;", "color: " + color );
	}
}