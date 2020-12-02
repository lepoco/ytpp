# YouTube Playlist Player
YouTube Playlist Player

## Usage
**Add a reference to the script and style**
```html
<link href="https://example.com/ytp/css/ytpp.min.css" rel="stylesheet" />
<script src="https://example.com/ytp/js/ytpp.min.js" crossorigin="anonymous"></script>
```

**Place the player wherever you like*
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
