![Logo](https://github.com/rapiddev/ytpp/blob/main/.github/screenshot-1.jpg?raw=true)
# YouTube Playlist Player
[Created with ![heart](http://i.imgur.com/oXJmdtz.gif) in Poland by RapidDev](https://rdev.cc/)<br />
A simple way to display playlists nicely on your website. Reponsively, using YT API V3.  
This is an early version so there is still room for improvement.

## Usage
**Add a reference to the script and style**
```html
<link href="https://example.com/ytpp/css/ytpp.min.css" rel="stylesheet" />
<script src="https://example.com/ytpp/js/ytpp.min.js" crossorigin="anonymous"></script>
```

**Place the player wherever you like**
```html
<div class="ytpp-player"
  data-playlist="PLpsBoYnu3xNbKE_i7crf55E8h7lgHp4bt"
	data-rounded="true"
	data-autoplay="true"
	data-showcontrols="false"
	data-showtitles="false"
	data-showinfo="false"
	data-showrelated="false">
</div>
```

**Finally, run the script**
```html
<script>
  YTPP( { debug: true, api: 'your_youtube_api_v3_key' } ).Auto();
</script>
```
