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
  YTPP( { api: 'your_youtube_api_v3_key' } ).Auto();
</script>
```

## Options available
| Option | Description |
| --- | --- | 
| **api** | Your private YouTube API V3 key<br/>Default: **''** |
| **playlist** | Playlist embed ID<br/>Default: **''** |
| **format*** | The aspect ratio of movies in your playlist<br/>Available: **16by9, 21by9, 2by1**<br/>Default: **'16by9'** |
| **container*** | The HTML element that the player will be placed in<br/>Default: **null** |
| **rounded*** | Adds rounded edges to the player and carousel items<br/>Default: **true** |
| **playnext*** | Automatically play next videos<br/>Default: **true** |
| **autoplay*** | Start playback automatically<br/>Default: **false** |
| **showcontrols*** | Show interface elements like play and next buttons<br/>Default: **false** |
| **showtitles*** | Show videos titles below thumbnails<br/>Default: **false** |
| **showinfo*** | Setting this parameter to FALSE causes the Player to not show information such as the movie title or uploader name before the movie starts.<br/>Default: **false** |
| **showrelated*** | This parameter determines whether the player should show similar movies after the video has finished playing.<br/>Default: **false** |
| **loop*** | After the entire playlist has played, the player will skip back to the first video and start over.<br/>Default: **false** |
| **debug*** | It displays a lot of information. Do not use in production.<br/>Default: **false** |

*optional
