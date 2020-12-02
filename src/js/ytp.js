/*!
 * YTP v1.0.0 (https://github.com/rapiddev/ytp)
 * Copyright 2011-2020 The RapidDev | Leszek Pomianowski (https://rdev.cc/)
 * Licensed under MPL-2.0 (https://github.com/rapiddev/ytp/blob/main/LICENSE)
 */
class YTP
{
	static #_version = '1.0.0';

	#_apiKey       = '';
	#_container    = '';
	#_playlists     = [];

	#_auto         = false;
	#_debug        = false;

	#_autoplay     = true;
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

		if(configuration.hasOwnProperty('auto'))
			this.#_auto = configuration.auto;

		if(configuration.hasOwnProperty('debug'))
			this.#_debug = configuration.debug;

		if(configuration.hasOwnProperty('api'))
			this.#_apiKey = configuration.api;

		if(configuration.hasOwnProperty('container'))
			this.#_container = configuration.container;

		if(configuration.hasOwnProperty('playlists'))
			this.#_playlists = configuration.playlists;

		if(configuration.hasOwnProperty('autoplay'))
			this.#_autoplay = configuration.autoplay;

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
				console.log( '================\n YouTube Player\n================\nhttps://rdev.cc/\nv.' + YTP.#_version );
				YTP.#ConsoleWrite( 'Debug mode enabled' );
				YTP.#ConsoleWrite( 'Loaded configuration', '#fff', configuration );
			}

			if(this.#_playlists != '')
				YTP.#ConsoleWrite( 'Playlists - ', '#fff', this.#_playlists );
			
			if(this.#_apiKey != '')
				YTP.#ConsoleWrite( 'API Key - ', '#fff', this.#_apiKey );
		}

		this.#MobileDetector();
		
	}

	Auto()
	{
		if (document.getElementsByClassName('ytp-player').length == 0)
			return;

		let configuration;
		let players = document.getElementsByClassName('ytp-player');

		if(this.#_debug)
			YTP.#ConsoleWrite( 'Players detected: - ', '#fff', players.length );

		for (let i = 0; i < players.length; i++)
		{
			configuration = {
				auto: true,
				container: players.item(i),
				playlists: players.item(i).dataset.hasOwnProperty('playlist') ? [players.item(i).dataset.playlist] : this.#_playlists,
				api: players.item(i).dataset.hasOwnProperty('api') ? players.item(i).dataset.api : this.#_apiKey,
				
				debug: players.item(i).dataset.hasOwnProperty('debug') ? YTP.#ParseTrue(players.item(i).dataset.debug) : this.#_debug,
				autoplay: players.item(i).dataset.hasOwnProperty('autoplay') ? YTP.#ParseTrue(players.item(i).dataset.autoplay) : this.#_autoplay,
				show:
				{
					controls: players.item(i).dataset.hasOwnProperty('showcontrols') ? YTP.#ParseTrue(players.item(i).dataset.showcontrols) : this.#_showControls,
					titles: players.item(i).dataset.hasOwnProperty('showtitles') ? YTP.#ParseTrue(players.item(i).dataset.showtitles) : this.#_showTitles,
					info: players.item(i).dataset.hasOwnProperty('showinfo') ? YTP.#ParseTrue(players.item(i).dataset.showinfo) : this.#_showInfo,
					related: players.item(i).dataset.hasOwnProperty('showrelated') ? YTP.#ParseTrue(players.item(i).dataset.showrelated) : this.#_showRelated
				}
			};

			( new YTP(configuration).Create() );
		}
	}

	Create()
	{
		this.#RequestApiScript();
	}

	GetVideos()
	{
		let YTP_Hook = this;

		let playlistUris = [];
		let videos = [];

		let loops = 0;
		let counter = 0;

		for (let n=0; n < this.#_playlists.length; n++)
		{
			playlistUris[n] = "https://www.googleapis.com/youtube/v3/playlistItems?playlistId=" + this.#_playlists[n] + "&key=" + this.#_apiKey + "&fields=items&part=snippet&maxResults=50";
		}

		//console.log(playlistUris);

		let xmlhttp;
		for (let i = 0; i < playlistUris.length; i++)
		{
			xmlhttp = new XMLHttpRequest()
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

								loops++;
								if(loops == playlistUris.length)
								{
									YTP_Hook.CreateIframe();
								}
							}
						}
					}
					else if (xmlhttp.status == 400)
					{
						if(this.#_debug)
							YTP.#ConsoleWrite( 'There was an error 400 when quering videos' );
					}
					else
					{
						if(this.#_debug)
							YTP.#ConsoleWrite( 'Something else other than 200 was returned when quering videos' );
					}
				}
			};

			xmlhttp.open("GET", playlistUris[i], true);
			xmlhttp.send();
		}

		this.#_videos = videos;

		if(this.#_debug)
			YTP.#ConsoleWrite( 'Videos', '#fff', this.#_videos );
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
				'showinfo':       this.#_showInfo ? 1 : 0,
				'autoplay':       this.#_autoplay ? 1 : 0,
				'rel':            this.#_showRelated ? 1 : 0,
				'controls':       this.#_showControls ? 1 : 0
			}
		};

		if(this.#_debug)
			YTP.#ConsoleWrite( 'IFrame configuration', '#fff', configuration );


		let container = document.createElement('div');
		container.classList.add('ytp-frame');
		container.classList.add('ytp-frame__rounded');
		container.classList.add('ytp-v16by9');

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
		container.classList.add('ytp-carousel');

		for (let i = 0; i < this.#_videos.length; i++)
		{
			single = document.createElement('div');
			single.classList.add( 'ytp-playlist-' + i );
			single.classList.add( 'ytp-item' );
			single.classList.add( 'ytp-item__rounded' );

			single.dataset.id = this.#_videos[i].id; 

			single.onclick = function( )
			{
				console.log(this);


				let elements = document.getElementsByClassName('ytp-item active');
				while(elements.length > 0)
				{
				    elements[0].classList.remove('active');
				}

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
			YTP.#ConsoleWrite('Loading YouTube API');

		let YTP_Hook = this;

		let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		window.onYouTubeIframeAPIReady = function ()
		{
			YTP_Hook.GetVideos();
		};

		//iframeApi.onload = function(){}
	}

	#MobileDetector()
	{
		this.#_isMobile = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i));
		this.#_isIos = navigator.userAgent.match(/iPhone|iPad|iPod/i);

		if(this.#_debug)
			if(this.#_isMobile && this.#_isIos)
				YTP.#ConsoleWrite('iOS device');
			else if(this.#_isMobile)
				YTP.#ConsoleWrite('Mobile device');
			else
				YTP.#ConsoleWrite('Desktop device');
	}

	static #ParseTrue( value )
	{
		return ( value == true || value == 'true' || value == 1 || value == '1' || value > 0 );
	}

	static #ConsoleWrite(message, color="#fff", data = null )
	{
		if(data != null)
			console.log( "%cYTP: "+"%c" + message, "color:#dc3545;font-weight: bold;", "color: " + color, data );
		else
			console.log( "%cYTP: "+"%c" + message, "color:#dc3545;font-weight: bold;", "color: " + color );
	}
}