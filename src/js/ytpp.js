/*!
 * YTPP v1.0.0 (https://github.com/rapiddev/ytpp)
 * Copyright 2011-2020 The RapidDev | Leszek Pomianowski (https://rdev.cc/)
 * Licensed under MPL-2.0 (https://github.com/rapiddev/ytpp/blob/main/LICENSE)
 */
class YTPP
{
	static #_version = '1.0.0';

	#_apiKey       = '';
	#_container    = '';
	#_playlist     = '';

	#_auto         = false;
	#_debug        = false;

	#_loop         = false;
	#_rounded      = true;
	#_autoplay     = true;
	#_playnext     = true;
	#_showControls = true;
	#_showTitles   = true;
	#_showInfo     = true;
	#_showRelated  = true;

	#_isMobile     = false;
	#_isIos        = false;

	#_videos       = [];
	#_player;

	constructor(configuration = null)
	{
		if(configuration == null)
			return;

		if(configuration.hasOwnProperty('api'))
			this.#_apiKey = configuration.api;

		if(configuration.hasOwnProperty('container'))
			this.#_container = configuration.container;

		if(configuration.hasOwnProperty('playlist'))
			this.#_playlist = configuration.playlist;

		if(configuration.hasOwnProperty('auto'))
			this.#_auto = configuration.auto;

		if(configuration.hasOwnProperty('debug'))
			this.#_debug = configuration.debug;

		if(configuration.hasOwnProperty('loop'))
			this.#_loop = configuration.loop;

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
				YTPP.ConsoleWrite( 'Playlist - ', '#fff', this.#_playlist );
			
			if(this.#_apiKey != '')
				YTPP.ConsoleWrite( 'API Key - ', '#fff', this.#_apiKey );
		}

		this.#MobileDetector();
		
	}

	Auto()
	{
		if (document.getElementsByClassName('ytpp-player').length == 0)
			return;

		let configuration;
		let players = document.getElementsByClassName('ytpp-player');

		if(this.#_debug)
			YTPP.ConsoleWrite( 'Players detected: - ', '#fff', players.length );

		for (let i = 0; i < players.length; i++)
		{
			configuration =
			{
				auto: true,

				container: players.item(i),
				playlist: players.item(i).dataset.hasOwnProperty('playlist') ? players.item(i).dataset.playlist : this.#_playlist,
				api: players.item(i).dataset.hasOwnProperty('api') ? players.item(i).dataset.api : this.#_apiKey,
				
				debug: players.item(i).dataset.hasOwnProperty('debug') ? YTPP.#ParseTrue(players.item(i).dataset.debug) : this.#_debug,
				autoplay: players.item(i).dataset.hasOwnProperty('autoplay') ? YTPP.#ParseTrue(players.item(i).dataset.autoplay) : this.#_autoplay,
				playnext: players.item(i).dataset.hasOwnProperty('playnext') ? YTPP.#ParseTrue(players.item(i).dataset.playnext) : this.#_playnext,
				loop: players.item(i).dataset.hasOwnProperty('loop') ? players.item(i).dataset.loop : this.#_loop,
				rounded: players.item(i).dataset.hasOwnProperty('rounded') ? YTPP.#ParseTrue(players.item(i).dataset.rounded) : this.#_rounded,

				show:
				{
					controls: players.item(i).dataset.hasOwnProperty('showcontrols') ? YTPP.#ParseTrue(players.item(i).dataset.showcontrols) : this.#_showControls,
					titles: players.item(i).dataset.hasOwnProperty('showtitles') ? YTPP.#ParseTrue(players.item(i).dataset.showtitles) : this.#_showTitles,
					info: players.item(i).dataset.hasOwnProperty('showinfo') ? YTPP.#ParseTrue(players.item(i).dataset.showinfo) : this.#_showInfo,
					related: players.item(i).dataset.hasOwnProperty('showrelated') ? YTPP.#ParseTrue(players.item(i).dataset.showrelated) : this.#_showRelated
				}
			};

			( new YTPP(configuration).Create() );
		}
	}

	Create()
	{
		if (typeof YT === 'function')
		{
			this.GetAndCreate();
		}
		else
		{
			this.#RequestApiScript();
		}
	}

	GetAndCreate()
	{
		let YTPP_Hook = this;
		let isDebug = this.#_debug;

		let videos = [];
		let counter = 0;

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
								videos[i] =
								{
									id:          parsedJson.items[i].snippet.resourceId.videoId,
									title:       parsedJson.items[i].snippet.title,
									description: parsedJson.items[i].snippet.description,
									publishedAt: parsedJson.items[i].snippet.publishedAt,
									thumbnail:   parsedJson.items[i].snippet.thumbnails.default.url
								};
								counter++;
							}

							YTPP_Hook.CreateIframe();
						}
					}
				}
				else if (xmlhttp.status == 400)
				{
					if(isDebug)
						YTPP.ConsoleWrite( 'There was an error 400 when quering videos' );
				}
				else
				{
					if(isDebug)
						YTPP.ConsoleWrite( 'Something else other than 200 was returned when quering videos' );
				}
			}
		};

		xmlhttp.open("GET", "https://www.googleapis.com/youtube/v3/playlistItems?playlistId=" + this.#_playlist + "&key=" + this.#_apiKey + "&fields=items&part=snippet&maxResults=50", true);
		xmlhttp.send();

		this.#_videos = videos;

		if(this.#_debug)
			YTPP.ConsoleWrite( 'Videos', '#fff', this.#_videos );
	}

	CreateIframe()
	{
		let configuration =
		{
			videoId: this.#_videos[0].id,
			playerVars:
			{
				'html5':          1,
				'fs':             0,
				'playsinline':    1,
				'modestbranding': 1,
				'loop':           this.#_loop ? 1 : 0,
				'showinfo':       this.#_showInfo ? 1 : 0,
				'autoplay':       this.#_autoplay ? 1 : 0,
				'rel':            this.#_showRelated ? 1 : 0,
				'controls':       this.#_showControls ? 1 : 0
			},
			events:
			{
				'onReady': function()
				{
					//ready
				},
				'onStateChange': function()
				{
					//state change
				}
			}
		};

		if(this.#_playnext)
		{
			configuration.playerVars['listType'] = 'playlist';
			configuration.playerVars['list'] = this.#_playlist;
		}

		if(this.#_debug)
			YTPP.ConsoleWrite( 'IFrame configuration', '#fff', configuration );


		let container = document.createElement('div');
		container.classList.add('ytpp-frame');
		container.classList.add('ytpp-v16by9');

		if(this.#_rounded)
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
		this.#_container.appendChild(container);
		this.#_player = new YT.Player( subcontainer, configuration );

		this.#CreateCarousel();
	}

	#CreateCarousel()
	{
		let single;

		let player = this.#_player;
		let container = document.createElement('div');
		container.classList.add('ytpp-carousel');

		for (let i = 0; i < this.#_videos.length; i++)
		{
			single = document.createElement('div');
			single.classList.add( 'ytpp-playlist-' + i );
			single.classList.add( 'ytpp-item' );
			
			if(this.#_rounded)
				single.classList.add( 'ytpp-item__rounded' );

			single.dataset.id = this.#_videos[i].id; 
			single.onclick = function( )
			{
				let selectedItems = document.getElementsByClassName('ytpp-item active');
				while(selectedItems.length > 0)
					selectedItems[0].classList.remove('active');

				this.classList.add( 'active' );
				player.loadVideoById({ videoId: this.dataset.id });
			};

			if(i == 0)
				single.classList.add( 'active' );

			let image = document.createElement('img');
			image.src = this.#_videos[i].thumbnail;
			single.appendChild(image);

			if(this.#_showTitles)
			{
				let title = document.createElement('p');
				title.innerHTML = this.#_videos[i].title;
				single.appendChild(title);
			}

			container.appendChild(single);
		}
		this.#_container.appendChild(container);

	}

	#RequestApiScript()
	{
		//https://developers.google.com/youtube/iframe_api_reference?hl=pl

		if(this.#_debug)
			YTPP.ConsoleWrite('Loading YouTube API');

		let YTPP_Hook = this;

		let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		window.onYouTubeIframeAPIReady = function ()
		{
			YTPP_Hook.GetAndCreate();
		};

		//iframeApi.onload = function(){}
	}

	#MobileDetector()
	{
		this.#_isMobile = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i));
		this.#_isIos = navigator.userAgent.match(/iPhone|iPad|iPod/i);

		if(this.#_debug)
			if(this.#_isMobile && this.#_isIos)
				YTPP.ConsoleWrite('iOS device');
			else if(this.#_isMobile)
				YTPP.ConsoleWrite('Mobile device');
			else
				YTPP.ConsoleWrite('Desktop device');
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